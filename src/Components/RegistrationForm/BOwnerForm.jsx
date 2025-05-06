// src/Components/RegistrationForm/BOwnerForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileImage, AlertCircle, Mail, Phone, Lock, Home, MapPin, User, Briefcase, Image } from 'lucide-react';
import './BOwnerForm.css';

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
    }
    setFileState(file);
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewState(newPreviewUrl);
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
      }
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
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
    <div className="BR-business-form-container">
      <div className="BR-form-wrapper">
        <h2 className="BR-form-title">Business Owner Registration</h2>

        {/* Display Feedback Messages */}
        {error && (
          <div className="BR-error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="BR-success-message">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Business ID Field */}
          <div className="BR-form-group" style={{"--index": 0}}>
            <label htmlFor="businessId">
              <Briefcase size={16} className="mr-1 inline" />
              Business ID*
            </label>
            <input 
              type="text" 
              id="businessId" 
              name="businessId" 
              value={formData.businessId} 
              onChange={handleChange} 
              placeholder="Enter Business Registration ID" 
              required 
              disabled={loading}
            />
          </div>

          {/* Business Name Field */}
          <div className="BR-form-group" style={{"--index": 1}}>
            <label htmlFor="businessName">
              <Briefcase size={16} className="mr-1 inline" />
              Business Name*
            </label>
            <input 
              type="text" 
              id="businessName" 
              name="businessName" 
              value={formData.businessName} 
              onChange={handleChange} 
              placeholder="Enter Official Business Name" 
              required 
              disabled={loading}
            />
          </div>

          {/* Owner Name Field */}
          <div className="BR-form-group" style={{"--index": 2}}>
            <label htmlFor="ownerName">
              <User size={16} className="mr-1 inline" />
              Owner's Full Name*
            </label>
            <input 
              type="text" 
              id="ownerName" 
              name="ownerName" 
              value={formData.ownerName} 
              onChange={handleChange} 
              placeholder="Enter Owner's Full Name" 
              required 
              disabled={loading}
            />
          </div>

          {/* Business Address Field */}
          <div className="BR-form-group" style={{"--index": 3}}>
            <label htmlFor="address">
              <Home size={16} className="mr-1 inline" />
              Business Address*
            </label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Enter Full Business Address" 
              rows="3" 
              required 
              disabled={loading}
            ></textarea>
          </div>

          {/* Contact Number Field */}
          <div className="BR-form-group" style={{"--index": 4}}>
            <label htmlFor="contactNumber">
              <Phone size={16} className="mr-1 inline" />
              Contact Number*
            </label>
            <input 
              type="tel" 
              id="contactNumber" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange} 
              placeholder="e.g., 07XXXXXXXX" 
              required 
              disabled={loading}
            />
          </div>

          {/* District and Province Fields */}
          <div className="BR-form-group BR-horizontal" style={{"--index": 5}}>
            <div className="BR-input-group">
              <label htmlFor="district">
                <MapPin size={16} className="mr-1 inline" />
                District*
              </label>
              <select 
                id="district" 
                name="district" 
                value={formData.district} 
                onChange={handleChange} 
                required 
                disabled={loading}
              >
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
            <div className="BR-input-group">
              <label htmlFor="province">
                <MapPin size={16} className="mr-1 inline" />
                Province*
              </label>
              <select 
                id="province" 
                name="province" 
                value={formData.province} 
                onChange={handleChange} 
                required 
                disabled={loading}
              >
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

          {/* Email Address Field */}
          <div className="BR-form-group" style={{"--index": 6}}>
            <label htmlFor="email">
              <Mail size={16} className="mr-1 inline" />
              Email Address*
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter Business Login Email" 
              required 
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="BR-form-group" style={{"--index": 7}}>
            <label htmlFor="password">
              <Lock size={16} className="mr-1 inline" />
              Password*
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a Secure Password (min 6 chars)" 
              required 
              minLength="6" 
              disabled={loading}
            />
          </div>

          {/* Profile Photo Upload */}
          <div className="BR-form-group BR-file-input-group" style={{"--index": 8}}>
            <label>
              <User size={16} className="mr-1 inline" />
              Profile Photo (Optional)
            </label>
            <input
              type="file"
              id="profilePhotoUpload"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleProfilePhotoChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <label htmlFor="profilePhotoUpload" className={`BR-upload-button ${loading ? 'BR-disabled' : ''}`}>
              <FileImage size={18} />
              <span>{profilePhotoFile ? profilePhotoFile.name : 'Choose Profile Photo'}</span>
            </label>
            {profilePreview ? (
              <div className="BR-image-preview-container">
                <img src={profilePreview} alt="Profile Preview" className="BR-profile-preview" />
              </div>
            ) : (
              <div className="BR-image-preview-container">
                <div className="BR-profile-preview" style={{ 
                  backgroundColor: "#e2e8f0", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <User size={36} color="#a0aec0" />
                </div>
              </div>
            )}
          </div>

          {/* Cover Photo Upload */}
          <div className="BR-form-group BR-file-input-group" style={{"--index": 9}}>
            <label>
              <Image size={16} className="mr-1 inline" />
              Cover Photo (Optional)
            </label>
            <input
              type="file"
              id="coverPhotoUpload"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleCoverPhotoChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <label htmlFor="coverPhotoUpload" className={`BR-upload-button ${loading ? 'BR-disabled' : ''}`}>
              <FileImage size={18} />
              <span>{coverPhotoFile ? coverPhotoFile.name : 'Choose Cover Photo'}</span>
            </label>
            {coverPreview ? (
              <div className="BR-image-preview-container">
                <img src={coverPreview} alt="Cover Preview" className="BR-cover-preview" />
              </div>
            ) : (
              <div className="BR-image-preview-container">
                <div className="BR-cover-preview" style={{ 
                  height: "100px",
                  backgroundColor: "#e2e8f0", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  borderRadius: "8px" 
                }}>
                  <Image size={36} color="#a0aec0" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="BR-submit-button" disabled={loading}>
            {loading ? (
              <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" />
              </svg>
            ) : (
              'Register Business'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BOwnerForm;