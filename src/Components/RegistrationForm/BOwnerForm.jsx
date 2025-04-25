// src/Components/RegistrationForm/BOwnerForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after success
import './BOwnerForm.css'; // Make sure this CSS file exists and styles correctly

function BOwnerForm() {
  // --- State Management ---
  // Form text/select data
  const [formData, setFormData] = useState({
    businessId: '',
    businessName: '',
    ownerName: '',
    address: '',
    contactNumber: '',
    district: '',
    province: '',
    email: '',
    password: '',
  });
  // Actual File objects for upload
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  // Temporary URLs for image previews
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  // UI feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  // --- Event Handlers ---

  // Generic handler for text inputs, textareas, selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Generic handler for file inputs
  const handleFileChange = (e, setFileState, setPreviewState, currentPreviewUrl) => {
    const file = e.target.files?.[0] || null; // Get the selected file (or null)

    // Revoke previous preview URL to free memory
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
      console.log("Revoked previous preview URL:", currentPreviewUrl);
    }

    setFileState(file); // Update state with the new File object (or null)

    // Create and set new preview URL if a file was selected
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewState(newPreviewUrl);
      console.log("Created new preview URL:", newPreviewUrl);
    } else {
      setPreviewState(null); // Clear preview if no file or selection cancelled
    }
  };

  // Specific file change handlers using the generic one
  const handleProfilePhotoChange = (e) => {
    handleFileChange(e, setProfilePhotoFile, setProfilePreview, profilePreview);
  };

  const handleCoverPhotoChange = (e) => {
    handleFileChange(e, setCoverPhotoFile, setCoverPreview, coverPreview);
  };

  // --- Cleanup Effect ---
  // This effect runs when the component unmounts to prevent memory leaks
  // by revoking any existing object URLs created for previews.
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
        console.log("Cleaned up profile preview URL on unmount");
      }
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
        console.log("Cleaned up cover preview URL on unmount");
      }
    };
  }, [profilePreview, coverPreview]); // Re-run if previews change (though unmount cleanup is key)


  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page reload
    setLoading(true);
    setError('');
    setSuccess('');

    // Create FormData to handle multipart/form-data (needed for files)
    const submissionData = new FormData();

    // Append all text/select data from the formData state
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    // Append files only if they have been selected
    if (profilePhotoFile) {
      submissionData.append('profilePhoto', profilePhotoFile); // Backend expects 'profilePhoto'
    }
    if (coverPhotoFile) {
      submissionData.append('coverPhoto', coverPhotoFile);     // Backend expects 'coverPhoto'
    }

     // Optional: Log FormData contents (for debugging, not directly viewable in console)
     // for (let [key, value] of submissionData.entries()) {
     //   console.log(`${key}:`, value);
     // }

    // --- API Call to Backend ---
    try {
      // Send POST request to the registration endpoint
      // Axios automatically sets Content-Type to multipart/form-data for FormData
      await axios.post('http://localhost:5002/api/bowners/register', submissionData);

      setSuccess('Business registration successful! Redirecting to login...');
      setLoading(false); // Stop loading on success

      // Redirect to the appropriate login page after a delay
      setTimeout(() => {
        // ** IMPORTANT: Ensure '/Login' is your unified login route **
        // If you still have separate login pages, adjust this path (e.g., '/bowner-login')
        navigate('/Login');
      }, 2000); // 2-second delay

    } catch (err) {
      // --- Error Handling ---
      setLoading(false); // Stop loading indicator on error

      console.error("Registration failed!", err); // Log the full error

      // Extract and display user-friendly error message
      if (err.response) {
        console.error("Server Response:", err.response.status, err.response.data);
        setError(err.response.data?.message || `Server error (${err.response.status}). Please check details and try again.`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError('Network error: Could not reach the server. Please check your connection.');
      } else {
        console.error('Request Setup Error:', err.message);
        setError(`An unexpected error occurred: ${err.message}`);
    }
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="business-form-container"> {/* Ensure CSS class matches */}
      <h2 className="form-title">Business Owner Registration</h2>

      {/* Display Feedback Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* encType is handled by FormData/Axios */}
        {/* --- Form Input Fields --- */}

        <div className="form-group">
          <label htmlFor="businessId">Business ID*</label>
          <input type="text" id="businessId" name="businessId" value={formData.businessId} onChange={handleChange} placeholder="Enter Business Registration ID" required disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="businessName">Business Name*</label>
          <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter Official Business Name" required disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">Owner's Full Name*</label>
          <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter Owner's Full Name" required disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="address">Business Address*</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Business Address" rows="3" required disabled={loading}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number*</label>
          <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g., 07XXXXXXXX" required disabled={loading}/>
        </div>

        {/* District and Province side-by-side */}
        <div className="form-group horizontal">
          <div className="input-group">
             <label htmlFor="district">District*</label>
             <select id="district" name="district" value={formData.district} onChange={handleChange} required disabled={loading}>
               <option value="" disabled>Select District</option>
                {/* Add all Sri Lankan districts */}
                <option value="colombo">Colombo</option>
                <option value="gampaha">Gampaha</option>
                <option value="kalutara">Kalutara</option>
                <option value="kandy">Kandy</option>
                <option value="matale">Matale</option>
                <option value="nuwara-eliya">Nuwara Eliya</option>
                <option value="galle">Galle</option>
                <option value="matara">Matara</option>
                <option value="hambantota">Hambantota</option>
                <option value="jaffna">Jaffna</option>
                <option value="kilinochchi">Kilinochchi</option>
                <option value="mannar">Mannar</option>
                <option value="vavuniya">Vavuniya</option>
                <option value="mullaitivu">Mullaitivu</option>
                <option value="batticaloa">Batticaloa</option>
                <option value="ampara">Ampara</option>
                <option value="trincomalee">Trincomalee</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="puttalam">Puttalam</option>
                <option value="anuradhapura">Anuradhapura</option>
                <option value="polonnaruwa">Polonnaruwa</option>
                <option value="badulla">Badulla</option>
                <option value="monaragala">Monaragala</option>
                <option value="ratnapura">Ratnapura</option>
                <option value="kegalle">Kegalle</option>
             </select>
          </div>
          <div className="input-group">
             <label htmlFor="province">Province*</label>
             <select id="province" name="province" value={formData.province} onChange={handleChange} required disabled={loading}>
               <option value="" disabled>Select Province</option>
                {/* Add Sri Lankan provinces */}
                <option value="western">Western</option>
                <option value="central">Central</option>
                <option value="southern">Southern</option>
                <option value="northern">Northern</option>
                <option value="eastern">Eastern</option>
                <option value="north-western">North Western</option>
                <option value="north-central">North Central</option>
                <option value="uva">Uva</option>
                <option value="sabaragamuwa">Sabaragamuwa</option>
             </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address*</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Business Login Email" required disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password*</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a Secure Password (min 6 chars)" required minLength="6" disabled={loading}/>
        </div>

        {/* --- File Inputs with Previews --- */}
        <div className="form-group file-input-group">
          <label>Profile Photo (Optional)</label>
          {/* Hidden actual file input */}
          <input
            type="file"
            id="profilePhotoUpload"
            accept="image/jpeg, image/png, image/gif" // Be specific with accepted types
            onChange={handleProfilePhotoChange}
            style={{ display: 'none' }} // Hide the default input
            disabled={loading}
          />
          {/* Custom-styled button acting as the label */}
          <label htmlFor="profilePhotoUpload" className={`upload-button ${loading ? 'disabled' : ''}`}>
            {profilePhotoFile ? `Selected: ${profilePhotoFile.name}` : 'Choose Profile Photo'}
          </label>
          {/* Display preview if a profile preview URL exists */}
          {profilePreview && (
            <div className="image-preview-container">
              <img src={profilePreview} alt="Profile Preview" className="image-preview profile-preview" />
            </div>
           )}
        </div>

        <div className="form-group file-input-group">
          <label>Cover Photo (Optional)</label>
          {/* Hidden actual file input */}
          <input
            type="file"
            id="coverPhotoUpload"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleCoverPhotoChange}
            style={{ display: 'none' }} // Hide the default input
            disabled={loading}
            />
          {/* Custom-styled button acting as the label */}
          <label htmlFor="coverPhotoUpload" className={`upload-button ${loading ? 'disabled' : ''}`}>
            {coverPhotoFile ? `Selected: ${coverPhotoFile.name}` : 'Choose Cover Photo'}
          </label>
          {/* Display preview if a cover preview URL exists */}
          {coverPreview && (
            <div className="image-preview-container">
                <img src={coverPreview} alt="Cover Preview" className="image-preview cover-preview" />
            </div>
           )}
        </div>

        {/* --- Submit Button --- */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register Business'}
        </button>
      </form>
    </div>
  );
}

export default BOwnerForm;