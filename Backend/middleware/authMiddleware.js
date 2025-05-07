// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Client = require('../models/ClientModel');         // <-- Ensure this matches your filename
const BusinessOwner = require('../models/bOwnerModel'); // <-- Ensure this matches your filename
const config = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async'); // Assuming async is in the same directory

// Generic protect middleware (can be used if JWT payload has userType/role)
// This is more flexible for a unified /me route.
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) { token = req.cookies.token; }

    if (!token) {
        return next(new ErrorResponse('Not authorized (no token)', 401));
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log("Decoded JWT in protect:", decoded);

        // Attach decoded payload to req.user for general use
        // Specific profile fetching can be done in the actual route handler if needed
        // Or fetch here based on decoded.userType/role
        req.user = { // Store essential decoded info
            id: decoded.id,
            role: decoded.role,
            userType: decoded.userType,
            name: decoded.name,
            email: decoded.email
        };

        // Example: If you want to fetch the full user object here
        // if (decoded.userType === 'client') {
        //   req.user = await Client.findById(decoded.id).select('-password');
        // } else if (decoded.userType === 'bowner') {
        //   req.user = await BusinessOwner.findById(decoded.id).select('-password');
        // }
        // if (!req.user) { return next(new ErrorResponse('User not found', 401)); }

        next();
    } catch (err) {
        console.error('Generic Protect Auth Error:', err.message);
        return next(new ErrorResponse('Not authorized (token invalid/expired)', 401));
    }
});


exports.protectClient = asyncHandler(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       token = req.headers.authorization.split(' ')[1];
   }
   if (!token) { return next(new ErrorResponse('Not authorized (no token)', 401)); }
   try {
       const decoded = jwt.verify(token, config.JWT_SECRET);
       req.client = await Client.findById(decoded.id).select('-password'); // Sets req.client
       if (!req.client) { return next(new ErrorResponse('Not authorized (user not found)', 401)); }
       if (req.client.role !== 'client' && req.client.role !== 'admin') { // Admin might also be a client
          return next(new ErrorResponse('Access denied (invalid role for client route)', 403));
       }
       req.user = req.client; // Also set req.user for consistency if needed by authorize
       next();
   } catch (err) {
        console.error('Client Auth Error:', err.message);
        return next(new ErrorResponse('Not authorized (token invalid)', 401));
   }
});

exports.protectBOwner = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Not authorized (no token)', 401));
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.bOwner = await BusinessOwner.findById(decoded.id).select('-password'); // Sets req.bOwner
        if (!req.bOwner) {
            return next(new ErrorResponse('Not authorized (user not found)', 401));
        }
        if (req.bOwner.role !== 'bowner' && req.bOwner.role !== 'admin') {
            return next(new ErrorResponse(`User role '${req.bOwner.role}' is not authorized`, 403));
        }
        req.user = req.bOwner; // Also set req.user for consistency
        next();
    } catch (err) {
        console.error('BOwner Auth Error:', err.message);
        return next(new ErrorResponse('Not authorized (token invalid/expired)', 401));
    }
});

exports.protectAdmin = asyncHandler(async (req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) { return next(new ErrorResponse('Not authorized (no token)', 401)); }
      try {
          const decoded = jwt.verify(token, config.JWT_SECRET);
          // Admin could be a BOwner with role 'admin'
          let adminUser = await BusinessOwner.findById(decoded.id).select('-password');
          if (!adminUser || adminUser.role !== 'admin') {
              // Or admin could be a Client with role 'admin'
              adminUser = await Client.findById(decoded.id).select('-password');
              if (!adminUser || adminUser.role !== 'admin') {
                  return next(new ErrorResponse('Not authorized (Admin role required, user not found or not admin)', 403));
              }
          }
          req.user = adminUser; // Set req.user for the admin
          next();
      } catch (err) {
          console.error('Admin Auth Error:', err.message);
          return next(new ErrorResponse('Not authorized (token invalid)', 401));
      }
});

// General authorize (can be used after any protect middleware that sets req.user)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
        return next(new ErrorResponse(`User context or role not available for authorization`, 403));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized for this route. Allowed: ${roles.join(', ')}`,
          403
        )
      );
    }
    next();
  };
};