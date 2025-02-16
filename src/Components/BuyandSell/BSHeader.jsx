import React, { useState } from 'react';
import './BSHeader.css'; 

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false); 

  const openBuyCard = () => {
    setIsBuyCardOpen(true);
  };

  const closeBuyCard = () => {
    setIsBuyCardOpen(false);
  };

  return (
    <div>
      <div className="container">
        <div className="top-bar">
          <input type="text" placeholder="Search" className="search-bar" />
          <select className="filter-dropdown">
            <option value="">Filter by Location</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Western">Western</option>
          </select>
          <a href="/SaleForm" className="button">Sell</a>
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

      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

export default BSHeader;