import React from 'react';
import '../HomePageComponents/HomeDes.css';

const HomeDes = () => {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-left">
          <div className="rating-box">
            <span className="rating-value">4.8+</span>
            <div className="stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <span className="total-rating">Total Rating</span>
          </div>
          <div className="image-container">
             <img
                 src="https://ehq-production-canada.imgix.net/95ef717549bf590d003a3a0ed62dde0ad5a841b9/original/1629205293/0f7df44dfd54f6b7bc4a210ed42775e8_Waste-Calendar-Survey_CW-Tile_750x750px_FINAL_Multiple_Calendar.jpg?auto=compress%2Cformat&w=1080"
                 alt="Team at work"
             />
          </div>
        </div>
        <div className="hero-right">
          <h5 className="why-choose-us">Why Choose Us</h5>
          <h2 className="sustainable-choice">Your Sustainable Choice For Waste Management.</h2>
          <p className="hero-description">Lorem ipsum dolor sit amet consectetur. Arcu aliquet gravida pellentesque etiam vel tempor. Pellentesque vitae lacus non viverra faucibus ac consequat. Est mauris gravida cursus justo elit bibendum amet. Aliquam enim consectetur imperdiet eu pretium non tempus. Ac in aliquam nisl ullamcorper suscipit ut. Sit ut orci consequat pellentesque dictum sit quis sed.</p>
          <button className="learn-more-button">Learn More</button>
        </div>
      </div>
      <div className="services-container">
        <ServiceCard icon="🚛" title="Large Volume Pickup" description="Lorem ipsum dolor sit amet consectetur." />
        <ServiceCard icon="📅" title="Easy Online Scheduling" description="Lorem ipsum dolor sit amet consectetur." />
        <ServiceCard icon="♻️" title="Recycling Education" description="Lorem ipsum dolor sit amet consectetur." />
        <ServiceCard icon="💎" title="Transparent Pricing" description="Lorem ipsum dolor sit amet consectetur." />
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="service-card">
      <span className="service-icon">{icon}</span>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
    </div>
  );
};

export default HomeDes;