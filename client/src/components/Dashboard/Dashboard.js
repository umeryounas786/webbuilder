import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../config/api';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await axios.post('/api/projects', {
        name: newProjectName,
        pages: [{ id: 'page-1', name: 'Home', components: [] }]
      });
      setProjects([...projects, res.data]);
      setNewProjectName('');
      setShowNewProjectForm(false);
      navigate(`/builder/${res.data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create project. Please check if the server is running.';
      alert(`Failed to create project: ${errorMessage}`);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Website Builder</h1>
          <p>Welcome, {user?.username}!</p>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-main">
        <div className="projects-header">
          <h2>Your Projects</h2>
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="new-project-btn"
          >
            + New Project
          </button>
        </div>

        {showNewProjectForm && (
          <form onSubmit={createProject} className="new-project-form">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <div>
              <button type="submit">Create</button>
              <button type="button" onClick={() => {
                setShowNewProjectForm(false);
                setNewProjectName('');
              }}>Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const pageCount = project.pages?.length || (project.components ? 1 : 0);
              return (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p className="project-info">
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </p>
                  <p className="project-date">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="project-actions">
                    <button
                      onClick={() => navigate(`/builder/${project.id}`)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
