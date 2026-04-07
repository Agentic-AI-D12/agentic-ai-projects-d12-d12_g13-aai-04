import React from 'react';
import './AgentPipeline.css';

function AgentCard({ icon, name, desc, status, color }) {
  return (
    <div className={`agent-card status-${status}`} style={{ '--ac': color }}>
      <div className="ac-header">
        <div className="ac-icon">{icon}</div>
        <div className="ac-info">
          <div className="ac-name">{name}</div>
          <div className="ac-desc">{desc}</div>
        </div>
        <div className="ac-status">
          {status === 'idle'    && <span className="dot idle" />}
          {status === 'running' && <span className="dot running"><span className="ripple" /></span>}
          {status === 'done'    && <span className="checkmark">✓</span>}
        </div>
      </div>
      {status === 'running' && <div className="ac-progress"><div className="ac-bar" /></div>}
    </div>
  );
}

export default function AgentPipeline({ status, phase }) {
  return (
    <h2></h2>
  );
}