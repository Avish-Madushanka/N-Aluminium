const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Contact name is required.'] },
    phone: { type: String, required: [true, 'Contact phone is required.'] },
    email: { type: String, required: [true, 'Contact email is required.'] }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel', 
    },
    userModel: { 
        type: String,
        enum: ['Client', 'BusinessOwner', 'Admin', null], 
    },
    bookingId: { 
        type: String,
        unique: true,
        required: [true, 'Booking ID is required and should be auto-generated.'], 
    },
    selectedDate: {
        type: Date, 
        required: [true, 'Pickup date is required.']
    },
    timeSlotId: { 
        type: String,
        required: [true, 'Time slot ID is required.']
    },
    serviceAreaId: { 
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
    adminNotes: String 
}, {
    timestamps: true
});

bookingSchema.pre('validate', async function(next) {

    if (this.isNew && !this.bookingId) {
        let unique = false;
        let attempts = 0;
        const MaxAttempts = 10;

        console.log('[Booking Model Pre-Validate] Attempting to generate bookingId...');

        while (!unique && attempts < MaxAttempts) {
            attempts++;
            const shortId = `BK-${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
            
            try {
                const existing = await mongoose.model('Booking').findOne({ bookingId: shortId }).lean(); 
                if (!existing) {
                    this.bookingId = shortId;
                    unique = true;
                    console.log(`[Booking Model Pre-Validate] Generated unique bookingId: ${this.bookingId} on attempt ${attempts}`);
                } else {
                    console.log(`[Booking Model Pre-Validate] bookingId ${shortId} already exists (attempt ${attempts}). Retrying...`);
                }
            } catch (error) {
                console.error(`[Booking Model Pre-Validate] Error checking bookingId uniqueness (attempt ${attempts}):`, error);

            }
        }

        if (!unique) {
            console.error(`[Booking Model Pre-Validate] Failed to generate unique booking ID after ${MaxAttempts} attempts.`);
            const err = new mongoose.Error.ValidatorError({
                message: `Failed to generate unique booking ID after ${MaxAttempts} attempts. Please try submitting again.`,
                path: 'bookingId',
                type: 'unique',   
                value: this.bookingId 
            });
            return next(err); 
        }
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);