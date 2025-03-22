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

          <h3 className="service-title">Scraps Pickup</h3>

          <p className="service-description">Effortless scrap pickup—recycle aluminum waste with ease! Fast, reliable, and eco-friendly collection services to keep your space clean while supporting sustainability.</p>

          <a href="/Collection" className="service-link">
            →
          </a>
        </div>

        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://img.freepik.com/premium-vector/businessman-hold-buy-sell-signs_140689-4467.jpg"
              alt="Dumpster Rental"
              className="service-image"
            />
          </div>
          <h3 className="service-title">Reuse items Buy & Sell</h3>

          <p className="service-description">Buy and sell reusable items effortlessly! Give pre-owned goods a second life while saving money and reducing waste. Sustainable trading for a greener future!
          </p>

          <a href="/BuyandSell" className="service-link">
            →
          </a>
        </div>

        <div className="service-card">
          <div className="service-image-container">
            <img
              src="https://qph.cf2.quoracdn.net/main-qimg-c9d420c785f4e90372abc836d2ac8f45-lq"
              alt="Waste Collection"
              className="service-image"
            />
          </div>
          <h3 className="service-title">Latest Projects</h3>

          <p className="service-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor nunc tincidun tempor dignisime faucibus molestie.</p>

          <a href="/Project" className="service-link">
            →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeDes;