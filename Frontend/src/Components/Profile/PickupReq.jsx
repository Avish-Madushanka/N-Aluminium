import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, MapPin, Package, Weight, Loader2,
  Search, Filter, MoreHorizontal, RefreshCw, XCircle, AlertTriangle,
  Calendar as CalendarIcon, CheckSquare, Clock as ClockIcon, Info, CheckCircle, User
} from 'lucide-react';
import "./PickupReq.css"; // Make sure this CSS file exists and is correctly styled

import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import axiosInstance from '../../api/axiosInstance';   // Adjust path as needed
import API_ENDPOINTS from '../../apiConfig';      // Adjust path as needed

const STATUS_BADGES = {
  'pending': { color: 'badge-pending', icon: <Clock size={14} />, label: 'Pending' },
  'confirmed': { color: 'badge-confirmed', icon: <CheckCircle size={14} />, label: 'Confirmed' },
  'completed': { color: 'badge-completed', icon: <CheckSquare size={14} />, label: 'Completed' },
  'cancelled': { color: 'badge-cancelled', icon: <XCircle size={14} />, label: 'Cancelled' },
};

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
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
  if (weight < 0) return "Invalid"; // Should be caught by backend validation too
  return `${weight.toFixed(1)} kg`;
};

const PickupReq = () => {
  const { userInfo, isLoggedIn } = useAuth();

  // Main state
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailView, setDetailView] = useState(null);

  // Filtering and pagination state
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState('date-desc'); // Default sort
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

  const fetchMyBookings = useCallback(async () => {
    if (!isLoggedIn || !userInfo?.id) {
        setError("Please log in to view your bookings.");
        setIsLoading(false);
        setBookings([]);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_MY_BOOKINGS);
        if (response.data && response.data.success) {
            setBookings(response.data.data);
        } else {
            setError(response.data.message || "Failed to fetch bookings.");
            setBookings([]);
        }
    } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while fetching bookings.");
        setBookings([]);
    } finally {
        setIsLoading(false);
    }
  }, [isLoggedIn, userInfo?.id]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);


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
          (booking.timeSlotId && booking.timeSlotId.toLowerCase().includes(searchLower)) || // Search by timeSlotId string
          (booking.serviceAreaId && booking.serviceAreaId.toLowerCase().includes(searchLower)) // Search by serviceAreaId string
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


  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // View booking details
  const openDetailView = (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    setDetailView(booking);
  };

  // Close detail view
  const closeDetailView = () => {
    setDetailView(null);
  };

  // Handle status change (e.g., cancelling a booking)
  const handleStatusChange = async (bookingId, newStatus) => {
    if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsLoading(true); // Indicate an action is in progress
    try {
        // API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId) should resolve to `/bookings/:id/status`
        const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId), { status: newStatus });
        if (response.data && response.data.success) {
            // Successfully updated on backend, now update frontend state
            const updatedBookingFromServer = response.data.data;
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.bookingId === bookingId
                        ? updatedBookingFromServer // Replace with the fresh data from server
                        : booking
                )
            );
            // If this booking was in detail view, update that too
            if (detailView && detailView.bookingId === bookingId) {
                setDetailView(updatedBookingFromServer);
            }
        } else {
            setError(response.data.message || "Failed to update booking status.");
        }
    } catch (err) {
        console.error("Error updating booking status:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while updating status.");
    } finally {
        setIsLoading(false);
    }
  };


  const refreshBookings = () => {
    fetchMyBookings(); // Re-fetch all bookings for the user
  };

  // Render the status badge
  const renderStatusBadge = (status) => {
    const statusInfo = STATUS_BADGES[status] || STATUS_BADGES.pending; // Default to pending if unknown
    return (
      <span className={`status-badge ${statusInfo.color}`}>
        {statusInfo.icon}
        <span>{statusInfo.label}</span>
      </span>
    );
  };

  // Render each booking card
  const renderBookingCard = (booking) => {
    // Display IDs directly as backend sends string IDs for timeSlotId and serviceAreaId
    const timeSlotDisplay = booking.timeSlotId || 'N/A';
    const estimatedWeightDisplay = formatWeight(booking.estimatedWeight);
    const serviceAreaDisplay = booking.serviceAreaId || 'N/A';


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
              {timeSlotDisplay} {/* Display ID */}
            </p>

            <p className="material-info"> {/* Changed to reflect Service Area instead of Material Type */}
              <Package size={14} />
              Service Area: {serviceAreaDisplay} {/* Display ID */}
              <span className="separator">|</span>
              <Weight size={14} />
              {estimatedWeightDisplay}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNoBookings = () => {
    if (bookings.length > 0 && filteredBookings.length === 0) {
      return (
        <div className="no-bookings-message">
          <Filter size={24} />
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
    return (
      <div className="no-bookings-message">
        <CalendarIcon size={32} />
        <h3>No Bookings Found</h3>
        <p>You haven't made any recycling pickup bookings yet.</p>
        <a href="/UserCalendar" className="new-booking-btn">Schedule Your First Pickup</a>
      </div>
    );
  };

  // Render the detailed view modal
  const renderDetailView = () => {
    if (!detailView) return null;

    const timeSlotDisplay = detailView.timeSlotId || 'N/A';
    const serviceAreaDisplay = detailView.serviceAreaId || 'N/A';

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
                  <span className="detail-value">{timeSlotDisplay}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Service Area:</span>
                  <span className="detail-value">{serviceAreaDisplay}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{detailView.pickupLocation || 'N/A'}</span>
                </div>
              </div>

              {/* Item Details Section */}
              <div className="detail-section">
                <h4><Package size={16} /> Item Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Est. Weight:</span>
                  <span className="detail-value">{formatWeight(detailView.estimatedWeight)}</span>
                </div>
                {/* User-submitted notes are not part of Booking.js model currently, only adminNotes */}
                {/* If there were user notes:
                {detailView.userNotes && (
                  <div className="detail-item notes-item">
                    <span className="detail-label">Your Notes:</span>
                    <span className="detail-value notes-value">{detailView.userNotes}</span>
                  </div>
                )}
                */}
                {detailView.adminNotes && ( // Display admin notes if they exist
                  <div className="detail-item notes-item">
                    <span className="detail-label">Admin Notes:</span>
                    <span className="detail-value notes-value">{detailView.adminNotes}</span>
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

              {/* Completion Details Section (Only if Completed and data exists) */}
              {detailView.status === 'completed' && detailView.completionDetails && (
                <div className="detail-section completion-section">
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
                      {new Date(detailView.completionDetails.completedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  {detailView.completionDetails.paymentAmount !== undefined && (
                    <div className="detail-item">
                      <span className="detail-label">Payment:</span>
                      <span className="detail-value payment-value">
                        ${parseFloat(detailView.completionDetails.paymentAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking Timeline */}
            <div className="booking-timeline">
              <h4>Booking Timeline</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon completed">
                    <CheckCircle size={14} />
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-date">
                       {new Date(detailView.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <p className="timeline-text">Booking Created</p>
                  </div>
                </div>

                {(detailView.status !== 'pending' || detailView.createdAt !== detailView.updatedAt) && ( // Show if status changed or time is different from creation
                   <div className="timeline-item">
                    <div className={`timeline-icon ${detailView.status}`}>
                      {STATUS_BADGES[detailView.status]?.icon || <Info size={14} />}
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-date">
                         {new Date(detailView.updatedAt || detailView.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <p className="timeline-text">
                        Booking {STATUS_BADGES[detailView.status]?.label || detailView.status}
                      </p>
                    </div>
                  </div>
                )}
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

      {error && (
        <div className="error-message">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Container */}
      <div className="filter-container">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID, name, location..."
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
            <p>Loading your bookings...</p>
          </div>
        ) : paginatedBookings.length > 0 ? (
          <>
            {paginatedBookings.map(renderBookingCard)}
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
          renderNoBookings()
        )}
      </div>

      {renderDetailView()}
    </div>
  );
};

export default PickupReq;