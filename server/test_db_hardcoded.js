const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/student_portal';

console.log('Connecting to MongoDB with hardcoded URI...');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();
