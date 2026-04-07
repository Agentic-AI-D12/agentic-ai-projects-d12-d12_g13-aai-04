import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatTranscript.css';

export default function ChatTranscript({ messages }) {
  return (
    <div className="chat-transcript">
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.role}`}>
          <div className="chat-message-role">
            {message.role === 'user' ? 'You' : 'AI'}
          </div>
          <div className="chat-message-bubble">
            {message.role === 'assistant' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
