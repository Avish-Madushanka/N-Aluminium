import React from "react";
import "./AboutUSDes2.css"; 

const AboutUSDes2 = () => {
    const steps = [
        {
          number: "1",
          title: "Fill the Pickup Request Form",
          description: "Test-Test-TestTest-Test-TestTest-Test-TestTest-Test-TestTest-Test-Test",
        },
        {
          number: "2",
          title: "Confirm and Submit",
          description: "Test-Test-TestTest-Test-TestTest-Test-TestTest-Test-TestTest-Test-Test",
        },
        {
          number: "3",
          title: " Wait for Confirmation and Pickup",
          description: "Test-Test-TestTest-Test-TestTest-Test-TestTest-Test-TestTest-Test-Test",
        },
      ];
    
      return (
        <div className="bulk-container">
          <h2 className="bulk-title">Request Bulk Pickup</h2>
    
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step">
                <div className="step-icon">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

export default AboutUSDes2;