// utils/validators.js

// Basic validation for registration, Mongoose handles more complex cases
exports.validateRegistration = (data) => {
  const errors = {};

  // Name
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.name = 'Name is required and must be at least 3 characters.';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Name cannot be more than 50 characters.';
  }

  // Email
  if (!data.email || typeof data.email !== 'string' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())) {
    errors.email = 'A valid email is required.';
  }

  // Contact Number
  if (!data.contactNumber || typeof data.contactNumber !== 'string' || !/^[0-9]{10}$/.test(data.contactNumber.trim())) {
    errors.contactNumber = 'A valid 10-digit contact number is required.';
  }

  // Password
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.password = 'Password is required and must be at least 6 characters.';
  }

  // Confirm Password - CRUCIAL: Frontend must send this field!
  if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
      errors.confirmPassword = 'Confirm password is required.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Address
  if (!data.address || typeof data.address !== 'string' || data.address.trim().length < 10) {
    errors.address = 'Address is required and must be at least 10 characters.';
  } else if (data.address.trim().length > 200) { // Example max length
      errors.address = 'Address cannot be more than 200 characters.';
  }

  // District - Basic check, Mongoose enum will handle specific values
  if (!data.district || typeof data.district !== 'string' || data.district.trim() === '') {
      errors.district = 'District is required.';
  }

  // Province - Basic check, Mongoose enum will handle specific values
  if (!data.province || typeof data.province !== 'string' || data.province.trim() === '') {
      errors.province = 'Province is required.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// You can add more validators here, e.g., for login
exports.validateLogin = (data) => {
  const errors = {};
  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
      errors.email = 'Email is required.';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.trim() === '') {
      errors.password = 'Password is required.';
  }
  return {
      errors,
      isValid: Object.keys(errors).length === 0,
  };
};