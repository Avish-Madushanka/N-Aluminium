import React from "react";
import "./CollectMap.css"

const CollectMap = () => {
  return (
    <section className="Collect-map-section">
      <div className="Collect-map-overlay">
        <h2 className="Collect-map-title">WHERE ARE WE LOCATED?</h2>
        <p className="Collect-map-description">
          View our fully interactive map of all of our locations. <br />
          Find phone numbers, hours, and get directions to a facility near you.
        </p>
        <button className="Collect-map-button">Find a location near me</button>
      </div>
    </section>
  );
};

export default CollectMap;
