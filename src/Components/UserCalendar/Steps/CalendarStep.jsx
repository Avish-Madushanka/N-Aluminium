import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import '../css/CalendarStep.css';

const CalendarStep = ({
    onDateSelect,
    selectedDate,
    isCollectionDay,
    isPastDate,
    getSpecialDateStatus,
    monthNames,
    daysOfWeek
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { year, month, startingDayOfWeek, daysInMonth };
    };

    const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const handleInternalDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        onDateSelect(new Date(year, month, day));
    };

    const renderCalendarDays = () => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="CS-day CS-empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            const isPast = isPastDate(day, month, year);
            const isAvailable = isCollectionDay(day, month, year);
            const specialDate = getSpecialDateStatus(day, month, year);

            let dayClass = 'CS-day';
            if (isPast) dayClass += ' CS-past';
            else if (isAvailable) dayClass += ' CS-available';
            else dayClass += ' CS-unavailable';
            if (isSelected) dayClass += ' CS-selected';
            if (specialDate) dayClass += ` CS-special-${specialDate.status}`;

            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={dayClass}
                    onClick={() => handleInternalDateSelect(day, month, year)}
                    disabled={!isAvailable}
                    aria-label={`Select date ${monthNames[month]} ${day}, ${year}${!isAvailable ? ' (Unavailable)' : ''}`}
                >
                    <span className="CS-day-number">{day}</span>
                    {specialDate && <span className="CS-special-indicator" title={specialDate.reason}>*</span>}
                </button>
            );
        }

        return calendarDays;
    };

    return (
        <div className="CS-container">
            <div className="CS-header">
                <button onClick={goToPrevMonth} className="CS-nav" aria-label="Previous month">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="CS-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={goToNextMonth} className="CS-nav" aria-label="Next month">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="CS-weekdays">
                {daysOfWeek.map(day => <div key={day} className="CS-weekday">{day}</div>)}
            </div>
            <div className="CS-grid">{renderCalendarDays()}</div>
            <div className="CS-legend">
                <span className="CS-legend-item CS-available">Available</span>
                <span className="CS-legend-item CS-selected">Selected</span>
                <span className="CS-legend-item CS-unavailable">Unavailable</span>
                <span className="CS-legend-item CS-past">Past</span>
            </div>
            <div className="CS-instructions">
                <Info size={16} /> Select an available collection day (highlighted) to begin scheduling.
            </div>
        </div>
    );
};

export default CalendarStep;
