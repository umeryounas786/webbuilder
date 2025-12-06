import React from 'react';
import { useDrag } from 'react-dnd';
import './ComponentPalette.css';

const DraggableComponent = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`palette-item ${isDragging ? 'dragging' : ''}`}
    >
      <span className="palette-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  const components = [
    { type: 'header', label: 'Header', icon: '📝' },
    { type: 'text', label: 'Text', icon: '📄' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'section', label: 'Section', icon: '📦' },
    { type: 'container', label: 'Container', icon: '📦' }
  ];

  return (
    <div className="component-palette">
      <h3>Components</h3>
      <p className="palette-hint">Drag components to canvas</p>
      <div className="palette-items">
        {components.map((comp) => (
          <DraggableComponent
            key={comp.type}
            type={comp.type}
            label={comp.label}
            icon={comp.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
