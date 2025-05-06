// server.js
require('dotenv').config(); // <<<< MUST BE THE VERY FIRST LINE >>>>

const app = require('./app');
const connectDB = require('./config/db'); // Ensure this path is correct
const http = require('http');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Uploads directory created at ${uploadDir}`);
  } catch (err) {
    console.error(`Error creating uploads directory: ${err.message}`);
    process.exit(1); // Critical for file uploads
  }
} else {
  console.log(`Uploads directory already exists at ${uploadDir}`);
}

// Connect to database
connectDB();

const PORT = process.env.PORT || 5003;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack); // Log the stack for more details
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack); // Log the stack for more details
  // Close server & exit process
  server.close(() => process.exit(1));
});