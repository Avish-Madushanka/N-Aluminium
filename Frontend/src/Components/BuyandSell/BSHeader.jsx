import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BSHeader.css";
import axiosInstance from "../../api/axiosInstance";
import API_ENDPOINTS from "../../apiConfig";

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
        const response = await axiosInstance.get(API_ENDPOINTS.SALE_ITEMS.GET_ALL);
        if (response.data && response.data.data) {
          setSaleItems(response.data.data);
          setFilteredProducts(response.data.data);
        } else {
          setSaleItems([]);
          setFilteredProducts([]);
        }
        setError(null);
      } catch (err) {
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
    if (selectedProduct && selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev + 1 >= selectedProduct.additionalImages.length ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev - 1 < 0 ? selectedProduct.additionalImages.length - 1 : prev - 1
      );
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_ENDPOINTS.BACKEND_ROOT_URL}${imagePath}`;
  };

  const handleSearch = () => {
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedFilter("");
    setSelectedCondition("");
    setSortOption("");
  };

  return (
    <div className="bs-header-container">
      <div className="bs-header-hero-section">
        <div className="bs-header-hero-left">
          <h1 className="bs-header-hero-title">
            <span className="bs-header-hero-buy">BUY, </span>
            <span className="bs-header-hero-sell">SELL, </span>
            <span className="bs-header-hero-thrift">THRIFT</span>
            <br />
            <span className="bs-header-hero-anything">ANYTHING!</span>
          </h1>
        </div>
        
        <div className="bs-header-hero-right">
          <img 
            src="https://media.istockphoto.com/id/2165977842/photo/woman-moving-delivery-boxes.jpg?s=612x612&w=0&k=20&c=cvWBRGy2JP7N-I_RJgEYWHdtAtoMXe0DUK1_siK7s2M=" 
            alt="Hero Banner" 
            className="bs-header-hero-image" 
          />
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
            <button className="bs-header-search-btn" onClick={handleSearch}>Search</button>
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
              onChange={handleSortChange}
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
          <p>Loading items...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bs-header-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button className="bs-header-retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bs-header-product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="bs-header-product-card">
                  <div className="bs-header-product-image-container">
                    <img
                      src={getImageUrl(product.imagePath)}
                      alt={product.name}
                      className="bs-header-product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <span className="bs-header-product-condition-badge">
                      {product.condition || "Good"}
                    </span>
                  </div>
                  
                  <div className="bs-header-product-details">
                    <h3 className="bs-header-product-name">{product.name}</h3>
                    <p className="bs-header-product-price">
                      €{Number(product.price || 0).toLocaleString()}
                    </p>
                    
                    <div className="bs-header-product-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{product.address || "Location not specified"}</span>
                    </div>

                    <button 
                      className="bs-header-view-more-button"
                      onClick={() => openProductModal(product)}
                    >
                      View More Details →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bs-header-no-products">
                <i className="fas fa-search"></i>
                <p>No products found matching your criteria</p>
                <button
                  className="bs-header-clear-filters"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {selectedProduct && (
        <div className="bs-header-modal-overlay" onClick={closeProductModal}>
          <div className="bs-header-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bs-header-modal-close" onClick={closeProductModal}>
              ✕
            </button>

            <div className="bs-header-modal-content">
              <div className="bs-header-modal-header">
                <h2 className="bs-header-modal-title">{selectedProduct.name}</h2>
                <span className="bs-header-modal-category">
                  {selectedProduct.type || "Uncategorized"}
                </span>
              </div>

              <div className="bs-header-modal-price-section">
                <p className="bs-header-modal-price">
                  €{Number(selectedProduct.price || 0).toLocaleString()}
                </p>
                <span className={`bs-header-modal-condition condition-${selectedProduct.condition?.toLowerCase().replace(' ', '-') || 'good'}`}>
                  {selectedProduct.condition || "Good"}
                </span>
              </div>

              <div className="bs-header-modal-info">
                <div className="bs-header-modal-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{selectedProduct.address || "Location not specified"}</span>
                </div>
                {selectedProduct.projectDate && (
                  <div className="bs-header-modal-date">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Posted: {new Date(selectedProduct.projectDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {(selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0) && (
                <div className="bs-header-modal-gallery-section">
                  <h3>Product Gallery</h3>
                  
                  <div className="bs-header-gallery-slider">
                    <button className="bs-header-slider-nav prev" onClick={prevImage}>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    <div className="bs-header-slider-main">
                      <img 
                        src={getImageUrl(selectedProduct.additionalImages[currentImageIndex])}
                        alt={`${selectedProduct.name} - ${currentImageIndex + 1}`}
                        className="bs-header-slider-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
                        }}
                      />
                    </div>
                    
                    <button className="bs-header-slider-nav next" onClick={nextImage}>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                  
                  <div className="bs-header-gallery-thumbnails">
                    {selectedProduct.additionalImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`bs-header-thumbnail-item ${idx === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Thumbnail ${idx + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x80?text=No+Image";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bs-header-modal-description-section">
                <h3>Description</h3>
                <p className="bs-header-modal-description">
                  {selectedProduct.description || "No description available"}
                </p>
              </div>

              <div className="bs-header-modal-contact-section">
                <h3>Contact Seller</h3>
                <div className="bs-header-contact-details">
                  <div className="bs-header-contact-item">
                    <i className="fas fa-user"></i>
                    <div>
                      <label>Seller Name</label>
                      <p>{selectedProduct.sellerName || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="bs-header-contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <div>
                      <label>Phone Number</label>
                      <p className="bs-header-contact-phone">
                        {selectedProduct.phoneNumber || "Not provided"}
                      </p>
                      {selectedProduct.phoneNumber && (
                        <a 
                          href={`tel:${selectedProduct.phoneNumber}`} 
                          className="bs-header-call-now-btn"
                        >
                          <i className="fas fa-phone"></i> Call Now
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedProduct.email && (
                    <div className="bs-header-contact-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <label>Email</label>
                        <p>{selectedProduct.email}</p>
                        <a 
                          href={`mailto:${selectedProduct.email}`} 
                          className="bs-header-email-now-btn"
                        >
                          <i className="fas fa-envelope"></i> Send Email
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedProduct.dimensions && (
                    <div className="bs-header-contact-item">
                      <i className="fas fa-ruler-combined"></i>
                      <div>
                        <label>Dimensions</label>
                        <p>{selectedProduct.dimensions}</p>
                      </div>
                    </div>
                  )}

                  {selectedProduct.material && (
                    <div className="bs-header-contact-item">
                      <i className="fas fa-cube"></i>
                      <div>
                        <label>Material</label>
                        <p>{selectedProduct.material}</p>
                      </div>
                    </div>
                  )}

                  {selectedProduct.brand && (
                    <div className="bs-header-contact-item">
                      <i className="fas fa-trademark"></i>
                      <div>
                        <label>Brand</label>
                        <p>{selectedProduct.brand}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bs-header-modal-footer">
              <button className="bs-header-modal-cancel" onClick={closeProductModal}>
                Close
              </button>
              {selectedProduct.phoneNumber && (
                <a 
                  href={`tel:${selectedProduct.phoneNumber}`} 
                  className="bs-header-modal-call"
                >
                  <i className="fas fa-phone-alt"></i> Contact Seller
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BSHeader;