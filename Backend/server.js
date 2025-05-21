// --- START OF FILE server.js ---
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const actualPath = require('path');
const actualHttp = require('http');
const fs = require('fs');

const connectDB = require('./config/db');

console.log('[Server Startup] Initializing: Attempting to load route modules...');
let clientRoutes, bOwnerRoutes, authRoutes, calendarSettingsRoutes,
    bookingRoutes, reviewRoutes, scrapTypeRoutes, shopLocationRoutes, adminRoutes,
    saleItemRoutes, adminStatsRoutes, projectRoutes; // <-- Added projectRoutes

const loadRoute = (routeName, path) => {
  try {
    const routeModule = require(path);
    console.log(`[Server Startup] Successfully loaded ${routeName} from ${path}. Type: ${typeof routeModule}`);
    if (typeof routeModule !== 'function' && (typeof routeModule !== 'object' || !routeModule.stack)) {
      console.warn(`[Server Startup] WARNING: ${routeName} loaded from ${path}, but it does not appear to be an Express router. Check module.exports in that file.`);
    }
    return routeModule;
  } catch (e) {
    console.error(`[Server Startup] FAILED to load ${routeName} from ${path}: ${e.message}`);
    if (process.env.NODE_ENV === 'development') console.error(e.stack);
    return null;
  }
};

clientRoutes = loadRoute('clientRoutes', './routes/clientRoutes');
bOwnerRoutes = loadRoute('bOwnerRoutes', './routes/bOwnerRoutes');
authRoutes = loadRoute('authRoutes', './routes/authRoutes');
calendarSettingsRoutes = loadRoute('calendarSettingsRoutes', './routes/calendarSettingsRoutes');
bookingRoutes = loadRoute('bookingRoutes', './routes/bookingRoutes');
reviewRoutes = loadRoute('reviewRoutes', './routes/reviewRoutes');
scrapTypeRoutes = loadRoute('scrapTypeRoutes', './routes/scrapTypeRoutes');
shopLocationRoutes = loadRoute('shopLocationRoutes', './routes/shopLocationRoutes');
adminRoutes = loadRoute('adminRoutes', './routes/adminRoutes'); 
saleItemRoutes = loadRoute('saleItemRoutes', './routes/saleItemRoutes');
adminStatsRoutes = loadRoute('adminStatsRoutes', './routes/adminStatsRoutes'); 
projectRoutes = loadRoute('projectRoutes', './routes/projectRoutes'); 

console.log('[Server Startup] Loading controllers and middleware...');
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

console.log('[Server Config] Applying core middleware...');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadsDirectory = actualPath.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

if (fs.existsSync(uploadsDirectory)) {
    console.log(`[Server Config] Serving static files from ${uploadsDirectory} at /uploads`);
    const subdirectories = ['saleitems', 'projects', 'profiles']; 
    subdirectories.forEach(subDir => {
        const fullSubDirPath = actualPath.join(uploadsDirectory, subDir);
        if (fs.existsSync(fullSubDirPath)) {
            console.log(`[Server Config] 'uploads/${subDir}' subdirectory exists.`);
        } else {
            console.warn(`[Server Config] 'uploads/${subDir}' subdirectory NOT found. It should be created by relevant uploadMiddleware.`);
        }
    });
} else {
    console.warn(`[Server Config] 'uploads' directory (${uploadsDirectory}) does not exist. Static file serving for /uploads might not work as expected. Attempting to create...`);
    try {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
        console.log(`[Server Config] Successfully created 'uploads' directory at ${uploadsDirectory}`);
        const subdirectoriesToCreate = ['saleitems', 'projects', 'profiles'];
        subdirectoriesToCreate.forEach(subDir => {
            const fullSubDirPath = actualPath.join(uploadsDirectory, subDir);
            if (!fs.existsSync(fullSubDirPath)) {
                fs.mkdirSync(fullSubDirPath, { recursive: true });
                console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
            }
        });
    } catch (err) {
        console.error(`[Server Config] FAILED to create 'uploads' directory or subdirectories: ${err.message}`);
    }
}


app.get('/api/health', (req, res) => {
    console.log('[Health Check] /api/health endpoint was hit.');
    res.status(200).json({ status: 'ok', message: 'Backend API is running and healthy.' });
});

const mountRoutes = () => {
    console.log('[Server Config] Starting route mounting process...');

    const mount = (path, routerModule, routerName) => {
        if (routerModule && (typeof routerModule === 'function' || (typeof routerModule === 'object' && routerModule.stack))) {
            app.use(path, routerModule);
            console.log(`[Server Config] SUCCESS: Mounted ${routerName} at ${path}`);
        } else {
            console.error(`[Server Config] ERROR: ${routerName} (for ${path}) was NOT mounted. Module is ${routerModule === null ? 'null (failed to load)' : 'not an Express router or undefined'}.`);
        }
    };

    mount('/api/auth', authRoutes, 'authRoutes');
    mount('/api/clients', clientRoutes, 'clientRoutes');
    mount('/api/b-owners', bOwnerRoutes, 'bOwnerRoutes');
    mount('/api/calendar-settings', calendarSettingsRoutes, 'calendarSettingsRoutes');
    mount('/api/bookings', bookingRoutes, 'bookingRoutes');
    mount('/api/reviews', reviewRoutes, 'reviewRoutes');
    mount('/api/scrap-types', scrapTypeRoutes, 'scrapTypeRoutes');
    mount('/api/shop-locations', shopLocationRoutes, 'shopLocationRoutes');
    mount('/api/saleitems', saleItemRoutes, 'saleItemRoutes');
    mount('/api/projects', projectRoutes, 'projectRoutes'); 

    mount('/api/admin', adminRoutes, 'adminRoutes'); 
    mount('/api/admin/stats', adminStatsRoutes, 'adminStatsRoutes');

    console.log('[Server Config] Route mounting process completed.');
};

mountRoutes();

console.log('[Server Config] Applying global error handler.');
app.use(errorHandler);

const server = actualHttp.createServer(app);

const startServer = async () => {
    try {
        console.log('[Server Startup] Attempting to connect to MongoDB...');
        await connectDB();

        server.listen(PORT, async () => {
            console.log(`[Server Startup] SERVER LISTENING on http://localhost:${PORT}`);
            console.log(`[Server Startup] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`[Server Startup] Frontend URL configured for CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

            try {
                console.log('[Server Startup] Attempting to create initial admin user...');
                await createInitialAdmin();
            } catch (adminError) {
                console.error("[Server Startup] Error during initial admin creation:", adminError.message);
            }
            console.log('[Server Startup] Application is ready and running.');
        });
    } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('[Server Startup] CRITICAL FAILURE TO START SERVER:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!!!!!!!!!!!!!!! UNHANDLED PROMISE REJECTION !!!!!!!!!!!!!!!!');
    console.error('Reason:', reason.message || reason);
    if (reason && reason.stack) {
        console.error(reason.stack);
    }
    console.error('Promise:', promise);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        console.log('Closing server due to unhandled rejection...');
        server.close(() => {
            console.error('Server closed.');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('!!!!!!!!!!!!!!!! UNCAUGHT EXCEPTION !!!!!!!!!!!!!!!!');
    console.error('Error:', err.message);
    if (err.stack) {
        console.error(err.stack);
    }
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        console.log('Closing server due to uncaught exception...');
        server.close(() => {
            console.error('Server closed.');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});


startServer();