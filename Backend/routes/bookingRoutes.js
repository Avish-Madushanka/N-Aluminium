// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/bookings - User creates a booking
router.post('/', protect, createBooking); // Any authenticated user can create

// GET /api/bookings - Admin gets all bookings
router.get('/', protect, authorize('admin'), getAllBookings);

// GET /api/bookings/:id - Admin or owning user gets a single booking
router.get('/:id', protect, getBookingById); // Add authorize(checkOwnershipOrAdmin('Booking')) if needed

// PUT /api/bookings/:id/status - Admin updates status
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

// PUT /api/bookings/:id - Admin updates booking details
router.put('/:id', protect, authorize('admin'), updateBooking);

// DELETE /api/bookings/:id - Admin deletes a booking
router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;