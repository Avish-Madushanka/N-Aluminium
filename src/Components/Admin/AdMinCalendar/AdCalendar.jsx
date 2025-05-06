// src/Components/Admin/AdMinCalendar/AdCalendar.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle, Info
} from 'lucide-react';
import { ClipLoader } from 'react-spinners'; // Ensure react-spinners is installed
import './AdCalendar.css'; // Ensure this CSS file exists and is styled
import API_ENDPOINTS from '../../../apiConfig'; // Import the central API config
// Use API endpoints from the central config
const API_SETTINGS_URL = API_ENDPOINTS.ADMIN.SETTINGS; // e.g., 'http://localhost:5003/api/admin/settings'

const AdCalendar = () => {
  // --- State Variables ---
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [isSaving, setIsSaving] = useState(false); // For PUT request status
  const [error, setError] = useState(''); // General error messages
  const [success, setSuccess] = useState(''); // Success messages
  const [settingsData, setSettingsData] = useState(null); // Holds fetched settings object { availableDays, timeSlots, serviceAreas, specialDates, ... }
  const [currentDate, setCurrentDate] = useState(new Date()); // For calendar display month/year
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'timeslots', 'areas'

  // Editing States for list items
  const [editingTimeSlot, setEditingTimeSlot] = useState(null); // Stores the time slot being edited { id, label, time, active }
  const [newTimeSlot, setNewTimeSlot] = useState({ label: '', time: '', active: true }); // Form state for adding a new time slot
  const [editingServiceArea, setEditingServiceArea] = useState(null); // Stores the service area being edited { id, name, active }
  const [newServiceArea, setNewServiceArea] = useState({ name: '', active: true }); // Form state for adding a new service area

  // --- Static Data & Defaults ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const dayIndexesForDisplay = ['1', '2', '3', '4', '5', '6', '0']; // Mon-Sun order for UI toggles
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Define default structure in case backend doesn't provide complete data
  const DEFAULT_AVAILABLE_DAYS = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };
  const createDefaultSettingsStructure = () => ({
    availableDays: { ...DEFAULT_AVAILABLE_DAYS },
    timeSlots: [],
    serviceAreas: [],
    specialDates: [],
    _id: null, // Indicate it's default/not fetched
    singleton: true // Assuming the backend uses this pattern
  });

  // --- Calendar Navigation ---
  const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  // --- Fetch Settings Data ---
  const fetchSettings = useCallback(async () => {
    console.log("[AdCalendar] Fetching settings from:", API_SETTINGS_URL);
    setIsLoading(true);
    setError('');
    setSuccess('');
    setSettingsData(null); // Clear old data before fetching

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication Error: Admin token not found. Please log in.");
      setIsLoading(false);
      setSettingsData(createDefaultSettingsStructure()); // Use default empty structure
      return;
    }

    try {
      const response = await axios.get(API_SETTINGS_URL, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log("[AdCalendar] Fetch response received:", response);
      if (response.data?.success && response.data.data) {
        const fetched = response.data.data;
        console.log("[AdCalendar] Settings fetched successfully:", fetched);
        // Validate structure and ensure all expected arrays/objects exist
        setSettingsData({
          availableDays: (fetched.availableDays && typeof fetched.availableDays === 'object') ? fetched.availableDays : { ...DEFAULT_AVAILABLE_DAYS },
          timeSlots: Array.isArray(fetched.timeSlots) ? fetched.timeSlots : [],
          serviceAreas: Array.isArray(fetched.serviceAreas) ? fetched.serviceAreas : [],
          specialDates: Array.isArray(fetched.specialDates) ? fetched.specialDates : [],
          _id: fetched._id || null,
          singleton: fetched.singleton !== undefined ? fetched.singleton : true
        });
      } else {
        throw new Error(response.data?.message || 'Invalid response structure received from server.');
      }
    } catch (err) {
      console.error("[AdCalendar] Fetch Settings Error:", err);
      let errMsg = 'Could not load settings from server.';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errMsg = "Authorization Error: Cannot load settings. Ensure you are logged in as admin.";
        } else {
          errMsg = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status}).`;
        }
      } else if (err.request) {
        errMsg = "Network Error: Unable to connect to the server.";
      } else {
        errMsg = err.message || 'An unknown error occurred.';
      }
      setError(errMsg);
      setSettingsData(createDefaultSettingsStructure()); // Use default empty structure on error
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed, fetch is triggered manually or by useEffect below

  useEffect(() => {
    fetchSettings(); // Fetch settings when component mounts
  }, [fetchSettings]); // Dependency array includes the function itself

  // --- Calendar Rendering Logic ---
  const getMonthData = useCallback(() => {
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      console.error("[AdCalendar] Invalid currentDate:", currentDate, "Resetting to now.");
      const now = new Date();
      setCurrentDate(now); // Attempt recovery
      return { year: now.getFullYear(), month: now.getMonth(), startingDay: now.getDay(), daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() };
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, startingDay: startingDayOfWeek, daysInMonth: daysInCurrentMonth };
  }, [currentDate]);

  const isPastDate = (day) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthData = getMonthData();
    if (!monthData) return true; // Assume past if month data invalid
    const checkDate = new Date(monthData.year, monthData.month, day);
    return checkDate < today;
  };

  const isRegularCollectionDay = useCallback((day) => {
    const effectiveSettings = settingsData || createDefaultSettingsStructure();
    if (!effectiveSettings.availableDays) return false;
    const monthData = getMonthData();
    if (!monthData) return false; // Cannot determine day if month data invalid
    const date = new Date(monthData.year, monthData.month, day);
    const dayOfWeek = date.getDay().toString(); // 0-6 as string keys
    return !!effectiveSettings.availableDays[dayOfWeek];
  }, [settingsData, getMonthData]);

  const getSpecialDateStatus = useCallback((day) => {
    const effectiveSettings = settingsData || createDefaultSettingsStructure();
    if (!effectiveSettings.specialDates) return null;
    const monthData = getMonthData();
    if (!monthData) return null; // Cannot check if month data invalid
    const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialDate = effectiveSettings.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  }, [settingsData, getMonthData]);

  const isCollectionDay = useCallback((day) => {
    const specialStatus = getSpecialDateStatus(day);
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    return isRegularCollectionDay(day);
  }, [getSpecialDateStatus, isRegularCollectionDay]);

  // --- Handlers for Modifying Settings State ---

  // Toggle regular available day (e.g., always collect on Mondays)
  const handleAvailableDayChange = (dayIndexString) => {
    setSettingsData(prev => {
      if (!prev) return prev;
      const currentAvailability = prev.availableDays ? !!prev.availableDays[dayIndexString] : false;
      const newAvailableDays = {
        ...(prev.availableDays || { ...DEFAULT_AVAILABLE_DAYS }), // Ensure object exists
        [dayIndexString]: !currentAvailability
      };
      return { ...prev, availableDays: newAvailableDays };
    });
    setSuccess(''); // Clear success message on change
  };

  // Toggle special status for a specific calendar date
  const handleSpecialDateToggle = (day) => {
    const monthData = getMonthData();
    if (isPastDate(day) || !settingsData || !monthData) return;

    const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    setSettingsData(prev => {
      if (!prev) return prev;
      const currentSpecialDates = prev.specialDates || [];
      const existingIndex = currentSpecialDates.findIndex(d => d.date === dateStr);

      let newSpecialDatesList;
      if (existingIndex >= 0) {
        // Remove existing override
        newSpecialDatesList = currentSpecialDates.filter((_, i) => i !== existingIndex);
        console.log(`[AdCalendar] Removing special date override for ${dateStr}`);
      } else {
        // Add new override (opposite of regular schedule)
        const regularStatus = isRegularCollectionDay(day);
        const newStatus = regularStatus ? 'unavailable' : 'available';
        const id = `sd-${dateStr}-${Date.now().toString().slice(-5)}`; // Simple unique ID
        const newSpecialDate = { id, date: dateStr, status: newStatus };
        newSpecialDatesList = [...currentSpecialDates, newSpecialDate];
        console.log(`[AdCalendar] Adding special date override for ${dateStr}: ${newStatus}`);
      }
      return { ...prev, specialDates: newSpecialDatesList };
    });
    setSuccess('');
  };

  // --- List Item CRUD Helpers ---
  const generateItemId = (prefix, value) => `${prefix}-${(value || Date.now()).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 10)}-${Math.random().toString(36).substring(2, 7)}`;

  // Add item to a list (Time Slot or Service Area)
  const handleAddItem = (listKey, newItemState, setNewItemState, requiredFields) => {
    if (!settingsData) return;

    // Client-side validation
    for (const field of requiredFields) {
      if (!newItemState[field] || !newItemState[field].trim()) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty.`);
        return;
      }
    }
    // Check for duplicates (basic check based on label/name)
     const identifierField = newItemState.label !== undefined ? 'label' : 'name';
     const identifierValue = newItemState[identifierField];
     if (identifierValue && settingsData[listKey]?.some(item => item[identifierField]?.toLowerCase() === identifierValue.toLowerCase())) {
         alert(`An item with this ${identifierField} already exists.`);
         return;
     }


    const newItem = {
      ...newItemState,
      id: generateItemId(listKey.slice(0, 2), identifierValue), // Generate client-side ID
      active: newItemState.active !== undefined ? newItemState.active : true // Default to active
    };

    setSettingsData(prev => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), newItem]
    }));

    // Reset the 'add new' form state
    const resetState = Object.keys(newItemState).reduce((acc, key) => {
        acc[key] = key === 'active' ? true : ''; // Reset strings to empty, keep active as true
        return acc;
      }, {});
    setNewItemState(resetState);
    setSuccess('');
    console.log(`[AdCalendar] Added item to ${listKey}:`, newItem);
  };

  // Delete item from a list
  const handleDeleteItem = (listKey, idToDelete) => {
    if (!window.confirm(`Are you sure you want to delete this item? This action cannot be undone.`)) return;

    setSettingsData(prev => {
      if (!prev || !Array.isArray(prev[listKey])) return prev;
      const updatedList = prev[listKey].filter(item => item.id !== idToDelete);
      return { ...prev, [listKey]: updatedList };
    });
    // If currently editing the item being deleted, cancel edit mode
    if(listKey === 'timeSlots' && editingTimeSlot?.id === idToDelete) setEditingTimeSlot(null);
    if(listKey === 'serviceAreas' && editingServiceArea?.id === idToDelete) setEditingServiceArea(null);
    setSuccess('');
    console.log(`[AdCalendar] Deleted item ID ${idToDelete} from ${listKey}`);
  };

  // Toggle 'active' status of an item
  const handleToggleActive = (listKey, idToToggle) => {
    setSettingsData(prev => {
      if (!prev || !Array.isArray(prev[listKey])) return prev;
      const updatedList = prev[listKey].map(item =>
        item.id === idToToggle ? { ...item, active: !item.active } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
    setSuccess('');
    console.log(`[AdCalendar] Toggled active status for item ID ${idToToggle} in ${listKey}`);
  };

  // --- Edit Item Handlers ---

  // Time Slots
  const startEditTimeSlot = (slot) => setEditingTimeSlot({ ...slot });
  const cancelEditTimeSlot = () => setEditingTimeSlot(null);
  const handleEditingTimeSlotChange = (e) => {
    if (!editingTimeSlot) return;
    const { name, value, type, checked } = e.target;
    setEditingTimeSlot(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const saveEditTimeSlot = () => {
    if (!editingTimeSlot || !editingTimeSlot.label?.trim() || !editingTimeSlot.time?.trim()) {
      alert('Label and Time Range are required.'); return;
    }
    setSettingsData(prev => {
      if (!prev || !prev.timeSlots) return prev;
      // Basic duplicate check excluding self
      if (prev.timeSlots.some(slot => slot.id !== editingTimeSlot.id && slot.label?.toLowerCase() === editingTimeSlot.label?.toLowerCase())) {
          alert('Another time slot with this label already exists.');
          return prev; // Prevent saving duplicate label
      }
      const updatedSlots = prev.timeSlots.map(slot => slot.id === editingTimeSlot.id ? { ...editingTimeSlot } : slot);
      return { ...prev, timeSlots: updatedSlots };
    });
    console.log("[AdCalendar] Saved edited time slot:", editingTimeSlot);
    setEditingTimeSlot(null);
    setSuccess('');
  };

  // Service Areas
  const startEditServiceArea = (area) => setEditingServiceArea({ ...area });
  const cancelEditServiceArea = () => setEditingServiceArea(null);
  const handleEditingServiceAreaChange = (e) => {
    if (!editingServiceArea) return;
    const { name, value, type, checked } = e.target;
    setEditingServiceArea(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const saveEditServiceArea = () => {
    if (!editingServiceArea || !editingServiceArea.name?.trim()) {
      alert('Area Name is required.'); return;
    }
    setSettingsData(prev => {
       if (!prev || !prev.serviceAreas) return prev;
       // Basic duplicate check excluding self
       if (prev.serviceAreas.some(area => area.id !== editingServiceArea.id && area.name?.toLowerCase() === editingServiceArea.name?.toLowerCase())) {
           alert('Another service area with this name already exists.');
           return prev; // Prevent saving duplicate name
       }
       const updatedAreas = prev.serviceAreas.map(area => area.id === editingServiceArea.id ? { ...editingServiceArea } : area);
       return { ...prev, serviceAreas: updatedAreas };
    });
    console.log("[AdCalendar] Saved edited service area:", editingServiceArea);
    setEditingServiceArea(null);
    setSuccess('');
  };

  // --- Save All Settings to Backend ---
  const handleSaveAllSettings = async () => {
    if (editingTimeSlot || editingServiceArea) {
      alert("Please save or cancel any active item edits before saving all settings."); return;
    }
    if (!settingsData) {
      setError("Cannot save: Settings data is not loaded or available."); return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    const settingsToSave = {
      availableDays: settingsData.availableDays || { ...DEFAULT_AVAILABLE_DAYS },
      timeSlots: settingsData.timeSlots || [],
      serviceAreas: settingsData.serviceAreas || [],
      specialDates: settingsData.specialDates || [],
      // Include _id and singleton if your backend expects them for update identification
      _id: settingsData._id, // Might be null if fetched failed and defaults used
      singleton: settingsData.singleton // Assuming your backend uses this
    };

    // Remove temporary client-side IDs before sending if backend assigns real IDs
    // If backend DOES NOT re-assign IDs, keep the generated ones.
    // Example of removing temp IDs (uncomment if needed):
    // settingsToSave.timeSlots = settingsToSave.timeSlots.map(({ id, ...rest }) =>
    //   id.startsWith('ts-') ? rest : { id, ...rest } // Remove temp ID, keep existing backend IDs
    // );
    // settingsToSave.serviceAreas = settingsToSave.serviceAreas.map(({ id, ...rest }) =>
    //   id.startsWith('sa-') ? rest : { id, ...rest }
    // );
     // Special dates might also need ID handling depending on backend
     // settingsToSave.specialDates = settingsToSave.specialDates.map(({ id, ...rest }) =>
     //   id.startsWith('sd-') ? rest : { id, ...rest }
     // );


    console.log("[AdCalendar] Attempting to save settings to backend:", JSON.stringify(settingsToSave, null, 2));

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication Error: No admin token found. Please log in.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await axios.put(API_SETTINGS_URL, settingsToSave, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 15000
      });

      console.log("[AdCalendar] Save response received:", response);
      if (response.data?.success) {
        setSuccess('Settings saved successfully!');
        console.log("[AdCalendar] Backend save confirmation:", response.data);
        // IMPORTANT: Re-sync state with data returned from backend,
        // as backend might assign new IDs or perform other transformations.
        const updatedData = response.data.data;
        if (updatedData) {
           setSettingsData({ // Update state with the confirmed data from backend
               availableDays: updatedData.availableDays || { ...DEFAULT_AVAILABLE_DAYS },
               timeSlots: updatedData.timeSlots || [],
               serviceAreas: updatedData.serviceAreas || [],
               specialDates: updatedData.specialDates || [],
               _id: updatedData._id,
               singleton: updatedData.singleton
           });
        } else {
            // If backend didn't return updated data, log a warning but assume success
            console.warn("[AdCalendar] Backend reported success but didn't return updated settings data.");
        }
        setTimeout(() => setSuccess(''), 5000); // Clear success message
      } else {
        throw new Error(response.data?.message || 'Backend indicated failure when saving settings.');
      }
    } catch (err) {
      console.error("[AdCalendar] Save Settings Error:", err);
      let errMsg = 'Could not save settings to server.';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errMsg = "Authorization Error: Cannot save settings. Ensure you are logged in as admin.";
        } else if (err.response.status === 400) {
          errMsg = err.response.data?.error || err.response.data?.message || "Bad Request: Server rejected the settings data (check validation?).";
          // Potentially parse field errors from err.response.data.errors if backend sends them on PUT failure
           if (err.response.data?.errors) {
               console.error("Backend validation errors on save:", err.response.data.errors);
               // TODO: Potentially display these specific errors to the user
           }
        } else {
          errMsg = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status}).`;
        }
      } else if (err.request) {
        errMsg = "Network Error: Unable to connect to the server to save.";
      } else {
        errMsg = err.message || 'An unknown error occurred.';
      }
      setError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Calendar Rendering Function ---
  const renderCalendar = () => {
    const monthData = getMonthData();
    if (!monthData) return <div className="calendar-grid-error">Error preparing calendar data.</div>;

    const { startingDay, daysInMonth } = monthData;
    const calendarCells = [];

    for (let i = 0; i < startingDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      const specialStatus = getSpecialDateStatus(day);

      const dayClasses = [
        'calendar-day',
        isPast ? 'past' : 'future',
        isCollection ? 'collection' : 'no-collection',
        specialStatus ? `special-${specialStatus}` : ''
      ].filter(Boolean).join(' ');

      const title = isPast
        ? "Past date (cannot modify)"
        : `Status: ${isCollection ? 'Collection' : 'No Collection'}. ${specialStatus ? `Override: ${specialStatus}. ` : ''}Click to ${specialStatus ? 'remove override' : 'add override'}.`;

      calendarCells.push(
        <div
          key={`day-${day}`}
          className={dayClasses}
          onClick={() => !isPast && handleSpecialDateToggle(day)}
          title={title}
          aria-label={`Day ${day}, ${title}`}
          role="button"
          tabIndex={isPast ? -1 : 0}
          onKeyDown={(e) => { if (!isPast && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSpecialDateToggle(day); }}} // Keyboard accessibility
        >
          <span className="day-number">{day}</span>
          {specialStatus && (<div className={`status-indicator ${specialStatus}`} title={`Special Status: ${specialStatus}`}></div>)}
        </div>
      );
    }
    return calendarCells;
  };

  // --- Main Render ---
  if (isLoading) {
    // Show full page loader on initial load
    return <div className="loading-container"><ClipLoader size={50} color="#f97316" /><span>Loading Settings...</span></div>;
  }

  if (!settingsData && error) {
    // Handle critical fetch error after loading attempt
    return (
      <div className="admin-calendar-container error-state">
        <div className="error-banner critical-error">
          <AlertTriangle size={24} />
          <div>
            <h2>Failed to Load Settings</h2>
            <p>{error}</p>
            <button onClick={fetchSettings} className="retry-button">
              Retry Fetch
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have data (either fetched or default)
  const currentSettings = settingsData || createDefaultSettingsStructure();

  return (
    <div className="admin-calendar-container">
      <div className="admin-header">
        <Settings size={24} className="header-icon" />
        <h1>Manage Collection Settings</h1>
      </div>

      {/* Info Banner (Optional) */}
       <div className="info-banner">
          <Info size={18} />
          <span>Remember to click "Save All Settings" at the bottom to persist your changes.</span>
       </div>


      {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span> <button onClick={() => setError('')} className="close-banner-button">✕</button></div>}
      {success && <div className="success-banner"><Check size={18} /><span>{success}</span> <button onClick={() => setSuccess('')} className="close-banner-button">✕</button></div>}

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}><Calendar size={16} /><span>Calendar & Days</span></button>
        <button className={`admin-tab ${activeTab === 'timeslots' ? 'active' : ''}`} onClick={() => setActiveTab('timeslots')}><Clock size={16} /><span>Time Slots</span></button>
        <button className={`admin-tab ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}><MapPin size={16} /><span>Service Areas</span></button>
      </div>

      <div className="admin-content">
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="calendar-settings">
            <h2 className="section-heading">Set Regular Weekly Collection Days</h2>
            <div className="day-toggles">
              {dayIndexesForDisplay.map(index => (
                <button
                  key={index}
                  className={`day-toggle ${currentSettings.availableDays?.[index] ? 'active' : ''}`}
                  onClick={() => handleAvailableDayChange(index)}
                  aria-pressed={!!currentSettings.availableDays?.[index]}
                >
                  {daysOfWeekMap[index]}
                </button>
              ))}
            </div>

            <h2 className="section-heading mt-6">Override Specific Dates (Holidays, Special Events)</h2>
            <div className="admin-calendar">
              <div className="calendar-header">
                <button onClick={goToPrevMonth} className="nav-button" aria-label="Previous month"><ChevronLeft size={20} /></button>
                <h3 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <button onClick={goToNextMonth} className="nav-button" aria-label="Next month"><ChevronRight size={20} /></button>
              </div>
              <div className="weekday-header">{daysOfWeek.map(day => (<div key={day} className="weekday">{day}</div>))}</div>
              <div className="calendar-grid">{renderCalendar()}</div>
              <div className="calendar-legend">
                <div className="legend-item"><span className="legend-dot collection"></span> Scheduled Collection</div>
                <div className="legend-item"><span className="legend-dot no-collection"></span> No Regular Collection</div>
                 <div className="legend-item"><span className="legend-dot special-available"></span> Special Override: AVAILABLE</div>
                 <div className="legend-item"><span className="legend-dot special-unavailable"></span> Special Override: UNAVAILABLE</div>
              </div>
              <div className="calendar-info"><p>Click future dates to add or remove a collection override for that specific day.</p></div>
            </div>
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'timeslots' && (
          <div className="time-slots-settings list-settings">
            <h2 className="section-heading">Manage Collection Time Slots</h2>
            <p className="section-description">Configure time slots available for booking. Inactive slots won't be shown to users.</p>
            <div className="item-list">
              {(currentSettings.timeSlots || []).map(slot => (
                <div key={slot.id} className={`list-item ${!slot.active ? 'inactive' : ''}`}>
                  {editingTimeSlot?.id === slot.id ? (
                    <div className="editing-form">
                       <div className="form-grid-2">
                           <div className="form-group">
                             <label htmlFor={`edit-ts-label-${slot.id}`}>Label *</label>
                             <input id={`edit-ts-label-${slot.id}`} type="text" name="label" value={editingTimeSlot.label} onChange={handleEditingTimeSlotChange} placeholder="e.g., Morning" required/>
                           </div>
                           <div className="form-group">
                             <label htmlFor={`edit-ts-time-${slot.id}`}>Time Range *</label>
                             <input id={`edit-ts-time-${slot.id}`} type="text" name="time" value={editingTimeSlot.time} onChange={handleEditingTimeSlotChange} placeholder="e.g., 8 AM - 11 AM" required/>
                           </div>
                       </div>
                       <div className="form-group checkbox-group">
                         <label htmlFor={`edit-ts-active-${slot.id}`}>
                           <input id={`edit-ts-active-${slot.id}`} type="checkbox" name="active" checked={editingTimeSlot.active} onChange={handleEditingTimeSlotChange}/>
                           Active (Visible to users)
                         </label>
                       </div>
                      <div className="edit-actions">
                        <button onClick={saveEditTimeSlot} className="save-button"><Check size={16} /> Save Changes</button>
                        <button onClick={cancelEditTimeSlot} className="cancel-button"><X size={16} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-details">
                        <h4 className="item-label">{slot.label}</h4>
                        <p className="item-value">{slot.time}</p>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleToggleActive('timeSlots', slot.id)} className={`toggle-button ${slot.active ? 'active' : 'inactive'}`} title={slot.active ? 'Mark as inactive' : 'Mark as active'}>{slot.active ? 'Active' : 'Inactive'}</button>
                        <button onClick={() => startEditTimeSlot(slot)} className="edit-button" aria-label={`Edit ${slot.label}`}><Edit size={16} /></button>
                        <button onClick={() => handleDeleteItem('timeSlots', slot.id)} className="delete-button" aria-label={`Delete ${slot.label}`}><Trash size={16} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {/* Add New Form */}
              <div className="add-new-form">
                <h3>Add New Time Slot</h3>
                 <div className="form-grid-2">
                     <div className="form-group">
                       <label htmlFor="new-ts-label">Label *</label>
                       <input id="new-ts-label" type="text" value={newTimeSlot.label} onChange={e => setNewTimeSlot({...newTimeSlot, label: e.target.value})} placeholder="e.g., Evening" required/>
                     </div>
                     <div className="form-group">
                       <label htmlFor="new-ts-time">Time Range *</label>
                       <input id="new-ts-time" type="text" value={newTimeSlot.time} onChange={e => setNewTimeSlot({...newTimeSlot, time: e.target.value})} placeholder="e.g., 5 PM - 8 PM" required/>
                     </div>
                 </div>
                 <div className="form-group checkbox-group">
                   <label htmlFor="new-ts-active">
                     <input id="new-ts-active" type="checkbox" checked={newTimeSlot.active} onChange={e => setNewTimeSlot({...newTimeSlot, active: e.target.checked})}/>
                     Set as active
                   </label>
                 </div>
                <button onClick={() => handleAddItem('timeSlots', newTimeSlot, setNewTimeSlot, ['label', 'time'])} className="add-button"><Plus size={16} /> Add Time Slot</button>
              </div>
            </div>
          </div>
        )}

         {/* Service Areas Tab */}
        {activeTab === 'areas' && (
           <div className="service-areas-settings list-settings">
            <h2 className="section-heading">Manage Service Areas</h2>
             <p className="section-description">Define areas where collections are available. Inactive areas won't appear in booking options.</p>
             <div className="item-list">
              {(currentSettings.serviceAreas || []).map(area => (
                 <div key={area.id} className={`list-item ${!area.active ? 'inactive' : ''}`}>
                  {editingServiceArea?.id === area.id ? (
                     <div className="editing-form">
                        <div className="form-group"> {/* Removed grid here for simplicity */}
                          <label htmlFor={`edit-sa-name-${area.id}`}>Area Name *</label>
                          <input id={`edit-sa-name-${area.id}`} type="text" name="name" value={editingServiceArea.name} onChange={handleEditingServiceAreaChange} placeholder="e.g., North Zone" required/>
                        </div>
                        <div className="form-group checkbox-group">
                          <label htmlFor={`edit-sa-active-${area.id}`}>
                            <input id={`edit-sa-active-${area.id}`} type="checkbox" name="active" checked={editingServiceArea.active} onChange={handleEditingServiceAreaChange}/>
                            Active (Available for booking)
                          </label>
                        </div>
                       <div className="edit-actions">
                         <button onClick={saveEditServiceArea} className="save-button"><Check size={16} /> Save Changes</button>
                         <button onClick={cancelEditServiceArea} className="cancel-button"><X size={16} /> Cancel</button>
                       </div>
                     </div>
                  ) : (
                    <>
                       <div className="item-details">
                         <h4 className="item-label">{area.name}</h4>
                       </div>
                       <div className="item-actions">
                         <button onClick={() => handleToggleActive('serviceAreas', area.id)} className={`toggle-button ${area.active ? 'active' : 'inactive'}`} title={area.active ? 'Mark as inactive' : 'Mark as active'}>{area.active ? 'Active' : 'Inactive'}</button>
                         <button onClick={() => startEditServiceArea(area)} className="edit-button" aria-label={`Edit ${area.name}`}><Edit size={16} /></button>
                         <button onClick={() => handleDeleteItem('serviceAreas', area.id)} className="delete-button" aria-label={`Delete ${area.name}`}><Trash size={16} /></button>
                       </div>
                    </>
                  )}
                </div>
              ))}
              {/* Add New Form */}
               <div className="add-new-form">
                 <h3>Add New Service Area</h3>
                 <div className="form-group"> {/* Removed grid here */}
                   <label htmlFor="new-sa-name">Area Name *</label>
                   <input id="new-sa-name" type="text" value={newServiceArea.name} onChange={e => setNewServiceArea({...newServiceArea, name: e.target.value})} placeholder="e.g., Downtown Core" required/>
                 </div>
                 <div className="form-group checkbox-group">
                   <label htmlFor="new-sa-active">
                     <input id="new-sa-active" type="checkbox" checked={newServiceArea.active} onChange={e => setNewServiceArea({...newServiceArea, active: e.target.checked})}/>
                      Set as active
                   </label>
                 </div>
                 <button onClick={() => handleAddItem('serviceAreas', newServiceArea, setNewServiceArea, ['name'])} className="add-button"><Plus size={16} /> Add Service Area</button>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Footer Save Button */}
      <div className="admin-footer">
        <button
            onClick={handleSaveAllSettings}
            className="save-settings-button"
            disabled={isSaving || isLoading}
            aria-live="polite"
            aria-busy={isSaving}
        >
          {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;