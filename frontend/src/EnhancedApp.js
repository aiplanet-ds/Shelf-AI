import React, { useState, useRef, useEffect } from 'react';
import ProgressWizard from './components/ProgressWizard';
import ProblemStatementForm from './components/ProblemStatementForm';
import ComponentDatabase from './components/ComponentDatabase';
import FeasibilityDashboard from './components/FeasibilityDashboard';
import ImmersiveAIAnalysis from './components/ImmersiveAIAnalysis';
import RealTimeAIStatus from './components/RealTimeAIStatus';
import HumanValidationInterface from './components/HumanValidationInterface';
import ExtendedAnalysisResults from './components/ExtendedAnalysisResults';

import ManufacturingExports from './components/ManufacturingExports';
import './App.css';

// Import existing components from the original App.js
// We'll need to extract these from the original file
const WireShelf3D = React.lazy(() => import('./components/WireShelf3D'));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const ParameterControls = React.lazy(() => import('./components/ParameterControls'));
const BillOfMaterials = React.lazy(() => import('./components/BillOfMaterials'));

const EnhancedApp = () => {
  // Wizard state with persistence
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_currentStep');
    return saved ? parseInt(saved) : 0;
  });

  // Multi-step workflow data with persistence
  const [problemStatement, setProblemStatement] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_problemStatement');
    return saved || '';
  });

  const [selectedComponents, setSelectedComponents] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_selectedComponents');
    return saved ? JSON.parse(saved) : [];
  });

  const [feasibilityResults, setFeasibilityResults] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_feasibilityResults');
    return saved ? JSON.parse(saved) : null;
  });

  // Enhanced AI Analysis workflow state
  const [aiAnalysisResults, setAiAnalysisResults] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_aiAnalysisResults');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [validationPending, setValidationPending] = useState(null);


  // Existing 3D configurator state with persistence
  const [shelfParams, setShelfParams] = useState(() => {
    const saved = localStorage.getItem('shelfConfigurator_shelfParams');
    return saved ? JSON.parse(saved) : {
      width: 0,
      length: 0,
      postHeight: 0,
      numberOfShelves: 0,
      color: 'Chrome',
      shelfStyle: 'Industrial Grid',
      solidBottomShelf: false,
      postType: 'Stationary',
      shelfDividersCount: 0,
      shelfDividersShelves: [],
      enclosureType: 'none'
    };
  });

  // Normalize incoming params from any source (e.g., objects like {value, unit})
  const normalizeParams = (params) => {
    const getVal = (v) => {
      if (v == null) return v;
      if (typeof v === 'object') {
        if ('value' in v) v = v.value;
      }
      if (typeof v === 'string') {
        const m = v.match(/-?\d+(?:\.\d+)?/);
        if (m) return Number(m[0]);
        return v;
      }
      return v;
    };

    const toInt = (v) => {
      const n = getVal(v);
      if (n === '' || n == null) return 0;
      const num = Number(n);
      return Number.isFinite(num) ? Math.trunc(num) : 0;
    };

    const toBool = (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) v = v.value;
      if (typeof v === 'string') return v.toLowerCase() === 'true';
      return Boolean(v);
    };

    const toStr = (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) return String(v.value);
      return v != null ? String(v) : '';
    };

    const out = { ...params };
    out.width = toInt(params.width);
    out.length = toInt(params.length);
    out.postHeight = toInt(params.postHeight);
    out.numberOfShelves = toInt(params.numberOfShelves);
    out.shelfDividersCount = toInt(params.shelfDividersCount);
    out.solidBottomShelf = toBool(params.solidBottomShelf);
    out.color = params.color != null ? toStr(params.color) : params.color;
    out.shelfStyle = params.shelfStyle != null ? toStr(params.shelfStyle) : params.shelfStyle;
    out.postType = params.postType != null ? toStr(params.postType) : params.postType;
    out.enclosureType = params.enclosureType != null ? toStr(params.enclosureType) : params.enclosureType;

    if (Array.isArray(params.shelfDividersShelves)) {
      out.shelfDividersShelves = params.shelfDividersShelves
        .map(getVal)
        .map(Number)
        .filter((n) => Number.isFinite(n) && n > 0);
    }

    return out;
  };

  const [sessionId, setSessionId] = useState(() => {

    const saved = localStorage.getItem('shelfConfigurator_sessionId');
    return saved || 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  });

  const shelf3DRef = useRef(null);

  // Auto-save progress to localStorage
  useEffect(() => {
    localStorage.setItem('shelfConfigurator_currentStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('shelfConfigurator_problemStatement', problemStatement);
  }, [problemStatement]);

  useEffect(() => {
    localStorage.setItem('shelfConfigurator_selectedComponents', JSON.stringify(selectedComponents));
  }, [selectedComponents]);

  useEffect(() => {
    if (feasibilityResults) {
      localStorage.setItem('shelfConfigurator_feasibilityResults', JSON.stringify(feasibilityResults));
    }
  }, [feasibilityResults]);

  useEffect(() => {
    if (aiAnalysisResults) {
      localStorage.setItem('shelfConfigurator_aiAnalysisResults', JSON.stringify(aiAnalysisResults));
    }
  }, [aiAnalysisResults]);

  useEffect(() => {
    // Always persist a sanitized version
    const cleaned = normalizeParams(shelfParams);
    localStorage.setItem('shelfConfigurator_shelfParams', JSON.stringify(cleaned));
  }, [shelfParams]);

  useEffect(() => {
    localStorage.setItem('shelfConfigurator_sessionId', sessionId);
  }, [sessionId]);

  // Define wizard steps
  const wizardSteps = [
    {
      title: "Problem Statement",
      subtitle: "Describe manufacturing requirements"
    },
    {
      title: "Component Analysis",
      subtitle: "Select compatible components"
    },
    {
      title: "Manufacturing Analysis",
      subtitle: "Oracle Agile PLM Integration"
    },
    {
      title: "3D Design",
      subtitle: "Configure and visualize"
    },
    {
      title: "Bill of Materials",
      subtitle: "Parts and quantities"
    }
  ];

  // Enhanced navigation with validation
  const handleStepChange = (stepIndex) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleProblemStatementChange = (statement) => {
    setProblemStatement(statement);
  };

  const handleComponentsChange = (components) => {
    setSelectedComponents(components);
  };

  const updateShelfParams = (newParams) => {
    // Merge and normalize to prevent invalid React children (e.g., {value, unit})
    setShelfParams(prev => ({
      ...prev,
      ...normalizeParams(newParams || {})
    }));
  };

  // Enhanced AI Analysis workflow handlers
  const handleAIAnalysisComplete = (results) => {
    setAiAnalysisResults(results);
    setShowAIAnalysis(false);
  };

  // On first load, if nothing is configured, set sensible defaults for instant 3D
  useEffect(() => {
    const sp = normalizeParams(shelfParams);
    if (!sp.width && !sp.length && !sp.postHeight && !sp.numberOfShelves) {
      setShelfParams(prev => ({
        ...prev,
        width: 36,
        length: 24,
        postHeight: 72,
        numberOfShelves: 4,
      }));
    }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValidationRequired = (validationPoint) => {
    setValidationPending(validationPoint);
  };

  const handleValidationResponse = (response) => {
    setValidationPending(null);
    setShowAIAnalysis(true); // Resume analysis
  };

  const handleValidationCancel = () => {
    setValidationPending(null);
    setShowAIAnalysis(false);
  };

  const handleProceedTo3D = () => {
    setCurrentStep(3); // Move to 3D Design step
  };





  const handleExportResults = () => {
    // Export functionality can be implemented here
    console.log('Exporting analysis results...', aiAnalysisResults);
  };

  // Auto-generate parameters from problem statement and components
  const autoGenerateParameters = () => {
    if (!problemStatement || selectedComponents.length === 0) return;

    const statement = problemStatement.toLowerCase();
    const components = componentLibrary.filter(comp => selectedComponents.includes(comp.id));

    // Extract dimensions from problem statement
    const dimensionRegex = /(\d+)\s*(?:inch|inches|"|')\s*(?:x|by|\*)\s*(\d+)\s*(?:inch|inches|"|')/i;
    const heightRegex = /(\d+)\s*(?:inch|inches|"|')\s*(?:high|height|tall)/i;
    const shelfCountRegex = /(\d+)\s*(?:shelf|shelves|level|levels|tier|tiers)/i;

    let autoParams = { ...shelfParams };

    // Auto-detect dimensions
    const dimensionMatch = statement.match(dimensionRegex);
    if (dimensionMatch) {
      autoParams.width = parseInt(dimensionMatch[1]);
      autoParams.length = parseInt(dimensionMatch[2]);
    } else {
      // Fallback to common sizes based on application
      if (statement.includes('warehouse') || statement.includes('industrial')) {
        autoParams.width = 48;
        autoParams.length = 24;
      } else if (statement.includes('retail') || statement.includes('display')) {
        autoParams.width = 36;
        autoParams.length = 18;
      } else if (statement.includes('kitchen') || statement.includes('restaurant')) {
        autoParams.width = 42;
        autoParams.length = 21;
      } else {
        autoParams.width = 36;
        autoParams.length = 18;
      }
    }

    // Auto-detect height
    const heightMatch = statement.match(heightRegex);
    if (heightMatch) {
      autoParams.postHeight = parseInt(heightMatch[1]);
    } else {
      // Default heights based on application
      if (statement.includes('warehouse') || statement.includes('industrial')) {
        autoParams.postHeight = 72;
      } else if (statement.includes('kitchen') || statement.includes('restaurant')) {
        autoParams.postHeight = 63;
      } else {
        autoParams.postHeight = 54;
      }
    }

    // Auto-detect shelf count
    const shelfMatch = statement.match(shelfCountRegex);
    if (shelfMatch) {
      autoParams.numberOfShelves = parseInt(shelfMatch[1]);
    } else {
      // Default based on height and application
      if (autoParams.postHeight >= 72) {
        autoParams.numberOfShelves = 4;
      } else if (autoParams.postHeight >= 54) {
        autoParams.numberOfShelves = 3;
      } else {
        autoParams.numberOfShelves = 2;
      }
    }

    // Auto-detect material/finish from components
    const hasStainless = components.some(comp => comp.material.includes('Stainless'));
    const hasAntiStatic = components.some(comp => comp.material.includes('Conductive'));
    const hasFoodGrade = components.some(comp => comp.applications.includes('food-service'));

    if (hasStainless || hasFoodGrade) {
      autoParams.color = 'Stainless Steel';
    } else if (hasAntiStatic) {
      autoParams.color = 'Chrome'; // Anti-static usually chrome-based
    } else if (statement.includes('black') || statement.includes('dark')) {
      autoParams.color = 'Black';
    } else if (statement.includes('white') || statement.includes('clean')) {
      autoParams.color = 'White';
    } else {
      autoParams.color = 'Chrome';
    }

    // Auto-detect shelf style from components and requirements
    const hasHeavyDuty = components.some(comp =>
      parseInt(comp.loadCapacity) > 400 || comp.name.includes('Heavy')
    );
    const hasIndustrial = statement.includes('industrial') || statement.includes('warehouse');
    const hasCommercial = statement.includes('commercial') || statement.includes('professional');

    if (hasHeavyDuty || statement.includes('heavy')) {
      autoParams.shelfStyle = 'Heavy Duty';
    } else if (hasCommercial) {
      autoParams.shelfStyle = 'Commercial Pro';
    } else if (hasIndustrial) {
      autoParams.shelfStyle = 'Industrial Grid';
    } else {
      autoParams.shelfStyle = 'Metro Classic';
    }

    // Auto-detect mobility
    const hasMobile = components.some(comp => comp.category === 'Mobility');
    if (hasMobile || statement.includes('mobile') || statement.includes('wheel') || statement.includes('caster')) {
      autoParams.postType = 'Mobile';
    }

    // Auto-detect solid bottom shelf
    if (statement.includes('small parts') || statement.includes('small items') ||
        statement.includes('solid bottom') || statement.includes('solid shelf')) {
      autoParams.solidBottomShelf = true;
    }

    // Auto-detect dividers
    if (statement.includes('divider') || statement.includes('section') || statement.includes('organize')) {
      autoParams.shelfDividersCount = 2;
      autoParams.shelfDividersShelves = [1, 2];
    }

    // Auto-detect enclosure
    if (statement.includes('enclos') || statement.includes('protect') || statement.includes('dust')) {
      if (statement.includes('full') || statement.includes('complete')) {
        autoParams.enclosureType = 'full';
      } else if (statement.includes('back') || statement.includes('wall')) {
        autoParams.enclosureType = 'back';
      } else {
        autoParams.enclosureType = 'sides';
      }
    }

    setShelfParams(autoParams);

    // Show notification
    const notification = document.createElement('div');
    notification.className = 'premium-auto-notification';
    notification.innerHTML = `
      <div class="premium-notification-content">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Parameters auto-generated from your requirements!</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  // Clear all progress and start fresh
  const clearProgress = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear all progress and start a new configuration? This action cannot be undone.'
    );

    if (confirmClear) {
      // Clear localStorage
      localStorage.removeItem('shelfConfigurator_currentStep');
      localStorage.removeItem('shelfConfigurator_problemStatement');
      localStorage.removeItem('shelfConfigurator_selectedComponents');
      localStorage.removeItem('shelfConfigurator_feasibilityResults');
      localStorage.removeItem('shelfConfigurator_aiAnalysisResults');
      localStorage.removeItem('shelfConfigurator_shelfParams');
      localStorage.removeItem('shelfConfigurator_sessionId');

      // Reset state
      setCurrentStep(0);
      setProblemStatement('');
      setSelectedComponents([]);
      setFeasibilityResults(null);
      setAiAnalysisResults(null);
      setShowAIAnalysis(false);
      setValidationPending(null);

      setShelfParams({
        width: 0,
        length: 0,
        postHeight: 0,
        numberOfShelves: 0,
        color: 'Chrome',
        shelfStyle: 'Industrial Grid',
        solidBottomShelf: false,
        postType: 'Stationary',
        shelfDividersCount: 0,
        shelfDividersShelves: [],
        enclosureType: 'none'
      });

      // Generate new session ID to reset chat
      const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      setSessionId(newSessionId);
    }
  };



  const sanitizedParams = normalizeParams(shelfParams);
  const hasMinimumParams = sanitizedParams.width && sanitizedParams.length && sanitizedParams.postHeight && sanitizedParams.numberOfShelves;

  const canNavigateToStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: return true; // Problem Statement - always accessible
      case 1: return problemStatement.length >= 50; // Component Analysis - requires problem statement
      case 2: return selectedComponents.length > 0; // AI Manufacturing Analysis - requires selected components
      case 3: return aiAnalysisResults !== null; // 3D Design - requires AI analysis
      case 4: return aiAnalysisResults !== null; // System Integration - requires AI analysis
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProblemStatementForm
            problemStatement={problemStatement}
            onProblemStatementChange={handleProblemStatementChange}
            onNext={() => setCurrentStep(1)}
          />
        );

      case 1:
        return (
          <ComponentDatabase
            problemStatement={problemStatement}
            selectedComponents={selectedComponents}
            onComponentsChange={handleComponentsChange}
            onNext={() => setCurrentStep(2)}
          />
        );

      case 2:
        return (
          <div className="ai-analysis-step">
            {validationPending ? (
              <HumanValidationInterface
                validationPoint={validationPending}
                onValidationResponse={handleValidationResponse}
                onCancel={handleValidationCancel}
              />
            ) : !aiAnalysisResults ? (
              <ImmersiveAIAnalysis
                problemStatement={problemStatement}
                onAnalysisComplete={handleAIAnalysisComplete}
                onValidationRequired={handleValidationRequired}
              />
            ) : (
              <div>
                <ExtendedAnalysisResults
                  analysisResults={aiAnalysisResults}
                  problemStatement={problemStatement}
                  onExportResults={handleExportResults}
                  onProceedTo3D={handleProceedTo3D}
                />
                <ManufacturingExports
                  analysisResults={aiAnalysisResults}
                  problemStatement={problemStatement}
                  selectedComponents={selectedComponents}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="premium-3d-design-step">
            <div className="premium-step-header">
              <h2 className="premium-step-title">3D Design Configuration</h2>
              <p className="premium-step-subtitle">
                Configure your wire shelving unit dimensions and visualize in real-time 3D
              </p>

              {/* Auto-generation section */}
              {!hasMinimumParams && (problemStatement || selectedComponents.length > 0) && (
                <div className="premium-auto-generation-section">
                  <div className="premium-auto-card">
                    <div className="premium-auto-header">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h3 className="premium-auto-title">Smart Configuration</h3>
                    </div>
                    <p className="premium-auto-description">
                      Let AI automatically configure your shelf parameters based on your problem statement and selected components.
                    </p>
                    <button
                      onClick={autoGenerateParameters}
                      className="premium-btn-primary premium-auto-btn"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Auto-Generate Configuration
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="premium-design-grid">
              {/* AI Chat Interface */}
              <div className="premium-design-chat">
                <React.Suspense fallback={<div className="premium-loading">Loading chat...</div>}>
                  <ChatInterface
                    onParametersExtracted={updateShelfParams}
                    extractedParams={shelfParams}
                    sessionId={sessionId}
                    problemStatement={problemStatement}
                    autoTrigger={true}
                  />
                </React.Suspense>
              </div>

              {/* 3D Visualization */}
              <div className="premium-design-3d">
                {hasMinimumParams ? (
                  <div className="premium-card">
                    <div className="premium-card-header">
                      <h3 className="premium-card-title">3D Preview</h3>
                      <div className="premium-card-actions">
                        <button
                          onClick={() => shelf3DRef.current?.downloadSTL()}
                          className="premium-btn-secondary"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Download STL
                        </button>
                      </div>
                    </div>
                    <div className="premium-card-content">
                      <React.Suspense fallback={
                        <div className="premium-3d-loading">
                          <div className="premium-loading-spinner"></div>
                          <p className="premium-loading-text">Loading 3D Engine...</p>
                        </div>
                      }>
                        <WireShelf3D
                          ref={shelf3DRef}
                          width={sanitizedParams.width}
                          length={sanitizedParams.length}
                          postHeight={sanitizedParams.postHeight}
                          numberOfShelves={sanitizedParams.numberOfShelves}
                          color={sanitizedParams.color}
                          shelfStyle={sanitizedParams.shelfStyle}
                          solidBottomShelf={sanitizedParams.solidBottomShelf}
                          postType={sanitizedParams.postType}
                          shelfDividersCount={sanitizedParams.shelfDividersCount}
                          enclosureType={sanitizedParams.enclosureType}
                        />
                      </React.Suspense>
                      <div className="premium-3d-footer">
                        <p>Interactive 3D Model • Photorealistic Rendering • Real-time Updates</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="premium-card premium-empty-3d">
                    <div className="premium-empty-state">
                      <div className="premium-empty-icon">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="premium-empty-title">Configure Your Shelf</h3>
                      <p className="premium-empty-description">
                        Use the AI chat or parameter controls to set dimensions and see your 3D model
                      </p>
                      <div className="premium-requirements-checklist">
                        <div className={`premium-requirement ${shelfParams.width ? 'completed' : ''}`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Width and length dimensions
                        </div>
                        <div className={`premium-requirement ${shelfParams.postHeight ? 'completed' : ''}`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Post height specification
                        </div>
                        <div className={`premium-requirement ${shelfParams.numberOfShelves ? 'completed' : ''}`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Number of shelf levels
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Parameter Controls */}
              <div className="premium-design-controls">
                <React.Suspense fallback={<div className="premium-loading">Loading controls...</div>}>
                  <ParameterControls
                    params={sanitizedParams}
                    onParamsChange={updateShelfParams}
                  />
                </React.Suspense>
              </div>
            </div>

            {/* Navigation to BOM */}
            {hasMinimumParams && (
              <div className="premium-step-actions">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="premium-btn-primary premium-btn-large"
                >
                  Generate Bill of Materials
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="premium-card">
            <div className="premium-card-header">
              <h3 className="premium-card-title">Bill of Materials</h3>
            </div>
            <div className="premium-card-content">
              <React.Suspense fallback={<div className="premium-loading">Loading BOM...</div>}>
                <BillOfMaterials params={sanitizedParams} />
              </React.Suspense>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="premium-app">
      {/* Enhanced Header */}
      <header className="premium-app-header">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="premium-brand">
              <h1 className="premium-title">Manufacturing Wire Shelves Configurator</h1>
              <p className="premium-subtitle">
                AI-powered design with comprehensive feasibility analysis for manufacturing applications
              </p>
            </div>
            <div className="premium-header-controls">
              <div className="premium-status-indicators">
                <div className="premium-indicator-ai">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  AI Powered
                </div>
                {selectedComponents.length > 0 && (
                  <div className="premium-indicator-components">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                    {selectedComponents.length} Components
                  </div>
                )}
                {hasMinimumParams && (
                  <div className="premium-indicator-ready">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    3D Ready
                  </div>
                )}
              </div>

              <div className="premium-header-actions">


                {(currentStep > 0 || problemStatement || selectedComponents.length > 0) && (
                  <button
                    onClick={clearProgress}
                    className="premium-btn-secondary"
                    title="Clear all progress and start fresh"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Start Over
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Wizard */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <ProgressWizard
          steps={wizardSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          canNavigateToStep={canNavigateToStep}
          className="premium-main-wizard"
        >
          {renderStepContent()}
        </ProgressWizard>
      </div>
    </div>
  );
};

export default EnhancedApp;
