import React from "react";
import "./AboutUsDes.css"; 

const AboutUsDes = () => {
  return (
    <div className="ABrecycling-container">
      <div className="ABimage-section">
        <img src="https://fairsalvage.com/wp-content/uploads/2022/05/A-Guide-To-Metal-Recycling-Process_image1.webp" alt="Recycling" className="ABrecycling-image" />
      </div>
      <div className="ABtext-section">
        <h2 className="ABtitle">Why Need To Recycling Aluminum</h2>
        <p className="ABdescription">
        Aluminum recycling is crucial for environmental sustainability, economic growth, and energy conservation. Unlike many materials, aluminum can be recycled indefinitely without losing its quality, making it a highly sustainable resource. Recycling aluminum saves up to **95% of the energy** required to produce new aluminum from raw bauxite ore, significantly reducing greenhouse gas emissions and lowering the carbon footprint. It also helps minimize landfill waste, as aluminum takes hundreds of years to decompose. By recycling, we reduce the need for excessive mining, which causes deforestation, soil degradation, and water pollution. Additionally, aluminum recycling supports local economies by creating jobs in collection, processing, and manufacturing industries. As industries and individuals embrace aluminum recycling, we move closer to a circular economy where resources are reused efficiently, benefiting both the environment and future generations.
        </p>
      </div>
    </div>

    
  );
};

export default AboutUsDes;
