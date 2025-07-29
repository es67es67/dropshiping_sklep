import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-left: 4px solid ${props => {
    switch (props.severity) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#f1c40f';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  }};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => {
    switch (props.severity) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#f1c40f';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  }};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

const ErrorList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ErrorItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ErrorInfo = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ErrorDetails = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ErrorMeta = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #666;
`;

const SeverityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#f1c40f';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const ErrorDashboard = () => {
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({
    totalErrors: 0,
    criticalErrors: 0,
    highErrors: 0,
    mediumErrors: 0,
    lowErrors: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      
      // Pobierz błędy z localStorage (symulacja)
      const storedErrors = JSON.parse(localStorage.getItem('errorQueue') || '[]');
      setErrors(storedErrors.slice(0, 10)); // Pokaż tylko ostatnie 10
      
      // Oblicz statystyki
      const errorStats = {
        totalErrors: storedErrors.length,
        criticalErrors: storedErrors.filter(e => e.severity === 'critical').length,
        highErrors: storedErrors.filter(e => e.severity === 'high').length,
        mediumErrors: storedErrors.filter(e => e.severity === 'medium').length,
        lowErrors: storedErrors.filter(e => e.severity === 'low').length
      };
      
      setStats(errorStats);
    } catch (error) {
      console.error('Błąd podczas pobierania błędów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchErrors();
  };

  useEffect(() => {
    fetchErrors();
    
    // Odśwież co 30 sekund
    const interval = setInterval(fetchErrors, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('pl-PL');
  };

  const truncateMessage = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <Title>🛡️ Monitorowanie Błędów</Title>
          <RefreshButton onClick={handleRefresh}>Odśwież</RefreshButton>
        </Header>
        <div>Ładowanie...</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>🛡️ Monitorowanie Błędów</Title>
        <RefreshButton onClick={handleRefresh}>Odśwież</RefreshButton>
      </Header>

      <StatsGrid>
        <StatCard severity="critical">
          <StatNumber severity="critical">{stats.criticalErrors}</StatNumber>
          <StatLabel>Błędy Krytyczne</StatLabel>
        </StatCard>
        <StatCard severity="high">
          <StatNumber severity="high">{stats.highErrors}</StatNumber>
          <StatLabel>Błędy Wysokie</StatLabel>
        </StatCard>
        <StatCard severity="medium">
          <StatNumber severity="medium">{stats.mediumErrors}</StatNumber>
          <StatLabel>Błędy Średnie</StatLabel>
        </StatCard>
        <StatCard severity="low">
          <StatNumber severity="low">{stats.lowErrors}</StatNumber>
          <StatLabel>Błędy Niskie</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totalErrors}</StatNumber>
          <StatLabel>Wszystkie Błędy</StatLabel>
        </StatCard>
      </StatsGrid>

      <ErrorList>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
          Ostatnie Błędy ({errors.length})
        </div>
        
        {errors.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <div>Brak błędów do wyświetlenia</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
              System monitorowania jest aktywny i będzie tu wyświetlać błędy
            </div>
          </EmptyState>
        ) : (
          errors.map((error, index) => (
            <ErrorItem key={error.id || index}>
              <ErrorInfo>
                <ErrorMessage>
                  {truncateMessage(error.message)}
                </ErrorMessage>
                <ErrorDetails>
                  {error.type} • {error.url} • {formatTimestamp(error.timestamp)}
                </ErrorDetails>
              </ErrorInfo>
              <ErrorMeta>
                <SeverityBadge severity={error.severity}>
                  {error.severity}
                </SeverityBadge>
              </ErrorMeta>
            </ErrorItem>
          ))
        )}
      </ErrorList>
    </DashboardContainer>
  );
};

export default ErrorDashboard; 