import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance'; // Update path as needed
import API_ENDPOINTS from '../../../apiConfig'; // Update path as needed
import './HandleBOwners.css';

function HandleBOwners() {
  // State management
  const [businessOwners, setBusinessOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [currentOwnerForEmail, setCurrentOwnerForEmail] = useState(null);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOwnerForDetails, setSelectedOwnerForDetails] = useState(null);

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch business owners data from API
  useEffect(() => {
    const fetchBusinessOwners = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.BOWNERS.GET_ALL);
        
        if (response.data && response.data.success) {
          console.log('Business owners fetched successfully:', response.data);
          setBusinessOwners(response.data.data);
        } else {
          throw new Error('Failed to fetch business owners data');
        }
      } catch (err) {
        console.error('Error fetching business owners:', err);
        setError(err.response?.data?.message || 'Failed to load business owners. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessOwners();
  }, []);

  // Function to handle removal of a business owner
  const handleRemoveBOwner = async (businessId) => {
    if (window.confirm('Are you sure you want to remove this business owner?')) {
      try {
        // Here you would implement the actual API call to remove the business owner
        // For now, we'll just update the UI
        setBusinessOwners(prevOwners => 
          prevOwners.filter(owner => owner._id !== businessId)
        );
        showNotification('Business owner removed successfully', 'success');
      } catch (err) {
        console.error("Error removing business owner:", err);
        showNotification('Failed to remove business owner', 'error');
      }
    }
  };

  // Function to send email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailData.subject || !emailData.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    try {
      // Here you would implement the actual email sending API
      console.log('Sending email to:', currentOwnerForEmail.email, 'Data:', emailData);
      showNotification(`Email sent successfully to ${currentOwnerForEmail.ownerName}`, 'success');
      closeEmailModal();
    } catch (err) {
      console.error("Error sending email:", err);
      showNotification('Failed to send email', 'error');
    }
  };

  // --- Modal Control Functions ---

  // Email Modal
  const openEmailModal = (owner) => {
    setCurrentOwnerForEmail(owner);
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setCurrentOwnerForEmail(null);
    setEmailData({ subject: '', message: '' });
  };

  // Details Modal
  const openDetailsModal = (owner) => {
    setSelectedOwnerForDetails(owner);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOwnerForDetails(null);
  };

  // --- Helper Functions ---

  // Handle email form input changes
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  // Function to show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- JSX Rendering ---
  return (
    <div className="admin-bowners-container">
      <h2>Business Owners Management</h2>
      
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Loading and Error States */}
      {loading && <div className="loading">Loading business owners...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* --- Business Owners Table --- */}
      {!loading && !error && (
        <div className="table-container">
          <table className="bowners-table">
            <thead>
              <tr>
                <th>Business ID</th>
                <th>Business Name</th>
                <th>Owner Name</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessOwners.length > 0 ? (
                businessOwners.map((owner) => (
                  <tr key={owner._id}>
                    <td>{owner.businessId}</td>
                    <td>{owner.businessName}</td>
                    <td>{owner.ownerName}</td>
                    <td>{owner.contactNumber}</td>
                    <td>{owner.address}</td>
                    <td className="action-buttons">
                      <button 
                        className="details-button"
                        onClick={() => openDetailsModal(owner)}
                        title="View Details"
                      >
                        Details
                      </button>
                      <button 
                        className="email-button" 
                        onClick={() => openEmailModal(owner)}
                        title="Send Email"
                      >
                        Email
                      </button>
                      <button 
                        className="remove-button" 
                        onClick={() => handleRemoveBOwner(owner._id)}
                        title="Remove Owner"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No business owners found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Email Modal --- */}
      {emailModalOpen && currentOwnerForEmail && (
        <div className="modal-overlay">
          <div className="email-modal">
            <div className="modal-header">
              <h3>Send Email to {currentOwnerForEmail.ownerName}</h3>
              <button className="close-button" onClick={closeEmailModal}>×</button>
            </div>
            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label htmlFor="recipient">Recipient:</label>
                <input
                  type="text"
                  id="recipient"
                  value={currentOwnerForEmail.email}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailChange}
                  placeholder="Enter email subject"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailChange}
                  placeholder="Enter your message"
                  rows="6"
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeEmailModal}>
                  Cancel
                </button>
                <button type="submit" className="send-button">
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Details Modal --- */}
      {detailsModalOpen && selectedOwnerForDetails && (
        <div className="modal-overlay">
          <div className="details-modal"> 
            <div className="modal-header">
              <h3>Business Owner Details</h3>
              <button className="close-button" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="modal-body details-content">
              <h4>{selectedOwnerForDetails.businessName}</h4>
              <div className="detail-item">
                <strong>Owner Name:</strong> {selectedOwnerForDetails.ownerName}
              </div>
              <div className="detail-item">
                <strong>Business ID:</strong> {selectedOwnerForDetails.businessId}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {selectedOwnerForDetails.email || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Contact Number:</strong> {selectedOwnerForDetails.contactNumber}
              </div>
              <div className="detail-item">
                <strong>Address:</strong> {selectedOwnerForDetails.address}
              </div>
              <hr className="details-divider"/>
              <div className="detail-item">
                <strong>Registration Date:</strong> {
                  selectedOwnerForDetails.createdAt 
                    ? new Date(selectedOwnerForDetails.createdAt).toLocaleDateString() 
                    : 'N/A'
                }
              </div>
              <div className="detail-item">
                <strong>District:</strong> {selectedOwnerForDetails.district || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Province:</strong> {selectedOwnerForDetails.province || 'N/A'}
              </div>
              {selectedOwnerForDetails.profilePhoto && (
                <div className="detail-item">
                  <strong>Profile Photo:</strong>
                  <img 
                    src={`${process.env.REACT_APP_API_URL}${selectedOwnerForDetails.profilePhoto}`} 
                    alt="Profile" 
                    className="owner-profile-thumbnail" 
                    style={{ maxWidth: '100px', marginTop: '10px' }}
                  />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandleBOwners;