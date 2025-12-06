const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://builder-eight-puce.vercel.app',
    'https://webbuilder-six.vercel.app',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean),
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));

// Data storage paths
// In Vercel serverless, use /tmp for writable storage (but note: not persistent!)
// For production, you should use a database instead
const DATA_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'data')  // Vercel serverless - use /tmp (ephemeral)
  : path.join(__dirname, 'data');  // Local development - use server/data
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
    }
    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      await fs.writeFile(PROJECTS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error setting up data directory:', error);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Helper functions
async function readJSON(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await readJSON(USERS_FILE);
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJSON(USERS_FILE, users);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const userProjects = projects.filter(p => p.userId === req.user.userId);
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const project = projects.find(p => p.id === req.params.id && p.userId === req.user.userId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Migrate old format to new format if needed
    if (project.components && !project.pages) {
      project.pages = [{ id: 'page-1', name: 'Home', components: project.components }];
      delete project.components;
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch project' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, pages, components } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projects = await readJSON(PROJECTS_FILE);
    
    // Support both old format (components) and new format (pages)
    let projectPages;
    if (pages && Array.isArray(pages)) {
      projectPages = pages;
    } else if (components && Array.isArray(components)) {
      // Migrate old format to new format
      projectPages = [{ id: 'page-1', name: 'Home', components: components }];
    } else {
      projectPages = [{ id: 'page-1', name: 'Home', components: [] }];
    }

    const newProject = {
      id: uuidv4(),
      userId: req.user.userId,
      name,
      pages: projectPages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    await writeJSON(PROJECTS_FILE, projects);

    res.json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const projectIndex = projects.findIndex(
      p => p.id === req.params.id && p.userId === req.user.userId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingProject = projects[projectIndex];
    
    // Handle migration from old format
    if (existingProject.components && !existingProject.pages) {
      existingProject.pages = [{ id: 'page-1', name: 'Home', components: existingProject.components }];
      delete existingProject.components;
    }

    // Merge updates
    const updatedProject = {
      ...existingProject,
      ...req.body,
      id: existingProject.id,
      userId: existingProject.userId,
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    await writeJSON(PROJECTS_FILE, projects);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message || 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const filteredProjects = projects.filter(
      p => !(p.id === req.params.id && p.userId === req.user.userId)
    );

    if (projects.length === filteredProjects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await writeJSON(PROJECTS_FILE, filteredProjects);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data directory
ensureDataDir();

// Export app for Vercel serverless functions
module.exports = app;

// Only start server if running directly (not as serverless function)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
