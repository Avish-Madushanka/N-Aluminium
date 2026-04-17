// components/AluminumSystem3D/AluminumSystem3D.jsx
import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Text, Line, Sphere, Box, Cylinder, Billboard, Plane, Circle, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

import './AluminumSystem3D.css';

const ACCEPTED_EXTENSIONS = {
  cad: ['.step', '.stp', '.igs', '.iges', '.sldprt', '.sldasm', '.ipt', '.iam', '.f3d', '.f3z', '.x_t', '.x_b', '.sat', '.sab', '.dxf', '.dwg'],
  mesh: ['.gltf', '.glb', '.obj', '.fbx', '.usdz', '.3mf', '.stl', '.ply'],
  material: ['.jpg', '.png', '.tga', '.exr', '.hdr', '.mtl'],
  bom: ['.csv', '.xlsx', '.json', '.txt', '.xml'],
  config: ['.json', '.yaml', '.yml', '.xml'],
  archive: ['.zip', '.rar', '.7z']
};

const ALL_EXTENSIONS = [...ACCEPTED_EXTENSIONS.cad, ...ACCEPTED_EXTENSIONS.mesh, ...ACCEPTED_EXTENSIONS.material, ...ACCEPTED_EXTENSIONS.bom, ...ACCEPTED_EXTENSIONS.config, ...ACCEPTED_EXTENSIONS.archive];
const MAX_FILE_SIZE = 500 * 1024 * 1024;

const getFileCategory = (filename) => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  for (const [category, extensions] of Object.entries(ACCEPTED_EXTENSIONS)) {
    if (extensions.includes(ext)) return category;
  }
  return 'unsupported';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadedModel3D = ({ model, isSelected, onClick, finish, isWireframe, isExploded, onPositionChange }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  
  const materials = {
    'mill': { color: '#c0c0c0', metalness: 0.85, roughness: 0.3 },
    'black': { color: '#2a2a2a', metalness: 0.7, roughness: 0.2 },
    'bronze': { color: '#cd7f32', metalness: 0.75, roughness: 0.25 },
    'brushed': { color: '#e8e8e8', metalness: 0.9, roughness: 0.15 },
    'RAL 9010': { color: '#f0f0f0', metalness: 0.6, roughness: 0.4 },
    'RAL 7016': { color: '#383e42', metalness: 0.65, roughness: 0.35 }
  };
  
  const material = materials[finish] || materials.mill;
  
  useEffect(() => {
    if (model.imagePreview && model.useTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(model.imagePreview, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        setTexture(tex);
      });
    }
  }, [model.imagePreview, model.useTexture]);
  
  const position = isExploded ? [model.position[0], model.position[1] + 0.15, model.position[2]] : model.position;
  
  useFrame(() => {
    if (meshRef.current && model.isRotating) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  const handlePositionUpdate = () => {
    if (meshRef.current && onPositionChange) {
      onPositionChange(model.id, [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]);
    }
  };
  
  return (
    <group>
      {isSelected && (
        <TransformControls
          object={meshRef}
          mode="translate"
          showX={true}
          showY={true}
          showZ={true}
          onObjectChange={handlePositionUpdate}
        />
      )}
      <mesh
        ref={meshRef}
        position={position}
        rotation={model.rotation}
        onClick={() => onClick(model)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[model.width, model.depth, model.height]} />
        {texture && model.useTexture ? (
          <meshStandardMaterial map={texture} metalness={0.2} roughness={0.4} wireframe={isWireframe} />
        ) : (
          <meshStandardMaterial 
            color={material.color} 
            metalness={material.metalness} 
            roughness={material.roughness} 
            wireframe={isWireframe}
            emissive={hovered || isSelected ? '#ffaa44' : '#000000'}
            emissiveIntensity={hovered || isSelected ? 0.3 : 0}
          />
        )}
      </mesh>
      {isSelected && (
        <mesh position={position} scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[model.width, model.depth, model.height]} />
          <meshBasicMaterial color="#ffaa44" wireframe={true} transparent opacity={0.5} />
        </mesh>
      )}
      {hovered && (
        <Billboard position={[position[0], position[1] + model.height / 2 + 0.1, position[2]]}>
          <Text fontSize={0.06} color="#ffaa44" anchorX="center" anchorY="bottom">
            {model.name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

const CustomText = ({ position, children, fontSize = 0.07, color = '#ffaa44', anchorX = 'center', anchorY = 'bottom' }) => {
  return (
    <group position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        outlineWidth={0.002}
        outlineColor="#000000"
      >
        {children}
      </Text>
    </group>
  );
};

const DimensionLine = ({ start, end, label }) => {
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  return (
    <group>
      <Line points={[start, end]} color="#00aaff" lineWidth={2} />
      <Line points={[start, new THREE.Vector3(start.x, start.y + 0.05, start.z)]} color="#00aaff" lineWidth={2} />
      <Line points={[end, new THREE.Vector3(end.x, end.y + 0.05, end.z)]} color="#00aaff" lineWidth={2} />
      <Billboard position={[midPoint.x, midPoint.y + 0.08, midPoint.z]}>
        <Text fontSize={0.035} color="#00aaff" anchorX="center">{label}</Text>
      </Billboard>
    </group>
  );
};

const CrossSectionPreview = ({ position, sectionPlane }) => {
  const points = [];
  for (let i = 0; i <= 360; i += 15) {
    const rad = i * Math.PI / 180;
    points.push(new THREE.Vector3(Math.cos(rad) * 0.08, Math.sin(rad) * 0.06, 0));
  }
  
  return (
    <group position={position}>
      <Plane args={[0.6, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ff6600" transparent opacity={0.25} side={THREE.DoubleSide} />
      </Plane>
      <Line points={points} color="#ff6600" lineWidth={2} />
      <CustomText position={[0.1, 0.12, 0]} fontSize={0.04} color="#ff6600">
        Section {sectionPlane}
      </CustomText>
    </group>
  );
};

const SimpleGrid = () => {
  const gridSize = 20;
  const divisions = 20;
  const step = gridSize / divisions;
  const lines = [];
  
  for (let i = -gridSize/2; i <= gridSize/2; i += step) {
    lines.push([new THREE.Vector3(i, -2, -gridSize/2), new THREE.Vector3(i, -2, gridSize/2)]);
    lines.push([new THREE.Vector3(-gridSize/2, -2, i), new THREE.Vector3(gridSize/2, -2, i)]);
  }
  
  return (
    <group>
      {lines.map((line, idx) => (
        <Line key={idx} points={line} color="#444444" lineWidth={1} />
      ))}
    </group>
  );
};

const AluminumSystem3D = () => {
  const [orbitControls, setOrbitControls] = useState(null);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState('mill');
  const [showGlass, setShowGlass] = useState(true);
  const [showFasteners, setShowFasteners] = useState(true);
  const [showGaskets, setShowGaskets] = useState(true);
  const [showSecondary, setShowSecondary] = useState(true);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [showBOM, setShowBOM] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [crossSection, setCrossSection] = useState(null);
  const [hdriPreset, setHdriPreset] = useState('studio');
  const [lightIntensity, setLightIntensity] = useState(1);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [asBuiltOpacity, setAsBuiltOpacity] = useState(0.5);
  const [vrMode, setVrMode] = useState(false);
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [isPlayingAssembly, setIsPlayingAssembly] = useState(false);
  const [uploadedModels, setUploadedModels] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [autoRotateUploaded, setAutoRotateUploaded] = useState(false);
  const [roomDimensions, setRoomDimensions] = useState({ width: 8, depth: 8, height: 3 });
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [fileTree, setFileTree] = useState([]);
  const [selectedFileNode, setSelectedFileNode] = useState(null);
  const canvasRef = useRef();
  const fileInputRef = useRef();
  const dropZoneRef = useRef();

  const finishes = [
    { id: 'mill', name: 'Mill Finish', color: '#c0c0c0' },
    { id: 'black', name: 'Anodized Black', color: '#2a2a2a' },
    { id: 'bronze', name: 'Anodized Bronze', color: '#cd7f32' },
    { id: 'brushed', name: 'Brushed Aluminum', color: '#e8e8e8' },
    { id: 'RAL 9010', name: 'RAL 9010', color: '#f0f0f0' },
    { id: 'RAL 7016', name: 'RAL 7016', color: '#383e42' }
  ];

  const extractArchive = async (file) => {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const extractedFiles = [];
    
    for (const [filename, zipEntry] of Object.entries(contents.files)) {
      if (!zipEntry.dir) {
        const blob = await zipEntry.async('blob');
        const extractedFile = new File([blob], filename, { type: blob.type });
        extractedFiles.push(extractedFile);
      }
    }
    return extractedFiles;
  };

  const parseBOMFile = async (file) => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    let bomData = [];
    
    if (extension === '.csv') {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= headers.length) {
          const item = {};
          headers.forEach((header, idx) => {
            item[header.trim()] = values[idx]?.trim();
          });
          bomData.push(item);
        }
      }
    } else if (extension === '.xlsx') {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      bomData = XLSX.utils.sheet_to_json(sheet);
    } else if (extension === '.json') {
      const text = await file.text();
      bomData = JSON.parse(text);
    }
    
    return bomData;
  };

  const processFile = async (file, parentPath = '') => {
    const fileObj = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      category: getFileCategory(file.name),
      extension: file.name.toLowerCase().substring(file.name.lastIndexOf('.')),
      parentPath,
      status: 'pending',
      progress: 0,
      error: null,
      bomData: null,
      texturePreview: null,
      children: []
    };
    
    setUploadQueue(prev => [...prev, fileObj]);
    
    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File exceeds maximum size of 500MB`);
      }
      
      setUploadQueue(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'processing', progress: 50 } : f
      ));
      
      let processedFile = file;
      let extractedChildren = [];
      
      if (fileObj.category === 'archive') {
        const extracted = await extractArchive(file);
        for (const extractedFile of extracted) {
          const childFileObj = await processFile(extractedFile, file.name);
          extractedChildren.push(childFileObj);
        }
      }
      
      let bomData = null;
      if (fileObj.category === 'bom') {
        bomData = await parseBOMFile(file);
        fileObj.bomData = bomData;
      }
      
      let texturePreview = null;
      if (fileObj.category === 'material' && file.type.startsWith('image/')) {
        texturePreview = URL.createObjectURL(file);
        fileObj.texturePreview = texturePreview;
      }
      
      if (fileObj.category === 'mesh' && (fileObj.extension === '.glb' || fileObj.extension === '.gltf')) {
        const modelUrl = URL.createObjectURL(file);
        const modelData = {
          id: fileObj.id,
          name: file.name.split('.')[0],
          position: [(Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 4],
          rotation: [0, 0, 0],
          width: 1.5,
          height: 1.5,
          depth: 1.5,
          finish: selectedFinish,
          modelUrl: modelUrl,
          useTexture: false,
          isRotating: autoRotateUploaded,
          partNumber: `MOD-${Math.floor(Math.random() * 1000)}`,
          price: Math.floor(Math.random() * 500) + 100
        };
        setUploadedModels(prev => [...prev, modelData]);
      }
      
      setUploadQueue(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'completed', progress: 100, children: extractedChildren, bomData, texturePreview } : f
      ));
      
      setUploadHistory(prev => [{
        id: fileObj.id,
        name: file.name,
        timestamp: new Date().toISOString(),
        size: file.size,
        category: fileObj.category,
        status: 'success'
      }, ...prev]);
      
      return fileObj;
      
    } catch (error) {
      setUploadQueue(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f
      ));
      setUploadHistory(prev => [{
        id: fileObj.id,
        name: file.name,
        timestamp: new Date().toISOString(),
        size: file.size,
        category: fileObj.category,
        status: 'failed',
        error: error.message
      }, ...prev]);
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      await processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZoneRef.current?.classList.remove('drag-over');
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
      await processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZoneRef.current?.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZoneRef.current?.classList.remove('drag-over');
  };

  const clearQueue = () => {
    setUploadQueue([]);
  };

  const removeFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = async (fileObj) => {
    const file = new File([], fileObj.name);
    await processFile(file);
  };

  const toggleAutoRotate = (modelId) => {
    setUploadedModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, isRotating: !model.isRotating } : model
    ));
  };

  const rotateAllUploaded = () => {
    setUploadedModels(prev => prev.map(model => ({ ...model, isRotating: !autoRotateUploaded })));
    setAutoRotateUploaded(!autoRotateUploaded);
  };

  const updateModelFinish = (modelId, finish) => {
    setUploadedModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, finish: finish } : model
    ));
    if (selectedItem?.id === modelId) {
      setSelectedItem({ ...selectedItem, finish: finish });
    }
  };

  const updateModelPosition = (modelId, position) => {
    setUploadedModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, position: position } : model
    ));
  };

  const deleteUploadedModel = (id) => {
    setUploadedModels(prev => prev.filter(model => model.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
      setShowBOM(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowBOM(true);
    setTimeout(() => setShowBOM(false), 5000);
  };

  const handleMeasureClick = () => {
    setIsMeasuring(true);
    setMeasurePoints([]);
  };

  const handleCanvasClick = (event) => {
    if (isMeasuring && measurePoints.length < 2) {
      const point = [event.point.x, event.point.y, event.point.z];
      setMeasurePoints(prev => [...prev, point]);
      if (measurePoints.length === 1) {
        setIsMeasuring(false);
      }
    }
  };

  const addAnnotation = () => {
    const newAnnotation = {
      id: Date.now(),
      position: [Math.random() * 4 - 2, Math.random() * 2 + 0.5, Math.random() * 3 - 1.5],
      text: `Note ${annotations.length + 1}`,
      color: '#ffaa44'
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const exportAsPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `aluminum-design-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportAsPDF = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `aluminum-design-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      alert('Screenshot saved. For PDF conversion, use a PDF printer.');
    }
  };

  const exportBOMAsCSV = (bomData) => {
    if (!bomData || bomData.length === 0) return;
    const headers = Object.keys(bomData[0]);
    const csvRows = [headers.join(',')];
    for (const row of bomData) {
      const values = headers.map(header => JSON.stringify(row[header] || ''));
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `bom-export-${Date.now()}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleVRMode = () => setVrMode(!vrMode);

  const playAssemblyAnimation = () => {
    setIsPlayingAssembly(true);
    setAssemblyStep(0);
    const interval = setInterval(() => {
      setAssemblyStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsPlayingAssembly(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetAssembly = () => {
    setAssemblyStep(0);
    setIsPlayingAssembly(false);
  };

  const buildFileTree = () => {
    const tree = [];
    const rootFiles = uploadQueue.filter(f => !f.parentPath);
    for (const file of rootFiles) {
      const node = {
        id: file.id,
        name: file.name,
        size: file.size,
        category: file.category,
        status: file.status,
        progress: file.progress,
        error: file.error,
        children: uploadQueue.filter(f => f.parentPath === file.name)
      };
      tree.push(node);
    }
    setFileTree(tree);
  };

  useEffect(() => {
    buildFileTree();
  }, [uploadQueue]);

  const renderFileTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className={`file-tree-node level-${level}`}>
        <div 
          className={`file-tree-item ${selectedFileNode?.id === node.id ? 'selected' : ''}`}
          onClick={() => setSelectedFileNode(node)}
        >
          <span className="file-icon">
            {node.category === 'cad' && '📐'}
            {node.category === 'mesh' && '🎨'}
            {node.category === 'material' && '🖼️'}
            {node.category === 'bom' && '📊'}
            {node.category === 'config' && '⚙️'}
            {node.category === 'archive' && '🗜️'}
            {node.category === 'unsupported' && '❌'}
          </span>
          <span className="file-name">{node.name}</span>
          <span className="file-size">{formatFileSize(node.size)}</span>
          {node.status === 'pending' && <span className="file-status pending">⏳</span>}
          {node.status === 'processing' && <span className="file-status processing">{node.progress}%</span>}
          {node.status === 'completed' && <span className="file-status completed">✅</span>}
          {node.status === 'error' && <span className="file-status error">❌</span>}
          <button className="file-remove" onClick={() => removeFromQueue(node.id)}>×</button>
        </div>
        {node.children.length > 0 && (
          <div className="file-tree-children">
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      cad: '📐', mesh: '🎨', material: '🖼️', bom: '📊', config: '⚙️', archive: '🗜️', unsupported: '❌'
    };
    return icons[category] || '📄';
  };

  const bomData = selectedItem ? {
    partNumber: selectedItem.partNumber || `UPL-${selectedItem.id?.slice(-6)}`,
    quantity: 1,
    dimensions: `${(selectedItem.width * 100).toFixed(0)} × ${(selectedItem.height * 100).toFixed(0)} × ${(selectedItem.depth * 100).toFixed(0)} mm`,
    finish: selectedItem.finish || selectedFinish,
    material: selectedItem.useTexture ? 'Textured Aluminum' : 'Aluminum 6063-T5',
    weight: `${((selectedItem.width * selectedItem.height * selectedItem.depth) * 2700).toFixed(1)} kg`,
    price: selectedItem.price || 'Contact for price'
  } : null;

  return (
    <div className={`Alu3D-container ${darkTheme ? 'dark' : 'light'}`} ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <div className="Alu3D-control-panel">
        <div className="Alu3D-control-group">
          <div className="Alu3D-theme-toggle">
            <button className={`theme-btn ${!darkTheme ? 'active' : ''}`} onClick={() => setDarkTheme(false)}>☀️ Light</button>
            <button className={`theme-btn ${darkTheme ? 'active' : ''}`} onClick={() => setDarkTheme(true)}>🌙 Dark</button>
          </div>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">📁 File Upload System</h3>
          <div className="Alu3D-upload-area" onClick={() => fileInputRef.current?.click()}>
            <div className="Alu3D-upload-icon">📤</div>
            <p className="Alu3D-upload-text">Click or Drag & Drop Files</p>
            <p className="Alu3D-upload-subtext">CAD, Mesh, Materials, BOM, Archives</p>
            <p className="Alu3D-upload-limits">Max 500MB per file | Supports ZIP/RAR/7Z extraction</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept={ALL_EXTENSIONS.join(',')}
          />
          {uploadQueue.length > 0 && (
            <button className="Alu3D-btn-clear" onClick={clearQueue}>Clear Queue</button>
          )}
        </div>

        {uploadQueue.length > 0 && (
          <div className="Alu3D-control-group">
            <h3 className="Alu3D-group-title">📋 Upload Queue ({uploadQueue.length})</h3>
            <div className="Alu3D-file-tree">
              {renderFileTree(fileTree)}
            </div>
          </div>
        )}

        {uploadHistory.length > 0 && (
          <div className="Alu3D-control-group">
            <h3 className="Alu3D-group-title">🕒 Upload History</h3>
            <div className="Alu3D-history-list">
              {uploadHistory.slice(0, 10).map(history => (
                <div key={history.id} className="history-item">
                  <span className="history-icon">{getCategoryIcon(history.category)}</span>
                  <span className="history-name">{history.name.length > 30 ? history.name.slice(0, 27) + '...' : history.name}</span>
                  <span className={`history-status ${history.status}`}>{history.status === 'success' ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedModels.length > 0 && (
          <div className="Alu3D-control-group">
            <h3 className="Alu3D-group-title">📦 3D Models ({uploadedModels.length})</h3>
            <button className="Alu3D-btn-small" onClick={rotateAllUploaded}>
              {autoRotateUploaded ? '⏸️ Stop Rotation' : '🔄 Auto Rotate All'}
            </button>
            <div className="Alu3D-uploaded-list">
              {uploadedModels.map(model => (
                <div key={model.id} className="Alu3D-uploaded-item">
                  {model.texturePreview ? (
                    <img src={model.texturePreview} alt={model.name} className="Alu3D-uploaded-thumb" />
                  ) : (
                    <div className="Alu3D-uploaded-thumb model-thumb">🎨</div>
                  )}
                  <div className="Alu3D-uploaded-info">
                    <span className="Alu3D-uploaded-name">{model.name.slice(0, 15)}</span>
                    <select 
                      className="Alu3D-uploaded-finish"
                      value={model.finish}
                      onChange={(e) => updateModelFinish(model.id, e.target.value)}
                    >
                      {finishes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <button className="Alu3D-uploaded-rotate" onClick={() => toggleAutoRotate(model.id)}>
                    {model.isRotating ? '⏸️' : '🔄'}
                  </button>
                  <button className="Alu3D-uploaded-delete" onClick={() => deleteUploadedModel(model.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">🎮 Display Controls</h3>
          <button className={`Alu3D-btn ${isWireframe ? 'active' : ''}`} onClick={() => setIsWireframe(!isWireframe)}>
            {isWireframe ? 'Solid View' : 'Wireframe Mode'}
          </button>
          <button className={`Alu3D-btn ${isExploded ? 'active' : ''}`} onClick={() => setIsExploded(!isExploded)}>
            {isExploded ? 'Collapse View' : 'Exploded View'}
          </button>
          <button className={`Alu3D-btn ${comparisonMode ? 'active' : ''}`} onClick={() => setComparisonMode(!comparisonMode)}>
            {comparisonMode ? 'Hide As-Built' : 'Show Comparison'}
          </button>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">🎨 Aluminum Finish</h3>
          <div className="Alu3D-finish-buttons">
            {finishes.map(finish => (
              <button
                key={finish.id}
                className={`Alu3D-finish-btn ${selectedFinish === finish.id ? 'active' : ''}`}
                style={{ backgroundColor: finish.color, color: finish.id === 'black' || finish.id === 'RAL 7016' ? '#fff' : '#333' }}
                onClick={() => setSelectedFinish(finish.id)}
              >
                {finish.name}
              </button>
            ))}
          </div>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">👁️ Layer Visibility</h3>
          <label className="Alu3D-checkbox"><input type="checkbox" checked={showGlass} onChange={(e) => setShowGlass(e.target.checked)} /> Glass Panels</label>
          <label className="Alu3D-checkbox"><input type="checkbox" checked={showFasteners} onChange={(e) => setShowFasteners(e.target.checked)} /> Fasteners</label>
          <label className="Alu3D-checkbox"><input type="checkbox" checked={showGaskets} onChange={(e) => setShowGaskets(e.target.checked)} /> Gaskets</label>
          <label className="Alu3D-checkbox"><input type="checkbox" checked={showSecondary} onChange={(e) => setShowSecondary(e.target.checked)} /> Secondary Profiles</label>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">📏 Measurement & Annotations</h3>
          <button className={`Alu3D-btn ${isMeasuring ? 'active' : ''}`} onClick={handleMeasureClick}>
            {isMeasuring ? 'Stop Measuring' : 'Click to Measure'}
          </button>
          <button className="Alu3D-btn" onClick={addAnnotation}>Add Annotation</button>
          <button className="Alu3D-btn" onClick={() => setShowBOM(!showBOM)}>{showBOM ? 'Hide BOM' : 'Show BOM'}</button>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">✂️ Cross Section</h3>
          <div className="Alu3D-section-buttons">
            <button className="Alu3D-btn" onClick={() => setCrossSection('X-X')}>Section X-X</button>
            <button className="Alu3D-btn" onClick={() => setCrossSection('Y-Y')}>Section Y-Y</button>
            <button className="Alu3D-btn" onClick={() => setCrossSection(null)}>Clear</button>
          </div>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">💡 Lighting & Environment</h3>
          <select className="Alu3D-select" value={hdriPreset} onChange={(e) => setHdriPreset(e.target.value)}>
            <option value="studio">Studio</option>
            <option value="warehouse">Warehouse</option>
            <option value="outdoor">Outdoor</option>
            <option value="sunset">Sunset</option>
          </select>
          <input type="range" min="0.3" max="2" step="0.1" value={lightIntensity} onChange={(e) => setLightIntensity(parseFloat(e.target.value))} />
          <label>Light Intensity: {lightIntensity}</label>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">🎬 Assembly Animation</h3>
          <button className="Alu3D-btn" onClick={playAssemblyAnimation} disabled={isPlayingAssembly}>
            {isPlayingAssembly ? 'Playing...' : 'Play Assembly'}
          </button>
          <button className="Alu3D-btn" onClick={resetAssembly}>Reset</button>
          <div className="Alu3D-progress"><div className="Alu3D-progress-bar" style={{ width: `${assemblyStep * 25}%` }}></div></div>
          <p className="Alu3D-step-message">Step {assemblyStep + 1}/5</p>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">📸 Export</h3>
          <button className="Alu3D-btn" onClick={exportAsPNG}>Export PNG</button>
          <button className="Alu3D-btn" onClick={exportAsPDF}>Export PDF</button>
          <button className="Alu3D-btn" onClick={toggleVRMode}>{vrMode ? 'Exit VR' : 'VR Mode'}</button>
        </div>

        <div className="Alu3D-control-group">
          <h3 className="Alu3D-group-title">🏠 Room Dimensions</h3>
          <div className="Alu3D-dimension-input">
            <label>Width:</label>
            <input type="range" min="4" max="15" step="0.5" value={roomDimensions.width} onChange={(e) => setRoomDimensions({...roomDimensions, width: parseFloat(e.target.value)})} />
            <span>{roomDimensions.width}m</span>
          </div>
          <div className="Alu3D-dimension-input">
            <label>Depth:</label>
            <input type="range" min="4" max="15" step="0.5" value={roomDimensions.depth} onChange={(e) => setRoomDimensions({...roomDimensions, depth: parseFloat(e.target.value)})} />
            <span>{roomDimensions.depth}m</span>
          </div>
        </div>
      </div>

      <div className="Alu3D-canvas-wrapper" ref={canvasRef}>
        <Canvas camera={{ position: [6, 4, 8], fov: 45 }} shadows onClick={handleCanvasClick}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 7]} intensity={lightIntensity} castShadow shadow-mapSize={1024} />
          <pointLight position={[-3, 3, 4]} intensity={0.4} />
          <pointLight position={[3, 2, -3]} intensity={0.3} />
          <spotLight position={[0, 5, 0]} intensity={0.3} angle={0.6} penumbra={0.5} />
          <Environment preset={hdriPreset} background={false} />
          
          <OrbitControls 
            ref={setOrbitControls} 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true} 
            panSpeed={0.8} 
            zoomSpeed={1.2} 
            rotateSpeed={1.0} 
            minDistance={2} 
            maxDistance={20}
          />
          
          <SimpleGrid />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[roomDimensions.width, roomDimensions.depth]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.6} metalness={0.1} />
          </mesh>

          <mesh position={[0, 1.5, -roomDimensions.depth/2]} receiveShadow>
            <boxGeometry args={[roomDimensions.width, 3, 0.1]} />
            <meshStandardMaterial color="#f0f0f0" transparent opacity={comparisonMode ? asBuiltOpacity : 0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[roomDimensions.width/2, 1.5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
            <boxGeometry args={[roomDimensions.depth, 3, 0.1]} />
            <meshStandardMaterial color="#f0f0f0" transparent opacity={comparisonMode ? asBuiltOpacity : 0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-roomDimensions.width/2, 1.5, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
            <boxGeometry args={[roomDimensions.depth, 3, 0.1]} />
            <meshStandardMaterial color="#f0f0f0" transparent opacity={comparisonMode ? asBuiltOpacity : 0.3} side={THREE.DoubleSide} />
          </mesh>

          {uploadedModels.map(model => (
            <UploadedModel3D
              key={model.id}
              model={model}
              isSelected={selectedItem?.id === model.id}
              onClick={handleItemClick}
              finish={model.finish || selectedFinish}
              isWireframe={isWireframe}
              isExploded={isExploded}
              onPositionChange={updateModelPosition}
            />
          ))}

          {comparisonMode && uploadedModels.map(model => (
            <mesh key={`compare-${model.id}`} position={[model.position[0] + 0.1, model.position[1] + 0.05, model.position[2] + 0.1]}>
              <boxGeometry args={[model.width, model.depth, model.height]} />
              <meshStandardMaterial color="#ff6666" transparent opacity={asBuiltOpacity * 0.5} wireframe />
            </mesh>
          ))}

          {crossSection && (
            <CrossSectionPreview position={crossSection === 'X-X' ? [0, 1, 0] : [1, 1, 0]} sectionPlane={crossSection} />
          )}

          {measurePoints.length === 2 && (
            <DimensionLine 
              start={new THREE.Vector3(measurePoints[0][0], measurePoints[0][1], measurePoints[0][2])} 
              end={new THREE.Vector3(measurePoints[1][0], measurePoints[1][1], measurePoints[1][2])} 
              label={`${Math.sqrt(
                Math.pow(measurePoints[1][0] - measurePoints[0][0], 2) +
                Math.pow(measurePoints[1][1] - measurePoints[0][1], 2) +
                Math.pow(measurePoints[1][2] - measurePoints[0][2], 2)
              ).toFixed(2)} m`}
            />
          )}

          {annotations.map(ann => (
            <Billboard key={ann.id} position={ann.position}>
              <group>
                <Plane args={[0.18, 0.06]}>
                  <meshStandardMaterial color={ann.color || '#ffaa44'} transparent opacity={0.85} />
                </Plane>
                <CustomText position={[0, 0, 0.001]} fontSize={0.022} color="#fff" anchorX="center" anchorY="middle">
                  {ann.text}
                </CustomText>
                <Plane args={[0.02, 0.02]} position={[0.09, 0.025, 0]}>
                  <meshStandardMaterial color="#ff6666" />
                </Plane>
              </group>
            </Billboard>
          ))}

          {showBOM && selectedItem && bomData && (
            <Billboard position={[0, 2.5, 2]}>
              <group>
                <Plane args={[0.65, 0.38]}>
                  <meshStandardMaterial color="#1a1a2e" transparent opacity={0.95} />
                </Plane>
                <CustomText position={[0, 0.17, 0.001]} fontSize={0.032} color="#ffaa44" anchorX="center" anchorY="top">
                  📋 BILL OF MATERIALS
                </CustomText>
                <CustomText position={[-0.3, 0.11, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Part No: {bomData.partNumber}
                </CustomText>
                <CustomText position={[-0.3, 0.07, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Name: {selectedItem.name}
                </CustomText>
                <CustomText position={[-0.3, 0.03, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Dimensions: {bomData.dimensions}
                </CustomText>
                <CustomText position={[-0.3, -0.01, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Finish: {bomData.finish}
                </CustomText>
                <CustomText position={[-0.3, -0.05, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Material: {bomData.material}
                </CustomText>
                <CustomText position={[-0.3, -0.09, 0.001]} fontSize={0.018} color="#fff" anchorX="left">
                  Weight: {bomData.weight}
                </CustomText>
                <CustomText position={[-0.3, -0.13, 0.001]} fontSize={0.018} color="#ffaa44" anchorX="left">
                  Price: ${bomData.price}
                </CustomText>
              </group>
            </Billboard>
          )}

          <DimensionLine start={[-3, -1.5, -2]} end={[3, -1.5, -2]} label="6000 mm" />
          <DimensionLine start={[-3, -1.5, -2]} end={[-3, 1.5, -2]} label="3000 mm" />
        </Canvas>
      </div>

      <div className="Alu3D-info-panel">
        <div className="Alu3D-info-section">
          <h4>📊 Project Statistics</h4>
          <p>Total Models: {uploadedModels.length}</p>
          <p>Files Uploaded: {uploadQueue.length}</p>
          <p>Successful: {uploadHistory.filter(h => h.status === 'success').length}</p>
          <p>Failed: {uploadHistory.filter(h => h.status === 'failed').length}</p>
          <p>Auto-Rotate: {autoRotateUploaded ? 'ON' : 'OFF'}</p>
        </div>
        
        <div className="Alu3D-info-section">
          <h4>🎮 Controls Guide</h4>
          <p>🖱️ Drag: Rotate 360° view</p>
          <p>🖱️ Right-drag: Pan camera</p>
          <p>🖱️ Scroll: Zoom in/out</p>
          <p>📤 Drop files → Auto-process</p>
          <p>📦 ZIP/RAR/7Z → Auto-extract</p>
          <p>🎨 Click color to change finish</p>
          <p>🎯 Click model for BOM details</p>
          <p>📏 Click measure then select 2 points</p>
        </div>

        <div className="Alu3D-info-section">
          <h4>✨ Supported File Types</h4>
          <p>📐 CAD: STEP, IGES, SolidWorks, Inventor, DXF, DWG</p>
          <p>🎨 Mesh: GLTF, OBJ, FBX, STL, PLY, 3MF</p>
          <p>🖼️ Materials: JPG, PNG, HDR, EXR, MTL</p>
          <p>📊 BOM: CSV, XLSX, JSON, XML</p>
          <p>🗜️ Archives: ZIP, RAR, 7Z</p>
          <p>⚙️ Config: JSON, YAML, XML</p>
        </div>
      </div>

      {showUploadModal && (
        <div className="Alu3D-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="Alu3D-modal" onClick={(e) => e.stopPropagation()}>
            <div className="Alu3D-modal-header">
              <h3>📤 Upload Files</h3>
              <button className="Alu3D-modal-close" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <div className="Alu3D-modal-body">
              <div className="Alu3D-upload-area-large" onClick={() => fileInputRef.current?.click()}>
                <div className="Alu3D-upload-icon-large">📁</div>
                <p>Click to select files</p>
                <p className="Alu3D-upload-subtext">or drag & drop anywhere</p>
                <p className="Alu3D-upload-formats">CAD, Mesh, Materials, BOM, Archives</p>
                <p className="Alu3D-upload-limits">Max 500MB per file</p>
              </div>
              {isProcessingUpload && (
                <div className="Alu3D-processing">
                  <div className="Alu3D-spinner"></div>
                  <p>Processing files...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AluminumSystem3D;