# Quick Fix for 405 Error on Vercel

## What I Fixed

1. ✅ Created `vercel.json` - Configures Vercel to route `/api/*` to serverless functions
2. ✅ Created `api/[...path].js` - Serverless function handler for all API routes
3. ✅ Updated `server/index.js` - Exports Express app for serverless functions
4. ✅ Updated CORS - Added your production URL `https://webbuilder-six.vercel.app`

## What You Need to Do

### 1. Deploy to Vercel

**Option A: Using Git (Recommended)**
```bash
git add .
git commit -m "Fix Vercel 405 error"
git push
```
Vercel will auto-deploy.

**Option B: Using Vercel CLI**
```bash
vercel
```

### 2. Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- **Key**: `JWT_SECRET`
- **Value**: (any random string, e.g., `your-secret-key-change-in-production`)
- **Environment**: Production, Preview, Development

### 3. Test

After deployment, test:
```
https://webbuilder-six.vercel.app/api/health
```

Should return: `{"status":"OK",...}`

## ⚠️ Important: File Storage Limitation

**Current Issue**: Vercel serverless functions use an **ephemeral file system**. Data stored in `server/data/` **will NOT persist** between function invocations or deployments.

This means:
- ❌ User registrations won't persist
- ❌ Projects won't persist
- ❌ Data resets on each deployment

### Temporary Solution (For Testing)

The 405 error will be fixed, but data won't persist. This is fine for testing the API routing.

### Permanent Solution (For Production)

You need to use a **database** instead of file storage:

**Option 1: MongoDB Atlas** (Free tier available)
- Sign up at mongodb.com/cloud/atlas
- Get connection string
- I can help migrate the code to use MongoDB

**Option 2: Deploy Backend Separately**
- Deploy backend to Railway/Render/Heroku
- Update `REACT_APP_API_URL` environment variable
- Use file storage on persistent server

**Option 3: Use Vercel KV** (Key-Value store)
- Vercel's built-in storage solution
- Requires Vercel Pro plan

## Current Status

✅ **405 Error**: FIXED (after deployment)
⚠️ **Data Persistence**: NOT WORKING (needs database)
✅ **CORS**: CONFIGURED
✅ **Routing**: CONFIGURED

## Next Steps

1. Deploy the changes (fixes 405 error)
2. Test the API endpoints
3. Decide on database solution for data persistence
4. Migrate to database when ready

Let me know if you want help migrating to a database!

