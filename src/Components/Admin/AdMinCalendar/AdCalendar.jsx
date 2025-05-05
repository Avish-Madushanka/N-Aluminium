// src/Components/Admin/AdCalendar/AdCalendar.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css'; // Ensure CSS file exists

const API_SETTINGS_URL = '/api/settings';

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

  // --- Fetch Settings ---
  const fetchSettings = useCallback(async () => {
    console.log("Attempting to fetch settings...");
    setIsLoading(true);
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Admin token not found. Please log in again.");
      const response = await axios.get(API_SETTINGS_URL, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data?.success && response.data.data) {
        console.log("Settings fetched successfully:", response.data.data);
        const fetched = response.data.data;
        // Ensure nested arrays/objects exist and set defaults if necessary
        setSettingsData({
            availableDays: fetched.availableDays && typeof fetched.availableDays === 'object' ? fetched.availableDays : DEFAULT_AVAILABLE_DAYS,
            timeSlots: Array.isArray(fetched.timeSlots) ? fetched.timeSlots : [],
            serviceAreas: Array.isArray(fetched.serviceAreas) ? fetched.serviceAreas : [],
            specialDates: Array.isArray(fetched.specialDates) ? fetched.specialDates : [],
            _id: fetched._id, // Store _id if needed for backend consistency, though singleton is key
            singleton: fetched.singleton // Store if needed
        });
      } else {
        // Handle backend indicating failure but not throwing HTTP error
        throw new Error(response.data?.message || 'Received unsuccessful response fetching settings');
      }
    } catch (err) {
      console.error("Fetch Settings Error:", err);
      const errMsg = err.response?.data?.message || err.message || 'Could not load settings from server.';
      setError(errMsg);
      // Set defaults so UI doesn't crash, but indicate error
      setSettingsData({
          availableDays: DEFAULT_AVAILABLE_DAYS, timeSlots: [], serviceAreas: [], specialDates: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]); // Run only once on mount

  // --- Calendar Logic ---
  const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const getMonthData = useCallback(() => {
    // Added check for currentDate validity
    if (!currentDate || isNaN(currentDate.getTime())) {
        console.error("Invalid currentDate in getMonthData:", currentDate);
        // Return a default structure to prevent crash, though this indicates a deeper issue
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth(), startingDay: now.getDay(), daysInMonth: 30 };
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate(); // Last day of the month
    return { year, month, startingDay: startingDayOfWeek, daysInMonth: daysInCurrentMonth };
  }, [currentDate]); // Recalculate only when currentDate changes


  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    // Added check for currentDate validity
    if (!currentDate || isNaN(currentDate.getTime())) return true; // Treat as past if date is invalid
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const isRegularCollectionDay = useCallback((day) => {
    if (!settingsData?.availableDays) return false;
    // Added check for currentDate validity
    if (!currentDate || isNaN(currentDate.getTime())) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay(); // 0-6
    return !!settingsData.availableDays[dayOfWeek.toString()]; // Access using string index '0'-'6'
  }, [settingsData?.availableDays, currentDate]);

  const getSpecialDateStatus = useCallback((day) => {
    if (!settingsData?.specialDates) return null;
    // Added check for currentDate validity
    if (!currentDate || isNaN(currentDate.getTime())) return null;
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialDate = settingsData.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  }, [settingsData?.specialDates, currentDate]);

  const isCollectionDay = useCallback((day) => {
    const specialStatus = getSpecialDateStatus(day);
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    return isRegularCollectionDay(day);
  }, [getSpecialDateStatus, isRegularCollectionDay]);


  // --- State Modification Handlers (Update Local State Only) ---

  const handleAvailableDayChange = (dayIndex) => {
    setSettingsData(prev => {
        if (!prev || !prev.availableDays) return prev; // Safety check
        return {
            ...prev,
            availableDays: {
                ...prev.availableDays,
                [dayIndex]: !prev.availableDays[dayIndex]
            }
        };
    });
  };

  const handleSpecialDateToggle = (day) => {
    if (isPastDate(day) || !settingsData) return;
    // Added check for currentDate validity
    if (!currentDate || isNaN(currentDate.getTime())) return;

    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    setSettingsData(prev => {
        const currentSpecialDates = prev.specialDates || [];
        const existingIndex = currentSpecialDates.findIndex(d => d.date === dateStr);

        if (existingIndex >= 0) {
            // Remove existing override
            return { ...prev, specialDates: currentSpecialDates.filter((_, i) => i !== existingIndex) };
        } else {
            // Add new override (opposite of regular schedule for that day)
            const regularStatus = isRegularCollectionDay(day);
            const newStatus = regularStatus ? 'unavailable' : 'available';
            // Use temporary key for React list rendering if backend doesn't assign _id immediately
            const newSpecialDate = { date: dateStr, status: newStatus, _id: `temp-${dateStr}` };
            return { ...prev, specialDates: [...currentSpecialDates, newSpecialDate] };
        }
    });
  };

  const handleAddItem = (listName, newItemData) => {
    setSettingsData(prev => {
        if (!prev) return prev;
        const currentList = prev[listName] || [];
        // Basic unique ID generation for client-side key (replace if backend assigns differently)
        const id = newItemData.label?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || newItemData.name?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `${listName.slice(0,2)}-${Date.now()}`;
        // Basic client-side duplicate ID check
        if (currentList.some(item => item.id === id)) {
             alert(`An item with ID "${id}" already exists in ${listName}. Please use a unique label/name.`);
             return prev; // Prevent adding duplicate
        }
        return { ...prev, [listName]: [...currentList, { ...newItemData, id }] };
    });
};

const handleDeleteItem = (listName, idToDelete) => {
    if (!window.confirm(`Delete this item from ${listName}?`)) return;
    setSettingsData(prev => {
        if (!prev || !Array.isArray(prev[listName])) return prev;
        return { ...prev, [listName]: prev[listName].filter(item => item.id !== idToDelete) };
    });
};

const handleToggleActive = (listName, idToToggle) => {
    setSettingsData(prev => {
        if (!prev || !Array.isArray(prev[listName])) return prev;
        return {
            ...prev,
            [listName]: prev[listName].map(item =>
                item.id === idToToggle ? { ...item, active: !item.active } : item
            )
        };
    });
};


// -- Time Slot Specific Edits --
 const startEditTimeSlot = (slot) => setEditingTimeSlot({ ...slot });
 const cancelEditTimeSlot = () => setEditingTimeSlot(null);
 const handleEditingTimeSlotChange = (e) => {
   const { name, value, type, checked } = e.target;
   setEditingTimeSlot(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
 };
 const saveEditTimeSlot = () => {
   if (!editingTimeSlot || !editingTimeSlot.label || !editingTimeSlot.time) return alert('Label and Time Range are required.');
   // No need to update ID here unless label changed and ID depends on it
   setSettingsData(prev => ({
       ...prev,
       timeSlots: prev.timeSlots.map(slot => slot.id === editingTimeSlot.id ? { ...editingTimeSlot } : slot)
   }));
   setEditingTimeSlot(null);
 };
  const addTimeSlotHandler = () => {
      if (!newTimeSlot.label || !newTimeSlot.time) return alert('Label and Time Range are required.');
      handleAddItem('timeSlots', newTimeSlot);
      setNewTimeSlot({ label: '', time: '', active: true }); // Reset form
  };

 // -- Service Area Specific Edits --
 const startEditServiceArea = (area) => setEditingServiceArea({ ...area });
 const cancelEditServiceArea = () => setEditingServiceArea(null);
 const handleEditingServiceAreaChange = (e) => {
   const { name, value, type, checked } = e.target;
   setEditingServiceArea(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
 };
 const saveEditServiceArea = () => {
   if (!editingServiceArea || !editingServiceArea.name) return alert('Area Name is required.');
   // No need to update ID here unless name changed and ID depends on it
   setSettingsData(prev => ({
       ...prev,
       serviceAreas: prev.serviceAreas.map(area => area.id === editingServiceArea.id ? { ...editingServiceArea } : area)
   }));
   setEditingServiceArea(null);
 };
 const addServiceAreaHandler = () => {
     if (!newServiceArea.name) return alert('Area Name is required.');
     handleAddItem('serviceAreas', newServiceArea);
     setNewServiceArea({ name: '', active: true }); // Reset form
 };


  // --- Save All Settings to Backend ---
  const handleSaveAllSettings = async () => {
      if (editingTimeSlot || editingServiceArea) {
          alert("Please save or cancel any active edits before saving all settings.");
          return;
      }
      if (!settingsData) {
          setError("Settings data not loaded yet.");
          return;
      }

      setIsSaving(true); setError(''); setSuccess('');
      // Prepare data exactly as the backend expects
      const settingsToSave = {
          availableDays: settingsData.availableDays,
          timeSlots: settingsData.timeSlots,
          serviceAreas: settingsData.serviceAreas,
          specialDates: settingsData.specialDates,
      };
      console.log("Saving settings to backend:", settingsToSave);

      try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Admin token not found.");
          const response = await axios.put(API_SETTINGS_URL, settingsToSave, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          });

          if (response.data?.success) {
               setSuccess('Settings saved successfully!');
               // IMPORTANT: Update state with response data, backend might assign _ids etc.
               const updatedData = response.data.data;
               if (updatedData) {
                    setSettingsData({ // Re-set the entire state from backend response
                         availableDays: updatedData.availableDays || DEFAULT_AVAILABLE_DAYS,
                         timeSlots: updatedData.timeSlots || [],
                         serviceAreas: updatedData.serviceAreas || [],
                         specialDates: updatedData.specialDates || [],
                         _id: updatedData._id,
                         singleton: updatedData.singleton
                    });
               }
               setTimeout(() => setSuccess(''), 4000);
          } else {
              throw new Error(response.data?.message || 'Failed to save settings');
          }
      } catch (err) {
          console.error("Save Settings Error:", err);
          setError(err.response?.data?.message || err.message || 'Could not save settings');
      } finally {
          setIsSaving(false);
      }
  };


  // --- Calendar Rendering Function ---
  const renderCalendar = () => {
    // Added check to prevent rendering if month data is unavailable
    const monthData = getMonthData();
    if (!monthData) return <div className="p-4 text-center text-red-500">Error calculating month data.</div>;

    const { startingDay, daysInMonth } = monthData;
    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) { calendarDays.push(<div key={`empty-${i}`} className="calendar-empty"></div>); }
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      const specialStatus = getSpecialDateStatus(day);
      calendarDays.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isPast ? 'past' : 'future'} ${isCollection ? 'collection' : 'no-collection'} ${specialStatus ? `special-${specialStatus}` : ''}`}
          onClick={() => !isPast && handleSpecialDateToggle(day)} // Use updated handler
          title={isPast ? "Past date" : `Click to toggle special status for this day`}
        >
          <span className="day-number">{day}</span>
           {/* Optional: Visual indicator for special dates */}
          {specialStatus && (<div className={`status-indicator ${specialStatus}`}></div>)}
        </div>
      );
    }
    return calendarDays;
  };

  // --- Main Render ---
  if (isLoading) { return <div className="loading-container"><ClipLoader size={50} color="#f97316" /></div>; }

  // Separate check after loading to show error prominently if data is still missing
   if (!settingsData && error) {
         return <div className="p-6 error-message bg-red-100 text-red-700 rounded flex items-center gap-2"><AlertTriangle size={18}/><span>{error}</span><button onClick={fetchSettings} className="ml-auto text-sm text-blue-600 hover:underline">Retry</button></div>;
   }
   // This case should ideally not be hit if defaults are set on error, but good as a fallback
   if (!settingsData) {
        return <div className="p-6 text-center text-gray-500">Settings data could not be initialized.</div>;
   }


  return (
    <div className="admin-calendar-container">
        {/* Header */}
        <div className="admin-header">
            <Settings size={24} className="header-icon" />
            <h1>Manage Collection Settings</h1>
        </div>

        {/* Global Feedback */}
        {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span></div>}
        {success && <div className="success-banner"><Check size={18} /><span>{success}</span></div>}

        {/* Tabs */}
        <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}><Calendar size={16} /><span>Calendar & Days</span></button>
            <button className={`admin-tab ${activeTab === 'timeslots' ? 'active' : ''}`} onClick={() => setActiveTab('timeslots')}><Clock size={16} /><span>Time Slots</span></button>
            <button className={`admin-tab ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}><MapPin size={16} /><span>Service Areas</span></button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
            {/* --- Calendar Tab --- */}
            {activeTab === 'calendar' && (
                <div className="calendar-settings">
                    <h2 className="section-heading">Set Regular Available Days</h2>
                    <div className="day-toggles">
                         {/* Use dayIndexes to ensure consistent order */}
                         {dayIndexes.map(index => (
                            <button key={index} className={`day-toggle ${settingsData.availableDays?.[index] ? 'active' : ''}`} onClick={() => handleAvailableDayChange(index)}>
                                {daysOfWeekMap[index]}
                            </button>
                        ))}
                    </div>

                    <h2 className="section-heading mt-6">Override Specific Dates</h2>
                    <div className="admin-calendar">
                        <div className="calendar-header">
                            <button onClick={goToPrevMonth} className="nav-button"><ChevronLeft size={20} /></button>
                            <h3 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                            <button onClick={goToNextMonth} className="nav-button"><ChevronRight size={20} /></button>
                        </div>
                        <div className="weekday-header">{daysOfWeek.map(day => (<div key={day} className="weekday">{day}</div>))}</div>
                        <div className="calendar-grid">{renderCalendar()}</div>
                        {/* Legend */}
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

            {/* --- Time Slots Tab --- */}
             {activeTab === 'timeslots' && (
                <div className="list-management-settings">
                    <h2 className="section-heading">Time Slot Management</h2>
                    <div className="item-list">
                        {(settingsData.timeSlots || []).map(slot => (
                            <div key={slot.id} className="list-item">
                                {editingTimeSlot?.id === slot.id ? (
                                    <div className="edit-form">
                                        <input name="label" value={editingTimeSlot.label} onChange={handleEditingTimeSlotChange} placeholder="Label" className="form-input small" required/>
                                        <input name="time" value={editingTimeSlot.time} onChange={handleEditingTimeSlotChange} placeholder="Time Range" className="form-input small" required/>
                                        <div className="edit-actions">
                                            <button onClick={saveEditTimeSlot} className="action-button save-button" title="Save"><Check size={16} /></button>
                                            <button onClick={cancelEditTimeSlot} className="action-button cancel-button" title="Cancel"><X size={16} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="item-info">
                                            <span className={`status-dot ${slot.active ? 'active' : 'inactive'}`}></span>
                                            <div><span className="font-semibold">{slot.label}</span> ({slot.time || 'No time set'})</div>
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => handleToggleActive('timeSlots', slot.id)} className={`toggle-button ${slot.active ? 'active' : 'inactive'}`}>{slot.active ? 'Active' : 'Inactive'}</button>
                                            <button onClick={() => startEditTimeSlot(slot)} className="action-button edit-button" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteItem('timeSlots', slot.id)} className="action-button delete-button" title="Delete"><Trash size={16} /></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        {settingsData.timeSlots?.length === 0 && <p className="empty-list-message">No time slots defined.</p>}
                    </div>
                    {/* Add Form */}
                    <div className="add-item-form">
                        <h3>Add New Time Slot</h3>
                        <input name="label" value={newTimeSlot.label} onChange={(e) => setNewTimeSlot({...newTimeSlot, label: e.target.value})} placeholder="Label (e.g. Morning)" className="form-input"/>
                        <input name="time" value={newTimeSlot.time} onChange={(e) => setNewTimeSlot({...newTimeSlot, time: e.target.value})} placeholder="Time Range (e.g. 8 AM - 11 AM)" className="form-input"/>
                        <button onClick={addTimeSlotHandler} className="add-button"><Plus size={16} /> Add</button>
                    </div>
                </div>
            )}


            {/* --- Service Areas Tab --- */}
            {activeTab === 'areas' && (
                <div className="list-management-settings">
                    <h2 className="section-heading">Service Area Management</h2>
                    <div className="item-list">
                        {(settingsData.serviceAreas || []).map(area => (
                           <div key={area.id} className="list-item">
                               {editingServiceArea?.id === area.id ? (
                                    <div className="edit-form">
                                        <input name="name" value={editingServiceArea.name} onChange={handleEditingServiceAreaChange} placeholder="Area Name" className="form-input small" required/>
                                        <div className="edit-actions">
                                            <button onClick={saveEditServiceArea} className="action-button save-button" title="Save"><Check size={16} /></button>
                                            <button onClick={cancelEditServiceArea} className="action-button cancel-button" title="Cancel"><X size={16} /></button>
                                        </div>
                                    </div>
                               ) : (
                                    <>
                                        <div className="item-info">
                                            <span className={`status-dot ${area.active ? 'active' : 'inactive'}`}></span>
                                            <span className="font-semibold">{area.name}</span>
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => handleToggleActive('serviceAreas', area.id)} className={`toggle-button ${area.active ? 'active' : 'inactive'}`}>{area.active ? 'Active' : 'Inactive'}</button>
                                            <button onClick={() => startEditServiceArea(area)} className="action-button edit-button" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteItem('serviceAreas', area.id)} className="action-button delete-button" title="Delete"><Trash size={16} /></button>
                                        </div>
                                    </>
                               )}
                           </div>
                        ))}
                         {settingsData.serviceAreas?.length === 0 && <p className="empty-list-message">No service areas defined.</p>}
                    </div>
                     {/* Add Form */}
                    <div className="add-item-form">
                        <h3>Add New Service Area</h3>
                        <input name="name" value={newServiceArea.name} onChange={(e) => setNewServiceArea({...newServiceArea, name: e.target.value})} placeholder="Area Name (e.g. Downtown Core)" className="form-input"/>
                        <button onClick={addServiceAreaHandler} className="add-button"><Plus size={16} /> Add</button>
                    </div>
                </div>
            )}
        </div>

      {/* Save All Button Footer */}
      <div className="admin-footer">
        <button onClick={handleSaveAllSettings} className="save-settings-button" disabled={isSaving || isLoading}>
          {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;