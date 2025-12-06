# Deployment Guide

This guide explains how to deploy and configure the Website Builder for production.

## Production URL

Your application is deployed at: **https://builder-eight-puce.vercel.app/**

## API Configuration

The client needs to know where your API server is located. The configuration supports two scenarios:

### Scenario 1: API on Same Domain (Vercel Serverless Functions)

If you're using Vercel serverless functions for your API:

1. **Frontend and API on same domain**: The client will automatically use the same domain
2. No configuration needed - just deploy!

### Scenario 2: Separate API Server

If your API is on a different server/domain:

1. **Set the API URL** in `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-api-server.com
   ```

2. **Rebuild and redeploy** your frontend

## Environment Variables

### For Development (`client/.env.development`)
```env
# Leave empty to use proxy (localhost:5000)
# Or set to: REACT_APP_API_URL=http://localhost:5000
```

### For Production (`client/.env.production`)
```env
# Set your production API URL
REACT_APP_API_URL=https://builder-eight-puce.vercel.app
# Or your separate API server URL
```

## Vercel Deployment

### Option 1: Frontend + Backend on Vercel

1. **Deploy Frontend:**
   ```bash
   cd client
   npm run build
   ```
   Then deploy the `build` folder to Vercel

2. **Deploy Backend as Serverless Functions:**
   - Move your `server/index.js` to `api/index.js` (or create Vercel serverless functions)
   - Configure `vercel.json` to route `/api/*` to your serverless functions

### Option 2: Frontend on Vercel, Backend Separate

1. **Deploy Frontend:**
   - Set `REACT_APP_API_URL` in Vercel environment variables
   - Or use `.env.production` file

2. **Deploy Backend:**
   - Deploy to your preferred hosting (Railway, Render, Heroku, etc.)
   - Update CORS settings to allow requests from `https://builder-eight-puce.vercel.app`

## Vercel Configuration (`vercel.json`)

If deploying both frontend and backend to Vercel, create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

## Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `REACT_APP_API_URL` = `https://builder-eight-puce.vercel.app` (or your API URL)
   - `JWT_SECRET` = Your secret key (for backend)
   - `PORT` = 5000 (optional, Vercel handles this)

## Building for Production

```bash
# Install dependencies
npm run install-all

# Build frontend
cd client
npm run build

# The build folder contains your production-ready frontend
```

## Testing Production Build Locally

```bash
# Build the frontend
cd client
npm run build

# Serve the build (requires serve package)
npx serve -s build -l 3000
```

## CORS Configuration

If your frontend and backend are on different domains, update `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://builder-eight-puce.vercel.app',
    'http://localhost:3000' // For local development
  ],
  credentials: true
}));
```

## Troubleshooting

### API calls failing in production

1. **Check environment variables**: Make sure `REACT_APP_API_URL` is set correctly
2. **Check CORS**: Ensure your backend allows requests from your frontend domain
3. **Check network**: Open browser DevTools → Network tab to see failed requests
4. **Check API health**: Visit `https://your-api-url.com/api/health`

### Build fails

1. Make sure all dependencies are installed: `npm run install-all`
2. Check for TypeScript/ESLint errors
3. Verify environment variables are set correctly

### API not found (404)

1. Check your API routes match exactly (`/api/...`)
2. Verify the API server is running
3. Check Vercel serverless function routes if using Vercel

## Current Setup

Based on your production URL, you should:

1. **If using Vercel for both**: Update CORS in `server/index.js` to allow `https://builder-eight-puce.vercel.app`
2. **If API is separate**: Set `REACT_APP_API_URL` in Vercel environment variables or `.env.production`

The client will automatically:
- Use `REACT_APP_API_URL` in production
- Use the proxy (localhost:5000) in development

