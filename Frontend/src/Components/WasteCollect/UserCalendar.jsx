import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Recycle, Clock, MapPin, Truck,
    CheckCircle, AlertTriangle, Info, User, Phone, Mail, Weight, Loader2, Plus, FileText, Download, Eye, X
} from 'lucide-react';
import './UserCalendar.css';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

const formatWeight = (weightValue) => {
    if (!weightValue || isNaN(parseFloat(weightValue))) return "N/A";
    const weight = parseFloat(weightValue);
    if (weight < 0) return "Invalid";
    return `${weight.toFixed(1)} kg`;
};

const UserCalendar = ({ userInfo }) => {
    const [backendSettings, setBackendSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlot, setTimeSlot] = useState(null);
    const [serviceArea, setServiceArea] = useState(null);
    const [estimatedWeight, setEstimatedWeight] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [contactDetails, setContactDetails] = useState({
        name: userInfo?.name || userInfo?.fullName || "",
        phone: userInfo?.phone || userInfo?.contactNumber || "",
        email: userInfo?.email || ""
    });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [userBookings, setUserBookings] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [selectedBookingForBill, setSelectedBookingForBill] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);

    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
    const monthNames = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

    useEffect(() => {
        const storedDate = sessionStorage.getItem('selectedPickupDate');
        if (storedDate) {
            const parsedDate = new Date(storedDate);
            if (!isNaN(parsedDate.getTime())) {
                setSelectedDate(parsedDate);
                setCurrentDate(parsedDate);
            }
            sessionStorage.removeItem('selectedPickupDate');
        }
    }, []);

    const fallbackSettings = useMemo(() => ({
        availableDays: new Map([['0', false], ['1', false], ['2', false], ['3', false], ['4', false], ['5', false], ['6', false]]),
        timeSlots: [
            { id: "ts-1", label: "Morning", time: "8:00 AM - 12:00 PM", active: true },
            { id: "ts-2", label: "Afternoon", time: "1:00 PM - 5:00 PM", active: true }
        ],
        serviceAreas: [
            { id: "sa-1", name: "Downtown", active: true },
            { id: "sa-2", name: "Westside", active: true },
            { id: "sa-3", name: "Eastside", active: true }
        ],
        specialDates: [],
        dateSettings: new Map()
    }), []);

    useEffect(() => {
        fetchCalendarSettings();
        if (userInfo?.email || contactDetails.email) {
            fetchUserBookings();
        }
    }, []);

    const fetchCalendarSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CALENDAR_SETTINGS.GET);
            if (response.data && response.data.success && response.data.data) {
                const fetched = response.data.data;
                const apiAvailableDaysObject = (fetched.availableDays && Object.keys(fetched.availableDays).length > 0)
                    ? fetched.availableDays
                    : Object.fromEntries(fallbackSettings.availableDays);
                const apiDateSettingsObject = fetched.dateSettings || {};

                setBackendSettings({
                    ...fallbackSettings,
                    ...fetched,
                    availableDays: new Map(Object.entries(apiAvailableDaysObject)),
                    dateSettings: new Map(Object.entries(apiDateSettingsObject)),
                    timeSlots: fetched.timeSlots && fetched.timeSlots.length > 0 ? fetched.timeSlots : fallbackSettings.timeSlots,
                    serviceAreas: fetched.serviceAreas && fetched.serviceAreas.length > 0 ? fetched.serviceAreas : fallbackSettings.serviceAreas,
                    specialDates: fetched.specialDates || fallbackSettings.specialDates,
                });
            } else {
                setBackendSettings(fallbackSettings);
            }
        } catch (err) {
            console.error("Error fetching calendar settings:", err);
            setBackendSettings(fallbackSettings);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserBookings = async () => {
        setLoadingBookings(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUserBookings([]);
                setLoadingBookings(false);
                return;
            }
            
            const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_MY_BOOKINGS);
            if (response.data && response.data.success) {
                setUserBookings(response.data.data || []);
            } else {
                setUserBookings([]);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setUserBookings([]);
        } finally {
            setLoadingBookings(false);
        }
    };

    const settings = useMemo(() => {
        if (!backendSettings) return fallbackSettings;
        return {
            ...fallbackSettings,
            ...backendSettings,
            availableDays: backendSettings.availableDays instanceof Map ? backendSettings.availableDays : new Map(Object.entries(backendSettings.availableDays || {})),
            dateSettings: backendSettings.dateSettings instanceof Map ? backendSettings.dateSettings : new Map(Object.entries(backendSettings.dateSettings || {})),
            timeSlots: backendSettings.timeSlots || [],
            serviceAreas: backendSettings.serviceAreas || [],
            specialDates: backendSettings.specialDates || [],
        };
    }, [backendSettings, fallbackSettings]);

    const getMonthData = useCallback((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { year, month, startingDayOfWeek, daysInMonth };
    }, []);

    const goToPrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const isPastDate = useCallback((day, month, year) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(year, month, day) < today;
    }, []);

    const getSpecialDateStatus = useCallback((day, month, year) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return settings.specialDates.find(d => d.date === dateStr);
    }, [settings.specialDates]);

    const isCollectionDay = useCallback((day, month, year) => {
        if (isPastDate(day, month, year)) return false;
        const specialDate = getSpecialDateStatus(day, month, year);
        if (specialDate) return specialDate.status === 'available';
        const dayOfWeek = new Date(year, month, day).getDay().toString();
        return settings.availableDays.get(dayOfWeek) === true;
    }, [isPastDate, getSpecialDateStatus, settings.availableDays]);

    const handleDateSelect = (day, month, year) => {
        if (!isCollectionDay(day, month, year)) return;
        setSelectedDate(new Date(year, month, day));
        setTimeSlot(null);
        setServiceArea(null);
        setEstimatedWeight("");
        setPickupLocation("");
        setError(null);
        setValidationErrors({});
    };

    const formatDisplayDate = useCallback((date) => {
        if (!date) return 'N/A';
        return `${daysOfWeek[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }, [daysOfWeek, monthNames]);

    const resetForm = useCallback(() => {
        setSelectedDate(null);
        setTimeSlot(null);
        setServiceArea(null);
        setEstimatedWeight("");
        setPickupLocation("");
        setContactDetails({
            name: userInfo?.name || userInfo?.fullName || "",
            phone: userInfo?.phone || userInfo?.contactNumber || "",
            email: userInfo?.email || ""
        });
        setBookingConfirmed(false);
        setBookingData(null);
        setCurrentDate(new Date());
        setError(null);
        setIsSubmitting(false);
        setValidationErrors({});
    }, [userInfo]);

    const validateForm = () => {
        const errors = {};
        
        if (!pickupLocation.trim()) {
            errors.pickupLocation = "Pickup address is required";
        }
        
        if (!contactDetails.name.trim()) {
            errors.name = "Full name is required";
        }
        
        if (!contactDetails.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(contactDetails.phone.trim())) {
            errors.phone = "Please enter a valid 10-digit phone number";
        }
        
        if (!contactDetails.email.trim()) {
            errors.email = "Email address is required";
        } else if (!/^\S+@\S+\.\S+$/.test(contactDetails.email.trim())) {
            errors.email = "Please enter a valid email address";
        }
        
        if (estimatedWeight && (isNaN(parseFloat(estimatedWeight)) || parseFloat(estimatedWeight) < 0)) {
            errors.weight = "Please enter a valid weight";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const confirmBooking = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setError(null);

        const selectedDateObj = selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null;
        const selectedTimeSlotObj = settings.timeSlots.find(slot => slot.id === timeSlot);
        const selectedServiceAreaObj = settings.serviceAreas.find(area => area.id === serviceArea);

        const bookingRequestData = {
            selectedDate: selectedDateObj ? selectedDateObj.toISOString() : null,
            timeSlotId: timeSlot,
            serviceAreaId: serviceArea,
            estimatedWeight: estimatedWeight ? parseFloat(estimatedWeight) : null,
            pickupLocation: pickupLocation,
            contactDetails: contactDetails
        };

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingRequestData);

            if (response.data && response.data.success) {
                const newBooking = response.data.data;
                setBookingData(newBooking);
                setBookingConfirmed(true);
                fetchUserBookings();
            } else {
                throw new Error(response.data?.message || 'Booking request failed.');
            }
        } catch (err) {
            console.error("Booking submission error:", err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred during booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPDF = (booking) => {
        const printWindow = window.open('', '_blank');
        const selectedTimeSlotObj = settings.timeSlots.find(slot => slot.id === booking.timeSlotId);
        const selectedServiceAreaObj = settings.serviceAreas.find(area => area.id === booking.serviceAreaId);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>ALUX Booking Bill - ${booking.bookingId || booking._id}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
                    .bill-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; }
                    .bill-header { background: linear-gradient(135deg, #094b1d 0%, #0f7fa1 100%); color: white; padding: 30px; text-align: center; }
                    .bill-header h1 { margin: 0; font-size: 28px; }
                    .bill-header p { margin: 5px 0 0; opacity: 0.9; }
                    .bill-body { padding: 30px; }
                    .bill-title { text-align: center; margin-bottom: 30px; }
                    .bill-title h2 { margin: 0; color: #094b1d; }
                    .info-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
                    .info-box { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                    .info-box h4 { margin: 0 0 10px; color: #094b1d; }
                    .info-box p { margin: 5px 0; color: #555; }
                    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .details-table td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
                    .details-table td:first-child { font-weight: bold; width: 40%; background: #f8f9fa; }
                    .bill-footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                    @media print { body { background: white; padding: 0; } .bill-container { box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="bill-container">
                    <div class="bill-header">
                        <h1>ALUX Recycling</h1>
                        <p>Alubomulla, Panadura, Sri Lanka</p>
                    </div>
                    <div class="bill-body">
                        <div class="bill-title">
                            <h2>BOOKING CONFIRMATION</h2>
                        </div>
                        <div class="info-section">
                            <div class="info-box">
                                <h4>Booking Information</h4>
                                <p><strong>Booking ID:</strong> ${booking.bookingId || booking._id}</p>
                                <p><strong>Status:</strong> ${booking.status || 'Pending'}</p>
                                <p><strong>Date:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div class="info-box">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> ${booking.contactDetails?.name || booking.userName}</p>
                                <p><strong>Phone:</strong> ${booking.contactDetails?.phone || booking.userPhone}</p>
                                <p><strong>Email:</strong> ${booking.contactDetails?.email || booking.userEmail}</p>
                            </div>
                        </div>
                        <table class="details-table">
                            <tr><th colspan="2">Booking Details</th></tr>
                            <tr><td>Pickup Date</td><td>${booking.selectedDate ? new Date(booking.selectedDate).toLocaleDateString() : 'N/A'}</td></tr>
                            <tr><td>Time Slot</td><td>${selectedTimeSlotObj?.label || booking.timeSlotId || 'N/A'}</td></tr>
                            <tr><td>Service Area</td><td>${selectedServiceAreaObj?.name || booking.serviceAreaId || 'N/A'}</td></tr>
                            <tr><td>Pickup Location</td><td>${booking.pickupLocation || 'N/A'}</td></tr>
                            <tr><td>Estimated Weight</td><td>${booking.estimatedWeight ? `${booking.estimatedWeight} kg` : 'N/A'}</td></tr>
                            <tr><td>Booking Created</td><td>${new Date(booking.createdAt).toLocaleString()}</td></tr>
                        </table>
                    </div>
                    <div class="bill-footer">
                        <p>Thank you for choosing ALUX Recycling!</p>
                        <p>For inquiries, call +94 72 104 6048 | Email: donotreply.ALUX@gmail.com</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const renderCalendar = useCallback(() => {
        const { year, month, startingDayOfWeek, daysInMonth } = getMonthData(currentDate);
        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="UCal-calendar-day UCal-empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
            const isAvailable = isCollectionDay(day, month, year);
            const isPast = isPastDate(day, month, year);
            const specialDate = getSpecialDateStatus(day, month, year);

            let dayClass = 'UCal-calendar-day';
            if (isPast) dayClass += ' UCal-past';
            else if (isAvailable) dayClass += ' UCal-available';
            else dayClass += ' UCal-unavailable';
            if (isSelected) dayClass += ' UCal-selected';

            calendarDays.push(
                <button key={`day-${day}`} className={dayClass} onClick={() => handleDateSelect(day, month, year)} disabled={isPast || !isAvailable}>
                    <span className="UCal-day-number">{day}</span>
                    {specialDate && <span className="UCal-special-indicator" title={specialDate.reason || 'Special Day'}>*</span>}
                </button>
            );
        }
        return calendarDays;
    }, [currentDate, getMonthData, selectedDate, isCollectionDay, isPastDate, getSpecialDateStatus, handleDateSelect]);

    const renderSummaryItem = (IconComponent, label, value) => {
        if (label === "Est. Weight") value = formatWeight(value);
        if (!value || value === "N/A" || value === "Invalid") return null;
        return (
            <p className="UCal-summary-item">
                <IconComponent size={14} />
                <strong>{label}:</strong> {value}
            </p>
        );
    };

    const timeSlotsForSelectedDate = useMemo(() => {
        if (!selectedDate || !settings.timeSlots || settings.timeSlots.length === 0) return [];
        const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const dateSpecificConfig = settings.dateSettings.get(dateStr);

        if (dateSpecificConfig && dateSpecificConfig.timeSlots && dateSpecificConfig.timeSlots.length > 0) {
            return settings.timeSlots.filter(slot => slot.active && dateSpecificConfig.timeSlots.includes(slot.id));
        }

        if (isCollectionDay(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear())) {
            return settings.timeSlots.filter(slot => slot.active);
        }
        return [];
    }, [selectedDate, settings.timeSlots, settings.dateSettings, isCollectionDay]);

    const serviceAreasForSelectedDate = useMemo(() => {
        if (!selectedDate || !settings.serviceAreas || settings.serviceAreas.length === 0) return [];
        const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const dateSpecificConfig = settings.dateSettings.get(dateStr);

        if (dateSpecificConfig && dateSpecificConfig.serviceAreas && dateSpecificConfig.serviceAreas.length > 0) {
            return settings.serviceAreas.filter(area => area.active && dateSpecificConfig.serviceAreas.includes(area.id));
        }

        if (isCollectionDay(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear())) {
            return settings.serviceAreas.filter(area => area.active);
        }
        return [];
    }, [selectedDate, settings.serviceAreas, settings.dateSettings, isCollectionDay]);

    const selectedTimeSlotObj = settings.timeSlots.find(slot => slot.id === timeSlot);
    const selectedServiceAreaObj = settings.serviceAreas.find(area => area.id === serviceArea);

    const getStatusClass = (status) => {
        switch(status) {
            case 'pending': return 'UCal-status-pending';
            case 'confirmed': return 'UCal-status-confirmed';
            case 'completed': return 'UCal-status-completed';
            case 'cancelled': return 'UCal-status-cancelled';
            default: return 'UCal-status-pending';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending': return 'Pending Approval';
            case 'confirmed': return 'Confirmed';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return 'Pending';
        }
    };

    return (
        <div className="UCal-user-calendar-wrapper">
            <div className="UCal-user-calendar-container">
                <div className="UCal-user-header">
                    <h1>Schedule Aluminum Recycling Pickup</h1>
                    <button className="UCal-orders-button" onClick={() => { fetchUserBookings(); setShowOrdersModal(true); }}>
                        <FileText size={18} />
                        My Scrap Orders
                        {userBookings.filter(b => b.status === 'pending').length > 0 && (
                            <span className="UCal-orders-badge">{userBookings.filter(b => b.status === 'pending').length}</span>
                        )}
                    </button>
                </div>

                {isLoading && !backendSettings && (
                    <div className="UCal-loading-overlay">
                        <Loader2 size={40} className="UCal-animate-spin" />
                        <p>Loading Schedule...</p>
                    </div>
                )}

                {!bookingConfirmed ? (
                    <div className="UCal-three-column-layout">
                        <div className="UCal-calendar-column">
                            <div className="UCal-calendar-header">
                                <button onClick={goToPrevMonth} className="UCal-nav-button"><ChevronLeft size={18} /></button>
                                <h2 className="UCal-current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                                <button onClick={goToNextMonth} className="UCal-nav-button"><ChevronRight size={18} /></button>
                            </div>
                            <div className="UCal-weekday-header">
                                {daysOfWeek.map(day => <div key={day} className="UCal-weekday">{day}</div>)}
                            </div>
                            <div className="UCal-calendar-grid">
                                {isLoading ? <div className="UCal-loading-calendar-days"><Loader2 size={28} className="UCal-animate-spin" /></div> : renderCalendar()}
                            </div>
                            <div className="UCal-calendar-legend">
                                <span className="UCal-legend-item UCal-available">Available</span>
                                <span className="UCal-legend-item UCal-selected">Selected</span>
                                <span className="UCal-legend-item UCal-unavailable">Unavailable</span>
                                <span className="UCal-legend-item UCal-past">Past</span>
                            </div>
                            <div className="UCal-calendar-instructions">
                                <Info size={12} /> Select an available collection day to schedule pickup
                            </div>
                        </div>

                        <div className="UCal-details-column">
                            {selectedDate ? (
                                <>
                                    <div className="UCal-selected-date-header">
                                        <Calendar size={18} />
                                        <h3>{formatDisplayDate(selectedDate)}</h3>
                                    </div>

                                    <div className="UCal-form-group">
                                        <label><Clock size={14} /> Pickup Time Slot *</label>
                                        <div className="UCal-options-grid">
                                            {timeSlotsForSelectedDate.map(slot => (
                                                <button key={slot.id} className={`UCal-option-card ${timeSlot === slot.id ? 'UCal-selected' : ''}`} onClick={() => setTimeSlot(slot.id)}>
                                                    <Clock size={14} />
                                                    <span>{slot.label}</span>
                                                    <small>{slot.time}</small>
                                                </button>
                                            ))}
                                        </div>
                                        {timeSlotsForSelectedDate.length === 0 && <p className="UCal-info-message">No time slots available</p>}
                                    </div>

                                    <div className="UCal-form-group">
                                        <label><MapPin size={14} /> Service Area *</label>
                                        <div className="UCal-options-grid">
                                            {serviceAreasForSelectedDate.map(area => (
                                                <button key={area.id} className={`UCal-option-card ${serviceArea === area.id ? 'UCal-selected' : ''}`} onClick={() => setServiceArea(area.id)}>
                                                    <MapPin size={14} />
                                                    <span>{area.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {serviceAreasForSelectedDate.length === 0 && <p className="UCal-info-message">No service areas available</p>}
                                    </div>

                                    {timeSlot && serviceArea && (
                                        <>
                                            <div className="UCal-form-group">
                                                <label><Truck size={14} /> Pickup Address *</label>
                                                <input type="text" placeholder="Full address including street, city" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className={`UCal-input ${validationErrors.pickupLocation ? 'UCal-input-error' : ''}`} />
                                                {validationErrors.pickupLocation && <p className="UCal-error-text">{validationErrors.pickupLocation}</p>}
                                            </div>

                                            <div className="UCal-form-group">
                                                <label><Weight size={14} /> Estimated Weight (kg)</label>
                                                <input type="number" placeholder="Optional" value={estimatedWeight} onChange={(e) => setEstimatedWeight(e.target.value)} className={`UCal-input ${validationErrors.weight ? 'UCal-input-error' : ''}`} step="0.1" min="0" />
                                                {validationErrors.weight && <p className="UCal-error-text">{validationErrors.weight}</p>}
                                            </div>

                                            <div className="UCal-form-group">
                                                <label><User size={14} /> Contact Information *</label>
                                                <input type="text" placeholder="Full name" value={contactDetails.name} onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})} className={`UCal-input ${validationErrors.name ? 'UCal-input-error' : ''}`} style={{marginBottom: '8px'}} />
                                                {validationErrors.name && <p className="UCal-error-text">{validationErrors.name}</p>}
                                                
                                                <input type="tel" placeholder="Phone number (10 digits)" value={contactDetails.phone} onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})} className={`UCal-input ${validationErrors.phone ? 'UCal-input-error' : ''}`} style={{marginBottom: '8px'}} />
                                                {validationErrors.phone && <p className="UCal-error-text">{validationErrors.phone}</p>}
                                                
                                                <input type="email" placeholder="Email address" value={contactDetails.email} onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})} className={`UCal-input ${validationErrors.email ? 'UCal-input-error' : ''}`} />
                                                {validationErrors.email && <p className="UCal-error-text">{validationErrors.email}</p>}
                                            </div>

                                            {error && <div className="UCal-error-message"><AlertTriangle size={12} /> {error}</div>}

                                            <button onClick={confirmBooking} disabled={isSubmitting} className="UCal-submit-button">
                                                {isSubmitting ? <Loader2 size={16} className="UCal-animate-spin" /> : <CheckCircle size={16} />}
                                                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="UCal-placeholder">
                                    <Calendar size={48} />
                                    <p>Select a date from the calendar</p>
                                    <small>Available days are highlighted in green</small>
                                </div>
                            )}
                        </div>

                        <div className="UCal-summary-column">
                            {selectedDate && timeSlot && serviceArea && (
                                <div className="UCal-summary-box">
                                    <h4>Booking Summary</h4>
                                    {renderSummaryItem(Calendar, "Date", formatDisplayDate(selectedDate))}
                                    {renderSummaryItem(Clock, "Time", selectedTimeSlotObj?.label)}
                                    {renderSummaryItem(MapPin, "Area", selectedServiceAreaObj?.name)}
                                    {renderSummaryItem(Truck, "Address", pickupLocation)}
                                    {renderSummaryItem(Weight, "Est. Weight", estimatedWeight)}
                                    <div className="UCal-summary-divider"></div>
                                    <h4>Contact Details</h4>
                                    {renderSummaryItem(User, "Name", contactDetails.name)}
                                    {renderSummaryItem(Phone, "Phone", contactDetails.phone)}
                                    {renderSummaryItem(Mail, "Email", contactDetails.email)}
                                </div>
                            )}
                            {!selectedDate && (
                                <div className="UCal-summary-placeholder">
                                    <Recycle size={48} />
                                    <p>Your booking summary will appear here</p>
                                    <small>After selecting date and filling details</small>
                                </div>
                            )}
                            {selectedDate && (!timeSlot || !serviceArea) && (
                                <div className="UCal-summary-placeholder">
                                    <Clock size={32} />
                                    <p>Complete time slot and service area selection</p>
                                    <small>To see your booking summary</small>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="UCal-confirmation-panel" id="bill-content">
                        <div className="UCal-bill-header">
                            <h1>ALUX Recycling</h1>
                            <p>Alubomulla, Panadura, Sri Lanka</p>
                        </div>
                        <div className="UCal-bill-body">
                            <div className="UCal-bill-title">
                                <h2>BOOKING CONFIRMATION</h2>
                            </div>
                            <div className="UCal-bill-info-section">
                                <div className="UCal-bill-info-box">
                                    <h4>Booking Information</h4>
                                    <p><strong>Booking ID:</strong> {bookingData?.bookingId || bookingData?._id}</p>
                                    <p><strong>Status:</strong> <span className="UCal-status-pending">Pending Approval</span></p>
                                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="UCal-bill-info-box">
                                    <h4>Customer Information</h4>
                                    <p><strong>Name:</strong> {contactDetails.name}</p>
                                    <p><strong>Phone:</strong> {contactDetails.phone}</p>
                                    <p><strong>Email:</strong> {contactDetails.email}</p>
                                </div>
                            </div>
                            <table className="UCal-bill-details-table">
                                <tbody>
                                    <tr><th colSpan="2">Booking Details</th></tr>
                                    <tr><td>Pickup Date</td><td>{formatDisplayDate(selectedDate)}</td></tr>
                                    <tr><td>Time Slot</td><td>{selectedTimeSlotObj?.label} ({selectedTimeSlotObj?.time})</td></tr>
                                    <tr><td>Service Area</td><td>{selectedServiceAreaObj?.name}</td></tr>
                                    <tr><td>Pickup Location</td><td>{pickupLocation}</td></tr>
                                    <tr><td>Estimated Weight</td><td>{estimatedWeight ? `${estimatedWeight} kg` : 'N/A'}</td></tr>
                                    <tr><td>Booking Created</td><td>{new Date().toLocaleString()}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="UCal-bill-footer">
                            <p>Thank you for choosing ALUX Recycling!</p>
                            <p>For inquiries, call +94 72 104 6048 | Email: donotreply.ALUX@gmail.com</p>
                        </div>
                        <div className="UCal-bill-actions">
                            <button onClick={() => downloadPDF(bookingData)} className="UCal-download-btn"><Download size={16} /> Download Bill (PDF)</button>
                            <button onClick={resetForm} className="UCal-new-booking-button"><Plus size={14} /> Schedule Another Pickup</button>
                        </div>
                    </div>
                )}

                {showOrdersModal && (
                    <div className="UCal-modal-overlay" onClick={() => setShowOrdersModal(false)}>
                        <div className="UCal-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="UCal-modal-header">
                                <h2><FileText size={20} /> My Scrap Orders</h2>
                                <button className="UCal-modal-close" onClick={() => setShowOrdersModal(false)}><X size={20} /></button>
                            </div>
                            <div className="UCal-modal-body">
                                {loadingBookings ? (
                                    <div className="UCal-loading-spinner"><Loader2 size={30} className="UCal-animate-spin" /></div>
                                ) : userBookings.length === 0 ? (
                                    <div className="UCal-no-bookings">
                                        <Recycle size={48} />
                                        <p>No scrap orders found</p>
                                        <small>Book your first pickup to see orders here</small>
                                    </div>
                                ) : (
                                    <div className="UCal-bookings-list">
                                        {userBookings.map((booking) => (
                                            <div key={booking._id} className="UCal-booking-card">
                                                <div className="UCal-booking-card-header">
                                                    <div>
                                                        <span className="UCal-booking-id-label">Booking ID:</span>
                                                        <span className="UCal-booking-id-value">{booking.bookingId || booking._id}</span>
                                                    </div>
                                                    <span className={`UCal-booking-status ${getStatusClass(booking.status)}`}>
                                                        {getStatusText(booking.status)}
                                                    </span>
                                                </div>
                                                <div className="UCal-booking-card-details">
                                                    <div className="UCal-booking-detail"><Calendar size={14} /><span>{booking.selectedDate ? new Date(booking.selectedDate).toLocaleDateString() : 'N/A'}</span></div>
                                                    <div className="UCal-booking-detail"><Clock size={14} /><span>{booking.timeSlotId || 'N/A'}</span></div>
                                                    <div className="UCal-booking-detail"><MapPin size={14} /><span>{booking.serviceAreaId || 'N/A'}</span></div>
                                                    <div className="UCal-booking-detail"><Weight size={14} /><span>{booking.estimatedWeight ? `${booking.estimatedWeight} kg` : 'N/A'}</span></div>
                                                </div>
                                                <div className="UCal-booking-card-footer">
                                                    <small>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</small>
                                                    <button className="UCal-view-bill-btn" onClick={() => { setSelectedBookingForBill(booking); setShowBillModal(true); setShowOrdersModal(false); }}>
                                                        <Eye size={14} /> View Bill
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showBillModal && selectedBookingForBill && (
                    <div className="UCal-modal-overlay" onClick={() => setShowBillModal(false)}>
                        <div className="UCal-modal-content UCal-bill-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="UCal-modal-header">
                                <h2><FileText size={20} /> Booking Bill</h2>
                                <button className="UCal-modal-close" onClick={() => setShowBillModal(false)}><X size={20} /></button>
                            </div>
                            <div className="UCal-modal-body UCal-bill-modal-body">
                                <div className="UCal-bill-container">
                                    <div className="UCal-bill-header">
                                        <h1>ALUX Recycling</h1>
                                        <p>Alubomulla, Panadura, Sri Lanka</p>
                                    </div>
                                    <div className="UCal-bill-body">
                                        <div className="UCal-bill-title"><h2>BOOKING CONFIRMATION</h2></div>
                                        <div className="UCal-bill-info-section">
                                            <div className="UCal-bill-info-box">
                                                <h4>Booking Information</h4>
                                                <p><strong>Booking ID:</strong> {selectedBookingForBill.bookingId || selectedBookingForBill._id}</p>
                                                <p><strong>Status:</strong> {selectedBookingForBill.status || 'Pending'}</p>
                                                <p><strong>Date:</strong> {new Date(selectedBookingForBill.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="UCal-bill-info-box">
                                                <h4>Customer Information</h4>
                                                <p><strong>Name:</strong> {selectedBookingForBill.contactDetails?.name || selectedBookingForBill.userName}</p>
                                                <p><strong>Phone:</strong> {selectedBookingForBill.contactDetails?.phone || selectedBookingForBill.userPhone}</p>
                                                <p><strong>Email:</strong> {selectedBookingForBill.contactDetails?.email || selectedBookingForBill.userEmail}</p>
                                            </div>
                                        </div>
                                        <table className="UCal-bill-details-table">
                                            <tbody>
                                                <tr><th colSpan="2">Booking Details</th></tr>
                                                <tr><td>Pickup Date</td><td>{selectedBookingForBill.selectedDate ? new Date(selectedBookingForBill.selectedDate).toLocaleDateString() : 'N/A'}</td></tr>
                                                <tr><td>Time Slot</td><td>{selectedBookingForBill.timeSlotId || 'N/A'}</td></tr>
                                                <tr><td>Service Area</td><td>{selectedBookingForBill.serviceAreaId || 'N/A'}</td></tr>
                                                <tr><td>Pickup Location</td><td>{selectedBookingForBill.pickupLocation || 'N/A'}</td></tr>
                                                <tr><td>Estimated Weight</td><td>{selectedBookingForBill.estimatedWeight ? `${selectedBookingForBill.estimatedWeight} kg` : 'N/A'}</td></tr>
                                                <tr><td>Booking Created</td><td>{new Date(selectedBookingForBill.createdAt).toLocaleString()}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="UCal-bill-footer">
                                        <p>Thank you for choosing ALUX Recycling!</p>
                                        <p>For inquiries, call +94 72 104 6048 | Email: donotreply.ALUX@gmail.com</p>
                                    </div>
                                </div>
                                <div className="UCal-bill-actions">
                                    <button onClick={() => downloadPDF(selectedBookingForBill)} className="UCal-download-btn"><Download size={16} /> Download PDF</button>
                                    <button onClick={() => setShowBillModal(false)} className="UCal-close-bill-btn"><X size={16} /> Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCalendar;