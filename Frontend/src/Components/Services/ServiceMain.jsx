import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServiceMain.css';

const ServiceMain = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.querySelector('.service-content').classList.add('content-visible');
          }, delay);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = document.querySelectorAll('.service-header');
    sections.forEach((section, index) => {
      section.dataset.delay = index * 100; // Staggered delay
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="service-container">
      {/* Hero Section */}
      <div className="service-hero">
        <div className="hero-content">
          <h1 className="hero-title">Sustainable Solutions for a Greener Tomorrow</h1>
          <p className="hero-subtitle">Transforming waste into opportunity through innovative recycling and reuse services</p>
          <div className="hero-scroll-indicator">
            <span>Explore Our Services</span>
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="service-header" data-delay="0">
        <div className="service-content">
          <div className="service-left">
            <div className="service-tag">Collection Service</div>
            <h1 className="service-title">
              <span>Aluminum Scraps</span> Pickup
            </h1>
            <p className="service-description">
              We offer a reliable, convenient, and eco-friendly aluminum scraps pickup service tailored for homes, businesses, factories, and workshops of all sizes. Whether you have old aluminum window frames, roofing sheets, machinery parts, or leftover offcuts from recent projects, our dedicated team is ready to collect them directly from your location—no hassle, no heavy lifting on your part.
            </p>
            <div className="service-cta">
              <Link to="/Collection" className="service-button">
                <span>More Details</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <div className="image-frame"></div>
              <img
                src="https://cdn.prod.website-files.com/65773a6491012c73ae553316/657745075c19731ec5004e3c_City%20Sanitary%20residential%20service%20truck.jpg"
                alt="Waste collection worker"
                className="main-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-header" data-delay="100">
        <div className="service-content reverse">
          <div className="service-left">
            <div className="service-tag">Marketplace</div>
            <h1 className="service-title">
              Reuse Items <span>Buy & Sell</span>
            </h1>
            <p className="service-description">
              Buy and sell reusable items effortlessly! Discover a smarter, more sustainable way to exchange goods by giving your pre-owned items a second life. Whether you're decluttering your space or looking for affordable finds, our platform makes it easy to connect with others in your community.
            </p>
            <div className="service-stats">
            </div>
            <div className="service-cta">
              <Link to="/BuyandSell" className="service-button secondary">
                <span>Browse Marketplace</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <div className="image-frame"></div>
              <img
                src="https://img.freepik.com/premium-vector/businessman-hold-buy-sell-signs_140689-4467.jpg"
                alt="Buy and sell illustration"
                className="main-image"
              />
              <div className="image-overlay secondary"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-header" data-delay="200">
        <div className="service-content">
          <div className="service-left">
            <div className="service-tag">Our Work</div>
            <h1 className="service-title">
              Latest <span>Projects</span>
            </h1>
            <p className="service-description">
              Take a look at our most recent work, where innovation meets sustainability. From custom aluminum installations to eco-friendly scrap collection initiatives, our latest projects showcase our commitment to quality, efficiency, and environmental responsibility.
            </p>
            <div className="service-cta">
              <Link to="/Project" className="service-button">
                <span>View Projects</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <div className="image-frame"></div>
              <img
                src="https://metalwindows.co.za/wp-content/uploads/2022/07/Aluminium-Doors-Steel-Aluminium-Window-Specialists-In-Cape-Town-Metal-Windows.png"
                alt="Aluminum projects"
                className="main-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMain;