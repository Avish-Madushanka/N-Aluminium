import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from 'lucide-react';
import './AdCalendar.css';

const AdCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [timeSlot, setTimeSlot] = useState(null);
  const [collectionType, setCollectionType] = useState(null);

  // Time slots for collection options
  const timeSlots = [
    'Morning (8AM-11AM)', 'Midday (11AM-2PM)', 'Afternoon (2PM-5PM)', 'Evening (5PM-8PM)'
  ];

  // Collection types
  const collectionTypes = [
    { id: "cans", name: "Aluminum Cans", weight: "Light" },
    { id: "siding", name: "Siding/Gutters", weight: "Medium" },
    { id: "industrial", name: "Industrial Scrap", weight: "Heavy" },
    { id: "mixed", name: "Mixed Aluminum", weight: "Various" }
  ];

  // Get current month details
  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return { year, month, startingDay, daysInMonth };
  };

  const monthData = getMonthData(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate to previous/next month
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  // Check if a date is in the past
  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  // Simulate collection days (e.g., collection happens on Mon, Wed, Fri)
  const isCollectionDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    // Collection days: Monday (1), Wednesday (3), Friday (5)
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (isPastDate(day)) return;
    if (!isCollectionDay(day)) return;
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setTimeSlot(null);
    setCollectionType(null);
  };

  // Create calendar grid
  const renderCalendarDays = () => {
    const days = [];
    const { startingDay, daysInMonth } = monthData;
    
    // Empty cells for days before first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="adCal-empty-cell"></div>);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isPast = isPastDate(day);
      const isCollection = isCollectionDay(day);
      
      days.push(
        <div 
          key={day} 
          className={`adCal-calendar-day 
            ${isSelected ? 'adCal-calendar-day-selected' : ''}
            ${isPast ? 'adCal-calendar-day-past' : ''}
            ${!isCollection ? 'adCal-calendar-day-not-available' : ''}
            ${!isPast && isCollection && !isSelected ? 'adCal-calendar-day-hover' : ''}
            ${!isPast && isCollection && !isSelected ? 'adCal-calendar-day-available' : ''}`}
          onClick={() => (!isPast && isCollection) && handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="adCal-container">
      <div className="adCal-header">
        <div className="adCal-header-left">
          <Trash2 className="h-6 w-6 mr-2 text-green-600" />
          <h2 className="adCal-header-title">Aluminum Collection</h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="adCal-button-toggle">
          <Calendar className="h-5 w-5 mr-1" />
          {isOpen ? 'Hide Calendar' : 'Show Calendar'}
        </button>
      </div>

      <div className="adCal-subtext">
        <p>Schedule aluminum scrap collection from your location.</p>
        <p className="adCal-subtext-small">Collection available Monday, Wednesday, Friday</p>
      </div>

      {isOpen && (
        <div>
          <div className="adCal-calendar-nav">
            <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="adCal-calendar-month">
              {monthNames[monthData.month]} {monthData.year}
            </h3>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="adCal-calendar-day-names">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="adCal-calendar-day-name">
                {day}
              </div>
            ))}
          </div>

          <div className="adCal-calendar-days">
            {renderCalendarDays()}
          </div>

          <div className="adCal-subtext mt-2">
            <div className="w-3 h-3 rounded-full bg-green-200 border border-green-500 mr-1"></div>
            <span>Available collection days</span>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="border-t pt-4">
          <h3 className="adCal-calendar-month">{formatDate(selectedDate)}</h3>
          
          <p className="adCal-subtext mb-3">Select aluminum type for collection:</p>
          <div className="adCal-collection-type">
            {collectionTypes.map(type => (
              <button
                key={type.id}
                className={`adCal-collection-type-button ${collectionType === type.id ? 'adCal-collection-type-button-selected' : ''}`}
                onClick={() => setCollectionType(type.id)}
              >
                <div>{type.name}</div>
                <div className="text-xs opacity-80">{type.weight}</div>
              </button>
            ))}
          </div>
          
          <p className="adCal-subtext mb-3">Select a collection time:</p>
          <div className="adCal-time-slot">
            {timeSlots.map(time => (
              <button
                key={time}
                className={`adCal-time-slot-button ${timeSlot === time ? 'adCal-time-slot-button-selected' : ''}`}
                onClick={() => setTimeSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && timeSlot && collectionType && (
        <div className="mt-6">
          <button className="adCal-schedule-button">
            Schedule Collection: {formatDate(selectedDate)} at {timeSlot}
          </button>
          <p className="adCal-schedule-subtext">A truck will arrive during this time window</p>
        </div>
      )}
    </div>
  );
};

export default AdCalendar;
