import React from 'react';
import './BOwnerHeader.css';

const BOwnerHeader = () => {
  return (
    <div className="business1-card">
      <div className="cover1-photo">
        <img
          src="https://images.hdqwalls.com/download/view-from-here-4k-09-1366x768.jpg" 
          alt="Cover"
          className="cover1-image"
        />
      </div>

      <div className="profile-section">
        <div className="profile-photo">
          <img
            src="https://via.placeholder.com/150x150/e74c3c/fff"
            alt="Profile"
            className="profile-image"
          />
        </div>

        <div className="business-info">
          <h1 className="business-name">N. Aluminum</h1>
          <p className="owner-name">Nimal Nimal</p>
          <p className="contact-number">0777-123456</p>
          <p className="email">NimalNimal@email.com</p>
        </div>
      </div>

      <div className="divider"></div>
    </div>
  );
};

export default BOwnerHeader;