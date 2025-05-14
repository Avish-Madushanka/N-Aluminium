import React, { useState } from "react";
import "./BSHeader.css";
import BuyCard from "../BuyCard/BuyCard";

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const exampleProducts = [
    {
      _id: "1",
      name: "Sliding Window",
      description: "Used aluminum sliding window in good condition",
      price: 1200,
      type: "Windows",
      address: "Colombo 5",
      image: "https://5.imimg.com/data5/XI/DO/MY-44591116/aluminium-panel-window-500x500.jpg"
    },
    {
      _id: "2",
      name: "Main Door Frame",
      description: "Strong and durable aluminum door frame",
      price: 2500,
      type: "Doors",
      address: "Negombo",
      image: "https://5.imimg.com/data5/XI/DO/MY-44591116/aluminium-panel-window-500x500.jpg"
    },
    {
      _id: "3",
      name: "Pan-Light Roof Panel",
      description: "Clear roof panels for sunlight",
      price: 900,
      type: "Pan-Light",
      address: "Kandy",
      image: "https://5.imimg.com/data5/XI/DO/MY-44591116/aluminium-panel-window-500x500.jpg"
    },
    {
      _id: "4",
      name: "Aluminum Railings",
      description: "Modern aluminum railings for balcony",
      price: 1800,
      type: "Others",
      address: "Galle",
      image: "https://5.imimg.com/data5/XI/DO/MY-44591116/aluminium-panel-window-500x500.jpg"
    },
    {
      _id: "5",
      name: "Sliding Door",
      description: "High quality aluminum sliding door",
      price: 3200,
      type: "Doors",
      address: "Colombo 7",
      image: "https://5.imimg.com/data5/XI/DO/MY-44591116/aluminium-panel-window-500x500.jpg"
    }
  ];

  const openBuyCard = () => setIsBuyCardOpen(true);
  const closeBuyCard = () => setIsBuyCardOpen(false);

  const filteredProducts = exampleProducts.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = selectedFilter ? product.type === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  return (
    <div className="bs-container">
      {/* Header Section */}
      <div className="bs-header">
        <h1 className="bs-title">Buy & Sell Reuse Items</h1>
        <p className="bs-subtitle">Find quality used aluminum items or sell your own</p>
      </div>

      {/* Filter Controls */}
      <div className="bs-controls">
        <div className="bs-search-container">
          <input
            type="text"
            placeholder="Search by item name..."
            className="bs-search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="bs-filter-dropdown"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
            <option value="Pan-Light">Pan-Light</option>
            <option value="Glass">Glass</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <a href="/SaleForm" className="bs-sell-button">
          <i className="fas fa-plus"></i> Sell Item
        </a>
      </div>

      {/* Product Grid */}
      <div className="bs-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="bs-product-card">
              <div className="bs-product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="bs-product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Product+Image";
                  }}
                />
              </div>
              <div className="bs-product-details">
                <h3 className="bs-product-name">{product.name}</h3>
                <p className="bs-product-description">{product.description}</p>
                <div className="bs-product-meta">
                  <span className="bs-product-price">Rs. {product.price.toLocaleString()}</span>
                  <span className="bs-product-location">
                    <i className="fas fa-map-marker-alt"></i> {product.address}
                  </span>
                </div>
                <button className="bs-buy-button" onClick={openBuyCard}>
                  <i className="fas fa-phone-alt"></i> Contact Seller
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bs-no-products">
            <i className="fas fa-search"></i>
            <p>No products found matching your criteria</p>
            <button 
              className="bs-clear-filters"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* BuyCard Modal */}
      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

export default BSHeader;