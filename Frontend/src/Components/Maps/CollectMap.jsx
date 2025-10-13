import React from "react";
import "./CollectMap.css"; 

const CollectMap = () => {
  return (
    <section className="Collect-map-section">
      <div className="Collect-map-content-container">
        <div className="Collect-map-text-content">
          <h1 className="Collect-map-main-title">
            Find Collection <br /> Centers Near You
          </h1>
          <p className="Collect-map-description-text">
            Quickly find nearby aluminum scrap collection centers and partner shops through our interactive map. Discover convenient, eco-friendly locations with service details and contact info for easy recycling.
          </p>
          <div className="Collect-map-buttons">
            <a href="/LocationMap" className="Collect-map-button-primary">
              View Map
            </a>
          </div>
        </div>

        <div className="Collect-map-image-container">
          <img 
            src="https://t4.ftcdn.net/jpg/13/50/66/51/360_F_1350665151_6gCBJAyV8BkRda90ECkWzRHkG938t2BU.jpg" 
            alt="Sri Lanka Map" 
          />
        </div>
      </div>
    </section>
  );
};

export default CollectMap;
