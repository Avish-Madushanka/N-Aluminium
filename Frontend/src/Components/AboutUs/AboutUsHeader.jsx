import React, { useState, useEffect, useRef } from 'react';
import { CircleCheck } from 'lucide-react';
import './AboutUsHeader.css';

const AboutUsHeader = () => {
  const [counts, setCounts] = useState({
    years: 0,
    projects: 0,
    clients: 0
  });
  
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const targetValues = {
    years: 20,
    projects: 5000,
    clients: 3000
  };
  
  const startValues = {
    years: 1,
    projects: 4000,
    clients: 1500
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          
          const increments = {
            years: (targetValues.years - startValues.years) / steps,
            projects: (targetValues.projects - startValues.projects) / steps,
            clients: (targetValues.clients - startValues.clients) / steps
          };
          
          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            setCounts(prev => ({
              years: Math.min(
                targetValues.years,
                Math.floor(startValues.years + increments.years * currentStep)
              ),
              projects: Math.min(
                targetValues.projects,
                Math.floor(startValues.projects + increments.projects * currentStep)
              ),
              clients: Math.min(
                targetValues.clients,
                Math.floor(startValues.clients + increments.clients * currentStep)
              )
            }));
            
            if (currentStep >= steps) {
              setCounts({
                years: targetValues.years,
                projects: targetValues.projects,
                clients: targetValues.clients
              });
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div className="ABH-about-container">
      <div className="ABH-hero-section">
        <div className="ABH-overlay"></div>
        <div className="ABH-hero-content">
          <h1 className="ABH-hero-title">About Us</h1>
        </div>
      </div>

      <section className="ABH-details-section">
        <div className="ABH-details-grid">
          <div className="ABH-details-content">
            <span className="ABH-sub-tag">ABOUT OUR COMPANY</span>
            <h2 className="ABH-main-heading">
              Precision Crafted Aluminum Solutions for Modern Living
            </h2>
            
            <div className="ABH-accent-bars">
              <span className="bar-long"></span>
              <span className="bar-short"></span>
              <span className="bar-short"></span>
            </div>

            <p className="ABH-description">
              Established in 2003 in Panadura, Sri Lanka, we have spent over two decades 
              perfecting the art of aluminum fabrication. Our commitment to excellence ensures that 
              every project we undertake—from residential windows to massive commercial structures—is 
              built to last a lifetime.
            </p>
            <p className="ABH-description">
              By combining high-grade materials with advanced technical expertise, we provide eco-friendly 
              and energy-efficient aluminum systems. We take pride in being a trusted partner for 
              architects and homeowners across Sri Lanka, delivering durability and elegance in every weld.
            </p>

            <ul className="ABH-feature-list">
              <li>
                <div className="ABH-icon-circle"><CircleCheck size={18} fill="#98c63d" color="white" /></div>
                <span>Superior durability and weather-resistant finishes.</span>
              </li>
              <li>
                <div className="ABH-icon-circle"><CircleCheck size={18} fill="#98c63d" color="white" /></div>
                <span>Custom-tailored designs for unique architectural requirements.</span>
              </li>
            </ul>
          </div>

          <div className="ABH-image-wrapper">
            <div className="ABH-image-bg-box"></div>
            <img 
              src="https://www.shutterstock.com/image-photo/pvc-industry-worker-operator-making-600nw-2498302763.jpg" 
              alt="Aluminum Fabrication Workshop" 
              className="ABH-main-img"
            />
          </div>
        </div>
      </section>

      <div ref={statsRef} className="ABH-stats-bar-container">
        <div className="ABH-stats-content">
          <div className="ABH-stat-item">
            <h3 className="ABH-stat-number">{counts.years}+</h3>
            <p className="ABH-stat-label">Years Experience</p>
          </div>
          
          <div className="ABH-stat-divider"></div>

          <div className="ABH-stat-item">
            <h3 className="ABH-stat-number">{counts.projects}+</h3>
            <p className="ABH-stat-label">Projects Done</p>
          </div>

          <div className="ABH-stat-divider"></div>

          <div className="ABH-stat-item">
            <h3 className="ABH-stat-number">{counts.clients}+</h3>
            <p className="ABH-stat-label">Happy Client</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsHeader;