import React from 'react';
import './BOwnerHeader.css';

const BOwnerHeader = () => {
  return (
    <div className="business1-card">
      <div className="cover1-photo">
        <img src="https://assets.turbologo.com/blog/en/2019/11/19084917/puma-logo-cover-958x575.png" alt="Cover1" className="cover1-image" />
        <div className="profile1-photo">
          <img src="https://i.pinimg.com/736x/71/b3/e4/71b3e4159892bb319292ab3b76900930.jpg" alt="Profile1" className="profile1-image" />
        </div>
      </div>
      <div className="business1-info">
        <h2 className="business1-name">N. Aluminum</h2>
        <p className="owner1-name">Nimal Nimal</p>
        <p className="contact1-number">0777-123456</p>
        <p className="email1">NimalNimal@email.com</p>
      </div>
    </div>
  );
};

export default BOwnerHeader;