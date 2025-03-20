import React, { useState, useEffect } from 'react';
import './BSHeader.css';
import BuyCard from '../BuyCard/BuyCard';

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
  }, []);

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
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="product-card">
                <img src={product.image || "https://via.placeholder.com/150"} alt="Product" className="product-image" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">Rs: {product.price}</p>
                  <p className="location">{product.location}</p>
                  <button className="buy-button" onClick={openBuyCard}>Buy</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available. Add a new listing!</p>
          )}
        </div>
      </div>

      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

export default BSHeader;
