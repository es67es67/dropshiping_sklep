import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const SearchSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchButton = styled.button`
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

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
  }
`;

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ResultsColumn = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const ColumnTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const ItemIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.primary}20;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
  font-size: 1.125rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const SearchStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
`;

const StatsText = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], shops: [] });

  const filters = [
    { id: 'all', label: 'Wszystko', icon: '🔍' },
    { id: 'products', label: 'Produkty', icon: '📦' },
    { id: 'shops', label: 'Sklepy', icon: '🏪' },
    { id: 'electronics', label: 'Elektronika', icon: '💻' },
    { id: 'clothing', label: 'Odzież', icon: '👕' },
    { id: 'books', label: 'Książki', icon: '📚' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Trafność' },
    { value: 'price-low', label: 'Cena: od najniższej' },
    { value: 'price-high', label: 'Cena: od najwyższej' },
    { value: 'rating', label: 'Ocena' },
    { value: 'newest', label: 'Najnowsze' }
  ];

  // Symulowane dane wyszukiwania
  const mockProducts = [
    {
      id: 1,
      name: 'Laptop Gaming Pro',
      description: 'Wydajny laptop do gier z RTX 4060',
      price: '4999 zł',
      category: 'Elektronika',
      rating: 4.8,
      icon: '💻'
    },
    {
      id: 2,
      name: 'Smartfon Galaxy S24',
      description: 'Najnowszy smartfon Samsung',
      price: '3999 zł',
      category: 'Elektronika',
      rating: 4.9,
      icon: '📱'
    },
    {
      id: 3,
      name: 'Koszulka bawełniana',
      description: 'Wygodna koszulka z bawełny organicznej',
      price: '89 zł',
      category: 'Odzież',
      rating: 4.5,
      icon: '👕'
    }
  ];

  const mockShops = [
    {
      id: 1,
      name: 'TechStore',
      description: 'Sklep z elektroniką i akcesoriami',
      category: 'Elektronika',
      rating: 4.7,
      products: 1250,
      icon: '🏪'
    },
    {
      id: 2,
      name: 'Fashion Boutique',
      description: 'Modna odzież i akcesoria',
      category: 'Odzież',
      rating: 4.6,
      products: 890,
      icon: '👗'
    },
    {
      id: 3,
      name: 'BookWorld',
      description: 'Księgarnia internetowa',
      category: 'Książki',
      rating: 4.8,
      products: 15000,
      icon: '📚'
    }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Symulacja wyszukiwania
    setTimeout(() => {
      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const filteredShops = mockShops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults({
        products: filteredProducts,
        shops: filteredShops
      });
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [activeFilter, sortBy]);

  const totalResults = results.products.length + results.shops.length;

  return (
    <Container>
      <Title>Wyszukiwanie</Title>
      
      <SearchSection>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Szukaj produktów, sklepów, kategorii..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>
            🔍 Szukaj
          </SearchButton>
        </SearchBar>
        
        <FilterSection>
          {filters.map(filter => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.icon} {filter.label}
            </FilterButton>
          ))}
        </FilterSection>
      </SearchSection>

      {searchTerm && (
        <SearchStats>
          <StatsText>
            Znaleziono {totalResults} wyników dla "{searchTerm}"
          </StatsText>
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SortSelect>
        </SearchStats>
      )}

      {loading ? (
        <LoadingState>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Wyszukiwanie...</p>
        </LoadingState>
      ) : searchTerm ? (
        <ResultsSection>
          <ResultsColumn>
            <ColumnTitle>
              📦 Produkty ({results.products.length})
            </ColumnTitle>
            {results.products.length === 0 ? (
              <EmptyState>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <p>Nie znaleziono produktów</p>
              </EmptyState>
            ) : (
              <ResultsList>
                {results.products.map(product => (
                  <ResultItem key={product.id}>
                    <ItemIcon>{product.icon}</ItemIcon>
                    <ItemInfo>
                      <ItemName>{product.name}</ItemName>
                      <ItemDescription>{product.description}</ItemDescription>
                      <ItemMeta>
                        <span>{product.category}</span>
                        <span>⭐ {product.rating}</span>
                      </ItemMeta>
                    </ItemInfo>
                    <ItemPrice>{product.price}</ItemPrice>
                  </ResultItem>
                ))}
              </ResultsList>
            )}
          </ResultsColumn>

          <ResultsColumn>
            <ColumnTitle>
              🏪 Sklepy ({results.shops.length})
            </ColumnTitle>
            {results.shops.length === 0 ? (
              <EmptyState>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
                <p>Nie znaleziono sklepów</p>
              </EmptyState>
            ) : (
              <ResultsList>
                {results.shops.map(shop => (
                  <ResultItem key={shop.id}>
                    <ItemIcon>{shop.icon}</ItemIcon>
                    <ItemInfo>
                      <ItemName>{shop.name}</ItemName>
                      <ItemDescription>{shop.description}</ItemDescription>
                      <ItemMeta>
                        <span>{shop.category}</span>
                        <span>⭐ {shop.rating}</span>
                        <span>{shop.products} produktów</span>
                      </ItemMeta>
                    </ItemInfo>
                  </ResultItem>
                ))}
              </ResultsList>
            )}
          </ResultsColumn>
        </ResultsSection>
      ) : (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Rozpocznij wyszukiwanie</h3>
          <p>Wprowadź nazwę produktu, sklepu lub kategorię</p>
        </EmptyState>
      )}
    </Container>
  );
} 