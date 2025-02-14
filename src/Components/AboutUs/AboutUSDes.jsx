import React from 'react';
import './AboutUSDes.css';

function AboutUSDes() {
  const mainImageUrl = "https://wallpapers.com/images/hd/dynamic-battlefield-1-action-in-4k-resolution-ookn4al8l9472frf.jpg";
  const secondImageUrl = "https://c4.wallpaperflare.com/wallpaper/668/51/763/4k-zavod-graveyard-shift-night-operations-battlefield-4-wallpaper-preview.jpg";
  const thirdImageUrl = "https://c4.wallpaperflare.com/wallpaper/668/51/763/4k-zavod-graveyard-shift-night-operations-battlefield-4-wallpaper-preview.jpg";
  const fourthImageUrl = "https://c4.wallpaperflare.com/wallpaper/668/51/763/4k-zavod-graveyard-shift-night-operations-battlefield-4-wallpaper-preview.jpg";
  const descriptionText = "what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? what we do? v";

  return (
    <div className="AboutDes-container">
      <h1 className="main-title">what we do?</h1>
      <img src={mainImageUrl} alt="Main" className="main-image" />
      <div className="section">
        <h2 className="section-title">what we do?</h2>
        <p className="description">{descriptionText}</p>
      </div>

      <div className="grid-container">
        <div className="grid-item">
          <img src={secondImageUrl} alt="Building" className="grid-image" />
          <button className="image-button">Button</button>
        </div>
        <div className="grid-text">
          <h2 className="section-title">what we do?</h2>
          <p className="description">{descriptionText}</p>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-text">
          <h2 className="section-title">what we do?</h2>
          <p className="description">{descriptionText}</p>
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