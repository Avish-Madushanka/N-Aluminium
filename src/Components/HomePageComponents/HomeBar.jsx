import React from 'react';
import '../HomePageComponents/HomeBar.css'

const HomeBar = () => {
    return (
        <div className="services-bar">
          <div className="services-container">
            <ServiceItem
              icon="🗑️"
              title="Safe Disposal"
              description="Lorem ipsum dolor sit amet consectetur neque id"
            />
            <VerticalDivider />
            <ServiceItem
              icon="🚛"
              title="Scheduled Pickup"
              description="Lorem ipsum dolor sit amet consectetur. Neque id"
            />
            <VerticalDivider />
            <ServiceItem
              icon="♻️"
              title="Extensive Recycling"
              description="Lorem ipsum dolor sit amet consectetur. Neque id"
            />
          </div>
        </div>
      );
    };
    
    const ServiceItem = ({ icon, title, description }) => {
        return (
          <div className="service-item">
            <span className="service-icon">{icon}</span>
            <h3 className="service-title">{title}</h3>
            <p className="service-description">{description}</p>
          </div>
        );
      };
    
      const VerticalDivider = () => {
        return <div className="vertical-divider" />;
      };
    

export default HomeBar;