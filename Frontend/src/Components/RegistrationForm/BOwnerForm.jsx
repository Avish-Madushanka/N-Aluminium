// src/Components/RegistrationForm/BOwnerForm.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Make sure path is correct
import API_ENDPOINTS from '../../apiConfig';     // Make sure path is correct
import { useNavigate } from 'react-router-dom';
import { FileImage, AlertCircle, Mail, Phone, Lock, Home, MapPin, User, Briefcase, Image, X } from 'lucide-react';
import './BOwnerForm.css'; // Your CSS

// --- CONFIGURATION CONSTANTS ---
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']; // Added 'image/jpg' for completeness

function BOwnerForm() {
  const [formData, setFormData] = useState({
    businessId: '',
    businessName: '',
    ownerName: '',
    address: '',
    contactNumber: '',
    district: '', // Consider setting a default like 'colombo' if appropriate
    province: '', // Consider setting a default like 'western'
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

  // --- MISSING HANDLER FUNCTIONS - RE-ADD THESE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError(''); // Clear general errors on input change

    // Basic inline validation example (can be expanded or moved to a separate validation function)
    if (name === "contactNumber") {
        if (value && !/^[0-9]{10}$/.test(value) && value.length <= 10) {
            // Temporarily set an error, or use a more sophisticated validation state per field
            // For now, we'll just clear the main error and let submit validation catch it
        }
    }
    if (name === "email") {
        // Basic email format check (can be improved)
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            // Similar to contact number, handle inline error display if desired
        }
    }
  };

  const handleFileChange = (e, setFileState, setPreviewState, currentPreviewUrl) => {
    const file = e.target.files?.[0] || null;
    setError(''); // Clear previous file errors

    // Revoke old URL if it exists
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    if (file) {
      // Client-side validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File "${file.name}" is too large. Max ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = null; // Reset file input
        setFileState(null);
        setPreviewState(null);
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError(`Invalid file type for "${file.name}". Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
        e.target.value = null; // Reset file input
        setFileState(null);
        setPreviewState(null);
        return;
      }

      setFileState(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewState(newPreviewUrl);
    } else {
      // If no file is selected (e.g., user cancels file dialog)
      setFileState(null);
      setPreviewState(null);
    }
  };

  const handleProfilePhotoChange = (e) => {
    handleFileChange(e, setProfilePhotoFile, setProfilePreview, profilePreview);
  };

  const handleCoverPhotoChange = (e) => {
    handleFileChange(e, setCoverPhotoFile, setCoverPreview, coverPreview);
  };

  const clearFile = (fileType) => {
    setError(''); // Clear any existing errors
    if (fileType === 'profile') {
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        setProfilePhotoFile(null);
        setProfilePreview(null);
        // Reset the file input element
        const profileInput = document.getElementById('profilePhotoUpload');
        if (profileInput) profileInput.value = null;
    } else if (fileType === 'cover') {
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverPhotoFile(null);
        setCoverPreview(null);
        // Reset the file input element
        const coverInput = document.getElementById('coverPhotoUpload');
        if (coverInput) coverInput.value = null;
    }
  };
  // --- END OF MISSING HANDLER FUNCTIONS ---

  // --- useEffect for revoking object URLs on unmount ---
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);


  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Frontend Validations
    const requiredFields = ['businessId', 'businessName', 'ownerName', 'address', 'contactNumber', 'district', 'province', 'email', 'password'];
    for (const field of requiredFields) {
        if (!formData[field] || String(formData[field]).trim() === '') {
            // Capitalize first letter of field name for user-friendly message
            const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            setError(`${fieldName} is required.`);
            return;
        }
    }
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
        setError("Contact number must be 10 digits.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    // Add other frontend validations if necessary

    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    if (profilePhotoFile) submissionData.append('profilePhoto', profilePhotoFile);
    if (coverPhotoFile) submissionData.append('coverPhoto', coverPhotoFile);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.BOWNERS.REGISTER, submissionData);
      
      if (response.data && response.data.success) {
        setSuccess('Business registration successful! Redirecting to login...');
        setFormData({ // Reset form
            businessId: '', businessName: '', ownerName: '', address: '', 
            contactNumber: '', district: '', province: '', email: '', password: '' 
        });
        clearFile('profile'); // Clear files and previews
        clearFile('cover');
        setLoading(false); // Set loading false before timeout
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle cases where API returns 2xx but success: false
        throw new Error(response.data?.message || 'Business registration failed: Unexpected server response.');
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error: Could not reach the server. Please check your connection.');
      } else {
        setError(err.message || `An unexpected error occurred.`);
      }
    }
    // No finally block needed for setLoading(false) as it's handled in try/catch
  };

  // --- JSX Rendering ---
  return (
    <div className="BR-business-form-container">
      <div className="BR-form-wrapper">
        <h2 className="BR-form-title">Business Owner Registration</h2>

        {error && (
          <div className="BR-error-message"> {/* Ensure this class is styled */}
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="BR-success-message"> {/* Ensure this class is styled */}
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Business ID Field */}
            <div className="BR-form-group" style={{"--index": 0}}>
                <label htmlFor="businessId">
                <Briefcase size={16} className="mr-1 inline" /> Business ID*
                </label>
                <input type="text" id="businessId" name="businessId" value={formData.businessId} 
                       onChange={handleChange} // Using re-added handleChange
                       placeholder="Enter Business Registration ID" required disabled={loading} />
            </div>

            {/* Business Name Field */}
            <div className="BR-form-group" style={{"--index": 1}}>
                <label htmlFor="businessName">
                <Briefcase size={16} className="mr-1 inline" /> Business Name*
                </label>
                <input type="text" id="businessName" name="businessName" value={formData.businessName} 
                       onChange={handleChange} 
                       placeholder="Enter Official Business Name" required disabled={loading} />
            </div>

            {/* Owner Name Field */}
            <div className="BR-form-group" style={{"--index": 2}}>
                <label htmlFor="ownerName">
                <User size={16} className="mr-1 inline" /> Owner's Full Name*
                </label>
                <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} 
                       onChange={handleChange} 
                       placeholder="Enter Owner's Full Name" required disabled={loading} />
            </div>

            {/* Business Address Field */}
            <div className="BR-form-group" style={{"--index": 3}}>
                <label htmlFor="address">
                <Home size={16} className="mr-1 inline" /> Business Address*
                </label>
                <textarea id="address" name="address" value={formData.address} 
                          onChange={handleChange} 
                          placeholder="Enter Full Business Address" rows="3" required disabled={loading}></textarea>
            </div>

            {/* Contact Number Field */}
            <div className="BR-form-group" style={{"--index": 4}}>
                <label htmlFor="contactNumber">
                <Phone size={16} className="mr-1 inline" /> Contact Number* (10 digits)
                </label>
                <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} 
                       onChange={handleChange} 
                       placeholder="e.g., 07XXXXXXXX" required pattern="[0-9]{10}" title="Please enter a 10-digit phone number" disabled={loading} />
            </div>

            {/* District and Province Fields */}
            <div className="BR-form-group BR-horizontal" style={{"--index": 5}}>
                <div className="BR-input-group">
                <label htmlFor="district">
                    <MapPin size={16} className="mr-1 inline" /> District*
                </label>
                <select id="district" name="district" value={formData.district} 
                        onChange={handleChange} 
                        required disabled={loading} >
                    <option value="" disabled>Select District</option>
                    <option value="colombo">Colombo</option><option value="gampaha">Gampaha</option><option value="kalutara">Kalutara</option><option value="kandy">Kandy</option><option value="matale">Matale</option><option value="nuwara-eliya">Nuwara Eliya</option><option value="galle">Galle</option><option value="matara">Matara</option><option value="hambantota">Hambantota</option><option value="jaffna">Jaffna</option><option value="kilinochchi">Kilinochchi</option><option value="mannar">Mannar</option><option value="vavuniya">Vavuniya</option><option value="mullaitivu">Mullaitivu</option><option value="batticaloa">Batticaloa</option><option value="ampara">Ampara</option><option value="trincomalee">Trincomalee</option><option value="kurunegala">Kurunegala</option><option value="puttalam">Puttalam</option><option value="anuradhapura">Anuradhapura</option><option value="polonnaruwa">Polonnaruwa</option><option value="badulla">Badulla</option><option value="monaragala">Monaragala</option><option value="ratnapura">Ratnapura</option><option value="kegalle">Kegalle</option>
                </select>
                </div>
                <div className="BR-input-group">
                <label htmlFor="province">
                    <MapPin size={16} className="mr-1 inline" /> Province*
                </label>
                <select id="province" name="province" value={formData.province} 
                        onChange={handleChange} 
                        required disabled={loading}>
                    <option value="" disabled>Select Province</option>
                     <option value="western">Western</option><option value="central">Central</option><option value="southern">Southern</option><option value="northern">Northern</option><option value="eastern">Eastern</option><option value="north-western">North Western</option><option value="north-central">North Central</option><option value="uva">Uva</option><option value="sabaragamuwa">Sabaragamuwa</option>
                </select>
                </div>
            </div>

            {/* Email Address Field */}
            <div className="BR-form-group" style={{"--index": 6}}>
                <label htmlFor="email">
                <Mail size={16} className="mr-1 inline" /> Email Address*
                </label>
                <input type="email" id="email" name="email" value={formData.email} 
                       onChange={handleChange} 
                       placeholder="Enter Business Login Email" required disabled={loading} />
            </div>

            {/* Password Field */}
            <div className="BR-form-group" style={{"--index": 7}}>
                <label htmlFor="password">
                <Lock size={16} className="mr-1 inline" /> Password*
                </label>
                <input type="password" id="password" name="password" value={formData.password} 
                       onChange={handleChange} 
                       placeholder="Create a Secure Password (min 6 chars)" required minLength="6" disabled={loading} />
            </div>


          {/* Profile Photo Upload */}
          <div className="BR-form-group BR-file-input-group" style={{"--index": 8}}>
            <label>
              <User size={16} className="mr-1 inline" /> Profile Photo (Optional)
            </label>
            <div className="BR-file-input-area">
                <input type="file" id="profilePhotoUpload" 
                       onChange={handleProfilePhotoChange} // Using re-added function
                       style={{ display: 'none' }} disabled={loading} accept={ALLOWED_IMAGE_TYPES.join(",")} />
                <label htmlFor="profilePhotoUpload" className={`BR-upload-button ${loading ? 'BR-disabled' : ''}`}>
                    <FileImage size={18} />
                    <span>{profilePhotoFile ? profilePhotoFile.name : 'Choose Profile Photo'}</span>
                </label>
                {profilePhotoFile && (
                    <button type="button" onClick={() => clearFile('profile')} className="BR-clear-file-btn" title="Clear profile photo" disabled={loading}>
                        <X size={16} />
                    </button>
                )}
            </div>
            {profilePreview ? (
              <div className="BR-image-preview-container">
                <img src={profilePreview} alt="Profile Preview" className="BR-profile-preview" />
              </div>
            ) : (
              <div className="BR-image-preview-container">
                <div className="BR-profile-preview BR-placeholder-preview">
                  <User size={36} color="#a0aec0" />
                </div>
              </div>
            )}
          </div>

          {/* Cover Photo Upload */}
          <div className="BR-form-group BR-file-input-group" style={{"--index": 9}}>
            <label>
              <Image size={16} className="mr-1 inline" /> Cover Photo (Optional)
            </label>
            <div className="BR-file-input-area">
                <input type="file" id="coverPhotoUpload" 
                       onChange={handleCoverPhotoChange} // Using re-added function
                       style={{ display: 'none' }} disabled={loading} accept={ALLOWED_IMAGE_TYPES.join(",")} />
                <label htmlFor="coverPhotoUpload" className={`BR-upload-button ${loading ? 'BR-disabled' : ''}`}>
                    <FileImage size={18} />
                    <span>{coverPhotoFile ? coverPhotoFile.name : 'Choose Cover Photo'}</span>
                </label>
                {coverPhotoFile && (
                    <button type="button" onClick={() => clearFile('cover')} className="BR-clear-file-btn" title="Clear cover photo" disabled={loading}>
                        <X size={16} />
                    </button>
                )}
            </div>
            {coverPreview ? (
              <div className="BR-image-preview-container">
                <img src={coverPreview} alt="Cover Preview" className="BR-cover-preview" />
              </div>
            ) : (
              <div className="BR-image-preview-container">
                <div className="BR-cover-preview BR-placeholder-preview" style={{ height: "100px" }}>
                  <Image size={36} color="#a0aec0" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="BR-submit-button" disabled={loading}>
            {loading ? (
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.25" strokeWidth="4" fill="none"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
             ) : ( 'Register Business' )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BOwnerForm;