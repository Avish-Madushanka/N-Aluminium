// config/db.js
const mongoose = require('mongoose');
// const config = require('./config'); // Not strictly needed here as MONGO_URI is from process.env

const connectDB = async () => {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 3) {
    console.log('Disconnecting existing Mongoose connection...');
    await mongoose.disconnect();
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 15,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('connected', () => console.log('Mongoose re-connected to DB'));
    mongoose.connection.on('error', (err) => console.error(`Mongoose connection error: ${err}`));
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from DB'));

  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error('Terminating application due to database connection failure.');
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing Mongoose connection...`);
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination.');
  }
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = connectDB;