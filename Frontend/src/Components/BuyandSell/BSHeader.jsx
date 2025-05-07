import React, { useState } from "react";
import "./BSHeader.css";
import BuyCard from "../BuyCard/BuyCard"; // Assume this is your contact modal component

const BuySellPage = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // --- Example Static Product Data ---
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
    }
  ];

  const openBuyCard = () => setIsBuyCardOpen(true);
  const closeBuyCard = () => setIsBuyCardOpen(false);

  // --- Filter Logic ---
  const filteredProducts = exampleProducts.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = selectedFilter ? product.type === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  return (
    <div className="buy-sell-container">
      {/* Top Bar */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by Item Name"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-dropdown"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Doors">Doors</option>
          <option value="Windows">Windows</option>
          <option value="Pan-Light">Pan-Light</option>
          <option value="Others">Others</option>
        </select>
        <a href="/SaleForm" className="sell-button">Sell Item</a>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">Rs: {product.price.toLocaleString()}</p>
                <p className="location">{product.address}</p>
                <button className="buy-button" onClick={openBuyCard}>View Contact</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products match your current filter.</p>
        )}
      </div>

      {/* BuyCard Modal */}
      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

export default BuySellPage;
