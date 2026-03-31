import React from "react";
import "./WasteHeader.css";
import { Link } from "react-router-dom";

const WasteHeader = () => {
  return (
    <div className="WS1-main-hero">
      <div className="WS1-hero-overlay">
        <div className="WS1-hero-content">
          <h1 className="WS1-title">
            Aluminum Scrap <br /> Collection Center
          </h1>
          <p className="WS1-description">
            We collect and recycle aluminum waste responsibly, turning discarded materials into
            valuable resources for a greener planet.
          </p>

          <div className="WS1-button-wrapper">
            <Link to="/CalendarDisplay" className="WS1-btn-orange">
              Check Pickup Dates <span className="WS1-icon-arrow">→</span>
            </Link>
            <Link to="/LocationMap" className="WS1-btn-white">
              Shops Near By
            </Link>
          </div>
        </div>

        <div className="WS1-bottom-bar">
          <div className="WS1-contact-info">
            <div className="WS1-avatar-group">
                <img src="https://cdn-icons-png.flaticon.com/128/6543/6543820.png" alt="agent" className="WS1-avatar" />
                <div className="WS1-phone-circle">📞</div>
            </div>
            <div className="WS1-contact-text">
                <p>Have questions or need 
                  services? Contact us today for recycling. We’re here to help you every step of the way.</p>
                <Link to="/ContactUs" className="WS1-contact-link">Contact Us Now <span className="WS1-green-dot">→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteHeader;