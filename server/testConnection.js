const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testDatabaseConnection = async () => {
    console.log('='.repeat(50));
    console.log('DATABASE CONNECTION TEST');
    console.log('='.repeat(50));
    console.log('\n📋 Configuration:');
    console.log(`   MongoDB URI: ${process.env.MONGO_URI}`);
    console.log(`   Port: ${process.env.PORT}`);
    console.log('\n🔄 Attempting to connect to MongoDB...\n');

    try {
        // Attempt connection
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });

        console.log('✅ SUCCESS: MongoDB Connected!');
        console.log(`   Database: ${mongoose.connection.db.databaseName}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log(`   Port: ${mongoose.connection.port}`);
        console.log(`   Connection State: ${mongoose.connection.readyState}`);

        // Test database operations
        console.log('\n🔍 Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   Collections found: ${collections.length}`);

        if (collections.length > 0) {
            console.log('   Collection names:');
            collections.forEach(col => {
                console.log(`      - ${col.name}`);
            });
        }

        // Close connection
        await mongoose.connection.close();
        console.log('\n✅ Connection closed successfully');
        console.log('='.repeat(50));
        process.exit(0);

    } catch (error) {
        console.error('❌ ERROR: MongoDB Connection Failed!');
        console.error(`   Error Type: ${error.name}`);
        console.error(`   Error Message: ${error.message}`);

        if (error.name === 'MongooseServerSelectionError') {
            console.error('\n💡 Possible Solutions:');
            console.error('   1. Make sure MongoDB is running on your system');
            console.error('   2. Check if MongoDB service is started');
            console.error('   3. Verify the connection string in .env file');
            console.error('   4. Ensure MongoDB is listening on 127.0.0.1:27017');
        }

        console.log('='.repeat(50));
        process.exit(1);
    }
};

// Run the test
testDatabaseConnection();
