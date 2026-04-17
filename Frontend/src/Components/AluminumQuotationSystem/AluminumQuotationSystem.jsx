import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AluminumQuotationSystem.css';

const API_URL = 'http://localhost:5003/api/alu-quotations';

const AluminumQuotationSystem = () => {
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
    materialType: '',
    color: ''
  });

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const materialOptions = [
    '6061 – Structural Use',
    '6063 – Windows/ Doors',
    '6005A – Heavy Structural',
    '5052 – Roofing / Outdoor',
    '3003 – Panels / Decorative'
  ];

  const colorOptions = [
    'White Color',
    'Black Color',
    'Red Color',
    'Grey Color',
    'Blue Color',
    'Powder Coated',
    'Wood Finish'
  ];

  const getAuthToken = () => localStorage.getItem('token');

  const getCurrentUserEmail = () => {
    try {
      const token = getAuthToken();
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      return decoded.email;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setErrors({ auth: 'Please login to access quotation system' });
    } else {
      loadMyRequests();
    }
  }, []);

  const loadMyRequests = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const currentUserEmail = getCurrentUserEmail();
      console.log('Current user email from token:', currentUserEmail);
      
      const response = await axios.get(`${API_URL}/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const allRequests = response.data.data || [];
        const userRequests = allRequests.filter(req => req.email === currentUserEmail);
        setMyRequests(userRequests);
        console.log('Filtered requests for user:', userRequests.length);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      if (error.response?.status === 401) {
        setErrors({ auth: 'Session expired. Please login again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (statusFilter === 'all') {
      return myRequests;
    }
    return myRequests.filter(r => r?.status === statusFilter);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
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
      return (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf') && file.size <= 5 * 1024 * 1024;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      return (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf') && file.size <= 5 * 1024 * 1024;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
      setErrors({ auth: 'Please login to submit a quotation request' });
      return;
    }

    const validationErrors = {};
    if (!formData.fullName) validationErrors.fullName = 'Full name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.phone) validationErrors.phone = 'Phone is required';
    if (!formData.projectTitle) validationErrors.projectTitle = 'Project title is required';
    if (!formData.projectDescription) validationErrors.projectDescription = 'Project description is required';
    if (!formData.materialType) validationErrors.materialType = 'Material type is required';
    if (!formData.color) validationErrors.color = 'Color is required';
    if (files.length === 0) validationErrors.files = 'At least one file is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName.trim());
    formDataToSend.append('email', formData.email.trim());
    formDataToSend.append('phone', formData.phone.trim());
    formDataToSend.append('projectTitle', formData.projectTitle.trim());
    formDataToSend.append('projectDescription', formData.projectDescription.trim());
    formDataToSend.append('materialType', formData.materialType);
    formDataToSend.append('color', formData.color);
    
    for (let i = 0; i < files.length; i++) {
      formDataToSend.append('files', files[i]);
    }

    try {
      const response = await axios.post(API_URL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          projectTitle: '',
          projectDescription: '',
          materialType: '',
          color: ''
        });
        setFiles([]);
        setSuccessMessage('Quotation request submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 4000);
        await loadMyRequests();
        setActiveTab('my-requests');
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response) {
        setErrors({ submit: error.response.data.message || 'Submission failed' });
      } else if (error.request) {
        setErrors({ submit: 'No response from server. Please check if backend is running.' });
      } else {
        setErrors({ submit: 'Network error. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
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

  const getStatusText = (status) => {
    switch(status) {
      case 'Pending': return 'Pending Review';
      case 'Reviewed': return 'Under Review';
      case 'Quoted': return 'Quote Sent';
      default: return status || 'Pending';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return `LKR ${amount.toLocaleString()}`;
  };

  const pendingCount = myRequests.filter(r => r?.status === 'Pending').length;
  const reviewedCount = myRequests.filter(r => r?.status === 'Reviewed').length;
  const quotedCount = myRequests.filter(r => r?.status === 'Quoted').length;
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

      {errors.auth && (
        <div className="alp-error-message">
          <span className="alp-error-icon">⚠</span>
          {errors.auth}
        </div>
      )}

      {errors.submit && (
        <div className="alp-error-message">
          <span className="alp-error-icon">⚠</span>
          {errors.submit}
        </div>
      )}

      <div className="alp-user-view">
        <div className="alp-tabs">
          <button 
            className={`alp-tab ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => { setActiveTab('request'); setErrors({}); }}
          >
            New Quotation Request
          </button>
          <button 
            className={`alp-tab ${activeTab === 'my-requests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('my-requests'); loadMyRequests(); }}
          >
            My Requests ({myRequests.length})
          </button>
        </div>

        {activeTab === 'request' && (
          <form className="alp-form" onSubmit={handleSubmitRequest}>
            <div className="alp-form-grid">
              <div className="alp-form-group">
                <label className="alp-label">Full Name *</label>
                <input type="text" name="fullName" className={`alp-input ${errors.fullName ? 'alp-input-error' : ''}`} value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" />
                {errors.fullName && <span className="alp-error-text">{errors.fullName}</span>}
              </div>

              <div className="alp-form-group">
                <label className="alp-label">Email *</label>
                <input type="email" name="email" className={`alp-input ${errors.email ? 'alp-input-error' : ''}`} value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                {errors.email && <span className="alp-error-text">{errors.email}</span>}
              </div>

              <div className="alp-form-group">
                <label className="alp-label">Phone * (10 digits)</label>
                <input type="tel" name="phone" className={`alp-input ${errors.phone ? 'alp-input-error' : ''}`} value={formData.phone} onChange={handleInputChange} placeholder="07 ***** ***" />
                {errors.phone && <span className="alp-error-text">{errors.phone}</span>}
              </div>

              <div className="alp-form-group">
                <label className="alp-label">Project Title *</label>
                <input type="text" name="projectTitle" className={`alp-input ${errors.projectTitle ? 'alp-input-error' : ''}`} value={formData.projectTitle} onChange={handleInputChange} placeholder="e.g., Office Building Window Installation" />
                {errors.projectTitle && <span className="alp-error-text">{errors.projectTitle}</span>}
              </div>

              <div className="alp-form-group alp-full-width">
                <label className="alp-label">Project Description *</label>
                <textarea name="projectDescription" className={`alp-textarea ${errors.projectDescription ? 'alp-input-error' : ''}`} rows="4" value={formData.projectDescription} onChange={handleInputChange} placeholder="Describe your project requirements in detail..."></textarea>
                {errors.projectDescription && <span className="alp-error-text">{errors.projectDescription}</span>}
              </div>

              <div className="alp-form-group">
                <label className="alp-label">Material Type *</label>
                <select name="materialType" className={`alp-select ${errors.materialType ? 'alp-input-error' : ''}`} value={formData.materialType} onChange={handleInputChange}>
                  <option value="">Select Material Type</option>
                  {materialOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                </select>
                {errors.materialType && <span className="alp-error-text">{errors.materialType}</span>}
              </div>

              <div className="alp-form-group">
                <label className="alp-label">Color / Finish *</label>
                <select name="color" className={`alp-select ${errors.color ? 'alp-input-error' : ''}`} value={formData.color} onChange={handleInputChange}>
                  <option value="">Select Color</option>
                  {colorOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                </select>
                {errors.color && <span className="alp-error-text">{errors.color}</span>}
              </div>

              <div className="alp-form-group alp-full-width">
                <label className="alp-label">Upload Files * (Images or PDF, max 5MB each)</label>
                <div className={`alp-dropzone ${dragActive ? 'alp-dropzone-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                  <input type="file" id="alp-file-input" className="alp-file-input" multiple accept="image/jpeg,image/jpg,image/png,application/pdf" onChange={handleFileSelect} />
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
            <button type="submit" className="alp-submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Send Quotation Request'}</button>
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
                <button className="alp-empty-btn" onClick={() => setActiveTab('request')}>Create New Request →</button>
              </div>
            ) : (
              <>
                <div className="alp-status-filters">
                  <button className={`alp-status-filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All ({myRequests.length})</button>
                  <button className={`alp-status-filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`} onClick={() => setStatusFilter('Pending')}>Pending ({pendingCount})</button>
                  <button className={`alp-status-filter-btn ${statusFilter === 'Reviewed' ? 'active' : ''}`} onClick={() => setStatusFilter('Reviewed')}>Reviewed ({reviewedCount})</button>
                  <button className={`alp-status-filter-btn ${statusFilter === 'Quoted' ? 'active' : ''}`} onClick={() => setStatusFilter('Quoted')}>Quoted ({quotedCount})</button>
                </div>
                <div className="alp-my-requests-list">
                  {filteredRequests.map(request => (
                    <div key={request._id} className="alp-my-request-card">
                      <div className="alp-my-request-header">
                        <div>
                          <span className="alp-request-id">{request.quotationId}</span>
                          <h3 className="alp-my-request-title">{request.projectTitle}</h3>
                        </div>
                        <span className={getStatusBadgeClass(request.status)}>{getStatusText(request.status)}</span>
                      </div>
                      <div className="alp-my-request-body">
                        <p><strong>Name:</strong> {request.fullName}</p>
                        <p><strong>Email:</strong> {request.email}</p>
                        <p><strong>Material:</strong> {request.materialType}</p>
                        <p><strong>Color:</strong> {request.color}</p>
                        <p><strong>Description:</strong> {request.projectDescription?.substring(0, 100)}...</p>
                        {request.quotedPrice && (
                          <p><strong>Quoted Price:</strong> {formatCurrency(request.quotedPrice)}</p>
                        )}
                        <p><strong>Files:</strong> {request.files?.length || 0} attached</p>
                      </div>
                      <div className="alp-my-request-footer">
                        <span className="alp-my-request-date">Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                        <button className="alp-view-details-btn" onClick={() => handleViewRequest(request)}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showDetailModal && selectedRequest && (
        <div className="alp-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="alp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alp-modal-header">
              <div>
                <span className="alp-modal-id">{selectedRequest.quotationId}</span>
                <h2 className="alp-modal-title">{selectedRequest.projectTitle}</h2>
              </div>
              <button className="alp-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>
            <div className="alp-modal-body">
              <div className="alp-detail-section">
                <h3>Client Information</h3>
                <p><strong>Name:</strong> {selectedRequest.fullName}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              </div>
              <div className="alp-detail-section">
                <h3>Project Details</h3>
                <p><strong>Material:</strong> {selectedRequest.materialType}</p>
                <p><strong>Color:</strong> {selectedRequest.color}</p>
                <p><strong>Description:</strong> {selectedRequest.projectDescription}</p>
              </div>
              {selectedRequest.files && selectedRequest.files.length > 0 && (
                <div className="alp-detail-section">
                  <h3>Attached Files ({selectedRequest.files.length})</h3>
                  <div className="alp-files-list">
                    {selectedRequest.files.map((file, idx) => (
                      <a key={idx} href={`http://localhost:5003${file.url}`} target="_blank" rel="noopener noreferrer" className="alp-file-link">
                        📎 {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {selectedRequest.quotedPrice && (
                <div className="alp-detail-section">
                  <h3>Quotation Response</h3>
                  <p><strong>Price:</strong> {formatCurrency(selectedRequest.quotedPrice)}</p>
                  {selectedRequest.adminNotes && <p><strong>Notes:</strong> {selectedRequest.adminNotes}</p>}
                </div>
              )}
              {selectedRequest.adminFiles && selectedRequest.adminFiles.length > 0 && (
                <div className="alp-detail-section">
                  <h3>Additional Files ({selectedRequest.adminFiles.length})</h3>
                  <div className="alp-files-list">
                    {selectedRequest.adminFiles.map((file, idx) => (
                      <a key={idx} href={`http://localhost:5003${file.url}`} target="_blank" rel="noopener noreferrer" className="alp-file-link">
                        📎 {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="alp-detail-section">
                <h3>Status Timeline</h3>
                <p><strong>Current Status:</strong> <span className={getStatusBadgeClass(selectedRequest.status)}>{getStatusText(selectedRequest.status)}</span></p>
                <p><strong>Submitted:</strong> {new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedRequest.updatedAt).toLocaleString()}</p>
              </div>
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