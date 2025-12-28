import React from "react";
import "./CollectMap.css";
import Calculate from "../Calculate/Calculate";

const CollectMap = () => {
  return (
    <div className="CollectMap-Cal-hero-container">
      <div className="CollectMap-Cal-image-section">
        <img
          src="https://scrapyardchatham.ca/wp-content/uploads/2024/09/1-13991_falling-money-png-clip-free-raining-money-transparent-removebg-preview.png"
          alt="Brain with question marks"
          className="CollectMap-Cal-map-image"
        />
      </div>

      <div className="CollectMap-Cal-content-section">
        <div className="CollectMap-Cal-calculator-wrapper">
          <Calculate />
        </div>
      </div>
    </div>
  );
};

export default CollectMap;
