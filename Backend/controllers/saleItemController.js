const SaleItem = require('../models/SaleItem');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const fs =require('fs');
const path = require('path');

exports.createSaleItem = asyncHandler(async (req, res, next) => {
    console.log(`[SaleItemCtrl Create @ ${new Date().toISOString()}] Handler started.`);
    console.log('[SaleItemCtrl Create] req.body received by controller:', req.body);
    console.log('[SaleItemCtrl Create] req.file received by controller:', req.file ? { filename: req.file.filename, path: req.file.path, size: req.file.size } : 'undefined');

    if (!req.file) {
        console.error('[SaleItemCtrl Create] VALIDATION FAILED in controller: req.file is missing. This means multer did not successfully populate it, or an error occurred before this point that was not handled by sending a response.');
        return next(new ErrorResponse('Please upload an image for the item. (Controller Check)', 400));
    }

    const { name, description, address, district, province, price, contact, type } = req.body;

    if (!name || !description || !address || !district || !province || price === undefined || !contact || !type) {
        console.error('[SaleItemCtrl Create] Validation FAILED for text fields in controller.');
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, err => {
                if (err) console.error(`[SaleItemCtrl Create] Error deleting orphaned file after text validation fail: ${req.file.path}`, err);
                else console.log(`[SaleItemCtrl Create] Deleted orphaned file: ${req.file.path}`);
            });
        }
        return next(new ErrorResponse('Please provide all required text fields.', 400));
    }

    const imagePathForDB = `/uploads/saleitems/${req.file.filename}`;
    const saleItemData = {
        name, description, address, district, province,
        price: Number(price), contact, type, imagePath: imagePathForDB,
        userId: req.user.id, userModel: req.user.constructor.modelName
    };

    console.log('[SaleItemCtrl Create] Attempting to create SaleItem with data:', saleItemData);
    const saleItem = await SaleItem.create(saleItemData);

    console.log(`[SaleItemCtrl Create] Sale item created: ${saleItem._id}`);
    res.status(201).json({ success: true, message: 'Sale item created successfully.', data: saleItem });
});


exports.getAllSaleItems = asyncHandler(async (req, res, next) => {
    console.log('[SaleItemCtrl GetAll] Fetching all sale items.');
    const saleItems = await SaleItem.find({ isSold: false })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: saleItems.length,
        data: saleItems
    });
});

exports.getSaleItemById = asyncHandler(async (req, res, next) => {
    console.log(`[SaleItemCtrl GetById] Fetching sale item with ID: ${req.params.id}`);
    const saleItem = await SaleItem.findById(req.params.id).populate('userId', 'name email');

    if (!saleItem) {
        return next(new ErrorResponse(`Sale item not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: saleItem });
});

exports.updateSaleItem = asyncHandler(async (req, res, next) => {
    console.log(`[SaleItemCtrl Update @ ${new Date().toISOString()}] Attempting to update ID: ${req.params.id}`);
    console.log('[SaleItemCtrl Update] req.body:', req.body);
    console.log('[SaleItemCtrl Update] req.file (new image):', req.file ? { filename: req.file.filename } : 'No new file');

    let saleItem = await SaleItem.findById(req.params.id);
    if (!saleItem) {
        if (req.file && req.file.path) fs.unlinkSync(req.file.path); 
        return next(new ErrorResponse(`Sale item not found: ${req.params.id}`, 404));
    }

    if (saleItem.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        if (req.file && req.file.path) fs.unlinkSync(req.file.path); 
        return next(new ErrorResponse('Not authorized to update this item', 403));
    }

    const updates = { ...req.body };
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.isSold !== undefined) updates.isSold = (String(req.body.isSold).toLowerCase() === 'true');

    if (req.file) {
        const newImagePathForDB = `/uploads/saleitems/${req.file.filename}`;
        if (saleItem.imagePath && saleItem.imagePath !== newImagePathForDB) {
            const oldImageDiskPath = path.join(__dirname, '..', saleItem.imagePath);
            if (fs.existsSync(oldImageDiskPath)) {
                try { fs.unlinkSync(oldImageDiskPath); console.log(`[SaleItemCtrl Update] Deleted old image: ${oldImageDiskPath}`); }
                catch (unlinkErr) { console.error(`[SaleItemCtrl Update] Error deleting old image ${oldImageDiskPath}:`, unlinkErr); }
            }
        }
        updates.imagePath = newImagePathForDB;
    }

    saleItem = await SaleItem.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    console.log(`[SaleItemCtrl Update] Updated: ${saleItem._id}`);
    res.status(200).json({ success: true, message: 'Sale item updated.', data: saleItem });
});

exports.deleteSaleItem = asyncHandler(async (req, res, next) => {
    console.log(`[SaleItemCtrl Delete @ ${new Date().toISOString()}] Attempting to delete ID: ${req.params.id}`);
    const saleItem = await SaleItem.findById(req.params.id);
    if (!saleItem) {
        return next(new ErrorResponse(`Sale item not found: ${req.params.id}`, 404));
    }
    if (saleItem.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this item', 403));
    }
    if (saleItem.imagePath) {
        const imageDiskPath = path.join(__dirname, '..', saleItem.imagePath);
        if (fs.existsSync(imageDiskPath)) {
            try { fs.unlinkSync(imageDiskPath); console.log(`[SaleItemCtrl Delete] Deleted image file: ${imageDiskPath}`); }
            catch (unlinkErr) { console.error(`[SaleItemCtrl Delete] Error deleting image ${imageDiskPath}:`, unlinkErr); }
        }
    }
    await saleItem.deleteOne();
    console.log(`[SaleItemCtrl Delete] Deleted: ${req.params.id}`);
    res.status(200).json({ success: true, message: 'Sale item deleted.' });
});