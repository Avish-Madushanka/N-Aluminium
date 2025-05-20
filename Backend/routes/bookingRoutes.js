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

router.post('/', protect, createBooking); 

router.get('/', protect, authorize('admin'), getAllBookings);

router.get('/:id', protect, getBookingById);

router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

router.put('/:id', protect, authorize('admin'), updateBooking);

router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;