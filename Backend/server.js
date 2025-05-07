require('dotenv').config(); // Ensures .env variables are loaded first
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const authRoutes = require('./routes/authRoutes');

// Import controllers/middleware
const { createInitialAdmin } = require('./controllers/adminController'); // Correct path
const errorHandler = require('./middleware/errorHandler'); // Correct path

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the 'uploads' directory (for profile/cover photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API Routes
app.get('/', (req, res) => { // Basic root path for backend status check
    res.status(200).send(`N-Aluminum Backend is alive and running on port ${PORT}!`);
});
app.use('/api/clients', clientRoutes);
app.use('/api/b-owners', bOwnerRoutes);
app.use('/api/auth', authRoutes); // Mount authentication routes


// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('[DB Connection] Successfully connected to MongoDB Atlas.');
        app.listen(PORT, async () => {
            console.log(`[Server Startup] Backend server is running on http://localhost:${PORT}`);
            // Attempt to create initial admin user if not exists
            await createInitialAdmin();
        });
    })
    .catch(err => {
        console.error('[DB Connection] MongoDB connection error:', err.message);
        console.error('Full error object:', err); // Log full error for more details
        console.error('Halting application due to DB connection failure.');
        process.exit(1); // Exit process if DB connection fails critically
    });