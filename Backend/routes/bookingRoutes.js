const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getMyBookings, 
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingsController');
const { protect, authorize, checkOwnershipOrAdmin } = require('../middleware/authMiddleware'); 

router.post('/', protect, createBooking);

router.get('/', protect, authorize('admin'), getAllBookings);

router.get('/my-bookings', protect, getMyBookings);

router.get('/:id', protect, getBookingById);

router.put('/:id/status', protect, authorize('admin', 'client'), updateBookingStatus);

router.put('/:id', protect, authorize('admin'), updateBooking);

router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;