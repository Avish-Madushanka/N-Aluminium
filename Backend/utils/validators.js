exports.validateRegistration = (data) => {
    const errors = {};

    const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const password = typeof data.password === 'string' ? data.password : '';
    const confirmPassword = typeof data.confirmPassword === 'string' ? data.confirmPassword : '';

    if (!fullName) errors.fullName = 'Full name is required.';
    else if (fullName.length < 3 || fullName.length > 50) errors.fullName = 'Full name must be 3-50 characters.';
    else if (!/^[a-zA-Z\s]+$/.test(fullName)) errors.fullName = 'Full name can only contain letters and spaces.';

    if (!email) errors.email = 'Email is required.';
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errors.email = 'Provide a valid email.';

    if (!phone) errors.phone = 'Phone number is required.';
    else if (!/^[0-9]{10}$/.test(phone)) errors.phone = 'Provide a valid 10-digit phone number.';

    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
};