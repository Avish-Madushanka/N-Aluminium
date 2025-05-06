// utils/errorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode, errors = null) { // Added errors parameter
    super(message);
    this.statusCode = statusCode;
    if (errors) { // If Mongoose validation errors are passed
      this.errors = errors;
    }
    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;