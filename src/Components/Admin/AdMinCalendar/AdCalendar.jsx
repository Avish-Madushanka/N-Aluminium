import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, 
  Save, Plus, Trash, Edit, Check, X, Settings
} from 'lucide-react';
import './AdCalendar.css';

const AdCalendar = ({ onSaveSettings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [availableDays, setAvailableDays] = useState({
    0: false, 
    1: true,  
    2: false, 
    3: true,  
    4: false, 
    5: true,  
    6: false  
  });
  
  const [timeSlots, setTimeSlots] = useState([
    { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning", active: true },
    { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
    { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon", active: true },
    { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: true }
  ]);
  
  const [serviceAreas, setServiceAreas] = useState([
    { id: "downtown", name: "Downtown", active: true },
    { id: "north", name: "North Side", active: true },
    { id: "south", name: "South Side", active: true },
    { id: "east", name: "East Side", active: true },
    { id: "west", name: "West Side", active: true }
  ]);

  const [specialDates, setSpecialDates] = useState([]);
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState({ label: '', time: '', active: true });
  const [newServiceArea, setNewServiceArea] = useState({ name: '', active: true });
  const [editingServiceArea, setEditingServiceArea] = useState(null);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return { year, month, startingDay, daysInMonth };
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const isRegularCollectionDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return availableDays[dayOfWeek];
  };

  const getSpecialDateStatus = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const specialDate = specialDates.find(d => d.date === dateStr);
    return specialDate ? specialDate.status : null;
  };

  const toggleDayAvailability = (dayIndex) => {
    setAvailableDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const toggleSpecificDay = (day) => {
    if (isPastDate(day)) return;

    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const existingIndex = specialDates.findIndex(d => d.date === dateStr);
    
    if (existingIndex >= 0) {
      setSpecialDates(specialDates.filter((_, i) => i !== existingIndex));
    } else {

      const regularStatus = isRegularCollectionDay(day);
      setSpecialDates([...specialDates, { 
        date: dateStr, 
        status: !regularStatus ? 'available' : 'unavailable'
      }]);
    }
  };


  const isCollectionDay = (day) => {
    const specialStatus = getSpecialDateStatus(day);
    if (specialStatus === 'available') return true;
    if (specialStatus === 'unavailable') return false;
    return isRegularCollectionDay(day);
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.label || !newTimeSlot.time) return;
    
    const id = newTimeSlot.label.toLowerCase().replace(/\s+/g, '-');
    setTimeSlots([...timeSlots, { ...newTimeSlot, id }]);
    setNewTimeSlot({ label: '', time: '', active: true });
  };

  const deleteTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const toggleTimeSlotActive = (id) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, active: !slot.active } : slot
    ));
  };

  const startEditTimeSlot = (slot) => {
    setEditingTimeSlot({ ...slot });
  };

  const saveEditTimeSlot = () => {
    if (!editingTimeSlot.label || !editingTimeSlot.time) return;
    
    setTimeSlots(timeSlots.map(slot => 
      slot.id === editingTimeSlot.id ? editingTimeSlot : slot
    ));
    setEditingTimeSlot(null);
  };

  const addServiceArea = () => {
    if (!newServiceArea.name) return;
    
    const id = newServiceArea.name.toLowerCase().replace(/\s+/g, '-');
    setServiceAreas([...serviceAreas, { ...newServiceArea, id }]);
    setNewServiceArea({ name: '', active: true });
  };

  const deleteServiceArea = (id) => {
    setServiceAreas(serviceAreas.filter(area => area.id !== id));
  };

  const toggleServiceAreaActive = (id) => {
    setServiceAreas(serviceAreas.map(area => 
      area.id === id ? { ...area, active: !area.active } : area
    ));
  };

  const startEditServiceArea = (area) => {
    setEditingServiceArea({ ...area });
  };

  const saveEditServiceArea = () => {
    if (!editingServiceArea.name) return;
    
    setServiceAreas(serviceAreas.map(area => 
      area.id === editingServiceArea.id ? editingServiceArea : area
    ));
    setEditingServiceArea(null);
  };

  const saveSettings = () => {
    const settings = {
      availableDays,
      timeSlots,
      serviceAreas,
      specialDates
    };
    
    onSaveSettings(settings);
  };

  const renderCalendar = () => {
    const { startingDay, daysInMonth } = getMonthData();
    const calendarDays = [];

    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      const specialStatus = getSpecialDateStatus(day);
      
      calendarDays.push(
        <div 
          key={`day-${day}`}
          className={`
            calendar-day 
            ${isPast ? 'past' : ''} 
            ${isCollection ? 'collection' : 'no-collection'}
            ${specialStatus ? 'special' : ''}
          `}
          onClick={() => !isPast && toggleSpecificDay(day)}
        >
          <span className="day-number">{day}</span>
          {specialStatus && (
            <span className={`special-indicator ${specialStatus}`}></span>
          )}
        </div>
      );
    }
    
    return calendarDays;
  };

  return (
    <div className="admin-calendar-container">
      <div className="admin-header">
        <div className="header-icon-container">
          <Settings size={24} className="header-icon" />
        </div>
        <h1>Admin Collection Management</h1>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={16} />
          <span>Calendar Settings</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'timeslots' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeslots')}
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
      </div>
      
      <div className="admin-content">
        {activeTab === 'calendar' && (
          <div className="calendar-settings">
            <h2>Collection Days</h2>
            
            <div className="day-toggles">
              {daysOfWeek.map((day, index) => (
                <button 
                  key={day}
                  className={`day-toggle ${availableDays[index] ? 'active' : ''}`}
                  onClick={() => toggleDayAvailability(index)}
                >
                  {day}
                </button>
              ))}
            </div>
            
            <div className="admin-calendar">
              <div className="calendar-header">
                <button onClick={goToPrevMonth} className="nav-button">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
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
                {renderCalendar()}
              </div>
              
              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot collection"></span>
                  <span>Regular Collection Day</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot no-collection"></span>
                  <span>No Collection</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot special available"></span>
                  <span>Special Collection Day Added</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot special unavailable"></span>
                  <span>Collection Day Removed</span>
                </div>
              </div>
              
              <div className="calendar-info">
                <p>Click on a day to toggle its collection status. Past dates cannot be modified.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'timeslots' && (
          <div className="time-slot-settings">
            <h2>Time Slot Management</h2>
            
            <div className="time-slot-list">
              {timeSlots.map(slot => (
                <div key={slot.id} className="admin-time-slot">
                  {editingTimeSlot && editingTimeSlot.id === slot.id ? (
                    <div className="time-slot-edit-form">
                      <input 
                        type="text" 
                        value={editingTimeSlot.label} 
                        onChange={(e) => setEditingTimeSlot({...editingTimeSlot, label: e.target.value})}
                        placeholder="Label (e.g. Morning)"
                      />
                      <input 
                        type="text" 
                        value={editingTimeSlot.time} 
                        onChange={(e) => setEditingTimeSlot({...editingTimeSlot, time: e.target.value})}
                        placeholder="Time Range (e.g. 9:00 AM - 12:00 PM)"
                      />
                      <div className="edit-actions">
                        <button onClick={saveEditTimeSlot} className="save-button">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingTimeSlot(null)} className="cancel-button">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="time-slot-info">
                        <span className={`time-slot-status ${slot.active ? 'active' : 'inactive'}`}></span>
                        <div>
                          <h3>{slot.label}</h3>
                          <p>{slot.time}</p>
                        </div>
                      </div>
                      <div className="time-slot-actions">
                        <button 
                          onClick={() => toggleTimeSlotActive(slot.id)}
                          className={`toggle-button ${slot.active ? 'active' : 'inactive'}`}
                        >
                          {slot.active ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => startEditTimeSlot(slot)} className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteTimeSlot(slot.id)} className="delete-button">
                          <Trash size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="add-time-slot">
              <h3>Add New Time Slot</h3>
              <div className="add-form">
                <input 
                  type="text" 
                  value={newTimeSlot.label} 
                  onChange={(e) => setNewTimeSlot({...newTimeSlot, label: e.target.value})}
                  placeholder="Label (e.g. Evening)"
                />
                <input 
                  type="text" 
                  value={newTimeSlot.time} 
                  onChange={(e) => setNewTimeSlot({...newTimeSlot, time: e.target.value})}
                  placeholder="Time Range (e.g. 5:00 PM - 8:00 PM)"
                />
                <button onClick={addTimeSlot} className="add-button">
                  <Plus size={16} />
                  <span>Add Time Slot</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'areas' && (
          <div className="service-area-settings">
            <h2>Service Area Management</h2>
            
            <div className="service-area-list">
              {serviceAreas.map(area => (
                <div key={area.id} className="admin-service-area">
                  {editingServiceArea && editingServiceArea.id === area.id ? (
                    <div className="service-area-edit-form">
                      <input 
                        type="text" 
                        value={editingServiceArea.name} 
                        onChange={(e) => setEditingServiceArea({...editingServiceArea, name: e.target.value})}
                        placeholder="Area Name"
                      />
                      <div className="edit-actions">
                        <button onClick={saveEditServiceArea} className="save-button">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingServiceArea(null)} className="cancel-button">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="service-area-info">
                        <span className={`service-area-status ${area.active ? 'active' : 'inactive'}`}></span>
                        <h3>{area.name}</h3>
                      </div>
                      <div className="service-area-actions">
                        <button 
                          onClick={() => toggleServiceAreaActive(area.id)}
                          className={`toggle-button ${area.active ? 'active' : 'inactive'}`}
                        >
                          {area.active ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => startEditServiceArea(area)} className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteServiceArea(area.id)} className="delete-button">
                          <Trash size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="add-service-area">
              <h3>Add New Service Area</h3>
              <div className="add-form">
                <input 
                  type="text" 
                  value={newServiceArea.name} 
                  onChange={(e) => setNewServiceArea({...newServiceArea, name: e.target.value})}
                  placeholder="Area Name (e.g. Northwest District)"
                />
                <button onClick={addServiceArea} className="add-button">
                  <Plus size={16} />
                  <span>Add Service Area</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="admin-footer">
        <button onClick={saveSettings} className="save-settings-button">
          <Save size={16} />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AdCalendar;