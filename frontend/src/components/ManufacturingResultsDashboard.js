import React from 'react';

const ManufacturingResultsDashboard = ({ analysisResults, onProceedTo3D }) => {
  if (!analysisResults) return null;

  const { machineCompatibility, referenceDesignFound, modificationRequirements, projectEstimation } = analysisResults;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPATIBLE':
        return { icon: '✅', color: 'text-green-400', bg: 'bg-green-400/10' };
      case 'ANALYSIS_REQUIRED':
        return { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      default:
        return { icon: '❌', color: 'text-red-400', bg: 'bg-red-400/10' };
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const statusInfo = getStatusIcon(machineCompatibility.status);

  return (
    <div className="manufacturing-results-dashboard">
      <div className="results-header">
        <h2 className="results-title">Manufacturing Feasibility Analysis Results</h2>
        <p className="results-subtitle">
          Oracle Agile PLM Analysis • Component Compatibility Assessment • Implementation Planning
        </p>
      </div>

      {/* Section 1: Machine Compatibility Assessment */}
      <div className="results-section">
        <div className="section-header">
          <div className={`status-indicator ${statusInfo.bg}`}>
            <span className="status-icon">{statusInfo.icon}</span>
          </div>
          <div className="section-title-group">
            <h3 className="section-title">Machine Compatibility Assessment</h3>
            <p className="section-subtitle">
              {machineCompatibility.status} - {machineCompatibility.machineCode || 'Analysis Required'}
            </p>
          </div>
        </div>

        <div className="compatibility-grid">
          {Object.entries(machineCompatibility.details).map(([key, value]) => (
            <div key={key} className="compatibility-item">
              <div className="compatibility-label">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </div>
              <div className="compatibility-value">
                {typeof value === 'object' && value !== null ?
                  (Array.isArray(value) ? value.join(', ') : JSON.stringify(value)) :
                  String(value || '')
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Reference Design Analysis */}
      <div className="results-section">
        <div className="section-header">
          <div className="status-indicator bg-blue-400/10">
            <span className="status-icon">📋</span>
          </div>
          <div className="section-title-group">
            <h3 className="section-title">Reference Design Analysis</h3>
            <p className="section-subtitle">
              {referenceDesignFound.machineCode ? `Reference Found: Machine Code ${referenceDesignFound.machineCode}` : 'No Reference Found'}
            </p>
          </div>
        </div>

        <div className="reference-design-content">
          {referenceDesignFound.designComponents && referenceDesignFound.designComponents.length > 0 ? (
            <>
              <div className="design-info-grid">
                <div className="design-info-item">
                  <span className="info-label">Design Age:</span>
                  <span className="info-value">{referenceDesignFound.designAge}</span>
                </div>
                <div className="design-info-item">
                  <span className="info-label">Current Standard:</span>
                  <span className="info-value">{referenceDesignFound.currentStandard}</span>
                </div>
                <div className="design-info-item">
                  <span className="info-label">BOM Status:</span>
                  <span className="info-value">{referenceDesignFound.bomStatus}</span>
                </div>
              </div>

              <div className="components-list">
                <h4 className="components-title">Reference Components</h4>
                {referenceDesignFound.designComponents.map((component, index) => (
                  <div key={index} className="component-item">
                    <div className="component-info">
                      <span className="component-part-number">{component.agilePartNumber}</span>
                      <span className="component-description">{component.description}</span>
                    </div>
                    <div className="component-method">
                      <span className={`copy-method ${component.copyMethod.toLowerCase().replace('_', '-')}`}>
                        {component.copyMethod.replace('_', ' ')}
                      </span>
                      <span className={`modification-level ${component.modificationLevel.toLowerCase()}`}>
                        {component.modificationLevel} Complexity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-reference-found">
              <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">No reference design found. Custom development required.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Implementation Plan */}
      <div className="results-section">
        <div className="section-header">
          <div className="status-indicator bg-purple-400/10">
            <span className="status-icon">🔧</span>
          </div>
          <div className="section-title-group">
            <h3 className="section-title">Implementation Plan</h3>
            <p className="section-subtitle">
              Development Requirements & Project Estimation
            </p>
          </div>
        </div>

        <div className="implementation-content">
          {/* Modification Requirements */}
          {(modificationRequirements.critical.length > 0 || modificationRequirements.superficial.length > 0) && (
            <div className="modifications-section">
              <h4 className="modifications-title">Required Modifications</h4>
              
              {modificationRequirements.critical.length > 0 && (
                <div className="modification-group">
                  <h5 className="modification-group-title critical">
                    <span className="modification-icon">🔴</span>
                    Critical Modifications: {modificationRequirements.critical.length} component(s)
                  </h5>
                  {modificationRequirements.critical.map((mod, index) => (
                    <div key={index} className="modification-item critical">
                      <div className="modification-header">
                        <span className="modification-component">{mod.component}</span>
                        <span className="modification-hours">{mod.estimatedHours}h</span>
                      </div>
                      <p className="modification-description">{mod.change}</p>
                      <p className="modification-reason">Reason: {mod.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {modificationRequirements.superficial.length > 0 && (
                <div className="modification-group">
                  <h5 className="modification-group-title superficial">
                    <span className="modification-icon">🟡</span>
                    Superficial Modifications: {modificationRequirements.superficial.length} component(s)
                  </h5>
                  {modificationRequirements.superficial.map((mod, index) => (
                    <div key={index} className="modification-item superficial">
                      <div className="modification-header">
                        <span className="modification-component">{mod.component}</span>
                        <span className="modification-hours">{mod.estimatedHours}h</span>
                      </div>
                      <p className="modification-description">{mod.change}</p>
                      <p className="modification-reason">Reason: {mod.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Estimation */}
          <div className="project-estimation">
            <h4 className="estimation-title">Project Estimation</h4>
            <div className="estimation-grid">
              <div className="estimation-item">
                <span className="estimation-label">Development Time:</span>
                <span className="estimation-value">{projectEstimation.totalDevelopmentTime}</span>
              </div>
              <div className="estimation-item">
                <span className="estimation-label">Engineering Hours:</span>
                <span className="estimation-value">{projectEstimation.engineeringHours}</span>
              </div>
              <div className="estimation-item">
                <span className="estimation-label">Cost Estimate:</span>
                <span className="estimation-value">{projectEstimation.costEstimate}</span>
              </div>
              <div className="estimation-item">
                <span className="estimation-label">Risk Level:</span>
                <span className={`estimation-value ${getRiskColor(projectEstimation.riskLevel)}`}>
                  {projectEstimation.riskLevel}
                </span>
              </div>
              <div className="estimation-item">
                <span className="estimation-label">Success Probability:</span>
                <span className="estimation-value">{projectEstimation.confidence}</span>
              </div>
              <div className="estimation-item full-width">
                <span className="estimation-label">Next Step:</span>
                <span className="estimation-value next-step">{projectEstimation.nextStep}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <button 
          onClick={onProceedTo3D}
          className="proceed-btn primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Proceed to 3D Design Configuration
        </button>
        
        <button className="proceed-btn secondary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Analysis Report
        </button>
      </div>
    </div>
  );
};

export default ManufacturingResultsDashboard;
