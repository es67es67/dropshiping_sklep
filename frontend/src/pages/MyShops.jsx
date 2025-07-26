import React from 'react';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
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

const ShopStatus = styled.div`
  background: ${props => props.status === 'open' ? '#10b981' : '#ef4444'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ShopInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ShopName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const ShopDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const ShopDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ShopStats = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ShopActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
    
    &:hover {
      background: ${props => props.theme.primary}20;
      color: ${props => props.theme.primary};
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
`;

export default function MyShops() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyShops();
  }, []);

  const fetchMyShops = async () => {
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
        throw new Error('Nie udało się pobrać Twoich sklepów');
      }

      const data = await response.json();
      setShops(data);
    } catch (err) {
      console.error('Błąd podczas pobierania sklepów:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten sklep? Tej operacji nie można cofnąć.')) {
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

      // Usuń sklep z listy lokalnie
      setShops(shops.filter(shop => shop._id !== shopId));
    } catch (err) {
      console.error('Błąd podczas usuwania sklepu:', err);
      alert('Nie udało się usunąć sklepu: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Container>
              <PageTitle title="Moje sklepy" description="Zarządzaj swoimi sklepami" />
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie Twoich sklepów...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h3>Błąd podczas ładowania sklepów</h3>
          <p>{error}</p>
          <button onClick={fetchMyShops} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Spróbuj ponownie
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Moje sklepy" description="Zarządzaj swoimi sklepami" />
      <Header>
        <Title>Moje sklepy</Title>
        <AddButton to="/shop-create">
          🏪 Dodaj nowy sklep
        </AddButton>
      </Header>

      {shops.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
          <h3>Nie masz jeszcze żadnych sklepów</h3>
          <p>Rozpocznij swoją przygodę z e-commerce i dodaj pierwszy sklep!</p>
          <AddButton to="/shop-create" style={{ display: 'inline-block', marginTop: '1rem' }}>
            🏪 Dodaj pierwszy sklep
          </AddButton>
        </EmptyState>
      ) : (
        <Grid>
          {shops.map(shop => (
            <ShopCard key={shop._id}>
              <ShopHeader>
                <ShopStatus status={shop.isActive ? 'open' : 'closed'}>
                  {shop.isActive ? 'Aktywny' : 'Nieaktywny'}
                </ShopStatus>
                <div style={{ fontSize: '2rem' }}>🏪</div>
              </ShopHeader>
              
              <ShopInfo>
                <ShopName>{shop.name}</ShopName>
                <ShopDescription>{shop.description}</ShopDescription>
                
                <ShopDetails>
                  <span>📍 {shop.address?.city || 'Brak lokalizacji'}</span>
                  <span>⭐ {shop.rating || 'Brak ocen'}</span>
                </ShopDetails>
                
                <ShopStats>
                  <Stat>
                    <StatValue>{shop.stats?.totalProducts || 0}</StatValue>
                    <StatLabel>Produktów</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{shop.stats?.totalViews || 0}</StatValue>
                    <StatLabel>Wyświetleń</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{shop.stats?.totalFollowers || 0}</StatValue>
                    <StatLabel>Obserwujących</StatLabel>
                  </Stat>
                </ShopStats>
                
                <ShopActions>
                  <ActionButton className="primary" to={`/shop/${shop._id}`}>
                    🛒 Przejdź do sklepu
                  </ActionButton>
                  <ActionButton className="secondary" to={`/shop-edit/${shop._id}`}>
                    ✏️ Edytuj
                  </ActionButton>
                  <ActionButton 
                    className="danger" 
                    as="button"
                    onClick={() => handleDeleteShop(shop._id)}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    🗑️ Usuń
                  </ActionButton>
                </ShopActions>
              </ShopInfo>
            </ShopCard>
          ))}
        </Grid>
      )}
    </Container>
  );
} 