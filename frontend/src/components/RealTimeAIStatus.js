import React, { useState, useEffect } from 'react';
import { realTimeMetrics } from '../data/aiAgentSystem';

const RealTimeAIStatus = ({ 
  currentPhase, 
  phaseProgress, 
  currentMetrics, 
  processingItems, 
  isAnalyzing 
}) => {
  const [animatedMetrics, setAnimatedMetrics] = useState({});
  const [connectionStatuses, setConnectionStatuses] = useState(realTimeMetrics.systemConnections);
  const [dataFlowAnimation, setDataFlowAnimation] = useState(false);

  // Animate metric counters
  useEffect(() => {
    if (!currentMetrics) return;

    Object.entries(currentMetrics).forEach(([key, targetValue]) => {
      const startValue = animatedMetrics[key] || 0;
      const duration = 1500;
      const startTime = Date.now();

      const animateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);

        setAnimatedMetrics(prev => ({
          ...prev,
          [key]: currentValue
        }));

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };

      requestAnimationFrame(animateValue);
    });
  }, [currentMetrics]);

  // Simulate connection status updates
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setConnectionStatuses(prev => prev.map(conn => ({
        ...conn,
        latency: `${Math.floor(Math.random() * 20) + 5}ms`,
        status: Math.random() > 0.95 ? 'connecting' : 'connected'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Data flow animation trigger
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setDataFlowAnimation(true);
        setTimeout(() => setDataFlowAnimation(false), 1000);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const getMetricIcon = (metricKey) => {
    const icons = {
      recordsProcessed: '📊',
      similarityMatches: '🎯',
      analysisPoints: '📈',
      confidenceLevel: '🧠',
      compatibilityScores: '⚖️',
      candidates: '🏆',
      optimizationLevel: '⚡',
      modelsAnalyzed: '🔬',
      criticalElements: '🚨',
      riskAssessment: '⚠️',
      integrationPoints: '🔧',
      costAccuracy: '💰',
      finalConfidence: '✅'
    };
    return icons[metricKey] || '📋';
  };

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatMetricValue = (key, value) => {
    if (key.includes('confidence') || key.includes('level') || key.includes('accuracy')) {
      return `${value}%`;
    }
    return value?.toLocaleString() || '0';
  };

  if (!isAnalyzing) {
    return (
      <div className="ai-status-standby">
        <div className="standby-icon">🤖</div>
        <h3 className="standby-title">AI Agents Ready</h3>
        <p className="standby-description">
          5-phase analysis system prepared for manufacturing intelligence processing
        </p>
      </div>
    );
  }

  return (
    <div className="real-time-ai-status">
      {/* AI Agent Status Header */}
      <div className="ai-status-header">
        <div className="status-indicator active">
          <div className="status-pulse"></div>
        </div>
        <div className="status-info">
          <h3 className="status-title">AI Analysis Active</h3>
          <p className="status-subtitle">
            {currentPhase?.name} • {Math.round(phaseProgress)}% Complete
          </p>
        </div>
        <div className="confidence-display">
          <div className="confidence-circle">
            <svg viewBox="0 0 36 36" className="confidence-svg">
              <path
                className="confidence-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              <path
                className="confidence-progress"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--premium-accent)"
                strokeWidth="2"
                strokeDasharray={`${phaseProgress}, 100`}
              />
            </svg>
            <div className="confidence-text">
              <span className="confidence-value">{Math.round(phaseProgress)}</span>
              <span className="confidence-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="live-metrics-grid">
        {Object.entries(animatedMetrics).map(([key, value]) => (
          <div key={key} className="metric-card live">
            <div className="metric-icon">{getMetricIcon(key)}</div>
            <div className="metric-content">
              <div className="metric-value-large">
                {formatMetricValue(key, value)}
              </div>
              <div className="metric-label-small">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="metric-trend">
                <div className="trend-arrow up">↗</div>
                <span className="trend-text">+{Math.floor(Math.random() * 15) + 5}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Processing Queue Display */}
      <div className="processing-queue-display">
        <div className="queue-header">
          <div className="queue-icon">⚡</div>
          <h4 className="queue-title">Active Processing</h4>
          <div className="queue-count">{processingItems.length} tasks</div>
        </div>
        <div className="queue-items-container">
          {processingItems.map((item, index) => (
            <div key={index} className="queue-item-live">
              <div className="item-spinner">
                <div className="spinner-ring"></div>
              </div>
              <div className="item-content">
                <span className="item-text">{item}</span>
                <div className="item-progress">
                  <div className="progress-bar-mini">
                    <div 
                      className="progress-fill-mini"
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="item-status">
                <span className="status-dot processing"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Connections Network */}
      <div className="system-network-display">
        <div className="network-header">
          <div className="network-icon">🌐</div>
          <h4 className="network-title">System Network</h4>
          <div className="network-status all-connected">All Systems Connected</div>
        </div>
        <div className="network-grid">
          {connectionStatuses.map((system, index) => (
            <div key={index} className="network-node">
              <div className="node-icon">{system.icon}</div>
              <div className="node-info">
                <div className="node-name">{system.name}</div>
                <div className="node-latency">{system.latency}</div>
              </div>
              <div className="node-status">
                <div 
                  className={`status-indicator ${system.status}`}
                  style={{ backgroundColor: getConnectionStatusColor(system.status) }}
                >
                  <div className="status-pulse-small"></div>
                </div>
              </div>
              {dataFlowAnimation && (
                <div className="data-flow-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Confidence Meter */}
      <div className="ai-confidence-meter">
        <div className="confidence-header">
          <div className="confidence-icon">🧠</div>
          <h4 className="confidence-title">AI Confidence Level</h4>
        </div>
        <div className="confidence-bar-container">
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ width: `${phaseProgress}%` }}
            >
              <div className="confidence-glow"></div>
            </div>
          </div>
          <div className="confidence-labels">
            <span className="confidence-label">0%</span>
            <span className="confidence-label">25%</span>
            <span className="confidence-label">50%</span>
            <span className="confidence-label">75%</span>
            <span className="confidence-label">100%</span>
          </div>
        </div>
        <div className="confidence-description">
          Building analysis confidence through multi-agent validation
        </div>
      </div>

      {/* Data Processing Visualization */}
      <div className="data-processing-viz">
        <div className="viz-header">
          <div className="viz-icon">📊</div>
          <h4 className="viz-title">Data Processing Flow</h4>
        </div>
        <div className="processing-flow">
          <div className="flow-stage input">
            <div className="stage-icon">📥</div>
            <div className="stage-label">Input</div>
            <div className="data-stream"></div>
          </div>
          <div className="flow-stage processing">
            <div className="stage-icon">⚙️</div>
            <div className="stage-label">Processing</div>
            <div className="data-stream"></div>
          </div>
          <div className="flow-stage analysis">
            <div className="stage-icon">🔍</div>
            <div className="stage-label">Analysis</div>
            <div className="data-stream"></div>
          </div>
          <div className="flow-stage output">
            <div className="stage-icon">📤</div>
            <div className="stage-label">Output</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAIStatus;
