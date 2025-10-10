import React from 'react';
import './AboutUSDes3.css';

const AboutUSDes3 = () => {
  const imageUrl1 = 'https://media.istockphoto.com/id/645897288/photo/abtract-of-metal-scrap.jpg?s=612x612&w=0&k=20&c=LVynqe8WK5q7m1YL2ldXcy44qjRrY3RyD-solAxi-Lc=';
  const imageUrl2 = 'https://s.alicdn.com/@sc04/kf/H72424df1f0d749e3bf5ce42a8e3ebac5y.png';
  const imageUrl3 = 'https://3.imimg.com/data3/VW/XS/MY-9845636/aluminium-composite-panel-scrap-500x500.jpg';
  const imageUrl4 = 'https://www.aluminum.org/sites/default/files/styles/gallery_square_480x480/public/2021-11/can%20line.jpg?itok=pLzI12Gv';
  const imageUrl5 = 'https://5.imimg.com/data5/SELLER/Default/2024/12/472805369/PK/QX/TR/6771719/aluminum-wire-scrap-500x500.jpg';

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
