import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: ${props => props.theme.primary}10;
  border-radius: 8px;
`;

const ShopName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
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
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
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

export default function LocalProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'Wszystkie',
    'Elektronika',
    'Odzież i moda',
    'Książki i multimedia',
    'Sport i rekreacja',
    'Dom i ogród',
    'Motoryzacja',
    'Zdrowie i uroda',
    'Zabawki i gry',
    'Spożywcze',
    'Inne'
  ];

  useEffect(() => {
    fetchLocalProducts();
  }, []);

  const fetchLocalProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      // Pobierz lokalizację użytkownika
      const userLocation = user?.location || 'Warszawa'; // Domyślnie Warszawa
      
      const response = await fetch(`${apiUrl}/api/products/local?location=${encodeURIComponent(userLocation)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Błąd podczas pobierania produktów lokalnych');
        setProducts([]);
      }
    } catch (error) {
      console.error('Błąd:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shop?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || categoryFilter === 'Wszystkie' || 
                           product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const handleProductClick = (product) => {
    window.location.href = `/product/${product._id}`;
  };

  const handleShopClick = (shopId) => {
    window.location.href = `/shop/${shopId}`;
  };

  const handleContactShop = (product) => {
    // Przekieruj do wiadomości z właścicielem sklepu
    window.location.href = `/messages?shop=${product.shop._id}`;
  };

  if (loading) {
    return (
      <Container>
        <Title>Produkty lokalne</Title>
        <LoadingSpinner>Ładowanie produktów lokalnych...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🏘️ Produkty lokalne</Title>
      
      <StatsBar data-testid="stats-bar">
        <StatItem>
          <StatValue>{products.length}</StatValue>
          <StatLabel>Wszystkie produkty</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{filteredProducts.length}</StatValue>
          <StatLabel>Po filtrowaniu</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{new Set(products.map(p => p.shop?._id)).size}</StatValue>
          <StatLabel>Sklepy lokalne</StatLabel>
        </StatItem>
      </StatsBar>

      <Header>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Szukaj produktów, sklepów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </FilterSelect>
        
        <FilterSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Najnowsze</option>
          <option value="oldest">Najstarsze</option>
          <option value="price-low">Cena: od najniższej</option>
          <option value="price-high">Cena: od najwyższej</option>
        </FilterSelect>
      </Header>

      {sortedProducts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏘️</EmptyIcon>
          <h3>Brak produktów lokalnych</h3>
          <p>W Twojej okolicy nie ma jeszcze produktów. Sprawdź później lub rozszerz wyszukiwanie.</p>
        </EmptyState>
      ) : (
        <ProductGrid>
          {sortedProducts.map(product => (
            <ProductCard key={product._id} onClick={() => handleProductClick(product)}>
              {product.images && product.images[0] && (
                <ProductImage src={product.images[0]} alt={product.name} />
              )}
              
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price} zł</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
              
              {product.shop && (
                <ShopInfo onClick={(e) => {
                  e.stopPropagation();
                  handleShopClick(product.shop._id);
                }}>
                  <span>🏪</span>
                  <ShopName>{product.shop.name}</ShopName>
                  <LocationInfo>
                    📍 {product.shop.location?.name || 'Lokalizacja'}
                  </LocationInfo>
                </ShopInfo>
              )}
              
              <ProductActions>
                <ActionButton 
                  className="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactShop(product);
                  }}
                >
                  💬 Skontaktuj się
                </ActionButton>
                <ActionButton 
                  className="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopClick(product.shop._id);
                  }}
                >
                  🏪 Zobacz sklep
                </ActionButton>
              </ProductActions>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </Container>
  );
} 