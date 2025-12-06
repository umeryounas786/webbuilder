// Standalone server for local development and non-Vercel deployments
const app = require('./index');

const PORT = process.env.PORT || 5000;

// Only start server if not running as serverless function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

