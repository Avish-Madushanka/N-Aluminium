const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getMyBookings, // Added
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingsController');
const { protect, authorize, checkOwnershipOrAdmin } = require('../middleware/authMiddleware'); // Added checkOwnershipOrAdmin for getBookingById

// Create a new booking (any authenticated user)
router.post('/', protect, createBooking);

// Get all bookings (ADMIN ONLY)
router.get('/', protect, authorize('admin'), getAllBookings);

// Get logged-in user's bookings (CLIENT, BUSINESSOWNER, ADMIN for their own)
router.get('/my-bookings', protect, getMyBookings);

// Get a specific booking by ID (Admin can get any, Client/BOwner can get their own if checkOwnershipOrAdmin is applied)
// For now, keeping it simple: protect ensures logged in. Controller has logic to check ownership if not admin.
router.get('/:id', protect, getBookingById);

// Update booking status (Admin can update to any valid status, Client can only update to 'cancelled' for their own pending/confirmed bookings)
router.put('/:id/status', protect, authorize('admin', 'client'), updateBookingStatus);

// Update booking details (ADMIN ONLY for full update)
router.put('/:id', protect, authorize('admin'), updateBooking);

// Delete a booking (ADMIN ONLY)
router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;