import React, { useEffect } from 'react';
import './ServiceMain.css';

const Card = ({ type, title, description, buttonText, imageSrc, altText, themeClass, cardSize = 'large' }) => {
  return (
    <div className={`Ser-card ${themeClass} ${cardSize === 'small' ? 'Ser-card-small' : 'Ser-card-large'}`}>
      <div className="Ser-card-image-container">
        <img src={imageSrc} alt={altText} className="Ser-card-image" />
      </div>
      <div className="Ser-card-content">
        <p className="Ser-card-type">{type}</p>
        <h2 className="Ser-card-title">{title}</h2>
        {description && cardSize !== 'small' && <p className="Ser-card-description">{description}</p>}
        {buttonText && cardSize !== 'small' && <button className="Ser-card-button">{buttonText}</button>}
      </div>
    </div>
  );
};

const ServiceMain = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.Ser-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('Ser-animate-in');
    });
  }, []);

  const cardData = [
    {
      type: "Data Recovery",
      title: "Get Rid of Your Electronic Debt",
      description: "Transform your old electronics into valuable resources through our comprehensive recycling program.",
      buttonText: "Learn More",
      imageSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      altText: "Electronic recycling",
      themeClass: "Ser-card-theme-purple"
    },
    {
      type: "Business Solutions",
      title: "It's Exciting to Purchase a House",
      description: "Discover sustainable building materials and eco-friendly construction solutions for your new home.",
      buttonText: "Explore",
      imageSrc: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      altText: "Sustainable construction",
      themeClass: "Ser-card-theme-orange"
    },
    {
      type: "Smart Solutions",
      title: "Get Rid of Your Electronic Debt",
      description: "Smart recycling solutions for modern electronics and digital waste management.",
      buttonText: "Get Started",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      altText: "Smart recycling",
      themeClass: "Ser-card-theme-green"
    },
    {
      type: "Home Services",
      title: "It's Exciting to Purchase a House",
      description: "Complete home sustainability makeover services.",
      buttonText: "Contact Us",
      imageSrc: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&h=300&fit=crop",
      altText: "Home services",
      themeClass: "Ser-card-theme-blue"
    },
    {
      type: "Quick Service",
      title: "Electronic Recycling",
      imageSrc: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop",
      altText: "Quick recycling",
      themeClass: "Ser-card-theme-purple"
    },
    {
      type: "Premium",
      title: "Home Solutions",
      imageSrc: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      altText: "Premium services",
      themeClass: "Ser-card-theme-orange"
    }
  ];

  return (
    <div className="Ser-homepage-container">
      <div className="Ser-hero">
        <div className="Ser-hero-content">
          <h1 className="Ser-hero-title">Sustainable Solutions for a Greener Tomorrow</h1>
          <p className="Ser-hero-subtitle">
            Transforming waste into opportunity through innovative recycling and reuse services
          </p>
          <div className="Ser-hero-scroll-indicator">
            <span>Explore Our Services</span>
            <div className="Ser-scroll-arrow"></div>
          </div>
        </div>
      </div>

      <div className="Ser-cards-section">
        <div className="Ser-cards-grid">
          <Card {...cardData[0]} />
          <Card {...cardData[1]} />
          <Card {...cardData[2]} />
          <Card {...cardData[3]} />
          <Card {...cardData[4]} />
        </div>
      </div>
    </div>
  );
};

export default ServiceMain;
