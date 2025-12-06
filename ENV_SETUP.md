# Environment Variables Setup

## Quick Setup for Production

Since `.env` files are in `.gitignore`, you need to create them manually or set environment variables in your hosting platform.

### Option 1: Create `.env` files manually

Create these files in the `client` folder:

#### `client/.env.development`
```env
# Development - Leave empty to use proxy (localhost:5000)
# Or set to: REACT_APP_API_URL=http://localhost:5000
```

#### `client/.env.production`
```env
# Production - Set your production API URL
REACT_APP_API_URL=https://builder-eight-puce.vercel.app
```

### Option 2: Set in Vercel (Recommended)

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://builder-eight-puce.vercel.app`
   - **Environment**: Production (and Preview if needed)

## How It Works

- **Development** (`npm start`): Uses proxy from `package.json` (localhost:5000) OR `REACT_APP_API_URL` if set
- **Production** (`npm run build`): Uses `REACT_APP_API_URL` OR automatically uses the same domain as the frontend

## Current Configuration

The API configuration (`client/src/config/api.js`) automatically:
- ✅ Uses proxy in development (localhost:5000)
- ✅ Uses `REACT_APP_API_URL` if set in production
- ✅ Falls back to same domain if `REACT_APP_API_URL` is not set
- ✅ Works for both same-domain and separate API deployments

## Testing Locally

To test production build locally:

```bash
# Set production environment variable
export REACT_APP_API_URL=https://builder-eight-puce.vercel.app

# Build
cd client
npm run build

# Serve (requires serve package)
npx serve -s build
```

## Important Notes

1. **React environment variables** must start with `REACT_APP_` to be available in the browser
2. **Rebuild required**: Changes to `.env` files require a rebuild (`npm run build`)
3. **Vercel**: Environment variables set in Vercel dashboard will be used during build

