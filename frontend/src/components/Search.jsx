import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const SearchSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
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
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
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
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
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
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
`;

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const ResultsColumn = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const ColumnTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
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
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-1px);
    }
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
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.75rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    border-radius: 8px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  
  span {
    background: ${props => props.theme.border};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    font-size: 0.7rem;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
  font-size: 1.125rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
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

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const SearchStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const StatsText = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.text};
  font-weight: 600;
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

const FilterSelect = styled.select`
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

const SearchHistory = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
`;

const HistoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const HistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const HistoryItem = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
`;

const AdvancedFilters = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 2px solid ${props => props.theme.border};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FilterInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const FilterCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const Suggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: ${props => props.theme.shadow};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SearchBarContainer = styled.div`
  position: relative;
  flex: 1;
`;

export default function Search() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], shops: [] });
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    location: '',
    rating: '',
    inStock: false
  });

  const filters = [
    { id: 'all', label: 'Wszystko', icon: '🔍' },
    { id: 'products', label: 'Produkty', icon: '📦' },
    { id: 'shops', label: 'Sklepy', icon: '🏪' },
    { id: 'electronics', label: 'Elektronika', icon: '💻' },
    { id: 'clothing', label: 'Odzież', icon: '👕' },
    { id: 'books', label: 'Książki', icon: '📚' },
    { id: 'local', label: 'Lokalne', icon: '🏘️' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Trafność' },
    { value: 'price-low', label: 'Cena: od najniższej' },
    { value: 'price-high', label: 'Cena: od najwyższej' },
    { value: 'rating', label: 'Ocena' },
    { value: 'newest', label: 'Najnowsze' },
    { value: 'popular', label: 'Popularność' }
  ];

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const loadSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 10)); // Ostatnie 10 wyszukiwań
  };

  const saveSearchHistory = (term) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [term, ...history.filter(item => item !== term)].slice(0, 20);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory.slice(0, 10));
  };

  const fetchSuggestions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania sugestii:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    saveSearchHistory(searchTerm);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        q: searchTerm,
        filter: activeFilter,
        sort: sortBy,
        ...advancedFilters
      });
      
      const response = await fetch(`${apiUrl}/api/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Błąd podczas wyszukiwania');
        setResults({ products: [], shops: [] });
      }
    } catch (error) {
      console.error('Błąd:', error);
      setResults({ products: [], shops: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    handleSearch();
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [activeFilter, sortBy, advancedFilters]);

  const totalResults = results.products.length + results.shops.length;

  return (
    <Container>
      <Title>🔍 Wyszukiwanie</Title>
      
      <SearchSection>
        <SearchBar>
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Szukaj produktów, sklepów, kategorii..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <Suggestions>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    🔍 {suggestion}
                  </SuggestionItem>
                ))}
              </Suggestions>
            )}
          </SearchBarContainer>
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

        <AdvancedFilters>
          <h4>Filtry zaawansowane</h4>
          <FilterRow>
            <FilterInput
              type="number"
              placeholder="Cena min (zł)"
              value={advancedFilters.minPrice}
              onChange={(e) => handleAdvancedFilterChange('minPrice', e.target.value)}
            />
            <FilterInput
              type="number"
              placeholder="Cena max (zł)"
              value={advancedFilters.maxPrice}
              onChange={(e) => handleAdvancedFilterChange('maxPrice', e.target.value)}
            />
            <FilterInput
              type="text"
              placeholder="Kategoria"
              value={advancedFilters.category}
              onChange={(e) => handleAdvancedFilterChange('category', e.target.value)}
            />
            <FilterInput
              type="text"
              placeholder="Lokalizacja"
              value={advancedFilters.location}
              onChange={(e) => handleAdvancedFilterChange('location', e.target.value)}
            />
          </FilterRow>
          <FilterRow>
            <FilterLabel>
              <FilterCheckbox
                type="checkbox"
                checked={advancedFilters.inStock}
                onChange={(e) => handleAdvancedFilterChange('inStock', e.target.checked)}
              />
              Tylko dostępne
            </FilterLabel>
            <FilterSelect
              value={advancedFilters.rating}
              onChange={(e) => handleAdvancedFilterChange('rating', e.target.value)}
            >
              <option value="">Dowolna ocena</option>
              <option value="4">4+ gwiazdki</option>
              <option value="3">3+ gwiazdki</option>
              <option value="2">2+ gwiazdki</option>
            </FilterSelect>
          </FilterRow>
        </AdvancedFilters>
      </SearchSection>

      {searchHistory.length > 0 && !searchTerm && (
        <SearchHistory>
          <HistoryTitle>Ostatnie wyszukiwania</HistoryTitle>
          <HistoryList>
            {searchHistory.map((term, index) => (
              <HistoryItem
                key={index}
                onClick={() => handleHistoryClick(term)}
              >
                🔍 {term}
              </HistoryItem>
            ))}
          </HistoryList>
        </SearchHistory>
      )}

      {searchTerm && (
        <SearchStats data-testid="search-stats">
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
                  <ResultItem 
                    key={product._id}
                    onClick={() => window.location.href = `/product/${product._id}`}
                  >
                    <ItemIcon>
                      {product.category === 'Elektronika' ? '💻' :
                       product.category === 'Odzież' ? '👕' :
                       product.category === 'Książki' ? '📚' : '📦'}
                    </ItemIcon>
                    <ItemInfo>
                      <ItemName>{product.name}</ItemName>
                      <ItemDescription>{product.description}</ItemDescription>
                      <ItemMeta>
                        <span>{product.category}</span>
                        <span>⭐ {product.rating || 'Brak ocen'}</span>
                        <span>{product.shop?.name || 'Brak sklepu'}</span>
                      </ItemMeta>
                    </ItemInfo>
                    <ItemPrice>{product.price} zł</ItemPrice>
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
                  <ResultItem 
                    key={shop._id}
                    onClick={() => window.location.href = `/shop/${shop._id}`}
                  >
                    <ItemIcon>🏪</ItemIcon>
                    <ItemInfo>
                      <ItemName>{shop.name}</ItemName>
                      <ItemDescription>{shop.description}</ItemDescription>
                      <ItemMeta>
                        <span>{shop.category}</span>
                        <span>⭐ {shop.rating || 'Brak ocen'}</span>
                        <span>{shop.products?.length || 0} produktów</span>
                        <span>{shop.location?.name || 'Brak lokalizacji'}</span>
                      </ItemMeta>
                    </ItemInfo>
                  </ResultItem>
                ))}
              </ResultsList>
            )}
          </ResultsColumn>
        </ResultsSection>
      ) : !searchHistory.length && (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Rozpocznij wyszukiwanie</h3>
          <p>Wprowadź nazwę produktu, sklepu lub kategorię</p>
        </EmptyState>
      )}
    </Container>
  );
} 