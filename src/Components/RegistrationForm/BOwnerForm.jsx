import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed and setup
import './BOwnerForm.css'; // Ensure this CSS file exists at the correct relative path

function BOwnerForm() {
  // State for form data fields
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
  // State to hold the actual File objects
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  // State for temporary preview URLs generated from files
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  // State for loading and feedback messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // --- Event Handlers ---

  // Handles changes in text inputs, textareas, and selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Generic file input change handler
  const handleFileChange = (e, setFileState, setPreviewState, currentPreviewUrl) => {
    const file = e.target.files?.[0] || null; // Get the first file selected, or null
    setFileState(file); // Store the File object

    // Revoke the previous object URL to prevent memory leaks
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    // Create a new object URL for preview if a file is selected
    if (file) {
      setPreviewState(URL.createObjectURL(file));
    } else {
      setPreviewState(null); // Clear preview if no file is selected/file is removed
    }
  };

  // Specific handlers using the generic one
      const handleProfilePhotoChange = (e) => {
        handleFileChange(e, setProfilePhotoFile, setProfilePreview, profilePreview);
      };

      const handleCoverPhotoChange = (e) => {
        handleFileChange(e, setCoverPhotoFile, setCoverPreview, coverPreview);
      };

      // --- Lifecycle Effect for Cleanup ---

      // Clean up object URLs when the component unmounts or previews change
      useEffect(() => {
        return () => {
          if (profilePreview) {
            URL.revokeObjectURL(profilePreview);
          }
          if (coverPreview) {
            URL.revokeObjectURL(coverPreview);
          }
        };
      }, [profilePreview, coverPreview]); // Dependencies ensure cleanup if previews are replaced


      // --- Form Submission Logic ---
      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setLoading(true);
        setError('');
        setSuccess('');

        const submissionData = new FormData();
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]); // Append text/select data
      });
      if (profilePhotoFile) {
        submissionData.append('profilePhoto', profilePhotoFile); // Append profile photo if exists
      }
      if (coverPhotoFile) {
        submissionData.append('coverPhoto', coverPhotoFile);     // Append cover photo if exists
      }

      // --- API Call ---
      try {
        // Send POST request to backend registration endpoint
        await axios.post('http://localhost:5002/api/bowners/register', submissionData);
        // Note: No need to explicitly set 'Content-Type': 'multipart/form-data', Axios handles it for FormData

        setSuccess('Business registration successful! Redirecting to login...');

        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate('/bowner-login'); // **IMPORTANT: Verify '/bowner-login' is the correct route path**
        }, 1500); // 1.5 second delay

      } catch (err) {
        // --- Error Handling ---
        setLoading(false); // Stop loading indicator on error

        // Log detailed error info
        console.error("Registration failed!");
        if (err.response) {
          // Server responded with a status code outside the 2xx range
          console.error("Server Response:", err.response.status, err.response.data);
          setError(err.response.data?.message || `Server error (${err.response.status}). Please try again.`);
        } else if (err.request) {
          // Request was made but no response received
          console.error("No response received:", err.request);
          setError('Network error: Could not reach the server. Please check connection.');
        } else {
          // Error occurred in setting up the request
          console.error('Request Setup Error:', err.message);
          setError(`An unexpected error occurred: ${err.message}`);
      }
    }
    // No setLoading(false) in the success path as navigation will unmount the component
  };

  // --- JSX Rendering ---
  return (
    <div className="business-form-container">
      <h2 className="form-title">Business Registration Form</h2>

            {/* Display Feedback Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* --- Form Inputs --- */}
          <div className="form-group">
            <label htmlFor="businessId">Business ID</label>
            <input type="text" id="businessId" name="businessId" value={formData.businessId} onChange={handleChange} placeholder="Enter Business Registration ID" required disabled={loading}/>
          </div>

          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter Business Name" required disabled={loading}/>
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Owner Name</label>
            <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter Owner's Full Name" required disabled={loading}/>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Business Address" rows="4" required disabled={loading}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter Contact Number" required disabled={loading}/>
          </div>

          <div className="form-group horizontal">
            <div>
              <label htmlFor="district">District</label>
              <select id="district" name="district" value={formData.district} onChange={handleChange} required disabled={loading}>
                <option value="">Select District</option>
                {/* Add all options... */}
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
            <div>
              <label htmlFor="province">Province</label>
              <select id="province" name="province" value={formData.province} onChange={handleChange} required disabled={loading}>
                <option value="">Select Province</option>
                {/* Add all options... */}
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
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Business Email" required disabled={loading}/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a Password (min 6 chars)" required minLength="6" disabled={loading}/>
          </div>

          {/* File Inputs with Previews */}
          <div className="form-group">
            <label>Profile Photo</label>
            <input type="file" id="profilePhotoUpload" accept="image/*" onChange={handleProfilePhotoChange} style={{ display: 'none' }} disabled={loading}/>
            <label htmlFor="profilePhotoUpload" className={`upload-button ${loading ? 'disabled' : ''}`}>
              {profilePhotoFile ? profilePhotoFile.name : 'Choose Profile Photo'}
            </label>
            {profilePreview && <img src={profilePreview} alt="Profile Preview" className="uploaded-image" />}
          </div>

          <div className="form-group">
            <label>Cover Photo</label>
            <input type="file" id="coverPhotoUpload" accept="image/*" onChange={handleCoverPhotoChange} style={{ display: 'none' }} disabled={loading}/>
            <label htmlFor="coverPhotoUpload" className={`upload-button ${loading ? 'disabled' : ''}`}>
              {coverPhotoFile ? coverPhotoFile.name : 'Choose Cover Photo'}
            </label>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="uploaded-image" />}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
  );
}

export default BOwnerForm;