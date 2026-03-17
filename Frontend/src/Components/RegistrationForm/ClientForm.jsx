import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, User, AlertCircle } from 'lucide-react';
import './ClientForm.css';

const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s]{3,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
};

const ClientForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    else if (!VALIDATION_PATTERNS.NAME.test(formData.fullName)) newErrors.fullName = 'Enter valid name (3-50 characters, letters only)';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) newErrors.email = 'Enter valid email';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!VALIDATION_PATTERNS.PHONE.test(formData.phone)) newErrors.phone = 'Enter 10 digit phone number';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!VALIDATION_PATTERNS.PASSWORD.test(formData.password)) newErrors.password = 'Password must be at least 6 characters with uppercase, lowercase and number';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    setErrors({});
    setSuccessMessage('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const requestData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      
      const response = await axiosInstance.post(API_ENDPOINTS.CLIENT.REGISTER, requestData);
      
      if (response.data.success || response.data.message) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="SignUp-container">
      <div className="SignUp-wrapper">
        <div className="SignUp-left">
          <div className="SignUp-overlay">
            <h1>"Start your journey in aluminum trade and recycling today!"</h1>
          </div>
        </div>

        <div className="SignUp-right">
          <div className="SignUp-form-box">
            <h2>Create Account</h2>
            <p>Register to manage your account</p>

            {errors.form && (
              <div className="SignUp-alert-error">
                <AlertCircle size={18} />
                <span>{errors.form}</span>
              </div>
            )}

            {successMessage && (
              <div className="SignUp-alert-success">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="SignUp-group">
                <label><User size={16}/> Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'error' : ''}
                  required
                />
                {errors.fullName && <span className="SignUp-error">{errors.fullName}</span>}
              </div>

              <div className="SignUp-group">
                <label><Mail size={16}/> Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <span className="SignUp-error">{errors.email}</span>}
              </div>

              <div className="SignUp-group">
                <label><Phone size={16}/> Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  className={errors.phone ? 'error' : ''}
                  required
                />
                {errors.phone && <span className="SignUp-error">{errors.phone}</span>}
              </div>

              <div className="SignUp-group">
                <label><Lock size={16}/> Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={errors.password ? 'error' : ''}
                  required
                />
                {errors.password && <span className="SignUp-error">{errors.password}</span>}
              </div>

              <div className="SignUp-group">
                <label><Lock size={16}/> Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                />
                {errors.confirmPassword && <span className="SignUp-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" disabled={isLoading} className="SignUp-btn">
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>

              <div className="SignUp-login-link">
                Already have an account? <a href="/login">Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;