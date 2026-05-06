import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./Items3Dview.css"

function buildSofa(scene) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0xc4a882, roughness: 0.85, metalness: 0.0 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.6, metalness: 0.1 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xb89a6e, roughness: 0.9, metalness: 0.0 });

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
  group.add(mkBox(1.05, 0.22, 1.15, fabric, -0.67, 0.22, 1.12));
  group.add(mkBox(1.05, 0.72, 0.22, fabric, -0.67, 0.61, 0.56));
  group.add(mkBox(0.18, 0.6, 1.15, fabric, -1.29, 0.52, 1.12));

  const cushionGeo = new THREE.BoxGeometry(0.75, 0.15, 0.95);
  const cx = [-0.79, 0, 0.79];
  cx.forEach(x => {
    const c = new THREE.Mesh(cushionGeo, cushionMat);
    c.position.set(x, 0.375, 0.02);
    c.castShadow = true;
    group.add(c);
  });
  const cc = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.95), cushionMat);
  cc.position.set(-0.67, 0.375, 1.12);
  cc.castShadow = true;
  group.add(cc);

  const pillowGeo = new THREE.BoxGeometry(0.65, 0.5, 0.18);
  [-0.82, 0, 0.82].forEach(x => {
    const p = new THREE.Mesh(pillowGeo, cushionMat);
    p.position.set(x, 0.62, -0.34);
    p.castShadow = true;
    group.add(p);
  });

  const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.19, 8);
  const legPositions = [
    [1.1, -0.67], [1.1, 0.48], [-1.1, -0.67], [-0.22, 0.48],
    [-1.1, 1.6], [-0.22, 1.6]
  ];
  legPositions.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(x, 0.025, z);
    leg.castShadow = true;
    group.add(leg);
  });

  group.position.y = 0.1;
  scene.add(group);
  return group;
}

function buildWardrobe(scene) {
  const group = new THREE.Group();
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.4, metalness: 0.1 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.3, metalness: 0.05 });
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xCD7F32, metalness: 0.7, roughness: 0.3 });

  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.6), woodMaterial);
  mainBody.position.set(0, 1.1, 0);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  group.add(mainBody);

  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.0, 0.05), doorMaterial);
  leftDoor.position.set(-0.41, 1.1, 0.31);
  leftDoor.castShadow = true;
  group.add(leftDoor);

  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.0, 0.05), doorMaterial);
  rightDoor.position.set(0.41, 1.1, 0.31);
  rightDoor.castShadow = true;
  group.add(rightDoor);

  const leftHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), handleMaterial);
  leftHandle.rotation.z = Math.PI / 2;
  leftHandle.position.set(-0.75, 1.1, 0.34);
  leftHandle.castShadow = true;
  group.add(leftHandle);

  const rightHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), handleMaterial);
  rightHandle.rotation.z = Math.PI / 2;
  rightHandle.position.set(0.75, 1.1, 0.34);
  rightHandle.castShadow = true;
  group.add(rightHandle);

  group.position.y = 0;
  scene.add(group);
  return group;
}

function buildBed(scene) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0x6B8E9B, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.5 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 2.0), wood);
  base.position.set(0, 0.15, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 1.9), fabric);
  mattress.position.set(0, 0.4, 0);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  group.add(mattress);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.8, 0.1), wood);
  headboard.position.set(0, 0.7, -1.05);
  headboard.castShadow = true;
  group.add(headboard);

  group.position.y = 0;
  scene.add(group);
  return group;
}

function buildBookshelf(scene) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xC19A6B, roughness: 0.4 });

  const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.05), wood);
  back.position.set(0, 0.75, -0.3);
  back.castShadow = true;
  group.add(back);

  const shelves = [0.2, 0.5, 0.8, 1.1];
  shelves.forEach(y => {
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
}

function buildDesk(scene) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.4 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.8), wood);
  top.position.set(0, 0.74, 0);
  top.castShadow = true;
  group.add(top);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), wood);
  leftLeg.position.set(-0.6, 0.35, -0.3);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), wood);
  rightLeg.position.set(0.6, 0.35, -0.3);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  const backLeftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), wood);
  backLeftLeg.position.set(-0.6, 0.35, 0.3);
  backLeftLeg.castShadow = true;
  group.add(backLeftLeg);

  const backRightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), wood);
  backRightLeg.position.set(0.6, 0.35, 0.3);
  backRightLeg.castShadow = true;
  group.add(backRightLeg);

  group.position.y = 0;
  scene.add(group);
  return group;
}

function ModelViewer({ modelType, wireframe, autoRotate, onResetView }) {
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

    let modelGroup;
    if (modelType === "sofa") modelGroup = buildSofa(scene);
    else if (modelType === "wardrobe") modelGroup = buildWardrobe(scene);
    else if (modelType === "bed") modelGroup = buildBed(scene);
    else if (modelType === "bookshelf") modelGroup = buildBookshelf(scene);
    else if (modelType === "desk") modelGroup = buildDesk(scene);
    else modelGroup = buildSofa(scene);
    
    setLoading(false);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.5, 0);
    controls.update();

    sceneRef.current = { renderer, scene, camera, controls, modelGroup, sun };

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
  }, [modelType]);

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

  useEffect(() => {
    if (!onResetView) return;
    const { camera, controls } = sceneRef.current;
    if (!camera || !controls) return;
    camera.position.set(3.5, 2.2, 4);
    controls.target.set(0, 0.5, 0);
    controls.update();
  }, [onResetView]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "#f5f5f5", zIndex: 10, borderRadius: 30
        }}>
          <div className="loader-ring" />
        </div>
      )}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

function ControlsPanel({
  autoRotate, setAutoRotate,
  wireframe, setWireframe,
  onReset, onFullscreen
}) {
  return (
    <div className="controls-panel">
      <button className="ctrl-btn" onClick={onReset} title="Reset View">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span>Reset</span>
      </button>

      <button className={`ctrl-btn ${autoRotate ? "ctrl-active" : ""}`} onClick={() => setAutoRotate(!autoRotate)} title="Auto Rotate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21.5 2v6h-6"/>
          <path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
        </svg>
        <span>{autoRotate ? "Stop" : "Rotate"}</span>
      </button>

      <button className={`ctrl-btn ${wireframe ? "ctrl-active" : ""}`} onClick={() => setWireframe(!wireframe)} title="Wireframe">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 22 20 2 20"/>
          <line x1="12" y1="2" x2="12" y2="20"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
          <line x1="7" y1="11" x2="17" y2="11"/>
        </svg>
        <span>Wire</span>
      </button>

      <button className="ctrl-btn" onClick={onFullscreen} title="Fullscreen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <span>Full</span>
      </button>
    </div>
  );
}

function ProductDetails({ selectedItem, collected, onCollect }) {
  const [shared, setShared] = useState(false);
  const [likes] = useState(247);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const getFeatures = (item) => {
    if (item?.type === "sofa") {
      return [
        { icon: "🪵", text: "Warm beige fabric with solid wooden legs" },
        { icon: "⚡", text: "Optimized polygon count for web & VR" },
        { icon: "🏠", text: "Suitable for interiors, games & AR/VR" },
        { icon: "✨", text: "Modern L-shape cozy design language" },
      ];
    } else if (item?.type === "wardrobe") {
      return [
        { icon: "🪵", text: "Solid oak wood construction" },
        { icon: "🚪", text: "Double doors with premium handles" },
        { icon: "📏", text: "Spacious interior with hanging rod" },
        { icon: "✨", text: "Modern minimalist design" },
      ];
    } else if (item?.type === "bed") {
      return [
        { icon: "🛏️", text: "Ergonomic headboard design" },
        { icon: "🪵", text: "Solid wood frame with fabric upholstery" },
        { icon: "📏", text: "Queen size (180x200cm)" },
        { icon: "✨", text: "Modern Scandinavian style" },
      ];
    } else if (item?.type === "bookshelf") {
      return [
        { icon: "📚", text: "Hexagonal unique design" },
        { icon: "🪵", text: "Premium wood finish" },
        { icon: "📏", text: "5 spacious compartments" },
        { icon: "✨", text: "Modern geometric aesthetic" },
      ];
    } else {
      return [
        { icon: "📏", text: "Spacious work surface" },
        { icon: "🪵", text: "Solid wood desk with metal legs" },
        { icon: "💡", text: "Cable management system" },
        { icon: "✨", text: "Modern ergonomic design" },
      ];
    }
  };

  const getSpecs = (item) => {
    if (item?.type === "sofa") {
      return [
        ["Model Size", "2400 × 1100 × 850 mm"],
        ["Style", "Modern / Contemporary"],
        ["Material", "Fabric + Solid Wood"],
        ["Shape", "L-Shape (Chaise)"],
        ["Polygon Count", "~12,400 tris"],
        ["Texture Maps", "Albedo, Normal, AO"],
      ];
    } else if (item?.type === "wardrobe") {
      return [
        ["Model Size", "1600 × 2200 × 600 mm"],
        ["Style", "Minimalist / Modern"],
        ["Material", "Solid Oak Wood"],
        ["Doors", "Double Sliding"],
        ["Polygon Count", "~8,200 tris"],
        ["Texture Maps", "Albedo, Normal, Roughness"],
      ];
    } else if (item?.type === "bed") {
      return [
        ["Model Size", "1800 × 2000 × 850 mm"],
        ["Style", "Scandinavian"],
        ["Material", "Wood + Fabric"],
        ["Type", "Queen Size Platform"],
        ["Polygon Count", "~10,500 tris"],
        ["Texture Maps", "Albedo, Normal, AO"],
      ];
    } else if (item?.type === "bookshelf") {
      return [
        ["Model Size", "1200 × 1500 × 400 mm"],
        ["Style", "Geometric / Modern"],
        ["Material", "Engineered Wood"],
        ["Shape", "Hexagonal"],
        ["Polygon Count", "~6,800 tris"],
        ["Texture Maps", "Albedo, Normal"],
      ];
    } else {
      return [
        ["Model Size", "1400 × 780 × 750 mm"],
        ["Style", "Modern / Ergonomic"],
        ["Material", "Wood + Metal"],
        ["Type", "Writing Desk"],
        ["Polygon Count", "~5,200 tris"],
        ["Texture Maps", "Albedo, Normal, AO"],
      ];
    }
  };

  return (
    <div className="product-panel">
      <div className="product-badge">3D Model</div>

      <h1 className="product-title">{selectedItem?.name || "Urban Comfort Sofa"}</h1>
      <p className="product-subtitle">{selectedItem?.subtitle || "L-Shape Modern Series"}</p>

      <div className="product-stats">
        <div className="stat">
          <span className="stat-icon">👁</span>
          <span className="stat-val">3,820</span>
          <span className="stat-label">Views</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-icon">⭐</span>
          <span className="stat-val">{collected ? likes + 1 : likes}</span>
          <span className="stat-label">Likes</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-icon">📦</span>
          <span className="stat-val">GLB</span>
          <span className="stat-label">Format</span>
        </div>
      </div>

      <div className="section-label">Features</div>
      <div className="feature-tags">
        {getFeatures(selectedItem).map((f, i) => (
          <div className="tag" key={i}>
            <span className="tag-icon">{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      <div className="section-label">Specifications</div>
      <div className="spec-table">
        {getSpecs(selectedItem).map(([label, value]) => (
          <div className="spec-row" key={label}>
            <span className="spec-label">{label}</span>
            <span className="spec-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className={`btn-collect ${collected ? "collected" : ""}`} onClick={onCollect}>
          {collected ? "★ Collected" : "☆ Collect"}
        </button>
        <button className={`btn-share ${shared ? "shared" : ""}`} onClick={handleShare}>
          {shared ? "✓ Copied!" : "↗ Share"}
        </button>
      </div>

      <div className="license-note">
        Free for personal and commercial use · No attribution required
      </div>
    </div>
  );
}

function ItemsGallery({ onSelectItem, selectedItem, searchQuery, setSearchQuery, selectedColor, setSelectedColor, selectedUpdate, setSelectedUpdate }) {
  const items = [
    { id: 1, name: "Urban Comfort Sofa", subtitle: "L-Shape Modern Series", type: "sofa", color: "beige", category: "living", icon: "🛋️", date: new Date(2024, 2, 15), badge: "3D Model" },
    { id: 2, name: "Urban Wardrobe", subtitle: "Modern Closet For Modern Aesthetics", type: "wardrobe", color: "wood", category: "bedroom", icon: "🚪", date: new Date(2024, 3, 10), badge: "3D Model" },
    { id: 3, name: "Unique Hexagonal Bookshelf", subtitle: "Geometric Design Bookshelf", type: "bookshelf", color: "wood", category: "living", icon: "📚", date: new Date(2024, 3, 5), badge: "3D Model" },
    { id: 4, name: "Elegant Modern Bed", subtitle: "Queen Size Platform Bed", type: "bed", color: "gray", category: "bedroom", icon: "🛏️", date: new Date(2024, 2, 28), badge: "3D Model" },
    { id: 5, name: "Stylish Urban Closet", subtitle: "For Modern Living", type: "wardrobe", color: "white", category: "bedroom", icon: "🚪", date: new Date(2024, 3, 12), badge: "3D Model" },
    { id: 6, name: "Ergonomic Desk", subtitle: "Home Office Workstation", type: "desk", color: "wood", category: "office", icon: "📝", date: new Date(2024, 3, 8), badge: "3D Model" },
    { id: 7, name: "Modern Coffee Table", subtitle: "Minimalist Round Design", type: "desk", color: "brown", category: "living", icon: "🪑", date: new Date(2024, 2, 20), badge: "3D Model" },
    { id: 8, name: "Velvet Armchair", subtitle: "Luxury Accent Chair", type: "sofa", color: "purple", category: "living", icon: "💺", date: new Date(2024, 3, 1), badge: "3D Model" },
    { id: 9, name: "Aluminum Window", subtitle: "Dark Gray Frame Modern Design", type: "window", color: "gray", category: "windows", icon: "🪟", date: new Date(2024, 3, 15), badge: "3D Model" },
    { id: 10, name: "Sliding Glass Door", subtitle: "Contemporary Aluminum Frame", type: "door", color: "gray", category: "doors", icon: "🚪", date: new Date(2024, 3, 14), badge: "3D Model" },
  ];

  const colors = ["red", "orange", "yellow", "green", "blue", "purple", "earth", "pink", "wood", "black", "gray", "white", "brown", "beige", "golden"];

  const getColorClass = (color) => {
    const colorMap = {
      red: "color-red", orange: "color-orange", yellow: "color-yellow", green: "color-green",
      blue: "color-blue", purple: "color-purple", earth: "color-earth", pink: "color-pink",
      wood: "color-wood", black: "color-black", gray: "color-gray", white: "color-white",
      brown: "color-brown", beige: "color-beige", golden: "color-golden"
    };
    return colorMap[color] || "color-gray";
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = !selectedColor || item.color === selectedColor;
    
    let matchesUpdate = true;
    if (selectedUpdate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesUpdate = item.date >= weekAgo;
    } else if (selectedUpdate === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesUpdate = item.date >= monthAgo;
    }
    
    return matchesSearch && matchesColor && matchesUpdate;
  });

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>3D Models Library</h1>
        <p>Browse our collection of premium 3D furniture and architectural models</p>
      </div>

      <div className="gallery-filters">
        <div className="filter-section">
          <label>Color:</label>
          <div className="color-filters">
            <div
              className={`color-btn ${!selectedColor ? "active" : ""}`}
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              onClick={() => setSelectedColor(null)}
              title="All Colors"
            />
            {colors.map(color => (
              <div
                key={color}
                className={`color-btn ${getColorClass(color)} ${selectedColor === color ? "active" : ""}`}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label>Updated:</label>
          <div className="update-filters">
            <button className={`update-btn ${selectedUpdate === "all" ? "active" : ""}`} onClick={() => setSelectedUpdate("all")}>All</button>
            <button className={`update-btn ${selectedUpdate === "week" ? "active" : ""}`} onClick={() => setSelectedUpdate("week")}>Last 7 Days</button>
            <button className={`update-btn ${selectedUpdate === "month" ? "active" : ""}`} onClick={() => setSelectedUpdate("month")}>Last Month</button>
          </div>
        </div>

        <div className="filter-section search-section">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="items-gallery-grid">
        {filteredItems.length === 0 ? (
          <div className="no-results">No models found matching your criteria</div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`gallery-item-card ${selectedItem?.id === item.id ? "selected" : ""}`}
              onClick={() => onSelectItem(item)}
            >
              <div className="gallery-item-preview">
                <div className="item-icon">{item.icon}</div>
                <div className="item-badge">{item.badge}</div>
              </div>
              <div className="gallery-item-info">
                <h3>{item.name}</h3>
                <p>{item.subtitle}</p>
                <button className="view-3d-btn">View in 3D →</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("gallery");
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [collected, setCollected] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState("all");
  const viewerRef = useRef(null);

  const items = [
    { id: 1, name: "Urban Comfort Sofa", subtitle: "L-Shape Modern Series", type: "sofa", color: "beige", category: "living", icon: "🛋️", date: new Date(2024, 2, 15), badge: "3D Model" },
    { id: 2, name: "Urban Wardrobe", subtitle: "Modern Closet For Modern Aesthetics", type: "wardrobe", color: "wood", category: "bedroom", icon: "🚪", date: new Date(2024, 3, 10), badge: "3D Model" },
    { id: 3, name: "Unique Hexagonal Bookshelf", subtitle: "Geometric Design Bookshelf", type: "bookshelf", color: "wood", category: "living", icon: "📚", date: new Date(2024, 3, 5), badge: "3D Model" },
    { id: 4, name: "Elegant Modern Bed", subtitle: "Queen Size Platform Bed", type: "bed", color: "gray", category: "bedroom", icon: "🛏️", date: new Date(2024, 2, 28), badge: "3D Model" },
    { id: 5, name: "Stylish Urban Closet", subtitle: "For Modern Living", type: "wardrobe", color: "white", category: "bedroom", icon: "🚪", date: new Date(2024, 3, 12), badge: "3D Model" },
    { id: 6, name: "Ergonomic Desk", subtitle: "Home Office Workstation", type: "desk", color: "wood", category: "office", icon: "📝", date: new Date(2024, 3, 8), badge: "3D Model" },
    { id: 7, name: "Modern Coffee Table", subtitle: "Minimalist Round Design", type: "desk", color: "brown", category: "living", icon: "🪑", date: new Date(2024, 2, 20), badge: "3D Model" },
    { id: 8, name: "Velvet Armchair", subtitle: "Luxury Accent Chair", type: "sofa", color: "purple", category: "living", icon: "💺", date: new Date(2024, 3, 1), badge: "3D Model" },
  ];

  const handleReset = () => setResetKey(k => k + 1);

  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    if (!selectedItem && items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [selectedItem, items]);

  return (
    <div className="app-container">
      <div className="page-nav">
        <button className={`nav-btn ${currentPage === "gallery" ? "active" : ""}`} onClick={() => setCurrentPage("gallery")}>
          📚 Gallery
        </button>
        <button className={`nav-btn ${currentPage === "viewer" ? "active" : ""}`} onClick={() => setCurrentPage("viewer")}>
          🎨 3D Viewer
        </button>
      </div>

      {currentPage === "gallery" ? (
        <ItemsGallery
          onSelectItem={(item) => {
            setSelectedItem(item);
            setCurrentPage("viewer");
          }}
          selectedItem={selectedItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedUpdate={selectedUpdate}
          setSelectedUpdate={setSelectedUpdate}
        />
      ) : (
        <div className="main-layout">
          <div className="viewer-section">
            <div className="viewer-layout">
              <div className="viewer-card" ref={viewerRef}>
                <div className="canvas-container">
                  <ModelViewer
                    modelType={selectedItem?.type || "sofa"}
                    wireframe={wireframe}
                    autoRotate={autoRotate}
                    onResetView={resetKey}
                  />
                </div>
                <ControlsPanel
                  autoRotate={autoRotate}
                  setAutoRotate={setAutoRotate}
                  wireframe={wireframe}
                  setWireframe={setWireframe}
                  onReset={handleReset}
                  onFullscreen={handleFullscreen}
                />
              </div>
              <ProductDetails
                selectedItem={selectedItem}
                collected={collected}
                onCollect={() => setCollected(c => !c)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}