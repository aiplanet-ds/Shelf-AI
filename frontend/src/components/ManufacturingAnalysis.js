import React, { useState, useEffect } from 'react';
import { analysisSteps } from '../data/manufacturingDatabase';
import { generateAnalysisResults } from '../data/analysisResults';

const ManufacturingAnalysis = ({ problemStatement, onAnalysisComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);

  const steps = Object.values(analysisSteps);
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    if (isAnalyzing && currentStep < steps.length) {
      const step = steps[currentStep];
      const messageInterval = step.duration / step.messages.length;

      const timer = setTimeout(() => {
        if (currentMessageIndex < step.messages.length - 1) {
          setCurrentMessageIndex(prev => prev + 1);
        } else {
          // Move to next step
          if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setCurrentMessageIndex(0);
          } else {
            // Analysis complete
            const results = generateAnalysisResults(problemStatement);
            setAnalysisResults(results);
            onAnalysisComplete(results);
            setIsAnalyzing(false);
          }
        }
      }, messageInterval);

      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, currentStep, currentMessageIndex, steps, problemStatement, onAnalysisComplete]);

  // Progress calculation
  useEffect(() => {
    if (isAnalyzing) {
      const completedStepsDuration = steps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0);
      const currentStepProgress = (currentMessageIndex + 1) / steps[currentStep]?.messages.length || 0;
      const currentStepDuration = steps[currentStep]?.duration || 0;
      const currentStepElapsed = currentStepProgress * currentStepDuration;
      
      const totalElapsed = completedStepsDuration + currentStepElapsed;
      const progressPercent = Math.min((totalElapsed / totalDuration) * 100, 100);
      setProgress(progressPercent);
    }
  }, [currentStep, currentMessageIndex, isAnalyzing, steps, totalDuration]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setCurrentMessageIndex(0);
    setProgress(0);
    setAnalysisResults(null);
  };

  if (analysisResults) {
    return null; // Results will be shown by parent component
  }

  return (
    <div className="manufacturing-analysis-container">
      {!isAnalyzing ? (
        <div className="analysis-start-screen">
          <div className="analysis-header">
            <div className="analysis-icon">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h2 className="analysis-title">Manufacturing Feasibility Analysis</h2>
            <p className="analysis-subtitle">
              Oracle Agile PLM Integration • Autodesk Inventor Analysis • Component Database Search
            </p>
          </div>
          
          <div className="analysis-preview">
            <h3 className="preview-title">Analysis Pipeline</h3>
            <div className="analysis-steps-preview">
              {steps.map((step, index) => (
                <div key={index} className="step-preview">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-info">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-duration">{step.duration / 1000}s</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={startAnalysis}
            className="start-analysis-btn"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Begin Manufacturing Analysis
          </button>
        </div>
      ) : (
        <div className="analysis-running-screen">
          <div className="analysis-header-running">
            <h2 className="analysis-title-running">Manufacturing Analysis in Progress</h2>
            <p className="analysis-subtitle-running">
              Connecting to enterprise systems and analyzing compatibility...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.round(progress)}% Complete • Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Current Step Display */}
          <div className="current-step-display">
            <div className="step-header">
              <div className="step-icon">
                {currentStep === 0 && '🔍'}
                {currentStep === 1 && '🔄'}
                {currentStep === 2 && '📐'}
                {currentStep === 3 && '📥'}
                {currentStep === 4 && '⚡'}
              </div>
              <h3 className="step-title">{steps[currentStep]?.title}</h3>
            </div>
            
            <div className="step-messages">
              {steps[currentStep]?.messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`step-message ${index <= currentMessageIndex ? 'active' : 'pending'}`}
                >
                  {index < currentMessageIndex && (
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {index === currentMessageIndex && (
                    <div className="loading-dots mr-2">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                  {index > currentMessageIndex && (
                    <div className="w-4 h-4 mr-2 border border-gray-600 rounded-full"></div>
                  )}
                  <span className={index <= currentMessageIndex ? 'text-gray-200' : 'text-gray-500'}>
                    {message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Integration Display */}
          <div className="systems-display">
            <h4 className="systems-title">Connected Systems</h4>
            <div className="systems-grid">
              <div className={`system-item ${currentStep >= 0 ? 'active' : ''}`}>
                <div className="system-icon">🗄️</div>
                <span>Oracle Agile PLM</span>
              </div>
              <div className={`system-item ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="system-icon">🔧</div>
                <span>Autodesk Inventor</span>
              </div>
              <div className={`system-item ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="system-icon">📊</div>
                <span>Component Database</span>
              </div>
              <div className={`system-item ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="system-icon">📋</div>
                <span>PSI Penta</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturingAnalysis;
