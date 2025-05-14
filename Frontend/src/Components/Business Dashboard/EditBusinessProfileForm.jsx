import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Ensure BusinessDashboard.css is imported in a parent component or here if scoped styles are needed
// import './EditBusinessProfileForm.css'; // If you create specific styles for this form

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace('/api', ''));


function EditBusinessProfileForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "", // Maps to 'name' in BOwnerHeader
    contactNumber: "",
    email: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [coverPhotoPreview, setCoverPhotoPreview] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Effect to load existing business data (e.g., from localStorage or API)
  useEffect(() => {
    const loadBusinessData = () => {
      const storedDataString = localStorage.getItem('userInfo');
      if (storedDataString) {
        try {
          const parsedData = JSON.parse(storedDataString);
          if (parsedData && (parsedData.role === 'businessOwner' || parsedData.role === 'admin')) {
            setFormData({
              businessName: parsedData.businessName || "",
              ownerName: parsedData.name || "", // 'name' field in JWT payload
              contactNumber: parsedData.contactNumber || "",
              email: parsedData.email || "",
            });
            // Construct full URLs for existing photos
            if (parsedData.profilePhoto) {
              setProfilePhotoPreview(parsedData.profilePhoto.startsWith('/') ? `${BACKEND_URL}${parsedData.profilePhoto}` : parsedData.profilePhoto);
            }
            if (parsedData.coverPhoto) {
              setCoverPhotoPreview(parsedData.coverPhoto.startsWith('/') ? `${BACKEND_URL}${parsedData.coverPhoto}` : parsedData.coverPhoto);
            }
          } else {
            setError("Invalid user data found.");
          }
        } catch (e) {
          setError("Failed to parse user data.");
          console.error("Error parsing user data from localStorage:", e);
        }
      } else {
        // Optionally, fetch from API if not in localStorage or for fresh data
        // axios.get(`${API_BASE_URL}/business-profile`)
        //   .then(response => { /* set form data */ })
        //   .catch(err => setError("Failed to fetch profile data."));
        setError("No business data found. Please ensure you are logged in.");
      }
    };
    loadBusinessData();

    // Cleanup object URLs
    return () => {
      if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) URL.revokeObjectURL(profilePhotoPreview);
      if (coverPhotoPreview && coverPhotoPreview.startsWith('blob:')) URL.revokeObjectURL(coverPhotoPreview);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const newPreview = URL.createObjectURL(file);

    if (fileType === 'profilePhoto') {
      if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) URL.revokeObjectURL(profilePhotoPreview);
      setProfilePhotoFile(file);
      setProfilePhotoPreview(newPreview);
    } else if (fileType === 'coverPhoto') {
      if (coverPhotoPreview && coverPhotoPreview.startsWith('blob:')) URL.revokeObjectURL(coverPhotoPreview);
      setCoverPhotoFile(file);
      setCoverPhotoPreview(newPreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const submissionData = new FormData();
    submissionData.append('businessName', formData.businessName);
    submissionData.append('name', formData.ownerName); // Backend expects 'name' for owner
    submissionData.append('contactNumber', formData.contactNumber);
    submissionData.append('email', formData.email); // Email might not be updatable this way if it's a login identifier

    if (profilePhotoFile) {
      submissionData.append('profilePhoto', profilePhotoFile);
    }
    if (coverPhotoFile) {
      submissionData.append('coverPhoto', coverPhotoFile);
    }
    
    // Get user ID from localStorage (assuming it's stored)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userId) {
        setError('User ID not found. Cannot update profile.');
        setLoading(false);
        return;
    }
    const userId = userInfo.userId;

    try {
      // Assuming a PUT request to update. Adjust endpoint as needed.
      // The token should be sent automatically if your axios instance is configured with interceptors for auth.
      // Otherwise, manually add Authorization header:
      // const token = localStorage.getItem('token'); // Or however you store your token
      // headers: { 'Authorization': `Bearer ${token}` }
      const response = await axios.put(`${API_BASE_URL}/users/profile/${userId}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add Authorization header if needed, e.g.:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setLoading(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Update localStorage with new data from response if backend returns it
      if (response.data && response.data.user) {
          const updatedUserInfo = { ...userInfo, ...response.data.user };
          localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
          // Optionally, force a re-render or navigate to make changes visible immediately
          // e.g., by updating state that BOwnerHeader might depend on, or navigating.
      }

      // Optionally, navigate away or show a persistent success message
      // navigate('/business-dashboard'); 
    } catch (err) {
      setLoading(false);
      console.error("Failed to update profile:", err.response || err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="biz-form-container"> {/* Uses class from BusinessDashboard.css */}
      <h2 className="form-title">Edit Business Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p style={{color: 'green', marginBottom: '15px'}}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            value={formData.businessName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">Owner Name</label>
          <input
            type="text"
            id="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group-row">
            <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
                type="tel"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={loading}
                required
            />
            </div>
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required 
                // readOnly // Email might be a login identifier and not easily changeable
            />
            </div>
        </div>


        <div className="form-group">
          <label htmlFor="profilePhotoUpload">Profile Photo</label>
          <input
            type="file"
            id="profilePhotoUpload"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'profilePhoto')}
            disabled={loading}
            className="file-input-styling" // Add class if you want more specific styling than .biz-form-container input[type="file"]
          />
          {profilePhotoPreview && (
            <img src={profilePhotoPreview} alt="Profile Preview" className="image-preview" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="coverPhotoUpload">Cover Photo</label>
          <input
            type="file"
            id="coverPhotoUpload"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'coverPhoto')}
            disabled={loading}
            className="file-input-styling"
          />
          {coverPhotoPreview && (
            <img src={coverPhotoPreview} alt="Cover Preview" className="image-preview" style={{maxWidth: '300px', maxHeight:'150px', objectFit: 'cover'}}/>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditBusinessProfileForm;