import React, { useState, useMemo } from 'react';
import './Items3Dview.css';

const Items3Dview = () => {
  const [activeType, setActiveType] = useState('Windows');
  const [activeColor, setActiveColor] = useState('All');
  const [activeUpdate, setActiveUpdate] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  const types = [
    { id: 'windows', name: 'Windows', icon: '🪟', count: 234 },
    { id: 'doors', name: 'Doors', icon: '🚪', count: 156 },
    { id: 'pantry', name: 'Pantry Cupboards', icon: '🥣', count: 89 },
    { id: 'glass', name: 'Bathroom Glasses', icon: '🚿', count: 67 },
    { id: 'panlights', name: 'Panlights', icon: '💡', count: 123 },
    { id: 'cupboards', name: 'Cupboards', icon: '🗄️', count: 145 }
  ];

  const colors = ['All', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Earth Color', 'Pink', 'Wood Color', 'Black', 'Gray', 'White', 'Brown', 'Beige', 'Golden'];
  const updates = ['All', 'Last 7 Days', 'Last Month'];

  // Mock product details for detail view
  const productDetails = {
    windows: {
      name: "Modern Aluminum Window 3D Model",
      description: "The Modern Aluminum Window 3D model showcases a dark gray aluminum frame with transparent glass. With 500 optimized polygons, it ensures efficient rendering for interior design, gaming, VR, and urban scenes.",
      features: [
        "Dark gray aluminum and transparent glass",
        "500 optimized polygons for smooth rendering",
        "Designed for interior, gaming, and VR use",
        "Urban minimalist style with detailed textures"
      ],
      dimensions: "3845.64 x 1169.71 x 2000 mm",
      style: "Modern",
      material: "Aluminum frame with double-sided glass"
    },
    doors: {
      name: "Modern Interior Door 3D Model",
      description: "Elegant modern interior door with premium wood finish and minimalist design. Perfect for architectural visualization and interior design projects.",
      features: [
        "Premium wood texture with matte finish",
        "Modern minimalist handle design",
        "Sound-proof core construction",
        "Easy to customize colors and materials"
      ],
      dimensions: "2133.6 x 914.4 x 44.45 mm",
      style: "Modern Minimalist",
      material: "Engineered wood with veneer finish"
    }
  };

  // Generate all products for all types
  const allProducts = useMemo(() => {
    const allProductsArray = [];
    types.forEach(type => {
      for (let i = 0; i < 12; i++) {
        allProductsArray.push({
          id: `${type.id}-${i}`,
          title: `Urban ${type.name.slice(0, -1)} Model ${i + 1}`,
          subtitle: `Modern ${type.name.slice(0, -1)} Design For Modern Living`,
          type: type.name,
          typeId: type.id,
          color: colors[Math.floor(Math.random() * (colors.length - 1)) + 1],
          date: Math.random() > 0.5 ? 'Last 7 Days' : 'Last Month',
          downloads: Math.floor(Math.random() * 2000) + 100,
          likes: Math.floor(Math.random() * 5000) + 500,
          is3D: true,
          img: `https://picsum.photos/seed/${type.name}${i}/400/400`,
          polygons: Math.floor(Math.random() * 1000) + 200,
          dimensions: `${Math.floor(Math.random() * 4000) + 1000} x ${Math.floor(Math.random() * 2000) + 500} x ${Math.floor(Math.random() * 2000) + 500} mm`
        });
      }
    });
    return allProductsArray;
  }, []);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    if (activeType !== 'Windows') {
      filtered = filtered.filter(product => product.type === activeType);
    }
    
    if (activeColor !== 'All') {
      filtered = filtered.filter(product => product.color === activeColor);
    }
    
    if (activeUpdate !== 'All') {
      filtered = filtered.filter(product => product.date === activeUpdate);
    }
    
    return filtered;
  }, [allProducts, activeType, activeColor, activeUpdate]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedProduct(null);
  };

  // Detail View Component
  const ProductDetailView = () => {
    const details = productDetails[selectedProduct?.typeId] || productDetails.windows;
    
    return (
      <div className="Items3Dview-detail-view">
        <button className="Items3Dview-back-btn" onClick={handleBackToGrid}>
          ← Back to Models
        </button>
        
        <div className="Items3Dview-detail-content">
          <div className="Items3Dview-detail-left">
            <div className="Items3Dview-detail-image">
              <img src={selectedProduct?.img} alt={selectedProduct?.title} />
              <div className="Items3Dview-detail-badge">3D Model</div>
            </div>
            <div className="Items3Dview-detail-thumbnails">
              <div className="Items3Dview-thumb active">
                <img src={selectedProduct?.img} alt="thumbnail" />
              </div>
              <div className="Items3Dview-thumb">
                <img src={selectedProduct?.img} alt="thumbnail" />
              </div>
              <div className="Items3Dview-thumb">
                <img src={selectedProduct?.img} alt="thumbnail" />
              </div>
            </div>
            <div className="Items3Dview-viewer-options">
              <button className="Items3Dview-viewer-btn active">3D Viewer</button>
              <button className="Items3Dview-viewer-btn">Photo</button>
            </div>
          </div>
          
          <div className="Items3Dview-detail-right">
            <div className="Items3Dview-detail-breadcrumb">
              3D Models / Construction / Windows / Standard Windows / {selectedProduct?.title}
            </div>
            
            <h1 className="Items3Dview-detail-title">{details.name}</h1>
            <p className="Items3Dview-detail-description">{details.description}</p>
            
            
            <div className="Items3Dview-detail-features">
              {details.features.map((feature, idx) => (
                <div key={idx} className="Items3Dview-feature">✓ {feature}</div>
              ))}
            </div>
            
            <div className="Items3Dview-detail-specs">
              <div className="Items3Dview-spec-row">
                <span className="spec-label">Model Size:</span>
                <span className="spec-value">{details.dimensions}</span>
              </div>
              <div className="Items3Dview-spec-row">
                <span className="spec-label">Style:</span>
                <span className="spec-value">{details.style}</span>
              </div>
              <div className="Items3Dview-spec-row">
                <span className="spec-label">Material:</span>
                <span className="spec-value">{details.material}</span>
              </div>
              <div className="Items3Dview-spec-row">
                <span className="spec-label">Polygons:</span>
                <span className="spec-value">{selectedProduct?.polygons} optimized polygons</span>
              </div>
            </div>
            
            <div className="Items3Dview-detail-actions">
              <button className="Items3Dview-btn-collect">Collect</button>
              <button className="Items3Dview-btn-share">Share</button>
            </div>
            
            <div className="Items3Dview-detail-footer">
              <div className="Items3Dview-library-info">
                <strong>Coolhome model library</strong>
                <span>Over 600000 Models | Since 2018</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'detail' && selectedProduct) {
    return <ProductDetailView />;
  }

  return (
    <div className="Items3Dview-master">
      <div className="Items3Dview-type-bar">
        {types.map(t => (
          <div 
            key={t.id} 
            className={`Items3Dview-type-item ${activeType === t.name ? 'active' : ''}`}
            onClick={() => setActiveType(t.name)}
          >
            <span className="Items3Dview-type-icon">{t.icon}</span>
            <span className="Items3Dview-type-label">{t.name}</span>
            <span className="Items3Dview-type-count">{t.count}</span>
          </div>
        ))}
      </div>

      <main className="Items3Dview-main-content">
        <aside className="Items3Dview-filters">
          <div className="Items3Dview-filter-header">
            <h3>Filters</h3>
            {(activeColor !== 'All' || activeUpdate !== 'All') && (
              <button onClick={() => {
                setActiveColor('All');
                setActiveUpdate('All');
              }}>Clear all</button>
            )}
          </div>
          
          <div className="Items3Dview-filter-row">
            <label>Color:</label>
            <div className="Items3Dview-pill-group">
              {colors.slice(0, 8).map(c => (
                <span 
                  key={c} 
                  className={activeColor === c ? 'active' : ''} 
                  onClick={() => setActiveColor(c)}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="Items3Dview-pill-group">
              {colors.slice(8).map(c => (
                <span 
                  key={c} 
                  className={activeColor === c ? 'active' : ''} 
                  onClick={() => setActiveColor(c)}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          
          <div className="Items3Dview-filter-row">
            <label>Updated:</label>
            <div className="Items3Dview-pill-group">
              {updates.map(u => (
                <span 
                  key={u} 
                  className={activeUpdate === u ? 'active' : ''} 
                  onClick={() => setActiveUpdate(u)}
                >
                  {u}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <section className="Items3Dview-content-area">
          <div className="Items3Dview-results-header">
            <div className="Items3Dview-results-count">
              {filteredProducts.length} models found
            </div>
            <div className="Items3Dview-sort">
              <label>Sort by:</label>
              <select>
                <option>Most Relevant</option>
                <option>Newest</option>
                <option>Most Downloaded</option>
                <option>Most Liked</option>
              </select>
            </div>
          </div>
          
          <div className="Items3Dview-grid">
            {filteredProducts.map(item => (
              <div key={item.id} className="Items3Dview-card" onClick={() => handleProductClick(item)}>
                <div className="Items3Dview-card-image-box">
                  <img src={item.img} alt={item.title} />
                  <div className="Items3Dview-360-icon">
                  </div>
                </div>
                <h3 className="Items3Dview-card-title">{item.title}</h3>
                <p className="Items3Dview-card-subtitle">{item.subtitle}</p>
                <div className="Items3Dview-card-meta">
                  <span className="Items3Dview-card-type">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="Items3Dview-no-results">
              <p>No models found matching your filters.</p>
              <button onClick={() => {
                setActiveColor('All');
                setActiveUpdate('All');
              }}>Clear all filters</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Items3Dview;