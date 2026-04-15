import React, { useState, useEffect } from 'react';
import './AdQuotation.css';

const AdQuotation = () => {
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  useEffect(() => {
    loadQuotationRequests();
  }, []);

  const loadQuotationRequests = () => {
    setLoading(true);
    const stored = localStorage.getItem('aluminum_quotations_admin_V2');
    if (stored) {
      setQuotationRequests(JSON.parse(stored));
    } else {
      setQuotationRequests([]);
    }
    setLoading(false);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setQuotePrice(request.quotedPrice || '');
    setQuoteNotes(request.adminNotes || '');
    setShowDetailModal(true);
  };

  const handleSendQuote = () => {
    if (!quotePrice) {
      alert('Please enter a price for the quotation');
      return;
    }

    const priceNum = parseFloat(quotePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid price');
      return;
    }

    const updatedRequest = {
      ...selectedRequest,
      status: 'Quoted',
      quotedPrice: priceNum,
      adminNotes: quoteNotes,
      quotedAt: new Date().toISOString()
    };

    const adminStored = localStorage.getItem('aluminum_quotations_admin_V2');
    let adminRequests = adminStored ? JSON.parse(adminStored) : [];
    const adminIndex = adminRequests.findIndex(r => r.id === selectedRequest.id);
    if (adminIndex !== -1) {
      adminRequests[adminIndex] = updatedRequest;
      localStorage.setItem('aluminum_quotations_admin_V2', JSON.stringify(adminRequests));
      setQuotationRequests(adminRequests);
    }

    const userStored = localStorage.getItem('aluminum_quotations_user_V2');
    let userRequests = userStored ? JSON.parse(userStored) : [];
    const userIndex = userRequests.findIndex(r => r.id === selectedRequest.id);
    if (userIndex !== -1) {
      userRequests[userIndex] = updatedRequest;
      localStorage.setItem('aluminum_quotations_user_V2', JSON.stringify(userRequests));
    }

    setSelectedRequest(updatedRequest);
    setSuccessMessage('Quote sent successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setTimeout(() => {
      setShowDetailModal(false);
      setSelectedRequest(null);
    }, 1500);
  };

  const updateRequestStatus = (newStatus) => {
    const updatedRequest = { ...selectedRequest, status: newStatus };

    const adminStored = localStorage.getItem('aluminum_quotations_admin_V2');
    let adminRequests = adminStored ? JSON.parse(adminStored) : [];
    const adminIndex = adminRequests.findIndex(r => r.id === selectedRequest.id);
    if (adminIndex !== -1) {
      adminRequests[adminIndex] = updatedRequest;
      localStorage.setItem('aluminum_quotations_admin_V2', JSON.stringify(adminRequests));
      setQuotationRequests(adminRequests);
    }

    const userStored = localStorage.getItem('aluminum_quotations_user_V2');
    let userRequests = userStored ? JSON.parse(userStored) : [];
    const userIndex = userRequests.findIndex(r => r.id === selectedRequest.id);
    if (userIndex !== -1) {
      userRequests[userIndex] = updatedRequest;
      localStorage.setItem('aluminum_quotations_user_V2', JSON.stringify(userRequests));
    }

    setSelectedRequest(updatedRequest);
    setSuccessMessage(`Request marked as ${newStatus}`);
    setTimeout(() => setSuccessMessage(''), 2000);
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
    if (!amount) return 'Not quoted';
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="alp-container">
      <div className="alp-header">
        <div className="alp-header-content">
          <h1 className="alp-title">AdQuotation - Admin Dashboard</h1>
          <p className="alp-subtitle">Manage Aluminum Quotation Requests | Review & Send Quotes</p>
        </div>
      </div>

      {successMessage && (
        <div className="alp-success-message">
          <span className="alp-success-icon">✓</span>
          {successMessage}
        </div>
      )}

      <div className="adq-dashboard">
        <div className="adq-sidebar">
          <div className="adq-sidebar-header">
            <h3 className="adq-sidebar-title">Admin Panel</h3>
          </div>
          <nav className="adq-sidebar-nav">
            <button 
              className={`adq-sidebar-link ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              📋 All Requests
            </button>
            <button 
              className={`adq-sidebar-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Statistics
            </button>
          </nav>
        </div>

        <div className="adq-main">
          {activeTab === 'requests' && (
            <div className="adq-requests-section">
              <h2 className="adq-section-title">Quotation Requests</h2>
              {loading ? (
                <div className="alp-loading">Loading requests...</div>
              ) : quotationRequests.length === 0 ? (
                <div className="alp-empty-state">
                  <div className="alp-empty-icon">📭</div>
                  <p>No quotation requests yet</p>
                </div>
              ) : (
                <div className="adq-requests-grid">
                  {quotationRequests.map(request => (
                    <div key={request.id} className="adq-request-card" onClick={() => handleViewRequest(request)}>
                      <div className="adq-request-card-header">
                        <h3 className="adq-request-title">{request.projectTitle}</h3>
                        <span className={getStatusBadgeClass(request.status)}>{request.status}</span>
                      </div>
                      <div className="adq-request-card-body">
                        <p className="adq-request-client"><strong>Client:</strong> {request.fullName}</p>
                        <p className="adq-request-email"><strong>Email:</strong> {request.email}</p>
                        <p className="adq-request-material"><strong>Material:</strong> {request.materialType}</p>
                        <p className="adq-request-budget"><strong>Budget:</strong> {formatCurrency(request.budget)}</p>
                        <p className="adq-request-files"><strong>Files:</strong> {request.files.length} attached</p>
                      </div>
                      <div className="adq-request-card-footer">
                        <span className="adq-request-date">{new Date(request.submittedAt).toLocaleDateString()}</span>
                        <button className="adq-view-btn">View Details →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="adq-stats-section">
              <h2 className="adq-section-title">Statistics Overview</h2>
              <div className="adq-stats-grid">
                <div className="adq-stat-card">
                  <div className="adq-stat-value">{quotationRequests.length}</div>
                  <div className="adq-stat-label">Total Requests</div>
                </div>
                <div className="adq-stat-card">
                  <div className="adq-stat-value">{quotationRequests.filter(r => r.status === 'Pending').length}</div>
                  <div className="adq-stat-label">Pending</div>
                </div>
                <div className="adq-stat-card">
                  <div className="adq-stat-value">{quotationRequests.filter(r => r.status === 'Reviewed').length}</div>
                  <div className="adq-stat-label">Reviewed</div>
                </div>
                <div className="adq-stat-card">
                  <div className="adq-stat-value">{quotationRequests.filter(r => r.status === 'Quoted').length}</div>
                  <div className="adq-stat-label">Quoted</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetailModal && selectedRequest && (
        <div className="alp-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="alp-modal alp-modal-large" onClick={(e) => e.stopPropagation()}>
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
                <p><strong>Budget:</strong> {formatCurrency(selectedRequest.budget)}</p>
                <p><strong>Description:</strong></p>
                <p className="alp-detail-description">{selectedRequest.projectDescription}</p>
              </div>

              <div className="alp-detail-section">
                <h3 className="alp-detail-subtitle">Attached Files</h3>
                <div className="alp-detail-files">
                  {selectedRequest.files.map((file, idx) => (
                    <div key={idx} className="alp-detail-file">
                      {file.type.startsWith('image/') ? (
                        <img src={file.preview} alt={file.name} className="alp-detail-file-img" />
                      ) : (
                        <div className="alp-detail-file-pdf">
                          <span className="alp-detail-pdf-icon">📄</span>
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="alp-detail-section adq-admin-section">
                <h3 className="alp-detail-subtitle">Admin Actions</h3>
                <div className="adq-status-buttons">
                  <button 
                    className={`adq-status-btn ${selectedRequest.status === 'Pending' ? 'active' : ''}`}
                    onClick={() => updateRequestStatus('Pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`adq-status-btn ${selectedRequest.status === 'Reviewed' ? 'active' : ''}`}
                    onClick={() => updateRequestStatus('Reviewed')}
                  >
                    Reviewed
                  </button>
                  <button 
                    className={`adq-status-btn ${selectedRequest.status === 'Quoted' ? 'active' : ''}`}
                    onClick={() => updateRequestStatus('Quoted')}
                  >
                    Quoted
                  </button>
                </div>

                <div className="adq-quote-form">
                  <label className="alp-label">Quote Price (LKR)</label>
                  <input
                    type="number"
                    className="alp-input"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="Enter total project price"
                    min="0"
                    step="1000"
                  />
                  <label className="alp-label">Notes / Remarks</label>
                  <textarea
                    className="alp-textarea"
                    rows="3"
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Add any notes or specifications for the client..."
                  ></textarea>
                  <button className="adq-send-quote-btn" onClick={handleSendQuote}>
                    Send Quote to Client
                  </button>
                </div>
              </div>

              {selectedRequest.quotedPrice && (
                <div className="alp-detail-section alp-quote-received">
                  <h3 className="alp-detail-subtitle">Previously Quoted</h3>
                  <div className="alp-quote-amount">
                    Total Price: <span>{formatCurrency(selectedRequest.quotedPrice)}</span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="alp-quote-message">
                      <strong>Previous Notes:</strong>
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

export default AdQuotation;