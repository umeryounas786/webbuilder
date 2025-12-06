# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000)

3. **Access the Application**
   - Open http://localhost:3000 in your browser
   - Register a new account or login
   - Create a new project and start building!

## Manual Setup (Alternative)

If `npm run install-all` doesn't work, install manually:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

Then start them separately:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Frontend: Set `PORT=3001` in client/.env or use `PORT=3001 npm start` in client directory
- Backend: Change PORT in server/index.js or use environment variable

### Module Not Found Errors
Make sure you've installed all dependencies:
```bash
npm run install-all
```

### CORS Issues
The backend is configured to allow requests from localhost:3000. If you change the frontend port, update the CORS settings in `server/index.js`.

## Data Storage

User data and projects are stored in `server/data/` directory:
- `users.json` - User accounts
- `projects.json` - User projects

This is a simple file-based storage. For production, consider using a database like MongoDB or PostgreSQL.
