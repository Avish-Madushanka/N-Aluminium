// controllers/bookingController.js
const Booking = require('../models/bookingModel');
const mongoose = require('mongoose');

exports.createBooking = async (req, res, next) => {
    const {
        selectedDate, timeSlotId, serviceAreaId, materialTypeId,
        estimatedWeight, pickupLocation, contactDetails
    } = req.body;

    if (!selectedDate || !timeSlotId || !serviceAreaId || !materialTypeId || !pickupLocation || !contactDetails?.name || !contactDetails?.phone || !contactDetails?.email) {
        return res.status(400).json({ success: false, message: 'Missing required booking information or contact details.' });
    }

    try {
        const newBookingData = {
            selectedDate: new Date(selectedDate),
            timeSlotId, serviceAreaId, materialTypeId,
            estimatedWeight: (estimatedWeight && !isNaN(parseFloat(estimatedWeight))) ? Number(estimatedWeight) : undefined,
            pickupLocation,
            contactDetails: { name: contactDetails.name, phone: contactDetails.phone, email: contactDetails.email },
        };
        const newBooking = new Booking(newBookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed successfully!', data: savedBooking });
    } catch (error) {
        console.error("--- Create Booking Error ---", error);
        next(error);
    }
};

exports.getBookingById = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
             return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
         console.error(`Get Booking Error (ID: ${req.params.id}):`, error);
         if (error instanceof mongoose.Error.CastError) { // Should be caught by isValid
             return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
         }
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find(req.query)
                                       .sort({ status: 1, selectedDate: -1, createdAt: -1 });
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        console.error("Get All Bookings Error:", error);
        next(error);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    const { status } = req.body;
    const bookingId = req.params.id;
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
         return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
     }
    if (!status || !allowedStatuses.includes(status?.toLowerCase())) {
        return res.status(400).json({ success: false, message: `Invalid status provided. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: status.toLowerCase() },
            { new: true, runValidators: true, context: 'query' }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking status updated.', data: booking });
    } catch (error) {
         console.error(`Update Booking Status Error (ID: ${bookingId}):`, error);
         // Handle specific errors like validation if needed
         next(error);
    }
};

exports.updateBookingDetails = async (req, res, next) => {
    const bookingId = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
         return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
     }

    console.log(`[BACKEND] updateBookingDetails triggered for ID: ${bookingId}`);
    console.log("[BACKEND] Received Request Body:", JSON.stringify(req.body, null, 2));

    const allowedUpdates = [
        'selectedDate', 'timeSlotId', 'serviceAreaId', 'materialTypeId',
        'estimatedWeight', 'pickupLocation', 'contactDetails', 'status'
    ];
    const updates = {};
    let hasInvalidDate = false;

    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) { // Check if field exists in request
            if (field === 'contactDetails') {
                if (typeof req.body.contactDetails === 'object' && req.body.contactDetails !== null) {
                    updates.contactDetails = {}; // Initialize only if we receive an object
                    if (req.body.contactDetails.name !== undefined) updates.contactDetails.name = req.body.contactDetails.name;
                    if (req.body.contactDetails.phone !== undefined) updates.contactDetails.phone = req.body.contactDetails.phone;
                    if (req.body.contactDetails.email !== undefined) updates.contactDetails.email = req.body.contactDetails.email;
                    // Don't add empty contactDetails object if no subfields were present/valid
                    if (Object.keys(updates.contactDetails).length === 0) {
                       delete updates.contactDetails;
                    }
                } else {
                     console.warn(`Received non-object for contactDetails update: ${req.body.contactDetails}`);
                }
            } else if (field === 'selectedDate') {
                try {
                    const date = new Date(req.body.selectedDate);
                    if (!isNaN(date.getTime())) {
                        updates.selectedDate = date;
                    } else {
                        console.warn(`Invalid date format received for update: ${req.body.selectedDate}`);
                        hasInvalidDate = true;
                    }
                } catch(e) {
                    console.warn(`Error parsing date for update: ${req.body.selectedDate}`);
                    hasInvalidDate = true;
                }
            } else if (field === 'estimatedWeight') {
                const weight = req.body.estimatedWeight;
                if (weight === null || weight === '' || weight === undefined) {
                    updates.estimatedWeight = undefined;
                } else if (!isNaN(parseFloat(weight)) && parseFloat(weight) >= 0) {
                    updates.estimatedWeight = Number(weight);
                } else {
                    console.warn(`Invalid estimatedWeight received: ${weight}`);
                    // Optionally reject the update if weight is invalid but provided
                    // return res.status(400).json({ success: false, message: 'Invalid format for estimated weight.' });
                }
            } else if (field === 'status') {
                 const status = req.body[field]?.toLowerCase();
                 const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
                 if (allowedStatuses.includes(status)) {
                     updates.status = status;
                 } else {
                      console.warn(`Invalid status received in general update: ${req.body[field]}`);
                 }
            } else {
                updates[field] = req.body[field]; // Assign other allowed fields directly
            }
        }
    });

    if (hasInvalidDate) {
        return res.status(400).json({ success: false, message: 'Invalid date format provided for selectedDate.' });
    }

    console.log("[BACKEND] Filtered Updates:", JSON.stringify(updates, null, 2));

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    try {
        console.log(`[BACKEND] Attempting findByIdAndUpdate for ID: ${bookingId}`);
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: updates },
            { new: true, runValidators: true, context: 'query' }
        );

        if (!updatedBooking) {
            console.log(`[BACKEND] Booking not found for ID: ${bookingId}`);
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        console.log(`[BACKEND] Booking ${bookingId} updated successfully.`);
        res.status(200).json({ success: true, message: 'Booking updated successfully.', data: updatedBooking });

    } catch (error) {
        console.error(`[BACKEND] Update Booking Details Error (ID: ${bookingId}):`, error);
        next(error); // Let global error handler format specific errors
    }
};

exports.deleteBooking = async (req, res, next) => {
     const bookingId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
         return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
     }
     console.log(`[BACKEND] Attempting to delete booking ID: ${bookingId}`);
     try {
         const result = await Booking.findByIdAndDelete(bookingId);
         if (!result) {
              console.log(`[BACKEND] Booking not found for deletion: ${bookingId}`);
             return res.status(404).json({ success: false, message: 'Booking not found.' });
         }
          console.log(`[BACKEND] Booking ${bookingId} deleted successfully.`);
         res.status(200).json({ success: true, message: 'Booking deleted successfully.' });
     } catch (error) {
         console.error(`[BACKEND] Delete Booking Error (ID: ${bookingId}):`, error);
         next(error);
     }
 };