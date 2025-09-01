import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeSliding.css';

import Image1 from '../../assets/Main1.png';
import Image2 from '../../assets/Main1.png';
import Image3 from '../../assets/Main1.png';

const HomeSliding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images] = useState([Image1, Image2, Image3]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  const goToSlide = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="hero-container">
      <div className="hero-overlay"></div>
      
      <div className="hero-image-container">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={`hero-image ${isAnimating ? 'fade-out' : 'fade-in'}`}
        />
      </div>

      <div className="hero-content">
        <div className="hero-text-container">
          <div className="hero-badge">
            <span>♻️ Eco-Friendly</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-highlight">"Collect</span>
            <span className="title-highlight">Recycle</span>
            <span className="title-highlight">Renew."</span>
          </h1>
          
          <p className="hero-subtitle">
            Transform waste into wealth. Join our sustainable recycling program and make a positive impact on the environment.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => handleButtonClick('/CalendarDisplay')}
            >
              <span>📅</span>
              Check Pickup Dates
            </button>
            <button 
              className="btn-secondary"
              onClick={() => handleButtonClick('/Calculate')}
            >
              <span>💰</span>
              Calculate Scrap Value
            </button>
          </div>
        </div>
      </div>

      <div className="slide-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSliding;