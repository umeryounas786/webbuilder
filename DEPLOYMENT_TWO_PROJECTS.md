# Deployment Guide for Two Separate Vercel Projects

You have two separate Vercel projects:
1. **Frontend**: `https://webbuilder-six.vercel.app` (React app)
2. **Backend**: `https://builder-eight-puce.vercel.app` (API server)

## Backend Project Setup (`builder-eight-puce`)

### Required Files Structure:
```
backend-project/
├── api/
│   └── [...path].js
├── server/
│   ├── index.js
│   ├── package.json
│   └── data/ (will not persist, see note below)
├── vercel.json (use vercel-backend.json)
└── package.json (root - optional)
```

### Steps:

1. **Rename `vercel-backend.json` to `vercel.json` in your backend project**
   - Or copy the contents of `vercel-backend.json` to `vercel.json` in backend project

2. **Make sure you have these files in backend project:**
   - `api/[...path].js`
   - `server/index.js`
   - `server/package.json` (with all dependencies)

3. **Set Environment Variables in Backend Vercel Project:**
   - Go to: `builder-eight-puce` project → Settings → Environment Variables
   - Add:
     - **Key**: `JWT_SECRET`
     - **Value**: `umer@123`
     - **Environment**: Production, Preview, Development

4. **Deploy Backend:**
   ```bash
   # In your backend project directory
   vercel --prod
   ```

## Frontend Project Setup (`webbuilder-six`)

### Steps:

1. **Set Environment Variable in Frontend Vercel Project:**
   - Go to: `webbuilder-six` project → Settings → Environment Variables
   - Add:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: `https://builder-eight-puce.vercel.app`
     - **Environment**: Production, Preview, Development

2. **Redeploy Frontend** (to pick up the new env variable):
   ```bash
   # In your frontend/client directory
   vercel --prod
   ```
   Or push to Git and let Vercel auto-deploy

3. **Update CORS in Backend** (already done in server/index.js)

## Testing

### Backend Health Check:
```
https://builder-eight-puce.vercel.app/api/health
```
Should return: `{"status":"OK","message":"API is running",...}`

### Frontend Login:
- Visit: `https://webbuilder-six.vercel.app`
- Try to login/register
- Check browser console - API calls should go to `builder-eight-puce.vercel.app`

## Troubleshooting

### Backend still returning 404?

1. **Check file structure** - Make sure `api/[...path].js` exists in backend project
2. **Check vercel.json** - Should match `vercel-backend.json` structure
3. **Check build logs** - Vercel Dashboard → Deployments → Check logs
4. **Verify dependencies** - Make sure `server/package.json` has all dependencies

### Frontend can't connect to backend?

1. **Check environment variable** - `REACT_APP_API_URL` should be set
2. **Rebuild frontend** - Environment variables only work at build time
3. **Check CORS** - Backend must allow frontend origin
4. **Check browser console** - See actual API calls being made

## File Storage Limitation

⚠️ **Important**: Vercel serverless functions use ephemeral storage. Data in `server/data/` will NOT persist.

For production, you need a database. I can help migrate to MongoDB/PostgreSQL.

