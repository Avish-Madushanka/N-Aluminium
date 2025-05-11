// src/Components/UserCalendar/CalendarDisplay.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Recycle, Clock, MapPin, Truck, AlertTriangle, Info, Loader2
} from 'lucide-react';
import './CalendarDisplay.css';
import API_ENDPOINTS from '../../apiConfig';

const API_BASE_URL = API_ENDPOINTS.API_ROOT;

const fallbackSettings = {
  availableDays: { '0': false, '1': false, '2': false, '3': false, '4': false, '5': false, '6': false },
  timeSlots: [],
  serviceAreas: [],
  specialDates: []
};

const CalendarDisplay = () => {
  const navigate = useNavigate();
  const [backendSettings, setBackendSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextFourAvailableDays, setNextFourAvailableDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateVisual, setSelectedDateVisual] = useState(null);

  const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
  const monthNames = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

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
      timeSlots: Array.isArray(base.timeSlots) ? base.timeSlots : [],
      serviceAreas: Array.isArray(base.serviceAreas) ? base.serviceAreas : [],
      specialDates: Array.isArray(base.specialDates) ? base.specialDates : [],
      availableDays: availableDaysObject,
    };
  }, [backendSettings]);

  const isPastDate = useCallback((day, month, year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(year, month, day) < today;
  }, []);

  const isToday = useCallback((day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  }, []);

  const getSpecialDateStatus = useCallback((day, month, year) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return settings.specialDates.find(d => d.date === dateStr);
  }, [settings.specialDates]);

  const isCollectionDay = useCallback((day, month, year) => {
    if (isPastDate(day, month, year) && !isToday(day, month, year)) return false;
    
    const specialDate = getSpecialDateStatus(day, month, year);
    if (specialDate) return specialDate.status === 'available';
    
    const date = new Date(year, month, day);
    return settings.availableDays[date.getDay().toString()] === true;
  }, [settings.availableDays, getSpecialDateStatus, isPastDate, isToday]);

  const findNextAvailableDays = useCallback((count) => {
    if (!settings || Object.keys(settings.availableDays).length === 0 || isLoading) return [];
    
    const available = [];
    let currentDateIteration = new Date();
    currentDateIteration.setHours(0, 0, 0, 0);
    
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
          const errData = await settingsResponse.json().catch(() => ({ 
            message: settingsResponse.statusText 
          }));
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
    return {
      year,
      month,
      startingDayOfWeek: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    };
  };

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDateVisual(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDateVisual(null);
  };

  const handleDateSelectionAction = (year, month, day) => {
    if (!isCollectionDay(day, month, year)) return;
    
    const selectedDateObject = new Date(year, month, day);
    setSelectedDateVisual(selectedDateObject);
    navigate('/UserCalendar');
  };
  
  const handleScheduleAvailableDay = () => {
    navigate('/UserCalendar');
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
    
    // Empty days for start of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="CDis-calendar-day CDis-empty" />);
    }
    
    // Actual days of month
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
      
      if (isSel) dayClass += ' CDis-selected';
      if (isTod) dayClass += ' CDis-today';
      if (specialDate) dayClass += ` CDis-special-${specialDate.status}`;
      
      calendarDays.push(
        <button
          key={`day-${day}`}
          className={dayClass}
          onClick={() => handleDateSelectionAction(year, month, day)}
          disabled={(isPst && !isTod) || !isAvail}
          aria-label={`Schedule pickup for ${monthNames[month]} ${day}, ${year}${!isAvail ? ' (Unavailable)' : ''}${isTod ? ' (Today)' : ''}`}
          aria-pressed={isSel}
        >
          <span className="CDis-day-number">{day}</span>
          {specialDate && (
            <span className="CDis-special-indicator" title={specialDate.reason}>*</span>
          )}
        </button>
      );
    }
    
    return calendarDays;
  };

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

      <div className="CDis-dashboard-grid">
        {/* Calendar Column */}
        <div className="CDis-calendar-column">
          <div className="CDis-column-header">
            <h2>View Collection Availability</h2>
          </div>
          
          <div className="CDis-calendar-container">
            <div className="CDis-calendar-header">
              <button 
                onClick={goToPrevMonth} 
                className="CDis-nav-button" 
                aria-label="Previous month" 
                disabled={isLoading || !backendSettings}
              >
                <ChevronLeft size={20} />
              </button>
              
              <h2 className="CDis-current-month">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button 
                onClick={goToNextMonth} 
                className="CDis-nav-button" 
                aria-label="Next month" 
                disabled={isLoading || !backendSettings}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="CDis-weekday-header">
              {daysOfWeek.map(day => (
                <div key={day} className="CDis-weekday">{day}</div>
              ))}
            </div>
            
            <div className="CDis-calendar-grid">
              {(isLoading && !backendSettings) ? (
                <p>Loading days...</p>
              ) : renderCalendar()}
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
        </div>

        {/* Quick Schedule Column */}
        <div className="CDis-pickups-column">
          <div className="CDis-column-header">
            <h2>Quick Schedule</h2>
          </div>
          
          <div className="CDis-available-slots-section">
            <h4>Next Available Collection Days</h4>
            
            {(isLoading && !backendSettings) || 
             (isLoading && nextFourAvailableDays.length === 0 && !error) ? (
              <div className="CDis-loading-pickups">
                <Loader2 size={20} className="CDis-animate-spin" /> 
                Finding available days...
              </div>
            ) : nextFourAvailableDays.length > 0 ? (
              nextFourAvailableDays.map(date => (
                <div key={date.toISOString()} className="CDis-available-day-item">
                  <div className="CDis-available-day-info">
                    <CalendarIcon size={16} />
                    <span>
                      {formatDate(date)} ({daysOfWeek[date.getDay()]})
                    </span>
                  </div>
                  <button 
                    className="CDis-btn-schedule-quick" 
                    onClick={() => handleScheduleAvailableDay(date)}
                  >
                    Schedule
                  </button>
                </div>
              ))
            ) : !error ? (
              <div className="CDis-no-pickups CDis-text-small">
                <Info size={18} />
                <p>No upcoming collection days found in the near future. Please check the main calendar or contact support.</p>
              </div>
            ) : (
              <div className="CDis-no-pickups CDis-text-small">
                <AlertTriangle size={18} />
                <p>Could not load availability.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDisplay;