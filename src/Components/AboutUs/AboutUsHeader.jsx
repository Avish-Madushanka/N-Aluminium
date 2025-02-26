import React from "react";
import "./AboutUsHeader.css"; 

const AboutUsHeader = () => {
  return (
    <div className="what-we-do-container">
      <div className="what-we-do-content">
        <h2 className="title">What We Do ?</h2>
        <p className="description">
        "An innovative aluminum scraps collection and trading platform that enhances communication between clients and aluminum businesses, making it easy to buy, sell, and reuse aluminum items. Promoting sustainability, reducing waste, and fostering a circular economy for a greener future."
        </p>
        <a href="/Service" className="cta-button">View All Services</a>
      </div>
    </div>
  );
};

export default AboutUsHeader;