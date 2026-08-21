import React, { useEffect, useState, useRef } from 'react';
import {
  listPropertyFiles,
  uploadPropertyFile,
  getPropertyFileUrl,
  deletePropertyFile
} from '../lib/supabaseClient';
import './FileSection.css';

const FileSection = ({ propertyId, folder, title, icon }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const loadFiles = async () => {
    setLoading(true);
    const list = await listPropertyFiles(propertyId, folder);
    setFiles(list);
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, folder]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      await uploadPropertyFile(propertyId, folder, file);
      await loadFiles();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpen = async (fileName) => {
    const url = await getPropertyFileUrl(propertyId, folder, fileName);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (fileName) => {
    if (!confirm(`Delete "${cleanName(fileName)}"?`)) return;
    try {
      await deletePropertyFile(propertyId, folder, fileName);
      await loadFiles();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const cleanName = (name) => {
    // strip the timestamp prefix "1234567890_"
    return name.replace(/^\d+_/, '');
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`file-section ${expanded ? 'expanded' : ''}`}>
      <button className="file-section-header" onClick={() => setExpanded(!expanded)}>
        <span className="file-section-title">
          <span className="file-section-icon">{icon}</span>
          {title}
        </span>
        <span className="file-section-meta">
          {files.length} {files.length === 1 ? 'file' : 'files'}
          <span className={`file-chevron ${expanded ? 'open' : ''}`}>▾</span>
        </span>
      </button>

      {expanded && (
        <div className="file-section-body">
          <div className="file-upload-row">
            <label className="file-upload-btn">
              {uploading ? 'Uploading…' : '+ Upload File'}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && <div className="file-error">{error}</div>}

          {loading ? (
            <p className="file-loading">Loading…</p>
          ) : files.length === 0 ? (
            <p className="file-empty">No files yet — upload one above.</p>
          ) : (
            <ul className="file-list">
              {files.map(f => (
                <li key={f.name} className="file-item">
                  <button className="file-name" onClick={() => handleOpen(f.name)} title="Open file">
                    📄 {cleanName(f.name)}
                  </button>
                  <span className="file-size">{formatSize(f.metadata?.size)}</span>
                  <button className="file-delete" onClick={() => handleDelete(f.name)} title="Delete">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FileSection;
