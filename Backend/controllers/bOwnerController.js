const BusinessOwner = require('../models/BusinessOwner');

exports.registerBusinessOwner = async (req, res, next) => {
    try {
        const {
            businessId, businessName, ownerName, address,
            contactNumber, district, province, email, password
        } = req.body;

        const requiredFields = [businessId, businessName, ownerName, address, contactNumber, district, province, email, password];
        if (requiredFields.some(field => !field || String(field).trim() === '')) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existingBOwnerByEmail = await BusinessOwner.findOne({ email });
        if (existingBOwnerByEmail) {
            return res.status(400).json({ message: 'Email already in use for a business owner.' });
        }
        const existingBOwnerById = await BusinessOwner.findOne({ businessId });
        if (existingBOwnerById) {
            return res.status(400).json({ message: 'Business ID already registered.' });
        }

        const newBOwner = new BusinessOwner({
            businessId, businessName, ownerName, address,
            contactNumber, district, province, email, password
        });

        if (req.files) {
            if (req.files.profilePhoto) {
                newBOwner.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
            }
            if (req.files.coverPhoto) {
                newBOwner.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
            }
        }

        await newBOwner.save();
        const bOwnerResponse = { ...newBOwner._doc };
        delete bOwnerResponse.password;

        res.status(201).json({
            success: true,
            message: 'Business Owner registered successfully.',
            data: { bOwnerId: newBOwner._id, businessName: newBOwner.businessName, email: newBOwner.email }
        });
    } catch (error) {
        next(error);
    }
};