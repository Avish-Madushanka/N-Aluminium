import React from 'react';
import '../HomePageComponents/HomeBar.css'

const HomeBar = () => {
    return (
        <div className="HBservices-bar">
          <div className="HBservices-container">
            <ServiceItem
              icon="🗑️"
              title="Safe Disposal"
              description="Safe disposal protects health and the environment."
            />
            <VerticalDivider />
            <ServiceItem
              icon="🚛"
              title="Scheduled Pickup"
              description="Timely pickups for a cleaner, greener community."
            />
            <VerticalDivider />
            <ServiceItem
              icon="♻️"
              title="Extensive Recycling"
              description="Extensive recycling for a cleaner, greener planet."
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