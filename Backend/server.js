require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const fs = require('fs');

const connectDB = require('./config/db');

console.log('[Server Startup] Initializing: Attempting to load route modules...');
let clientRoutes, bOwnerRoutes, authRoutes, calendarSettingsRoutes,
    bookingRoutes, reviewRoutes, scrapTypeRoutes, shopLocationRoutes, adminRoutes,
    saleItemRoutes, adminStatsRoutes, projectRoutes, itemRoutes, cartRoutes, 
    quotationRoutes, alumniRoutes, buyAndSellRoutes, glassRoutes, aluQuotationRoutes, contactRoutes;

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
itemRoutes = loadRoute('itemRoutes', './routes/itemRoutes');
cartRoutes = loadRoute('cartRoutes', './routes/cartRoutes');
quotationRoutes = loadRoute('quotationRoutes', './routes/quotationRoutes');
alumniRoutes = loadRoute('alumniRoutes', './routes/alumniRoutes');
buyAndSellRoutes = loadRoute('buyAndSellRoutes', './routes/buyAndSellRoutes');
glassRoutes = loadRoute('glassRoutes', './routes/glassRoutes');
aluQuotationRoutes = loadRoute('aluQuotationRoutes', './routes/aluQuotationRoutes');
contactRoutes = loadRoute('contactRoutes', './routes/contactRoutes');

console.log('\n=== BUY AND SELL ROUTES DEBUG ===');
if (buyAndSellRoutes) {
  console.log('✓ buyAndSellRoutes loaded successfully');
  console.log('  Type:', typeof buyAndSellRoutes);
  console.log('  Is Router:', !!buyAndSellRoutes.stack);
  console.log('  Stack length:', buyAndSellRoutes.stack ? buyAndSellRoutes.stack.length : 0);
} else {
  console.error('✗ buyAndSellRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== QUOTATION ROUTES DEBUG ===');
if (quotationRoutes) {
  console.log('✓ quotationRoutes loaded successfully');
  console.log('  Type:', typeof quotationRoutes);
  console.log('  Is Router:', !!quotationRoutes.stack);
  console.log('  Stack length:', quotationRoutes.stack ? quotationRoutes.stack.length : 0);
} else {
  console.error('✗ quotationRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== ALUMNI ROUTES DEBUG ===');
if (alumniRoutes) {
  console.log('✓ alumniRoutes loaded successfully');
  console.log('  Type:', typeof alumniRoutes);
  console.log('  Is Router:', !!alumniRoutes.stack);
  console.log('  Stack length:', alumniRoutes.stack ? alumniRoutes.stack.length : 0);
} else {
  console.error('✗ alumniRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== ITEM ROUTES DEBUG ===');
if (itemRoutes) {
  console.log('✓ itemRoutes loaded successfully');
  console.log('  Type:', typeof itemRoutes);
  console.log('  Is Router:', !!itemRoutes.stack);
  console.log('  Stack length:', itemRoutes.stack ? itemRoutes.stack.length : 0);
} else {
  console.error('✗ itemRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== GLASS ROUTES DEBUG ===');
if (glassRoutes) {
  console.log('✓ glassRoutes loaded successfully');
  console.log('  Type:', typeof glassRoutes);
  console.log('  Is Router:', !!glassRoutes.stack);
  console.log('  Stack length:', glassRoutes.stack ? glassRoutes.stack.length : 0);
} else {
  console.error('✗ glassRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== ALU QUOTATION ROUTES DEBUG ===');
if (aluQuotationRoutes) {
  console.log('✓ aluQuotationRoutes loaded successfully');
  console.log('  Type:', typeof aluQuotationRoutes);
  console.log('  Is Router:', !!aluQuotationRoutes.stack);
  console.log('  Stack length:', aluQuotationRoutes.stack ? aluQuotationRoutes.stack.length : 0);
} else {
  console.error('✗ aluQuotationRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('\n=== CONTACT ROUTES DEBUG ===');
if (contactRoutes) {
  console.log('✓ contactRoutes loaded successfully');
  console.log('  Type:', typeof contactRoutes);
  console.log('  Is Router:', !!contactRoutes.stack);
  console.log('  Stack length:', contactRoutes.stack ? contactRoutes.stack.length : 0);
} else {
  console.error('✗ contactRoutes is NULL or UNDEFINED!');
}
console.log('=== END DEBUG ===\n');

console.log('[Server Startup] Loading controllers and middleware...');
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

console.log('[Server Config] Applying core middleware...');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

if (fs.existsSync(uploadsDirectory)) {
    console.log(`[Server Config] Serving static files from ${uploadsDirectory} at /uploads`);
    const subdirectories = ['saleitems', 'projects', 'profiles', 'items', 'cart', 'alumni', 'quotations'];
    subdirectories.forEach(subDir => {
        const fullSubDirPath = path.join(uploadsDirectory, subDir);
        if (fs.existsSync(fullSubDirPath)) {
            console.log(`[Server Config] 'uploads/${subDir}' subdirectory exists.`);
        } else {
            console.warn(`[Server Config] 'uploads/${subDir}' subdirectory NOT found. Creating...`);
            try {
                fs.mkdirSync(fullSubDirPath, { recursive: true });
                console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
            } catch (err) {
                console.error(`[Server Config] FAILED to create 'uploads/${subDir}' subdirectory: ${err.message}`);
            }
        }
    });
} else {
    console.warn(`[Server Config] 'uploads' directory (${uploadsDirectory}) does not exist. Creating...`);
    try {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
        console.log(`[Server Config] Successfully created 'uploads' directory at ${uploadsDirectory}`);
        const subdirectoriesToCreate = ['saleitems', 'projects', 'profiles', 'items', 'cart', 'alumni', 'quotations'];
        subdirectoriesToCreate.forEach(subDir => {
            const fullSubDirPath = path.join(uploadsDirectory, subDir);
            fs.mkdirSync(fullSubDirPath, { recursive: true });
            console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
        });
    } catch (err) {
        console.error(`[Server Config] FAILED to create 'uploads' directory: ${err.message}`);
    }
}

app.get('/api/health', (req, res) => {
    console.log('[Health Check] /api/health endpoint was hit.');
    res.status(200).json({ 
        status: 'ok', 
        message: 'Backend API is running and healthy.',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working', 
        timestamp: new Date().toISOString() 
    });
});

app.get('/api/test-buy-and-sell', (req, res) => {
    res.json({ 
        message: 'Buy and Sell test endpoint working', 
        timestamp: new Date().toISOString(),
        routes: {
            buyAndSellLoaded: !!buyAndSellRoutes,
            buyAndSellType: buyAndSellRoutes ? typeof buyAndSellRoutes : 'null',
            isRouter: buyAndSellRoutes ? !!buyAndSellRoutes.stack : false
        }
    });
});

app.get('/api/test-quotations', (req, res) => {
  res.json({ 
    message: 'Quotations test endpoint working', 
    timestamp: new Date().toISOString(),
    routes: {
      quotationsLoaded: !!quotationRoutes,
      quotationsType: quotationRoutes ? typeof quotationRoutes : 'null',
      isRouter: quotationRoutes ? !!quotationRoutes.stack : false
    }
  });
});

app.get('/api/test-alumni', (req, res) => {
  res.json({ 
    message: 'Alumni test endpoint working', 
    timestamp: new Date().toISOString(),
    routes: {
      alumniLoaded: !!alumniRoutes,
      alumniType: alumniRoutes ? typeof alumniRoutes : 'null',
      isRouter: alumniRoutes ? !!alumniRoutes.stack : false
    }
  });
});

app.get('/api/test-items', (req, res) => {
  res.json({ 
    message: 'Items test endpoint working', 
    timestamp: new Date().toISOString(),
    routes: {
      itemsLoaded: !!itemRoutes,
      itemsType: itemRoutes ? typeof itemRoutes : 'null',
      isRouter: itemRoutes ? !!itemRoutes.stack : false
    }
  });
});

app.get('/api/test-alu-quotations', (req, res) => {
  res.json({ 
    message: 'Alu Quotations test endpoint working', 
    timestamp: new Date().toISOString(),
    routes: {
      aluQuotationsLoaded: !!aluQuotationRoutes,
      aluQuotationsType: aluQuotationRoutes ? typeof aluQuotationRoutes : 'null',
      isRouter: aluQuotationRoutes ? !!aluQuotationRoutes.stack : false
    }
  });
});

app.get('/api/test-contact', (req, res) => {
  res.json({ 
    message: 'Contact test endpoint working', 
    timestamp: new Date().toISOString(),
    routes: {
      contactLoaded: !!contactRoutes,
      contactType: contactRoutes ? typeof contactRoutes : 'null',
      isRouter: contactRoutes ? !!contactRoutes.stack : false
    }
  });
});

console.log('[Server Config] Mounting routes directly...');

const routeMountMap = new WeakMap();

function mountRoute(app, path, router) {
    if (!router) {
        console.warn(`[Server Config] WARNING: Router for ${path} is null, skipping mount.`);
        return;
    }
    console.log(`[Server Config] Mounting ${path}...`);
    app.use(path, router);
    const stack = app._router.stack;
    for (let i = stack.length - 1; i >= 0; i--) {
        const layer = stack[i];
        if (layer.handle === router) {
            routeMountMap.set(layer, path);
            console.log(`[Server Config] Successfully mounted ${path}`);
            break;
        }
    }
}

mountRoute(app, '/api/auth', authRoutes);
mountRoute(app, '/api/clients', clientRoutes);
mountRoute(app, '/api/b-owners', bOwnerRoutes);
mountRoute(app, '/api/calendar-settings', calendarSettingsRoutes);
mountRoute(app, '/api/bookings', bookingRoutes);
mountRoute(app, '/api/reviews', reviewRoutes);
mountRoute(app, '/api/scrap-types', scrapTypeRoutes);
mountRoute(app, '/api/shop-locations', shopLocationRoutes);
mountRoute(app, '/api/saleitems', saleItemRoutes);
mountRoute(app, '/api/projects', projectRoutes);
mountRoute(app, '/api/admin', adminRoutes);
mountRoute(app, '/api/admin/stats', adminStatsRoutes);
mountRoute(app, '/api/quotations', quotationRoutes);
mountRoute(app, '/api/alumni', alumniRoutes);
mountRoute(app, '/api/buy-and-sell', buyAndSellRoutes);
mountRoute(app, '/api/glass', glassRoutes);
mountRoute(app, '/api/alu-quotations', aluQuotationRoutes);
mountRoute(app, '/api/contact', contactRoutes);

if (itemRoutes) {
    mountRoute(app, '/api/items', itemRoutes);
    console.log('[Server Config] SUCCESS: Mounted itemRoutes at /api/items');
} else {
    console.error('[Server Config] ERROR: itemRoutes is null or undefined!');
    app.use('/api/items', (req, res) => {
        console.log('[Server Config] Fallback: /api/items hit but route not loaded');
        res.status(200).json({ 
            success: true, 
            message: 'Items endpoint - route loading in progress',
            data: []
        });
    });
}

if (cartRoutes) {
    mountRoute(app, '/api/cart', cartRoutes);
    console.log('[Server Config] SUCCESS: Mounted cartRoutes at /api/cart');
} else {
    console.error('[Server Config] ERROR: cartRoutes is null or undefined!');
}

app.use('*', (req, res) => {
    console.log(`[404] ${req.method} ${req.originalUrl} - Route not found`);
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availableRoutes: 'Check server console for registered routes'
    });
});

console.log('\n=== REGISTERED ROUTES ===');

function printRoutes(stack, basePath = '') {
    const routes = [];

    stack.forEach(layer => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            const fullPath = (basePath + layer.route.path).replace(/\/+/g, '/');
            routes.push(`${methods} ${fullPath}`);
        } else if (layer.handle && layer.handle.stack) {
            let mountPath = routeMountMap.get(layer) || '';

            if (!mountPath && layer.regexp) {
                const src = layer.regexp.source;
                const match = src.match(/^\^((?:\\\/[^\\?*()|]+)+)/);
                if (match) {
                    mountPath = match[1].replace(/\\\//g, '/');
                }
            }

            const nestedRoutes = printRoutes(layer.handle.stack, basePath + mountPath);
            routes.push(...nestedRoutes);
        }
    });

    return routes;
}

const allRoutes = printRoutes(app._router.stack);
allRoutes.sort().forEach(route => console.log(route));

console.log('\n=== END ROUTES ===\n');

console.log('[Server Config] Applying global error handler.');
app.use(errorHandler);

const server = http.createServer(app);

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
        if (error.stack) console.error(error.stack);
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!!!!!!!!!!!!!!! UNHANDLED PROMISE REJECTION !!!!!!!!!!!!!!!!');
    console.error('Reason:', reason.message || reason);
    if (reason && reason.stack) console.error(reason.stack);
    console.error('Promise:', promise);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        server.close(() => { process.exit(1); });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('!!!!!!!!!!!!!!!! UNCAUGHT EXCEPTION !!!!!!!!!!!!!!!!');
    console.error('Error:', err.message);
    if (err.stack) console.error(err.stack);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        server.close(() => { process.exit(1); });
    } else {
        process.exit(1);
    }
});

startServer();