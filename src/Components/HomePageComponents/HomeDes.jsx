import React from 'react';
import '../HomePageComponents/HomeDes.css'; 

const HomeDes = () => {
  return (
    <div className="waste-disposal-container">
      <h1 className="waste-disposal-heading">
        A wide range of waste disposal services
      </h1>

      <div className="waste-disposal-services">
        {/* Garbage Pickup Service */}
        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://media.licdn.com/dms/image/v2/C5612AQHBxjn-2FxKAQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520141306016?e=2147483647&v=beta&t=pTEHH6x79QwqFIUbEM8KfFbyb8axCwV1IKRUT-PR54E"
              alt="Garbage Pickup"
              className="service-image"
            />
          </div>
          <div className="service-icon-container">
            <i className="fas fa-trash-alt service-icon"></i>
          </div>

          <h3 className="service-title">Garbage Pickup</h3>

          <p className="service-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor nunc tincidun tempor dignisime faucibus molestie.</p>

          <a href="#" className="service-link">
            →
          </a>
        </div>

        {/* Dumpster Rental Service */}
        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://via.placeholder.com/300x200/90EE90/FFFFFF?text=Dumpster+Rental+Image"
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
              src="https://via.placeholder.com/300x200/ADD8E6/FFFFFF?text=Waste+Collection+Image"
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