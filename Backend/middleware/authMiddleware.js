const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');

console.log('[AuthMiddleware] Module loaded.');
console.log('[AuthMiddleware] Post-Import Check - BusinessOwner Type:', typeof BusinessOwner, 'Has findById:', typeof BusinessOwner?.findById === 'function');

exports.protect = async (req, res, next) => {
    console.log(`[Auth Protect] Running for: ${req.method} ${req.originalUrl}`);
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        console.warn('[Auth Protect] No token provided.');
        return res.status(401).json({ success: false, message: 'Not authorized, no token.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET missing in environment");

        console.log('[Auth Protect] Verifying token...');
        const decoded = jwt.verify(token, jwtSecret);
        console.log('[Auth Protect] Token decoded:', decoded);

        if (!decoded.id || !decoded.role) {
            console.error('[Auth Protect] Token payload missing id or role.');
            return res.status(401).json({ success: false, message: 'Not authorized (invalid token payload).' });
        }

        let user = null;
        const UserModel =
            decoded.role === 'client' ? Client :
            decoded.role === 'businessOwner' ? BusinessOwner :
            decoded.role === 'admin' ? Admin : null;

        if (!UserModel || typeof UserModel.findById !== 'function') {
            console.error(`[Auth Protect] Invalid or non-existent Mongoose model determined for role: ${decoded.role}`);
            return res.status(500).json({ success: false, message: 'Server configuration error (Auth M1).' });
        }

        console.log(`[Auth Protect] Fetching user from DB. Model: ${UserModel.modelName}, ID: ${decoded.id}`);
        user = await UserModel.findById(decoded.id);

        if (!user) {
            console.warn(`[Auth Protect] User not found in DB. ID: ${decoded.id}, Role: ${decoded.role}`);
            return res.status(401).json({ success: false, message: 'User belonging to token no longer exists.' });
        }

        req.user = user;
        console.log(`[Auth Protect] SUCCESS. User attached: ID ${req.user.id}, Role ${req.user.role}`);
        next();

    } catch (err) {
        console.error('[Auth Protect] Token verification/user fetch failed:', err);
        let message = 'Not authorized.';
        let statusCode = 401;
        if (err.name === 'JsonWebTokenError') message = 'Not authorized (invalid token).';
        else if (err.name === 'TokenExpiredError') message = 'Not authorized (token expired).';
        else if (err.message?.includes('model invalid')) { statusCode = 500; message = err.message; }
        else if (err.message?.includes('JWT_SECRET missing')) { statusCode = 500; message = 'Server configuration error (Auth S1).'; }
        return res.status(statusCode).json({ success: false, message: message });
    }
};

exports.authorize = (...roles) => {
    console.log(`[Auth Authorize] Setup for roles: ${roles.join(', ')}`);
    return (req, res, next) => {
        if (!req.user?.role) {
            console.error('[Auth Authorize] FAILED: req.user.role missing.');
            return res.status(401).json({ success: false, message: 'User authentication context missing.' });
        }
        const userRole = req.user.role;
        console.log(`[Auth Authorize] Checking role: User='${userRole}', Allowed='${roles.join(', ')}'`);
        if (!roles.includes(userRole)) {
            console.warn(`[Auth Authorize] FAILED: Role '${userRole}' not in required: ${roles.join(', ')}`);
            return res.status(403).json({ success: false, message: `Access denied. Required role(s): ${roles.join(', ')}` });
        }
        console.log(`[Auth Authorize] SUCCESS: Role '${userRole}' allowed.`);
        next();
    };
};

exports.checkOwnershipOrAdmin = (Model = null) => {
    console.log('[Auth CheckOwnership] Setup.');
    return async (req, res, next) => {
        const resourceId = req.params.id;
        const loggedInUserId = req.user?.id;
        const loggedInUserRole = req.user?.role;

        console.log(`[Auth CheckOwnership] Checking resource: ${resourceId}. User: ${loggedInUserId}, Role: ${loggedInUserRole}`);

        if (!loggedInUserId) {
            console.warn('[Auth CheckOwnership] FAILED: User not found on request.');
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
            console.warn(`[Auth CheckOwnership] FAILED: Invalid/missing resource ID: ${resourceId}`);
            return res.status(400).json({ success: false, message: 'Valid resource identifier required.' });
        }

        if (loggedInUserRole === 'admin') {
            console.log(`[Auth CheckOwnership] Access GRANTED: User is admin.`);
            return next();
        }

        if (loggedInUserId === resourceId) {
            console.log(`[Auth CheckOwnership] Access GRANTED: User ID matches resource ID.`);
            return next();
        }

        console.warn(`[Auth CheckOwnership] Authorization FAILED: User ID '${loggedInUserId}' cannot access resource '${resourceId}'.`);
        return res.status(403).json({ success: false, message: 'You are not authorized to access or modify this specific resource.' });
    };
};
