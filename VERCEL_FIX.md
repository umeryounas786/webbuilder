# Fixing 405 Error on Vercel

## Problem

Getting `405 (Method Not Allowed)` error when accessing API routes on Vercel because:
- Vercel doesn't automatically run Express servers
- Need to configure Vercel to route `/api/*` to serverless functions

## Solution

I've created the following files to fix this:

### 1. `api/[...path].js`
- Vercel serverless function that handles all `/api/*` routes
- Wraps the Express app as a serverless function

### 2. `vercel.json`
- Configures Vercel to:
  - Build the React app from `client/`
  - Route `/api/*` requests to the serverless function
  - Serve static files from the React build

### 3. Updated `server/index.js`
- Modified to export the Express app (not just start it)
- Still works for local development

## Deployment Steps

### Option 1: Deploy Everything Together (Recommended)

1. **Make sure your project structure is:**
   ```
   webSiteBuilder/
   ├── api/
   │   └── [...path].js
   ├── client/
   │   └── (React app)
   ├── server/
   │   └── index.js
   └── vercel.json
   ```

2. **Set Vercel environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `JWT_SECRET` - Your secret key for JWT tokens
     - `REACT_APP_API_URL` - Leave empty (will use same domain)

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   Or push to your Git repo (Vercel will auto-deploy)

### Option 2: Deploy Frontend and Backend Separately

If you want to deploy backend separately (e.g., Railway, Render):

1. **Deploy backend separately:**
   - Deploy `server/` to Railway/Render/Heroku
   - Get your backend URL (e.g., `https://your-api.railway.app`)

2. **Set environment variable:**
   - In Vercel, set `REACT_APP_API_URL=https://your-api.railway.app`

3. **Update CORS in `server/index.js`:**
   - Add your frontend URL to the CORS origins array

## Testing After Deployment

1. **Check health endpoint:**
   ```
   https://webbuilder-six.vercel.app/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Test login:**
   - Try logging in on your deployed site
   - Check browser console for errors

## Important Notes

### File System Limitations on Vercel

⚠️ **Important**: Vercel serverless functions have **read-only file system** (except `/tmp`). 

Your current setup uses `server/data/` to store JSON files, which **won't persist** on Vercel serverless functions because:
- Each function invocation is stateless
- Files written during one invocation may not exist in the next

### Solutions:

1. **Use a Database** (Recommended for production):
   - MongoDB Atlas (free tier available)
   - PostgreSQL (Railway, Supabase)
   - Firebase Firestore

2. **Use Vercel KV** (Key-Value store)

3. **Use a separate backend** (Railway, Render, etc.) with persistent storage

### Quick Fix for Testing (Temporary)

For now, the serverless functions will work, but data won't persist between deployments. Each deployment creates a new environment.

### Recommended: Database Migration

I can help you migrate to a database (MongoDB, PostgreSQL, etc.) if you want persistent data storage.

## Current CORS Configuration

The server is configured to allow requests from:
- `http://localhost:3000` (local development)
- `https://builder-eight-puce.vercel.app`
- `https://webbuilder-six.vercel.app`
- Any URL set in `FRONTEND_URL` environment variable

## Troubleshooting

### Still getting 405 error?

1. Check `vercel.json` is in the root directory
2. Check `api/[...path].js` exists and exports the app
3. Redeploy after making changes
4. Check Vercel deployment logs

### API returns errors?

1. Check environment variables are set in Vercel
2. Check server logs in Vercel dashboard
3. Make sure `JWT_SECRET` is set

### Data not persisting?

This is expected with file-based storage on Vercel. Migrate to a database for persistent storage.

