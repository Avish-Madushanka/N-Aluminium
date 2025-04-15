import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import './AdCalendar.css';

const AdCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [timeSlot, setTimeSlot] = useState(null);
  const [materialType, setMaterialType] = useState(null);
  const [estimatedWeight, setEstimatedWeight] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [contactDetails, setContactDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const materialTypes = [
    {
      id: "cans",
      name: "Aluminum Cans",
      rate: "$0.55/lb",
      description: "Beverage cans, food cans",
      icon: "🥫"
    },
    {
      id: "extrusions",
      name: "Extrusions",
      rate: "$0.65/lb",
      description: "Window frames, door frames",
      icon: "🪟"
    },
    {
      id: "siding",
      name: "Siding & Gutters",
      rate: "$0.70/lb",
      description: "Home siding, gutters, downspouts",
      icon: "🏠"
    },
    {
      id: "industrial",
      name: "Industrial Scrap",
      rate: "$0.85/lb",
      description: "Machine parts, industrial offcuts",
      icon: "⚙️"
    },
    {
      id: "wheels",
      name: "Wheels & Rims",
      rate: "$0.75/lb",
      description: "Aluminum wheels, automotive rims",
      icon: "🛞"
    },
    {
      id: "mixed",
      name: "Mixed Aluminum",
      rate: "$0.60/lb",
      description: "Assorted aluminum items",
      icon: "🔄"
    }
  ];

  const timeSlots = [
    { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning" },
    { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday" },
    { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon" },
    { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening" }
  ];

  useEffect(() => {
    if (bookingConfirmed) {
      setBookingId(`AL${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [bookingConfirmed]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return { year, month, startingDay, daysInMonth };
  };

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const isCollectionDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
  };

  const handleDateSelect = (day) => {
    if (isPastDate(day) || !isCollectionDay(day)) return;
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setBookingStep(1);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return `${daysOfWeek[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const resetForm = () => {
    setSelectedDate(null);
    setTimeSlot(null);
    setMaterialType(null);
    setEstimatedWeight("");
    setPickupLocation("");
    setContactDetails({
      name: "",
      phone: "",
      email: ""
    });
    setBookingStep(0);
    setBookingConfirmed(false);
    setBookingId("");
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
  };

  const nextStep = () => {
    setBookingStep(bookingStep + 1);
  };

  const prevStep = () => {
    setBookingStep(bookingStep - 1);
  };

  const renderCalendar = () => {
    const { startingDay, daysInMonth } = getMonthData();
    const calendarDays = [];
    
    // Empty cells for days before first day of month
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      
      calendarDays.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isPast ? 'past' : ''} ${!isCollection ? 'no-collection' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => (!isPast && isCollection) && handleDateSelect(day)}
        >
          <span className="day-number">{day}</span>
          {isCollection && !isPast && <span className="collection-dot"></span>}
        </div>
      );
    }
    
    return calendarDays;
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 0:
        return (
          <div className="calendar-container">
            <div className="calendar-header">
              <button onClick={goToPrevMonth} className="nav-button">
                <ChevronLeft size={20} />
              </button>
              <h2 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <button onClick={goToNextMonth} className="nav-button">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="weekday-header">
              {daysOfWeek.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="calendar-grid">
              {renderCalendar()}
            </div>
            
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-dot collection"></span>
                <span>Collection Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot no-collection"></span>
                <span>No Collection</span>
              </div>
            </div>
            
            <div className="calendar-info">
              <AlertTriangle size={16} className="info-icon" />
              <p>Collections are available on Monday, Wednesday, and Friday</p>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="step-container">
            <h2 className="step-title">Select Time Slot</h2>
            <p className="selected-date">{formatDate(selectedDate)}</p>
            
            <div className="time-slots">
              {timeSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={`time-slot ${timeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => setTimeSlot(slot.id)}
                >
                  <Clock size={18} className="slot-icon" />
                  <div className="slot-details">
                    <h3>{slot.label}</h3>
                    <p>{slot.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="step-navigation">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!timeSlot}
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-container">
            <h2 className="step-title">Select Material Type</h2>
            
            <div className="material-grid">
              {materialTypes.map(material => (
                <div 
                  key={material.id}
                  className={`material-card ${materialType === material.id ? 'selected' : ''}`}
                  onClick={() => setMaterialType(material.id)}
                >
                  <span className="material-icon">{material.icon}</span>
                  <h3>{material.name}</h3>
                  <p className="material-rate">{material.rate}</p>
                  <p className="material-desc">{material.description}</p>
                </div>
              ))}
            </div>
            
            <div className="step-navigation">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!materialType}
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-container">
            <h2 className="step-title">Collection Details</h2>
            
            <div className="form-container">
              <div className="form-group">
                <label>Estimated Weight (lbs)</label>
                <input 
                  type="number" 
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(e.target.value)}
                  placeholder="Enter estimated weight in pounds"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Pickup Location</label>
                <textarea 
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Address or description of pickup location"
                  className="form-textarea"
                ></textarea>
              </div>
              
              <div className="form-info">
                <Info size={16} className="info-icon" />
                <p>Our team will provide more accurate pricing upon pickup based on actual weight</p>
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!estimatedWeight || !pickupLocation}
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="step-container">
            <h2 className="step-title">Contact Information</h2>
            
            <div className="form-container">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={contactDetails.name}
                  onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                  placeholder="Enter your email address"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!contactDetails.name || !contactDetails.phone || !contactDetails.email}
              >
                Review Details
              </button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="step-container">
            <h2 className="step-title">Review & Confirm</h2>
            
            <div className="booking-summary">
              <div className="summary-item">
                <Calendar size={20} className="summary-icon" />
                <div>
                  <h3>Collection Date & Time</h3>
                  <p>{formatDate(selectedDate)}</p>
                  <p>{timeSlots.find(slot => slot.id === timeSlot)?.time}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <Recycle size={20} className="summary-icon" />
                <div>
                  <h3>Material Details</h3>
                  <p>{materialTypes.find(mat => mat.id === materialType)?.name}</p>
                  <p>Estimated weight: {estimatedWeight} lbs</p>
                  <p>Estimated value: {(parseFloat(estimatedWeight || 0) * parseFloat(materialTypes.find(mat => mat.id === materialType)?.rate.replace('$', '') || 0)).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <MapPin size={20} className="summary-icon" />
                <div>
                  <h3>Pickup Location</h3>
                  <p>{pickupLocation}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <Info size={20} className="summary-icon" />
                <div>
                  <h3>Contact Information</h3>
                  <p>{contactDetails.name}</p>
                  <p>{contactDetails.phone}</p>
                  <p>{contactDetails.email}</p>
                </div>
              </div>
            </div>
            
            <div className="step-navigation">
              <button className="back-button" onClick={prevStep}>Edit Details</button>
              <button className="confirm-button" onClick={confirmBooking}>
                Confirm Collection
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmed">
        <div className="confirmation-icon">
          <CheckCircle size={64} />
        </div>
        <h2>Collection Scheduled!</h2>
        <p className="booking-id">Booking ID: {bookingId}</p>
        
        <div className="confirmation-details">
          <div className="confirmation-item">
            <Calendar size={20} className="confirmation-icon" />
            <div>
              <h3>Date & Time</h3>
              <p>{formatDate(selectedDate)}</p>
              <p>{timeSlots.find(slot => slot.id === timeSlot)?.time}</p>
            </div>
          </div>
          
          <div className="confirmation-item">
            <Truck size={20} className="confirmation-icon" />
            <div>
              <h3>Collection Details</h3>
              <p>{materialTypes.find(mat => mat.id === materialType)?.name}</p>
              <p>Estimated weight: {estimatedWeight} lbs</p>
            </div>
          </div>
          
          <div className="confirmation-item">
            <MapPin size={20} className="confirmation-icon" />
            <div>
              <h3>Pickup Location</h3>
              <p>{pickupLocation}</p>
            </div>
          </div>
        </div>
        
        <div className="confirmation-message">
          <p>We have sent a confirmation email to {contactDetails.email} with all the details.</p>
          <p>Our team will arrive during the scheduled time window. Please ensure your aluminum scrap is readily accessible.</p>
        </div>
        
        <button className="new-booking-button" onClick={resetForm}>
          Schedule Another Collection
        </button>
      </div>
    );
  }

  return (
    <div className="scrap-calendar-container">
      <div className="header">
        <div className="header-icon-container">
          <Recycle size={24} className="header-icon" />
        </div>
        <h1>Aluminum Scrap Collection</h1>
      </div>
      
      <div className="progress-tracker">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`progress-step ${i === bookingStep ? 'active' : i < bookingStep ? 'completed' : ''}`}
          >
            {i < bookingStep ? <CheckCircle size={16} /> : i === bookingStep ? <span className="step-number">{i + 1}</span> : ''}
          </div>
        ))}
      </div>
      
      <div className="booking-content">
        {renderBookingStep()}
      </div>
    </div>
  );
};

export default AdCalendar;