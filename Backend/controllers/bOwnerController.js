// backend/controllers/bOwnerController.js
const BusinessOwner = require('../models/BusinessOwner');
const asyncHandler = require('../utils/async'); // Assuming you have this utility
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have this utility
const fs = require('fs'); // For deleting old files (optional but good practice)
const path = require('path'); // For constructing paths to old files
// Note: bcrypt is NOT needed here if password hashing is solely handled by the pre-save hook in the model

// ... (your existing registerBusinessOwner and getMyBOwnerProfile functions) ...

exports.registerBusinessOwner = asyncHandler(async (req, res, next) => {
    // ... (your existing registration logic)
});

exports.getMyBOwnerProfile = asyncHandler(async (req, res, next) => {
    // ... (your existing logic to get the profile of the logged-in business owner)
    const bOwner = await BusinessOwner.findById(req.user.id);
    if (!bOwner) {
        return next(new ErrorResponse('Business Owner not found', 404));
    }
    res.status(200).json({ success: true, data: bOwner });
});


// @desc    Update current logged-in business owner's profile
// @route   PUT /api/b-owners/profile/me
// @access  Private (BusinessOwner only)
exports.updateMyBOwnerProfile = asyncHandler(async (req, res, next) => {
    const businessOwnerId = req.user.id; // From 'protect' middleware
    console.log(`[BOwnerCtrl UpdateProfile] Attempting to update profile for BOwner ID: ${businessOwnerId}`);
    console.log('[BOwnerCtrl UpdateProfile] Request Body:', req.body);
    console.log('[BOwnerCtrl UpdateProfile] Request Files:', req.files);

    // Fetch the existing business owner document to update
    // Select password only if you need to verify currentPassword for a newPassword change,
    // otherwise, it's better not to select it for general profile updates.
    // If newPassword is provided, you might need to verify currentPassword (more secure).
    const businessOwner = await BusinessOwner.findById(businessOwnerId).select(req.body.newPassword ? '+password' : '');


    if (!businessOwner) {
        return next(new ErrorResponse('Business owner not found for update', 404));
    }

    // Fields that can be updated from req.body
    const {
        businessName,
        ownerName,
        address,
        contactNumber,
        district,
        province,
        // currentPassword, // Only needed if changing password and requiring old one
        newPassword      // The new password, if user wants to change it
    } = req.body;

    const updatesToApply = {};

    // Update textual fields if they are provided and different from current
    if (businessName && businessName.trim() !== '' && businessName.trim() !== businessOwner.businessName) {
        updatesToApply.businessName = businessName.trim();
    }
    if (ownerName && ownerName.trim() !== '' && ownerName.trim() !== businessOwner.ownerName) {
        updatesToApply.ownerName = ownerName.trim();
    }
    if (address && address.trim() !== '' && address.trim() !== businessOwner.address) {
        updatesToApply.address = address.trim();
    }
    if (contactNumber && contactNumber.trim() !== '' && contactNumber.trim() !== businessOwner.contactNumber) {
        if (!/^[0-9]{10}$/.test(contactNumber.trim())) {
            return next(new ErrorResponse('Invalid 10-digit contact number.', 400));
        }
        updatesToApply.contactNumber = contactNumber.trim();
    }
    if (district && district.trim() !== '' && district.trim() !== businessOwner.district) {
        updatesToApply.district = district.trim();
    }
    if (province && province.trim() !== '' && province.trim() !== businessOwner.province) {
        updatesToApply.province = province.trim();
    }

    // Handle Profile Photo Update
    if (req.files?.profilePhoto?.[0]) {
        const newProfilePhotoPath = `/uploads/${req.files.profilePhoto[0].filename}`;
        // Optional: Delete old photo if it exists and is different
        if (businessOwner.profilePhoto && businessOwner.profilePhoto !== newProfilePhotoPath) {
            try {
                const oldPhotoFullPath = path.join(__dirname, '..', '..', businessOwner.profilePhoto); // Adjust path to your uploads folder from controllers
                if (fs.existsSync(oldPhotoFullPath)) {
                    fs.unlinkSync(oldPhotoFullPath);
                    console.log(`[BOwnerCtrl UpdateProfile] Deleted old profile photo: ${businessOwner.profilePhoto}`);
                }
            } catch (err) {
                console.error(`[BOwnerCtrl UpdateProfile] Error deleting old profile photo (${businessOwner.profilePhoto}): ${err.message}`);
            }
        }
        updatesToApply.profilePhoto = newProfilePhotoPath;
    }

    // Handle Cover Photo Update
    if (req.files?.coverPhoto?.[0]) {
        const newCoverPhotoPath = `/uploads/${req.files.coverPhoto[0].filename}`;
        if (businessOwner.coverPhoto && businessOwner.coverPhoto !== newCoverPhotoPath) {
            try {
                const oldPhotoFullPath = path.join(__dirname, '..', '..', businessOwner.coverPhoto); // Adjust path
                if (fs.existsSync(oldPhotoFullPath)) {
                    fs.unlinkSync(oldPhotoFullPath);
                    console.log(`[BOwnerCtrl UpdateProfile] Deleted old cover photo: ${businessOwner.coverPhoto}`);
                }
            } catch (err) {
                console.error(`[BOwnerCtrl UpdateProfile] Error deleting old cover photo (${businessOwner.coverPhoto}): ${err.message}`);
            }
        }
        updatesToApply.coverPhoto = newCoverPhotoPath;
    }
    
    // Handle Password Update (if newPassword is provided)
    if (newPassword && newPassword.trim() !== "") {
        if (newPassword.length < 6) {
            return next(new ErrorResponse('New password must be at least 6 characters.', 400));
        }
        // For a more secure password change, you would typically require 'currentPassword' here,
        // verify it against businessOwner.password (which you'd have to .select('+password') earlier),
        // and only then proceed to set the new password.
        // const isCurrentPasswordMatch = await businessOwner.comparePassword(currentPassword);
        // if (!isCurrentPasswordMatch) {
        //    return next(new ErrorResponse('Incorrect current password.', 401));
        // }
        businessOwner.password = newPassword; // Assign plain new password; pre-save hook in model will hash it.
        console.log("[BOwnerCtrl UpdateProfile] New password set, pre-save hook will hash.");
    }

    // Apply the textual updates to the Mongoose document
    Object.assign(businessOwner, updatesToApply);

    try {
        const updatedBusinessOwner = await businessOwner.save(); // This triggers pre-save hooks (like password hashing)
        
        const responseData = updatedBusinessOwner.toObject();
        delete responseData.password; // Ensure password hash is not sent back

        console.log(`[BOwnerCtrl UpdateProfile] Profile updated successfully for BOwner ID: ${updatedBusinessOwner._id}`);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: responseData
        });
    } catch (validationError) {
        // Handle Mongoose validation errors (e.g., unique constraints if you were updating email/businessId)
        console.error("[BOwnerCtrl UpdateProfile] Validation error on save:", validationError);
        return next(validationError);
    }
});