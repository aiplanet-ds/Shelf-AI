import React, { useState, useEffect } from 'react';
import { componentLibrary, calculateCompatibilityScore, filterComponents } from '../data/componentLibrary';

const ComponentDatabase = ({ 
  problemStatement, 
  selectedComponents, 
  onComponentsChange, 
  onNext,
  className = "" 
}) => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    loadCapacity: 'all',
    environment: 'all',
    material: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate analysis loading
    setIsLoading(true);
    setTimeout(() => {
      const analyzedComponents = componentLibrary.map(component => ({
        ...component,
        compatibilityScore: calculateCompatibilityScore(component, problemStatement)
      })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      
      setComponents(analyzedComponents);
      setFilteredComponents(analyzedComponents.slice(0, 10)); // Show top 10 initially
      setIsLoading(false);
    }, 1500);
  }, [problemStatement]);

  useEffect(() => {
    const filtered = filterComponents(components, filters);
    setFilteredComponents(filtered);
  }, [components, filters]);

  const handleComponentToggle = (componentId) => {
    const newSelected = selectedComponents.includes(componentId)
      ? selectedComponents.filter(id => id !== componentId)
      : [...selectedComponents, componentId];
    onComponentsChange(newSelected);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getCompatibilityBadge = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    return 'Fair';
  };

  if (isLoading) {
    return (
      <div className="premium-component-loading">
        <div className="premium-loading-content">
          <div className="premium-loading-spinner">
            <svg className="animate-spin w-12 h-12" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="premium-loading-title">Analyzing Components</h3>
          <p className="premium-loading-subtitle">
            Matching your requirements with our component database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`premium-component-database ${className}`}>
      <div className="premium-component-header">
        <div className="premium-component-title-section">
          <h2 className="premium-component-title">Component Analysis</h2>
          <p className="premium-component-subtitle">
            Select compatible components based on your requirements. 
            Components are ranked by compatibility score.
          </p>
        </div>
        <div className="premium-component-stats">
          <div className="premium-stat-card">
            <span className="premium-stat-number">{filteredComponents.length}</span>
            <span className="premium-stat-label">Components Found</span>
          </div>
          <div className="premium-stat-card">
            <span className="premium-stat-number">{selectedComponents.length}</span>
            <span className="premium-stat-label">Selected</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="premium-component-filters">
        <div className="premium-filter-group">
          <label className="premium-filter-label">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="premium-filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Shelving">Shelving</option>
            <option value="Structure">Structure</option>
            <option value="Mobility">Mobility</option>
            <option value="Hardware">Hardware</option>
            <option value="Organization">Organization</option>
            <option value="Lighting">Lighting</option>
            <option value="Enclosure">Enclosure</option>
          </select>
        </div>

        <div className="premium-filter-group">
          <label className="premium-filter-label">Load Capacity</label>
          <select 
            value={filters.loadCapacity}
            onChange={(e) => handleFilterChange('loadCapacity', e.target.value)}
            className="premium-filter-select"
          >
            <option value="all">All Capacities</option>
            <option value="light">Light (≤200kg)</option>
            <option value="medium">Medium (200-400kg)</option>
            <option value="heavy">Heavy (>400kg)</option>
          </select>
        </div>

        <div className="premium-filter-group">
          <label className="premium-filter-label">Environment</label>
          <select 
            value={filters.environment}
            onChange={(e) => handleFilterChange('environment', e.target.value)}
            className="premium-filter-select"
          >
            <option value="all">All Environments</option>
            <option value="standard">Standard</option>
            <option value="cleanroom">Cleanroom</option>
            <option value="food-safe">Food Safe</option>
            <option value="industrial">Industrial</option>
            <option value="esd-safe">ESD Safe</option>
          </select>
        </div>

        <div className="premium-filter-group premium-filter-search">
          <label className="premium-filter-label">Search</label>
          <div className="premium-search-wrapper">
            <svg className="premium-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search components..."
              className="premium-search-input"
            />
          </div>
        </div>
      </div>

      {/* Component Grid */}
      <div className="premium-component-grid">
        {filteredComponents.map((component) => (
          <div 
            key={component.id}
            className={`premium-component-card ${
              selectedComponents.includes(component.id) ? 'selected' : ''
            }`}
            onClick={() => handleComponentToggle(component.id)}
          >
            <div className="premium-component-header-card">
              <div className="premium-component-thumbnail">
                <div className="premium-component-placeholder">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="premium-component-selection">
                <div className={`premium-checkbox ${
                  selectedComponents.includes(component.id) ? 'checked' : ''
                }`}>
                  {selectedComponents.includes(component.id) && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="premium-component-content">
              <div className="premium-component-title-card">
                <h3 className="premium-component-name">{component.name}</h3>
                <span className="premium-component-category">{component.category}</span>
              </div>

              <div className="premium-component-compatibility">
                <div className="premium-compatibility-score">
                  <span className={`premium-score-value ${getCompatibilityColor(component.compatibilityScore)}`}>
                    {component.compatibilityScore}%
                  </span>
                  <span className="premium-score-label">
                    {getCompatibilityBadge(component.compatibilityScore)} Match
                  </span>
                </div>
              </div>

              <div className="premium-component-specs">
                <div className="premium-spec-item">
                  <span className="premium-spec-label">Load:</span>
                  <span className="premium-spec-value">{component.loadCapacity}</span>
                </div>
                <div className="premium-spec-item">
                  <span className="premium-spec-label">Material:</span>
                  <span className="premium-spec-value">{component.material}</span>
                </div>
                <div className="premium-spec-item">
                  <span className="premium-spec-label">Size:</span>
                  <span className="premium-spec-value">{component.dimensions}</span>
                </div>
              </div>

              <p className="premium-component-description">
                {component.description}
              </p>

              <div className="premium-component-footer-card">
                <div className="premium-component-cost">
                  <span className="premium-cost-value">${component.cost}</span>
                  <span className="premium-cost-label">{component.leadTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Section */}
      <div className="premium-component-actions">
        <div className="premium-selection-summary">
          {selectedComponents.length > 0 ? (
            <span className="premium-summary-text">
              {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="premium-summary-text premium-summary-empty">
              Select components to continue
            </span>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={selectedComponents.length === 0}
          className={`premium-btn-primary premium-btn-large ${
            selectedComponents.length === 0 ? 'disabled' : ''
          }`}
        >
          Analyze Feasibility
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ComponentDatabase;
