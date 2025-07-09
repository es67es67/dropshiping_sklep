import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

export default function Home() {
  return (
    <HomeContainer>
      <Hero>
        <Title>Witaj w Portalu</Title>
        <Subtitle>
          Nowoczesna platforma z modułową architekturą
        </Subtitle>
        <button className="btn btn-primary">
          Rozpocznij przygodę
        </button>
      </Hero>

          <FeaturesGrid>
            <FeatureCard>
          <FeatureIcon>🏪</FeatureIcon>
          <FeatureTitle>Sklepy</FeatureTitle>
              <FeatureDescription>
            Zarządzaj swoim sklepem, dodawaj produkty i obsługuj klientów.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
          <FeatureIcon>📍</FeatureIcon>
          <FeatureTitle>Lokalizacje</FeatureTitle>
              <FeatureDescription>
            System lokalizacji oparty na danych TERYT z pełną hierarchią województw, powiatów i gmin.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>Komunikacja</FeatureTitle>
              <FeatureDescription>
            System wiadomości i powiadomień w czasie rzeczywistym.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
          <FeatureIcon>💳</FeatureIcon>
          <FeatureTitle>Płatności</FeatureTitle>
              <FeatureDescription>
            Bezpieczne płatności online z modułowym systemem.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
          <FeatureIcon>🏆</FeatureIcon>
          <FeatureTitle>Gamifikacja</FeatureTitle>
              <FeatureDescription>
            System osiągnięć i odznak dla użytkowników.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI</FeatureTitle>
              <FeatureDescription>
            Integracje z AI dla lepszego doświadczenia użytkownika.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
    </HomeContainer>
  );
} 