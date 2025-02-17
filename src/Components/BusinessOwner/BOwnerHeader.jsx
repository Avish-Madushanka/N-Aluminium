import React from 'react';
import './BOwnerHeader.css';

const BOwnerHeader = () => {
  return (
    <div className="business-card">
      <div className="cover-photo">
        <img
          src="https://via.placeholder.com/1200x300/3498db/fff" // Replace with cover photo
          alt="Cover"
          className="cover-image"
        />
      </div>

      <div className="profile-section">
        <div className="profile-photo">
          <img
            src="https://via.placeholder.com/150x150/e74c3c/fff" // Replace with profile photo
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