import React from "react";
import "./AboutUsDes.css"; 

const AboutUsDes = () => {
  const steps = [
    {
      number: "1",
      title: "Check and Submit Pickup Details",
      description:
        "Review your address, preferred date, and material information before submitting the pickup request form.",
      icon: "📝",
    },
    {
      number: "2",
      title: "Confirm the Pickup Request",
      description:
        "Double-check your submitted details and confirm your request to schedule the aluminum scrap pickup.",
      icon: "✅",
    },
    {
      number: "3",
      title: "Deliver to Collection Point",
      description:
        "Take your prepared aluminum to local recycling centers, scrap yards, or community collection events to ensure proper recycling and maximize value.",
      icon: "🚚",
    },
  ];

  return (
    <div className="AB-main-container">
      <div className="ABrecycling-container">
        <div className="ABimage-section">
          <img
            src="https://fairsalvage.com/wp-content/uploads/2022/05/A-Guide-To-Metal-Recycling-Process_image1.webp"
            alt="Recycling"
            className="ABrecycling-image"
          />
        </div>
        <div className="ABtext-section">
          <h2 className="ABtitle">
            Why <span className="highlight">Recycle</span> Aluminum?
          </h2>
          <p className="ABdescription">
            Aluminum recycling is crucial for environmental sustainability, economic growth,
            and energy conservation. Unlike many materials, aluminum can be recycled
            indefinitely without losing quality. Recycling aluminum saves up to
            <strong> 95% of the energy </strong> required to produce new aluminum, significantly
            reducing greenhouse gas emissions and the carbon footprint. It also
            minimizes landfill waste, protects natural resources, and supports
            local jobs. Together, we can build a circular economy that benefits
            both the planet and future generations.
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default AboutUsDes;
