import React from "react";
import "./AboutUsDes.css";

const AboutUsDes = () => {
  return (
    <div className="ABrecycling-container">
      <div className="ABimage-section">
        <img
          src="https://fairsalvage.com/wp-content/uploads/2022/05/A-Guide-To-Metal-Recycling-Process_image1.webp"
          alt="Recycling"
          className="ABrecycling-image"
        />
      </div>
      <div className="ABtext-section">
        <h2 className="ABtitle">
          Why <span className="highlight">Recycle</span> Aluminum?
        </h2>
        <p className="ABdescription">
          Aluminum recycling is crucial for environmental sustainability, economic growth,
          and energy conservation. Unlike many materials, aluminum can be recycled
          indefinitely without losing quality. Recycling aluminum saves up to
          <strong> 95% of the energy </strong> required to produce new aluminum, significantly
          reducing greenhouse gas emissions and the carbon footprint. It also
          minimizes landfill waste, protects natural resources, and supports
          local jobs. Together, we can build a circular economy that benefits
          both the planet and future generations.
        </p>
      </div>
    </div>
  );
};

export default AboutUsDes;
