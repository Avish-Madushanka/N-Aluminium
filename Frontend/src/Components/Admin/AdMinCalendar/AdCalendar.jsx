// src/Components/Admin/AdMinCalendar/AdCalendar.jsx (Frontend-Only)

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle, Info
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css'; // Ensure this CSS file exists

const AdCalendar = () => {
  // --- State Variables ---
  const [isLoading, setIsLoading] = useState(true); // Still useful for initial setup simulation
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsData, setSettingsData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  // Editing States
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState({ label: '', time: '', active: true });
  const [editingServiceArea, setEditingServiceArea] = useState(null);
  const [newServiceArea, setNewServiceArea] = useState({ name: '', active: true });

  // --- Static Data & Defaults ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  const dayIndexesForDisplay = ['1', '2', '3', '4', '5', '6', '0']; // Mon-Sun for UI
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DEFAULT_AVAILABLE_DAYS = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };

  // --- Default Settings for Frontend-Only Mode ---
  const initializeDefaultSettings = () => ({
    availableDays: { ...DEFAULT_AVAILABLE_DAYS },
    timeSlots: [
      { id: "ts-morning-default", label: "Morning", time: "8:00 AM - 12:00 PM", active: true },
      { id: "ts-afternoon-default", label: "Afternoon", time: "1:00 PM - 5:00 PM", active: true },
    ],
    serviceAreas: [
      { id: "sa-north-default", name: "North Zone", active: true },
      { id: "sa-south-default", name: "South Zone", active: false },
    ],
    specialDates: [
      // Example: { id: 'sd-2024-12-25-example', date: '2024-12-25', status: 'unavailable', reason: 'Christmas Day' }
    ],
    // _id: null, // Not relevant for frontend-only unless simulating
    // singleton: true,
  });

  // --- Calendar Navigation ---
  const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  // --- Initialize Settings Data (Frontend-Only) ---
  useEffect(() => {
    console.log("[AdCalendar] Initializing settings (Frontend-Only Mode)");
    setIsLoading(true);
    // Simulate a short delay as if fetching
    setTimeout(() => {
      // Load from localStorage if available, otherwise use defaults
      const storedSettings = localStorage.getItem('adminCalendarSettings');
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          // Basic validation of stored structure
          if (parsed && typeof parsed.availableDays === 'object' && Array.isArray(parsed.timeSlots)) {
            setSettingsData(parsed);
            console.log("[AdCalendar] Loaded settings from localStorage:", parsed);
          } else {
            throw new Error("Invalid settings structure in localStorage.");
          }
        } catch (e) {
          console.warn("[AdCalendar] Error parsing settings from localStorage, using defaults:", e);
          setSettingsData(initializeDefaultSettings());
        }
      } else {
        setSettingsData(initializeDefaultSettings());
        console.log("[AdCalendar] No settings in localStorage, initialized with defaults.");
      }
      setIsLoading(false);
    }, 500); // Simulate 0.5 second load time
  }, []);

  // --- Calendar Rendering Logic (Unchanged) ---
  const getMonthData = useCallback(() => { /* ... (same as before) ... */
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      const now = new Date(); setCurrentDate(now);
      return { year: now.getFullYear(), month: now.getMonth(), startingDay: now.getDay(), daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() };
    }
    const year = currentDate.getFullYear(); const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1); const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, startingDay: startingDayOfWeek, daysInMonth: daysInCurrentMonth };
  }, [currentDate]);

  const isPastDate = (day) => { /* ... (same as before) ... */
    const today = new Date(); today.setHours(0, 0, 0, 0); const monthData = getMonthData();
    if (!monthData) return true; const checkDate = new Date(monthData.year, monthData.month, day);
    return checkDate < today;
  };

  const isRegularCollectionDay = useCallback((day) => { /* ... (same as before, but use initializeDefaultSettings if settingsData is null) ... */
    const effectiveSettings = settingsData || initializeDefaultSettings();
    if (!effectiveSettings.availableDays) return false; const monthData = getMonthData();
    if (!monthData) return false; const date = new Date(monthData.year, monthData.month, day);
    const dayOfWeek = date.getDay().toString(); return !!effectiveSettings.availableDays[dayOfWeek];
  }, [settingsData, getMonthData]);

  const getSpecialDateStatus = useCallback((day) => { /* ... (same as before, but use initializeDefaultSettings if settingsData is null) ... */
    const effectiveSettings = settingsData || initializeDefaultSettings();
    if (!effectiveSettings.specialDates) return null; const monthData = getMonthData();
    if (!monthData) return null; const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialDate = effectiveSettings.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  }, [settingsData, getMonthData]);

  const isCollectionDay = useCallback((day) => { /* ... (same as before) ... */
    const specialStatus = getSpecialDateStatus(day); if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false; return isRegularCollectionDay(day);
  }, [getSpecialDateStatus, isRegularCollectionDay]);


  // --- Handlers for Modifying Settings State (Unchanged) ---
  const handleAvailableDayChange = (dayIndexString) => { /* ... (same as before, ensures settingsData exists) ... */
    setSettingsData(prev => {
      if (!prev) return initializeDefaultSettings(); // Initialize if null
      const currentAvailability = prev.availableDays ? !!prev.availableDays[dayIndexString] : false;
      const newAvailableDays = { ...(prev.availableDays || { ...DEFAULT_AVAILABLE_DAYS }), [dayIndexString]: !currentAvailability };
      return { ...prev, availableDays: newAvailableDays };
    }); setSuccess('');
  };

  const handleSpecialDateToggle = (day) => { /* ... (same as before, ensures settingsData exists) ... */
    const monthData = getMonthData(); if (isPastDate(day) || !monthData) return;
    const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSettingsData(prev => {
      if (!prev) return initializeDefaultSettings(); // Initialize if null
      const currentSpecialDates = prev.specialDates || [];
      const existingIndex = currentSpecialDates.findIndex(d => d.date === dateStr); let newSpecialDatesList;
      if (existingIndex >= 0) { newSpecialDatesList = currentSpecialDates.filter((_, i) => i !== existingIndex); }
      else { const regularStatus = isRegularCollectionDay(day); const newStatus = regularStatus ? 'unavailable' : 'available';
        const id = `sd-${dateStr}-${Date.now().toString().slice(-5)}`; newSpecialDatesList = [...currentSpecialDates, { id, date: dateStr, status: newStatus }]; }
      return { ...prev, specialDates: newSpecialDatesList };
    }); setSuccess('');
  };

  // --- List Item CRUD Helpers (Unchanged) ---
  const generateItemId = (prefix, value) => `${prefix}-${(value || Date.now()).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0,10)}-${Math.random().toString(36).substring(2,7)}`;
  const handleAddItem = (listKey, newItemState, setNewItemState, requiredFields) => { /* ... (same as before, ensures settingsData exists) ... */
    for (const field of requiredFields) { if (!newItemState[field]?.trim()) { alert(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty.`); return; }}
    const identifierField = newItemState.label !== undefined ? 'label' : 'name'; const identifierValue = newItemState[identifierField];
    const currentList = settingsData?.[listKey] || [];
    if (identifierValue && currentList.some(item => item[identifierField]?.toLowerCase() === identifierValue.toLowerCase())) { alert(`An item with this ${identifierField} already exists.`); return; }
    const newItem = { ...newItemState, id: generateItemId(listKey.slice(0,2), identifierValue), active: newItemState.active !== undefined ? newItemState.active : true };
    setSettingsData(prev => ({ ...(prev || initializeDefaultSettings()), [listKey]: [...(prev?.[listKey] || []), newItem] }));
    const resetState = Object.keys(newItemState).reduce((acc, key) => { acc[key] = key === 'active' ? true : ''; return acc; }, {}); setNewItemState(resetState); setSuccess('');
  };
  const handleDeleteItem = (listKey, idToDelete) => { /* ... (same as before, ensures settingsData exists) ... */
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;
    setSettingsData(prev => { if (!prev || !Array.isArray(prev[listKey])) return prev; const updatedList = prev[listKey].filter(item => item.id !== idToDelete); return { ...prev, [listKey]: updatedList }; });
    if(listKey === 'timeSlots' && editingTimeSlot?.id === idToDelete) setEditingTimeSlot(null); if(listKey === 'serviceAreas' && editingServiceArea?.id === idToDelete) setEditingServiceArea(null); setSuccess('');
  };
  const handleToggleActive = (listKey, idToToggle) => { /* ... (same as before, ensures settingsData exists) ... */
    setSettingsData(prev => { if (!prev || !Array.isArray(prev[listKey])) return prev; const updatedList = prev[listKey].map(item => item.id === idToToggle ? { ...item, active: !item.active } : item ); return { ...prev, [listKey]: updatedList }; }); setSuccess('');
  };

  // --- Edit Item Handlers (Unchanged) ---
  const startEditTimeSlot = (slot) => setEditingTimeSlot({ ...slot }); const cancelEditTimeSlot = () => setEditingTimeSlot(null);
  const handleEditingTimeSlotChange = (e) => { if (!editingTimeSlot) return; const { name, value, type, checked } = e.target; setEditingTimeSlot(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  const saveEditTimeSlot = () => { /* ... (same as before, ensures settingsData exists) ... */
    if (!editingTimeSlot || !editingTimeSlot.label?.trim() || !editingTimeSlot.time?.trim()) { alert('Label and Time Range are required.'); return; }
    setSettingsData(prev => { if (!prev || !prev.timeSlots) return prev; if (prev.timeSlots.some(slot => slot.id !== editingTimeSlot.id && slot.label?.toLowerCase() === editingTimeSlot.label?.toLowerCase())) { alert('Another time slot with this label already exists.'); return prev; }
    const updatedSlots = prev.timeSlots.map(slot => slot.id === editingTimeSlot.id ? { ...editingTimeSlot } : slot); return { ...prev, timeSlots: updatedSlots }; });
    setEditingTimeSlot(null); setSuccess('');
  };
  const startEditServiceArea = (area) => setEditingServiceArea({ ...area }); const cancelEditServiceArea = () => setEditingServiceArea(null);
  const handleEditingServiceAreaChange = (e) => { if (!editingServiceArea) return; const { name, value, type, checked } = e.target; setEditingServiceArea(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  const saveEditServiceArea = () => { /* ... (same as before, ensures settingsData exists) ... */
    if (!editingServiceArea || !editingServiceArea.name?.trim()) { alert('Area Name is required.'); return; }
    setSettingsData(prev => { if (!prev || !prev.serviceAreas) return prev; if (prev.serviceAreas.some(area => area.id !== editingServiceArea.id && area.name?.toLowerCase() === editingServiceArea.name?.toLowerCase())) { alert('Another service area with this name already exists.'); return prev; }
    const updatedAreas = prev.serviceAreas.map(area => area.id === editingServiceArea.id ? { ...editingServiceArea } : area); return { ...prev, serviceAreas: updatedAreas }; });
    setEditingServiceArea(null); setSuccess('');
  };

  // --- "Save All Settings" (Frontend-Only: Log to console and localStorage) ---
  const handleSaveAllSettings = () => {
    if (editingTimeSlot || editingServiceArea) {
      alert("Please save or cancel active item edits before saving all settings."); return;
    }
    if (!settingsData) {
      setError("Cannot save: Settings data is not loaded."); return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    console.log("[AdCalendar] Current settings state to be 'saved':", JSON.stringify(settingsData, null, 2));

    // Simulate saving
    setTimeout(() => {
      try {
        localStorage.setItem('adminCalendarSettings', JSON.stringify(settingsData));
        setSuccess('Settings saved to Local Storage successfully!');
        console.log("[AdCalendar] Settings 'saved' to localStorage.");
      } catch (e) {
        setError("Failed to save settings to Local Storage. Storage might be full or unavailable.");
        console.error("[AdCalendar] Error saving to localStorage:", e);
      } finally {
        setIsSaving(false);
        setTimeout(() => setSuccess(''), 5000);
      }
    }, 1000);
  };

  // --- Calendar Rendering Function (Unchanged) ---
  const renderCalendar = () => { /* ... (same as before) ... */
    const monthData = getMonthData(); if (!monthData) return <div className="calendar-grid-error">Error preparing calendar.</div>;
    const { startingDay, daysInMonth } = monthData; const calendarCells = [];
    for (let i = 0; i < startingDay; i++) { calendarCells.push(<div key={`empty-${i}`} className="calendar-empty"></div>); }
    for (let day = 1; day <= daysInMonth; day++) { const isPast = isPastDate(day); const isCollection = isCollectionDay(day); const specialStatus = getSpecialDateStatus(day);
      const dayClasses = ['calendar-day', isPast ? 'past' : 'future', isCollection ? 'collection' : 'no-collection', specialStatus ? `special-${specialStatus}` : ''].filter(Boolean).join(' ');
      const title = isPast ? "Past date" : `Status: ${isCollection ? 'Collection' : 'No Collection'}. ${specialStatus ? `Override: ${specialStatus}. ` : ''}Click to toggle override.`;
      calendarCells.push( <div key={`day-${day}`} className={dayClasses} onClick={() => !isPast && handleSpecialDateToggle(day)} title={title} role="button" tabIndex={isPast ? -1 : 0} onKeyDown={(e) => { if (!isPast && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSpecialDateToggle(day); }}} > <span className="day-number">{day}</span> {specialStatus && (<div className={`status-indicator ${specialStatus}`} title={`Special: ${specialStatus}`}></div>)} </div> );
    } return calendarCells;
  };

  // --- Main Render ---
  if (isLoading || !settingsData) { // Show loader if loading or settingsData is still null
    return <div className="loading-container"><ClipLoader size={50} color="#f97316" /><span>Loading Settings...</span></div>;
  }

  // Now settingsData is guaranteed to be an object (either from localStorage or default)
  const currentSettings = settingsData;


  return (
    <div className="admin-calendar-container">
      <div className="admin-header">
        <Settings size={24} className="header-icon" />
        <h1>Manage Collection Settings</h1>
      </div>

      <div className="info-banner">
        <Info size={18} />
        <span>Changes are managed locally. Click "Save All Settings" to persist them (simulated as saving to Local Storage).</span>
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
                <div className="legend-item"><span className="legend-dot collection"></span> Scheduled Collection</div>
                <div className="legend-item"><span className="legend-dot no-collection"></span> No Regular Collection</div>
                <div className="legend-item"><span className="legend-dot special-available"></span> Override: AVAILABLE</div>
                <div className="legend-item"><span className="legend-dot special-unavailable"></span> Override: UNAVAILABLE</div>
              </div>
              <div className="calendar-info"><p>Click future dates to toggle collection overrides.</p></div>
            </div>
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'timeslots' && (
          <div className="time-slots-settings list-settings">
            {/* ... (Time Slot UI from previous version, ensure it uses currentSettings.timeSlots) ... */}
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
                           <input id={`edit-ts-active-${slot.id}`} type="checkbox" name="active" checked={editingTimeSlot.active} onChange={handleEditingTimeSlotChange}/> Active
                         </label>
                       </div>
                      <div className="edit-actions">
                        <button onClick={saveEditTimeSlot} className="save-button"><Check size={16} /> Save</button>
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
                        <button onClick={() => handleToggleActive('timeSlots', slot.id)} className={`toggle-button ${slot.active ? 'active' : 'inactive'}`}>{slot.active ? 'Active' : 'Inactive'}</button>
                        <button onClick={() => startEditTimeSlot(slot)} className="edit-button"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteItem('timeSlots', slot.id)} className="delete-button"><Trash size={16} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
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
                 <div className="form-group checkbox-group"> <label htmlFor="new-ts-active"> <input id="new-ts-active" type="checkbox" checked={newTimeSlot.active} onChange={e => setNewTimeSlot({...newTimeSlot, active: e.target.checked})}/> Set as active </label> </div>
                <button onClick={() => handleAddItem('timeSlots', newTimeSlot, setNewTimeSlot, ['label', 'time'])} className="add-button"><Plus size={16} /> Add Slot</button>
              </div>
            </div>
          </div>
        )}

         {/* Service Areas Tab */}
        {activeTab === 'areas' && (
           <div className="service-areas-settings list-settings">
            {/* ... (Service Area UI from previous version, ensure it uses currentSettings.serviceAreas) ... */}
            <h2 className="section-heading">Manage Service Areas</h2>
             <p className="section-description">Define areas where collections are available. Inactive areas won't appear in booking options.</p>
             <div className="item-list">
              {(currentSettings.serviceAreas || []).map(area => (
                 <div key={area.id} className={`list-item ${!area.active ? 'inactive' : ''}`}>
                  {editingServiceArea?.id === area.id ? (
                     <div className="editing-form">
                        <div className="form-group">
                          <label htmlFor={`edit-sa-name-${area.id}`}>Area Name *</label>
                          <input id={`edit-sa-name-${area.id}`} type="text" name="name" value={editingServiceArea.name} onChange={handleEditingServiceAreaChange} placeholder="e.g., North Zone" required/>
                        </div>
                        <div className="form-group checkbox-group"> <label htmlFor={`edit-sa-active-${area.id}`}> <input id={`edit-sa-active-${area.id}`} type="checkbox" name="active" checked={editingServiceArea.active} onChange={handleEditingServiceAreaChange}/> Active </label> </div>
                       <div className="edit-actions">
                         <button onClick={saveEditServiceArea} className="save-button"><Check size={16} /> Save</button>
                         <button onClick={cancelEditServiceArea} className="cancel-button"><X size={16} /> Cancel</button>
                       </div>
                     </div>
                  ) : (
                    <>
                       <div className="item-details"><h4 className="item-label">{area.name}</h4></div>
                       <div className="item-actions">
                         <button onClick={() => handleToggleActive('serviceAreas', area.id)} className={`toggle-button ${area.active ? 'active' : 'inactive'}`}>{area.active ? 'Active' : 'Inactive'}</button>
                         <button onClick={() => startEditServiceArea(area)} className="edit-button"><Edit size={16} /></button>
                         <button onClick={() => handleDeleteItem('serviceAreas', area.id)} className="delete-button"><Trash size={16} /></button>
                       </div>
                    </>
                  )}
                </div>
              ))}
               <div className="add-new-form">
                 <h3>Add New Service Area</h3>
                 <div className="form-group">
                   <label htmlFor="new-sa-name">Area Name *</label>
                   <input id="new-sa-name" type="text" value={newServiceArea.name} onChange={e => setNewServiceArea({...newServiceArea, name: e.target.value})} placeholder="e.g., Downtown Core" required/>
                 </div>
                 <div className="form-group checkbox-group"> <label htmlFor="new-sa-active"> <input id="new-sa-active" type="checkbox" checked={newServiceArea.active} onChange={e => setNewServiceArea({...newServiceArea, active: e.target.checked})}/> Set as active </label> </div>
                 <button onClick={() => handleAddItem('serviceAreas', newServiceArea, setNewServiceArea, ['name'])} className="add-button"><Plus size={16} /> Add Area</button>
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
        >
          {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings (Local)'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;