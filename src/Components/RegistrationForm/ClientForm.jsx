import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileImage, AlertCircle, Mail, Phone, Lock, Home, MapPin, User } from 'lucide-react';
import './ClientForm.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';
const API_ENDPOINTS = {
  CLIENT: {
    REGISTER: `${API_BASE_URL}/api/clients/register`
  }
};

const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s]{3,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
};

const ClientForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', contactNumber: '', password: '', // confirmPassword removed
    address: '', district: 'colombo', province: 'western'
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    };
  }, [profilePhotoPreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      validateSingleField(name, value); // No passwordToCompare needed now
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
    validateSingleField(name, value); // No passwordToCompare needed now
  };

  const validateSingleField = (name, value) => { // passwordToCompare removed
    let fieldError = '';
    const trimmedValue = typeof value === 'string' ? value.trim() : '';

    switch (name) {
      case 'name':
        if (!trimmedValue) fieldError = 'Name is required.';
        else if (!VALIDATION_PATTERNS.NAME.test(trimmedValue)) fieldError = 'Name must be 3-50 letters and spaces only.';
        break;
      case 'email':
        if (!trimmedValue) fieldError = 'Email is required.';
        else if (!VALIDATION_PATTERNS.EMAIL.test(trimmedValue)) fieldError = 'Please enter a valid email address.';
        break;
      case 'contactNumber':
        if (!trimmedValue) fieldError = 'Contact number is required.';
        else if (!VALIDATION_PATTERNS.PHONE.test(trimmedValue)) fieldError = 'Enter a 10-digit phone number.';
        break;
      case 'password':
        if (!value) fieldError = 'Password is required.';
        else if (!VALIDATION_PATTERNS.PASSWORD.test(value)) fieldError = 'Password: min 6 chars, with uppercase, lowercase, and number.';
        break;
      // case 'confirmPassword': // REMOVED
      //   if (!value) fieldError = 'Please confirm your password.';
      //   else if (value !== passwordToCompare) fieldError = 'Passwords do not match.';
      //   break;
      case 'address':
        if (!trimmedValue) fieldError = 'Address is required.';
        else if (trimmedValue.length < 10) fieldError = 'Address must be at least 10 characters.';
        break;
      case 'district':
        if (!value) fieldError = 'District is required.';
        break;
      case 'province':
        if (!value) fieldError = 'Province is required.';
        break;
      default: break;
    }
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
      form: (prev.form && !fieldError && Object.values(prev).filter((v, k) => k !== name && typeof v === 'string' && v).length === 0) ? '' : prev.form
    }));
    return !fieldError;
  };

  const fullyValidateForm = () => {
    let isFormValid = true;
    const currentClientSideErrors = {};

    for (const key in formData) {
      // Skip confirmPassword as it's no longer in formData state
      if (Object.prototype.hasOwnProperty.call(formData, key) && key !== 'confirmPassword') {
        let fieldError = '';
        const value = formData[key];
        const trimmedValue = typeof value === 'string' ? value.trim() : '';
        switch (key) {
          case 'name':
            if (!trimmedValue) fieldError = 'Name is required.';
            else if (!VALIDATION_PATTERNS.NAME.test(trimmedValue)) fieldError = 'Name must be 3-50 letters and spaces only.';
            break;
          case 'email':
            if (!trimmedValue) fieldError = 'Email is required.';
            else if (!VALIDATION_PATTERNS.EMAIL.test(trimmedValue)) fieldError = 'Please enter a valid email address.';
            break;
          case 'contactNumber':
            if (!trimmedValue) fieldError = 'Contact number is required.';
            else if (!VALIDATION_PATTERNS.PHONE.test(trimmedValue)) fieldError = 'Enter a 10-digit phone number.';
            break;
          case 'password':
            if (!value) fieldError = 'Password is required.';
            else if (!VALIDATION_PATTERNS.PASSWORD.test(value)) fieldError = 'Password: min 6 chars, with uppercase, lowercase, and number.';
            break;
          // confirmPassword case removed
          case 'address':
            if (!trimmedValue) fieldError = 'Address is required.';
            else if (trimmedValue.length < 10) fieldError = 'Address must be at least 10 characters.';
            break;
          case 'district':
            if (!value) fieldError = 'District is required.';
            break;
          case 'province':
            if (!value) fieldError = 'Province is required.';
            break;
          default: break;
        }
        if (fieldError) {
          currentClientSideErrors[key] = fieldError;
          isFormValid = false;
        }
      }
    }
    if (profilePhoto) {
      if (!profilePhoto.type.startsWith('image/')) {
        currentClientSideErrors.profilePhoto = 'Only image files (JPEG, PNG, GIF) are allowed.';
        isFormValid = false;
      } else if (profilePhoto.size > 5 * 1024 * 1024) {
        currentClientSideErrors.profilePhoto = 'Image size must be less than 5MB.';
        isFormValid = false;
      }
    }
    setErrors(currentClientSideErrors);
    return isFormValid;
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    setProfilePhotoPreview(null);
    setProfilePhoto(null);
    setErrors(prev => ({ ...prev, profilePhoto: '' }));

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePhoto: 'Invalid file type. Please select an image (JPEG, PNG, GIF).' }));
      e.target.value = null;
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePhoto: 'Image is too large (max 5MB).' }));
      e.target.value = null;
      return;
    }
    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouchedFields(allTouched);

    if (!fullyValidateForm()) {
      setIsLoading(false);
      setErrors(prev => ({ ...prev, form: 'Please correct the errors highlighted below.' }));
      return;
    }

    const clientData = new FormData();
    // Iterate over formData which no longer contains confirmPassword
    for (const key in formData) {
        clientData.append(key, formData[key]);
    }
    if (profilePhoto) {
      clientData.append('profilePhoto', profilePhoto);
    }

    try {
      await axios.post(API_ENDPOINTS.CLIENT.REGISTER, clientData, { timeout: 20000 });
      setSuccessMessage('Registration successful! Redirecting to login...');
      setFormData({ // Reset form
        name: '', email: '', contactNumber: '', password: '',
        address: '', district: 'colombo', province: 'western'
      });
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
      setProfilePhoto(null); setProfilePhotoPreview(null);
      setTouchedFields({}); setErrors({});
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    let topLevelFormError = 'An unexpected error occurred. Please try again.';
    const newErrorsFromServer = {};
    console.error("--- ClientForm.jsx: handleApiError ---");
    console.error("Full error object from Axios:", error);
    if (error.isAxiosError) {
        console.error("Axios error config:", error.config);
        console.error("Axios error code:", error.code);
        console.error("Axios error request object:", error.request);
    }
    if (error.response) {
        console.error("Axios error.response object (raw response from server):", error.response);
        console.error("Backend Response Status:", error.response.status);
        console.error("Backend Response Headers:", error.response.headers);
        console.error("Backend Response Data (error.response.data):", error.response.data);
    } else if (error.request) {
        console.error("No response received from server (error.request):", error.request);
    } else {
        console.error("Error setting up request or other client-side error (error.message):", error.message);
    }

    if (error.code === 'ECONNABORTED') {
      topLevelFormError = 'Request timed out. The server took too long to respond.';
    } else if (error.response) {
      const { data, status } = error.response;
      topLevelFormError = data?.error || data?.message || `Server Error (${status}). Please check your input.`;
      if (data?.errors && typeof data.errors === 'object') {
        console.log("Server-side validation errors object (data.errors) received:", data.errors);
        for (const fieldKey in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, fieldKey)) {
            const errorDetail = data.errors[fieldKey];
            if (typeof errorDetail === 'string') {
              newErrorsFromServer[fieldKey] = errorDetail;
            } else if (errorDetail?.message && typeof errorDetail.message === 'string') {
              newErrorsFromServer[fieldKey] = errorDetail.message;
            }
          }
        }
      } else {
        console.log("No 'errors' object from server in response data, or it's not an object.");
      }
    } else if (error.request) {
      topLevelFormError = 'No response from the server. It might be down or there is a network issue.';
    } else {
      topLevelFormError = error.message || topLevelFormError;
    }

    if (Object.keys(newErrorsFromServer).length > 0) {
        setErrors(newErrorsFromServer);
        setErrors(prev => ({...prev, form: 'Please correct the server-flagged errors below.'}));
    } else {
        setErrors({ form: topLevelFormError });
    }
  };

  return (
    <div className="client-form-container">
      <div className="form-header">
        <h2 className="form-title1">Client Registration</h2>
      </div>

      {errors.form && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{errors.form}</span>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className="form-group" style={{ "--index": 0 }}>
          <label htmlFor="name" className="form-label">
            <User size={16} className="mr-1 inline" /> Full Name *
          </label>
          <input
            id="name" type="text" name="name" value={formData.name}
            onChange={handleInputChange} onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <div id="name-error" className="error-message">{errors.name}</div>}
        </div>

        {/* Email Field */}
        <div className="form-group" style={{ "--index": 1 }}>
          <label htmlFor="email" className="form-label">
            <Mail size={16} className="mr-1 inline" /> Email *
          </label>
          <input
            id="email" type="email" name="email" value={formData.email}
            onChange={handleInputChange} onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="your.email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <div id="email-error" className="error-message">{errors.email}</div>}
        </div>

        {/* Contact Number */}
        <div className="form-group" style={{ "--index": 2 }}>
          <label htmlFor="contactNumber" className="form-label">
            <Phone size={16} className="mr-1 inline" /> Contact Number *
          </label>
          <input
            id="contactNumber" type="tel" name="contactNumber" value={formData.contactNumber}
            onChange={handleInputChange} onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`form-input ${errors.contactNumber ? 'input-error' : ''}`}
            placeholder="07xxxxxxxx"
            aria-invalid={!!errors.contactNumber}
            aria-describedby={errors.contactNumber ? "contactNumber-error" : undefined}
          />
          {errors.contactNumber && <div id="contactNumber-error" className="error-message">{errors.contactNumber}</div>}
        </div>

        {/* Password Field (Confirm Password Removed) */}
        <div className="form-group" style={{ "--index": 3 }}> {/* Adjusted grid index */}
            <label htmlFor="password" className="form-label">
              <Lock size={16} className="mr-1 inline" /> Password *
            </label>
            <input
              id="password" type="password" name="password" value={formData.password}
              onChange={handleInputChange} onBlur={handleInputBlur}
              required disabled={isLoading}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && <div id="password-error" className="error-message">{errors.password}</div>}
        </div>

        {/* Confirm Password Input Field REMOVED from JSX */}

        {/* Address */}
        <div className="form-group" style={{ "--index": 5 }}> {/* Adjusted grid index if needed */}
          <label htmlFor="address" className="form-label">
            <Home size={16} className="mr-1 inline" /> Address *
          </label>
          <textarea
            id="address" name="address" value={formData.address}
            onChange={handleInputChange} onBlur={handleInputBlur}
            required disabled={isLoading} rows="3"
            className={`form-textarea ${errors.address ? 'input-error' : ''}`}
            placeholder="Enter your full street address"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {errors.address && <div id="address-error" className="error-message">{errors.address}</div>}
        </div>

        {/* District and Province Grid */}
        <div className="form-grid">
          <div className="form-group" style={{ "--index": 6 }}>
            <label htmlFor="district" className="form-label">
              <MapPin size={16} className="mr-1 inline" /> District *
            </label>
            <select
              id="district" name="district" value={formData.district}
              onChange={handleInputChange} onBlur={handleInputBlur}
              required disabled={isLoading}
              className={`form-select ${errors.district ? 'input-error' : ''}`}
              aria-invalid={!!errors.district}
              aria-describedby={errors.district ? "district-error" : undefined}
            >
              <option value="colombo">Colombo</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
              <option value="matara">Matara</option>
              <option value="jaffna">Jaffna</option>
              <option value="batticaloa">Batticaloa</option>
              <option value="anuradhapura">Anuradhapura</option>
              <option value="other">Other</option>
            </select>
            {errors.district && <div id="district-error" className="error-message">{errors.district}</div>}
          </div>

          <div className="form-group" style={{ "--index": 7 }}>
            <label htmlFor="province" className="form-label">
              <MapPin size={16} className="mr-1 inline" /> Province *
            </label>
            <select
              id="province" name="province" value={formData.province}
              onChange={handleInputChange} onBlur={handleInputBlur}
              required disabled={isLoading}
              className={`form-select ${errors.province ? 'input-error' : ''}`}
              aria-invalid={!!errors.province}
              aria-describedby={errors.province ? "province-error" : undefined}
            >
              <option value="western">Western</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              <option value="northern">Northern</option>
              <option value="eastern">Eastern</option>
              <option value="north-western">North Western</option>
              <option value="north-central">North Central</option>
              <option value="uva">Uva</option>
              <option value="sabaragamuwa">Sabaragamuwa</option>
              <option value="other">Other</option>
            </select>
            {errors.province && <div id="province-error" className="error-message">{errors.province}</div>}
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="form-group" style={{ "--index": 8 }}>
          <label className="form-label">Profile Photo (Optional)</label>
          <div className="profile-upload-container">
            {profilePhotoPreview ? (
              <img src={profilePhotoPreview} alt="Profile Preview" className="profile-preview"/>
            ) : (
              <div className="profile-preview-placeholder">
                <User size={36} color="#a0aec0" />
              </div>
            )}
            <label htmlFor="profilePhotoFile" className="upload-button1">
              <FileImage size={18} />
              <span>{profilePhoto ? profilePhoto.name : 'Choose Image'}</span>
            </label>
            <input
              id="profilePhotoFile"
              type="file"
              onChange={handleProfilePhotoChange}
              accept="image/png, image/jpeg, image/gif"
              className="hidden-file-input"
              disabled={isLoading}
              aria-describedby={errors.profilePhoto ? "profilePhoto-error" : undefined}
            />
          </div>
          {errors.profilePhoto && <div id="profilePhoto-error" className="error-message">{errors.profilePhoto}</div>}
        </div>

        <button type="submit" disabled={isLoading} className="submit-button1">
          {isLoading ? (
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
             <path d="M12 2C6.47715 2 2 6.47715 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" />
            </svg>
          ) : 'Register Account'}
        </button>
      </form>
    </div>
  );
};

export default ClientForm;