# API Testing Guide

This guide shows you how to verify that your API is working correctly.

## Quick Start

### 1. Start the Server

Make sure your server is running:

```bash
npm run server
```

You should see:
```
Server running on port 5000
```

### 2. Run Automated Tests

Install dependencies (if not already installed):
```bash
npm install
```

Run the test script:
```bash
npm run test-api
```

This will automatically test all API endpoints and show you the results.

## Manual Testing

### Method 1: Browser

1. **Health Check** - Open in browser:
   ```
   http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"API is running",...}`

### Method 2: cURL (Command Line)

**Windows PowerShell:**
```powershell
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"test123\"}'

# Login
curl -X POST http://localhost:5000/api/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

**Linux/Mac:**
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Login (save token from response)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Method 3: Browser Console (JavaScript)

Open your browser's Developer Console (F12) and run:

```javascript
// Health check
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Error:', err));

// Register
fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Registration:', data);
    localStorage.setItem('testToken', data.token);
  });

// Login
fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Login:', data);
    localStorage.setItem('testToken', data.token);
  });

// Get projects (requires token)
const token = localStorage.getItem('testToken');
fetch('http://localhost:5000/api/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => console.log('Projects:', data));
```

### Method 4: Postman / Thunder Client

1. **Setup:**
   - Create a new request
   - Set method and URL
   - Add headers if needed
   - Add body (raw JSON) for POST requests

2. **Test Health:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/health`

3. **Test Registration:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "test123"
     }
     ```

4. **Test Projects (Authenticated):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/projects`
   - Headers: 
     - `Authorization: Bearer YOUR_TOKEN_HERE`
     - `Content-Type: application/json`

## Available Endpoints

### Public Endpoints (No Auth Required)

- `GET /api/health` - Health check

### Auth Endpoints (No Auth Required)

- `POST /api/register` - Register new user
  - Body: `{ username, email, password }`
- `POST /api/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Project Endpoints (Auth Required)

- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
  - Body: `{ name, pages }`
- `PUT /api/projects/:id` - Update project
  - Body: `{ name, pages }`
- `DELETE /api/projects/:id` - Delete project

## Troubleshooting

### Server not running?
```bash
cd server
npm start
```

### Port already in use?
Change PORT in `server/index.js` or use environment variable:
```bash
PORT=5001 npm run server
```

### CORS errors?
The server has CORS enabled for `localhost:3000`. If testing from a different origin, update CORS settings in `server/index.js`.

### Token expired?
Just login again to get a new token.

## Expected Responses

### Health Check
```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.45
}
```

### Registration Success
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Project List
```json
[
  {
    "id": "project-id",
    "userId": "user-id",
    "name": "My Website",
    "pages": [...],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

