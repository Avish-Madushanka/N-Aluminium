import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Recycle,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  User,
  Phone,
  Mail,
  Package,
  Weight,
} from 'lucide-react';
import './USerCalendar.css';

const defaultAdminSettings = {
  availableDays: { 0: false, 1: true, 2: false, 3: true, 4: false, 5: true, 6: false },
  timeSlots: [
    { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning", active: true },
    { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
    { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon", active: true },
    { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: false }
  ],
  serviceAreas: [
    { id: "downtown", name: "Downtown Core", active: true },
    { id: "north", name: "North Side", active: true },
    { id: "south", name: "South Side", active: false },
    { id: "east", name: "East End", active: true },
    { id: "west", name: "West End", active: true }
  ],
  specialDates: []
};

const materialTypesData = [
  { id: "cans", name: "Aluminum Cans", rate: "$1.21/kg", description: "Beverage/food cans", icon: "🥫" },
  { id: "extrusions", name: "Extrusions", rate: "$1.43/kg", description: "Window/door frames", icon: "🪟" },
  { id: "siding", name: "Siding & Gutters", rate: "$1.54/kg", description: "Home siding, gutters", icon: "🏠" },
  { id: "industrial", name: "Industrial Scrap", rate: "$1.87/kg", description: "Machine parts, offcuts", icon: "⚙️" },
  { id: "wheels", name: "Wheels & Rims", rate: "$1.65/kg", description: "Aluminum car wheels", icon: "🛞" },
  { id: "mixed", name: "Mixed Aluminum", rate: "$1.32/kg", description: "Assorted items", icon: "🔄" }
];

const formatWeight = (weightValue) => {
    if (!weightValue || isNaN(parseFloat(weightValue))) return "N/A";
    return `${parseFloat(weightValue)} kg`;
};

const UserCalendar = ({ adminSettings }) => {
  const settings = useMemo(() => ({
    ...defaultAdminSettings,
    ...adminSettings,
    timeSlots: adminSettings?.timeSlots || defaultAdminSettings.timeSlots,
    serviceAreas: adminSettings?.serviceAreas || defaultAdminSettings.serviceAreas,
    specialDates: adminSettings?.specialDates || defaultAdminSettings.specialDates,
    availableDays: adminSettings?.availableDays || defaultAdminSettings.availableDays,
  }), [adminSettings]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [timeSlot, setTimeSlot] = useState(null);
  const [serviceArea, setServiceArea] = useState(null);
  const [materialType, setMaterialType] = useState(null);
  const [estimatedWeight, setEstimatedWeight] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [contactDetails, setContactDetails] = useState({ name: "", phone: "", email: "" });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const activeTimeSlots = useMemo(() => settings.timeSlots.filter(slot => slot.active), [settings.timeSlots]);
  const activeServiceAreas = useMemo(() => settings.serviceAreas.filter(area => area.active), [settings.serviceAreas]);

  useEffect(() => {
    if (bookingConfirmed) {
      const datePart = selectedDate ? selectedDate.toISOString().slice(5, 10).replace('-', '') : '0000';
      const randomPart = Math.floor(100 + Math.random() * 900);
      setBookingId(`ALU-${datePart}-${randomPart}`);
    }
  }, [bookingConfirmed, selectedDate]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, startingDayOfWeek, daysInMonth };
  };

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isPastDate = (day, month, year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  const getSpecialDateStatus = (day, month, year) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return settings.specialDates.find(d => d.date === dateStr);
  };

  const isCollectionDay = (day, month, year) => {
    if (isPastDate(day, month, year)) return false;

    const specialDate = getSpecialDateStatus(day, month, year);
    if (specialDate) {
      return specialDate.status === 'available';
    }

    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return settings.availableDays[dayOfWeek];
  };

  const handleDateSelect = (day, month, year) => {
    if (!isCollectionDay(day, month, year)) return;
    setSelectedDate(new Date(year, month, day));
    setBookingStep(1);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return `${daysOfWeek[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const resetForm = () => {
    setSelectedDate(null);
    setTimeSlot(null);
    setServiceArea(null);
    setMaterialType(null);
    setEstimatedWeight("");
    setPickupLocation("");
    setContactDetails({ name: "", phone: "", email: "" });
    setBookingStep(0);
    setBookingConfirmed(false);
    setBookingId("");
    setCurrentDate(new Date());
  };

  const confirmBooking = () => {
    console.log("Booking Confirmed Data:", {
        selectedDate, timeSlot, serviceArea, materialType, estimatedWeight, pickupLocation, contactDetails
    });
    setBookingConfirmed(true);
  };

  const nextStep = () => setBookingStep(prev => prev + 1);
  const prevStep = () => setBookingStep(prev => prev - 1);

  const renderCalendar = () => {
    const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
    const calendarDays = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
      const isPast = isPastDate(day, month, year);
      const isAvailable = isCollectionDay(day, month, year);
      const specialDate = getSpecialDateStatus(day, month, year);

      let dayClass = 'calendar-day';
      if (isPast) dayClass += ' past';
      else if (isAvailable) dayClass += ' available';
      else dayClass += ' unavailable';
      if (isSelected) dayClass += ' selected';
      if (specialDate) dayClass += ` special-${specialDate.status}`;

      calendarDays.push(
        <button
          key={`day-${day}`}
          className={dayClass}
          onClick={() => handleDateSelect(day, month, year)}
          disabled={!isAvailable}
          aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvailable ? ' (Unavailable)' : ''}`}
        >
          <span className="day-number">{day}</span>
          {specialDate && <span className="special-indicator" title={specialDate.reason}>*</span>}
        </button>
      );
    }
    return calendarDays;
  };

  const renderSummaryItem = (IconComponent, label, value) => {
      if (label === "Est. Weight") {
          value = formatWeight(value);
      }
      if (!value || value === "N/A") return null;

      return (
          <p className="summary-item">
              <IconComponent size={16} />
              <strong>{label}:</strong> {value}
          </p>
      );
  };

  const renderBookingStep = () => {
    const selectedTimeSlot = settings.timeSlots.find(slot => slot.id === timeSlot);
    const selectedServiceArea = settings.serviceAreas.find(area => area.id === serviceArea);
    const selectedMaterial = materialTypesData.find(material => material.id === materialType);

    switch (bookingStep) {
      case 0: return (
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={goToPrevMonth} className="nav-button" aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <h2 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={goToNextMonth} className="nav-button" aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="weekday-header">
            {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
          </div>
          <div className="calendar-grid">{renderCalendar()}</div>
          <div className="calendar-legend">
            <span className="legend-item available">Available</span>
            <span className="legend-item selected">Selected</span>
            <span className="legend-item unavailable">Unavailable</span>
            <span className="legend-item past">Past</span>
          </div>
          <div className="calendar-instructions">
            <Info size={16} /> Select an available collection day (highlighted) to begin scheduling.
          </div>
        </div>
      );

      case 1: return (
        <div className="step-container time-slot-selection">
          <div className="booking-step-header">
            <h2>Select Pickup Time</h2>
            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
          </div>
          <div className="options-grid time-slots-grid">
            {activeTimeSlots.map(slot => (
              <button
                key={slot.id}
                className={`option-card time-slot-card ${timeSlot === slot.id ? 'selected' : ''}`}
                onClick={() => setTimeSlot(slot.id)}
                aria-pressed={timeSlot === slot.id}
              >
                <Clock size={24} />
                <h3>{slot.label}</h3>
                <p>{slot.time}</p>
              </button>
            ))}
          </div>
          <div className="step-navigation">
            <button onClick={prevStep} className="back-button">
              <ChevronLeft size={16} /> Change Date
            </button>
            <button onClick={nextStep} className="next-button" disabled={!timeSlot}>
              Next: Service Area <ChevronRight size={16} />
            </button>
          </div>
        </div>
      );

      case 2: return (
          <div className="step-container service-area-selection">
             <div className="booking-step-header">
                <h2>Select Service Area</h2>
                 {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                 {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)}
             </div>
              <div className="options-grid service-areas-grid">
                  {activeServiceAreas.map(area => (
                      <button
                          key={area.id}
                          className={`option-card service-area-card ${serviceArea === area.id ? 'selected' : ''}`}
                          onClick={() => setServiceArea(area.id)}
                          aria-pressed={serviceArea === area.id}
                      >
                          <MapPin size={24} />
                          <h3>{area.name}</h3>
                      </button>
                  ))}
              </div>
              <div className="step-navigation">
                  <button onClick={prevStep} className="back-button">
                      <ChevronLeft size={16} /> Change Time
                  </button>
                  <button onClick={nextStep} className="next-button" disabled={!serviceArea}>
                      Next: Material Type <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      );

       case 3: return (
          <div className="step-container material-selection">
              <div className="booking-step-header">
                  <h2>Select Material Type</h2>
                  {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                  {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)}
                  {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
              </div>
              <div className="options-grid materials-grid">
                  {materialTypesData.map(material => (
                      <button
                          key={material.id}
                          className={`option-card material-card ${materialType === material.id ? 'selected' : ''}`}
                          onClick={() => setMaterialType(material.id)}
                          aria-pressed={materialType === material.id}
                      >
                          <span className="material-icon">{material.icon}</span>
                          <h3>{material.name}</h3>
                          <p className="material-rate">{material.rate}</p>
                          <p className="material-desc">{material.description}</p>
                      </button>
                  ))}
              </div>
              <div className="step-navigation">
                  <button onClick={prevStep} className="back-button">
                      <ChevronLeft size={16} /> Change Area
                  </button>
                  <button onClick={nextStep} className="next-button" disabled={!materialType}>
                      Next: Details <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      );

      case 4: return (
          <div className="step-container details-collection">
              <div className="booking-step-header">
                  <h2>Pickup & Contact Details</h2>
                   {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                   {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)}
                   {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
                   {renderSummaryItem(Recycle, "Material", selectedMaterial?.name)}
              </div>
              <div className="pickup-details-form">
                  <div className="form-section">
                      <h3><Truck size={18} /> Pickup Information</h3>
                      <div className="form-field">
                          <label htmlFor="pickupLocation">Pickup Address*</label>
                          <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Full address for pickup" required aria-required="true"/>
                      </div>
                      <div className="form-field">
                          <label htmlFor="weight">Estimated Weight (kg)</label>
                          <input type="number" id="weight" value={estimatedWeight} onChange={(e) => setEstimatedWeight(e.target.value)} placeholder="Approximate weight in kg (optional)" min="0" step="0.1" />
                      </div>
                  </div>
                  <div className="form-section">
                      <h3><User size={18} /> Contact Information</h3>
                      <div className="form-field">
                          <label htmlFor="name">Full Name*</label>
                          <input type="text" id="name" value={contactDetails.name} onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})} placeholder="Your full name" required aria-required="true"/>
                      </div>
                       <div className="form-field">
                          <label htmlFor="phone">Phone Number*</label>
                          <input type="tel" id="phone" value={contactDetails.phone} onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})} placeholder="e.g., 555-123-4567" required aria-required="true"/>
                      </div>
                      <div className="form-field">
                          <label htmlFor="email">Email Address*</label>
                          <input type="email" id="email" value={contactDetails.email} onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})} placeholder="you@example.com" required aria-required="true"/>
                      </div>
                  </div>
              </div>
              <div className="step-navigation">
                  <button onClick={prevStep} className="back-button">
                      <ChevronLeft size={16} /> Change Material
                  </button>
                  <button
                      onClick={nextStep}
                      className="next-button"
                      disabled={!pickupLocation || !contactDetails.name || !contactDetails.phone || !contactDetails.email}
                  >
                      Review Booking <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      );

      case 5: return bookingConfirmed ? (
        <div className="step-container booking-confirmation">
            <div className="confirmation-header">
                <CheckCircle size={48} className="confirmation-icon" />
                <h2>Booking Confirmed!</h2>
                <p className="booking-id">Booking ID: <strong>{bookingId}</strong></p>
            </div>
            <div className="confirmation-details review-details">
                 <div className="review-section confirmation-section">
                    <h3><Calendar size={18} /> Pickup Details</h3>
                    {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                    {renderSummaryItem(Clock, "Time", selectedTimeSlot?.time)}
                    {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
                    {renderSummaryItem(Truck, "Address", pickupLocation)}
                 </div>
                 <div className="review-section confirmation-section">
                    <h3><Recycle size={18} /> Material Details</h3>
                    {renderSummaryItem(Package, "Type", selectedMaterial?.name)}
                    {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                    {renderSummaryItem(Info, "Est. Rate", selectedMaterial?.rate)}
                 </div>
                  <div className="review-section confirmation-section">
                    <h3><User size={18} /> Contact Info</h3>
                    {renderSummaryItem(User, "Name", contactDetails.name)}
                    {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                    {renderSummaryItem(Mail, "Email", contactDetails.email)}
                 </div>
            </div>
            <div className="confirmation-instructions">
                <AlertTriangle size={16} /> A confirmation email has been sent to {contactDetails.email}. Please keep your Booking ID for reference.
            </div>
            <button onClick={resetForm} className="new-booking-button">
                <Plus size={16} /> Schedule Another Pickup
            </button>
        </div>
      ) : (
        <div className="step-container booking-review">
            <div className="booking-step-header">
                <h2>Review Your Booking</h2>
                <p>Please check all details before confirming.</p>
            </div>
             <div className="review-details">
                 <div className="review-section">
                    <h3><Calendar size={18} /> Pickup Details</h3>
                    {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                    {renderSummaryItem(Clock, "Time", selectedTimeSlot?.time)}
                    {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
                    {renderSummaryItem(Truck, "Address", pickupLocation)}
                 </div>
                 <div className="review-section">
                    <h3><Recycle size={18} /> Material Details</h3>
                    {renderSummaryItem(Package, "Type", selectedMaterial?.name)}
                    {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                    {renderSummaryItem(Info, "Est. Rate", selectedMaterial?.rate)}
                 </div>
                  <div className="review-section">
                    <h3><User size={18} /> Contact Info</h3>
                    {renderSummaryItem(User, "Name", contactDetails.name)}
                    {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                    {renderSummaryItem(Mail, "Email", contactDetails.email)}
                 </div>
            </div>
            <div className="step-navigation review-actions">
                <button onClick={prevStep} className="back-button">
                    <ChevronLeft size={16} /> Edit Details
                </button>
                <button onClick={confirmBooking} className="confirm-button">
                    <CheckCircle size={16} /> Confirm Booking
                </button>
            </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="user-calendar-wrapper">
      <div className="user-calendar-container">
        <div className="user-header">
          <h1>Schedule Aluminum Recycling Pickup</h1>
        </div>

        {bookingStep >= 0 && bookingStep < 5 && (
          <div className="booking-progress">
            <div className="progress-bar">
              <div className="progress-steps">
                {['Date', 'Time', 'Area', 'Material', 'Details', 'Confirm'].map((label, index) => (
                   <div
                        key={label}
                        className={`progress-step ${bookingStep > index ? 'completed' : ''} ${bookingStep === index ? 'active' : ''}`}
                    >
                       <div className="step-circle">
                           {bookingStep > index ? <CheckCircle size={16} /> : index + 1}
                       </div>
                       <span className="step-label">{label}</span>
                   </div>
                ))}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${bookingStep * (100 / 5)}%` }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="booking-content">
          {renderBookingStep()}
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;