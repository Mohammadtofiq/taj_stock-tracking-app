# Environment Setup Guide

## Quick Setup for Database Testing

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root of your project (same directory as `package.json`).

**On Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

**On Windows (Command Prompt):**
```cmd
type nul > .env.local
```

**On Mac/Linux:**
```bash
touch .env.local
```

### Step 2: Add your MongoDB connection string

Open `.env.local` and add one of the following:

#### Option A: Local MongoDB (if you have MongoDB installed locally)
```env
MONGODB_URI=mongodb://localhost:27017/stocks_app
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stocks_app?retryWrites=true&w=majority
```

**Replace:**
- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password
- `cluster.mongodb.net` - Your cluster address
- `stocks_app` - Your database name (can be any name)

### Step 3: Test the connection

Run the test script:
```bash
npm run test:db
```

Or directly:
```bash
node scripts/test-db-connection.js
```

## Getting MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with your database name (e.g., `stocks_app`)

## Example `.env.local` file

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/stocks_app?retryWrites=true&w=majority
```

## Important Notes

- ✅ `.env.local` is already in `.gitignore` (won't be committed to git)
- ✅ Never share your connection string publicly
- ✅ Keep your password secure
- ✅ The file should be in the project root directory

## Troubleshooting

### "File not found" error
- Make sure `.env.local` is in the root directory (same level as `package.json`)
- Check the file name is exactly `.env.local` (not `.env.local.txt`)

### "MONGODB_URI is not defined"
- Make sure the file is named `.env.local` (not `.env`)
- Check there are no spaces around the `=` sign
- Verify the file is in the project root

### Connection errors
- Check your MongoDB is running (for local)
- Verify your Atlas cluster is running (for cloud)
- Check your username and password are correct
- Make sure your IP is whitelisted in Atlas (if using Atlas)

