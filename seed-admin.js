const User = require('./models/User');

/**
 * Seed the admin user if one does not already exist.
 * Expects an active Mongoose connection to already be open.
 */
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@britcore.com' });
        if (adminExists) {
            console.log('Admin user already exists — skipping seed.');
            return;
        }

        const admin = new User({
            name: 'System Admin',
            email: 'admin@britcore.com',
            password: 'admin123',
            role: 'Admin',
            initials: 'SA',
            department: 'Administration',
            status: 'Active'
        });

        await admin.save();
        console.log('Admin user created successfully.');
        console.log('Email: admin@britcore.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
