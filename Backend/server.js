const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const connectDB = require('./db');
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const saleItemRoutes = require('./routes/saleItemRoutes');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/bowners', bOwnerRoutes);
app.use('/api/saleitems', saleItemRoutes);

app.get('/', (req, res) => { res.status(200).send(`API running (${config.nodeEnv})`); });

app.use('/api/*', (req, res, next) => { res.status(404).json({ success: false, message: `API endpoint not found` }); });

app.use((err, req, res, next) => {
    console.error("ERROR:", err.name, "-", err.message);
    console.error(err.stack);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    if (err.name === 'ValidationError') { statusCode = 400; message = Object.values(err.errors).map(val => val.message).join(', '); }
    else if (err.code === 11000) { statusCode = 400; message = `Duplicate field value entered.`; }
    else if (err.name === 'CastError') { statusCode = 400; message = 'Invalid ID format.'; }
    else if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token.'; }
    else if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired.'; }
    res.status(statusCode).json({ success: false, message: message, stack: config.nodeEnv === 'development' ? err.stack : undefined });
});

module.exports = app;