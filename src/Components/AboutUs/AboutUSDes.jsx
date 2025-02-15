import React from 'react';
import './AboutUSDes.css';

function AboutUSDes() {
  const mainImageUrl = "https://wallpapers.com/images/hd/dynamic-battlefield-1-action-in-4k-resolution-ookn4al8l9472frf.jpg";
  const secondImageUrl = "https://c4.wallpaperflare.com/wallpaper/668/51/763/4k-zavod-graveyard-shift-night-operations-battlefield-4-wallpaper-preview.jpg";
  const fourthImageUrl = "https://c4.wallpaperflare.com/wallpaper/668/51/763/4k-zavod-graveyard-shift-night-operations-battlefield-4-wallpaper-preview.jpg";

  const descriptionText1 = "Recycling aluminum waste parts is essential for environmental sustainability and resource conservation. It significantly reduces landfill waste, as aluminum takes hundreds of years to decompose. Recycling also saves **95% of the energy** required to produce new aluminum from raw bauxite ore, lowering carbon emissions and minimizing environmental pollution. Additionally, it preserves natural resources by reducing the need for mining, which disrupts ecosystems. The process also supports the economy by creating jobs in the recycling industry and reducing production costs for manufacturers. Overall, aluminum recycling plays a crucial role in promoting a cleaner environment and a more sustainable future.Recycling aluminum waste parts is essential for environmental sustainability and resource conservation. It significantly reduces landfill waste, as aluminum takes hundreds of years to decompose. Recycling also saves **95% of the energy** required to produce new aluminum from raw bauxite ore, lowering carbon emissions and minimizing environmental pollution. Additionally, it preserves natural resources by reducing the need for mining, which disrupts ecosystems. The process also supports the economy by creating jobs in the recycling industry and reducing production costs for manufacturers. Overall, aluminum recycling plays a crucial role in promoting a cleaner environment and a more sustainable future.";

  const descriptionText2 = "Recycling aluminum waste parts is essential for environmental sustainability and resource conservation. It significantly reduces landfill waste, as aluminum takes hundreds of years to decompose. Recycling also saves **95% of the energy** required to produce new aluminum from raw bauxite ore, lowering carbon emissions and minimizing environmental pollution. Additionally, it preserves natural resources by reducing the need for mining, which disrupts ecosystems. The process also supports the economy by creating jobs in the recycling industry and reducing production costs for manufacturers. Overall, aluminum recycling plays a crucial role in promoting a cleaner environment and a more sustainable future.";

  const descriptionText3 = "Recycling aluminum waste parts is essential for environmental sustainability and resource conservation. It significantly reduces landfill waste, as aluminum takes hundreds of years to decompose. Recycling also saves **95% of the energy** required to produce new aluminum from raw bauxite ore, lowering carbon emissions and minimizing environmental pollution. Additionally, it preserves natural resources by reducing the need for mining, which disrupts ecosystems. The process also supports the economy by creating jobs in the recycling industry and reducing production costs for manufacturers. Overall, aluminum recycling plays a crucial role in promoting a cleaner environment and a more sustainable future.";


  return (
    <div className="AboutDes-container">
      <h1 className="main-title">About Us</h1>
      <img src={mainImageUrl} alt="Main" className="main-image" />
      <div className="section">
        <h2 className="section-title">what we do?</h2>
        <p className="description">{descriptionText1}</p>
      </div>

      <div className="grid-container">
        <div className="grid-item">
          <img src={secondImageUrl} alt="Building" className="grid-image" />
          <button className="image-button">Button</button>
        </div>
        <div className="grid-text">
          <h2 className="section-title">what the purpose of collecting aluminum waste parts and recycling</h2>
          <p className="description">{descriptionText2}</p>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-text">
          <h2 className="section-title">what the purpose of collecting aluminum waste parts and recycling</h2>
          <p className="description">{descriptionText3}</p>
        </div>
        <div className="grid-item">
          <img src={fourthImageUrl} alt="Elephant" className="grid-image" />
          <button className="image-button">Button</button>
        </div>
      </div>
      
      
    </div>
  );
}

export default AboutUSDes;