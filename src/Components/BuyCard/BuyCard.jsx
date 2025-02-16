import React, { useState } from 'react';
import './BuyCard.css';

const BuyCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="open-popup1-button" onClick={togglePopup}>
        View Product Details
      </button>

      {isOpen && (
        <div className="popup1-overlay">
          <div className="popup1-content">
            <button className="close1-button" onClick={togglePopup}>
              ×
            </button>

            <div className="product1-image-container">
              <img
                src="https://i.redd.it/rturazpmucha1.jpg"
                alt="Aluminum Door"
                className="product1-image"
              />
            </div>

            <div className="product1-info">
              <h2 className="product1-title">Aluminum Door</h2>

              <p className="product1-description">
                An aluminum door is strong, lightweight, weather-resistant, durable,
                low-maintenance, and modern-looking.
                <br />
                An aluminum door is strong, lightweight, weather-resistant, durable,
                low-maintenance, and modern-looking.
              </p>

              <p className="product1-address">
                426F/18 shanthi garden, Medha MW, alubomulla, Panadura
                <br />
                Kaluthara Western
              </p>

              <p className="product1-price">Rs: 10,000.00</p>

              <div className="contact1-info">
                <p>0777-123 456</p>
                <p>Admin123@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCard;