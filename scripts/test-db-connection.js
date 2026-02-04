/**
 * Database Connection Test Script (JavaScript version)
 * 
 * This script tests the MongoDB connection to ensure it's working properly.
 * 
 * Usage:
 * 1. Make sure you have MONGODB_URI in your .env.local file
 * 2. Run: node scripts/test-db-connection.js
 *    OR
 *    Run: npm run test:db
 */

// Load environment variables from .env.local (preferred) or .env
require('dotenv').config({ path: '.env.local' });
// If .env.local doesn't exist or doesn't have MONGODB_URI, try .env
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}
const mongoose = require('mongoose');

// Import the connection function (we'll need to convert it or use mongoose directly)
const MONGODB_URI = process.env.MONGODB_URI;

// Simple connection test without the caching logic
async function testDatabaseConnection() {
    console.log('🔍 Starting database connection test...\n');

    try {
        // Test 1: Check if MONGODB_URI is set
        if (!MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
            console.log('\n📝 Please add MONGODB_URI to your .env or .env.local file:');
            console.log('   MONGODB_URI=mongodb://localhost:27017/your-database-name');
            console.log('   OR');
            console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name');
            process.exit(1);
        }

        console.log('✅ MONGODB_URI is set');
        // Mask password in URI for security
        const maskedURI = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
        console.log(`   URI: ${maskedURI}`);
        
        // Check for common issues in connection string
        if (MONGODB_URI.includes('@') && MONGODB_URI.match(/@/g)?.length > 1) {
            console.log('   ⚠️  Warning: Multiple @ symbols detected. Password may need URL encoding.');
            console.log('   💡 If your password contains special characters, encode them:');
            console.log('      @ = %40, # = %23, / = %2F, : = %3A, ? = %3F, & = %26\n');
        } else {
            console.log('');
        }

        // Test 2: Attempt connection
        console.log('🔄 Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, { bufferCommands: false });
        console.log('✅ Successfully connected to MongoDB!\n');

        // Test 3: Check connection state
        console.log('📊 Connection State:');
        console.log(`   Ready State: ${mongoose.connection.readyState}`);
        console.log(`   Ready State Name: ${getReadyStateName(mongoose.connection.readyState)}`);
        console.log(`   Database Name: ${mongoose.connection.db?.databaseName || 'N/A'}`);
        console.log(`   Host: ${mongoose.connection.host || 'N/A'}`);
        console.log(`   Port: ${mongoose.connection.port || 'N/A'}\n`);

        // Test 4: Test a simple database operation
        console.log('🧪 Testing database operation...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✅ Database operation successful!`);
        console.log(`   Collections found: ${collections.length}`);
        if (collections.length > 0) {
            console.log(`   Collection names: ${collections.map(c => c.name).join(', ')}`);
        }
        console.log('');

        console.log('🎉 All tests passed! Database connection is working properly.\n');

        // Close connection
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully.');

    } catch (error) {
        console.error('\n❌ Database connection test failed!');
        console.error('Error details:', error.message || error);
        
        if (error.message) {
            if (error.message.includes('MONGODB_URI')) {
                console.log('\n💡 Tip: Make sure MONGODB_URI is set in your .env or .env.local file');
            } else if (error.message.includes('authentication failed')) {
                console.log('\n💡 Tip: Check your MongoDB username and password');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.log('\n💡 Tip: Make sure MongoDB is running and the connection string is correct');
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo') || error.message.includes('querySrv')) {
                console.log('\n💡 Tip: Check your MongoDB cluster/host address');
                console.log('   - Verify the connection string format is correct');
                console.log('   - If your password contains special characters (@, #, /, etc.), URL-encode them:');
                console.log('     @ = %40, # = %23, / = %2F, : = %3A, ? = %3F, & = %26');
                console.log('   - Example: Development@2002 should be Development%402002');
            }
        }
        
        process.exit(1);
    }
}

function getReadyStateName(state) {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    return states[state] || 'unknown';
}

// Run the test
testDatabaseConnection();

