import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, User, Phone, Mail, Package, Weight, Loader2,
    Calendar as CalendarIcon, History, CheckSquare, X
} from 'lucide-react';
import './CalendarDisplay.css'; // Ensure this CSS file is also updated/renamed if needed

// Base URL for your backend API - Adjust if necessary
const API_BASE_URL = 'http://localhost:5002/api';

// --- Default structure (used as fallback if API fails or during initial load) ---
const fallbackSettings = {
    availableDays: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
    timeSlots: ["Morning (8:00 AM - 12:00 PM)", "Afternoon (1:00 PM - 5:00 PM)"], // Example fallback
    serviceAreas: [],
    specialDates: []
};

// Mock data - In a real app, fetch this data
const mockUpcomingPickups = [
    { id: "UP1", date: "2025-05-01", timeSlot: "Morning (8:00 AM - 12:00 PM)", material: "Aluminum Cans", status: "Confirmed" },
    { id: "UP2", date: "2025-05-15", timeSlot: "Afternoon (1:00 PM - 5:00 PM)", material: "Aluminum Sheets", status: "Pending" }
];
const mockHistoryPickups = [
    { id: "HP1", date: "2025-04-15", timeSlot: "Morning (8:00 AM - 12:00 PM)", material: "Aluminum Cans", weight: "5.2 kg", status: "Completed" },
    { id: "HP2", date: "2025-04-01", timeSlot: "Afternoon (1:00 PM - 5:00 PM)", material: "Aluminum Sheets", weight: "8.7 kg", status: "Completed" },
    { id: "HP3", date: "2025-03-25", timeSlot: "Morning (8:00 AM - 12:00 PM)", material: "Mixed Aluminum", weight: "3.4 kg", status: "Completed" }
];

// Placeholder list of materials - Ideally fetched or configured elsewhere
const MATERIAL_TYPES = ["Aluminum Cans", "Aluminum Sheets", "Mixed Aluminum", "Other Aluminum"];

const CalendarDisplay = () => {
    // --- State for fetched data ---
    const [backendSettings, setBackendSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Pickup History State ---
    const [upcomingPickups, setUpcomingPickups] = useState([]);
    const [historyPickups, setHistoryPickups] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');

    // --- Component State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false);

    // --- Schedule Form State ---
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_TYPES[0] || '');
    const [pickupNotes, setPickupNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    // --- Fetch Settings on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setSubmitError(null);
            setSubmitSuccess(null);
            try {
                // Fetch Settings
                const settingsResponse = await fetch(`${API_BASE_URL}/settings`);
                if (!settingsResponse.ok) {
                    const errData = await settingsResponse.json().catch(() => ({}));
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status} ${errData.message || 'Server error'}`);
                }
                const settingsData = await settingsResponse.json();
                if (settingsData.success && settingsData.data) {
                    const availableDaysObject = settingsData.data.availableDays instanceof Map
                        ? Object.fromEntries(settingsData.data.availableDays)
                        : settingsData.data.availableDays || {};
                    setBackendSettings({ ...settingsData.data, availableDays: availableDaysObject });
                    if (settingsData.data.timeSlots?.length > 0) {
                        setSelectedTimeSlot(settingsData.data.timeSlots[0]);
                    }
                } else {
                    throw new Error(settingsData.message || 'Failed to get valid settings data');
                }

                // --- TODO: Fetch Actual Pickup Data ---
                setUpcomingPickups(mockUpcomingPickups);
                setHistoryPickups(mockHistoryPickups);
                // --- End TODO ---

            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError(err.message || 'Could not load scheduling options. Please try refreshing.');
                setBackendSettings(null);
                setUpcomingPickups(mockUpcomingPickups);
                setHistoryPickups(mockHistoryPickups);
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
        closeScheduleForm();
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        closeScheduleForm();
    };

    const isToday = (day, month, year) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const isPastDate = (day, month, year) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(year, month, day);
        return checkDate < today;
    };

    const getSpecialDateStatus = useCallback((day, month, year) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    }, [settings.specialDates]);

    const isCollectionDay = useCallback((day, month, year) => {
        if (isPastDate(day, month, year)) return false;
        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) {
            return specialDate.status === 'available';
        }
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay().toString();
        return settings.availableDays[dayOfWeek] === true;
    }, [settings.availableDays, getSpecialDateStatus]);

    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;

        const newSelectedDate = new Date(year, month, day);
        setSelectedDate(newSelectedDate);
        setSelectedTimeSlot(settings.timeSlots?.[0] || '');
        setSelectedMaterial(MATERIAL_TYPES[0] || '');
        setPickupNotes('');
        setSubmitError(null);
        setSubmitSuccess(null);
        setIsSubmitting(false);
        setShowScheduleForm(true);
    };

    const closeScheduleForm = () => {
        setShowScheduleForm(false);
        setSelectedDate(null);
        setSubmitError(null);
        setSubmitSuccess(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    // --- Form Submission Logic ---
    const handleScheduleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedDate || !selectedTimeSlot || !selectedMaterial) {
            setSubmitError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        const pickupData = {
            date: selectedDate.toISOString().split('T')[0],
            timeSlot: selectedTimeSlot,
            material: selectedMaterial,
            notes: pickupNotes,
        };

        console.log("Submitting pickup request:", pickupData);

        try {
            // --- TODO: Replace with actual API Call ---
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const result = { success: true, message: "Pickup scheduled successfully!", data: { id: `NEW${Date.now()}`, ...pickupData, status: 'Pending' } };
            // --- End TODO ---

            if (result.success) {
                setSubmitSuccess(result.message || "Pickup scheduled!");
                setUpcomingPickups(prev => [result.data, ...prev]);
                setTimeout(() => {
                     closeScheduleForm();
                }, 2000);
            } else {
                throw new Error(result.message || "Scheduling failed.");
            }

        } catch (err) {
            console.error("Error scheduling pickup:", err);
            setSubmitError(err.message || "An error occurred while scheduling. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Placeholder Actions for Pickup Items ---
    const handleReschedule = (pickupId) => {
        console.log("TODO: Reschedule pickup", pickupId);
        alert(`Reschedule functionality for pickup ${pickupId} is not yet implemented.`);
    };

    const handleCancel = async (pickupId) => {
        console.log("TODO: Cancel pickup", pickupId);
        if (window.confirm(`Are you sure you want to cancel pickup #${pickupId}?`)) {
             alert(`Cancel functionality for pickup ${pickupId} is not yet implemented. Simulating removal.`);
             setUpcomingPickups(prev => prev.filter(p => p.id !== pickupId));
        }
    };

    // --- Render Functions ---
    const renderCalendar = () => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="CDis-calendar-day CDis-empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSel = selectedDate && selectedDate.getTime() === date.getTime();
            const isAvail = isCollectionDay(day, month, year);
            const isTod = isToday(day, month, year);
            const isPst = isPastDate(day, month, year);
            const specialDate = getSpecialDateStatus(day, month, year);

            let dayClass = 'CDis-calendar-day';
            if (isPst) dayClass += ' CDis-past';
            else if (isAvail) dayClass += ' CDis-available';
            else dayClass += ' CDis-unavailable';

            if (isSel) dayClass += ' CDis-selected';
            if (isTod) dayClass += ' CDis-today';
            if (specialDate) dayClass += ` CDis-special-${specialDate.status}`; // e.g., CDis-special-available

            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelect(day, month, year)}
                    disabled={isPst || !isAvail}
                    aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvail ? ' (Unavailable)' : ''}${isTod ? ' (Today)' : ''}`}
                    aria-pressed={isSel}
                >
                    <span className="CDis-day-number">{day}</span>
                    {specialDate && <span className="CDis-special-indicator" title={specialDate.reason}>*</span>}
                </button>
            );
        }
        return calendarDays;
    };

    const renderPickupItem = (pickup, type) => {
        const isUpcoming = type === 'upcoming';
        const statusClass = pickup.status ? `CDis-${pickup.status.toLowerCase()}` : 'CDis-unknown'; // Prefixed dynamic class
        return (
            <div key={pickup.id} className={`CDis-pickup-item ${statusClass}`}>
                <div className="CDis-pickup-header">
                    <span className={`CDis-status-badge ${statusClass}`}>
                        {pickup.status || 'Unknown'}
                    </span>
                    <span className="CDis-pickup-id">#{pickup.id}</span>
                </div>
                <div className="CDis-pickup-content">
                    <div className="CDis-pickup-detail">
                        <CalendarIcon size={16} />
                        <span>{formatDate(pickup.date)}</span>
                    </div>
                    <div className="CDis-pickup-detail">
                        <Clock size={16} />
                        <span>{pickup.timeSlot}</span>
                    </div>
                    <div className="CDis-pickup-detail">
                        <Recycle size={16} />
                        <span>{pickup.material}</span>
                    </div>
                    {!isUpcoming && pickup.weight && (
                        <div className="CDis-pickup-detail">
                            <Weight size={16} />
                            <span>{pickup.weight}</span>
                        </div>
                    )}
                     {isUpcoming && pickup.notes && (
                        <div className="CDis-pickup-detail">
                            <Info size={16} />
                            <span className="CDis-pickup-notes">Notes: {pickup.notes}</span>
                        </div>
                    )}
                </div>
                {isUpcoming && (
                    <div className="CDis-pickup-actions">
                        <button className="CDis-btn-reschedule" onClick={() => handleReschedule(pickup.id)}>Reschedule</button>
                        <button className="CDis-btn-cancel" onClick={() => handleCancel(pickup.id)}>Cancel</button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="CDis-user-dashboard">
            {isLoading && (
                <div className="CDis-loading-overlay">
                    <Loader2 size={48} className="CDis-animate-spin" />
                    <p>Loading Schedule...</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="CDis-error-message-container CDis-global-error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="CDis-dashboard-grid">
                {/* Left Column - Calendar & Form */}
                <div className="CDis-calendar-column">
                    <div className="CDis-column-header">
                        <h2>Schedule Pickup</h2>
                    </div>

                    <div className="CDis-calendar-container">
                        <div className="CDis-calendar-header">
                            <button onClick={goToPrevMonth} className="CDis-nav-button" aria-label="Previous month" disabled={isLoading}>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="CDis-current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                            <button onClick={goToNextMonth} className="CDis-nav-button" aria-label="Next month" disabled={isLoading}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="CDis-weekday-header">
                            {daysOfWeek.map(day => <div key={day} className="CDis-weekday">{day}</div>)}
                        </div>
                        <div className="CDis-calendar-grid">{isLoading ? <p>Loading days...</p> : renderCalendar()}</div>
                        <div className="CDis-calendar-legend">
                            <span className="CDis-legend-item CDis-today">Today</span>
                            <span className="CDis-legend-item CDis-available">Available</span>
                            <span className="CDis-legend-item CDis-selected">Selected</span>
                            <span className="CDis-legend-item CDis-unavailable">Unavailable</span>
                            <span className="CDis-legend-item CDis-past">Past</span>
                        </div>
                        <div className="CDis-calendar-instructions">
                            <Info size={16} /> Select an available day (green) to schedule.
                        </div>
                    </div>

                    {/* Schedule Form Area */}
                    {showScheduleForm && selectedDate && (
                        <div className="CDis-schedule-form-container">
                             <div className="CDis-schedule-form-header">
                                <h3>New Pickup on {formatDate(selectedDate.toISOString())}</h3>
                                <button onClick={closeScheduleForm} className="CDis-close-form-button" aria-label="Close scheduling form">
                                    <X size={18} />
                                </button>
                             </div>
                            <form onSubmit={handleScheduleSubmit} className="CDis-schedule-form">
                                <div className="CDis-form-group">
                                    <label htmlFor="time-slot">Time Slot <span className="CDis-required">*</span></label>
                                    <select
                                        id="time-slot"
                                        value={selectedTimeSlot}
                                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                        required
                                        disabled={settings.timeSlots.length === 0 || isSubmitting}
                                    >
                                        {settings.timeSlots.length === 0 ? (
                                            <option value="" disabled>No time slots available</option>
                                        ) : (
                                            settings.timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)
                                        )}
                                    </select>
                                </div>
                                <div className="CDis-form-group">
                                    <label htmlFor="material-type">Material Type <span className="CDis-required">*</span></label>
                                    <select
                                        id="material-type"
                                        value={selectedMaterial}
                                        onChange={(e) => setSelectedMaterial(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    >
                                        {MATERIAL_TYPES.map(material => <option key={material} value={material}>{material}</option>)}
                                    </select>
                                </div>
                                 <div className="CDis-form-group">
                                    <label htmlFor="pickup-notes">Optional Notes (e.g., location)</label>
                                    <textarea
                                        id="pickup-notes"
                                        value={pickupNotes}
                                        onChange={(e) => setPickupNotes(e.target.value)}
                                        rows="3"
                                        maxLength="200"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Submission Feedback */}
                                {submitError && (
                                    <div className="CDis-form-message CDis-error">
                                        <AlertTriangle size={16} /> {submitError}
                                    </div>
                                )}
                                {submitSuccess && (
                                    <div className="CDis-form-message CDis-success">
                                        <CheckCircle size={16} /> {submitSuccess}
                                    </div>
                                )}

                                <div className="CDis-form-actions">
                                    <button
                                        type="submit"
                                        className="CDis-schedule-button"
                                        disabled={isSubmitting || !selectedTimeSlot || !selectedMaterial}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="CDis-animate-spin" /> Scheduling...
                                            </>
                                        ) : (
                                            'Schedule Pickup'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column - Pickups List */}
                <div className="CDis-pickups-column">
                     <div className="CDis-column-header CDis-with-tabs">
                        <button
                            className={`CDis-tab-button ${activeTab === 'upcoming' ? 'CDis-active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                            disabled={isLoading}
                        >
                            <Calendar size={16} /> Upcoming ({upcomingPickups.length})
                        </button>
                        <button
                            className={`CDis-tab-button ${activeTab === 'history' ? 'CDis-active' : ''}`}
                            onClick={() => setActiveTab('history')}
                            disabled={isLoading}
                        >
                            <History size={16} /> History ({historyPickups.length})
                        </button>
                    </div>

                    <div className="CDis-pickups-list">
                        {isLoading ? (
                             <div className="CDis-loading-pickups">
                                <Loader2 size={24} className="CDis-animate-spin" /> Loading pickups...
                            </div>
                        ) : activeTab === 'upcoming' ? (
                            upcomingPickups.length > 0 ? (
                                upcomingPickups.map(pickup => renderPickupItem(pickup, 'upcoming'))
                            ) : (
                                <div className="CDis-no-pickups">
                                    <Calendar size={48} />
                                    <p>No upcoming pickups scheduled.</p>
                                    <p>Use the calendar to schedule.</p>
                                </div>
                            )
                        ) : ( // History Tab
                            historyPickups.length > 0 ? (
                                historyPickups.map(pickup => renderPickupItem(pickup, 'history'))
                            ) : (
                                <div className="CDis-no-pickups">
                                    <History size={48} />
                                    <p>No pickup history yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarDisplay;