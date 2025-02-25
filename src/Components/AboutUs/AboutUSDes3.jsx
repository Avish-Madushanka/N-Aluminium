import React from 'react';
import './AboutUSDes3.css';

const AboutUSDes3 = () => {
  const imageUrl1 = 'https://media.istockphoto.com/id/133993685/photo/scrap-metal-pieces-laying-in-a-pile.jpg?s=612x612&w=0&k=20&c=255eq6JeJao2iO5w-pXhmFkBGDHLabXH5Kn9SaA1lxw=';
  const imageUrl2 = 'https://s.alicdn.com/@sc04/kf/H72424df1f0d749e3bf5ce42a8e3ebac5y.png';
  const imageUrl3 = 'https://3.imimg.com/data3/VW/XS/MY-9845636/aluminium-composite-panel-scrap-500x500.jpg';

  return (
    <div className="xrecycling-container">
      <h1 className="xrecycling-title">What We Collect to Recycle</h1>
      <p className="xrecycling-description">
      "Transforming aluminum and glass scraps into valuable resources—reducing environmental waste, promoting sustainability, and fostering a circular economy. Our platform connects businesses and clients, encouraging efficient recycling, responsible reuse, and a cleaner, greener future for all."
      </p>
      <div className="ximage-grid">
        <div className="ximage-item">
          <img src={imageUrl1} alt="Aluminum" className="xaluminum-image" />
          <p className="xaluminum-text">Aluminum Scraps</p>
        </div>
        <div className="ximage-item">
          <img src={imageUrl2} alt="Aluminum" className="xaluminum-image" />
          <p className="xaluminum-text">Glass Scraps</p>
        </div>
        <div className="ximage-item">
          <img src={imageUrl3} alt="Aluminum" className="xaluminum-image" />
          <p className="xaluminum-text">Cladding Boards Scraps </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUSDes3;