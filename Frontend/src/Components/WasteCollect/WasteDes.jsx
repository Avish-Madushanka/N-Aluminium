import React from 'react';
import './WasteDes.css';

const WasteDes = () => {
  return (
    <div>
    <nav className="Wlink">
      <hr className="Wlink-line" />
      <div className="Wlink-links">
        <a href="/add-picker" className="Wlink-link">Add Picker</a>
        <a href="/view-calendar" className="Wlink-link">View Calendar</a>
        <a href="/view-calendar-2" className="Wlink-link">View Calendar</a>
      </div>
    </nav>
    <div className="WApickup-schedule-container">
      <h2 className="WApage-title">Current Customer Garbage Pickup Schedule</h2>
      <h1 className="WAschedule-title">Your Pickup Schedule</h1>
      <p className="WAschedule-description">
        You can only see your pickup schedule if you are a current customer.
      </p>

     </div> 
    </div>
  );
};

export default WasteDes;