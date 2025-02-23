import React from "react";
import "./AboutUsHeader.css"; 

const AboutUsHeader = () => {
  return (
    <div className="what-we-do-container">
      <div className="what-we-do-content">
        <h2 className="title">What We Do ?</h2>
        <p className="description">
          An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.
        </p>
        <button className="cta-button">Button</button>
      </div>
    </div>
  );
};

export default AboutUsHeader;