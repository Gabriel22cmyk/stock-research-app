import React, { useState } from 'react';
import { updateProperty } from '../lib/supabaseClient';
import './EditableSection.css';

const EditableSection = ({ propertyId, title, icon, fields, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(fields);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProperty(propertyId, formData);
      onUpdate(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(fields);
    setIsEditing(false);
    setError('');
  };

  if (!isEditing) {
    return (
      <section className="property-section">
        <div className="section-header-with-edit">
          <h2>{title}</h2>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
        </div>
        <div className="section-content">
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className="info-row">
              <span className="info-label">{formatLabel(key)}</span>
              <span className="info-value">{value || '—'}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="property-section editing">
      <h2>{title}</h2>
      <div className="edit-form">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{formatLabel(key)}</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
            />
          </div>
        ))}
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button className="form-btn save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button className="form-btn cancel" onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

const formatLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export default EditableSection;
