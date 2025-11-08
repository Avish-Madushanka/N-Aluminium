import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BSHeader.css";
import BuyCard from "../BuyCard/BuyCard";
import axiosInstance from "../../api/axiosInstance";
import API_ENDPOINTS from "../../apiConfig";

const BSHeader = () => {
  const navigate = useNavigate();
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.SALE_ITEMS.GET_ALL);
        if (response.data && response.data.data) {
          setSaleItems(response.data.data);
        } else {
          setSaleItems([]);
          console.warn("Unexpected response format:", response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching sale items:", err);
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

  const filteredProducts = saleItems.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = selectedFilter ? product.type === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_ENDPOINTS.BACKEND_ROOT_URL}${imagePath}`;
  };

  return (
    <div className="bs-container">
      <div className="filter-sort-controls">
        <div className="dropdown-wrapper">
          <label className="dropdown-label">Category</label>
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

        <div className="dropdown-wrapper">
          <label className="dropdown-label">Color</label>
          <select className="bs-filter-dropdown">
            <option value="">All Colors</option>
          </select>
        </div>

        <div className="dropdown-wrapper">
          <label className="dropdown-label">Features</label>
          <select className="bs-filter-dropdown">
            <option value="">All Features</option>
          </select>
        </div>

        <div className="dropdown-wrapper">
          <label className="dropdown-label">Price</label>
          <select className="bs-filter-dropdown">
            <option value="">From €0 - €1000</option>
          </select>
        </div>

        <div className="sort-button-wrapper">
          <button
            className="bs-sort-button"
            onClick={() => navigate("/SaleForm")}
          >
            Add Sale Items
          </button>
        </div>
      </div>

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
          <button className="bs-retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

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
                  <p className="bs-product-price">
                    €{Number(product.price || 0).toLocaleString()}
                  </p>
                  <p className="bs-product-description">{product.description}</p>

                  <div className="bs-product-meta">
                    <span className="bs-product-location">
                      <i className="fas fa-map-marker-alt"></i> {product.address}
                    </span>
                  </div>

                  <button className="bs-buy-button" onClick={() => openBuyCard(product)}>
                    Contact Seller
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

      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} product={selectedProduct} />}
    </div>
  );
};

export default BSHeader;
