import React from 'react';
import '../HomePageComponents/HomeDes.css'; 

const HomeDes = () => {
  return (
    <div className="waste-disposal-container">
      <h1 className="waste-disposal-heading">
        A wide range of waste disposal services
      </h1>

      <div className="waste-disposal-services">
        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://www.sjcfl.us/wp-content/uploads/2024/07/recycling-truck-1024x684.png"
              alt="Garbage Pickup"
              className="service-image"
            />
          </div>
          <div className="service-icon-container">
            <i className="fas fa-trash-alt service-icon"></i>
          </div>

          <h3 className="service-title">Scraps Pickup</h3>

          <p className="service-description">Effortless scrap pickup—recycle aluminum waste with ease! Fast, reliable, and eco-friendly collection services to keep your space clean while supporting sustainability.</p>

          <a href="/Collection" className="service-link">
            →
          </a>
        </div>

        {/* Dumpster Rental Service */}
        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://media.istockphoto.com/id/181874893/photo/recycling-bin-aluminum.jpg?s=612x612&w=0&k=20&c=Hj7pb0jn33l35Aoeac3HScYzOPXI29uq_75HheDyn5c="
              alt="Dumpster Rental"
              className="service-image"
            />
          </div>
          <div className="service-icon-container">
            <i className="fas fa-dumpster service-icon"></i>
          </div>

          <h3 className="service-title">Dumpster Rental</h3>

          <p className="service-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor nunc tincidun tempor dignisime faucibus molestie.</p>

          <a href="#" className="service-link">
            →
          </a>
        </div>

        {/* Waste Collection Service */}
        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://media.istockphoto.com/id/181874893/photo/recycling-bin-aluminum.jpg?s=612x612&w=0&k=20&c=Hj7pb0jn33l35Aoeac3HScYzOPXI29uq_75HheDyn5c="
              alt="Waste Collection"
              className="service-image"
            />
          </div>
          <div className="service-icon-container">
            <i className="fas fa-recycle service-icon"></i>
          </div>

          <h3 className="service-title">Waste Collection</h3>

          <p className="service-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor nunc tincidun tempor dignisime faucibus molestie.</p>

          <a href="#" className="service-link">
            →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeDes;