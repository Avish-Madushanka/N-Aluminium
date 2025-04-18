// --- START OF UPDATED BuySellPage.jsx (formerly BSHeader.jsx) ---
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./BSHeader.css"; // Rename CSS file or update import
import BuyCard from "../BuyCard/BuyCard"; // Adjust path if needed

// Define Backend URL (Consider putting in a config file or .env)
const BACKEND_URL = 'http://localhost:5002';

// Rename component
const BuySellPage = () => {
  const [isBuyCardOpen, setIsBuyCardOpen] = useState(false);
  const [products, setProducts] = useState([]); // State for products from API
  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [error, setError] = useState('');     // Error state for fetching
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // --- Fetch Products from Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${BACKEND_URL}/api/saleitems`); // Use backend URL
        if (response.data && response.data.success) {
          setProducts(response.data.data || []); // Set products from response data
        } else {
          setError('Failed to load products.');
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || 'Could not fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Call fetch on component mount
  }, []); // Empty dependency array: fetch only once

  const openBuyCard = () => setIsBuyCardOpen(true);
  const closeBuyCard = () => setIsBuyCardOpen(false);

  // --- Filtering Logic (remains the same, operates on fetched data) ---
  const filteredProducts = products.filter((product) => {
    // Ensure fields exist before calling toLowerCase()
    const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const filterMatch = selectedFilter ? product.type === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  // --- Render Logic ---
  return (
    // Rename container class if desired
    <div className="buy-sell-container">
      {/* Top Bar with Search, Filter, Sell Button */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by Item Name" // More specific placeholder
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-dropdown"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          aria-label="Filter by Type" // Accessibility
        >
          <option value="">All Types</option> {/* Clearer default option */}
          <option value="Doors">Doors</option>
          <option value="Windows">Windows</option>
          <option value="Pan-Light">Pan Light</option>
          <option value="Others">Others</option>
        </select>
        {/* Link to the SaleForm page */}
        <a href="/SaleForm" className="sell-button">Sell Item</a>
      </div>

       {/* Display Loading or Error State */}
       {loading && <p className="loading-message">Loading products...</p>}
       {error && <p className="error-message">{error}</p>}

      {/* Product Grid */}
      {!loading && !error && ( // Only render grid if not loading and no error
         <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => ( // Use product._id for key if available
              <div key={product._id || product.name} className="product-card">
                {/* Construct image URL from backend path */}
                <img
                  src={product.image ? `${BACKEND_URL}${product.image}` : "https://via.placeholder.com/150"}
                  alt={product.name || "Product Image"}
                  className="product-image"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }} // Fallback image
                />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {/* Ensure price is formatted */}
                  <p className="price">Rs: {product.price?.toLocaleString() ?? 'N/A'}</p>
                  <p className="location">{product.address}</p>
                  {/* Add contact button or logic */}
                  <button className="buy-button" onClick={openBuyCard}>View Contact</button>
                </div>
              </div>
            ))
          ) : (
             // Show message if filters result in no products, or if DB is empty
             <p className="no-products">
               {products.length === 0 ? "No products listed yet. Be the first!" : "No products match your current filter."}
            </p>
          )}
        </div>
      )}


      {/* BuyCard Modal (remains the same) */}
      {isBuyCardOpen && <BuyCard onClose={closeBuyCard} />}
    </div>
  );
};

// Rename export
export default BuySellPage;
// --- END OF UPDATED BuySellPage.jsx ---