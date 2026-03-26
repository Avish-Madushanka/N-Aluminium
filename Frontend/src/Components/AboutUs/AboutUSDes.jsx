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
      <div className="AB-ocean-container">
        <div className="AB-main-content">
          <div className="AB-left-section">
            <h1 className="AB-title">Work Together to Collect Aluminum Scrap</h1>
            <p className="AB-description">
              Aluminum waste is a growing environmental and economic concern. Every year, 
              <strong>thousands of tons of aluminum scraps</strong> are discarded, 
              ending up in landfills instead of being recycled. Improper disposal wastes 
              valuable resources, increases energy consumption, and contributes to pollution. 
              By collecting and recycling aluminum, we conserve natural resources, reduce 
              greenhouse gas emissions, and support a circular economy.
            </p>
            <div className="AB-image-card">
              <img
                src="https://media.istockphoto.com/id/688587628/photo/aluminium-and-pvc-industry-worker.jpg?s=612x612&w=0&k=20&c=j3W5LQbi0yV0RH0-DLqGs6VeFGlV60Vm_OaiIAMPoTo="
                alt="People cleaning up trash"
              />
              <div className="AB-years-of-experience">15+ Years of Experience</div>
            </div>
          </div>

          <div className="AB-right-section">
            <div className="AB-info-card-container">
              <div className="AB-info-item">
                <div className="AB-info-icon AB-vision">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3412/3412082.png"
                    alt="Vision Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Vision</h3>
                  <p>
                    Our vision is to promote efficient aluminum scrap collection and recycling, 
                    reduce environmental impact, and foster a circular economy where materials 
                    are reused instead of wasted.
                  </p>
                </div>
              </div>

              <div className="AB-info-item">
                <div className="AB-info-icon AB-mission">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2006/2006789.png"
                    alt="Mission Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Mission</h3>
                  <p>
                    Our mission is to provide efficient, reliable, and easily accessible aluminum scrap 
                    collection services, while actively educating and engaging communities on the 
                    importance and benefits of recycling, responsible waste management, and 
                    sustainable living.
                  </p>
                </div>
              </div>

              <div className="AB-info-item">
                <div className="AB-info-icon AB-goals">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/18370/18370444.png"
                    alt="Goals Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Goals</h3>
                  <p>
                    Our goals are to significantly increase aluminum recycling rates, minimize 
                    environmental waste, support and empower local communities, raise awareness 
                    about sustainable practices, and promote a circular economy where materials 
                    are reused efficiently for future generations.
                  </p>
                </div>
              </div>
            </div>

            <a href="/ContactUs" className="AB-learn-more-button">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsDes;
