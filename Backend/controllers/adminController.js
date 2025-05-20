const Admin = require('../models/Admin');

exports.createInitialAdmin = async () => {
    try {
        const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
        const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
        const adminName = process.env.INITIAL_ADMIN_NAME;
        if (!adminEmail || !adminPassword || !adminName) { console.warn('[AdminCtrl CreateInitial] Details missing in .env. Skipping.'); return; }
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) { console.log(`[AdminCtrl CreateInitial] Admin ${adminEmail} already exists.`); return; }
        console.log(`[AdminCtrl CreateInitial] Creating admin: ${adminName} (${adminEmail})`);
        const newAdmin = new Admin({ email: adminEmail, password: adminPassword, name: adminName, role: 'admin' });
        await newAdmin.save();
        console.log(`[AdminCtrl CreateInitial] Admin ${adminName} created successfully.`);
    } catch (error) { console.error('[AdminCtrl CreateInitial] Error:', error.message); }
};