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
    <div className="aboutus-banner-container">
        <div className='aboutus-title'>
        <h1>What We Do</h1>
    </div>
      <img
        src={images[currentIndex]}
        alt={`Banner Image ${currentIndex + 1}`}
        className="aboutus-banner-image"
      />
    </div>
  );
};

export default AboutUsHeader;