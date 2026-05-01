import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle, Info
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css';
import axiosInstance from '../../../api/axiosInstance';
import API_ENDPOINTS from '../../../apiConfig';

const DEFAULT_AVAILABLE_DAYS_OBJECT = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };

const AdCalendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsData, setSettingsData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dates');
  const [selectedDate, setSelectedDate] = useState(null);

  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [editingServiceArea, setEditingServiceArea] = useState(null);
  const [newSpecialDate, setNewSpecialDate] = useState({ date: '', status: 'available', reason: '' });

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
        console.error("Error fetching admin settings:", err);
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

  const removeSpecialDate = (dateId) => {
    setSettingsData(prev => ({
      ...prev,
      specialDates: prev.specialDates.filter(d => d.id !== dateId)
    }));
    const removedDate = settingsData?.specialDates.find(d => d.id === dateId);
    setSuccess(`Removed special date override for ${removedDate?.date || dateId}`);
  };

  const getSpecialDateStatus = (dateStr) => {
    if (!settingsData || !settingsData.specialDates) return null;
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
    if (!settingsData || !settingsData.availableDays) return false;
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
        ? currentDateSpecificSettings.serviceAreas.filter(id => id !== serviceAreaId)
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
      console.error("Error saving admin settings:", err);
      setError(err.response?.data?.message || err.message || "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCalendar = () => {
    const { year, month, startingDay, daysInMonth } = getMonthData();
    const calendarCells = [];
    for (let i = 0; i < startingDay; i++) calendarCells.push(<div key={`empty-${i}`} className="AdCal-Updt-calendar-empty"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isAvailable = isCollectionDay(day);
      const isSelected = selectedDate?.day === day && selectedDate?.month === month && selectedDate?.year === year;
      const specialStatus = getSpecialDateStatus(`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
      const dayClasses = ['AdCal-Updt-calendar-day', isPast ? 'past' : 'future', isAvailable ? 'available' : 'unavailable', specialStatus ? `special-${specialStatus}` : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ');
      calendarCells.push(
        <div key={`day-${day}`} className={dayClasses} onClick={() => !isPast && handleDateSelect(day)} role="button" tabIndex={isPast ? -1 : 0}>
          <span className="AdCal-Updt-day-number-circle">{day}</span>
          {specialStatus && <div className="AdCal-Updt-status-indicator"></div>}
        </div>
      );
    }
    return calendarCells;
  };

  if (isLoading || !settingsData) {
    return <div className="AdCal-Updt-loading-container"><ClipLoader size={50} color="#059e12" /><span>Loading Settings...</span></div>;
  }

  return (
    <div className="AdCal-Updt-container">
      <div className="AdCal-Updt-header">
        <h1>Manage Pickup Availability</h1>
      </div>
      {error && <div className="AdCal-Updt-error-banner"><AlertTriangle size={18} /><span>{error}</span><button onClick={() => setError('')} className="AdCal-Updt-close-banner-button">✕</button></div>}
      {success && <div className="AdCal-Updt-success-banner"><Check size={18} /><span>{success}</span><button onClick={() => setSuccess('')} className="AdCal-Updt-close-banner-button">✕</button></div>}

      <div className="AdCal-Updt-tabs">
        {['dates', 'times', 'areas'].map(tabName => (
          <button key={tabName} className={`AdCal-Updt-tab ${activeTab === tabName ? 'active' : ''}`} onClick={() => setActiveTab(tabName)}>
            {tabName === 'dates' && <Calendar size={16} />} {tabName === 'times' && <Clock size={16} />} {tabName === 'areas' && <MapPin size={16} />}
            <span>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="AdCal-Updt-content">
        {activeTab === 'dates' && (
          <div className="AdCal-Updt-dates-tab">
            <div className="AdCal-Updt-tab-section">
              <h2 className="AdCal-Updt-section-heading">Regular Weekly Availability</h2>
              <div className="AdCal-Updt-day-toggles">
                {settingsData.availableDays && daysOfWeek.map((dayName, index) => {
                  const dayIndexStr = index.toString();
                  const isAvailable = settingsData.availableDays.get(dayIndexStr);
                  return (
                    <button key={dayIndexStr} className={`AdCal-Updt-day-toggle ${isAvailable ? 'active' : ''}`} onClick={() => toggleDayAvailability(dayIndexStr)}>
                      {dayName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="AdCal-Updt-two-column-section">
              <div className="AdCal-Updt-special-card">
                <h2 className="AdCal-Updt-section-heading">Special Date Overrides</h2>
                <div className="AdCal-Updt-add-special-date">
                  <div className="AdCal-Updt-form-group">
                    <label>Date</label>
                    <input type="date" value={newSpecialDate.date} onChange={(e) => setNewSpecialDate({...newSpecialDate, date: e.target.value})} />
                  </div>
                  <div className="AdCal-Updt-form-group">
                    <label>Status</label>
                    <select value={newSpecialDate.status} onChange={(e) => setNewSpecialDate({...newSpecialDate, status: e.target.value})}>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div className="AdCal-Updt-form-group">
                    <label>Reason (Opt.)</label>
                    <input type="text" value={newSpecialDate.reason} onChange={(e) => setNewSpecialDate({...newSpecialDate, reason: e.target.value})} placeholder="e.g., Holiday" />
                  </div>
                  <button onClick={addSpecialDate} className="AdCal-Updt-add-button"><Plus size={16} /> Add Override</button>
                </div>
                <div className="AdCal-Updt-special-dates-list">
                  {settingsData.specialDates && settingsData.specialDates.map(sd => (
                    <div key={sd.id} className="AdCal-Updt-special-date-item">
                      <div className="AdCal-Updt-date-info">
                        <span className="AdCal-Updt-date">{sd.date}</span>
                        <span className={`AdCal-Updt-status ${sd.status}`}>{sd.status}</span>
                        {sd.reason && <span className="AdCal-Updt-reason">{sd.reason}</span>}
                      </div>
                      <button onClick={() => removeSpecialDate(sd.id)} className="AdCal-Updt-delete-button"><Trash size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="AdCal-Updt-calendar-card">
                <h2 className="AdCal-Updt-section-heading">Calendar View</h2>
                <div className="AdCal-Updt-calendar">
                  <div className="AdCal-Updt-calendar-header">
                    <button onClick={goToPrevMonth} className="AdCal-Updt-nav-button"><ChevronLeft size={20} /></button>
                    <h3 className="AdCal-Updt-current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <button onClick={goToNextMonth} className="AdCal-Updt-nav-button"><ChevronRight size={20} /></button>
                  </div>
                  <div className="AdCal-Updt-weekday-header">{daysOfWeek.map(day => <div key={day} className="AdCal-Updt-weekday">{day}</div>)}</div>
                  <div className="AdCal-Updt-calendar-grid">{renderCalendar()}</div>
                </div>
              </div>
            </div>

            {selectedDate && settingsData.dateSettings && (
              <div className="AdCal-Updt-tab-section">
                <h2 className="AdCal-Updt-section-heading">Availability for {selectedDate.dayOfWeek}, {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}</h2>
                <div className="AdCal-Updt-date-settings">
                  <div className="AdCal-Updt-time-slots-selection">
                    <h3>Available Time Slots for this Date</h3>
                    {settingsData.timeSlots && settingsData.timeSlots.filter(ts => ts.active).length > 0 ? (
                      <div className="AdCal-Updt-time-slots-grid">
                        {settingsData.timeSlots.filter(ts => ts.active).map(slot => {
                          const dateSpecificSettings = settingsData.dateSettings.get(selectedDate.date);
                          const isSelectedForDate = dateSpecificSettings?.timeSlots?.includes(slot.id) ?? false;
                          return (
                            <div key={slot.id} className={`AdCal-Updt-time-slot-card ${isSelectedForDate ? 'selected' : ''}`} onClick={() => toggleTimeSlotForDate(slot.id)}>
                              <div className="AdCal-Updt-time-slot-label">{slot.label}</div>
                              <div className="AdCal-Updt-time-slot-time">{slot.time}</div>
                            </div>);
                        })}
                      </div>
                    ) : <p className="AdCal-Updt-no-items">No active global time slots.</p>}
                    <p className="AdCal-Updt-info-text"><Info size={14}/> Toggling here overrides global availability for THIS DATE ONLY.</p>
                  </div>
                  <div className="AdCal-Updt-service-areas-selection">
                    <h3>Available Service Areas for this Date</h3>
                    {settingsData.serviceAreas && settingsData.serviceAreas.filter(sa => sa.active).length > 0 ? (
                      <div className="AdCal-Updt-service-areas-grid">
                        {settingsData.serviceAreas.filter(sa => sa.active).map(area => {
                          const dateSpecificSettings = settingsData.dateSettings.get(selectedDate.date);
                          const isSelectedForDate = dateSpecificSettings?.serviceAreas?.includes(area.id) ?? false;
                          return (
                            <div key={area.id} className={`AdCal-Updt-service-area-card ${isSelectedForDate ? 'selected' : ''}`} onClick={() => toggleServiceAreaForDate(area.id)}>
                              <MapPin size={18} /><span>{area.name}</span>
                            </div>);
                        })}
                      </div>
                    ) : <p className="AdCal-Updt-no-items">No active global service areas.</p>}
                    <p className="AdCal-Updt-info-text"><Info size={14}/> Toggling here overrides global availability for THIS DATE ONLY.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'times' && (
          <div className="AdCal-Updt-times-tab">
            <div className="AdCal-Updt-tab-section">
              <h2 className="AdCal-Updt-section-heading">Manage Time Slots</h2>
              {editingTimeSlot ? (
                <div className="AdCal-Updt-edit-form">
                  <h3>{editingTimeSlot.id ? 'Edit' : 'Add'} Time Slot</h3>
                  <div className="AdCal-Updt-form-group"><label>Label</label><input type="text" value={editingTimeSlot.label} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, label: e.target.value})} placeholder="e.g., Morning"/></div>
                  <div className="AdCal-Updt-form-group"><label>Time Range</label><input type="text" value={editingTimeSlot.time} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, time: e.target.value})} placeholder="e.g., 8:00 AM - 12:00 PM"/></div>
                  <div className="AdCal-Updt-form-group AdCal-Updt-checkbox"><label><input type="checkbox" checked={editingTimeSlot.active} onChange={(e) => setEditingTimeSlot({...editingTimeSlot, active: e.target.checked})}/>Active</label></div>
                  <div className="AdCal-Updt-form-actions">
                    <button onClick={addOrUpdateTimeSlot} className="AdCal-Updt-save-button"><Save size={16} /> Save</button>
                    <button onClick={() => setEditingTimeSlot(null)} className="AdCal-Updt-cancel-button"><X size={16} /> Cancel</button>
                  </div>
                </div>
              ) : <button onClick={() => setEditingTimeSlot({ id: '', label: '', time: '', active: true })} className="AdCal-Updt-add-button"><Plus size={16} /> Add New Time Slot</button>}
              <div className="AdCal-Updt-time-slots-list">
                {settingsData.timeSlots && settingsData.timeSlots.map(slot => (
                  <div key={slot.id} className={`AdCal-Updt-time-slot-item ${!slot.active ? 'inactive' : ''}`}>
                    <div className="AdCal-Updt-slot-info">
                      <div className="AdCal-Updt-slot-label">{slot.label}</div>
                      <div className="AdCal-Updt-slot-time">{slot.time}</div>
                      <div className="AdCal-Updt-slot-status">{slot.active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="AdCal-Updt-slot-actions">
                      <button onClick={() => handleToggleActive('timeSlots', slot.id)} className={`AdCal-Updt-toggle-button ${slot.active ? 'active' : 'inactive'}`}>{slot.active ? 'Set Inactive' : 'Set Active'}</button>
                      <button onClick={() => setEditingTimeSlot({...slot})} className="AdCal-Updt-edit-button"><Edit size={16} /></button>
                      <button onClick={() => deleteTimeSlot(slot.id)} className="AdCal-Updt-delete-button"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="AdCal-Updt-areas-tab">
            <div className="AdCal-Updt-tab-section">
              <h2 className="AdCal-Updt-section-heading">Manage Service Areas</h2>
              {editingServiceArea ? (
                <div className="AdCal-Updt-edit-form">
                  <h3>{editingServiceArea.id ? 'Edit' : 'Add'} Service Area</h3>
                  <div className="AdCal-Updt-form-group"><label>Name</label><input type="text" value={editingServiceArea.name} onChange={(e) => setEditingServiceArea({...editingServiceArea, name: e.target.value})} placeholder="e.g., North Zone"/></div>
                  <div className="AdCal-Updt-form-group AdCal-Updt-checkbox"><label><input type="checkbox" checked={editingServiceArea.active} onChange={(e) => setEditingServiceArea({...editingServiceArea, active: e.target.checked})}/>Active</label></div>
                  <div className="AdCal-Updt-form-actions">
                    <button onClick={addOrUpdateServiceArea} className="AdCal-Updt-save-button"><Save size={16} /> Save</button>
                    <button onClick={() => setEditingServiceArea(null)} className="AdCal-Updt-cancel-button"><X size={16} /> Cancel</button>
                  </div>
                </div>
              ) : <button onClick={() => setEditingServiceArea({ id: '', name: '', active: true })} className="AdCal-Updt-add-button"><Plus size={16} /> Add New Service Area</button>}
              <div className="AdCal-Updt-service-areas-list">
                {settingsData.serviceAreas && settingsData.serviceAreas.map(area => (
                  <div key={area.id} className={`AdCal-Updt-service-area-item ${!area.active ? 'inactive' : ''}`}>
                    <div className="AdCal-Updt-area-info">
                      <div className="AdCal-Updt-area-name">{area.name}</div>
                      <div className="AdCal-Updt-area-status">{area.active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="AdCal-Updt-area-actions">
                      <button onClick={() => handleToggleActive('serviceAreas', area.id)} className={`AdCal-Updt-toggle-button ${area.active ? 'active' : 'inactive'}`}>{area.active ? 'Set Inactive' : 'Set Active'}</button>
                      <button onClick={() => setEditingServiceArea({...area})} className="AdCal-Updt-edit-button"><Edit size={16} /></button>
                      <button onClick={() => deleteServiceArea(area.id)} className="AdCal-Updt-delete-button"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="AdCal-Updt-footer">
        <button onClick={handleSaveAllSettings} className="AdCal-Updt-save-settings-button" disabled={isSaving || isLoading}>
          {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;