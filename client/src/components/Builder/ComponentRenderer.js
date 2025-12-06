import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './ComponentRenderer.css';

const ComponentRenderer = ({
  component,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMove
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-component',
    item: { id: component.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [, drop] = useDrop(() => ({
    accept: 'canvas-component',
    hover: (draggedItem) => {
      if (draggedItem.id !== component.id) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  }));

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this component?')) {
      onDelete();
    }
  };

  const renderComponent = () => {
    const { type, props, styles } = component;
    const mergedStyles = { ...styles, position: 'relative' };

    switch (type) {
      case 'header':
        const HeaderTag = `h${props.level || 1}`;
        return (
          <HeaderTag style={mergedStyles} onClick={handleClick}>
            {props.text || 'Header'}
          </HeaderTag>
        );

      case 'text':
        return (
          <p style={mergedStyles} onClick={handleClick}>
            {props.content || 'Text content'}
          </p>
        );

      case 'button':
        return (
          <button
            style={mergedStyles}
            onClick={handleClick}
            disabled
          >
            {props.label || 'Button'}
          </button>
        );

      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/400x300'}
            alt={props.alt || 'Image'}
            style={mergedStyles}
            onClick={handleClick}
          />
        );

      case 'section':
        return (
          <section style={mergedStyles} onClick={handleClick}>
            {props.content || 'Section content'}
          </section>
        );

      case 'container':
        return (
          <div style={mergedStyles} onClick={handleClick}>
            {props.children?.length > 0 ? (
              props.children.map((child, idx) => (
                <ComponentRenderer
                  key={child.id || idx}
                  component={child}
                  index={idx}
                  isSelected={false}
                  onSelect={() => {}}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onMove={() => {}}
                />
              ))
            ) : (
              <div style={{ padding: '1rem', color: '#999' }}>Empty container</div>
            )}
          </div>
        );

      default:
        return (
          <div style={mergedStyles} onClick={handleClick}>
            Unknown component type: {type}
          </div>
        );
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`component-wrapper ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      {isSelected && (
        <div className="component-controls">
          <button className="delete-btn" onClick={handleDelete}>
            ×
          </button>
        </div>
      )}
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;
