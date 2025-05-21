const Client = require('../models/Client');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs'); // Added
const path = require('path'); // Added

// Helper to get the base directory for uploads, assuming 'uploads' is at project root
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // Adjust if 'uploads' is elsewhere relative to 'controllers'

exports.registerClient = async (req, res, next) => {
    console.log('[ClientCtrl Register] Attempt. Body:', req.body, 'File:', req.file);
    try {
        const { name, email, contactNumber, password, address, district, province } = req.body;
        if (!name || !email || !contactNumber || !password || !address || !district || !province) {
             return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }
        const existingClient = await Client.findOne({ email: email.toLowerCase() }); // Ensure email check is case-insensitive
        if (existingClient) return res.status(400).json({ success: false, message: 'Email already registered.' });

        const newClient = new Client({ 
            name, 
            email: email.toLowerCase(), // Store email in lowercase
            contactNumber, 
            password, 
            address, 
            district, 
            province 
        });
        if (req.file) {
            // Store path relative to the '/uploads' route, e.g., /uploads/filename.jpg
            newClient.profilePhoto = `/uploads/${req.file.filename}`;
        }
        await newClient.save();
        console.log(`[ClientCtrl Register] Client ${newClient.email} saved. ID: ${newClient._id}`);
        
        const clientResponse = newClient.toObject(); // Convert to plain object
        delete clientResponse.password; // Remove password
        
        res.status(201).json({ success: true, message: 'Client registered successfully.', data: clientResponse });
    } catch (error) { 
        console.error('[ClientCtrl Register] Error:', error); 
        // Check for duplicate key error specifically for email
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }
        next(error); 
    }
};

exports.getClientProfile = async (req, res, next) => {
    const requestedId = req.params.id;
    const loggedInUser = req.user;
    console.log(`[ClientCtrl GetProfile] Request for ID: ${requestedId}. User: ${loggedInUser?.id} (${loggedInUser?.role})`);
    try {
        if (!mongoose.Types.ObjectId.isValid(requestedId)) 
            return res.status(400).json({ success: false, message: 'Invalid client ID format.' });
        
        // Exclude password from the result by default due to schema select:false
        const client = await Client.findById(requestedId); 
        
        if (!client) return res.status(404).json({ success: false, message: 'Client profile not found.' });
        
        console.log(`[ClientCtrl GetProfile] Found profile for ID: ${requestedId}.`);
        res.status(200).json({ success: true, data: client }); // Password already excluded by schema
    } catch (error) { 
        console.error(`[ClientCtrl GetProfile] Error for ID ${requestedId}:`, error); 
        next(error); 
    }
};


exports.updateClientProfile = async (req, res, next) => {
    const clientIdToUpdate = req.params.id;
    const loggedInUser = req.user; // Assuming authMiddleware populates req.user
    console.log(`[ClientCtrl UpdateProfile] Attempt for ID: ${clientIdToUpdate}. User: ${loggedInUser.id}. Body Keys:`, Object.keys(req.body), "Has File:", !!req.file);

    try {
        const clientBeforeUpdate = await Client.findById(clientIdToUpdate);
        if (!clientBeforeUpdate) {
            return res.status(404).json({ success: false, message: 'Client not found, cannot update.' });
        }

        const allowedUpdates = ['name', 'contactNumber', 'address', 'district', 'province'];
        const updates = {};
        let hasTextUpdates = false;

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                const trimmedValue = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
                // Only add to updates if it's different from the current value or if it's a new value
                if (trimmedValue !== clientBeforeUpdate[field]) {
                     updates[field] = trimmedValue;
                     hasTextUpdates = true;
                }
            }
        });

        if (req.body.password) {
            if (req.body.password.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
            console.log(`[ClientCtrl UpdateProfile] Hashing new password...`);
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
            hasTextUpdates = true; // Password change counts as an update
        }

        let oldPhotoDbPath = null; // Path stored in DB, e.g., /uploads/old-image.jpg
        if (req.file) {
            console.log(`[ClientCtrl UpdateProfile] New photo uploaded: ${req.file.filename}`);
            // Check if there was an old photo that's not a default and not an external URL
            if (clientBeforeUpdate.profilePhoto && 
                clientBeforeUpdate.profilePhoto !== 'default.jpg' && 
                !clientBeforeUpdate.profilePhoto.startsWith('http')) {
                oldPhotoDbPath = clientBeforeUpdate.profilePhoto;
            }
            updates.profilePhoto = `/uploads/${req.file.filename}`; // Path to be stored in DB
        }

        if (Object.keys(updates).length === 0) {
            console.log(`[ClientCtrl UpdateProfile] No valid fields to update for client ${clientIdToUpdate}.`);
            // Send back the current client data, ensuring password is not included
            const currentClientData = clientBeforeUpdate.toObject();
            delete currentClientData.password;
            return res.status(200).json({ success: true, message: 'No changes applied.', data: currentClientData });
        }

        console.log(`[ClientCtrl UpdateProfile] Applying updates for client ${clientIdToUpdate}:`, Object.keys(updates));
        const updatedClient = await Client.findByIdAndUpdate(
            clientIdToUpdate, 
            { $set: updates }, 
            { new: true, runValidators: true, context: 'query' }
        );

        if (!updatedClient) {
            // This case should be rare if clientBeforeUpdate was found, but handle it.
            // If a new photo was uploaded but DB update failed, the new file might be orphaned.
            // Consider deleting req.file.path if this happens for robustness (more advanced).
            return res.status(404).json({ success: false, message: 'Client profile not found during update execution or update failed.' });
        }

        // If update was successful and an old photo path was identified, delete it from filesystem
        if (oldPhotoDbPath) {
            // oldPhotoDbPath is like /uploads/image.jpg
            // We need the actual filename: image.jpg
            const oldFileName = path.basename(oldPhotoDbPath);
            const diskPathForOldPhoto = path.join(UPLOADS_DIR, oldFileName); 

            if (fs.existsSync(diskPathForOldPhoto)) {
                try {
                    fs.unlinkSync(diskPathForOldPhoto);
                    console.log(`[ClientCtrl UpdateProfile] Successfully deleted old profile photo: ${diskPathForOldPhoto}`);
                } catch (delErr) {
                    console.error(`[ClientCtrl UpdateProfile] Error deleting old profile photo ${diskPathForOldPhoto}:`, delErr.message);
                    // Non-fatal error, profile was updated. Log it.
                }
            } else {
                console.warn(`[ClientCtrl UpdateProfile] Old photo path ${diskPathForOldPhoto} (from DB value ${oldPhotoDbPath}) not found for deletion.`);
            }
        }

        console.log(`[ClientCtrl UpdateProfile] Update successful for ID: ${clientIdToUpdate}.`);
        
        const responseData = updatedClient.toObject();
        delete responseData.password; // Explicitly remove password before sending response

        res.status(200).json({ success: true, message: 'Profile updated successfully.', data: responseData });

    } catch (error) {
        console.error(`[ClientCtrl UpdateProfile] Error for ID ${clientIdToUpdate}:`, error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, message: 'Validation Error', errors });
        }
        next(error); 
    }
};