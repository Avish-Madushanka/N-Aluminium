import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GlassOrderCheckout.css";

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

const GlassOrderCheckout = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    if (storedItems.length === 0) {
      navigate('/GlassOrder');
    }
    setSelectedItems(storedItems);
  }, [navigate]);

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
    localStorage.removeItem('glassOrderItems');
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
    navigate('/GlassOrder');
  };

  const handleBackToOrder = () => {
    navigate('/GlassOrder');
  };

  if (orderConfirmed) {
    return (
      <div className="GlassCheckout-container">
        <div className="GlassCheckout-hero">
          <div className="GlassCheckout-heroOverlay"></div>
          <div className="GlassCheckout-heroContent">
            <h1 className="GlassCheckout-heroTitle">Order Confirmed!</h1>
            <p className="GlassCheckout-heroSubtitle">Thank you for your purchase. Your glass order has been successfully placed.</p>
          </div>
        </div>
        <div className="GlassCheckout-confirmationCard">
          <div className="GlassCheckout-confirmationHeader">
            <div className="GlassCheckout-statusBadge GlassCheckout-statusConfirmed">✓ ORDER CONFIRMED</div>
            <div className="GlassCheckout-orderNumber">Order #GL{Math.floor(Math.random() * 10000)}</div>
          </div>
          <div className="GlassCheckout-confirmationSection">
            <h3>Order Summary</h3>
            {selectedItems.map((item) => (
              <div key={item.id} className="GlassCheckout-confirmationItem">
                <span>{item.glassType} - {item.size} ({item.widthFt}'x{item.heightFt}')</span>
                <span>Qty: {item.quantity}</span>
                <span>Rs {item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
            <div className="GlassCheckout-confirmationTotal">
              <span>Total Glass Price:</span>
              <span>Rs {totalGlassPrice.toFixed(2)}</span>
            </div>
            <div className="GlassCheckout-confirmationTotal">
              <span>Transport Cost:</span>
              <span>Rs {transportCost.toFixed(2)}</span>
            </div>
            {insuranceCost > 0 && (
              <div className="GlassCheckout-confirmationTotal">
                <span>Insurance (2%):</span>
                <span>Rs {insuranceCost.toFixed(2)}</span>
              </div>
            )}
            <div className="GlassCheckout-confirmationGrandTotal">
              <span>Grand Total:</span>
              <span>Rs {grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="GlassCheckout-confirmationSection">
            <h3>Delivery Details</h3>
            {deliveryMethod === "pickup" ? (
              <div>
                <p><strong>Pickup Location:</strong> {pickupLocations.find(l => l.id === parseInt(selectedPickupLocation))?.name}</p>
                <p><strong>Pickup Date:</strong> {pickupDate}</p>
                <p><strong>Pickup Time:</strong> {pickupTimeSlot}</p>
                <p className="GlassCheckout-fragileWarning">⚠️ Fragile item - Handle with care. Please bring ID for verification.</p>
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
                  <div className="GlassCheckout-driverDetails">
                    <p><strong>Driver:</strong> {driverDetails.name}</p>
                    <p><strong>Contact:</strong> {driverDetails.contact}</p>
                    <p><strong>Vehicle:</strong> {driverDetails.vehicleNumber}</p>
                  </div>
                )}
                <p className="GlassCheckout-fragileWarning">⚠️ Fragile glass - Professional handling with wooden frame packaging</p>
              </div>
            )}
          </div>
          <div className="GlassCheckout-statusTracker">
            <h3>Order Status</h3>
            <div className="GlassCheckout-statusSteps">
              <div className={`GlassCheckout-statusStep ${orderStatus !== "pending" ? "GlassCheckout-statusActive" : ""}`}>
                <div className="GlassCheckout-stepIcon">1</div>
                <span>Order Placed</span>
              </div>
              <div className={`GlassCheckout-statusStep ${orderStatus === "processing" || orderStatus === "dispatched" || orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassCheckout-statusActive" : ""}`}>
                <div className="GlassCheckout-stepIcon">2</div>
                <span>Processing</span>
              </div>
              <div className={`GlassCheckout-statusStep ${orderStatus === "dispatched" || orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassCheckout-statusActive" : ""}`}>
                <div className="GlassCheckout-stepIcon">3</div>
                <span>Dispatched</span>
              </div>
              <div className={`GlassCheckout-statusStep ${orderStatus === "ontheway" || orderStatus === "delivered" ? "GlassCheckout-statusActive" : ""}`}>
                <div className="GlassCheckout-stepIcon">4</div>
                <span>On The Way</span>
              </div>
              <div className={`GlassCheckout-statusStep ${orderStatus === "delivered" ? "GlassCheckout-statusActive" : ""}`}>
                <div className="GlassCheckout-stepIcon">5</div>
                <span>Delivered</span>
              </div>
            </div>
          </div>
          <button className="GlassCheckout-newOrderButton" onClick={resetOrder}>Place New Order</button>
        </div>
      </div>
    );
  }

  return (
    <div className="GlassCheckout-wrapper">
      <div className="GlassCheckout-backButtonContainer">
        <button className="GlassCheckout-backButton" onClick={handleBackToOrder}>
          ← Back to Order Page
        </button>
      </div>

      <div className="GlassCheckout-orderSummary">
        <h2 className="GlassCheckout-sectionTitle">Your Order</h2>
        <ul className="GlassCheckout-itemList">
          {selectedItems.map((item) => (
            <li key={item.id} className="GlassCheckout-item">
              <div className="GlassCheckout-itemInfo">
                <span className="GlassCheckout-itemName">{item.glassType}</span>
                <span className="GlassCheckout-itemDetails">
                  {item.size} / {item.quality} | {item.widthFt}'x{item.heightFt}' | Qty: {item.quantity} | Area:{" "}
                  {item.areaSqFt.toFixed(2)}ft²
                </span>
                <span className="GlassCheckout-itemPrice">Rs {item.totalPrice.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="GlassCheckout-totalGlassPrice">
          Total Glass Price: <span className="GlassCheckout-priceValue">Rs {totalGlassPrice.toFixed(2)}</span>
        </div>
        <div className="GlassCheckout-weightInfo">
          Total Weight: <span className="GlassCheckout-weightValue">{totalWeight.toFixed(1)} kg</span>
        </div>

        <h2 className="GlassCheckout-sectionTitle GlassCheckout-transportTitle">Delivery Options</h2>
        <div className="GlassCheckout-deliveryMethodSelection">
          <label className={`GlassCheckout-deliveryOption ${deliveryMethod === "pickup" ? "GlassCheckout-deliveryOptionActive" : ""}`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="pickup"
              checked={deliveryMethod === "pickup"}
              onChange={() => setDeliveryMethod("pickup")}
            />
            <span className="GlassCheckout-deliveryIcon">🏬</span>
            <div>
              <strong>Self Pickup</strong>
              <small>Collect from our branch</small>
            </div>
          </label>
          <label className={`GlassCheckout-deliveryOption ${deliveryMethod === "lorry" ? "GlassCheckout-deliveryOptionActive" : ""}`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="lorry"
              checked={deliveryMethod === "lorry"}
              onChange={() => setDeliveryMethod("lorry")}
            />
            <span className="GlassCheckout-deliveryIcon">🚚</span>
            <div>
              <strong>Lorry Transport</strong>
              <small>Doorstep delivery</small>
            </div>
          </label>
        </div>

        {deliveryMethod === "pickup" && (
          <div className="GlassCheckout-pickupSection">
            <h3>Pickup Details</h3>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Select Pickup Location:</label>
              <select
                className="GlassCheckout-formSelect"
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
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Pickup Date:</label>
              <input
                type="date"
                className="GlassCheckout-formInput"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Pickup Time Slot:</label>
              <select
                className="GlassCheckout-formSelect"
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
            <div className="GlassCheckout-pickupInfo">
              <p>📋 <strong>Important:</strong> Please bring a valid ID for verification. Our staff will assist with loading.</p>
              <p>⚠️ <strong>Fragile Warning:</strong> Glass items are delicate. Please ensure proper handling during transport.</p>
            </div>
          </div>
        )}

        {deliveryMethod === "lorry" && (
          <div className="GlassCheckout-lorrySection">
            <h3>Delivery Details</h3>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Street Address:</label>
              <input
                type="text"
                className="GlassCheckout-formInput"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                placeholder="House No, Street Name"
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">City:</label>
              <input
                type="text"
                className="GlassCheckout-formInput"
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Postal Code:</label>
              <input
                type="text"
                className="GlassCheckout-formInput"
                value={deliveryAddress.postalCode}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                placeholder="Postal Code"
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Distance from Warehouse (km):</label>
              <input
                type="number"
                className="GlassCheckout-formInput"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter distance in km"
                min="0"
              />
            </div>
            <div className="GlassCheckout-vehicleInfo">
              <p>🚛 <strong>Recommended Vehicle:</strong> {selectedLorryForDisplay()?.name} ({selectedLorryForDisplay()?.capacity})</p>
              <p>Base Price: Rs {selectedLorryForDisplay()?.basePrice} + Rs {selectedLorryForDisplay()?.pricePerKm}/km</p>
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Delivery Date:</label>
              <input
                type="date"
                className="GlassCheckout-formInput"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Delivery Time Slot:</label>
              <select
                className="GlassCheckout-formSelect"
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
            <div className="GlassCheckout-checkboxGroup">
              <label className="GlassCheckout-checkboxLabel">
                <input
                  type="checkbox"
                  checked={urgentDelivery}
                  onChange={(e) => setUrgentDelivery(e.target.checked)}
                />
                🚀 Urgent Delivery (+25% on transport cost)
              </label>
              <label className="GlassCheckout-checkboxLabel">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={(e) => setInsurance(e.target.checked)}
                />
                🛡️ Glass Insurance (2% of glass value)
              </label>
            </div>
            <div className="GlassCheckout-lorryInfo">
              <p>📦 <strong>Packaging:</strong> All glass will be secured in wooden frames with foam padding.</p>
              <p>⚠️ <strong>Fragile Warning:</strong> Professional handling required. Drivers are trained for glass delivery.</p>
            </div>
          </div>
        )}

        {deliveryMethod && (
          <div className="GlassCheckout-transportCostSummary">
            <h3>Cost Summary</h3>
            <div className="GlassCheckout-costRow">
              <span>Glass Total:</span>
              <span>Rs {totalGlassPrice.toFixed(2)}</span>
            </div>
            <div className="GlassCheckout-costRow">
              <span>Transport Cost:</span>
              <span>Rs {transportCost.toFixed(2)}</span>
            </div>
            {insuranceCost > 0 && (
              <div className="GlassCheckout-costRow">
                <span>Insurance (2%):</span>
                <span>Rs {insuranceCost.toFixed(2)}</span>
              </div>
            )}
            <div className="GlassCheckout-costRow GlassCheckout-grandTotalRow">
              <span>Grand Total:</span>
              <span>Rs {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          className="GlassCheckout-confirmButton"
          onClick={handleConfirmOrder}
          disabled={!deliveryMethod}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default GlassOrderCheckout;