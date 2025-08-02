import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: ${props => props.theme.shadow};
`;

const AnalyticsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetricCard = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const ChartContainer = styled.div`
  margin-top: 1rem;
  height: 200px;
  background: ${props => props.theme.background};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 0.5rem;
`;

const ChartBar = styled.div`
  background: ${props => props.color || props.theme.primary};
  width: 40px;
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
`;

const ConversionRate = styled.div`
  background: linear-gradient(135deg, #00D4AA, #007AFF);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
`;

const ConversionValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ConversionLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const AdvertisementAnalytics = ({ 
  timeRange = '7d',
  showCharts = true 
}) => {
  const [analytics, setAnalytics] = useState({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    cpc: 0,
    roas: 0
  });

  const [chartData, setChartData] = useState([]);

  // Symulacja danych analitycznych
  useEffect(() => {
    // W rzeczywistej aplikacji te dane pochodziłyby z API
    const mockData = {
      impressions: 15420,
      clicks: 1234,
      conversions: 89,
      revenue: 4560,
      ctr: 8.0,
      conversionRate: 7.2,
      cpc: 2.45,
      roas: 3.7
    };

    setAnalytics(mockData);

    // Dane do wykresu
    const mockChartData = [
      { day: 'Pon', impressions: 2200, clicks: 180, conversions: 12 },
      { day: 'Wt', impressions: 2100, clicks: 175, conversions: 11 },
      { day: 'Śr', impressions: 2400, clicks: 200, conversions: 15 },
      { day: 'Czw', impressions: 2300, clicks: 185, conversions: 13 },
      { day: 'Pt', impressions: 2500, clicks: 210, conversions: 16 },
      { day: 'Sob', impressions: 2000, clicks: 160, conversions: 10 },
      { day: 'Ndz', impressions: 1920, clicks: 124, conversions: 12 }
    ];

    setChartData(mockChartData);
  }, [timeRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key]));
  };

  const renderChart = () => {
    if (!showCharts || chartData.length === 0) return null;

    const maxImpressions = getMaxValue(chartData, 'impressions');
    const maxClicks = getMaxValue(chartData, 'clicks');
    const maxConversions = getMaxValue(chartData, 'conversions');

    return (
      <ChartContainer>
        {chartData.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
              <ChartBar 
                height={(item.impressions / maxImpressions) * 100}
                color="#00D4AA"
                title={`Impresje: ${formatNumber(item.impressions)}`}
              />
              <ChartBar 
                height={(item.clicks / maxClicks) * 100}
                color="#007AFF"
                title={`Kliknięcia: ${formatNumber(item.clicks)}`}
              />
              <ChartBar 
                height={(item.conversions / maxConversions) * 100}
                color="#FF6B35"
                title={`Konwersje: ${item.conversions}`}
              />
            </div>
            <ChartLabel>{item.day}</ChartLabel>
          </div>
        ))}
      </ChartContainer>
    );
  };

  return (
    <AnalyticsContainer>
      <AnalyticsTitle>📊 Analityka Reklam</AnalyticsTitle>
      
      <MetricsGrid>
        <MetricCard>
          <MetricValue>{formatNumber(analytics.impressions)}</MetricValue>
          <MetricLabel>Impresje</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatNumber(analytics.clicks)}</MetricValue>
          <MetricLabel>Kliknięcia</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{analytics.conversions}</MetricValue>
          <MetricLabel>Konwersje</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatCurrency(analytics.revenue)}</MetricValue>
          <MetricLabel>Przychód</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>{analytics.ctr}%</MetricValue>
          <MetricLabel>CTR</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{analytics.conversionRate}%</MetricValue>
          <MetricLabel>Konwersja</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatCurrency(analytics.cpc)}</MetricValue>
          <MetricLabel>CPC</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{analytics.roas}x</MetricValue>
          <MetricLabel>ROAS</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      {renderChart()}

      <ConversionRate>
        <ConversionValue>{analytics.conversionRate}%</ConversionValue>
        <ConversionLabel>Współczynnik Konwersji</ConversionLabel>
      </ConversionRate>
    </AnalyticsContainer>
  );
};

export default AdvertisementAnalytics; 