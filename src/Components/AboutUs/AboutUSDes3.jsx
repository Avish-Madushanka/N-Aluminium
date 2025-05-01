import React from 'react';
import './AboutUSDes3.css';

const AboutUSDes3 = () => {
  const imageUrl1 = 'https://media.istockphoto.com/id/133993685/photo/scrap-metal-pieces-laying-in-a-pile.jpg?s=612x612&w=0&k=20&c=255eq6JeJao2iO5w-pXhmFkBGDHLabXH5Kn9SaA1lxw=';
  const imageUrl2 = 'https://s.alicdn.com/@sc04/kf/H72424df1f0d749e3bf5ce42a8e3ebac5y.png';
  const imageUrl3 = 'https://3.imimg.com/data3/VW/XS/MY-9845636/aluminium-composite-panel-scrap-500x500.jpg';
  const imageUrl4 = 'https://www.foodandwine.com/thmb/EEiGergUpA5z0TABZ_gRclGBexk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Why-Cans-Brewers-Use-Aluminum-for-a-Variety-of-Reasons-FT-BLOG0424-295c506644e0435088d08439ab822311.jpg';
  const imageUrl5 = 'https://africangoldcompanygroup.com/wp-content/uploads/2023/11/557513186601830.jpg';

  return (
    <div className="AB3-container">
      <h1 className="AB3-title">What We Collect to Recycle</h1>
      <p className="AB3-description">
      "Transforming aluminum and glass scraps into valuable resources—reducing environmental waste, promoting sustainability, and fostering a circular economy. Our platform connects businesses and clients, encouraging efficient recycling, responsible reuse, and a cleaner, greener future for all."
      </p>
      <div className="AB3-grid">
        <div className="AB3-item">
          <img src={imageUrl1} alt="Aluminum" className="AB3-image" />
          <p className="AB3-text">Aluminum Scraps</p>
        </div>
        <div className="AB3-item">
          <img src={imageUrl2} alt="Aluminum" className="AB3-image" />
          <p className="AB3-text">Glass Scraps</p>
        </div>
        <div className="AB3-item">
          <img src={imageUrl3} alt="Aluminum" className="AB3-image" />
          <p className="AB3-text">Cladding Boards Scraps </p>
        </div>

        <div className="AB3-item">
          <img src={imageUrl4} alt="Aluminum" className="AB3-image" />
          <p className="AB3-text">Aluminum cans</p>
        </div>
        <div className="AB3-item">
          <img src={imageUrl5} alt="Aluminum" className="AB3-image" />
          <p className="AB3-text">aluminium wire scrap</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUSDes3;
