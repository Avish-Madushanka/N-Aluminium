// HomeSliding.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeSliding.css';

// Import your actual images here.
// For the example, I'll use placeholders.
import Image1 from '../../assets/Main2.png'; // Assuming a good aspect ratio for the left side
import Image2 from '../../assets/Main1.png';
import Image3 from '../../assets/Main3.jpg';

const HomeSliding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides] = useState([
    {
      image: Image1,
      badge: "Best Home Services",
      title: "Experience the best Home Services",
      subtitle: "We provide best home services around the city. book us now and experience the best service.",
      button1Text: "Book Now",
      button1Link: "#",
      button2Icon: "▶", // Play icon
      button2Link: "#"
    },
    {
      image: Image2,
      badge: "Quality Work Guaranteed",
      title: "Your Trust, Our Priority",
      subtitle: "Dedicated to excellence, we ensure every service is performed with precision and care.",
      button1Text: "Learn More",
      button1Link: "#",
      button2Icon: "ⓘ", // Info icon
      button2Link: "#"
    },
    {
      image: Image3,
      badge: "Fast & Reliable",
      title: "Prompt Service, Every Time",
      subtitle: "Don't wait! Get quick and efficient solutions for all your home service needs.",
      button1Text: "Contact Us",
      button1Link: "#",
      button2Icon: "📞", // Phone icon
      button2Link: "#"
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setIsAnimating(false);
      }, 300); // This duration should match the CSS fade transition
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [slides.length]);

  const handleButtonClick = (url) => {
    // This function can be used if you want custom logic beyond window.location.href
    window.location.href = url;
  };

  const goToSlide = (index) => {
    if (index === currentIndex) return; // Prevent unnecessary animation if already on slide
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300); // This duration should match the CSS fade transition
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="hero-container">
      {/* The hero-overlay will now cover the content section, not the image */}
      <div className="hero-overlay"></div> 
      
      <div className="hero-slider-item">
        <div className="hero-image-section">
          <img
            src={currentSlide.image}
            alt={`Slide ${currentIndex + 1}`}
            className={`hero-image ${isAnimating ? 'fade-out' : 'fade-in'}`}
          />
        </div>

        <div className="hero-content-section">
          <div className="hero-content-inner">
            {currentSlide.badge && (
              <div className="hero-badge">
                <span className="badge-dot"></span>
                {currentSlide.badge}
              </div>
            )}
            
            <h1 className="hero-title">{currentSlide.title}</h1>
            
            <p className="hero-subtitle">{currentSlide.subtitle}</p>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => handleButtonClick(currentSlide.button1Link)}
              >
                {currentSlide.button1Text}
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleButtonClick(currentSlide.button2Link)}
              >
                {currentSlide.button2Icon}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="slide-indicators">
        {slides.map((_, index) => (
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