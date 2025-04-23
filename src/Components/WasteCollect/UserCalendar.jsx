import React, { useState, useEffect, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, Plus, User, Phone, Mail, Package, Weight, Loader2 // Added Loader2 for loading spinner
} from 'lucide-react';
import './USerCalendar.css'; // Assuming your CSS is in this file

// Base URL for your backend API - Adjust if necessary
const API_BASE_URL = 'http://localhost:5002/api'; // Change port/host if needed

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
    // Simple validation, adjust limits as needed
    if (weight < 0) return "Invalid";
    return `${weight.toFixed(1)} kg`; // Format to one decimal place
};

const UserCalendar = () => {
    // --- State for fetched data ---
    const [backendSettings, setBackendSettings] = useState(null);
    const [backendMaterials, setBackendMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // For booking submission

    // --- Component State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingStep, setBookingStep] = useState(0);
    const [timeSlot, setTimeSlot] = useState(null); // Stores selected timeSlot ID
    const [serviceArea, setServiceArea] = useState(null); // Stores selected serviceArea ID
    const [materialType, setMaterialType] = useState(null); // Stores selected materialType ID
    const [estimatedWeight, setEstimatedWeight] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [contactDetails, setContactDetails] = useState({ name: "", phone: "", email: "" });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState(""); // Will be set from backend response

    // --- Fetch Settings and Materials on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [settingsResponse, materialsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/settings`),
                    fetch(`${API_BASE_URL}/materials`) // Fetches active materials
                ]);

                if (!settingsResponse.ok) {
                    const errData = await settingsResponse.json();
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status} ${errData.message || 'Server error'}`);
                }
                 if (!materialsResponse.ok) {
                    const errData = await materialsResponse.json();
                    throw new Error(`Failed to fetch materials: ${materialsResponse.status} ${errData.message || 'Server error'}`);
                }

                const settingsData = await settingsResponse.json();
                const materialsData = await materialsResponse.json();

                if (settingsData.success && settingsData.data) {
                    // Convert Map-like object from backend to regular JS object if needed
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
                 // Keep potentially partial data or reset? Resetting might be safer.
                setBackendSettings(null);
                setBackendMaterials([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means run once on mount

    // --- Derived State (using fetched data) ---
    const settings = useMemo(() => {
        // Use fetched settings if available, otherwise use fallback
        const base = backendSettings || fallbackSettings;
        return {
            ...base,
            // Ensure nested arrays/objects exist even in fallback
            timeSlots: base.timeSlots || [],
            serviceAreas: base.serviceAreas || [],
            specialDates: base.specialDates || [],
            availableDays: base.availableDays || {},
        };
    }, [backendSettings]);

    const activeTimeSlots = useMemo(() => settings.timeSlots.filter(slot => slot.active), [settings.timeSlots]);
    const activeServiceAreas = useMemo(() => settings.serviceAreas.filter(area => area.active), [settings.serviceAreas]);
    // Materials are already filtered for active=true by the backend API /api/materials

    // --- Date/Calendar Logic (mostly unchanged) ---
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
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
        today.setHours(0, 0, 0, 0); // Compare against start of today
        const checkDate = new Date(year, month, day);
        return checkDate < today;
    };

    const getSpecialDateStatus = (day, month, year) => {
        // Format date as YYYY-MM-DD for comparison with backend data
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    };

    const isCollectionDay = (day, month, year) => {
        if (isPastDate(day, month, year)) return false;

        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) {
            return specialDate.status === 'available'; // Special date overrides regular schedule
        }

        // Check regular availability based on fetched settings
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay().toString(); // Ensure string key for lookup
        // console.log("Checking day:", dayOfWeek, "Available:", settings.availableDays[dayOfWeek]); // Debug log
        return settings.availableDays[dayOfWeek] === true; // Explicit check for true
    };


    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        setSelectedDate(new Date(year, month, day));
        setBookingStep(1);
        setError(null); // Clear previous errors when user progresses
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
         // Re-fetch data in case settings changed while user was booking? Maybe not necessary.
    };

    // --- Submit Booking to Backend ---
    const confirmBooking = async () => {
        setIsSubmitting(true);
        setError(null);

        const bookingData = {
            selectedDate: selectedDate ? selectedDate.toISOString() : null, // Send as ISO string
            timeSlotId: timeSlot,
            serviceAreaId: serviceArea,
            materialTypeId: materialType,
            estimatedWeight: estimatedWeight || null, // Send null if empty
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
                // Handle specific backend validation errors or general errors
                throw new Error(responseData.message || `HTTP error ${response.status}`);
            }

            if (responseData.success && responseData.data && responseData.data.bookingId) {
                setBookingId(responseData.data.bookingId); // Set ID from backend response
                setBookingConfirmed(true);
                // Optionally keep other data from response if needed: setSavedBookingDetails(responseData.data);
            } else {
                 throw new Error(responseData.message || 'Booking failed. Invalid response from server.');
            }

        } catch (err) {
            console.error("Booking Submission Error:", err);
            setError(`Booking failed: ${err.message}. Please review details or try again later.`);
             // Optionally, move the user back to the review step on failure?
            // setBookingStep(4); // Example: Go back to details form
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setBookingStep(prev => prev + 1);
    const prevStep = () => {
        setBookingStep(prev => prev - 1);
        setError(null); // Clear errors when navigating back
    }


    // --- Render Functions ---

    const renderCalendar = () => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];

        // Pad start of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Render days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            const isAvailable = isCollectionDay(day, month, year);
            const isPast = isPastDate(day, month, year); // Calculate isPast here
            const specialDate = getSpecialDateStatus(day, month, year);

            let dayClass = 'calendar-day';
            if (isPast) {
                dayClass += ' past';
            } else if (isAvailable) {
                dayClass += ' available';
            } else {
                dayClass += ' unavailable';
            }
            if (isSelected) dayClass += ' selected';
             // Add classes for special dates for specific styling if needed
            if (specialDate) {
                dayClass += ` special-${specialDate.status}`; // e.g., special-available, special-unavailable
            }


            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelect(day, month, year)}
                    disabled={isPast || !isAvailable} // Disable past and unavailable days
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
            value = formatWeight(value); // Use formatter
        }
        if (!value || value === "N/A" || value === "Invalid") return null; // Don't render if no/invalid value

        return (
            <p className="summary-item">
                <IconComponent size={16} />
                <strong>{label}:</strong> {value}
            </p>
        );
    };

    // --- Main Render Logic for Steps ---
    const renderBookingStep = () => {
        // Find selected items based on their IDs stored in state
        const selectedTimeSlot = settings.timeSlots.find(slot => slot.id === timeSlot);
        const selectedServiceArea = settings.serviceAreas.find(area => area.id === serviceArea);
        const selectedMaterial = backendMaterials.find(material => material.id === materialType);

        switch (bookingStep) {
            case 0: return ( // Calendar View
                <div className="calendar-container">
                    <div className="calendar-header">
                        <button onClick={goToPrevMonth} className="nav-button" aria-label="Previous month" disabled={isLoading}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button onClick={goToNextMonth} className="nav-button" aria-label="Next month" disabled={isLoading}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="weekday-header">
                        {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
                    </div>
                    <div className="calendar-grid">{isLoading ? <p>Loading days...</p> : renderCalendar()}</div>
                     <div className="calendar-legend">
                        <span className="legend-item available">Available</span>
                        <span className="legend-item selected">Selected</span>
                        <span className="legend-item unavailable">Unavailable / Booked</span>
                        <span className="legend-item past">Past</span>
                        {/* Add legend for special dates if needed */}
                    </div>
                    <div className="calendar-instructions">
                        <Info size={16} /> Select an available collection day (green) to begin scheduling.
                    </div>
                </div>
            );

            case 1: return ( // Time Slot Selection
                <div className="step-container time-slot-selection">
                    <div className="booking-step-header">
                        <h2>Select Pickup Time Slot</h2>
                        {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                    </div>
                     {!isLoading && activeTimeSlots.length === 0 && <p className="info-message">No time slots available for this service currently.</p>}
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

            case 2: return ( // Service Area Selection
                 <div className="step-container service-area-selection">
                     <div className="booking-step-header">
                        <h2>Select Your Service Area</h2>
                         {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                         {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)} {/* Use label or time */}
                     </div>
                     {!isLoading && activeServiceAreas.length === 0 && <p className="info-message">Pickups are not currently offered in any active service area.</p>}
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

             case 3: return ( // Material Selection
                  <div className="step-container material-selection">
                      <div className="booking-step-header">
                          <h2>Select Material Type</h2>
                          {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                          {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)}
                          {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
                      </div>
                       {!isLoading && backendMaterials.length === 0 && <p className="info-message">No recyclable materials are currently listed.</p>}
                      <div className="options-grid materials-grid">
                           {/* Use backendMaterials fetched from API */}
                          {backendMaterials.map(material => (
                              <button
                                  key={material.id} // Use the unique material 'id' from backend
                                  className={`option-card material-card ${materialType === material.id ? 'selected' : ''}`}
                                  onClick={() => setMaterialType(material.id)}
                                  aria-pressed={materialType === material.id}
                              >
                                  <span className="material-icon">{material.icon || '♻️'}</span> {/* Fallback icon */}
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

            case 4: return ( // Details Collection
                  <div className="step-container details-collection">
                      <div className="booking-step-header">
                          <h2>Pickup & Contact Details</h2>
                           {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                           {renderSummaryItem(Clock, "Time", selectedTimeSlot?.label)}
                           {renderSummaryItem(MapPin, "Area", selectedServiceArea?.name)}
                           {renderSummaryItem(Recycle, "Material", selectedMaterial?.name)}
                      </div>
                      <div className="pickup-details-form">
                           {/* Pickup Info Section */}
                          <div className="form-section">
                              <h3><Truck size={18} /> Pickup Information</h3>
                              <div className="form-field">
                                  <label htmlFor="pickupLocation">Pickup Address*</label>
                                  <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Full address for pickup" required aria-required="true"/>
                              </div>
                              <div className="form-field">
                                  <label htmlFor="weight">Estimated Weight (kg)</label>
                                  <input type="number" id="weight" value={estimatedWeight} onChange={(e) => setEstimatedWeight(e.target.value)} placeholder="Approximate weight in kg (optional)" min="0" step="0.1" />
                                  {estimatedWeight && isNaN(parseFloat(estimatedWeight)) && <p className="error-text">Please enter a valid number for weight.</p>}
                              </div>
                          </div>
                           {/* Contact Info Section */}
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
                                  {/* Basic email format check feedback could be added */}
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
                              // More robust validation
                              disabled={!pickupLocation.trim() || !contactDetails.name.trim() || !contactDetails.phone.trim() || !contactDetails.email.trim() || (estimatedWeight && isNaN(parseFloat(estimatedWeight)))}
                          >
                              Review Booking <ChevronRight size={16} />
                          </button>
                      </div>
                  </div>
            );

            case 5: return bookingConfirmed ? ( // Confirmation Screen
                <div className="step-container booking-confirmation">
                    <div className="confirmation-header">
                        <CheckCircle size={48} className="confirmation-icon" />
                        <h2>Booking Confirmed!</h2>
                        {/* Display Booking ID received from backend */}
                        <p className="booking-id">Booking ID: <strong>{bookingId || 'Processing...'}</strong></p>
                    </div>
                    <div className="confirmation-details review-details">
                         <div className="review-section confirmation-section">
                            <h3><Calendar size={18} /> Pickup Details</h3>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                            {renderSummaryItem(Clock, "Time", selectedTimeSlot?.time)} {/* Show actual time */}
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
                         <Info size={16} /> A confirmation email should be sent to {contactDetails.email} shortly (if configured). Please keep your Booking ID for reference.
                    </div>
                    <button onClick={resetForm} className="new-booking-button">
                        <Plus size={16} /> Schedule Another Pickup
                    </button>
                </div>
            ) : ( // Review Screen
                <div className="step-container booking-review">
                    <div className="booking-step-header">
                        <h2>Review Your Booking Request</h2>
                        <p>Please check all details below before confirming.</p>
                    </div>
                     {/* Display Error Message if submission failed */}
                     {error && (
                        <div className="error-message-container">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}
                     <div className="review-details">
                         <div className="review-section">
                            <h3><Calendar size={18} /> Pickup Details</h3>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                            {renderSummaryItem(Clock, "Time", selectedTimeSlot?.time)} {/* Show actual time */}
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
                        <button onClick={prevStep} className="back-button" disabled={isSubmitting}>
                            <ChevronLeft size={16} /> Edit Details
                        </button>
                        <button onClick={confirmBooking} className="confirm-button" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            );

            default: return null; // Should not happen
        }
    };

    // --- Main Component Return ---
    return (
        <div className="user-calendar-wrapper">
            <div className="user-calendar-container">
                <div className="user-header">
                    <h1>Schedule Aluminum Recycling Pickup</h1>
                </div>

                 {/* Display Global Loading Indicator */}
                 {isLoading && bookingStep === 0 && (
                     <div className="loading-overlay">
                         <Loader2 size={48} className="animate-spin" />
                         <p>Loading Schedule...</p>
                     </div>
                 )}

                 {/* Display Global Error Message */}
                 {!isLoading && error && bookingStep < 5 && ( // Show general errors before confirmation step
                     <div className="error-message-container global-error">
                         <AlertTriangle size={18} />
                         <span>{error}</span>
                          {/* Optionally add a retry button */}
                         {/* <button onClick={fetchData}>Retry</button> */}
                     </div>
                 )}


                {/* Render Progress Bar only if not loading initial data and booking hasn't failed catastrophically before step 1 */}
                {!isLoading && bookingStep > 0 && bookingStep < 5 && !bookingConfirmed && (
                    <div className="booking-progress">
                       {/* Progress bar rendering logic (unchanged) */}
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
                           <div className="progress-fill" style={{ width: `${Math.min(bookingStep, 5) * (100 / 5)}%` }}></div>
                         </div>
                       </div>
                    </div>
                )}

                {/* Render the current booking step content */}
                <div className="booking-content">
                     {/* Only render steps if not loading initial data OR if already past step 0 */}
                    {(!isLoading || bookingStep > 0) && renderBookingStep()}
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;