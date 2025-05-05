// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const { protectClient } = require('../middleware/authMiddleware'); // Assuming clients create bookings

// POST /api/bookings - Create (Client/Public)
router.post('/', protectClient, bookingController.createBooking); // Protect if needed

// --- Admin Routes ---
// GET /api/bookings - Get All
router.get('/', protectAdmin, bookingController.getAllBookings);

// GET /api/bookings/:id - Get One
router.get('/:id', protectAdmin, bookingController.getBookingById);

// PUT /api/bookings/:id/status - Update Status Only
router.put('/:id/status', protectAdmin, bookingController.updateBookingStatus);

// PUT /api/bookings/:id - Update Details (General)
router.put('/:id', protectAdmin, bookingController.updateBookingDetails);

// DELETE /api/bookings/:id - Delete Booking
router.delete('/:id', protectAdmin, bookingController.deleteBooking);

module.exports = router;