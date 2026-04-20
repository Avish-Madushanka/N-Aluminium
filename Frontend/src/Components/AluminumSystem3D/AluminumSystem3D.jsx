// AluminumSystem3D.jsx
import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import './AluminumSystem3D.css';

const ModernAluminumWindow = ({ width, height, depth, color, metalness, roughness, imageTexture, showTexture, isOpen, openAngle, selectedTab }) => {
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  let texture = null;
  try {
    if (imageTexture && showTexture) {
      texture = useTexture(imageTexture);
    }
  } catch (error) {
    texture = null;
  }
  
  const frameColors = {
    'dark-gray': '#2a2a2e',
    'black': '#1a1a1a',
    'white': '#f5f5f5',
    'silver': '#c0c0c0',
    'bronze': '#cd7f32'
  };
  
  const materialColor = frameColors[color] || frameColors['dark-gray'];
  
  const frameThickness = 0.08;
  const glassThickness = 0.01;
  const frameWidth = width;
  const frameHeight = height;
  
  const openRotation = isOpen ? openAngle : 0;
  
  const glassWidth = frameWidth - frameThickness * 2;
  const glassHeight = frameHeight - frameThickness * 2;
  
  return (
    <group>
      <group rotation={[0, openRotation, 0]} position={[0, 0, 0]}>
        <mesh
          ref={frameRef}
          position={[0, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[frameWidth, frameHeight, depth]} />
          {(showTexture && texture) ? (
            <meshStandardMaterial map={texture} metalness={metalness} roughness={roughness} />
          ) : (
            <meshStandardMaterial 
              color={materialColor} 
              metalness={metalness} 
              roughness={roughness}
              emissive={hovered ? '#333333' : '#000000'}
              emissiveIntensity={hovered ? 0.15 : 0}
            />
          )}
        </mesh>
        
        <mesh position={[0, 0, depth / 2 + 0.002]} castShadow>
          <boxGeometry args={[glassWidth, glassHeight, glassThickness]} />
          <meshStandardMaterial 
            color="#a8d8ea" 
            metalness={0.95} 
            roughness={0.08} 
            transparent 
            opacity={0.75}
            emissive="#4488aa"
            emissiveIntensity={0.05}
          />
        </mesh>
        
        <mesh position={[frameWidth / 2 - frameThickness / 2, 0, depth / 2 + 0.005]}>
          <boxGeometry args={[frameThickness - 0.02, frameHeight - 0.06, 0.008]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[-frameWidth / 2 + frameThickness / 2, 0, depth / 2 + 0.005]}>
          <boxGeometry args={[frameThickness - 0.02, frameHeight - 0.06, 0.008]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[0, frameHeight / 2 - frameThickness / 2, depth / 2 + 0.005]}>
          <boxGeometry args={[frameWidth - 0.06, frameThickness - 0.02, 0.008]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[0, -frameHeight / 2 + frameThickness / 2, depth / 2 + 0.005]}>
          <boxGeometry args={[frameWidth - 0.06, frameThickness - 0.02, 0.008]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[frameWidth / 2 - 0.09, 0, depth / 2 + 0.008]}>
          <boxGeometry args={[0.012, frameHeight - 0.12, 0.006]} />
          <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
        </mesh>
        
        <mesh position={[-frameWidth / 2 + 0.09, 0, depth / 2 + 0.008]}>
          <boxGeometry args={[0.012, frameHeight - 0.12, 0.006]} />
          <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
        </mesh>
        
        <mesh position={[0, frameHeight / 2 - 0.08, depth / 2 + 0.008]}>
          <boxGeometry args={[frameWidth - 0.16, 0.012, 0.006]} />
          <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
        </mesh>
        
        <mesh position={[0, -frameHeight / 2 + 0.08, depth / 2 + 0.008]}>
          <boxGeometry args={[frameWidth - 0.16, 0.012, 0.006]} />
          <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
        </mesh>
        
        <mesh position={[frameWidth / 2 - 0.12, frameHeight / 2 - 0.18, depth / 2 + 0.01]}>
          <boxGeometry args={[0.02, 0.05, 0.004]} />
          <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

const ModernAluminumDoor = ({ width, height, depth, color, metalness, roughness, imageTexture, showTexture, isOpen, openAngle, selectedTab }) => {
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  let texture = null;
  try {
    if (imageTexture && showTexture) {
      texture = useTexture(imageTexture);
    }
  } catch (error) {
    texture = null;
  }
  
  const frameColors = {
    'dark-gray': '#2a2a2e',
    'black': '#1a1a1a',
    'white': '#f5f5f5',
    'silver': '#c0c0c0',
    'bronze': '#cd7f32'
  };
  
  const materialColor = frameColors[color] || frameColors['dark-gray'];
  
  const frameThickness = 0.1;
  const panelThickness = 0.02;
  const frameWidth = width;
  const frameHeight = height;
  
  const openRotation = isOpen ? openAngle : 0;
  
  const panelWidth = frameWidth - frameThickness * 2;
  const panelHeight = frameHeight - frameThickness * 2 - 0.15;
  
  return (
    <group>
      <group rotation={[0, openRotation, 0]} position={[0, 0, 0]}>
        <mesh
          ref={frameRef}
          position={[0, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[frameWidth, frameHeight, depth]} />
          {(showTexture && texture) ? (
            <meshStandardMaterial map={texture} metalness={metalness} roughness={roughness} />
          ) : (
            <meshStandardMaterial 
              color={materialColor} 
              metalness={metalness} 
              roughness={roughness}
              emissive={hovered ? '#333333' : '#000000'}
              emissiveIntensity={hovered ? 0.15 : 0}
            />
          )}
        </mesh>
        
        <mesh position={[0, 0.05, depth / 2 + 0.003]} castShadow>
          <boxGeometry args={[panelWidth, panelHeight, panelThickness]} />
          <meshStandardMaterial 
            color="#c8e8f0" 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.7}
            emissive="#5599aa"
            emissiveIntensity={0.03}
          />
        </mesh>
        
        <mesh position={[frameWidth / 2 - frameThickness / 2, 0, depth / 2 + 0.006]}>
          <boxGeometry args={[frameThickness - 0.02, frameHeight - 0.08, 0.01]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[-frameWidth / 2 + frameThickness / 2, 0, depth / 2 + 0.006]}>
          <boxGeometry args={[frameThickness - 0.02, frameHeight - 0.08, 0.01]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[0, frameHeight / 2 - frameThickness / 2, depth / 2 + 0.006]}>
          <boxGeometry args={[frameWidth - 0.08, frameThickness - 0.02, 0.01]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[0, -frameHeight / 2 + frameThickness / 2, depth / 2 + 0.006]}>
          <boxGeometry args={[frameWidth - 0.08, frameThickness - 0.02, 0.01]} />
          <meshStandardMaterial color="#3a3a3e" metalness={0.85} roughness={0.25} />
        </mesh>
        
        <mesh position={[frameWidth / 2 - 0.11, frameHeight / 2 - 0.22, depth / 2 + 0.012]}>
          <boxGeometry args={[0.025, 0.12, 0.008]} />
          <meshStandardMaterial color="#ccaa66" metalness={0.6} roughness={0.3} />
        </mesh>
        
        <mesh position={[frameWidth / 2 - 0.11, -frameHeight / 2 + 0.22, depth / 2 + 0.012]}>
          <boxGeometry args={[0.02, 0.06, 0.008]} />
          <meshStandardMaterial color="#ccaa66" metalness={0.6} roughness={0.3} />
        </mesh>
        
        <mesh position={[0, frameHeight / 2 - 0.45, depth / 2 + 0.008]}>
          <boxGeometry args={[panelWidth - 0.1, 0.008, 0.004]} />
          <meshStandardMaterial color="#4a4a4e" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const AluminumSystem3D = () => {
  const [width, setWidth] = useState(3.85);
  const [height, setHeight] = useState(2.0);
  const [depth] = useState(0.12);
  const [color, setColor] = useState('dark-gray');
  const [metalness, setMetalness] = useState(0.88);
  const [roughness, setRoughness] = useState(0.22);
  const [autoRotate, setAutoRotate] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showTexture, setShowTexture] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('window');
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [windowAngle, setWindowAngle] = useState(0);
  const [doorAngle, setDoorAngle] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const fileInputRef = useRef();
  const controlsRef = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setUploadedImage(imageUrl);
        setImagePreview(imageUrl);
        setShowTexture(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTexture = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setShowTexture(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setWidth(3.85);
    setHeight(2.0);
    setColor('dark-gray');
    setMetalness(0.88);
    setRoughness(0.22);
    setAutoRotate(false);
    setIsWindowOpen(false);
    setIsDoorOpen(false);
    setWindowAngle(0);
    setDoorAngle(0);
    removeTexture();
  };

  const toggleWindow = () => {
    if (isWindowOpen) {
      setWindowAngle(0);
      setIsWindowOpen(false);
    } else {
      setWindowAngle(Math.PI / 2.8);
      setIsWindowOpen(true);
    }
  };

  const toggleDoor = () => {
    if (isDoorOpen) {
      setDoorAngle(0);
      setIsDoorOpen(false);
    } else {
      setDoorAngle(Math.PI / 2.4);
      setIsDoorOpen(true);
    }
  };

  const colors = [
    { id: 'dark-gray', name: 'Dark Gray', value: '#2a2a2e', isDark: true },
    { id: 'black', name: 'Black', value: '#1a1a1a', isDark: true },
    { id: 'white', name: 'White', value: '#f5f5f5', isDark: false },
    { id: 'silver', name: 'Silver', value: '#c0c0c0', isDark: false },
    { id: 'bronze', name: 'Bronze', value: '#cd7f32', isDark: false }
  ];

  return (
    <div className="viewer-container">
      <div className="control-panel">
        <div className="panel-header">
          <h2 className="panel-title">Modern Aluminum Window</h2>
          <div className="panel-badge">3D Model</div>
        </div>
        
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'window' ? 'active' : ''}`}
            onClick={() => setActiveTab('window')}
          >
            <span className="tab-icon">🪟</span>
            Window
          </button>
          <button 
            className={`tab-btn ${activeTab === 'door' ? 'active' : ''}`}
            onClick={() => setActiveTab('door')}
          >
            <span className="tab-icon">🚪</span>
            Door
          </button>
        </div>
        
        <div className="control-section">
          <h3>Color Finish</h3>
          <div className="color-buttons">
            {colors.map(c => (
              <button
                key={c.id}
                className={`color-btn ${color === c.id ? 'active' : ''}`}
                style={{ backgroundColor: c.value, color: c.isDark ? '#fff' : '#333' }}
                onClick={() => setColor(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-section">
          <h3>Dimensions</h3>
          <div className="dimension-row">
            <div className="dimension-item">
              <label>Width</label>
              <div className="dimension-value">{(width * 1000).toFixed(0)} mm</div>
              <input
                type="range"
                min="1.5"
                max="4.5"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
              />
            </div>
            <div className="dimension-item">
              <label>Height</label>
              <div className="dimension-value">{(height * 1000).toFixed(0)} mm</div>
              <input
                type="range"
                min="1.2"
                max="3.0"
                step="0.01"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="control-section">
          <h3>Material Properties</h3>
          <div className="slider-group">
            <div className="slider-header">
              <label>Metallic</label>
              <span className="slider-value">{metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
            />
          </div>
          <div className="slider-group">
            <div className="slider-header">
              <label>Roughness</label>
              <span className="slider-value">{roughness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.01"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="control-section">
          <h3>Interactive</h3>
          <button className={`action-btn ${activeTab === 'window' && isWindowOpen ? 'open' : ''}`} onClick={toggleWindow}>
            <span className="action-icon">{activeTab === 'window' ? '🪟' : '🚪'}</span>
            {activeTab === 'window' ? (isWindowOpen ? 'Close Window' : 'Open Window') : (isDoorOpen ? 'Close Door' : 'Open Door')}
          </button>
        </div>

        <div className="control-section">
          <h3>Custom Texture</h3>
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-icon">📸</div>
            <p>Upload custom image</p>
            <p className="upload-subtext">Apply texture to frame</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button className="remove-texture" onClick={removeTexture}>Remove</button>
            </div>
          )}
          {showTexture && uploadedImage && (
            <div className="texture-badge">✓ Texture Applied</div>
          )}
        </div>

        <div className="control-section">
          <h3>View Controls</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              Auto Rotate 360°
            </label>
          </div>
          <button className="reset-btn" onClick={resetView}>
            Reset View
          </button>
        </div>

        <div className="info-panel">
          <div className="info-row">
            <span className="info-label">Model Size:</span>
            <span className="info-value">{(width * 1000).toFixed(0)} x {(height * 1000).toFixed(0)} x 2000 mm</span>
          </div>
          <div className="info-row">
            <span className="info-label">Material:</span>
            <span className="info-value">Aluminum frame with double glass</span>
          </div>
          <div className="info-row">
            <span className="info-label">Style:</span>
            <span className="info-value">Modern Minimalist</span>
          </div>
          <div className="info-row">
            <span className="info-label">Polygons:</span>
            <span className="info-value">Optimized 500</span>
          </div>
        </div>
      </div>

      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [4, 2, 5], fov: 45 }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} />
            <directionalLight
              position={[5, 8, 6]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-3, 2, 4]} intensity={0.45} />
            <pointLight position={[3, 1.5, -2]} intensity={0.35} />
            <spotLight position={[0, 4, 3]} intensity={0.5} angle={0.6} penumbra={0.5} />
            
            <Environment preset="studio" background={false} />
            
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              panSpeed={0.8}
              zoomSpeed={1.2}
              rotateSpeed={1.0}
              minDistance={2}
              maxDistance={8}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
            />
            
            {activeTab === 'window' ? (
              <ModernAluminumWindow
                width={width}
                height={height}
                depth={depth}
                color={color}
                metalness={metalness}
                roughness={roughness}
                imageTexture={uploadedImage}
                showTexture={showTexture}
                isOpen={isWindowOpen}
                openAngle={windowAngle}
                selectedTab={activeTab}
              />
            ) : (
              <ModernAluminumDoor
                width={width}
                height={height}
                depth={depth}
                color={color}
                metalness={metalness}
                roughness={roughness}
                imageTexture={uploadedImage}
                showTexture={showTexture}
                isOpen={isDoorOpen}
                openAngle={doorAngle}
                selectedTab={activeTab}
              />
            )}
          </Suspense>
        </Canvas>
        
        <div className="canvas-info">
          <div className="info-badge">3D Model Preview</div>
          <div className="info-badge">Drag to Rotate 360°</div>
        </div>
      </div>
    </div>
  );
};

export default AluminumSystem3D;