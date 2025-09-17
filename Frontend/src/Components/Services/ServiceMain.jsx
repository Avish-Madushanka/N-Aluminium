import React, { useEffect } from 'react';
import './ServiceMain.css';

const ServiceMain = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.Ser-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('Ser-animate-in');
    });
  }, []);

  const serviceData = [
    { type: "Data Recovery", title: "Professional Data Recovery Services", description: "Recover lost data from damaged hard drives, SSDs, and mobile devices with our advanced recovery techniques.", buttonText: "Get Quote", imageSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop", altText: "Data recovery technology", themeClass: "Ser-card-theme-purple" },
    { type: "IT Consulting", title: "Strategic IT Solutions", description: "Transform your business with cutting-edge technology consulting and digital transformation services.", buttonText: "Learn More", imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", altText: "IT consulting meeting", themeClass: "Ser-card-theme-blue" },
    { type: "Cloud Services", title: "Cloud Migration & Management", description: "Seamlessly migrate to the cloud and optimize your infrastructure for maximum performance and security.", buttonText: "Start Migration", imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop", altText: "Cloud computing infrastructure", themeClass: "Ser-card-theme-green" },
    { type: "Cybersecurity", title: "Advanced Security Solutions", description: "Protect your business with comprehensive cybersecurity services and threat protection systems.", buttonText: "Secure Now", imageSrc: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=300&fit=crop", altText: "Cybersecurity protection", themeClass: "Ser-card-theme-orange" },
    { type: "24/7 Support", title: "Technical Support", imageSrc: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop", altText: "Technical support team", themeClass: "Ser-card-theme-purple", cardSize: "small" },
    { type: "Mobile Development", title: "Custom Mobile Applications", description: "Build powerful mobile apps for iOS and Android with our experienced development team.", buttonText: "Start Project", imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop", altText: "Mobile app development", themeClass: "Ser-card-theme-blue" },
    { type: "Web Development", title: "Modern Web Solutions", description: "Create responsive, high-performance websites and web applications tailored to your business needs.", buttonText: "View Portfolio", imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", altText: "Web development code", themeClass: "Ser-card-theme-green" }
  ];

  const Card = ({ type, title, description, buttonText, imageSrc, altText, themeClass, cardSize = 'large' }) => (
    <div className={`Ser-card ${themeClass} ${cardSize === 'small' ? 'Ser-card-small' : 'Ser-card-large'}`}>
      <div className="Ser-card-image-container">
        <img src={imageSrc} alt={altText} className="Ser-card-image" />
      </div>
      <div className="Ser-card-content">
        <p className="Ser-card-type">{type}</p>
        <h3 className="Ser-card-title">{title}</h3>
        {description && cardSize !== 'small' && <p className="Ser-card-description">{description}</p>}
        {buttonText && cardSize !== 'small' && <button className="Ser-card-button">{buttonText}</button>}
      </div>
    </div>
  );

  return (
    <div className="Ser-homepage-container">
      <div className="Ser-hero">
        <div className="Ser-hero-content">
          <h1 className="Ser-hero-title">Professional IT Services</h1>
          <p className="Ser-hero-subtitle">
            Comprehensive technology solutions designed to accelerate your business growth
          </p>
          <div className="Ser-hero-scroll-indicator">
            <span>Explore Our Services</span>
            <div className="Ser-scroll-arrow"></div>
          </div>
        </div>
      </div>

      <div className="Ser-cards-section">
        <div className="Ser-section-header Ser-section-spacing">
          <h2 className="Ser-section-title">Development Services</h2>
          <p className="Ser-section-subtitle">Custom solutions built for your unique requirements</p>
        </div>
        <div className="Ser-cards-grid">
          {serviceData.slice(5).map((card, idx) => <Card key={idx + 5} {...card} />)}
        </div>
      </div>
    </div>
  );
};

export default ServiceMain;
