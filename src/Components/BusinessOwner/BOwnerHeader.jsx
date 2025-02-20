import React from 'react';
import './BOwnerHeader.css';

const BOwnerHeader = () => {
  return (
    <div className="business1-card">
      <div className="cover1-photo">
        <img
          src="https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt1839306f808bbba3/636ad0b31beb7169c79be8e7/does-car-insurance-cover-theft_hero-block-image.svg" 
          alt="Cover"
          className="cover1-image"
        />
      </div>

      <div className="profile1-section">
        <div className="profile1-photo">
          <img
            src="https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt6e45b29467f5954d/635fc000cde6e8109cc3d111/full-coverage-car-insurance_card-image.svg://via.placeholder.com/150x150/e74c3c/fff"
            alt="Profile"
            className="profile1-image"
          />
        </div>

        <div className="business1-info">
          <h1 className="business1-name">N. Aluminum</h1>
          <p className="owner1-name">Nimal Nimal</p>
          <p className="contact1-number">0777-123456</p>
          <p className="email1">NimalNimal@email.com</p>
        </div>
      </div>

      <div className="divider1"></div>
    </div>
  );
};

export default BOwnerHeader;