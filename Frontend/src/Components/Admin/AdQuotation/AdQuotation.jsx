import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdQuotation.css';

const API_URL = 'http://localhost:5003/api/alu-quotations';

const AdQuotation = () => {
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [adminFiles, setAdminFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, quoted: 0, totalRevenue: 0 });
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    loadQuotationRequests();
    loadStats();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [quotationRequests, statusFilter, searchQuery, sortBy]);

  const loadQuotationRequests = async () => {
    setLoading(true);
    const token = getAuthToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setQuotationRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data || { total: 0, pending: 0, reviewed: 0, quoted: 0, totalRevenue: 0 });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...quotationRequests];
    
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => 
        (request.projectTitle || '').toLowerCase().includes(query) ||
        (request.fullName || '').toLowerCase().includes(query) ||
        (request.email || '').toLowerCase().includes(query) ||
        (request.materialType || '').toLowerCase().includes(query) ||
        (request.quotationId || '').toLowerCase().includes(query)
      );
    }
    
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
        break;
      case 'price-high':
        result.sort((a, b) => (b.quotedPrice || 0) - (a.quotedPrice || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.quotedPrice || 0) - (b.quotedPrice || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }
    
    setFilteredRequests(result);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setQuotePrice(request.quotedPrice || '');
    setQuoteNotes(request.adminNotes || '');
    setAdminFiles([]);
    setShowDetailModal(true);
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
    setAdminFiles(prev => [...prev, ...validFiles]);
  };

  const handleAdminFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    setAdminFiles(prev => [...prev, ...validFiles]);
  };

  const removeAdminFile = (index) => {
    setAdminFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendQuote = async () => {
    if (!quotePrice) {
      alert('Please enter a price for the quotation');
      return;
    }

    const priceNum = parseFloat(quotePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid price');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert('Please login as admin');
      return;
    }

    const formData = new FormData();
    formData.append('status', 'Quoted');
    formData.append('quotedPrice', priceNum);
    formData.append('adminNotes', quoteNotes);
    
    adminFiles.forEach(file => {
      formData.append('adminFiles', file);
    });

    try {
      const response = await axios.put(`${API_URL}/${selectedRequest._id}/status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccessMessage(`Quote sent successfully with ${adminFiles.length} file(s)!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        loadQuotationRequests();
        loadStats();
        setTimeout(() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
          setAdminFiles([]);
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending quote:', error);
      alert(error.response?.data?.message || 'Failed to send quote');
    }
  };

  const updateRequestStatus = async (newStatus) => {
    const token = getAuthToken();
    if (!token) return;

    const formData = new FormData();
    formData.append('status', newStatus);

    try {
      const response = await axios.put(`${API_URL}/${selectedRequest._id}/status`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessMessage(`Request marked as ${newStatus}`);
        setTimeout(() => setSuccessMessage(''), 2000);
        loadQuotationRequests();
        loadStats();
        setSelectedRequest(response.data.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'ADQ-status-badge-pending';
      case 'Reviewed': return 'ADQ-status-badge-reviewed';
      case 'Quoted': return 'ADQ-status-badge-quoted';
      default: return 'ADQ-status-badge-pending';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not quoted';
    return `LKR ${amount.toLocaleString()}`;
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="ADQ-container">
      <div className="ADQ-header">
        <div className="ADQ-header-content">
          <h1 className="ADQ-title">Manage Aluminum Quotation Requests</h1>
          <p className="ADQ-subtitle">Review, update status, and send professional quotations to clients</p>
        </div>
      </div>

      {successMessage && (
        <div className="ADQ-success-message">
          <span className="ADQ-success-icon">✓</span>
          {successMessage}
        </div>
      )}

      <div className="ADQ-main-content">
        <div className="ADQ-tabs">
          <button 
            className={`ADQ-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Quotation Requests ({quotationRequests.length})
          </button>
          <button 
            className={`ADQ-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stats'); loadStats(); }}
          >
            Statistics & Analytics
          </button>
        </div>

        {activeTab === 'requests' && (
          <div className="ADQ-card">
            <div className="ADQ-card-header">
              <h2 className="ADQ-card-title">All Quotation Requests</h2>
              <p className="ADQ-card-subtitle">Manage and review all customer quotation requests</p>
            </div>
            
            <div className="ADQ-filter-bar">
              <div className="ADQ-search-wrapper">
                <span className="ADQ-search-icon">🔍</span>
                <input 
                  type="text" 
                  className="ADQ-search-input" 
                  placeholder="Search by project, client, email, material, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="ADQ-clear-search" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              
              <div className="ADQ-filter-controls">
                <div className="ADQ-filter-group">
                  <label className="ADQ-filter-label">Status:</label>
                  <select 
                    className="ADQ-filter-select" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Requests</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Quoted">Quoted</option>
                  </select>
                </div>
                
                <div className="ADQ-filter-group">
                  <label className="ADQ-filter-label">Sort by:</label>
                  <select 
                    className="ADQ-filter-select" 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
                
                <button className="ADQ-clear-filters-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="ADQ-results-info">
              <span>Showing {filteredRequests.length} of {quotationRequests.length} requests</span>
              {statusFilter !== 'all' && <span className="ADQ-active-filter">Status: {statusFilter}</span>}
              {searchQuery && <span className="ADQ-active-filter">Search: "{searchQuery}"</span>}
            </div>
            
            <div className="ADQ-card-body">
              {loading ? (
                <div className="ADQ-loading">Loading requests...</div>
              ) : filteredRequests.length === 0 ? (
                <div className="ADQ-empty-state">
                  <div className="ADQ-empty-icon">🔍</div>
                  <p>No requests match your filters</p>
                  <button className="ADQ-view-btn" onClick={clearFilters}>Clear All Filters</button>
                </div>
              ) : (
                <div className="ADQ-requests-grid">
                  {filteredRequests.map(request => (
                    <div key={request._id} className="ADQ-request-card" onClick={() => handleViewRequest(request)}>
                      <div className="ADQ-request-card-header">
                        <div>
                          <span className="ADQ-request-id">{request.quotationId}</span>
                          <h3 className="ADQ-request-title">{request.projectTitle || 'Untitled Project'}</h3>
                        </div>
                        <span className={getStatusBadgeClass(request.status)}>{request.status || 'Pending'}</span>
                      </div>
                      <div className="ADQ-request-card-body">
                        <p><strong>Client:</strong> {request.fullName || 'N/A'}</p>
                        <p><strong>Email:</strong> {request.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {request.phone || 'N/A'}</p>
                        <p><strong>Material:</strong> {request.materialType || 'N/A'}</p>
                        <p><strong>Color:</strong> {request.color || 'N/A'}</p>
                        <p><strong>Files:</strong> {request.files?.length || 0} attached</p>
                        {request.quotedPrice && (
                          <p><strong>Quoted:</strong> {formatCurrency(request.quotedPrice)}</p>
                        )}
                      </div>
                      <div className="ADQ-request-card-footer">
                        <span className="ADQ-request-date">
                          Submitted: {request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : 'Date unknown'}
                        </span>
                        <button className="ADQ-view-btn">View & Respond →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="ADQ-card">
            <div className="ADQ-card-header">
              <h2 className="ADQ-card-title">Statistics Overview</h2>
              <p className="ADQ-card-subtitle">View your quotation performance metrics</p>
            </div>
            <div className="ADQ-card-body">
              <div className="ADQ-stats-grid">
                <div className="ADQ-stat-card">
                  <div className="ADQ-stat-value">{stats.total || 0}</div>
                  <div className="ADQ-stat-label">Total Requests</div>
                </div>
                <div className="ADQ-stat-card">
                  <div className="ADQ-stat-value">{stats.pending || 0}</div>
                  <div className="ADQ-stat-label">Pending Review</div>
                </div>
                <div className="ADQ-stat-card">
                  <div className="ADQ-stat-value">{stats.reviewed || 0}</div>
                  <div className="ADQ-stat-label">Reviewed</div>
                </div>
                <div className="ADQ-stat-card">
                  <div className="ADQ-stat-value">{stats.quoted || 0}</div>
                  <div className="ADQ-stat-label">Quotations Sent</div>
                </div>
                <div className="ADQ-stat-card">
                  <div className="ADQ-stat-value">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="ADQ-stat-label">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && selectedRequest && (
        <div className="ADQ-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="ADQ-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ADQ-modal-header">
              <div>
                <span className="ADQ-modal-id">{selectedRequest.quotationId}</span>
                <h2 className="ADQ-modal-title">{selectedRequest.projectTitle || 'Project Details'}</h2>
              </div>
              <button className="ADQ-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            <div className="ADQ-modal-body">
              <div className="ADQ-detail-section">
                <h3 className="ADQ-detail-subtitle">Client Information</h3>
                <div className="ADQ-detail-grid">
                  <p><strong>Full Name:</strong> {selectedRequest.fullName || 'N/A'}</p>
                  <p><strong>Email Address:</strong> {selectedRequest.email || 'N/A'}</p>
                  <p><strong>Phone Number:</strong> {selectedRequest.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="ADQ-detail-section">
                <h3 className="ADQ-detail-subtitle">Project Details</h3>
                <p><strong>Material Type:</strong> {selectedRequest.materialType || 'N/A'}</p>
                <p><strong>Color / Finish:</strong> {selectedRequest.color || 'N/A'}</p>
                <p><strong>Project Description:</strong></p>
                <p className="ADQ-detail-description">{selectedRequest.projectDescription || 'No description provided'}</p>
              </div>

              <div className="ADQ-detail-section">
                <h3 className="ADQ-detail-subtitle">Client Attachments ({selectedRequest.files?.length || 0})</h3>
                <div className="ADQ-detail-files">
                  {selectedRequest.files && selectedRequest.files.length > 0 ? (
                    selectedRequest.files.map((file, idx) => (
                      <div key={idx} className="ADQ-detail-file">
                        {file.mimetype && file.mimetype.startsWith('image/') ? (
                          <img 
                            src={`http://localhost:5003${file.url}`} 
                            alt={file.name} 
                            className="ADQ-detail-file-img"
                            onClick={() => window.open(`http://localhost:5003${file.url}`, '_blank')}
                          />
                        ) : (
                          <div className="ADQ-detail-file-pdf" onClick={() => window.open(`http://localhost:5003${file.url}`, '_blank')}>
                            <span className="ADQ-detail-pdf-icon">📄</span>
                            <span className="ADQ-file-name">{file.name || 'File'}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="ADQ-no-files">No files attached</p>
                  )}
                </div>
              </div>

              {selectedRequest.adminFiles && selectedRequest.adminFiles.length > 0 && (
                <div className="ADQ-detail-section">
                  <h3 className="ADQ-detail-subtitle">Previously Shared Files ({selectedRequest.adminFiles.length})</h3>
                  <div className="ADQ-detail-files">
                    {selectedRequest.adminFiles.map((file, idx) => (
                      <div key={idx} className="ADQ-detail-file">
                        {file.mimetype && file.mimetype.startsWith('image/') ? (
                          <img 
                            src={`http://localhost:5003${file.url}`} 
                            alt={file.name} 
                            className="ADQ-detail-file-img"
                            onClick={() => window.open(`http://localhost:5003${file.url}`, '_blank')}
                          />
                        ) : (
                          <div className="ADQ-detail-file-pdf" onClick={() => window.open(`http://localhost:5003${file.url}`, '_blank')}>
                            <span className="ADQ-detail-pdf-icon">📎</span>
                            <span className="ADQ-file-name">{file.name || 'File'}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.quotedPrice && (
                <div className="ADQ-detail-section ADQ-quote-received">
                  <h3 className="ADQ-detail-subtitle">Quotation Already Sent</h3>
                  <div className="ADQ-quote-amount">
                    Total Price: <span>{formatCurrency(selectedRequest.quotedPrice)}</span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="ADQ-quote-message">
                      <strong>Notes Sent to Client:</strong>
                      <p>{selectedRequest.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="ADQ-detail-section ADQ-admin-section">
                <h3 className="ADQ-detail-subtitle">Admin Actions</h3>
                
                <div className="ADQ-status-section">
                  <label className="ADQ-label">Update Status</label>
                  <div className="ADQ-status-buttons">
                    <button 
                      className={`ADQ-status-btn ${selectedRequest.status === 'Pending' ? 'active' : ''}`} 
                      onClick={() => updateRequestStatus('Pending')}
                    >
                      Mark as Pending
                    </button>
                    <button 
                      className={`ADQ-status-btn ${selectedRequest.status === 'Reviewed' ? 'active' : ''}`} 
                      onClick={() => updateRequestStatus('Reviewed')}
                    >
                      Mark as Reviewed
                    </button>
                    <button 
                      className={`ADQ-status-btn ${selectedRequest.status === 'Quoted' ? 'active' : ''}`} 
                      onClick={() => updateRequestStatus('Quoted')}
                    >
                      Mark as Quoted
                    </button>
                  </div>
                </div>

                <div className="ADQ-quote-form">
                  <label className="ADQ-label">Quote Price (LKR) *</label>
                  <input 
                    type="number" 
                    className="ADQ-input" 
                    value={quotePrice} 
                    onChange={(e) => setQuotePrice(e.target.value)} 
                    placeholder="Enter amount in LKR"
                  />
                  
                  <label className="ADQ-label">Notes / Remarks for Client</label>
                  <textarea 
                    className="ADQ-textarea" 
                    rows="3"
                    value={quoteNotes} 
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Add any special notes, delivery information, or instructions for the client..."
                  />

                  <label className="ADQ-label">Additional Files for Client (PDF, JPG, PNG, max 5MB each)</label>
                  <div 
                    className={`ADQ-dropzone ${dragActive ? 'ADQ-dropzone-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="ADQ-admin-file-input"
                      className="ADQ-file-input"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleAdminFileSelect}
                    />
                    <label htmlFor="ADQ-admin-file-input" className="ADQ-dropzone-label">
                      <div className="ADQ-dropzone-icon">📎</div>
                      <p>Drag & drop files here or click to browse</p>
                      <span className="ADQ-dropzone-hint">Supports JPG, PNG, PDF (Max 5MB per file)</span>
                    </label>
                  </div>

                  {adminFiles.length > 0 && (
                    <div className="ADQ-admin-file-list">
                      {adminFiles.map((file, index) => (
                        <div key={index} className="ADQ-admin-file-item">
                          {file.type.startsWith('image/') ? (
                            <div className="ADQ-admin-file-preview">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="ADQ-admin-preview-img" />
                            </div>
                          ) : (
                            <div className="ADQ-admin-file-preview-pdf">
                              <span className="ADQ-admin-pdf-icon">📄</span>
                            </div>
                          )}
                          <div className="ADQ-admin-file-info">
                            <span className="ADQ-admin-file-name">{file.name}</span>
                            <span className="ADQ-admin-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <button type="button" className="ADQ-admin-file-remove" onClick={() => removeAdminFile(index)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="ADQ-send-quote-btn" onClick={handleSendQuote}>
                    {selectedRequest.quotedPrice ? 'Update and Resend Quote' : 'Send Quote'} with {adminFiles.length} file(s) →
                  </button>
                </div>
              </div>
            </div>

            <div className="ADQ-modal-footer">
              <button className="ADQ-modal-close-btn" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdQuotation;