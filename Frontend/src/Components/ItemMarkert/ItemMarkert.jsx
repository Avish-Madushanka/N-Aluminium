import React, { useState, useEffect } from 'react';
import './ItemMarkert.css';
import box from "../../assets/box.png";
import l from "../../assets/l.png";
import u from "../../assets/u.png";
import j from "../../assets/j.png";
import t from "../../assets/t.png";
import rivert from "../../assets/rivert.png";
import cut from "../../assets/cut.png";
import grill from "../../assets/grill.png";
import knife from "../../assets/knife.png";
import Rmac from "../../assets/Rmac.png";
import sivilim from "../../assets/sivilim.png";
import glass from "../../assets/glass.png";
import ItemWall1 from "../../assets/ItemWall1.jpg";

const ItemMarkert = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const categories = [
    { id: 1, name: 'Box Bars', image: box, category: 'box-bars' },
    { id: 2, name: 'U Channels', image: u, category: 'u-channels' },
    { id: 3, name: 'L-Bars', image: l, category: 'l-bars' },
    { id: 4, name: 'T-channel', image: t, category: 't-channels' },
    { id: 5, name: 'J-Channel Bars', image: j, category: 'j-channels' },
    { id: 6, name: 'Sivilim Boards', image: sivilim, category: 'sivilim' },
    { id: 7, name: 'Aluminum Cutters', image: cut, category: 'cutters' },
    { id: 8, name: 'Grill Machines', image: grill, category: 'grill' },
    { id: 9, name: 'Rivet Guns', image: Rmac, category: 'rivet-guns' },
    { id: 10, name: 'Rubber Blade', image: knife, category: 'rubber-blade' },
    { id: 11, name: 'Glass Cutters', image: glass, category: 'glass-cutters' },
    { id: 12, name: 'Rivet Boxs', image: rivert, category: 'rivet-box' }
  ];

  const mainCategories = [
    { id: 1, name: 'Glass', className: 'ItemMAR-Glass', category: 'glass' },
    { id: 2, name: 'Cradding Boards', className: 'ItemMAR-cradding-boards', category: 'cradding' },
    { id: 3, name: 'Silicon Gum', className: 'ItemMAR-silicon', category: 'silicon' },
    { id: 4, name: 'Rubber', className: 'ItemMAR-rubber', category: 'rubber' },
    { id: 5, name: 'PVC-Marble', className: 'ItemMAR-PVC-Marble', category: 'pvc' }
  ];

  const colorOptions = [
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'grey', name: 'Grey', color: '#646464' },
    { id: 'wood', name: 'Wood', color: '#332008' },
    { id: 'maroon', name: 'Maroon', color: '#500f0f' },
    { id: 'blue', name: 'Blue', color: '#141263' },
    { id: 'red', name: 'Red', color: '#c20000' },
    { id: 'green', name: 'Green', color: '#052401' },
    { id: 'cream', name: 'Cream', color: '#fceaba' },
  ];

  const sizeOptions = [
    { id: '10mm', name: '10mm' },
    { id: '15mm', name: '15mm' },
    { id: '45mm', name: '45mm' },
    { id: '50mm', name: '50mm' },
    { id: '60mm', name: '60mm' },
    { id: '80mm', name: '80mm' },
    { id: '100mm', name: '100mm' },
  ];

  useEffect(() => {
    fetchProducts();
    
    const handleStorageChange = () => {
      fetchProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('products-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products-updated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedMainCategory]);

  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => {
        setCartMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all' && selectedCategory !== 'undefined' && selectedCategory !== 'null') {
        params.append('category', selectedCategory);
      } else if (selectedMainCategory !== 'all' && selectedMainCategory !== 'undefined' && selectedMainCategory !== 'null') {
        params.append('category', selectedMainCategory);
      }
      
      const response = await fetch(`http://localhost:5003/api/items?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        const processedData = result.data.map(product => ({
          ...product,
          sizes: product.sizes || [],
          colors: product.colors || []
        }));
        setProducts(processedData);
      } else {
        setError(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedMainCategory('all');
  };

  const handleMainCategoryClick = (mainCat) => {
    setSelectedMainCategory(mainCat);
    setSelectedCategory('all');
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    setQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    
    try {
      const response = await fetch('http://localhost:5003/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: quantity,
          selectedColor: selectedColor,
          selectedSize: selectedSize
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartMessage('✅ Product added to cart successfully!');
        closeModal();
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/200';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5003${imagePath}`;
    return imagePath;
  };

  const getFilteredProducts = () => {
    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (loading && products.length === 0) {
    return (
      <div className="ItemMAR-container">
        <div className="ItemMAR-loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="ItemMAR-container">
      {cartMessage && (
        <div className="ItemMAR-cart-message">
          <div className="ItemMAR-cart-message-content">
            <span className="ItemMAR-cart-message-icon">✓</span>
            <span>{cartMessage}</span>
          </div>
        </div>
      )}

      <main className="ItemMAR-mainContent">
        <section className="ItemMAR-heroSection">
          <div className="ItemMAR-heroImage">
            <img src={ItemWall1} alt="Hero Banner" className="ItemMAR-heroBanner" />
            <div className="ItemMAR-heroContent">
              <h1>Premium Aluminum Products</h1>
              <p>High Quality Materials for Professional Use</p>
            </div>
          </div>
        </section>

        <section className="ItemMAR-categorySection">
          <div className="ItemMAR-categoriesGrid">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className={`ItemMAR-categoryCard ${selectedCategory === category.category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.category)}
              >
                <img src={category.image} className="ItemMAR-categoryImage" alt={category.name} />
                <span className="ItemMAR-categoryName">{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ItemMAR-mainCategories">
          {mainCategories.map((category) => (
            <div 
              key={category.id} 
              className={`ItemMAR-mainCategoryCard ${category.className} ${selectedMainCategory === category.category ? 'active-main' : ''}`}
              onClick={() => handleMainCategoryClick(category.category)}
            >
              <span className="ItemMAR-mainCategoryName">{category.name}</span>
            </div>
          ))}
        </section>

        <div className="ItemMAR-filterStatus">
          {selectedCategory !== 'all' && (
            <div className="ItemMAR-activeFilter">
              Filtering by: {categories.find(c => c.category === selectedCategory)?.name}
              <button className="ItemMAR-clearFilter" onClick={() => setSelectedCategory('all')}>Clear</button>
            </div>
          )}
          {selectedMainCategory !== 'all' && selectedCategory === 'all' && (
            <div className="ItemMAR-activeFilter">
              Filtering by: {mainCategories.find(c => c.category === selectedMainCategory)?.name}
              <button className="ItemMAR-clearFilter" onClick={() => setSelectedMainCategory('all')}>Clear</button>
            </div>
          )}
          <div className="ItemMAR-productCount">{filteredProducts.length} products found</div>
        </div>

        {error && (
          <div className="ItemMAR-error-message">
            <div className="ItemMAR-error-content">
              <span className="ItemMAR-error-icon">!</span>
              <span>{error}</span>
            </div>
            <button className="ItemMAR-clearFilter" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        <section className="ItemMAR-productsSection">
          <div className="ItemMAR-productsHeader">
            <h3 className="ItemMAR-productsTitle">
              {selectedCategory !== 'all' 
                ? categories.find(c => c.category === selectedCategory)?.name 
                : selectedMainCategory !== 'all'
                ? mainCategories.find(c => c.category === selectedMainCategory)?.name
                : 'All Products'}
            </h3>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="ItemMAR-productsGrid">
              {filteredProducts.map((product) => (
                <div key={product._id || product.id} className="ItemMAR-productCard">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="ItemMAR-productImage" 
                  />
                  <div className="ItemMAR-productDetails">
                    <h4 className="ItemMAR-productName">{product.name}</h4>
                    <div className="ItemMAR-productPriceRow">
                      <span className="ItemMAR-productPrice">Rs. {product.discountedPrice || product.price}</span>
                      <span className="ItemMAR-productUnit">{product.unit}</span>
                    </div>
                    
                    {product.discount > 0 && (
                      <div className="ItemMAR-discountBadge">
                        {product.discount}% OFF
                      </div>
                    )}

                    {product.inStock && (
                      <div className="ItemMAR-stockStatus">In stock ({product.stock} available)</div>
                    )}

                    <button 
                      className="ItemMAR-buyButton" 
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ItemMAR-noProducts">
              <p>No products found in this category</p>
            </div>
          )}
        </section>
      </main>

      {showModal && selectedProduct && (
        <div className="ItemMAR-modal-overlay" onClick={closeModal}>
          <div className="ItemMAR-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="ItemMAR-modal-close" onClick={closeModal}>×</button>
            
            <div className="ItemMAR-modal-grid">
              <div className="ItemMAR-modal-image">
                <img 
                  src={getImageUrl(selectedProduct.image)} 
                  alt={selectedProduct.name} 
                />
              </div>
              
              <div className="ItemMAR-modal-details">
                <h2>{selectedProduct.name}</h2>
                <div className="ItemMAR-modal-price">
                  Rs. {selectedProduct.discountedPrice || selectedProduct.price} 
                  <span className="ItemMAR-modal-unit">{selectedProduct.unit}</span>
                </div>
                
                {selectedProduct.description && (
                  <p className="ItemMAR-modal-description">{selectedProduct.description}</p>
                )}

                {selectedProduct.colors && selectedProduct.colors.length > 0 ? (
                  <div className="ItemMAR-modal-option">
                    <label>Color:</label>
                    <div className="ItemMAR-modal-colors">
                      {colorOptions
                        .filter(color => selectedProduct.colors.includes(color.id))
                        .map((color) => (
                          <button
                            key={color.id}
                            className={`ItemMAR-modal-color-btn ${selectedColor === color.id ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(color.id)}
                          >
                            <span 
                              className="ItemMAR-modal-color-dot" 
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="ItemMAR-modal-option">
                    <label>Color:</label>
                    <div className="ItemMAR-modal-colors">
                      <span className="ItemMAR-modal-no-options">No colors available</span>
                    </div>
                  </div>
                )}

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                  <div className="ItemMAR-modal-option">
                    <label>Size:</label>
                    <div className="ItemMAR-modal-sizes">
                      {sizeOptions
                        .filter(size => selectedProduct.sizes.includes(size.id))
                        .map((size) => (
                          <button
                            key={size.id}
                            className={`ItemMAR-modal-size-btn ${selectedSize === size.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size.id)}
                          >
                            {size.name}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="ItemMAR-modal-option">
                    <label>Size:</label>
                    <div className="ItemMAR-modal-sizes">
                      <span className="ItemMAR-modal-no-options">No sizes available</span>
                    </div>
                  </div>
                )}

                <div className="ItemMAR-modal-option">
                  <label>Quantity:</label>
                  <div className="ItemMAR-modal-quantity">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="ItemMAR-modal-qty-btn"
                    >
                      -
                    </button>
                    <span className="ItemMAR-modal-qty-value">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="ItemMAR-modal-qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                {selectedProduct.inStock && (
                  <div className="ItemMAR-modal-stock">
                    {selectedProduct.stock} items available
                  </div>
                )}

                <div className="ItemMAR-modal-actions">
                  <button 
                    className="ItemMAR-modal-add-to-cart"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemMarkert;