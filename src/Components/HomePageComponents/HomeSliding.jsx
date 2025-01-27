import React, { useState, useRef, useEffect } from 'react';
import '../../css/Homemain.css'; 

const HomeSliding = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if(isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
      setTimeout(() => {
          setIsTransitioning(false);
      }, 300);
  };

  const prevSlide = () => {
      if(isTransitioning) return;
    setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
    setTimeout(() => {
        setIsTransitioning(false);
    }, 300);
  };


  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
       sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
    }
  }, [currentIndex, isTransitioning]);

  return (
    <div className="slider-container1">
      <div className="slider" ref={sliderRef}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="slide">
            {child}
          </div>
        ))}
      </div>
      <button className="slider-button prev" onClick={prevSlide} ></button>
      <button className="slider-button next" onClick={nextSlide} ></button>
    </div>
  );
};

export default HomeSliding;