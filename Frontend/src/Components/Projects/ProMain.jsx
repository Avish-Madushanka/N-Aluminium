import React from 'react';
import './ProMain.css';

const ProMain = () => {
  return (
    <div className="Proj1-hero-container">
      <img
        src="https://signaturehomeimprovements.uk/wp-content/uploads/2025/01/Alluminium-windows.webp"
        alt="Aluminum Architecture Background"
        className="Proj1-hero-background"
      />

      <div className="Proj1-hero-overlay"></div>

      <div className="Proj1-hero-content">
        <h1 className="Proj1-hero-title">OUR ALUMINUM PROJECTS</h1>
        <p className="Proj1-hero-subtitle">
          Take a look at our latest aluminum fabrication work, from custom designs to large-scale projects, showcasing quality craftsmanship and reliable performance.
        </p>
      </div>

      <div className="Proj1-search-bar-container">
        <input
          type="text"
          placeholder="Search Aluminum Projects..."
          className="Proj1-search-input"
        />
        <button className="Proj1-search-button">Search Projects</button>
      </div>
    </div>
  );
};

export default ProMain;
