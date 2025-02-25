import React, { useState } from 'react';
import './BSHeader.css';
import BuyCard from '../BuyCard/BuyCard'; 

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false); 

  const openBuyCard = () => {
    console.log("Opening BuyCard");
    setIsBuyCardOpen(true);
  };

  const closeBuyCard = () => {
    console.log("Closing BuyCard");
    setIsBuyCardOpen(false);
  };

  return (
    <div>
      <div className="container">
        <div className="top-bar">
          <input type="text" placeholder="Search" className="search-bar" />
          <select className="filter-dropdown">
            <option value="">Filter by Type</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
            <option value="Pan-Light">Pan Light</option>
            <option value="Others">Others</option>
          </select>
          <a href="/SaleForm" className="Sellbutton">Sell</a>
        </div>

        <div className="product-grid">
          <div className="product-card">
            <img src="https://i.redd.it/rturazpmucha1.jpg" alt="Product" className="product-image" />
            <div className="product-details">
              <h3>Aluminum Door</h3>
              <p>An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.</p>
              <p className="price">Rs: 10,000.00</p>
              <p className="location">Kaluthara Western</p>
              <button className="buy-button" onClick={openBuyCard}>Buy</button>
            </div>
          </div>

          <div className="product-card">
            <img src="https://i.redd.it/rturazpmucha1.jpg" alt="Product" className="product-image" />
            <div className="product-details">
              <h3>Aluminum </h3>
              <p>An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.</p>
              <p className="price">Rs: 10,000.00</p>
              <p className="location">Kaluthara Western</p>
              <button className="buy-button" onClick={openBuyCard}>Buy</button>
            </div>
          </div>

          <div className="product-card">
            <img src="https://i.redd.it/rturazpmucha1.jpg" alt="Product" className="product-image" />
            <div className="product-details">
              <h3>Aluminum Door</h3>
              <p>An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.</p>
              <p className="price">Rs: 10,000.00</p>
              <p className="location">Kaluthara Western</p>
              <button className="buy-button" onClick={openBuyCard}>Buy</button>
            </div>
          </div>

          <div className="product-card">
            <img src="https://i.redd.it/rturazpmucha1.jpg" alt="Product" className="product-image" />
            <div className="product-details">
              <h3>Aluminum Door</h3>
              <p>An aluminum door is strong, lightweight, weather-resistant, durable, low-maintenance, and modern-looking.</p>
              <p className="price">Rs: 10,000.00</p>
              <p className="location">Kaluthara Western</p>
              <button className="buy-button" onClick={openBuyCard}>Buy</button>
            </div>
          </div>

        </div>
      </div>

      {isBuyCardOpen && (
        <>
          {console.log("closeBuyCard is a function:", typeof closeBuyCard === 'function')}
          <BuyCard onClose={closeBuyCard} />
        </>
      )}
    </div>
  );
};

export default BSHeader;