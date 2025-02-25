import React from 'react';
import './AboutUSDes3.css';

const AboutUSDes3 = () => {
  const imageUrl1 = 'https://i.imgur.com/4Nn9C9f.jpg';
  const imageUrl2 = 'https://i.imgur.com/4Nn9C9f.jpg';
  const imageUrl3 = 'https://i.imgur.com/4Nn9C9f.jpg';

  return (
    <div className="recycling-container">
      <h1 className="recycling-title">Why Need To Recycling AlumiAluminum</h1>
      <p className="recycling-description">
        An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant, durable, low
      </p>
      <div className="image-grid">
        <div className="image-item">
          <img src={imageUrl1} alt="Aluminum" className="aluminum-image" />
          <p className="aluminum-text">Aluminum</p>
        </div>
        <div className="image-item">
          <img src={imageUrl2} alt="Aluminum" className="aluminum-image" />
          <p className="aluminum-text">Aluminum</p>
        </div>
        <div className="image-item">
          <img src={imageUrl3} alt="Aluminum" className="aluminum-image" />
          <p className="aluminum-text">Aluminum</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUSDes3;