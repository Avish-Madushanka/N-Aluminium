// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// Optional: Import authentication/authorization middleware
// const { protectClient } = require('../middleware/authMiddleware');
// const { protectAdmin } = require('../middleware/adminMiddleware'); // Create this if you need admin roles

// POST /api/bookings - Create a new booking
// This is likely public, but could be protected by protectClient if users must log in
router.post('/', bookingController.createBooking);

// GET /api/bookings - Get all bookings (Requires Admin Auth)
// router.get('/', protectAdmin, bookingController.getAllBookings);

// GET /api/bookings/:id - Get a specific booking by DB _id or custom bookingId
// Add auth middleware as needed (e.g., protectAdmin or protectClient with ownership check)
// router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id/status - Update booking status (Requires Admin Auth)
// The :id can be the DB _id or custom bookingId (controller handles either)
// router.put('/:id/status', protectAdmin, bookingController.updateBookingStatus);


module.exports = router;