import React from 'react';
import './AboutUsHeader.css';

const AboutUsHeader = () => {
  return (
    <div className="about-container">
      <div className="hero-section">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
          <p className="hero-text">
          An innovative aluminum scraps collection and trading platform that enhances communication between clients and aluminum businesses, making it easy to buy, sell, and reuse aluminum items. Promoting sustainability, reducing waste, and fostering a circular economy for a greener future.
          </p>
        </div>
        <div className="wave-divider"></div>
      </div>
    </div>
  );
};

export default AboutUsHeader;