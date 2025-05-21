// src/Components/UserCalendar/CalendarDisplay.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Recycle, Clock, MapPin, Truck, AlertTriangle, Info, Loader2
} from 'lucide-react';
import './CalendarDisplay.css';
import API_ENDPOINTS from '../../apiConfig'; // Ensure this path is correct and API_ROOT is defined

const API_BASE_URL = API_ENDPOINTS.API_ROOT;
console.log("Imported API_ENDPOINTS:", API_ENDPOINTS); // <-- ADD THIS LINE

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
    } else if (typeof base.availableDays !== 'object' || base.availableDays === null || Array.isArray(base.availableDays)) {
      if (backendSettings) { // Only log warning if backendSettings was supposed to be used
        console.warn("CalendarDisplay: backendSettings.availableDays is not a valid object, using fallback. Received:", base.availableDays);
      }
      availableDaysObject = fallbackSettings.availableDays;
    } else {
      availableDaysObject = base.availableDays;
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
    if (settings.availableDays && typeof settings.availableDays === 'object' && settings.availableDays.hasOwnProperty(date.getDay().toString())) {
      return settings.availableDays[date.getDay().toString()] === true;
    }
    return false; 
  }, [settings.availableDays, getSpecialDateStatus, isPastDate, isToday]);

  const findNextAvailableDays = useCallback((count) => {
    if (!settings || typeof settings.availableDays !== 'object' || Object.keys(settings.availableDays).length === 0 || isLoading) {
        return [];
    }
    
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

      if (!API_BASE_URL || typeof API_BASE_URL !== 'string' || API_BASE_URL.trim() === '') {
        const apiConfigErrorMsg = "API_BASE_URL is not configured. Please check apiConfig.js or environment variables.";
        console.error(apiConfigErrorMsg, "Current value for API_BASE_URL:", API_BASE_URL);
        setError(apiConfigErrorMsg);
        setIsLoading(false);
        setBackendSettings(null); 
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/calendar-settings`);

        if (!response.ok) {
          let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
          let responseBodySnippet = "(Could not read error response body)";
          try {
            const errorBodyText = await response.text();
            responseBodySnippet = errorBodyText.substring(0, 200); // Get first 200 chars for preview
            // Try to parse as JSON in case the error response is structured (some APIs do this)
            try {
              const jsonError = JSON.parse(errorBodyText);
              if (jsonError && jsonError.message) {
                errorDetail += ` - API Message: ${jsonError.message}`;
              } else {
                errorDetail += ` - Server Response (HTML/Text): ${responseBodySnippet}...`;
              }
            } catch (e) {
              // Not JSON, so it's likely HTML or plain text.
              errorDetail += ` - Server Response (HTML/Text): ${responseBodySnippet}...`;
            }
          } catch (textError) {
            // Failed to even get text body.
            errorDetail += ` - ${responseBodySnippet}`;
          }
          console.error("Full server response for !response.ok:", response);
          throw new Error(`Failed to fetch settings. ${errorDetail}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          let responseText = "[Could not read response text]";
          try {
             responseText = await response.text();
          } catch (e) { /* ignore, already set default for snippet */ }
          const bodySnippet = responseText.substring(0, 200);
          console.warn("Expected JSON, but received Content-Type:", contentType, "Body preview:", bodySnippet);
          throw new Error(`Expected JSON response from server, but received '${contentType || 'unknown content type'}'. Body preview: ${bodySnippet}...`);
        }

        const settingsData = await response.json(); // This can still throw SyntaxError if body is malformed JSON despite correct Content-Type
        
        if (settingsData && settingsData.success && settingsData.data) {
          if (typeof settingsData.data.availableDays !== 'object' || settingsData.data.availableDays === null) {
             console.warn("Received settings, but 'availableDays' is not a valid object:", settingsData.data.availableDays);
             throw new Error("Received invalid 'availableDays' structure from API.");
          }
          setBackendSettings(settingsData.data);
        } else {
          throw new Error(settingsData.message || 'API response was not successful or data is missing.');
        }
      } catch (err) {
        // err could be a SyntaxError from response.json() if content-type was json but body was not
        // or it could be one of the custom errors thrown above.
        console.error("Error fetching initial data (see details below):", err.message);
        if (err.stack) console.error(err.stack); // Log stack for better debugging
        setError(err.message || 'Could not load scheduling options. Please try refreshing the page.');
        setBackendSettings(null); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []); // API_BASE_URL comes from module scope, assumed constant for component lifecycle

  useEffect(() => {
    if (!isLoading && settings && Object.keys(settings.availableDays).length > 0) {
      setNextFourAvailableDays(findNextAvailableDays(4));
    } else if (!isLoading && error) { 
      setNextFourAvailableDays([]);
    }
  }, [isLoading, settings, error, findNextAvailableDays]);

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
  
  const handleScheduleAvailableDay = (/* date */) => { 
    navigate('/UserCalendar');
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid Date';
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderCalendar = () => {
    if (isLoading && !backendSettings && !error) {
        return <div className="CDis-calendar-message"><p>Loading days...</p></div>;
    }
    // If there's an error and backendSettings never loaded, fallbackSettings will be used by `settings`.
    // The calendar will attempt to render based on fallback, which might show all days as unavailable.
    // A global error message is already shown outside the grid.

    const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
    const calendarDays = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="CDis-calendar-day CDis-empty" />);
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
            <span className="CDis-special-indicator" title={specialDate.reason || (specialDate.status === 'available' ? 'Special availability status' : 'Special unavailability status')}>*</span>
          )}
        </button>
      );
    }
    
    return calendarDays;
  };

  return (
    <div className="CDis-user-dashboard">
      {isLoading && !backendSettings && !error && (
        <div className="CDis-loading-overlay">
          <Loader2 size={48} className="CDis-animate-spin" />
          <p>Loading Availability...</p>
        </div>
      )}
      
      {!isLoading && error && ( // Show error prominently if it exists
        <div className="CDis-error-message-container CDis-global-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Render the grid structure even if there was an error, 
          so specific sections can show their error/empty states or use fallback data */}
      <div className="CDis-dashboard-grid">
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
                disabled={isLoading && !backendSettings && !error} // Disable only during initial hard load without error
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
                disabled={isLoading && !backendSettings && !error}
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
              {renderCalendar()}
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

        <div className="CDis-pickups-column">
          <div className="CDis-column-header">
            <h2>Quick Schedule</h2>
          </div>
          
          <div className="CDis-available-slots-section">
            <h4>Next Available Collection Days</h4>
            
            {(isLoading && nextFourAvailableDays.length === 0 && !error) ? (
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
            ) : ( // Error exists, and no days could be determined
              <div className="CDis-no-pickups CDis-text-small">
                <AlertTriangle size={18} />
                {/* Show the main error message, or a more specific one if appropriate */}
                <p>{error || "Could not load upcoming availability due to an error."}</p> 
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDisplay;