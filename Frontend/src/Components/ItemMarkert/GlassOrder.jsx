import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GlassOrder.css";

const STORAGE_KEY = "glassProductData";

const defaultGlassProduct = {
  id: 1,
  name: "Start Your Glass Order",
  glassTypes: {
    "Clear Float Glass": {
      Standard: { "4mm": 130, "6mm": 210, "8mm": 290, "10mm": 350, "12mm": 500 },
      Premium: { "4mm": 170, "6mm": 300, "8mm": 400, "10mm": 500, "12mm": 750 },
    },
    "Tempered Glass": {
      Standard: { "5mm": 375, "6mm": 450, "8mm": 540, "12mm": 630 },
      Premium: { "5mm": 400, "6mm": 550, "8mm": 700, "12mm": 800 },
    },
    "Laminated Glass": {
      Standard: { "10mm": 500, "15mm": 900, "20mm": 1400 },
      Premium: { "10mm": 700, "15mm": 1400, "20mm": 2000 },
    },
    "Tinted Glass": {
      Standard: { "4mm": 370, "6mm": 450, "8mm": 600 },
      Premium: { "4mm": 450, "6mm": 600, "8mm": 800 },
    },
  },
};

const productGallery = [
  {
    id: 1,
    title: "Clear Float Glass",
    description: "High-quality float glass ideal for windows, doors, and facades with excellent clarity and smooth finish.",
    imageUrl: "https://materialproviders.com/wp-content/uploads/2025/01/Clear-Glass-3.jpg",
    category: "Clear",
  },
  {
    id: 2,
    title: "Tempered Glass",
    description: "Strong and durable safety glass designed to withstand impact and heat, perfect for doors, partitions, and exteriors.",
    imageUrl: "https://ueeshop.ly200-cdn.com/u_file/UPBG/UPBG338/2305/products/07/7fd2a4431f.png?x-oss-process=image/quality,q_100/resize,m_lfit,h_500,w_500",
    category: "Tempered",
  },
  {
    id: 3,
    title: "Laminated Glass",
    description: "Safety glass made with multiple layers, providing added strength, security, and sound insulation.",
    imageUrl: "https://www.made2measure.co.uk/images/shop/more/1105x1105_2783_05e3279acfcb5386134c8735967f7749_1656339633laminatevaried.jpg",
    category: "Laminated",
  },
  {
    id: 4,
    title: "Tinted Glass",
    description: "Stylish glass that reduces heat and glare, perfect for modern buildings and vehicles.",
    imageUrl: "https://www.onedayglass.com/wp-content/uploads/2018/07/Glass-Tint-Pic-update.jpg",
    category: "Tinted",
  },
];

const GlassOrder = () => {
  const navigate = useNavigate();
  const [glassProduct, setGlassProduct] = useState(defaultGlassProduct);
  const [selectedGlassType, setSelectedGlassType] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [widthFt, setWidthFt] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(() => {
    const items = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    return items.length;
  });

  useEffect(() => {
    const loadGlassData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setGlassProduct(parsedData);
        const firstType = Object.keys(parsedData.glassTypes)[0];
        setSelectedGlassType(firstType);
        if (firstType) {
          const firstQuality = Object.keys(parsedData.glassTypes[firstType])[0];
          setSelectedQuality(firstQuality);
          if (firstQuality) {
            const firstSize = Object.keys(parsedData.glassTypes[firstType][firstQuality])[0];
            setSelectedSize(firstSize);
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGlassProduct));
        const firstType = Object.keys(defaultGlassProduct.glassTypes)[0];
        setSelectedGlassType(firstType);
        if (firstType) {
          const firstQuality = Object.keys(defaultGlassProduct.glassTypes[firstType])[0];
          setSelectedQuality(firstQuality);
          if (firstQuality) {
            const firstSize = Object.keys(defaultGlassProduct.glassTypes[firstType][firstQuality])[0];
            setSelectedSize(firstSize);
          }
        }
      }
    };

    loadGlassData();

    const handleDataUpdate = () => {
      loadGlassData();
    };

    window.addEventListener("glassDataUpdated", handleDataUpdate);
    return () => window.removeEventListener("glassDataUpdated", handleDataUpdate);
  }, []);

  const currentGlassData = glassProduct.glassTypes[selectedGlassType];
  const availableQualities = currentGlassData ? Object.keys(currentGlassData) : [];
  const availableSizes = currentGlassData && currentGlassData[selectedQuality]
    ? Object.keys(currentGlassData[selectedQuality])
    : [];
  const currentUnitPrice = currentGlassData && currentGlassData[selectedQuality]?.[selectedSize] || 0;

  const handleGlassTypeChange = (glassType) => {
    setSelectedGlassType(glassType);
    const firstQuality = Object.keys(glassProduct.glassTypes[glassType])[0];
    setSelectedQuality(firstQuality);
    const firstSize = Object.keys(glassProduct.glassTypes[glassType][firstQuality])[0];
    setSelectedSize(firstSize);
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    const firstSize = Object.keys(currentGlassData[quality])[0];
    setSelectedSize(firstSize);
  };

  const calculateAreaInSqFeet = () => {
    if (!widthFt || !heightFt) return 0;
    return parseFloat(widthFt) * parseFloat(heightFt);
  };

  const handleAddToCart = () => {
    if (!widthFt || !heightFt || !quantity || widthFt <= 0 || heightFt <= 0 || quantity <= 0)
      return;

    const areaSqFt = calculateAreaInSqFeet();
    const calculatedPrice = currentUnitPrice * areaSqFt * parseInt(quantity);
    const weight = (areaSqFt * parseInt(quantity) * 2.5) / 10.764;

    const newItem = {
      id: Date.now(),
      glassType: selectedGlassType,
      quality: selectedQuality,
      size: selectedSize,
      widthFt: parseFloat(widthFt),
      heightFt: parseFloat(heightFt),
      quantity: parseInt(quantity),
      areaSqFt: areaSqFt,
      weight: weight,
      unitPrice: currentUnitPrice,
      totalPrice: calculatedPrice,
    };

    const existingItems = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem('glassOrderItems', JSON.stringify(updatedItems));
    
    setCartCount(updatedItems.length);
    setWidthFt("");
    setHeightFt("");
    setQuantity(1);
    
    alert('Item added to cart!');
  };

  const handleCheckOrder = () => {
    const items = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    if (items.length === 0) {
      alert('Your cart is empty. Please add items to your order first.');
      return;
    }
    navigate('/GlassOrderCheckout');
  };

  return (
    <div className="GlassMain-container">
      <div className="GlassMain-hero">
        <div className="GlassMain-heroOverlay"></div>
        <div className="GlassMain-heroContent">
          <h1 className="GlassMain-heroTitle">Premium Glass Ordering</h1>
          <p className="GlassMain-heroSubtitle">
            Order high-quality glass products with ease — from clear float to toughened, laminated, and tinted glass. Choose your preferred size, thickness, and finish, and get it delivered straight to your doorstep.
          </p>
        </div>
      </div>

      <div className="GlassMain-gallerySection">
        <h2 className="GlassMain-galleryTitle">Quality Glass for Every Need</h2>
        <p className="GlassMain-gallerySubtitle">
          We offer a complete selection of premium glass products including clear and tinted float glass, reflective and patterned designs, as well as high-quality local and imported mirrors. Each product is carefully selected to meet both durability and aesthetic standards for residential, commercial, and industrial use. Customize your order with the exact size, thickness, and finish to suit your specific requirements. Our system ensures precise cutting, reliable quality, and safe handling for every order. With flexible pickup and delivery options, we make it easy and convenient to get the perfect glass solution delivered right to your doorstep.
        </p>
        <div className="GlassMain-galleryGrid">
          {productGallery.map((product) => (
            <div key={product.id} className="GlassMain-galleryCard">
              <div className="GlassMain-galleryImageWrapper">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="GlassMain-galleryImage"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=500&h=400&fit=crop";
                  }}
                />
              </div>
              <div className="GlassMain-galleryInfo">
                <h3 className="GlassMain-galleryCardTitle">{product.title}</h3>
                <p className="GlassMain-galleryCardDesc">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="GlassMain-mainTitle">Order Your Custom Glass</h1>

      <div className="GlassMain-orderLayout">
        <div className="GlassMain-priceTableWrapper">
          <h3 className="GlassMain-priceTableTitle">Glass Price List (Rs/ft²)</h3>
          <div className="GlassMain-priceTableContainer">
            <table className="GlassMain-priceTable">
              <thead>
                <tr className="GlassMain-tableMainHeader">
                  <th rowSpan="2">Glass Type</th>
                  <th colSpan="2">Quality</th>
                  <th rowSpan="2">Price (Rs/ft²)</th>
                </tr>
                <tr className="GlassMain-tableSubHeader">
                  <th>Standard</th>
                  <th>Premium</th>
                 </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [];
                  const glassTypes = Object.keys(glassProduct.glassTypes);
                  
                  glassTypes.forEach((glassType) => {
                    const qualities = glassProduct.glassTypes[glassType];
                    const standardSizes = qualities.Standard ? Object.keys(qualities.Standard) : [];
                    const premiumSizes = qualities.Premium ? Object.keys(qualities.Premium) : [];
                    const maxRows = Math.max(standardSizes.length, premiumSizes.length);
                    
                    for (let i = 0; i < maxRows; i++) {
                      const standardSize = standardSizes[i];
                      const premiumSize = premiumSizes[i];
                      const standardPrice = standardSize ? qualities.Standard[standardSize] : null;
                      const premiumPrice = premiumSize ? qualities.Premium[premiumSize] : null;
                      
                      rows.push(
                        <tr key={`${glassType}-row-${i}`}>
                          {i === 0 && (
                            <td rowSpan={maxRows} className="GlassMain-glassTypeCell">
                              {glassType}
                             </td>
                          )}
                          <td className="GlassMain-sizeCell">
                            {standardSize ? (
                              <div className="GlassMain-sizePriceCell">
                                <span className="GlassMain-sizeValue">{standardSize}</span>
                                <span className="GlassMain-priceValue">Rs {standardPrice.toFixed(2)}</span>
                              </div>
                            ) : null}
                           </td>
                          <td className="GlassMain-sizeCell">
                            {premiumSize ? (
                              <div className="GlassMain-sizePriceCell">
                                <span className="GlassMain-sizeValue">{premiumSize}</span>
                                <span className="GlassMain-priceValue">Rs {premiumPrice.toFixed(2)}</span>
                              </div>
                            ) : null}
                           </td>
                          {i === 0 && (
                            <td rowSpan={maxRows} className="GlassMain-priceNoteCell">
                              Per ft²
                             </td>
                          )}
                         </tr>
                      );
                    }
                  });
                  
                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </div>

        <div className="GlassMain-orderContainer">
          <div className="GlassMain-glassCard">
            <h3 className="GlassMain-productName">{glassProduct.name}</h3>
            <div className="GlassMain-twoColumnLayout">
              <div className="GlassMain-leftColumn">
                <div className="GlassMain-formGroup">
                  <label className="GlassMain-formLabel">Glass Type:</label>
                  <select
                    className="GlassMain-formSelect"
                    value={selectedGlassType}
                    onChange={(e) => handleGlassTypeChange(e.target.value)}
                  >
                    {Object.keys(glassProduct.glassTypes).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="GlassMain-formGroup">
                  <label className="GlassMain-formLabel">Quality:</label>
                  <select
                    className="GlassMain-formSelect"
                    value={selectedQuality}
                    onChange={(e) => handleQualityChange(e.target.value)}
                  >
                    {availableQualities.map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="GlassMain-formGroup">
                  <label className="GlassMain-formLabel">Thickness (mm):</label>
                  <select
                    className="GlassMain-formSelect"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="GlassMain-rightColumn">
                <div className="GlassMain-dimensionGroup">
                  <div className="GlassMain-dimensionInput">
                    <label className="GlassMain-formLabel">Width (feet):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="GlassMain-formInput"
                      value={widthFt}
                      onChange={(e) => setWidthFt(e.target.value)}
                      placeholder="e.g., 4.5"
                      min="0.1"
                    />
                  </div>
                  <div className="GlassMain-dimensionInput">
                    <label className="GlassMain-formLabel">Height (feet):</label>
                    <input
                      type="number"
                      step="0.1"
                      className="GlassMain-formInput"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="e.g., 3"
                      min="0.1"
                    />
                  </div>
                </div>
                <div className="GlassMain-formGroup">
                  <label className="GlassMain-formLabel">Quantity:</label>
                  <input
                    type="number"
                    className="GlassMain-formInput"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="GlassMain-priceDisplay">
                  Unit Price:{" "}
                  <span className="GlassMain-unitPrice">Rs {currentUnitPrice.toFixed(2)}/ft²</span>
                </div>
                {widthFt && heightFt && quantity > 0 && (
                  <div className="GlassMain-totalDisplay">
                    Area: {(calculateAreaInSqFeet()).toFixed(2)} ft² | Total: Rs{" "}
                    {(currentUnitPrice * calculateAreaInSqFeet() * quantity).toFixed(2)}
                  </div>
                )}
                <button
                  className="GlassMain-addButton"
                  onClick={handleAddToCart}
                  disabled={!widthFt || !heightFt || !quantity || widthFt <= 0 || heightFt <= 0 || quantity <= 0}
                >
                  Add to Cart
                </button>
                <button
                  className="GlassMain-checkOrderBtn"
                  onClick={handleCheckOrder}
                >
                  🛒 Check Your Order ({cartCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassOrder;