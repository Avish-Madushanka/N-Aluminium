import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Recycle,
  Truck,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const DetailsStep = ({
  selectedDate,
  selectedTimeSlotData,
  selectedServiceAreaData,
  selectedMaterialData,
  pickupLocation,
  estimatedWeight,
  contactDetails,
  onDetailsChange,
  onNextStep,
  onPrevStep,
  formatDate
}) => {
  const handleInputChange = (e) => {
    onDetailsChange(e.target.name, e.target.value);
  };

  const isNextDisabled = !pickupLocation || !contactDetails.name || !contactDetails.phone || !contactDetails.email;

  return (
    <div className="DS-container">
      <div className="DS-header">
        <h2 className="DS-title">Pickup & Contact Details</h2>
        <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
        <SummaryItem IconComponent={Clock} label="Time" value={selectedTimeSlotData?.label} />
        <SummaryItem IconComponent={MapPin} label="Area" value={selectedServiceAreaData?.name} />
        <SummaryItem IconComponent={Recycle} label="Material" value={selectedMaterialData?.name} />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="DS-form">
        <div className="DS-section">
          <h3 className="DS-section-title"><Truck size={18} /> Pickup Information</h3>
          <div className="DS-field">
            <label htmlFor="pickupLocation">Pickup Address*</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={pickupLocation}
              onChange={handleInputChange}
              placeholder="Full address for pickup"
              required
              aria-required="true"
            />
          </div>
          <div className="DS-field">
            <label htmlFor="estimatedWeight">Estimated Weight (lbs)</label>
            <input
              type="number"
              id="estimatedWeight"
              name="estimatedWeight"
              value={estimatedWeight}
              onChange={handleInputChange}
              placeholder="Approximate weight (optional)"
              min="0"
            />
          </div>
        </div>

        <div className="DS-section">
          <h3 className="DS-section-title"><User size={18} /> Contact Information</h3>
          <div className="DS-field">
            <label htmlFor="name">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactDetails.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              aria-required="true"
            />
          </div>
          <div className="DS-field">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactDetails.phone}
              onChange={handleInputChange}
              placeholder="e.g., 555-123-4567"
              required
              aria-required="true"
            />
          </div>
          <div className="DS-field">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactDetails.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
              aria-required="true"
            />
          </div>
        </div>
      </form>

      <div className="DS-navigation">
        <button onClick={onPrevStep} className="DS-back" type="button">
          <ChevronLeft size={16} /> Change Material
        </button>
        <button
          onClick={onNextStep}
          className="DS-next"
          type="button"
          disabled={isNextDisabled}
        >
          Review Booking <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
