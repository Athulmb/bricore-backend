const User = require('./models/User');

const seedAdmin = async () => {
    const adminExists = await User.findOne({ email: 'admin@britcore.com' });
    if (adminExists) {
        console.log('Admin already exists');
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
    console.log('Admin user created successfully');
    console.log('Email: admin@britcore.com');
    console.log('Password: admin123');
};

module.exports = seedAdmin;
