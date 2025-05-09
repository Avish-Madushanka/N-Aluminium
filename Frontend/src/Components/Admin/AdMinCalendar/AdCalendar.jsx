import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin,
  Save, Plus, Trash, Edit, Check, X, Settings, AlertTriangle, Info
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './AdCalendar.css';

const AdCalendar = () => {
  // State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settingsData, setSettingsData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dates');
  const [selectedDate, setSelectedDate] = useState(null);

  // Editing States
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState({ label: '', time: '', active: true });
  const [editingServiceArea, setEditingServiceArea] = useState(null);
  const [newServiceArea, setNewServiceArea] = useState({ name: '', active: true });
  const [newSpecialDate, setNewSpecialDate] = useState({ date: '', status: 'available', reason: '' });

  // Static Data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DEFAULT_AVAILABLE_DAYS = { '0': false, '1': true, '2': false, '3': true, '4': false, '5': true, '6': false };

  // Initialize default settings
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
    specialDates: [],
    dateSettings: {}
  });

  // Load settings from localStorage
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const storedSettings = localStorage.getItem('adminCalendarSettings');
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          if (parsed && typeof parsed.availableDays === 'object') {
            setSettingsData({
              ...initializeDefaultSettings(),
              ...parsed,
              dateSettings: parsed.dateSettings || {}
            });
          } else {
            throw new Error("Invalid settings structure");
          }
        } catch (e) {
          console.warn("Error parsing settings, using defaults:", e);
          setSettingsData(initializeDefaultSettings());
        }
      } else {
        setSettingsData(initializeDefaultSettings());
      }
      setIsLoading(false);
    }, 500);
  }, []);

  // Calendar navigation
  const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  // Get month data for calendar rendering
  const getMonthData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      year,
      month,
      startingDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    };
  }, [currentDate]);

  // Check if a date is in the past
  const isPastDate = (day) => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0);
    const monthData = getMonthData();
    const checkDate = new Date(monthData.year, monthData.month, day);
    return checkDate < today;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (isPastDate(day)) return;
    
    const monthData = getMonthData();
    const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    setSelectedDate({
      date: dateStr,
      day,
      month: monthData.month,
      year: monthData.year,
      dayOfWeek: daysOfWeek[new Date(monthData.year, monthData.month, day).getDay()]
    });
  };

  // Toggle regular availability for a day of week
  const toggleDayAvailability = (dayIndex) => {
    setSettingsData(prev => ({
      ...prev,
      availableDays: {
        ...prev.availableDays,
        [dayIndex]: !prev.availableDays[dayIndex]
      }
    }));
    setSuccess(`Updated availability for ${daysOfWeek[dayIndex]}`);
  };

  // Add special date override
  const addSpecialDate = () => {
    if (!newSpecialDate.date) {
      setError("Please select a date");
      return;
    }

    const specialDate = {
      id: `sd-${newSpecialDate.date}-${Date.now()}`,
      date: newSpecialDate.date,
      status: newSpecialDate.status,
      reason: newSpecialDate.reason || undefined
    };

    setSettingsData(prev => {
      const existingDateSettings = prev.dateSettings[newSpecialDate.date] || {};
      
      // Initialize with default active time slots and service areas if not already set
      const defaultTimeSlots = prev.timeSlots
        .filter(ts => ts.active)
        .map(ts => ts.id);
        
      const defaultServiceAreas = prev.serviceAreas
        .filter(sa => sa.active)
        .map(sa => sa.id);
        
      const newDateSettings = {
        timeSlots: existingDateSettings.timeSlots || defaultTimeSlots,
        serviceAreas: existingDateSettings.serviceAreas || defaultServiceAreas
      };

      return {
        ...prev,
        specialDates: [
          ...prev.specialDates.filter(d => d.date !== newSpecialDate.date),
          specialDate
        ],
        dateSettings: {
          ...prev.dateSettings,
          [newSpecialDate.date]: newDateSettings
        }
      };
    });

    setNewSpecialDate({ date: '', status: 'available', reason: '' });
    setSuccess(`Added special date override for ${newSpecialDate.date}`);
  };

  // Remove special date
  const removeSpecialDate = (date) => {
    setSettingsData(prev => ({
      ...prev,
      specialDates: prev.specialDates.filter(d => d.date !== date),
      dateSettings: Object.fromEntries(
        Object.entries(prev.dateSettings).filter(([key]) => key !== date)
      )
    }));
    setSuccess(`Removed special date override for ${date}`);
  };

  // Check if a date has special override
  const getSpecialDateStatus = (dateStr) => {
    const specialDate = settingsData.specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  };

  // Check if a date is available for pickup
  const isCollectionDay = (day) => {
    const monthData = getMonthData();
    const dateStr = `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialStatus = getSpecialDateStatus(dateStr);
    
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    
    const dayOfWeek = new Date(monthData.year, monthData.month, day).getDay().toString();
    return settingsData.availableDays[dayOfWeek];
  };

  // Toggle active status for items
  const handleToggleActive = (listKey, id) => {
    setSettingsData(prev => {
      const updatedList = prev[listKey].map(item => 
        item.id === id ? { ...item, active: !item.active } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
  };

  // Time Slot CRUD operations
  const addTimeSlot = () => {
    if (!newTimeSlot.label || !newTimeSlot.time) {
      setError("Label and Time are required");
      return;
    }

    const timeSlot = {
      id: `ts-${Date.now()}`,
      label: newTimeSlot.label,
      time: newTimeSlot.time,
      active: newTimeSlot.active
    };

    setSettingsData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, timeSlot]
    }));

    setNewTimeSlot({ label: '', time: '', active: true });
    setSuccess(`Added new time slot: ${timeSlot.label}`);
  };

  const updateTimeSlot = () => {
    if (!editingTimeSlot.label || !editingTimeSlot.time) {
      setError("Label and Time are required");
      return;
    }

    setSettingsData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(ts => 
        ts.id === editingTimeSlot.id ? editingTimeSlot : ts
      )
    }));

    setEditingTimeSlot(null);
    setSuccess(`Updated time slot: ${editingTimeSlot.label}`);
  };

  const deleteTimeSlot = (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) return;
    
    setSettingsData(prev => {
      // First remove from regular time slots
      const updatedTimeSlots = prev.timeSlots.filter(ts => ts.id !== id);
      
      // Then clean up date settings
      const updatedDateSettings = { ...prev.dateSettings };
      
      // Remove from all date settings
      Object.keys(updatedDateSettings).forEach(date => {
        if (updatedDateSettings[date].timeSlots) {
          updatedDateSettings[date].timeSlots = updatedDateSettings[date].timeSlots.filter(tsId => tsId !== id);
          
          // Remove the date setting entirely if no time slots or service areas remain
          if (updatedDateSettings[date].timeSlots.length === 0 && 
              (!updatedDateSettings[date].serviceAreas || updatedDateSettings[date].serviceAreas.length === 0)) {
            delete updatedDateSettings[date];
          }
        }
      });
      
      // Also clean up special dates that might reference this time slot
      const updatedSpecialDates = prev.specialDates.filter(sd => {
        // If the special date has time slot settings, check if it references this time slot
        const dateSetting = updatedDateSettings[sd.date];
        return !dateSetting || !dateSetting.timeSlots || !dateSetting.timeSlots.includes(id);
      });
      
      return {
        ...prev,
        timeSlots: updatedTimeSlots,
        dateSettings: updatedDateSettings,
        specialDates: updatedSpecialDates
      };
    });

    setSuccess("Time slot deleted");
  };

  // Service Area CRUD operations
  const addServiceArea = () => {
    if (!newServiceArea.name) {
      setError("Name is required");
      return;
    }

    const serviceArea = {
      id: `sa-${Date.now()}`,
      name: newServiceArea.name,
      active: newServiceArea.active
    };

    setSettingsData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, serviceArea]
    }));

    setNewServiceArea({ name: '', active: true });
    setSuccess(`Added new service area: ${serviceArea.name}`);
  };

  const updateServiceArea = () => {
    if (!editingServiceArea.name) {
      setError("Name is required");
      return;
    }

    setSettingsData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map(sa => 
        sa.id === editingServiceArea.id ? editingServiceArea : sa
      )
    }));

    setEditingServiceArea(null);
    setSuccess(`Updated service area: ${editingServiceArea.name}`);
  };

  const deleteServiceArea = (id) => {
    if (!window.confirm("Are you sure you want to delete this service area?")) return;
    
    setSettingsData(prev => {
      // First remove from regular service areas
      const updatedServiceAreas = prev.serviceAreas.filter(sa => sa.id !== id);
      
      // Then clean up date settings
      const updatedDateSettings = { ...prev.dateSettings };
      
      // Remove from all date settings
      Object.keys(updatedDateSettings).forEach(date => {
        if (updatedDateSettings[date].serviceAreas) {
          updatedDateSettings[date].serviceAreas = updatedDateSettings[date].serviceAreas.filter(saId => saId !== id);
          
          // Remove the date setting entirely if no time slots or service areas remain
          if (updatedDateSettings[date].serviceAreas.length === 0 && 
              (!updatedDateSettings[date].timeSlots || updatedDateSettings[date].timeSlots.length === 0)) {
            delete updatedDateSettings[date];
          }
        }
      });
      
      // Also clean up special dates that might reference this service area
      const updatedSpecialDates = prev.specialDates.filter(sd => {
        // If the special date has service area settings, check if it references this service area
        const dateSetting = updatedDateSettings[sd.date];
        return !dateSetting || !dateSetting.serviceAreas || !dateSetting.serviceAreas.includes(id);
      });
      
      return {
        ...prev,
        serviceAreas: updatedServiceAreas,
        dateSettings: updatedDateSettings,
        specialDates: updatedSpecialDates
      };
    });

    setSuccess("Service area deleted");
  };

  // Toggle time slot for specific date
  const toggleTimeSlotForDate = (timeSlotId) => {
    if (!selectedDate) return;
    
    setSettingsData(prev => {
      const newSettings = { ...prev };
      
      // Initialize date settings if not exists
      if (!newSettings.dateSettings[selectedDate.date]) {
        newSettings.dateSettings[selectedDate.date] = { 
          timeSlots: prev.timeSlots.filter(ts => ts.active).map(ts => ts.id),
          serviceAreas: prev.serviceAreas.filter(sa => sa.active).map(sa => sa.id)
        };
      }
      
      const timeSlots = newSettings.dateSettings[selectedDate.date].timeSlots || [];
      newSettings.dateSettings[selectedDate.date].timeSlots = 
        timeSlots.includes(timeSlotId)
          ? timeSlots.filter(id => id !== timeSlotId)
          : [...timeSlots, timeSlotId];
      
      // Ensure the date is in special dates if it's not already
      const isSpecialDate = newSettings.specialDates.some(d => d.date === selectedDate.date);
      if (!isSpecialDate) {
        newSettings.specialDates.push({
          id: `sd-${selectedDate.date}-${Date.now()}`,
          date: selectedDate.date,
          status: 'available',
          reason: 'Custom time slot selection'
        });
      }
      
      return newSettings;
    });
  };

  // Toggle service area for specific date
  const toggleServiceAreaForDate = (serviceAreaId) => {
    if (!selectedDate) return;
    
    setSettingsData(prev => {
      const newSettings = { ...prev };
      
      // Initialize date settings if not exists
      if (!newSettings.dateSettings[selectedDate.date]) {
        newSettings.dateSettings[selectedDate.date] = { 
          timeSlots: prev.timeSlots.filter(ts => ts.active).map(ts => ts.id),
          serviceAreas: prev.serviceAreas.filter(sa => sa.active).map(sa => sa.id)
        };
      }
      
      const serviceAreas = newSettings.dateSettings[selectedDate.date].serviceAreas || [];
      newSettings.dateSettings[selectedDate.date].serviceAreas = 
        serviceAreas.includes(serviceAreaId)
          ? serviceAreas.filter(id => id !== serviceAreaId)
          : [...serviceAreas, serviceAreaId];
      
      // Ensure the date is in special dates if it's not already
      const isSpecialDate = newSettings.specialDates.some(d => d.date === selectedDate.date);
      if (!isSpecialDate) {
        newSettings.specialDates.push({
          id: `sd-${selectedDate.date}-${Date.now()}`,
          date: selectedDate.date,
          status: 'available',
          reason: 'Custom service area selection'
        });
      }
      
      return newSettings;
    });
  };

  // Save all settings
  const handleSaveAllSettings = () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      try {
        localStorage.setItem('adminCalendarSettings', JSON.stringify(settingsData));
        setSuccess('All settings saved successfully!');
      } catch (e) {
        setError("Failed to save settings to Local Storage.");
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  };

  // Render calendar grid
  const renderCalendar = (viewOnly = false) => {
    const monthData = getMonthData();
    const { startingDay, daysInMonth } = monthData;
    const calendarCells = [];

    // Empty cells for days before the 1st of the month
    for (let i = 0; i < startingDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isAvailable = isCollectionDay(day);
      const isSelected = !viewOnly && selectedDate?.day === day;
      const specialStatus = getSpecialDateStatus(
        `${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      );
      
      const dayClasses = [
        'calendar-day',
        isPast ? 'past' : 'future',
        isAvailable ? 'available' : 'unavailable',
        specialStatus ? `special-${specialStatus}` : '',
        isSelected ? 'selected' : '',
        viewOnly ? 'view-only' : ''
      ].filter(Boolean).join(' ');

      calendarCells.push(
        <div
          key={`day-${day}`}
          className={dayClasses}
          onClick={viewOnly ? undefined : () => !isPast && handleDateSelect(day)}
          role={viewOnly ? undefined : "button"}
          tabIndex={viewOnly ? undefined : (isPast ? -1 : 0)}
        >
          <span className="day-number">{day}</span>
          {specialStatus && (
            <div className="status-indicator" title={`Special override: ${specialStatus}`}></div>
          )}
          {viewOnly && (
            <div className="day-details">
              {isAvailable && !specialStatus && (
                <div className="day-time-slots">
                  {settingsData.timeSlots
                    .filter(ts => ts.active)
                    .filter(ts => {
                      const dateSettings = settingsData.dateSettings[`${monthData.year}-${(monthData.month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`];
                      return !dateSettings?.timeSlots || dateSettings.timeSlots.includes(ts.id);
                    })
                    .map(ts => (
                      <div key={ts.id} className="day-time-slot">
                        {ts.label}: {ts.time}
                      </div>
                    ))}
                </div>
              )}
              {specialStatus === 'available' && (
                <div className="day-special-available">
                  Special availability
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return calendarCells;
  };

  // Loading state
  if (isLoading || !settingsData) {
    return (
      <div className="loading-container">
        <ClipLoader size={50} color="#f97316" />
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="admin-calendar-container">
      <div className="admin-header">
        <Settings size={24} className="header-icon" />
        <h1>Manage Pickup Availability</h1>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-banner-button">✕</button>
        </div>
      )}
      
      {success && (
        <div className="success-banner">
          <Check size={18} />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="close-banner-button">✕</button>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dates' ? 'active' : ''}`} 
          onClick={() => setActiveTab('dates')}
        >
          <Calendar size={16} />
          <span>Dates</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'times' ? 'active' : ''}`} 
          onClick={() => setActiveTab('times')}
        >
          <Clock size={16} />
          <span>Time Slots</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'areas' ? 'active' : ''}`} 
          onClick={() => setActiveTab('areas')}
        >
          <MapPin size={16} />
          <span>Service Areas</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'view' ? 'active' : ''}`} 
          onClick={() => setActiveTab('view')}
        >
          <Calendar size={16} />
          <span>View Calendar</span>
        </button>
      </div>

      <div className="admin-content">
        {/* Dates Tab */}
        {activeTab === 'dates' && (
          <div className="dates-tab">
            <div className="tab-section">
              <h2 className="section-heading">Regular Weekly Availability</h2>
              <div className="day-toggles">
                {Object.entries(settingsData.availableDays).map(([dayIndex, isAvailable]) => (
                  <button
                    key={dayIndex}
                    className={`day-toggle ${isAvailable ? 'active' : ''}`}
                    onClick={() => toggleDayAvailability(dayIndex)}
                  >
                    {daysOfWeek[dayIndex]}
                  </button>
                ))}
              </div>
            </div>

            <div className="tab-section">
              <h2 className="section-heading">Special Date Overrides</h2>
              <div className="add-special-date">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newSpecialDate.date}
                      onChange={(e) => setNewSpecialDate({...newSpecialDate, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newSpecialDate.status}
                      onChange={(e) => setNewSpecialDate({...newSpecialDate, status: e.target.value})}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Reason (Optional)</label>
                  <input
                    type="text"
                    value={newSpecialDate.reason}
                    onChange={(e) => setNewSpecialDate({...newSpecialDate, reason: e.target.value})}
                    placeholder="e.g., Holiday"
                  />
                </div>

                {/* Time Slots Selection */}
                {newSpecialDate.date && settingsData.timeSlots.filter(ts => ts.active).length > 0 && (
                  <div className="form-group">
                    <label>Available Time Slots</label>
                    <div className="time-slots-selection">
                      {settingsData.timeSlots.filter(ts => ts.active).map(slot => (
                        <div key={slot.id} className="time-slot-option">
                          <input
                            type="checkbox"
                            id={`time-slot-${slot.id}`}
                            checked={settingsData.dateSettings[newSpecialDate.date]?.timeSlots?.includes(slot.id) ?? true}
                            onChange={() => {
                              // Toggle time slot selection
                              setSettingsData(prev => {
                                const dateSettings = prev.dateSettings[newSpecialDate.date] || {
                                  timeSlots: prev.timeSlots.filter(ts => ts.active).map(ts => ts.id),
                                  serviceAreas: prev.serviceAreas.filter(sa => sa.active).map(sa => sa.id)
                                };
                                
                                const newTimeSlots = dateSettings.timeSlots.includes(slot.id)
                                  ? dateSettings.timeSlots.filter(id => id !== slot.id)
                                  : [...dateSettings.timeSlots, slot.id];
                                
                                return {
                                  ...prev,
                                  dateSettings: {
                                    ...prev.dateSettings,
                                    [newSpecialDate.date]: {
                                      ...dateSettings,
                                      timeSlots: newTimeSlots
                                    }
                                  }
                                };
                              });
                            }}
                          />
                          <label htmlFor={`time-slot-${slot.id}`}>
                            {slot.label} ({slot.time})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Areas Selection */}
                {newSpecialDate.date && settingsData.serviceAreas.filter(sa => sa.active).length > 0 && (
                  <div className="form-group">
                    <label>Available Service Areas</label>
                    <div className="service-areas-selection">
                      {settingsData.serviceAreas.filter(sa => sa.active).map(area => (
                        <div key={area.id} className="service-area-option">
                          <input
                            type="checkbox"
                            id={`service-area-${area.id}`}
                            checked={settingsData.dateSettings[newSpecialDate.date]?.serviceAreas?.includes(area.id) ?? true}
                            onChange={() => {
                              // Toggle service area selection
                              setSettingsData(prev => {
                                const dateSettings = prev.dateSettings[newSpecialDate.date] || {
                                  timeSlots: prev.timeSlots.filter(ts => ts.active).map(ts => ts.id),
                                  serviceAreas: prev.serviceAreas.filter(sa => sa.active).map(sa => sa.id)
                                };
                                
                                const newServiceAreas = dateSettings.serviceAreas.includes(area.id)
                                  ? dateSettings.serviceAreas.filter(id => id !== area.id)
                                  : [...dateSettings.serviceAreas, area.id];
                                
                                return {
                                  ...prev,
                                  dateSettings: {
                                    ...prev.dateSettings,
                                    [newSpecialDate.date]: {
                                      ...dateSettings,
                                      serviceAreas: newServiceAreas
                                    }
                                  }
                                };
                              });
                            }}
                          />
                          <label htmlFor={`service-area-${area.id}`}>
                            {area.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={addSpecialDate} className="add-button1">
                  <Plus size={16} /> Add Override
                </button>
              </div>

              <div className="special-dates-list">
                {settingsData.specialDates.map(specialDate => {
                  const dateSettings = settingsData.dateSettings[specialDate.date] || {};
                  return (
                    <div key={specialDate.id} className="special-date-item">
                      <div className="date-info">
                        <span className="date">{specialDate.date}</span>
                        <span className={`status ${specialDate.status}`}>
                          {specialDate.status}
                        </span>
                        {specialDate.reason && (
                          <span className="reason">{specialDate.reason}</span>
                        )}
                        <div className="date-details">
                          {dateSettings.timeSlots && dateSettings.timeSlots.length > 0 && (
                            <div className="detail-item">
                              <Clock size={14} />
                              <span>
                                {settingsData.timeSlots
                                  .filter(ts => dateSettings.timeSlots.includes(ts.id))
                                  .map(ts => ts.label)
                                  .join(', ')}
                              </span>
                            </div>
                          )}
                          {dateSettings.serviceAreas && dateSettings.serviceAreas.length > 0 && (
                            <div className="detail-item">
                              <MapPin size={14} />
                              <span>
                                {settingsData.serviceAreas
                                  .filter(sa => dateSettings.serviceAreas.includes(sa.id))
                                  .map(sa => sa.name)
                                  .join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSpecialDate(specialDate.date)}
                        className="delete-button"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="tab-section">
                <h2 className="section-heading">
                  Availability for {selectedDate.dayOfWeek}, {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                </h2>
                
                <div className="date-settings">
                  <div className="time-slots-selection">
                    <h3>Available Time Slots</h3>
                    {settingsData.timeSlots.filter(ts => ts.active).length > 0 ? (
                      <div className="time-slots-grid">
                        {settingsData.timeSlots.filter(ts => ts.active).map(slot => {
                          const isSelected = settingsData.dateSettings[selectedDate.date]?.timeSlots?.includes(slot.id) ?? false;
                          return (
                            <div
                              key={slot.id}
                              className={`time-slot-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleTimeSlotForDate(slot.id)}
                            >
                              <div className="time-slot-label">{slot.label}</div>
                              <div className="time-slot-time">{slot.time}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="no-items">No active time slots available</p>
                    )}
                  </div>

                  <div className="service-areas-selection">
                    <h3>Available Service Areas</h3>
                    {settingsData.serviceAreas.filter(sa => sa.active).length > 0 ? (
                      <div className="service-areas-grid">
                        {settingsData.serviceAreas.filter(sa => sa.active).map(area => {
                          const isSelected = settingsData.dateSettings[selectedDate.date]?.serviceAreas?.includes(area.id) ?? false;
                          return (
                            <div
                              key={area.id}
                              className={`service-area-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleServiceAreaForDate(area.id)}
                            >
                              <MapPin size={18} />
                              <span>{area.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="no-items">No active service areas available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'times' && (
          <div className="times-tab">
            <div className="tab-section">
              <h2 className="section-heading">Manage Time Slots</h2>
              
              {editingTimeSlot ? (
                <div className="edit-form">
                  <h3>{editingTimeSlot.id ? 'Edit' : 'Add'} Time Slot</h3>
                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={editingTimeSlot.label}
                      onChange={(e) => setEditingTimeSlot({...editingTimeSlot, label: e.target.value})}
                      placeholder="e.g., Morning"
                    />
                  </div>
                  <div className="form-group">
                    <label>Time Range</label>
                    <input
                      type="text"
                      value={editingTimeSlot.time}
                      onChange={(e) => setEditingTimeSlot({...editingTimeSlot, time: e.target.value})}
                      placeholder="e.g., 8:00 AM - 12:00 PM"
                    />
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingTimeSlot.active}
                        onChange={(e) => setEditingTimeSlot({...editingTimeSlot, active: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                  <div className="form-actions">
                    <button onClick={() => editingTimeSlot.id ? updateTimeSlot() : addTimeSlot()} className="save-button">
                      <Save size={16} /> Save
                    </button>
                    <button onClick={() => setEditingTimeSlot(null)} className="cancel-button">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingTimeSlot({ id: '', label: '', time: '', active: true })}
                  className="add-button"
                >
                  <Plus size={16} /> Add New Time Slot
                </button>
              )}

              <div className="time-slots-list">
                {settingsData.timeSlots.map(slot => (
                  <div key={slot.id} className={`time-slot-item ${!slot.active ? 'inactive' : ''}`}>
                    <div className="slot-info">
                      <div className="slot-label">{slot.label}</div>
                      <div className="slot-time">{slot.time}</div>
                      <div className="slot-status">{slot.active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="slot-actions">
                      <button 
                        onClick={() => handleToggleActive('timeSlots', slot.id)} 
                        className={`toggle-button ${slot.active ? 'active' : 'inactive'}`}
                      >
                        {slot.active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => setEditingTimeSlot({...slot})} className="edit-button">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteTimeSlot(slot.id)} className="delete-button">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Service Areas Tab */}
        {activeTab === 'areas' && (
          <div className="areas-tab">
            <div className="tab-section">
              <h2 className="section-heading">Manage Service Areas</h2>
              
              {editingServiceArea ? (
                <div className="edit-form">
                  <h3>{editingServiceArea.id ? 'Edit' : 'Add'} Service Area</h3>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editingServiceArea.name}
                      onChange={(e) => setEditingServiceArea({...editingServiceArea, name: e.target.value})}
                      placeholder="e.g., North Zone"
                    />
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingServiceArea.active}
                        onChange={(e) => setEditingServiceArea({...editingServiceArea, active: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                  <div className="form-actions">
                    <button onClick={() => editingServiceArea.id ? updateServiceArea() : addServiceArea()} className="save-button">
                      <Save size={16} /> Save
                    </button>
                    <button onClick={() => setEditingServiceArea(null)} className="cancel-button">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingServiceArea({ id: '', name: '', active: true })}
                  className="add-button"
                >
                  <Plus size={16} /> Add New Service Area
                </button>
              )}

              <div className="service-areas-list">
                {settingsData.serviceAreas.map(area => (
                  <div key={area.id} className={`service-area-item ${!area.active ? 'inactive' : ''}`}>
                    <div className="area-info">
                      <div className="area-name">{area.name}</div>
                      <div className="area-status">{area.active ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="area-actions">
                      <button 
                        onClick={() => handleToggleActive('serviceAreas', area.id)} 
                        className={`toggle-button ${area.active ? 'active' : 'inactive'}`}
                      >
                        {area.active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => setEditingServiceArea({...area})} className="edit-button">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteServiceArea(area.id)} className="delete-button">
                        <Trash size={16} />
                      </button>
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
        <button
          onClick={handleSaveAllSettings}
          className="save-settings-button"
          disabled={isSaving}
        >
          {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;