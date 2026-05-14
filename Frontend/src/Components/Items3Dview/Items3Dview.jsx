import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import "./Items3DView.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

function createEnvMap(renderer) {
  const pmremGen = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const colors = [
    [0.8,0.8,0.9],[0.5,0.5,0.6],[0.3,0.35,0.4],
    [0.9,0.85,0.8],[0.6,0.6,0.7],[0.4,0.4,0.5],
  ];
  const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  dirs.forEach(([x,y,z], i) => {
    const light = new THREE.DirectionalLight(new THREE.Color(colors[i][0],colors[i][1],colors[i][2]), 2);
    light.position.set(x*10,y*10,z*10);
    envScene.add(light);
  });
  const envTex = pmremGen.fromScene(envScene, 0.04).texture;
  pmremGen.dispose();
  return envTex;
}

function buildAluminumWindow(scene, colorNum = 0x2C3E50) {
  const group = new THREE.Group();
  const isLight = new THREE.Color(colorNum).getHSL({}).l > 0.7;
  const alMat = new THREE.MeshStandardMaterial({ color: colorNum, metalness: 0.95, roughness: isLight ? 0.15 : 0.12, envMapIntensity: 2.5 });
  const alMatInner = new THREE.MeshStandardMaterial({ color: colorNum, metalness: 0.9, roughness: 0.25, envMapIntensity: 1.8 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88BBCC, metalness: 0.0, roughness: 0.05, transparent: true, opacity: 0.22, envMapIntensity: 3.0 });
  const glassReflMat = new THREE.MeshStandardMaterial({ color: 0xCCDDEE, metalness: 0.8, roughness: 0.02, transparent: true, opacity: 0.12, side: THREE.FrontSide });
  const W = 1.8, H = 1.5, D = 0.1, profileW = 0.055;
  const addBox = (w,h,d,mat,x,y,z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; group.add(m); return m; };
  addBox(W,profileW,D,alMat,0,H/2-profileW/2,0); addBox(W,profileW,D,alMat,0,-H/2+profileW/2,0);
  addBox(profileW,H,D,alMat,-W/2+profileW/2,0,0); addBox(profileW,H,D,alMat,W/2-profileW/2,0,0);
  addBox(profileW*0.6,H*0.97,D*0.6,alMatInner,-W/2+profileW*1.5,0,D*0.22); addBox(profileW*0.6,H*0.97,D*0.6,alMatInner,W/2-profileW*1.5,0,D*0.22);
  addBox(W*0.97,profileW*0.6,D*0.6,alMatInner,0,H/2-profileW*1.5,D*0.22); addBox(W*0.97,profileW*0.6,D*0.6,alMatInner,0,-H/2+profileW*1.5,D*0.22);
  const glassW = W-profileW*2-0.01, glassH = H-profileW*2-0.01;
  const glass = new THREE.Mesh(new THREE.BoxGeometry(glassW,glassH,0.008),glassMat); glass.position.set(0,0,0.01); group.add(glass);
  const glassRefl = new THREE.Mesh(new THREE.PlaneGeometry(glassW*0.6,glassH*0.5),glassReflMat); glassRefl.position.set(-glassW*0.1,glassH*0.1,0.016); glassRefl.rotation.z=0.15; group.add(glassRefl);
  const mullionH = new THREE.Mesh(new THREE.BoxGeometry(glassW,profileW*0.45,D*0.55),alMatInner); mullionH.position.set(0,0.08,D*0.2); group.add(mullionH);
  const mullionV = new THREE.Mesh(new THREE.BoxGeometry(profileW*0.45,glassH,D*0.55),alMatInner); mullionV.position.set(0,0,D*0.2); group.add(mullionV);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.16,16),new THREE.MeshStandardMaterial({color:0xC0C0C0,metalness:0.97,roughness:0.08,envMapIntensity:3}));
  handle.rotation.z=Math.PI/2; handle.position.set(W/2-profileW-0.05,0.1,D*0.65); group.add(handle);
  const handleBase = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.06,0.025),new THREE.MeshStandardMaterial({color:0xA0A0A0,metalness:0.9,roughness:0.15}));
  handleBase.position.set(W/2-profileW-0.05,0.1,D*0.65); group.add(handleBase);
  const screwGeo = new THREE.CylinderGeometry(0.008,0.008,0.01,8);
  const screwMat = new THREE.MeshStandardMaterial({color:0x888888,metalness:0.9,roughness:0.2});
  [[-0.3,H/2-profileW/2],[0.3,H/2-profileW/2],[-0.3,-H/2+profileW/2],[0.3,-H/2+profileW/2]].forEach(([x,y]) => {
    const s=new THREE.Mesh(screwGeo,screwMat); s.position.set(x,y,D/2+0.006); s.rotation.x=Math.PI/2; group.add(s);
  });
  group.position.set(0,H/2+0.1,0); scene.add(group); return group;
}

function buildAluminumPanlight(scene, colorNum = 0x222222) {
  const group = new THREE.Group();
  const col = new THREE.Color(colorNum); const isLight = col.getHSL({}).l > 0.7; const isBrass = colorNum === 0xB8962E;
  const frameMat = new THREE.MeshStandardMaterial({ color: colorNum, metalness: isBrass?0.85:0.92, roughness: isBrass?0.25:(isLight?0.18:0.14), envMapIntensity: 2.8 });
  const diffuserMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.85, metalness: 0.0, emissive: 0xFFF8E8, emissiveIntensity: 1.2, transparent: true, opacity: 0.92 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: colorNum, metalness: 0.98, roughness: 0.06, envMapIntensity: 3.5 });
  const trimMat = new THREE.MeshStandardMaterial({ color: isBrass?0xD4A840:(isLight?0xDDDDDD:0x444444), metalness: 0.98, roughness: 0.08, envMapIntensity: 4.0 });
  const PW=1.1, PD=1.1, frameH=0.055, edgeW=0.042;
  const mainFrame = new THREE.Mesh(new THREE.BoxGeometry(PW,frameH,PD),frameMat); mainFrame.castShadow=true; mainFrame.receiveShadow=true; group.add(mainFrame);
  const diffW=PW-edgeW*2, diffD=PD-edgeW*2;
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(diffW,0.012,diffD),diffuserMat); diffuser.position.set(0,-frameH/2+0.012,0); group.add(diffuser);
  [[PW/2-edgeW/2,0,0],[-PW/2+edgeW/2,0,0]].forEach(([x,y,z]) => { const e=new THREE.Mesh(new THREE.BoxGeometry(edgeW,frameH+0.004,PD),edgeMat); e.position.set(x,y,z); e.castShadow=true; group.add(e); });
  [[0,0,PD/2-edgeW/2],[0,0,-PD/2+edgeW/2]].forEach(([x,y,z]) => { const e=new THREE.Mesh(new THREE.BoxGeometry(PW-edgeW*2,frameH+0.004,edgeW),edgeMat); e.position.set(x,y,z); e.castShadow=true; group.add(e); });
  const trimInner=new THREE.Mesh(new THREE.BoxGeometry(PW-0.002,0.006,PD-0.002),trimMat); trimInner.position.set(0,-frameH/2-0.001,0); group.add(trimInner);
  const cornerGeo=new THREE.CylinderGeometry(edgeW/2,edgeW/2,frameH+0.004,12);
  [[PW/2-edgeW/2,0,PD/2-edgeW/2],[PW/2-edgeW/2,0,-PD/2+edgeW/2],[-PW/2+edgeW/2,0,PD/2-edgeW/2],[-PW/2+edgeW/2,0,-PD/2+edgeW/2]].forEach(([x,y,z]) => { const c=new THREE.Mesh(cornerGeo,edgeMat); c.position.set(x,y,z); group.add(c); });
  for(let i=-1;i<=1;i+=0.4){ const ledRow=new THREE.Mesh(new THREE.BoxGeometry(diffW*0.92,0.003,0.018),new THREE.MeshStandardMaterial({color:0xFFFFEE,emissive:0xFFFF99,emissiveIntensity:2,roughness:0.5,metalness:0})); ledRow.position.set(0,-frameH/2+0.025,i*(diffD*0.18)); group.add(ledRow); }
  const mountGeo=new THREE.CylinderGeometry(0.018,0.018,0.04,12); const mountMat=new THREE.MeshStandardMaterial({color:0x888888,metalness:0.85,roughness:0.2});
  [[PW*0.35,0,PD*0.35],[PW*0.35,0,-PD*0.35],[-PW*0.35,0,PD*0.35],[-PW*0.35,0,-PD*0.35]].forEach(([x,y,z]) => { const m=new THREE.Mesh(mountGeo,mountMat); m.position.set(x,frameH/2+0.02,z); group.add(m); });
  const pointLight=new THREE.PointLight(0xFFF5E0,0.8,3); pointLight.position.set(0,-0.3,0); group.add(pointLight);
  group.rotation.x=Math.PI; group.position.set(0,0.82,0); scene.add(group); return group;
}

function buildDoor(scene, colorNum = 0x8B5A2B) {
  const group = new THREE.Group();
  const col = new THREE.Color(colorNum); const hsl={}; col.getHSL(hsl);
  const isLight=hsl.l>0.75; const isGlass=colorNum===0x3A3A3A;
  const doorMat=new THREE.MeshStandardMaterial({ color:colorNum, metalness:isGlass?0.7:0.05, roughness:isGlass?0.12:0.45, envMapIntensity:isGlass?2.0:0.8 });
  const frameMat=new THREE.MeshStandardMaterial({ color:new THREE.Color(colorNum).multiplyScalar(0.85), metalness:0.1, roughness:0.4 });
  const handleMat=new THREE.MeshStandardMaterial({ color:0xC8C8C8, metalness:0.98, roughness:0.06, envMapIntensity:4.0 });
  const DW=0.92, DH=2.1, DD=0.06;
  const addBox=(w,h,d,mat,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; group.add(m); return m; };
  addBox(DW+0.14,DH+0.1,0.04,frameMat,0,DH/2,-0.02); addBox(DW,DH,DD,doorMat,0,DH/2,0.015);
  if(isGlass){ const glassMat=new THREE.MeshStandardMaterial({color:0x90B0C0,metalness:0.0,roughness:0.05,transparent:true,opacity:0.35,envMapIntensity:2.5}); const g=new THREE.Mesh(new THREE.BoxGeometry(DW*0.78,DH*0.72,0.008),glassMat); g.position.set(0,DH/2+DH*0.06,0.036); group.add(g); addBox(DW*0.82,0.025,DD*0.5,doorMat,0,DH-0.5,0.015); addBox(DW*0.82,0.025,DD*0.5,doorMat,0,0.52,0.015); addBox(0.025,DH*0.74,DD*0.5,doorMat,-DW*0.4,DH/2+DH*0.06,0.015); addBox(0.025,DH*0.74,DD*0.5,doorMat,DW*0.4,DH/2+DH*0.06,0.015); }
  else{ const panelMat=new THREE.MeshStandardMaterial({color:new THREE.Color(colorNum).multiplyScalar(isLight?0.95:1.1),metalness:0.05,roughness:0.55}); [[DW*0.76,DH*0.28,0.02,DH/2+DH*0.28],[DW*0.76,DH*0.28,0.02,DH/2-DH*0.28],[DW*0.76,DH*0.08,0.02,DH/2]].forEach(([pw,ph,pd,py])=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(pw,ph,pd),panelMat); p.position.set(0,py,0.032); group.add(p); }); }
  const handleBar=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.014,0.12,16),handleMat); handleBar.rotation.z=Math.PI/2; handleBar.position.set(DW/2-0.07,DH/2+0.04,0.065); group.add(handleBar);
  const handleBack=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.1,0.025),new THREE.MeshStandardMaterial({color:0xAAAAAA,metalness:0.9,roughness:0.2})); handleBack.position.set(DW/2-0.07,DH/2+0.04,0.055); group.add(handleBack);
  const hingeGeo=new THREE.CylinderGeometry(0.02,0.02,0.06,12); const hingeMat=new THREE.MeshStandardMaterial({color:0xAAAAAA,metalness:0.9,roughness:0.2});
  [DH*0.15,DH*0.5,DH*0.85].forEach(y=>{ const h=new THREE.Mesh(hingeGeo,hingeMat); h.position.set(-DW/2-0.005,y,0.02); h.rotation.x=Math.PI/2; group.add(h); });
  group.position.set(0,0.02,0); scene.add(group); return group;
}

function buildPantry(scene, colorNum = 0xBC9A6C) {
  const group = new THREE.Group();
  const isLight = new THREE.Color(colorNum).getHSL({}).l > 0.7;
  const carcassMat = new THREE.MeshStandardMaterial({ color: colorNum, roughness: 0.5, metalness: 0.05 });
  const doorMat = new THREE.MeshStandardMaterial({ color: isLight ? new THREE.Color(colorNum).multiplyScalar(1.05) : new THREE.Color(colorNum).multiplyScalar(0.95), roughness: 0.25, metalness: 0.08, envMapIntensity: 0.6 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xB0B0B0, metalness: 0.95, roughness: 0.08, envMapIntensity: 3 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorNum).multiplyScalar(0.9), roughness: 0.6 });
  const addBox=(w,h,d,mat,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; group.add(m); return m; };
  addBox(1.3,0.022,0.6,carcassMat,0,1.82,0); addBox(1.3,0.022,0.6,carcassMat,0,0,0);
  addBox(0.022,1.84,0.6,carcassMat,-0.65,0.91,0); addBox(0.022,1.84,0.6,carcassMat,0.65,0.91,0);
  addBox(1.3,1.84,0.022,carcassMat,0,0.91,-0.3);
  [0.38,0.76,1.14,1.52].forEach(y=>addBox(1.22,0.018,0.56,shelfMat,0,y,0.02));
  const doorW=0.61,doorH=1.78,doorD=0.02;
  const leftDoor=new THREE.Mesh(new THREE.BoxGeometry(doorW,doorH,doorD),doorMat); leftDoor.position.set(-0.325,0.91,0.31); leftDoor.castShadow=true; group.add(leftDoor);
  const rightDoor=new THREE.Mesh(new THREE.BoxGeometry(doorW,doorH,doorD),doorMat); rightDoor.position.set(0.325,0.91,0.31); rightDoor.castShadow=true; group.add(rightDoor);
  [[-0.03,0.91,0.32],[0.67,0.91,0.32]].forEach(([x,y,z],i)=>{ const hGeo=new THREE.CylinderGeometry(0.012,0.012,0.1,12); const h=new THREE.Mesh(hGeo,handleMat); h.position.set(i===0?x:-x,y,z); h.rotation.z=Math.PI/2; group.add(h); const hBase=new THREE.Mesh(new THREE.BoxGeometry(0.028,0.055,0.016),handleMat); hBase.position.set(i===0?x:-x,y,z-0.01); group.add(hBase); });
  group.position.set(0,0,0); scene.add(group); return group;
}

function buildSofa(scene) {
  const group = new THREE.Group();
  const fabric=new THREE.MeshStandardMaterial({color:0xC4A882,roughness:0.88,metalness:0.0});
  const cushionMat=new THREE.MeshStandardMaterial({color:0xB89A6E,roughness:0.9,metalness:0.0});
  const legMat=new THREE.MeshStandardMaterial({color:0x8B6945,roughness:0.35,metalness:0.15,envMapIntensity:1.0});
  const addBox=(w,h,d,mat,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; group.add(m); return m; };
  addBox(2.4,0.22,1.1,fabric,0,0.22,0); addBox(2.4,0.72,0.22,fabric,0,0.61,-0.44);
  addBox(0.18,0.6,1.1,fabric,-1.29,0.52,0); addBox(0.18,0.6,1.1,fabric,1.29,0.52,0);
  addBox(1.05,0.22,1.15,fabric,-0.67,0.22,1.12); addBox(1.05,0.72,0.22,fabric,-0.67,0.61,0.56);
  addBox(0.18,0.6,1.15,fabric,-1.29,0.52,1.12);
  const cushionGeo=new THREE.BoxGeometry(0.75,0.15,0.95);
  [-0.79,0,0.79].forEach(x=>{ const c=new THREE.Mesh(cushionGeo,cushionMat); c.position.set(x,0.375,0.02); c.castShadow=true; group.add(c); });
  const legGeo=new THREE.CylinderGeometry(0.04,0.032,0.19,10);
  [[1.1,-0.67],[1.1,0.48],[-1.1,-0.67],[-0.22,0.48],[-1.1,1.6],[-0.22,1.6]].forEach(([x,z])=>{ const leg=new THREE.Mesh(legGeo,legMat); leg.position.set(x,0.025,z); leg.castShadow=true; group.add(leg); });
  group.position.y=0.1; scene.add(group); return group;
}

function buildGenericModel(scene, colorNum = 0xC4A882) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: colorNum, roughness: 0.4, metalness: 0.1 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.8), mat);
  body.position.set(0, 0.6, 0); body.castShadow = true; group.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.8), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorNum).multiplyScalar(0.9), roughness: 0.3 }));
  top.position.set(0, 1.08, 0); top.castShadow = true; group.add(top);
  scene.add(group); return group;
}

function buildProceduralModel(scene, item) {
  const t = item.type;
  const c = item.colorNum || parseInt((item.colorHex || '#888888').replace('#',''), 16);
  if (t === "window" || t === "sliding" || t === "casement" || t === "fixed" || t === "awning" || t === "louvre")
    return buildAluminumWindow(scene, c);
  if (t === "panlight" || t === "recessed" || t === "surface")
    return buildAluminumPanlight(scene, c);
  if (t === "door" || t === "panel" || t === "flush" || t === "pivot" || t === "bi-fold")
    return buildDoor(scene, c);
  if (t === "pantry" || t === "larder" || t === "kitchen")
    return buildPantry(scene, c);
  if (t === "sofa") return buildSofa(scene);
  return buildGenericModel(scene, c);
}

function ThreeViewer({ item, wireframe, autoRotate, resetSignal }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth || 800, H = el.clientHeight || 600;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8);
    const envMap = createEnvMap(renderer);
    scene.environment = envMap;
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.05, 60);
    camera.position.set(3.2, 1.8, 3.8);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xFFFAF0, 2.8); key.position.set(4, 7, 4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; scene.add(key);
    const fill = new THREE.DirectionalLight(0xD0E8FF, 1.0); fill.position.set(-5, 3, 2); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xFFEECC, 0.6); rim.position.set(2, 1, -6); scene.add(rim);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xEEF2F7, roughness: 0.8, metalness: 0.01 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const gridHelper = new THREE.GridHelper(10, 20, 0xCDD5E0, 0xDDE3ED); gridHelper.position.y = 0.001; scene.add(gridHelper);

    let currentModel = null;

    const loadModel = async () => {
      setLoading(true);
      if (item.modelUrl) {
        const modelPath = `${API_BASE.replace('/api', '')}${item.modelUrl}`;
        try {
          const loader = new GLTFLoader();
          const gltf = await new Promise((resolve, reject) => {
            loader.load(modelPath, resolve, undefined, reject);
          });
          currentModel = gltf.scene;
          currentModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          const box = new THREE.Box3().setFromObject(currentModel);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;
          currentModel.scale.setScalar(scale);
          currentModel.position.set(-center.x * scale, -center.y * scale + 0.5, -center.z * scale);
          scene.add(currentModel);
          setUsingFallback(false);
        } catch (err) {
          currentModel = buildProceduralModel(scene, item);
          setUsingFallback(true);
        }
      } else {
        currentModel = buildProceduralModel(scene, item);
        setUsingFallback(true);
      }
      setLoading(false);
    };

    loadModel();

    let isDragging = false, prevMouse = { x: 0, y: 0 };
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
    const onMouseMove = (e) => { if (!isDragging) return; const dx=(e.clientX-prevMouse.x)*0.008, dy=(e.clientY-prevMouse.y)*0.006; spherical.theta -= dx; spherical.phi = Math.max(0.15, Math.min(Math.PI*0.75, spherical.phi+dy)); prevMouse={x:e.clientX,y:e.clientY}; updateCamera(); };
    const onWheel = (e) => { spherical.radius = Math.max(2, Math.min(10, spherical.radius+e.deltaY*0.008)); updateCamera(); };
    const onTouchStart=(e)=>{ if(e.touches.length===1){isDragging=true; prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY};} };
    const onTouchMove=(e)=>{ if(!isDragging||e.touches.length!==1)return; const dx=(e.touches[0].clientX-prevMouse.x)*0.008, dy=(e.touches[0].clientY-prevMouse.y)*0.006; spherical.theta-=dx; spherical.phi=Math.max(0.15,Math.min(Math.PI*0.75,spherical.phi+dy)); prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY}; updateCamera(); };
    const onTouchEnd=()=>{isDragging=false;};
    renderer.domElement.addEventListener("mousedown",onMouseDown); window.addEventListener("mouseup",onMouseUp); window.addEventListener("mousemove",onMouseMove); renderer.domElement.addEventListener("wheel",onWheel,{passive:true}); renderer.domElement.addEventListener("touchstart",onTouchStart,{passive:true}); renderer.domElement.addEventListener("touchmove",onTouchMove,{passive:true}); renderer.domElement.addEventListener("touchend",onTouchEnd);
    stateRef.current = { renderer, scene, camera, spherical, updateCamera };
    const onResize = () => { const w2=el.clientWidth, h2=el.clientHeight; camera.aspect=w2/h2; camera.updateProjectionMatrix(); renderer.setSize(w2,h2); };
    window.addEventListener("resize", onResize);
    let raf;
    const animate = () => { raf=requestAnimationFrame(animate); if(stateRef.current.autoRotate&&!isDragging){spherical.theta+=0.006;updateCamera();} renderer.render(scene,camera); };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",onResize); window.removeEventListener("mouseup",onMouseUp); window.removeEventListener("mousemove",onMouseMove); renderer.dispose(); envMap.dispose(); if(el.contains(renderer.domElement))el.removeChild(renderer.domElement); };
  }, [item]);

  useEffect(() => { const { modelGroup } = stateRef.current; if(!modelGroup)return; modelGroup.traverse(c=>{if(c.isMesh){if(Array.isArray(c.material))c.material.forEach(m=>m.wireframe=wireframe);else c.material.wireframe=wireframe;}}); }, [wireframe]);
  useEffect(() => { stateRef.current.autoRotate = autoRotate; }, [autoRotate]);
  useEffect(() => { const { spherical, updateCamera } = stateRef.current; if(!spherical)return; spherical.theta=0.5;spherical.phi=1.1;spherical.radius=5.5; updateCamera(); }, [resetSignal]);

  return (
    <div className="three-viewer-container">
      {loading && <div className="loading-overlay"><div className="spinner" /></div>}
      {!loading && usingFallback && (
        <div style={{
          position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,0,0,0.1)', borderRadius: 20,
          padding: '6px 16px', fontSize: 11, fontFamily: 'DM Mono, monospace',
          color: '#92400e', zIndex: 20, whiteSpace: 'nowrap',
        }}>
          ⚠ No 3D file uploaded — showing preview
        </div>
      )}
      <div ref={mountRef} className="three-canvas" />
    </div>
  );
}

function MiniThumb({ item }) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth || 340, H = el.clientHeight || 220;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false; renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement); renderer.domElement.style.width="100%"; renderer.domElement.style.height="100%";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEEF2F7);
    const envMap = createEnvMap(renderer); scene.environment = envMap;
    const camera = new THREE.PerspectiveCamera(38, W/H, 0.05, 60);
    camera.position.set(2.4, 1.4, 2.8); camera.lookAt(0, 0.9, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key=new THREE.DirectionalLight(0xFFFAF0,2.5); key.position.set(4,7,4); scene.add(key);
    const fill=new THREE.DirectionalLight(0xD0E8FF,0.8); fill.position.set(-4,2,2); scene.add(fill);
    buildProceduralModel(scene, item);
    let theta = 0.5;
    const animate = () => { rafRef.current=requestAnimationFrame(animate); theta+=0.008; camera.position.x=4.0*Math.sin(theta); camera.position.z=4.0*Math.cos(theta); camera.lookAt(0,0.9,0); renderer.render(scene,camera); };
    animate();
    return () => { cancelAnimationFrame(rafRef.current); renderer.dispose(); envMap.dispose(); if(el.contains(renderer.domElement))el.removeChild(renderer.domElement); };
  }, [item]);
  return <div ref={mountRef} className="g-card-thumb-canvas" />;
}

function GalleryPage({ onSelect, items, loading, error, onRefresh }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const cats = ["all", ...new Set(items.map(i => i.cat))];

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    return (it.name.toLowerCase().includes(q) || (it.sub||"").toLowerCase().includes(q)) &&
           (cat === "all" || it.cat === cat);
  });

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-eyebrow">Interactive 3D Library</div>
        <h1 className="gallery-title">Architectural <em>360° Models</em></h1>
        <p className="gallery-subtitle">Explore professional-grade 3D models. Drag to orbit, scroll to zoom, tap to inspect every detail.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="cats">
          {cats.map(c => (
            <button key={c} className={`cat-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="gallery-state">
          <div className="gallery-spinner" />
          <p>Loading 3D models...</p>
        </div>
      ) : error ? (
        <div className="gallery-state gallery-state--error">
          <div className="gallery-state-icon">⚠</div>
          <p>Could not load models from the server.</p>
          <button className="gallery-retry-btn" onClick={onRefresh}>Retry</button>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.length === 0
            ? <div className="no-results">No models found</div>
            : filtered.map(item => (
              <div key={item._id || item.id} className="g-card" onClick={() => onSelect(item)}>
                <div className="g-card-thumb">
                  {item.thumbnailUrl
                    ? <img src={`${API_BASE.replace('/api','')}${item.thumbnailUrl}`} alt={item.name} className="g-card-thumb-img" />
                    : <MiniThumb item={item} />
                  }
                  <div className="g-card-badge">{item.cat === "windows" || item.cat === "panlights" ? "Aluminum" : "3D"}</div>
                </div>
                <div className="g-card-body">
                  <div className="g-card-name">{item.name}</div>
                  <div className="g-card-sub">{item.sub}</div>
                  <div className="g-card-color-row">
                    {item.colorHex && <span className="g-card-color-dot" style={{ background: item.colorHex }} />}
                    <span className="g-card-color-lbl">{item.colorLabel || item.cat}</span>
                  </div>
                  <div className="g-card-footer">
                    <div className="g-card-stats">
                      <span>{(item.views || 0).toLocaleString()} views</span>
                      <span>{(item.likes || 0).toLocaleString()} likes</span>
                    </div>
                    <button className="g-card-cta">View 3D →</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function ViewerPage({ item, onBack }) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [collected, setCollected] = useState(false);
  const [shared, setShared] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const handleShare = () => { navigator.clipboard?.writeText(window.location.href).catch(() => {}); setShared(true); setTimeout(() => setShared(false), 2000); };

  const isAluminum = item.cat === "windows" || item.cat === "panlights";

  const specs = [
    item.dimensions && ["Dimensions", item.dimensions],
    item.material && ["Frame / Material", item.material],
    item.finish && ["Finish", item.finish],
    item.colorLabel && ["Color", item.colorLabel],
    item.polygonCount && ["Polygon Count", item.polygonCount],
    item.modelFormat && ["Format", item.modelFormat],
  ].filter(Boolean);

  const features = item.features
    ? (Array.isArray(item.features) ? item.features : item.features.split('\n').filter(Boolean))
    : ["Full PBR materials", "Physically correct rendering", "Detailed components"];

  return (
    <div className="viewer-page">
      <div className="viewer-topstrip">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="breadcrumb">
          <span>Library</span><span className="breadcrumb-sep">/</span>
          <span style={{ textTransform: "capitalize" }}>{item.cat}</span><span className="breadcrumb-sep">/</span>
          <span style={{ color: "var(--accent)" }}>{item.name}</span>
        </div>
      </div>

      <div className="viewer-body">
        <div className="viewer-canvas-col">
          <div className="viewer-canvas-wrap">
            <ThreeViewer item={item} wireframe={wireframe} autoRotate={autoRotate} resetSignal={resetSignal} />
          </div>
          <div className="viewer-hint"><div className="hint-dot" />Drag to orbit · Scroll to zoom</div>
          <div className="viewer-hud">
            <button className="hud-btn" onClick={() => setResetSignal(s => s+1)}>
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
            <div className="info-cat-tag">⬡ {isAluminum ? "Aluminum PBR" : "3D Model"} · {item.cat}</div>
            <h1 className="info-title">{item.name}</h1>
            {item.sub && <p className="info-series">{item.sub}</p>}
            <p className="info-desc">{item.desc}</p>
          </div>

          <div className="stats-row">
            <div className="stat-block"><div className="stat-num">{(item.views||0).toLocaleString()}</div><div className="stat-lbl">Views</div></div>
            <div className="stat-block"><div className="stat-num">{(collected ? (item.likes||0)+1 : (item.likes||0)).toLocaleString()}</div><div className="stat-lbl">Likes</div></div>
            <div className="stat-block"><div className="stat-num">PBR</div><div className="stat-lbl">Render</div></div>
          </div>

          {specs.length > 0 && (
            <div className="specs-section">
              <div className="section-head">Specifications</div>
              {specs.map(([k, v]) => (
                <div className="spec-row" key={k}><span className="spec-key">{k}</span><span className="spec-val">{v}</span></div>
              ))}
            </div>
          )}

          <div className="features-section">
            <div className="section-head">Features</div>
            {features.map((f, i) => (
              <div className="feat-item" key={i}><div className="feat-dot" />{f}</div>
            ))}
          </div>

          <div className="actions-section">
            <button className={`act-btn-primary ${collected ? "collected" : ""}`} onClick={() => setCollected(v => !v)}>
              {collected ? "★ Collected" : "☆ Add to Collection"}
            </button>
            <button className="act-btn-secondary" onClick={handleShare}>
              {shared ? "✓ Link Copied!" : "↗ Share Model"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Coolhome3DView() {
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch(`${API_BASE}/3d-items`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setItems(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSelect = async (item) => {
    try { await fetch(`${API_BASE}/3d-items/${item._id}/view`, { method: 'POST' }); } catch {}
    setSelected(item);
  };

  return (
    <div className="coolhome-3d-view">
      <div className="app-root">
        <header className="topbar" />
        {selected
          ? <ViewerPage item={selected} onBack={() => setSelected(null)} />
          : <GalleryPage
              onSelect={handleSelect}
              items={items}
              loading={loading}
              error={error}
              onRefresh={fetchItems}
            />
        }
      </div>
    </div>
  );
}