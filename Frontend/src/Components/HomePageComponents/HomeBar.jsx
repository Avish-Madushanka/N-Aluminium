import React from 'react';
import { Link } from 'react-router-dom';
import './HomeBar.css';

const HomeBar = () => {
  return (
    <section className="hb-section-wrapper">
      <div className="hb-inner-container">

        <h2 className="hb-hero-heading">
          We are a <span className="hb-highlight-text">passionate</span> team dedicated to aluminum recycling and sustainable resource management.
        </h2>

        <div className="hb-main-layout-grid">
          <div className="hb-content-column">
            
            <div className="hb-top-info-row">
              <div className="hb-experience-box">
                <div className="hb-stats-display">
                  <span className="hb-stats-num">20</span>
                  <span className="hb-stats-plus">+</span>
                </div>
                <p className="hb-stats-label">Work Experience</p>
              </div>

              <div className="hb-description-box">
                <p className="hb-main-paragraph">
                 We believe aluminum should be used efficiently and recycled sustainably. Through smart planning, innovative recycling, and community engagement, we reduce waste, save energy, and keep aluminum in use for the future.
                </p>
                
                <Link to="/AboutUs" className="hb-cta-link-wrapper">
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
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/4212/4212257.png" 
                      className="hb-feature-link-img"
                    />
                  </div>
                <h3 className="hb-feature-title">Aluminum Scrap Pickup</h3>
                <p className="hb-feature-desc">Users can schedule a convenient pickup for their aluminum scraps directly through the platform.</p>
              </div>

              <div className="hb-feature-card">
                  <div className="hb-icon-container hb-icon-dark">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png" 
                      alt="Garden installation icon" 
                      className="hb-feature-link-img hb-img-invert"
                    />
                  </div>
                <h3 className="hb-feature-title">Interactive Map Integration</h3>
                <p className="hb-feature-desc">A live map feature shows available pickup zones, service areas, and routes. </p>
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