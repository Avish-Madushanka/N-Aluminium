import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisReview.css';

const API_URL = 'http://localhost:5003/api';

const DisReview = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, read: 0, responded: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    loadContacts();
    loadStats();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [contacts, statusFilter, searchQuery, expertiseFilter, sortBy]);

  const loadContacts = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setContacts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/contact/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data || { total: 0, pending: 0, read: 0, responded: 0 });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      const pending = contacts.filter(c => c.status === 'pending').length;
      const read = contacts.filter(c => c.status === 'read').length;
      const responded = contacts.filter(c => c.status === 'responded').length;
      setStats({ total: contacts.length, pending, read, responded });
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...contacts];
    if (statusFilter !== 'all') {
      result = result.filter(contact => contact.status === statusFilter);
    }
    if (expertiseFilter !== 'all') {
      result = result.filter(contact => contact.expertise === expertiseFilter);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(contact => 
        (contact.name || '').toLowerCase().includes(query) ||
        (contact.email || '').toLowerCase().includes(query) ||
        (contact.phone || '').toLowerCase().includes(query) ||
        (contact.message || '').toLowerCase().includes(query) ||
        (contact.location || '').toLowerCase().includes(query)
      );
    }
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredContacts(result);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setAdminNotes(contact.adminNotes || '');
    setReplyEmail(contact.email);
    setReplySubject(`Re: Contact Inquiry - ${contact.name}`);
    setReplyMessage('');
    setShowDetailModal(true);
    if (contact.status === 'pending') {
      updateContactStatus(contact._id, 'read');
    }
  };

  const updateContactStatus = async (id, newStatus) => {
    const token = getAuthToken();
    if (!token) return;
    try {
      await axios.put(`${API_URL}/contact/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    const token = getAuthToken();
    if (!token) {
      setUpdatingStatus(false);
      return;
    }
    try {
      await axios.put(`${API_URL}/contact/${selectedContact._id}/status`, 
        { status: newStatus, adminNotes: adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage(`Contact marked as ${newStatus}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadContacts();
      loadStats();
      setSelectedContact({ ...selectedContact, status: newStatus, adminNotes: adminNotes });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    setSendingReply(true);
    const token = getAuthToken();
    if (!token) {
      setSendingReply(false);
      alert('Please login as admin');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/contact/${selectedContact._id}/reply`,
        { 
          reply: replyMessage.trim(), 
          subject: replySubject,
          adminNotes: adminNotes 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage(`Reply sent to ${selectedContact.email} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        await updateContactStatus(selectedContact._id, 'responded');
        setShowDetailModal(false);
        setSelectedContact(null);
        loadContacts();
        loadStats();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      return;
    }
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await axios.delete(`${API_URL}/contact/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSuccessMessage('Contact message deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadContacts();
        loadStats();
        if (selectedContact && selectedContact._id === contactId) {
          setShowDetailModal(false);
          setSelectedContact(null);
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete contact message');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'DCon-status-badge-pending';
      case 'read': return 'DCon-status-badge-read';
      case 'responded': return 'DCon-status-badge-responded';
      default: return 'DCon-status-badge-pending';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'read': return 'Read';
      case 'responded': return 'Responded';
      default: return 'Pending';
    }
  };

  const getExpertiseLabel = (expertise) => {
    switch(expertise) {
      case 'fabrication': return 'Aluminum Fabrication';
      case 'scrap': return 'Scrap Collection';
      case 'marketplace': return 'Material Marketplace';
      default: return expertise;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setExpertiseFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="DCon-container">
      <div className="DCon-header">
        <div className="DCon-header-content">
          <h1 className="DCon-title">Contact Form Submissions</h1>
        </div>
      </div>

      {successMessage && (
        <div className="DCon-success-message">
          <span className="DCon-success-icon">✓</span>
          {successMessage}
        </div>
      )}

      <div className="DCon-main-content">
        {activeTab === 'contacts' && (
          <div className="DCon-card">
            <div className="DCon-card-header">
              <h2 className="DCon-card-title">All Contact Messages</h2>
              <p className="DCon-card-subtitle">Manage and respond to customer inquiries</p>
            </div>
            
            <div className="DCon-filter-bar">
              <div className="DCon-search-wrapper">
                <span className="DCon-search-icon">🔍</span>
                <input 
                  type="text" 
                  className="DCon-search-input" 
                  placeholder="Search by name, email, phone, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="DCon-clear-search" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              
              <div className="DCon-filter-controls">
                <div className="DCon-filter-group">
                  <label className="DCon-filter-label">Status:</label>
                  <select 
                    className="DCon-filter-select" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                  </select>
                </div>
                
                <div className="DCon-filter-group">
                  <label className="DCon-filter-label">Expertise:</label>
                  <select 
                    className="DCon-filter-select" 
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="fabrication">Aluminum Fabrication</option>
                    <option value="scrap">Scrap Collection</option>
                    <option value="marketplace">Material Marketplace</option>
                  </select>
                </div>
                
                <div className="DCon-filter-group">
                  <label className="DCon-filter-label">Sort by:</label>
                  <select 
                    className="DCon-filter-select" 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                
                <button className="DCon-clear-filters-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="DCon-results-info">
              <span>Showing {filteredContacts.length} of {contacts.length} messages</span>
              {statusFilter !== 'all' && <span className="DCon-active-filter">Status: {statusFilter}</span>}
              {expertiseFilter !== 'all' && <span className="DCon-active-filter">Type: {getExpertiseLabel(expertiseFilter)}</span>}
              {searchQuery && <span className="DCon-active-filter">Search: "{searchQuery}"</span>}
            </div>
            
            <div className="DCon-card-body">
              {loading ? (
                <div className="DCon-loading">Loading messages...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="DCon-empty-state">
                  <div className="DCon-empty-icon">📧</div>
                  <p>No messages match your filters</p>
                  <button className="DCon-view-btn" onClick={clearFilters}>Clear All Filters</button>
                </div>
              ) : (
                <div className="DCon-contacts-grid">
                  {filteredContacts.map(contact => (
                    <div key={contact._id} className="DCon-contact-card" onClick={() => handleViewContact(contact)}>
                      <div className="DCon-contact-card-header">
                        <div>
                          <h3 className="DCon-contact-name">{contact.name || 'Anonymous'}</h3>
                          <p className="DCon-contact-email">{contact.email || 'No email'}</p>
                        </div>
                        <span className={getStatusBadgeClass(contact.status)}>
                          {getStatusText(contact.status)}
                        </span>
                      </div>
                      <div className="DCon-contact-card-body">
                        <p><strong>Expertise:</strong> {getExpertiseLabel(contact.expertise)}</p>
                        <p><strong>Phone:</strong> {contact.phone || 'N/A'}</p>
                        <p><strong>Location:</strong> {contact.location || 'N/A'}</p>
                        <p className="DCon-message-excerpt">
                          <strong>Message:</strong> {contact.message?.substring(0, 80)}...
                        </p>
                      </div>
                      <div className="DCon-contact-card-footer">
                        <span className="DCon-contact-date">
                          {contact.createdAt ? formatDate(contact.createdAt) : 'Date unknown'}
                        </span>
                        <button className="DCon-view-btn">View & Respond →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="DCon-card"> </div>)}</div>

      {showDetailModal && selectedContact && (
        <div className="DCon-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="DCon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="DCon-modal-header">
              <div>
                <span className="DCon-modal-id">#{selectedContact._id?.slice(-6)}</span>
                <h2 className="DCon-modal-title">{selectedContact.name || 'Contact Message'}</h2>
              </div>
              <button className="DCon-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            <div className="DCon-modal-body">
              <div className="DCon-detail-section">
                <h3 className="DCon-detail-subtitle">Customer Information</h3>
                <div className="DCon-detail-grid">
                  <p><strong>Name:</strong> {selectedContact.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedContact.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedContact.phone || 'N/A'}</p>
                  <p><strong>Location:</strong> {selectedContact.location || 'N/A'}</p>
                  <p><strong>Expertise:</strong> {getExpertiseLabel(selectedContact.expertise)}</p>
                  <p><strong>Submitted:</strong> {selectedContact.createdAt ? formatDate(selectedContact.createdAt) : 'N/A'}</p>
                  <p><strong>Status:</strong> 
                    <span className={getStatusBadgeClass(selectedContact.status)} style={{ marginLeft: '8px' }}>
                      {getStatusText(selectedContact.status)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="DCon-detail-section">
                <h3 className="DCon-detail-subtitle">Customer Message</h3>
                <div className="DCon-message-content">
                  <p className="DCon-message-text">{selectedContact.message || 'No message content'}</p>
                </div>
              </div>

              <div className="DCon-detail-section DCon-admin-section">
                <h3 className="DCon-detail-subtitle">Admin Actions</h3>
                
                <div className="DCon-status-section">
                  <label className="DCon-label">Update Status</label>
                  <div className="DCon-status-buttons">
                    <button 
                      className={`DCon-status-btn ${selectedContact.status === 'pending' ? 'active' : ''}`} 
                      onClick={() => handleUpdateStatus('pending')}
                      disabled={updatingStatus}
                    >
                      Pending
                    </button>
                    <button 
                      className={`DCon-status-btn ${selectedContact.status === 'read' ? 'active' : ''}`} 
                      onClick={() => handleUpdateStatus('read')}
                      disabled={updatingStatus}
                    >
                      Mark as Read
                    </button>
                    <button 
                      className={`DCon-status-btn ${selectedContact.status === 'responded' ? 'active' : ''}`} 
                      onClick={() => handleUpdateStatus('responded')}
                      disabled={updatingStatus}
                    >
                      Mark as Responded
                    </button>
                    <button 
                      className="DCon-delete-btn" 
                      onClick={() => handleDeleteContact(selectedContact._id)}
                    >
                      🗑 Delete Message
                    </button>
                  </div>
                </div>

                <div className="DCon-notes-section">
                  <label className="DCon-label">Admin Notes (Internal)</label>
                  <textarea 
                    className="DCon-textarea" 
                    rows="3"
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                  />
                </div>

                <div className="DCon-reply-section">
                  <label className="DCon-label">Send Email Reply to Customer</label>
                  <div className="DCon-reply-info">
                    <p className="DCon-reply-customer">
                      <strong>To:</strong> {selectedContact.email}
                    </p>
                    <p className="DCon-reply-subject">
                      <strong>Subject:</strong>
                      <input 
                        type="text" 
                        className="DCon-subject-input" 
                        value={replySubject} 
                        onChange={(e) => setReplySubject(e.target.value)}
                      />
                    </p>
                  </div>
                  <textarea 
                    className="DCon-textarea" 
                    rows="6"
                    value={replyMessage} 
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Dear customer,

Thank you for contacting ALUX Panadura...

Best regards,
ALUX Panadura Team"
                  />
                  <button 
                    className="DCon-send-reply-btn" 
                    onClick={handleSendReply}
                    disabled={sendingReply}
                  >
                    {sendingReply ? 'Sending...' : '✉ Send Email Reply'}
                  </button>
                </div>
              </div>
            </div>

            <div className="DCon-modal-footer">
              <button className="DCon-modal-close-btn" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisReview;