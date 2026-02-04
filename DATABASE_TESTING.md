# Database Connection Testing Guide

This guide will help you test your MongoDB database connection to ensure it's working properly.

## Prerequisites

1. **MongoDB Setup**: Make sure you have:
   - MongoDB installed locally, OR
   - A MongoDB Atlas account with a cluster, OR
   - Access to a remote MongoDB instance

2. **Environment Variables**: Create a `.env.local` file in the root of your project with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```
   
   OR for MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   ```

## Step-by-Step Testing Instructions

### Method 1: Using the Test Script (Recommended)

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Ensure your `.env.local` file exists** with `MONGODB_URI` set:
   ```bash
   # Check if file exists
   ls .env.local
   
   # Or create it if it doesn't exist
   echo "MONGODB_URI=your-connection-string-here" > .env.local
   ```

3. **Run the test script**:
   ```bash
   node scripts/test-db-connection.js
   ```

4. **Expected Output** (if successful):
   ```
   🔍 Starting database connection test...

   ✅ MONGODB_URI is set
      URI: mongodb://***:***@...

   🔄 Attempting to connect to MongoDB...
   ✅ Successfully connected to MongoDB!

   📊 Connection State:
      Ready State: 1
      Ready State Name: connected
      Database Name: your-database-name
      Host: localhost
      Port: 27017

   🧪 Testing database operation...
   ✅ Database operation successful!
      Collections found: 0

   🎉 All tests passed! Database connection is working properly.

   ✅ Connection closed successfully.
   ```

### Method 2: Manual Testing in Your Application

1. **Create a test API route** (optional):
   Create `app/api/test-db/route.ts`:
   ```typescript
   import { connectToDatabase } from '@/database/mongoose';
   import { NextResponse } from 'next/server';

   export async function GET() {
       try {
           await connectToDatabase();
           return NextResponse.json({ 
               success: true, 
               message: 'Database connected successfully' 
           });
       } catch (error) {
           return NextResponse.json({ 
               success: false, 
               error: error instanceof Error ? error.message : 'Unknown error' 
           }, { status: 500 });
       }
   }
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Visit the test endpoint**:
   Open your browser and go to: `http://localhost:3000/api/test-db`

4. **Check the response**:
   - Success: `{"success":true,"message":"Database connected successfully"}`
   - Error: `{"success":false,"error":"error message"}`

### Method 3: Using MongoDB Compass or CLI

1. **MongoDB Compass**:
   - Download from: https://www.mongodb.com/try/download/compass
   - Connect using your connection string
   - Verify you can see your database and collections

2. **MongoDB Shell (mongosh)**:
   ```bash
   mongosh "your-connection-string"
   ```
   - If connection succeeds, you'll see the MongoDB shell prompt
   - Run `show dbs` to list databases
   - Run `use your-database-name` to switch to your database

## Troubleshooting Common Issues

### Issue 1: "MONGODB_URI is not defined"
**Solution**: 
- Make sure `.env.local` exists in the project root
- Verify the variable name is exactly `MONGODB_URI` (case-sensitive)
- Restart your development server after adding environment variables

### Issue 2: "authentication failed"
**Solution**:
- Check your MongoDB username and password
- For MongoDB Atlas, make sure your IP is whitelisted
- Verify your database user has the correct permissions

### Issue 3: "ECONNREFUSED" or "Connection refused"
**Solution**:
- Make sure MongoDB is running locally: `mongod` or check MongoDB service
- Verify the host and port in your connection string
- Check firewall settings

### Issue 4: "ENOTFOUND" or "getaddrinfo"
**Solution**:
- Check your MongoDB cluster/host address
- Verify your internet connection (for Atlas)
- Ensure the hostname is correct

### Issue 5: "MongooseError: Operation `...` buffering timed out"
**Solution**:
- This usually means the connection isn't established
- Check your connection string format
- Verify MongoDB is accessible

## Connection String Formats

### Local MongoDB:
```
mongodb://localhost:27017/database-name
```

### MongoDB Atlas:
```
mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

### With Authentication:
```
mongodb://username:password@host:port/database-name
```

## What the Test Script Checks

1. ✅ **Environment Variable**: Verifies `MONGODB_URI` is set
2. ✅ **Connection**: Attempts to connect to MongoDB
3. ✅ **Connection State**: Checks if connection is active
4. ✅ **Database Operations**: Tests reading from the database
5. ✅ **Connection Caching**: Verifies the caching mechanism works

## Next Steps

After successful connection:
1. Create your Mongoose models/schemas
2. Use `connectToDatabase()` in your API routes or server actions
3. Start building your application features

## Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection String Guide](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

