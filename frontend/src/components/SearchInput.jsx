import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 25px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${props => props.theme.textSecondary};
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
  }

  ${props => props.isHighlighted && `
    background: ${props.theme.primary}20;
    color: ${props.theme.primary};
    font-weight: 500;
  `}
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const SearchInput = ({ 
  placeholder = "Wyszukaj...", 
  data = [], 
  onSearch, 
  onSelect, 
  searchKey = "name",
  theme,
  minChars = 2,
  maxSuggestions = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filtruj dane na podstawie wyszukiwanego terminu
  const filterData = (term) => {
    if (!term || term.length < minChars) return [];
    
    const filtered = data.filter(item => {
      const searchValue = item[searchKey]?.toLowerCase() || '';
      return searchValue.includes(term.toLowerCase());
    });
    
    return filtered.slice(0, maxSuggestions);
  };

  // Obsługa zmiany w polu wyszukiwania
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= minChars) {
      const filtered = filterData(value);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Wywołaj callback onSearch
    if (onSearch) {
      onSearch(value);
    }
  };

  // Obsługa wyboru sugestii
  const handleSuggestionClick = (item) => {
    setSearchTerm(item[searchKey]);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onSelect) {
      onSelect(item);
    }
  };

  // Obsługa klawiszy
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Obsługa czyszczenia pola
  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    
    if (onSearch) {
      onSearch('');
    }
    
    inputRef.current?.focus();
  };

  // Obsługa kliknięcia poza komponentem
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll do podświetlonej sugestii
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedElement = suggestionsRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <SearchContainer>
      <SearchInputWrapper>
        <SearchIcon theme={theme}>
          <FaSearch />
        </SearchIcon>
        
        <SearchInputField
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          theme={theme}
        />
        
        {searchTerm && (
          <ClearButton onClick={handleClear} theme={theme}>
            <FaTimes />
          </ClearButton>
        )}
      </SearchInputWrapper>

      {showSuggestions && (
        <SuggestionsContainer ref={suggestionsRef} theme={theme}>
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <SuggestionItem
                key={item.id || index}
                onClick={() => handleSuggestionClick(item)}
                isHighlighted={index === highlightedIndex}
                theme={theme}
              >
                {item[searchKey]}
                {item.voivodeship && ` (${item.voivodeship})`}
                {item.population && ` - ${item.population.toLocaleString()} mieszkańców`}
              </SuggestionItem>
            ))
          ) : (
            <NoResults theme={theme}>
              Brak wyników dla "{searchTerm}"
            </NoResults>
          )}
        </SuggestionsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchInput; 