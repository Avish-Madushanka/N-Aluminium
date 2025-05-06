// middleware/errorHandler.js
const ErrorResponse = require('../utils/errorResponse'); // Ensure this path is correct

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500; // Ensure statusCode is set

  // Log to console for dev (always useful)
  console.error('--- ERROR HANDLER ---');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Error Stack:');
  console.error(err.stack); // Use console.error
  if (err.errors) console.error('Validation Errors:', err.errors);


  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value} (Invalid ID format)`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue)[0];
    field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
    const message = `${field} '${err.keyValue[field]}' already exists. Please use a different ${field.toLowerCase()}.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    // If ErrorResponse was instantiated with an errors object, it will be included.
    // Otherwise, create a general message.
    const message = `Validation Failed: ${messages.join('. ')}`;
    error = new ErrorResponse(message, 400, err.errors); // Pass original Mongoose errors if needed
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ErrorResponse(message, 401);
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  // Multer errors (file size, type etc.)
  if (err.code && err.code.startsWith('LIMIT_')) { // Common Multer error codes
    const message = err.message || 'File upload error. Please check file size or type.';
    error = new ErrorResponse(message, 400);
  }


  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    // Conditionally send detailed errors in development
    ...(process.env.NODE_ENV === 'development' && error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && err.stack && { stack: err.stack.split('\n') })
  });
};

module.exports = errorHandler;