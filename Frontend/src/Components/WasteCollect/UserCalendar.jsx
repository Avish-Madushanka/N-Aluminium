import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, Plus, User, Phone, Mail, Package, Weight, Loader2
} from 'lucide-react';
import './UserCalendar.css';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

const formatWeight = (weightValue) => {
    if (!weightValue || isNaN(parseFloat(weightValue))) return "N/A";
    const weight = parseFloat(weightValue);
    if (weight < 0) return "Invalid";
    return `${weight.toFixed(1)} kg`;
};

const UserCalendar = ({ userInfo }) => {
    const [backendSettings, setBackendSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingStep, setBookingStep] = useState(0);
    const [timeSlot, setTimeSlot] = useState(null);
    const [serviceArea, setServiceArea] = useState(null);
    const [estimatedWeight, setEstimatedWeight] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [contactDetails, setContactDetails] = useState({
        name: userInfo?.name || "",
        phone: userInfo?.contactNumber || "",
        email: userInfo?.email || ""
    });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState("");

    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
    const monthNames = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

    const fallbackSettings = useMemo(() => ({
        availableDays: new Map([['0', false], ['1', false], ['2', false], ['3', false], ['4', false], ['5', false], ['6', false]]),
        timeSlots: [],
        serviceAreas: [],
        specialDates: [],
        dateSettings: new Map()
    }), []);

    useEffect(() => {
        const fetchCalendarSettings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.CALENDAR_SETTINGS.GET);
                if (response.data && response.data.success && response.data.data) {
                    const fetched = response.data.data;
                    const apiAvailableDaysObject = (fetched.availableDays && Object.keys(fetched.availableDays).length > 0)
                        ? fetched.availableDays
                        : Object.fromEntries(fallbackSettings.availableDays);
                    const apiDateSettingsObject = fetched.dateSettings || {};

                    setBackendSettings({
                        ...fallbackSettings,
                        ...fetched,
                        availableDays: new Map(Object.entries(apiAvailableDaysObject)),
                        dateSettings: new Map(Object.entries(apiDateSettingsObject)),
                        timeSlots: fetched.timeSlots || fallbackSettings.timeSlots,
                        serviceAreas: fetched.serviceAreas || fallbackSettings.serviceAreas,
                        specialDates: fetched.specialDates || fallbackSettings.specialDates,
                    });
                } else {
                    setError(response.data?.message || 'Could not load scheduling options from server.');
                    setBackendSettings(fallbackSettings);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load scheduling options.');
                setBackendSettings(fallbackSettings);
                console.error("Error fetching user calendar settings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCalendarSettings();
    }, [fallbackSettings]);

    const settings = useMemo(() => {
        if (!backendSettings) return fallbackSettings;
        return {
            ...fallbackSettings,
            ...backendSettings,
            availableDays: backendSettings.availableDays instanceof Map ? backendSettings.availableDays : new Map(Object.entries(backendSettings.availableDays || {})),
            dateSettings: backendSettings.dateSettings instanceof Map ? backendSettings.dateSettings : new Map(Object.entries(backendSettings.dateSettings || {})),
            timeSlots: backendSettings.timeSlots || [],
            serviceAreas: backendSettings.serviceAreas || [],
            specialDates: backendSettings.specialDates || [],
        };
    }, [backendSettings, fallbackSettings]);

    const getMonthData = useCallback((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { year, month, startingDayOfWeek, daysInMonth };
    }, []);

    const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const isPastDate = useCallback((day, month, year) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(year, month, day) < today;
    }, []);

    const getSpecialDateStatus = useCallback((day, month, year) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    }, [settings.specialDates]);

    const isCollectionDay = useCallback((day, month, year) => {
        if (isPastDate(day, month, year)) return false;
        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) return specialDate.status === 'available';
        const dayOfWeek = new Date(year, month, day).getDay().toString();
        return settings.availableDays.get(dayOfWeek) === true;
    }, [isPastDate, getSpecialDateStatus, settings.availableDays]);

    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        setSelectedDate(new Date(year, month, day));
        setTimeSlot(null);
        setServiceArea(null);
        setBookingStep(1);
        setError(null);
    };

    const formatDate = useCallback((date) => {
        if (!date) return 'N/A';
        return `${daysOfWeek[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }, [daysOfWeek, monthNames]);

    const resetForm = useCallback(() => {
        setSelectedDate(null);
        setTimeSlot(null);
        setServiceArea(null);
        setEstimatedWeight("");
        setPickupLocation("");
        setContactDetails({
            name: userInfo?.name || "",
            phone: userInfo?.contactNumber || "",
            email: userInfo?.email || ""
        });
        setBookingStep(0);
        setBookingConfirmed(false);
        setBookingId("");
        setCurrentDate(new Date());
        setError(null);
        setIsSubmitting(false);
    }, [userInfo]);

    const confirmBooking = async () => {
        setIsSubmitting(true);
        setError(null);

        const selectedDateObj = selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null;

        const bookingData = {
            selectedDate: selectedDateObj ? selectedDateObj.toISOString() : null,
            timeSlotId: timeSlot,
            serviceAreaId: serviceArea,
            estimatedWeight: estimatedWeight ? parseFloat(estimatedWeight) : null,
            pickupLocation: pickupLocation,
            contactDetails: contactDetails,
        };

        console.log("Submitting Booking Data:", JSON.stringify(bookingData, null, 2));

        try {
            if (!API_ENDPOINTS.BOOKINGS || !API_ENDPOINTS.BOOKINGS.CREATE) {
                throw new Error("API endpoint for creating bookings is not defined.");
            }
            const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);

            if (response.data && response.data.success) {
                setBookingId(response.data.data.bookingId || response.data.data._id);
                setBookingConfirmed(true);
            } else {
                throw new Error(response.data?.message || 'Booking request failed.');
            }
        } catch (err) {
            console.error("Booking submission error:", err);
            if (err.response) {
                console.error("Server response data:", JSON.stringify(err.response.data, null, 2));
            }
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred during booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        setError(null);
        setBookingStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError(null);
        setBookingStep(prev => prev - 1);
    };

    const renderCalendar = useCallback(() => {
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
            if (isPast) dayClass += ' UCal-past';
            else if (isAvailable) dayClass += ' UCal-available';
            else dayClass += ' UCal-unavailable';
            if (isSelected) dayClass += ' UCal-selected';
            if (specialDate) dayClass += ` UCal-special-${specialDate.status}`;

            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelect(day, month, year)}
                    disabled={isPast || !isAvailable}
                    aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvailable ? ' (Unavailable)' : ''}`}>
                    <span className="UCal-day-number">{day}</span>
                    {specialDate && <span className="UCal-special-indicator" title={specialDate.reason || 'Special Day'}>*</span>}
                </button>
            );
        }
        return calendarDays;
    }, [currentDate, getMonthData, selectedDate, isCollectionDay, isPastDate, getSpecialDateStatus, monthNames, handleDateSelect]);

    const renderSummaryItem = (IconComponent, label, value) => {
        if (label === "Est. Weight") value = formatWeight(value);
        if (!value || value === "N/A" || value === "Invalid") return null;
        return (
            <p className="UCal-summary-item">
                <IconComponent size={16} />
                <strong>{label}:</strong> {value}
            </p>
        );
    };

    const timeSlotsForSelectedDate = useMemo(() => {
        if (!selectedDate || !settings.timeSlots || settings.timeSlots.length === 0) return [];
        const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const dateSpecificConfig = settings.dateSettings.get(dateStr);

        if (dateSpecificConfig && dateSpecificConfig.timeSlots && dateSpecificConfig.timeSlots.length > 0) {
            return settings.timeSlots.filter(slot => slot.active && dateSpecificConfig.timeSlots.includes(slot.id));
        }

        if (isCollectionDay(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear())) {
            return settings.timeSlots.filter(slot => slot.active);
        }
        return [];
    }, [selectedDate, settings.timeSlots, settings.dateSettings, isCollectionDay]);

    const serviceAreasForSelectedDate = useMemo(() => {
        if (!selectedDate || !settings.serviceAreas || settings.serviceAreas.length === 0) return [];
        const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const dateSpecificConfig = settings.dateSettings.get(dateStr);

        if (dateSpecificConfig && dateSpecificConfig.serviceAreas && dateSpecificConfig.serviceAreas.length > 0) {
            return settings.serviceAreas.filter(area => area.active && dateSpecificConfig.serviceAreas.includes(area.id));
        }

        if (isCollectionDay(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear())) {
            return settings.serviceAreas.filter(area => area.active);
        }
        return [];
    }, [selectedDate, settings.serviceAreas, settings.dateSettings, isCollectionDay]);

    const renderBookingStep = () => {
        const selectedTimeSlotObj = settings.timeSlots.find(slot => slot.id === timeSlot);
        const selectedServiceAreaObj = settings.serviceAreas.find(area => area.id === serviceArea);

        switch (bookingStep) {
            case 0:
                return (
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
                        <div className="UCal-calendar-grid">
                            {isLoading ?
                                <div className="UCal-loading-calendar-days">
                                    <Loader2 size={32} className="UCal-animate-spin" />
                                    <p>Loading days...</p>
                                </div>
                                : renderCalendar()
                            }
                        </div>
                        <div className="UCal-calendar-legend">
                            <span className="UCal-legend-item UCal-available">Available</span>
                            <span className="UCal-legend-item UCal-selected">Selected</span>
                            <span className="UCal-legend-item UCal-unavailable">Unavailable</span>
                            <span className="UCal-legend-item UCal-past">Past</span>
                        </div>
                        <div className="UCal-calendar-instructions">
                            <Info size={16} /> Select an available collection day (green) to begin scheduling.
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="UCal-step-container">
                        <div className="UCal-booking-step-header">
                            <h2>Schedule Pickup</h2>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                        </div>
                        
                        <div className="UCal-time-area-section">
                            <div className="UCal-section">
                                <h3><Clock size={20} /> Select Pickup Time Slot</h3>
                                {timeSlotsForSelectedDate.length === 0 && !isLoading &&
                                    <p className="UCal-info-message">No time slots available for the selected date.</p>
                                }
                                <div className="UCal-options-grid UCal-time-slots-grid">
                                    {timeSlotsForSelectedDate.map(slot => (
                                        <button
                                            key={slot.id}
                                            className={`UCal-option-card UCal-time-slot-card ${timeSlot === slot.id ? 'UCal-selected' : ''}`}
                                            onClick={() => setTimeSlot(slot.id)}
                                            aria-pressed={timeSlot === slot.id}>
                                            <Clock size={24} />
                                            <h3>{slot.label}</h3>
                                            <p>{slot.time}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="UCal-section">
                                <h3><MapPin size={20} /> Select Service Area</h3>
                                {serviceAreasForSelectedDate.length === 0 && !isLoading &&
                                    <p className="UCal-info-message">No service areas available for the selected date.</p>
                                }
                                <div className="UCal-options-grid UCal-service-areas-grid">
                                    {serviceAreasForSelectedDate.map(area => (
                                        <button
                                            key={area.id}
                                            className={`UCal-option-card UCal-service-area-card ${serviceArea === area.id ? 'UCal-selected' : ''}`}
                                            onClick={() => setServiceArea(area.id)}
                                            aria-pressed={serviceArea === area.id}>
                                            <MapPin size={24} />
                                            <h3>{area.name}</h3>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="UCal-step-navigation">
                            <button onClick={prevStep} className="UCal-back-button">
                                <ChevronLeft size={16} /> Change Date
                            </button>
                            <button onClick={nextStep} className="UCal-next-button" disabled={!timeSlot || !serviceArea}>
                                Next: Details <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="UCal-step-container UCal-details-collection">
                        <div className="UCal-booking-step-header">
                            <h2>Pickup & Contact Details</h2>
                            {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                            {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.label)}
                            {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                        </div>
                        <div className="UCal-pickup-details-form">
                            <div className="UCal-form-section">
                                <h3><Truck size={18} /> Pickup Information</h3>
                                <div className="UCal-form-field">
                                    <label htmlFor="pickupLocation">Pickup Address*</label>
                                    <input
                                        type="text"
                                        id="pickupLocation"
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                        placeholder="Full address including street, city"
                                        required />
                                </div>
                                <div className="UCal-form-field">
                                    <label htmlFor="weight">Estimated Weight (kg)</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        value={estimatedWeight}
                                        onChange={(e) => setEstimatedWeight(e.target.value)}
                                        placeholder="e.g., 5.5"
                                        min="0"
                                        step="0.1" />
                                    {estimatedWeight && (isNaN(parseFloat(estimatedWeight)) || parseFloat(estimatedWeight) < 0) &&
                                        <p className="UCal-error-text">Please enter a valid non-negative weight.</p>
                                    }
                                </div>
                            </div>
                            <div className="UCal-form-section">
                                <h3><User size={18} /> Contact Information</h3>
                                <div className="UCal-form-field">
                                    <label htmlFor="name">Full Name*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={contactDetails.name}
                                        onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                        placeholder="Your full name"
                                        required />
                                </div>
                                <div className="UCal-form-field">
                                    <label htmlFor="phone">Phone Number*</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={contactDetails.phone}
                                        onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                                        placeholder="e.g., 07xxxxxxxx"
                                        required />
                                </div>
                                <div className="UCal-form-field">
                                    <label htmlFor="email">Email Address*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={contactDetails.email}
                                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required />
                                </div>
                            </div>
                        </div>
                        <div className="UCal-step-navigation">
                            <button onClick={prevStep} className="UCal-back-button">
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="UCal-next-button"
                                disabled={!pickupLocation.trim() || !contactDetails.name.trim() || !contactDetails.phone.trim() || !contactDetails.email.trim() || (estimatedWeight && (isNaN(parseFloat(estimatedWeight)) || parseFloat(estimatedWeight) < 0))}>
                                Review Booking <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return bookingConfirmed ? (
                    <div className="UCal-step-container UCal-booking-confirmation">
                        <div className="UCal-confirmation-header">
                            <CheckCircle size={48} className="UCal-confirmation-icon" />
                            <h2>Booking Confirmed!</h2>
                            <p className="UCal-booking-id">Booking ID: <strong>{bookingId}</strong></p>
                        </div>
                        <div className="UCal-confirmation-details UCal-review-details">
                            <div className="UCal-review-section UCal-confirmation-section">
                                <h3><Calendar size={18} /> Pickup</h3>
                                {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                                {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.time)}
                                {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                                {renderSummaryItem(Truck, "Address", pickupLocation)}
                            </div>
                            <div className="UCal-review-section UCal-confirmation-section">
                                <h3><Recycle size={18} /> Material</h3>
                                {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                            </div>
                            <div className="UCal-review-section UCal-confirmation-section">
                                <h3><User size={18} /> Contact</h3>
                                {renderSummaryItem(User, "Name", contactDetails.name)}
                                {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                                {renderSummaryItem(Mail, "Email", contactDetails.email)}
                            </div>
                        </div>
                        <div className="UCal-confirmation-instructions">
                            <Info size={16} /> A confirmation email has been sent to {contactDetails.email} (mock). Please keep your Booking ID for reference.
                        </div>
                        <button onClick={resetForm} className="UCal-new-booking-button">
                            <Plus size={16} /> Schedule Another Pickup
                        </button>
                    </div>
                ) : (
                    <div className="UCal-step-container UCal-booking-review">
                        <div className="UCal-booking-step-header">
                            <h2>Review Your Booking</h2>
                            <p>Please check all details carefully before confirming.</p>
                        </div>
                        {error && <div className="UCal-error-message-container"><AlertTriangle size={16} /> {error}</div>}
                        <div className="UCal-review-details">
                            <div className="UCal-review-section">
                                <h3><Calendar size={18} /> Pickup</h3>
                                {renderSummaryItem(Calendar, "Date", formatDate(selectedDate))}
                                {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.time)}
                                {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                                {renderSummaryItem(Truck, "Address", pickupLocation)}
                            </div>
                            <div className="UCal-review-section">
                                <h3><Recycle size={18} /> Material</h3>
                                {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                            </div>
                            <div className="UCal-review-section">
                                <h3><User size={18} /> Contact</h3>
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

            default:
                return null;
        }
    };

    const progressBarLabels = ['Date', 'Time & Area', 'Details', 'Confirm'];

    return (
        <div className="UCal-user-calendar-wrapper">
            <div className="UCal-user-calendar-container">
                <div className="UCal-user-header">
                    <h1>Schedule Aluminum Recycling Pickup</h1>
                </div>

                {(isLoading && bookingStep === 0 && !backendSettings) &&
                    <div className="UCal-loading-overlay">
                        <Loader2 size={48} className="UCal-animate-spin" />
                        <p>Loading Schedule...</p>
                    </div>
                }

                {!isLoading && error && bookingStep === 0 &&
                    <div className="UCal-error-message-container UCal-global-error">
                        <AlertTriangle size={18} />
                        <span>{error} Please try refreshing. If the problem persists, contact support.</span>
                    </div>
                }

                {!isLoading && !error && bookingStep > 0 && bookingStep < progressBarLabels.length && !bookingConfirmed && (
                    <div className="UCal-booking-progress">
                        <div className="UCal-progress-bar">
                            <div className="UCal-progress-steps">
                                {progressBarLabels.map((label, index) => (
                                    <div
                                        key={label}
                                        className={`UCal-progress-step ${bookingStep > index ? 'UCal-completed' : ''} ${bookingStep === index ? 'UCal-active' : ''}`}>
                                        <div className="UCal-step-circle">
                                            {bookingStep > index ? <CheckCircle size={16} /> : index + 1}
                                        </div>
                                        <span className="UCal-step-label">{label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="UCal-progress-track">
                                <div
                                    className="UCal-progress-fill"
                                    style={{ width: `${Math.min(bookingStep, progressBarLabels.length - 1) * (100 / (progressBarLabels.length - 1))}%` }}>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="UCal-booking-content">
                    {(!isLoading || bookingStep > 0 || (error && bookingStep === 0)) && renderBookingStep()}
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;