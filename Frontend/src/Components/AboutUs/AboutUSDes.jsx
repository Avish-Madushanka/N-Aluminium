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
            <h1 className="AB-title">Work Together to Transform Aluminum Management</h1>
            <p className="AB-description">
              Aluminum waste is a growing environmental and economic challenge. Our <strong> MetaTrade platform </strong> solves this by combining smart collection, recycling, fabrication, and a digital marketplace—helping reduce waste, improve resource efficiency, and support a circular economy.
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
                    Our vision is to build a smart and sustainable aluminum ecosystem where materials are efficiently collected, traded, fabricated, and reused, minimizing environmental impact while maximizing economic value.
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
                    Our mission is to provide a comprehensive digital platform for aluminum management, offering seamless scrap collection, real-time pricing, fabrication support, and a marketplace for reusable materials. We aim to empower communities and businesses with innovative tools that promote sustainability and efficiency.
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
                    Our goals are to improve aluminum resource management, increase recycling and reuse rates, support fabrication and product development, enable transparent and real-time trading, and promote sustainable practices that benefit both the environment and future generations.
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
