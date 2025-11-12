import React from "react";
import "./CollectMap.css"; 
import { Link } from "react-router-dom";

const CollectMap = () => {
  return (
    <div className="MP1-hero-container">
      <div className="MP1-image-section">
        <img src="https://media.baamboozle.com/uploads/images/957667/1676752499_21777.jpeg" alt="Map image" className="MP1-map-image" />
      </div>
      <div className="MP1-content-section">
        <h1 className="MP1-headline">
          Find Collection <br /> Centers <span></span>
          <span className="MP1-a">Near You </span>
        </h1>
        <p className="MP1-description">
          Quickly find nearby aluminum scrap collection centers and partner shops through our interactive map. Discover convenient, eco-friendly locations with service details and contact info for easy recycling.
        </p>
        <div className="MP1-stats">
          <div className="MP1-stat-item">
            <span className="MP1-stat-number">20+</span>
            <span className="MP1-stat-label">Collection Points</span>
          </div>
          <div className="MP1-stat-divider"></div>
          <div className="MP1-stat-item">
            <span className="MP1-stat-number">24/7</span>
            <span className="MP1-stat-label">Pickup Availability</span>
          </div>
          <div className="MP1-stat-divider"></div>
          <div className="MP1-stat-item">
            <span className="MP1-stat-number">100%</span>
            <span className="MP1-stat-label">Coverage area</span>
          </div>
        </div>
         <Link to="/LocationMap" className="MP1-btn">
          Explore Locations
        </Link>
      </div>
    </div>

  );
};

export default CollectMap;
