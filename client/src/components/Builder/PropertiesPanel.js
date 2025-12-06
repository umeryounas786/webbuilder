import React, { useState, useEffect } from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ component, onUpdateComponent }) => {
  const [localProps, setLocalProps] = useState({});
  const [localStyles, setLocalStyles] = useState({});

  useEffect(() => {
    if (component) {
      setLocalProps(component.props || {});
      setLocalStyles(component.styles || {});
    }
  }, [component]);

  if (!component) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <div className="no-selection">
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key, value) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdateComponent({ props: newProps });
  };

  const handleStyleChange = (key, value) => {
    const newStyles = { ...localStyles, [key]: value };
    setLocalStyles(newStyles);
    onUpdateComponent({ styles: newStyles });
  };

  const renderPropertyInputs = () => {
    const { type, props } = component;

    switch (type) {
      case 'header':
        return (
          <>
            <div className="property-group">
              <label>Text</label>
              <input
                type="text"
                value={localProps.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>Level (1-6)</label>
              <input
                type="number"
                min="1"
                max="6"
                value={localProps.level || 1}
                onChange={(e) => handlePropChange('level', parseInt(e.target.value))}
              />
            </div>
          </>
        );

      case 'text':
        return (
          <div className="property-group">
            <label>Content</label>
            <textarea
              value={localProps.content || ''}
              onChange={(e) => handlePropChange('content', e.target.value)}
              rows="4"
            />
          </div>
        );

      case 'button':
        return (
          <>
            <div className="property-group">
              <label>Label</label>
              <input
                type="text"
                value={localProps.label || ''}
                onChange={(e) => handlePropChange('label', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>Link</label>
              <input
                type="text"
                value={localProps.link || ''}
                onChange={(e) => handlePropChange('link', e.target.value)}
              />
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div className="property-group">
              <label>Image URL</label>
              <input
                type="text"
                value={localProps.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={localProps.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
              />
            </div>
          </>
        );

      case 'section':
        return (
          <div className="property-group">
            <label>Content</label>
            <textarea
              value={localProps.content || ''}
              onChange={(e) => handlePropChange('content', e.target.value)}
              rows="4"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const commonStyles = [
    { key: 'padding', label: 'Padding', type: 'text' },
    { key: 'margin', label: 'Margin', type: 'text' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'fontSize', label: 'Font Size', type: 'text' },
    { key: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'] },
    { key: 'borderRadius', label: 'Border Radius', type: 'text' },
    { key: 'width', label: 'Width', type: 'text' },
    { key: 'height', label: 'Height', type: 'text' }
  ];

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div className="property-section">
        <h4>Component: {component.type}</h4>
        
        <div className="property-subsection">
          <h5>Component Properties</h5>
          {renderPropertyInputs()}
        </div>

        <div className="property-subsection">
          <h5>Styles</h5>
          {commonStyles.map((style) => (
            <div key={style.key} className="property-group">
              <label>{style.label}</label>
              {style.type === 'select' ? (
                <select
                  value={localStyles[style.key] || ''}
                  onChange={(e) => handleStyleChange(style.key, e.target.value)}
                >
                  <option value="">Default</option>
                  {style.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : style.type === 'color' ? (
                <input
                  type="color"
                  value={localStyles[style.key] || '#000000'}
                  onChange={(e) => handleStyleChange(style.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  value={localStyles[style.key] || ''}
                  onChange={(e) => handleStyleChange(style.key, e.target.value)}
                  placeholder="e.g., 1rem, 10px, #fff"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
