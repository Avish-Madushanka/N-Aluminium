import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileImage, AlertCircle, Mail, Phone, Lock, Home, MapPin, User } from 'lucide-react';
import './ClientForm.css';

// API Configuration
const API_ENDPOINTS = {
  CLIENT: {
    REGISTER: 'http://localhost:5003/api/clients/register'
  }
};

// Validation patterns
const VALIDATION = {
  NAME: /^[a-zA-Z\s]{3,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
};

const ClientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: 'colombo',
    province: 'western'
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    };
  }, [profilePhotoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if the field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (!VALIDATION.NAME.test(value)) error = 'Name should be 3-50 characters with letters only';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!VALIDATION.EMAIL.test(value)) error = 'Please enter a valid email';
        break;
      case 'contactNumber':
        if (!value.trim()) error = 'Contact number is required';
        else if (!VALIDATION.PHONE.test(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (!VALIDATION.PASSWORD.test(value)) error = 'Password must be at least 6 characters with uppercase, lowercase and number';
        break;
      case 'confirmPassword':
        if (!value.trim()) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.length < 10) error = 'Address should be at least 10 characters';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'district' && key !== 'province') {
        const fieldValid = validateField(key, formData[key]);
        if (!fieldValid) isValid = false;
      }
    });

    // Validate profile photo if uploaded
    if (profilePhoto) {
      if (!profilePhoto.type.startsWith('image/')) {
        newErrors.profilePhoto = 'Only image files are allowed';
        isValid = false;
      } else if (profilePhoto.size > 5 * 1024 * 1024) {
        newErrors.profilePhoto = 'File size must be less than 5MB';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setErrors(prev => ({ ...prev, profilePhoto: '' }));

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePhoto: 'Only image files are allowed (JPEG, PNG, GIF)' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePhoto: 'File size must be less than 5MB' }));
      return;
    }

    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, value);
        }
      });
      
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post(
        API_ENDPOINTS.CLIENT.REGISTER,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 10000
        }
      );

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - server took too long to respond';
    } else if (err.response) {
      // Server responded with error status
      const { data } = err.response;
      errorMessage = data.message || `Server error: ${err.response.status}`;
      
      // Handle field-specific errors from server
      if (data.errors) {
        const serverErrors = {};
        data.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
        return;
      }
    } else if (err.request) {
      // No response received
      errorMessage = 'No response from server - check your network connection';
    } else {
      // Other errors
      errorMessage = err.message;
    }
    
    setErrors({ form: errorMessage });
  };

  return (
    <div className="client-form-container">
      <div className="form-header">
        <h2 className="form-title1">Client Registration</h2>
      </div>
      
      {/* Form Error Message */}
      {errors.form && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{errors.form}</span>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className="form-group" style={{"--index": 0}}>
          <label className="form-label">
            <User size={16} className="mr-1 inline" />
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={loading}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Email Field */}
        <div className="form-group" style={{"--index": 1}}>
          <label className="form-label">
            <Mail size={16} className="mr-1 inline" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={loading}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email address"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Contact Number */}
        <div className="form-group" style={{"--index": 2}}>
          <label className="form-label">
            <Phone size={16} className="mr-1 inline" />
            Contact Number *
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={loading}
            className={`form-input ${errors.contactNumber ? 'input-error' : ''}`}
            placeholder="Enter your contact number"
          />
          {errors.contactNumber && <div className="error-message">{errors.contactNumber}</div>}
        </div>

        {/* Password Fields */}
        <div className="form-grid">
          <div className="form-group" style={{"--index": 3}}>
            <label className="form-label">
              <Lock size={16} className="mr-1 inline" />
              Password (min 6 chars) *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              minLength="6"
              disabled={loading}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a secure password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group" style={{"--index": 4}}>
            <label className="form-label">
              <Lock size={16} className="mr-1 inline" />
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
        </div>

        {/* Address */}
        <div className="form-group" style={{"--index": 5}}>
          <label className="form-label">
            <Home size={16} className="mr-1 inline" />
            Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={loading}
            rows="3"
            className={`form-textarea ${errors.address ? 'input-error' : ''}`}
            placeholder="Enter your complete address"
          />
          {errors.address && <div className="error-message">{errors.address}</div>}
        </div>

        {/* District and Province */}
        <div className="form-grid">
          <div className="form-group" style={{"--index": 6}}>
            <label className="form-label">
              <MapPin size={16} className="mr-1 inline" />
              District *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-select"
            >
              <option value="colombo">Colombo</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
              <option value="matara">Matara</option>
              <option value="jaffna">Jaffna</option>
              <option value="batticaloa">Batticaloa</option>
              <option value="anuradhapura">Anuradhapura</option>
            </select>
          </div>

          <div className="form-group" style={{"--index": 7}}>
            <label className="form-label">
              <MapPin size={16} className="mr-1 inline" />
              Province *
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-select"
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
            </select>
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="form-group" style={{"--index": 8}}>
          <label className="form-label">Profile Photo</label>
          <div className="profile-upload-container">
            {profilePhotoPreview ? (
              <img 
                src={profilePhotoPreview} 
                alt="Preview" 
                className="profile-preview"
              />
            ) : (
              <div className="profile-preview" style={{ 
                backgroundColor: "#e2e8f0", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <User size={36} color="#a0aec0" />
              </div>
            )}
            <label className="upload-button1">
              <FileImage size={18} />
              <span>{profilePhoto ? profilePhoto.name : 'Choose Image'}</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
          {errors.profilePhoto && <div className="error-message">{errors.profilePhoto}</div>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? (
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" />
            </svg>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default ClientForm;