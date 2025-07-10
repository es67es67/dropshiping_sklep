import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

const AddButton = styled.button`
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
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Symulowane dane sklepów
  const mockShops = [
    {
      id: 1,
      name: 'TechStore Pro',
      description: 'Sklep z elektroniką i akcesoriami komputerowymi',
      category: 'electronics',
      status: 'open',
      location: 'Warszawa, Śródmieście',
      rating: 4.8,
      products: 156,
      orders: 1247,
      image: '💻'
    },
    {
      id: 2,
      name: 'Fashion Boutique',
      description: 'Ekskluzywna odzież damska i męska',
      category: 'clothing',
      status: 'open',
      location: 'Kraków, Stare Miasto',
      rating: 4.6,
      products: 89,
      orders: 892,
      image: '👗'
    },
    {
      id: 3,
      name: 'BookWorld',
      description: 'Księgarnia z szerokim wyborem książek',
      category: 'books',
      status: 'closed',
      location: 'Wrocław, Rynek',
      rating: 4.9,
      products: 234,
      orders: 567,
      image: '📚'
    },
    {
      id: 4,
      name: 'SportZone',
      description: 'Sprzęt sportowy i odzież treningowa',
      category: 'sports',
      status: 'open',
      location: 'Poznań, Centrum',
      rating: 4.7,
      products: 178,
      orders: 1034,
      image: '⚽'
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setShops(mockShops);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || shop.category === category;
    const matchesStatus = status === 'all' || shop.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie sklepów...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Sklepy</Title>
        <AddButton>
          🏪 Dodaj sklep
        </AddButton>
      </Header>

      <Filters>
        <FilterInput
          type="text"
          placeholder="Szukaj sklepów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Wszystkie kategorie</option>
          <option value="electronics">Elektronika</option>
          <option value="clothing">Ubrania</option>
          <option value="books">Książki</option>
          <option value="sports">Sport</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Wszystkie statusy</option>
          <option value="open">Otwarte</option>
          <option value="closed">Zamknięte</option>
        </Select>
      </Filters>

      {filteredShops.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
          <h3>Nie znaleziono sklepów</h3>
          <p>Spróbuj zmienić kryteria wyszukiwania</p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredShops.map(shop => (
            <ShopCard key={shop.id}>
              <ShopHeader>
                <ShopStatus status={shop.status}>
                  {shop.status === 'open' ? 'Otwarte' : 'Zamknięte'}
                </ShopStatus>
                {shop.image}
              </ShopHeader>
              <ShopInfo>
                <ShopName>{shop.name}</ShopName>
                <ShopDescription>{shop.description}</ShopDescription>
                
                <ShopDetails>
                  <ShopLocation>
                    📍 {shop.location}
                  </ShopLocation>
                  <ShopRating>
                    ⭐ {shop.rating}
                  </ShopRating>
                </ShopDetails>
                
                <ShopStats>
                  <Stat>
                    <StatValue>{shop.products}</StatValue>
                    <StatLabel>Produktów</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{shop.orders}</StatValue>
                    <StatLabel>Zamówień</StatLabel>
                  </Stat>
                </ShopStats>
                
                <ShopActions>
                  <ActionButton className="primary" as={Link} to={`/shop/${shop.id}`}>
                    🛒 Przejdź do sklepu
                  </ActionButton>
                  <ActionButton className="secondary" as={Link} to={`/shop/${shop.id}`}>
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