import React, { useState, useEffect } from 'react';
import { componentLibrary } from '../data/componentLibrary';

const FeasibilityDashboard = ({ 
  problemStatement, 
  selectedComponents, 
  onNext,
  className = "" 
}) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Simulate feasibility analysis
    setIsLoading(true);
    setTimeout(() => {
      const selectedComponentData = componentLibrary.filter(comp => 
        selectedComponents.includes(comp.id)
      );
      
      const results = generateFeasibilityAnalysis(problemStatement, selectedComponentData);
      setAnalysisResults(results);
      setIsLoading(false);
    }, 2000);
  }, [problemStatement, selectedComponents]);

  const generateFeasibilityAnalysis = (statement, components) => {
    const totalCost = components.reduce((sum, comp) => sum + comp.cost, 0);
    const maxLoadCapacity = Math.max(...components.map(comp => parseInt(comp.loadCapacity) || 0));
    const hasHeavyDuty = components.some(comp => parseInt(comp.loadCapacity) > 400);
    const hasSpecialMaterials = components.some(comp => 
      comp.material.includes('Stainless') || comp.material.includes('Conductive')
    );

    // Structural Analysis
    const structuralScore = hasHeavyDuty ? 
      (statement.toLowerCase().includes('heavy') ? 92 : 85) : 
      (statement.toLowerCase().includes('light') ? 88 : 75);

    // Manufacturing Analysis
    const manufacturingScore = hasSpecialMaterials ? 
      (components.length <= 5 ? 90 : 82) : 
      (components.length <= 8 ? 95 : 88);

    // Timeline Analysis
    const maxLeadTime = Math.max(...components.map(comp => {
      const days = comp.leadTime.match(/(\d+)/);
      return days ? parseInt(days[1]) : 5;
    }));

    return {
      structural: {
        score: structuralScore,
        status: structuralScore >= 85 ? 'excellent' : structuralScore >= 70 ? 'good' : 'fair',
        details: {
          loadCapacity: `${maxLoadCapacity}kg maximum capacity`,
          stability: hasHeavyDuty ? 'High stability with heavy-duty components' : 'Standard stability',
          safety: 'Meets industrial safety standards',
          recommendations: structuralScore < 85 ? ['Consider adding reinforcement components'] : []
        }
      },
      manufacturing: {
        score: manufacturingScore,
        status: manufacturingScore >= 85 ? 'excellent' : manufacturingScore >= 70 ? 'good' : 'fair',
        details: {
          complexity: components.length <= 5 ? 'Low complexity' : components.length <= 8 ? 'Medium complexity' : 'High complexity',
          tooling: hasSpecialMaterials ? 'Specialized tooling required' : 'Standard tooling sufficient',
          assembly: 'Modular assembly process',
          recommendations: manufacturingScore < 85 ? ['Simplify component selection', 'Consider standard materials'] : []
        }
      },
      cost: {
        estimated: totalCost,
        breakdown: {
          materials: totalCost * 0.6,
          labor: totalCost * 0.25,
          overhead: totalCost * 0.15
        },
        comparison: totalCost < 500 ? 'Below average cost' : totalCost < 1000 ? 'Average cost' : 'Above average cost'
      },
      timeline: {
        days: maxLeadTime + 3, // Add assembly time
        details: {
          procurement: `${maxLeadTime} days`,
          assembly: '2-3 days',
          testing: '1 day',
          delivery: '1-2 days'
        },
        status: maxLeadTime <= 5 ? 'fast' : maxLeadTime <= 10 ? 'standard' : 'extended'
      }
    };
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'fair': return 'text-orange-400';
      case 'fast': return 'text-green-400';
      case 'standard': return 'text-yellow-400';
      case 'extended': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'fair': return 'Needs Review';
      case 'fast': return 'Fast Track';
      case 'standard': return 'Standard';
      case 'extended': return 'Extended';
      default: return 'Unknown';
    }
  };

  const ProgressRing = ({ score, size = 80 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
      <div className="premium-progress-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="premium-progress-svg">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--premium-border)"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--premium-accent)"
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="premium-progress-circle"
          />
        </svg>
        <div className="premium-progress-text">
          <span className="premium-progress-score">{score}</span>
          <span className="premium-progress-unit">%</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="premium-feasibility-loading">
        <div className="premium-loading-content">
          <div className="premium-loading-spinner">
            <svg className="animate-spin w-12 h-12" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="premium-loading-title">Analyzing Feasibility</h3>
          <p className="premium-loading-subtitle">
            Evaluating structural integrity, manufacturing complexity, costs, and timeline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`premium-feasibility-dashboard ${className}`}>
      <div className="premium-feasibility-header">
        <h2 className="premium-feasibility-title">Feasibility Analysis</h2>
        <p className="premium-feasibility-subtitle">
          Comprehensive analysis of your selected components and requirements
        </p>
      </div>

      <div className="premium-analysis-grid">
        {/* Structural Feasibility */}
        <div className="premium-analysis-card">
          <div className="premium-analysis-header">
            <div className="premium-analysis-icon structural">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="premium-analysis-title-section">
              <h3 className="premium-analysis-title">Structural Feasibility</h3>
              <span className={`premium-analysis-status ${getStatusColor(analysisResults.structural.status)}`}>
                {getStatusBadge(analysisResults.structural.status)}
              </span>
            </div>
            <ProgressRing score={analysisResults.structural.score} />
          </div>
          
          <div className="premium-analysis-summary">
            <div className="premium-summary-item">
              <span className="premium-summary-label">Load Capacity:</span>
              <span className="premium-summary-value">{analysisResults.structural.details.loadCapacity}</span>
            </div>
            <div className="premium-summary-item">
              <span className="premium-summary-label">Stability:</span>
              <span className="premium-summary-value">{analysisResults.structural.details.stability}</span>
            </div>
          </div>

          <button 
            className="premium-expand-btn"
            onClick={() => toggleSection('structural')}
          >
            {expandedSections.structural ? 'Show Less' : 'Show Details'}
            <svg className={`w-4 h-4 transition-transform ${expandedSections.structural ? 'rotate-180' : ''}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.structural && (
            <div className="premium-analysis-details">
              <div className="premium-detail-item">
                <strong>Safety Compliance:</strong> {analysisResults.structural.details.safety}
              </div>
              {analysisResults.structural.details.recommendations.length > 0 && (
                <div className="premium-recommendations">
                  <strong>Recommendations:</strong>
                  <ul>
                    {analysisResults.structural.details.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manufacturing Feasibility */}
        <div className="premium-analysis-card">
          <div className="premium-analysis-header">
            <div className="premium-analysis-icon manufacturing">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="premium-analysis-title-section">
              <h3 className="premium-analysis-title">Manufacturing Feasibility</h3>
              <span className={`premium-analysis-status ${getStatusColor(analysisResults.manufacturing.status)}`}>
                {getStatusBadge(analysisResults.manufacturing.status)}
              </span>
            </div>
            <ProgressRing score={analysisResults.manufacturing.score} />
          </div>
          
          <div className="premium-analysis-summary">
            <div className="premium-summary-item">
              <span className="premium-summary-label">Complexity:</span>
              <span className="premium-summary-value">{analysisResults.manufacturing.details.complexity}</span>
            </div>
            <div className="premium-summary-item">
              <span className="premium-summary-label">Assembly:</span>
              <span className="premium-summary-value">{analysisResults.manufacturing.details.assembly}</span>
            </div>
          </div>

          <button 
            className="premium-expand-btn"
            onClick={() => toggleSection('manufacturing')}
          >
            {expandedSections.manufacturing ? 'Show Less' : 'Show Details'}
            <svg className={`w-4 h-4 transition-transform ${expandedSections.manufacturing ? 'rotate-180' : ''}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.manufacturing && (
            <div className="premium-analysis-details">
              <div className="premium-detail-item">
                <strong>Tooling Requirements:</strong> {analysisResults.manufacturing.details.tooling}
              </div>
              {analysisResults.manufacturing.details.recommendations.length > 0 && (
                <div className="premium-recommendations">
                  <strong>Recommendations:</strong>
                  <ul>
                    {analysisResults.manufacturing.details.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cost Analysis */}
        <div className="premium-analysis-card">
          <div className="premium-analysis-header">
            <div className="premium-analysis-icon cost">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="premium-analysis-title-section">
              <h3 className="premium-analysis-title">Cost Analysis</h3>
              <span className="premium-analysis-status text-blue-400">
                {analysisResults.cost.comparison}
              </span>
            </div>
            <div className="premium-cost-display">
              <span className="premium-cost-value">${analysisResults.cost.estimated.toFixed(2)}</span>
              <span className="premium-cost-label">Total Estimated</span>
            </div>
          </div>
          
          <div className="premium-cost-breakdown">
            <div className="premium-cost-item">
              <span className="premium-cost-item-label">Materials</span>
              <span className="premium-cost-item-value">${analysisResults.cost.breakdown.materials.toFixed(2)}</span>
            </div>
            <div className="premium-cost-item">
              <span className="premium-cost-item-label">Labor</span>
              <span className="premium-cost-item-value">${analysisResults.cost.breakdown.labor.toFixed(2)}</span>
            </div>
            <div className="premium-cost-item">
              <span className="premium-cost-item-label">Overhead</span>
              <span className="premium-cost-item-value">${analysisResults.cost.breakdown.overhead.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Timeline Analysis */}
        <div className="premium-analysis-card">
          <div className="premium-analysis-header">
            <div className="premium-analysis-icon timeline">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="premium-analysis-title-section">
              <h3 className="premium-analysis-title">Timeline Estimation</h3>
              <span className={`premium-analysis-status ${getStatusColor(analysisResults.timeline.status)}`}>
                {getStatusBadge(analysisResults.timeline.status)}
              </span>
            </div>
            <div className="premium-timeline-display">
              <span className="premium-timeline-value">{analysisResults.timeline.days}</span>
              <span className="premium-timeline-label">Days</span>
            </div>
          </div>
          
          <div className="premium-timeline-breakdown">
            <div className="premium-timeline-item">
              <span className="premium-timeline-item-label">Procurement</span>
              <span className="premium-timeline-item-value">{analysisResults.timeline.details.procurement}</span>
            </div>
            <div className="premium-timeline-item">
              <span className="premium-timeline-item-label">Assembly</span>
              <span className="premium-timeline-item-value">{analysisResults.timeline.details.assembly}</span>
            </div>
            <div className="premium-timeline-item">
              <span className="premium-timeline-item-label">Testing</span>
              <span className="premium-timeline-item-value">{analysisResults.timeline.details.testing}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="premium-feasibility-actions">
        <div className="premium-feasibility-summary">
          <h3 className="premium-summary-title">Analysis Complete</h3>
          <p className="premium-summary-description">
            Your configuration shows {analysisResults.structural.status} structural feasibility and {analysisResults.manufacturing.status} manufacturing feasibility. 
            Ready to proceed with 3D design.
          </p>
        </div>

        <button
          onClick={onNext}
          className="premium-btn-primary premium-btn-large"
        >
          Proceed to 3D Design
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeasibilityDashboard;
