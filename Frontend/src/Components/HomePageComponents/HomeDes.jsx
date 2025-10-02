import React from 'react';
import { Link } from 'react-router-dom';
import './HomeDes.css';

const HomeDes = ({ backgroundImage = "https://www.nlc.org/wp-content/uploads/2023/01/Five-Ways-to-Run-an-Effective-Solid-Waste-Collection-Operation-2.png" }) => {
  return (
    <section 
      className="HSB-services-hero"
      style={{ '--bg-image': `url(${backgroundImage})` }}
    >
      <div className="HSB-services-hero__overlay"></div>
      <div className="HSB-services-hero__container">
        <div className="HSB-services-hero__content">
          <h1 className="HSB-services-hero__title">
            Our Features  
            <span className="HSB-services-hero__ampersand">&</span>  
            Services
          </h1>
          
          <p className="HSB-services-hero__description">
            Explore our services designed to transform aluminum waste into value while supporting a greener future.
          </p>
          
          <Link to="/Service" className="HSB-services-hero__cta">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeDes;
