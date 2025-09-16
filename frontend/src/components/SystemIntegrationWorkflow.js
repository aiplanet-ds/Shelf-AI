import React, { useState } from 'react';
import { systemWorkflow } from '../data/manufacturingDatabase';

const SystemIntegrationWorkflow = ({ analysisResults, onWorkflowComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentReportType, setCurrentReportType] = useState(null);

  const executeWorkflow = async () => {
    setIsExecuting(true);
    
    for (let i = 0; i < systemWorkflow.length; i++) {
      setCurrentStep(i);
      
      // Simulate processing time for each step
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      setCompletedSteps(prev => [...prev, i]);
    }
    
    setIsExecuting(false);
    if (onWorkflowComplete) {
      onWorkflowComplete();
    }
  };

  const getStepStatus = (index) => {
    if (completedSteps.includes(index)) return 'completed';
    if (currentStep === index && isExecuting) return 'executing';
    if (index === 0 && !isExecuting) return 'ready';
    if (completedSteps.includes(index - 1)) return 'ready';
    return 'pending';
  };

  const getSystemIcon = (systems) => {
    if (systems.includes('Oracle Agile PLM')) return '🗄️';
    if (systems.includes('Autodesk Inventor')) return '🔧';
    if (systems.includes('PSI Penta')) return '📋';
    if (systems.includes('Remberg')) return '🎫';
    return '⚙️';
  };

  // Report Generation Functions
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExecutiveReport = async () => {
    setIsGeneratingReport(true);
    setCurrentReportType('Executive Summary');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const timestamp = new Date().toLocaleString();
    const reportContent = `
EXECUTIVE SUMMARY REPORT
Wire Shelf Manufacturing Feasibility Analysis
Generated: ${timestamp}

═══════════════════════════════════════════════════════════════════════════════
                                EXECUTIVE OVERVIEW
═══════════════════════════════════════════════════════════════════════════════

PROJECT STATUS
Feasibility Assessment: ${analysisResults?.executiveSummary?.feasibilityStatus || 'FEASIBLE with modifications'}
Overall Confidence: ${analysisResults?.executiveSummary?.overallConfidence || '85'}%
Risk Level: ${analysisResults?.executiveSummary?.riskLevel || 'Medium-Low'}

FINANCIAL OVERVIEW
Budget Range: ${analysisResults?.executiveSummary?.budgetRange || '$18,500 - $28,000'}
Estimated Timeline: ${analysisResults?.executiveSummary?.estimatedTimeline || '4-6 weeks'}
ROI Projection: 15-25% within first year

KEY RECOMMENDATIONS
${(analysisResults?.keyRecommendations || [
  { priority: "HIGH", title: "Upgrade Spot Welding System", description: "Critical for quality" },
  { priority: "MEDIUM", title: "Wire Surface Preparation", description: "Improved coating adhesion" },
  { priority: "LOW", title: "Quality Documentation", description: "Enhanced traceability" }
]).map((rec, index) => `${index + 1}. ${rec.title} [${rec.priority} PRIORITY]
   ${rec.description}`).join('\n\n')}

NEXT STEPS
1. Approve budget allocation for equipment upgrades
2. Schedule Phase 1 implementation (Equipment Setup)
3. Coordinate with engineering team for detailed planning
4. Initiate procurement process for critical components

═══════════════════════════════════════════════════════════════════════════════
                                END OF EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════════════════════
    `;

    const fileName = `Executive_Summary_${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(reportContent, fileName, 'text/plain');

    setIsGeneratingReport(false);
    setCurrentReportType(null);
  };

  const generateTechnicalReport = async () => {
    setIsGeneratingReport(true);
    setCurrentReportType('Technical Analysis');

    await new Promise(resolve => setTimeout(resolve, 2500));

    const timestamp = new Date().toLocaleString();
    const reportContent = `
TECHNICAL ANALYSIS REPORT
Wire Shelf Manufacturing Engineering Specifications
Generated: ${timestamp}

═══════════════════════════════════════════════════════════════════════════════
                            MACHINE COMPATIBILITY ANALYSIS
═══════════════════════════════════════════════════════════════════════════════

${Object.entries(analysisResults?.detailedAnalysis?.machineCompatibility || {
  wireFormingCapability: "✅ Fully compatible with 6mm-12mm wire diameter",
  weldingSystem: "⚠️ Requires spot welding station upgrade",
  coatingLine: "✅ Powder coating line ready for wire shelves",
  qualityControl: "✅ Current inspection systems adequate"
}).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

COMPONENT SPECIFICATIONS
${Object.entries(analysisResults?.detailedAnalysis?.componentAnalysis || {
  wireFrameStructure: { material: "304 Stainless Steel Wire (6mm)", compatibility: "95%", modifications: "Minor spacing adjustments" },
  shelfSurface: { material: "Welded Wire Mesh (50x50mm)", compatibility: "88%", modifications: "Grid pattern optimization" },
  supportBrackets: { material: "Stamped Steel Brackets", compatibility: "92%", modifications: "Mounting hole repositioning" }
}).map(([component, details]) => `
${component.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
  Material: ${details.material || 'TBD'}
  Compatibility: ${details.compatibility || 'TBD'}
  Required Modifications: ${details.modifications || 'None'}
`).join('')}

TECHNICAL REQUIREMENTS
${Object.entries(analysisResults?.technicalSpecs?.dimensions || {
  shelfWidth: "600mm - 1200mm (adjustable)",
  shelfDepth: "400mm - 800mm (configurable)",
  wireSpacing: "50mm standard grid",
  loadCapacity: "25kg per shelf"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

IMPLEMENTATION PHASES
${Object.entries(analysisResults?.implementationPlan || {
  phase1: { name: "Equipment Setup & Calibration", duration: "2 weeks", tasks: ["Install wire forming dies", "Calibrate welding parameters"] },
  phase2: { name: "Production Trial & Optimization", duration: "1 week", tasks: ["Run pilot batch", "Optimize cycle times"] },
  phase3: { name: "Full Production Ramp-up", duration: "1-2 weeks", tasks: ["Scale to target volume", "Quality monitoring"] }
}).map(([phase, details]) => `
${phase.toUpperCase()}: ${details.name}
Duration: ${details.duration}
Key Tasks: ${details.tasks.join(', ')}
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
                                END OF TECHNICAL REPORT
═══════════════════════════════════════════════════════════════════════════════
    `;

    const fileName = `Technical_Analysis_${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(reportContent, fileName, 'text/plain');

    setIsGeneratingReport(false);
    setCurrentReportType(null);
  };

  const generateBOMReport = async () => {
    setIsGeneratingReport(true);
    setCurrentReportType('Bill of Materials');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const timestamp = new Date().toLocaleString();
    const bomContent = `Part Number,Description,Quantity,Material,Finish,Category,Estimated Cost
WF-6MM-304,"Wire Frame - 6mm 304 Stainless Steel",4,"304 Stainless Steel","Natural","Structure","$45.00"
WM-50X50-304,"Wire Mesh - 50x50mm Grid",2,"304 Stainless Steel","Powder Coated","Shelving","$32.00"
SB-STD-ZP,"Support Brackets - Standard",8,"Cold Rolled Steel","Zinc Plated","Hardware","$18.00"
WD-8H-CHR,"Wire Dividers - 8 inch Height",4,"304 Stainless Steel","Chrome","Organization","$24.00"
HK-STD-SS,"Hardware Kit - Bolts & Nuts",1,"Stainless Steel","Natural","Hardware","$15.00"
EP-CLR-PC,"Enclosure Panels - Clear",2,"Polycarbonate","Clear","Enclosure","$28.00"

SUMMARY:
Total Components: 21 pieces
Estimated Total Cost: $162.00
Lead Time: 2-3 weeks
Supplier: Industrial Wire Solutions Inc.

Generated: ${timestamp}
Project: Wire Shelf Manufacturing Analysis
    `;

    const fileName = `Bill_of_Materials_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(bomContent, fileName, 'text/csv');

    setIsGeneratingReport(false);
    setCurrentReportType(null);
  };

  const generateAgilePLMReport = async () => {
    setIsGeneratingReport(true);
    setCurrentReportType('Agile PLM Integration');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const timestamp = new Date().toLocaleString();
    const reportContent = `
ORACLE AGILE PLM INTEGRATION GUIDE
Wire Shelf Manufacturing System Integration
Generated: ${timestamp}

═══════════════════════════════════════════════════════════════════════════════
                            AGILE PLM WORKFLOW PROCEDURES
═══════════════════════════════════════════════════════════════════════════════

SYSTEM INTEGRATION OVERVIEW
Source Machine: ${analysisResults?.referenceDesignFound?.machineCode || 'REF-WS-2023'}
Target Machine: ${analysisResults?.machineCompatibility?.machineCode || 'WS-2024-001'}
Integration Type: Component Copy with Property Updates

PLM COPY PROCESS
1. Access Oracle Agile PLM Workbench
2. Navigate to Source Assembly: ${analysisResults?.referenceDesignFound?.machineCode || 'REF-WS-2023'}
3. Execute "Copy Assembly" function
4. Update target machine properties:
   - Machine Code: ${analysisResults?.machineCompatibility?.machineCode || 'WS-2024-001'}
   - Description: Wire Shelf Manufacturing Unit
   - Status: In Development
   - Owner: Manufacturing Engineering

COMPONENT PROCESSING
${(analysisResults?.referenceDesignFound?.designComponents || [
  { agilePartNumber: "WF-6MM-304-001", description: "Wire Frame Assembly", copyMethod: "DIRECT_COPY", modificationLevel: "Low" },
  { agilePartNumber: "WM-50X50-304-002", description: "Wire Mesh Panel", copyMethod: "COPY_MODIFY", modificationLevel: "Medium" },
  { agilePartNumber: "SB-STD-ZP-003", description: "Support Bracket Set", copyMethod: "COPY_MODIFY", modificationLevel: "Low" }
]).map(comp => `
Agile Part Number: ${comp.agilePartNumber}
Description: ${comp.description}
Copy Method: ${comp.copyMethod}
Modification Level: ${comp.modificationLevel}
Action Required: ${comp.modificationLevel !== 'Low' ? 'Engineering Review' : 'Standard Copy'}
`).join('')}

INVENTOR INTEGRATION
1. Open Autodesk Inventor Professional
2. Access PLM-linked assemblies
3. Perform required modifications:
   - Update wire spacing parameters
   - Modify mounting hole positions
   - Adjust coating specifications
4. Save and sync with Agile PLM

WORKFLOW CHECKLIST
□ Source assembly identified and accessible
□ Target machine code assigned
□ Component copy permissions verified
□ Engineering change orders created
□ Inventor modifications completed
□ Quality review documentation updated
□ Manufacturing instructions generated
□ PLM workflow status updated to "Ready for Production"

NEXT ACTIONS
1. Schedule PLM administrator review
2. Coordinate with CAD engineering team
3. Initiate component copy process
4. Monitor workflow progress in Agile dashboard

═══════════════════════════════════════════════════════════════════════════════
                                END OF PLM INTEGRATION GUIDE
═══════════════════════════════════════════════════════════════════════════════
    `;

    const fileName = `Agile_PLM_Integration_${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(reportContent, fileName, 'text/plain');

    setIsGeneratingReport(false);
    setCurrentReportType(null);
  };

  const generateCompletePackage = async () => {
    setIsGeneratingReport(true);
    setCurrentReportType('Complete Package');

    // Simulate generating all reports
    await new Promise(resolve => setTimeout(resolve, 3000));

    // For now, we'll create a comprehensive summary document
    // In a real implementation, this would create a ZIP file with all reports
    const timestamp = new Date().toLocaleString();
    const packageContent = `
COMPLETE MANUFACTURING DOCUMENTATION PACKAGE
Wire Shelf Manufacturing Project
Generated: ${timestamp}

═══════════════════════════════════════════════════════════════════════════════
                                PACKAGE CONTENTS
═══════════════════════════════════════════════════════════════════════════════

This package contains the following documents:

1. Executive Summary Report (4-6 pages)
   - Feasibility assessment and key metrics
   - Budget and timeline estimates
   - Risk assessment summary
   - Strategic recommendations

2. Technical Analysis Report (8-12 pages)
   - Detailed machine compatibility analysis
   - Component specifications and requirements
   - Implementation roadmap and phases
   - Engineering specifications

3. Bill of Materials (Excel/CSV)
   - Complete component listing
   - Part numbers and specifications
   - Quantity requirements and costs
   - Supplier information

4. Oracle Agile PLM Integration Guide (6-8 pages)
   - PLM workflow procedures
   - Component copy instructions
   - System integration checklist
   - Autodesk Inventor integration steps

USAGE INSTRUCTIONS
1. Review Executive Summary for high-level overview
2. Use Technical Analysis for detailed engineering planning
3. Import BOM into procurement systems
4. Follow PLM Integration Guide for system setup

PROJECT SUMMARY
Status: ${analysisResults?.executiveSummary?.feasibilityStatus || 'FEASIBLE with modifications'}
Confidence: ${analysisResults?.executiveSummary?.overallConfidence || '85'}%
Timeline: ${analysisResults?.executiveSummary?.estimatedTimeline || '4-6 weeks'}
Budget: ${analysisResults?.executiveSummary?.budgetRange || '$18,500 - $28,000'}

For questions or support, contact:
Engineering Team: engineering@manufacturing.com
Project Management: pm@manufacturing.com

═══════════════════════════════════════════════════════════════════════════════
                                END OF PACKAGE SUMMARY
═══════════════════════════════════════════════════════════════════════════════
    `;

    const fileName = `Complete_Manufacturing_Package_${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(packageContent, fileName, 'text/plain');

    setIsGeneratingReport(false);
    setCurrentReportType(null);
  };

  return (
    <div className="system-integration-workflow">
      <div className="workflow-header">
        <h2 className="workflow-title">System Integration Workflow</h2>
        <p className="workflow-subtitle">
          Enterprise Manufacturing Systems Integration Pipeline
        </p>
      </div>

      {/* Workflow Overview */}
      <div className="workflow-overview">
        <div className="systems-chain">
          <div className="system-node">
            <div className="system-icon">🗄️</div>
            <span className="system-name">Oracle Agile PLM</span>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="system-node">
            <div className="system-icon">🔧</div>
            <span className="system-name">Autodesk Inventor</span>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="system-node">
            <div className="system-icon">📊</div>
            <span className="system-name">ItemCollector</span>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="system-node">
            <div className="system-icon">📋</div>
            <span className="system-name">PSI Penta</span>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="system-node">
            <div className="system-icon">🎫</div>
            <span className="system-name">Remberg</span>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="workflow-steps">
        {systemWorkflow.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div key={index} className={`workflow-step ${status}`}>
              <div className="step-indicator">
                <div className="step-number">
                  {status === 'completed' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : status === 'executing' ? (
                    <div className="executing-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < systemWorkflow.length - 1 && (
                  <div className={`step-connector ${completedSteps.includes(index) ? 'completed' : ''}`}></div>
                )}
              </div>

              <div className="step-content">
                <div className="step-header">
                  <h3 className="step-title">{step.step}</h3>
                  <div className="step-systems">
                    {step.systems.map((system, sysIndex) => (
                      <span key={sysIndex} className="system-tag">
                        {getSystemIcon([system])} {system}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="step-description">{step.description}</p>
                
                {status === 'executing' && (
                  <div className="step-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <span className="progress-text">Processing...</span>
                  </div>
                )}
                
                {status === 'completed' && (
                  <div className="step-completed">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Completed successfully</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Summary */}
      {analysisResults && (
        <div className="workflow-analysis-summary">
          <h3 className="summary-title">Implementation Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Target Machine:</span>
              <span className="summary-value">{analysisResults.machineCompatibility?.machineCode || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Reference Design:</span>
              <span className="summary-value">{analysisResults.referenceDesignFound?.machineCode || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Development Time:</span>
              <span className="summary-value">{analysisResults.projectEstimation?.totalDevelopmentTime || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Cost Estimate:</span>
              <span className="summary-value">{analysisResults.projectEstimation?.costEstimate || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="workflow-actions">
        {!isExecuting && completedSteps.length === 0 && (
          <button 
            onClick={executeWorkflow}
            className="workflow-btn primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Execute Integration Workflow
          </button>
        )}
        
        {isExecuting && (
          <div className="workflow-status">
            <div className="status-indicator executing">
              <div className="status-spinner"></div>
            </div>
            <span className="status-text">
              Executing Step {currentStep + 1} of {systemWorkflow.length}: {systemWorkflow[currentStep]?.step}
            </span>
          </div>
        )}
        
        {completedSteps.length === systemWorkflow.length && (
          <div className="workflow-completed">
            <div className="completion-icon">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="completion-content">
              <h3 className="completion-title">Workflow Completed Successfully</h3>
              <p className="completion-description">
                All systems have been updated and the manufacturing order is ready for production.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Report Generation Section */}
      <div className="workflow-reports-section">
        <div className="reports-header">
          <div className="reports-icon">📊</div>
          <div className="reports-title-section">
            <h3 className="reports-title">Generate Manufacturing Reports</h3>
            <p className="reports-subtitle">
              Download comprehensive documentation for your manufacturing project
            </p>
          </div>
        </div>

        <div className="reports-grid">
          {/* Executive Summary Report */}
          <div className="report-card executive">
            <div className="report-card-header">
              <div className="report-icon">📋</div>
              <div className="report-info">
                <h4 className="report-name">Executive Summary</h4>
                <p className="report-description">
                  High-level feasibility assessment with key metrics and recommendations
                </p>
              </div>
            </div>
            <div className="report-details">
              <div className="report-features">
                <span className="feature-item">• Feasibility Status & Confidence</span>
                <span className="feature-item">• Budget & Timeline Estimates</span>
                <span className="feature-item">• Risk Assessment Summary</span>
                <span className="feature-item">• Key Recommendations</span>
              </div>
              <div className="report-meta">
                <span className="report-pages">4-6 pages</span>
                <span className="report-format">PDF Format</span>
              </div>
            </div>
            <button
              className="report-download-btn executive"
              onClick={generateExecutiveReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport && currentReportType === 'Executive Summary' ? (
                <div className="report-spinner"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {isGeneratingReport && currentReportType === 'Executive Summary' ? 'Generating...' : 'Download Executive Report'}
            </button>
          </div>

          {/* Technical Analysis Report */}
          <div className="report-card technical">
            <div className="report-card-header">
              <div className="report-icon">🔧</div>
              <div className="report-info">
                <h4 className="report-name">Technical Analysis</h4>
                <p className="report-description">
                  Detailed engineering specifications and machine compatibility analysis
                </p>
              </div>
            </div>
            <div className="report-details">
              <div className="report-features">
                <span className="feature-item">• Machine Compatibility Details</span>
                <span className="feature-item">• Component Specifications</span>
                <span className="feature-item">• Technical Requirements</span>
                <span className="feature-item">• Implementation Roadmap</span>
              </div>
              <div className="report-meta">
                <span className="report-pages">8-12 pages</span>
                <span className="report-format">PDF Format</span>
              </div>
            </div>
            <button
              className="report-download-btn technical"
              onClick={generateTechnicalReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport && currentReportType === 'Technical Analysis' ? (
                <div className="report-spinner"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {isGeneratingReport && currentReportType === 'Technical Analysis' ? 'Generating...' : 'Download Technical Report'}
            </button>
          </div>

          {/* Bill of Materials */}
          <div className="report-card bom">
            <div className="report-card-header">
              <div className="report-icon">📊</div>
              <div className="report-info">
                <h4 className="report-name">Bill of Materials</h4>
                <p className="report-description">
                  Complete component list ready for procurement and manufacturing
                </p>
              </div>
            </div>
            <div className="report-details">
              <div className="report-features">
                <span className="feature-item">• Component Part Numbers</span>
                <span className="feature-item">• Quantities & Specifications</span>
                <span className="feature-item">• Supplier Information</span>
                <span className="feature-item">• Cost Estimates</span>
              </div>
              <div className="report-meta">
                <span className="report-pages">Excel/CSV</span>
                <span className="report-format">Spreadsheet</span>
              </div>
            </div>
            <button
              className="report-download-btn bom"
              onClick={generateBOMReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport && currentReportType === 'Bill of Materials' ? (
                <div className="report-spinner"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {isGeneratingReport && currentReportType === 'Bill of Materials' ? 'Generating...' : 'Download BOM'}
            </button>
          </div>

          {/* Oracle Agile PLM Integration */}
          <div className="report-card agile">
            <div className="report-card-header">
              <div className="report-icon">🗄️</div>
              <div className="report-info">
                <h4 className="report-name">Agile PLM Integration</h4>
                <p className="report-description">
                  Oracle Agile PLM workflow documentation and system integration guide
                </p>
              </div>
            </div>
            <div className="report-details">
              <div className="report-features">
                <span className="feature-item">• PLM Copy Procedures</span>
                <span className="feature-item">• Property Updates</span>
                <span className="feature-item">• Workflow Instructions</span>
                <span className="feature-item">• Integration Checklist</span>
              </div>
              <div className="report-meta">
                <span className="report-pages">6-8 pages</span>
                <span className="report-format">PDF Format</span>
              </div>
            </div>
            <button
              className="report-download-btn agile"
              onClick={generateAgilePLMReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport && currentReportType === 'Agile PLM Integration' ? (
                <div className="report-spinner"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {isGeneratingReport && currentReportType === 'Agile PLM Integration' ? 'Generating...' : 'Download PLM Guide'}
            </button>
          </div>
        </div>

        {/* Complete Package Download */}
        <div className="complete-package-section">
          <div className="package-header">
            <div className="package-icon">📦</div>
            <div className="package-info">
              <h4 className="package-title">Complete Documentation Package</h4>
              <p className="package-description">
                Download all reports and documentation in a single ZIP file
              </p>
            </div>
          </div>
          <button
            className="package-download-btn"
            onClick={generateCompletePackage}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport && currentReportType === 'Complete Package' ? (
              <div className="report-spinner"></div>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {isGeneratingReport && currentReportType === 'Complete Package' ? 'Generating Package...' : 'Download Complete Package'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrationWorkflow;
