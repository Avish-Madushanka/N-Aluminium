import React from 'react';
import CalendarStep from '../Components/UserCalendar/CalendarStep';
import ConfirmationStep from '../Components/UserCalendar/ConfirmationStep';
import DetailsStep from '../Components/UserCalendar/DetailsStep';
import ReviewStep from '../Components/UserCalendar/ReviewStep';
import ServiceAreaStep from '../Components/UserCalendar/ServiceAreaStep';
import TimeSlotStep from '../Components/UserCalendar/TimeSlotStep';
import UserCalendar from '../Components/UserCalendar/UserCalendar';

const Calendar = () => {
  return (
    <div>
        <CalendarStep />
        <ConfirmationStep />
        <DetailsStep />
        <MaterialStep />
        <ReviewStep />
        <ServiceAreaStep />
        <TimeSlotStep />
        <UserCalendar />
    </div>
  );
};

export default Calendar;