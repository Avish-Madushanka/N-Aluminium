import React from 'react';
import './AboutUsHeader.css';

const AboutUsHeader = () => {
  return (
    <div className="ABH-about-container">
      <div className="ABH-hero-section">
        <div className="ABH-overlay"></div>
        <div className="ABH-hero-content">
          <h1 className="ABH-hero-title">About Us</h1>
        </div>
        <div className="ABH-wave-divider"></div>
      </div>
    </div>
  );
};

export default AboutUsHeader;