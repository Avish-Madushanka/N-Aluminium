import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeSliding.css';


const HomeSliding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images] = useState([
    'https://www.shutterstock.com/image-vector/water-surface-magic-neon-glow-600nw-2483884465.jpg',
    'https://wallpapers.com/images/hd/dark-nature-1920-x-1080-background-lqtolhf1sfr3ve5s.jpg',
    'https://wallpapercave.com/wp/wp13639453.png',
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
          <button onClick={() => handleButtonClick('/start-bidding')}>Start Bidding</button>
          <button onClick={() => handleButtonClick('/learn-about-gemstones')}>Learn About Gemstones</button>
        </div>
      </div>
    </div>
  );
};

export default HomeSliding;