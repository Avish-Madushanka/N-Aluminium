
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');

const findUserByEmail = async (email) => {
    // Email is already lowercased by the caller (login function)
    console.log(`[AuthCtrl findUserByEmail] Searching for email: "${email}"`);
    let user = await Client.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl findUserByEmail] Found in Clients.`);
        return { user, userModelName: 'Client' };
    }
    user = await BusinessOwner.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl findUserByEmail] Found in BusinessOwners.`);
        return { user, userModelName: 'BusinessOwner' };
    }
    user = await Admin.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl findUserByEmail] Found in Admins.`);
        return { user, userModelName: 'Admin' };
    }
    console.log(`[AuthCtrl findUserByEmail] User not found.`);
    return null;
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    // Capture original email for logging, then normalize for processing
    const originalEmail = email;
    console.log('[AuthCtrl Login] Endpoint hit. Request body:', { email: originalEmail, password: password ? '******' : 'Missing' });

    try {
        if (!originalEmail || !password) {
            console.log('[AuthCtrl Login] Validation Failed: Email/Password missing.');
            return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
        }

        const normalizedEmail = originalEmail.toLowerCase(); // Normalize email to lowercase

        console.log(`[AuthCtrl Login] Finding user: ${normalizedEmail} (normalized from ${originalEmail})`);
        const result = await findUserByEmail(normalizedEmail); // Use normalized email for lookup
        if (!result || !result.user) {
            console.log(`[AuthCtrl Login] Failure: User not found: ${originalEmail}`); // Log original for clarity
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const { user, userModelName } = result;
        console.log(`[AuthCtrl Login] User found in ${userModelName}. ID: ${user._id}, Role: ${user.role}`);
        console.log(`[AuthCtrl Login] Password status for ${user.email}: ${user.password ? 'Retrieved' : 'NOT RETRIEVED!'}`); // user.email is already lowercase from DB

        if (!user.password) {
            console.error(`[AuthCtrl Login] CRITICAL SERVER FAILURE: Password field missing for user ${user.email}.`);
            return res.status(500).json({ success: false, message: 'Internal server error during login (code: L1).' });
        }

        console.log(`[AuthCtrl Login] Comparing passwords for ${user.email}...`);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[AuthCtrl Login] Failure: Password mismatch for ${user.email}.`);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        console.log(`%c[AuthCtrl Login] Auth successful: ${user.email}. Role: ${user.role}. Preparing payload...`, 'color: green; font-weight: bold;');
        let nameForPayload;
        if (user.role === 'businessOwner') {
            nameForPayload = user.ownerName || user.businessName || 'Business User';
        } else {
            nameForPayload = user.name || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} User`;
        }
        console.log(`[AuthCtrl Login] Determined JWT 'name': "${nameForPayload}"`);

        const payload = {
            id: user._id,
            email: user.email, // user.email is already lowercase from the database
            role: user.role,
            name: nameForPayload,
            ...(user.role === 'businessOwner' && user.businessName && { businessName: user.businessName }),
        };
        console.log('[AuthCtrl Login] Final JWT Payload to be signed:', payload);
        if (!payload.id || !payload.email || !payload.role || !payload.name) {
             console.error("[AuthCtrl Login] FATAL ERROR: Payload missing essential fields before signing!", payload);
             return res.status(500).json({ success: false, message: "Internal server error creating session (code: L2)." });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("[AuthCtrl Login] CRITICAL FAILURE: JWT_SECRET missing in .env!");
            return res.status(500).json({ success: false, message: "Server configuration error (code: L3)." });
        }
        console.log('[AuthCtrl Login] JWT_SECRET found. Signing token...');

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
        console.log('[AuthCtrl Login] JWT Token generated.');

        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            data: userResponse
        });

    } catch (error) {
        console.error('[AuthCtrl Login] Unexpected error occurred in login controller:', error);
        next(error);
    }
};