import React, { useState, useEffect } from 'react';

const ProblemStatementForm = ({ 
  problemStatement, 
  onProblemStatementChange, 
  onNext,
  className = "" 
}) => {
  const [statement, setStatement] = useState(problemStatement || '');
  const [charCount, setCharCount] = useState(0);
  const [manufacturingScenarios] = useState([
    {
      title: "Wire Shelf Manufacturing Setup",
      description: "Need to establish production line for custom wire shelving units with 600-1200mm width range, 6mm stainless steel wire construction, powder coating finish, and 25kg load capacity per shelf. Requires wire forming, spot welding, and coating capabilities.",
      icon: "🗂️",
      category: "Wire Shelf Production",
      complexity: "Medium",
      estimatedAnalysisTime: "75-85 seconds"
    },
    {
      title: "Container Format Adaptation",
      description: "Need to adapt existing production line for new container format with 25% larger capacity while maintaining current throughput specifications and quality standards",
      icon: "📦",
      category: "Production Line Adaptation",
      complexity: "Medium",
      estimatedAnalysisTime: "75-85 seconds"
    },
    {
      title: "Enhanced Format Implementation",
      description: "Customer requires format change from standard dimensions to enhanced specifications with improved structural integrity and modified processing parameters",
      icon: "🔧",
      category: "Format Enhancement",
      complexity: "High",
      estimatedAnalysisTime: "80-90 seconds"
    },
    {
      title: "Transport System Modification",
      description: "Implement new product format on existing processing line requiring transport system modifications, conveyor adjustments, and compatibility validation",
      icon: "🚛",
      category: "Transport Systems",
      complexity: "Medium",
      estimatedAnalysisTime: "70-80 seconds"
    },
    {
      title: "Alternative Format Conversion",
      description: "Convert manufacturing line from current container specifications to alternative format while preserving core operational functionality and minimizing downtime",
      icon: "🔄",
      category: "Format Conversion",
      complexity: "Medium-High",
      estimatedAnalysisTime: "75-85 seconds"
    },
    {
      title: "Dimensional Requirement Evaluation",
      description: "Evaluate production line adaptation for new container design with modified dimensional requirements, tolerance specifications, and processing parameters",
      icon: "📏",
      category: "Dimensional Analysis",
      complexity: "High",
      estimatedAnalysisTime: "80-90 seconds"
    }
  ]);

  const maxChars = 2000;
  const minChars = 50;

  useEffect(() => {
    setCharCount(statement.length);
    onProblemStatementChange(statement);
  }, [statement, onProblemStatementChange]);

  const handleSuggestionClick = (scenario) => {
    setStatement(scenario.description);
  };

  const isValid = statement.length >= minChars && statement.length <= maxChars;

  const getCharCountColor = () => {
    if (charCount < minChars) return 'text-yellow-400';
    if (charCount > maxChars * 0.9) return 'text-red-400';
    return 'text-green-400';
  };

  return (
    <div className={`premium-problem-statement ${className}`}>
      <div className="premium-problem-header">
        <div className="premium-problem-icon">
          <div className="ai-assistant-icon">
            <div className="ai-brain">
              <div className="brain-core"></div>
              <div className="neural-connections">
                <div className="connection"></div>
                <div className="connection"></div>
                <div className="connection"></div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="premium-problem-title">Manufacturing Engineering AI Assistant</h2>
        <p className="premium-problem-subtitle">
          Describe your manufacturing requirements for comprehensive AI analysis.
          Our advanced 5-phase AI agent system will analyze feasibility, search precedents,
          and provide detailed engineering recommendations.
        </p>

      </div>

      <div className="premium-problem-content">
        {/* Main Text Area */}
        <div className="premium-problem-input-section">
          <label className="premium-problem-label">
            Problem Statement
            <span className="premium-required">*</span>
          </label>
          <div className="premium-problem-input-wrapper">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Example: Need to manufacture custom wire shelving units with 600-1200mm adjustable width, 6mm stainless steel wire, powder coating finish, 25kg load capacity. Requires wire forming, spot welding stations, and coating line integration. Current equipment includes basic metalworking tools but needs welding system upgrade..."
              className="premium-problem-textarea"
              rows={8}
              maxLength={maxChars}
            />
            <div className="premium-problem-input-footer">
              <div className="premium-problem-guidelines">
                <span className="premium-guideline-item">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Include format specifications
                </span>
                <span className="premium-guideline-item">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Specify production requirements
                </span>
                <span className="premium-guideline-item">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mention operational constraints
                </span>
              </div>
              <div className={`premium-char-counter ${getCharCountColor()}`}>
                {charCount}/{maxChars}
                {charCount < minChars && (
                  <span className="premium-char-warning">
                    (minimum {minChars} characters)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Example Suggestions */}
        <div className="premium-problem-suggestions">
          <h3 className="premium-suggestions-title">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Manufacturing Scenarios
          </h3>
          <div className="premium-suggestions-grid">
            {manufacturingScenarios.map((scenario, index) => (
              <div
                key={index}
                className="premium-manufacturing-scenario-card"
                onClick={() => handleSuggestionClick(scenario)}
              >
                <div className="premium-scenario-header">
                  <div className="premium-scenario-icon">{scenario.icon}</div>
                  <div className="premium-scenario-info">
                    <h4 className="premium-scenario-title">{scenario.title}</h4>
                    <span className="premium-scenario-category">{scenario.category}</span>
                    {scenario.machineCode !== "Custom" && (
                      <span className="premium-machine-code">Machine: {scenario.machineCode}</span>
                    )}
                  </div>
                </div>
                <p className="premium-scenario-description">{scenario.description}</p>
                <div className="premium-scenario-action">
                  <span>Use this scenario</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="premium-problem-actions">
          <div className="premium-validation-status">
            {!isValid && charCount > 0 && (
              <div className="premium-validation-message">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {charCount < minChars 
                  ? `Please provide at least ${minChars} characters for a detailed analysis`
                  : 'Description is too long. Please keep it under 2000 characters'
                }
              </div>
            )}
            {isValid && (
              <div className="premium-validation-success">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ready for component analysis
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!isValid}
            className={`premium-btn-primary premium-btn-large ${!isValid ? 'disabled' : ''}`}
          >
            Analyze Requirements
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatementForm;
