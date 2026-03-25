import React from 'react';
import { Link } from 'react-router-dom';
import './HomeBar.css';

const HomeBar = () => {
  return (
    <section className="hb-section-wrapper">
      <div className="hb-inner-container">
        
        <div className="hb-header-badge-row">
          <div className="hb-badge-tag">
            <span className="hb-badge-number">01</span>
            <span className="hb-badge-text">ABOUT COMPANY</span>
          </div>
        </div>

        <h2 className="hb-hero-heading">
          We are a <span className="hb-highlight-text">passionate</span> team dedicated to aluminum recycling and sustainable resource management.
        </h2>

        <div className="hb-main-layout-grid">
          <div className="hb-content-column">
            
            <div className="hb-top-info-row">
              <div className="hb-experience-box">
                <div className="hb-stats-display">
                  <span className="hb-stats-num">15</span>
                  <span className="hb-stats-plus">+</span>
                </div>
                <p className="hb-stats-label">Work Experience</p>
              </div>

              <div className="hb-description-box">
                <p className="hb-main-paragraph">
                  We believe aluminum resources should be managed efficiently and sustainably. That’s why we focus on smart planning and innovative recycling solutions.
                </p>
                
                <Link to="/AboutUs" className="hb-link-wrapper">
                  <div className="hb-action-button-group">
                    <button className="hb-cta-btn-main">ABOUT US</button>
                    <div className="hb-cta-icon-wrapper">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </div>
                </Link>

              </div>
            </div>

            <div className="hb-features-sub-grid">
              <div className="hb-feature-card">
                <div className="hb-icon-container hb-icon-lime">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
                <h3 className="hb-feature-title">Landscape design</h3>
                <p className="hb-feature-desc">Custom designs to bring your outdoor vision to life.</p>
              </div>

              <div className="hb-feature-card">
                <div className="hb-icon-container hb-icon-dark">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="white" stroke="white" strokeWidth="1.5">
                    <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5"/>
                  </svg>
                </div>
                <h3 className="hb-feature-title">Garden installation</h3>
                <p className="hb-feature-desc">Turn your dream garden into reality today, effortlessly.</p>
              </div>
            </div>

          </div>

          <div className="hb-image-column">
            <img 
              src="https://www.chaluminium.com/wp-content/uploads/2023/11/Aluminum-in-Construction.jpg" 
              className="hb-featured-img" 
              alt="Aluminum Industry"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeBar;