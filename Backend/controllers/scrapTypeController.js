// backend/controllers/scrapTypeController.js
const ScrapType = require('../models/ScrapType');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new scrap type
// @route   POST /api/scrap-types
// @access  Private (Admin)
exports.createScrapType = asyncHandler(async (req, res, next) => {
    const { name, price, unit, description, isActive } = req.body;

    if (!name || price === undefined) {
        return next(new ErrorResponse('Please provide name and price for the scrap type.', 400));
    }

    const existingScrapType = await ScrapType.findOne({ name });
    if (existingScrapType) {
        return next(new ErrorResponse(`Scrap type with name '${name}' already exists.`, 400));
    }

    const scrapType = await ScrapType.create({
        name,
        price,
        unit: unit || 'kg', // Default to 'kg' if not provided
        description,
        isActive: isActive === undefined ? true : isActive,
    });

    res.status(201).json({
        success: true,
        message: 'Scrap type created successfully.',
        data: scrapType,
    });
});

// @desc    Get all scrap types
// @route   GET /api/scrap-types
// @access  Public (can be filtered for active only on frontend or via query param)
//          Admin will see all by default.
exports.getAllScrapTypes = asyncHandler(async (req, res, next) => {
    let query;

    // If the user is not an admin, or if 'activeOnly=true' is in query, only show active
    // For now, let's always return all and let frontend filter, or admin panel show all
    // If you want to filter active by default for non-admins:
    // if (req.user?.role !== 'admin' || req.query.activeOnly === 'true') {
    //     query = ScrapType.find({ isActive: true });
    // } else {
    //     query = ScrapType.find();
    // }

    // Simpler: by default return active ones for public, all for admin page or if specified
    const filter = {};
    if (req.query.active === 'true') {
        filter.isActive = true;
    } else if (req.query.active === 'false' && req.user?.role === 'admin') {
        filter.isActive = false;
    } else if (req.user?.role !== 'admin') { // Non-admins only see active by default
        filter.isActive = true;
    }
    // If admin and no 'active' query, show all (empty filter object)

    const scrapTypes = await ScrapType.find(filter).sort({ name: 1 }); // Sort by name

    res.status(200).json({
        success: true,
        count: scrapTypes.length,
        data: scrapTypes,
    });
});

// @desc    Get a single scrap type by ID
// @route   GET /api/scrap-types/:id
// @access  Private (Admin) - Or Public if needed for detail views
exports.getScrapTypeById = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findById(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    // Optionally, restrict access for non-admins if it's an inactive item
    // if (!scrapType.isActive && req.user?.role !== 'admin') {
    //     return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    // }

    res.status(200).json({
        success: true,
        data: scrapType,
    });
});

// @desc    Update a scrap type
// @route   PUT /api/scrap-types/:id
// @access  Private (Admin)
exports.updateScrapType = asyncHandler(async (req, res, next) => {
    const { name, price, unit, description, isActive } = req.body;
    const scrapTypeId = req.params.id;

    let scrapType = await ScrapType.findById(scrapTypeId);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${scrapTypeId}`, 404));
    }

    // Check if name is being changed and if the new name already exists
    if (name && name !== scrapType.name) {
        const existingScrapType = await ScrapType.findOne({ name });
        if (existingScrapType && existingScrapType._id.toString() !== scrapTypeId) {
            return next(new ErrorResponse(`Scrap type with name '${name}' already exists.`, 400));
        }
        scrapType.name = name;
    }

    if (price !== undefined) scrapType.price = price;
    if (unit !== undefined) scrapType.unit = unit;
    if (description !== undefined) scrapType.description = description;
    if (isActive !== undefined) scrapType.isActive = isActive;

    await scrapType.save();

    res.status(200).json({
        success: true,
        message: 'Scrap type updated successfully.',
        data: scrapType,
    });
});

// @desc    Delete a scrap type (soft delete by setting isActive to false)
// @route   DELETE /api/scrap-types/:id
// @access  Private (Admin)
exports.deleteScrapType = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findById(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    // Soft delete:
    scrapType.isActive = false;
    await scrapType.save();
    // If you want hard delete: await ScrapType.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Scrap type '${scrapType.name}' deactivated successfully.`,
        data: {}, // Or return the updated (deactivated) item
    });
});

// @desc    Hard Delete a scrap type (actual removal from DB)
// @route   DELETE /api/scrap-types/:id/force
// @access  Private (Admin)
exports.forceDeleteScrapType = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findByIdAndDelete(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: `Scrap type '${scrapType.name}' permanently deleted.`,
        data: {},
    });
});