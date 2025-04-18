require('dotenv').config();

const config = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.mongoURI || !config.jwtSecret) {
  console.error("FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env");
  process.exit(1);
}

module.exports = config;