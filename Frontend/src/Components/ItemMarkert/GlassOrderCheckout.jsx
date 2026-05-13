import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import "./GlassOrderCheckout.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GOOGLE_MAPS_API_KEY = "AIzaSyDzqpYnSGskutFD2bq3zY906kFXem49_9g";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5003';

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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [mapSearchTerm, setMapSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [manualDistance, setManualDistance] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [paypalRendered, setPaypalRendered] = useState(false);
  const [companyCoords, setCompanyCoords] = useState({ lat: 6.6615, lng: 79.9048 });
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const companyMarkerRef = useRef(null);

  const COMPANY_NAME = "ALUX Panadura";
  const COMPANY_ADDRESS = "426F/18 Shanthi Garden, Medha Mawatha, Alubomulla, Panadura, Sri Lanka";
  const COMPANY_PHONE = "+94 72 104 6048";
  const COMPANY_EMAIL = "donotreply.ALUX@gmail.com";
  const USD_TO_LKR = 300;

  useEffect(() => {
    const fetchCompanyCoordinates = async () => {
      try {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(COMPANY_ADDRESS)}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCompanyCoords({ lat: location.lat, lng: location.lng });
          console.log("Company coordinates loaded:", location.lat, location.lng);
        }
      } catch (error) {
        console.error("Error geocoding company address:", error);
      }
    };
    fetchCompanyCoordinates();
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('glassOrderItems') || '[]');
    if (storedItems.length === 0) {
      navigate('/GlassOrder');
    }
    setSelectedItems(storedItems);
  }, [navigate]);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is missing");
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  const totalGlassPrice = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  
  const calculateDeliveryPrice = () => {
    const currentDistance = manualDistance ? parseFloat(manualDistance) : parseFloat(distance);
    if (!deliveryMethod || deliveryMethod !== "delivery" || !currentDistance || isNaN(currentDistance)) return 0;
    const kmDistance = currentDistance || 0;
    
    let totalCost = 6000;
    if (kmDistance > 15) {
      const extraKm = kmDistance - 15;
      totalCost += extraKm * 150;
    }
    
    if (urgentDelivery) totalCost += totalCost * 0.25;
    return totalCost;
  };
  
  const transportCost = deliveryMethod === "pickup" ? 0 : calculateDeliveryPrice();
  const insuranceCost = insurance && deliveryMethod === "delivery" ? totalGlassPrice * 0.02 : 0;
  const grandTotalLKR = totalGlassPrice + transportCost + insuranceCost;
  const grandTotalUSD = grandTotalLKR / USD_TO_LKR;
  const currentDistanceValue = manualDistance || distance;

  const generatePDFBill = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(33, 33, 33);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(COMPANY_NAME, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(COMPANY_ADDRESS, pageWidth / 2, 30, { align: 'center' });
    doc.text(`${COMPANY_PHONE} | ${COMPANY_EMAIL}`, pageWidth / 2, 37, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT RECEIPT", pageWidth / 2, 60, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 65, pageWidth - 20, 65);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Bill Number: ${currentOrder?.billNumber || generateBillNumber()}`, 20, 78);
    doc.text(`Order ID: ${currentOrder?.orderId || 'N/A'}`, 20, 86);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 94);
    doc.text(`Payment Method: ${paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "bank" ? "Bank Transfer" : paymentMethod === "cash" ? "Cash on Delivery" : paymentMethod === "paypal" ? "PayPal" : "Mobile Payment"}`, 20, 102);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("CUSTOMER DETAILS", 20, 118);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Name: ${userInfo.fullName}`, 20, 128);
    doc.text(`Email: ${userInfo.email}`, 20, 136);
    doc.text(`Phone: ${userInfo.phone}`, 20, 144);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("ORDER ITEMS", 20, 160);
    
    const tableData = selectedItems.map(item => [
      item.glassType,
      `${item.widthFt}'x${item.heightFt}'`,
      item.quantity,
      `Rs ${item.totalPrice.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: 165,
      head: [['Glass Type', 'Dimensions', 'Qty', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      },
      margin: { left: 20 }
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Glass Total:`, pageWidth - 80, finalY);
    doc.text(`Rs ${totalGlassPrice.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    
    finalY += 8;
    doc.text(`Transport Cost:`, pageWidth - 80, finalY);
    doc.text(`Rs ${transportCost.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    
    if (insuranceCost > 0) {
      finalY += 8;
      doc.text(`Insurance (2%):`, pageWidth - 80, finalY);
      doc.text(`Rs ${insuranceCost.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    }
    
    finalY += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 53, 69);
    doc.text(`GRAND TOTAL:`, pageWidth - 80, finalY);
    doc.text(`Rs ${grandTotalLKR.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    
    finalY += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Amount in USD:`, pageWidth - 80, finalY);
    doc.text(`$${grandTotalUSD.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    
    finalY += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalY, pageWidth - 20, finalY);
    
    finalY += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("DELIVERY INFORMATION", 20, finalY);
    
    finalY += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (deliveryMethod === "pickup") {
      doc.text(`Method: Self Pickup`, 20, finalY);
      finalY += 6;
      doc.text(`Pickup Location: ${COMPANY_ADDRESS}`, 20, finalY);
      finalY += 6;
      doc.text(`Pickup Date: ${pickupDate}`, 20, finalY);
      finalY += 6;
      doc.text(`Pickup Time: ${pickupTimeSlot}`, 20, finalY);
    } else {
      doc.text(`Method: Home Delivery`, 20, finalY);
      finalY += 6;
      doc.text(`Delivery Address: ${selectedLocation?.address || "Manually entered location"}`, 20, finalY);
      finalY += 6;
      doc.text(`Distance: ${currentDistanceValue} km`, 20, finalY);
      finalY += 6;
      doc.text(`Delivery Date: ${deliveryDate}`, 20, finalY);
      finalY += 6;
      doc.text(`Delivery Time: ${deliveryTimeSlot}`, 20, finalY);
      if (urgentDelivery) {
        finalY += 6;
        doc.text(`Urgent Delivery: Yes (+25% fee)`, 20, finalY);
      }
      if (insurance) {
        finalY += 6;
        doc.text(`Insurance: Included (2% of glass value)`, 20, finalY);
      }
    }
    
    finalY += 12;
    doc.setFillColor(240, 248, 255);
    doc.rect(20, finalY, pageWidth - 40, 25, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("Thank you for your purchase!", pageWidth / 2, finalY + 8, { align: 'center' });
    doc.text("For inquiries, please contact our customer support.", pageWidth / 2, finalY + 16, { align: 'center' });
    
    doc.save(`Bill_${currentOrder?.billNumber || 'receipt'}.pdf`);
  };

  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/glass/orders`, orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (showPaymentModal && paymentMethod === "paypal" && !paypalRendered && grandTotalUSD > 0) {
      const renderPayPalButton = () => {
        if (window.paypal && document.getElementById('paypal-button-container')) {
          window.paypal.Buttons({
            createOrder: async () => {
              try {
                const response = await axios.post(`${BACKEND_URL}/api/glass/paypal/create-order`, {
                  amount: grandTotalUSD
                });
                return response.data.orderId;
              } catch (error) {
                console.error('Error creating order:', error);
                toast.error("Failed to create PayPal order");
                return null;
              }
            },
            onApprove: async (data) => {
              try {
                const captureResponse = await axios.post(`${BACKEND_URL}/api/glass/paypal/capture-order`, {
                  orderId: data.orderID
                });
                
                if (captureResponse.data.success) {
                  const orderData = {
                    items: selectedItems,
                    userInfo: userInfo,
                    deliveryMethod: deliveryMethod,
                    totalGlassPrice: totalGlassPrice,
                    transportCost: transportCost,
                    insuranceCost: insuranceCost,
                    grandTotal: grandTotalLKR,
                    totalWeight: totalWeight,
                    paymentMethod: "paypal",
                    paypalTransactionId: captureResponse.data.transactionId,
                    pickupDate: pickupDate,
                    pickupTimeSlot: pickupTimeSlot,
                    deliveryDate: deliveryDate,
                    deliveryTimeSlot: deliveryTimeSlot,
                    deliveryAddress: deliveryAddress,
                    selectedLocation: selectedLocation,
                    distance: currentDistanceValue,
                    urgentDelivery: urgentDelivery,
                    insurance: insurance
                  };
                  
                  const savedOrder = await saveOrderToDatabase(orderData);
                  setCurrentOrder(savedOrder);
                  localStorage.removeItem('glassOrderItems');
                  setOrderConfirmed(true);
                  setOrderStatus("pending");
                  setShowPaymentModal(false);
                  setShowBillModal(true);
                  toast.success("Payment successful! Order placed successfully.");
                  
                  if (deliveryMethod === "delivery") {
                    setDriverDetails({
                      name: "Kamal Perera",
                      contact: "0771234567",
                      vehicleNumber: "ABC-1234",
                    });
                  }
                }
              } catch (error) {
                console.error('Error capturing order:', error);
                toast.error("Payment failed. Please try again.");
              }
            },
            onError: (err) => {
              console.error('PayPal Error:', err);
              toast.error("Payment failed. Please try again.");
            }
          }).render('#paypal-button-container');
          setPaypalRendered(true);
        }
      };
      
      if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
        renderPayPalButton();
      } else {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
        script.onload = renderPayPalButton;
        document.body.appendChild(script);
      }
    }
  }, [showPaymentModal, paymentMethod, grandTotalUSD, paypalRendered]);

  const handleDeleteItem = (id) => {
    const updatedItems = selectedItems.filter(item => item.id !== id);
    setSelectedItems(updatedItems);
    localStorage.setItem('glassOrderItems', JSON.stringify(updatedItems));
    if (updatedItems.length === 0) {
      navigate('/GlassOrder');
    }
    toast.success("Item removed from cart");
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
    toast.success("Item updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({ widthFt: "", heightFt: "", quantity: "" });
  };

  const validateUserInfo = () => {
    if (!userInfo.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!userInfo.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!userInfo.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userInfo.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (deliveryMethod === "pickup") {
      if (!pickupDate) {
        toast.error("Please select pickup date");
        return;
      }
      if (!pickupTimeSlot) {
        toast.error("Please select pickup time slot");
        return;
      }
      if (!validateUserInfo()) {
        return;
      }
      setShowPaymentModal(true);
    } else if (deliveryMethod === "delivery") {
      if (!selectedLocation && !manualDistance) {
        toast.error("Please select a delivery location or enter distance manually");
        return;
      }
      if (!currentDistanceValue || parseFloat(currentDistanceValue) <= 0) {
        toast.error("Please enter a valid distance");
        return;
      }
      if (!deliveryDate) {
        toast.error("Please select delivery date");
        return;
      }
      if (!deliveryTimeSlot) {
        toast.error("Please select delivery time slot");
        return;
      }
      if (!validateUserInfo()) {
        return;
      }
      setShowPaymentModal(true);
    }
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const searchLocation = () => {
    if (!mapSearchTerm.trim()) return;

    setIsCalculatingDistance(true);
    
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mapSearchTerm + ", Sri Lanka")}&key=${GOOGLE_MAPS_API_KEY}`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const location = result.geometry.location;
          
          if (mapRef.current && window.google) {
            mapRef.current.setCenter(location);
            mapRef.current.setZoom(15);
            
            if (markerRef.current) {
              markerRef.current.setPosition(location);
            } else {
              markerRef.current = new window.google.maps.Marker({
                position: location,
                map: mapRef.current,
                animation: window.google.maps.Animation.DROP,
                title: "Selected Location"
              });
            }
            
            calculateDistanceFromCoords(location, result.formatted_address);
          }
        } else {
          toast.error("Location not found");
          setIsCalculatingDistance(false);
        }
      })
      .catch(error => {
        console.error("Error searching location:", error);
        toast.error("Failed to search location");
        setIsCalculatingDistance(false);
      });
  };

  const calculateDistanceFromCoords = (destinationCoords, address) => {
    setIsCalculatingDistance(true);
    
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${companyCoords.lat},${companyCoords.lng}&destinations=${destinationCoords.lat},${destinationCoords.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    
    fetch(distanceMatrixUrl)
      .then(response => response.json())
      .then(data => {
        if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
          const element = data.rows[0].elements[0];
          if (element.status === "OK") {
            const distanceInKm = element.distance.value / 1000;
            const duration = element.duration.text;
            setDistance(distanceInKm.toFixed(1));
            setManualDistance("");
            
            setSelectedLocation({
              address: address,
              coords: destinationCoords,
              distance: distanceInKm.toFixed(1),
              duration: duration
            });
            
            setDeliveryAddress({
              street: address.split(',')[0] || "",
              city: address.split(',')[1] || "",
              postalCode: address.split(',')[2] || ""
            });
            setIsCalculatingDistance(false);
            return;
          }
        }
        throw new Error("Distance Matrix API failed");
      })
      .catch(error => {
        console.error("Distance Matrix API error:", error);
        
        const haversineDistance = calculateHaversineDistance(
          companyCoords.lat, companyCoords.lng,
          destinationCoords.lat, destinationCoords.lng
        );
        
        const estimatedDistance = haversineDistance.toFixed(1);
        setDistance(estimatedDistance);
        setManualDistance("");
        
        setSelectedLocation({
          address: address,
          coords: destinationCoords,
          distance: estimatedDistance,
          duration: "Estimated"
        });
        
        setDeliveryAddress({
          street: address.split(',')[0] || "",
          city: address.split(',')[1] || "",
          postalCode: address.split(',')[2] || ""
        });
      })
      .finally(() => {
        setIsCalculatingDistance(false);
      });
  };

  const handleMapClick = (event) => {
    const clickedLocation = event.latLng;
    const lat = clickedLocation.lat();
    const lng = clickedLocation.lng();
    
    if (markerRef.current) {
      markerRef.current.setPosition(clickedLocation);
    } else if (window.google && mapRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: clickedLocation,
        map: mapRef.current,
        animation: window.google.maps.Animation.DROP,
        title: "Selected Location"
      });
    }
    
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const address = data.results[0].formatted_address;
          calculateDistanceFromCoords({ lat, lng }, address);
        } else {
          calculateDistanceFromCoords({ lat, lng }, `${lat}, ${lng}`);
        }
      })
      .catch(() => {
        calculateDistanceFromCoords({ lat, lng }, `${lat}, ${lng}`);
      });
  };

  const initMap = () => {
    if (!window.google || !window.google.maps || !showLocationPicker) return;
    
    const mapElement = document.getElementById("location-picker-map");
    if (!mapElement) return;
    
    const map = new window.google.maps.Map(mapElement, {
      center: companyCoords,
      zoom: 16,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });
    
    map.addListener("click", handleMapClick);
    mapRef.current = map;
    
    companyMarkerRef.current = new window.google.maps.Marker({
      position: companyCoords,
      map: map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new window.google.maps.Size(40, 40)
      },
      title: "ALUX Panadura - Shanthi Garden, Alubomulla"
    });
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div style="padding: 5px;"><strong>ALUX Panadura</strong><br/>426F/18 Shanthi Garden, Medha Mawatha<br/>Alubomulla, Panadura, Sri Lanka</div>'
    });
    
    companyMarkerRef.current.addListener("click", () => {
      infoWindow.open(map, companyMarkerRef.current);
    });
  };

  useEffect(() => {
    if (showLocationPicker && mapLoaded && window.google && !mapRef.current) {
      setTimeout(() => {
        initMap();
      }, 500);
    }
    
    return () => {
      if (showLocationPicker && mapRef.current) {
        mapRef.current = null;
        markerRef.current = null;
        companyMarkerRef.current = null;
      }
    };
  }, [showLocationPicker, mapLoaded, companyCoords]);

  const handleManualDistanceChange = (e) => {
    const value = e.target.value;
    setManualDistance(value);
    if (value && !isNaN(parseFloat(value))) {
      setDistance("");
      setSelectedLocation({
        address: "Manually entered location",
        coords: null,
        distance: value,
        duration: "Manual entry"
      });
    }
  };

  const generateBillNumber = () => {
    return `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handlePaymentConfirm = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    if (paymentMethod === "paypal") {
      return;
    }
    
    const orderData = {
      items: selectedItems,
      userInfo: userInfo,
      deliveryMethod: deliveryMethod,
      totalGlassPrice: totalGlassPrice,
      transportCost: transportCost,
      insuranceCost: insuranceCost,
      grandTotal: grandTotalLKR,
      totalWeight: totalWeight,
      paymentMethod: paymentMethod,
      pickupDate: pickupDate,
      pickupTimeSlot: pickupTimeSlot,
      deliveryDate: deliveryDate,
      deliveryTimeSlot: deliveryTimeSlot,
      deliveryAddress: deliveryAddress,
      selectedLocation: selectedLocation,
      distance: currentDistanceValue,
      urgentDelivery: urgentDelivery,
      insurance: insurance
    };
    
    try {
      const savedOrder = await saveOrderToDatabase(orderData);
      setCurrentOrder(savedOrder);
      localStorage.removeItem('glassOrderItems');
      setOrderConfirmed(true);
      setOrderStatus("pending");
      setShowPaymentModal(false);
      setShowBillModal(true);
      toast.success("Payment successful! Order placed successfully.");
      
      if (deliveryMethod === "delivery") {
        setDriverDetails({
          name: "Kamal Perera",
          contact: "0771234567",
          vehicleNumber: "ABC-1234",
        });
      }
    } catch (error) {
      toast.error("Failed to save order. Please try again.");
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
    setManualDistance("");
    setDeliveryDate("");
    setDeliveryTimeSlot("");
    setUrgentDelivery(false);
    setInsurance(false);
    setOrderConfirmed(false);
    setOrderStatus("pending");
    setDriverDetails(null);
    setShowPaymentModal(false);
    setPaymentMethod("");
    setSelectedLocation(null);
    setShowBillModal(false);
    setCurrentOrder(null);
    setPaypalRendered(false);
    navigate('/GlassOrder');
  };

  const handleBackToOrder = () => {
    navigate('/GlassOrder');
  };

  const BillModal = () => (
    <div className="GlassCheckout-modalOverlay">
      <div className="GlassCheckout-billModal">
        <div className="GlassCheckout-billHeader">
          <h2>Payment Receipt</h2>
          <button className="GlassCheckout-modalClose" onClick={() => setShowBillModal(false)}>×</button>
        </div>
        <div className="GlassCheckout-billContent">
          <div className="GlassCheckout-billCompany">
            <h3>{COMPANY_NAME}</h3>
            <p>{COMPANY_ADDRESS}</p>
            <p>Tel: {COMPANY_PHONE}</p>
            <p>Email: {COMPANY_EMAIL}</p>
          </div>
          
          <div className="GlassCheckout-billDivider"></div>
          
          <div className="GlassCheckout-billInfo">
            <div className="GlassCheckout-billRow">
              <span>Bill Number:</span>
              <strong>{currentOrder?.billNumber || generateBillNumber()}</strong>
            </div>
            <div className="GlassCheckout-billRow">
              <span>Order ID:</span>
              <strong>{currentOrder?.orderId || 'N/A'}</strong>
            </div>
            <div className="GlassCheckout-billRow">
              <span>Date:</span>
              <strong>{new Date().toLocaleString()}</strong>
            </div>
            <div className="GlassCheckout-billRow">
              <span>Payment Method:</span>
              <strong>{paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "bank" ? "Bank Transfer" : paymentMethod === "cash" ? "Cash on Delivery" : paymentMethod === "paypal" ? "PayPal" : "Mobile Payment"}</strong>
            </div>
          </div>
          
          <div className="GlassCheckout-billDivider"></div>
          
          <div className="GlassCheckout-billCustomer">
            <h4>Customer Details</h4>
            <p><strong>Name:</strong> {userInfo.fullName}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p>
          </div>
          
          <div className="GlassCheckout-billDivider"></div>
          
          <div className="GlassCheckout-billItems">
            <h4>Order Items</h4>
            <table className="GlassCheckout-billTable">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Dimensions</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.glassType}</td>
                    <td>{item.size}</td>
                    <td>{item.widthFt}'x{item.heightFt}'</td>
                    <td>{item.quantity}</td>
                    <td>Rs {item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="GlassCheckout-billDivider"></div>
          
          <div className="GlassCheckout-billTotals">
            <div className="GlassCheckout-billRow">
              <span>Glass Total:</span>
              <span>Rs {totalGlassPrice.toFixed(2)}</span>
            </div>
            <div className="GlassCheckout-billRow">
              <span>Transport Cost:</span>
              <span>Rs {transportCost.toFixed(2)}</span>
            </div>
            {insuranceCost > 0 && (
              <div className="GlassCheckout-billRow">
                <span>Insurance:</span>
                <span>Rs {insuranceCost.toFixed(2)}</span>
              </div>
            )}
            <div className="GlassCheckout-billRow GlassCheckout-billGrandTotal">
              <span>Grand Total:</span>
              <span>Rs {grandTotalLKR.toFixed(2)}</span>
            </div>
            <div className="GlassCheckout-billRow">
              <span>Amount in USD:</span>
              <span>${grandTotalUSD.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="GlassCheckout-billFooter">
            <p>Thank you for your purchase!</p>
            <p>Order status can be tracked in Admin Panel</p>
          </div>
        </div>
        <div className="GlassCheckout-billActions">
          <button className="GlassCheckout-printBtn" onClick={() => window.print()}>
            🖨️ Print Receipt
          </button>
          <button className="GlassCheckout-downloadBtn" onClick={generatePDFBill}>
            📥 Download PDF
          </button>
          <button className="GlassCheckout-doneBtn" onClick={() => {
            setShowBillModal(false);
            resetOrder();
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  if (orderConfirmed) {
    return (
      <>
        <Toaster position="top-right" />
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
              <div className="GlassCheckout-orderNumber">Order #{currentOrder?.orderId}</div>
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
                <span>Rs {grandTotalLKR.toFixed(2)}</span>
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
                  <p><strong>Pickup Location:</strong> {COMPANY_ADDRESS}</p>
                  <p><strong>Pickup Date:</strong> {pickupDate}</p>
                  <p><strong>Pickup Time:</strong> {pickupTimeSlot}</p>
                  <p className="GlassCheckout-fragileWarning">⚠️ Fragile item - Handle with care. Please bring payment receipt for verification.</p>
                </div>
              ) : (
                <div>
                  <p><strong>Delivery Address:</strong> {selectedLocation?.address || "Manually entered location"}</p>
                  <p><strong>Distance:</strong> {currentDistanceValue} km</p>
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
        {showBillModal && <BillModal />}
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
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
                {selectedItems.map((item) => {
                  if (editingItem && editingItem.id === item.id) {
                    return (
                      <tr key={item.id}>
                        <td>{item.glassType}</td>
                        <td>{item.quality}</td>
                        <td>{item.size}</td>
                        <td>
                          <input type="number" step="0.1" className="GlassCheckout-editInput" value={editFormData.widthFt} onChange={(e) => setEditFormData({...editFormData, widthFt: e.target.value})} placeholder="W" style={{width: "50px", marginRight: "3px"}} />
                          x
                          <input type="number" step="0.1" className="GlassCheckout-editInput" value={editFormData.heightFt} onChange={(e) => setEditFormData({...editFormData, heightFt: e.target.value})} placeholder="H" style={{width: "50px", marginLeft: "3px"}} />
                        </td>
                        <td>{item.areaSqFt.toFixed(2)}</td>
                        <td>
                          <input type="number" className="GlassCheckout-editInput" value={editFormData.quantity} onChange={(e) => setEditFormData({...editFormData, quantity: e.target.value})} style={{width: "50px"}} />
                        </td>
                        <td>{item.weight.toFixed(1)}</td>
                        <td>Rs {item.unitPrice.toFixed(2)}</td>
                        <td>Rs {item.totalPrice.toFixed(2)}</td>
                        <td>
                          <button className="GlassCheckout-saveBtn" onClick={handleUpdateItem}>Save</button>
                          <button className="GlassCheckout-cancelBtn" onClick={handleCancelEdit}>Cancel</button>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={item.id}>
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
                    </tr>
                  );
                })}
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
              <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} />
              <span className="GlassCheckout-deliveryIcon">🏬</span>
              <div>
                <strong>Self Pickup</strong>
                <small>Collect from our branch</small>
              </div>
            </label>
            <label className={`GlassCheckout-deliveryOption ${deliveryMethod === "delivery" ? "GlassCheckout-deliveryOptionActive" : ""}`}>
              <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === "delivery"} onChange={() => setDeliveryMethod("delivery")} />
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
                <input type="text" className="GlassCheckout-formInput" value={userInfo.fullName} onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})} placeholder="Enter full name" />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Email *</label>
                <input type="email" className="GlassCheckout-formInput" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} placeholder="your@email.com" />
              </div>
              <div className="GlassCheckout-formGroup">
                <label className="GlassCheckout-formLabel">Phone *</label>
                <input type="tel" className="GlassCheckout-formInput" value={userInfo.phone} onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} placeholder="0712345678" />
              </div>
            </div>
          </div>

          {deliveryMethod === "pickup" && (
            <div className="GlassCheckout-pickupSection">
              <h3>Pickup Details</h3>
              <div className="GlassCheckout-locationInfo">
                <p>📍 <strong>Pickup Location:</strong> {COMPANY_ADDRESS}</p>
              </div>
              <div className="GlassCheckout-formRow">
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Pickup Date</label>
                  <input type="date" className="GlassCheckout-formInput" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Time Slot</label>
                  <select className="GlassCheckout-formSelect" value={pickupTimeSlot} onChange={(e) => setPickupTimeSlot(e.target.value)}>
                    <option value="">Select time</option>
                    <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                    <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                    <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                    <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="GlassCheckout-pickupInfo">
                <p>📋 Bring payment receipt for verification | ⚠️ Fragile - Handle with care</p>
              </div>
            </div>
          )}

          {deliveryMethod === "delivery" && (
            <div className="GlassCheckout-lorrySection">
              <h3>Delivery Details</h3>
              <div className="GlassCheckout-locationInfo">
                <p>🏭 <strong>Shipping From:</strong> {COMPANY_ADDRESS}</p>
              </div>
              
              <div className="GlassCheckout-formRow">
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Pick Location</label>
                  <button className="GlassCheckout-pickLocationButton" onClick={() => setShowLocationPicker(true)}>🗺️ Pick on Map</button>
                </div>
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Distance (km)</label>
                  <input type="number" step="0.1" className="GlassCheckout-formInput" value={manualDistance} onChange={handleManualDistanceChange} placeholder="Enter distance" />
                </div>
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Delivery Date</label>
                  <input type="date" className="GlassCheckout-formInput" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="GlassCheckout-formGroup">
                  <label className="GlassCheckout-formLabel">Time Slot</label>
                  <select className="GlassCheckout-formSelect" value={deliveryTimeSlot} onChange={(e) => setDeliveryTimeSlot(e.target.value)}>
                    <option value="">Select time</option>
                    <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                    <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                    <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                    <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              {selectedLocation && (
                <div className="GlassCheckout-selectedLocationInfo">
                  <p><strong>Selected:</strong> {selectedLocation.address.substring(0, 100)}</p>
                  <p><strong>Distance:</strong> {selectedLocation.distance} km {selectedLocation.duration !== "Manual entry" && `| Time: ${selectedLocation.duration}`}</p>
                </div>
              )}

              <div className="GlassCheckout-priceInfo">
                <p>🚚 Base: Rs 6,000 (first 15km) | Extra: Rs 150/km after 15km</p>
                {currentDistanceValue && parseFloat(currentDistanceValue) > 15 && (
                  <p>Extra: {(parseFloat(currentDistanceValue) - 15).toFixed(1)} km × Rs 150 = Rs {((parseFloat(currentDistanceValue) - 15) * 150).toFixed(2)}</p>
                )}
              </div>

              <div className="GlassCheckout-checkboxGroup">
                <label className="GlassCheckout-checkboxLabel">
                  <input type="checkbox" checked={urgentDelivery} onChange={(e) => setUrgentDelivery(e.target.checked)} />
                  🚀 Urgent Delivery (+25%)
                </label>
                <label className="GlassCheckout-checkboxLabel">
                  <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} />
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
              <div className="GlassCheckout-costRow"><span>Glass Total:</span><span>Rs {totalGlassPrice.toFixed(2)}</span></div>
              <div className="GlassCheckout-costRow"><span>Transport Cost:</span><span>Rs {transportCost.toFixed(2)}</span></div>
              {insuranceCost > 0 && <div className="GlassCheckout-costRow"><span>Insurance (2%):</span><span>Rs {insuranceCost.toFixed(2)}</span></div>}
              <div className="GlassCheckout-costRow GlassCheckout-grandTotalRow"><span>Grand Total:</span><span>Rs {grandTotalLKR.toFixed(2)}</span></div>
              <div className="GlassCheckout-costRow"><span>Amount in USD:</span><span>${grandTotalUSD.toFixed(2)}</span></div>
            </div>
          )}

          <button className="GlassCheckout-paymentButton" onClick={handleProceedToPayment} disabled={!deliveryMethod}>Proceed to Payment</button>
        </div>

        {showLocationPicker && (
          <div className="GlassCheckout-modalOverlay">
            <div className="GlassCheckout-modal GlassCheckout-mapModal">
              <div className="GlassCheckout-modalHeader">
                <h2>Select Delivery Location</h2>
                <button className="GlassCheckout-modalClose" onClick={() => setShowLocationPicker(false)}>×</button>
              </div>
              <div className="GlassCheckout-modalBody">
                <div className="GlassCheckout-searchContainer">
                  <div className="GlassCheckout-searchWrapper">
                    <input type="text" placeholder="Search location..." className="GlassCheckout-searchInput" value={mapSearchTerm} onChange={(e) => setMapSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchLocation()} />
                    <button className="GlassCheckout-searchButton" onClick={searchLocation} disabled={isCalculatingDistance}>Search</button>
                  </div>
                </div>
                <div className="GlassCheckout-mapInstructions"><p>💡 Click on map to select delivery location. Blue marker is our warehouse at Shanthi Garden, Alubomulla.</p></div>
                {!mapLoaded ? <div className="GlassCheckout-mapLoading"><p>Loading map...</p></div> : <div id="location-picker-map" className="GlassCheckout-mapContainer"></div>}
              </div>
              <div className="GlassCheckout-modalFooter">
                <button className="GlassCheckout-modalCancel" onClick={() => setShowLocationPicker(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <div className="GlassCheckout-modalOverlay">
            <div className="GlassCheckout-modal">
              <div className="GlassCheckout-modalHeader">
                <h2>Payment Details</h2>
                <button className="GlassCheckout-modalClose" onClick={() => setShowPaymentModal(false)}>×</button>
              </div>
              <div className="GlassCheckout-modalBody">
                <div className="GlassCheckout-paymentAmount"><span>Total Amount:</span><strong>Rs {grandTotalLKR.toFixed(2)} (${grandTotalUSD.toFixed(2)})</strong></div>
                <div className="GlassCheckout-paymentMethods">
                  <h3>Select Payment Method</h3>
                  <label className="GlassCheckout-paymentOption">
                    <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="GlassCheckout-paymentIcon">💳</span>
                    <div><strong>Credit/Debit Card</strong><small>Visa, MasterCard, Amex</small></div>
                  </label>
                  <label className="GlassCheckout-paymentOption">
                    <input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="GlassCheckout-paymentIcon">🏦</span>
                    <div><strong>Bank Transfer</strong><small>Direct bank payment</small></div>
                  </label>
                  <label className="GlassCheckout-paymentOption">
                    <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === "cash"} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="GlassCheckout-paymentIcon">💵</span>
                    <div><strong>Cash on Delivery/Pickup</strong><small>Pay when you receive</small></div>
                  </label>
                  <label className="GlassCheckout-paymentOption">
                    <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === "paypal"} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="GlassCheckout-paymentIcon">🅿️</span>
                    <div><strong>PayPal</strong><small>Pay with PayPal account</small></div>
                  </label>
                </div>
                {paymentMethod === "paypal" && <div id="paypal-button-container" className="GlassCheckout-paypalContainer"></div>}
                <div className="GlassCheckout-orderSummary"><h3>Order Summary</h3><p>Items: {selectedItems.length} | Weight: {totalWeight.toFixed(1)} kg | {deliveryMethod === "pickup" ? "Self Pickup" : "Home Delivery"}</p></div>
              </div>
              <div className="GlassCheckout-modalFooter">
                <button className="GlassCheckout-modalCancel" onClick={() => { setShowPaymentModal(false); setPaymentMethod(""); setPaypalRendered(false); }}>Cancel</button>
                {paymentMethod !== "paypal" && paymentMethod !== "" && <button className="GlassCheckout-modalConfirm" onClick={handlePaymentConfirm}>Confirm & Pay</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GlassOrderCheckout;