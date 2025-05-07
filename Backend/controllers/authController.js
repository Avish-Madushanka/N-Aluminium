const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');
// bcryptjs is not directly used here anymore as comparePassword is on the model

// Helper function to find user across collections
const findUserByEmail = async (email) => {
    console.log(`[AuthCtrl] findUserByEmail: Searching for email: ${email}`);

    // When fetching user for login, explicitly select the password field
    let user = await Client.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl] findUserByEmail: Found in Clients collection.`);
        return { user, userModelName: 'Client' };
    }

    user = await BusinessOwner.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl] findUserByEmail: Found in BusinessOwners collection.`);
        return { user, userModelName: 'BusinessOwner' };
    }

    user = await Admin.findOne({ email }).select('+password');
    if (user) {
        console.log(`[AuthCtrl] findUserByEmail: Found in Admins collection.`);
        return { user, userModelName: 'Admin' };
    }

    console.log(`[AuthCtrl] findUserByEmail: User not found with email: ${email}`);
    return null; // User not found in any collection
};

exports.login = async (req, res, next) => {
    console.log('[AuthCtrl] Login endpoint hit. Request body:', req.body);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('[AuthCtrl] Login validation failed: Email or password missing from request body.');
            return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
        }

        console.log(`[AuthCtrl] Attempting to find user with email: ${email}`);
        const result = await findUserByEmail(email);

        if (!result || !result.user) {
            console.log(`[AuthCtrl] Login failed: No user found in any collection for email: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const { user, userModelName } = result;
        console.log(`[AuthCtrl] User found in ${userModelName}. User ID: ${user._id}, Role: ${user.role}, Name: ${user.name}`);
        console.log(`[AuthCtrl] Password field from DB for ${email}: ${user.password ? 'Retrieved' : 'NOT RETRIEVED (CRITICAL: Check .select(\'+password\') in findUserByEmail AND select:false in model)'}`);

        if (!user.password) {
            // This case should ideally be prevented by .select('+password')
            console.error(`[AuthCtrl] CRITICAL FAILURE: Password field was not retrieved for user ${email} from ${userModelName} model. Cannot compare.`);
            return res.status(500).json({ success: false, message: 'Server configuration error during login (password field missing).' });
        }
        
        console.log(`[AuthCtrl] Comparing provided password with stored hash for user: ${email}`);
        // Use the comparePassword method defined on the specific user model instance
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log(`[AuthCtrl] Login failed: Password mismatch for email: ${email}.`);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        console.log(`%c[AuthCtrl] Login successful for: ${email}. User role: ${user.role}`, 'color: green; font-weight: bold;');
        
        // User is authenticated, create JWT
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name, // Ensure 'name' exists on all user models
            // Conditionally add businessName if user is a businessOwner and has it
            ...(user.role === 'businessOwner' && user.businessName && { businessName: user.businessName }),
        };
        console.log('[AuthCtrl] JWT Payload to be signed:', payload);

        if (!process.env.JWT_SECRET) {
            console.error("[AuthCtrl] CRITICAL FAILURE: JWT_SECRET is not defined in .env file. Cannot sign token.");
            return res.status(500).json({ success: false, message: "Server configuration error (JWT secret missing)." });
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d' // Example: token expires in 1 day
        });
        console.log('[AuthCtrl] JWT Token generated successfully.');

        // Prepare user data to send back to client (excluding password)
        const userResponse = { ...user._doc }; // Use ._doc to get a plain object from Mongoose document
        delete userResponse.password; // Explicitly remove password if it somehow got included

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            data: userResponse // Send sanitized user data (id, email, role, name, etc.)
        });

    } catch (error) {
        console.error('[AuthCtrl] Unexpected error in login controller:', error);
        // Pass the error to the global error handler for consistent error response
        next(error); // This will go to your errorHandler middleware in server.js
    }
};