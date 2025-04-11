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
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = document.querySelectorAll('.service-header');
    sections.forEach(section => {
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
      <div className="service-header">
        <div className="service-content">
          <div className="service-left">
            <h1 className="service-title">
              Aluminum Scraps Pickup
            </h1>
            <p className="service-description">
              We offer a reliable, convenient, and eco-friendly aluminum scraps pickup service tailored for homes, businesses, factories, and workshops of all sizes. Whether you have old aluminum window frames, roofing sheets, machinery parts, or leftover offcuts from recent projects, our dedicated team is ready to collect them directly from your location—no hassle, no heavy lifting on your part.
            </p>
            <div className="service-cta">
              <Link to="/Collection" className="service-button">More Details...</Link>
              <div className="service-founder">
                <div className="founder-image"></div>
              </div>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <img
                src="https://cdn.prod.website-files.com/65773a6491012c73ae553316/657745075c19731ec5004e3c_City%20Sanitary%20residential%20service%20truck.jpg"
                alt="Waste collection worker"
                className="main-image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="service-header">
        <div className="service-content">
          <div className="service-right">
            <div className="service-image">
              <img
                src="https://img.freepik.com/premium-vector/businessman-hold-buy-sell-signs_140689-4467.jpg"
                alt="Buy and sell illustration"
                className="main-image"
              />
            </div>
          </div>
          <div className="service-left">
            <h1 className="service-title">
              Reuse items Buy & Sell
            </h1>
            <p className="service-description">
              Buy and sell reusable items effortlessly! Discover a smarter, more sustainable way to exchange goods by giving your pre-owned items a second life. Whether you're decluttering your space or looking for affordable finds, our platform makes it easy to connect with others in your community. Save money, reduce environmental impact, and contribute to a circular economy. Every item reused is one less in the landfill—join us in building a greener, cleaner future through conscious and convenient trading.
            </p>
            <div className="service-cta">
              <Link to="/BuyandSell" className="service-button">More Details...</Link>
              <div className="service-founder">
                <div className="founder-image"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-header">
        <div className="service-content">
          <div className="service-left">
            <h1 className="service-title">
              Latest Projects
            </h1>
            <p className="service-description">
              Take a look at our most recent work, where innovation meets sustainability. From custom aluminum installations to eco-friendly scrap collection initiatives, our latest projects showcase our commitment to quality, efficiency, and environmental responsibility. Each project reflects our dedication to meeting client needs while promoting smart, resource-conscious solutions. We're proud to bring creative ideas to life and contribute to a cleaner, greener future—one project at a time.
            </p>
            <div className="service-cta">
              <Link to="/Project" className="service-button">More Details...</Link>
              <div className="service-founder">
                <div className="founder-image"></div>
              </div>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <img
                src="https://metalwindows.co.za/wp-content/uploads/2022/07/Aluminium-Doors-Steel-Aluminium-Window-Specialists-In-Cape-Town-Metal-Windows.png"
                alt="Aluminum projects"
                className="main-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMain;