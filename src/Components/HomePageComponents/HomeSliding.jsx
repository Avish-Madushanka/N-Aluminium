import React, { useState, useRef, useEffect } from 'react';
import '../../css/Homemain.css';

const HomeSliding = ({ children = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    if (isTransitioning || children.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    setTimeout(() => setIsTransitioning(false), 500); // Adjust timing to match CSS transition
  };

  const prevSlide = () => {
    if (isTransitioning || children.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
    setTimeout(() => setIsTransitioning(false), 500); // Adjust timing to match CSS transition
  };

  useEffect(() => {
    if (children.length > 1) {
      intervalRef.current = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [children.length, currentIndex]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      sliderRef.current.style.transition = isTransitioning ? 'transform 0.5s ease-in-out' : 'none';
    }
  }, [currentIndex, isTransitioning]);

  const sliderRef = useRef(null);

  if (children.length === 0) {
    return <div className="slider-container1"></div>;
  }

  return (
    <div className="slider-container1">
      <div className="slider" ref={sliderRef}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="slide">
            {child}
          </div>
        ))}
      </div>
      {children.length > 1 && (
        <>
          <button className="slider-button prev" onClick={prevSlide} disabled={isTransitioning}>
            &#10094;
          </button>
          <button className="slider-button next" onClick={nextSlide} disabled={isTransitioning}>
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default HomeSliding;