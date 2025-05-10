// src/Components/UserCalendar/CalendarDisplay.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    AlertTriangle, Info, Loader2,
    Calendar as CalendarIcon
} from 'lucide-react';
import './CalendarDisplay.css';
import API_ENDPOINTS from '../../apiConfig';
// Assuming useAuth can tell us if the user is logged in.
// If not, we'll assume public user for this component's primary logic,
// and the redirection will handle the auth flow.
// import { useAuth } from '../../App'; // Or your AuthContext path

const API_BASE_URL = API_ENDPOINTS.API_ROOT;

const fallbackSettings = {
    availableDays: { '0': false, '1': false, '2': false, '3': false, '4': false, '5': false, '6': false },
    timeSlots: [], // Form is removed, so default timeslots not as critical here
    serviceAreas: [],
    specialDates: []
};

const CalendarDisplay = () => {
    // const { isLoggedIn } = useAuth(); // Optional: if you want to slightly alter behavior for logged-in users vs public on this page
    const navigate = useNavigate(); // For redirection

    const [backendSettings, setBackendSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextFourAvailableDays, setNextFourAvailableDays] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    // selectedDate is still useful to highlight on the calendar if a user clicks
    const [selectedDateVisual, setSelectedDateVisual] = useState(null);


    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
    const monthNames = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

    const settings = useMemo(() => {
        const base = backendSettings || fallbackSettings;
        let availableDaysObject = base.availableDays;
        if (base.availableDays instanceof Map) {
            availableDaysObject = Object.fromEntries(base.availableDays);
        } else if (typeof base.availableDays !== 'object' || base.availableDays === null) {
            availableDaysObject = fallbackSettings.availableDays;
        }
        return {
            ...base,
            // timeSlots, serviceAreas, specialDates from base or fallback
            timeSlots: Array.isArray(base.timeSlots) ? base.timeSlots : [],
            serviceAreas: Array.isArray(base.serviceAreas) ? base.serviceAreas : [],
            specialDates: Array.isArray(base.specialDates) ? base.specialDates : [],
            availableDays: availableDaysObject,
        };
    }, [backendSettings]);

    const isPastDate = useCallback((day, month, year) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(year, month, day);
        return checkDate < today;
    }, []);

    const getSpecialDateStatus = useCallback((day, month, year) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    }, [settings.specialDates]);

    // FIX APPLIED HERE: Wrapped isToday in useCallback
    const isToday = useCallback((day, month, year) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    }, []);
    
    const isCollectionDay = useCallback((day, month, year) => {
        if (isPastDate(day, month, year) && !isToday(day,month,year) ) return false;
        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) {
            return specialDate.status === 'available';
        }
        const date = new Date(year, month, day);
        const dayOfWeekKey = date.getDay().toString();
        return settings.availableDays[dayOfWeekKey] === true;
    }, [settings.availableDays, getSpecialDateStatus, isPastDate, isToday]);


    const findNextAvailableDays = useCallback((count) => {
        if (!settings || Object.keys(settings.availableDays).length === 0 || isLoading) return [];
        const available = [];
        let currentDateIteration = new Date();
        currentDateIteration.setHours(0,0,0,0);
        const maxIterations = 90;
        for (let i = 0; i < maxIterations && available.length < count; i++) {
            const day = currentDateIteration.getDate();
            const month = currentDateIteration.getMonth();
            const year = currentDateIteration.getFullYear();
            if (isCollectionDay(day, month, year)) {
                available.push(new Date(currentDateIteration));
            }
            currentDateIteration.setDate(currentDateIteration.getDate() + 1);
        }
        return available;
    }, [settings, isLoading, isCollectionDay]);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const settingsResponse = await fetch(`${API_BASE_URL}/calendar-settings`);
                if (!settingsResponse.ok) {
                    const errData = await settingsResponse.json().catch(() => ({ message: settingsResponse.statusText }));
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status} ${errData.message || 'Server error'}`);
                }
                const settingsData = await settingsResponse.json();
                if (settingsData.success && settingsData.data) {
                    setBackendSettings(settingsData.data);
                } else {
                    throw new Error(settingsData.message || 'Failed to get valid settings data');
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError(err.message || 'Could not load scheduling options. Please try refreshing.');
                setBackendSettings(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading && settings && Object.keys(settings.availableDays).length > 0) {
            setNextFourAvailableDays(findNextAvailableDays(4));
        }
    }, [isLoading, settings, findNextAvailableDays]);

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
        setSelectedDateVisual(null); // Clear visual selection on month change
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        setSelectedDateVisual(null); // Clear visual selection on month change
    };

    // Action when a date is selected or "Schedule" button is clicked
    const handleDateSelectionAction = (year, month, day) => {
        if (!isCollectionDay(day, month, year)) return;

        const selectedDateObject = new Date(year, month, day);
        setSelectedDateVisual(selectedDateObject); // For visual feedback on calendar

        // Format date as YYYY-MM-DD for query parameter
        // const dateParam = selectedDateObject.toISOString().split('T')[0]; // Not used directly for navigation param here
        
        // Redirect to UserCalendar (no specific date param needed here as UserCalendar has its own picker)
        navigate(`/UserCalendar`);
    };
    
    const handleScheduleAvailableDay = (dateToSchedule) => {
         // Navigate to UserCalendar (no specific date param needed here as UserCalendar has its own picker)
        // const dateParam = dateToSchedule.toISOString().split('T')[0]; // Not used directly for navigation param here
        navigate(`/UserCalendar`);
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(date.getTime())) return 'Invalid Date';
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };


    const renderCalendar = () => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="CDis-calendar-day CDis-empty"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const isSel = selectedDateVisual && selectedDateVisual.getTime() === dateObj.getTime();
            const isAvail = isCollectionDay(day, month, year);
            const isTod = isToday(day, month, year);
            const isPst = isPastDate(day, month, year);
            const specialDate = getSpecialDateStatus(day, month, year);
            let dayClass = 'CDis-calendar-day';
            if (isPst && !isTod) dayClass += ' CDis-past';
            else if (isAvail) dayClass += ' CDis-available';
            else dayClass += ' CDis-unavailable';
            if (isSel) dayClass += ' CDis-selected'; // Visual selection only
            if (isTod) dayClass += ' CDis-today';
            if (specialDate) dayClass += ` CDis-special-${specialDate.status}`;
            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleDateSelectionAction(year, month, day)} // Triggers redirection
                    disabled={(isPst && !isTod) || !isAvail}
                    aria-label={`Schedule pickup for ${monthNames[month]} ${day}, ${year}${!isAvail ? ' (Unavailable)' : ''}${isTod ? ' (Today)' : ''}`}
                    aria-pressed={isSel}
                >
                    <span className="CDis-day-number">{day}</span>
                    {specialDate && <span className="CDis-special-indicator" title={specialDate.reason}>*</span>}
                </button>
            );
        }
        return calendarDays;
    };

    // Main render
    return (
        <div className="CDis-user-dashboard">
            {isLoading && !backendSettings && (
                <div className="CDis-loading-overlay">
                    <Loader2 size={48} className="CDis-animate-spin" />
                    <p>Loading Availability...</p>
                </div>
            )}
            {!isLoading && error && (
                <div className="CDis-error-message-container CDis-global-error">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="CDis-dashboard-grid"> {/* Consider if grid is still needed or simplify to two columns */}
                <div className="CDis-calendar-column">
                    <div className="CDis-column-header"><h2>View Collection Availability</h2></div>
                    <div className="CDis-calendar-container">
                        <div className="CDis-calendar-header">
                            <button onClick={goToPrevMonth} className="CDis-nav-button" aria-label="Previous month" disabled={isLoading || !backendSettings}><ChevronLeft size={20} /></button>
                            <h2 className="CDis-current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                            <button onClick={goToNextMonth} className="CDis-nav-button" aria-label="Next month" disabled={isLoading || !backendSettings}><ChevronRight size={20} /></button>
                        </div>
                        <div className="CDis-weekday-header">{daysOfWeek.map(day => <div key={day} className="CDis-weekday">{day}</div>)}</div>
                        <div className="CDis-calendar-grid">
                            {(isLoading && !backendSettings) ? <p>Loading days...</p> : renderCalendar()}
                        </div>
                        <div className="CDis-calendar-legend">
                            <span className="CDis-legend-item CDis-today">Today</span>
                            <span className="CDis-legend-item CDis-available">Available</span>
                            <span className="CDis-legend-item CDis-selected">Selected</span>
                            <span className="CDis-legend-item CDis-unavailable">Unavailable</span>
                            <span className="CDis-legend-item CDis-past">Past</span>
                        </div>
                        <div className="CDis-calendar-instructions">
                            <Info size={16} /> Click an available day (green) to proceed to scheduling.
                        </div>
                    </div>
                    {/* Scheduling form is REMOVED from here */}
                </div>

                <div className="CDis-pickups-column"> {/* This column might be simplified or repurposed */}
                    <div className="CDis-column-header"><h2>Quick Schedule</h2></div>
                    <div className="CDis-available-slots-section">
                        <h4>Next Available Collection Days</h4>
                        {(isLoading && !backendSettings) || (isLoading && nextFourAvailableDays.length === 0 && !error) ? (
                            <div className="CDis-loading-pickups"><Loader2 size={20} className="CDis-animate-spin" /> Finding available days...</div>
                        ) : nextFourAvailableDays.length > 0 ? (
                            nextFourAvailableDays.map(date => (
                                <div key={date.toISOString()} className="CDis-available-day-item">
                                    <div className="CDis-available-day-info"><CalendarIcon size={16} /><span>{formatDate(date)} ({daysOfWeek[date.getDay()]})</span></div>
                                    <button className="CDis-btn-schedule-quick" onClick={() => handleScheduleAvailableDay(date)}>
                                        Schedule
                                    </button>
                                </div>
                            ))
                        ) : (
                            !error && <div className="CDis-no-pickups CDis-text-small"><Info size={18} /><p>No upcoming collection days found in the near future. Please check the main calendar or contact support.</p></div>
                        )}
                        {error && !backendSettings && <div className="CDis-no-pickups CDis-text-small"><AlertTriangle size={18} /><p>Could not load availability.</p></div> }
                    </div>
                    {/* "Your Scheduled Pickups" section is REMOVED */}
                </div>
            </div>
        </div>
    );
};

export default CalendarDisplay;