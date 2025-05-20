const BusinessOwner = require('../models/BusinessOwner');
const asyncHandler = require('../utils/async'); 
const ErrorResponse = require('../utils/errorResponse'); 
const fs = require('fs'); 
const path = require('path');


exports.registerBusinessOwner = asyncHandler(async (req, res, next) => {
});

exports.getMyBOwnerProfile = asyncHandler(async (req, res, next) => {
    const bOwner = await BusinessOwner.findById(req.user.id);
    if (!bOwner) {
        return next(new ErrorResponse('Business Owner not found', 404));
    }
    res.status(200).json({ success: true, data: bOwner });
});

exports.getAllBusinessOwners = asyncHandler(async (req, res, next) => {
    console.log('[BOwnerCtrl GetAll] Admin fetching all business owners');
    
    try {
        const businessOwners = await BusinessOwner.find()
            .select('-password') 
            .sort({ createdAt: -1 }); 
        
        console.log(`[BOwnerCtrl GetAll] Found ${businessOwners.length} business owners`);
        
        res.status(200).json({
            success: true,
            count: businessOwners.length,
            data: businessOwners
        });
    } catch (error) {
        console.error('[BOwnerCtrl GetAll] Error fetching all business owners:', error);
        next(error);
    }
});

exports.updateMyBOwnerProfile = asyncHandler(async (req, res, next) => {
    const businessOwnerId = req.user.id; 
    console.log(`[BOwnerCtrl UpdateProfile] Attempting to update profile for BOwner ID: ${businessOwnerId}`);
    console.log('[BOwnerCtrl UpdateProfile] Request Body:', req.body);
    console.log('[BOwnerCtrl UpdateProfile] Request Files:', req.files);

    const businessOwner = await BusinessOwner.findById(businessOwnerId).select(req.body.newPassword ? '+password' : '');


    if (!businessOwner) {
        return next(new ErrorResponse('Business owner not found for update', 404));
    }

    const {
        businessName,
        ownerName,
        address,
        contactNumber,
        district,
        province,
        newPassword     
    } = req.body;

    const updatesToApply = {};

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

    if (req.files?.profilePhoto?.[0]) {
        const newProfilePhotoPath = `/uploads/${req.files.profilePhoto[0].filename}`;
        if (businessOwner.profilePhoto && businessOwner.profilePhoto !== newProfilePhotoPath) {
            try {
                const oldPhotoFullPath = path.join(__dirname, '..', '..', businessOwner.profilePhoto); 
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

    if (req.files?.coverPhoto?.[0]) {
        const newCoverPhotoPath = `/uploads/${req.files.coverPhoto[0].filename}`;
        if (businessOwner.coverPhoto && businessOwner.coverPhoto !== newCoverPhotoPath) {
            try {
                const oldPhotoFullPath = path.join(__dirname, '..', '..', businessOwner.coverPhoto);
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
    
    if (newPassword && newPassword.trim() !== "") {
        if (newPassword.length < 6) {
            return next(new ErrorResponse('New password must be at least 6 characters.', 400));
        }
        console.log("[BOwnerCtrl UpdateProfile] New password set, pre-save hook will hash.");
    }

    Object.assign(businessOwner, updatesToApply);

    try {
        const updatedBusinessOwner = await businessOwner.save(); 
        
        const responseData = updatedBusinessOwner.toObject();
        delete responseData.password;

        console.log(`[BOwnerCtrl UpdateProfile] Profile updated successfully for BOwner ID: ${updatedBusinessOwner._id}`);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: responseData
        });
    } catch (validationError) {
        console.error("[BOwnerCtrl UpdateProfile] Validation error on save:", validationError);
        return next(validationError);
    }
});