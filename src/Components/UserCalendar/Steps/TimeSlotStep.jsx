import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const TimeSlotStep = ({
    selectedDate,
    selectedTimeSlot,
    activeTimeSlots,
    onTimeSelect,
    onNextStep,
    onPrevStep,
    formatDate
}) => {
    return (
        <div className="TS-container">
            <div className="TS-header">
                <h2>Select Pickup Time</h2>
                <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
            </div>

            <div className="TS-grid">
                {activeTimeSlots.map(slot => (
                    <button
                        key={slot.id}
                        className={`TS-card ${selectedTimeSlot === slot.id ? 'selected' : ''}`}
                        onClick={() => onTimeSelect(slot.id)}
                        aria-pressed={selectedTimeSlot === slot.id}
                    >
                        <Clock size={24} />
                        <h3>{slot.label}</h3>
                        <p>{slot.time}</p>
                    </button>
                ))}
            </div>

            <div className="TS-navigation">
                <button onClick={onPrevStep} className="TS-back">
                    <ChevronLeft size={16} /> Change Date
                </button>
                <button onClick={onNextStep} className="TS-next" disabled={!selectedTimeSlot}>
                    Next: Service Area <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default TimeSlotStep;
