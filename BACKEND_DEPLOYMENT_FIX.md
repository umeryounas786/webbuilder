# Fix for Backend Showing Code Instead of Executing

## Problem
When visiting `https://webbuilder-47ad.vercel.app/`, Vercel is showing the raw JavaScript code instead of executing it as an API server.

## Solution

### Step 1: Update Your Backend Project Files

Your backend Vercel project (`webbuilder-47ad`) needs these files:

**File Structure:**
```
webbuilder-47ad/
├── api/
│   └── [...path].js          ← Serverless function handler
├── server/
│   ├── index.js              ← Express app
│   └── package.json          ← Dependencies
└── vercel.json               ← Vercel configuration
```

### Step 2: Update vercel.json

Create/update `vercel.json` in your backend project root with:

```json
{
  "version": 2,
  "functions": {
    "api/[...path].js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/[...path].js"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/[...path]"
    }
  ]
}
```

### Step 3: Update api/[...path].js

Make sure `api/[...path].js` exists and contains:

```javascript
// Vercel serverless function - catch-all route for /api/*
const app = require('../server/index');

// Export as Vercel serverless function handler
module.exports = (req, res) => {
  return app(req, res);
};
```

### Step 4: Verify server/index.js

Make sure `server/index.js` exports the app:
```javascript
// At the end of server/index.js
module.exports = app;
```

### Step 5: Set Environment Variables

In Vercel Dashboard → Your Backend Project → Settings → Environment Variables:

- **Key**: `JWT_SECRET`
- **Value**: `umer@123`
- **Environments**: Production, Preview, Development

### Step 6: Deploy

```bash
# Commit and push
git add .
git commit -m "Fix Vercel serverless function configuration"
git push
```

Or redeploy from Vercel Dashboard.

### Step 7: Test

After deployment, test:
```
https://webbuilder-47ad.vercel.app/api/health
```

Should return JSON:
```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "...",
  "uptime": ...
}
```

## Why This Fixes It

The issue was that Vercel was treating your files as static assets instead of serverless functions. By:
1. Properly configuring `vercel.json` with the `functions` field
2. Using the correct export format in `api/[...path].js`
3. Setting up proper routing with `rewrites`

Vercel will now execute your Express app as serverless functions instead of serving the code as static files.

## Troubleshooting

### Still seeing code?
1. Check Vercel deployment logs for errors
2. Verify `api/[...path].js` exists and is in the correct location
3. Make sure `vercel.json` is at the root of your backend project
4. Try a fresh deployment

### Getting errors?
1. Check Vercel function logs (Dashboard → Functions tab)
2. Verify all dependencies are in `server/package.json`
3. Make sure `JWT_SECRET` environment variable is set

