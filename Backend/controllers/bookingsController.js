const Booking = require('../models/Booking');
const { sendBookingStatusUpdateEmail } = require('../utils/emailService');

const createBooking = async (req, res, next) => {
    try {
        const {
            selectedDate,
            timeSlotId,
            serviceAreaId,
            estimatedWeight,
            pickupLocation,
            contactDetails
        } = req.body;

        if (!selectedDate || !timeSlotId || !serviceAreaId || !pickupLocation || !contactDetails) {
            return res.status(400).json({ success: false, message: 'Missing required booking fields.' });
        }
        if (!contactDetails.name || !contactDetails.phone || !contactDetails.email) {
            return res.status(400).json({ success: false, message: 'Missing required contact details fields (name, phone, email).' });
        }

        const newBookingData = {
            selectedDate: new Date(selectedDate),
            timeSlotId,
            serviceAreaId,
            estimatedWeight: (estimatedWeight !== undefined && estimatedWeight !== null && estimatedWeight !== '') ? Number(estimatedWeight) : undefined,
            pickupLocation,
            contactDetails,
            status: 'pending',
        };

        if (req.user) {
            newBookingData.userId = req.user._id;
            newBookingData.userModel = req.user.constructor.modelName;
        }

        const booking = new Booking(newBookingData);
        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully.',
            data: booking
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(' ') });
        }
        next(error);
    }
};

const getAllBookings = async (req, res, next) => {
    try {
        let query = Booking.find({}); // Base query for all bookings

        // Sorting - for dashboard recent bookings: ?sort=-createdAt
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' '); // Example: 'field1,field2' -> 'field1 field2'
            query = query.sort(sortBy);
        } else {
            query = query.sort({ createdAt: -1 }); // Default sort: newest first
        }

        // Limiting - for dashboard recent bookings: ?limit=5
        const limit = parseInt(req.query.limit, 10);
        if (!isNaN(limit) && limit > 0) {
            query = query.limit(limit);
        }
        
        // Populate user details
        query = query.populate('userId', 'name email');

        const bookings = await query;

        // If you were implementing full pagination, you would also calculate total count here
        // const totalCount = await Booking.countDocuments({}); // Without limit

        res.status(200).json({
            success: true,
            // count: totalCount, // if paginating fully, send total
            count: bookings.length, // For limited queries, this is the count of returned items
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }

        const bookings = await Booking.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching my bookings:', error);
        next(error);
    }
};

const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('userId', 'name email');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        // Add a check if the user is not admin and doesn't own the booking
        if (req.user.role !== 'admin' && booking.userId && booking.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to view this booking.' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error(`Error fetching booking ${req.params.id}:`, error);
        next(error);
    }
};

const updateBookingStatus = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;
        const adminNotesFromRequest = req.body.adminNotes !== undefined ? req.body.adminNotes : null;

        if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status provided.' });
        }

        const bookingBeforeUpdate = await Booking.findById(bookingId);
        if (!bookingBeforeUpdate) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // Authorization checks
        if (req.user.role === 'client') {
            if (bookingBeforeUpdate.userId.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this booking.' });
            }
            if (status !== 'cancelled') {
                return res.status(403).json({ success: false, message: 'Clients can only cancel bookings.' });
            }
            if (!['pending', 'confirmed'].includes(bookingBeforeUpdate.status)) {
                return res.status(400).json({ success: false, message: `Bookings with status '${bookingBeforeUpdate.status}' cannot be cancelled by you at this stage.` });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You do not have permission to change booking status.' });
        }


        const oldStatus = bookingBeforeUpdate.status;
        const oldAdminNotes = bookingBeforeUpdate.adminNotes;

        const updateData = { status };

        if (req.user.role === 'admin') {
            if (adminNotesFromRequest !== null) {
                updateData.adminNotes = adminNotesFromRequest;
            } else if (status === 'cancelled' && adminNotesFromRequest === null && !oldAdminNotes) {
                 updateData.adminNotes = ''; 
            }
        }
        
        let notesChanged = false;
        if (req.user.role === 'admin' && adminNotesFromRequest !== null && oldAdminNotes !== adminNotesFromRequest) {
            notesChanged = true;
        } else if (req.user.role === 'admin' && status === 'cancelled' && adminNotesFromRequest === null && !oldAdminNotes && oldAdminNotes !== '') {
             if (oldAdminNotes !== undefined) notesChanged = true;
        }


        if (oldStatus === status && !notesChanged) {
             console.log(`[BookingsCtrl UpdateStatus] No change for booking ${bookingId}.`);
             return res.status(200).json({ success: true, message: 'No changes in status or notes.', data: bookingBeforeUpdate });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found during update.' });
        }
        console.log(`[BookingsCtrl UpdateStatus] Booking ${bookingId} status: ${oldStatus} -> ${updatedBooking.status}. Notes: "${updatedBooking.adminNotes}"`);

        if (updatedBooking.status !== oldStatus && (updatedBooking.status === 'confirmed' || updatedBooking.status === 'cancelled')) {
            console.log(`[BookingsCtrl UpdateStatus] Email for booking ${bookingId}, new status: ${updatedBooking.status}`);
            if (updatedBooking.userId && updatedBooking.contactDetails.email) { // Check if email is available
                 await sendBookingStatusUpdateEmail(updatedBooking, updatedBooking.status);
            } else {
                console.warn(`[BookingsCtrl UpdateStatus] Cannot send email for booking ${bookingId}: user or email missing.`);
            }
        }

        res.status(200).json({ success: true, message: 'Booking status updated.', data: updatedBooking });
    } catch (error) {
        console.error(`Error updating status for booking ${req.params.id}:`, error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(' ') });
        }
        next(error);
    }
};

const updateBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        
        const bookingBeforeUpdate = await Booking.findById(bookingId);
        if (!bookingBeforeUpdate) {
            return res.status(404).json({ success: false, message: 'Booking not found for update.' });
        }
        const oldStatus = bookingBeforeUpdate.status;

        const {
            selectedDate, timeSlotId, serviceAreaId, estimatedWeight,
            pickupLocation, contactDetails, status, adminNotes
        } = req.body;

        const updateFields = {};
        if (selectedDate !== undefined) updateFields.selectedDate = new Date(selectedDate);
        if (timeSlotId !== undefined) updateFields.timeSlotId = timeSlotId;
        if (serviceAreaId !== undefined) updateFields.serviceAreaId = serviceAreaId;
        if (estimatedWeight !== undefined) updateFields.estimatedWeight = (estimatedWeight === null || estimatedWeight === '') ? null : Number(estimatedWeight);
        if (pickupLocation !== undefined) updateFields.pickupLocation = pickupLocation;
        if (contactDetails !== undefined) {
            if (!contactDetails.name || !contactDetails.phone || !contactDetails.email) {
                 return res.status(400).json({ success: false, message: 'If updating contactDetails, all fields (name, phone, email) are required.' });
            }
            updateFields.contactDetails = contactDetails;
        }
        
        if (status !== undefined && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            updateFields.status = status;
        }
        
        if (adminNotes !== undefined) { 
            updateFields.adminNotes = adminNotes;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(200).json({ success: true, message: 'No valid fields for update.', data: bookingBeforeUpdate });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found after update attempt.' });
        }
        console.log(`[BookingsCtrl UpdateBooking] Booking ${bookingId} updated. Status: ${oldStatus} -> ${updatedBooking.status}. Notes: "${updatedBooking.adminNotes}"`);

        const finalStatus = updatedBooking.status;
        if (finalStatus !== oldStatus && (finalStatus === 'confirmed' || finalStatus === 'cancelled')) {
            console.log(`[BookingsCtrl UpdateBooking] Email for booking ${bookingId}, new status: ${finalStatus}`);
            if (updatedBooking.userId && updatedBooking.contactDetails.email) { // Check if email is available
                await sendBookingStatusUpdateEmail(updatedBooking, finalStatus);
            } else {
                console.warn(`[BookingsCtrl UpdateBooking] Cannot send email for booking ${bookingId}: user or email missing.`);
            }
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully.', data: updatedBooking });
    } catch (error) {
        console.error(`Error updating booking ${req.params.id}:`, error);
        if (error.name === 'CastError' && error.path === 'estimatedWeight') {
             return res.status(400).json({ success: false, message: `Invalid data format for field estimatedWeight. Must be a number.`});
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: `Invalid data format for field ${error.path}. Expected ${error.kind}.`});
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(' ') });
        }
        next(error);
    }
};

const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        res.status(200).json({ success: true, message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting booking ${req.params.id}:`, error);
        next(error);
    }
};

module.exports = {
    createBooking,
    getAllBookings, 
    getMyBookings,  
    getBookingById,
    updateBookingStatus,
    updateBooking,    
    deleteBooking     
};