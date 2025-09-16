// Manufacturing Analysis Results Templates
// Based on real pharmaceutical engineering workflows

export const generateAnalysisResults = (problemStatement, machineCode, targetFormat) => {
  // Parse problem statement to determine scenario
  const statement = problemStatement.toLowerCase();
  
  if (statement.includes('vial') && statement.includes('24x45')) {
    return vialAnalysisResults;
  } else if (statement.includes('syringe') && statement.includes('2.25ml')) {
    return syringeAnalysisResults;
  } else if (statement.includes('bottle') && statement.includes('250ml')) {
    return bottleAnalysisResults;
  } else if (statement.includes('stopper') && statement.includes('freeze')) {
    return stopperAnalysisResults;
  }
  
  return defaultAnalysisResults;
};

const vialAnalysisResults = {
  machineCompatibility: {
    status: "COMPATIBLE",
    machineCode: "14496",
    details: {
      currentFormat: "Vial Ø16x35",
      targetFormat: "Vial Ø24x45",
      fillingSuitability: "✅ Compatible per machine datasheet",
      gassingCapability: "✅ Existing system supports larger format", 
      stopperingSystem: "✅ Adjustable for Ø24x45",
      throughputImpact: "Minor reduction: 300 → 280 vials/min"
    }
  },
  referenceDesignFound: {
    machineCode: "13766",
    designComponents: [
      {
        agilePartNumber: "VT-24x45-001",
        description: "Vial Transport Guide",
        copyMethod: "MODIFY_EXISTING",
        modificationLevel: "Medium"
      }
    ],
    designAge: "18 months",
    currentStandard: "Meets latest pharma regulations",
    bomStatus: "Released in Agile PLM"
  },
  modificationRequirements: {
    critical: [
      {
        component: "Transport Guide Assembly",
        change: "Adjust guide width from 26mm to 24.5mm",
        reason: "Machine base compatibility",
        estimatedHours: 8,
        impact: "High",
        agilePartNumber: "VT-24x45-001"
      }
    ],
    superficial: [
      {
        component: "Mounting Brackets",
        change: "Update bracket design for new base plate",
        reason: "Aesthetic consistency",
        estimatedHours: 3,
        impact: "Low",
        agilePartNumber: "MB-STD-002"
      }
    ]
  },
  projectEstimation: {
    totalDevelopmentTime: "2-3 weeks",
    engineeringHours: 45,
    costEstimate: "$18,000 - $25,000",
    riskLevel: "Medium",
    confidence: "85%",
    nextStep: "Begin Agile PLM copy process"
  }
};

const syringeAnalysisResults = {
  machineCompatibility: {
    status: "COMPATIBLE",
    machineCode: "15782",
    details: {
      currentFormat: "Syringe 1ml",
      targetFormat: "Syringe 2.25ml",
      fillingSuitability: "✅ Volume within machine capacity",
      gassingCapability: "⚠️ Not applicable for syringe format",
      stopperingSystem: "✅ Plunger system compatible",
      throughputImpact: "Moderate reduction: 200 → 160 syringes/min"
    }
  },
  referenceDesignFound: {
    machineCode: "15782",
    designComponents: [
      {
        agilePartNumber: "SG-2.25ML-004",
        description: "Syringe Guide 2.25ml Format",
        copyMethod: "DEVELOP_NEW",
        modificationLevel: "High"
      }
    ],
    designAge: "In Development",
    currentStandard: "Prototype phase",
    bomStatus: "Development in Agile PLM"
  },
  modificationRequirements: {
    critical: [
      {
        component: "Syringe Guide System",
        change: "Scale guide dimensions for 2.25ml syringe",
        reason: "Format compatibility",
        estimatedHours: 12,
        impact: "High",
        agilePartNumber: "SG-2.25ML-004"
      }
    ],
    superficial: [
      {
        component: "Label Positioning",
        change: "Adjust label applicator for larger syringe",
        reason: "Regulatory compliance",
        estimatedHours: 4,
        impact: "Medium",
        agilePartNumber: "LA-SYR-003"
      }
    ]
  },
  projectEstimation: {
    totalDevelopmentTime: "4-6 weeks",
    engineeringHours: 75,
    costEstimate: "$35,000 - $45,000",
    riskLevel: "High",
    confidence: "70%",
    nextStep: "Complete prototype development"
  }
};

const bottleAnalysisResults = {
  machineCompatibility: {
    status: "COMPATIBLE",
    machineCode: "16234",
    details: {
      currentFormat: "Bottle 100ml",
      targetFormat: "Bottle 250ml",
      fillingSuitability: "✅ Volume within machine capacity",
      cappingCapability: "✅ Same cap system compatible",
      labelingSystem: "✅ Adjustable for larger bottles",
      throughputImpact: "Minor reduction: 150 → 135 bottles/min"
    }
  },
  referenceDesignFound: {
    machineCode: "16234",
    designComponents: [
      {
        agilePartNumber: "BC-250ML-005",
        description: "Bottle Clamp 250ml Format",
        copyMethod: "DIRECT_COPY",
        modificationLevel: "Low"
      }
    ],
    designAge: "6 months",
    currentStandard: "Current production standard",
    bomStatus: "Released in Agile PLM"
  },
  modificationRequirements: {
    critical: [],
    superficial: [
      {
        component: "Conveyor Guides",
        change: "Widen guide rails for 250ml bottles",
        reason: "Transport stability",
        estimatedHours: 6,
        impact: "Low",
        agilePartNumber: "CG-250ML-001"
      }
    ]
  },
  projectEstimation: {
    totalDevelopmentTime: "1-2 weeks",
    engineeringHours: 25,
    costEstimate: "$8,000 - $12,000",
    riskLevel: "Low",
    confidence: "95%",
    nextStep: "Direct implementation from existing design"
  }
};

const stopperAnalysisResults = {
  machineCompatibility: {
    status: "COMPATIBLE",
    machineCode: "17891",
    details: {
      currentFormat: "Standard Stopper",
      targetFormat: "Freeze-Dried Stopper",
      freezeDryingCapability: "✅ Lyophilizer supports new format",
      stopperingSystem: "✅ Pressure system adjustable",
      vialHandling: "✅ Compatible with existing vial transport",
      batchImpact: "No change: 10,000 vials per batch"
    }
  },
  referenceDesignFound: {
    machineCode: "17891",
    designComponents: [
      {
        agilePartNumber: "ST-FD-006",
        description: "Freeze-Dried Stopper System",
        copyMethod: "MODIFY_EXISTING",
        modificationLevel: "Low"
      }
    ],
    designAge: "8 months",
    currentStandard: "Current production standard",
    bomStatus: "Released in Agile PLM"
  },
  modificationRequirements: {
    critical: [],
    superficial: [
      {
        component: "Stopper Material Spec",
        change: "Update stopper material specification",
        reason: "Freeze-dry compatibility",
        estimatedHours: 4,
        impact: "Low",
        agilePartNumber: "ST-FD-006"
      }
    ]
  },
  projectEstimation: {
    totalDevelopmentTime: "1 week",
    engineeringHours: 15,
    costEstimate: "$5,000 - $8,000",
    riskLevel: "Low",
    confidence: "90%",
    nextStep: "Update material specifications in Agile PLM"
  }
};

const defaultAnalysisResults = {
  machineCompatibility: {
    status: "ANALYSIS_REQUIRED",
    details: {
      currentFormat: "Unknown",
      targetFormat: "To be determined",
      fillingSuitability: "⚠️ Requires detailed analysis",
      gassingCapability: "⚠️ Requires detailed analysis",
      stopperingSystem: "⚠️ Requires detailed analysis"
    }
  },
  referenceDesignFound: {
    machineCode: "Multiple candidates",
    designComponents: [],
    designAge: "Various",
    currentStandard: "To be evaluated"
  },
  modificationRequirements: {
    critical: [],
    superficial: []
  },
  projectEstimation: {
    totalDevelopmentTime: "To be determined",
    engineeringHours: "TBD",
    costEstimate: "Pending analysis",
    riskLevel: "Unknown",
    confidence: "Requires detailed assessment",
    nextStep: "Conduct detailed feasibility study"
  }
};
