import React, { useState, useMemo } from 'react'; // Removed useEffect
import {
  Calendar, Clock, MapPin, Package, Weight, Loader2,
  Search, Filter, MoreHorizontal, RefreshCw, ChevronDown, ChevronUp, XCircle,
  Calendar as CalendarIcon, CheckSquare, Clock as ClockIcon, Info, CheckCircle, User
} from 'lucide-react';
import "./PickupReq.css"; // Make sure this CSS file exists and is correctly styled

// --- MOCK DATA (Many Examples) ---
const mockBookingsData = [
  // Completed
  {
    bookingId: "BK1001",
    userId: "user123",
    selectedDate: "2024-04-15T10:00:00.000Z",
    createdAt: "2024-04-10T08:30:00.000Z",
    statusUpdatedAt: "2024-04-16T11:00:00.000Z",
    timeSlot: { id: "ts_morning", time: "8:00 AM - 12:00 PM", label: "Morning", active: true },
    serviceArea: { id: "sa_north", name: "North Side", active: true },
    materialType: { id: "mat_cans", name: "Aluminum Cans", rate: "$0.50/kg", description: "Clean, empty cans", icon: "🥫", active: true },
    estimatedWeight: 5.2,
    pickupLocation: "123 Maple Street, Northville, NV 12345",
    contactDetails: { name: "Alice Smith", phone: "555-111-2222", email: "alice.s@email.com" },
    status: "completed",
    notes: "Please leave by the blue bin.",
    completionDetails: { actualWeight: 5.5, paymentAmount: 2.75, completedAt: "2024-04-16T10:45:00.000Z" }
  },
  {
    bookingId: "BK1002",
    userId: "user123",
    selectedDate: "2024-04-28T14:00:00.000Z",
    createdAt: "2024-04-20T11:00:00.000Z",
    statusUpdatedAt: "2024-04-29T15:30:00.000Z",
    timeSlot: { id: "ts_afternoon", time: "1:00 PM - 5:00 PM", label: "Afternoon", active: true },
    serviceArea: { id: "sa_south", name: "South Side", active: true },
    materialType: { id: "mat_sheets", name: "Aluminum Sheets", rate: "$0.80/kg", description: "Flat sheets, siding", icon: "📄", active: true },
    estimatedWeight: 15.0,
    pickupLocation: "456 Oak Avenue, Southtown, ST 67890",
    contactDetails: { name: "Bob Johnson", phone: "555-333-4444", email: "bob.j@email.com" },
    status: "completed",
    completionDetails: { actualWeight: 14.8, paymentAmount: 11.84, completedAt: "2024-04-29T14:55:00.000Z" }
  },
   {
    bookingId: "BK1007",
    userId: "user123",
    selectedDate: "2024-05-10T09:00:00.000Z",
    createdAt: "2024-05-05T14:00:00.000Z",
    statusUpdatedAt: "2024-05-11T10:15:00.000Z",
    timeSlot: { id: "ts_morning", time: "8:00 AM - 12:00 PM", label: "Morning", active: true },
    serviceArea: { id: "sa_east", name: "East Side", active: true },
    materialType: { id: "mat_extrusions", name: "Aluminum Extrusions", rate: "$1.10/kg", description: "Window frames, door frames", icon: "🖼️", active: true },
    estimatedWeight: 25.5,
    pickupLocation: "789 Pine Road, Eastgate, EG 54321",
    contactDetails: { name: "Charlie Brown", phone: "555-555-6666", email: "charlie.b@email.com" },
    status: "completed",
    notes: "Large quantity, might need bigger truck.",
    completionDetails: { actualWeight: 26.1, paymentAmount: 28.71, completedAt: "2024-05-11T09:55:00.000Z" }
  },
  // Confirmed
  {
    bookingId: "BK1003",
    userId: "user123",
    selectedDate: "2024-05-25T10:00:00.000Z", // Future date
    createdAt: "2024-05-18T09:00:00.000Z",
    statusUpdatedAt: "2024-05-19T16:00:00.000Z",
    timeSlot: { id: "ts_morning", time: "8:00 AM - 12:00 PM", label: "Morning", active: true },
    serviceArea: { id: "sa_west", name: "West Side", active: true },
    materialType: { id: "mat_foil", name: "Aluminum Foil/Trays", rate: "$0.30/kg", description: "Clean foil, food trays", icon: "✨", active: true },
    estimatedWeight: 2.0,
    pickupLocation: "321 Cedar Lane, Westview, WV 11223",
    contactDetails: { name: "Diana Prince", phone: "555-777-8888", email: "diana.p@email.com" },
    status: "confirmed",
  },
   {
    bookingId: "BK1008",
    userId: "user123",
    selectedDate: "2024-06-05T14:30:00.000Z", // Future date
    createdAt: "2024-05-28T10:00:00.000Z",
    statusUpdatedAt: "2024-05-29T09:15:00.000Z",
    timeSlot: { id: "ts_afternoon", time: "1:00 PM - 5:00 PM", label: "Afternoon", active: true },
    serviceArea: { id: "sa_north", name: "North Side", active: true },
    materialType: { id: "mat_wires", name: "Aluminum Wires", rate: "$1.00/kg", description: "Insulated or bare wires", icon: "🔌", active: true },
    estimatedWeight: 7.5,
    pickupLocation: "987 Birch Street, Northville, NV 12345",
    contactDetails: { name: "Edward Nygma", phone: "555-999-0000", email: "edward.n@email.com" },
    status: "confirmed",
    notes: "Call upon arrival.",
  },
  // Pending
  {
    bookingId: "BK1004",
    userId: "user123",
    selectedDate: "2024-06-10T11:00:00.000Z", // Future date
    createdAt: "2024-06-01T15:20:00.000Z",
    statusUpdatedAt: "2024-06-01T15:20:00.000Z", // Same as created
    timeSlot: { id: "ts_midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
    serviceArea: { id: "sa_downtown", name: "Downtown", active: true },
    materialType: { id: "mat_cast", name: "Cast Aluminum", rate: "$0.70/kg", description: "Engine parts, cookware", icon: "🍳", active: true },
    estimatedWeight: 12.0,
    pickupLocation: "654 Plaza Court, Downtown, DT 99887",
    contactDetails: { name: "Fiona Glenanne", phone: "555-121-1212", email: "fiona.g@email.com" },
    status: "pending",
  },
   {
    bookingId: "BK1009",
    userId: "user123",
    selectedDate: "2024-06-15T08:30:00.000Z", // Future date
    createdAt: "2024-06-08T11:45:00.000Z",
    statusUpdatedAt: "2024-06-08T11:45:00.000Z", // Same as created
    timeSlot: { id: "ts_morning", time: "8:00 AM - 12:00 PM", label: "Morning", active: true },
    serviceArea: { id: "sa_south", name: "South Side", active: true },
    materialType: { id: "mat_mixed", name: "Mixed Aluminum", rate: "$0.60/kg", description: "Unsorted aluminum items", icon: "❓", active: true },
    estimatedWeight: 8.0,
    pickupLocation: "111 River Bend, Southtown, ST 67890",
    contactDetails: { name: "George Costanza", phone: "555-232-2323", email: "george.c@email.com" },
    status: "pending",
    notes: "Items are in the backyard shed."
  },
  // Cancelled
  {
    bookingId: "BK1005",
    userId: "user123",
    selectedDate: "2024-05-05T13:00:00.000Z",
    createdAt: "2024-04-25T10:00:00.000Z",
    statusUpdatedAt: "2024-05-01T12:00:00.000Z", // Cancellation date
    timeSlot: { id: "ts_afternoon", time: "1:00 PM - 5:00 PM", label: "Afternoon", active: true },
    serviceArea: { id: "sa_east", name: "East Side", active: true },
    materialType: { id: "mat_cans", name: "Aluminum Cans", rate: "$0.50/kg", description: "Clean, empty cans", icon: "🥫", active: true },
    estimatedWeight: 3.5,
    pickupLocation: "222 Willow Way, Eastgate, EG 54321",
    contactDetails: { name: "Hank Hill", phone: "555-343-3434", email: "hank.h@email.com" },
    status: "cancelled",
  },
   {
    bookingId: "BK1006",
    userId: "user123",
    selectedDate: "2024-03-20T16:00:00.000Z",
    createdAt: "2024-03-15T13:00:00.000Z",
    statusUpdatedAt: "2024-03-18T09:00:00.000Z", // Cancellation date
    timeSlot: { id: "ts_evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: false }, // Example inactive slot
    serviceArea: { id: "sa_west", name: "West Side", active: true },
    materialType: { id: "mat_sheets", name: "Aluminum Sheets", rate: "$0.80/kg", description: "Flat sheets, siding", icon: "📄", active: true },
    estimatedWeight: 9.0,
    pickupLocation: "444 Redwood Path, Westview, WV 11223",
    contactDetails: { name: "Iris West", phone: "555-454-4545", email: "iris.w@email.com" },
    status: "cancelled",
  },
];
// --- END MOCK DATA ---


// Status badges with their respective colors and icons
const STATUS_BADGES = {
  'pending': { color: 'badge-pending', icon: <Clock size={14} />, label: 'Pending' },
  'confirmed': { color: 'badge-confirmed', icon: <CheckCircle size={14} />, label: 'Confirmed' },
  'completed': { color: 'badge-completed', icon: <CheckSquare size={14} />, label: 'Completed' },
  'cancelled': { color: 'badge-cancelled', icon: <XCircle size={14} />, label: 'Cancelled' },
};

// Helper Functions (Keep these)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Example format: Tue, Apr 15, 2024
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatWeight = (weightValue) => {
  if (weightValue === null || weightValue === undefined || isNaN(parseFloat(weightValue))) return "N/A";
  const weight = parseFloat(weightValue);
  if (weight < 0) return "Invalid";
  return `${weight.toFixed(1)} kg`;
};

const PickupReq = () => {
  // Main state - Initialize with mock data
  const [bookings, setBookings] = useState(mockBookingsData);
  const [isLoading, setIsLoading] = useState(false); // No loading needed for mock data
  const [error, setError] = useState(null);         // Keep for potential future use
  const [detailView, setDetailView] = useState(null);

  // Filtering and pagination state (Keep these)
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page


  // NO useEffect for fetching data needed

  // Apply filters and sorting using useMemo for efficiency
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Status filter
      if (filters.status !== 'all' && booking.status !== filters.status) {
        return false;
      }

      // Date range filter
      const bookingDate = new Date(booking.selectedDate);
      bookingDate.setHours(0, 0, 0, 0); // Normalize booking date to start of day

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0); // Normalize fromDate
        if (bookingDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // Normalize toDate to end of day
        if (bookingDate > toDate) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          booking.bookingId?.toLowerCase().includes(searchLower) ||
          booking.contactDetails?.name?.toLowerCase().includes(searchLower) ||
          booking.pickupLocation?.toLowerCase().includes(searchLower) ||
          booking.materialType?.name?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    }).sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.selectedDate) - new Date(b.selectedDate);
        case 'date-desc':
          return new Date(b.selectedDate) - new Date(a.selectedDate);
        case 'status':
          // Simple alphabetical sort by status label
          return (STATUS_BADGES[a.status]?.label || '').localeCompare(STATUS_BADGES[b.status]?.label || '');
        default:
          return new Date(b.selectedDate) - new Date(a.selectedDate); // Default: newest first
      }
    });
  }, [bookings, filters, sortBy]); // Recalculate when these change

  // Calculate pagination based on filtered data
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    return filteredBookings.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [filteredBookings, page, itemsPerPage]); // Recalculate when these change


  // Handle filter changes (Keep this)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // View booking details (Keep this)
  const openDetailView = (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    setDetailView(booking);
  };

  // Close detail view (Keep this)
  const closeDetailView = () => {
    setDetailView(null);
  };

  // Handle status change - FRONTEND ONLY simulation
  const handleStatusChange = (bookingId, newStatus) => {
    if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    console.log(`Simulating status change for ${bookingId} to ${newStatus}`);

    // Update state directly - NO API CALL
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.bookingId === bookingId
          ? { ...booking, status: newStatus, statusUpdatedAt: new Date().toISOString() } // Update status and timestamp
          : booking
      )
    );

    // If we're in detail view, update that too
    if (detailView && detailView.bookingId === bookingId) {
      setDetailView(prev => ({ ...prev, status: newStatus, statusUpdatedAt: new Date().toISOString() }));
    }
  };

  // Refresh bookings - Now just resets view, no fetch
  const refreshBookings = () => {
    console.log("Simulating refresh (no actual fetch)");
    setIsLoading(true); // Optional: brief visual feedback
    setError(null);
    // Reset filters/pagination if desired
    // setFilters({ status: 'all', dateFrom: '', dateTo: '', searchTerm: '' });
    // setSortBy('date-desc');
    // setPage(1);
    setTimeout(() => setIsLoading(false), 300); // Short delay for effect
  };

  // Render the status badge (Keep this)
  const renderStatusBadge = (status) => {
    const statusInfo = STATUS_BADGES[status] || STATUS_BADGES.pending; // Default to pending if unknown
    return (
      <span className={`status-badge ${statusInfo.color}`}>
        {statusInfo.icon}
        <span>{statusInfo.label}</span>
      </span>
    );
  };

  // Render each booking card (Keep this)
  const renderBookingCard = (booking) => {
    return (
      <div key={booking.bookingId} className="booking-card">
        <div className="booking-card-header">
          <h3 className="booking-id">#{booking.bookingId}</h3>
          {renderStatusBadge(booking.status)}
        </div>

        <div className="booking-card-content">
          <div className="booking-info">
            <p className="date-time">
              <CalendarIcon size={14} />
              {formatDate(booking.selectedDate)}
              <span className="separator">|</span>
              <ClockIcon size={14} />
              {booking.timeSlot?.time || 'N/A'} {/* Use timeSlot object */}
            </p>

            <p className="material-info">
              <Package size={14} />
              {booking.materialType?.name || 'Unknown Material'} {/* Use materialType object */}
              <span className="separator">|</span>
              <Weight size={14} />
              {formatWeight(booking.estimatedWeight)}
            </p>

            <p className="address">
              <MapPin size={14} />
              {booking.pickupLocation || 'No address provided'}
            </p>
          </div>

          <div className="booking-actions">
            <button
              className="view-details-btn"
              onClick={() => openDetailView(booking.bookingId)}
            >
              View Details
            </button>

            {/* Allow cancellation only for pending or confirmed */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <div className="dropdown">
                <button className="dropdown-btn" aria-label="More actions">
                  <MoreHorizontal size={16} />
                </button>
                <div className="dropdown-content">
                  <button onClick={() => handleStatusChange(booking.bookingId, 'cancelled')}>
                    Cancel Booking
                  </button>
                   {/* Add reschedule later if needed */}
                   {/* <button>Reschedule</button>  */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render no bookings message (Keep this)
  const renderNoBookings = () => {
    // If there are bookings originally but none match the filters
    if (mockBookingsData.length > 0 && filteredBookings.length === 0) {
      return (
        <div className="no-bookings-message">
          <Filter size={24} /> {/* Changed icon */}
          <h3>No bookings match your filters</h3>
          <p>Try adjusting your search or date range.</p>
          <button
            className="reset-filters-btn"
            onClick={() => {
              setFilters({ status: 'all', dateFrom: '', dateTo: '', searchTerm: '' });
              setSortBy('date-desc');
              setPage(1);
            }}
          >
            Reset All Filters
          </button>
        </div>
      );
    }

    // If there are no bookings at all in the mock data
    return (
      <div className="no-bookings-message">
        <CalendarIcon size={32} />
        <h3>No Bookings Found</h3>
        <p>You haven't made any recycling pickup bookings yet.</p>
         {/* Link to the page where users schedule pickups */}
        <a href="/UserCalendar" className="new-booking-btn">Schedule Your First Pickup</a>
      </div>
    );
  };

  // Render the detailed view modal (Keep this)
  const renderDetailView = () => {
    if (!detailView) return null;

    return (
      <div className="booking-detail-modal">
        <div className="modal-overlay" onClick={closeDetailView}></div>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Booking Details</h2>
            <button className="close-modal" onClick={closeDetailView} aria-label="Close detail view">
              <XCircle size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-header">
              <div className="booking-title">
                <h3>Booking #{detailView.bookingId}</h3>
                {renderStatusBadge(detailView.status)}
              </div>

              {(detailView.status === 'pending' || detailView.status === 'confirmed') && (
                <div className="detail-actions">
                  <button
                    className="cancel-booking-btn"
                    onClick={() => {
                      handleStatusChange(detailView.bookingId, 'cancelled');
                      closeDetailView(); // Close modal after action
                    }}
                  >
                    Cancel Booking
                  </button>
                  {/* Add Reschedule button if needed */}
                  {/* <button className="reschedule-booking-btn">Reschedule</button> */}
                </div>
              )}
            </div>

            <div className="detail-sections">
              {/* Pickup Details Section */}
              <div className="detail-section">
                <h4><CalendarIcon size={16} /> Pickup Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(detailView.selectedDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time Slot:</span>
                  <span className="detail-value">{detailView.timeSlot?.time || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Service Area:</span>
                  <span className="detail-value">{detailView.serviceArea?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{detailView.pickupLocation || 'N/A'}</span>
                </div>
              </div>

              {/* Material Details Section */}
              <div className="detail-section">
                <h4><Package size={16} /> Material Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Material Type:</span>
                  <span className="detail-value">{detailView.materialType?.name || 'N/A'}</span>
                </div>
                 <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{detailView.materialType?.description || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estimated Weight:</span>
                  <span className="detail-value">{formatWeight(detailView.estimatedWeight)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Est. Rate:</span>
                  <span className="detail-value">{detailView.materialType?.rate || 'N/A'}</span>
                </div>
                {detailView.notes && (
                  <div className="detail-item notes-item"> {/* Added class for potential styling */}
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value notes-value">{detailView.notes}</span>
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="detail-section">
                <h4><User size={16} /> Contact Information</h4>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{detailView.contactDetails?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{detailView.contactDetails?.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{detailView.contactDetails?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Completion Details Section (Only if Completed) */}
              {detailView.status === 'completed' && detailView.completionDetails && (
                <div className="detail-section completion-section"> {/* Added class */}
                  <h4><CheckSquare size={16} /> Completion Details</h4>
                  <div className="detail-item">
                    <span className="detail-label">Actual Weight:</span>
                    <span className="detail-value">
                      {formatWeight(detailView.completionDetails.actualWeight)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Completed On:</span>
                    <span className="detail-value">
                       {/* Format completion date/time */}
                      {new Date(detailView.completionDetails.completedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  {detailView.completionDetails.paymentAmount !== undefined && ( // Check if payment amount exists
                    <div className="detail-item">
                      <span className="detail-label">Payment:</span>
                      <span className="detail-value payment-value"> {/* Added class */}
                        ${parseFloat(detailView.completionDetails.paymentAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking Timeline (Simplified Frontend Version) */}
            <div className="booking-timeline">
              <h4>Booking Timeline</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon completed"> {/* Assuming creation is always 'completed' step */}
                    <CheckCircle size={14} />
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-date">
                       {new Date(detailView.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <p className="timeline-text">Booking Created</p>
                  </div>
                </div>

                {/* Show current status update */}
                {(detailView.status !== 'pending' || detailView.createdAt !== detailView.statusUpdatedAt) && ( // Show if status changed or time is different
                   <div className="timeline-item">
                    <div className={`timeline-icon ${detailView.status}`}>
                      {STATUS_BADGES[detailView.status]?.icon || <Info size={14} />} {/* Use status icon */}
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-date">
                         {new Date(detailView.statusUpdatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <p className="timeline-text">
                        Booking {STATUS_BADGES[detailView.status]?.label || detailView.status}
                      </p>
                    </div>
                  </div>
                )}
                {/* Add more timeline items manually or based on mock data if needed */}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="close-detail-btn" onClick={closeDetailView}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Component Return ---
  return (
    <div className="user-bookings-container">
      <div className="user-bookings-header">
        <h1>My Recycling Pickups</h1>
        <button className="refresh-btn" onClick={refreshBookings} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

       {/* Keep error display for potential future use or form validation errors */}
      {error && (
        <div className="error-message">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Container (Keep this) */}
      <div className="filter-container">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID, name, location, material..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            aria-label="Search bookings"
          />
          {filters.searchTerm && (
            <button
              className="clear-search"
              onClick={() => handleFilterChange('searchTerm', '')}
              aria-label="Clear search"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>

        <div className="filters">
          {/* Status Filter */}
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All</option>
              {Object.keys(STATUS_BADGES).map(statusKey => (
                 <option key={statusKey} value={statusKey}>{STATUS_BADGES[statusKey].label}</option>
              ))}
            </select>
          </div>

          {/* Date Filters */}
          <div className="filter-group">
            <label htmlFor="date-from">From:</label>
            <input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              aria-label="Filter start date"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="date-to">To:</label>
            <input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              aria-label="Filter end date"
            />
          </div>

          {/* Sort By Filter */}
          <div className="filter-group">
            <label htmlFor="sort-by">Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List Area */}
      <div className="bookings-list">
        {isLoading ? (
          <div className="loading-spinner">
            <Loader2 size={32} className="animate-spin" />
            <p>Loading...</p>
          </div>
        ) : paginatedBookings.length > 0 ? (
          <>
            {/* Render the list of booking cards */}
            {paginatedBookings.map(renderBookingCard)}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          // Render message if no bookings match filters or no bookings exist
          renderNoBookings()
        )}
      </div>

      {/* Detail view modal render */}
      {renderDetailView()}
    </div>
  );
};

export default PickupReq;