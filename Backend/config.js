// --- START OF FILE config.js ---
require('dotenv').config();

const config = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}
if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the .env file.");
  process.exit(1);
}

module.exports = config;
// --- END OF FILE config.js ---