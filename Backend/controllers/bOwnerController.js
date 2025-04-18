const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const deleteUploadedFilesOnError = (files) => {
    let deletedPaths = [];
    if (files && typeof files === 'object') {
        Object.values(files).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
                fileArray.forEach(file => {
                    const filePath = file?.path;
                    if (filePath && fs.existsSync(filePath)) {
                        try { fs.unlinkSync(filePath); deletedPaths.push(filePath); }
                        catch (err) { console.error(`Error deleting file ${filePath}:`, err); }
                    }
                });
            }
        });
    }
    if(deletedPaths.length > 0){ console.log('Cleaned up files:', deletedPaths); }
};

exports.registerBOwner = async (req, res) => {
  const { businessId, businessName, ownerName, address, contactNumber, district, province, email, password } = req.body;
  const profilePhotoFile = req.files?.profilePhoto?.[0];
  const coverPhotoFile = req.files?.coverPhoto?.[0];
  try {
    if (!businessId || !businessName || !ownerName || !address || !contactNumber || !district || !province || !email || !password) {
       deleteUploadedFilesOnError(req.files);
       return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    if (await BusinessOwner.findOne({ $or: [{ email }, { businessId }] })) {
        deleteUploadedFilesOnError(req.files);
        return res.status(400).json({ success: false, message: `Email or Business ID already exists.` });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePhotoPath = profilePhotoFile ? `/uploads/b_owner_profiles/${profilePhotoFile.filename}` : '';
    const coverPhotoPath = coverPhotoFile ? `/uploads/b_owner_covers/${coverPhotoFile.filename}` : '';
    const newBusinessOwner = new BusinessOwner({ businessId, businessName, ownerName, email, address, contactNumber, district, province, password: hashedPassword, profilePhoto: profilePhotoPath, coverPhoto: coverPhotoPath });
    const savedBusinessOwner = await newBusinessOwner.save();
    const ownerData = savedBusinessOwner.toObject();
    delete ownerData.password;
    res.status(201).json({ success: true, message: 'Business Owner registered successfully!', data: ownerData });
  } catch (error) {
      deleteUploadedFilesOnError(req.files);
      console.error("Business Owner Registration Error:", error);
      if (error.name === 'ValidationError') { return res.status(400).json({ success: false, message: Object.values(error.errors).map(val => val.message).join('. ') }); }
      if (error.code === 11000) { return res.status(400).json({ success: false, message: `Duplicate value entered.` }); }
      res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.getBOwnerProfile = async (req, res) => {
    try {
        if (!req.user || (req.user.id !== req.params.id && req.user.role !== 'admin')) { return res.status(403).json({ success: false, message: 'Not authorized' }); }
        const bOwner = await BusinessOwner.findById(req.params.id).select('-password');
        if (!bOwner) { return res.status(404).json({ success: false, message: 'Business Owner not found' }); }
        res.status(200).json({ success: true, data: bOwner });
    } catch (error) {
        console.error("Get BOwner Profile Error:", error);
         if (error.kind === 'ObjectId') { return res.status(400).json({ success: false, message: 'Invalid ID format' }); }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateBOwner = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented.' }); };
exports.deleteBOwner = async (req, res) => { res.status(501).json({ success: false, message: 'Not implemented.' }); };