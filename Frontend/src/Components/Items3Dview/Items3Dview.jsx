import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Items3Dview.css';

function Model3D({ modelUrl, color, glassType, scale = 1 }) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  
  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.name.toLowerCase().includes('frame') || child.name.toLowerCase().includes('aluminum') || child.name.toLowerCase().includes('wood') || child.name.toLowerCase().includes('door')) {
            child.material.color = new THREE.Color(color);
            child.material.metalness = 0.7;
            child.material.roughness = 0.4;
          }
          if (child.name.toLowerCase().includes('glass')) {
            if (glassType === 'tinted') {
              child.material.color = new THREE.Color('#87CEEB');
              child.material.transparent = true;
              child.material.opacity = 0.7;
            } else if (glassType === 'frosted') {
              child.material.color = new THREE.Color('#ffffff');
              child.material.transparent = true;
              child.material.opacity = 0.5;
              child.material.roughness = 0.9;
            } else {
              child.material.color = new THREE.Color('#a8d8ea');
              child.material.transparent = true;
              child.material.opacity = 0.4;
            }
          }
        }
      });
    }
  }, [gltf, color, glassType]);

  return gltf ? <primitive object={gltf.scene} scale={[scale, scale, scale]} /> : null;
}

function LoadingSpinner() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loading-spinner">
        <div className="loading-icon">🚪</div>
        <div className="loading-text">Loading 3D Model... {Math.round(progress)}%</div>
        <div className="loading-bar"><div className="loading-bar-fill" style={{ width: `${progress}%` }}></div></div>
      </div>
    </Html>
  );
}

function ThreeDViewer({ modelUrl, color, glassType, scale }) {
  return (
    <div className="viewer-container">
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, 2]} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.3} />
        <Environment preset="city" />
        <React.Suspense fallback={<LoadingSpinner />}>
          <Model3D modelUrl={modelUrl} color={color} glassType={glassType} scale={scale} />
        </React.Suspense>
        <OrbitControls enableZoom={true} enablePan={true} zoomSpeed={1.2} rotateSpeed={1} />
      </Canvas>
      <div className="viewer-hint">🖱️ Drag to rotate | Scroll to zoom</div>
    </div>
  );
}

function ThreeSixtyViewer({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 10) {
      const direction = delta > 0 ? -1 : 1;
      setCurrentIndex((prev) => (prev + direction + images.length) % images.length);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="threesixty-viewer"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img src={images[currentIndex]} className="threesixty-image" alt="360 view" />
      <div className="threesixty-hint">🖱️ Drag horizontally to rotate 360°</div>
      <div className="threesixty-counter">{currentIndex + 1} / {images.length}</div>
    </div>
  );
}

const windowModels = [
  {
    id: 1,
    name: 'Aluminum Sliding Window',
    price: 299,
    category: 'Windows',
    type: 'Sliding',
    format: 'GLB',
    color: 'Black',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/144361/pexels-photo-144361.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/100/800/600?w=${i}`),
    description: 'Sleek aluminum sliding window with thermal break technology. Perfect for modern homes.',
    features: ['Thermal insulation', 'Double glazing', 'Corrosion resistant', 'Smooth sliding mechanism'],
    dimensions: { width: 120, height: 150, depth: 5 },
    material: 'Aluminum 6063-T5',
    glassOptions: ['transparent', 'tinted', 'frosted']
  },
  {
    id: 2,
    name: 'Wooden Casement Window',
    price: 199,
    category: 'Windows',
    type: 'Casement',
    format: 'GLB',
    color: 'Wood',
    style: 'Classic',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/97/800/600?c=${i}`),
    description: 'Traditional wooden casement window with crank operation.',
    features: ['Crank mechanism', 'Screens included', 'Security lock', 'Weather sealed'],
    dimensions: { width: 90, height: 120, depth: 4 },
    material: 'Solid Oak Wood',
    glassOptions: ['transparent', 'tinted', 'frosted']
  },
  {
    id: 3,
    name: 'Fixed Picture Window',
    price: 149,
    category: 'Windows',
    type: 'Fixed',
    format: 'GLB',
    color: 'White',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/15/800/600?f=${i}`),
    description: 'Large fixed window for unobstructed views and maximum natural light.',
    features: ['Panoramic view', 'Energy efficient', 'Low maintenance', 'Solar control glass'],
    dimensions: { width: 200, height: 120, depth: 3 },
    material: 'Powder coated Aluminum',
    glassOptions: ['transparent', 'tinted']
  },
  {
    id: 4,
    name: 'Black Aluminum Window',
    price: 349,
    category: 'Windows',
    type: 'Sliding',
    format: 'GLB',
    color: 'Black',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/275070/pexels-photo-275070.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/104/800/600?b=${i}`),
    description: 'Premium black aluminum window with minimalist design.',
    features: ['Thermal break', 'Tempered glass', 'Insect screens', 'Multi-point locking'],
    dimensions: { width: 150, height: 180, depth: 5 },
    material: 'Anodized Aluminum',
    glassOptions: ['transparent', 'tinted', 'frosted']
  },
  {
    id: 5,
    name: 'Bay Window Frame',
    price: 599,
    category: 'Windows',
    type: 'Bay',
    format: 'OBJ',
    color: 'White',
    style: 'Classic',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg',
    images360: Array.from({ length: 48 }, (_, i) => `https://picsum.photos/id/21/800/600?bay=${i}`),
    description: 'Elegant bay window that extends outward, creating additional space.',
    features: ['Expands outward', 'Seating area option', 'Enhanced ventilation', 'Decorative design'],
    dimensions: { width: 240, height: 150, depth: 60 },
    material: 'Fiberglass reinforced',
    glassOptions: ['transparent', 'tinted']
  }
];

const doorModels = [
  {
    id: 6,
    name: 'French Glass Door',
    price: 599,
    category: 'Doors',
    type: 'French',
    format: 'GLTF',
    color: 'White',
    style: 'Classic',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/209289/pexels-photo-209289.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/31/800/600?d=${i}`),
    description: 'Elegant French door with glass panels for patios and garden access.',
    features: ['Tempered glass', 'Multi-point locking', 'Weather sealed', 'Easy installation'],
    dimensions: { width: 180, height: 210, depth: 4 },
    material: 'Solid Wood with Aluminum cladding',
    glassOptions: ['transparent', 'frosted']
  },
  {
    id: 7,
    name: 'Modern Sliding Door',
    price: 449,
    category: 'Doors',
    type: 'Sliding',
    format: 'GLB',
    color: 'Black',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/208969/pexels-photo-208969.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/104/800/600?e=${i}`),
    description: 'Space-saving sliding glass door with aluminum frame.',
    features: ['Low-E glass', 'Thermal break', 'Screens included', 'Security lock'],
    dimensions: { width: 240, height: 210, depth: 4 },
    material: 'Aluminum',
    glassOptions: ['transparent', 'tinted']
  },
  {
    id: 8,
    name: 'Pivot Entry Door',
    price: 1299,
    category: 'Doors',
    type: 'Pivot',
    format: 'GLTF',
    color: 'Gray',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/249997/pexels-photo-249997.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/118/800/600?o=${i}`),
    description: 'Stunning pivot door for modern entrances and luxury homes.',
    features: ['Oversized design', 'Premium hardware', 'Thermal insulation', 'Security system'],
    dimensions: { width: 120, height: 240, depth: 5 },
    material: 'Steel with Wood veneer',
    glassOptions: ['transparent']
  },
  {
    id: 9,
    name: 'Wooden Panel Door',
    price: 349,
    category: 'Doors',
    type: 'Panel',
    format: 'GLB',
    color: 'Wood',
    style: 'Classic',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/259803/pexels-photo-259803.jpeg',
    images360: Array.from({ length: 36 }, (_, i) => `https://picsum.photos/id/20/800/600?wd=${i}`),
    description: 'Solid wooden panel door with classic raised panel design.',
    features: ['Solid core', 'Sound proof', 'Pre-hung', 'Weather resistant'],
    dimensions: { width: 90, height: 200, depth: 4 },
    material: 'Mahogany Wood',
    glassOptions: []
  },
  {
    id: 10,
    name: 'Bi-fold Patio Door',
    price: 899,
    category: 'Doors',
    type: 'Bi-fold',
    format: 'OBJ',
    color: 'Black',
    style: 'Modern',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    thumbnail: 'https://images.pexels.com/photos/235866/pexels-photo-235866.jpeg',
    images360: Array.from({ length: 48 }, (_, i) => `https://picsum.photos/id/119/800/600?bf=${i}`),
    description: 'Space-saving bi-fold door that opens completely to connect indoor and outdoor.',
    features: ['Full opening', 'Stainless steel hardware', 'Weather tight seals', 'Stackable panels'],
    dimensions: { width: 300, height: 210, depth: 6 },
    material: 'Aluminum with Thermal break',
    glassOptions: ['transparent', 'tinted', 'frosted']
  }
];

const allProducts = [...windowModels, ...doorModels];

function Items3Dview() {
  const [models] = useState(allProducts);
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({
    price: 'all',
    format: 'all',
    type: 'all',
    color: 'all',
    style: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('bestMatch');
  const [favorites, setFavorites] = useState([]);
  const [customization, setCustomization] = useState({
    frameColor: '#2c2c2c',
    glassType: 'transparent',
    widthScale: 1,
    heightScale: 1
  });

  const categories = ['all', 'Windows', 'Doors'];

  const filteredModels = useMemo(() => {
    let result = models.filter(model => {
      if (activeCategory !== 'all' && model.category !== activeCategory) return false;
      if (filters.price === 'free' && model.price !== 0) return false;
      if (filters.price === 'paid' && model.price === 0) return false;
      if (filters.format !== 'all' && model.format !== filters.format) return false;
      if (filters.type !== 'all' && model.type !== filters.type) return false;
      if (filters.color !== 'all' && model.color !== filters.color) return false;
      if (filters.style !== 'all' && model.style !== filters.style) return false;
      if (filters.search && !model.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);

    return result;
  }, [models, activeCategory, filters, sortBy]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const colorMap = {
    'Black': '#1a1a1a',
    'White': '#f5f5f5',
    'Gray': '#888888',
    'Wood': '#8B5A2B'
  };

  const getUniqueTypes = () => {
    let filtered = models;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(m => m.category === activeCategory);
    }
    return ['all', ...new Set(filtered.map(m => m.type))];
  };

  if (selectedModel) {
    const use360View = selectedModel.format === 'OBJ';
    const currentColor = colorMap[selectedModel.color] || customization.frameColor;
    const avgScale = (customization.widthScale + customization.heightScale) / 2;

    return (
      <div className="app">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedModel(null)}>← Back to Marketplace</button>
          <span className="breadcrumb">{selectedModel.category} / <strong>{selectedModel.name}</strong></span>
        </div>

        <div className="detail-layout">
          <div>
            {use360View ? (
              <ThreeSixtyViewer images={selectedModel.images360} />
            ) : (
              <ThreeDViewer
                modelUrl={selectedModel.modelUrl}
                color={currentColor}
                glassType={customization.glassType}
                scale={avgScale}
              />
            )}
            
            <div className="action-buttons">
              <button className="btn-primary">🔄 Rotate 360°</button>
              <button className="btn-secondary">🎨 Customize</button>
              <button className="btn-secondary">💬 Request Quote</button>
              <button onClick={() => toggleFavorite(selectedModel.id)} className={`btn-save ${favorites.includes(selectedModel.id) ? 'active' : ''}`}>
                {favorites.includes(selectedModel.id) ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </div>

          <div className="info-panel">
            <h1 className="product-title">{selectedModel.name}</h1>
            <div className="product-price">{selectedModel.price === 0 ? 'FREE' : `$${selectedModel.price}`}</div>
            <p className="product-description">{selectedModel.description}</p>
            
            <div className="features-section">
              <h3 className="section-title">Key Features</h3>
              {selectedModel.features.map((f, idx) => (
                <div key={idx} className="feature-item">{f}</div>
              ))}
            </div>

            <div className="dimensions-box">
              <h3 className="section-title">Dimensions (cm)</h3>
              <div className="dimension-row"><span className="dimension-label">Width:</span><span>{selectedModel.dimensions.width} cm</span></div>
              <div className="dimension-row"><span className="dimension-label">Height:</span><span>{selectedModel.dimensions.height} cm</span></div>
              <div className="dimension-row"><span className="dimension-label">Depth:</span><span>{selectedModel.dimensions.depth} cm</span></div>
            </div>

            {selectedModel.glassOptions && selectedModel.glassOptions.length > 0 && (
              <div className="customization-panel">
                <h3 className="section-title">Customization</h3>
                
                <div className="custom-group">
                  <label className="custom-label">Frame Color</label>
                  <div className="color-options">
                    {['Black', 'White', 'Gray', 'Wood'].map(color => (
                      <div
                        key={color}
                        onClick={() => setCustomization({ ...customization, frameColor: colorMap[color] })}
                        className={`color-dot ${customization.frameColor === colorMap[color] ? 'active' : ''}`}
                        style={{ background: colorMap[color] }}
                      />
                    ))}
                  </div>
                </div>

                <div className="custom-group">
                  <label className="custom-label">Glass Type</label>
                  <select className="glass-select" value={customization.glassType} onChange={(e) => setCustomization({ ...customization, glassType: e.target.value })}>
                    {selectedModel.glassOptions.map(opt => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="custom-group">
                  <label className="custom-label">Width Scale: {customization.widthScale}x</label>
                  <input type="range" min="0.5" max="1.8" step="0.05" value={customization.widthScale} onChange={(e) => setCustomization({ ...customization, widthScale: parseFloat(e.target.value) })} />
                </div>

                <div className="custom-group">
                  <label className="custom-label">Height Scale: {customization.heightScale}x</label>
                  <input type="range" min="0.5" max="1.8" step="0.05" value={customization.heightScale} onChange={(e) => setCustomization({ ...customization, heightScale: parseFloat(e.target.value) })} />
                </div>
              </div>
            )}

            <div className="material-detail">
              <h3 className="section-title">Material</h3>
              <div className="material-text">{selectedModel.material}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-header">
        <div className="header-container">
          <h1 className="logo">🚪 Window & Door Marketplace</h1>
          
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
          
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search windows or doors..."
              className="search-input"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            
            <select className="filter-select" value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            
            <select className="filter-select" value={filters.format} onChange={(e) => setFilters({ ...filters, format: e.target.value })}>
              <option value="all">All Formats</option>
              <option value="GLB">3D Model</option>
              <option value="GLTF">3D Model</option>
              <option value="OBJ">360° View</option>
            </select>
            
            <select className="filter-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="all">All Types</option>
              {getUniqueTypes().filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select className="filter-select" value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
              <option value="all">All Colors</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Gray">Gray</option>
              <option value="Wood">Wood</option>
            </select>
            
            <select className="filter-select" value={filters.style} onChange={(e) => setFilters({ ...filters, style: e.target.value })}>
              <option value="all">All Styles</option>
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
            </select>
            
            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="bestMatch">Best Match</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="marketplace-container">
        <div className="models-grid">
          {filteredModels.map(model => (
            <div key={model.id} className="model-card" onClick={() => setSelectedModel(model)}>
              <div className="card-image-wrapper">
                <img src={model.thumbnail} alt={model.name} className="card-image" />
                {model.price === 0 ? (
                  <span className="price-badge price-free">FREE</span>
                ) : (
                  <span className="price-badge price-paid">${model.price}</span>
                )}
                {model.format === 'OBJ' && <span className="format-badge">360° View</span>}
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(model.id); }} className="favorite-btn">
                  {favorites.includes(model.id) ? '★' : '☆'}
                </button>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="model-name">{model.name}</h3>
                  <span className="category-tag">{model.category}</span>
                </div>
                <div className="model-tags">
                  <span className="tag">{model.type}</span>
                  <span className="tag">{model.style}</span>
                  <span className="tag">{model.color}</span>
                </div>
                <div className="model-meta">
                  <span>📐 {model.dimensions.width}x{model.dimensions.height}cm</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredModels.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">No products found. Try adjusting your filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Items3Dview;