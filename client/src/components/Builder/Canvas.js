import React from 'react';
import { useDrop } from 'react-dnd';
import ComponentRenderer from './ComponentRenderer';
import './Canvas.css';

const Canvas = ({
  components,
  selectedComponent,
  onSelectComponent,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent,
  onMoveComponent
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => {
      // Component dragged from palette
      onAddComponent(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }));

  const handleAddComponent = (componentType) => {
    onAddComponent(componentType);
  };

  return (
    <div
      ref={drop}
      className={`canvas ${isOver ? 'drag-over' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectComponent(null);
        }
      }}
    >
      <div className="canvas-content">
        {components.length === 0 ? (
          <div className="canvas-empty">
            <p>Drag components here to start building</p>
            <div className="quick-add">
              <h4>Quick Add:</h4>
              <div className="quick-add-buttons">
                {['header', 'text', 'button', 'image', 'section'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddComponent(type)}
                    className="quick-add-btn"
                  >
                    + {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          components.map((component, index) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              index={index}
              isSelected={selectedComponent?.id === component.id}
              onSelect={() => onSelectComponent(component)}
              onUpdate={(updates) => onUpdateComponent(component.id, updates)}
              onDelete={() => onDeleteComponent(component.id)}
              onMove={onMoveComponent}
            />
          ))
        )}
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

export default Canvas;
