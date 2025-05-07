import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, Plus, User, Phone, Mail, Package, Weight, Loader2
} from 'lucide-react';
import './USerCalendar.css'; // Assuming your CSS is in this file with updated class names
import API_ENDPOINTS from '../../apiConfig';

// Base URL for your backend API - Using centralized config
const API_BASE_URL = API_ENDPOINTS.API_ROOT;

// --- Default structure (used as fallback if API fails or during initial load) ---
const fallbackSettings = {
    availableDays: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
    timeSlots: [],
    serviceAreas: [],
    specialDates: []
};

const formatWeight = (weightValue) => {
    if (!weightValue || isNaN(parseFloat(weightValue))) return "N/A";
    const weight = parseFloat(weightValue);
    if (weight < 0) return "Invalid";
    return `${weight.toFixed(1)} kg`;
};

const UserCalendar = () => {
    // --- State for fetched data ---
    const [backendSettings, setBackendSettings] = useState(null);
    const [backendMaterials, setBackendMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Component State ---
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

    // --- Fetch Settings and Materials on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [settingsResponse, materialsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/settings`),
                    fetch(`${API_BASE_URL}/materials`)
                ]);

                if (!settingsResponse.ok) {
                    const errData = await settingsResponse.json().catch(() => ({}));
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status} ${errData.message || 'Server error'}`);
                }
                 if (!materialsResponse.ok) {
                    const errData = await materialsResponse.json().catch(() => ({}));
                    throw new Error(`Failed to fetch materials: ${materialsResponse.status} ${errData.message || 'Server error'}`);
                }

                const settingsData = await settingsResponse.json();
                const materialsData = await materialsResponse.json();

                if (settingsData.success && settingsData.data) {
                     const availableDaysObject = settingsData.data.availableDays instanceof Map
                        ? Object.fromEntries(settingsData.data.availableDays)
                        : settingsData.data.availableDays || {};
                    setBackendSettings({ ...settingsData.data, availableDays: availableDaysObject });
                } else {
                     throw new Error(settingsData.message || 'Failed to get valid settings data');
                }

                if (materialsData.success && materialsData.data) {
                    setBackendMaterials(materialsData.data);
                } else {
                     throw new Error(materialsData.message || 'Failed to get valid materials data');
                }

            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError(err.message || 'Could not load scheduling options. Please try refreshing.');
                setBackendSettings(null);
                setBackendMaterials([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Derived State (using fetched data) ---
    const settings = useMemo(() => {
        const base = backendSettings || fallbackSettings;
        return {
            ...base,
            timeSlots: base.timeSlots || [],
            serviceAreas: base.serviceAreas || [],
            specialDates: base.specialDates || [],
            availableDays: base.availableDays || {},
        };
    }, [backendSettings]);

    const activeTimeSlots = useMemo(() => settings.timeSlots.filter(slot => slot.active), [settings.timeSlots]);
    const activeServiceAreas = useMemo(() => settings.serviceAreas.filter(area => area.active), [settings.serviceAreas]);

    // --- Date/Calendar Logic ---
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
        const dayOfWeek = date.getDay().toString();
        return settings.availableDays[dayOfWeek] === true;
    };

    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        setSelectedDate(new Date(year, month, day));
        setBookingStep(1);
        setError(null);
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
        setError(null);
        setIsSubmitting(false);
    };

    // --- Submit Booking to Backend ---
    const confirmBooking = async () => {
        setIsSubmitting(true);
        setError(null);

        const bookingData = {
            selectedDate: selectedDate ? selectedDate.toISOString() : null,
            timeSlotId: timeSlot,
            serviceAreaId: serviceArea,
            materialTypeId: materialType,
            estimatedWeight: estimatedWeight || null,
            pickupLocation: pickupLocation,
            contactDetails: contactDetails
        };

        console.log("Submitting Booking Data:", JSON.stringify(bookingData, null, 2));

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `HTTP error ${response.status}`);
            }

            if (responseData.success && responseData.data && responseData.data.bookingId) {
                setBookingId(responseData.data.bookingId);
                setBookingConfirmed(true);
            } else {
                 throw new Error(responseData.message || 'Booking failed. Invalid response from server.');
            }

        } catch (err) {
            console.error("Booking Submission Error:", err);
            setError(`Booking failed: ${err.message}. Please review details or try again later.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setBookingStep(prev => prev + 1);
    const prevStep = () => {
        setBookingStep(prev => prev - 1);
        setError(null);
    }

    // --- Render Functions ---
    const renderCalendar = () => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="UCal-calendar-day UCal-empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            const isAvailable = isCollectionDay(day, month, year);
            const isPast = isPastDate(day, month, year);
            const specialDate = getSpecialDateStatus(day, month, year);

            let dayClass = 'UCal-calendar-day';
            if (isPast) {
                dayClass += ' UCal-past';
            } else if (isAvailable) {
                dayClass += ' UCal-available';
            } else {
                dayClass += ' UCal-unavailable';
            }
            if (isSelected) dayClass += ' UCal-selected';
            if (specialDate) {
                dayClass += ` UCal-special-${specialDate.status}`; // e.g., UCal-special-available
            }

            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelect(day, month, year)}
                    disabled={isPast || !isAvailable}
                    aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvailable ? ' (Unavailable)' : ''}`}
                >
                    <span className="UCal-day-number">{day}</span>
                    {specialDate && <span className="UCal-special-indicator" title={specialDate.reason}>*</span>}
                </button>
            );
        }
        return calendarDays;
    };

    const renderSummaryItem = (IconComponent, label, value) => {
        if (label === "Est. Weight") {
            value = formatWeight(value);
        }
        if (!value || value === "N/A" || value === "Invalid") return null;

        return (
            <p className="UCal-summary-item">
                <IconComponent size={16} />
                <strong>{label}:</strong> {value}
            </p>
        );
    };

    // --- Main Render Logic for Steps ---
    const renderBookingStep = () => {
        const selectedTimeSlotObj = settings.timeSlots.find(slot => slot.id === timeSlot);
        const selectedServiceAreaObj = settings.serviceAreas.find(area => area.id === serviceArea);
        const selectedMaterialObj = backendMaterials.find(material => material.id === materialType);

        switch (bookingStep) {
            case 0: return ( // Calendar View
                <div className="UCal-calendar-container">
                    <div className="UCal-calendar-header">
                        <button onClick={goToPrevMonth} className="UCal-nav-button" aria-label="Previous month" disabled={isLoading}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="UCal-current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button onClick={goToNextMonth} className="UCal-nav-button" aria-label="Next month" disabled={isLoading}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="UCal-weekday-header">
                        {daysOfWeek.map(day => <div key={day} className="UCal-weekday">{day}</div>)}
                    </div>
                    <div className="UCal-calendar-grid">{isLoading ? <p>Loading days...</p> : renderCalendar()}</div>
                     <div className="UCal-calendar-legend">
                        <span className="UCal-legend-item UCal-available">Available</span>
                        <span className="UCal-legend-item UCal-selected">Selected</span>
                        <span className="UCal-legend-item UCal-unavailable">Unavailable / Booked</span>
                        <span className="UCal-legend-item UCal-past">Past</span>
                    </div>
                    <div className="UCal-calendar-instructions">
                        <Info size={16} /> Select an available collection day (green) to begin scheduling.
                    </div>
                </div>
            );

            case 1: return ( // Time Slot Selection
                <div className="UCal-step-container UCal-time-slot-selection">
                    <div className="UCal-booking-step-header">
                        <h2>Select Pickup Time Slot</h2>
                        {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                    </div>
                     {!isLoading && activeTimeSlots.length === 0 && <p className="UCal-info-message">No time slots available for this service currently.</p>}
                    <div className="UCal-options-grid UCal-time-slots-grid">
                        {activeTimeSlots.map(slot => (
                            <button
                                key={slot.id}
                                className={`UCal-option-card UCal-time-slot-card ${timeSlot === slot.id ? 'UCal-selected' : ''}`}
                                onClick={() => setTimeSlot(slot.id)}
                                aria-pressed={timeSlot === slot.id}
                            >
                                <Clock size={24} />
                                <h3>{slot.label}</h3>
                                <p>{slot.time}</p>
                            </button>
                        ))}
                    </div>
                    <div className="UCal-step-navigation">
                        <button onClick={prevStep} className="UCal-back-button">
                            <ChevronLeft size={16} /> Change Date
                        </button>
                        <button onClick={nextStep} className="UCal-next-button" disabled={!timeSlot}>
                            Next: Service Area <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            );

            case 2: return ( // Service Area Selection
                 <div className="UCal-step-container UCal-service-area-selection">
                     <div className="UCal-booking-step-header">
                        <h2>Select Your Service Area</h2>
                         {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                         {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.label)}
                     </div>
                     {!isLoading && activeServiceAreas.length === 0 && <p className="UCal-info-message">Pickups are not currently offered in any active service area.</p>}
                      <div className="UCal-options-grid UCal-service-areas-grid">
                          {activeServiceAreas.map(area => (
                              <button
                                  key={area.id}
                                  className={`UCal-option-card UCal-service-area-card ${serviceArea === area.id ? 'UCal-selected' : ''}`}
                                  onClick={() => setServiceArea(area.id)}
                                  aria-pressed={serviceArea === area.id}
                              >
                                  <MapPin size={24} />
                                  <h3>{area.name}</h3>
                              </button>
                          ))}
                      </div>
                      <div className="UCal-step-navigation">
                          <button onClick={prevStep} className="UCal-back-button">
                              <ChevronLeft size={16} /> Change Time
                          </button>
                          <button onClick={nextStep} className="UCal-next-button" disabled={!serviceArea}>
                              Next: Material Type <ChevronRight size={16} />
                          </button>
                      </div>
                  </div>
            );

             case 3: return ( // Material Selection
                  <div className="UCal-step-container UCal-material-selection">
                      <div className="UCal-booking-step-header">
                          <h2>Select Material Type</h2>
                          {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                          {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.label)}
                          {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                      </div>
                       {!isLoading && backendMaterials.length === 0 && <p className="UCal-info-message">No recyclable materials are currently listed.</p>}
                      <div className="UCal-options-grid UCal-materials-grid">
                          {backendMaterials.map(material => (
                              <button
                                  key={material.id}
                                  className={`UCal-option-card UCal-material-card ${materialType === material.id ? 'UCal-selected' : ''}`}
                                  onClick={() => setMaterialType(material.id)}
                                  aria-pressed={materialType === material.id}
                              >
                                  <span className="UCal-material-icon">{material.icon || '♻️'}</span>
                                  <h3>{material.name}</h3>
                                  <p className="UCal-material-rate">{material.rate}</p>
                                  <p className="UCal-material-desc">{material.description}</p>
                              </button>
                          ))}
                      </div>
                      <div className="UCal-step-navigation">
                          <button onClick={prevStep} className="UCal-back-button">
                              <ChevronLeft size={16} /> Change Area
                          </button>
                          <button onClick={nextStep} className="UCal-next-button" disabled={!materialType}>
                              Next: Details <ChevronRight size={16} />
                          </button>
                      </div>
                  </div>
            );

            case 4: return ( // Details Collection
                  <div className="UCal-step-container UCal-details-collection">
                      <div className="UCal-booking-step-header">
                          <h2>Pickup & Contact Details</h2>
                           {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                           {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.label)}
                           {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                           {renderSummaryItem(Recycle, "Material", selectedMaterialObj?.name)}
                      </div>
                      <div className="UCal-pickup-details-form">
                          <div className="UCal-form-section">
                              <h3><Truck size={18} /> Pickup Information</h3>
                              <div className="UCal-form-field">
                                  <label htmlFor="pickupLocation">Pickup Address*</label>
                                  <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Full address for pickup" required aria-required="true"/>
                              </div>
                              <div className="UCal-form-field">
                                  <label htmlFor="weight">Estimated Weight (kg)</label>
                                  <input type="number" id="weight" value={estimatedWeight} onChange={(e) => setEstimatedWeight(e.target.value)} placeholder="Approximate weight in kg (optional)" min="0" step="0.1" />
                                  {estimatedWeight && isNaN(parseFloat(estimatedWeight)) && <p className="UCal-error-text">Please enter a valid number for weight.</p>}
                              </div>
                          </div>
                          <div className="UCal-form-section">
                              <h3><User size={18} /> Contact Information</h3>
                              <div className="UCal-form-field">
                                  <label htmlFor="name">Full Name*</label>
                                  <input type="text" id="name" value={contactDetails.name} onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})} placeholder="Your full name" required aria-required="true"/>
                              </div>
                               <div className="UCal-form-field">
                                  <label htmlFor="phone">Phone Number*</label>
                                  <input type="tel" id="phone" value={contactDetails.phone} onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})} placeholder="e.g., 555-123-4567" required aria-required="true"/>
                              </div>
                              <div className="UCal-form-field">
                                  <label htmlFor="email">Email Address*</label>
                                  <input type="email" id="email" value={contactDetails.email} onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})} placeholder="you@example.com" required aria-required="true"/>
                              </div>
                          </div>
                      </div>
                      <div className="UCal-step-navigation">
                          <button onClick={prevStep} className="UCal-back-button">
                              <ChevronLeft size={16} /> Change Material
                          </button>
                          <button
                              onClick={nextStep}
                              className="UCal-next-button"
                              disabled={!pickupLocation.trim() || !contactDetails.name.trim() || !contactDetails.phone.trim() || !contactDetails.email.trim() || (estimatedWeight && isNaN(parseFloat(estimatedWeight)))}
                          >
                              Review Booking <ChevronRight size={16} />
                          </button>
                      </div>
                  </div>
            );

            case 5: return bookingConfirmed ? ( // Confirmation Screen
                <div className="UCal-step-container UCal-booking-confirmation">
                    <div className="UCal-confirmation-header">
                        <CheckCircle size={48} className="UCal-confirmation-icon" />
                        <h2>Booking Confirmed!</h2>
                        <p className="UCal-booking-id">Booking ID: <strong>{bookingId || 'Processing...'}</strong></p>
                    </div>
                    <div className="UCal-confirmation-details UCal-review-details">
                         <div className="UCal-review-section UCal-confirmation-section">
                            <h3><Calendar size={18} /> Pickup Details</h3>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                            {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.time)}
                            {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                            {renderSummaryItem(Truck, "Address", pickupLocation)}
                         </div>
                         <div className="UCal-review-section UCal-confirmation-section">
                            <h3><Recycle size={18} /> Material Details</h3>
                            {renderSummaryItem(Package, "Type", selectedMaterialObj?.name)}
                            {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                            {renderSummaryItem(Info, "Est. Rate", selectedMaterialObj?.rate)}
                         </div>
                          <div className="UCal-review-section UCal-confirmation-section">
                            <h3><User size={18} /> Contact Info</h3>
                            {renderSummaryItem(User, "Name", contactDetails.name)}
                            {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                            {renderSummaryItem(Mail, "Email", contactDetails.email)}
                         </div>
                    </div>
                    <div className="UCal-confirmation-instructions">
                         <Info size={16} /> A confirmation email should be sent to {contactDetails.email} shortly (if configured). Please keep your Booking ID for reference.
                    </div>
                    <button onClick={resetForm} className="UCal-new-booking-button">
                        <Plus size={16} /> Schedule Another Pickup
                    </button>
                </div>
            ) : ( // Review Screen
                <div className="UCal-step-container UCal-booking-review">
                    <div className="UCal-booking-step-header">
                        <h2>Review Your Booking Request</h2>
                        <p>Please check all details below before confirming.</p>
                    </div>
                     {error && (
                        <div className="UCal-error-message-container">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}
                     <div className="UCal-review-details">
                         <div className="UCal-review-section">
                            <h3><Calendar size={18} /> Pickup Details</h3>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                            {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.time)}
                            {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                            {renderSummaryItem(Truck, "Address", pickupLocation)}
                         </div>
                         <div className="UCal-review-section">
                            <h3><Recycle size={18} /> Material Details</h3>
                            {renderSummaryItem(Package, "Type", selectedMaterialObj?.name)}
                            {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                            {renderSummaryItem(Info, "Est. Rate", selectedMaterialObj?.rate)}
                         </div>
                          <div className="UCal-review-section">
                            <h3><User size={18} /> Contact Info</h3>
                            {renderSummaryItem(User, "Name", contactDetails.name)}
                            {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                            {renderSummaryItem(Mail, "Email", contactDetails.email)}
                         </div>
                    </div>
                    <div className="UCal-step-navigation UCal-review-actions">
                        <button onClick={prevStep} className="UCal-back-button" disabled={isSubmitting}>
                            <ChevronLeft size={16} /> Edit Details
                        </button>
                        <button onClick={confirmBooking} className="UCal-confirm-button" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 size={16} className="UCal-animate-spin" /> : <CheckCircle size={16} />}
                            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            );

            default: return null;
        }
    };

    // --- Main Component Return ---
    return (
        <div className="UCal-user-calendar-wrapper">
            <div className="UCal-user-calendar-container">
                <div className="UCal-user-header">
                    <h1>Schedule Aluminum Recycling Pickup</h1>
                </div>

                 {isLoading && bookingStep === 0 && (
                     <div className="UCal-loading-overlay">
                         <Loader2 size={48} className="UCal-animate-spin" />
                         <p>Loading Schedule...</p>
                     </div>
                 )}

                 {!isLoading && error && bookingStep < 5 && (
                     <div className="UCal-error-message-container UCal-global-error">
                         <AlertTriangle size={18} />
                         <span>{error}</span>
                     </div>
                 )}

                {!isLoading && bookingStep > 0 && bookingStep < 5 && !bookingConfirmed && (
                    <div className="UCal-booking-progress">
                       <div className="UCal-progress-bar">
                         <div className="UCal-progress-steps">
                           {['Date', 'Time', 'Area', 'Material', 'Details', 'Confirm'].map((label, index) => (
                              <div
                                   key={label}
                                   className={`UCal-progress-step ${bookingStep > index ? 'UCal-completed' : ''} ${bookingStep === index ? 'UCal-active' : ''}`}
                               >
                                  <div className="UCal-step-circle">
                                      {bookingStep > index ? <CheckCircle size={16} /> : index + 1}
                                  </div>
                                  <span className="UCal-step-label">{label}</span>
                              </div>
                           ))}
                         </div>
                         <div className="UCal-progress-track">
                           <div className="UCal-progress-fill" style={{ width: `${Math.min(bookingStep, 5) * (100 / 5)}%` }}></div>
                         </div>
                       </div>
                    </div>
                )}

                <div className="UCal-booking-content">
                    {(!isLoading || bookingStep > 0) && renderBookingStep()}
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;