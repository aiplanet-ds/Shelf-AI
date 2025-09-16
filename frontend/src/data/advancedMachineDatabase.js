// Advanced Machine Database for Manufacturing Engineering AI Assistant
// Comprehensive operational status, compatibility matrices, and service history

export const extendedMachineDatabase = [
  {
    machineCode: "MC-14496-A",
    series: "Advanced Production Line Series",
    currentFormat: "Standard Container Format (Type A)",
    operationalStatus: "Active Production",
    lastUpdated: "2024-08-28T14:30:00Z",
    capabilities: {
      processing: { 
        status: true, 
        capacity: "High", 
        efficiency: "92%",
        throughput: "450 units/hour",
        qualityRating: "99.2%"
      },
      handling: { 
        status: true, 
        maxLoad: "500kg", 
        precision: "±0.1mm",
        repeatability: "±0.05mm",
        workingRange: "300x300x200mm"
      },
      transport: { 
        status: true, 
        speed: "120 units/min", 
        reliability: "99.2%",
        bufferCapacity: "50 units",
        conveyorType: "Servo-driven belt"
      },
      adaptability: { 
        dimensionRange: "±30%", 
        formatFlexibility: "Medium",
        toolChangeTime: "15 minutes",
        setupComplexity: "Medium"
      }
    },
    serviceHistory: {
      lastMaintenance: "2024-08-15",
      uptime: "99.7%",
      criticalIssues: 0,
      minorModifications: 3,
      serviceIntervals: "Monthly",
      nextScheduledMaintenance: "2024-09-15",
      maintenanceTeam: "Team Alpha",
      serviceNotes: [
        "Guide rail alignment optimized - Aug 2024",
        "Transport belt tension adjusted - Jul 2024", 
        "Sensor calibration completed - Jun 2024"
      ]
    },
    compatibilityMatrix: {
      containerTypes: ["Standard", "Enhanced", "Custom-A"],
      processingModes: ["Standard", "High-Speed", "Precision"],
      dimensionalLimits: { 
        minSize: "15mm", 
        maxSize: "65mm",
        heightRange: "20-80mm",
        diameterRange: "12-70mm"
      },
      materialCompatibility: ["Plastic", "Glass", "Metal", "Composite"],
      temperatureRange: "5°C to 40°C",
      humidityTolerance: "30-80% RH"
    },
    performanceMetrics: {
      oee: "87.5%", // Overall Equipment Effectiveness
      availability: "99.7%",
      performance: "92.1%",
      quality: "95.2%",
      cycleTime: "8.2 seconds",
      changoverTime: "12 minutes"
    },
    riskFactors: [
      {
        type: "Operational",
        description: "Custom bracket installation detected",
        severity: "Low",
        impact: "Minimal performance impact",
        mitigation: "Monitor during format changes"
      },
      {
        type: "Compatibility", 
        description: "Non-standard guide rail modifications",
        severity: "Medium",
        impact: "May affect precision with new formats",
        mitigation: "Validate alignment before implementation"
      }
    ]
  },
  {
    machineCode: "MC-13766-B",
    series: "Precision Manufacturing Platform",
    currentFormat: "Enhanced Container Format (Type B)",
    operationalStatus: "Active Production",
    lastUpdated: "2024-08-27T09:15:00Z",
    capabilities: {
      processing: { 
        status: true, 
        capacity: "Medium-High", 
        efficiency: "89%",
        throughput: "380 units/hour",
        qualityRating: "99.5%"
      },
      handling: { 
        status: true, 
        maxLoad: "350kg", 
        precision: "±0.05mm",
        repeatability: "±0.02mm",
        workingRange: "250x250x150mm"
      },
      transport: { 
        status: true, 
        speed: "100 units/min", 
        reliability: "99.8%",
        bufferCapacity: "30 units",
        conveyorType: "Linear motor system"
      },
      adaptability: { 
        dimensionRange: "±25%", 
        formatFlexibility: "High",
        toolChangeTime: "8 minutes",
        setupComplexity: "Low"
      }
    },
    serviceHistory: {
      lastMaintenance: "2024-08-10",
      uptime: "99.9%",
      criticalIssues: 0,
      minorModifications: 1,
      serviceIntervals: "Bi-weekly",
      nextScheduledMaintenance: "2024-09-10",
      maintenanceTeam: "Team Beta",
      serviceNotes: [
        "Linear motor calibration - Aug 2024",
        "Vision system upgrade completed - Jul 2024"
      ]
    },
    compatibilityMatrix: {
      containerTypes: ["Enhanced", "Precision", "Custom-B"],
      processingModes: ["Precision", "Ultra-Precision", "Standard"],
      dimensionalLimits: { 
        minSize: "10mm", 
        maxSize: "50mm",
        heightRange: "15-60mm",
        diameterRange: "8-55mm"
      },
      materialCompatibility: ["Glass", "Ceramic", "High-grade Plastic"],
      temperatureRange: "18°C to 25°C",
      humidityTolerance: "45-65% RH"
    },
    performanceMetrics: {
      oee: "91.2%",
      availability: "99.9%",
      performance: "91.8%",
      quality: "99.5%",
      cycleTime: "9.5 seconds",
      changoverTime: "8 minutes"
    },
    riskFactors: [
      {
        type: "Environmental",
        description: "Requires controlled temperature environment",
        severity: "Low",
        impact: "Performance degradation in extreme conditions",
        mitigation: "Maintain environmental controls"
      }
    ]
  },
  {
    machineCode: "MC-15782-C",
    series: "High-Speed Production Line",
    currentFormat: "Rapid Processing Format (Type C)",
    operationalStatus: "Active Production",
    lastUpdated: "2024-08-26T16:45:00Z",
    capabilities: {
      processing: { 
        status: true, 
        capacity: "Very High", 
        efficiency: "94%",
        throughput: "600 units/hour",
        qualityRating: "98.8%"
      },
      handling: { 
        status: true, 
        maxLoad: "200kg", 
        precision: "±0.2mm",
        repeatability: "±0.1mm",
        workingRange: "200x200x100mm"
      },
      transport: { 
        status: true, 
        speed: "180 units/min", 
        reliability: "98.5%",
        bufferCapacity: "100 units",
        conveyorType: "High-speed chain drive"
      },
      adaptability: { 
        dimensionRange: "±20%", 
        formatFlexibility: "Medium",
        toolChangeTime: "20 minutes",
        setupComplexity: "High"
      }
    },
    serviceHistory: {
      lastMaintenance: "2024-08-20",
      uptime: "98.9%",
      criticalIssues: 1,
      minorModifications: 5,
      serviceIntervals: "Weekly",
      nextScheduledMaintenance: "2024-09-05",
      maintenanceTeam: "Team Gamma",
      serviceNotes: [
        "Chain drive lubrication system upgraded - Aug 2024",
        "High-speed sensor recalibration - Aug 2024",
        "Vibration dampening system installed - Jul 2024"
      ]
    },
    compatibilityMatrix: {
      containerTypes: ["Rapid", "Standard", "Lightweight"],
      processingModes: ["High-Speed", "Burst", "Continuous"],
      dimensionalLimits: { 
        minSize: "20mm", 
        maxSize: "40mm",
        heightRange: "25-50mm",
        diameterRange: "18-45mm"
      },
      materialCompatibility: ["Lightweight Plastic", "Aluminum", "Composite"],
      temperatureRange: "10°C to 35°C",
      humidityTolerance: "40-70% RH"
    },
    performanceMetrics: {
      oee: "85.3%",
      availability: "98.9%",
      performance: "94.2%",
      quality: "91.6%",
      cycleTime: "6.0 seconds",
      changoverTime: "18 minutes"
    },
    riskFactors: [
      {
        type: "Mechanical",
        description: "High-speed operation increases wear",
        severity: "Medium",
        impact: "Requires frequent maintenance",
        mitigation: "Enhanced lubrication and monitoring"
      },
      {
        type: "Quality",
        description: "Speed vs quality trade-off",
        severity: "Low",
        impact: "Slight quality reduction at maximum speed",
        mitigation: "Optimize speed settings for quality requirements"
      }
    ]
  }
];

export const machineCompatibilityAnalyzer = {
  analyzeCompatibility: (machineCode, requirements) => {
    const machine = extendedMachineDatabase.find(m => m.machineCode === machineCode);
    if (!machine) return null;

    const compatibility = {
      overall: 0,
      processing: 0,
      handling: 0,
      transport: 0,
      adaptability: 0,
      risks: [],
      recommendations: []
    };

    // Calculate compatibility scores (simplified algorithm)
    compatibility.processing = machine.capabilities.processing.status ? 85 : 0;
    compatibility.handling = machine.capabilities.handling.status ? 90 : 0;
    compatibility.transport = machine.capabilities.transport.status ? 88 : 0;
    compatibility.adaptability = machine.capabilities.adaptability.formatFlexibility === "High" ? 95 : 
                                 machine.capabilities.adaptability.formatFlexibility === "Medium" ? 80 : 65;

    compatibility.overall = Math.round(
      (compatibility.processing + compatibility.handling + compatibility.transport + compatibility.adaptability) / 4
    );

    // Add risk factors
    compatibility.risks = machine.riskFactors;

    // Generate recommendations
    if (compatibility.overall >= 85) {
      compatibility.recommendations.push("Excellent compatibility - proceed with implementation");
    } else if (compatibility.overall >= 70) {
      compatibility.recommendations.push("Good compatibility - minor modifications may be required");
    } else {
      compatibility.recommendations.push("Limited compatibility - significant modifications needed");
    }

    return compatibility;
  },

  findSimilarMachines: (targetSpecs) => {
    return extendedMachineDatabase
      .map(machine => ({
        ...machine,
        similarityScore: calculateSimilarityScore(machine, targetSpecs)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);
  }
};

const calculateSimilarityScore = (machine, targetSpecs) => {
  // Simplified similarity calculation
  let score = 0;
  
  // Capability matching
  if (machine.capabilities.processing.efficiency >= "90%") score += 25;
  if (machine.capabilities.handling.precision <= "±0.1mm") score += 25;
  if (machine.capabilities.transport.reliability >= "99%") score += 25;
  if (machine.capabilities.adaptability.formatFlexibility === "High") score += 25;
  
  return score;
};

export const getPerformanceMetrics = (machineCode) => {
  const machine = extendedMachineDatabase.find(m => m.machineCode === machineCode);
  return machine ? machine.performanceMetrics : null;
};

export const getServiceHistory = (machineCode) => {
  const machine = extendedMachineDatabase.find(m => m.machineCode === machineCode);
  return machine ? machine.serviceHistory : null;
};

export const getRiskAssessment = (machineCode) => {
  const machine = extendedMachineDatabase.find(m => m.machineCode === machineCode);
  return machine ? machine.riskFactors : [];
};
