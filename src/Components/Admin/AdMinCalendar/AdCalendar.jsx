// src/Components/Admin/AdMinCalendar/AdCalendar.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css'; // Ensure CSS file exists
import API_ENDPOINTS from '../../../apiConfig'; // Import the central API config

// Use API endpoints from the central config
const API_SETTINGS_URL = API_ENDPOINTS.ADMIN.SETTINGS; // Correct endpoint for GET/PUT settings

const AdCalendar = () => {
  // --- State Variables ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsData, setSettingsData] = useState(null); // Holds the entire settings object
  const [currentDate, setCurrentDate] = useState(new Date()); // For calendar display
  const [activeTab, setActiveTab] = useState('calendar'); // For UI tabs

  // Editing States for lists
  const [editingTimeSlot, setEditingTimeSlot] = useState(null); // { id, label, time, active }
  const [newTimeSlot, setNewTimeSlot] = useState({ label: '', time: '', active: true });
  const [editingServiceArea, setEditingServiceArea] = useState(null); // { id, name, active }
  const [newServiceArea, setNewServiceArea] = useState({ name: '', active: true });

  // --- Static Data ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const dayIndexes = ['1', '2', '3', '4', '5', '6', '0']; // Order for displaying toggles
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DEFAULT_AVAILABLE_DAYS = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };

  // --- Calendar navigation functions ---
  const goToPrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

   // --- Default settings structure (used if fetch fails unexpectedly) ---
   const createDefaultSettingsStructure = () => ({
    availableDays: DEFAULT_AVAILABLE_DAYS,
    timeSlots: [],
    serviceAreas: [],
    specialDates: []
  });

  // --- Fetch Settings ---
  const fetchSettings = useCallback(async () => {
    console.log("Attempting to fetch settings from:", API_SETTINGS_URL);
    setIsLoading(true);
    setError('');
    setSuccess(''); // Clear previous success messages

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Admin authentication token not found. Please log in as admin.");
      setIsLoading(false);
      setSettingsData(createDefaultSettingsStructure()); // Show empty structure
      return; // Stop fetching if no token
    }

    try {
      const response = await axios.get(API_SETTINGS_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token for authentication
          'Content-Type': 'application/json'
        },
        timeout: 8000 // Set a reasonable timeout
      });

      if (response.data?.success && response.data.data) {
        console.log("Settings fetched successfully:", response.data.data);
        const fetched = response.data.data;
        // Ensure data structure integrity, use defaults if parts are missing
        setSettingsData({
            availableDays: fetched.availableDays && typeof fetched.availableDays === 'object' ? fetched.availableDays : DEFAULT_AVAILABLE_DAYS,
            timeSlots: Array.isArray(fetched.timeSlots) ? fetched.timeSlots : [],
            serviceAreas: Array.isArray(fetched.serviceAreas) ? fetched.serviceAreas : [],
            specialDates: Array.isArray(fetched.specialDates) ? fetched.specialDates : [],
            _id: fetched._id,
            singleton: fetched.singleton
        });
      } else {
        // Handle cases where API returns success:false or unexpected structure
        throw new Error(response.data?.message || 'Received unsuccessful or invalid response when fetching settings.');
      }
    } catch (err) {
      console.error("Fetch Settings Error:", err);
      let errMsg = 'Could not load settings from server.';

      if (err.response) {
        // Server responded with an error status
        if (err.response.status === 401 || err.response.status === 403) {
          errMsg = "Authorization Error: You are not authorized to view settings. Please ensure you are logged in as an admin.";
          // Optionally clear token if it's invalid
          // localStorage.removeItem('token');
        } else if (err.response.status === 404) {
          errMsg = "Settings API endpoint not found. Please contact the administrator.";
        } else {
          errMsg = err.response.data?.message || `Server error (${err.response.status}) while fetching settings.`;
        }
      } else if (err.request) {
        // Request was made but no response (network error, server down)
        errMsg = "Network Error: Could not connect to the server to fetch settings.";
      } else {
        // Other errors (e.g., setup)
        errMsg = err.message || 'An unknown error occurred while fetching settings.';
      }
      setError(errMsg);
      // Set a default structure so the UI doesn't completely break
      setSettingsData(createDefaultSettingsStructure());
    } finally {
      setIsLoading(false);
    }
  }, []); // Add empty dependency array to ensure it behaves like componentDidMount

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]); // Run fetchSettings when the component mounts

  // --- Calendar utility functions ---
   const getMonthData = useCallback(() => {
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
    if (!validDate) {
      console.error("Invalid currentDate in getMonthData:", currentDate);
      const now = new Date();
      setCurrentDate(now); // Reset to current date if invalid
      return { year: now.getFullYear(), month: now.getMonth(), startingDay: now.getDay(), daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() };
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, startingDay: startingDayOfWeek, daysInMonth: daysInCurrentMonth };
  }, [currentDate]);

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
     if (!validDate) return true; // Treat as past if date is invalid
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const isRegularCollectionDay = useCallback((day) => {
    if (!settingsData?.availableDays) return false;
     const validDate = currentDate instanceof Date && !isNaN(currentDate);
     if (!validDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay(); // 0-6
    return !!settingsData.availableDays[dayOfWeek.toString()];
  }, [settingsData?.availableDays, currentDate]);

  const getSpecialDateStatus = useCallback((day) => {
    if (!settingsData?.specialDates) return null;
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
     if (!validDate) return null;
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialDate = settingsData.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null; // 'available' or 'unavailable'
  }, [settingsData?.specialDates, currentDate]);

  const isCollectionDay = useCallback((day) => {
    const specialStatus = getSpecialDateStatus(day);
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    // If no special status, rely on the regular schedule
    return isRegularCollectionDay(day);
  }, [getSpecialDateStatus, isRegularCollectionDay]);


  // --- State Modification Handlers ---
  const handleAvailableDayChange = (dayIndex) => {
    setSettingsData(prev => {
      if (!prev || !prev.availableDays) return prev; // Prevent updates if data isn't loaded
      // Create a new object for availableDays to ensure state update triggers re-render
      const newAvailableDays = {
          ...prev.availableDays,
          [dayIndex]: !prev.availableDays[dayIndex]
      };
      return {
        ...prev,
        availableDays: newAvailableDays
      };
    });
     // Clear success message when changes are made before saving
     setSuccess('');
  };

  const handleSpecialDateToggle = (day) => {
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
    if (isPastDate(day) || !settingsData || !validDate) return;

    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    setSettingsData(prev => {
      const currentSpecialDates = prev.specialDates || [];
      const existingIndex = currentSpecialDates.findIndex(d => d.date === dateStr);

      let newSpecialDatesList;
      if (existingIndex >= 0) {
        // Remove existing override
        newSpecialDatesList = currentSpecialDates.filter((_, i) => i !== existingIndex);
        console.log(`Removing special date override for ${dateStr}`);
      } else {
        // Add new override (opposite of regular schedule for that day)
        const regularStatus = isRegularCollectionDay(day);
        const newStatus = regularStatus ? 'unavailable' : 'available';
        // Generate a more robust unique ID (useful if backend needs it, good practice)
        const id = `sd-${dateStr}-${Math.random().toString(36).substring(2, 9)}`; // Example ID
        const newSpecialDate = { id, date: dateStr, status: newStatus };
        newSpecialDatesList = [...currentSpecialDates, newSpecialDate];
        console.log(`Adding special date override for ${dateStr}: ${newStatus}`);
      }
      return { ...prev, specialDates: newSpecialDatesList };
    });
     // Clear success message when changes are made before saving
     setSuccess('');
  };

 // --- List Modification Handlers (Time Slots, Service Areas) ---

  // Generate a simple unique enough ID for new items added client-side
  const generateItemId = (prefix, value) => {
      const base = value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `item-${Date.now()}`;
      return `${prefix}-${base}-${Math.random().toString(36).substring(2, 7)}`;
  };


  // Generic add item handler
  const handleAddItem = (listName, newItemData, idField = 'id', requiredFields = []) => {
      // Basic validation
      for (const field of requiredFields) {
          if (!newItemData[field] || !newItemData[field].trim()) {
              alert(`${field.charAt(0).toUpperCase() + field.slice(1)} is required to add an item.`);
              return;
          }
      }

      setSettingsData(prev => {
          if (!prev) return prev;
          const currentList = prev[listName] || [];
          // Generate ID based on label/name or fallback
          const identifierValue = newItemData.label || newItemData.name;
          const newItemId = generateItemId(listName.slice(0, 2), identifierValue);

          // Check for duplicate names/labels if needed (optional but good)
          if ((newItemData.label && currentList.some(item => item.label === newItemData.label)) ||
              (newItemData.name && currentList.some(item => item.name === newItemData.name))) {
              alert(`An item with this name/label already exists in ${listName}.`);
              return prev;
          }

          console.log(`Adding item to ${listName}:`, { ...newItemData, [idField]: newItemId });
          return { ...prev, [listName]: [...currentList, { ...newItemData, [idField]: newItemId }] };
      });
       setSuccess(''); // Clear success message
  };

  // Generic delete item handler
  const handleDeleteItem = (listName, idToDelete, idField = 'id') => {
    if (!window.confirm(`Are you sure you want to delete this item from ${listName}?`)) return;
    setSettingsData(prev => {
      if (!prev || !Array.isArray(prev[listName])) return prev;
      const updatedList = prev[listName].filter(item => item[idField] !== idToDelete);
      console.log(`Deleting item with ID ${idToDelete} from ${listName}`);
      return { ...prev, [listName]: updatedList };
    });
    setSuccess('');
  };

  // Generic toggle active handler
  const handleToggleActive = (listName, idToToggle, idField = 'id') => {
    setSettingsData(prev => {
      if (!prev || !Array.isArray(prev[listName])) return prev;
      const updatedList = prev[listName].map(item =>
        item[idField] === idToToggle ? { ...item, active: !item.active } : item
      );
      console.log(`Toggling active status for item ID ${idToToggle} in ${listName}`);
      return { ...prev, [listName]: updatedList };
    });
     setSuccess('');
  };

  // --- Time Slot Specific Edit/Add ---
  const startEditTimeSlot = (slot) => setEditingTimeSlot({ ...slot });
  const cancelEditTimeSlot = () => setEditingTimeSlot(null);
  const handleEditingTimeSlotChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingTimeSlot(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const saveEditTimeSlot = () => {
    if (!editingTimeSlot || !editingTimeSlot.label?.trim() || !editingTimeSlot.time?.trim()) {
        alert('Label and Time Range are required.');
        return;
    }
    setSettingsData(prev => {
        if (!prev || !prev.timeSlots) return prev;
        const updatedSlots = prev.timeSlots.map(slot =>
            slot.id === editingTimeSlot.id ? { ...editingTimeSlot } : slot
        );
        return { ...prev, timeSlots: updatedSlots };
    });
    console.log("Saved edited time slot:", editingTimeSlot);
    setEditingTimeSlot(null);
    setSuccess('');
  };
  const addTimeSlotHandler = () => {
      handleAddItem('timeSlots', newTimeSlot, 'id', ['label', 'time']);
      // Reset the form only if add was successful (handleAddItem doesn't return status, so we assume it worked if no alert)
      if (newTimeSlot.label?.trim() && newTimeSlot.time?.trim()) {
         setNewTimeSlot({ label: '', time: '', active: true }); // Reset form
      }
  };

  // --- Service Area Specific Edit/Add ---
  const startEditServiceArea = (area) => setEditingServiceArea({ ...area });
  const cancelEditServiceArea = () => setEditingServiceArea(null);
  const handleEditingServiceAreaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingServiceArea(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const saveEditServiceArea = () => {
     if (!editingServiceArea || !editingServiceArea.name?.trim()) {
         alert('Area Name is required.');
         return;
     }
    setSettingsData(prev => {
         if (!prev || !prev.serviceAreas) return prev;
        const updatedAreas = prev.serviceAreas.map(area =>
            area.id === editingServiceArea.id ? { ...editingServiceArea } : area
        );
       return { ...prev, serviceAreas: updatedAreas };
    });
     console.log("Saved edited service area:", editingServiceArea);
    setEditingServiceArea(null);
    setSuccess('');
  };
  const addServiceAreaHandler = () => {
      handleAddItem('serviceAreas', newServiceArea, 'id', ['name']);
      // Reset form only if add was successful
       if (newServiceArea.name?.trim()) {
         setNewServiceArea({ name: '', active: true }); // Reset form
      }
  };

  // --- Save All Settings Handler ---
  const handleSaveAllSettings = async () => {
    if (editingTimeSlot || editingServiceArea) {
      alert("Please save or cancel any active edits before saving all settings.");
      return;
    }
    if (!settingsData) {
      setError("Cannot save: Settings data is not available.");
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    // Prepare data payload, ensure lists are arrays
    const settingsToSave = {
      availableDays: settingsData.availableDays || DEFAULT_AVAILABLE_DAYS,
      timeSlots: settingsData.timeSlots || [],
      serviceAreas: settingsData.serviceAreas || [],
      specialDates: settingsData.specialDates || [],
    };
    console.log("Attempting to save settings to backend:", settingsToSave);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication Error: No admin token found. Please log in.");
      setIsSaving(false);
      return;
    }

    try {
      // Make PUT request to the backend settings endpoint
      const response = await axios.put(API_SETTINGS_URL, settingsToSave, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the admin token
          'Content-Type': 'application/json'
        },
         timeout: 10000 // Slightly longer timeout for save operations
      });

      if (response.data?.success) {
        setSuccess('Settings saved successfully!');
        console.log("Backend confirmation received:", response.data);
        // Optionally re-sync local state with the exact data returned by backend
        // This is good practice if the backend modifies data (e.g., assigns real IDs)
        const updatedData = response.data.data;
         if (updatedData) {
            setSettingsData({
                availableDays: updatedData.availableDays || DEFAULT_AVAILABLE_DAYS,
                timeSlots: updatedData.timeSlots || [],
                serviceAreas: updatedData.serviceAreas || [],
                specialDates: updatedData.specialDates || [],
                _id: updatedData._id,
                singleton: updatedData.singleton
            });
         }
        setTimeout(() => setSuccess(''), 4000); // Clear success message after a delay
      } else {
        // Handle cases where backend returns success: false
        throw new Error(response.data?.message || 'Backend indicated failure when saving settings.');
      }
    } catch (err) {
      console.error("Save Settings Error:", err);
       let errMsg = 'Could not save settings to server.';
        if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                 errMsg = "Authorization Error: You are not authorized to save settings. Please log in again as admin.";
                 // localStorage.removeItem('token'); // Optionally clear token
            } else {
                 errMsg = err.response.data?.message || `Server error (${err.response.status}) while saving settings.`;
            }
        } else if (err.request) {
            errMsg = "Network Error: Could not connect to the server to save settings.";
        } else {
            errMsg = err.message || 'An unknown error occurred while saving settings.';
        }
      setError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Calendar Rendering Function ---
  const renderCalendar = () => {
    const monthData = getMonthData();
    if (!monthData) return <div className="p-4 text-center text-red-500">Error displaying calendar.</div>;

    const { startingDay, daysInMonth } = monthData;
    const calendarDays = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      const specialStatus = getSpecialDateStatus(day); // 'available', 'unavailable', or null

      // Determine CSS classes based on status
      const dayClasses = [
        'calendar-day',
        isPast ? 'past' : 'future',
        isCollection ? 'collection' : 'no-collection',
        specialStatus ? `special-${specialStatus}` : '' // e.g., special-available
      ].filter(Boolean).join(' ');

      calendarDays.push(
        <div
          key={`day-${day}`}
          className={dayClasses}
          // Only allow toggling future dates
          onClick={() => !isPast && handleSpecialDateToggle(day)}
          title={isPast ? "Past date (cannot modify)" : `Status: ${isCollection ? 'Collection' : 'No Collection'}. Click to toggle special status.`}
          aria-label={`Day ${day}, Status: ${isCollection ? 'Collection' : 'No Collection'}${specialStatus ? ', Special Status: ' + specialStatus : ''}`}
          role="button"
          tabIndex={isPast ? -1 : 0} // Make clickable days focusable
        >
          <span className="day-number">{day}</span>
          {/* Display indicator dot for special overrides */}
          {specialStatus && (<div className={`status-indicator ${specialStatus}`} title={`Special Status: ${specialStatus}`}></div>)}
        </div>
      );
    }
    return calendarDays;
  };

  // --- Main Render ---
  if (isLoading && !settingsData) {
     // Show loader only if settingsData is still null (initial load)
    return <div className="loading-container"><ClipLoader size={50} color="#f97316" /><span>Loading Settings...</span></div>;
  }

  // Handle case where fetching failed but we have default structure
  if (!settingsData && error) {
     return (
       <div className="admin-calendar-container p-4">
         <div className="error-banner flex items-center gap-2">
           <AlertTriangle size={18} />
           <span>{error}</span>
           {/* Provide a retry button */}
           <button onClick={fetchSettings} className="ml-auto text-sm text-blue-600 hover:underline font-semibold">Retry Fetch</button>
         </div>
         {/* Optionally render a disabled view or minimal UI */}
       </div>
     );
  }

  // Main UI Render when data is available (or default structure is used)
  const currentSettings = settingsData || createDefaultSettingsStructure(); // Use loaded or default data

  return (
    <div className="admin-calendar-container">
      <div className="admin-header">
        <Settings size={24} className="header-icon" />
        <h1>Manage Collection Settings</h1>
      </div>

      {/* Removed AdminInfoBanner */}

      {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span> <button onClick={() => setError('')} className="close-banner-button" aria-label="Close error message">✕</button></div>}
      {success && <div className="success-banner"><Check size={18} /><span>{success}</span> <button onClick={() => setSuccess('')} className="close-banner-button" aria-label="Close success message">✕</button></div>}

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}><Calendar size={16} /><span>Calendar & Days</span></button>
        <button className={`admin-tab ${activeTab === 'timeslots' ? 'active' : ''}`} onClick={() => setActiveTab('timeslots')}><Clock size={16} /><span>Time Slots</span></button>
        <button className={`admin-tab ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}><MapPin size={16} /><span>Service Areas</span></button>
      </div>

      <div className="admin-content">
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="calendar-settings">
            <h2 className="section-heading">Set Regular Available Days</h2>
            <div className="day-toggles">
              {dayIndexes.map(index => (
                <button
                  key={index}
                  className={`day-toggle ${currentSettings.availableDays?.[index] ? 'active' : ''}`}
                  onClick={() => handleAvailableDayChange(index)}
                  aria-pressed={currentSettings.availableDays?.[index]}
                >
                  {daysOfWeekMap[index]}
                </button>
              ))}
            </div>

            <h2 className="section-heading mt-6">Override Specific Dates</h2>
            <div className="admin-calendar">
              <div className="calendar-header">
                <button onClick={goToPrevMonth} className="nav-button" aria-label="Previous month"><ChevronLeft size={20} /></button>
                <h3 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <button onClick={goToNextMonth} className="nav-button" aria-label="Next month"><ChevronRight size={20} /></button>
              </div>
              <div className="weekday-header">{daysOfWeek.map(day => (<div key={day} className="weekday">{day}</div>))}</div>
              <div className="calendar-grid">{renderCalendar()}</div>
              <div className="calendar-legend">
                <div className="legend-item"><span className="legend-dot collection"></span> Regular Collection</div>
                <div className="legend-item"><span className="legend-dot no-collection"></span> Regular - No Collection</div>
                <div className="legend-item"><span className="legend-dot special-available"></span> Special - Added</div>
                <div className="legend-item"><span className="legend-dot special-unavailable"></span> Special - Removed</div>
              </div>
              <div className="calendar-info"><p>Click future dates to toggle special status.</p></div>
            </div>
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'timeslots' && (
          <div className="time-slots-settings list-settings"> {/* Added list-settings class */}
            <h2 className="section-heading">Manage Collection Time Slots</h2>
            <p className="section-description">
              Configure time slots available for scheduling. Active slots appear in the booking form.
            </p>
            <div className="item-list"> {/* Changed class */}
              {currentSettings.timeSlots.map(slot => (
                <div key={slot.id} className={`list-item ${!slot.active ? 'inactive' : ''}`}> {/* Changed class */}
                  {editingTimeSlot?.id === slot.id ? (
                    <div className="editing-form">
                      {/* Editing Form Inputs */}
                       <div className="form-group">
                         <label htmlFor={`edit-ts-label-${slot.id}`}>Label</label>
                         <input id={`edit-ts-label-${slot.id}`} type="text" name="label" value={editingTimeSlot.label} onChange={handleEditingTimeSlotChange} placeholder="e.g., Morning" required/>
                       </div>
                       <div className="form-group">
                         <label htmlFor={`edit-ts-time-${slot.id}`}>Time Range</label>
                         <input id={`edit-ts-time-${slot.id}`} type="text" name="time" value={editingTimeSlot.time} onChange={handleEditingTimeSlotChange} placeholder="e.g., 8:00 AM - 11:00 AM" required/>
                       </div>
                       <div className="form-group checkbox">
                         <label htmlFor={`edit-ts-active-${slot.id}`}>
                           <input id={`edit-ts-active-${slot.id}`} type="checkbox" name="active" checked={editingTimeSlot.active} onChange={handleEditingTimeSlotChange}/>
                           Active
                         </label>
                       </div>
                      <div className="edit-actions">
                        <button onClick={saveEditTimeSlot} className="save-button"><Check size={16} /> Save</button>
                        <button onClick={cancelEditTimeSlot} className="cancel-button"><X size={16} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Display View */}
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
                 <div className="form-group">
                   <label htmlFor="new-ts-label">Label</label>
                   <input id="new-ts-label" type="text" value={newTimeSlot.label} onChange={e => setNewTimeSlot({...newTimeSlot, label: e.target.value})} placeholder="e.g., Evening" required/>
                 </div>
                 <div className="form-group">
                   <label htmlFor="new-ts-time">Time Range</label>
                   <input id="new-ts-time" type="text" value={newTimeSlot.time} onChange={e => setNewTimeSlot({...newTimeSlot, time: e.target.value})} placeholder="e.g., 5:00 PM - 8:00 PM" required/>
                 </div>
                 <div className="form-group checkbox">
                   <label htmlFor="new-ts-active">
                     <input id="new-ts-active" type="checkbox" checked={newTimeSlot.active} onChange={e => setNewTimeSlot({...newTimeSlot, active: e.target.checked})}/>
                     Active by default
                   </label>
                 </div>
                <button onClick={addTimeSlotHandler} className="add-button"><Plus size={16} /> Add Time Slot</button>
              </div>
            </div>
          </div>
        )}

         {/* Service Areas Tab */}
        {activeTab === 'areas' && (
           <div className="service-areas-settings list-settings"> {/* Added list-settings class */}
            <h2 className="section-heading">Manage Service Areas</h2>
             <p className="section-description">
              Configure geographical areas where collection service is offered.
             </p>
             <div className="item-list"> {/* Changed class */}
              {currentSettings.serviceAreas.map(area => (
                 <div key={area.id} className={`list-item ${!area.active ? 'inactive' : ''}`}> {/* Changed class */}
                  {editingServiceArea?.id === area.id ? (
                     <div className="editing-form">
                       {/* Editing Form Inputs */}
                        <div className="form-group">
                          <label htmlFor={`edit-sa-name-${area.id}`}>Area Name</label>
                          <input id={`edit-sa-name-${area.id}`} type="text" name="name" value={editingServiceArea.name} onChange={handleEditingServiceAreaChange} placeholder="e.g., North Side" required/>
                        </div>
                        <div className="form-group checkbox">
                          <label htmlFor={`edit-sa-active-${area.id}`}>
                            <input id={`edit-sa-active-${area.id}`} type="checkbox" name="active" checked={editingServiceArea.active} onChange={handleEditingServiceAreaChange}/>
                            Active
                          </label>
                        </div>
                       <div className="edit-actions">
                         <button onClick={saveEditServiceArea} className="save-button"><Check size={16} /> Save</button>
                         <button onClick={cancelEditServiceArea} className="cancel-button"><X size={16} /> Cancel</button>
                       </div>
                     </div>
                  ) : (
                    <>
                      {/* Display View */}
                       <div className="item-details">
                         <h4 className="item-label">{area.name}</h4>
                         {/* No extra value needed here */}
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
                 <div className="form-group">
                   <label htmlFor="new-sa-name">Area Name</label>
                   <input id="new-sa-name" type="text" value={newServiceArea.name} onChange={e => setNewServiceArea({...newServiceArea, name: e.target.value})} placeholder="e.g., West End" required/>
                 </div>
                 <div className="form-group checkbox">
                   <label htmlFor="new-sa-active">
                     <input id="new-sa-active" type="checkbox" checked={newServiceArea.active} onChange={e => setNewServiceArea({...newServiceArea, active: e.target.checked})}/>
                     Active by default
                   </label>
                 </div>
                 <button onClick={addServiceAreaHandler} className="add-button"><Plus size={16} /> Add Service Area</button>
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
            disabled={isSaving || isLoading} // Disable if saving or still loading initial data
            aria-live="polite" // Announce changes for screen readers
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