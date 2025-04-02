import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calendar.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/get-pickup-dates")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);


  const handleDateClick = async (info) => {
    const location = prompt(`Enter pickup location for ${info.dateStr}:`);
    if (location) {
      const newEvent = { title: location, start: info.dateStr };
      

      await fetch("/api/add-pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: info.dateStr, location }),
      });

      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo) => {
    const newLocation = prompt("Edit location:", clickInfo.event.title);
    if (newLocation === null) {

      return;
    } else if (newLocation === "") {

      if (window.confirm("Delete this pickup schedule?")) {
        fetch(`/api/delete-pickup/${clickInfo.event.id}`, { method: "DELETE" });
        clickInfo.event.remove();
      }
    } else {
      fetch(`/api/update-pickup/${clickInfo.event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation }),
      });

      clickInfo.event.setProp("title", newLocation);
    }
  };

  return (
    <div className="calendar-container">
      <h2>Admin Pickup Schedule</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendar;
