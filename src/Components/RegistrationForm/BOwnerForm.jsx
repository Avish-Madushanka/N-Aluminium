// src/Components/RegistrationForm/BOwnerForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after success
import './BOwnerForm.css'; // Ensure this CSS file matches the updated class names

function BOwnerForm() {
  // --- State Management ---
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
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e, setFileState, setPreviewState, currentPreviewUrl) => {
    const file = e.target.files?.[0] || null;
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
      console.log("Revoked previous preview URL:", currentPreviewUrl);
    }
    setFileState(file);
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewState(newPreviewUrl);
      console.log("Created new preview URL:", newPreviewUrl);
    } else {
      setPreviewState(null);
    }
  };

  const handleProfilePhotoChange = (e) => {
    handleFileChange(e, setProfilePhotoFile, setProfilePreview, profilePreview);
  };

  const handleCoverPhotoChange = (e) => {
    handleFileChange(e, setCoverPhotoFile, setCoverPreview, coverPreview);
  };

  // --- Cleanup Effect ---
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
  }, [profilePreview, coverPreview]);

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    if (profilePhotoFile) submissionData.append('profilePhoto', profilePhotoFile);
    if (coverPhotoFile) submissionData.append('coverPhoto', coverPhotoFile);

    try {
      await axios.post('http://localhost:5003/api/bowners/register', submissionData);
      setSuccess('Business registration successful! Redirecting to login...');
      setLoading(false);
      setTimeout(() => navigate('/Login'), 2000);
    } catch (err) {
      setLoading(false);
      console.error("Registration failed!", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error (${err.response.status}). Please check details and try again.`);
      } else if (err.request) {
        setError('Network error: Could not reach the server. Please check your connection.');
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  // --- JSX Rendering ---
  return (
    // Container for the whole registration section
    <div className="BReg-business-form-container">
      {/* Wrapper for the form card itself */}
      <div className="BReg-form-wrapper">
        <h2 className="BReg-form-title">Business Owner Registration</h2>

        {/* Display Feedback Messages */}
        {error && <div className="BReg-error-message">{error}</div>}
        {success && <div className="BReg-success-message">{success}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* --- Form Input Fields --- */}

          <div className="BReg-form-group">
            <label htmlFor="businessId">Business ID*</label>
            <input type="text" id="businessId" name="businessId" value={formData.businessId} onChange={handleChange} placeholder="Enter Business Registration ID" required disabled={loading}/>
          </div>

          <div className="BReg-form-group">
            <label htmlFor="businessName">Business Name*</label>
            <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter Official Business Name" required disabled={loading}/>
          </div>

          <div className="BReg-form-group">
            <label htmlFor="ownerName">Owner's Full Name*</label>
            <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter Owner's Full Name" required disabled={loading}/>
          </div>

          <div className="BReg-form-group">
            <label htmlFor="address">Business Address*</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Business Address" rows="3" required disabled={loading}></textarea>
          </div>

          <div className="BReg-form-group">
            <label htmlFor="contactNumber">Contact Number*</label>
            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g., 07XXXXXXXX" required disabled={loading}/>
          </div>

          {/* District and Province side-by-side */}
          <div className="BReg-form-group BReg-horizontal">
            {/* Renamed inner div to input-group for clarity */}
            <div className="BReg-input-group">
               <label htmlFor="district">District*</label>
               <select id="district" name="district" value={formData.district} onChange={handleChange} required disabled={loading}>
                 <option value="" disabled>Select District</option>
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
            <div className="BReg-input-group">
               <label htmlFor="province">Province*</label>
               <select id="province" name="province" value={formData.province} onChange={handleChange} required disabled={loading}>
                 <option value="" disabled>Select Province</option>
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

          <div className="BReg-form-group">
            <label htmlFor="email">Email Address*</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Business Login Email" required disabled={loading}/>
          </div>

          <div className="BReg-form-group">
            <label htmlFor="password">Password*</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a Secure Password (min 6 chars)" required minLength="6" disabled={loading}/>
          </div>

          {/* --- File Inputs with Previews --- */}
          {/* Using BReg-form-group also for file inputs for consistent spacing */}
          <div className="BReg-form-group BReg-file-input-group">
            <label>Profile Photo (Optional)</label>
            <input
              type="file"
              id="profilePhotoUpload"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleProfilePhotoChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <label htmlFor="profilePhotoUpload" className={`BReg-upload-button ${loading ? 'BReg-disabled' : ''}`}>
              {profilePhotoFile ? `Selected: ${profilePhotoFile.name}` : 'Choose Profile Photo'}
            </label>
            {profilePreview && (
              <div className="BReg-image-preview-container">
                <img src={profilePreview} alt="Profile Preview" className="BReg-image-preview BReg-profile-preview" />
              </div>
             )}
          </div>

          <div className="BReg-form-group BReg-file-input-group">
            <label>Cover Photo (Optional)</label>
            <input
              type="file"
              id="coverPhotoUpload"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleCoverPhotoChange}
              style={{ display: 'none' }}
              disabled={loading}
              />
            <label htmlFor="coverPhotoUpload" className={`BReg-upload-button ${loading ? 'BReg-disabled' : ''}`}>
              {coverPhotoFile ? `Selected: ${coverPhotoFile.name}` : 'Choose Cover Photo'}
            </label>
            {coverPreview && (
              <div className="BReg-image-preview-container">
                  <img src={coverPreview} alt="Cover Preview" className="BReg-image-preview BReg-cover-preview" />
              </div>
             )}
          </div>

          {/* --- Submit Button --- */}
          {/* Needs to be inside the form */}
          <button type="submit" className="BReg-submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register Business'}
          </button>
        </form>
      </div> {/* End of BReg-form-wrapper */}
    </div> // End of BReg-business-form-container
  );
}

export default BOwnerForm;