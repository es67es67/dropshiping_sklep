import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LocationInfo = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LocationIcon = styled.div`
  font-size: 3rem;
`;

const LocationDetails = styled.div`
  flex: 1;
`;

const LocationName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const LocationType = styled.div`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
`;

const LocationStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
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

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
  margin-top: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

export default function LocationDetails({ location, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    shops: [],
    products: [],
    posts: [],
    users: []
  });

  useEffect(() => {
    if (location) {
      fetchLocationData();
    }
  }, [location]);

  const fetchLocationData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      // Pobierz dane lokalizacji
      const [shopsRes, productsRes, postsRes, usersRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/locations/${location.id}/shops`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/locations/${location.id}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/locations/${location.id}/feed?type=posts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/locations/${location.id}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const newData = { ...data };
      
      if (shopsRes.status === 'fulfilled' && shopsRes.value.ok) {
        const shopsData = await shopsRes.value.json();
        newData.shops = shopsData.shops || [];
      }
      
      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const productsData = await productsRes.value.json();
        newData.products = productsData.products || [];
      }
      
      if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
        const postsData = await postsRes.value.json();
        newData.posts = postsData.feed || [];
      }
      
      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const usersData = await usersRes.value.json();
        newData.users = usersData.users || [];
      }
      
      setData(newData);
    } catch (err) {
      console.error('Błąd pobierania danych lokalizacji:', err);
      setError('Nie udało się pobrać danych lokalizacji');
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'województwo': return '🏛️';
      case 'powiat': return '🏘️';
      case 'gmina': return '🏙️';
      case 'miasto': return '🏙️';
      case 'miejscowość': return '🏘️';
      default: return '📍';
    }
  };

  const renderOverview = () => (
    <div>
      <LocationInfo>
        <LocationHeader>
          <LocationIcon>{getLocationIcon(location.type)}</LocationIcon>
          <LocationDetails>
            <LocationName>{location.name}</LocationName>
            <LocationType>{location.type}</LocationType>
          </LocationDetails>
        </LocationHeader>
        
        <LocationStats>
          <StatCard>
            <StatValue>{data.shops.length}</StatValue>
            <StatLabel>Sklepów</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{data.products.length}</StatValue>
            <StatLabel>Produktów</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{data.users.length}</StatValue>
            <StatLabel>Użytkowników</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{data.posts.length}</StatValue>
            <StatLabel>Postów</StatLabel>
          </StatCard>
        </LocationStats>
      </LocationInfo>

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardIcon>🏪</CardIcon>
            <CardTitle>Sklepy lokalne</CardTitle>
          </CardHeader>
          <CardDescription>
            Odkryj sklepy w tej lokalizacji i znajdź lokalne produkty
          </CardDescription>
          <CardStats>
            <div>
              <StatValue>{data.shops.length}</StatValue>
              <StatLabel>Dostępnych sklepów</StatLabel>
        </div>
          </CardStats>
          <ActionButton to={`/shops?location=${location.id}`}>
            🏪 Zobacz sklepy
          </ActionButton>
        </Card>

        <Card>
          <CardHeader>
            <CardIcon>📦</CardIcon>
            <CardTitle>Produkty lokalne</CardTitle>
          </CardHeader>
          <CardDescription>
            Produkty wytwarzane i sprzedawane lokalnie
          </CardDescription>
          <CardStats>
            <div>
              <StatValue>{data.products.length}</StatValue>
              <StatLabel>Dostępnych produktów</StatLabel>
            </div>
          </CardStats>
          <ActionButton to={`/products?location=${location.id}`}>
            📦 Zobacz produkty
          </ActionButton>
        </Card>

        <Card>
          <CardHeader>
            <CardIcon>💬</CardIcon>
            <CardTitle>Wiadomości lokalne</CardTitle>
          </CardHeader>
          <CardDescription>
            Najnowsze posty i wiadomości z tej lokalizacji
          </CardDescription>
          <CardStats>
            <div>
              <StatValue>{data.posts.length}</StatValue>
              <StatLabel>Nowych postów</StatLabel>
            </div>
          </CardStats>
          <ActionButton to={`/messages?location=${location.id}`}>
            💬 Zobacz wiadomości
          </ActionButton>
        </Card>

        <Card>
          <CardHeader>
            <CardIcon>👥</CardIcon>
            <CardTitle>Społeczność lokalna</CardTitle>
          </CardHeader>
          <CardDescription>
            Użytkownicy z tej lokalizacji
          </CardDescription>
          <CardStats>
            <div>
              <StatValue>{data.users.length}</StatValue>
              <StatLabel>Aktywnych użytkowników</StatLabel>
            </div>
          </CardStats>
          <ActionButton to={`/users?location=${location.id}`}>
            👥 Zobacz użytkowników
          </ActionButton>
        </Card>
      </ContentGrid>
              </div>
  );

  const renderShops = () => (
    <div>
      <ContentGrid>
        {data.shops.length > 0 ? (
          data.shops.map(shop => (
            <Card key={shop._id}>
              <CardHeader>
                <CardIcon>🏪</CardIcon>
                <CardTitle>{shop.name}</CardTitle>
              </CardHeader>
              <CardDescription>{shop.description}</CardDescription>
              <CardStats>
                <div>
                  <StatValue>{shop.stats?.totalProducts || 0}</StatValue>
                  <StatLabel>Produktów</StatLabel>
                </div>
                <div>
                  <StatValue>⭐ {shop.rating || 'Brak'}</StatValue>
                  <StatLabel>Ocena</StatLabel>
                </div>
              </CardStats>
              <ActionButton to={`/shop/${shop._id}`}>
                🛒 Przejdź do sklepu
              </ActionButton>
            </Card>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
            <h3>Brak sklepów w tej lokalizacji</h3>
            <p>Bądź pierwszym, który otworzy sklep w tej lokalizacji!</p>
            <ActionButton to="/shop-create">
              🏪 Dodaj sklep
            </ActionButton>
          </EmptyState>
        )}
      </ContentGrid>
    </div>
  );

  const renderProducts = () => (
    <div>
      <ContentGrid>
        {data.products.length > 0 ? (
          data.products.map(product => (
            <Card key={product._id}>
              <CardHeader>
                <CardIcon>📦</CardIcon>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardDescription>{product.description}</CardDescription>
              <CardStats>
                <div>
                  <StatValue>{product.price} zł</StatValue>
                  <StatLabel>Cena</StatLabel>
                </div>
                <div>
                  <StatValue>{product.shop?.name || 'Nieznany sklep'}</StatValue>
                  <StatLabel>Sklep</StatLabel>
                </div>
              </CardStats>
              <ActionButton to={`/product/${product._id}`}>
                📦 Zobacz produkt
              </ActionButton>
            </Card>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>Brak produktów w tej lokalizacji</h3>
            <p>Dodaj pierwszy lokalny produkt!</p>
            <ActionButton to="/product-create">
              📦 Dodaj produkt
            </ActionButton>
          </EmptyState>
        )}
      </ContentGrid>
                  </div>
  );

  const renderPosts = () => (
    <div>
      <ContentGrid>
        {data.posts.length > 0 ? (
          data.posts.map(post => (
            <Card key={post._id}>
              <CardHeader>
                <CardIcon>💬</CardIcon>
                <CardTitle>{post.author?.username || 'Anonim'}</CardTitle>
              </CardHeader>
              <CardDescription>{post.content}</CardDescription>
              <CardStats>
                <div>
                  <StatValue>{post.likes?.length || 0}</StatValue>
                  <StatLabel>Polubień</StatLabel>
              </div>
                <div>
                  <StatValue>{post.comments?.length || 0}</StatValue>
                  <StatLabel>Komentarzy</StatLabel>
            </div>
              </CardStats>
              <ActionButton to={`/post/${post._id}`}>
                💬 Zobacz post
              </ActionButton>
            </Card>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
            <h3>Brak postów w tej lokalizacji</h3>
            <p>Bądź pierwszym, który napisze post!</p>
            <ActionButton to="/post/create">
              💬 Napisz post
            </ActionButton>
          </EmptyState>
        )}
      </ContentGrid>
    </div>
  );

  if (!location) return null;

  return (
    <Container>
      <Header>
        <Title>📍 {location.name}</Title>
        <CloseButton onClick={onClose}>✕ Zamknij</CloseButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabsContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          📊 Przegląd
        </Tab>
        <Tab 
          active={activeTab === 'shops'} 
          onClick={() => setActiveTab('shops')}
        >
          🏪 Sklepy ({data.shops.length})
        </Tab>
        <Tab 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          📦 Produkty ({data.products.length})
        </Tab>
        <Tab 
          active={activeTab === 'posts'} 
          onClick={() => setActiveTab('posts')}
        >
          💬 Wiadomości ({data.posts.length})
        </Tab>
      </TabsContainer>

      {loading ? (
        <LoadingSpinner>Ładowanie danych lokalizacji...</LoadingSpinner>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'shops' && renderShops()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'posts' && renderPosts()}
        </>
      )}
    </Container>
  );
} 