// backend/models/Booking.js
const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Contact name is required.'] },
    phone: { type: String, required: [true, 'Contact phone is required.'] },
    email: { type: String, required: [true, 'Contact email is required.'] }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    userId: { // Optional: Link to the user who made the booking
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel', // Used with userModel to dynamically ref Client or BusinessOwner
    },
    userModel: { // Specifies which model userId refers to
        type: String,
        enum: ['Client', 'BusinessOwner', 'Admin', null], // null if booked by guest/unauth user
    },
    bookingId: { // User-friendly short ID
        type: String,
        unique: true,
        required: [true, 'Booking ID is required and should be auto-generated.'], // Keep required
    },
    selectedDate: {
        type: Date, // Store as full ISODate
        required: [true, 'Pickup date is required.']
    },
    timeSlotId: { // ID of the selected time slot (from CalendarSettings)
        type: String,
        required: [true, 'Time slot ID is required.']
    },
    serviceAreaId: { // ID of the selected service area (from CalendarSettings)
        type: String,
        required: [true, 'Service area ID is required.']
    },
    estimatedWeight: {
        type: Number,
        min: 0
    },
    pickupLocation: {
        type: String,
        required: [true, 'Pickup location is required.']
    },
    contactDetails: {
        type: contactDetailsSchema,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    adminNotes: String // For admin to add notes
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Pre-VALIDATE hook to generate a short, unique bookingId
// This runs BEFORE the 'required' validation for bookingId
bookingSchema.pre('validate', async function(next) {
    // Only generate if it's a new document and bookingId is not already set
    // (though it shouldn't be set manually if this hook is the sole generator)
    if (this.isNew && !this.bookingId) {
        let unique = false;
        let attempts = 0;
        const MaxAttempts = 10; // Define max attempts

        console.log('[Booking Model Pre-Validate] Attempting to generate bookingId...');

        while (!unique && attempts < MaxAttempts) {
            attempts++;
            // Generate a candidate ID
            const shortId = `BK-${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
            
            try {
                // Check if this ID already exists in the database
                const existing = await mongoose.model('Booking').findOne({ bookingId: shortId }).lean(); // .lean() for performance
                if (!existing) {
                    this.bookingId = shortId;
                    unique = true;
                    console.log(`[Booking Model Pre-Validate] Generated unique bookingId: ${this.bookingId} on attempt ${attempts}`);
                } else {
                    console.log(`[Booking Model Pre-Validate] bookingId ${shortId} already exists (attempt ${attempts}). Retrying...`);
                }
            } catch (error) {
                console.error(`[Booking Model Pre-Validate] Error checking bookingId uniqueness (attempt ${attempts}):`, error);
                // Decide if you want to retry or fail immediately on DB error
                // For now, let it retry up to MaxAttempts
            }
        }

        if (!unique) {
            console.error(`[Booking Model Pre-Validate] Failed to generate unique booking ID after ${MaxAttempts} attempts.`);
            // Create a validation error that Mongoose will understand
            const err = new mongoose.Error.ValidatorError({
                message: `Failed to generate unique booking ID after ${MaxAttempts} attempts. Please try submitting again.`,
                path: 'bookingId', // The path that failed
                type: 'unique',    // A custom type or 'user defined'
                value: this.bookingId // The value that failed validation (which would be undefined or the last attempted non-unique one)
            });
            return next(err); // Pass the Mongoose-compatible error to next()
        }
    }
    next(); // Proceed to next middleware/validation
});

module.exports = mongoose.model('Booking', bookingSchema);