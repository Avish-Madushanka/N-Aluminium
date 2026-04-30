const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    expertise: {
        type: String,
        required: [true, 'Expertise area is required'],
        enum: ['fabrication', 'scrap', 'marketplace']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'read', 'responded'],
        default: 'pending'
    },
    respondedAt: {
        type: Date
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

let Contact;
try {
    Contact = mongoose.model('Contact');
} catch (error) {
    Contact = mongoose.model('Contact', contactSchema);
}

module.exports = Contact;