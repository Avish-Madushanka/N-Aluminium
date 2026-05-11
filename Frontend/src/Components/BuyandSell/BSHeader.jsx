import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BSHeader.css";

const BSHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5003/api/buy-and-sell");
        if (response.data && response.data.data) {
          setSaleItems(response.data.data);
          setFilteredProducts(response.data.data);
        } else {
          setSaleItems([]);
          setFilteredProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load items. Please try again later.");
        setSaleItems([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleItems();
  }, []);

  useEffect(() => {
    let filtered = [...saleItems];
    
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedFilter) {
      filtered = filtered.filter((product) => product.type === selectedFilter);
    }
    
    if (selectedCondition) {
      filtered = filtered.filter((product) => product.condition === selectedCondition);
    }
    
    if (sortOption === "price-low-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price-high-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedFilter, selectedCondition, sortOption, saleItems]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    const images = [selectedProduct.imagePath, ...(selectedProduct.additionalImages || [])];
    setCurrentImageIndex((prev) => 
      prev + 1 >= images.length ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const images = [selectedProduct.imagePath, ...(selectedProduct.additionalImages || [])];
    setCurrentImageIndex((prev) => 
      prev - 1 < 0 ? images.length - 1 : prev - 1
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5003${imagePath}`;
  };

  const getDiscountData = (product) => {
    if (product.oldPrice && product.price && product.oldPrice > product.price) {
        const perc = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
        return { percent: perc, old: product.oldPrice };
    }
    const simulatedOld = Math.floor(product.price * 1.25);
    return { percent: 25, old: simulatedOld };
  };

  return (
    <div className="bs-header-container">
      <div className="bs-header-hero-section">
        <div className="bs-header-hero-overlay"></div>
        <div className="bs-header-hero-content">
          <div className="bs-header-hero-text">
            <h1 className="bs-header-hero-title">
              <span className="bs-header-hero-buy">BUY</span>
              <span className="bs-header-hero-separator">•</span>
              <span className="bs-header-hero-sell">SELL</span>
              <span className="bs-header-hero-separator">•</span>
              <span className="bs-header-hero-thrift">THRIFT</span>
            </h1>
            <p className="bs-header-hero-subtitle">Your Premier Marketplace for Reuse Items</p>
            <div className="bs-header-hero-stats">
              <div className="bs-header-stat">
                <span className="bs-header-stat-number">500+</span>
                <span className="bs-header-stat-label">Items Listed</span>
              </div>
              <div className="bs-header-stat">
                <span className="bs-header-stat-number">200+</span>
                <span className="bs-header-stat-label">Happy Sellers</span>
              </div>
              <div className="bs-header-stat">
                <span className="bs-header-stat-number">1000+</span>
                <span className="bs-header-stat-label">Customers</span>
              </div>
            </div>

          </div>
          <div className="bs-header-hero-image-wrapper">
            <div className="bs-header-hero-image-container">
              <img 
                src="https://cdn.prod.website-files.com/64103945fcba0014f0074475/641412519741e402cfb0b299_5-3.png" 
                alt="Shopping" 
                className="bs-header-hero-image" 
              />
            </div>
            <div className="bs-header-hero-floating-card">
              <i className="fas fa-tag"></i>
              <span>Up to 50% Off</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bs-header-search-and-filters">
        <div className="bs-header-filters-row">
          <div className="bs-header-search-box">
            <i className="fas fa-search bs-header-search-icon"></i>
            <input 
              type="text" 
              placeholder="Search for products, brands, and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bs-header-search-input"
            />
            <button className="bs-header-search-btn">Search</button>
          </div>

          <div className="bs-header-dropdown-wrapper">
            <label className="bs-header-dropdown-label">Category</label>
            <select
              className="bs-header-filter-dropdown"
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

          <div className="bs-header-dropdown-wrapper">
            <label className="bs-header-dropdown-label">Condition</label>
            <select
              className="bs-header-filter-dropdown"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="bs-header-dropdown-wrapper">
            <label className="bs-header-dropdown-label">Price</label>
            <select
              className="bs-header-filter-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <button
            className="bs-header-sort-button"
            onClick={() => navigate("/SaleForm")}
          >
            Add Sale Items
          </button>
        </div>
      </div>

      {loading && (
        <div className="bs-header-loading">
          <div className="bs-header-spinner"></div>
        </div>
      )}

      {error && (
        <div className="bs-header-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bs-header-no-items">
          <p>No items found. Be the first to add an item!</p>
          <button onClick={() => navigate("/SaleForm")} className="bs-header-add-button">
            Add Your Item
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="bs-header-product-grid">
          {filteredProducts.map((product) => {
            const disc = getDiscountData(product);
            return (
              <div key={product._id} className="bs-header-item-card" onClick={() => openProductModal(product)}>
                <div className="bs-header-item-img-box">
                  <img src={getImageUrl(product.imagePath)} alt={product.name} />
                  <div className="bs-header-item-discount-tag">
                    <span>{disc.percent}%</span>
                    <span>OFF</span>
                  </div>
                </div>
                <div className="bs-header-item-info-box">
                  <h3 className="bs-header-item-name">{product.name}</h3>
                  {product.brand && <p className="bs-header-item-brand">{product.brand}</p>}
                  <div className="bs-header-item-price-row">
                    <span className="bs-header-item-old-price">Rs. {disc.old.toLocaleString()}</span>
                    <span className="bs-header-item-new-price">Rs. {Number(product.price).toLocaleString()}</span>
                  </div>
                  <div className="bs-header-item-condition">
                    <span className={`condition-badge ${product.condition?.toLowerCase().replace(' ', '-')}`}>
                      {product.condition || "Good"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProduct && (
        <div className="bs-header-detail-overlay" onClick={closeProductModal}>
          <div className="bs-header-detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="bs-header-detail-layout">
              
              <div className="bs-header-detail-media">
                <div className="bs-header-detail-slider">
                  <button className="bs-header-slider-arrow prev" onClick={prevImage}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="bs-header-slider-main-view">
                    <img 
                      src={getImageUrl([selectedProduct.imagePath, ...(selectedProduct.additionalImages || [])][currentImageIndex])} 
                      alt="Product" 
                    />
                  </div>
                  <button className="bs-header-slider-arrow next" onClick={nextImage}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  <div className="bs-header-slider-pagination">
                    {[selectedProduct.imagePath, ...(selectedProduct.additionalImages || [])].map((_, idx) => (
                      <span key={idx} className={idx === currentImageIndex ? "active" : ""}></span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bs-header-detail-content">
                <h1 className="bs-header-detail-name">{selectedProduct.name}</h1>
                <p className="bs-header-detail-price">Rs. {Number(selectedProduct.price).toLocaleString()}</p>
                {selectedProduct.oldPrice && selectedProduct.oldPrice > selectedProduct.price && (
                  <p className="bs-header-detail-old-price">Was: Rs. {Number(selectedProduct.oldPrice).toLocaleString()}</p>
                )}
                
                <div className="bs-header-detail-hr"></div>

                <div className="bs-header-detail-row">
                  <label>Sold by:</label>
                  <div className="bs-header-detail-seller">
                    <div className="bs-header-seller-icon">
                      <img src="https://ui-avatars.com/api/?name=User&background=random" alt="user" />
                    </div>
                    <span>{selectedProduct.userId?.name || selectedProduct.userId?.fullName || selectedProduct.userId?.ownerName || "User"}</span>
                  </div>
                </div>

                <div className="bs-header-detail-row">
                  <label>Description</label>
                  <div className="bs-header-detail-description">
                    <p>{selectedProduct.description || "No specific description available."}</p>
                  </div>
                </div>

                <div className="bs-header-detail-row">
                  <label>Details</label>
                  <div className="bs-header-detail-meta-group">
                    <div className="bs-header-meta-item">
                        <i className="fas fa-info-circle"></i>
                        <span>Condition: <strong>{selectedProduct.condition || "Good"}</strong></span>
                    </div>
                    {selectedProduct.brand && (
                      <div className="bs-header-meta-item">
                        <i className="fas fa-tag"></i>
                        <span>Brand: <strong>{selectedProduct.brand}</strong></span>
                      </div>
                    )}
                    <div className="bs-header-meta-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Location: <strong>{selectedProduct.address || "Not Specified"}</strong></span>
                    </div>
                    <div className="bs-header-meta-item">
                        <i className="fas fa-phone-alt"></i>
                        <span>Contact: <strong>{selectedProduct.phoneNumber || "Not provided"}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bs-header-detail-row">
                  <label>Categories</label>
                  <div className="bs-header-detail-tags">
                    <span className="bs-header-detail-tag">{selectedProduct.type || "Product"}</span>
                    {selectedProduct.brand && <span className="bs-header-detail-tag">{selectedProduct.brand}</span>}
                    <span className="bs-header-detail-tag">{selectedProduct.condition || "Used"}</span>
                  </div>
                </div>
              </div>

            </div>
            <button className="bs-header-detail-close-btn" onClick={closeProductModal}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BSHeader;