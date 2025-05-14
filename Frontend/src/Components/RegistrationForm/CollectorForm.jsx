// src/Components/CollectForm/CollectForm.jsx
import React, { useState } from 'react';
import { AlertCircle, Mail, Phone, Lock, Home, User } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance'; // Ensure this path is correct
import API_ENDPOINTS from '../../api/apiConfig';   // Ensure this path is correct
import './CollectorForm.css';

const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s]{3,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
  ADDRESS_MIN_LENGTH: 10,
};

const CollectorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    password: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [formWideError, setFormWideError] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      validateSingleField(name, value);
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
    validateSingleField(name, value);
  };

  const validateSingleField = (name, value) => {
    let fieldError = '';
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    switch (name) {
      case 'name':
        if (!trimmedValue) fieldError = 'Name is required.';
        else if (!VALIDATION_PATTERNS.NAME.test(trimmedValue)) fieldError = 'Name must be 3-50 letters and spaces only.';
        break;
      case 'email':
        if (!trimmedValue) fieldError = 'Email is required.';
        else if (!VALIDATION_PATTERNS.EMAIL.test(trimmedValue)) fieldError = 'Please enter a valid email address.';
        break;
      case 'primaryPhone':
        if (!trimmedValue) fieldError = 'Primary phone number is required.';
        else if (!VALIDATION_PATTERNS.PHONE.test(trimmedValue)) fieldError = 'Enter a 10-digit phone number.';
        break;
      case 'secondaryPhone':
        if (trimmedValue && !VALIDATION_PATTERNS.PHONE.test(trimmedValue)) fieldError = 'Enter a 10-digit phone number.';
        break;
      case 'password':
        if (!value) fieldError = 'Password is required.';
        else if (!VALIDATION_PATTERNS.PASSWORD.test(value)) fieldError = 'Password: min 6 chars, with uppercase, lowercase, and number.';
        break;
      case 'address':
        if (!trimmedValue) fieldError = 'Address is required.';
        else if (trimmedValue.length < VALIDATION_PATTERNS.ADDRESS_MIN_LENGTH) fieldError = `Address must be at least ${VALIDATION_PATTERNS.ADDRESS_MIN_LENGTH} characters.`;
        break;
      default: break;
    }
    
    setErrors(prev => ({ ...prev, [name]: fieldError }));
    return !fieldError;
  };

  const fullyValidateForm = () => {
    let isFormValid = true;
    const currentFieldErrors = {};
    const allFieldsToTouch = {};

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        allFieldsToTouch[key] = true;
        if (!validateSingleField(key, formData[key])) {
          isFormValid = false;
        }
      }
    }
    setTouchedFields(allFieldsToTouch);
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setFormWideError(''); // Clear previous form-wide error
    setErrors({}); // Clear previous field errors

    if (!fullyValidateForm()) {
      setIsLoading(false);
      setFormWideError('Please correct the errors highlighted below.');
      return;
    }

    try {
      console.log('Submitting Collector Registration Data:', formData);
      // Ensure API_ENDPOINTS and the specific path are defined
      if (!API_ENDPOINTS?.COLLECTORS?.REGISTER) {
          console.error("API endpoint for collector registration is not defined in apiConfig.");
          setFormWideError("Configuration error: Cannot submit registration.");
          setIsLoading(false);
          return;
      }

      const response = await axiosInstance.post(API_ENDPOINTS.COLLECTORS.REGISTER, formData);

      if (response.data && response.data.success) {
        setSuccessMessage(response.data.message || 'Collector registration successful! Account may require verification.');
        // Reset form
        setFormData({ name: '', email: '', primaryPhone: '', secondaryPhone: '', password: '', address: '' });
        setTouchedFields({});
        setErrors({});
      } else {
        setFormWideError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Collector Registration Error:', err);
      if (err.response && err.response.data) {
        const serverErrorMessage = err.response.data.message || 'An unexpected error occurred.';
        // If the backend sends specific field errors, you can try to map them
        if (err.response.data.errors) {
          setErrors(prev => ({...prev, ...err.response.data.errors}));
          setFormWideError('Please correct the highlighted errors.');
        } else {
          setFormWideError(serverErrorMessage);
        }
      } else {
        setFormWideError('Network error or server is unreachable. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CollectReg-container">
      <div className="CollectReg-header">
        <h2 className="CollectReg-title">Collector Registration</h2>
      </div>

      {formWideError && (
        <div className="alert alert-error global-form-error" role="alert">
          <AlertCircle size={20} />
          <span>{formWideError}</span>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="CollectReg-form">
        {/* Name Field */}
        <div className="CollectReg-group" style={{ "--index": 0 }}>
          <label htmlFor="name" className="CollectReg-label">
            <User size={16} className="mr-1 inline" /> Full Name *
          </label>
          <input
            id="name" type="text" name="name" value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`CollectReg-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <div id="name-error" className="error-message">{errors.name}</div>}
        </div>

        {/* Email Field */}
        <div className="CollectReg-group" style={{ "--index": 1 }}>
          <label htmlFor="email" className="CollectReg-label">
            <Mail size={16} className="mr-1 inline" /> Email *
          </label>
          <input
            id="email" type="email" name="email" value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`CollectReg-input ${errors.email ? 'input-error' : ''}`}
            placeholder="your.email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <div id="email-error" className="error-message">{errors.email}</div>}
        </div>

        {/* Phone Numbers */}
        <div className="CollectReg-grid" style={{ "--index": 2 }}>
          <div className="CollectReg-group">
            <label htmlFor="primaryPhone" className="CollectReg-label">
              <Phone size={16} className="mr-1 inline" /> Primary Phone *
            </label>
            <input
              id="primaryPhone" type="tel" name="primaryPhone" value={formData.primaryPhone}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required disabled={isLoading}
              className={`CollectReg-input ${errors.primaryPhone ? 'input-error' : ''}`}
              placeholder="07xxxxxxxx"
              pattern="[0-9]{10}"
              aria-invalid={!!errors.primaryPhone}
              aria-describedby={errors.primaryPhone ? "primaryPhone-error" : undefined}
            />
            {errors.primaryPhone && <div id="primaryPhone-error" className="error-message">{errors.primaryPhone}</div>}
          </div>

          <div className="CollectReg-group">
            <label htmlFor="secondaryPhone" className="CollectReg-label">
              <Phone size={16} className="mr-1 inline" /> Secondary Phone
            </label>
            <input
              id="secondaryPhone" type="tel" name="secondaryPhone" value={formData.secondaryPhone}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              disabled={isLoading}
              className={`CollectReg-input ${errors.secondaryPhone ? 'input-error' : ''}`}
              placeholder="07xxxxxxxx (optional)"
              pattern="[0-9]{10}"
              aria-invalid={!!errors.secondaryPhone}
              aria-describedby={errors.secondaryPhone ? "secondaryPhone-error" : undefined}
            />
            {errors.secondaryPhone && <div id="secondaryPhone-error" className="error-message">{errors.secondaryPhone}</div>}
          </div>
        </div>
        
        {/* Password Field */}
        <div className="CollectReg-group" style={{ "--index": 3 }}>
          <label htmlFor="password" className="CollectReg-label">
            <Lock size={16} className="mr-1 inline" /> Password *
          </label>
          <input
            id="password" type="password" name="password" value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required disabled={isLoading}
            className={`CollectReg-input ${errors.password ? 'input-error' : ''}`}
            placeholder="Create a password"
            minLength="6"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <div id="password-error" className="error-message">{errors.password}</div>}
        </div>

        {/* Address */}
        <div className="CollectReg-group" style={{ "--index": 4 }}>
          <label htmlFor="address" className="CollectReg-label">
            <Home size={16} className="mr-1 inline" /> Address *
          </label>
          <textarea
            id="address" name="address" value={formData.address}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required disabled={isLoading} rows="3"
            className={`CollectReg-textarea ${errors.address ? 'input-error' : ''}`}
            placeholder="Enter your full street address"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {errors.address && <div id="address-error" className="error-message">{errors.address}</div>}
        </div>

        <button type="submit" disabled={isLoading} className="CollectReg-button">
          {isLoading ? (
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C11.4477 20 11 20.4477 11 21C11 21.5523 11.4477 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" />
            </svg>
          ) : 'Register Collector'}
        </button>
      </form>
    </div>
  );
};

export default CollectorForm;