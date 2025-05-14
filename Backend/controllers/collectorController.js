// backend/controllers/collectorController.js
const Collector = require('../models/Collector');
const asyncHandler = require('../utils/async'); // Assuming you have this utility
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have this utility

// @desc    Register a new collector
// @route   POST /api/collectors/register
// @access  Public (or Admin if only admins can register collectors)
exports.registerCollector = asyncHandler(async (req, res, next) => {
    const { name, email, primaryPhone, secondaryPhone, password, address } = req.body;

    // Basic Validation (Mongoose schema will also validate)
    if (!name || !email || !primaryPhone || !password || !address) {
        return next(new ErrorResponse('Please provide all required fields: name, email, primary phone, password, and address.', 400));
    }
    // Add more specific validation here if needed, e.g., password strength, phone format
    // Though Mongoose schema handles most of this.

    // Check if collector already exists
    const existingCollector = await Collector.findOne({ email });
    if (existingCollector) {
        return next(new ErrorResponse('Collector with this email already exists.', 400));
    }

    // Create collector
    const collector = await Collector.create({
        name,
        email,
        primaryPhone,
        secondaryPhone: secondaryPhone || null,
        password,
        address,
    });

    // Don't send password back in response
    const collectorResponse = collector.toObject();
    delete collectorResponse.password;

    // For now, we don't send a token on registration. Login is a separate step.
    res.status(201).json({
        success: true,
        message: 'Collector registered successfully. Account may require verification or activation by an admin.',
        data: collectorResponse
    });
});
