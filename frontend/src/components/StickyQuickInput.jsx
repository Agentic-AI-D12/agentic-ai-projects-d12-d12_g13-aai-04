import React, { useState } from 'react';
import './StickyQuickInput.css';

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_DEPTH = 'intermediate';

export default function StickyQuickInput({ onGenerate, disabled }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || disabled) return;

    onGenerate({ topic, depth: DEFAULT_DEPTH, model: DEFAULT_MODEL, clearHistory: true });
    setTopic('');
  };

  return (
    <form className="sticky-quick-input" onSubmit={handleSubmit}>
      <div className="sticky-card">
        <h4 htmlFor="sticky-topic">Topic to learn</h4>
        <div className="sticky-row">
          <input
            id="sticky-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ask another question..."
            disabled={disabled}
            autoComplete="off"
          />
          <button type="submit" disabled={disabled || !topic.trim()}>
            Generate
          </button>
        </div>
      </div>
    </form>
  );
}
