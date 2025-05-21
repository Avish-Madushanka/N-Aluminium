import React, { useState, useEffect } from "react";
import "./BSHeader.css";
import BuyCard from "../BuyCard/BuyCard";
import axiosInstance from "../../api/axiosInstance";
import API_ENDPOINTS from "../../apiConfig";

const BSHeader = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch sale items from the API
  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.SALE_ITEMS.GET_ALL);
        console.log("[BSHeader] Sale items fetched:", response.data);
        
        if (response.data && response.data.data) {
          setSaleItems(response.data.data);
        } else {
          setSaleItems([]);
          console.warn("[BSHeader] Unexpected response format:", response.data);
        }
        setError(null);
      } catch (err) {
        console.error("[BSHeader] Error fetching sale items:", err);
        setError("Failed to load items. Please try again later.");
        setSaleItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleItems();
  }, []);

  const openBuyCard = (product) => {
    setSelectedProduct(product);
    setIsBuyCardOpen(true);
  };
  
  const closeBuyCard = () => {
    setIsBuyCardOpen(false);
    setSelectedProduct(null);
  };

  // Filter products based on search query and selected filter
  const filteredProducts = saleItems.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = selectedFilter ? product.type === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  // Get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, construct the URL using the backend root
    const backendRoot = API_ENDPOINTS.BACKEND_ROOT_URL;
    return `${backendRoot}${imagePath}`;
  };

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

      {/* Loading and Error States */}
      {loading && (
        <div className="bs-loading">
          <div className="bs-spinner"></div>
          <p>Loading items...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bs-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className="bs-retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <div className="bs-product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bs-product-card">
                <div className="bs-product-image-container">
                  <img
                    src={getImageUrl(product.imagePath)}
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
                  <button className="bs-buy-button" onClick={() => openBuyCard(product)}>
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
      )}

      {/* BuyCard Modal - Pass the selected product data */}
      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} product={selectedProduct} />}
    </div>
  );
};

export default BSHeader;
