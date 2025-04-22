import React from 'react';
import {
  CheckCircle,
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
  AlertTriangle,
  Plus
} from 'lucide-react';
import SummaryItem from '../Utils/SummaryItem';

const ConfirmationStep = ({
  bookingId,
  selectedDate,
  selectedTimeSlotData,
  selectedServiceAreaData,
  selectedMaterialData,
  pickupLocation,
  estimatedWeight,
  contactDetails,
  onResetForm,
  formatDate
}) => {
  return (
    <div className="CS2-container">
      <div className="CS2-header">
        <CheckCircle size={48} className="CS2-icon" />
        <h2 className="CS2-title">Booking Confirmed!</h2>
        <p className="CS2-id">Booking ID: <strong>{bookingId}</strong></p>
      </div>

      <div className="CS2-details">
        <div className="CS2-section">
          <h3 className="CS2-section-title"><Calendar size={18} /> Pickup Details</h3>
          <SummaryItem IconComponent={Calendar} label="Date" value={formatDate(selectedDate)} />
          <SummaryItem IconComponent={Clock} label="Time" value={selectedTimeSlotData?.time} />
          <SummaryItem IconComponent={MapPin} label="Area" value={selectedServiceAreaData?.name} />
          <SummaryItem IconComponent={Truck} label="Address" value={pickupLocation} />
        </div>

        <div className="CS2-section">
          <h3 className="CS2-section-title"><Recycle size={18} /> Material Details</h3>
          <SummaryItem IconComponent={Package} label="Type" value={selectedMaterialData?.name} />
          <SummaryItem IconComponent={Weight} label="Est. Weight" value={estimatedWeight ? `${estimatedWeight} lbs` : "N/A"} />
          <SummaryItem IconComponent={Info} label="Est. Rate" value={selectedMaterialData?.rate} />
        </div>

        <div className="CS2-section">
          <h3 className="CS2-section-title"><User size={18} /> Contact Info</h3>
          <SummaryItem IconComponent={User} label="Name" value={contactDetails.name} />
          <SummaryItem IconComponent={Phone} label="Phone" value={contactDetails.phone} />
          <SummaryItem IconComponent={Mail} label="Email" value={contactDetails.email} />
        </div>
      </div>

      <div className="CS2-instructions">
        <AlertTriangle size={16} /> A confirmation email has been sent to {contactDetails.email}. Please keep your Booking ID for reference.
      </div>

      <button onClick={onResetForm} className="CS2-button">
        <Plus size={16} /> Schedule Another Pickup
      </button>
    </div>
  );
};

export default ConfirmationStep;
