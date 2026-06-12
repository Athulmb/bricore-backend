const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        const { MONGOUSER, MONGOPASSWORD, MONGOHOST, MONGOPORT } = process.env;

        if (!MONGOUSER || !MONGOPASSWORD || !MONGOHOST || !MONGOPORT) {
            console.error(
                'Missing required MongoDB environment variables. ' +
                'Expected: MONGOUSER, MONGOPASSWORD, MONGOHOST, MONGOPORT'
            );
            process.exit(1);
        }

        const mongoURI = `mongodb://${MONGOUSER}:${MONGOPASSWORD}@MongoDB-KLRD.railway.internal:27017/admin`;

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email: 'admin@britcore.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
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
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
