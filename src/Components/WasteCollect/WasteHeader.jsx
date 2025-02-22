import React from "react";
import "./WasteHeader.css";

const WasteHeader = () => {
    return (
      <div className="latest-projects-container">
        <div className="left-section">
          <h3 className="subtitle">Latest Projects</h3>
          <h1 className="title">Latest Projects</h1>
          <div className="buttons">
            <button className="btn">Button 1</button>
            <button className="btn">Button 2</button>
          </div>
        </div>
        <div className="right-section">
          <div className="image-container">
            <div className="image image-2"></div>
          </div>
        </div>
      </div>
    );
  };
export default WasteHeader;
