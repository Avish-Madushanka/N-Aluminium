// backend/controllers/authController.js
const jwt = require('jsonwebtoken');

// --- Model Imports ---
// *** TRIPLE-CHECK THESE PATHS RELATIVE TO THIS FILE (controllers/) ***
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner'); // <--- CHECK THIS PATH
const Admin = require('../models/Admin');
// *** END PATH CHECK ***

// --- Diagnostic Logging ---
console.log('[AuthCtrl Module Load] Required Client Type:', typeof Client, 'Has findOne:', typeof Client?.findOne === 'function');
console.log('[AuthCtrl Module Load] Required BusinessOwner Type:', typeof BusinessOwner, 'Has findOne:', typeof BusinessOwner?.findOne === 'function'); // <--- WATCH THIS LOG
console.log('[AuthCtrl Module Load] Required Admin Type:', typeof Admin, 'Has findOne:', typeof Admin?.findOne === 'function');
// --- End Diagnostic Logging ---


const findUserByEmail = async (email) => {
    console.log(`[AuthCtrl findUserByEmail] Searching for: "${email}"`);

    // Pre-checks (These should ideally pass now if imports/exports are correct)
    if (typeof Client?.findOne !== 'function') throw new Error('Server Config Error: Client model invalid.');
    if (typeof BusinessOwner?.findOne !== 'function') {
        // This was the failing check
        console.error("[AuthCtrl findUserByEmail] FATAL: BusinessOwner variable is invalid! Type:", typeof BusinessOwner);
        throw new Error('Server Config Error: BusinessOwner model invalid.');
    }
    if (typeof Admin?.findOne !== 'function') throw new Error('Server Config Error: Admin model invalid.');

    // Search sequence
    let user = await Client.findOne({ email }).select('+password');
    if (user) return { user, userModelName: 'Client' };

    console.log('[AuthCtrl findUserByEmail] Checking BusinessOwner...');
    user = await BusinessOwner.findOne({ email }).select('+password'); // Should work now
    if (user) return { user, userModelName: 'BusinessOwner' };

    user = await Admin.findOne({ email }).select('+password');
    if (user) return { user, userModelName: 'Admin' };

    console.log(`[AuthCtrl findUserByEmail] User not found.`);
    return null;
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('[AuthCtrl Login] Request:', { email: email, password: password ? '******' : 'Missing' });

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required.' });
        }

        const result = await findUserByEmail(email);
        if (!result?.user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const { user } = result; // Removed userModelName here as less critical now

        if (!user.password) {
            console.error(`[AuthCtrl Login] Password missing from DB for user ${email}.`);
            return res.status(500).json({ success: false, message: 'Server error (L1).' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // --- Payload Creation ---
        let nameForPayload;
        if (user.role === 'businessOwner') {
            nameForPayload = user.ownerName || user.businessName || 'Business User';
        } else {
            nameForPayload = user.name || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} User`;
        }

        const payload = {
            id: user._id, email: user.email, role: user.role, name: nameForPayload,
            ...(user.role === 'businessOwner' && user.businessName && { businessName: user.businessName }),
        };
        console.log('[AuthCtrl Login] Payload to sign:', payload);
        if (!payload.id || !payload.email || !payload.role || !payload.name) {
             console.error("[AuthCtrl Login] FATAL: Payload missing fields!", payload);
             return res.status(500).json({ success: false, message: "Server error (L2)." });
        }

        // --- Token Signing ---
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("[AuthCtrl Login] FATAL: JWT_SECRET missing!");
            return res.status(500).json({ success: false, message: "Server error (L3)." });
        }
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
        console.log('[AuthCtrl Login] Token generated.');

        // --- Response ---
        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;
        res.status(200).json({ success: true, message: 'Login successful.', token, data: userResponse });

    } catch (error) {
        // Catch errors from findUserByEmail pre-checks OR other unexpected errors
        console.error('[AuthCtrl Login] Error in login handler:', error);
        next(error); // Pass to global error handler
    }
};