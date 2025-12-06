# Backend Project Setup Instructions

## For `builder-eight-puce` Vercel Project (Backend)

### Step 1: Update vercel.json

Your backend project needs a `vercel.json` file. Use the contents of `vercel-backend.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/[...path].js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/[...path].js"
    }
  ]
}
```

### Step 2: Required Files in Backend Project

Make sure these files exist in your backend Vercel project:

```
backend-project/
├── api/
│   └── [...path].js          ← Must exist
├── server/
│   ├── index.js              ← Must exist
│   ├── package.json          ← Must exist with dependencies
│   └── data/                 ← Will be created at runtime
└── vercel.json               ← Use vercel-backend.json contents
```

### Step 3: server/package.json

Make sure `server/package.json` includes all dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1",
    "body-parser": "^1.20.2"
  }
}
```

### Step 4: Environment Variables

In Vercel Dashboard → `builder-eight-puce` project → Settings → Environment Variables:

- **Key**: `JWT_SECRET`
- **Value**: `umer@123`
- **Environments**: Production, Preview, Development

### Step 5: Deploy

```bash
# From your backend project directory
vercel --prod
```

Or push to Git and let Vercel auto-deploy.

### Step 6: Test

After deployment, test:
```
https://builder-eight-puce.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "...",
  "uptime": ...
}
```

## Common Issues

### Still getting 404?

1. **Check Vercel deployment logs** - Look for build errors
2. **Verify `api/[...path].js` exists** - This is critical
3. **Check file structure** - Files must be in correct locations
4. **Redeploy** - Sometimes Vercel needs a fresh deploy

### Getting 500 errors?

1. **Check environment variables** - `JWT_SECRET` must be set
2. **Check server logs** - Vercel Dashboard → Functions → View logs
3. **Check dependencies** - Make sure all packages are in `server/package.json`

