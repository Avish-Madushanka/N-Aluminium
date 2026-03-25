import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeSliding.css';

import Image2 from '../../assets/Main1.jpg';
import Image3 from '../../assets/Main3.jpg';
import Image4 from '../../assets/Main4.jpg';

const HomeSliding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides] = useState([
    {
      id: 1,
      image: Image3,
      badge: "Eco-Friendly & Efficient",
      title: "Aluminum Scrap Collection",
      subtitle: "Schedule pickups easily and contribute to a sustainable future. We ensure fast, reliable, and responsible collection of all aluminum waste, helping you recycle efficiently.",
      button1Text: "Check Pickups",
      button1Link: "/Collection",
      button2Text: "Learn More",
      button2Link: "/learn-more"
    },
    {
      id: 2,
      image: Image4,
      badge: "Innovate & Compete",
      title: "Aluminum Trainers Program",
      subtitle: "Showcase your skills and creativity in aluminum design and fabrication. Participate in exciting competitions, learn from experts, and stand out in the world of aluminum engineering",
      button1Text: "Registration Here",
      button1Link: "/AluTRegForm",
      button2Text: "More Details",
      button2Link: "/AluTReg"
    },
    {
      id: 3,
      image: Image2,
      badge: "Premium Aluminum Products",
      title: "High-Quality Aluminum for Build",
      subtitle: "Explore our wide range of aluminum construction items, from panels and profiles to sheets and fittings. Durable, reliable, and designed for modern construction projects.",
      button1Text: "Order Now",
      button1Link: "/discover"
    },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [slides.length]);

  const handleButtonClick = (url) => {
    if (url.startsWith("http") || url.startsWith("tel:")) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className={`MHC-hero-container slide-${currentSlide.id}`}>
      <div className="MHC-hero-overlay"></div>

      <div className={`MHC-hero-slider-item ${currentSlide.layout}`}>
        <div className="MHC-hero-image-section">
          <img
            src={currentSlide.image}
            alt={`Slide ${currentIndex + 1}`}
            className={`MHC-hero-image ${isAnimating ? 'MHC-fade-out' : 'MHC-fade-in'}`}
          />
        </div>

        <div className={`MHC-hero-content-section ${currentSlide.statsPosition}`}>
          <div className="MHC-hero-content-inner">
            {currentSlide.badge && (
              <div className={`MHC-hero-badge ${currentSlide.badgeStyle}`}>
                {currentSlide.badge}
              </div>
            )}

            <h1 className={`MHC-hero-title1 ${currentSlide.titleStyle}`}>
              {currentSlide.title}
            </h1>
            <p className={`MHC-hero-subtitle ${currentSlide.titleStyle}`}>
              {currentSlide.subtitle}
            </p>

            <div className="MHC-hero-buttons">
              <button
                className="MHC-btn-primary"
                onClick={() => handleButtonClick(currentSlide.button1Link)}
              >
                {currentSlide.button1Text}
              </button>
              {currentSlide.button2Text && (
                <button
                  className="MHC-btn-secondary"
                  onClick={() => handleButtonClick(currentSlide.button2Link)}
                >
                  {currentSlide.button2Text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="MHC-slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`MHC-indicator ${index === currentIndex ? 'MHC-active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSliding;