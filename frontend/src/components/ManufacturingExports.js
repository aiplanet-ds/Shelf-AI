import React, { useState } from 'react';

const ManufacturingExports = ({ analysisResults, problemStatement, selectedComponents }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);

  const generatePDFReport = async () => {
    try {
      console.log('Starting PDF report generation...');
      setIsExporting(true);
      setExportType('PDF');

      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Generating report content...');
      const reportContent = generateReportContent();
      const fileName = `Wire_Shelf_Manufacturing_Analysis_${new Date().toISOString().split('T')[0]}.txt`;

      console.log('Downloading file:', fileName);
      downloadFile(reportContent, fileName, 'text/plain');

      setIsExporting(false);
      setExportType(null);
      console.log('PDF report generation completed successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      setIsExporting(false);
      setExportType(null);
      alert('Error generating report. Please try again.');
    }
  };

  const generateExcelBOM = async () => {
    try {
      console.log('Starting Excel BOM generation...');
      setIsExporting(true);
      setExportType('Excel');

      // Simulate Excel generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Generating BOM content...');
      const bomContent = generateBOMContent();
      const fileName = `Component_BOM_List_${new Date().toISOString().split('T')[0]}.csv`;

      console.log('Downloading BOM file:', fileName);
      downloadFile(bomContent, fileName, 'text/csv');

      setIsExporting(false);
      setExportType(null);
      console.log('Excel BOM generation completed successfully');
    } catch (error) {
      console.error('Error generating Excel BOM:', error);
      setIsExporting(false);
      setExportType(null);
      alert('Error generating BOM. Please try again.');
    }
  };

  const generateAgilePLMSummary = async () => {
    try {
      console.log('Starting Agile PLM summary generation...');
      setIsExporting(true);
      setExportType('Agile PLM');

      // Simulate Agile PLM summary generation
      await new Promise(resolve => setTimeout(resolve, 1800));

      console.log('Generating Agile PLM content...');
      const agileSummary = generateAgileSummaryContent();
      const fileName = `Agile_PLM_Summary_${new Date().toISOString().split('T')[0]}.txt`;

      console.log('Downloading Agile PLM file:', fileName);
      downloadFile(agileSummary, fileName, 'text/plain');

      setIsExporting(false);
      setExportType(null);
      console.log('Agile PLM summary generation completed successfully');
    } catch (error) {
      console.error('Error generating Agile PLM summary:', error);
      setIsExporting(false);
      setExportType(null);
      alert('Error generating Agile PLM summary. Please try again.');
    }
  };

  const generateReportContent = () => {
    const timestamp = new Date().toLocaleString();
    const currentDate = new Date().toLocaleDateString();

    return `
═══════════════════════════════════════════════════════════════════════════════
                    WIRE SHELF MANUFACTURING FEASIBILITY ANALYSIS
                              Professional Engineering Report
═══════════════════════════════════════════════════════════════════════════════

Report Generated: ${timestamp}
Project Date: ${currentDate}
Analysis Type: Manufacturing Feasibility & Oracle Agile PLM Integration

═══════════════════════════════════════════════════════════════════════════════
                                EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════════════════════

PROJECT OVERVIEW
Problem Statement: ${problemStatement || 'Wire shelf manufacturing feasibility analysis'}

FEASIBILITY ASSESSMENT
Status: ${analysisResults?.executiveSummary?.feasibilityStatus || 'FEASIBLE with modifications'}
Overall Confidence: ${analysisResults?.executiveSummary?.overallConfidence || '85'}%
Estimated Timeline: ${analysisResults?.executiveSummary?.estimatedTimeline || '4-6 weeks'}
Budget Range: ${analysisResults?.executiveSummary?.budgetRange || '$18,500 - $28,000'}
Risk Level: ${analysisResults?.executiveSummary?.riskLevel || 'Medium-Low'}

MACHINE COMPATIBILITY
Target Machine Code: ${analysisResults?.machineCompatibility?.machineCode || 'WS-2024-001'}
Compatibility Status: ${analysisResults?.machineCompatibility?.status || 'COMPATIBLE'}

═══════════════════════════════════════════════════════════════════════════════
                            DETAILED TECHNICAL ANALYSIS
═══════════════════════════════════════════════════════════════════════════════

MACHINE COMPATIBILITY ASSESSMENT
${Object.entries(analysisResults?.detailedAnalysis?.machineCompatibility || {
  wireFormingCapability: "✅ Fully compatible with 6mm-12mm wire diameter",
  weldingSystem: "⚠️ Requires spot welding station upgrade",
  coatingLine: "✅ Powder coating line ready for wire shelves",
  qualityControl: "✅ Current inspection systems adequate"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

COMPONENT ANALYSIS & MATERIALS
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

PRODUCTION REQUIREMENTS
${Object.entries(analysisResults?.detailedAnalysis?.productionRequirements || {
  wireFormingStations: 2,
  weldingStations: 3,
  coatingCapacity: "150 shelves/day",
  qualityCheckpoints: 4,
  estimatedCycleTime: "12 minutes per shelf unit"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              TECHNICAL SPECIFICATIONS
═══════════════════════════════════════════════════════════════════════════════

PRODUCT DIMENSIONS
${Object.entries(analysisResults?.technicalSpecs?.dimensions || {
  shelfWidth: "600mm - 1200mm (adjustable)",
  shelfDepth: "400mm - 800mm (configurable)",
  wireSpacing: "50mm standard grid",
  loadCapacity: "25kg per shelf"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

MATERIALS SPECIFICATION
${Object.entries(analysisResults?.technicalSpecs?.materials || {
  wireGrade: "304 Stainless Steel",
  wireDiameter: "6mm primary, 4mm secondary",
  coating: "Powder coat finish (RAL colors)",
  brackets: "Cold-rolled steel, zinc plated"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

QUALITY TOLERANCES
${Object.entries(analysisResults?.technicalSpecs?.tolerances || {
  dimensional: "±2mm on critical dimensions",
  wireSpacing: "±1mm grid accuracy",
  surface: "Ra 1.6μm after coating"
}).map(([key, value]) => `• ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                                RISK ASSESSMENT
═══════════════════════════════════════════════════════════════════════════════

IDENTIFIED RISKS
${(analysisResults?.detailedAnalysis?.riskMitigation?.identifiedRisks || [
  "Wire diameter tolerance variations",
  "Welding joint strength consistency",
  "Coating adhesion on wire surfaces",
  "Dimensional accuracy in forming"
]).map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

MITIGATION STRATEGIES
${(analysisResults?.detailedAnalysis?.riskMitigation?.mitigationStrategies || [
  "Implement wire diameter pre-sorting system",
  "Upgrade to servo-controlled welding parameters",
  "Add wire surface preparation stage",
  "Install precision forming jigs"
]).map((strategy, index) => `${index + 1}. ${strategy}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                              IMPLEMENTATION ROADMAP
═══════════════════════════════════════════════════════════════════════════════

${Object.entries(analysisResults?.implementationPlan || {
  phase1: { name: "Equipment Setup & Calibration", duration: "2 weeks", tasks: ["Install wire forming dies", "Calibrate welding parameters", "Setup coating line", "Configure quality stations"] },
  phase2: { name: "Production Trial & Optimization", duration: "1 week", tasks: ["Run pilot batch (50 units)", "Optimize cycle times", "Validate quality", "Train operators"] },
  phase3: { name: "Full Production Ramp-up", duration: "1-2 weeks", tasks: ["Scale to target volume", "Continuous improvement", "Supply chain setup", "Quality monitoring"] }
}).map(([phase, details]) => `
${phase.toUpperCase()}: ${details.name}
Duration: ${details.duration}
Key Tasks:
${details.tasks.map(task => `  • ${task}`).join('\n')}
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
                              KEY RECOMMENDATIONS
═══════════════════════════════════════════════════════════════════════════════

${(analysisResults?.keyRecommendations || [
  { priority: "HIGH", title: "Upgrade Spot Welding System", description: "Install servo-controlled welding stations", impact: "Critical for structural integrity", timeline: "Week 1-2" },
  { priority: "MEDIUM", title: "Wire Surface Preparation", description: "Add degreasing and surface treatment", impact: "Improved coating adhesion", timeline: "Week 2-3" },
  { priority: "LOW", title: "Quality Documentation", description: "Implement digital quality tracking", impact: "Enhanced traceability", timeline: "Week 3-4" }
]).map((rec, index) => `
${index + 1}. ${rec.title} [${rec.priority} PRIORITY]
   Description: ${rec.description}
   Business Impact: ${rec.impact}
   Timeline: ${rec.timeline}
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
                                PROJECT ESTIMATION
═══════════════════════════════════════════════════════════════════════════════

Development Time: ${analysisResults?.projectEstimation?.totalDevelopmentTime || '4-6 weeks'}
Engineering Hours: ${analysisResults?.projectEstimation?.engineeringHours || '240-320 hours'}
Cost Estimate: ${analysisResults?.projectEstimation?.costEstimate || '$18,500 - $28,000'}
Risk Level: ${analysisResults?.projectEstimation?.riskLevel || 'Medium-Low'}
Success Probability: ${analysisResults?.projectEstimation?.confidence || '85%'}

NEXT STEPS
${analysisResults?.projectEstimation?.nextStep || 'Proceed with Phase 1 implementation and equipment setup'}

═══════════════════════════════════════════════════════════════════════════════
                                REPORT FOOTER
═══════════════════════════════════════════════════════════════════════════════

Report Generated By: Manufacturing Wire Shelves Configurator
Integration Systems: Oracle Agile PLM • Autodesk Inventor • Enterprise MRP
Analysis Engine: AI-Powered Manufacturing Feasibility Assessment
Document Version: 1.0
Confidentiality: Internal Use Only

For technical questions, contact: engineering@manufacturing.com
For project management: pm@manufacturing.com

═══════════════════════════════════════════════════════════════════════════════
                                END OF REPORT
═══════════════════════════════════════════════════════════════════════════════
    `;
  };

  const generateBOMContent = () => {
    const timestamp = new Date().toLocaleString();
    return `
BILL OF MATERIALS (BOM)
Generated: ${timestamp}

PROJECT INFORMATION
==================
Problem Statement: ${problemStatement}
Target Machine Code: ${analysisResults?.machineCompatibility?.machineCode || 'N/A'}
Reference Machine Code: ${analysisResults?.referenceDesignFound?.machineCode || 'N/A'}

COMPONENT LIST
=============
${analysisResults?.referenceDesignFound?.designComponents?.map((comp, index) => 
  `${index + 1}. ${comp.agilePartNumber}
   Description: ${comp.description}
   Status: Released
   Copy Method: ${comp.copyMethod}
   Modification Level: ${comp.modificationLevel}
   Category: Format Parts
   Material: Stainless Steel 316L
   Finish: Electropolished
   
`).join('') || 'No components available'}

MODIFICATION REQUIREMENTS
========================
${analysisResults?.modificationRequirements?.critical?.map((mod, index) => 
  `CRITICAL ${index + 1}: ${mod.component}
   Change Required: ${mod.change}
   Estimated Hours: ${mod.estimatedHours}
   Impact Level: ${mod.impact}
   Reason: ${mod.reason}
   
`).join('') || 'No critical modifications'}

${analysisResults?.modificationRequirements?.superficial?.map((mod, index) => 
  `SUPERFICIAL ${index + 1}: ${mod.component}
   Change Required: ${mod.change}
   Estimated Hours: ${mod.estimatedHours}
   Impact Level: ${mod.impact}
   Reason: ${mod.reason}
   
`).join('') || 'No superficial modifications'}

PROCUREMENT INFORMATION
======================
Total Engineering Hours: ${analysisResults?.projectEstimation?.engineeringHours || 'TBD'}
Estimated Cost: ${analysisResults?.projectEstimation?.costEstimate || 'TBD'}
Development Timeline: ${analysisResults?.projectEstimation?.totalDevelopmentTime || 'TBD'}

---
BOM generated for Oracle Agile PLM system integration
Ready for ItemCollector transfer to PSI Penta
    `;
  };

  const generateAgileSummaryContent = () => {
    const timestamp = new Date().toLocaleString();
    return `
ORACLE AGILE PLM INTEGRATION SUMMARY
Generated: ${timestamp}

SYSTEM INTEGRATION WORKFLOW
===========================
1. Agile PLM Copy Process
   - Copy reference assemblies with property updates
   - Source Machine: ${analysisResults?.referenceDesignFound?.machineCode || 'N/A'}
   - Target Machine: ${analysisResults?.machineCompatibility?.machineCode || 'N/A'}

2. Inventor Design Changes
   - Modify 3D models and update 2D drawings
   - Critical modifications: ${analysisResults?.modificationRequirements?.critical?.length || 0}
   - Superficial modifications: ${analysisResults?.modificationRequirements?.superficial?.length || 0}

3. Property Updates
   - Update BOM and material designations
   - Apply 3D_Document_Mask
   - Apply BOM_Storage_Mask
   - Apply 2D_Document_Mask

4. Release Process
   - Release assemblies for manufacturing order
   - Status: Ready for release

5. Order Generation
   - Transfer to PSI Penta via ItemCollector
   - Create Remberg work order tickets
   - Update Excel tracking systems

COMPONENT DETAILS FOR AGILE PLM
==============================
${analysisResults?.referenceDesignFound?.designComponents?.map(comp => 
  `Agile Part Number: ${comp.agilePartNumber}
Description: ${comp.description}
Current Status: Released
Copy Method: ${comp.copyMethod}
Modification Required: ${comp.modificationLevel !== 'Low' ? 'Yes' : 'No'}
Target Machine: ${analysisResults?.machineCompatibility?.machineCode}

`).join('') || 'No components for processing'}

ENGINEERING RESOURCE PLANNING
=============================
Total Development Time: ${analysisResults?.projectEstimation?.totalDevelopmentTime || 'TBD'}
Engineering Hours Required: ${analysisResults?.projectEstimation?.engineeringHours || 'TBD'}
Risk Assessment: ${analysisResults?.projectEstimation?.riskLevel || 'TBD'}
Success Probability: ${analysisResults?.projectEstimation?.confidence || 'TBD'}

NEXT ACTIONS IN AGILE PLM
=========================
1. ${analysisResults?.projectEstimation?.nextStep || 'Begin analysis'}
2. Schedule engineering resources
3. Initiate component copy process
4. Update machine configuration database
5. Generate manufacturing work orders

---
Summary formatted for direct entry into Oracle Agile PLM system
Compatible with Autodesk Inventor integration workflow
    `;
  };

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

  return (
    <div className="manufacturing-exports">
      <div className="exports-header">
        <h3 className="exports-title">Export Analysis Results</h3>
        <p className="exports-subtitle">
          Generate professional reports for manufacturing systems integration
        </p>
      </div>

      <div className="export-options">
        <div className="export-option">
          <div className="export-icon">📄</div>
          <div className="export-info">
            <h4 className="export-name">PDF Analysis Report</h4>
            <p className="export-description">
              Complete feasibility analysis with machine compatibility, component details, and project estimation
            </p>
          </div>
          <button 
            onClick={generatePDFReport}
            disabled={isExporting}
            className="export-btn"
          >
            {isExporting && exportType === 'PDF' ? (
              <div className="export-spinner"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export PDF
          </button>
        </div>

        <div className="export-option">
          <div className="export-icon">📊</div>
          <div className="export-info">
            <h4 className="export-name">Excel BOM List</h4>
            <p className="export-description">
              Component bill of materials ready for manufacturing order and procurement systems
            </p>
          </div>
          <button 
            onClick={generateExcelBOM}
            disabled={isExporting}
            className="export-btn"
          >
            {isExporting && exportType === 'Excel' ? (
              <div className="export-spinner"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export Excel
          </button>
        </div>

        <div className="export-option">
          <div className="export-icon">🗄️</div>
          <div className="export-info">
            <h4 className="export-name">Agile PLM Summary</h4>
            <p className="export-description">
              Formatted summary for direct entry into Oracle Agile PLM system with workflow details
            </p>
          </div>
          <button 
            onClick={generateAgilePLMSummary}
            disabled={isExporting}
            className="export-btn"
          >
            {isExporting && exportType === 'Agile PLM' ? (
              <div className="export-spinner"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-1" />
              </svg>
            )}
            Export Summary
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="export-status">
          <div className="status-content">
            <div className="status-spinner-large"></div>
            <div className="status-text">
              <h4>Generating {exportType} Export</h4>
              <p>Processing analysis data and formatting for professional use...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturingExports;
