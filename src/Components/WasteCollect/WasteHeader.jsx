import React from "react";
import "./WasteHeader.css";
import "../../assets/wall.png"

const WasteHeader = () => {
  return (
    <div className="latest-projects-container">
      <div className="overlay"></div>
      <div className="left-section">
        <h1 className="title">Aluminum Scraps 
        <p> Metal Recycler</p>
        </h1>
        <p className="subtitle">Innovative Metal Recycling Solutions</p>
        <div className="buttons">
          <button className="btn">Explore More</button>
          <button className="btn">Get a Quote</button>
        </div>
      </div>
      <div className="right-section">
        <div className="image-container">
          <div className="Bimage image-2"></div>
        </div>
      </div>
    </div>
  );
};

export default WasteHeader;
