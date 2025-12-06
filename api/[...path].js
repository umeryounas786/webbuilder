// Vercel serverless function - catch-all route for /api/*
// This file handles all API routes as serverless functions

// Import and export the Express app
// Vercel will handle routing /api/* requests to this function
module.exports = require('../server/index');

