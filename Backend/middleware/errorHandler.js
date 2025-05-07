const errorHandler = (err, req, res, next) => {
    console.error("ERROR STACK:", err.stack);
    console.error("ERROR MESSAGE:", err.message);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Max 5MB allowed.' });
    }
    if (err.message === 'Not an image! Please upload only images.') {
        return res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
    }
    if (err.code === 11000) {
        let field = Object.keys(err.keyValue)[0];
        field = field.charAt(0).toUpperCase() + field.slice(1);
        return res.status(400).json({ message: `${field} already exists.` });
    }
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }

    res.status(err.statusCode || 500).json({
        success: false, // Add success false for errors
        message: err.message || 'An unexpected server error occurred.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;