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

  const defaultProducts = [
    { id: 1, name: 'Tempered Glass 5mm', price: '2500.00', unit: '/ sq ft', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'glass', subCategory: 'glass-cutters', description: 'Tempered Glass 5mm - Clear', inStock: true },
    { id: 2, name: 'Frosted Glass', price: '3200.00', unit: '/ sq ft', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'glass', subCategory: 'glass-cutters', description: 'Frosted Glass for Privacy', inStock: true },
    { id: 3, name: 'Glass Cutter Tool', price: '450.00', unit: '/ piece', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'glass', subCategory: 'glass-cutters', description: 'Professional Glass Cutter', inStock: true },
    { id: 4, name: 'PVC Cradding Board', price: '1800.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'cradding', subCategory: 'sivilim', description: 'White PVC Cradding Board', inStock: true },
    { id: 5, name: 'Wood Finish Cradding', price: '2100.00', unit: '/ piece', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'cradding', subCategory: 'sivilim', description: 'Wood Finish Design', inStock: true },
    { id: 6, name: 'Silicon Sealant', price: '350.00', unit: '/ tube', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'silicon', subCategory: 'rivet-guns', description: 'Clear Silicon Sealant', inStock: true },
    { id: 7, name: 'Silicon Gun', price: '650.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'silicon', subCategory: 'rivet-guns', description: 'Heavy Duty Silicon Gun', inStock: true },
    { id: 8, name: 'Rubber Seal Strip', price: '120.00', unit: '/ meter', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'rubber', subCategory: 'rubber-blade', description: 'Rubber Seal for Doors', inStock: true },
    { id: 9, name: 'Rubber Blade', price: '280.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'rubber', subCategory: 'rubber-blade', description: 'Rubber Squeegee Blade', inStock: true },
    { id: 10, name: 'PVC Marble Sheet', price: '4500.00', unit: '/ sheet', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'pvc', subCategory: 'rivet-box', description: 'PVC Marble Finish Sheet', inStock: true },
    { id: 11, name: 'Marble Edge Trim', price: '150.00', unit: '/ piece', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'pvc', subCategory: 'rivet-box', description: 'PVC Marble Edge Trim', inStock: true },
    { id: 12, name: 'Aluminum Box Bar', price: '950.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'box-bars', subCategory: 'box-bars', description: 'Aluminum Box Bar 1 inch', inStock: true },
    { id: 13, name: 'U Channel Trim', price: '320.00', unit: '/ piece', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'u-channels', subCategory: 'u-channels', description: 'Aluminum U Channel', inStock: true },
    { id: 14, name: 'L Angle Bar', price: '280.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'l-bars', subCategory: 'l-bars', description: 'Aluminum L Angle', inStock: true },
    { id: 15, name: 'J Channel Trim', price: '350.00', unit: '/ piece', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'j-channels', subCategory: 'j-channels', description: 'Aluminum J Channel', inStock: true },
    { id: 16, name: 'Aluminum Cutter Blade', price: '890.00', unit: '/ piece', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'cutters', subCategory: 'cutters', description: 'Professional Cutter Blade', inStock: true },
    { id: 17, name: 'Grill Machine', price: '12500.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'grill', subCategory: 'grill', description: 'Electric Grill Machine', inStock: true },
    { id: 18, name: 'T-Channel Trim', price: '340.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 't-channels', subCategory: 't-channels', description: 'Aluminum T Channel', inStock: true },
  ];

  useEffect(() => {
    const savedProducts = localStorage.getItem('marketProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('marketProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedProducts = localStorage.getItem('marketProducts');
      if (updatedProducts) {
        setProducts(JSON.parse(updatedProducts));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  const getFilteredProducts = () => {
    if (selectedCategory !== 'all') {
      return products.filter(product => 
        product.subCategory === selectedCategory || product.category === selectedCategory
      );
    } else if (selectedMainCategory !== 'all') {
      return products.filter(product => product.category === selectedMainCategory);
    } else {
      return products;
    }
  };

  const filteredProducts = getFilteredProducts();

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
                <div key={product.id} className="ItemMAR-productCard">
                  <img 
                    src={product.image || 'https://via.placeholder.com/200'} 
                    alt={product.name} 
                    className="ItemMAR-productImage" 
                  />
                  <div className="ItemMAR-productDetails">
                    <h4 className="ItemMAR-productName">{product.name}</h4>
                    <div className="ItemMAR-productPriceRow">
                      <span className="ItemMAR-productPrice">Rs. {product.price}</span>
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
                                className={`ItemMAR-colorCircle ${selectedColors[product.id] === color.id ? 'selected' : ''}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => handleColorSelect(product.id, color.id)}
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