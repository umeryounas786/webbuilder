# IMMEDIATE FIX - Backend Showing Code

## The Problem
Vercel is displaying your `server/index.js` code as text instead of executing it as an API server.

## Quick Fix Steps

### 1. In Your Backend Vercel Project (`webbuilder-47ad`)

**Create/Update `vercel.json` at the ROOT of your backend project:**

Copy this exact content:
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

### 2. Make Sure `api/[...path].js` Exists

At the root level of your backend project, you need:
```
api/
  └── [...path].js
```

The file should contain:
```javascript
const app = require('../server/index');

module.exports = (req, res) => {
  return app(req, res);
};
```

### 3. Update CORS (Already Done)

I've updated `server/index.js` to include `https://webbuilder-47ad.vercel.app` in CORS origins.

### 4. Set Environment Variable

In Vercel Dashboard:
- Project: `webbuilder-47ad`
- Settings → Environment Variables
- Add: `JWT_SECRET` = `umer@123`

### 5. Deploy

```bash
git add .
git commit -m "Fix Vercel serverless function execution"
git push
```

Or manually redeploy from Vercel Dashboard.

### 6. Test

Visit: `https://webbuilder-47ad.vercel.app/api/health`

Should return JSON, NOT code!

## Why This Happens

Vercel was treating your files as static assets. The `vercel.json` with `functions` configuration tells Vercel to execute the code as serverless functions.

## After This Works

Update your frontend project environment variable:
- `REACT_APP_API_URL` = `https://webbuilder-47ad.vercel.app`

