import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeSliding.css';

import Image1 from '../../assets/Main1.png';
import Image2 from '../../assets/Main1.png';
import Image3 from '../../assets/Main1.png';

const HomeSliding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images] = useState([
    Image1,
    Image2,
    Image3,
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  return (
    <div className="home-banner-container">
      <img
        src={images[currentIndex]}
        alt={`Banner Image ${currentIndex + 1}`}
        className="home-banner-image"
      />
      <div className="home-banner-text">
        <h1>"Collect. Recycle. Renew."</h1>
        <div className="home-banner-buttons">
          <button onClick={() => handleButtonClick('/Collection')}>Check Pickup Dates</button>
          <button onClick={() => handleButtonClick('/WastePickForm')}>Sell Scraps</button>
        </div>
      </div>
    </div>
  );
};

export default HomeSliding;
