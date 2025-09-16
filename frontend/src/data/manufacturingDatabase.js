// Manufacturing Database - Oracle Agile PLM Simulation
// Based on real pharmaceutical manufacturing engineering workflows

export const machineDatabase = [
  {
    machineCode: "14496",
    series: "400 series filler",
    currentFormat: "Vial Ø16x35",
    capabilities: {
      filling: true,
      gassing: true,
      stoppering: true,
      maxVialDiameter: "Ø30",
      maxVialHeight: "50mm",
      fillVolume: "0.5ml - 20ml",
      throughput: "300 vials/min"
    },
    location: "Customer Site A",
    lastServiceDate: "2024-08-15",
    documentation: {
      serviceReports: ["Pneumatic system updated", "Filling needle calibrated"],
      undocumentedChanges: ["Modified guide rails", "Custom bracket added"]
    },
    status: "Active Production",
    installDate: "2022-03-15"
  },
  {
    machineCode: "13766",
    series: "400 series filler",
    currentFormat: "Vial Ø24x45",
    referenceDesigns: ["Transport Assembly TA-24x45", "Filling System FS-24x45"],
    designAge: "18 months",
    status: "Active production",
    bomComponents: [
      "Component_001: Vial Transport Guide",
      "Component_002: Pneumatic Clamp Assembly", 
      "Component_003: Filling Needle Mount"
    ],
    capabilities: {
      filling: true,
      gassing: true,
      stoppering: true,
      maxVialDiameter: "Ø30",
      maxVialHeight: "50mm",
      fillVolume: "1ml - 25ml",
      throughput: "280 vials/min"
    },
    location: "Customer Site B"
  },
  {
    machineCode: "15782",
    series: "600 series syringe filler",
    currentFormat: "Syringe 1ml",
    capabilities: {
      filling: true,
      gassing: false,
      stoppering: true,
      maxSyringeVolume: "5ml",
      throughput: "200 syringes/min"
    },
    location: "Customer Site C",
    status: "Active Production",
    lastServiceDate: "2024-07-20"
  },
  {
    machineCode: "16234",
    series: "800 series bottle filler",
    currentFormat: "Bottle 100ml",
    capabilities: {
      filling: true,
      capping: true,
      labeling: true,
      maxBottleVolume: "500ml",
      throughput: "150 bottles/min"
    },
    location: "Customer Site D",
    status: "Active Production"
  },
  {
    machineCode: "17891",
    series: "Lyophilizer Line",
    currentFormat: "Standard Stopper",
    capabilities: {
      freezeDrying: true,
      stoppering: true,
      vialHandling: true,
      maxVialDiameter: "Ø32",
      batchSize: "10000 vials"
    },
    location: "Customer Site E",
    status: "Active Production"
  }
];

export const componentLibrary = [
  {
    agilePartNumber: "VT-24x45-001",
    description: "Vial Transport Guide Ø24x45",
    category: "Transport Components",
    machineCode: "13766",
    status: "Released",
    designDate: "2023-02-15",
    lastModified: "2024-01-20",
    properties: {
      material: "Stainless Steel 316L",
      finish: "Electropolished",
      criticalDimensions: ["Guide width: 26mm", "Height clearance: 47mm"],
      bomMask: "3D_Document_Mask",
      generalMask: "BOM_Storage_Mask",
      drawingMask: "2D_Document_Mask"
    },
    compatibility: {
      directCopy: false,
      requiredChanges: [
        {
          type: "Critical",
          description: "Adjust guide width for machine base compatibility",
          estimatedHours: 8,
          impact: "High"
        },
        {
          type: "Superficial", 
          description: "Update mounting bracket design",
          estimatedHours: 3,
          impact: "Low"
        }
      ]
    }
  },
  {
    agilePartNumber: "PC-16x35-002",
    description: "Pneumatic Clamp Assembly Ø16x35",
    category: "Clamping Systems",
    machineCode: "14496",
    status: "Released",
    designDate: "2022-11-10",
    lastModified: "2023-08-15",
    properties: {
      material: "Anodized Aluminum",
      finish: "Hard Anodized",
      criticalDimensions: ["Clamp opening: 18mm", "Stroke: 12mm"],
      bomMask: "3D_Document_Mask",
      generalMask: "BOM_Storage_Mask"
    },
    compatibility: {
      directCopy: true,
      requiredChanges: []
    }
  },
  {
    agilePartNumber: "FN-MULTI-003",
    description: "Multi-Format Filling Needle Mount",
    category: "Filling Systems",
    machineCode: "13766",
    status: "Released",
    designDate: "2023-05-20",
    lastModified: "2024-02-10",
    properties: {
      material: "Stainless Steel 316L",
      finish: "Electropolished",
      criticalDimensions: ["Needle diameter: 1.2mm", "Mount height: 85mm"],
      bomMask: "3D_Document_Mask"
    },
    compatibility: {
      directCopy: false,
      requiredChanges: [
        {
          type: "Critical",
          description: "Adjust needle height for new vial format",
          estimatedHours: 6,
          impact: "Medium"
        }
      ]
    }
  },
  {
    agilePartNumber: "SG-2.25ML-004",
    description: "Syringe Guide 2.25ml Format",
    category: "Transport Components", 
    machineCode: "15782",
    status: "In Development",
    designDate: "2024-01-15",
    lastModified: "2024-03-01",
    properties: {
      material: "PEEK Polymer",
      finish: "Machined",
      criticalDimensions: ["Guide width: 12mm", "Length: 95mm"],
      bomMask: "3D_Document_Mask"
    },
    compatibility: {
      directCopy: false,
      requiredChanges: [
        {
          type: "Critical",
          description: "Scale guide dimensions for 2.25ml syringe",
          estimatedHours: 12,
          impact: "High"
        }
      ]
    }
  },
  {
    agilePartNumber: "BC-250ML-005",
    description: "Bottle Clamp 250ml Format",
    category: "Clamping Systems",
    machineCode: "16234", 
    status: "Released",
    designDate: "2023-09-10",
    lastModified: "2024-01-05",
    properties: {
      material: "Stainless Steel 304",
      finish: "Brushed",
      criticalDimensions: ["Clamp diameter: 65mm", "Height: 120mm"],
      bomMask: "3D_Document_Mask"
    },
    compatibility: {
      directCopy: true,
      requiredChanges: []
    }
  },
  {
    agilePartNumber: "ST-FD-006",
    description: "Freeze-Dried Stopper System",
    category: "Stoppering Systems",
    machineCode: "17891",
    status: "Released", 
    designDate: "2023-07-25",
    lastModified: "2023-12-15",
    properties: {
      material: "Stainless Steel 316L",
      finish: "Electropolished",
      criticalDimensions: ["Stopper diameter: 20mm", "Compression force: 50N"],
      bomMask: "3D_Document_Mask"
    },
    compatibility: {
      directCopy: false,
      requiredChanges: [
        {
          type: "Superficial",
          description: "Update stopper material specification",
          estimatedHours: 4,
          impact: "Low"
        }
      ]
    }
  }
];

export const analysisSteps = {
  step1: {
    title: "Machine Line Review",
    duration: 8000, // 8 seconds
    messages: [
      "🔍 Connecting to Oracle Agile PLM database...",
      "📋 Retrieving machine specifications...",
      "🔧 Analyzing current equipment capabilities...",
      "📊 Cross-referencing service reports and documentation..."
    ]
  },
  step2: {
    title: "Similar Lines Search", 
    duration: 7000, // 7 seconds
    messages: [
      "🔄 Searching similar machine series...",
      "📂 Scanning BOMs across related machines...",
      "🎯 Identifying machines with target format designs...",
      "✅ Found reference designs in database"
    ]
  },
  step3: {
    title: "Component Analysis",
    duration: 7000, // 7 seconds
    messages: [
      "🔍 Analyzing existing format part designs...",
      "📐 Comparing critical vs superficial features...",
      "⚖️ Evaluating design age and current standards...",
      "📋 Generating component compatibility matrix..."
    ]
  },
  step4: {
    title: "Inventor Model Comparison",
    duration: 8000, // 8 seconds
    messages: [
      "📥 Loading 3D models into Autodesk Inventor...",
      "🔄 Performing dimensional analysis...",
      "🎯 Identifying necessary design modifications...",
      "📊 Calculating modification complexity scores..."
    ]
  },
  step5: {
    title: "Feasibility Assessment",
    duration: 6000, // 6 seconds
    messages: [
      "⚡ Running feasibility analysis algorithms...",
      "💰 Calculating development cost estimates...",
      "📅 Generating project timeline projections...",
      "✅ Compiling final recommendations..."
    ]
  }
};

export const systemWorkflow = [
  {
    step: "Agile PLM Copy",
    status: "Ready",
    description: "Copy reference assemblies with property updates",
    systems: ["Oracle Agile PLM"],
    icon: "🗄️"
  },
  {
    step: "Inventor Design Changes", 
    status: "Pending",
    description: "Modify 3D models and update 2D drawings",
    systems: ["Autodesk Inventor"],
    icon: "🔧"
  },
  {
    step: "Property Updates",
    status: "Pending", 
    description: "Update BOM, material designations across systems",
    systems: ["Inventor", "Agile PLM"],
    icon: "📝"
  },
  {
    step: "Release Process",
    status: "Pending",
    description: "Release assemblies for manufacturing order", 
    systems: ["Agile PLM"],
    icon: "🚀"
  },
  {
    step: "Order Generation",
    status: "Pending",
    description: "Transfer to Penta, create Remberg tickets, Excel tracking",
    systems: ["ItemCollector", "PSI Penta", "Remberg"],
    icon: "📋"
  }
];
