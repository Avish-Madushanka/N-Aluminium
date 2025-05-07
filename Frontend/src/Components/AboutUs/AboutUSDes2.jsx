import React from "react";
import "./AboutUSDes2.css"; 

const AboutUSDes2 = () => {
    const steps = [
        {
          number: "1",
          title: "Check and Submit Pickup Details",
          description: "Review your address, preferred date, and material information before submitting the pickup request form.",
          icon: "📝"
        },
        {
          number: "2",
          title: "Confirm the Pickup Request",
          description: "Double-check your submitted details and confirm your request to schedule the aluminum scrap pickup.",
          icon: "✅"
        },
        {
          number: "3",
          title: "Deliver to Collection Point",
          description: "Take your prepared aluminum to local recycling centers, scrap yards, or community collection events to ensure proper recycling and maximize value.",
          icon: "🚚"
        },
      ];
    
      return (
        <div className="AD2-container">
          <h2 className="AD2-title">Aluminum Scrap Collection Guide</h2>
          <p className="AD2-subtitle">
            Schedule your aluminum pickup in just three easy steps and support a greener planet!
          </p>
    
          <div className="AD2-steps">
            {steps.map((step, index) => (
              <div key={index} className="AD2-step">
                <div className="AD2-circle">
                  <div className="AD2-number">{step.number}</div>
                  <span className="AD2-icon">{step.icon}</span>
                </div>
                <div className="AD2-content">
                  <h3 className="AD2-step-title">{step.title}</h3>
                  <p className="AD2-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      );
};

export default AboutUSDes2;
