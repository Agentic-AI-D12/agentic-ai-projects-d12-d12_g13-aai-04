import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './StudyGuide.css';

export default function StudyGuide({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('rendered');

  const downloadMd = () => {
    const content = `# Study Guide: ${result.topic}\n\n*Level: ${result.depth} | Multi-Agent Education System*\n\n---\n\n${result.final_output}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.topic.replace(/\s+/g, '_')}_study_guide.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="study-guide">
      <div className="sg-header">
        <div className="sg-meta">
          <h2 className="sg-title">{result.topic}</h2>
          <span className="sg-level">{result.depth}</span>
        </div>
        <div className="sg-actions">
          <button className="btn-download" onClick={downloadMd}>⬇ Download .md</button>
          <button className="btn-new" onClick={onReset}>+ New Guide</button>
        </div>
      </div>

      <div className="sg-tabs">
        <button
          className={`sg-tab ${activeTab === 'rendered' ? 'active' : ''}`}
          onClick={() => setActiveTab('rendered')}
        >
          📖 Study Guide
        </button>
        <button
          className={`sg-tab ${activeTab === 'markdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('markdown')}
        >
          📝 Markdown
        </button>
      </div>

      <div className="sg-content">
        {activeTab === 'rendered' && (
          <div className="sg-rendered">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.final_output}
            </ReactMarkdown>
          </div>
        )}
        {activeTab === 'markdown' && (
          <pre className="sg-code">{result.final_output}</pre>
        )}
      </div>
    </div>
  );
}