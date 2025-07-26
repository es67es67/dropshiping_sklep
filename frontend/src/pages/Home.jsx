import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
  
  @media (max-width: 768px) {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const WelcomeMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
`;

const UserGreeting = styled.h2.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.background};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const DashboardCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.primary};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: transparent;
  color: ${props => props.theme.primary};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: 2px solid ${props => props.theme.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
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

const FeatureTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const FeatureDescription = styled.p.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <HomeContainer>
      <PageTitle title="Strona główna" description="Nowoczesna platforma e-commerce z modułową architekturą" />
      <Hero>
        <Title>Witaj w Portalu</Title>
        <Subtitle>
          Nowoczesna platforma e-commerce z modułową architekturą
        </Subtitle>
      </Hero>

      {isAuthenticated && user && (
        <WelcomeMessage>
          <UserGreeting>
            Witaj, {user.username || user.firstName || 'Użytkowniku'}! 👋
          </UserGreeting>
          <UserStats>
            <StatCard>
              <StatValue>{user.level || 1}</StatValue>
              <StatLabel>Poziom</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.experience || 0}</StatValue>
              <StatLabel>Doświadczenie</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.shops?.length || 0}</StatValue>
              <StatLabel>Sklepy</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.products?.length || 0}</StatValue>
              <StatLabel>Produkty</StatLabel>
            </StatCard>
          </UserStats>
        </WelcomeMessage>
      )}

      <DashboardGrid>
        <DashboardCard>
          <CardHeader>
            <CardIcon>🏪</CardIcon>
            <CardTitle>Sklepy i Produkty</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Zarządzaj swoim sklepem, dodawaj produkty i obsługuj klientów w jednym miejscu.</p>
            <ActionButtons>
              <ActionButton to="/shops">🏪 Przeglądaj sklepy</ActionButton>
              <SecondaryButton to="/products">📦 Produkty</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>📍</CardIcon>
            <CardTitle>Lokalizacje</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System lokalizacji oparty na danych TERYT z pełną hierarchią województw, powiatów i gmin.</p>
            <ActionButtons>
              <ActionButton to="/location-map">🗺️ Mapa</ActionButton>
              <SecondaryButton to="/location-analytics">📊 Analityka</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>💬</CardIcon>
            <CardTitle>Komunikacja</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System wiadomości i powiadomień w czasie rzeczywistym. Bądź na bieżąco z aktywnością.</p>
            <ActionButtons>
              <ActionButton to="/messages">💬 Wiadomości</ActionButton>
              <SecondaryButton to="/notifications">🔔 Powiadomienia</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>🏆</CardIcon>
            <CardTitle>Gamifikacja</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System osiągnięć, odznak i poziomów. Rozwijaj się i zdobywaj nagrody za aktywność.</p>
            <ActionButtons>
              <ActionButton to="/gamification">🏆 Osiągnięcia</ActionButton>
              <SecondaryButton to="/profile">👤 Profil</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>⚙️</CardIcon>
            <CardTitle>Ustawienia</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dostosuj wygląd aplikacji, zarządzaj kontem i ustawieniami prywatności.</p>
            <ActionButtons>
              <ActionButton to="/settings">⚙️ Ustawienia</ActionButton>
              <SecondaryButton to="/layout-customization">🎨 Wygląd</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>
      </DashboardGrid>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>🏪</FeatureIcon>
          <FeatureTitle>Sklepy</FeatureTitle>
          <FeatureDescription>
            Zarządzaj swoim sklepem, dodawaj produkty i obsługuj klientów w jednym miejscu.
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
            System wiadomości i powiadomień w czasie rzeczywistym z zaawansowanymi opcjami.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>💳</FeatureIcon>
          <FeatureTitle>Płatności</FeatureTitle>
          <FeatureDescription>
            Bezpieczne płatności online z modułowym systemem obsługującym różne metody płatności.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🏆</FeatureIcon>
          <FeatureTitle>Gamifikacja</FeatureTitle>
          <FeatureDescription>
            System osiągnięć, odznak i poziomów dla użytkowników. Motywuj do aktywności.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI & Automatyzacja</FeatureTitle>
          <FeatureDescription>
            Integracje z AI dla lepszego doświadczenia użytkownika i automatyzacji procesów.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </HomeContainer>
  );
} 