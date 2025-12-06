import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComponentPalette from './ComponentPalette';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import PageManager from './PageManager';
import './Builder.css';

const Builder = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([{ id: 'page-1', name: 'Home', components: [] }]);
  const [currentPageId, setCurrentPageId] = useState('page-1');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [projectName, setProjectName] = useState('New Project');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get current page components
  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];
  const components = currentPage?.components || [];

  useEffect(() => {
    if (projectId) {
      loadProject();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}`);
      const projectData = res.data;
      
      // Handle both old format (components) and new format (pages)
      if (projectData.pages && Array.isArray(projectData.pages)) {
        setPages(projectData.pages);
        setCurrentPageId(projectData.pages[0]?.id || 'page-1');
      } else if (projectData.components) {
        // Migrate old format
        setPages([{ id: 'page-1', name: 'Home', components: projectData.components }]);
        setCurrentPageId('page-1');
      }
      
      setProjectName(projectData.name);
    } catch (error) {
      console.error('Error loading project:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load project';
      alert(`Failed to load project: ${errorMessage}`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      const projectData = {
        name: projectName,
        pages: pages
      };

      if (projectId) {
        await axios.put(`/api/projects/${projectId}`, projectData);
      } else {
        const res = await axios.post('/api/projects', projectData);
        navigate(`/builder/${res.data.id}`, { replace: true });
      }
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save project';
      alert(`Failed to save project: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Page management functions
  const handleSelectPage = (pageId) => {
    setCurrentPageId(pageId);
    setSelectedComponent(null);
  };

  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      components: []
    };
    setPages([...pages, newPage]);
    setCurrentPageId(newPageId);
    setSelectedComponent(null);
  };

  const handleDeletePage = (pageId) => {
    if (pages.length <= 1) {
      alert('You must have at least one page');
      return;
    }
    
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    
    if (currentPageId === pageId) {
      setCurrentPageId(newPages[0].id);
    }
    setSelectedComponent(null);
  };

  const handleRenamePage = (pageId, newName) => {
    if (!newName.trim()) return;
    setPages(pages.map(p => p.id === pageId ? { ...p, name: newName.trim() } : p));
  };

  const addComponent = (componentType) => {
    const newComponent = {
      id: `component-${Date.now()}-${Math.random()}`,
      type: componentType,
      props: getDefaultProps(componentType),
      styles: getDefaultStyles(componentType)
    };
    updateCurrentPageComponents([...components, newComponent]);
  };

  const updateComponent = (id, updates) => {
    const updatedComponents = components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    );
    updateCurrentPageComponents(updatedComponents);
  };

  const deleteComponent = (id) => {
    const updatedComponents = components.filter(comp => comp.id !== id);
    updateCurrentPageComponents(updatedComponents);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (dragIndex, hoverIndex) => {
    const draggedComponent = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedComponent);
    updateCurrentPageComponents(newComponents);
  };

  // Helper to update current page's components
  const updateCurrentPageComponents = (newComponents) => {
    setPages(pages.map(p =>
      p.id === currentPageId ? { ...p, components: newComponents } : p
    ));
  };

  if (loading) {
    return <div className="builder-loading">Loading project...</div>;
  }

  return (
    <div className="builder">
      <header className="builder-header">
        <div className="builder-header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="project-name-input"
          />
        </div>
        <button
          onClick={saveProject}
          disabled={saving}
          className="save-btn"
        >
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </header>

      <div className="builder-content">
        <div className="builder-sidebar">
          <PageManager
            pages={pages}
            currentPageId={currentPageId}
            onSelectPage={handleSelectPage}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onRenamePage={handleRenamePage}
          />
          <ComponentPalette />
        </div>
        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onAddComponent={addComponent}
          onUpdateComponent={updateComponent}
          onDeleteComponent={deleteComponent}
          onMoveComponent={moveComponent}
        />
        <PropertiesPanel
          component={selectedComponent}
          onUpdateComponent={(updates) =>
            selectedComponent && updateComponent(selectedComponent.id, updates)
          }
        />
      </div>
    </div>
  );
};

// Helper functions
const getDefaultProps = (type) => {
  const defaults = {
    header: { text: 'Header', level: 1 },
    text: { content: 'Text content' },
    button: { label: 'Click me', link: '#' },
    image: { src: 'https://via.placeholder.com/400x300', alt: 'Image' },
    section: { content: 'Section content' },
    container: { children: [] }
  };
  return defaults[type] || {};
};

const getDefaultStyles = (type) => {
  const defaults = {
    header: { fontSize: '2rem', color: '#333', padding: '1rem', textAlign: 'center' },
    text: { fontSize: '1rem', color: '#666', padding: '0.5rem', lineHeight: '1.5' },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    image: { width: '100%', maxWidth: '100%', height: 'auto', display: 'block' },
    section: { padding: '2rem', backgroundColor: '#f9f9f9', margin: '1rem 0' },
    container: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }
  };
  return defaults[type] || {};
};

export default Builder;
