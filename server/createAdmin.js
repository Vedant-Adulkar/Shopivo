// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@shopivo.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@shopivo.com');
            console.log('You can use this account to login');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@shopivo.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@shopivo.com');
        console.log('Password: admin123');
        console.log('Role: admin');
        console.log('\nYou can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
