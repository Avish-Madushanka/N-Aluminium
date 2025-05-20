const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    console.error("--- Global Error Handler ---");
    console.error("Timestamp:", new Date().toISOString());
    console.error("URL:", req.originalUrl);
    console.error("Message:", err.message);
    if (process.env.NODE_ENV === 'development') console.error("Stack:", err.stack);
    console.error("-----------------------------");

    let errorResponse = { success: false, message: err.message || 'An unexpected server error occurred.' };
    let statusCode = err.statusCode || 500;

    if (err.name === 'ValidationError') { statusCode = 400; errorResponse.message = 'Validation failed.'; errorResponse.errors = Object.values(err.errors).reduce((acc, val) => { acc[val.path] = val.message; return acc; }, {}); }
    else if (err.code === 11000) { statusCode = 400; const field = Object.keys(err.keyValue)[0]; errorResponse.message = `Duplicate field: ${field} must be unique.`; errorResponse.errors = { [field]: `Duplicate value entered.` }; }
    else if (err.name === 'CastError') { statusCode = 400; errorResponse.message = `Invalid data format for field '${err.path}'.`; errorResponse.errors = { [err.path]: `Invalid ${err.kind} value.` }; }
    else if (err.code === 'LIMIT_FILE_SIZE') { statusCode = 400; errorResponse.message = 'File size limit exceeded.'; }
    else if (err.message?.includes('Invalid file type')) { statusCode = 400; errorResponse.message = 'Invalid file type provided.'; }
    else if (!err.statusCode) { statusCode = 500; errorResponse.message = 'Internal server error.'; } // Hide internal details

    res.status(statusCode).json(errorResponse);
};
module.exports = errorHandler;