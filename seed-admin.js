const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const buildMongoUri = () => {
    const { MONGOUSER, MONGOPASSWORD, MONGOHOST, MONGOPORT, MONGODB_URI, MONGO_URL } = process.env;

    // Prefer a fully-formed URI if already available
    if (MONGODB_URI && (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'))) {
        return MONGODB_URI;
    }
    if (MONGO_URL && (MONGO_URL.startsWith('mongodb://') || MONGO_URL.startsWith('mongodb+srv://'))) {
        return MONGO_URL;
    }

    // Build from individual Railway service variables
    if (MONGOUSER && MONGOPASSWORD) {
        const host = MONGOHOST || 'MongoDB-KLRD.railway.internal';
        const port = MONGOPORT || '27017';
        return `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${host}:${port}/admin`;
    }

    throw new Error(
        'MongoDB connection details not found. Set MONGODB_URI, MONGO_URL, or MONGOUSER + MONGOPASSWORD environment variables.'
    );
};

const seedAdmin = async () => {
    try {
        const mongoUri = buildMongoUri();
        console.log(`Connecting to MongoDB at host: ${new URL(mongoUri).hostname}`);
        await mongoose.connect(mongoUri);
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
