/**
 * Database Connection Test Script
 * 
 * This script tests the MongoDB connection to ensure it's working properly.
 * 
 * Usage:
 * 1. Make sure you have MONGODB_URI in your .env.local file
 * 2. Run: npx tsx scripts/test-db-connection.ts
 *    OR
 *    Run: npm run test:db
 */

import { connectToDatabase } from '../database/mongoose';
import mongoose from 'mongoose';

async function testDatabaseConnection() {
    console.log('🔍 Starting database connection test...\n');

    try {
        // Test 1: Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
            console.log('\n📝 Please add MONGODB_URI to your .env.local file:');
            console.log('   MONGODB_URI=mongodb://localhost:27017/your-database-name');
            console.log('   OR');
            console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name');
            process.exit(1);
        }

        console.log('✅ MONGODB_URI is set');
        console.log(`   URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}\n`);

        // Test 2: Attempt connection
        console.log('🔄 Attempting to connect to MongoDB...');
        const connection = await connectToDatabase();
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

        // Test 5: Test connection caching
        console.log('🔄 Testing connection caching...');
        const startTime = Date.now();
        const cachedConnection = await connectToDatabase();
        const endTime = Date.now();
        console.log(`✅ Connection caching working! (took ${endTime - startTime}ms)`);
        console.log(`   Same connection instance: ${connection === cachedConnection}\n`);

        console.log('🎉 All tests passed! Database connection is working properly.\n');

        // Close connection
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully.');

    } catch (error) {
        console.error('\n❌ Database connection test failed!');
        console.error('Error details:', error instanceof Error ? error.message : error);
        
        if (error instanceof Error) {
            if (error.message.includes('MONGODB_URI')) {
                console.log('\n💡 Tip: Make sure MONGODB_URI is set in your .env.local file');
            } else if (error.message.includes('authentication failed')) {
                console.log('\n💡 Tip: Check your MongoDB username and password');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.log('\n💡 Tip: Make sure MongoDB is running and the connection string is correct');
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
                console.log('\n💡 Tip: Check your MongoDB cluster/host address');
            }
        }
        
        process.exit(1);
    }
}

function getReadyStateName(state: number): string {
    const states: Record<number, string> = {
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

