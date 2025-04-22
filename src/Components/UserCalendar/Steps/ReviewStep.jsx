import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  Recycle,
  Package,
  Weight,
  Info,
  User,
  Phone,
  Mail,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const ReviewStep = ({
  selectedDate,
  selectedTimeSlotData,
  selectedServiceAreaData,
  selectedMaterialData,
  pickupLocation,
  estimatedWeight,
  contactDetails,
  onConfirmBooking,
  onPrevStep,
  formatDate
}) => {
  return (
    <div className="RS-container">
      <div className="RS-header">
        <h2 className="RS-title">Review Your Booking</h2>
        <p className="RS-subtitle">Please check all details before confirming.</p>
      </div>

      <div className="RS-details">
        <div className="RS-section">
          <h3><Calendar size={18} /> Pickup Details</h3>
          <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
          <SummaryItem IconComponent={Clock} label="Time" value={selectedTimeSlotData?.time} />
          <SummaryItem IconComponent={MapPin} label="Area" value={selectedServiceAreaData?.name} />
          <SummaryItem IconComponent={Truck} label="Address" value={pickupLocation} />
        </div>

        <div className="RS-section">
          <h3><Recycle size={18} /> Material Details</h3>
          <SummaryItem IconComponent={Package} label="Type" value={selectedMaterialData?.name} />
          <SummaryItem IconComponent={Weight} label="Est. Weight" value={estimatedWeight ? `${estimatedWeight} lbs` : "N/A"} />
          <SummaryItem IconComponent={Info} label="Est. Rate" value={selectedMaterialData?.rate} />
        </div>

        <div className="RS-section">
          <h3><User size={18} /> Contact Info</h3>
          <SummaryItem IconComponent={User} label="Name" value={contactDetails.name} />
          <SummaryItem IconComponent={Phone} label="Phone" value={contactDetails.phone} />
          <SummaryItem IconComponent={Mail} label="Email" value={contactDetails.email} />
        </div>
      </div>

      <div className="RS-navigation">
        <button onClick={onPrevStep} className="RS-back">
          <ChevronLeft size={16} /> Edit Details
        </button>
        <button onClick={onConfirmBooking} className="RS-confirm">
          <CheckCircle size={16} /> Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
