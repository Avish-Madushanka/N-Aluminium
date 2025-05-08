// backend/controllers/bOwnerController.js
const BusinessOwner = require('../models/BusinessOwner');

exports.registerBusinessOwner = async (req, res, next) => {
    console.log('[BOwnerCtrl Register] Attempt. Body:', req.body, 'Files:', req.files);
    try {
        const { businessId, businessName, ownerName, address, contactNumber, district, province, email, password } = req.body;
        // Basic validation
        const requiredFields = { businessId, businessName, ownerName, address, contactNumber, district, province, email, password };
        const missing = Object.entries(requiredFields).filter(([k, v]) => !v || !String(v).trim()).map(([k]) => k);
        if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
        if (password.length < 6) return res.status(400).json({ success: false, message: 'Password min 6 chars.' });
        if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: 'Invalid email.' });
        if (!/^[0-9]{10}$/.test(contactNumber)) return res.status(400).json({ success: false, message: 'Invalid 10-digit contact.' });

        // Check existence
        const existingEmail = await BusinessOwner.findOne({ email });
        if (existingEmail) return res.status(400).json({ success: false, message: 'Email already registered.' });
        const existingId = await BusinessOwner.findOne({ businessId });
        if (existingId) return res.status(400).json({ success: false, message: 'Business ID already registered.' });

        // Create and save
        const newBOwner = new BusinessOwner({ businessId, businessName, ownerName, address, contactNumber, district, province, email, password });
        if (req.files?.profilePhoto?.[0]) newBOwner.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
        if (req.files?.coverPhoto?.[0]) newBOwner.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
        await newBOwner.save();
        console.log(`[BOwnerCtrl Register] BOwner ${email} saved. ID: ${newBOwner._id}`);

        // Respond
        const bOwnerResponse = { ...newBOwner._doc }; delete bOwnerResponse.password;
        res.status(201).json({ success: true, message: 'Business Owner registered.', data: bOwnerResponse });
    } catch (error) {
        console.error('[BOwnerCtrl Register] Error:', error);
        next(error);
    }
};