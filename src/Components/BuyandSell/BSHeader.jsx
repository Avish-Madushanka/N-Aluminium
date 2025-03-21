import React, { useState, useEffect } from "react";
import "./BSHeader.css";
import BuyCard from "../BuyCard/BuyCard";

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  const openBuyCard = () => setIsBuyCardOpen(true);
  const closeBuyCard = () => setIsBuyCardOpen(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter ? product.type === selectedFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bs-container">
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-dropdown"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="Doors">Doors</option>
          <option value="Windows">Windows</option>
          <option value="Pan-Light">Pan Light</option>
          <option value="Others">Others</option>
        </select>
        <a href="/SaleForm" className="sell-button">Sell</a>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt="Product"
                className="product-image"
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">Rs: {product.price}</p>
                <p className="location">{product.address}</p>
                <button className="buy-button" onClick={openBuyCard}>Buy</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products available. Add a new listing!</p>
        )}
      </div>

      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

export default BSHeader;
