import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

const CalendarComponent = () => { 
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [eventText, setEventText] = useState("");

  const handleAddEvent = () => {
    if (eventText.trim() === "") return;
    const dateString = date.toDateString();

    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateString]: [...(prevEvents[dateString] || []), eventText],
    }));

    setEventText("");
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Event Calendar</h2>
      <Calendar onChange={setDate} value={date} className="custom-calendar" />
      
      <div className="event-form">
        <input
          type="text"
          placeholder="Add event..."
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          className="event-input"
        />
        <button onClick={handleAddEvent} className="add-event-button">Add</button>
      </div>

      <div className="event-list">
        <h3>Events on {date.toDateString()}:</h3>
        <ul>
          {events[date.toDateString()]?.map((event, index) => (
            <li key={index} className="event-item">{event}</li>
          )) || <p>No events</p>}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent; 
