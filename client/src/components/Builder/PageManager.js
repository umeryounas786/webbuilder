import React from 'react';
import './PageManager.css';

const PageManager = ({ pages, currentPageId, onSelectPage, onAddPage, onDeletePage, onRenamePage }) => {
  const currentPage = pages.find(p => p.id === currentPageId);

  return (
    <div className="page-manager">
      <div className="page-manager-header">
        <h4>Pages</h4>
        <button onClick={onAddPage} className="add-page-btn" title="Add new page">
          +
        </button>
      </div>
      <div className="pages-list">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-item ${currentPageId === page.id ? 'active' : ''}`}
          >
            <input
              type="text"
              value={page.name}
              onChange={(e) => onRenamePage(page.id, e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPage(page.id);
              }}
              onFocus={(e) => onSelectPage(page.id)}
              className="page-name-input"
            />
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete page "${page.name}"?`)) {
                    onDeletePage(page.id);
                  }
                }}
                className="delete-page-btn"
                title="Delete page"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManager;
