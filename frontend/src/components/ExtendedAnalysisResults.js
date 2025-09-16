import React, { useState, useEffect } from 'react';
import { extendedMachineDatabase, machineCompatibilityAnalyzer } from '../data/advancedMachineDatabase';

const ExtendedAnalysisResults = ({ analysisResults, problemStatement, onExportResults, onProceedTo3D }) => {
  const [activeTab, setActiveTab] = useState('executive');
  const [expandedSections, setExpandedSections] = useState({});
  const [animatedMetrics, setAnimatedMetrics] = useState({});

  useEffect(() => {
    // Animate metrics on mount
    if (analysisResults?.aiMetrics) {
      Object.entries(analysisResults.aiMetrics).forEach(([key, targetValue]) => {
        const duration = 2000;
        const startTime = Date.now();
        
        const animateValue = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.round(targetValue * easeOutQuart);
          
          setAnimatedMetrics(prev => ({
            ...prev,
            [key]: currentValue
          }));
          
          if (progress < 1) {
            requestAnimationFrame(animateValue);
          }
        };
        
        requestAnimationFrame(animateValue);
      });
    }
  }, [analysisResults]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'feasible with modifications':
      case 'compatible':
        return { icon: '✅', color: '#10b981' };
      case 'requires analysis':
      case 'analysis required':
        return { icon: '⚠️', color: '#f59e0b' };
      case 'not feasible':
      case 'incompatible':
        return { icon: '❌', color: '#ef4444' };
      default:
        return { icon: '📊', color: '#6b7280' };
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium-low': return '#84cc16';
      case 'medium': return '#f59e0b';
      case 'medium-high': return '#f97316';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatMetricValue = (key, value) => {
    if (key.includes('records') || key.includes('depth') || key.includes('confidence')) {
      return value?.toLocaleString() || '0';
    }
    return value || '0';
  };

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: '📊' },
    { id: 'detailed', label: 'Detailed Analysis', icon: '🔍' },
    { id: 'risks', label: 'Risk Assessment', icon: '⚠️' },
    { id: 'implementation', label: 'Implementation Plan', icon: '🚀' }
  ];

  if (!analysisResults) {
    return (
      <div className="extended-results-placeholder">
        <div className="placeholder-icon">📋</div>
        <h3 className="placeholder-title">Analysis Results Pending</h3>
        <p className="placeholder-description">
          Complete the AI analysis to view comprehensive results and recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="extended-analysis-results">
      {/* Header */}
      <div className="results-header-extended">
        <div className="header-content">
          <div className="header-icon">🤖</div>
          <div className="header-text">
            <h2 className="results-title-extended">AI Manufacturing Analysis Results</h2>
            <p className="results-subtitle-extended">
              Comprehensive feasibility assessment with enterprise-grade recommendations
            </p>
          </div>
          <div className="header-status">
            {(() => {
              const statusInfo = getStatusIcon(analysisResults.executiveSummary?.feasibilityStatus);
              return (
                <div className="status-badge" style={{ color: statusInfo.color }}>
                  <span className="status-icon">{statusInfo.icon}</span>
                  <span className="status-text">{analysisResults.executiveSummary?.feasibilityStatus}</span>
                </div>
              );
            })()}
          </div>
        </div>
        
        {/* AI Metrics Bar */}
        <div className="ai-metrics-bar">
          {Object.entries(animatedMetrics).map(([key, value]) => (
            <div key={key} className="metric-item-bar">
              <div className="metric-value-bar">{formatMetricValue(key, value)}</div>
              <div className="metric-label-bar">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="results-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'executive' && (
          <div className="executive-summary-tab">
            <div className="summary-grid">
              <div className="summary-card primary">
                <div className="card-header">
                  <div className="card-icon">🎯</div>
                  <h3 className="card-title">Feasibility Assessment</h3>
                </div>
                <div className="card-content">
                  <div className="primary-metric">
                    <span className="metric-value-large">
                      {analysisResults.executiveSummary?.overallConfidence}%
                    </span>
                    <span className="metric-label-large">AI Confidence</span>
                  </div>
                  <div className="status-details">
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{analysisResults.executiveSummary?.feasibilityStatus}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Risk Level:</span>
                      <span 
                        className="detail-value"
                        style={{ color: getRiskColor(analysisResults.executiveSummary?.riskLevel) }}
                      >
                        {analysisResults.executiveSummary?.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-header">
                  <div className="card-icon">⏱️</div>
                  <h3 className="card-title">Timeline & Budget</h3>
                </div>
                <div className="card-content">
                  <div className="timeline-budget">
                    <div className="timeline-item">
                      <span className="timeline-label">Estimated Timeline:</span>
                      <span className="timeline-value">{analysisResults.executiveSummary?.estimatedTimeline}</span>
                    </div>
                    <div className="budget-item">
                      <span className="budget-label">Budget Range:</span>
                      <span className="budget-value">{analysisResults.executiveSummary?.budgetRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-header">
                  <div className="card-icon">🔧</div>
                  <h3 className="card-title">Technical Overview</h3>
                </div>
                <div className="card-content">
                  <div className="technical-overview">
                    {Object.entries(analysisResults.detailedAnalysis?.machineCompatibility || {}).map(([key, value]) => (
                      <div key={key} className="tech-item">
                        <span className="tech-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span className="tech-value">
                          {typeof value === 'object' && value !== null ?
                            (Array.isArray(value) ? value.join(', ') : JSON.stringify(value)) :
                            String(value || '')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Recommendations */}
            <div className="key-recommendations">
              <h3 className="recommendations-title">
                <span className="recommendations-icon">💡</span>
                Key Recommendations
              </h3>
              <div className="recommendations-list">
                {(analysisResults.keyRecommendations || []).map((recommendation, index) => (
                  <div key={index} className={`recommendation-item priority-${recommendation.priority.toLowerCase()}`}>
                    <div className="recommendation-priority">{recommendation.priority} Priority</div>
                    <div className="recommendation-title">{recommendation.title}</div>
                    <div className="recommendation-text">{recommendation.description}</div>
                    <div className="recommendation-meta">
                      <span className="recommendation-impact">Impact: {recommendation.impact}</span>
                      <span className="recommendation-timeline">Timeline: {recommendation.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="detailed-analysis-tab">
            <div className="analysis-sections">
              {/* Machine Compatibility */}
              <div className="analysis-section">
                <div 
                  className="section-header clickable"
                  onClick={() => toggleSection('machineCompatibility')}
                >
                  <h3 className="section-title">
                    <span className="section-icon">🔧</span>
                    Machine Compatibility Analysis
                  </h3>
                  <div className="section-toggle">
                    {expandedSections.machineCompatibility ? '▼' : '▶'}
                  </div>
                </div>
                {expandedSections.machineCompatibility && (
                  <div className="section-content">
                    <div className="compatibility-grid">
                      {Object.entries(analysisResults.detailedAnalysis?.machineCompatibility || {}).map(([key, value]) => (
                        <div key={key} className="compatibility-detail">
                          <div className="detail-header">
                            <span className="detail-title">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="detail-status">
                              {typeof value === 'object' && value !== null ?
                                (Array.isArray(value) ? value.join(', ') : JSON.stringify(value)) :
                                String(value || '')
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Component Analysis */}
              <div className="analysis-section">
                <div 
                  className="section-header clickable"
                  onClick={() => toggleSection('componentAnalysis')}
                >
                  <h3 className="section-title">
                    <span className="section-icon">⚙️</span>
                    Component Analysis
                  </h3>
                  <div className="section-toggle">
                    {expandedSections.componentAnalysis ? '▼' : '▶'}
                  </div>
                </div>
                {expandedSections.componentAnalysis && (
                  <div className="section-content">
                    <div className="component-stats">
                      {Object.entries(analysisResults.detailedAnalysis?.componentAnalysis || {}).map(([key, value]) => (
                        <div key={key} className="component-stat">
                          <div className="stat-value">
                            {typeof value === 'object' && value !== null ? (
                              Array.isArray(value) ? (
                                <ul className="component-list">
                                  {value.map((item, idx) => (
                                    <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="component-details">
                                  <div className="component-material">{value.material || ''}</div>
                                  <div className="component-compatibility">{value.compatibility || ''}</div>
                                  <div className="component-modifications">{value.modifications || ''}</div>
                                </div>
                              )
                            ) : (
                              String(value || '')
                            )}
                          </div>
                          <div className="stat-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="risk-assessment-tab">
            <div className="risk-overview">
              <div className="risk-summary">
                <h3 className="risk-title">Risk Assessment Summary</h3>
                <div className="risk-level-indicator">
                  <span 
                    className="risk-level-badge"
                    style={{ 
                      backgroundColor: getRiskColor(analysisResults.executiveSummary?.riskLevel),
                      color: 'white'
                    }}
                  >
                    {analysisResults.executiveSummary?.riskLevel} Risk
                  </span>
                </div>
              </div>
              
              <div className="risk-mitigation">
                <h4 className="mitigation-title">Identified Risks & Mitigation Strategies</h4>
                <div className="mitigation-list">
                  {(analysisResults.detailedAnalysis?.riskMitigation?.identifiedRisks || []).map((risk, index) => (
                    <div key={index} className="mitigation-item">
                      <div className="mitigation-icon">⚠️</div>
                      <div className="mitigation-content">
                        <div className="mitigation-strategy">Risk: {risk}</div>
                        <div className="mitigation-description">
                          Mitigation: {analysisResults.detailedAnalysis?.riskMitigation?.mitigationStrategies?.[index] || 'Strategy under development'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="implementation-tab">
            <div className="implementation-roadmap">
              <h3 className="roadmap-title">Implementation Roadmap</h3>
              <div className="roadmap-phases">
                {Object.entries(analysisResults.implementationPlan || {}).map(([phaseKey, phase], index) => (
                  <div key={phaseKey} className="phase-item">
                    <div className="phase-number">{index + 1}</div>
                    <div className="phase-content">
                      <div className="phase-title">{phase.name}</div>
                      <div className="phase-duration">{phase.duration}</div>
                      <div className="phase-description">
                        <ul className="phase-tasks">
                          {(phase.tasks || []).map((task, taskIndex) => (
                            <li key={taskIndex}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="results-actions-extended">
        <button 
          onClick={onExportResults}
          className="action-btn secondary"
        >
          <span className="btn-icon">📄</span>
          <span>Export Full Report</span>
        </button>
        
        <button 
          onClick={onProceedTo3D}
          className="action-btn primary"
        >
          <span className="btn-icon">🚀</span>
          <span>Proceed to 3D Configuration</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default ExtendedAnalysisResults;
