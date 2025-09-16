// Extended AI Agent Analysis System
// 5-Phase Manufacturing Engineering AI Assistant (60-90 seconds total)

export const aiAgentPhases = {
  phase1: {
    name: "AI Feasibility Intelligence Agent",
    duration: 18000, // 18 seconds
    icon: "🤖",
    color: "#3b82f6",
    description: "Analyzing manufacturing feasibility and operational constraints",
    messages: [
      "Starting feasibility analysis...",
      "Connecting to manufacturing systems...",
      "Reviewing equipment capabilities...",
      "Analyzing operational constraints...",
      "Checking system configurations...",
      "Scanning service history...",
      "Identifying potential issues...",
      "Compiling feasibility assessment...",
      "Feasibility analysis complete"
    ],
    // Simplified - no complex metrics
  },
  
  phase2: {
    name: "Similarity Search & Precedent Mining Agent",
    duration: 20000, // 20 seconds
    icon: "🔄",
    color: "#10b981",
    description: "Mining design precedents and analyzing geometric patterns",
    messages: [
      "Starting similarity search...",
      "Accessing design database...",
      "Searching manufacturing systems...",
      "Analyzing design patterns...",
      "Finding similar solutions...",
      "Evaluating compatibility...",
      "Ranking design options...",
      "Filtering results...",
      "Search complete - matches found"
    ]
  },
  
  phase3: {
    name: "Design Reference Optimization Agent",
    duration: 16000, // 16 seconds
    icon: "⚡",
    color: "#f59e0b",
    description: "Optimizing design selection and compatibility scoring",
    messages: [
      "Optimizing design selection...",
      "Evaluating design standards...",
      "Checking dimensional compatibility...",
      "Analyzing manufacturing requirements...",
      "Optimizing for your needs...",
      "Computing compatibility scores...",
      "Design optimization complete"
    ]
  },
  
  phase4: {
    name: "Critical Design Comparator Agent",
    duration: 14000, // 14 seconds
    icon: "🔬",
    color: "#8b5cf6",
    description: "Performing dimensional analysis and risk assessment",
    messages: [
      "Comparing design options...",
      "Loading technical specifications...",
      "Analyzing dimensions...",
      "Identifying critical elements...",
      "Assessing integration risks...",
      "Calculating modifications needed...",
      "Generating comparison report...",
      "Design comparison complete"
    ]
  },
  
  phase5: {
    name: "Collaborative Assembly Intelligence",
    duration: 12000, // 12 seconds
    icon: "🤝",
    color: "#ef4444",
    description: "Finalizing integration workflows and cost projections",
    messages: [
      "Finalizing analysis...",
      "Preparing integration plan...",
      "Creating validation checkpoints...",
      "Computing cost estimates...",
      "Generating final report...",
      "Analysis complete"
    ]
  }
};

export const humanValidationPoints = [
  {
    phase: "phase1",
    trigger: "riskFactorsDetected",
    title: "Service Log Risk Assessment",
    description: "AI detected potential compatibility risks in service logs",
    aiRecommendation: "PROCEED with caution - monitor during implementation",
    confidence: 76,
    validationRequired: "Review flagged service log entries for undocumented modifications",
    options: [
      { id: "accept", label: "Accept AI Assessment", action: "continue" },
      { id: "details", label: "Request Detailed Analysis", action: "expand" },
      { id: "override", label: "Override Risk Assessment", action: "override" }
    ],
    riskFactors: [
      "Non-standard guide rail modifications detected",
      "Custom bracket installation not in original specs",
      "Performance degradation noted in recent service reports"
    ]
  },
  {
    phase: "phase3",
    trigger: "designSelectionRequired",
    title: "Design Reference Selection",
    description: "Multiple viable design candidates identified",
    aiRecommendation: "Primary: Design Reference MC-13766 (87% compatibility)",
    alternatives: 2,
    validationRequired: "Confirm design preference and modification approach",
    options: [
      { id: "primary", label: "Accept Primary Design", action: "continue" },
      { id: "alternatives", label: "View Alternative Designs", action: "expand" },
      { id: "custom", label: "Request Custom Analysis", action: "custom" }
    ],
    designCandidates: [
      {
        id: "MC-13766",
        compatibility: 87,
        modifications: "Medium complexity",
        timeline: "3-4 weeks",
        cost: "$22,000 - $28,000"
      },
      {
        id: "MC-15234",
        compatibility: 82,
        modifications: "Low complexity",
        timeline: "2-3 weeks",
        cost: "$18,000 - $24,000"
      },
      {
        id: "MC-16891",
        compatibility: 79,
        modifications: "High complexity",
        timeline: "4-6 weeks",
        cost: "$28,000 - $35,000"
      }
    ]
  }
];

export const realTimeMetrics = {
  dataCounters: {
    recordsProcessed: {
      label: "Records Processed",
      format: "number",
      animationDuration: 2000
    },
    similarityMatches: {
      label: "Similarity Matches",
      format: "number",
      animationDuration: 1500
    },
    analysisPoints: {
      label: "Analysis Points",
      format: "number",
      animationDuration: 1800
    },
    confidenceLevel: {
      label: "AI Confidence",
      format: "percentage",
      animationDuration: 2500
    }
  },
  
  systemConnections: [
    {
      id: "manufacturing_db",
      name: "Manufacturing Database",
      status: "connected",
      icon: "🗄️",
      latency: "12ms"
    },
    {
      id: "design_repository",
      name: "Design Repository",
      status: "connected",
      icon: "📐",
      latency: "8ms"
    },
    {
      id: "service_logs",
      name: "Service Log System",
      status: "connected",
      icon: "📋",
      latency: "15ms"
    },
    {
      id: "cad_analysis",
      name: "CAD Analysis Engine",
      status: "connected",
      icon: "🔧",
      latency: "23ms"
    },
    {
      id: "cost_estimator",
      name: "Cost Estimation AI",
      status: "connected",
      icon: "💰",
      latency: "18ms"
    }
  ]
};

export const processingQueue = {
  phase1: [
    "📊 Analyzing 15,847 compatibility records...",
    "🔍 Cross-referencing 3,429 similar configurations...",
    "⚡ Processing dimensional tolerance matrices...",
    "🎯 Computing optimization parameters...",
    "🚨 Evaluating risk assessment algorithms...",
    "📋 Generating feasibility confidence metrics..."
  ],
  phase2: [
    "🗃️ Scanning 47,332 design precedents...",
    "🔍 Performing geometric pattern recognition...",
    "📐 Analyzing functional similarity matrices...",
    "🎯 Mining cross-domain manufacturing solutions...",
    "🏆 Ranking design candidates by relevance...",
    "📊 Filtering results by manufacturing constraints..."
  ],
  phase3: [
    "📅 Evaluating design compliance history...",
    "📏 Computing geometric compatibility scores...",
    "🏭 Assessing manufacturing tooling requirements...",
    "🎯 Optimizing selection algorithms...",
    "📊 Calculating modification complexity indices..."
  ],
  phase4: [
    "📥 Loading 156 3D model specifications...",
    "📏 Performing dimensional variance analysis...",
    "⚖️ Categorizing critical design elements...",
    "🚨 Computing integration risk matrices...",
    "📊 Generating modification priority rankings..."
  ],
  phase5: [
    "🔧 Preparing integration workflow templates...",
    "📋 Generating validation checkpoint trees...",
    "💰 Computing comprehensive cost projections...",
    "📊 Finalizing analysis confidence metrics...",
    "✅ Preparing human validation interfaces..."
  ]
};

export const getTotalAnalysisDuration = () => {
  return Object.values(aiAgentPhases).reduce((total, phase) => total + phase.duration, 0);
};

export const getPhaseProgress = (currentPhase, elapsedTime) => {
  const phase = aiAgentPhases[currentPhase];
  if (!phase) return 0;
  
  return Math.min((elapsedTime / phase.duration) * 100, 100);
};

export const getOverallProgress = (currentPhaseIndex, currentPhaseProgress) => {
  const phases = Object.values(aiAgentPhases);
  const completedPhases = currentPhaseIndex;
  const totalPhases = phases.length;
  
  const completedWeight = (completedPhases / totalPhases) * 100;
  const currentWeight = (currentPhaseProgress / totalPhases);
  
  return Math.min(completedWeight + currentWeight, 100);
};
