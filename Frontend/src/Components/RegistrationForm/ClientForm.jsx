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
    name: '',
    email: '',
    contactNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!VALIDATION_PATTERNS.NAME.test(formData.name)) newErrors.name = 'Enter valid name';
    if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) newErrors.email = 'Enter valid email';
    if (!VALIDATION_PATTERNS.PHONE.test(formData.contactNumber)) newErrors.contactNumber = 'Enter 10 digit phone';
    if (!VALIDATION_PATTERNS.PASSWORD.test(formData.password)) newErrors.password = 'Weak password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CLIENT.REGISTER, formData);
      if (response.data.success) {
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Registration failed' });
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
            <p>Register to manage your N-Aluminium account</p>

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

            <form onSubmit={handleSubmit}>
              <div className="SignUp-group">
                <label><User size={16}/> Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="SignUp-error">{errors.name}</span>}
              </div>

              <div className="SignUp-group">
                <label><Mail size={16}/> Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="SignUp-error">{errors.email}</span>}
              </div>

              <div className="SignUp-group">
                <label><Phone size={16}/> Phone</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                {errors.contactNumber && <span className="SignUp-error">{errors.contactNumber}</span>}
              </div>

              <div className="SignUp-group">
                <label><Lock size={16}/> Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                {errors.password && <span className="SignUp-error">{errors.password}</span>}
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