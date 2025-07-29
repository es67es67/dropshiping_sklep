import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const ErrorDetails = styled.details`
  margin: 1rem 0;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 10px;
`;

const ErrorStack = styled.pre`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generuj unikalny ID błędu
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Wyślij błąd do systemu monitorowania
    this.reportError(error, errorInfo, errorId);
  }

  reportError = async (error, errorInfo, errorId) => {
    try {
      const errorData = {
        id: errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: 'react_error',
        severity: 'high',
        context: {
          componentName: this.getComponentName(errorInfo.componentStack),
          route: window.location.pathname,
          userId: localStorage.getItem('userId') || 'anonymous'
        }
      };

      // Zapisz błąd w localStorage jako backup
      const storedErrors = JSON.parse(localStorage.getItem('errorQueue') || '[]');
      storedErrors.push(errorData);
      localStorage.setItem('errorQueue', JSON.stringify(storedErrors));

      // Próbuj wysłać do API
      if (window.errorReporter) {
        window.errorReporter.reportError(errorData);
      } else {
        // Fallback - wyślij przez fetch
        fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(errorData)
        }).catch(err => {
          console.error('Nie udało się wysłać błędu:', err);
        });
      }
    } catch (reportError) {
      console.error('Błąd podczas raportowania błędu:', reportError);
    }
  };

  getComponentName = (componentStack) => {
    const match = componentStack.match(/in\s+(\w+)/);
    return match ? match[1] : 'Unknown Component';
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportIssue = () => {
    const { error, errorInfo, errorId } = this.state;
    const issueText = `
Błąd ID: ${errorId}
URL: ${window.location.href}
Data: ${new Date().toLocaleString()}

Błąd: ${error?.message}
Stack: ${error?.stack}

Component Stack: ${errorInfo?.componentStack}
    `;
    
    // Skopiuj do schowka
    navigator.clipboard.writeText(issueText).then(() => {
      alert('Szczegóły błędu zostały skopiowane do schowka. Proszę wysłać je do administratora.');
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>🚨 Wystąpił błąd</ErrorTitle>
            <ErrorMessage>
              Przepraszamy, wystąpił nieoczekiwany błąd w aplikacji. 
              Nasz system monitorowania został powiadomiony o tym problemie.
            </ErrorMessage>
            
            <div style={{ marginBottom: '2rem' }}>
              <ActionButton onClick={this.handleReload}>
                🔄 Odśwież stronę
              </ActionButton>
              <ActionButton onClick={this.handleGoHome}>
                🏠 Wróć do strony głównej
              </ActionButton>
              <ActionButton onClick={this.handleReportIssue}>
                📧 Zgłoś problem
              </ActionButton>
            </div>

            <ErrorDetails>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                🔍 Szczegóły techniczne (kliknij aby rozwinąć)
              </summary>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>ID błędu:</strong> {this.state.errorId}</p>
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Data:</strong> {new Date().toLocaleString()}</p>
                {this.state.error && (
                  <ErrorStack>
                    <strong>Błąd:</strong> {this.state.error.message}
                    {'\n\n'}
                    <strong>Stack trace:</strong>
                    {'\n'}{this.state.error.stack}
                  </ErrorStack>
                )}
                {this.state.errorInfo && (
                  <ErrorStack>
                    <strong>Component stack:</strong>
                    {'\n'}{this.state.errorInfo.componentStack}
                  </ErrorStack>
                )}
              </div>
            </ErrorDetails>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 