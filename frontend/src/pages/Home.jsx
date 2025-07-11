import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

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

const Title = styled.h1`
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

const Subtitle = styled.p`
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

const WelcomeMessage = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
`;

const UserGreeting = styled.h2`
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

const StatCard = styled.div`
  background: ${props => props.theme.background};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const DashboardCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CardContent = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const [shopsRes, productsRes, usersRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/shops`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let totalShops = 0, totalProducts = 0, totalUsers = 0;

      if (shopsRes.status === 'fulfilled' && shopsRes.value.ok) {
        const shopsData = await shopsRes.value.json();
        totalShops = shopsData.length || 0;
      }

      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const productsData = await productsRes.value.json();
        totalProducts = productsData.length || 0;
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const usersData = await usersRes.value.json();
        totalUsers = usersData.length || 0;
      }

      setStats({
        totalShops,
        totalProducts,
        totalUsers,
        recentActivity: Math.floor(Math.random() * 50) + 10 // Symulacja
      });
    } catch (err) {
      console.error('Błąd pobierania statystyk:', err);
      setError('Nie udało się pobrać statystyk');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HomeContainer>
        <LoadingSpinner>Ładowanie dashboardu...</LoadingSpinner>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Hero>
        <Title>Witaj w Portalu</Title>
        <Subtitle>
          Nowoczesna platforma e-commerce z modułową architekturą
        </Subtitle>
      </Hero>

      {error && <ErrorMessage>{error}</ErrorMessage>}

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
              <StatLabel>Twoje sklepy</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.recentActivity}</StatValue>
              <StatLabel>Aktywność dziś</StatLabel>
            </StatCard>
          </UserStats>
        </WelcomeMessage>
      )}

      <DashboardGrid>
        <DashboardCard>
          <CardHeader>
            <CardIcon>🏪</CardIcon>
            <CardTitle>Zarządzanie sklepami</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <>
                <p>Masz {user.shops?.length || 0} sklepów. Zarządzaj produktami, zamówieniami i klientami.</p>
                <ActionButtons>
                  <ActionButton to="/shop-management">🏪 Moje sklepy</ActionButton>
                  <SecondaryButton to="/shop-create">➕ Dodaj sklep</SecondaryButton>
                </ActionButtons>
              </>
            ) : (
              <>
                <p>Zakładaj sklepy, dodawaj produkty i rozwijaj swój biznes online.</p>
                <ActionButtons>
                  <ActionButton to="/register">📝 Zarejestruj się</ActionButton>
                  <SecondaryButton to="/login">🔑 Zaloguj się</SecondaryButton>
                </ActionButtons>
              </>
            )}
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>📦</CardIcon>
            <CardTitle>Produkty lokalne</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Odkryj produkty z Twojej okolicy. Wspieraj lokalnych sprzedawców i znajdź unikalne towary.</p>
            <ActionButtons>
              <ActionButton to="/local-products">🏘️ Produkty lokalne</ActionButton>
              <SecondaryButton to="/products">🔍 Wszystkie produkty</SecondaryButton>
            </ActionButtons>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardIcon>📍</CardIcon>
            <CardTitle>Lokalizacje</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Przeglądaj województwa, powiaty i gminy. Znajdź sklepy i produkty w swojej okolicy.</p>
            <ActionButtons>
              <ActionButton to="/voivodeships">🏛️ Województwa</ActionButton>
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