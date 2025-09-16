import React from 'react';

// Premium Parameter Controls Component
const ParameterControls = ({ params, onParamsChange }) => {
  const updateParam = (key, value) => {
    onParamsChange({ ...params, [key]: value });
  };

  const hasRequiredParams = params.width && params.length && params.postHeight && params.numberOfShelves;

  return (
    <div className="premium-card h-[820px] flex flex-col">
      <div className="premium-header p-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Configuration Panel</h3>
            <p className="text-gray-300 font-medium text-sm mt-0">Precise parameter control</p>
          </div>
          {hasRequiredParams && (
            <div className="premium-status-badge bg-green-900/30 border-green-500/50">
              <div className="status-dot bg-green-400"></div>
              <span className="text-sm font-semibold text-green-400">Complete</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto premium-scrollbar">
        <div className="px-3 pb-3 space-y-3">
          {/* Required Parameters */}
          <div className="premium-section-required">
            <h4 className="premium-section-title mb-2">Essential Dimensions</h4>
            <div className="space-y-2">
              <div className="premium-input-group">
                <label className="premium-label">Width (inches)</label>
                <input
                  type="number"
                  value={params.width || ''}
                  onChange={(e) => updateParam('width', parseInt(e.target.value) || 0)}
                  className="premium-number-input"
                  min="12" max="96"
                  placeholder="36"
                />
              </div>
              
              <div className="premium-input-group">
                <label className="premium-label">Length (inches)</label>
                <input
                  type="number"
                  value={params.length || ''}
                  onChange={(e) => updateParam('length', parseInt(e.target.value) || 0)}
                  className="premium-number-input"
                  min="12" max="48"
                  placeholder="24"
                />
              </div>
              
              <div className="premium-input-group">
                <label className="premium-label">Post Height (inches)</label>
                <input
                  type="number"
                  value={params.postHeight || ''}
                  onChange={(e) => updateParam('postHeight', parseInt(e.target.value) || 0)}
                  className="premium-number-input"
                  min="36" max="96"
                  placeholder="72"
                />
              </div>
              
              <div className="premium-input-group">
                <label className="premium-label">Number of Shelves</label>
                <input
                  type="number"
                  value={params.numberOfShelves || ''}
                  onChange={(e) => updateParam('numberOfShelves', parseInt(e.target.value) || 0)}
                  className="premium-number-input"
                  min="2" max="8"
                  placeholder="4"
                />
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className="premium-section-optional">
            <h4 className="premium-section-title mb-2">Style & Finish</h4>
            <div className="space-y-2">
              <div className="premium-input-group">
                <label className="premium-label">Shelf Style</label>
                <select
                  value={params.shelfStyle || 'Industrial Grid'}
                  onChange={(e) => updateParam('shelfStyle', e.target.value)}
                  className="premium-select-input"
                >
                  <option value="Industrial Grid">Industrial Grid</option>
                  <option value="Metro Classic">Metro Classic</option>
                  <option value="Commercial Pro">Commercial Pro</option>
                  <option value="Heavy Duty">Heavy Duty</option>
                </select>
              </div>
              
              <div className="premium-input-group">
                <label className="premium-label">Color Finish</label>
                <select
                  value={params.color || 'Chrome'}
                  onChange={(e) => updateParam('color', e.target.value)}
                  className="premium-select-input"
                >
                  <option value="Chrome">Chrome</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Zinc">Zinc</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="premium-section-optional">
            <h4 className="premium-section-title mb-2">Configuration</h4>
            <div className="space-y-2">
              <div className="premium-input-group">
                <label className="premium-label">Post Type</label>
                <select
                  value={params.postType || 'Stationary'}
                  onChange={(e) => updateParam('postType', e.target.value)}
                  className="premium-select-input"
                >
                  <option value="Stationary">Stationary</option>
                  <option value="Mobile">Mobile (with casters)</option>
                </select>
              </div>
              
              <div className="premium-checkbox-group">
                <label className="premium-checkbox-label">
                  <input
                    type="checkbox"
                    checked={params.solidBottomShelf || false}
                    onChange={(e) => updateParam('solidBottomShelf', e.target.checked)}
                    className="premium-checkbox-input"
                  />
                  <span className="premium-checkbox-custom"></span>
                  <span className="premium-checkbox-text">Solid Bottom Shelf</span>
                </label>
                <p className="premium-sublabel">Replace bottom wire shelf with solid surface for small items</p>
              </div>
            </div>
          </div>

          {/* Accessories Section */}
          <div className="premium-section-optional">
            <h4 className="premium-section-title mb-2">Accessories</h4>
            <div className="space-y-2">
              <div className="premium-input-group">
                <label className="premium-label">Shelf Dividers</label>
                <p className="premium-sublabel">Add vertical dividers to create organized sections</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Number of Dividers per Shelf</label>
                    <input
                      type="number"
                      value={params.shelfDividersCount || ''}
                      onChange={(e) => updateParam('shelfDividersCount', parseInt(e.target.value) || 0)}
                      className="premium-number-input"
                      min="0" max="6"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Apply to Shelves</label>
                    <select
                      multiple
                      value={params.shelfDividersShelves || []}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                        updateParam('shelfDividersShelves', values);
                      }}
                      className="premium-select-input h-20"
                    >
                      {Array.from({ length: params.numberOfShelves || 0 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Shelf {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="premium-input-group">
                <label className="premium-label">Enclosure Type</label>
                <p className="premium-sublabel">Add panels for dust protection or security</p>
                <select
                  value={params.enclosureType || 'none'}
                  onChange={(e) => updateParam('enclosureType', e.target.value)}
                  className="premium-select-input"
                >
                  <option value="none">No Enclosure</option>
                  <option value="back">Back Panel Only</option>
                  <option value="sides">Side Panels Only</option>
                  <option value="full">Full Enclosure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          {hasRequiredParams && (
            <div className="premium-section-summary">
              <h4 className="premium-section-title mb-2">Configuration Summary</h4>
              <div className="premium-summary-grid">
                <div className="premium-summary-item">
                  <span className="premium-summary-label">Dimensions:</span>
                  <span className="premium-summary-value">{params.width}" × {params.length}" × {params.postHeight}"</span>
                </div>
                <div className="premium-summary-item">
                  <span className="premium-summary-label">Shelves:</span>
                  <span className="premium-summary-value">{params.numberOfShelves} levels</span>
                </div>
                <div className="premium-summary-item">
                  <span className="premium-summary-label">Style:</span>
                  <span className="premium-summary-value">{params.shelfStyle}</span>
                </div>
                <div className="premium-summary-item">
                  <span className="premium-summary-label">Finish:</span>
                  <span className="premium-summary-value">{params.color}</span>
                </div>
                {params.postType === 'Mobile' && (
                  <div className="premium-summary-item">
                    <span className="premium-summary-label">Mobility:</span>
                    <span className="premium-summary-value">Mobile with casters</span>
                  </div>
                )}
                {params.solidBottomShelf && (
                  <div className="premium-summary-item">
                    <span className="premium-summary-label">Bottom:</span>
                    <span className="premium-summary-value">Solid shelf</span>
                  </div>
                )}
                {params.shelfDividersCount > 0 && (
                  <div className="premium-summary-item">
                    <span className="premium-summary-label">Dividers:</span>
                    <span className="premium-summary-value">{params.shelfDividersCount} per shelf</span>
                  </div>
                )}
                {params.enclosureType !== 'none' && (
                  <div className="premium-summary-item">
                    <span className="premium-summary-label">Enclosure:</span>
                    <span className="premium-summary-value">{params.enclosureType}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;
