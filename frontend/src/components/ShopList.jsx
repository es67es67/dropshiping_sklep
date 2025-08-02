
import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdvertisementManager from './AdvertisementManager';

// 🟡 SHARED COMPONENT: ShopList
// Zależności: AuthContext, React Router, /api/shops endpoints
// Wpływ: lista wszystkich sklepów
// Jeśli się zepsuje: strona /shops nie działa
// Używane w: App.jsx (route /shops)
// API: /api/shops (publiczny), /api/shops/user (wymaga autoryzacji)

const Container = styled.div`
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
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ShopCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ShopHeader = styled.div`
  height: 120px;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  position: relative;
  
  @media (max-width: 768px) {
    height: 100px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    height: 80px;
    font-size: 2rem;
  }
`;

const ShopStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.status === 'open' ? '#10B981' : '#EF4444'};
  color: white;
  
  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const ShopInfo = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ShopName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ShopDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ShopDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem;
  }
`;

const ShopLocation = styled.div`
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ShopRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.accent};
  font-weight: 600;
`;

const ShopStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const Stat = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const ShopActions = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
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
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

export default function ShopList() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [showAllShops, setShowAllShops] = useState(true); // Domyślnie true - wszystkie sklepy (publiczny endpoint)

  // 🔧 BEZPIECZNA ZMIANA: Domyślnie pokazujemy wszystkie sklepy zamiast sklepów użytkownika
  // Powód: /api/shops jest publiczny, /api/shops/user wymaga autoryzacji
  // Wpływ: Strona /shops będzie działać bez logowania, ale użytkownik może przełączyć na swoje sklepy

  const fetchShops = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // DEBUG: Sprawdź czy użytkownik jest zalogowany
      console.log('[DEBUG] Użytkownik z AuthContext:', user);
      console.log('[DEBUG] Token z localStorage:', token);
      console.log('[DEBUG] isAuthenticated:', isAuthenticated);
      
      // Wybierz endpoint w zależności od filtra
      const endpoint = showAllShops ? '/api/shops' : '/api/shops/user';
      
      console.log('[DEBUG] Fetchuję sklepy z endpointu:', `${apiUrl}${endpoint}`);
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[DEBUG] Status odpowiedzi:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('[DEBUG] Błąd odpowiedzi:', errorText);
        
        // Sprawdź czy to błąd wygasłego tokenu
        if (response.status === 401 && errorText.includes('Token wygasł')) {
          console.log('[DEBUG] Token wygasł - przekierowuję do logowania');
          logout(); // Wyczyść dane użytkownika
          navigate('/login'); // Przekieruj do logowania
          return;
        }
        
        throw new Error(`Nie udało się pobrać sklepów: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[DEBUG] Odpowiedź JSON:', data);
      
      // Obsługa nowego formatu odpowiedzi z backendu
      const shopsArray = data.shops || data; // Jeśli data.shops istnieje, użyj tego, w przeciwnym razie użyj data
      setShops(shopsArray);
    } catch (err) {
      console.error('[DEBUG] Błąd podczas pobierania sklepów:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [showAllShops]);

  // Dodaj odświeżanie przy powrocie na stronę
  useEffect(() => {
    const handleFocus = () => {
      fetchShops();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredShops = shops.filter(shop => {
    // Sprawdź czy shop jest obiektem
    if (!shop || typeof shop !== 'object') return false;
    
    const matchesSearch = (shop.name && typeof shop.name === 'string' && shop.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (shop.description && typeof shop.description === 'string' && shop.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'all' || (shop.categories && Array.isArray(shop.categories) && shop.categories.some(cat => typeof cat === 'string' && cat === category));
    const matchesStatus = status === 'all' || (Boolean(shop.isActive) ? 'open' : 'closed') === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <Container>
        <PageTitle title="Sklepy" description="Przeglądaj sklepy" />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie sklepów...</p>
        </div>
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
          <button onClick={fetchShops} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Spróbuj ponownie
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Sklepy" description="Przeglądaj sklepy" />
      <div style={{background: 'yellow', color: 'red', fontSize: '2rem', textAlign: 'center', padding: '1rem', marginBottom: '2rem'}}>
        TEST: ShopList.jsx renderuje się! Liczba sklepów: {Array.isArray(shops) ? shops.length : 'BŁĄD: shops nie jest tablicą'}
      </div>
      <Header>
        <Title>Sklepy</Title>
        <AddButton to="/shop-create">
          🏪 Dodaj sklep
        </AddButton>
      </Header>

      {/* Przycisk testowy */}
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <button
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => alert('Testowy komunikat działa!')}
        >
          Pokaż testowy komunikat
        </button>
      </div>

      <Filters>
        <FilterInput
          type="text"
          placeholder="Szukaj sklepów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Wszystkie kategorie</option>
          <option value="Elektronika">Elektronika</option>
          <option value="Odzież i moda">Odzież i moda</option>
          <option value="Książki i multimedia">Książki i multimedia</option>
          <option value="Sport i rekreacja">Sport i rekreacja</option>
          <option value="Dom i ogród">Dom i ogród</option>
          <option value="Motoryzacja">Motoryzacja</option>
          <option value="Zdrowie i uroda">Zdrowie i uroda</option>
          <option value="Zabawki i gry">Zabawki i gry</option>
          <option value="Spożywcze">Spożywcze</option>
          <option value="Inne">Inne</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Wszystkie statusy</option>
          <option value="open">Otwarte</option>
          <option value="closed">Zamknięte</option>
        </Select>
        <button 
          onClick={() => setShowAllShops(!showAllShops)}
          style={{
            padding: '0.5rem 1rem',
            background: showAllShops ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showAllShops ? '🔒 Moje sklepy' : '🔓 Wszystkie sklepy'}
        </button>
      </Filters>

      {/* Komponent reklamowy dla strony sklepów */}
      <AdvertisementManager location="shops" showAds={true} />

      {filteredShops.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
          <h3>Nie znaleziono sklepów</h3>
          <p>Spróbuj zmienić kryteria wyszukiwania lub dodaj pierwszy sklep</p>
          <AddButton to="/shop-create" style={{ display: 'inline-block', marginTop: '1rem' }}>
            🏪 Dodaj pierwszy sklep
          </AddButton>
        </EmptyState>
      ) : (
        <Grid>
          {filteredShops.map((shop, index) => (
            <ShopCard key={typeof shop._id === 'string' ? shop._id : typeof shop.id === 'string' ? shop.id : `shop-${index}`}>
              <ShopHeader>
                <ShopStatus status={Boolean(shop.isActive) ? 'open' : 'closed'}>
                  {Boolean(shop.isActive) ? 'Otwarte' : 'Zamknięte'}
                </ShopStatus>
                <div style={{ fontSize: '2rem' }}>🏪</div>
              </ShopHeader>
              <ShopInfo>
                <ShopName>{typeof shop.name === 'string' ? shop.name : 'Brak nazwy'}</ShopName>
                <ShopDescription>{typeof shop.description === 'string' ? shop.description : 'Brak opisu'}</ShopDescription>
                
                <ShopDetails>
                  <ShopLocation>
                    📍 {typeof shop.location?.name === 'string' ? shop.location.name : 
                        typeof shop.address?.city === 'string' ? shop.address.city : 'Brak lokalizacji'}
                  </ShopLocation>
                  <ShopRating>
                    ⭐ {typeof shop.rating === 'number' ? shop.rating : 'Brak ocen'}
                  </ShopRating>
                </ShopDetails>
                
                <ShopStats>
                  <Stat>
                    <StatValue>{typeof shop.stats?.totalProducts === 'number' ? shop.stats.totalProducts : 0}</StatValue>
                    <StatLabel>Produktów</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{typeof shop.stats?.totalOrders === 'number' ? shop.stats.totalOrders : 0}</StatValue>
                    <StatLabel>Zamówień</StatLabel>
                  </Stat>
                </ShopStats>
                
                <ShopActions>
                  <ActionButton className="primary" as={Link} to={`/shop/${typeof shop._id === 'string' ? shop._id : typeof shop.id === 'string' ? shop.id : 'unknown'}`}>
                    🛒 Przejdź do sklepu
                  </ActionButton>
                  <ActionButton className="secondary" as={Link} to={`/shop/${typeof shop._id === 'string' ? shop._id : typeof shop.id === 'string' ? shop.id : 'unknown'}`}>
                    👁️ Szczegóły
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