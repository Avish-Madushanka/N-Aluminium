import React, { useState } from 'react';
import './ItemMarkert.css';
import box from "../../assets/box.png";
import l from "../../assets/l.png";
import u from "../../assets/u.png";
import j from "../../assets/j.png";
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

  // Category data
  const categories = [
    { id: 1, name: 'Box Bars', image: box, category: 'box-bars' },
    { id: 2, name: 'U Channels', image: u, category: 'u-channels' },
    { id: 3, name: 'L-Bars', image: l, category: 'l-bars' },
    { id: 4, name: 'Box Bars', image: box, category: 'box-bars' },
    { id: 5, name: 'J-Channel Bars', image: j, category: 'j-channels' },
    { id: 6, name: 'Sivilim Boards', image: sivilim, category: 'sivilim' },
    { id: 7, name: 'Aluminum Cutters', image: cut, category: 'cutters' },
    { id: 8, name: 'Grill Machines', image: grill, category: 'grill' },
    { id: 9, name: 'Rivet Guns', image: Rmac, category: 'rivet-guns' },
    { id: 10, name: 'Rubber Blade', image: knife, category: 'rubber-blade' },
    { id: 11, name: 'Glass Cutters', image: glass, category: 'glass-cutters' },
    { id: 12, name: 'Rivet Boxs', image: rivert, category: 'rivet-box' }
  ];

  // Main categories data
  const mainCategories = [
    { id: 1, name: 'Glass', className: 'ItemMAR-Glass', category: 'glass' },
    { id: 2, name: 'Cradding Boards', className: 'ItemMAR-cradding-boards', category: 'cradding' },
    { id: 3, name: 'Silicon Gum', className: 'ItemMAR-silicon', category: 'silicon' },
    { id: 4, name: 'Rubber', className: 'ItemMAR-rubber', category: 'rubber' },
    { id: 5, name: 'PVC-Marble', className: 'ItemMAR-PVC-Marble', category: 'pvc' }
  ];

  // Product data with category associations
  const allProducts = [
    // Glass Category Products
    { id: 1, name: 'Tempered Glass 5mm', price: 'Rs 2,500.00', unit: '/ sq ft', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'glass', subCategory: 'glass-cutters', description: 'Tempered Glass 5mm - Clear' },
    { id: 2, name: 'Frosted Glass', price: 'Rs 3,200.00', unit: '/ sq ft', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'glass', subCategory: 'glass-cutters', description: 'Frosted Glass for Privacy' },
    { id: 3, name: 'Glass Cutter Tool', price: 'Rs 450.00', unit: '/ piece', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'glass', subCategory: 'glass-cutters', description: 'Professional Glass Cutter' },
    
    // Cradding Boards Products
    { id: 4, name: 'PVC Cradding Board', price: 'Rs 1,800.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'cradding', subCategory: 'sivilim', description: 'White PVC Cradding Board' },
    { id: 5, name: 'Wood Finish Cradding', price: 'Rs 2,100.00', unit: '/ piece', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'cradding', subCategory: 'sivilim', description: 'Wood Finish Design' },
    
    // Silicon Gum Products
    { id: 6, name: 'Silicon Sealant', price: 'Rs 350.00', unit: '/ tube', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'silicon', subCategory: 'rivet-guns', description: 'Clear Silicon Sealant' },
    { id: 7, name: 'Silicon Gun', price: 'Rs 650.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'silicon', subCategory: 'rivet-guns', description: 'Heavy Duty Silicon Gun' },
    
    // Rubber Products
    { id: 8, name: 'Rubber Seal Strip', price: 'Rs 120.00', unit: '/ meter', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'rubber', subCategory: 'rubber-blade', description: 'Rubber Seal for Doors' },
    { id: 9, name: 'Rubber Blade', price: 'Rs 280.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'rubber', subCategory: 'rubber-blade', description: 'Rubber Squeegee Blade' },
    
    // PVC-Marble Products
    { id: 10, name: 'PVC Marble Sheet', price: 'Rs 4,500.00', unit: '/ sheet', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'pvc', subCategory: 'rivet-box', description: 'PVC Marble Finish Sheet' },
    { id: 11, name: 'Marble Edge Trim', price: 'Rs 150.00', unit: '/ piece', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'pvc', subCategory: 'rivet-box', description: 'PVC Marble Edge Trim' },
    
    // Box Bars Products
    { id: 12, name: 'Aluminum Box Bar', price: 'Rs 950.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'box-bars', subCategory: 'box-bars', description: 'Aluminum Box Bar 1 inch' },
    
    // U Channels Products
    { id: 13, name: 'U Channel Trim', price: 'Rs 320.00', unit: '/ piece', image: 'https://i.ibb.co/G9N1G4P/onion.png', category: 'u-channels', subCategory: 'u-channels', description: 'Aluminum U Channel' },
    
    // L-Bars Products
    { id: 14, name: 'L Angle Bar', price: 'Rs 280.00', unit: '/ piece', image: 'https://i.ibb.co/jT88W4k/vegetables.png', category: 'l-bars', subCategory: 'l-bars', description: 'Aluminum L Angle' },
    
    // J-Channels Products
    { id: 15, name: 'J Channel Trim', price: 'Rs 350.00', unit: '/ piece', image: 'https://i.ibb.co/zXn0w7b/individual.png', category: 'j-channels', subCategory: 'j-channels', description: 'Aluminum J Channel' },
    
    // Cutters Products
    { id: 16, name: 'Aluminum Cutter Blade', price: 'Rs 890.00', unit: '/ piece', image: 'https://i.ibb.co/r71X71S/coconut.png', category: 'cutters', subCategory: 'cutters', description: 'Professional Cutter Blade' },
    
    // Grill Products
    { id: 17, name: 'Grill Machine', price: 'Rs 12,500.00', unit: '/ piece', image: 'https://i.ibb.co/tZ5N1N6/milk.png', category: 'grill', subCategory: 'grill', description: 'Electric Grill Machine' },
  ];

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedMainCategory('all');
  };

  // Handle main category click
  const handleMainCategoryClick = (mainCat) => {
    setSelectedMainCategory(mainCat);
    setSelectedCategory('all');
  };

  // Filter products based on selected categories
  const getFilteredProducts = () => {
    if (selectedCategory !== 'all') {
      return allProducts.filter(product => 
        product.subCategory === selectedCategory || product.category === selectedCategory
      );
    } else if (selectedMainCategory !== 'all') {
      return allProducts.filter(product => product.category === selectedMainCategory);
    } else {
      return allProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  // Handle carousel navigation
  const [currentSlide, setCurrentSlide] = useState(0);
  const productsPerView = 4;
  const maxSlide = Math.max(0, Math.ceil(filteredProducts.length / productsPerView) - 1);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  // Reset slide when filter changes
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCategory, selectedMainCategory]);

  return (
    <div className="ItemMAR-container">
      <header className="ItemMAR-header">
        <nav className="ItemMAR-topNav">
          <ul className="ItemMAR-navList">
            <li className="ItemMAR-navItem">Delivery Type</li>
            <li className="ItemMAR-navItem">All Promotions</li>
            <li className="ItemMAR-navItem">Keells Products</li>
            <li className="ItemMAR-navItem">Keells Exclusives</li>
            <li className="ItemMAR-navItem">Utility Bill</li>
            <li className="ItemMAR-navItem">Keells News</li>
            <li className="ItemMAR-navItem">Community</li>
            <li className="ItemMAR-navItem">Help</li>
          </ul>
        </nav>
      </header>

      <main className="ItemMAR-mainContent">
        <section className="ItemMAR-heroSection"></section>

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

        {/* Filter Status Bar */}
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
            <div className="ItemMAR-productCarouselContainer">
              {currentSlide > 0 && (
                <button className="ItemMAR-carouselNav ItemMAR-left" onClick={prevSlide}>‹</button>
              )}
              
              <div className="ItemMAR-productCarousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="ItemMAR-productCard">
                    <img src={product.image} alt={product.name} className="ItemMAR-productImage" />
                    <div className="ItemMAR-productDetails">
                      <span className="ItemMAR-productPrice">{product.price}</span>
                      <span className="ItemMAR-productUnit">{product.unit}</span>
                      <p className="ItemMAR-productDescription">{product.description}</p>
                      <button className="ItemMAR-addButton">+ Add</button>
                    </div>
                  </div>
                ))}
              </div>

              {currentSlide < maxSlide && (
                <button className="ItemMAR-carouselNav ItemMAR-right" onClick={nextSlide}>›</button>
              )}
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