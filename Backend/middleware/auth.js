// middleware/auth.js
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const Client = require('../models/Client');
const config = require('../config/config'); // For JWT_SECRET

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Optional: Set token from cookie if you decide to use cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route (no token)', 401));
  }

  try {
    // Verify token
    if (!config.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined for token verification.');
        return next(new ErrorResponse('Server configuration error', 500));
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.client = await Client.findById(decoded.id).select('-password');

    if (!req.client) {
        return next(new ErrorResponse('Not authorized to access this route (user not found)', 401));
    }

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return next(new ErrorResponse('Not authorized to access this route (token invalid/expired)', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.client || !req.client.role) { // Defensive check
        return next(
            new ErrorResponse(`User role not available for authorization`, 403)
          );
    }
    if (!roles.includes(req.client.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.client.role}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}`,
          403
        )
      );
    }
    next();
  };
};