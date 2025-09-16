import React, { useState, useEffect } from 'react';

const HumanValidationInterface = ({ validationPoint, onValidationResponse, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [confidence, setConfidence] = useState(validationPoint.confidence);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Animate confidence meter on mount
    const timer = setTimeout(() => {
      setConfidence(validationPoint.confidence);
    }, 500);
    return () => clearTimeout(timer);
  }, [validationPoint.confidence]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option.action === 'expand') {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedOption) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onValidationResponse({
      ...selectedOption,
      validationPoint: validationPoint.phase,
      timestamp: new Date().toISOString()
    });
  };

  const getValidationIcon = () => {
    switch (validationPoint.trigger) {
      case 'riskFactorsDetected':
        return '⚠️';
      case 'designSelectionRequired':
        return '🎯';
      case 'compatibilityIssues':
        return '🔧';
      default:
        return '❓';
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return '#10b981';
    if (conf >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="human-validation-interface">
      <div className="validation-overlay">
        <div className="validation-modal">
          {/* Header */}
          <div className="validation-modal-header">
            <div className="validation-alert-icon">
              {getValidationIcon()}
            </div>
            <div className="validation-header-content">
              <h2 className="validation-modal-title">{validationPoint.title}</h2>
              <p className="validation-modal-subtitle">
                AI Analysis Requires Human Validation
              </p>
            </div>
            <button 
              onClick={onCancel}
              className="validation-close-btn"
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div className="validation-description-section">
            <p className="validation-description">{validationPoint.description}</p>
          </div>

          {/* AI Recommendation */}
          <div className="ai-recommendation-section">
            <div className="recommendation-header">
              <div className="ai-badge">
                <span className="ai-icon">🤖</span>
                <span className="ai-label">AI Recommendation</span>
              </div>
              <div className="confidence-indicator">
                <span className="confidence-label">Confidence:</span>
                <div className="confidence-meter-small">
                  <div 
                    className="confidence-fill-small"
                    style={{ 
                      width: `${confidence}%`,
                      backgroundColor: getConfidenceColor(confidence)
                    }}
                  ></div>
                </div>
                <span 
                  className="confidence-percentage"
                  style={{ color: getConfidenceColor(confidence) }}
                >
                  {confidence}%
                </span>
              </div>
            </div>
            
            <div className="recommendation-content">
              <p className="recommendation-text">{validationPoint.aiRecommendation}</p>
              
              {validationPoint.validationRequired && (
                <div className="validation-requirement">
                  <div className="requirement-icon">📋</div>
                  <span className="requirement-text">{validationPoint.validationRequired}</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk Factors (if applicable) */}
          {validationPoint.riskFactors && (
            <div className="risk-factors-section">
              <h4 className="risk-factors-title">
                <span className="risk-icon">🚨</span>
                Identified Risk Factors
              </h4>
              <div className="risk-factors-list">
                {validationPoint.riskFactors.map((risk, index) => (
                  <div key={index} className="risk-factor-item">
                    <div 
                      className="risk-severity-indicator"
                      style={{ backgroundColor: getRiskSeverityColor('medium') }}
                    ></div>
                    <div className="risk-content">
                      <span className="risk-text">{risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Candidates (if applicable) */}
          {validationPoint.designCandidates && showDetails && (
            <div className="design-candidates-section">
              <h4 className="candidates-title">
                <span className="candidates-icon">🏆</span>
                Alternative Design Candidates
              </h4>
              <div className="candidates-grid">
                {validationPoint.designCandidates.map((candidate, index) => (
                  <div key={index} className="candidate-card">
                    <div className="candidate-header">
                      <span className="candidate-id">{candidate.id}</span>
                      <span 
                        className="candidate-compatibility"
                        style={{ color: getConfidenceColor(candidate.compatibility) }}
                      >
                        {candidate.compatibility}% Compatible
                      </span>
                    </div>
                    <div className="candidate-details">
                      <div className="candidate-detail">
                        <span className="detail-label">Modifications:</span>
                        <span className="detail-value">{candidate.modifications}</span>
                      </div>
                      <div className="candidate-detail">
                        <span className="detail-label">Timeline:</span>
                        <span className="detail-value">{candidate.timeline}</span>
                      </div>
                      <div className="candidate-detail">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value">{candidate.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Options */}
          <div className="validation-options-section">
            <h4 className="options-title">Choose Your Response</h4>
            <div className="validation-options-grid">
              {validationPoint.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`validation-option-card ${selectedOption?.id === option.id ? 'selected' : ''} ${option.action}`}
                  disabled={isProcessing}
                >
                  <div className="option-header">
                    <div className="option-icon">
                      {option.action === 'accept' && '✅'}
                      {option.action === 'details' && '🔍'}
                      {option.action === 'expand' && '📊'}
                      {option.action === 'override' && '⚠️'}
                      {option.action === 'continue' && '▶️'}
                      {option.action === 'custom' && '⚙️'}
                    </div>
                    <span className="option-label">{option.label}</span>
                  </div>
                  {selectedOption?.id === option.id && (
                    <div className="option-selected-indicator">
                      <div className="selected-checkmark">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="validation-actions">
            <button 
              onClick={onCancel}
              className="validation-btn secondary"
              disabled={isProcessing}
            >
              Cancel Analysis
            </button>
            
            <button 
              onClick={handleConfirm}
              className="validation-btn primary"
              disabled={!selectedOption || isProcessing}
            >
              {isProcessing ? (
                <div className="btn-processing">
                  <div className="processing-spinner-small"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="btn-content">
                  <span>Confirm & Continue</span>
                  <div className="btn-arrow">→</div>
                </div>
              )}
            </button>
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="processing-overlay">
              <div className="processing-content">
                <div className="processing-spinner-large"></div>
                <h3 className="processing-title">Processing Your Decision</h3>
                <p className="processing-description">
                  Updating AI analysis parameters based on your validation...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanValidationInterface;
