import React, { useState, useEffect, useRef } from 'react';
import './Ad3Ditems.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const CATEGORIES = ['windows', 'doors', 'pantry cupboards', 'panlights', 'furniture', 'other'];
const ITEM_TYPES = {
  windows: ['sliding', 'casement', 'fixed', 'awning', 'louvre'],
  doors: ['panel', 'flush', 'pivot', 'bi-fold', 'sliding'],
  'pantry cupboards': ['larder', 'kitchen', 'tall-boy', 'corner'],
  panlights: ['recessed', 'surface', 'pendant', 'track'],
  furniture: ['sofa', 'bed', 'desk', 'wardrobe', 'bookshelf'],
  other: ['custom'],
};

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function Trash2Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

const EMPTY_FORM = {
  name: '', sub: '', cat: 'windows', type: 'sliding',
  colorHex: '#2C3E50', colorLabel: '', desc: '',
  dimensions: '', material: '', finish: '', frameSystem: '',
  polygonCount: '', modelFormat: 'PBR Ready', features: '',
  modelFile: null, thumbnailFile: null,
};

export default function Ad3Ditems() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState({ model: false, thumb: false });
  const modelInputRef = useRef();
  const thumbInputRef = useRef();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/3d-items`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      showToast('Could not load items from server.', 'error');
    } finally {
      setFetchLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: value,
      ...(field === 'cat' ? { type: ITEM_TYPES[value][0] } : {}),
    }));
  };

  const handleFile = (field, file) => {
    if (!file) return;
    setForm(f => ({ ...f, [field]: file }));
  };

  const handleDrop = (field, e) => {
    e.preventDefault();
    setDragActive(d => ({ ...d, [field === 'modelFile' ? 'model' : 'thumb']: false }));
    const file = e.dataTransfer.files[0];
    if (file) handleFile(field, file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.desc.trim()) {
      showToast('Name and description are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });

      const url = editId ? `${API_BASE}/3d-items/${editId}` : `${API_BASE}/3d-items`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Failed to save');

      showToast(editId ? 'Item updated successfully!' : '3D item uploaded successfully!');
      setForm(EMPTY_FORM);
      setEditId(null);
      setActiveTab('manage');
      fetchItems();
    } catch (e) {
      showToast('Failed to save item. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || '',
      sub: item.sub || '',
      cat: item.cat || 'windows',
      type: item.type || 'sliding',
      colorHex: item.colorHex || '#2C3E50',
      colorLabel: item.colorLabel || '',
      desc: item.desc || '',
      dimensions: item.dimensions || '',
      material: item.material || '',
      finish: item.finish || '',
      frameSystem: item.frameSystem || '',
      polygonCount: item.polygonCount || '',
      modelFormat: item.modelFormat || 'PBR Ready',
      features: Array.isArray(item.features) ? item.features.join('\n') : (item.features || ''),
      modelFile: null,
      thumbnailFile: null,
    });
    setEditId(item._id);
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/3d-items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Item deleted.');
      setDeleteConfirm(null);
      fetchItems();
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const categoryCount = [...new Set(items.map(i => i.cat))].length;

  return (
    <div className="ad3d-layout">
      <main className="ad3d-main">
        {toast && (
          <div className={`ad3d-toast ad3d-toast--${toast.type}`}>
            <span className="ad3d-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        )}

        {deleteConfirm && (
          <div className="ad3d-modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="ad3d-modal" onClick={e => e.stopPropagation()}>
              <div className="ad3d-modal-icon">⚠</div>
              <h3 className="ad3d-modal-title">Delete this 3D item?</h3>
              <p className="ad3d-modal-sub">This action cannot be undone. The model file and all associated data will be permanently removed.</p>
              <div className="ad3d-modal-actions">
                <button className="ad3d-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="ad3d-modal-confirm" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="ad3d-header">
          <div className="ad3d-header-left">
            <h1 className="ad3d-page-title">360° Model Studio</h1>
          </div>
        </div>

        <div className="ad3d-tabs-container">
          <div className="ad3d-tabs">
            <button className={`ad3d-tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
              {editId ? '✎ Edit Item' : '+ Upload New Model'}
            </button>
            <button className={`ad3d-tab ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
              ☰ Manage Library ({items.length})
            </button>
          </div>
        </div>

        {activeTab === 'upload' && (
          <form className="ad3d-form" onSubmit={handleSubmit}>
            {editId && (
              <div className="ad3d-edit-banner">
                <span>✎ Editing existing item</span>
                <button type="button" className="ad3d-edit-cancel" onClick={cancelEdit}>Cancel Edit</button>
              </div>
            )}

            <div className="ad3d-form-grid">
              <div className="ad3d-form-left">
                <div className="ad3d-field-group">
                  <label className="ad3d-label">3D Model File <span className="ad3d-required">*</span></label>
                  <div
                    className={`ad3d-dropzone ${dragActive.model ? 'drag' : ''} ${form.modelFile ? 'has-file' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragActive(d => ({ ...d, model: true })); }}
                    onDragLeave={() => setDragActive(d => ({ ...d, model: false }))}
                    onDrop={e => handleDrop('modelFile', e)}
                    onClick={() => modelInputRef.current?.click()}
                  >
                    <input
                      ref={modelInputRef}
                      type="file"
                      accept=".glb,.gltf,.obj,.fbx,.stl,.3ds"
                      style={{ display: 'none' }}
                      onChange={e => handleFile('modelFile', e.target.files[0])}
                    />
                    {form.modelFile ? (
                      <div className="ad3d-file-selected">
                        <div className="ad3d-file-icon">◼</div>
                        <div className="ad3d-file-info">
                          <span className="ad3d-file-name">{form.modelFile.name}</span>
                          <span className="ad3d-file-size">{(form.modelFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <button type="button" className="ad3d-file-remove" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, modelFile: null })); }}>✕</button>
                      </div>
                    ) : (
                      <div className="ad3d-dropzone-inner">
                        <div className="ad3d-dropzone-icon"><UploadIcon /></div>
                        <p className="ad3d-dropzone-title">Drop 3D model here</p>
                        <p className="ad3d-dropzone-sub">GLB · GLTF · OBJ · FBX · STL</p>
                        <span className="ad3d-dropzone-btn">Browse Files</span>
                      </div>
                    )}
                  </div>
                  <p className="ad3d-hint">Supported: GLB (recommended), GLTF, OBJ, FBX, STL. Max 100MB.</p>
                </div>

                <div className="ad3d-field-group">
                  <label className="ad3d-label">Thumbnail Image</label>
                  <div
                    className={`ad3d-dropzone ad3d-dropzone--thumb ${dragActive.thumb ? 'drag' : ''} ${form.thumbnailFile ? 'has-file' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragActive(d => ({ ...d, thumb: true })); }}
                    onDragLeave={() => setDragActive(d => ({ ...d, thumb: false }))}
                    onDrop={e => handleDrop('thumbnailFile', e)}
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={e => handleFile('thumbnailFile', e.target.files[0])}
                    />
                    {form.thumbnailFile ? (
                      <div className="ad3d-thumb-preview">
                        <img src={URL.createObjectURL(form.thumbnailFile)} alt="preview" className="ad3d-thumb-img" />
                        <button type="button" className="ad3d-file-remove ad3d-file-remove--thumb" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, thumbnailFile: null })); }}>✕</button>
                      </div>
                    ) : (
                      <div className="ad3d-dropzone-inner">
                        <div className="ad3d-dropzone-icon" style={{ fontSize: 28 }}>🖼</div>
                        <p className="ad3d-dropzone-title">Drop thumbnail here</p>
                        <p className="ad3d-dropzone-sub">PNG · JPG · WebP</p>
                        <span className="ad3d-dropzone-btn">Browse Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ad3d-field-group">
                  <label className="ad3d-label">Model Color</label>
                  <div className="ad3d-color-row">
                    <div className="ad3d-color-swatch" style={{ background: form.colorHex }} />
                    <input
                      type="color"
                      className="ad3d-color-picker"
                      value={form.colorHex}
                      onChange={e => handleChange('colorHex', e.target.value)}
                    />
                    <input
                      type="text"
                      className="ad3d-input ad3d-input--sm"
                      value={form.colorLabel}
                      placeholder="Color label (e.g. Arctic White)"
                      onChange={e => handleChange('colorLabel', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="ad3d-form-right">
                <div className="ad3d-form-row-2">
                  <div className="ad3d-field-group">
                    <label className="ad3d-label">Item Name <span className="ad3d-required">*</span></label>
                    <input
                      type="text"
                      className="ad3d-input"
                      placeholder="e.g. Arctic White Window"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                  </div>
                  <div className="ad3d-field-group">
                    <label className="ad3d-label">Subtitle / Series</label>
                    <input
                      type="text"
                      className="ad3d-input"
                      placeholder="e.g. Contemporary Casement Series"
                      value={form.sub}
                      onChange={e => handleChange('sub', e.target.value)}
                    />
                  </div>
                </div>

                <div className="ad3d-form-row-2">
                  <div className="ad3d-field-group">
                    <label className="ad3d-label">Category <span className="ad3d-required">*</span></label>
                    <select className="ad3d-select" value={form.cat} onChange={e => handleChange('cat', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="ad3d-field-group">
                    <label className="ad3d-label">Type</label>
                    <select className="ad3d-select" value={form.type} onChange={e => handleChange('type', e.target.value)}>
                      {(ITEM_TYPES[form.cat] || ['custom']).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div className="ad3d-field-group">
                  <label className="ad3d-label">Description <span className="ad3d-required">*</span></label>
                  <textarea
                    className="ad3d-textarea"
                    rows={4}
                    placeholder="Describe the product — materials, use case, finish quality, key design elements..."
                    value={form.desc}
                    onChange={e => handleChange('desc', e.target.value)}
                  />
                </div>

                <div className="ad3d-spec-section">
                  <div className="ad3d-spec-head">Specifications</div>
                  <div className="ad3d-form-row-2">
                    <div className="ad3d-field-group">
                      <label className="ad3d-label">Dimensions (mm)</label>
                      <input
                        type="text"
                        className="ad3d-input"
                        placeholder="e.g. 1800×1500×100"
                        value={form.dimensions}
                        onChange={e => handleChange('dimensions', e.target.value)}
                      />
                    </div>
                    <div className="ad3d-field-group">
                      <label className="ad3d-label">Frame / Material</label>
                      <input
                        type="text"
                        className="ad3d-input"
                        placeholder="e.g. Thermally Broken Aluminium"
                        value={form.material}
                        onChange={e => handleChange('material', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="ad3d-form-row-3">
                    <div className="ad3d-field-group">
                      <label className="ad3d-label">Finish</label>
                      <input
                        type="text"
                        className="ad3d-input"
                        placeholder="e.g. Powder Coat"
                        value={form.finish}
                        onChange={e => handleChange('finish', e.target.value)}
                      />
                    </div>
                    <div className="ad3d-field-group">
                      <label className="ad3d-label">Polygon Count</label>
                      <input
                        type="text"
                        className="ad3d-input"
                        placeholder="e.g. ~2,800 tris"
                        value={form.polygonCount}
                        onChange={e => handleChange('polygonCount', e.target.value)}
                      />
                    </div>
                    <div className="ad3d-field-group">
                      <label className="ad3d-label">Model Format</label>
                      <input
                        type="text"
                        className="ad3d-input"
                        placeholder="e.g. PBR Ready"
                        value={form.modelFormat}
                        onChange={e => handleChange('modelFormat', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ad3d-field-group">
                  <label className="ad3d-label">Key Features <span className="ad3d-hint-inline">(one per line)</span></label>
                  <textarea
                    className="ad3d-textarea"
                    rows={3}
                    placeholder={"Full PBR materials with anisotropic metalness\nPhysically correct environment map reflections\nDetailed hardware components"}
                    value={form.features}
                    onChange={e => handleChange('features', e.target.value)}
                  />
                </div>

                <div className="ad3d-form-actions">
                  {editId && <button type="button" className="ad3d-btn-cancel" onClick={cancelEdit}>Cancel</button>}
                  <button type="submit" className="ad3d-btn-submit" disabled={loading}>
                    {loading
                      ? <><span className="ad3d-btn-spinner" />Saving...</>
                      : editId ? '✓ Update Item' : '↑ Upload 3D Item'
                    }
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'manage' && (
          <div className="ad3d-manage">
            {fetchLoading ? (
              <div className="ad3d-loading">
                <div className="ad3d-loading-spinner" />
                <span>Loading models...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="ad3d-empty">
                <div className="ad3d-empty-icon"><CubeIcon /></div>
                <p className="ad3d-empty-title">No 3D models yet</p>
                <p className="ad3d-empty-sub">Upload your first model using the Upload tab above.</p>
                <button className="ad3d-btn-submit" style={{ marginTop: 16 }} onClick={() => setActiveTab('upload')}>+ Upload First Model</button>
              </div>
            ) : (
              <div className="ad3d-table-wrap">
                <table className="ad3d-table">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Color</th>
                      <th>File</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div className="ad3d-table-thumb">
                            {item.thumbnailUrl
                              ? <img src={`${API_BASE.replace('/api', '')}${item.thumbnailUrl}`} alt={item.name} className="ad3d-table-img" />
                              : <div className="ad3d-table-no-thumb"><CubeIcon /></div>
                            }
                          </div>
                        </td>
                        <td>
                          <div className="ad3d-table-name">{item.name}</div>
                          <div className="ad3d-table-sub">{item.sub}</div>
                        </td>
                        <td><span className="ad3d-cat-chip">{item.cat}</span></td>
                        <td className="ad3d-table-type">{item.type}</td>
                        <td>
                          <div className="ad3d-table-color">
                            <div className="ad3d-color-dot" style={{ background: item.colorHex || '#888' }} />
                            <span>{item.colorLabel || '—'}</span>
                          </div>
                        </td>
                        <td>
                          {item.modelUrl
                            ? <span className="ad3d-file-chip">✓ Uploaded</span>
                            : <span className="ad3d-file-chip ad3d-file-chip--missing">✕ Missing</span>
                          }
                        </td>
                        <td>
                          <div className="ad3d-table-actions">
                            <button className="ad3d-tbl-btn ad3d-tbl-btn--edit" onClick={() => handleEdit(item)} title="Edit">
                              <EditIcon />
                            </button>
                            <button className="ad3d-tbl-btn ad3d-tbl-btn--view" title="Preview">
                              <EyeIcon />
                            </button>
                            <button className="ad3d-tbl-btn ad3d-tbl-btn--del" onClick={() => setDeleteConfirm(item._id)} title="Delete">
                              <Trash2Icon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}