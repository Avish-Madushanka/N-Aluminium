import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceMain.css';

const ServiceMain = () => {

  return (
    <div className="service-container">
      <div className="service-header">
        <div className="service-content">
          <div className="service-left">
            <h1 className="service-title">
              We Provide Competitive & Reliable Business Waste Collection Solutions
            </h1>
            <p className="service-description">
              With strategically located operations across US, Wastia provides customers with an extensive range of innovative environmental services, all from one efficient company.
            </p>
            <p className="service-secondary-description">
              We've made huge strides in our sustainability journey by investing in plastic recycling and energy-from-waste infrastructure. Our carbon initiatives offer reliable, low-cost commercial waste collection services to meet all your waste requirements.
            </p>
            <div className="service-cta">
              <Link to="/about" className="service-button">More About Us</Link>
              <div className="service-founder">
                <div className="founder-image"></div>
              </div>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <img
                src="https://www.dcw.co.uk/wp-content/uploads/2021/09/The-Benefits-of-Waste-Collection-Services-for-Your-Business-scaled.jpg"
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
                src="https://www.dcw.co.uk/wp-content/uploads/2021/09/The-Benefits-of-Waste-Collection-Services-for-Your-Business-scaled.jpg"
                alt="Waste collection worker"
                className="main-image"
                />
              </div>
              </div>
              <div className="service-left">
                <h1 className="service-title">
                  We Provide Competitive & Reliable Business Waste Collection Solutions
              </h1>
              <p className="service-description">
                  With strategically located operations across US, Wastia provides customers with an extensive range of innovative environmental services, all from one efficient company.
              </p>
              <p className="service-secondary-description">
                We've made huge strides in our sustainability journey by investing in plastic recycling and energy-from-waste infrastructure. Our carbon initiatives offer reliable, low-cost commercial waste collection services to meet all your waste requirements.
              </p>
              <div className="service-cta">
                <Link to="/about" className="service-button">More About Us</Link>
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
              We Provide Competitive & Reliable Business Waste Collection Solutions
            </h1>
            <p className="service-description">
              With strategically located operations across US, Wastia provides customers with an extensive range of innovative environmental services, all from one efficient company.
            </p>
            <p className="service-secondary-description">
              We've made huge strides in our sustainability journey by investing in plastic recycling and energy-from-waste infrastructure. Our carbon initiatives offer reliable, low-cost commercial waste collection services to meet all your waste requirements.
            </p>
            <div className="service-cta">
              <Link to="/about" className="service-button">More About Us</Link>
              <div className="service-founder">
                <div className="founder-image"></div>
              </div>
            </div>
          </div>
          <div className="service-right">
            <div className="service-image">
              <img
                src="https://www.dcw.co.uk/wp-content/uploads/2021/09/The-Benefits-of-Waste-Collection-Services-for-Your-Business-scaled.jpg"
                alt="Waste collection worker"
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
