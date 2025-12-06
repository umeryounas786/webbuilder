// Vercel serverless function - catch-all route for /api/*
// This file handles all API routes as serverless functions

const app = require('../server/index');

// Export as Vercel serverless function handler
// This format is required for Vercel to execute it as a serverless function
module.exports = (req, res) => {
  return app(req, res);
};

