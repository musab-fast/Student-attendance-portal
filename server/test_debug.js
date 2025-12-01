const dotenv = require('dotenv');
const mongoose = require('mongoose');

console.log('Loading dotenv...');
const result = dotenv.config();
console.log('Dotenv result:', result);

console.log('MONGO_URI:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();
