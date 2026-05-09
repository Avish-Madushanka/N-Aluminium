import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./Ad3Ditems.css";

const modelBuilders = {
  window: (scene, color) => {
    const group = new THREE.Group();
    const frameMaterial = new THREE.MeshStandardMaterial({ color: color || 0x2C3E50, roughness: 0.3, metalness: 0.7 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xBDC3C7, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.4 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.08), frameMaterial);
    frame.position.set(0, 0.6, 0);
    frame.castShadow = true;
    group.add(frame);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 0.02), glassMaterial);
    glass.position.set(0, 0.6, 0.04);
    glass.castShadow = true;
    group.add(glass);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  door: (scene, color) => {
    const group = new THREE.Group();
    const doorMaterial = new THREE.MeshStandardMaterial({ color: color || 0x8B5A2B, roughness: 0.3, metalness: 0.1 });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.4 });
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xCD7F32, metalness: 0.7 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.08), frameMaterial);
    frame.position.set(0, 1.0, 0);
    frame.castShadow = true;
    group.add(frame);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.88, 0.05), doorMaterial);
    door.position.set(0, 1.0, 0.05);
    door.castShadow = true;
    group.add(door);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8), handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.35, 1.0, 0.1);
    handle.castShadow = true;
    group.add(handle);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  pantry: (scene, color) => {
    const group = new THREE.Group();
    const woodMaterial = new THREE.MeshStandardMaterial({ color: color || 0xBC9A6C, roughness: 0.4, metalness: 0.1 });
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xCD7F32, metalness: 0.8 });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.55), woodMaterial);
    mainBody.position.set(0, 0.9, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    group.add(mainBody);
    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.57, 1.65, 0.05), woodMaterial);
    leftDoor.position.set(-0.315, 0.9, 0.3);
    leftDoor.castShadow = true;
    group.add(leftDoor);
    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.57, 1.65, 0.05), woodMaterial);
    rightDoor.position.set(0.315, 0.9, 0.3);
    rightDoor.castShadow = true;
    group.add(rightDoor);
    const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.1, 8);
    const leftHandle = new THREE.Mesh(handleGeo, handleMaterial);
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.position.set(-0.55, 0.9, 0.33);
    group.add(leftHandle);
    const rightHandle = new THREE.Mesh(handleGeo, handleMaterial);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(0.55, 0.9, 0.33);
    group.add(rightHandle);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  panlight: (scene, color) => {
    const group = new THREE.Group();
    const frameMaterial = new THREE.MeshStandardMaterial({ color: color || 0xE6B800, roughness: 0.2, metalness: 0.85 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xFFF5C2, roughness: 0.1, metalness: 0.1, emissive: 0x442200, emissiveIntensity: 0.3 });
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 1.0), frameMaterial);
    outerFrame.position.set(0, 1.6, 0);
    outerFrame.castShadow = true;
    group.add(outerFrame);
    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.04, 0.88), glassMaterial);
    glassPanel.position.set(0, 1.6, 0);
    glassPanel.castShadow = true;
    group.add(glassPanel);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  sofa: (scene) => {
    const group = new THREE.Group();
    const fabric = new THREE.MeshStandardMaterial({ color: 0xc4a882, roughness: 0.85 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.6 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0xb89a6e, roughness: 0.9 });
    const mkBox = (w, h, d, mat, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };
    group.add(mkBox(2.4, 0.22, 1.1, fabric, 0, 0.22, 0));
    group.add(mkBox(2.4, 0.72, 0.22, fabric, 0, 0.61, -0.44));
    group.add(mkBox(0.18, 0.6, 1.1, fabric, -1.29, 0.52, 0));
    group.add(mkBox(0.18, 0.6, 1.1, fabric, 1.29, 0.52, 0));
    const cushionGeo = new THREE.BoxGeometry(0.75, 0.15, 0.95);
    [-0.79, 0, 0.79].forEach(x => {
      const c = new THREE.Mesh(cushionGeo, cushionMat);
      c.position.set(x, 0.375, 0.02);
      c.castShadow = true;
      group.add(c);
    });
    const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.19, 8);
    [[1.1, -0.67], [1.1, 0.48], [-1.1, -0.67], [-0.22, 0.48], [-1.1, 1.6], [-0.22, 1.6]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, wood);
      leg.position.set(x, 0.025, z);
      leg.castShadow = true;
      group.add(leg);
    });
    group.position.y = 0.1;
    scene.add(group);
    return group;
  },
  bed: (scene) => {
    const group = new THREE.Group();
    const fabric = new THREE.MeshStandardMaterial({ color: 0x6B8E9B, roughness: 0.7 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.5 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 2.0), wood);
    base.position.set(0, 0.15, 0);
    base.castShadow = true;
    group.add(base);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 1.9), fabric);
    mattress.position.set(0, 0.4, 0);
    mattress.castShadow = true;
    group.add(mattress);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.8, 0.1), wood);
    headboard.position.set(0, 0.7, -1.05);
    headboard.castShadow = true;
    group.add(headboard);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  wardrobe: (scene) => {
    const group = new THREE.Group();
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.4 });
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.3 });
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xCD7F32, metalness: 0.7 });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.6), woodMaterial);
    mainBody.position.set(0, 1.1, 0);
    mainBody.castShadow = true;
    group.add(mainBody);
    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.0, 0.05), doorMaterial);
    leftDoor.position.set(-0.41, 1.1, 0.31);
    leftDoor.castShadow = true;
    group.add(leftDoor);
    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.0, 0.05), doorMaterial);
    rightDoor.position.set(0.41, 1.1, 0.31);
    rightDoor.castShadow = true;
    group.add(rightDoor);
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8);
    const leftHandle = new THREE.Mesh(handleGeo, handleMaterial);
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.position.set(-0.75, 1.1, 0.34);
    group.add(leftHandle);
    const rightHandle = new THREE.Mesh(handleGeo, handleMaterial);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(0.75, 1.1, 0.34);
    group.add(rightHandle);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  bookshelf: (scene) => {
    const group = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0xC19A6B, roughness: 0.4 });
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.05), wood);
    back.position.set(0, 0.75, -0.3);
    back.castShadow = true;
    group.add(back);
    [0.2, 0.5, 0.8, 1.1].forEach(y => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.4), wood);
      shelf.position.set(0, y, 0);
      shelf.castShadow = true;
      group.add(shelf);
    });
    const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.45), wood);
    leftSide.position.set(-0.64, 0.75, 0);
    leftSide.castShadow = true;
    group.add(leftSide);
    const rightSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.45), wood);
    rightSide.position.set(0.64, 0.75, 0);
    rightSide.castShadow = true;
    group.add(rightSide);
    group.position.y = 0;
    scene.add(group);
    return group;
  },
  desk: (scene) => {
    const group = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.4 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.8), wood);
    top.position.set(0, 0.74, 0);
    top.castShadow = true;
    group.add(top);
    const legPositions = [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]];
    legPositions.forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), wood);
      leg.position.set(x, 0.35, z);
      leg.castShadow = true;
      group.add(leg);
    });
    group.position.y = 0;
    scene.add(group);
    return group;
  }
};

function Ad3DModelViewer({ modelData, wireframe, autoRotate }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    const w = el.clientWidth, h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(3.5, 2.2, 4);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.4);
    sun.position.set(5, 8, 5);
    sun.castShadow = true;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 30;
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.5);
    fill.position.set(-5, 3, 2);
    scene.add(fill);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(10, 20, 0xdddddd, 0xdddddd);
    grid.position.y = 0.001;
    scene.add(grid);

    let modelGroup = null;
    if (modelData && modelBuilders[modelData.type]) {
      modelGroup = modelBuilders[modelData.type](scene, modelData.color);
    } else {
      modelGroup = modelBuilders.window(scene, 0x2C3E50);
    }
    
    setLoading(false);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.5, 0);
    controls.update();

    sceneRef.current = { renderer, scene, camera, controls, modelGroup };

    const onResize = () => {
      const w2 = el.clientWidth, h2 = el.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [modelData]);

  useEffect(() => {
    const { modelGroup } = sceneRef.current;
    if (!modelGroup) return;
    modelGroup.traverse(child => {
      if (child.isMesh) child.material.wireframe = wireframe;
    });
  }, [wireframe]);

  useEffect(() => {
    const { controls } = sceneRef.current;
    if (!controls) return;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
  }, [autoRotate]);

  return (
    <div className="Ad3D-viewer-container">
      {loading && (
        <div className="Ad3D-loader-overlay">
          <div className="Ad3D-loader-ring" />
        </div>
      )}
      <div ref={mountRef} className="Ad3D-canvas" />
    </div>
  );
}

function Ad3DControls({ autoRotate, setAutoRotate, wireframe, setWireframe, onReset, onFullscreen }) {
  return (
    <div className="Ad3D-controls-panel">
      <button className="Ad3D-ctrl-btn" onClick={onReset} title="Reset View">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span>Reset</span>
      </button>
      <button className={`Ad3D-ctrl-btn ${autoRotate ? "active" : ""}`} onClick={() => setAutoRotate(!autoRotate)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6"/>
          <path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
        </svg>
        <span>{autoRotate ? "Stop" : "Rotate"}</span>
      </button>
      <button className={`Ad3D-ctrl-btn ${wireframe ? "active" : ""}`} onClick={() => setWireframe(!wireframe)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 22 20 2 20"/>
          <line x1="12" y1="2" x2="12" y2="20"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
          <line x1="7" y1="11" x2="17" y2="11"/>
        </svg>
        <span>Wire</span>
      </button>
      <button className="Ad3D-ctrl-btn" onClick={onFullscreen}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <span>Full</span>
      </button>
    </div>
  );
}

function Ad3DItemCard({ item, isSelected, onClick }) {
  return (
    <div className={`Ad3D-item-card ${isSelected ? "selected" : ""}`} onClick={() => onClick(item)}>
      <div className="Ad3D-item-preview">
        <div className="Ad3D-item-icon">{item.icon}</div>
        <div className="Ad3D-item-badge">{item.category}</div>
      </div>
      <div className="Ad3D-item-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="Ad3D-item-meta">
          <span>🔵 {item.colorText}</span>
          <span>📐 {item.dimensions}</span>
        </div>
        <button className="Ad3D-view-btn">View in 3D →</button>
      </div>
    </div>
  );
}

function Ad3DAddItemForm({ onAddItem, categories }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "window",
    category: "windows",
    color: "#2C3E50",
    colorText: "Dark Gray",
    dimensions: "1500 x 1200 mm",
    description: "",
    icon: "🪟"
  });
  const [showForm, setShowForm] = useState(false);

  const typeIcons = {
    window: "🪟",
    door: "🚪",
    pantry: "🥫",
    panlight: "💡",
    sofa: "🛋️",
    bed: "🛏️",
    wardrobe: "🚪",
    bookshelf: "📚",
    desk: "📝"
  };

  const typeCategories = {
    window: "windows",
    door: "doors",
    pantry: "pantry cupboards",
    panlight: "panlights",
    sofa: "all",
    bed: "all",
    wardrobe: "all",
    bookshelf: "all",
    desk: "all"
  };

  const colorOptions = [
    { name: "Dark Gray", value: "#2C3E50" },
    { name: "White", value: "#ECF0F1" },
    { name: "Black", value: "#1A1A2E" },
    { name: "Bronze", value: "#CD7F32" },
    { name: "Silver", value: "#BDC3C7" },
    { name: "Oak Wood", value: "#8B5A2B" },
    { name: "Walnut", value: "#5C3A21" },
    { name: "Beige", value: "#C4A882" },
    { name: "Gray", value: "#6B8E9B" },
    { name: "Brass", value: "#D4AF37" },
    { name: "Copper", value: "#B87333" },
    { name: "Nickel", value: "#C0C0C0" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      icon: typeIcons[value] || prev.icon,
      category: typeCategories[value] || prev.category
    }));
  };

  const handleColorSelect = (colorName, colorValue) => {
    setFormData(prev => ({
      ...prev,
      color: colorValue,
      colorText: colorName
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...formData,
      color: parseInt(formData.color.replace("#", "0x"), 16)
    };
    onAddItem(newItem);
    setFormData({
      name: "",
      type: "window",
      category: "windows",
      color: "#2C3E50",
      colorText: "Dark Gray",
      dimensions: "1500 x 1200 mm",
      description: "",
      icon: "🪟"
    });
    setShowForm(false);
  };

  return (
    <div className="Ad3D-add-form-container">
      <button className="Ad3D-add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Cancel" : "+ Add New 3D Item"}
      </button>
      
      {showForm && (
        <form className="Ad3D-form" onSubmit={handleSubmit}>
          <div className="Ad3D-form-group">
            <label>Item Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Modern Aluminum Window" required />
          </div>
          
          <div className="Ad3D-form-group">
            <label>Item Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="window">Window</option>
              <option value="door">Door</option>
              <option value="pantry">Pantry Cupboard</option>
              <option value="panlight">Panlight</option>
              <option value="sofa">Sofa</option>
              <option value="bed">Bed</option>
              <option value="wardrobe">Wardrobe</option>
              <option value="bookshelf">Bookshelf</option>
              <option value="desk">Desk</option>
            </select>
          </div>
          
          <div className="Ad3D-form-group">
            <label>Color</label>
            <div className="Ad3D-color-options">
              {colorOptions.map(color => (
                <div
                  key={color.name}
                  className={`Ad3D-color-chip ${formData.colorText === color.name ? "active" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorSelect(color.name, color.value)}
                  title={color.name}
                />
              ))}
            </div>
            <input type="text" value={formData.colorText} readOnly className="Ad3D-color-name" />
          </div>
          
          <div className="Ad3D-form-row">
            <div className="Ad3D-form-group">
              <label>Dimensions</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g., 1500 x 1200 mm" />
            </div>
            <div className="Ad3D-form-group">
              <label>Icon</label>
              <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="🪟" maxLength="2" />
            </div>
          </div>
          
          <div className="Ad3D-form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Brief description of the 3D model..." />
          </div>
          
          <div className="Ad3D-form-actions">
            <button type="submit" className="Ad3D-submit-btn">Add to Library</button>
            <button type="button" className="Ad3D-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

function Ad3DItemsGallery({ items, onSelectItem, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, onAddItem }) {
  const categories = ["all", "windows", "doors", "pantry cupboards", "panlights"];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="Ad3D-gallery">
      <div className="Ad3D-gallery-header">
        <h1>3D Models Library</h1>
        <p>Browse and manage your collection of 3D furniture and architectural models</p>
      </div>

      <div className="Ad3D-filters-bar">
        <div className="Ad3D-search-wrapper">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="Ad3D-search-input"
          />
        </div>
        <div className="Ad3D-category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`Ad3D-category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "All Items" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Ad3DAddItemForm onAddItem={onAddItem} categories={categories} />

      <div className="Ad3D-items-grid">
        {filteredItems.length === 0 ? (
          <div className="Ad3D-no-results">No models found. Click "Add New 3D Item" to create one!</div>
        ) : (
          filteredItems.map(item => (
            <Ad3DItemCard
              key={item.id}
              item={item}
              isSelected={false}
              onClick={onSelectItem}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Ad3DProductPanel({ selectedItem, onClose }) {
  const [liked, setLiked] = useState(false);

  const getFeatures = () => {
    const features = {
      window: [
        "Aluminum frame with transparent glass",
        "Optimized polygons for smooth rendering",
        "Suitable for interior design and gaming",
        "Modern minimalist style"
      ],
      door: [
        "Solid wood construction",
        "Premium hardware included",
        "Interior door design",
        "Elegant finish"
      ],
      pantry: [
        "Spacious storage capacity",
        "Solid wood with glass inserts",
        "Double door design",
        "Kitchen essential organizer"
      ],
      panlight: [
        "Energy efficient LED compatible",
        "Warm ambient lighting",
        "Frosted glass panel",
        "Modern ceiling fixture"
      ],
      sofa: [
        "Warm fabric with wooden legs",
        "Optimized polygon count",
        "Modern L-shape design",
        "Comfortable seating"
      ],
      bed: [
        "Ergonomic headboard",
        "Solid wood frame",
        "Queen size platform",
        "Scandinavian style"
      ]
    };
    return features[selectedItem?.type] || features.window;
  };

  if (!selectedItem) return null;

  return (
    <div className="Ad3D-product-panel">
      <button className="Ad3D-close-panel" onClick={onClose}>✕</button>
      
      <div className="Ad3D-product-badge">{selectedItem.category}</div>
      
      <h2 className="Ad3D-product-title">{selectedItem.name}</h2>
      <p className="Ad3D-product-desc">{selectedItem.description || "Premium 3D model for architectural visualization and gaming."}</p>
      
      <div className="Ad3D-product-stats">
        <div className="Ad3D-stat">
          <span className="Ad3D-stat-value">2,342</span>
          <span className="Ad3D-stat-label">Views</span>
        </div>
        <div className="Ad3D-stat-divider" />
        <div className="Ad3D-stat">
          <span className="Ad3D-stat-value">{liked ? 892 : 891}</span>
          <span className="Ad3D-stat-label">Likes</span>
        </div>
        <div className="Ad3D-stat-divider" />
        <div className="Ad3D-stat">
          <span className="Ad3D-stat-value">GLB</span>
          <span className="Ad3D-stat-label">Format</span>
        </div>
      </div>
      
      <div className="Ad3D-section">
        <div className="Ad3D-section-label">Features</div>
        <div className="Ad3D-feature-list">
          {getFeatures().map((feature, i) => (
            <div className="Ad3D-feature-item" key={i}>
              <span className="Ad3D-feature-bullet">•</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="Ad3D-section">
        <div className="Ad3D-section-label">Specifications</div>
        <div className="Ad3D-specs">
          <div className="Ad3D-spec-row">
            <span className="Ad3D-spec-label">Model Size</span>
            <span className="Ad3D-spec-value">{selectedItem.dimensions}</span>
          </div>
          <div className="Ad3D-spec-row">
            <span className="Ad3D-spec-label">Material</span>
            <span className="Ad3D-spec-value">{selectedItem.colorText}</span>
          </div>
          <div className="Ad3D-spec-row">
            <span className="Ad3D-spec-label">Style</span>
            <span className="Ad3D-spec-value">Modern / Contemporary</span>
          </div>
          <div className="Ad3D-spec-row">
            <span className="Ad3D-spec-label">Polygon Count</span>
            <span className="Ad3D-spec-value">~500 optimized</span>
          </div>
        </div>
      </div>
      
      <div className="Ad3D-actions">
        <button className={`Ad3D-collect-btn ${liked ? "collected" : ""}`} onClick={() => setLiked(!liked)}>
          {liked ? "★ Collected" : "☆ Collect"}
        </button>
        <button className="Ad3D-share-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          ↗ Share
        </button>
      </div>
    </div>
  );
}

export default function Ad3DItemsApp() {
  const [items, setItems] = useState([
    { id: 1, name: "Dark Gray Aluminum Window", type: "window", category: "windows", color: 0x2C3E50, colorText: "Dark Gray", dimensions: "1500 x 1200 mm", description: "Modern sliding window with dark gray aluminum frame and transparent glass.", icon: "🪟" },
    { id: 2, name: "White Aluminum Window", type: "window", category: "windows", color: 0xECF0F1, colorText: "White", dimensions: "1500 x 1200 mm", description: "Clean white aluminum frame window with double-pane glass.", icon: "🪟" },
    { id: 3, name: "Black Aluminum Window", type: "window", category: "windows", color: 0x1A1A2E, colorText: "Black", dimensions: "1500 x 1200 mm", description: "Sleek black aluminum frame window with low-E glass coating.", icon: "🪟" },
    { id: 4, name: "Oak Wood Door", type: "door", category: "doors", color: 0x8B5A2B, colorText: "Oak Wood", dimensions: "1000 x 2100 mm", description: "Premium solid oak wood door with brushed nickel hardware.", icon: "🚪" },
    { id: 5, name: "Walnut Wood Door", type: "door", category: "doors", color: 0x5C3A21, colorText: "Walnut", dimensions: "1000 x 2100 mm", description: "Rich walnut wood grain door with matte black handles.", icon: "🚪" },
    { id: 6, name: "Rustic Pantry Cupboard", type: "pantry", category: "pantry cupboards", color: 0xBC9A6C, colorText: "Rustic Oak", dimensions: "1200 x 1800 mm", description: "Charming rustic pantry cupboard with wire mesh doors.", icon: "🥫" },
    { id: 7, name: "Modern Pantry Cabinet", type: "pantry", category: "pantry cupboards", color: 0xF5F5F5, colorText: "Gloss White", dimensions: "1200 x 1800 mm", description: "Contemporary pantry cabinet with soft-close doors.", icon: "🥫" },
    { id: 8, name: "Black Modern Panlight", type: "panlight", category: "panlights", color: 0x1A1A1A, colorText: "Black", dimensions: "600 x 600 mm", description: "Modern black panlight with warm LED lighting.", icon: "💡" },
    { id: 9, name: "Brass Panlight", type: "panlight", category: "panlights", color: 0xD4AF37, colorText: "Brass", dimensions: "600 x 600 mm", description: "Elegant brass-finish panlight for luxury spaces.", icon: "💡" },
    { id: 10, name: "Urban Comfort Sofa", type: "sofa", category: "all", color: 0xC4A882, colorText: "Beige", dimensions: "2400 x 850 mm", description: "Comfortable L-shaped sofa with warm beige fabric.", icon: "🛋️" },
    { id: 11, name: "Elegant Modern Bed", type: "bed", category: "all", color: 0x6B8E9B, colorText: "Gray", dimensions: "1800 x 2000 mm", description: "Modern platform bed with ergonomic headboard.", icon: "🛏️" },
    { id: 12, name: "Hexagonal Bookshelf", type: "bookshelf", category: "all", color: 0xC19A6B, colorText: "Wood", dimensions: "1200 x 1500 mm", description: "Unique hexagonal bookshelf with premium wood finish.", icon: "📚" },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [viewMode, setViewMode] = useState("gallery");
  const viewerRef = useRef(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setViewMode("viewer");
  };

  const handleAddItem = (newItem) => {
    setItems(prev => [...prev, newItem]);
  };

  const handleReset = () => setResetKey(prev => prev + 1);
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (viewMode === "gallery") {
    return (
      <div className="Ad3D-app">
        <Ad3DItemsGallery
          items={items}
          onSelectItem={handleSelectItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAddItem={handleAddItem}
        />
      </div>
    );
  }

  return (
    <div className="Ad3D-app">
      <div className="Ad3D-viewer-layout">
        <div className="Ad3D-viewer-section">
          <div className="Ad3D-viewer-card" ref={viewerRef}>
            <Ad3DModelViewer
              modelData={selectedItem}
              wireframe={wireframe}
              autoRotate={autoRotate}
            />
            <Ad3DControls
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              wireframe={wireframe}
              setWireframe={setWireframe}
              onReset={handleReset}
              onFullscreen={handleFullscreen}
            />
          </div>
          <Ad3DProductPanel
            selectedItem={selectedItem}
            onClose={() => setViewMode("gallery")}
          />
        </div>
      </div>
    </div>
  );
}