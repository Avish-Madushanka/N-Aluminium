import React from 'react';
import './BuyCard.css';

const BuyCard = ({ onClose, product }) => { 
  console.log("BuyCard rendered, onClose:", onClose);

  // Default product data in case none is provided
  const defaultProduct = {
    image: "https://i.redd.it/rturazpmucha1.jpg",
    title: "Aluminum Door",
    description: "An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.",
    address: "426F/18 Shanthi Garden, Medha MW, Alubomulla, Panadura\nKalutara, Western",
    price: "Rs: 10,000.00",
    contact: {
      phone: "0777-123 456",
      email: "Admin123@gmail.com"
    }
  };

  // Use the provided product or fall back to defaults
  const {
    image,
    title,
    description,
    address,
    price,
    contact
  } = product || defaultProduct;

  return (
    <div className="popup1-overlay" onClick={onClose}>
      <div className="popup1-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close1-button"
          onClick={(e) => {
            e.stopPropagation(); 
            console.log("Close button clicked");
            if (onClose) onClose(); 
          }}
        >
          x 
        </button>

        <div className="product1-image-container">
          <img
            src={image}
            alt={title}
            className="product1-image"
          />
        </div>

        <div className="product1-info">
          <h2 className="product1-title">{title}</h2>

          <p className="product1-description">
            {description}
          </p>

          <p className="product1-address">
            {address.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <p className="product1-price">{price}</p>

          <div className="contact1-info">
            <p>📞 {contact.phone}</p>
            <p>📧 {contact.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;