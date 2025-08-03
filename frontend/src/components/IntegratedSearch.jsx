import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaUsers, FaStore, FaBuilding, FaTimes, FaFilter } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 600px;
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 0.5rem;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 25px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:focus-within {
    border-color: ${props => props.theme.primary || '#007bff'};
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
    box-shadow: 0 0 0 3px ${props => props.theme.primary || '#007bff'}20;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.text || '#333'};
  font-size: 0.9rem;
  padding: 0.5rem;
  outline: none;
  
  &::placeholder {
    color: ${props => props.theme.text || '#333'}80;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: ${props => props.theme.text || '#333'}60;
  margin-right: 0.5rem;
  font-size: 0.9rem;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text || '#333'}60;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.text || '#333'}20;
    color: ${props => props.theme.text || '#333'};
  }
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text || '#333'}60;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.text || '#333'}20;
    color: ${props => props.theme.text || '#333'};
  }
  
  &.active {
    color: ${props => props.theme.primary || '#007bff'};
    background: ${props => props.theme.primary || '#007bff'}20;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.surface || 'white'};
  border: 1px solid ${props => props.theme.border || '#ccc'};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background || '#f5f5f5'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border || '#ccc'};
    border-radius: 3px;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.border || '#ccc'};
  background: ${props => props.theme.background || '#f5f5f5'};
  border-radius: 12px 12px 0 0;
`;

const FilterOption = styled.button`
  background: ${props => props.$active ? (props.theme.primary || '#007bff') : 'transparent'};
  color: ${props => props.$active ? 'white' : (props.theme.text || '#333')};
  border: 1px solid ${props => props.$active ? (props.theme.primary || '#007bff') : (props.theme.border || '#ccc')};
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background: ${props => props.$active ? (props.theme.primary || '#007bff') : (props.theme.border || '#ccc')};
  }
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border || '#eee'};
  
  &:hover {
    background: ${props => props.theme.primary || '#007bff'}10;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#007bff'}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: ${props => props.theme.primary || '#007bff'};
  font-size: 1.2rem;
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text || '#333'};
  margin-bottom: 0.25rem;
`;

const ResultSubtitle = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text || '#333'}70;
`;

const ResultType = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.primary || '#007bff'};
  background: ${props => props.theme.primary || '#007bff'}10;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
`;

const NoResults = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.text || '#333'}60;
  font-style: italic;
`;

const LoadingSpinner = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.text || '#333'}60;
`;

const SearchCategory = styled.div`
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.background || '#f5f5f5'};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.text || '#333'}80;
  border-bottom: 1px solid ${props => props.theme.border || '#ccc'};
`;

export default function IntegratedSearch({ theme }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch();
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery, activeFilter]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    if (debouncedQuery.length < 2) return;

    setLoading(true);
    try {
      const searchPromises = [];
      
      // Search users
      if (activeFilter === 'all' || activeFilter === 'users') {
        searchPromises.push(
          fetch(`/api/users/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
            .then(res => res.json())
            .then(data => data.users ? data.users.map(user => ({ ...user, type: 'user' })) : [])
            .catch(() => [])
        );
      }
      
      // Search shops (if API exists)
      if (activeFilter === 'all' || activeFilter === 'shops') {
        searchPromises.push(
          fetch(`/api/shops/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
            .then(res => res.json())
            .then(data => data.shops ? data.shops.map(shop => ({ ...shop, type: 'shop' })) : [])
            .catch(() => [])
        );
      }
      
      // Search companies (if API exists)
      if (activeFilter === 'all' || activeFilter === 'companies') {
        searchPromises.push(
          fetch(`/api/company-profiles/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
            .then(res => res.json())
            .then(data => data.companies ? data.companies.map(company => ({ ...company, type: 'company' })) : [])
            .catch(() => [])
        );
      }

      const searchResults = await Promise.all(searchPromises);
      const allResults = searchResults.flat();
      
      // Sort results by relevance (users first, then shops, then companies)
      const sortedResults = allResults.sort((a, b) => {
        const typeOrder = { user: 1, shop: 2, company: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
      });

      console.log('🔍 Wyniki wyszukiwania:', sortedResults);
      setResults(sortedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setQuery('');
    
    switch (result.type) {
      case 'user':
        navigate(`/users/${result._id}`);
        break;
      case 'shop':
        navigate(`/shop/${result._id}`);
        break;
      case 'company':
        navigate(`/company-profiles/${result._id}`);
        break;
      default:
        break;
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'user':
        return <FaUsers />;
      case 'shop':
        return <FaStore />;
      case 'company':
        return <FaBuilding />;
      default:
        return <FaSearch />;
    }
  };

  const getResultTitle = (result) => {
    switch (result.type) {
      case 'user':
        return `${result.firstName} ${result.lastName}`;
      case 'shop':
        return result.name || result.shopName;
      case 'company':
        return result.name || result.companyName;
      default:
        return result.name;
    }
  };

  const getResultSubtitle = (result) => {
    switch (result.type) {
      case 'user':
        return `@${result.username}`;
      case 'shop':
        return result.location || result.address;
      case 'company':
        return result.industry || result.description;
      default:
        return '';
    }
  };

  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'user':
        return 'Użytkownik';
      case 'shop':
        return 'Sklep';
      case 'company':
        return 'Firma';
      default:
        return 'Inne';
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {});
  
  console.log('📊 Wyniki pogrupowane:', groupedResults);
  console.log('🔢 Liczba wyników:', results.length);
  console.log('👁️ Show results:', showResults);

  return (
    <SearchContainer ref={searchRef}>
      <SearchInputContainer theme={theme}>
        <SearchIcon theme={theme} />
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Szukaj użytkowników, sklepów, firm..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <ClearButton theme={theme} onClick={handleClear}>
            <FaTimes />
          </ClearButton>
        )}
        <FilterButton 
          theme={theme} 
          className={activeFilter !== 'all' ? 'active' : ''}
          onClick={() => setActiveFilter(activeFilter === 'all' ? 'users' : 'all')}
        >
          <FaFilter />
        </FilterButton>
      </SearchInputContainer>

      {showResults && (
        <SearchResults theme={theme}>
          {activeFilter !== 'all' && (
            <FilterOptions theme={theme}>
              <FilterOption 
                theme={theme} 
                $active={activeFilter === 'users'}
                onClick={() => setActiveFilter('users')}
              >
                <FaUsers /> Użytkownicy
              </FilterOption>
              <FilterOption 
                theme={theme} 
                $active={activeFilter === 'shops'}
                onClick={() => setActiveFilter('shops')}
              >
                <FaStore /> Sklepy
              </FilterOption>
              <FilterOption 
                theme={theme} 
                $active={activeFilter === 'companies'}
                onClick={() => setActiveFilter('companies')}
              >
                <FaBuilding /> Firmy
              </FilterOption>
            </FilterOptions>
          )}

          {loading ? (
            <LoadingSpinner theme={theme}>
              🔍 Wyszukiwanie...
            </LoadingSpinner>
          ) : results.length > 0 ? (
            Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type}>
                <SearchCategory theme={theme}>
                  {getResultTypeLabel(type)} ({typeResults.length})
                </SearchCategory>
                {typeResults.map((result) => (
                  <SearchResultItem 
                    key={`${result.type}-${result._id}`} 
                    theme={theme}
                    onClick={() => handleResultClick(result)}
                  >
                    <ResultIcon theme={theme}>
                      {getResultIcon(result.type)}
                    </ResultIcon>
                    <ResultContent>
                      <ResultTitle theme={theme}>
                        {getResultTitle(result)}
                      </ResultTitle>
                      <ResultSubtitle theme={theme}>
                        {getResultSubtitle(result)}
                      </ResultSubtitle>
                    </ResultContent>
                    <ResultType theme={theme}>
                      {getResultTypeLabel(result.type)}
                    </ResultType>
                  </SearchResultItem>
                ))}
              </div>
            ))
          ) : debouncedQuery.length >= 2 ? (
            <NoResults theme={theme}>
              Nie znaleziono wyników dla "{debouncedQuery}"
            </NoResults>
          ) : null}
        </SearchResults>
      )}
    </SearchContainer>
  );
} 