import React, { useState, useEffect, useRef } from 'react';
import './HomeDes2.css';

import L1 from '../../assets/L1.png';
import L2 from '../../assets/L2.png';
import L3 from '../../assets/L3.png';
import L4 from '../../assets/L4.png';
import L5 from '../../assets/L5.png';

const HomeDes2 = () => {
  const [countProjects, setCountProjects] = useState(4500);
  const [countCustomers, setCountCustomers] = useState(2500);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef(null);

  const brandLogos = [
    { name: "Brand 1", img: L1 },
    { name: "Brand 2", img: L2 },
    { name: "Brand 3", img: L3 },
    { name: "Brand 4", img: L4 },
    { name: "Brand 5", img: L5 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          startCountAnimation(4500, 5000, setCountProjects);
          startCountAnimation(2500, 3000, setCountCustomers);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  const startCountAnimation = (start, end, setter) => {
    let current = start;
    const duration = 2000; 
    const steps = 60;
    const increment = (end - start) / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setter(end);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, intervalTime);
  };

  return (
    <section className="HomeDES2-wrapper" ref={sectionRef}>
      <div className="HomeDES2-container">
        <div className="HomeDES2-content-pane">
          <span className="HomeDES2-brand-label">METATRADE ALUMINUM PLATFORM</span>
          <h2 className="HomeDES2-main-heading">Smart Solutions for Aluminum Recycling, Fabrication & Sustainable Trade</h2>
          <p className="HomeDES2-text-accent">
            We transform aluminum collection and reuse through smart technology, connecting users with real-time pricing and a seamless marketplace to build a sustainable future.
          </p>
          <p className="HomeDES2-text-standard">
            Smart aluminum recycling with real-time pricing, seamless trading, and a sustainable future.
          </p>
        </div>

        <div className="HomeDES2-visual-pane">
          <div className="HomeDES2-stats-overlay">
            <div className="HomeDES2-stat-box HomeDES2-bg-dark">
              <div className="HomeDES2-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              </div>
              <div className="HomeDES2-info-wrap">
                <h3 className="HomeDES2-stat-number">{countProjects.toLocaleString()}+</h3>
                <span className="HomeDES2-stat-label">PROJECT COMPLETED</span>
              </div>
            </div>

            <div className="HomeDES2-stat-box HomeDES2-bg-white">
              <div className="HomeDES2-icon-wrap HomeDES2-text-red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="HomeDES2-info-wrap">
                <h3 className="HomeDES2-stat-number HomeDES2-dark-text">{countCustomers.toLocaleString()}+</h3>
                <span className="HomeDES2-stat-label HomeDES2-gray-text">HAPPY CUSTOMERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="HomeDES2-slider-section">
        <div className="HomeDES2-slider-track">
          {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((brand, index) => (
            <div className="HomeDES2-brand-item" key={index}>
              <img src={brand.img} alt={brand.name} className="HomeDES2-brand-logo-img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDes2;