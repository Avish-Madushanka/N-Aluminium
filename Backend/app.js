// app.js
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

// Middleware
const errorHandler = require('./middleware/errorHandler'); // Ensure this path is correct

const app = express();

// Enable CORS - configure as needed for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // << UPDATED for :5173
  credentials: true
}));



// Body parser for JSON
app.use(express.json({ limit: '10mb' })); // For JSON payloads, limit can be adjusted
// Body parser for URL-encoded data (not typically used if frontend sends JSON or FormData)
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply to all API routes

// Prevent http param pollution
app.use(hpp());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Centralized Error handler middleware - Should be last
app.use(errorHandler);

module.exports = app;