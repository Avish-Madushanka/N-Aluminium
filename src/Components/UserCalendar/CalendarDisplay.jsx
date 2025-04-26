import React, { useState, useEffect, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, User, Phone, Mail, Package, Weight, Loader2,
    Calendar as CalendarIcon, History, CheckSquare
} from 'lucide-react';
import './CalendarDisplay.css'; 

// Base URL for your backend API - Adjust if necessary
const API_BASE_URL = 'http://localhost:5002/api';

// --- Default structure (used as fallback if API fails or during initial load) ---
const fallbackSettings = {
    availableDays: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
    timeSlots: [],
    serviceAreas: [],
    specialDates: []
};

// Mock data for upcoming and history pickups
const mockUpcomingPickups = [
    {
        id: "UP1",
        date: "2025-05-01",
        timeSlot: "Morning (8:00 AM - 12:00 PM)",
        material: "Aluminum Cans",
        status: "Confirmed"
    },
    {
        id: "UP2",
        date: "2025-05-15",
        timeSlot: "Afternoon (1:00 PM - 5:00 PM)",
        material: "Aluminum Sheets",
        status: "Pending"
    }
];

const mockHistoryPickups = [
    {
        id: "HP1",
        date: "2025-04-15",
        timeSlot: "Morning (8:00 AM - 12:00 PM)",
        material: "Aluminum Cans",
        weight: "5.2 kg",
        status: "Completed"
    },
    {
        id: "HP2",
        date: "2025-04-01",
        timeSlot: "Afternoon (1:00 PM - 5:00 PM)",
        material: "Aluminum Sheets",
        weight: "8.7 kg",
        status: "Completed"
    },
    {
        id: "HP3",
        date: "2025-03-25",
        timeSlot: "Morning (8:00 AM - 12:00 PM)",
        material: "Mixed Aluminum",
        weight: "3.4 kg",
        status: "Completed"
    }
];

const CalendarDisplay = () => {
    // --- State for fetched data ---
    const [backendSettings, setBackendSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- Pickup History State ---
    const [upcomingPickups, setUpcomingPickups] = useState(mockUpcomingPickups);
    const [historyPickups, setHistoryPickups] = useState(mockHistoryPickups);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'history'

    // --- Component State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false);

    // --- Fetch Settings on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const settingsResponse = await fetch(`${API_BASE_URL}/settings`);

                if (!settingsResponse.ok) {
                    const errData = await settingsResponse.json();
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status} ${errData.message || 'Server error'}`);
                }

                const settingsData = await settingsResponse.json();

                if (settingsData.success && settingsData.data) {
                    // Convert Map-like object from backend to regular JS object if needed
                    const availableDaysObject = settingsData.data.availableDays instanceof Map
                        ? Object.fromEntries(settingsData.data.availableDays)
                        : settingsData.data.availableDays || {};

                    setBackendSettings({ ...settingsData.data, availableDays: availableDaysObject });
                } else {
                    throw new Error(settingsData.message || 'Failed to get valid settings data');
                }

                // In a real app, we would also fetch the user's pickup history and upcoming pickups
                // For now, we'll use the mock data

            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError(err.message || 'Could not load scheduling options. Please try refreshing.');
                setBackendSettings(null);
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

    // --- Date/Calendar Logic ---
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
        return settings.availableDays[dayOfWeek] === true; // Explicit check for true
    };

    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        setSelectedDate(new Date(year, month, day));
        setShowScheduleForm(true); // Show scheduling form when date is selected
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

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
            const isPast = isPastDate(day, month, year);
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
            if (specialDate) {
                dayClass += ` special-${specialDate.status}`;
            }

            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelect(day, month, year)}
                    disabled={isPast || !isAvailable}
                    aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvailable ? ' (Unavailable)' : ''}`}
                >
                    <span className="day-number">{day}</span>
                    {specialDate && <span className="special-indicator" title={specialDate.reason}>*</span>}
                </button>
            );
        }
        return calendarDays;
    };

    const renderPickupItem = (pickup, type) => {
        const isUpcoming = type === 'upcoming';
        
        return (
            <div key={pickup.id} className={`pickup-item ${pickup.status.toLowerCase()}`}>
                <div className="pickup-header">
                    <span className={`status-badge ${pickup.status.toLowerCase()}`}>
                        {pickup.status}
                    </span>
                    <span className="pickup-id">#{pickup.id}</span>
                </div>
                <div className="pickup-content">
                    <div className="pickup-detail">
                        <CalendarIcon size={16} />
                        <span>{formatDate(pickup.date)}</span>
                    </div>
                    <div className="pickup-detail">
                        <Clock size={16} />
                        <span>{pickup.timeSlot}</span>
                    </div>
                    <div className="pickup-detail">
                        <Recycle size={16} />
                        <span>{pickup.material}</span>
                    </div>
                    {!isUpcoming && pickup.weight && (
                        <div className="pickup-detail">
                            <Weight size={16} />
                            <span>{pickup.weight}</span>
                        </div>
                    )}
                </div>
                {isUpcoming && (
                    <div className="pickup-actions">
                        <button className="btn-reschedule">Reschedule</button>
                        <button className="btn-cancel">Cancel</button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="user-dashboard">
            {/* Display Global Loading Indicator */}
            {isLoading && (
                <div className="loading-overlay">
                    <Loader2 size={48} className="animate-spin" />
                    <p>Loading Schedule...</p>
                </div>
            )}

            {/* Display Global Error Message */}
            {!isLoading && error && (
                <div className="error-message-container global-error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Left Column - Calendar */}
                <div className="calendar-column">
                    <div className="column-header">
                        <h2>Schedule Pickup</h2>
                    </div>
                    
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
                            <span className="legend-item unavailable">Unavailable</span>
                            <span className="legend-item past">Past</span>
                        </div>
                        <div className="calendar-instructions">
                            <Info size={16} /> Select an available collection day (green) to schedule a pickup.
                        </div>
                    </div>

                    {/* Display Schedule Form when a date is selected */}
                    {showScheduleForm && selectedDate && (
                        <div className="schedule-form">
                            <h3>New Pickup on {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}</h3>
                            <button className="schedule-button">Schedule Pickup</button>
                            <button className="cancel-button" onClick={() => setShowScheduleForm(false)}>Cancel</button>
                        </div>
                    )}
                </div>

                {/* Right Column - Pickups List */}
                <div className="pickups-column">
                    <div className="column-header with-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            <Calendar size={16} /> Upcoming Pickups
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            <History size={16} /> Pickup History
                        </button>
                    </div>

                    <div className="pickups-list">
                        {activeTab === 'upcoming' ? (
                            upcomingPickups.length > 0 ? (
                                upcomingPickups.map(pickup => renderPickupItem(pickup, 'upcoming'))
                            ) : (
                                <div className="no-pickups">
                                    <Calendar size={48} />
                                    <p>No upcoming pickups scheduled.</p>
                                    <p>Use the calendar to schedule a pickup.</p>
                                </div>
                            )
                        ) : (
                            historyPickups.length > 0 ? (
                                historyPickups.map(pickup => renderPickupItem(pickup, 'history'))
                            ) : (
                                <div className="no-pickups">
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