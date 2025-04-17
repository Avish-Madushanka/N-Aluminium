// --- START OF FILE middleware/authMiddleware.js ---
const jwt = require('jsonwebtoken');
const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const config = require('../config');

exports.protectClient = async (req, res, next) => {
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await Client.findById(decoded.id).select('-password');
      if (!req.user) {
           return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists' });
      }
      next();
    } catch (error) {
      console.error('Token verification failed (Client Protect):', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' });
      } else if (error.name === 'TokenExpiredError') {
           return res.status(401).json({ success: false, message: 'Not authorized, token has expired' });
      } else {
          return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
      }
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

exports.protectBOwner = async (req, res, next) => {
    let token;
    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await BusinessOwner.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error('Token verification failed (BOwner Protect):', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Not authorized, token has expired' });
            } else {
                return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
            }
        }
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ success: false, message: 'User not found for authorization check.' });
    }
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role '${req.user.role || 'N/A'}' is not authorized.` });
    }
    next();
  };
};
// --- END OF FILE middleware/authMiddleware.js ---