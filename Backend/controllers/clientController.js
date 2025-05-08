// backend/controllers/clientController.js
const Client = require('../models/Client');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for password hashing on update

// --- Register Client ---
exports.registerClient = async (req, res, next) => {
    console.log('[ClientCtrl Register] Attempt. Body:', req.body, 'File:', req.file);
    try {
        const { name, email, contactNumber, password, address, district, province } = req.body;
        if (!name || !email || !contactNumber || !password || !address || !district || !province) {
             return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }
        // Add specific validations if needed
        const existingClient = await Client.findOne({ email });
        if (existingClient) return res.status(400).json({ success: false, message: 'Email already registered.' });

        const newClient = new Client({ name, email, contactNumber, password, address, district, province });
        if (req.file) newClient.profilePhoto = `/uploads/${req.file.filename}`;
        await newClient.save();
        console.log(`[ClientCtrl Register] Client ${email} saved. ID: ${newClient._id}`);
        const clientResponse = { ...newClient._doc }; delete clientResponse.password;
        res.status(201).json({ success: true, message: 'Client registered successfully.', data: clientResponse });
    } catch (error) { console.error('[ClientCtrl Register] Error:', error); next(error); }
};

// --- Get Client Profile ---
exports.getClientProfile = async (req, res, next) => {
    const requestedId = req.params.id;
    const loggedInUser = req.user;
    console.log(`[ClientCtrl GetProfile] Request for ID: ${requestedId}. User: ${loggedInUser?.id} (${loggedInUser?.role})`);
    try {
        if (!mongoose.Types.ObjectId.isValid(requestedId)) return res.status(400).json({ success: false, message: 'Invalid client ID format.' });
        // Authorization check (middleware `checkOwnershipOrAdmin` should handle this if used in routes)
        // if (loggedInUser.role !== 'admin' && loggedInUser.id !== requestedId) return res.status(403).json({ success: false, message: 'Not authorized.' });
        const client = await Client.findById(requestedId); // Password excluded by schema default
        if (!client) return res.status(404).json({ success: false, message: 'Client profile not found.' });
        console.log(`[ClientCtrl GetProfile] Found profile for ID: ${requestedId}.`);
        res.status(200).json({ success: true, data: client });
    } catch (error) { console.error(`[ClientCtrl GetProfile] Error for ID ${requestedId}:`, error); next(error); }
};

// --- Update Client Profile ---
exports.updateClientProfile = async (req, res, next) => {
    const clientIdToUpdate = req.params.id;
    const loggedInUser = req.user;
    console.log(`[ClientCtrl UpdateProfile] Attempt for ID: ${clientIdToUpdate}. User: ${loggedInUser.id}. Body Keys:`, Object.keys(req.body), "Has File:", !!req.file);
    try {
        // ID Validation & Authorization (already handled by middleware: protect, authorize('client'), checkOwnershipOrAdmin)

        const allowedUpdates = ['name', 'contactNumber', 'address', 'district', 'province'];
        const updates = {};
        allowedUpdates.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field].trim ? req.body[field].trim() : req.body[field]; });

        if (req.body.password) { // Hash new password if provided
            if (req.body.password.length < 6) return res.status(400).json({ success: false, message: 'New password min 6 chars.' });
            console.log(`[ClientCtrl UpdateProfile] Hashing new password...`);
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }
        if (req.file) { // Add new photo path if uploaded
            console.log(`[ClientCtrl UpdateProfile] New photo uploaded: ${req.file.filename}`);
            updates.profilePhoto = `/uploads/${req.file.filename}`;
            // TODO: Add logic here to delete the OLD photo from /uploads if updates.profilePhoto is different from the current one
        }

        if (Object.keys(updates).length === 0) {
            console.log(`[ClientCtrl UpdateProfile] No valid fields to update.`);
             const currentClient = await Client.findById(clientIdToUpdate); // Re-fetch to return current data
             return res.status(200).json({ success: true, message: 'No changes applied.', data: currentClient });
        }

        console.log(`[ClientCtrl UpdateProfile] Applying updates:`, Object.keys(updates));
        const updatedClient = await Client.findByIdAndUpdate(clientIdToUpdate, { $set: updates }, { new: true, runValidators: true, context: 'query' });

        if (!updatedClient) return res.status(404).json({ success: false, message: 'Client profile not found during update.' });

        console.log(`[ClientCtrl UpdateProfile] Update successful for ID: ${clientIdToUpdate}.`);
        res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updatedClient });

    } catch (error) {
        console.error(`[ClientCtrl UpdateProfile] Error for ID ${clientIdToUpdate}:`, error);
        next(error); // Pass to global handler (will handle validation errors etc.)
    }
};