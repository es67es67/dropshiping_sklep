import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const AddButton = styled(Link)`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.$active ? props.theme.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.border};
  }
`;

const ShopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShopCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ShopName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ShopStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.status === 'active' ? props.theme.success : props.theme.warning};
  color: white;
`;

const ShopInfo = styled.div`
  margin-bottom: 1rem;
`;

const ShopDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ShopStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ShopStat = styled.div`
  text-align: center;
`;

const ShopStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const ShopStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ShopActions = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  &.danger {
    background: ${props => props.theme.error};
    color: white;
    
    &:hover {
      background: ${props => props.theme.error}dd;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.error}40;
`;

export default function ShopManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    totalProducts: 0,
    totalSales: 0,
    totalViews: 0,
    totalOrders: 0
  });

  useEffect(() => {
    fetchUserShops();
  }, []);

  const fetchUserShops = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać sklepów');
      }

      const data = await response.json();
      setShops(data);
      
      // Oblicz statystyki
      const totalProducts = data.reduce((sum, shop) => sum + (shop.stats?.totalProducts || 0), 0);
      const totalSales = data.reduce((sum, shop) => sum + (shop.stats?.totalSales || 0), 0);
      const totalViews = data.reduce((sum, shop) => sum + (shop.stats?.totalViews || 0), 0);
      const activeShops = data.filter(shop => shop.isActive).length;
      
      setStats({
        totalShops: data.length,
        activeShops,
        totalProducts,
        totalSales,
        totalViews,
        totalOrders: data.reduce((sum, shop) => sum + (shop.stats?.totalOrders || 0), 0)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten sklep? Ta operacja jest nieodwracalna.')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć sklepu');
      }

      // Odśwież listę sklepów
      fetchUserShops();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard>
          <StatIcon>🏪</StatIcon>
          <StatValue>{stats.totalShops}</StatValue>
          <StatLabel>Wszystkie sklepy</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>✅</StatIcon>
          <StatValue>{stats.activeShops}</StatValue>
          <StatLabel>Aktywne sklepy</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>📦</StatIcon>
          <StatValue>{stats.totalProducts}</StatValue>
          <StatLabel>Produktów</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>💰</StatIcon>
          <StatValue>{stats.totalSales.toLocaleString()} zł</StatValue>
          <StatLabel>Całkowita sprzedaż</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>👁️</StatIcon>
          <StatValue>{stats.totalViews.toLocaleString()}</StatValue>
          <StatLabel>Wyświetlenia</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>📋</StatIcon>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatLabel>Zamówienia</StatLabel>
        </StatCard>
      </StatsGrid>

      <ShopsGrid>
        {shops.map(shop => (
          <ShopCard key={shop._id}>
            <ShopHeader>
              <ShopName>{shop.name}</ShopName>
              <ShopStatus status={shop.isActive ? 'active' : 'inactive'}>
                {shop.isActive ? 'Aktywny' : 'Nieaktywny'}
              </ShopStatus>
            </ShopHeader>
            
            <ShopInfo>
              <ShopDescription>{shop.description}</ShopDescription>
              
              <ShopStats>
                <ShopStat>
                  <ShopStatValue>{shop.stats?.totalProducts || 0}</ShopStatValue>
                  <ShopStatLabel>Produktów</ShopStatLabel>
                </ShopStat>
                <ShopStat>
                  <ShopStatValue>{shop.stats?.totalViews || 0}</ShopStatValue>
                  <ShopStatLabel>Wyświetleń</ShopStatLabel>
                </ShopStat>
              </ShopStats>
            </ShopInfo>
            
            <ShopActions>
              <ActionButton 
                className="primary" 
                as={Link} 
                to={`/shop/${shop._id}`}
              >
                👁️ Podgląd
              </ActionButton>
              <ActionButton 
                className="secondary" 
                as={Link} 
                to={`/shop/${shop._id}/edit`}
              >
                ✏️ Edytuj
              </ActionButton>
              <ActionButton 
                className="danger"
                onClick={() => handleDeleteShop(shop._id)}
              >
                🗑️ Usuń
              </ActionButton>
            </ShopActions>
          </ShopCard>
        ))}
      </ShopsGrid>
    </>
  );

  const renderProducts = () => (
    <div>
      <h2>Zarządzanie produktami</h2>
      <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2>Zamówienia</h2>
      <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <h2>Analityka</h2>
      <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
    </div>
  );

  if (loading) {
    return (
      <Container>        <PageTitle title="Zarządzanie sklepami" description="Zarządzaj swoimi sklepami" />
        <LoadingState>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie panelu zarządzania...</p>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Zarządzanie sklepami" description="Zarządzaj swoimi sklepami" />
      <Header>
        <Title>Zarządzanie sklepami</Title>
        <AddButton to="/shop-create">🏪 Dodaj nowy sklep</AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabsContainer>
        <Tab 
                      $active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          📊 Przegląd
        </Tab>
        <Tab 
                      $active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          📦 Produkty
        </Tab>
        <Tab 
                      $active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')}
        >
          📋 Zamówienia
        </Tab>
        <Tab 
                      $active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analityka
        </Tab>
      </TabsContainer>

      {shops.length === 0 && activeTab === 'overview' ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
          <h3>Nie masz jeszcze żadnych sklepów</h3>
          <p>Utwórz swój pierwszy sklep, aby rozpocząć sprzedaż</p>
          <AddButton to="/shop-create" style={{ display: 'inline-block', marginTop: '1rem' }}>
            🏪 Utwórz pierwszy sklep
          </AddButton>
        </EmptyState>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'analytics' && renderAnalytics()}
        </>
      )}
    </Container>
  );
} 