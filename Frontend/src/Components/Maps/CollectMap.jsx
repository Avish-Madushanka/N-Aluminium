import React from "react";
import "./CollectMap.css"; 

const CollectMap = () => {
  return (
    <section className="Collect-map-section">
      <div className="Collect-map-content-container">
        <div className="Collect-map-text-content">
          <h1 className="Collect-map-main-title">
            Grow your skills, <br /> define your future
          </h1>
          <p className="Collect-map-description-text">
            Presenting Academy, the tech school of the future. We teach you the
            right skills to be prepared for tomorrow.
          </p>
          <div className="Collect-map-buttons">
            <a href="#" className="Collect-map-button-primary">
              EXPLORE COURSES
            </a>
            <a href="#" className="Collect-map-button-secondary">
              LEARN MORE
            </a>
          </div>
        </div>

        <div className="Collect-map-image-container">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/047/442/457/non_2x/sri-lanka-map-map-of-sri-lanka-on-map-pin-icon-red-color-isolated-vector.jpg" 
            alt="Sri Lanka Map" 
          />
        </div>
      </div>
    </section>
  );
};

export default CollectMap;
