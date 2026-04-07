import React, { useState } from 'react';
import './InputForm.css';

const MODELS = [
  { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B — Best Quality' },
  { value: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B — Fastest' },
  { value: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B — Long Context' },
  { value: 'gemma2-9b-it',            label: 'Gemma 2 9B — Balanced' },
];

const DEPTHS = ['beginner', 'intermediate', 'advanced'];

export default function InputForm({ onGenerate, disabled }) {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('intermediate');
  const [model, setModel] = useState('llama-3.3-70b-versatile');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || disabled) return;
    onGenerate({ topic, depth, model });
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-card">
        <div className="form-row main-row">
          <div className="field field-topic">
            <h4>Topic to Learn</h4>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, React, Quantum Computing…"
              disabled={disabled}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-row options-row">
          <div className="field field-depth">
            <h4 htmlFor="depth">🎯 Level</h4>
            <select
              id="depth"
              value={depth}
              onChange={e => setDepth(e.target.value)}
              disabled={disabled}
            >
              {DEPTHS.map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="field field-model">
            <h4 htmlFor="model">Model</h4>
            <select
              id="model"
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={disabled}
            >
              {MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`generate-btn ${disabled ? 'loading' : ''}`}
          disabled={disabled || !topic.trim()}
        >
          {disabled ? (
            <>
              <span className="spinner" />
              Generating…
            </>
          ) : (
            <>
              Generate
            </>
          )}
        </button>
      </div>
    </form>
  );
}