import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import "./Items3DView.css";

const ITEMS = [
  { id: 1, name: "Dark Slate Window", sub: "Architectural Sliding Series", type: "window", cat: "windows", colorHex: "#2C3E50", colorNum: 0x2C3E50, colorLabel: "Dark Slate", views: 4821, likes: 2341, desc: "Premium dark slate aluminum window system with multi-point locking, dual-pane low-E glass, and precision-engineered extruded profiles." },
  { id: 2, name: "Arctic White Window", sub: "Contemporary Casement Series", type: "window", cat: "windows", colorHex: "#E8EDF0", colorNum: 0xE8EDF0, colorLabel: "Arctic White", views: 3290, likes: 1756, desc: "Clean arctic-white powder-coat window with thermally-broken frame system, ideal for energy-efficient residential design." },
  { id: 3, name: "Midnight Black Window", sub: "Minimalist Fixed Glazing", type: "window", cat: "windows", colorHex: "#1a1a1a", colorNum: 0x1a1a1a, colorLabel: "Midnight Black", views: 5100, likes: 2892, desc: "Dramatic midnight-black anodized aluminum window with ultra-slim sightlines. Maximizes glass area for panoramic views." },
  { id: 4, name: "Bronze Anodized Window", sub: "Classic Awning Series", type: "window", cat: "windows", colorHex: "#8B6914", colorNum: 0x8B6914, colorLabel: "Bronze", views: 2456, likes: 1023, desc: "Warm bronze anodized finish with traditional style and modern performance. Perfect for heritage and luxury builds." },
  { id: 5, name: "Silver Brushed Window", sub: "Modern Horizontal Slider", type: "window", cat: "windows", colorHex: "#9AA0A8", colorNum: 0x9AA0A8, colorLabel: "Brushed Silver", views: 3678, likes: 1534, desc: "Brushed natural silver aluminum with satin anodized finish. The industrial standard for contemporary commercial facades." },
  { id: 6, name: "Oak Interior Door", sub: "Solid Wood Panelled", type: "door", cat: "doors", colorHex: "#8B5A2B", colorNum: 0x8B5A2B, colorLabel: "Oak", views: 2789, likes: 956, desc: "Precision-crafted solid oak interior door with five-panel relief detail, hidden hinges, and stainless lever handle." },
  { id: 7, name: "Walnut Flush Door", sub: "Dark Wood Flush Series", type: "door", cat: "doors", colorHex: "#4A2E1A", colorNum: 0x4A2E1A, colorLabel: "Walnut", views: 2154, likes: 898, desc: "Rich figured-walnut flush door with book-matched veneer, concealed frame system, and matte hardware." },
  { id: 8, name: "Pearl White Door", sub: "Minimalist Flush Series", type: "door", cat: "doors", colorHex: "#F0EEE8", colorNum: 0xF0EEE8, colorLabel: "Pearl White", views: 3923, likes: 1823, desc: "Ultra-flat pearl white MDF door with seamless shadow reveal and chrome lever. The epitome of Scandinavian minimalism." },
  { id: 9, name: "Gunmetal Glass Door", sub: "Modern Frameless Pivot", type: "door", cat: "doors", colorHex: "#3A3A3A", colorNum: 0x3A3A3A, colorLabel: "Gunmetal", views: 4345, likes: 2187, desc: "Dramatic frameless pivoting door with gunmetal-trimmed tempered glass. Statement entrance for premium interiors." },
  { id: 10, name: "Oak Pantry Cabinet", sub: "Farmhouse Larder Series", type: "pantry", cat: "pantry cupboards", colorHex: "#BC9A6C", colorNum: 0xBC9A6C, colorLabel: "Natural Oak", views: 2941, likes: 1087, desc: "Handcrafted oak pantry with traditional shaker-style doors, soft-close hinges, and adjustable interior shelving." },
  { id: 11, name: "White Gloss Cabinet", sub: "Contemporary Kitchen Pantry", type: "pantry", cat: "pantry cupboards", colorHex: "#F5F5F0", colorNum: 0xF5F5F0, colorLabel: "Gloss White", views: 3187, likes: 1434, desc: "High-gloss white lacquer pantry with precision-engineered handle-less push-open doors and full-extension drawers." },
  { id: 12, name: "Matte Black Panlight", sub: "Architectural LED Panel", type: "panlight", cat: "panlights", colorHex: "#222222", colorNum: 0x222222, colorLabel: "Matte Black", views: 4876, likes: 2645, desc: "Architectural-grade matte black LED panel with 3000K warm white output, 97 CRI, glare-free diffuser." },
  { id: 13, name: "White LED Panlight", sub: "Slim Ceiling Panel Series", type: "panlight", cat: "panlights", colorHex: "#ECECEC", colorNum: 0xECECEC, colorLabel: "Pure White", views: 3156, likes: 1267, desc: "Ultra-slim 10mm white LED panel with edge-lit uniform diffusion. Perfect for offices and minimal interiors." },
  { id: 14, name: "Brass Panlight", sub: "Luxury Gold Series", type: "panlight", cat: "panlights", colorHex: "#B8962E", colorNum: 0xB8962E, colorLabel: "Polished Brass", views: 5456, likes: 2967, desc: "Hand-finished polished brass LED panel with integrated dimming. The signature lighting piece for luxury interiors." },
  { id: 15, name: "L-Shape Sofa", sub: "Urban Comfort Series", type: "sofa", cat: "all", colorHex: "#C4A882", colorNum: 0xC4A882, colorLabel: "Sand Beige", views: 6820, likes: 3347, desc: "Generously proportioned L-shape sofa with deep feather-fill cushions, solid oak legs, and premium performance fabric." },
  { id: 16, name: "Platform Bed", sub: "Queen Size Minimal", type: "bed", cat: "all", colorHex: "#6B8E9B", colorNum: 0x6B8E9B, colorLabel: "Storm Blue", views: 4950, likes: 2176, desc: "Low-profile platform bed with upholstered panel headboard, walnut plinth base, and seamless mattress integration." },
  { id: 17, name: "Open Bookshelf", sub: "Geometric Display Series", type: "bookshelf", cat: "all", colorHex: "#C19A6B", colorNum: 0xC19A6B, colorLabel: "Warm Oak", views: 3150, likes: 1645, desc: "Sculptural open bookshelf with staggered compartments, solid oak construction, and matte brass connecting pins." },
  { id: 18, name: "Writing Desk", sub: "Home Office Workstation", type: "desk", cat: "all", colorHex: "#DEB887", colorNum: 0xDEB887, colorLabel: "Light Oak", views: 3560, likes: 1867, desc: "Expansive writing desk with solid oak top, powder-coated steel legs, and integrated cable management channel." },
  { id: 19, name: "Sliding Wardrobe", sub: "Contemporary Closet System", type: "wardrobe", cat: "all", colorHex: "#8B5A2B", colorNum: 0x8B5A2B, colorLabel: "Oak Veneer", views: 5120, likes: 2987, desc: "Floor-to-ceiling sliding wardrobe with soft-close mechanism, mirrored panel options, and modular interior fittings." },
];

const CATS = ["all", "windows", "doors", "pantry cupboards", "panlights"];

function createEnvMap(renderer) {
  const pmremGen = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const colors = [
    [0.8, 0.8, 0.9], [0.5, 0.5, 0.6], [0.3, 0.35, 0.4],
    [0.9, 0.85, 0.8], [0.6, 0.6, 0.7], [0.4, 0.4, 0.5]
  ];
  const dirs = [
    [1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]
  ];
  dirs.forEach(([x,y,z], i) => {
    const light = new THREE.DirectionalLight(
      new THREE.Color(colors[i][0], colors[i][1], colors[i][2]), 2
    );
    light.position.set(x*10, y*10, z*10);
    envScene.add(light);
  });
  const envTex = pmremGen.fromScene(envScene, 0.04).texture;
  pmremGen.dispose();
  return envTex;
}

function buildAluminumWindow(scene, colorNum = 0x2C3E50) {
  const group = new THREE.Group();
  const isLight = new THREE.Color(colorNum).getHSL({}).l > 0.7;

  const alMat = new THREE.MeshStandardMaterial({
    color: colorNum,
    metalness: 0.95,
    roughness: isLight ? 0.15 : 0.12,
    envMapIntensity: 2.5,
  });

  const alMatInner = new THREE.MeshStandardMaterial({
    color: colorNum,
    metalness: 0.9,
    roughness: 0.25,
    envMapIntensity: 1.8,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88BBCC,
    metalness: 0.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.22,
    envMapIntensity: 3.0,
  });

  const glassReflMat = new THREE.MeshStandardMaterial({
    color: 0xCCDDEE,
    metalness: 0.8,
    roughness: 0.02,
    transparent: true,
    opacity: 0.12,
    side: THREE.FrontSide,
  });

  const W = 1.8, H = 1.5, D = 0.1;
  const profileW = 0.055;

  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  addBox(W, profileW, D, alMat, 0, H/2 - profileW/2, 0);
  addBox(W, profileW, D, alMat, 0, -H/2 + profileW/2, 0);
  addBox(profileW, H, D, alMat, -W/2 + profileW/2, 0, 0);
  addBox(profileW, H, D, alMat, W/2 - profileW/2, 0, 0);

  addBox(profileW*0.6, H*0.97, D*0.6, alMatInner, -W/2 + profileW*1.5, 0, D*0.22);
  addBox(profileW*0.6, H*0.97, D*0.6, alMatInner, W/2 - profileW*1.5, 0, D*0.22);
  addBox(W*0.97, profileW*0.6, D*0.6, alMatInner, 0, H/2 - profileW*1.5, D*0.22);
  addBox(W*0.97, profileW*0.6, D*0.6, alMatInner, 0, -H/2 + profileW*1.5, D*0.22);

  const glassW = W - profileW * 2 - 0.01;
  const glassH = H - profileW * 2 - 0.01;
  const glass = new THREE.Mesh(new THREE.BoxGeometry(glassW, glassH, 0.008), glassMat);
  glass.position.set(0, 0, 0.01);
  group.add(glass);

  const glassRefl = new THREE.Mesh(new THREE.PlaneGeometry(glassW * 0.6, glassH * 0.5), glassReflMat);
  glassRefl.position.set(-glassW * 0.1, glassH * 0.1, 0.016);
  glassRefl.rotation.z = 0.15;
  group.add(glassRefl);

  const mullionH = new THREE.Mesh(
    new THREE.BoxGeometry(glassW, profileW * 0.45, D * 0.55),
    alMatInner
  );
  mullionH.position.set(0, 0.08, D * 0.2);
  group.add(mullionH);

  const mullionV = new THREE.Mesh(
    new THREE.BoxGeometry(profileW * 0.45, glassH, D * 0.55),
    alMatInner
  );
  mullionV.position.set(0, 0, D * 0.2);
  group.add(mullionV);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.16, 16),
    new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.97, roughness: 0.08, envMapIntensity: 3 })
  );
  handle.rotation.z = Math.PI / 2;
  handle.position.set(W/2 - profileW - 0.05, 0.1, D * 0.65);
  group.add(handle);

  const handleBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.06, 0.025),
    new THREE.MeshStandardMaterial({ color: 0xA0A0A0, metalness: 0.9, roughness: 0.15 })
  );
  handleBase.position.set(W/2 - profileW - 0.05, 0.1, D * 0.65);
  group.add(handleBase);

  const screwGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8);
  const screwMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
  [[-0.3, H/2 - profileW/2], [0.3, H/2 - profileW/2],
   [-0.3, -H/2 + profileW/2], [0.3, -H/2 + profileW/2]].forEach(([x, y]) => {
    const s = new THREE.Mesh(screwGeo, screwMat);
    s.position.set(x, y, D/2 + 0.006);
    s.rotation.x = Math.PI/2;
    group.add(s);
  });

  group.position.set(0, H/2 + 0.1, 0);
  scene.add(group);
  return group;
}

function buildAluminumPanlight(scene, colorNum = 0x222222) {
  const group = new THREE.Group();
  const col = new THREE.Color(colorNum);
  const isLight = col.getHSL({}).l > 0.7;
  const isBrass = colorNum === 0xB8962E;

  const frameMat = new THREE.MeshStandardMaterial({
    color: colorNum,
    metalness: isBrass ? 0.85 : 0.92,
    roughness: isBrass ? 0.25 : (isLight ? 0.18 : 0.14),
    envMapIntensity: 2.8,
  });

  const diffuserMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.85,
    metalness: 0.0,
    emissive: 0xFFF8E8,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.92,
  });

  const edgeMat = new THREE.MeshStandardMaterial({
    color: colorNum,
    metalness: 0.98,
    roughness: 0.06,
    envMapIntensity: 3.5,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: isBrass ? 0xD4A840 : (isLight ? 0xDDDDDD : 0x444444),
    metalness: 0.98,
    roughness: 0.08,
    envMapIntensity: 4.0,
  });

  const PW = 1.1, PD = 1.1, frameH = 0.055, edgeW = 0.042;

  const mainFrame = new THREE.Mesh(
    new THREE.BoxGeometry(PW, frameH, PD),
    frameMat
  );
  mainFrame.position.set(0, 0, 0);
  mainFrame.castShadow = true;
  mainFrame.receiveShadow = true;
  group.add(mainFrame);

  const diffW = PW - edgeW * 2;
  const diffD = PD - edgeW * 2;
  const diffuser = new THREE.Mesh(
    new THREE.BoxGeometry(diffW, 0.012, diffD),
    diffuserMat
  );
  diffuser.position.set(0, -frameH/2 + 0.012, 0);
  group.add(diffuser);

  [[PW/2 - edgeW/2, 0, 0], [-PW/2 + edgeW/2, 0, 0]].forEach(([x,y,z]) => {
    const e = new THREE.Mesh(new THREE.BoxGeometry(edgeW, frameH + 0.004, PD), edgeMat);
    e.position.set(x,y,z);
    e.castShadow = true;
    group.add(e);
  });
  [[0, 0, PD/2 - edgeW/2], [0, 0, -PD/2 + edgeW/2]].forEach(([x,y,z]) => {
    const e = new THREE.Mesh(new THREE.BoxGeometry(PW - edgeW*2, frameH + 0.004, edgeW), edgeMat);
    e.position.set(x,y,z);
    e.castShadow = true;
    group.add(e);
  });

  const trimInner = new THREE.Mesh(
    new THREE.BoxGeometry(PW - 0.002, 0.006, PD - 0.002),
    trimMat
  );
  trimInner.position.set(0, -frameH/2 - 0.001, 0);
  group.add(trimInner);

  const cornerGeo = new THREE.CylinderGeometry(edgeW/2, edgeW/2, frameH + 0.004, 12);
  const corners = [[PW/2 - edgeW/2, 0, PD/2 - edgeW/2],[PW/2 - edgeW/2, 0, -PD/2 + edgeW/2],
                   [-PW/2 + edgeW/2, 0, PD/2 - edgeW/2],[-PW/2 + edgeW/2, 0, -PD/2 + edgeW/2]];
  corners.forEach(([x,y,z]) => {
    const c = new THREE.Mesh(cornerGeo, edgeMat);
    c.position.set(x,y,z);
    group.add(c);
  });

  for (let i = -1; i <= 1; i += 0.4) {
    const ledRow = new THREE.Mesh(
      new THREE.BoxGeometry(diffW * 0.92, 0.003, 0.018),
      new THREE.MeshStandardMaterial({ color: 0xFFFFEE, emissive: 0xFFFF99, emissiveIntensity: 2, roughness: 0.5, metalness: 0 })
    );
    ledRow.position.set(0, -frameH/2 + 0.025, i * (diffD * 0.18));
    group.add(ledRow);
  }

  const mountGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.04, 12);
  const mountMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.85, roughness: 0.2 });
  [[PW * 0.35, 0, PD * 0.35],[PW * 0.35, 0, -PD * 0.35],
   [-PW * 0.35, 0, PD * 0.35],[-PW * 0.35, 0, -PD * 0.35]].forEach(([x,y,z]) => {
    const m = new THREE.Mesh(mountGeo, mountMat);
    m.position.set(x, frameH/2 + 0.02, z);
    group.add(m);
  });

  const pointLight = new THREE.PointLight(0xFFF5E0, 0.8, 3);
  pointLight.position.set(0, -0.3, 0);
  group.add(pointLight);

  group.rotation.x = Math.PI;
  group.position.set(0, 0.82, 0);
  scene.add(group);
  return group;
}

function buildDoor(scene, colorNum = 0x8B5A2B) {
  const group = new THREE.Group();
  const col = new THREE.Color(colorNum);
  const hsl = {};
  col.getHSL(hsl);
  const isLight = hsl.l > 0.75;
  const isGlass = colorNum === 0x3A3A3A;

  const doorMat = new THREE.MeshStandardMaterial({
    color: colorNum,
    metalness: isGlass ? 0.7 : 0.05,
    roughness: isGlass ? 0.12 : 0.45,
    envMapIntensity: isGlass ? 2.0 : 0.8,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorNum).multiplyScalar(0.85),
    metalness: 0.1,
    roughness: 0.4,
  });

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xC8C8C8,
    metalness: 0.98,
    roughness: 0.06,
    envMapIntensity: 4.0,
  });

  const DW = 0.92, DH = 2.1, DD = 0.06;

  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  addBox(DW + 0.14, DH + 0.1, 0.04, frameMat, 0, DH/2, -0.02);
  addBox(DW, DH, DD, doorMat, 0, DH/2, 0.015);

  if (isGlass) {
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x90B0C0,
      metalness: 0.0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.35,
      envMapIntensity: 2.5,
    });
    const g = new THREE.Mesh(new THREE.BoxGeometry(DW * 0.78, DH * 0.72, 0.008), glassMat);
    g.position.set(0, DH/2 + DH * 0.06, 0.036);
    group.add(g);

    addBox(DW * 0.82, 0.025, DD * 0.5, doorMat, 0, DH - 0.5, 0.015);
    addBox(DW * 0.82, 0.025, DD * 0.5, doorMat, 0, 0.52, 0.015);
    addBox(0.025, DH * 0.74, DD * 0.5, doorMat, -DW * 0.4, DH/2 + DH*0.06, 0.015);
    addBox(0.025, DH * 0.74, DD * 0.5, doorMat, DW * 0.4, DH/2 + DH*0.06, 0.015);
  } else {
    const panelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorNum).multiplyScalar(isLight ? 0.95 : 1.1),
      metalness: 0.05,
      roughness: 0.55,
    });
    [[DW * 0.76, DH * 0.28, 0.02, DH/2 + DH*0.28],
     [DW * 0.76, DH * 0.28, 0.02, DH/2 - DH*0.28],
     [DW * 0.76, DH * 0.08, 0.02, DH/2]].forEach(([pw,ph,pd,py]) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), panelMat);
      p.position.set(0, py, 0.032);
      group.add(p);
    });
  }

  const handleBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.12, 16),
    handleMat
  );
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(DW/2 - 0.07, DH/2 + 0.04, 0.065);
  group.add(handleBar);

  const handleBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.1, 0.025),
    new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.9, roughness: 0.2 })
  );
  handleBack.position.set(DW/2 - 0.07, DH/2 + 0.04, 0.055);
  group.add(handleBack);

  const hingeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 12);
  const hingeMat = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.9, roughness: 0.2 });
  [DH * 0.15, DH * 0.5, DH * 0.85].forEach(y => {
    const h = new THREE.Mesh(hingeGeo, hingeMat);
    h.position.set(-DW/2 - 0.005, y, 0.02);
    h.rotation.x = Math.PI/2;
    group.add(h);
  });

  group.position.set(0, 0.02, 0);
  scene.add(group);
  return group;
}

function buildPantry(scene, colorNum = 0xBC9A6C) {
  const group = new THREE.Group();
  const isLight = new THREE.Color(colorNum).getHSL({}).l > 0.7;

  const carcassMat = new THREE.MeshStandardMaterial({ color: colorNum, roughness: 0.5, metalness: 0.05 });
  const doorMat = new THREE.MeshStandardMaterial({
    color: isLight ? new THREE.Color(colorNum).multiplyScalar(1.05) : new THREE.Color(colorNum).multiplyScalar(0.95),
    roughness: 0.25,
    metalness: 0.08,
    envMapIntensity: 0.6,
  });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xB0B0B0, metalness: 0.95, roughness: 0.08, envMapIntensity: 3 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorNum).multiplyScalar(0.9), roughness: 0.6 });

  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  addBox(1.3, 0.022, 0.6, carcassMat, 0, 1.82, 0);
  addBox(1.3, 0.022, 0.6, carcassMat, 0, 0, 0);
  addBox(0.022, 1.84, 0.6, carcassMat, -0.65, 0.91, 0);
  addBox(0.022, 1.84, 0.6, carcassMat, 0.65, 0.91, 0);
  addBox(1.3, 1.84, 0.022, carcassMat, 0, 0.91, -0.3);

  [0.38, 0.76, 1.14, 1.52].forEach(y => {
    addBox(1.22, 0.018, 0.56, shelfMat, 0, y, 0.02);
  });

  const doorW = 0.61, doorH = 1.78, doorD = 0.02;
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, doorD), doorMat);
  leftDoor.position.set(-0.325, 0.91, 0.31);
  leftDoor.castShadow = true;
  group.add(leftDoor);

  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, doorD), doorMat);
  rightDoor.position.set(0.325, 0.91, 0.31);
  rightDoor.castShadow = true;
  group.add(rightDoor);

  [[-0.03, 0.91, 0.32], [0.67, 0.91, 0.32]].forEach(([x,y,z], i) => {
    const hGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.1, 12);
    const h = new THREE.Mesh(hGeo, handleMat);
    h.position.set(i === 0 ? x : -x, y, z);
    h.rotation.z = Math.PI/2;
    group.add(h);
    const hBase = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.055, 0.016), handleMat);
    hBase.position.set(i === 0 ? x : -x, y, z - 0.01);
    group.add(hBase);
  });

  [0.38, 0.76, 1.14].forEach(y => {
    [-0.28, 0.28].forEach(x => {
      const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.025, 8), handleMat);
      peg.position.set(x, y + 0.009, -0.12);
      peg.rotation.x = Math.PI/2;
      group.add(peg);
    });
  });

  group.position.set(0, 0, 0);
  scene.add(group);
  return group;
}

function buildSofa(scene) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0xC4A882, roughness: 0.88, metalness: 0.0 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xB89A6E, roughness: 0.9, metalness: 0.0 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x8B6945, roughness: 0.35, metalness: 0.15, envMapIntensity: 1.0 });

  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  addBox(2.4, 0.22, 1.1, fabric, 0, 0.22, 0);
  addBox(2.4, 0.72, 0.22, fabric, 0, 0.61, -0.44);
  addBox(0.18, 0.6, 1.1, fabric, -1.29, 0.52, 0);
  addBox(0.18, 0.6, 1.1, fabric, 1.29, 0.52, 0);
  addBox(1.05, 0.22, 1.15, fabric, -0.67, 0.22, 1.12);
  addBox(1.05, 0.72, 0.22, fabric, -0.67, 0.61, 0.56);
  addBox(0.18, 0.6, 1.15, fabric, -1.29, 0.52, 1.12);

  const cushionGeo = new THREE.BoxGeometry(0.75, 0.15, 0.95);
  [-0.79, 0, 0.79].forEach(x => {
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

  const legGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.19, 10);
  [[1.1,-0.67],[1.1,0.48],[-1.1,-0.67],[-0.22,0.48],[-1.1,1.6],[-0.22,1.6]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.025, z);
    leg.castShadow = true;
    group.add(leg);
  });

  group.position.y = 0.1;
  scene.add(group);
  return group;
}

function buildBed(scene) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0x6B8E9B, roughness: 0.7 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.4, metalness: 0.05, envMapIntensity: 0.8 });
  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  };
  addBox(1.8,0.3,2.0,wood,0,0.15,0);
  addBox(1.7,0.2,1.9,fabric,0,0.4,0);
  addBox(1.85,0.8,0.1,wood,0,0.7,-1.05);
  scene.add(group);
  return group;
}

function buildBookshelf(scene) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xC19A6B, roughness: 0.4, envMapIntensity: 0.6 });
  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    group.add(m);
  };
  addBox(1.2,1.5,0.05,wood,0,0.75,-0.3);
  [0.2,0.5,0.8,1.1].forEach(y => addBox(1.2,0.05,0.4,wood,0,y,0));
  addBox(0.08,1.5,0.45,wood,-0.64,0.75,0);
  addBox(0.08,1.5,0.45,wood,0.64,0.75,0);
  scene.add(group);
  return group;
}

function buildDesk(scene) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.4, envMapIntensity: 0.5 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15, envMapIntensity: 2 });
  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    group.add(m);
  };
  addBox(1.4,0.05,0.8,wood,0,0.74,0);
  [[-0.6,-0.3],[0.6,-0.3],[-0.6,0.3],[0.6,0.3]].forEach(([x,z]) => {
    addBox(0.05,0.7,0.05,metal,x,0.35,z);
  });
  scene.add(group);
  return group;
}

function buildWardrobe(scene) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.3, metalness: 0.05, envMapIntensity: 0.8 });
  const door = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.2, metalness: 0.06, envMapIntensity: 1.2 });
  const handle = new THREE.MeshStandardMaterial({ color: 0xC8C8C8, metalness: 0.97, roughness: 0.08, envMapIntensity: 3 });
  const addBox = (w,h,d,mat,x,y,z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  };
  addBox(1.6,2.2,0.6,wood,0,1.1,0);
  addBox(0.78,2.0,0.05,door,-0.41,1.1,0.31);
  addBox(0.78,2.0,0.05,door,0.41,1.1,0.31);
  const hGeo = new THREE.CylinderGeometry(0.03,0.03,0.12,8);
  [-0.72,0.72].forEach(x => {
    const h = new THREE.Mesh(hGeo, handle);
    h.rotation.z = Math.PI/2;
    h.position.set(x,1.1,0.34);
    group.add(h);
  });
  scene.add(group);
  return group;
}

function buildModel(scene, item) {
  const t = item.type;
  const c = item.colorNum;
  if (t === "window") return buildAluminumWindow(scene, c);
  if (t === "panlight") return buildAluminumPanlight(scene, c);
  if (t === "door") return buildDoor(scene, c);
  if (t === "pantry") return buildPantry(scene, c);
  if (t === "sofa") return buildSofa(scene);
  if (t === "bed") return buildBed(scene);
  if (t === "bookshelf") return buildBookshelf(scene);
  if (t === "desk") return buildDesk(scene);
  if (t === "wardrobe") return buildWardrobe(scene);
  return buildSofa(scene);
}

function ThreeViewer({ item, wireframe, autoRotate, resetSignal }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth || 800;
    const H = el.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.physicallyCorrectLights = true;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141418);

    const envMap = createEnvMap(renderer);
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.05, 60);
    camera.position.set(3.2, 1.8, 3.8);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xFFFAF0, 2.8);
    key.position.set(4, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xD0E8FF, 1.0);
    fill.position.set(-5, 3, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xFFEECC, 0.6);
    rim.position.set(2, 1, -6);
    scene.add(rim);

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A1E,
      roughness: 0.8,
      metalness: 0.02,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(10, 20, 0x333338, 0x252528);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    const modelGroup = buildModel(scene, item);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { theta: 0.5, phi: 1.1, radius: 5.5 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0.9, 0);
    };
    updateCamera();

    const onMouseDown = (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevMouse.x) * 0.008;
      const dy = (e.clientY - prevMouse.y) * 0.006;
      spherical.theta -= dx;
      spherical.phi = Math.max(0.15, Math.min(Math.PI * 0.75, spherical.phi + dy));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    };
    const onWheel = (e) => {
      spherical.radius = Math.max(2, Math.min(10, spherical.radius + e.deltaY * 0.008));
      updateCamera();
    };

    let touchStart = null;
    const onTouchStart = (e) => { if (e.touches.length === 1) { isDragging = true; touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; prevMouse = touchStart; } };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = (e.touches[0].clientX - prevMouse.x) * 0.008;
      const dy = (e.touches[0].clientY - prevMouse.y) * 0.006;
      spherical.theta -= dx;
      spherical.phi = Math.max(0.15, Math.min(Math.PI * 0.75, spherical.phi + dy));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateCamera();
    };
    const onTouchEnd = () => { isDragging = false; };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    stateRef.current = { renderer, scene, camera, modelGroup, spherical, updateCamera };
    setLoading(false);

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
      if (stateRef.current.autoRotate && !isDragging) {
        spherical.theta += 0.006;
        updateCamera();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      envMap.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [item]);

  useEffect(() => {
    const { modelGroup } = stateRef.current;
    if (!modelGroup) return;
    modelGroup.traverse(c => { if (c.isMesh) { if (Array.isArray(c.material)) c.material.forEach(m => m.wireframe = wireframe); else c.material.wireframe = wireframe; } });
  }, [wireframe]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const { spherical, updateCamera } = stateRef.current;
    if (!spherical) return;
    spherical.theta = 0.5;
    spherical.phi = 1.1;
    spherical.radius = 5.5;
    updateCamera();
  }, [resetSignal]);

  return (
    <div className="three-viewer-container">
      {loading && <div className="loading-overlay"><div className="spinner" /></div>}
      <div ref={mountRef} className="three-canvas" />
    </div>
  );
}

function MiniThumb({ item }) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 340;
    const H = el.clientHeight || 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1A1A1E);

    const envMap = createEnvMap(renderer);
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.05, 60);
    camera.position.set(2.4, 1.4, 2.8);
    camera.lookAt(0, 0.9, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xFFFAF0, 2.5);
    key.position.set(4, 7, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xD0E8FF, 0.8);
    fill.position.set(-4, 2, 2);
    scene.add(fill);

    buildModel(scene, item);

    let theta = 0.5;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      theta += 0.008;
      camera.position.x = 4.0 * Math.sin(theta);
      camera.position.z = 4.0 * Math.cos(theta);
      camera.lookAt(0, 0.9, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      envMap.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [item]);

  return <div ref={mountRef} className="g-card-thumb-canvas" />;
}

function GalleryPage({ onSelect }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = ITEMS.filter(it => {
    const q = search.toLowerCase();
    return (it.name.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q)) &&
           (cat === "all" || it.cat === cat);
  });

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-eyebrow">Premium 3D Assets</div>
        <h1 className="gallery-title">Architectural <em>3D Library</em></h1>
        <p className="gallery-subtitle">Professional-grade models for architectural visualization, interior design, and virtual staging.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="cats">
          {CATS.map(c => (
            <button key={c} className={`cat-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
              {c === "all" ? "All" : c === "pantry cupboards" ? "Pantry" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {filtered.length === 0
          ? <div className="no-results">No models found</div>
          : filtered.map(item => (
            <div key={item.id} className="g-card" onClick={() => onSelect(item)}>
              <div className="g-card-thumb">
                <MiniThumb item={item} />
                <div className="g-card-badge">{item.cat === "windows" || item.cat === "panlights" ? "Aluminum" : "3D"}</div>
              </div>
              <div className="g-card-body">
                <div className="g-card-name">{item.name}</div>
                <div className="g-card-sub">{item.sub}</div>
                <div className="g-card-footer">
                  <div className="g-card-stats">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>{item.likes.toLocaleString()} likes</span>
                  </div>
                  <button className="g-card-cta">View 3D →</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function ViewerPage({ item, onBack }) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [collected, setCollected] = useState(false);
  const [shared, setShared] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const isAluminum = item.cat === "windows" || item.cat === "panlights";

  const specs = item.type === "window" ? [
    ["Dimensions", `${Math.round(1800)}×${Math.round(1500)}×100 mm`],
    ["Frame System", "Thermally Broken"],
    ["Finish", item.colorLabel],
    ["Glazing", "Dual-Pane Low-E"],
    ["Polygon Count", "~2,800 tris"],
    ["Format", "PBR Ready"],
  ] : item.type === "panlight" ? [
    ["Panel Size", "1100×1100×55 mm"],
    ["CCT", "3000K Warm White"],
    ["CRI", "> 97"],
    ["Finish", item.colorLabel],
    ["Polygon Count", "~1,400 tris"],
    ["Format", "PBR + Emissive"],
  ] : item.type === "door" ? [
    ["Dimensions", "920×2100×60 mm"],
    ["Style", "Interior / Premium"],
    ["Finish", item.colorLabel],
    ["Hardware", "Brushed Steel"],
    ["Polygon Count", "~1,800 tris"],
    ["Format", "PBR Ready"],
  ] : [
    ["Model Size", "Standard"],
    ["Style", "Contemporary"],
    ["Material", item.colorLabel],
    ["Format", "PBR Ready"],
    ["Polygon Count", "~5,000 tris"],
  ];

  const features = isAluminum ? [
    "Full PBR materials with anisotropic metalness",
    "Physically correct environment map reflections",
    "Detailed hardware components — handles, screws, hinges",
    "Multi-layer material system for frame vs. glass separation",
  ] : [
    "High-quality wood or fabric material simulation",
    "Optimized polygon topology for real-time rendering",
    "Shadow-cast ready for interior visualization",
    "Modular design suitable for AR and VR pipelines",
  ];

  return (
    <div className="viewer-page">
      <div className="viewer-topstrip">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="breadcrumb">
          <span>Library</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ textTransform: "capitalize" }}>{item.cat}</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: "var(--text2)" }}>{item.name}</span>
        </div>
      </div>

      <div className="viewer-body">
        <div className="viewer-canvas-col">
          <div className="viewer-canvas-wrap">
            <ThreeViewer item={item} wireframe={wireframe} autoRotate={autoRotate} resetSignal={resetSignal} />
          </div>
          <div className="viewer-hint">
            <div className="hint-dot" />
            Drag to orbit · Scroll to zoom
          </div>
          <div className="viewer-hud">
            <button className="hud-btn" onClick={() => setResetSignal(s => s + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset
            </button>
            <div className="hud-sep" />
            <button className={`hud-btn ${autoRotate ? "on" : ""}`} onClick={() => setAutoRotate(v => !v)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
              {autoRotate ? "Stop" : "Spin"}
            </button>
            <div className="hud-sep" />
            <button className={`hud-btn ${wireframe ? "on" : ""}`} onClick={() => setWireframe(v => !v)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="12 2 22 20 2 20"/><line x1="12" y1="2" x2="12" y2="20"/><line x1="2" y1="20" x2="22" y2="20"/><line x1="7" y1="11" x2="17" y2="11"/></svg>
              Wire
            </button>
          </div>
        </div>

        <div className="viewer-info-col">
          <div className="info-section">
            <div className="info-cat-tag">{isAluminum ? "⬡ Aluminum PBR" : "◼ 3D Model"} · {item.cat}</div>
            <h1 className="info-title">{item.name}</h1>
            <p className="info-desc">{item.desc}</p>
          </div>

          <div className="stats-row">
            <div className="stat-block">
              <div className="stat-num">{item.views.toLocaleString()}</div>
              <div className="stat-lbl">Views</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">{(collected ? item.likes + 1 : item.likes).toLocaleString()}</div>
              <div className="stat-lbl">Likes</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">PBR</div>
              <div className="stat-lbl">Render</div>
            </div>
          </div>

          <div className="specs-section">
            <div className="section-head">Specifications</div>
            {specs.map(([k, v]) => (
              <div className="spec-row" key={k}>
                <span className="spec-key">{k}</span>
                <span className="spec-val">{v}</span>
              </div>
            ))}
          </div>

          <div className="features-section">
            <div className="section-head">Features</div>
            {features.map((f, i) => (
              <div className="feat-item" key={i}>
                <div className="feat-dot" />
                {f}
              </div>
            ))}
          </div>

          <div className="actions-section">
            <button className={`act-btn-primary ${collected ? "collected" : ""}`} onClick={() => setCollected(v => !v)}>
              {collected ? "★ Collected" : "☆ Add to Collection"}
            </button>
            <button className={`act-btn-secondary ${shared ? "" : ""}`} onClick={handleShare}>
              {shared ? "✓ Link Copied!" : "↗ Share Model"}
            </button>
            <div className="library-badge">
              <div className="library-badge-dot" />
              <span>Coolhome Model Library</span>
              <span className="library-badge-count">600K+ assets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Coolhome3DView() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="coolhome-3d-view">
      <div className="app-root">
        <header className="topbar">
        </header>

        {selected
          ? <ViewerPage item={selected} onBack={() => setSelected(null)} />
          : <GalleryPage onSelect={setSelected} />
        }
      </div>
    </div>
  );
}