import React from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const ServiceAreaStep = ({
  selectedDate,
  selectedTimeSlotData,
  selectedServiceArea,
  activeServiceAreas,
  onAreaSelect,
  onNextStep,
  onPrevStep,
  formatDate
}) => {
  return (
    <div className="SAS-container">
      <div className="SAS-header">
        <h2>Select Service Area</h2>
        <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
        <SummaryItem IconComponent={Clock} label="Time" value={selectedTimeSlotData?.label} />
      </div>

      <div className="SAS-grid">
        {activeServiceAreas.map(area => (
          <button
            key={area.id}
            className={`SAS-card ${selectedServiceArea === area.id ? 'selected' : ''}`}
            onClick={() => onAreaSelect(area.id)}
            aria-pressed={selectedServiceArea === area.id}
          >
            <MapPin size={24} />
            <h3>{area.name}</h3>
          </button>
        ))}
      </div>

      <div className="SAS-navigation">
        <button onClick={onPrevStep} className="SAS-back">
          <ChevronLeft size={16} /> Change Time
        </button>
        <button onClick={onNextStep} className="SAS-next" disabled={!selectedServiceArea}>
          Next: Material Type <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ServiceAreaStep;
