import React, { useState, useMemo, useEffect } from 'react';
import './Items3Dview.css';

const Items3Dview = () => {
  const [activeCategory, setActiveCategory] = useState('Windows');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('Photo');
  const [activeTags, setActiveTags] = useState([]);
  const [priceFilter, setPriceFilter] = useState('All');
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [customColor, setCustomColor] = useState('#444444');
  const [customScale, setCustomScale] = useState(1);

  const categories = ['Windows', 'Doors', 'Pantry', 'Glass'];
  const tags = ['Exclusive', 'Animated', 'Rigged', 'Bundle', 'Real-Time', 'Free'];

  const allProducts = useMemo(() => [
    { id: 1, title: 'Arched Aluminium Window', price: 12, format: 'OBJ', type: 'Windows', tag: 'Exclusive', img: 'https://picsum.photos/seed/w1/600/600' },
    { id: 2, title: 'Modern Sliding Door', price: 45, format: 'FBX', type: 'Doors', tag: 'Animated', img: 'https://picsum.photos/seed/d1/600/600' },
    { id: 3, title: 'Industrial Black Window', price: 0, format: 'MAX', type: 'Windows', tag: 'Free', img: 'https://picsum.photos/seed/w2/600/600' },
    { id: 4, title: 'Kitchen Pantry Unit', price: 25, format: 'BLEND', type: 'Pantry', tag: 'Bundle', img: 'https://picsum.photos/seed/p1/600/600' },
    { id: 5, title: 'Office Glass Partition', price: 15, format: 'OBJ', type: 'Glass', tag: 'Real-Time', img: 'https://picsum.photos/seed/g1/600/600' },
    { id: 6, title: 'Double Hung Window', price: 8, format: 'FBX', type: 'Windows', tag: 'Rigged', img: 'https://picsum.photos/seed/w3/600/600' },
    { id: 7, title: 'Luxury Entry Door', price: 60, format: 'MAX', type: 'Doors', tag: 'Exclusive', img: 'https://picsum.photos/seed/d2/600/600' },
    { id: 8, title: 'Corner Pantry Cabinet', price: 30, format: 'BLEND', type: 'Pantry', tag: 'Real-Time', img: 'https://picsum.photos/seed/p2/600/600' },
  ], []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const catMatch = p.type === activeCategory;
      const tagMatch = activeTags.length === 0 || activeTags.includes(p.tag);
      const priceMatch = priceFilter === 'All' || 
                         (priceFilter === 'Free' && p.price === 0) || 
                         (priceFilter === 'Paid' && p.price > 0);
      return catMatch && tagMatch && priceMatch;
    });
  }, [activeCategory, activeTags, priceFilter, allProducts]);

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleMouseDown = (e) => {
    if (viewMode !== '3D') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation(prev => ({ x: prev.x + dx * 0.5, y: prev.y - dy * 0.5 }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  if (selectedProduct) {
    return (
      <div className="Items3Dview-detail-page">
        <div className="Items3Dview-breadcrumb">
          <span className="back-btn" onClick={() => {setSelectedProduct(null); setRotation({x:0,y:0}); setViewMode('Photo');}}>← Back to Home</span>
          3D Models / {selectedProduct.type} / <strong>{selectedProduct.title}</strong>
        </div>

        <div className="Items3Dview-detail-container">
          <div className="Items3Dview-viewer-column">
            <div className="viewer-toggle-bar">
              <span className={viewMode === '3D' ? 'active' : ''} onClick={() => setViewMode('3D')}>3D Viewer</span>
              <span className={viewMode === 'Photo' ? 'active' : ''} onClick={() => setViewMode('Photo')}>Photo</span>
            </div>
            
            <div 
              className={`viewer-main-stage ${viewMode === '3D' ? 'canvas-mode' : ''}`}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}
            >
              <img 
                src={selectedProduct.img} 
                style={{ 
                  transform: viewMode === '3D' ? `rotateY(${rotation.x}deg) rotateX(${rotation.y}deg) scale(${customScale})` : 'none',
                  filter: viewMode === '3D' ? `drop-shadow(0 20px 30px rgba(0,0,0,0.15))` : 'none',
                  border: viewMode === '3D' ? `4px solid ${customColor}` : 'none'
                }} 
              />
              {viewMode === '3D' && <div className="drag-hint">Click and Drag to Rotate</div>}
            </div>

            {viewMode === '3D' && (
              <div className="viewer-customizer">
                <div className="cust-item">
                  <label>Frame Color</label>
                  <div className="color-dots">
                    {['#444', '#888', '#fff', '#c5a059'].map(c => (
                      <div key={c} className={`dot ${customColor === c ? 'active' : ''}`} style={{background: c}} onClick={() => setCustomColor(c)} />
                    ))}
                  </div>
                </div>
                <div className="cust-item">
                  <label>Scale Factor</label>
                  <input type="range" min="0.5" max="1.5" step="0.1" value={customScale} onChange={(e) => setCustomScale(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="Items3Dview-info-column">
            <h1 className="prod-title">{selectedProduct.title}</h1>
            <div className="prod-price-box">${selectedProduct.price === 0 ? 'Free' : selectedProduct.price}</div>
            
            <div className="prod-badges">
              <div className="badge-item">✔ High-poly geometry</div>
              <div className="badge-item">✔ PBR Textures included</div>
              <div className="badge-item">✔ Optimized for VR/AR</div>
            </div>

            <div className="prod-specs">
              <div className="spec-line"><span>Format:</span> {selectedProduct.format}</div>
              <div className="spec-line"><span>Category:</span> {selectedProduct.type}</div>
              <div className="spec-line"><span>License:</span> Standard</div>
            </div>

            <div className="prod-actions">
              <button className="btn-buy">★ Collect Model</button>
              <button className="btn-share">Share</button>
            </div>

            <div className="prod-author">
              <div className="author-img">C</div>
              <div className="author-info">
                <strong>Coohom Design Library</strong>
                <p>Verified 3D Artist • 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Items3Dview-root">
      <nav className="Items3Dview-top-nav">
        {categories.map(c => (
          <span key={c} className={activeCategory === c ? 'active' : ''} onClick={() => {setActiveCategory(c); setActiveTags([]);}}>{c}</span>
        ))}
      </nav>

      <div className="Items3Dview-filter-strip">
        <div className="dropdown-group">
          <select className="filter-select" onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="All">Price: All</option>
            <option value="Free">Free Only</option>
            <option value="Paid">Paid Only</option>
          </select>
          <div className="filter-select">Format ▾</div>
          <div className="filter-select">Poly Count ▾</div>
        </div>
        
        <div className="divider"></div>

        <div className="tag-group">
          {tags.map(t => (
            <button key={t} className={`tag-btn ${activeTags.includes(t) ? 'active' : ''}`} onClick={() => toggleTag(t)}>{t}</button>
          ))}
        </div>

        <div className="sort-box">Best Match ▾</div>
      </div>

      <div className="Items3Dview-utility-bar">
        <span onClick={() => {setActiveTags([]); setPriceFilter('All');}}>Clear all filters</span>
      </div>

      <main className="Items3Dview-main-grid">
        {filteredProducts.map(item => (
          <div key={item.id} className="asset-card" onClick={() => setSelectedProduct(item)}>
            <div className="asset-preview">
              <img src={item.img} alt={item.title} />
              <div className="price-label">${item.price === 0 ? 'Free' : item.price}</div>
            </div>
            <div className="asset-details">
              <h4>{item.title}</h4>
              <p>{item.format} • {item.tag}</p>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && <div className="no-results">No models match these filters.</div>}
      </main>
    </div>
  );
};

export default Items3Dview;