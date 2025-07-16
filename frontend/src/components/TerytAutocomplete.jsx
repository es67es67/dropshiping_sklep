import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiMapPin, FiSearch, FiX } from 'react-icons/fi';

const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: ${props => props.theme.textSecondary};
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
  
  &.selected {
    background: ${props => props.theme.primary}20;
  }
`;

const SuggestionMain = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const SuggestionSecondary = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const TerytTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const TerytTag = styled.span`
  background: ${props => props.theme.secondary}20;
  color: ${props => props.theme.secondary};
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  
  .spinner {
    border: 2px solid ${props => props.theme.border};
    border-top: 2px solid ${props => props.theme.primary};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const SelectedAddress = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.primary}10;
  border: 1px solid ${props => props.theme.primary}30;
  border-radius: 8px;
`;

const SelectedAddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  h4 {
    margin: 0;
    color: ${props => props.theme.primary};
    font-size: 1rem;
  }
`;

const TerytAutocomplete = ({ 
  onAddressSelect, 
  placeholder = "Wpisz adres...", 
  showSelected = true,
  initialValue = ""
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState('');
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length >= 3) {
      // Debounce search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        searchAddresses(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const searchAddresses = async (searchQuery) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/geocoding/autocomplete?query=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setError('Błąd podczas wyszukiwania adresów');
      }
    } catch (err) {
      console.error('Błąd autouzupełniania:', err);
      setError('Błąd połączenia');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedAddress(null);
    
    if (onAddressSelect) {
      onAddressSelect(null);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.description);
    setSelectedAddress(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onAddressSelect) {
      onAddressSelect(suggestion);
    }
  };

  const clearInput = () => {
    setQuery('');
    setSelectedAddress(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onAddressSelect) {
      onAddressSelect(null);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const renderSuggestion = (suggestion, index) => {
    const isSelected = index === selectedIndex;
    
    return (
      <SuggestionItem
        key={suggestion.placeId || index}
        className={isSelected ? 'selected' : ''}
        onClick={() => selectSuggestion(suggestion)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        <SuggestionMain>
          <FiMapPin style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
          {suggestion.description}
        </SuggestionMain>
        
        {suggestion.teryt && (
          <TerytTags>
            {suggestion.teryt.tercCode && (
              <TerytTag>TERC: {suggestion.teryt.tercCode}</TerytTag>
            )}
            {suggestion.teryt.simcCode && (
              <TerytTag>SIMC: {suggestion.teryt.simcCode}</TerytTag>
            )}
            {suggestion.teryt.ulicCode && (
              <TerytTag>ULIC: {suggestion.teryt.ulicCode}</TerytTag>
            )}
          </TerytTags>
        )}
      </SuggestionItem>
    );
  };

  return (
    <AutocompleteContainer>
      <InputWrapper>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        
        <SearchInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
        />
        
        {query && (
          <ClearButton onClick={clearInput}>
            <FiX />
          </ClearButton>
        )}
      </InputWrapper>

      {showSuggestions && (
        <SuggestionsList ref={suggestionsRef}>
          {loading ? (
            <LoadingSpinner>
              <div className="spinner"></div>
            </LoadingSpinner>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => 
              renderSuggestion(suggestion, index)
            )
          ) : (
            <NoResults>
              Brak wyników dla "{query}"
            </NoResults>
          )}
        </SuggestionsList>
      )}

      {showSelected && selectedAddress && (
        <SelectedAddress>
          <SelectedAddressHeader>
            <h4>Wybrany adres:</h4>
            <ClearButton onClick={() => setSelectedAddress(null)}>
              <FiX />
            </ClearButton>
          </SelectedAddressHeader>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>{selectedAddress.description}</strong>
          </div>
          
          {selectedAddress.teryt && (
            <TerytTags>
              {selectedAddress.teryt.tercCode && (
                <TerytTag>TERC: {selectedAddress.teryt.tercCode}</TerytTag>
              )}
              {selectedAddress.teryt.simcCode && (
                <TerytTag>SIMC: {selectedAddress.teryt.simcCode}</TerytTag>
              )}
              {selectedAddress.teryt.ulicCode && (
                <TerytTag>ULIC: {selectedAddress.teryt.ulicCode}</TerytTag>
              )}
              {selectedAddress.teryt.fullCode && (
                <TerytTag>Pełny: {selectedAddress.teryt.fullCode}</TerytTag>
              )}
            </TerytTags>
          )}
        </SelectedAddress>
      )}

      {error && (
        <div style={{ 
          color: '#c53030', 
          fontSize: '0.85rem', 
          marginTop: '0.5rem' 
        }}>
          {error}
        </div>
      )}
    </AutocompleteContainer>
  );
};

export default TerytAutocomplete; 