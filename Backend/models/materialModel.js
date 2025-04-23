// models/materialModel.js
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    id: { // User-friendly identifier, e.g., 'cans', 'extrusions'
        type: String,
        required: [true, 'Material ID is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    name: { // Display name, e.g., "Aluminum Cans"
        type: String,
        required: [true, 'Material name is required'],
        trim: true
    },
    rate: { // Price per unit, e.g., "$1.21/kg"
        type: String,
        required: [true, 'Material rate is required']
    },
    description: { // Short description
        type: String,
        trim: true
    },
    icon: { // Emoji or icon identifier from frontend
        type: String
    },
    active: { // Controls if this material is offered
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;