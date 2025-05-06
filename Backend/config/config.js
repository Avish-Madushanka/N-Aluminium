// config/config.js
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_if_not_in_env_for_dev_only',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 1024 * 1024 * 5, // 5MB default
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(',')
      : ['image/jpeg', 'image/png', 'image/gif'] // Default allowed types
  };