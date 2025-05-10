import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle, Info
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css';
import axiosInstance from '../../../api/axiosInstance'; // Adjust path as per your project structure
import API_ENDPOINTS from '../../../apiConfig';   // CORRECTED: Assuming apiConfig.js is in src/api/

// Define default days object outside the component to be a stable reference
const DEFAULT_AVAILABLE_DAYS_OBJECT = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };

const AdCalendar = () => {
  // State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsData, setSettingsData] = useState(null); // Will be initialized in useEffect
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dates');
  const [selectedDate, setSelectedDate] = useState(null);

  // Editing States
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [editingServiceArea, setEditingServiceArea] = useState(null);
  const [newSpecialDate, setNewSpecialDate] = useState({ date: '', status: 'available', reason: '' });

  // Static Data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const initializeDefaultSettings = useCallback(() => ({
    availableDays: new Map(Object.entries(DEFAULT_AVAILABLE_DAYS_OBJECT)),
    timeSlots: [
      { id: "ts-morning-default", label: "Morning", time: "8:00 AM - 12:00 PM", active: true },
      { id: "ts-afternoon-default", label: "Afternoon", time: "1:00 PM - 5:00 PM", active: true },
    ],
    serviceAreas: [
      { id: "sa-north-default", name: "North Zone", active: true },
      { id: "sa-south-default", name: "South Zone", active: false },
    ],
    specialDates: [],
    dateSettings: new Map()
  }), []);


  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Ensure API_ENDPOINTS.CALENDAR_SETTINGS.GET is correctly defined
        if (!API_ENDPOINTS.CALENDAR_SETTINGS || !API_ENDPOINTS.CALENDAR_SETTINGS.GET) {
            throw new Error("API endpoint for getting calendar settings is not defined.");
        }
        const response = await axiosInstance.get(API_ENDPOINTS.CALENDAR_SETTINGS.GET);
        if (response.data && response.data.success && response.data.data) {
          const fetchedData = response.data.data;
          
          const adDaysObject = (fetchedData.availableDays && Object.keys(fetchedData.availableDays).length > 0)
                               ? fetchedData.availableDays
                               : DEFAULT_AVAILABLE_DAYS_OBJECT;

          const adDateSettingsObject = fetchedData.dateSettings || {};

          setSettingsData({
            ...initializeDefaultSettings(), 
            ...fetchedData,                 
            availableDays: new Map(Object.entries(adDaysObject)), 
            dateSettings: new Map(Object.entries(adDateSettingsObject)),  
            timeSlots: fetchedData.timeSlots || initializeDefaultSettings().timeSlots,
            serviceAreas: fetchedData.serviceAreas || initializeDefaultSettings().serviceAreas,
            specialDates: fetchedData.specialDates || initializeDefaultSettings().specialDates,
          });
        } else {
          setSettingsData(initializeDefaultSettings());
          setError(response.data?.message || 'Failed to fetch settings, defaults loaded.');
        }
      } catch (err) {
        console.error("Error fetching admin settings:", err); // Log the full error
        setError(err.response?.data?.message || err.message || "Error fetching settings. Using component defaults.");
        setSettingsData(initializeDefaultSettings());
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [initializeDefaultSettings]);

  const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const getMonthData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return { year, month, startingDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate() };
  }, [currentDate]);

  const isPastDate = (day) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { year, month } = getMonthData();
    return new Date(year, month, day) < today;
  };

  const handleDateSelect = (day) => {
    if (isPastDate(day)) return;
    const { year, month } = getMonthData();
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate({ date: dateStr, day, month, year, dayOfWeek: daysOfWeek[new Date(year, month, day).getDay()] });
  };

  const toggleDayAvailability = (dayIndexStr) => { 
    setSettingsData(prev => {
      const newAvailableDays = new Map(prev.availableDays);
      newAvailableDays.set(dayIndexStr, !newAvailableDays.get(dayIndexStr));
      return { ...prev, availableDays: newAvailableDays };
    });
    setSuccess(`Updated availability for ${daysOfWeek[parseInt(dayIndexStr, 10)]}`);
  };

  const addSpecialDate = () => {
    if (!newSpecialDate.date) { setError("Please select a date"); return; }
    const specialDate = { id: `sd-${newSpecialDate.date}-${Date.now()}`, ...newSpecialDate };
    setSettingsData(prev => ({
      ...prev,
      specialDates: [...prev.specialDates.filter(d => d.date !== newSpecialDate.date), specialDate]
    }));
    setNewSpecialDate({ date: '', status: 'available', reason: '' });
    setSuccess(`Added special date override for ${newSpecialDate.date}`);
  };

  const removeSpecialDate = (date) => {
    setSettingsData(prev => ({ ...prev, specialDates: prev.specialDates.filter(d => d.date !== date) }));
    setSuccess(`Removed special date override for ${date}`);
  };

  const getSpecialDateStatus = (dateStr) => {
    if (!settingsData || !settingsData.specialDates) return null; // Guard clause
    const specialDate = settingsData.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  };

  const isCollectionDay = (day) => {
    const { year, month } = getMonthData();
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialStatus = getSpecialDateStatus(dateStr);
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    const dayOfWeek = new Date(year, month, day).getDay().toString();
    if (!settingsData || !settingsData.availableDays) return false; // Guard clause
    return settingsData.availableDays.get(dayOfWeek);
  };

  const handleToggleActive = (listKey, id) => {
    setSettingsData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map(item => item.id === id ? { ...item, active: !item.active } : item)
    }));
  };

  const addOrUpdateTimeSlot = () => {
    if (!editingTimeSlot.label || !editingTimeSlot.time) { setError("Label and Time are required"); return; }
    const isUpdate = !!editingTimeSlot.id;
    const slotToSave = { ...editingTimeSlot, id: isUpdate ? editingTimeSlot.id : `ts-${Date.now()}` };

    setSettingsData(prev => ({
      ...prev,
      timeSlots: isUpdate
        ? prev.timeSlots.map(ts => ts.id === slotToSave.id ? slotToSave : ts)
        : [...prev.timeSlots, slotToSave]
    }));
    setEditingTimeSlot(null);
    setSuccess(isUpdate ? `Updated time slot: ${slotToSave.label}` : `Added new time slot: ${slotToSave.label}`);
  };

  const deleteTimeSlot = (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot? This may affect date-specific settings.")) return;
    setSettingsData(prev => {
        const newDateSettings = new Map(prev.dateSettings);
        newDateSettings.forEach((dateSetting, dateKey) => {
            if (dateSetting.timeSlots && dateSetting.timeSlots.includes(id)) {
                newDateSettings.set(dateKey, {
                    ...dateSetting,
                    timeSlots: dateSetting.timeSlots.filter(tsId => tsId !== id)
                });
            }
        });
        return {
            ...prev,
            timeSlots: prev.timeSlots.filter(ts => ts.id !== id),
            dateSettings: newDateSettings
        };
    });
    setSuccess("Time slot deleted");
  };

  const addOrUpdateServiceArea = () => {
    if (!editingServiceArea.name) { setError("Name is required"); return; }
    const isUpdate = !!editingServiceArea.id;
    const areaToSave = { ...editingServiceArea, id: isUpdate ? editingServiceArea.id : `sa-${Date.now()}` };

    setSettingsData(prev => ({
      ...prev,
      serviceAreas: isUpdate
        ? prev.serviceAreas.map(sa => sa.id === areaToSave.id ? areaToSave : sa)
        : [...prev.serviceAreas, areaToSave]
    }));
    setEditingServiceArea(null);
    setSuccess(isUpdate ? `Updated service area: ${areaToSave.name}` : `Added new service area: ${areaToSave.name}`);
  };

  const deleteServiceArea = (id) => {
    if (!window.confirm("Are you sure you want to delete this service area? This may affect date-specific settings.")) return;
     setSettingsData(prev => {
        const newDateSettings = new Map(prev.dateSettings);
        newDateSettings.forEach((dateSetting, dateKey) => {
            if (dateSetting.serviceAreas && dateSetting.serviceAreas.includes(id)) {
                 newDateSettings.set(dateKey, {
                    ...dateSetting,
                    serviceAreas: dateSetting.serviceAreas.filter(saId => saId !== id)
                });
            }
        });
        return {
            ...prev,
            serviceAreas: prev.serviceAreas.filter(sa => sa.id !== id),
            dateSettings: newDateSettings
        };
    });
    setSuccess("Service area deleted");
  };

  const toggleTimeSlotForDate = (timeSlotId) => {
    if (!selectedDate) return;
    setSettingsData(prev => {
      const newDateSettings = new Map(prev.dateSettings);
      const dateKey = selectedDate.date;
      let currentDateSpecificSettings = newDateSettings.get(dateKey) || { timeSlots: [], serviceAreas: [] };
      
      const updatedInnerTimeSlots = currentDateSpecificSettings.timeSlots?.includes(timeSlotId)
        ? currentDateSpecificSettings.timeSlots.filter(id => id !== timeSlotId)
        : [...(currentDateSpecificSettings.timeSlots || []), timeSlotId];
      
      newDateSettings.set(dateKey, { ...currentDateSpecificSettings, timeSlots: updatedInnerTimeSlots });
      return { ...prev, dateSettings: newDateSettings };
    });
  };

  const toggleServiceAreaForDate = (serviceAreaId) => {
    if (!selectedDate) return;
    setSettingsData(prev => {
      const newDateSettings = new Map(prev.dateSettings);
      const dateKey = selectedDate.date;
      let currentDateSpecificSettings = newDateSettings.get(dateKey) || { timeSlots: [], serviceAreas: [] };

      const updatedInnerServiceAreas = currentDateSpecificSettings.serviceAreas?.includes(serviceAreaId)
        ? currentDateSpecificSettiings.serviceAreas.filter(id => id !== serviceAreaId) // Typo: settingsData -> currentDateSpecificSettings
        : [...(currentDateSpecificSettings.serviceAreas || []), serviceAreaId];

      newDateSettings.set(dateKey, { ...currentDateSpecificSettings, serviceAreas: updatedInnerServiceAreas });
      return { ...prev, dateSettings: newDateSettings };
    });
  };

  const handleSaveAllSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    if (!settingsData) {
        setError("Settings data is not loaded yet.");
        setIsSaving(false);
        return;
    }
    
    const settingsToSave = {
      ...settingsData,
      availableDays: Object.fromEntries(settingsData.availableDays), 
      dateSettings: Object.fromEntries(settingsData.dateSettings),   
    };
    
    try {
        // Ensure API_ENDPOINTS.CALENDAR_SETTINGS.UPDATE is correctly defined
        if (!API_ENDPOINTS.CALENDAR_SETTINGS || !API_ENDPOINTS.CALENDAR_SETTINGS.UPDATE) {
            throw new Error("API endpoint for updating calendar settings is not defined.");
        }
      const response = await axiosInstance.put(API_ENDPOINTS.CALENDAR_SETTINGS.UPDATE, settingsToSave);
      if (response.data && response.data.success) {
        setSuccess('All settings saved successfully!');
      } else {
        setError(response.data?.message || "Failed to save settings to backend.");
      }
    } catch (err) {
      console.error("Error saving admin settings:", err); // Log the full error
      setError(err.response?.data?.message || err.message || "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCalendar = () => {
    const { year, month, startingDay, daysInMonth } = getMonthData();
    const calendarCells = [];
    for (let i = 0; i < startingDay; i++) calendarCells.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isAvailable = isCollectionDay(day);
      const isSelected = selectedDate?.day === day && selectedDate?.month === month && selectedDate?.year === year;
      const specialStatus = getSpecialDateStatus(`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
      const dayClasses = ['calendar-day', isPast ? 'past' : 'future', isAvailable ? 'available' : 'unavailable', specialStatus ? `special-${specialStatus}` : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ');
      calendarCells.push(
        <div key={`day-${day}`} className={dayClasses} onClick={() => !isPast && handleDateSelect(day)} role="button" tabIndex={isPast ? -1 : 0}>
          <span className="day-number">{day}</span>
          {specialStatus && <div className="status-indicator" title={`Special: ${specialStatus}`}></div>}
        </div>
      );
    }
    return calendarCells;
  };

  if (isLoading || !settingsData) {
    return <div className="loading-container"><ClipLoader size={50} color="#f97316" /><span>Loading Settings...</span></div>;
  }

  // Main component render
  return (
    <div className="admin-calendar-container">
      <div className="admin-header"><Settings size={24} className="header-icon" /><h1>Manage Pickup Availability</h1></div>
      {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span><button onClick={() => setError('')} className="close-banner-button">✕</button></div>}
      {success && <div className="success-banner"><Check size={18} /><span>{success}</span><button onClick={() => setSuccess('')} className="close-banner-button">✕</button></div>}

      <div className="admin-tabs">
        {['dates', 'times', 'areas'].map(tabName => (
          <button key={tabName} className={`admin-tab ${activeTab === tabName ? 'active' : ''}`} onClick={() => setActiveTab(tabName)}>
            {tabName === 'dates' && <Calendar size={16} />} {tabName === 'times' && <Clock size={16} />} {tabName === 'areas' && <MapPin size={16} />}
            <span>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'dates' && (
          <div className="dates-tab">
            <div className="tab-section">
              <h2 className="section-heading">Regular Weekly Availability</h2>
              <div className="day-toggles">
                {settingsData.availableDays && daysOfWeek.map((dayName, index) => { // Add guard for settingsData.availableDays
                    const dayIndexStr = index.toString();
                    const isAvailable = settingsData.availableDays.get(dayIndexStr);
                    return (
                        <button key={dayIndexStr} className={`day-toggle ${isAvailable ? 'active' : ''}`} onClick={() => toggleDayAvailability(dayIndexStr)}>
                            {dayName}
                        </button>
                    );
                })}
              </div>
            </div>

            <div className="tab-section">
              <h2 className="section-heading">Special Date Overrides</h2>
              <div className="add-special-date">
                <div className="form-group"><label>Date</label><input type="date" value={newSpecialDate.date} onChange={(e) => setNewSpecialDate({...newSpecialDate, date: e.target.value})} /></div>
                <div className="form-group"><label>Status</label><select value={newSpecialDate.status} onChange={(e) => setNewSpecialDate({...newSpecialDate, status: e.target.value})}><option value="available">Available</option><option value="unavailable">Unavailable</option></select></div>
                <div className="form-group"><label>Reason (Opt.)</label><input type="text" value={newSpecialDate.reason} onChange={(e) => setNewSpecialDate({...newSpecialDate, reason: e.target.value})} placeholder="e.g., Holiday" /></div>
                <button onClick={addSpecialDate} className="add-button"><Plus size={16} /> Add Override</button>
              </div>
              <div className="special-dates-list">
                {settingsData.specialDates && settingsData.specialDates.map(sd => ( // Add guard
                  <div key={sd.id} className="special-date-item">
                    <div className="date-info"><span className="date">{sd.date}</span><span className={`status ${sd.status}`}>{sd.status}</span>{sd.reason && <span className="reason">{sd.reason}</span>}</div>
                    <button onClick={() => removeSpecialDate(sd.date)} className="delete-button"><Trash size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="tab-section">
              <h2 className="section-heading">Calendar View</h2>
              <div className="admin-calendar">
                <div className="calendar-header">
                  <button onClick={goToPrevMonth} className="nav-button"><ChevronLeft size={20} /></button>
                  <h3 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                  <button onClick={goToNextMonth} className="nav-button"><ChevronRight size={20} /></button>
                </div>
                <div className="weekday-header">{daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}</div>
                <div className="calendar-grid">{renderCalendar()}</div>
              </div>
            </div>

            {selectedDate && settingsData.dateSettings && ( // Add guard
              <div className="tab-section">
                <h2 className="section-heading">Availability for {selectedDate.dayOfWeek}, {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}</h2>
                <div className="date-settings">
                  <div className="time-slots-selection">
                    <h3>Available Time Slots for this Date</h3>
                    {settingsData.timeSlots && settingsData.timeSlots.filter(ts => ts.active).length > 0 ? ( // Add guard
                      <div className="time-slots-grid">
                        {settingsData.timeSlots.filter(ts => ts.active).map(slot => {
                          const dateSpecificSettings = settingsData.dateSettings.get(selectedDate.date);
                          const isSelectedForDate = dateSpecificSettings?.timeSlots?.includes(slot.id) ?? false;
                          return (
                            <div key={slot.id} className={`time-slot-card ${isSelectedForDate ? 'selected' : ''}`} onClick={() => toggleTimeSlotForDate(slot.id)}>
                              <div className="time-slot-label">{slot.label}</div><div className="time-slot-time">{slot.time}</div>
                            </div>);
                        })}
                      </div>
                    ) : <p className="no-items">No active global time slots.</p>}
                     <p className="info-text"><Info size={14}/> Toggling here overrides global availability for THIS DATE ONLY. If no slots are selected here, all globally active slots are considered available for this date (if the day itself is available).</p>
                  </div>
                  <div className="service-areas-selection">
                    <h3>Available Service Areas for this Date</h3>
                     {settingsData.serviceAreas && settingsData.serviceAreas.filter(sa => sa.active).length > 0 ? ( // Add guard
                      <div className="service-areas-grid">
                        {settingsData.serviceAreas.filter(sa => sa.active).map(area => {
                           const dateSpecificSettings = settingsData.dateSettings.get(selectedDate.date);
                           const isSelectedForDate = dateSpecificSettings?.serviceAreas?.includes(area.id) ?? false;
                          return (
                            <div key={area.id} className={`service-area-card ${isSelectedForDate ? 'selected' : ''}`} onClick={() => toggleServiceAreaForDate(area.id)}>
                              <MapPin size={18} /><span>{area.name}</span>
                            </div>);
                        })}
                      </div>
                    ) : <p className="no-items">No active global service areas.</p>}
                    <p className="info-text"><Info size={14}/> Toggling here overrides global availability for THIS DATE ONLY. If no areas are selected here, all globally active areas are considered available for this date (if the day itself is available).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'times' && (
          <div className="times-tab">
            <div className="tab-section">
              <h2 className="section-heading">Manage Time Slots</h2>
              {editingTimeSlot ? (
                <div className="edit-form">
                  <h3>{editingTimeSlot.id ? 'Edit' : 'Add'} Time Slot</h3>
                  <div className="form-group"><label>Label</label><input type="text" value={editingTimeSlot.label} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, label: e.target.value})} placeholder="e.g., Morning"/></div>
                  <div className="form-group"><label>Time Range</label><input type="text" value={editingTimeSlot.time} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, time: e.target.value})} placeholder="e.g., 8:00 AM - 12:00 PM"/></div>
                  <div className="form-group checkbox"><label><input type="checkbox" checked={editingTimeSlot.active} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, active: e.target.checked})}/>Active</label></div>
                  <div className="form-actions">
                    <button onClick={addOrUpdateTimeSlot} className="save-button"><Save size={16} /> Save</button>
                    <button onClick={() => setEditingTimeSlot(null)} className="cancel-button"><X size={16} /> Cancel</button>
                  </div>
                </div>
              ) : <button onClick={() => setEditingTimeSlot({ id: '', label: '', time: '', active: true })} className="add-button"><Plus size={16} /> Add New Time Slot</button>}
              <div className="time-slots-list">
                {settingsData.timeSlots && settingsData.timeSlots.map(slot => ( // Add guard
                  <div key={slot.id} className={`time-slot-item ${!slot.active ? 'inactive' : ''}`}>
                    <div className="slot-info"><div className="slot-label">{slot.label}</div><div className="slot-time">{slot.time}</div><div className="slot-status">{slot.active ? 'Active' : 'Inactive'}</div></div>
                    <div className="slot-actions">
                      <button onClick={() => handleToggleActive('timeSlots', slot.id)} className={`toggle-button ${slot.active ? 'active' : 'inactive'}`}>{slot.active ? 'Set Inactive' : 'Set Active'}</button>
                      <button onClick={() => setEditingTimeSlot({...slot})} className="edit-button"><Edit size={16} /></button>
                      <button onClick={() => deleteTimeSlot(slot.id)} className="delete-button"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="areas-tab">
             <div className="tab-section">
              <h2 className="section-heading">Manage Service Areas</h2>
              {editingServiceArea ? (
                <div className="edit-form">
                  <h3>{editingServiceArea.id ? 'Edit' : 'Add'} Service Area</h3>
                  <div className="form-group"><label>Name</label><input type="text" value={editingServiceArea.name} onChange={(e) => setEditingServiceArea({...editingServiceArea, name: e.target.value})} placeholder="e.g., North Zone"/></div>
                  <div className="form-group checkbox"><label><input type="checkbox" checked={editingServiceArea.active} onChange={(e) => setEditingServiceArea({...editingServiceArea, active: e.target.checked})}/>Active</label></div>
                  <div className="form-actions">
                    <button onClick={addOrUpdateServiceArea} className="save-button"><Save size={16} /> Save</button>
                    <button onClick={() => setEditingServiceArea(null)} className="cancel-button"><X size={16} /> Cancel</button>
                  </div>
                </div>
              ) : <button onClick={() => setEditingServiceArea({ id: '', name: '', active: true })} className="add-button"><Plus size={16} /> Add New Service Area</button>}
              <div className="service-areas-list">
                {settingsData.serviceAreas && settingsData.serviceAreas.map(area => ( // Add guard
                  <div key={area.id} className={`service-area-item ${!area.active ? 'inactive' : ''}`}>
                    <div className="area-info"><div className="area-name">{area.name}</div><div className="area-status">{area.active ? 'Active' : 'Inactive'}</div></div>
                    <div className="area-actions">
                      <button onClick={() => handleToggleActive('serviceAreas', area.id)} className={`toggle-button ${area.active ? 'active' : 'inactive'}`}>{area.active ? 'Set Inactive' : 'Set Active'}</button>
                      <button onClick={() => setEditingServiceArea({...area})} className="edit-button"><Edit size={16} /></button>
                      <button onClick={() => deleteServiceArea(area.id)} className="delete-button"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Calendar Tab */}
        {activeTab === 'view' && (
          <div className="view-calendar-tab">
            <div className="tab-section">
              <h2 className="section-heading">Calendar Overview</h2>
              <div className="view-calendar-container">
                <div className="admin-calendar">
                  <div className="calendar-header">
                    <button onClick={goToPrevMonth} className="nav-button">
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="current-month">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={goToNextMonth} className="nav-button">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="weekday-header">
                    {daysOfWeek.map(day => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-grid">
                    {renderCalendar(true)}
                  </div>
                </div>
                
                <div className="calendar-legend">
                  <div className="legend-item">
                    <span className="legend-dot available"></span> Available
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot unavailable"></span> Unavailable
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot special-available"></span> Special: Available
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot special-unavailable"></span> Special: Unavailable
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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