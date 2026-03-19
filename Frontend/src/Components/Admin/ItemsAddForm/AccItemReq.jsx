import React, { useState, useEffect } from 'react';
import './AccItemReq.css';

const AccItemReq = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });

  useEffect(() => {
    fetchQuotations();
    fetchStats();
  }, [statusFilter]);

  const fetchQuotations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5003/api/quotations';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setQuotations(result.data);
      } else {
        setError(result.message || 'Failed to fetch quotations');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/quotations/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation);
    setAdminNotes(quotation.adminNotes || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuotation(null);
    setAdminNotes('');
  };

  const handleUpdateStatus = async (quotationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/quotations/${quotationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(`Quotation ${newStatus} successfully!`);
        fetchQuotations();
        fetchStats();
        handleCloseModal();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'ATreq-status-pending';
      case 'approved': return 'ATreq-status-approved';
      case 'rejected': return 'ATreq-status-rejected';
      case 'completed': return 'ATreq-status-completed';
      default: return '';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5003${imagePath}`;
    return `http://localhost:5003/uploads/items/${imagePath}`;
  };

  return (
    <div className="ATreq-container">
      <div className="ATreq-header">
        <h1 className="ATreq-title">Quotation Requests</h1>
        <div className="ATreq-stats">
          <div className="ATreq-stat-card">
            <span className="ATreq-stat-label">Total</span>
            <span className="ATreq-stat-value">{stats.total}</span>
          </div>
          <div className="ATreq-stat-card pending">
            <span className="ATreq-stat-label">Pending</span>
            <span className="ATreq-stat-value">{stats.pending}</span>
          </div>
          <div className="ATreq-stat-card approved">
            <span className="ATreq-stat-label">Approved</span>
            <span className="ATreq-stat-value">{stats.approved}</span>
          </div>
          <div className="ATreq-stat-card rejected">
            <span className="ATreq-stat-label">Rejected</span>
            <span className="ATreq-stat-value">{stats.rejected}</span>
          </div>
          <div className="ATreq-stat-card completed">
            <span className="ATreq-stat-label">Completed</span>
            <span className="ATreq-stat-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="ATreq-success">
          <span>{success}</span>
          <button className="ATreq-successClose" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {error && (
        <div className="ATreq-error">
          <span>{error}</span>
          <button className="ATreq-errorClose" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="ATreq-filters">
        <div className="ATreq-filter-group">
          <button 
            className={`ATreq-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`ATreq-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`ATreq-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`ATreq-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
          <button 
            className={`ATreq-filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ATreq-loading">Loading quotations...</div>
      ) : quotations.length === 0 ? (
        <div className="ATreq-empty">
          <div className="ATreq-empty-icon">📋</div>
          <h2>No Quotation Requests</h2>
          <p>There are no quotation requests to display.</p>
        </div>
      ) : (
        <div className="ATreq-table-container">
          <table className="ATreq-table">
            <thead>
              <tr>
                <th>Quotation ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(quotation => (
                <tr key={quotation._id}>
                  <td className="ATreq-quotation-id">{quotation.quotationId}</td>
                  <td>
                    <div className="ATreq-customer-info">
                      <div className="ATreq-customer-name">{quotation.userDetails?.name || 'N/A'}</div>
                      <div className="ATreq-customer-email">{quotation.userDetails?.email}</div>
                      <div className="ATreq-customer-phone">{quotation.userDetails?.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="ATreq-items-count">
                      {quotation.items.length} item(s)
                    </div>
                    <div className="ATreq-items-preview">
                      {quotation.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="ATreq-item-preview">
                          {item.name} x{item.quantity}
                          {idx < Math.min(quotation.items.length, 2) - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {quotation.items.length > 2 && (
                        <span className="ATreq-more-items"> +{quotation.items.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="ATreq-amount">Rs. {formatPrice(quotation.totalAmount)}</td>
                  <td>
                    <span className={`ATreq-status-badge ${getStatusBadgeClass(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td>{formatDate(quotation.requestedAt)}</td>
                  <td>
                    <button 
                      className="ATreq-view-btn"
                      onClick={() => handleViewDetails(quotation)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedQuotation && (
        <div className="ATreq-modal-overlay" onClick={handleCloseModal}>
          <div className="ATreq-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ATreq-modal-header">
              <h2>Quotation Details</h2>
              <button className="ATreq-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="ATreq-modal-body">
              <div className="ATreq-info-section">
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Quotation ID:</span>
                  <span className="ATreq-info-value">{selectedQuotation.quotationId}</span>
                </div>
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Status:</span>
                  <span className={`ATreq-status-badge ${getStatusBadgeClass(selectedQuotation.status)}`}>
                    {selectedQuotation.status}
                  </span>
                </div>
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Requested Date:</span>
                  <span className="ATreq-info-value">{formatDate(selectedQuotation.requestedAt)}</span>
                </div>
              </div>

              <div className="ATreq-customer-section">
                <h3>Customer Information</h3>
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Name:</span>
                  <span className="ATreq-info-value">{selectedQuotation.userDetails?.name}</span>
                </div>
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Email:</span>
                  <span className="ATreq-info-value">{selectedQuotation.userDetails?.email}</span>
                </div>
                <div className="ATreq-info-row">
                  <span className="ATreq-info-label">Phone:</span>
                  <span className="ATreq-info-value">{selectedQuotation.userDetails?.phone}</span>
                </div>
              </div>

              <div className="ATreq-items-section">
                <h3>Items Requested</h3>
                <div className="ATreq-items-list">
                  {selectedQuotation.items.map((item, index) => (
                    <div key={index} className="ATreq-item-card">
                      <div className="ATreq-item-image">
                        <img src={getImageUrl(item.image)} alt={item.name} />
                      </div>
                      <div className="ATreq-item-details">
                        <h4>{item.name}</h4>
                        <div className="ATreq-item-specs">
                          {item.selectedColor && (
                            <span className="ATreq-item-spec">Color: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span className="ATreq-item-spec">Size: {item.selectedSize}</span>
                          )}
                        </div>
                        <div className="ATreq-item-pricing">
                          <span className="ATreq-item-quantity">Qty: {item.quantity}</span>
                          <span className="ATreq-item-price">
                            Rs. {formatPrice(item.discountedPrice || item.price)} / {item.unit}
                          </span>
                        </div>
                        <div className="ATreq-item-total">
                          Total: Rs. {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ATreq-total-section">
                <div className="ATreq-total-row">
                  <span>Subtotal:</span>
                  <span>Rs. {formatPrice(selectedQuotation.totalAmount)}</span>
                </div>
              </div>

              <div className="ATreq-notes-section">
                <label className="ATreq-notes-label">Admin Notes:</label>
                <textarea
                  className="ATreq-notes-input"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this quotation..."
                  rows="3"
                />
              </div>

              {selectedQuotation.status === 'pending' && (
                <div className="ATreq-action-section">
                  <button 
                    className="ATreq-approve-btn"
                    onClick={() => handleUpdateStatus(selectedQuotation._id, 'approved')}
                  >
                    Approve Quotation
                  </button>
                  <button 
                    className="ATreq-reject-btn"
                    onClick={() => handleUpdateStatus(selectedQuotation._id, 'rejected')}
                  >
                    Reject Quotation
                  </button>
                </div>
              )}

              {selectedQuotation.status === 'approved' && (
                <div className="ATreq-action-section">
                  <button 
                    className="ATreq-complete-btn"
                    onClick={() => handleUpdateStatus(selectedQuotation._id, 'completed')}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccItemReq;