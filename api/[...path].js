

const app = require('../server/index');

// Export as Vercel serverless function handler
// This format is required for Vercel to execute it as a serverless function
module.exports = (req, res) => {
  return app(req, res);
};

