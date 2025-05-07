import React, { useState, useEffect } from 'react';
// Removed axios import as we are simulating frontend only
// import axios from 'axios'; 
import './HandleBOwners.css'; // Assuming you have this CSS file from previous examples

// --- Sample Data (Simulating Backend Response) ---
const sampleBusinessOwners = [
  {
    businessId: 'B001',
    businessName: 'Green Tech Recycling',
    ownerName: 'Alice Johnson',
    email: 'alice.j@greentech.com', // Added for email modal
    contactNumber: '555-1234',
    address: '123 Recycling Ave, Anytown, USA',
    registrationDate: '2022-01-15', // Example detail field
    businessType: 'Industrial Recycling', // Example detail field
    website: 'www.greentech.com', // Example detail field
    notes: 'Primary contact for aluminum scraps. Prefers weekly pickups.' // Example detail field
  },
  {
    businessId: 'B002',
    businessName: 'MetalWorks Inc.',
    ownerName: 'Bob Smith',
    email: 'bob.smith@metalworks.co', // Added for email modal
    contactNumber: '555-5678',
    address: '456 Industrial Rd, Sometown, USA',
    registrationDate: '2021-11-01',
    businessType: 'Metal Fabrication',
    website: null, // Example of optional data
    notes: 'Source for offcuts and shavings.'
  },
  {
    businessId: 'B003',
    businessName: 'Construct Solutions',
    ownerName: 'Carol White',
    email: 'carol.w@constructsol.net', // Added for email modal
    contactNumber: '555-9012',
    address: '789 Building Ln, Otherville, USA',
    registrationDate: '2023-03-20',
    businessType: 'Construction & Demolition',
    website: 'www.constructsolutions.net',
    notes: 'Demolition site scraps, variable quality.'
  },
];
// --- End Sample Data ---


function HandleBOwners() {
  // State management
  const [businessOwners, setBusinessOwners] = useState([]);
  const [loading, setLoading] = useState(true); // Keep loading state for simulation
  const [error, setError] = useState('');
  
  // Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [currentOwnerForEmail, setCurrentOwnerForEmail] = useState(null); // Renamed for clarity
  const [emailData, setEmailData] = useState({ subject: '', message: '' });

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOwnerForDetails, setSelectedOwnerForDetails] = useState(null); // State for details modal

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Simulate fetching business owners on component mount
  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // --- Simulate successful data fetch ---
        setBusinessOwners(sampleBusinessOwners); 
        setLoading(false);
        // --- Or uncomment below to simulate an error ---
        // throw new Error("Simulated network failure"); 
      } catch (err) {
        console.error("Simulated fetch error:", err);
        setError('Failed to load business owners (Simulated). Please try again later.');
        setLoading(false);
      }
    }, 1000); // 1 second delay

    // Cleanup function for timeout if component unmounts
    return () => clearTimeout(timer); 
  }, []); // Empty dependency array means this runs once on mount

  // --- Simulated Actions (No Backend Calls) ---

  // Function to handle removal of a business owner (Frontend Only)
  const handleRemoveBOwner = (businessIdToRemove) => {
    if (window.confirm('Are you sure you want to remove this business owner? (Frontend Simulation)')) {
      // Simulate successful removal
      setBusinessOwners(prevOwners => 
        prevOwners.filter(owner => owner.businessId !== businessIdToRemove)
      );
      showNotification('Business owner removed successfully (Simulated)', 'success');
      
      // --- To simulate an error: ---
      // console.error("Simulated remove error");
      // showNotification('Failed to remove business owner (Simulated)', 'error');
    }
  };

  // Function to simulate sending email (Frontend Only)
  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailData.subject || !emailData.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    // Simulate successful email send
    console.log('Simulating sending email to:', currentOwnerForEmail.email, 'Data:', emailData);
    showNotification(`Email sent successfully to ${currentOwnerForEmail.ownerName} (Simulated)`, 'success');
    closeEmailModal();

    // --- To simulate an error: ---
    // console.error("Simulated email send error");
    // showNotification('Failed to send email (Simulated)', 'error');
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
    setEmailData({ subject: '', message: '' }); // Reset form
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

  // Handle email form input changes (Remains the same)
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  // Function to show notification (Remains the same)
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
                  <tr key={owner.businessId}>
                    <td>{owner.businessId}</td>
                    <td>{owner.businessName}</td>
                    <td>{owner.ownerName}</td>
                    <td>{owner.contactNumber}</td>
                    <td>{owner.address}</td>
                    <td className="action-buttons">
                      {/* Details Button Added */}
                      <button 
                        className="details-button" // Add specific style for this button if needed
                        onClick={() => openDetailsModal(owner)}
                        title="View Details" // Tooltip
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
                        onClick={() => handleRemoveBOwner(owner.businessId)}
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
          <div className="email-modal"> {/* Use existing email-modal class */}
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
                  readOnly // Changed to readOnly, better practice than disabled for display
                  className="read-only-input" // Optional: Add class for specific styling
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
                  Send Email (Simulated)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Details Modal --- */}
      {detailsModalOpen && selectedOwnerForDetails && (
        <div className="modal-overlay">
          {/* You might want a different class or reuse 'email-modal' styling */}
          <div className="details-modal"> 
            <div className="modal-header">
              <h3>Business Owner Details</h3>
              <button className="close-button" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="modal-body details-content"> {/* Added classes for content styling */}
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
              <hr className="details-divider"/> {/* Optional divider */}
              <div className="detail-item">
                <strong>Registration Date:</strong> {selectedOwnerForDetails.registrationDate || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Business Type:</strong> {selectedOwnerForDetails.businessType || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Website:</strong> 
                {selectedOwnerForDetails.website ? 
                  <a href={selectedOwnerForDetails.website.startsWith('http') ? selectedOwnerForDetails.website : `http://${selectedOwnerForDetails.website}`} target="_blank" rel="noopener noreferrer">
                    {selectedOwnerForDetails.website}
                  </a> 
                  : 'N/A'}
              </div>
               <hr className="details-divider"/>
              <div className="detail-item notes-section"> {/* Class for potentially different styling */}
                <strong>Notes:</strong> 
                <p>{selectedOwnerForDetails.notes || 'No notes available.'}</p>
              </div>
            </div>
             <div className="form-actions"> {/* Reuse form-actions for button alignment */}
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