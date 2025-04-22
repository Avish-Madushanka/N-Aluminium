// src/components/UserCalendar/UserCalendar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Recycle, CheckCircle } from 'lucide-react'; // Only icons needed for header/progress

// Import Step Components
import CalendarStep from './Steps/CalendarStep';
import TimeSlotStep from './Steps/TimeSlotStep';
import ServiceAreaStep from './Steps/ServiceAreaStep';
import MaterialStep from './Steps/MaterialStep';
import DetailsStep from './Steps/DetailsStep';
import ReviewStep from './Steps/ReviewStep';
import ConfirmationStep from './Steps/ConfirmationStep';

import './UserCalendar.css'; // Main CSS

// --- Data (Keep data definitions here or import from separate files) ---
const defaultAdminSettings = {
    availableDays: { 0: false, 1: true, 2: false, 3: true, 4: false, 5: true, 6: false },
    timeSlots: [
        { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning", active: true },
        { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
        { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon", active: true },
        { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: false }
    ],
    serviceAreas: [
        { id: "downtown", name: "Downtown Core", active: true },
        { id: "north", name: "North Side", active: true },
        { id: "south", name: "South Side", active: false },
        { id: "east", name: "East End", active: true },
        { id: "west", name: "West End", active: true }
    ],
    specialDates: [
        // { date: "YYYY-MM-DD", status: "unavailable" | "available", reason: "Optional Reason" }
    ]
};

const materialTypesData = [
    { id: "cans", name: "Aluminum Cans", rate: "$0.55/lb", description: "Beverage/food cans", icon: "🥫" },
    { id: "extrusions", name: "Extrusions", rate: "$0.65/lb", description: "Window/door frames", icon: "🪟" },
    { id: "siding", name: "Siding & Gutters", rate: "$0.70/lb", description: "Home siding, gutters", icon: "🏠" },
    { id: "industrial", name: "Industrial Scrap", rate: "$0.85/lb", description: "Machine parts, offcuts", icon: "⚙️" },
    { id: "wheels", name: "Wheels & Rims", rate: "$0.75/lb", description: "Aluminum car wheels", icon: "🛞" },
    { id: "mixed", name: "Mixed Aluminum", rate: "$0.60/lb", description: "Assorted items", icon: "🔄" }
];
// --- End Data ---

const UserCalendar = ({ adminSettings }) => {
    // --- State Management (Remains in the main component) ---
    const [bookingStep, setBookingStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlot, setTimeSlot] = useState(null);
    const [serviceArea, setServiceArea] = useState(null);
    const [materialType, setMaterialType] = useState(null);
    const [estimatedWeight, setEstimatedWeight] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [contactDetails, setContactDetails] = useState({ name: "", phone: "", email: "" });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState("");

    // --- Settings & Derived Data ---
    const settings = useMemo(() => ({
        ...defaultAdminSettings,
        ...adminSettings,
        timeSlots: adminSettings?.timeSlots || defaultAdminSettings.timeSlots,
        serviceAreas: adminSettings?.serviceAreas || defaultAdminSettings.serviceAreas,
        specialDates: adminSettings?.specialDates || defaultAdminSettings.specialDates,
        availableDays: adminSettings?.availableDays || defaultAdminSettings.availableDays,
    }), [adminSettings]);

    const activeTimeSlots = useMemo(() => settings.timeSlots.filter(slot => slot.active), [settings.timeSlots]);
    const activeServiceAreas = useMemo(() => settings.serviceAreas.filter(area => area.active), [settings.serviceAreas]);

    // Data lookup helpers
    const getSelectedTimeSlotData = useMemo(() => settings.timeSlots.find(slot => slot.id === timeSlot), [timeSlot, settings.timeSlots]);
    const getSelectedServiceAreaData = useMemo(() => settings.serviceAreas.find(area => area.id === serviceArea), [serviceArea, settings.serviceAreas]);
    const getSelectedMaterialData = useMemo(() => materialTypesData.find(material => material.id === materialType), [materialType]);

    // --- Effects ---
    useEffect(() => {
        if (bookingConfirmed) {
            const datePart = selectedDate ? selectedDate.toISOString().slice(5, 10).replace('-', '') : '0000';
            const randomPart = Math.floor(100 + Math.random() * 900);
            setBookingId(`ALU-${datePart}-${randomPart}`);
        }
    }, [bookingConfirmed, selectedDate]);

    // --- Helper Functions ---
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return `${daysOfWeek[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const isPastDate = (day, month, year) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(year, month, day);
        return checkDate < today;
    };

    const getSpecialDateStatus = (day, month, year) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    };

    const isCollectionDay = (day, month, year) => {
        if (isPastDate(day, month, year)) return false;
        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) return specialDate.status === 'available';
        const date = new Date(year, month, day);
        return settings.availableDays[date.getDay()];
    };


    // --- Action Handlers (Passed down as props) ---
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setBookingStep(1);
    };

    const handleTimeSelect = (id) => setTimeSlot(id);
    const handleAreaSelect = (id) => setServiceArea(id);
    const handleMaterialSelect = (id) => setMaterialType(id);

    const handleDetailsChange = (field, value) => {
        if (field === 'estimatedWeight') setEstimatedWeight(value);
        else if (field === 'pickupLocation') setPickupLocation(value);
        else setContactDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmBooking = () => {
        console.log("Booking Confirmed Data:", { selectedDate, timeSlot, serviceArea, materialType, estimatedWeight, pickupLocation, contactDetails });
        // TODO: API call here
        setBookingConfirmed(true);
        // Optional: Keep step 5 to show confirmation, or advance to a different "final" step if needed
        // setBookingStep(6); // Example if you wanted a final step beyond confirmation display
    };

    const handleResetForm = () => {
        setSelectedDate(null);
        setTimeSlot(null);
        setServiceArea(null);
        setMaterialType(null);
        setEstimatedWeight("");
        setPickupLocation("");
        setContactDetails({ name: "", phone: "", email: "" });
        setBookingStep(0);
        setBookingConfirmed(false);
        setBookingId("");
        // Note: CalendarStep manages its own `currentDate`, so no need to reset here unless you lift it up too
    };

    const nextStep = () => setBookingStep(prev => prev + 1);
    const prevStep = () => setBookingStep(prev => prev - 1);

    // --- Render Logic ---
    const renderCurrentStep = () => {
        switch (bookingStep) {
            case 0:
                return <CalendarStep
                            onDateSelect={handleDateSelect}
                            selectedDate={selectedDate}
                            isCollectionDay={isCollectionDay} // Pass helper functions needed by step
                            isPastDate={isPastDate}
                            getSpecialDateStatus={getSpecialDateStatus}
                            monthNames={monthNames}
                            daysOfWeek={daysOfWeek}
                       />;
            case 1:
                return <TimeSlotStep
                            selectedDate={selectedDate}
                            selectedTimeSlot={timeSlot}
                            activeTimeSlots={activeTimeSlots}
                            onTimeSelect={handleTimeSelect}
                            onNextStep={nextStep}
                            onPrevStep={prevStep}
                            formatDate={formatDate}
                        />;
            case 2:
                return <ServiceAreaStep
                            selectedDate={selectedDate}
                            selectedTimeSlotData={getSelectedTimeSlotData}
                            selectedServiceArea={serviceArea}
                            activeServiceAreas={activeServiceAreas}
                            onAreaSelect={handleAreaSelect}
                            onNextStep={nextStep}
                            onPrevStep={prevStep}
                            formatDate={formatDate}
                        />;
            case 3:
                return <MaterialStep
                            selectedDate={selectedDate}
                            selectedTimeSlotData={getSelectedTimeSlotData}
                            selectedServiceAreaData={getSelectedServiceAreaData}
                            selectedMaterial={materialType}
                            materialTypesData={materialTypesData}
                            onMaterialSelect={handleMaterialSelect}
                            onNextStep={nextStep}
                            onPrevStep={prevStep}
                            formatDate={formatDate}
                        />;
            case 4:
                return <DetailsStep
                            selectedDate={selectedDate}
                            selectedTimeSlotData={getSelectedTimeSlotData}
                            selectedServiceAreaData={getSelectedServiceAreaData}
                            selectedMaterialData={getSelectedMaterialData}
                            pickupLocation={pickupLocation}
                            estimatedWeight={estimatedWeight}
                            contactDetails={contactDetails}
                            onDetailsChange={handleDetailsChange}
                            onNextStep={nextStep}
                            onPrevStep={prevStep}
                            formatDate={formatDate}
                        />;
            case 5:
                return bookingConfirmed ? (
                    <ConfirmationStep
                        bookingId={bookingId}
                        selectedDate={selectedDate}
                        selectedTimeSlotData={getSelectedTimeSlotData}
                        selectedServiceAreaData={getSelectedServiceAreaData}
                        selectedMaterialData={getSelectedMaterialData}
                        pickupLocation={pickupLocation}
                        estimatedWeight={estimatedWeight}
                        contactDetails={contactDetails}
                        onResetForm={handleResetForm}
                        formatDate={formatDate}
                    />
                ) : (
                    <ReviewStep
                        selectedDate={selectedDate}
                        selectedTimeSlotData={getSelectedTimeSlotData}
                        selectedServiceAreaData={getSelectedServiceAreaData}
                        selectedMaterialData={getSelectedMaterialData}
                        pickupLocation={pickupLocation}
                        estimatedWeight={estimatedWeight}
                        contactDetails={contactDetails}
                        onConfirmBooking={handleConfirmBooking}
                        onPrevStep={prevStep}
                        formatDate={formatDate}
                    />
                );
            default:
                return null;
        }
    };

    const progressSteps = ['Date', 'Time', 'Area', 'Material', 'Details', 'Confirm'];

    return (
        <div className="user-calendar-wrapper">
            <div className="user-calendar-container">
                {/* Header */}
                <div className="user-header">
                    <div className="header-icon-container">
                        <Recycle size={28} className="header-icon" />
                    </div>
                    <h1>Schedule Aluminum Recycling Pickup</h1>
                </div>

                {/* Progress Bar */}
                {bookingStep > 0 && !bookingConfirmed && (
                    <div className="booking-progress">
                        <div className="progress-bar">
                            <div className="progress-steps">
                                {progressSteps.map((label, index) => (
                                    <div key={label} className={`progress-step ${bookingStep === index ? 'active' : ''} ${bookingStep > index ? 'completed' : ''}`}>
                                        <div className="step-circle">
                                            {bookingStep > index ? <CheckCircle size={16} /> : index + 1}
                                        </div>
                                        <span className="step-label">{label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${Math.max(0, bookingStep) * (100 / (progressSteps.length -1))}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area - Renders the current step component */}
                <div className="booking-content">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;