import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GlassOrderCheckout.css";

const GlassOrderCheckout = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    widthFt: "",
    heightFt: "",
    quantity: ""
  });
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState("");
  
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    postalCode: ""
  });
  
  const [distance, setDistance] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [driverDetails, setDriverDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const COMPANY_ADDRESS = "Alubomulla, Panadura, Sri Lanka";

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    if (storedItems.length === 0) {
      navigate('/GlassOrder');
    }
    setSelectedItems(storedItems);
  }, [navigate]);

  const totalGlassPrice = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  
  const calculateDeliveryPrice = () => {
    if (!deliveryMethod || deliveryMethod !== "delivery" || !distance) return 0;
    const kmDistance = parseFloat(distance) || 0;
    
    let totalCost = 5000;
    if (kmDistance > 15) {
      const extraKm = kmDistance - 15;
      totalCost += extraKm * 50;
    }
    
    if (urgentDelivery) totalCost += totalCost * 0.25;
    return totalCost;
  };
  
  const transportCost = deliveryMethod === "pickup" ? 0 : calculateDeliveryPrice();
  const insuranceCost = insurance && deliveryMethod === "delivery" ? totalGlassPrice * 0.02 : 0;
  const grandTotal = totalGlassPrice + transportCost + insuranceCost;

  const handleDeleteItem = (id) => {
    const updatedItems = selectedItems.filter(item => item.id !== id);
    setSelectedItems(updatedItems);
    localStorage.setItem('glassOrderItems', JSON.stringify(updatedItems));
    if (updatedItems.length === 0) {
      navigate('/GlassOrder');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditFormData({
      widthFt: item.widthFt,
      heightFt: item.heightFt,
      quantity: item.quantity
    });
  };

  const handleUpdateItem = () => {
    if (!editFormData.widthFt || !editFormData.heightFt || !editFormData.quantity) return;
    
    const areaSqFt = parseFloat(editFormData.widthFt) * parseFloat(editFormData.heightFt);
    const calculatedPrice = editingItem.unitPrice * areaSqFt * parseInt(editFormData.quantity);
    const weight = (areaSqFt * parseInt(editFormData.quantity) * 2.5) / 10.764;
    
    const updatedItem = {
      ...editingItem,
      widthFt: parseFloat(editFormData.widthFt),
      heightFt: parseFloat(editFormData.heightFt),
      quantity: parseInt(editFormData.quantity),
      areaSqFt: areaSqFt,
      weight: weight,
      totalPrice: calculatedPrice
    };
    
    const updatedItems = selectedItems.map(item => 
      item.id === editingItem.id ? updatedItem : item
    );
    
    setSelectedItems(updatedItems);
    localStorage.setItem('glassOrderItems', JSON.stringify(updatedItems));
    setEditingItem(null);
    setEditFormData({ widthFt: "", heightFt: "", quantity: "" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({ widthFt: "", heightFt: "", quantity: "" });
  };

  const validateUserInfo = () => {
    if (!userInfo.fullName.trim()) {
      alert("Please enter your full name");
      return false;
    }
    if (!userInfo.email.trim()) {
      alert("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!userInfo.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userInfo.phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const calculateDistanceFromMap = () => {
    if (!deliveryAddress.street || !deliveryAddress.city) {
      alert("Please enter your full address first");
      return;
    }
    
    setIsCalculatingDistance(true);
    
    const destinationAddress = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.postalCode}, Sri Lanka`;
    const originAddress = COMPANY_ADDRESS;
    
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(originAddress)}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(originData => {
        if (originData.results && originData.results[0]) {
          const originCoords = originData.results[0].geometry.location;
          
          const destGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=YOUR_GOOGLE_MAPS_API_KEY`;
          
          return fetch(destGeocodeUrl)
            .then(response => response.json())
            .then(destData => {
              if (destData.results && destData.results[0]) {
                const destCoords = destData.results[0].geometry.location;
                
                const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.lat},${originCoords.lng}&destinations=${destCoords.lat},${destCoords.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`;
                
                return fetch(distanceMatrixUrl);
              } else {
                throw new Error("Could not find destination address");
              }
            });
        } else {
          throw new Error("Could not find company location");
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
          const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
          setDistance(distanceInKm.toFixed(1));
          alert(`Distance calculated: ${distanceInKm.toFixed(1)} km`);
        } else {
          alert("Could not calculate distance. Please check your address.");
        }
      })
      .catch(error => {
        console.error("Error calculating distance:", error);
        alert("Error calculating distance. Please try again or enter distance manually.");
      })
      .finally(() => {
        setIsCalculatingDistance(false);
      });
  };

  const handleProceedToPayment = () => {
    if (deliveryMethod === "pickup") {
      if (!pickupDate) {
        alert("Please select pickup date");
        return;
      }
      if (!pickupTimeSlot) {
        alert("Please select pickup time slot");
        return;
      }
      if (!validateUserInfo()) {
        return;
      }
      setShowPaymentModal(true);
    } else if (deliveryMethod === "delivery") {
      if (!deliveryAddress.street || !deliveryAddress.city) {
        alert("Please complete delivery address");
        return;
      }
      if (!distance || distance <= 0) {
        alert("Please calculate distance first using 'Get Distance' button");
        return;
      }
      if (!deliveryDate) {
        alert("Please select delivery date");
        return;
      }
      if (!deliveryTimeSlot) {
        alert("Please select delivery time slot");
        return;
      }
      if (!validateUserInfo()) {
        return;
      }
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    setOrderConfirmed(true);
    setOrderStatus("confirmed");
    setShowPaymentModal(false);
    
    if (deliveryMethod === "delivery") {
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
    setPickupDate("");
    setPickupTimeSlot("");
    setUserInfo({ fullName: "", email: "", phone: "" });
    setDeliveryAddress({ street: "", city: "", postalCode: "" });
    setDistance("");
    setDeliveryDate("");
    setDeliveryTimeSlot("");
    setUrgentDelivery(false);
    setInsurance(false);
    setOrderConfirmed(false);
    setOrderStatus("pending");
    setDriverDetails(null);
    setShowPaymentModal(false);
    setPaymentMethod("");
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
            <h3>Customer Details</h3>
            <div>
              <p><strong>Name:</strong> {userInfo.fullName}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Phone:</strong> {userInfo.phone}</p>
            </div>
          </div>
          <div className="GlassCheckout-confirmationSection">
            <h3>Delivery Details</h3>
            {deliveryMethod === "pickup" ? (
              <div>
                <p><strong>Pickup Location:</strong> Glass House Panadura - Alubomulla</p>
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

      <div className="GlassCheckout-ordersContainer">
        <h2 className="GlassCheckout-sectionTitle">Your Glass Orders ({selectedItems.length})</h2>
        <div className="GlassCheckout-ordersTable">
          <table className="GlassCheckout-ordersTableElement">
            <thead>
              <tr>
                <th>Glass Type</th>
                <th>Quality</th>
                <th>Size</th>
                <th>Dimensions (ft)</th>
                <th>Area (ft²)</th>
                <th>Qty</th>
                <th>Weight (kg)</th>
                <th>Unit Price</th>
                <th>Total (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  {editingItem && editingItem.id === item.id ? (
                    <>
                      <td>{item.glassType}</td>
                      <td>{item.quality}</td>
                      <td>{item.size}</td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          className="GlassCheckout-editInput"
                          value={editFormData.widthFt}
                          onChange={(e) => setEditFormData({...editFormData, widthFt: e.target.value})}
                          placeholder="W"
                          style={{width: "50px", marginRight: "3px"}}
                        />
                        x
                        <input
                          type="number"
                          step="0.1"
                          className="GlassCheckout-editInput"
                          value={editFormData.heightFt}
                          onChange={(e) => setEditFormData({...editFormData, heightFt: e.target.value})}
                          placeholder="H"
                          style={{width: "50px", marginLeft: "3px"}}
                        />
                      </td>
                      <td>{item.areaSqFt.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className="GlassCheckout-editInput"
                          value={editFormData.quantity}
                          onChange={(e) => setEditFormData({...editFormData, quantity: e.target.value})}
                          style={{width: "50px"}}
                        />
                      </td>
                      <td>{item.weight.toFixed(1)}</td>
                      <td>Rs {item.unitPrice.toFixed(2)}</td>
                      <td>
                        <button className="GlassCheckout-saveBtn" onClick={handleUpdateItem}>Save</button>
                        <button className="GlassCheckout-cancelBtn" onClick={handleCancelEdit}>Cancel</button>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td><strong>{item.glassType}</strong></td>
                      <td>{item.quality}</td>
                      <td>{item.size}</td>
                      <td>{item.widthFt}' x {item.heightFt}'</td>
                      <td>{item.areaSqFt.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>{item.weight.toFixed(1)}</td>
                      <td>Rs {item.unitPrice.toFixed(2)}</td>
                      <td className="GlassCheckout-totalPriceCell">Rs {item.totalPrice.toFixed(2)}</td>
                      <td>
                        <button className="GlassCheckout-editBtn" onClick={() => handleEditItem(item)}>✏️</button>
                        <button className="GlassCheckout-deleteBtn" onClick={() => handleDeleteItem(item.id)}>🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="GlassCheckout-tableFooter">
                <td colSpan="8" className="GlassCheckout-footerLabel"><strong>Total Glass Price:</strong></td>
                <td className="GlassCheckout-footerValue"><strong>Rs {totalGlassPrice.toFixed(2)}</strong></td>
                <td></td>
              </tr>
              <tr className="GlassCheckout-tableFooter">
                <td colSpan="8" className="GlassCheckout-footerLabel"><strong>Total Weight:</strong></td>
                <td className="GlassCheckout-footerValue"><strong>{totalWeight.toFixed(1)} kg</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="GlassCheckout-deliveryContainer">
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
          <label className={`GlassCheckout-deliveryOption ${deliveryMethod === "delivery" ? "GlassCheckout-deliveryOptionActive" : ""}`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="delivery"
              checked={deliveryMethod === "delivery"}
              onChange={() => setDeliveryMethod("delivery")}
            />
            <span className="GlassCheckout-deliveryIcon">🚚</span>
            <div>
              <strong>Home Delivery</strong>
              <small>Doorstep delivery</small>
            </div>
          </label>
        </div>

        <div className="GlassCheckout-userInfoSection">
          <h4>Customer Information</h4>
          <div className="GlassCheckout-formRow">
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Full Name *</label>
              <input
                type="text"
                className="GlassCheckout-formInput"
                value={userInfo.fullName}
                onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Email *</label>
              <input
                type="email"
                className="GlassCheckout-formInput"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            <div className="GlassCheckout-formGroup">
              <label className="GlassCheckout-formLabel">Phone *</label>
              <input
                type="tel"
                className="GlassCheckout-formInput"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                placeholder="0712345678"
              />
            </div>
          </div>
        </div>

        {deliveryMethod === "pickup" && (
          <div className="GlassCheckout-pickupSection">
            <h3>Pickup Details</h3>
            <div className="GlassCheckout-locationInfo">
              <p>📍 <strong>Pickup Location:</strong> Glass House Panadura - Alubomulla, Sri Lanka</p>
            </div>
            <div className="GlassCheckout-formRow">
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Pickup Date</label>
                <input
                  type="date"
                  className="GlassCheckout-formInput"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Time Slot</label>
                <select
                  className="GlassCheckout-formSelect"
                  value={pickupTimeSlot}
                  onChange={(e) => setPickupTimeSlot(e.target.value)}
                >
                  <option value="">Select time</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                  <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>
            <div className="GlassCheckout-pickupInfo">
              <p>📋 Bring ID for verification | ⚠️ Fragile - Handle with care</p>
            </div>
          </div>
        )}

        {deliveryMethod === "delivery" && (
          <div className="GlassCheckout-lorrySection">
            <h3>Delivery Details</h3>
            <div className="GlassCheckout-locationInfo">
              <p>🏭 <strong>Shipping From:</strong> Glass House Panadura - Alubomulla, Sri Lanka</p>
            </div>
            
            <div className="GlassCheckout-formRow">
              <div className="GlassCheckout-formGroup GlassCheckout-fullWidth">
                <label className="GlassCheckout-formLabel">Street Address</label>
                <input
                  type="text"
                  className="GlassCheckout-formInput"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                  placeholder="House No, Street Name"
                />
              </div>
            </div>
            
            <div className="GlassCheckout-formRow">
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">City</label>
                <input
                  type="text"
                  className="GlassCheckout-formInput"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Postal Code</label>
                <input
                  type="text"
                  className="GlassCheckout-formInput"
                  value={deliveryAddress.postalCode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                  placeholder="Postal Code"
                />
              </div>
              <div className="GlassCheckout-formGroup">
                <button 
                  className="GlassCheckout-getDistanceButton"
                  onClick={calculateDistanceFromMap}
                  disabled={isCalculatingDistance}
                >
                  {isCalculatingDistance ? "Calculating..." : "📍 Get Distance"}
                </button>
              </div>
            </div>
            
            <div className="GlassCheckout-formRow">
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Distance (km)</label>
                <input
                  type="number"
                  className="GlassCheckout-formInput"
                  value={distance}
                  readOnly
                  placeholder="Auto calculated"
                />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Delivery Date</label>
                <input
                  type="date"
                  className="GlassCheckout-formInput"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Time Slot</label>
                <select
                  className="GlassCheckout-formSelect"
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                >
                  <option value="">Select time</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                  <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="GlassCheckout-priceInfo">
              <p>🚚 Base: Rs 5,000 (first 15km) | Extra: Rs 50/km after 15km</p>
              {distance > 15 && (
                <p>Extra km: {(distance - 15).toFixed(1)} km × Rs 50 = Rs {((distance - 15) * 50).toFixed(2)}</p>
              )}
            </div>

            <div className="GlassCheckout-checkboxGroup">
              <label className="GlassCheckout-checkboxLabel">
                <input
                  type="checkbox"
                  checked={urgentDelivery}
                  onChange={(e) => setUrgentDelivery(e.target.checked)}
                />
                🚀 Urgent Delivery (+25%)
              </label>
              <label className="GlassCheckout-checkboxLabel">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={(e) => setInsurance(e.target.checked)}
                />
                🛡️ Insurance (2% of glass value)
              </label>
            </div>
            
            <div className="GlassCheckout-lorryInfo">
              <p>📦 Wooden frame packaging | ⚠️ Professional handling required</p>
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
          className="GlassCheckout-paymentButton"
          onClick={handleProceedToPayment}
          disabled={!deliveryMethod}
        >
          Proceed to Payment
        </button>
      </div>

      {showPaymentModal && (
        <div className="GlassCheckout-modalOverlay">
          <div className="GlassCheckout-modal">
            <div className="GlassCheckout-modalHeader">
              <h2>Payment Details</h2>
              <button className="GlassCheckout-modalClose" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="GlassCheckout-modalBody">
              <div className="GlassCheckout-paymentAmount">
                <span>Total Amount:</span>
                <strong>Rs {grandTotal.toFixed(2)}</strong>
              </div>
              
              <div className="GlassCheckout-paymentMethods">
                <h3>Select Payment Method</h3>
                <label className="GlassCheckout-paymentOption">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="GlassCheckout-paymentIcon">💳</span>
                  <div>
                    <strong>Credit/Debit Card</strong>
                    <small>Visa, MasterCard, Amex</small>
                  </div>
                </label>
                
                <label className="GlassCheckout-paymentOption">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="GlassCheckout-paymentIcon">🏦</span>
                  <div>
                    <strong>Bank Transfer</strong>
                    <small>Direct bank payment</small>
                  </div>
                </label>
                
                <label className="GlassCheckout-paymentOption">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="GlassCheckout-paymentIcon">💵</span>
                  <div>
                    <strong>Cash on Delivery/Pickup</strong>
                    <small>Pay when you receive</small>
                  </div>
                </label>
                
                <label className="GlassCheckout-paymentOption">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="GlassCheckout-paymentIcon">📱</span>
                  <div>
                    <strong>Mobile Payment</strong>
                    <small>PayPal, Apple Pay, Google Pay</small>
                  </div>
                </label>
              </div>
              
              <div className="GlassCheckout-orderSummary">
                <h3>Order Summary</h3>
                <p>Items: {selectedItems.length} | Weight: {totalWeight.toFixed(1)} kg | {deliveryMethod === "pickup" ? "Self Pickup" : "Home Delivery"}</p>
              </div>
            </div>
            <div className="GlassCheckout-modalFooter">
              <button className="GlassCheckout-modalCancel" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="GlassCheckout-modalConfirm" onClick={handlePaymentConfirm}>Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlassOrderCheckout;