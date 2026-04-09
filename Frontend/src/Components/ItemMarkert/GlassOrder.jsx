import React, { useState } from "react";
import "./GlassOrder.css";

const glassProduct = {
  id: 1,
  name: "Premium Glass",
  glassTypes: {
    "Clear Float Glass": {
      Standard: { "4mm": 1500, "6mm": 2200, "8mm": 3000, "10mm": 4000 },
      Premium: { "4mm": 1800, "6mm": 2600, "8mm": 3500, "10mm": 4800 },
    },
    "Tempered  Glass": {
      Standard: { "5mm": 2000, "6mm": 2800, "8mm": 3800, "12mm": 5500 },
      Premium: { "5mm": 2400, "6mm": 3300, "8mm": 4500, "12mm": 6500 },
    },
    "Laminated Glass": {
      Standard: { "6.38mm": 3500, "8.38mm": 4500, "10.76mm": 6000 },
      Premium: { "6.38mm": 4200, "8.38mm": 5400, "10.76mm": 7200 },
    },
    "Tinted Glass": {
      Standard: { "4mm": 1800, "6mm": 2500, "8mm": 3400 },
      Premium: { "4mm": 2100, "6mm": 3000, "8mm": 4000 },
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
    title: "Tempered  Glass",
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
    description: "Stylish glass that reduces heat and glare, perfect for modern",
    imageUrl: "https://www.onedayglass.com/wp-content/uploads/2018/07/Glass-Tint-Pic-update.jpg",
    category: "Tinted",
  },
];

const lorryOptions = [
  { id: "small", name: "Small Lorry", capacity: "1 Ton", basePrice: 5000, pricePerKm: 50, maxWeight: 500 },
  { id: "medium", name: "Medium Lorry", capacity: "2.5 Ton", basePrice: 8000, pricePerKm: 75, maxWeight: 1200 },
  { id: "large", name: "Large Lorry", capacity: "5 Ton", basePrice: 12000, pricePerKm: 100, maxWeight: 2500 },
  { id: "crane", name: "Crane Lorry", capacity: "8 Ton", basePrice: 25000, pricePerKm: 150, maxWeight: 4000 },
];

const pickupLocations = [
  { id: 1, name: "Colombo Main Branch", address: "123 Galle Road, Colombo 03", distance: 0 },
  { id: 2, name: "Kandy Branch", address: "45 Peradeniya Road, Kandy", distance: 115 },
  { id: 3, name: "Galle Branch", address: "78 Lighthouse Street, Galle", distance: 130 },
  { id: 4, name: "Negombo Branch", address: "22 Beach Road, Negombo", distance: 40 },
];

const GlassOrder = () => {
  const [selectedGlassType, setSelectedGlassType] = useState(
    Object.keys(glassProduct.glassTypes)[0]
  );
  const [selectedQuality, setSelectedQuality] = useState("Standard");
  const [selectedSize, setSelectedSize] = useState("4mm");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    instructions: "",
  });
  const [distance, setDistance] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [driverDetails, setDriverDetails] = useState(null);

  const currentGlassData = glassProduct.glassTypes[selectedGlassType];
  const availableQualities = Object.keys(currentGlassData);
  const availableSizes = currentGlassData[selectedQuality]
    ? Object.keys(currentGlassData[selectedQuality])
    : [];
  const currentUnitPrice =
    currentGlassData[selectedQuality]?.[selectedSize] || 0;

  const handleGlassTypeChange = (glassType) => {
    setSelectedGlassType(glassType);
    const firstQuality = Object.keys(glassProduct.glassTypes[glassType])[0];
    setSelectedQuality(firstQuality);
    const firstSize = Object.keys(
      glassProduct.glassTypes[glassType][firstQuality]
    )[0];
    setSelectedSize(firstSize);
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    const firstSize = Object.keys(currentGlassData[quality])[0];
    setSelectedSize(firstSize);
  };

  const handleAddToOrder = () => {
    if (!width || !height || !quantity || width <= 0 || height <= 0 || quantity <= 0)
      return;

    const area = (parseFloat(width) * parseFloat(height)) / 1000000;
    const calculatedPrice = currentUnitPrice * area * parseInt(quantity);
    const weight = area * parseInt(quantity) * 2.5;

    const newItem = {
      id: Date.now(),
      glassType: selectedGlassType,
      quality: selectedQuality,
      size: selectedSize,
      width: parseFloat(width),
      height: parseFloat(height),
      quantity: parseInt(quantity),
      area: area,
      weight: weight,
      unitPrice: currentUnitPrice,
      totalPrice: calculatedPrice,
    };

    setSelectedItems((prevItems) => [...prevItems, newItem]);
    setWidth("");
    setHeight("");
    setQuantity(1);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalGlassPrice = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  
  const calculateLorryPrice = () => {
    if (!deliveryMethod || deliveryMethod !== "lorry" || !distance) return 0;
    const baseDistance = parseFloat(distance) || 0;
    let selectedLorry = null;
    for (const lorry of lorryOptions) {
      if (totalWeight <= lorry.maxWeight) {
        selectedLorry = lorry;
        break;
      }
    }
    if (!selectedLorry) selectedLorry = lorryOptions[lorryOptions.length - 1];
    let totalCost = selectedLorry.basePrice + (baseDistance * selectedLorry.pricePerKm);
    if (urgentDelivery) totalCost += totalCost * 0.25;
    return totalCost;
  };
  
  const selectedLorryForDisplay = () => {
    if (!deliveryMethod || deliveryMethod !== "lorry") return null;
    for (const lorry of lorryOptions) {
      if (totalWeight <= lorry.maxWeight) return lorry;
    }
    return lorryOptions[lorryOptions.length - 1];
  };
  
  const transportCost = deliveryMethod === "pickup" ? 0 : calculateLorryPrice();
  const insuranceCost = insurance && deliveryMethod === "lorry" ? totalGlassPrice * 0.02 : 0;
  const grandTotal = totalGlassPrice + transportCost + insuranceCost;

  const handleConfirmOrder = () => {
    if (deliveryMethod === "pickup" && (!selectedPickupLocation || !pickupDate || !pickupTimeSlot)) {
      alert("Please complete pickup details");
      return;
    }
    if (deliveryMethod === "lorry" && (!deliveryAddress.street || !deliveryAddress.city || !distance || !deliveryDate || !deliveryTimeSlot)) {
      alert("Please complete delivery details");
      return;
    }
    setOrderConfirmed(true);
    setOrderStatus("confirmed");
    if (deliveryMethod === "lorry") {
      setDriverDetails({
        name: "Kamal Perera",
        contact: "0771234567",
        vehicleNumber: "ABC-1234",
      });
    }
  };

  const resetOrder = () => {
    setSelectedItems([]);
    setDeliveryMethod(null);
    setSelectedPickupLocation(null);
    setPickupDate("");
    setPickupTimeSlot("");
    setDeliveryAddress({ street: "", city: "", postalCode: "", instructions: "" });
    setDistance("");
    setDeliveryDate("");
    setDeliveryTimeSlot("");
    setUrgentDelivery(false);
    setInsurance(false);
    setOrderConfirmed(false);
    setOrderStatus("pending");
    setDriverDetails(null);
  };

  if (orderConfirmed) {
    return (
      <div className="GlassOr-container">
        <div className="GlassOr-hero">
          <div className="GlassOr-heroOverlay"></div>
          <div className="GlassOr-heroContent">
            <h1 className="GlassOr-heroTitle">Order Confirmed!</h1>
            <p className="GlassOr-heroSubtitle">Thank you for your purchase. Your glass order has been successfully placed.</p>
          </div>
        </div>
        <div className="GlassOr-confirmationCard">
          <div className="GlassOr-confirmationHeader">
            <div className="GlassOr-statusBadge GlassOr-statusConfirmed">✓ ORDER CONFIRMED</div>
            <div className="GlassOr-orderNumber">Order #GL{Math.floor(Math.random() * 10000)}</div>
          </div>
          <div className="GlassOr-confirmationSection">
            <h3>Order Summary</h3>
            {selectedItems.map((item) => (
              <div key={item.id} className="GlassOr-confirmationItem">
                <span>{item.glassType} - {item.size} ({item.width}x{item.height}mm)</span>
                <span>Qty: {item.quantity}</span>
                <span>Rs {item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
            <div className="GlassOr-confirmationTotal">
              <span>Total Glass Price:</span>
              <span>Rs {totalGlassPrice.toFixed(2)}</span>
            </div>
            <div className="GlassOr-confirmationTotal">
              <span>Transport Cost:</span>
              <span>Rs {transportCost.toFixed(2)}</span>
            </div>
            {insuranceCost > 0 && (
              <div className="GlassOr-confirmationTotal">
                <span>Insurance (2%):</span>
                <span>Rs {insuranceCost.toFixed(2)}</span>
              </div>
            )}
            <div className="GlassOr-confirmationGrandTotal">
              <span>Grand Total:</span>
              <span>Rs {grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="GlassOr-confirmationSection">
            <h3>Delivery Details</h3>
            {deliveryMethod === "pickup" ? (
              <div>
                <p><strong>Pickup Location:</strong> {pickupLocations.find(l => l.id === parseInt(selectedPickupLocation))?.name}</p>
                <p><strong>Pickup Date:</strong> {pickupDate}</p>
                <p><strong>Pickup Time:</strong> {pickupTimeSlot}</p>
                <p className="GlassOr-fragileWarning">⚠️ Fragile item - Handle with care. Please bring ID for verification.</p>
              </div>
            ) : (
              <div>
                <p><strong>Delivery Address:</strong> {deliveryAddress.street}, {deliveryAddress.city}</p>
                <p><strong>Distance:</strong> {distance} km</p>
                <p><strong>Delivery Date:</strong> {deliveryDate}</p>
                <p><strong>Delivery Time:</strong> {deliveryTimeSlot}</p>
                {urgentDelivery && <p><strong>Urgent Delivery:</strong> Yes (+25% fee)</p>}
                {insurance && <p><strong>Insurance:</strong> Included (2% of glass value)</p>}
                {driverDetails && (
                  <div className="GlassOr-driverDetails">
                    <p><strong>Driver:</strong> {driverDetails.name}</p>
                    <p><strong>Contact:</strong> {driverDetails.contact}</p>
                    <p><strong>Vehicle:</strong> {driverDetails.vehicleNumber}</p>
                  </div>
                )}
                <p className="GlassOr-fragileWarning">⚠️ Fragile glass - Professional handling with wooden frame packaging</p>
              </div>
            )}
          </div>
          <div className="GlassOr-statusTracker">
            <h3>Order Status</h3>
            <div className="GlassOr-statusSteps">
              <div className={`GlassOr-statusStep ${orderStatus !== "pending" ? "GlassOr-statusActive" : ""}`}>
                <div className="GlassOr-stepIcon">1</div>
                <span>Order Placed</span>
              </div>
              <div className={`GlassOr-statusStep ${orderStatus === "processing" || orderStatus === "dispatched" || orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassOr-statusActive" : ""}`}>
                <div className="GlassOr-stepIcon">2</div>
                <span>Processing</span>
              </div>
              <div className={`GlassOr-statusStep ${orderStatus === "dispatched" || orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassOr-statusActive" : ""}`}>
                <div className="GlassOr-stepIcon">3</div>
                <span>Dispatched</span>
              </div>
              <div className={`GlassOr-statusStep ${orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassOr-statusActive" : ""}`}>
                <div className="GlassOr-stepIcon">4</div>
                <span>On The Way</span>
              </div>
              <div className={`GlassOr-statusStep ${orderStatus === "delivered" ? "GlassOr-statusActive" : ""}`}>
                <div className="GlassOr-stepIcon">5</div>
                <span>Delivered</span>
              </div>
            </div>
          </div>
          <button className="GlassOr-newOrderButton" onClick={resetOrder}>Place New Order</button>
        </div>
      </div>
    );
  }

  return (
    <div className="GlassOr-container">
      <div className="GlassOr-hero">
        <div className="GlassOr-heroOverlay"></div>
        <div className="GlassOr-heroContent">
          <h1 className="GlassOr-heroTitle">Premium Glass Ordering</h1>
          <p className="GlassOr-heroSubtitle">
            Order high-quality glass products with ease — from clear float to toughened, laminated, and tinted glass. Choose your preferred size, thickness, and finish, and get it delivered straight to your doorstep.
          </p>
        </div>
      </div>

      <div className="GlassOr-gallerySection">
        <h2 className="GlassOr-galleryTitle">Quality Glass for Every Need</h2>
        <p className="GlassOr-gallerySubtitle">
          We offer a complete selection of premium glass products including clear and tinted float glass, reflective and patterned designs, as well as high-quality local and imported mirrors. Each product is carefully selected to meet both durability and aesthetic standards for residential, commercial, and industrial use.Customize your order with the exact size, thickness, and finish to suit your specific requirements. Our system ensures precise cutting, reliable quality, and safe handling for every order. With flexible pickup and delivery options, we make it easy and convenient to get the perfect glass solution delivered right to your doorstep.
        </p>
        <div className="GlassOr-galleryGrid">
          {productGallery.map((product) => (
            <div key={product.id} className="GlassOr-galleryCard">
              <div className="GlassOr-galleryImageWrapper">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="GlassOr-galleryImage"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=500&h=400&fit=crop";
                  }}
                />
              </div>
              <div className="GlassOr-galleryInfo">
                <h3 className="GlassOr-galleryCardTitle">{product.title}</h3>
                <p className="GlassOr-galleryCardName">{product.name}</p>
                <p className="GlassOr-galleryCardDesc">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="GlassOr-mainTitle">Order Your Custom Glass</h1>

      <div className="GlassOr-orderContainer">
        <div className="GlassOr-glassCard">
          <div className="GlassOr-twoColumnLayout">
            <div className="GlassOr-leftColumn">
              <h3 className="GlassOr-productName">{glassProduct.name}</h3>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Glass Type:</label>
                <select
                  className="GlassOr-formSelect"
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
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Quality:</label>
                <select
                  className="GlassOr-formSelect"
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
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Thickness (mm):</label>
                <select
                  className="GlassOr-formSelect"
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
            <div className="GlassOr-rightColumn">
              <div className="GlassOr-dimensionGroup">
                <div className="GlassOr-dimensionInput">
                  <label className="GlassOr-formLabel">Width (mm):</label>
                  <input
                    type="number"
                    className="GlassOr-formInput"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g., 1000"
                    min="1"
                  />
                </div>
                <div className="GlassOr-dimensionInput">
                  <label className="GlassOr-formLabel">Height (mm):</label>
                  <input
                    type="number"
                    className="GlassOr-formInput"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 800"
                    min="1"
                  />
                </div>
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Quantity:</label>
                <input
                  type="number"
                  className="GlassOr-formInput"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>
              <div className="GlassOr-priceDisplay">
                Unit Price:{" "}
                <span className="GlassOr-unitPrice">Rs {currentUnitPrice.toFixed(2)}/m²</span>
              </div>
              {width && height && quantity > 0 && (
                <div className="GlassOr-totalDisplay">
                  Total: Rs{" "}
                  {(
                    currentUnitPrice *
                    ((parseFloat(width) * parseFloat(height)) / 1000000) *
                    quantity
                  ).toFixed(2)}
                </div>
              )}
              <button
                className="GlassOr-addButton"
                onClick={handleAddToOrder}
                disabled={!width || !height || !quantity || width <= 0 || height <= 0 || quantity <= 0}
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="GlassOr-orderSummary">
          <h2 className="GlassOr-sectionTitle">Your Order</h2>
          <ul className="GlassOr-itemList">
            {selectedItems.map((item) => (
              <li key={item.id} className="GlassOr-item">
                <div className="GlassOr-itemInfo">
                  <span className="GlassOr-itemName">{item.glassType}</span>
                  <span className="GlassOr-itemDetails">
                    {item.size} / {item.quality} | {item.width}x{item.height}mm | Qty: {item.quantity} | Area:{" "}
                    {item.area.toFixed(2)}m²
                  </span>
                  <span className="GlassOr-itemPrice">Rs {item.totalPrice.toFixed(2)}</span>
                </div>
                <button className="GlassOr-removeButton" onClick={() => handleRemoveItem(item.id)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="GlassOr-totalGlassPrice">
            Total Glass Price: <span className="GlassOr-priceValue">Rs {totalGlassPrice.toFixed(2)}</span>
          </div>
          <div className="GlassOr-weightInfo">
            Total Weight: <span className="GlassOr-weightValue">{totalWeight.toFixed(1)} kg</span>
          </div>

          <h2 className="GlassOr-sectionTitle GlassOr-transportTitle">Delivery Options</h2>
          <div className="GlassOr-deliveryMethodSelection">
            <label className={`GlassOr-deliveryOption ${deliveryMethod === "pickup" ? "GlassOr-deliveryOptionActive" : ""}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
              />
              <span className="GlassOr-deliveryIcon">🏬</span>
              <div>
                <strong>Self Pickup</strong>
                <small>Collect from our branch</small>
              </div>
            </label>
            <label className={`GlassOr-deliveryOption ${deliveryMethod === "lorry" ? "GlassOr-deliveryOptionActive" : ""}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="lorry"
                checked={deliveryMethod === "lorry"}
                onChange={() => setDeliveryMethod("lorry")}
              />
              <span className="GlassOr-deliveryIcon">🚚</span>
              <div>
                <strong>Lorry Transport</strong>
                <small>Doorstep delivery</small>
              </div>
            </label>
          </div>

          {deliveryMethod === "pickup" && (
            <div className="GlassOr-pickupSection">
              <h3>Pickup Details</h3>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Select Pickup Location:</label>
                <select
                  className="GlassOr-formSelect"
                  value={selectedPickupLocation || ""}
                  onChange={(e) => setSelectedPickupLocation(e.target.value)}
                >
                  <option value="">Select a branch</option>
                  {pickupLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} - {loc.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Pickup Date:</label>
                <input
                  type="date"
                  className="GlassOr-formInput"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Pickup Time Slot:</label>
                <select
                  className="GlassOr-formSelect"
                  value={pickupTimeSlot}
                  onChange={(e) => setPickupTimeSlot(e.target.value)}
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                  <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                </select>
              </div>
              <div className="GlassOr-pickupInfo">
                <p>📋 <strong>Important:</strong> Please bring a valid ID for verification. Our staff will assist with loading.</p>
                <p>⚠️ <strong>Fragile Warning:</strong> Glass items are delicate. Please ensure proper handling during transport.</p>
              </div>
            </div>
          )}

          {deliveryMethod === "lorry" && (
            <div className="GlassOr-lorrySection">
              <h3>Delivery Details</h3>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Street Address:</label>
                <input
                  type="text"
                  className="GlassOr-formInput"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                  placeholder="House No, Street Name"
                />
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">City:</label>
                <input
                  type="text"
                  className="GlassOr-formInput"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Postal Code:</label>
                <input
                  type="text"
                  className="GlassOr-formInput"
                  value={deliveryAddress.postalCode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                  placeholder="Postal Code"
                />
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Distance from Warehouse (km):</label>
                <input
                  type="number"
                  className="GlassOr-formInput"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance in km"
                  min="0"
                />
              </div>
              <div className="GlassOr-vehicleInfo">
                <p>🚛 <strong>Recommended Vehicle:</strong> {selectedLorryForDisplay()?.name} ({selectedLorryForDisplay()?.capacity})</p>
                <p>Base Price: Rs {selectedLorryForDisplay()?.basePrice} + Rs {selectedLorryForDisplay()?.pricePerKm}/km</p>
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Delivery Date:</label>
                <input
                  type="date"
                  className="GlassOr-formInput"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="GlassOr-formGroup">
                <label className="GlassOr-formLabel">Delivery Time Slot:</label>
                <select
                  className="GlassOr-formSelect"
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                  <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                </select>
              </div>
              <div className="GlassOr-checkboxGroup">
                <label className="GlassOr-checkboxLabel">
                  <input
                    type="checkbox"
                    checked={urgentDelivery}
                    onChange={(e) => setUrgentDelivery(e.target.checked)}
                  />
                  🚀 Urgent Delivery (+25% on transport cost)
                </label>
                <label className="GlassOr-checkboxLabel">
                  <input
                    type="checkbox"
                    checked={insurance}
                    onChange={(e) => setInsurance(e.target.checked)}
                  />
                  🛡️ Glass Insurance (2% of glass value)
                </label>
              </div>
              <div className="GlassOr-lorryInfo">
                <p>📦 <strong>Packaging:</strong> All glass will be secured in wooden frames with foam padding.</p>
                <p>⚠️ <strong>Fragile Warning:</strong> Professional handling required. Drivers are trained for glass delivery.</p>
              </div>
            </div>
          )}

          {deliveryMethod && (
            <div className="GlassOr-transportCostSummary">
              <h3>Cost Summary</h3>
              <div className="GlassOr-costRow">
                <span>Glass Total:</span>
                <span>Rs {totalGlassPrice.toFixed(2)}</span>
              </div>
              <div className="GlassOr-costRow">
                <span>Transport Cost:</span>
                <span>Rs {transportCost.toFixed(2)}</span>
              </div>
              {insuranceCost > 0 && (
                <div className="GlassOr-costRow">
                  <span>Insurance (2%):</span>
                  <span>Rs {insuranceCost.toFixed(2)}</span>
                </div>
              )}
              <div className="GlassOr-costRow GlassOr-grandTotalRow">
                <span>Grand Total:</span>
                <span>Rs {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            className="GlassOr-confirmButton"
            onClick={handleConfirmOrder}
            disabled={!deliveryMethod}
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default GlassOrder;