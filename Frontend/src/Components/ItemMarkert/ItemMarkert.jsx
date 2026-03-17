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

const ItemMarkert = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const heroSlides = [
    {
      image: 'https://www.alineautomation.com/wp-content/uploads/2024/08/ALineAutomation-301227-Aluminum-Square-Bars-Blogbanner1-1024x536.jpg',
      title: 'Premium Aluminum Bars',
      subtitle: 'High Quality for Professional Use'
    },
    {
      image: 'https://www.flemingconstructiongroup.com/wp-content/uploads/2022/09/AdobeStock_216792368-scaled.jpeg',
      title: 'Glass Solutions',
      subtitle: 'Tempered & Frosted Glass'
    },
    {
      image: 'https://www.alucom.ae/images/aluminium-composite-panels-1.jpg',
      title: 'Cradding Boards',
      subtitle: 'Modern Finishing Solutions'
    }
  ];

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
    { id: 'white', color: '#ffffff' },
    { id: 'black', color: '#000000' },
    { id: 'grey', color: '#646464' },
    { id: 'wood', color: '#332008' },
    { id: 'maroon', color: '#500f0f' },
    { id: 'blue', color: '#141263' },
  ];

  const colorEnabledCategories = [
    'box-bars',
    'u-channels',
    'l-bars',
    't-channels',
    'j-channels',
    'cradding'
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
        setProducts(result.data);
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

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleColorSelect = (productId, colorId) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorId
    }));
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
      <main className="ItemMAR-mainContent">
        <section className="ItemMAR-heroSection">
          <div className="ItemMAR-heroCarousel">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`ItemMAR-heroSlide ${index === currentHeroSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="ItemMAR-heroContent">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            ))}
            <button className="ItemMAR-heroNav ItemMAR-heroPrev" onClick={prevHeroSlide}>❮</button>
            <button className="ItemMAR-heroNav ItemMAR-heroNext" onClick={nextHeroSlide}>❯</button>
            <div className="ItemMAR-heroDots">
              {heroSlides.map((_, index) => (
                <span
                  key={index}
                  className={`ItemMAR-heroDot ${index === currentHeroSlide ? 'active' : ''}`}
                  onClick={() => setCurrentHeroSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="ItemMAR-categorySection">
          <h2 className="ItemMAR-categoryTitle">Category</h2>
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

                    {colorEnabledCategories.includes(product.category) && product.colors && product.colors.length > 0 && (
                      <div className="ItemMAR-colorOptions">
                        <span className="ItemMAR-colorLabel">Available Colors</span>
                        <div className="ItemMAR-colorPicker">
                          {colorOptions
                            .filter(color => product.colors.includes(color.id))
                            .map((color) => (
                              <span
                                key={color.id}
                                className={`ItemMAR-colorCircle ${selectedColors[product._id] === color.id ? 'selected' : ''}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => handleColorSelect(product._id, color.id)}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {product.description && (
                      <p className="ItemMAR-productDescription">{product.description.substring(0, 50)}...</p>
                    )}

                    <span className="ItemMAR-sizeGuide">Size Guide</span>

                    <button className="ItemMAR-buyButton">Buy now</button>
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
    </div>
  );
};

export default ItemMarkert;