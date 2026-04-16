import React, { useState, useEffect } from 'react';
import './AluminumQuotationSystem.css';

const AluminumQuotationSystem = () => {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('request');
  const [statusFilter, setStatusFilter] = useState('all');
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectTitle: '',
    projectDescription: '',
    materialType: 'Aluminum 6063',
    color: 'Mill Finish'
  });

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const materialOptions = [
    'Select Material Type',
    '6061 – Structural Use',
    '6063 – Windows/ Doors',
    '6005A – Heavy Structural',
    '5052 – Roofing / Outdoor',
    '3003 – Panels / Decorative'
  ];

  const colorOptions = [
    'Select Color',
    'White Color',
    'Black Color',
    'Red Color',
    'Grey Color',
    'Blue Color',
    'Powder Coated',
    'Wood Finish'
  ];

  useEffect(() => {
    loadMyRequests();
  }, []);

  const loadMyRequests = () => {
    setLoading(true);
    const stored = localStorage.getItem('aluminum_quotations_user_V2');
    if (stored) {
      const allRequests = JSON.parse(stored);
      const userEmail = localStorage.getItem('aluminum_user_email_V2');
      if (userEmail) {
        setMyRequests(allRequests.filter(r => r.email === userEmail));
      } else {
        setMyRequests([]);
      }
    } else {
      setMyRequests([]);
    }
    setLoading(false);
  };

  const getFilteredRequests = () => {
    if (statusFilter === 'all') {
      return myRequests;
    }
    return myRequests.filter(r => r.status === statusFilter);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validateFormFields = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = 'Full name must be less than 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Project title is required';
    } else if (formData.projectTitle.trim().length < 3) {
      newErrors.projectTitle = 'Project title must be at least 3 characters';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Description must be at least 10 characters';
    } else if (formData.projectDescription.trim().length > 2000) {
      newErrors.projectDescription = 'Description must be less than 2000 characters';
    }

    if (files.length === 0) {
      newErrors.files = 'At least one file attachment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    setFiles(prev => [...prev, ...validFiles]);
    if (errors.files && validFiles.length > 0) {
      setErrors({ ...errors, files: '' });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    setFiles(prev => [...prev, ...validFiles]);
    if (errors.files && validFiles.length > 0) {
      setErrors({ ...errors, files: '' });
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!validateFormFields()) {
      return;
    }

    setLoading(true);
    const filePreviews = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      files: filePreviews,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      quotedPrice: null,
      adminNotes: null,
      adminFiles: []
    };

    const stored = localStorage.getItem('aluminum_quotations_user_V2');
    let allRequests = stored ? JSON.parse(stored) : [];
    allRequests.unshift(newRequest);
    localStorage.setItem('aluminum_quotations_user_V2', JSON.stringify(allRequests));
    localStorage.setItem('aluminum_user_email_V2', formData.email);

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      projectTitle: '',
      projectDescription: '',
      materialType: 'Aluminum 6063',
      color: 'Mill Finish'
    });
    setFiles([]);
    setErrors({});
    setSuccessMessage('Quotation request submitted successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
    setLoading(false);
    loadMyRequests();
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'alp-status-badge-pending';
      case 'Reviewed': return 'alp-status-badge-reviewed';
      case 'Quoted': return 'alp-status-badge-quoted';
      default: return 'alp-status-badge-pending';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return `LKR ${amount.toLocaleString()}`;
  };

  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
  const reviewedCount = myRequests.filter(r => r.status === 'Reviewed').length;
  const quotedCount = myRequests.filter(r => r.status === 'Quoted').length;
  const filteredRequests = getFilteredRequests();

  return (
    <div className="alp-container">
      <div className="alp-header">
        <div className="alp-header-content">
          <h1 className="alp-title">Aluminum Quotation System</h1>
          <p className="alp-subtitle">Premium Aluminum Solutions | Custom Project Quotations</p>
        </div>
      </div>

      {successMessage && (
        <div className="alp-success-message">
          <span className="alp-success-icon">✓</span>
          {successMessage}
        </div>
      )}

      {view === 'landing' && (
        <div className="alp-user-view">
          <div className="alp-tabs">
            <button 
              className={`alp-tab ${activeTab === 'request' ? 'active' : ''}`}
              onClick={() => setActiveTab('request')}
            >
              New Quotation Request
            </button>
            <button 
              className={`alp-tab ${activeTab === 'my-requests' ? 'active' : ''}`}
              onClick={() => { setActiveTab('my-requests'); loadMyRequests(); }}
            >
              My Requests
            </button>
          </div>

          {activeTab === 'request' && (
            <form className="alp-form" onSubmit={handleSubmitRequest}>
              <div className="alp-form-grid">
                <div className="alp-form-group">
                  <label className="alp-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className={`alp-input ${errors.fullName ? 'alp-input-error' : ''}`}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <span className="alp-error-text">{errors.fullName}</span>}
                </div>

                <div className="alp-form-group">
                  <label className="alp-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className={`alp-input ${errors.email ? 'alp-input-error' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <span className="alp-error-text">{errors.email}</span>}
                </div>

                <div className="alp-form-group">
                  <label className="alp-label">Phone * (10 digits)</label>
                  <input
                    type="tel"
                    name="phone"
                    className={`alp-input ${errors.phone ? 'alp-input-error' : ''}`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="071 **** ***"
                  />
                  {errors.phone && <span className="alp-error-text">{errors.phone}</span>}
                </div>

                <div className="alp-form-group">
                  <label className="alp-label">Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    className={`alp-input ${errors.projectTitle ? 'alp-input-error' : ''}`}
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                  />
                  {errors.projectTitle && <span className="alp-error-text">{errors.projectTitle}</span>}
                </div>

                <div className="alp-form-group alp-full-width">
                  <label className="alp-label">Project Description *</label>
                  <textarea
                    name="projectDescription"
                    className={`alp-textarea ${errors.projectDescription ? 'alp-input-error' : ''}`}
                    rows="4"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.projectDescription && <span className="alp-error-text">{errors.projectDescription}</span>}
                </div>

                <div className="alp-form-group">
                  <label className="alp-label">Material Type</label>
                  <select
                    name="materialType"
                    className="alp-select"
                    value={formData.materialType}
                    onChange={handleInputChange}
                  >
                    {materialOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="alp-form-group">
                  <label className="alp-label">Color / Finish *</label>
                  <select
                    name="color"
                    className="alp-select"
                    value={formData.color}
                    onChange={handleInputChange}
                  >
                    {colorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="alp-hint-text">Select desired color or finish for your aluminum profiles</span>
                </div>

                <div className="alp-form-group alp-full-width">
                  <label className="alp-label">Upload Files * (Images or PDF, max 5MB each)</label>
                  <div 
                    className={`alp-dropzone ${dragActive ? 'alp-dropzone-active' : ''} ${errors.files ? 'alp-dropzone-error' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="alp-file-input"
                      className="alp-file-input"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="alp-file-input" className="alp-dropzone-label">
                      <div className="alp-dropzone-icon">📁</div>
                      <p>Drag & drop files here or click to browse</p>
                      <span className="alp-dropzone-hint">Supports JPG, PNG, PDF (Max 5MB per file)</span>
                    </label>
                  </div>
                  {errors.files && <span className="alp-error-text">{errors.files}</span>}

                  {files.length > 0 && (
                    <div className="alp-file-list">
                      {files.map((file, index) => (
                        <div key={index} className="alp-file-item">
                          {file.type.startsWith('image/') ? (
                            <div className="alp-file-preview">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="alp-preview-img" />
                            </div>
                          ) : (
                            <div className="alp-file-preview-pdf">
                              <span className="alp-pdf-icon">📄</span>
                            </div>
                          )}
                          <div className="alp-file-info">
                            <span className="alp-file-name">{file.name}</span>
                            <span className="alp-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <button type="button" className="alp-file-remove" onClick={() => removeFile(index)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="alp-submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Send Quotation Request'}
              </button>
            </form>
          )}

          {activeTab === 'my-requests' && (
            <div className="alp-my-requests">
              {loading ? (
                <div className="alp-loading">Loading your requests...</div>
              ) : myRequests.length === 0 ? (
                <div className="alp-empty-state">
                  <div className="alp-empty-icon">📋</div>
                  <p>You haven't submitted any quotation requests yet</p>
                  <button className="alp-empty-btn" onClick={() => setActiveTab('request')}>
                    Create New Request →
                  </button>
                </div>
              ) : (
                <>
                  <div className="alp-status-filters">
                    <button 
                      className={`alp-status-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All ({myRequests.length})
                    </button>
                    <button 
                      className={`alp-status-filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('Pending')}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button 
                      className={`alp-status-filter-btn ${statusFilter === 'Reviewed' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('Reviewed')}
                    >
                      Reviewed ({reviewedCount})
                    </button>
                    <button 
                      className={`alp-status-filter-btn ${statusFilter === 'Quoted' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('Quoted')}
                    >
                      Quoted ({quotedCount})
                    </button>
                  </div>

                  {filteredRequests.length === 0 ? (
                    <div className="alp-empty-state">
                      <div className="alp-empty-icon">🔍</div>
                      <p>No {statusFilter !== 'all' ? statusFilter.toLowerCase() : ''} requests found</p>
                      <button className="alp-empty-btn" onClick={() => setStatusFilter('all')}>
                        View All Requests →
                      </button>
                    </div>
                  ) : (
                    <div className="alp-my-requests-list">
                      {filteredRequests.map(request => (
                        <div key={request.id} className="alp-my-request-card">
                          <div className="alp-my-request-header">
                            <h3 className="alp-my-request-title">{request.projectTitle}</h3>
                            <span className={getStatusBadgeClass(request.status)}>{request.status}</span>
                          </div>
                          <div className="alp-my-request-body">
                            <p className="alp-my-request-material"><strong>Material:</strong> {request.materialType}</p>
                            <p className="alp-my-request-color"><strong>Color/Finish:</strong> {request.color}</p>
                            <p className="alp-my-request-desc"><strong>Description:</strong> {request.projectDescription.substring(0, 100)}...</p>
                            {request.quotedPrice && (
                              <div className="alp-quoted-price">
                                <strong>Quoted Price:</strong> {formatCurrency(request.quotedPrice)}
                              </div>
                            )}
                            {request.adminNotes && (
                              <div className="alp-quoted-notes">
                                <strong>Admin Notes:</strong> {request.adminNotes}
                              </div>
                            )}
                            {request.adminFiles && request.adminFiles.length > 0 && (
                              <div className="alp-admin-files-info">
                                <strong>Admin Shared Files:</strong> {request.adminFiles.length} file(s)
                              </div>
                            )}
                            <div className="alp-my-request-files">
                              <strong>Attachments:</strong> {request.files.length} file(s)
                            </div>
                          </div>
                          <div className="alp-my-request-footer">
                            <span className="alp-my-request-date">Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                            <button className="alp-view-details-btn" onClick={() => handleViewRequest(request)}>View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {showDetailModal && selectedRequest && (
        <div className="alp-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="alp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alp-modal-header">
              <h2 className="alp-modal-title">{selectedRequest.projectTitle}</h2>
              <button className="alp-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            <div className="alp-modal-body">
              <div className="alp-detail-section">
                <h3 className="alp-detail-subtitle">Client Information</h3>
                <div className="alp-detail-grid">
                  <p><strong>Name:</strong> {selectedRequest.fullName}</p>
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                </div>
              </div>

              <div className="alp-detail-section">
                <h3 className="alp-detail-subtitle">Project Details</h3>
                <p><strong>Material Type:</strong> {selectedRequest.materialType}</p>
                <p><strong>Color/Finish:</strong> {selectedRequest.color}</p>
                <p><strong>Description:</strong></p>
                <p className="alp-detail-description">{selectedRequest.projectDescription}</p>
              </div>

              <div className="alp-detail-section">
                <h3 className="alp-detail-subtitle">Attached Files</h3>
                <div className="alp-detail-files">
                  {selectedRequest.files.map((file, idx) => (
                    <div key={idx} className="alp-detail-file">
                      {file.type && file.type.startsWith('image/') ? (
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="alp-detail-file-img"
                          onClick={() => window.open(file.preview, '_blank')}
                        />
                      ) : (
                        <div className="alp-detail-file-pdf" onClick={() => window.open(file.preview, '_blank')}>
                          <span className="alp-detail-pdf-icon">📄</span>
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedRequest.adminFiles && selectedRequest.adminFiles.length > 0 && (
                <div className="alp-detail-section">
                  <h3 className="alp-detail-subtitle">Admin Shared Files</h3>
                  <div className="alp-detail-files">
                    {selectedRequest.adminFiles.map((file, idx) => (
                      <div key={idx} className="alp-detail-file">
                        {file.type && file.type.startsWith('image/') ? (
                          <img 
                            src={file.preview} 
                            alt={file.name} 
                            className="alp-detail-file-img"
                            onClick={() => window.open(file.preview, '_blank')}
                          />
                        ) : (
                          <div className="alp-detail-file-pdf" onClick={() => window.open(file.preview, '_blank')}>
                            <span className="alp-detail-pdf-icon">📎</span>
                            <span>{file.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.quotedPrice && (
                <div className="alp-detail-section alp-quote-received">
                  <h3 className="alp-detail-subtitle">Quotation Received</h3>
                  <div className="alp-quote-amount">
                    Total Price: <span>{formatCurrency(selectedRequest.quotedPrice)}</span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="alp-quote-message">
                      <strong>Message from Admin:</strong>
                      <p>{selectedRequest.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="alp-modal-footer">
              <button className="alp-modal-close-btn" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AluminumQuotationSystem;