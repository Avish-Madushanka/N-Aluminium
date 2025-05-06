// app.js (Backend)
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Route files
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
// Import admin routes if you have them
// const adminRoutes = require('./routes/adminRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enable CORS - Ensure frontend origin is allowed
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Or your specific frontend port
  credentials: true
}));


// Body parser for JSON
app.use(express.json({ limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply limiter to API routes

// Prevent http param pollution
app.use(hpp());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- NEW: Simple Root Route for Status Check / Ping ---
app.get('/', (req, res) => {
    // You can add more checks here if needed (e.g., DB connection status)
    // For now, just confirming the Express app is running
    res.status(200).json({ status: 'ok', message: 'Backend service is running' });
});
// --- END OF NEW ROUTE ---

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
// Mount admin routes if applicable
// app.use('/api/admin', adminRoutes);


// Centralized Error handler middleware - Should be last
app.use(errorHandler);

module.exports = app;