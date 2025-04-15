import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck, CheckCircle, AlertTriangle, Info, Plus } from 'lucide-react';
import './Calendar.css';

const UserCalendar = ({ adminSettings }) => {
  const defaultSettings = {
    availableDays: {
      0: false,
      1: true,
      2: false,
      3: true,
      4: false,
      5: true,
      6: false
    },
    timeSlots: [
      { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning", active: true },
      { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
      { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon", active: true },
      { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: true }
    ],
    serviceAreas: [
      { id: "downtown", name: "Downtown", active: true },
      { id: "north", name: "North Side", active: true },
      { id: "south", name: "South Side", active: true },
      { id: "east", name: "East Side", active: true },
      { id: "west", name: "West Side", active: true }
    ],
    specialDates: []
  };

  const settings = adminSettings || defaultSettings;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [timeSlot, setTimeSlot] = useState(null);
  const [serviceArea, setServiceArea] = useState(null);
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

  const activeTimeSlots = settings.timeSlots.filter(slot => slot.active);
  const activeServiceAreas = settings.serviceAreas.filter(area => area.active);

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
    if (isPastDate(day)) {
      return false;
    }
    
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    const specialDate = settings.specialDates.find(d => d.date === dateStr);
    if (specialDate) {
      return specialDate.status === 'available';
    }
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return settings.availableDays[dayOfWeek];
  };

  const handleDateSelect = (day) => {
    if (!isCollectionDay(day)) return;
    
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
    setServiceArea(null);
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
    
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }
    
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
          onClick={() => isCollection && handleDateSelect(day)}
        >
          <span className="day-number">{day}</span>
          {isCollection && <span className="collection-dot"></span>}
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
            
            <div className="calendar-instructions">
              <Info size={16} />
              <p>Select an available collection day to schedule your pickup.</p>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="time-slot-selection">
            <div className="booking-step-header">
              <h2>Select a Time Slot</h2>
              <p className="selected-date">
                <Calendar size={16} />
                <span>{formatDate(selectedDate)}</span>
              </p>
            </div>
            
            <div className="time-slots-grid">
              {activeTimeSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={`time-slot-card ${timeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => setTimeSlot(slot.id)}
                >
                  <Clock size={20} />
                  <h3>{slot.label}</h3>
                  <p>{slot.time}</p>
                </div>
              ))}
            </div>
            
            <div className="step-navigation">
              <button onClick={prevStep} className="back-button">
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                onClick={nextStep} 
                className="next-button" 
                disabled={!timeSlot}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="service-area-selection">
            <div className="booking-step-header">
              <h2>Select Service Area</h2>
              <p className="booking-summary">
                <Calendar size={16} />
                <span>{formatDate(selectedDate)}</span>
                <Clock size={16} />
                <span>{settings.timeSlots.find(slot => slot.id === timeSlot)?.label}</span>
              </p>
            </div>
            
            <div className="service-areas-grid">
              {activeServiceAreas.map(area => (
                <div 
                  key={area.id}
                  className={`service-area-card ${serviceArea === area.id ? 'selected' : ''}`}
                  onClick={() => setServiceArea(area.id)}
                >
                  <MapPin size={20} />
                  <h3>{area.name}</h3>
                </div>
              ))}
            </div>
            
            <div className="step-navigation">
              <button onClick={prevStep} className="back-button">
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                onClick={nextStep} 
                className="next-button" 
                disabled={!serviceArea}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="material-selection">
            <div className="booking-step-header">
              <h2>Select Material Type</h2>
              <p className="booking-summary">
                <Calendar size={16} />
                <span>{formatDate(selectedDate)}</span>
                <Clock size={16} />
                <span>{settings.timeSlots.find(slot => slot.id === timeSlot)?.label}</span>
                <MapPin size={16} />
                <span>{settings.serviceAreas.find(area => area.id === serviceArea)?.name}</span>
              </p>
            </div>
            
            <div className="materials-grid">
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
              <button onClick={prevStep} className="back-button">
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                onClick={nextStep} 
                className="next-button" 
                disabled={!materialType}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="details-collection">
            <div className="booking-step-header">
              <h2>Pickup Details</h2>
              <p className="booking-summary">
                <Calendar size={16} />
                <span>{formatDate(selectedDate)}</span>
                <Clock size={16} />
                <span>{settings.timeSlots.find(slot => slot.id === timeSlot)?.label}</span>
                <MapPin size={16} />
                <span>{settings.serviceAreas.find(area => area.id === serviceArea)?.name}</span>
                <Recycle size={16} />
                <span>{materialTypes.find(material => material.id === materialType)?.name}</span>
              </p>
            </div>
            
            <div className="pickup-details-form">
              <div className="form-section">
                <h3><Truck size={16} /> Pickup Information</h3>
                
                <div className="form-field">
                  <label htmlFor="pickupLocation">Pickup Address</label>
                  <input 
                    type="text" 
                    id="pickupLocation"
                    value={pickupLocation} 
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Full address for pickup"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="weight">Estimated Weight (lbs)</label>
                  <input 
                    type="number" 
                    id="weight"
                    value={estimatedWeight} 
                    onChange={(e) => setEstimatedWeight(e.target.value)}
                    placeholder="Approximate weight in pounds"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3><Info size={16} /> Contact Information</h3>
                
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    value={contactDetails.name} 
                    onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    value={contactDetails.phone} 
                    onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    value={contactDetails.email} 
                    onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                    placeholder="Your email address"
                  />
                </div>
              </div>
            </div>
            
            <div className="step-navigation">
              <button onClick={prevStep} className="back-button">
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                onClick={nextStep} 
                className="next-button" 
                disabled={!pickupLocation || !contactDetails.name || !contactDetails.phone || !contactDetails.email}
              >
                Review & Confirm
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 5:
        return bookingConfirmed ? (
          <div className="booking-confirmation">
            <div className="confirmation-header">
              <CheckCircle size={40} className="confirmation-icon" />
              <h2>Booking Confirmed!</h2>
              <p className="booking-id">Booking ID: {bookingId}</p>
            </div>
            
            <div className="confirmation-details">
              <div className="confirmation-section">
                <h3>Pickup Details</h3>
                <p>
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <strong>Time:</strong> {settings.timeSlots.find(slot => slot.id === timeSlot)?.time}
                </p>
                <p>
                  <strong>Location:</strong> {pickupLocation}
                </p>
                <p>
                  <strong>Service Area:</strong> {settings.serviceAreas.find(area => area.id === serviceArea)?.name}
                </p>
              </div>
              
              <div className="confirmation-section">
                <h3>Material Information</h3>
                <p>
                  <strong>Type:</strong> {materialTypes.find(material => material.id === materialType)?.name}
                </p>
                <p>
                  <strong>Estimated Weight:</strong> {estimatedWeight} lbs
                </p>
                <p>
                  <strong>Estimated Rate:</strong> {materialTypes.find(material => material.id === materialType)?.rate}
                </p>
              </div>
              
              <div className="confirmation-section">
                <h3>Contact Information</h3>
                <p>
                  <strong>Name:</strong> {contactDetails.name}
                </p>
                <p>
                  <strong>Phone:</strong> {contactDetails.phone}
                </p>
                <p>
                  <strong>Email:</strong> {contactDetails.email}
                </p>
              </div>
            </div>
            
            <div className="confirmation-instructions">
              <AlertTriangle size={16} />
              <p>A confirmation email has been sent to your email address. Please have your booking ID ready for the pickup.</p>
            </div>
            
            <button onClick={resetForm} className="new-booking-button">
              <Plus size={16} />
              Schedule Another Pickup
            </button>
          </div>
        ) : (
          <div className="booking-review">
            <div className="booking-step-header">
              <h2>Review & Confirm</h2>
            </div>
            
            <div className="review-details">
              <div className="review-section">
                <h3>Pickup Details</h3>
                <p>
                  <Calendar size={16} />
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <Clock size={16} />
                  <strong>Time:</strong> {settings.timeSlots.find(slot => slot.id === timeSlot)?.time}
                </p>
                <p>
                  <MapPin size={16} />
                  <strong>Service Area:</strong> {settings.serviceAreas.find(area => area.id === serviceArea)?.name}
                </p>
                <p>
                  <Truck size={16} />
                  <strong>Address:</strong> {pickupLocation}
                </p>
              </div>
              
              <div className="review-section">
                <h3>Material Information</h3>
                <p>
                  <Recycle size={16} />
                  <strong>Type:</strong> {materialTypes.find(material => material.id === materialType)?.name}
                </p>
                <p>
                  <strong>Estimated Weight:</strong> {estimatedWeight} lbs
                </p>
                <p>
                  <strong>Estimated Rate:</strong> {materialTypes.find(material => material.id === materialType)?.rate}
                </p>
              </div>
              
              <div className="review-section">
                <h3>Contact Information</h3>
                <p>
                  <strong>Name:</strong> {contactDetails.name}
                </p>
                <p>
                  <strong>Phone:</strong> {contactDetails.phone}
                </p>
                <p>
                  <strong>Email:</strong> {contactDetails.email}
                </p>
              </div>
            </div>
            
            <div className="step-navigation review-actions">
              <button onClick={prevStep} className="back-button">
                <ChevronLeft size={16} />
                Edit Details
              </button>
              <button onClick={confirmBooking} className="confirm-button">
                <CheckCircle size={16} />
                Confirm Booking
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="user-calendar-container">
      <div className="user-header">
        <div className="header-icon-container">
          <Recycle size={24} className="header-icon" />
        </div>
        <h1>Schedule Aluminum Recycling Pickup</h1>
      </div>
      
      <div className="booking-progress">
        {bookingStep > 0 && !bookingConfirmed && (
          <div className="progress-bar">
            <div className="progress-steps">
              <div className={`progress-step ${bookingStep >= 1 ? 'active' : ''} ${bookingStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <span className="step-label">Date</span>
              </div>
              <div className={`progress-step ${bookingStep >= 2 ? 'active' : ''} ${bookingStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <span className="step-label">Area</span>
              </div>
              <div className={`progress-step ${bookingStep >= 3 ? 'active' : ''} ${bookingStep > 3 ? 'completed' : ''}`}>
                <div className="step-circle">3</div>
                <span className="step-label">Material</span>
              </div>
              <div className={`progress-step ${bookingStep >= 4 ? 'active' : ''} ${bookingStep > 4 ? 'completed' : ''}`}>
                <div className="step-circle">4</div>
                <span className="step-label">Details</span>
              </div>
              <div className={`progress-step ${bookingStep >= 5 ? 'active' : ''}`}>
                <div className="step-circle">5</div>
                <span className="step-label">Confirm</span>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(bookingStep - 1) * 25}%` }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="booking-content">
        {renderBookingStep()}
      </div>
    </div>
  );
};

export default UserCalendar;