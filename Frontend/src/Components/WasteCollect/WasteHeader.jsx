import React from "react";
import "./WasteHeader.css";
import { Link } from "react-router-dom";

const WasteHeader = () => {
  return (
    <div className="WS1-hero-bg">
      <div className="WS1-container">
        <section className="WS1-hero-section">
          <div className="WS1-hero-content">
            <div className="WS1-text-content">
              <h1>
                <span className="WS1-text-green"></span> Aluminum Scrap Collection Center
              </h1>
              <p className="WS1-subtitle">
                We collect and recycle aluminum waste responsibly, turning discarded materials into
                valuable resources for a greener planet.
              </p>

              <div className="WS1-button-group">
              <Link to="/CalendarDisplay" className="WS1-btn WS1-btn-green">
                Check Pickup Days
              </Link>

              <Link to="/LocationMap" className="WS1-btn WS1-btn-dark">
                Collection Centers
              </Link>
            </div>
            </div>
          </div>

          <div className="WS1-hero-image"></div>
        </section>

        <section className="WS1-features-section">
          <div className="WS1-feature-box WS1-bg-light-green">
            <svg className="WS1-feature-icon" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            <h3 className="WS1-feature-title">Eco-Friendly Process</h3>
            <p className="WS1-feature-text">Sustainable recycling systems with zero landfill waste.</p>
          </div>

          <div className="WS1-feature-box WS1-bg-dark-green">
            <svg className="WS1-feature-icon" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.4 2.2c-.3-.3-.8-.3-1.1 0L3.5 8c-1.6 1.6-1.6 4.2 0 5.8s4.2 1.6 5.8 0l6.8-6.8c.3-.3.3-.8 0-1.1L10.4 2.2z" />
              <path d="m19.5 12.5-5.8-5.8" />
              <path d="m9.2 2.5 5.8 5.8" />
              <path d="M14.8 18.8c.3.3.8.3 1.1 0l5.8-5.8c1.6-1.6 1.6-4.2 0-5.8s-4.2-1.6-5.8 0l-6.8 6.8c-.3.3-.3.8 0 1.1l5.7 5.7z" />
            </svg>
            <h3 className="WS1-feature-title">Certified Collection</h3>
            <p className="WS1-feature-text">Approved standards for safe and ethical metal handling.</p>
          </div>

          <div className="WS1-feature-box WS1-bg-orange">
            <svg className="WS1-feature-icon" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
              <path d="M14 9h4l4 4v5h-3" />
              <circle cx="7.5" cy="18.5" r="2.5" />
              <circle cx="17.5" cy="18.5" r="2.5" />
            </svg>
            <h3 className="WS1-feature-title">Free Pickup Service</h3>
            <p className="WS1-feature-text">Schedule convenient doorstep scrap pickup anytime.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WasteHeader;
