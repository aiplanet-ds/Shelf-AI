import React, { useState, useEffect, useRef } from 'react';
import {
  aiAgentPhases,
  getTotalAnalysisDuration,
  getPhaseProgress
} from '../data/aiAgentSystem';

const ImmersiveAIAnalysis = ({ problemStatement, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [phaseStartTime, setPhaseStartTime] = useState(0);
  const [totalStartTime, setTotalStartTime] = useState(0);
  // Simplified - no complex metrics
  // Removed validation state - no interruptions needed
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const animationRef = useRef();
  const phases = Object.values(aiAgentPhases);
  const totalDuration = getTotalAnalysisDuration();

  // Auto-start analysis when component mounts
  useEffect(() => {
    setIsAnalyzing(true);
    setCurrentPhaseIndex(0);
    setCurrentMessageIndex(0);
    setTotalStartTime(Date.now());
    setPhaseStartTime(Date.now());
    setAnalysisResults(null);
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!isAnalyzing) return;

    const animate = () => {
      const now = Date.now();
      const phaseElapsed = now - phaseStartTime;
      const currentPhase = phases[currentPhaseIndex];
      
      if (!currentPhase) {
        // Analysis complete
        setIsAnalyzing(false);
        generateFinalResults();
        return;
      }

      // Simplified - no complex metrics updates

      // Check for message progression
      const messageInterval = currentPhase.duration / currentPhase.messages.length;
      const expectedMessageIndex = Math.floor(phaseElapsed / messageInterval);
      
      if (expectedMessageIndex > currentMessageIndex && expectedMessageIndex < currentPhase.messages.length) {
        setCurrentMessageIndex(expectedMessageIndex);
      }

      // Check for phase completion
      if (phaseElapsed >= currentPhase.duration) {
        // Move to next phase without validation interruptions
        if (currentPhaseIndex < phases.length - 1) {
          setCurrentPhaseIndex(prev => prev + 1);
          setCurrentMessageIndex(0);
          setPhaseStartTime(now);
        } else {
          // All phases complete - proceed to results
          completeAnalysis();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnalyzing, currentPhaseIndex, currentMessageIndex, phaseStartTime]);

  // Simplified - no complex metric calculations

  const completeAnalysis = () => {
    setIsAnalyzing(false);

    const results = {
      status: "complete",
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - totalStartTime,

      // Executive Summary
      executiveSummary: {
        feasibilityStatus: "FEASIBLE with modifications",
        overallConfidence: 85,
        estimatedTimeline: "4-6 weeks",
        budgetRange: "$18,500 - $28,000",
        riskLevel: "Medium-Low"
      },

      // Detailed Analysis
      detailedAnalysis: {
        machineCompatibility: {
          wireFormingCapability: "✅ Fully compatible with 6mm-12mm wire diameter",
          weldingSystem: "⚠️ Requires spot welding station upgrade",
          coatingLine: "✅ Powder coating line ready for wire shelves",
          qualityControl: "✅ Current inspection systems adequate"
        },

        componentAnalysis: {
          wireFrameStructure: {
            material: "304 Stainless Steel Wire (6mm diameter)",
            compatibility: "95% - Excellent match",
            modifications: "Minor spacing adjustments needed"
          },
          shelfSurface: {
            material: "Welded Wire Mesh (50x50mm grid)",
            compatibility: "88% - Good compatibility",
            modifications: "Grid pattern optimization required"
          },
          supportBrackets: {
            material: "Stamped Steel Brackets",
            compatibility: "92% - Very good match",
            modifications: "Mounting hole repositioning needed"
          }
        },

        productionRequirements: {
          wireFormingStations: 2,
          weldingStations: 3,
          coatingCapacity: "150 shelves/day",
          qualityCheckpoints: 4,
          estimatedCycleTime: "12 minutes per shelf unit"
        },

        riskMitigation: {
          identifiedRisks: [
            "Wire diameter tolerance variations",
            "Welding joint strength consistency",
            "Coating adhesion on wire surfaces",
            "Dimensional accuracy in forming"
          ],
          mitigationStrategies: [
            "Implement wire diameter pre-sorting system",
            "Upgrade to servo-controlled welding parameters",
            "Add wire surface preparation stage",
            "Install precision forming jigs"
          ]
        }
      },

      // Technical Specifications
      technicalSpecs: {
        dimensions: {
          shelfWidth: "600mm - 1200mm (adjustable)",
          shelfDepth: "400mm - 800mm (configurable)",
          wireSpacing: "50mm standard grid",
          loadCapacity: "25kg per shelf"
        },
        materials: {
          wireGrade: "304 Stainless Steel",
          wireDiameter: "6mm primary, 4mm secondary",
          coating: "Powder coat finish (RAL colors)",
          brackets: "Cold-rolled steel, zinc plated"
        },
        tolerances: {
          dimensional: "±2mm on critical dimensions",
          wireSpacing: "±1mm grid accuracy",
          surface: "Ra 1.6μm after coating"
        }
      },

      // Implementation Plan
      implementationPlan: {
        phase1: {
          name: "Equipment Setup & Calibration",
          duration: "2 weeks",
          tasks: [
            "Install wire forming dies",
            "Calibrate welding parameters",
            "Setup coating line for wire products",
            "Configure quality inspection stations"
          ]
        },
        phase2: {
          name: "Production Trial & Optimization",
          duration: "1 week",
          tasks: [
            "Run pilot production batch (50 units)",
            "Optimize cycle times",
            "Validate quality standards",
            "Train production operators"
          ]
        },
        phase3: {
          name: "Full Production Ramp-up",
          duration: "1-2 weeks",
          tasks: [
            "Scale to target production volume",
            "Implement continuous improvement",
            "Establish supply chain for wire materials",
            "Deploy quality monitoring systems"
          ]
        }
      },

      // Key Recommendations
      keyRecommendations: [
        {
          priority: "HIGH",
          title: "Upgrade Spot Welding System",
          description: "Install servo-controlled welding stations for consistent joint quality on wire intersections",
          impact: "Critical for structural integrity",
          timeline: "Week 1-2"
        },
        {
          priority: "MEDIUM",
          title: "Wire Surface Preparation",
          description: "Add degreasing and surface treatment stage before coating to ensure optimal adhesion",
          impact: "Improves coating durability by 40%",
          timeline: "Week 2-3"
        },
        {
          priority: "LOW",
          title: "Automated Wire Cutting",
          description: "Consider automated wire cutting system for improved efficiency and consistency",
          impact: "15% cycle time reduction",
          timeline: "Future enhancement"
        }
      ],

      aiMetrics: {
        analysisComplete: true,
        confidenceLevel: 85,
        dataPointsAnalyzed: 1247,
        similarProjectsReviewed: 23,
        riskFactorsIdentified: 4
      }
    };

    setAnalysisResults(results);
    onAnalysisComplete(results);
  };

  // Removed old generateFinalResults function - using completeAnalysis instead

  // Removed validation response handler - no interruptions needed

  const currentPhase = phases[currentPhaseIndex];
  const phaseElapsed = Date.now() - phaseStartTime;
  const currentPhaseProgress = currentPhase ? getPhaseProgress(`phase${currentPhaseIndex + 1}`, phaseElapsed) : 0;

  if (analysisResults) {
    return null; // Results will be shown by parent component
  }

  return (
    <div className="immersive-ai-analysis">
      <div className="analysis-running-screen">
          <div className="analysis-header-running">
            <div className="ai-brain-animation">
              <div className="brain-pulse">🤖</div>
            </div>
            <h2 className="analysis-title-running">AI Manufacturing Analysis</h2>
            <p className="analysis-subtitle-running">
              Analyzing your manufacturing requirements...
            </p>
          </div>

          {/* Simple Progress Indicator */}
          <div className="simple-progress-container">
            <div className="progress-dots">
              {phases.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index <= currentPhaseIndex ? 'active' : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Current Phase */}
          <div className="current-phase-section">
            <div className="phase-icon-large" style={{ color: currentPhase?.color }}>
              {currentPhase?.icon}
            </div>
            <h3 className="phase-title-simple">{currentPhase?.name}</h3>
            <p className="phase-description-simple">{currentPhase?.description}</p>
          </div>

          {/* Current Message */}
          <div className="current-message-simple">
            <div className="message-icon">
              <div className="processing-spinner-simple"></div>
            </div>
            <div className="message-text">
              {currentPhase?.messages[currentMessageIndex]}
            </div>
          </div>

          {/* Simple Status */}
          <div className="simple-status">
            <p className="status-text">Please wait while we analyze your requirements...</p>
          </div>
      </div>
    </div>
  );
};

export default ImmersiveAIAnalysis;
