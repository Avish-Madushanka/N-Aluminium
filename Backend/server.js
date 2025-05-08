// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// --- Import Routes ---
const clientRoutes = require('./routes/clientRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const authRoutes = require('./routes/authRoutes');
const calendarSettingsRoutes = require('./routes/calendarSettingsRoutes'); // <-- Included

// --- Import Controllers/Middleware ---
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

// --- Core Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`[Server Config] Serving static files from ${path.join(__dirname, 'uploads')} at /uploads`);

// --- API Routes Mounting ---
app.get('/', (req, res) => { res.status(200).send(`Backend API running.`); });
console.log(`[Server Config] Mounting /api/auth routes...`);
app.use('/api/auth', authRoutes);
console.log(`[Server Config] Mounting /api/clients routes...`);
app.use('/api/clients', clientRoutes);
console.log(`[Server Config] Mounting /api/b-owners routes...`);
app.use('/api/b-owners', bOwnerRoutes);
console.log(`[Server Config] Mounting /api/calendar-settings routes...`); // <-- Included
app.use('/api/calendar-settings', calendarSettingsRoutes);              // <-- Included

// --- Global Error Handler (MUST BE LAST) ---
console.log('[Server Config] Adding global error handler.');
app.use(errorHandler);

// --- Database Connection & Server Start ---
console.log('[DB Connection] Attempting connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('[DB Connection] MongoDB Connected.');
        app.listen(PORT, async () => {
            console.log(`[Server Startup] Server listening on http://localhost:${PORT}`);
            await createInitialAdmin();
            console.log('[Server Startup] Ready.');
        });
    })
    .catch(err => {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('[DB Connection] CRITICAL FAILURE:', err.message);
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    });