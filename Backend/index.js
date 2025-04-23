// index.js
const app = require('./server'); // Imports the configured app from server.js
const config = require('./config');
const PORT = config.port;

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// --- Global Handlers for Uncaught Errors ---
// Listen for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
  console.error(err.stack);
  // Optionally close server gracefully
  server.close(() => {
      console.error('Server closed due to Unhandled Rejection');
      process.exit(1);
  });
});

// Listen for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
   // Optionally close server gracefully
  server.close(() => {
      console.error('Server closed due to Uncaught Exception');
      process.exit(1);
  });
});