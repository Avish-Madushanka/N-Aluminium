const Admin = require('../models/Admin');

exports.createInitialAdmin = async () => {
    try {
        const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
        const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
        const adminName = process.env.INITIAL_ADMIN_NAME;

        if (!adminEmail || !adminPassword || !adminName) {
            console.warn('[AdminCtrl CreateInitial] Initial admin email, password, or name not set in .env. Skipping initial admin creation.');
            return;
        }

        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`[AdminCtrl CreateInitial] Initial admin with email ${adminEmail} already exists.`);
            return;
        }

        console.log(`[AdminCtrl CreateInitial] Creating initial admin: ${adminName} (${adminEmail})`);
        const newAdmin = new Admin({
            email: adminEmail,
            password: adminPassword, // Password will be hashed by the pre-save hook in Admin.js
            name: adminName,
            role: 'admin'
        });
        await newAdmin.save(); // This triggers the pre-save hook
        console.log(`[AdminCtrl CreateInitial] Initial admin user ${adminName} created successfully.`);

    } catch (error) {
        console.error('[AdminCtrl CreateInitial] Error creating initial admin user:', error.message);
        // Consider if you want to throw the error to halt server startup on critical failure
    }
};