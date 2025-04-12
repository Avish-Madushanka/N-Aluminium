import React from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Sign Up</h1>
        <p className="signup-subtitle">Choose your account type</p>
        
        <div className="account-options">
          <div className="account-option">
            <div className="icon-container admin-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h3>Admin</h3>
            <p>Manage system and users</p>
            <a href="/AdminForm" className="option-button">Select</a>
          </div>
          
          <div className="account-option">
            <div className="icon-container business-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <h3>Business Owner</h3>
            <p>Register your company</p>
            <a href="/BOwnerForm" className="option-button">Select</a>
          </div>
          
          <div className="account-option">
            <div className="icon-container client-icon">
              <i className="fas fa-user"></i>
            </div>
            <h3>Client</h3>
            <p>Access services</p>
            <a href="/ClientForm" className="option-button">Select</a>
          </div>
        </div>
        
        <div className="login-section">
          <p>Already have an account?</p>
          <a href="/Login" className="login-button">Log In</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;