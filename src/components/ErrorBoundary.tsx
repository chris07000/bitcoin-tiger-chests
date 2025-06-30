'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Don't crash on common API errors
    if (error.message?.includes('fetch') || 
        error.message?.includes('API') ||
        error.message?.includes('Network')) {
      // Just log these, don't crash
      console.warn('Network/API error caught and handled:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallback || (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🔧 Something went wrong</h2>
            <p>The application encountered an error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="refresh-button"
            >
              Refresh Page
            </button>
            <details style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
              <summary>Error Details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          </div>
          
          <style jsx>{`
            .error-boundary {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
              padding: 2rem;
              background: #0a0c1d;
              color: white;
            }
            
            .error-content {
              text-align: center;
              max-width: 500px;
              background: rgba(26, 26, 27, 0.8);
              padding: 2rem;
              border-radius: 12px;
              border: 1px solid rgba(255, 107, 0, 0.3);
            }
            
            .error-content h2 {
              color: #FF6B00;
              margin-bottom: 1rem;
            }
            
            .error-content p {
              margin-bottom: 1.5rem;
              line-height: 1.5;
            }
            
            .refresh-button {
              background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s ease;
            }
            
            .refresh-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
} 