import React from "react";
import "./WasteHeader.css";

const WasteHeader = () => {
  return (
    <div className="Was-header-container">
      <div className="Was-header-banner">
      </div>
      <div className="Was-header-content">
        <div className="Was-text-section">
          <h1 className="Was-main-title">Aluminum Scrap Collection Center</h1>
          <p className="Was-description">
            We collect and recycle aluminum waste responsibly, turning discarded materials into valuable resources for a greener planet.
          </p>
          <button className="Was-learn-more-button">Learn more</button>
        </div>
        <div className="Was-image-grid">
          <div className="Was-grid-item Was-item-1"></div>
          <div className="Was-grid-item Was-item-2"></div>
          <div className="Was-grid-item Was-item-3"></div>
        </div>
      </div>
    </div>
  );
};

export default WasteHeader;