import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AboutUs/AboutUsHeader.css';


const AboutUsHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images] = useState([
    'https://www.recycling-magazine.com/wp-content/uploads/2021/09/Clean-aluminum-at-Centro-Rottami.jpg_web-scaled.jpg',
    'https://img.freepik.com/premium-photo/pile-many-aluminum-waste-construction-material-scraps-ground-recycling_43514-2863.jpg',
    'https://www.gme-recycling.com/wp-content/uploads/2023/05/aluminum-recycling.jpg',
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
        <h1>Discover Rare Gemstones. Bid, Buy, and Learn with Confidence</h1>
        <p>
            Explore our trusted gemstone auctions, authenticate your treasures,<br />
             and access expert education.
        </p>
        <div className="home-banner-buttons">
          <button onClick={() => handleButtonClick('/start-bidding')}>Start Bidding</button>
          <button onClick={() => handleButtonClick('/learn-about-gemstones')}>Learn About Gemstones</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsHeader;