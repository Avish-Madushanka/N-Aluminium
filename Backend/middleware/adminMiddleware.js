// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const BusinessOwner = require('../models/bOwnerModel'); // Assuming Admins are BOwners with role 'admin'
// Or import an Admin model if you have a separate one
const config = require('../config');

exports.protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);

            // Find user - could be Client, BOwner, or a dedicated Admin model
            // This example assumes admins are BusinessOwners with role 'admin'
            req.user = await BusinessOwner.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            // Check for admin role
            if (req.user.role !== 'admin') {
               return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
            }

            next();
        } catch (error) {
            console.error('Admin Token Verification Error:', error.message);
            if (error.name === 'JsonWebTokenError') { return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' }); }
            else if (error.name === 'TokenExpiredError') { return res.status(401).json({ success: false, message: 'Not authorized, token has expired' }); }
            else { return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' }); }
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};