// backend/controllers/authController.js
// FINAL CORRECTED VERSION (as of previous discussions)

const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');
// bcryptjs is not directly used here; comparison is done via model methods

/**
 * Helper: Finds user across collections, selects password for comparison.
 */
const findUserByEmail = async (email) => {
    console.log(`[AuthCtrl findUserByEmail] Searching for email: "${email}"`);
    // Explicitly select password (+password) because it's select:false in the schemas
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

/**
 * Login Handler: Authenticates user and generates JWT.
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('[AuthCtrl Login] Endpoint hit. Request body:', { email: email, password: password ? '******' : 'Missing' });

    try {
        // 1. Input Validation
        if (!email || !password) {
            console.log('[AuthCtrl Login] Validation Failed: Email/Password missing.');
            return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
        }

        // 2. Find User
        console.log(`[AuthCtrl Login] Finding user: ${email}`);
        const result = await findUserByEmail(email);
        if (!result || !result.user) {
            console.log(`[AuthCtrl Login] Failure: User not found: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const { user, userModelName } = result;
        console.log(`[AuthCtrl Login] User found in ${userModelName}. ID: ${user._id}, Role: ${user.role}`);
        console.log(`[AuthCtrl Login] Password status for ${email}: ${user.password ? 'Retrieved' : 'NOT RETRIEVED!'}`);

        // 3. Check if Password was Retrieved
        if (!user.password) {
            console.error(`[AuthCtrl Login] CRITICAL SERVER FAILURE: Password field missing for user ${email}.`);
            return res.status(500).json({ success: false, message: 'Internal server error during login (code: L1).' });
        }

        // 4. Compare Passwords
        console.log(`[AuthCtrl Login] Comparing passwords for ${email}...`);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[AuthCtrl Login] Failure: Password mismatch for ${email}.`);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // --- 5. Authentication Successful - Prepare JWT Payload ---
        console.log(`%c[AuthCtrl Login] Auth successful: ${email}. Role: ${user.role}. Preparing payload...`, 'color: green; font-weight: bold;');
        let nameForPayload;
        if (user.role === 'businessOwner') {
            nameForPayload = user.ownerName || user.businessName || 'Business User';
        } else {
            nameForPayload = user.name || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} User`;
        }
        console.log(`[AuthCtrl Login] Determined JWT 'name': "${nameForPayload}"`);

        const payload = {
            id: user._id,           // Essential
            email: user.email,      // Essential
            role: user.role,        // Essential
            name: nameForPayload,   // Essential (now correctly derived)
            ...(user.role === 'businessOwner' && user.businessName && { businessName: user.businessName }), // Optional extra field
        };
        console.log('[AuthCtrl Login] Final JWT Payload to be signed:', payload);
        if (!payload.id || !payload.email || !payload.role || !payload.name) {
             console.error("[AuthCtrl Login] FATAL ERROR: Payload missing essential fields before signing!", payload);
             return res.status(500).json({ success: false, message: "Internal server error creating session (code: L2)." });
        }

        // 6. Check JWT Secret
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("[AuthCtrl Login] CRITICAL FAILURE: JWT_SECRET missing in .env!");
            return res.status(500).json({ success: false, message: "Server configuration error (code: L3)." });
        }
        console.log('[AuthCtrl Login] JWT_SECRET found. Signing token...');

        // 7. Sign JWT Token
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
        console.log('[AuthCtrl Login] JWT Token generated.');

        // 8. Prepare and Send Response
        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            data: userResponse
        });

    } catch (error) {
        // 9. Catch Unexpected Errors
        console.error('[AuthCtrl Login] Unexpected error occurred in login controller:', error);
        next(error); // Pass to global error handler
    }
};