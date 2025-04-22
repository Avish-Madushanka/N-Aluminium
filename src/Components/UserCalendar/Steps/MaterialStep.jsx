import React from 'react';
import { Calendar, Clock, MapPin, Recycle, ChevronLeft, ChevronRight } from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const MaterialStep = ({
  selectedDate,
  selectedTimeSlotData,
  selectedServiceAreaData,
  selectedMaterial,
  materialTypesData,
  onMaterialSelect,
  onNextStep,
  onPrevStep,
  formatDate
}) => {
  return (
    <div className="MS-container">
      <div className="MS-header">
        <h2 className="MS-title">Select Material Type</h2>
        <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
        <SummaryItem IconComponent={Clock} label="Time" value={selectedTimeSlotData?.label} />
        <SummaryItem IconComponent={MapPin} label="Area" value={selectedServiceAreaData?.name} />
      </div>

      <div className="MS-grid">
        {materialTypesData.map(material => (
          <button
            key={material.id}
            className={`MS-card ${selectedMaterial === material.id ? 'MS-selected' : ''}`}
            onClick={() => onMaterialSelect(material.id)}
            aria-pressed={selectedMaterial === material.id}
          >
            <span className="MS-icon">{material.icon}</span>
            <h3 className="MS-name">{material.name}</h3>
            <p className="MS-rate">{material.rate}</p>
            <p className="MS-desc">{material.description}</p>
          </button>
        ))}
      </div>

      <div className="MS-navigation">
        <button onClick={onPrevStep} className="MS-back">
          <ChevronLeft size={16} /> Change Area
        </button>
        <button onClick={onNextStep} className="MS-next" disabled={!selectedMaterial}>
          Next: Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MaterialStep;
