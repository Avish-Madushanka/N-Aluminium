import React, { useEffect, useState } from 'react';
import '../HomePageComponents/HomeDes.css'; 

const HomeDes = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "Aluminum Scraps Pickup",
      description: "Effortless scrap pickup—recycle aluminum waste with ease! Fast, reliable, and eco-friendly collection services to keep your space clean while supporting sustainability.",
      link: "/Collection",
      image: "https://pic.uhomes.com/onlineblog/cdn/uploads/2024/02/CAM16816-Edit-860x573.jpg",
      alt: "Aluminum Recycling Truck"
    },
    {
      title: "Reuse Items Buy & Sell",
      description: "Buy and sell reusable items effortlessly! Give pre-owned goods a second life while saving money and reducing waste. Sustainable trading for a greener future!",
      link: "/BuyandSell",
      image: "https://img.freepik.com/premium-vector/investment-analyst-holding-buy-sell-board-trading-stock-market-financial-investment-management_251235-575.jpg",
      alt: "Buy and Sell Marketplace"
    },
    {
      title: "Latest Projects",
      description: "Explore our recent work where innovation meets sustainability. From custom aluminum solutions to eco-friendly scrap pickups, each project reflects our commitment to quality, efficiency, and a greener future.",
      link: "/Project",
      image: "https://www.alumo.lk/wp-content/uploads/2017/10/Aluminum-Doors-Windows.jpg",
      alt: "Sustainable Projects"
    }
  ];

  return (
    <div className="waste-disposal-container">
      <h1 className={`waste-disposal-heading ${isVisible ? 'fade-in' : ''}`}>
        Our Features & Services
      </h1>

      <div className="waste-disposal-services">
        {services.map((service, index) => (
          <div 
            key={index}
            className={`service-card ${isVisible ? 'slide-up' : ''}`} 
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="service-image-container">
              <img
                src={service.image}
                alt={service.alt}
                className="service-image"
              />
              <div className="image-overlay">
                <div className="overlay-icon">
                  <div className="pulse-circle"></div>
                </div>
              </div>
            </div>

            <h3 className="service-title">{service.title}</h3>

            <p className="service-description">{service.description}</p>

            <a href={service.link} className="service-link">
              <span className="arrow-icon">→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDes;