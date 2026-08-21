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
  const [viewer, setViewer] = useState(null); // { url, name, kind }
  const [viewerLoading, setViewerLoading] = useState(false);
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

  const fileKind = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'svg'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'other';
  };

  const handleOpen = async (fileName) => {
    setViewerLoading(true);
    setError('');
    const url = await getPropertyFileUrl(propertyId, folder, fileName);
    setViewerLoading(false);
    if (url) {
      setViewer({ url, name: cleanName(fileName), kind: fileKind(fileName) });
    } else {
      setError('Could not open file. Try again.');
    }
  };

  const closeViewer = () => setViewer(null);

  const handleDelete = async (fileName) => {
    if (!confirm(`Delete "${cleanName(fileName)}"?`)) return;
    try {
      await deletePropertyFile(propertyId, folder, fileName);
      await loadFiles();
    } catch (err) {
      setError('Delete needs one more permission in Supabase — ask Cayde.');
    }
  };

  const cleanName = (name) => name.replace(/^\d+_/, '');

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
                  <button
                    className="file-name"
                    onClick={() => handleOpen(f.name)}
                    title="View file"
                    disabled={viewerLoading}
                  >
                    {fileKind(f.name) === 'image' ? '🖼️' : fileKind(f.name) === 'pdf' ? '📕' : '📄'} {cleanName(f.name)}
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

      {viewer && (
        <div className="file-viewer-overlay" onClick={closeViewer}>
          <div className="file-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="file-viewer-header">
              <span className="file-viewer-name">{viewer.name}</span>
              <div className="file-viewer-actions">
                <a
                  className="file-viewer-download"
                  href={viewer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <button className="file-viewer-close" onClick={closeViewer}>✕</button>
              </div>
            </div>
            <div className="file-viewer-body">
              {viewer.kind === 'image' && (
                <img src={viewer.url} alt={viewer.name} className="file-viewer-image" />
              )}
              {viewer.kind === 'pdf' && (
                <iframe title={viewer.name} src={viewer.url} className="file-viewer-frame" />
              )}
              {viewer.kind === 'other' && (
                <div className="file-viewer-other">
                  <p>This file type can't be previewed here.</p>
                  <a
                    className="file-upload-btn"
                    href={viewer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download / Open
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSection;
