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
            <h1 className="AB-title">Work Together to Clean The Ocean</h1>
            <p className="AB-description">
              Ocean pollution is a growing environmental crisis. Every year,{" "}
              <strong>over 8 million tons of plastic</strong> end up in our
              oceans, harming marine life, disrupting ecosystems, and
              threatening coastal communities.
            </p>
            <div className="AB-image-card">
              <img
                src="https://media.istockphoto.com/id/688587628/photo/aluminium-and-pvc-industry-worker.jpg?s=612x612&w=0&k=20&c=j3W5LQbi0yV0RH0-DLqGs6VeFGlV60Vm_OaiIAMPoTo="
                alt="People cleaning up trash"
              />
              <div className="AB-years-of-experience">20+ Years of Experience</div>
            </div>
          </div>

          <div className="AB-right-section">
            <div className="AB-info-card-container">
              <div className="AB-info-item">
                <div className="AB-info-icon AB-vision">
                  <img
                    src="https://api.iconify.design/heroicons-solid:eye.svg?color=%238bc34a"
                    alt="Vision Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Vision</h3>
                  <p>
                    Our vision is to become a leading source of trusted
                    information and solutions in the waste and disposal industry
                    by attracting, engaging.
                  </p>
                </div>
              </div>

              <div className="AB-info-item">
                <div className="AB-info-icon AB-mission">
                  <img
                    src="https://api.iconify.design/heroicons-solid:clock.svg?color=%238bc34a"
                    alt="Mission Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Mission</h3>
                  <p>
                    Our mission is to drive meaningful growth by delivering
                    high-quality, search-optimized content that connects with a
                    targeted audience.
                  </p>
                </div>
              </div>

              <div className="AB-info-item">
                <div className="AB-info-icon AB-goals">
                  <img
                    src="https://api.iconify.design/heroicons-solid:cog.svg?color=%238bc34a"
                    alt="Goals Icon"
                  />
                </div>
                <div className="AB-info-content">
                  <h3>Our Goals</h3>
                  <p>
                    To support our mission and vision, we've defined key goals
                    to increase organic traffic and engage the right audience
                    effectively.
                  </p>
                </div>
              </div>
            </div>

            <a href="#" className="AB-learn-more-button">
              LEARN MORE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsDes;
