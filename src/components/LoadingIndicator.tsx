import React from 'react';
import './LoadingIndicator.css';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'dots' | 'bar';
  color?: string;
  overlay?: boolean;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingIndicator({
  size = 'medium',
  type = 'spinner',
  color = '#3b82f6',
  overlay = false,
  message,
  fullScreen = false
}: LoadingIndicatorProps) {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`dots-loader dots-loader--${size}`}>
            <div style={{ backgroundColor: color }}></div>
            <div style={{ backgroundColor: color }}></div>
            <div style={{ backgroundColor: color }}></div>
          </div>
        );
      case 'bar':
        return (
          <div className={`bar-loader bar-loader--${size}`}>
            <div 
              className="bar-loader__fill" 
              style={{ backgroundColor: color }}
            ></div>
          </div>
        );
      case 'spinner':
      default:
        return (
          <div 
            className={`spinner spinner--${size}`}
            style={{ borderTopColor: color }}
          ></div>
        );
    }
  };

  const content = (
    <div 
      className={`loading-indicator ${overlay ? 'loading-indicator--overlay' : ''} ${fullScreen ? 'loading-indicator--fullscreen' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-indicator__content">
        {renderLoader()}
        {message && <p className="loading-indicator__message">{message}</p>}
      </div>
    </div>
  );

  return content;
}
