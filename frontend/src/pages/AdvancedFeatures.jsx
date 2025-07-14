import React, { useState } from 'react';
import styled from 'styled-components';
import AIProductAssistant from '../components/AIProductAssistant';
import VoiceSearch from '../components/VoiceSearch';
import ARProductPreview from '../components/ARProductPreview';
import BlockchainPayment from '../components/BlockchainPayment';
import SocialCommerce from '../components/SocialCommerce';
import AIRecommendationSystem from '../components/AIRecommendationSystem';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 36px;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 18px;
  margin: 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 20px;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const FeatureContent = styled.div`
  min-height: 200px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
  overflow-x: auto;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 20px;
  color: ${props => props.active ? '#667eea' : props.theme.textSecondary};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: #667eea;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

const ComparisonTable = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 40px;
`;

const TableTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 20px 0;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const StatusIcon = styled.span`
  font-size: 18px;
`;

const AdvancedFeatures = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('ai-recommendations');

  const features = [
    {
      id: 'ai-assistant',
      title: 'AI Asystent Produktowy',
      icon: '🤖',
      description: 'Inteligentny chatbot pomagający w wyborze produktów z rekomendacjami i sugestiami.',
      component: <AIProductAssistant theme={theme} />
    },
    {
      id: 'ai-recommendations',
      title: 'AI System Rekomendacji',
      icon: '🧠',
      description: 'Inteligentne rekomendacje produktów oparte na uczeniu maszynowym i preferencjach użytkownika.',
      component: <AIRecommendationSystem theme={theme} />
    },
    {
      id: 'voice-search',
      title: 'Wyszukiwanie Głosowe',
      icon: '🎤',
      description: 'Wyszukuj produkty używając głosu z rozpoznawaniem mowy i syntezą głosu.',
      component: <VoiceSearch theme={theme} onSearch={(query) => console.log('Wyszukiwanie:', query)} />
    },
    {
      id: 'ar-preview',
      title: 'Podgląd AR',
      icon: '👁️',
      description: 'Augmented Reality - umieść produkty w swoim otoczeniu przed zakupem.',
      component: <ARProductPreview theme={theme} />
    },
    {
      id: 'blockchain-payment',
      title: 'Płatności Blockchain',
      icon: '💎',
      description: 'Bezpieczne płatności kryptowalutami z smart kontraktami Ethereum.',
      component: <BlockchainPayment theme={theme} amount={299} />
    },
    {
      id: 'social-commerce',
      title: 'Social Commerce',
      icon: '📱',
      description: 'Integracja z social media, live streaming i funkcje społecznościowe.',
      component: <SocialCommerce theme={theme} />
    }
  ];

  const stats = [
    { number: '6+', label: 'Zaawansowane funkcje' },
    { number: '99.9%', label: 'Dostępność' },
    { number: '<2s', label: 'Czas ładowania' },
    { number: '50k+', label: 'Użytkowników' }
  ];

  const comparisonData = [
    {
      feature: 'AI Chat Assistant',
      ourPortal: '✅',
      amazon: '❌',
      allegro: '❌',
      ebay: '❌'
    },
    {
      feature: 'AI Recommendations',
      ourPortal: '✅',
      amazon: '✅',
      allegro: '❌',
      ebay: '❌'
    },
    {
      feature: 'Voice Search',
      ourPortal: '✅',
      amazon: '✅',
      allegro: '❌',
      ebay: '❌'
    },
    {
      feature: 'AR Preview',
      ourPortal: '✅',
      amazon: '✅',
      allegro: '❌',
      ebay: '❌'
    },
    {
      feature: 'Blockchain Payments',
      ourPortal: '✅',
      amazon: '❌',
      allegro: '❌',
      ebay: '❌'
    },
    {
      feature: 'Social Commerce',
      ourPortal: '✅',
      amazon: '❌',
      allegro: '✅',
      ebay: '❌'
    },
    {
      feature: 'Live Shopping',
      ourPortal: '✅',
      amazon: '❌',
      allegro: '✅',
      ebay: '❌'
    }
  ];

  const currentFeature = features.find(f => f.id === activeTab);

  return (
    <PageContainer>
      <Header>
        <Title theme={theme}>🚀 Zaawansowane Funkcje</Title>
        <Subtitle theme={theme}>
          Portal e-commerce z funkcjami przyszłości - AI, AR, Blockchain i więcej
        </Subtitle>
      </Header>

      <StatsContainer>
        {stats.map((stat, index) => (
          <StatCard key={index} theme={theme}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel theme={theme}>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsContainer>

      <TabContainer theme={theme}>
        {features.map(feature => (
          <Tab
            key={feature.id}
            active={activeTab === feature.id}
            onClick={() => setActiveTab(feature.id)}
            theme={theme}
          >
            {feature.icon} {feature.title}
          </Tab>
        ))}
      </TabContainer>

      {currentFeature && (
        <FeatureCard theme={theme}>
          <FeatureHeader>
            <FeatureIcon>{currentFeature.icon}</FeatureIcon>
            <div>
              <FeatureTitle theme={theme}>{currentFeature.title}</FeatureTitle>
              <FeatureDescription theme={theme}>{currentFeature.description}</FeatureDescription>
            </div>
          </FeatureHeader>
          <FeatureContent>
            {currentFeature.component}
          </FeatureContent>
        </FeatureCard>
      )}

      <ComparisonTable theme={theme}>
        <TableTitle theme={theme}>Porównanie z innymi platformami</TableTitle>
        <Table>
          <thead>
            <tr>
              <Th theme={theme}>Funkcja</Th>
              <Th theme={theme}>Nasz Portal</Th>
              <Th theme={theme}>Amazon</Th>
              <Th theme={theme}>Allegro</Th>
              <Th theme={theme}>eBay</Th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <Td theme={theme}>{row.feature}</Td>
                <Td theme={theme}>
                  <StatusIcon>{row.ourPortal}</StatusIcon>
                </Td>
                <Td theme={theme}>
                  <StatusIcon>{row.amazon}</StatusIcon>
                </Td>
                <Td theme={theme}>
                  <StatusIcon>{row.allegro}</StatusIcon>
                </Td>
                <Td theme={theme}>
                  <StatusIcon>{row.ebay}</StatusIcon>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComparisonTable>

      <FeaturesGrid>
        {features.map(feature => (
          <FeatureCard key={feature.id} theme={theme}>
            <FeatureHeader>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle theme={theme}>{feature.title}</FeatureTitle>
            </FeatureHeader>
            <FeatureDescription theme={theme}>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </PageContainer>
  );
};

export default AdvancedFeatures; 