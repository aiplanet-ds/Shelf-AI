import React, { useState, useEffect } from 'react';

const ProgressWizard = ({ 
  steps, 
  currentStep, 
  onStepChange, 
  children, 
  canNavigateToStep,
  className = "" 
}) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    // Mark previous steps as completed when moving forward
    if (currentStep > 0) {
      setCompletedSteps(prev => {
        const newCompleted = new Set(prev);
        for (let i = 0; i < currentStep; i++) {
          newCompleted.add(i);
        }
        return newCompleted;
      });
    }
  }, [currentStep]);

  const handleStepClick = (stepIndex) => {
    if (canNavigateToStep && canNavigateToStep(stepIndex)) {
      onStepChange(stepIndex);
    } else if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      onStepChange(stepIndex);
    }
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex === currentStep) return 'current';
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex < currentStep) return 'completed';
    return 'upcoming';
  };

  const getStepIcon = (stepIndex, status) => {
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return <span className="text-sm font-semibold">{stepIndex + 1}</span>;
  };

  return (
    <div className={`premium-wizard ${className}`}>
      {/* Progress Header */}
      <div className="premium-wizard-header">
        <div className="premium-wizard-progress">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = canNavigateToStep ? 
                canNavigateToStep(index) : 
                (index <= currentStep || completedSteps.has(index));

              return (
                <div key={index} className="flex items-center">
                  {/* Step Circle */}
                  <div 
                    className={`premium-wizard-step ${status} ${isClickable ? 'clickable' : ''}`}
                    onClick={() => isClickable && handleStepClick(index)}
                  >
                    <div className="premium-wizard-step-circle">
                      {getStepIcon(index, status)}
                    </div>
                    <div className="premium-wizard-step-label">
                      <div className="premium-wizard-step-title">{step.title}</div>
                      <div className="premium-wizard-step-subtitle">{step.subtitle}</div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`premium-wizard-connector ${
                      index < currentStep ? 'completed' : 'upcoming'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="premium-wizard-content">
        {children}
      </div>

      {/* Navigation Footer */}
      <div className="premium-wizard-footer">
        <div className="flex items-center justify-between">
          <button
            onClick={() => currentStep > 0 && onStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className="premium-btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="premium-wizard-step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={() => currentStep < steps.length - 1 && onStepChange(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
            className="premium-btn-primary"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressWizard;
