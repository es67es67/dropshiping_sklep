import React from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import ShopProducts from '../components/ShopProducts';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ShopTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const ShopTab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.isActive ? props.theme.primary : props.theme.surface};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  border: 2px solid ${props => props.isActive ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.isActive ? props.theme.primary : props.theme.primary}20;
    transform: translateY(-1px);
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

export default function MyProducts() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

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

      if (response.ok) {
        const data = await response.json();
        setShops(data);
        
        if (data.length > 0) {
          setSelectedShop(data[0]);
        }
      } else {
        console.error('Błąd podczas pobierania sklepów użytkownika');
        setShops([]);
      }
    } catch (error) {
      console.error('Błąd:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  const handleAddShop = () => {
    window.location.href = '/shop-create';
  };

  if (loading) {
    return (
      <Container>
              <PageTitle title="Moje produkty" description="Zarządzaj swoimi produktami" />
        <Title>Moje produkty</Title>
        <LoadingSpinner>Ładowanie sklepów...</LoadingSpinner>
      </Container>
    );
  }

  if (shops.length === 0) {
    return (
      <Container>
        <Title>📦 Moje produkty</Title>
        
        <EmptyState>
          <EmptyIcon>🏪</EmptyIcon>
          <h3>Nie masz jeszcze żadnych sklepów</h3>
          <p>Aby zarządzać produktami, najpierw utwórz sklep.</p>
          <Button onClick={handleAddShop}>
            ➕ Utwórz pierwszy sklep
          </Button>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Moje produkty" description="Zarządzaj swoimi produktami" />
      <Title>📦 Moje produkty</Title>
      
      <Header>
        <h2>Zarządzaj produktami w swoich sklepach</h2>
        <Button onClick={handleAddShop}>
          ➕ Dodaj nowy sklep
        </Button>
      </Header>

      <StatsBar data-testid="stats-bar">
        <StatItem>
          <StatValue>{shops.length}</StatValue>
          <StatLabel>Moje sklepy</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{totalProducts}</StatValue>
          <StatLabel>Wszystkie produkty</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{selectedShop?.stats?.totalViews || 0}</StatValue>
          <StatLabel>Wyświetlenia</StatLabel>
        </StatItem>
      </StatsBar>

      <ShopTabs>
        {shops.map(shop => (
          <ShopTab
            key={shop._id}
            data-testid="shop-tab"
            isActive={selectedShop?._id === shop._id}
            onClick={() => handleShopSelect(shop)}
          >
            🏪 {shop.name} ({shop.stats?.totalProducts || 0})
          </ShopTab>
        ))}
      </ShopTabs>

      {selectedShop && (
        <div>
          <h3>Produkty w sklepie: {selectedShop.name}</h3>
          <ShopProducts shopId={selectedShop._id} />
        </div>
      )}
    </Container>
  );
} 