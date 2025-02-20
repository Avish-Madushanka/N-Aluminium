import React from 'react';
import '../HomePageComponents/HomeBar.css'

const HomeBar = () => {
    return (
        <div className="HBservices-bar">
          <div className="HBservices-container">
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
          <div className="HBservice-item">
            <span className="HBservice-icon">{icon}</span>
            <h3 className="HBservice-title">{title}</h3>
            <p className="HBservice-description">{description}</p>
          </div>
        );
      };
    
      const VerticalDivider = () => {
        return <div className="HBvertical-divider" />;
      };
    

export default HomeBar;