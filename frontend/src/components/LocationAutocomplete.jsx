import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';

const LocationAutocomplete = ({
  value = '',
  onChange,
  placeholder = "Wprowadź lokalizację", 
  theme,
  onLocationSelect,
  className,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchType, setSearchType] = useState('all'); // all, miejscowość, gmina, powiat, województwo, ulica
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce dla wyszukiwania
  const debounceTimeout = useRef(null);

  // Typy wyszukiwania
  const searchTypes = [
    { value: 'all', label: '🔍 Wszystko', icon: '🔍' },
    { value: 'miejscowość', label: '🏘️ Miejscowość', icon: '🏘️' },
    { value: 'gmina', label: '🏛️ Gmina', icon: '🏛️' },
    { value: 'powiat', label: '🏢 Powiat', icon: '🏢' },
    { value: 'województwo', label: '🗺️ Województwo', icon: '🗺️' },
    { value: 'ulica', label: '🛣️ Ulica', icon: '🛣️' }
  ];

  // Wyszukiwanie z debounce
  const searchLocations = useCallback(async (query, type = 'all') => {
    if (!query || query.length < 2) {
      setSuggestions([]);
        return;
      }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        type: type,
        limit: '10'
      });

      const response = await fetch(`/api/locations/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.locations || []);
      } else {
        console.error('Błąd wyszukiwania:', data.error);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
      setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback((query, type) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      searchLocations(query, type);
    }, 300); // 300ms debounce
  }, [searchLocations]);

  // Obsługa zmiany inputu
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    setShowSuggestions(true);
    
    // Wywołaj onChange dla parent component
    if (onChange) {
      onChange(e);
    }

    // Wyszukaj z debounce
    debouncedSearch(newValue, searchType);
  };

  // Obsługa klawiszy
  const handleKeyDown = (e) => {
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
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Wybór sugestii
  const handleSuggestionSelect = (suggestion) => {
    const displayValue = formatLocationDisplay(suggestion);
    setInputValue(displayValue);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Wywołaj callback dla parent
    if (onLocationSelect) {
      onLocationSelect(suggestion);
    }
    
    // Wywołaj onChange
    if (onChange) {
      const event = {
        target: {
          name: 'location',
          value: displayValue
        }
      };
      onChange(event);
    }
  };

  // Formatowanie wyświetlania lokalizacji
  const formatLocationDisplay = (location) => {
    switch (location.type) {
      case 'miejscowość':
        return `${location.name}, ${location.gmina?.name || ''}, ${location.powiat?.name || ''}`;
      case 'gmina':
        return `${location.name} (gmina), ${location.powiat?.name || ''}`;
      case 'powiat':
        return `${location.name} (powiat), ${location.wojewodztwo?.name || ''}`;
      case 'województwo':
        return `${location.name} (województwo)`;
      case 'ulica':
        return `${location.name}, ${location.miejscowosc?.name || ''}`;
      default:
        return location.name;
    }
  };

  // Renderowanie sugestii
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <SuggestionsContainer>
        <SearchTypeSelector>
          {searchTypes.map(type => (
            <TypeButton
              key={type.value}
              active={searchType === type.value}
              onClick={() => {
                setSearchType(type.value);
                debouncedSearch(inputValue, type.value);
              }}
            >
              {type.icon} {type.label}
            </TypeButton>
          ))}
        </SearchTypeSelector>
        
        <SuggestionsList ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion._id}
              selected={index === selectedIndex}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <SuggestionIcon>
                <FaMapMarkerAlt />
              </SuggestionIcon>
              <SuggestionContent>
                <SuggestionName>{suggestion.name}</SuggestionName>
                <SuggestionDetails>
                  {suggestion.type} • {suggestion.code}
                  {suggestion.gmina?.name && ` • ${suggestion.gmina.name}`}
                  {suggestion.powiat?.name && ` • ${suggestion.powiat.name}`}
                </SuggestionDetails>
              </SuggestionContent>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      </SuggestionsContainer>
    );
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Container className={className}>
      <InputContainer>
        <InputIcon>
          <FaMapMarkerAlt />
        </InputIcon>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          theme={theme}
        />
        {isLoading && (
          <LoadingIcon>
            <FaSpinner className="spinner" />
          </LoadingIcon>
        )}
        {inputValue && !isLoading && (
          <ClearButton
            onClick={() => {
              setInputValue('');
              setSuggestions([]);
              setShowSuggestions(false);
              if (onChange) {
                onChange({ target: { name: 'location', value: '' } });
              }
            }}
          >
            <FaTimes />
          </ClearButton>
        )}
      </InputContainer>

      {renderSuggestions()}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.theme?.inputBackground || '#ffffff'};
  border: 2px solid ${props => props.theme?.inputBorder || '#e1e5e9'};
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${props => props.theme?.primaryColor || '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.theme?.primaryColor || '#007bff'}20;
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${props => props.theme?.textSecondary || '#6c757d'};
  font-size: 16px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 14px;
  background: transparent;
  color: ${props => props.theme?.textPrimary || '#212529'};
  
  &::placeholder {
    color: ${props => props.theme?.textSecondary || '#6c757d'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${props => props.theme?.primaryColor || '#007bff'};
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${props => props.theme?.textSecondary || '#6c757d'};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme?.dangerColor || '#dc3545'};
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme?.background || '#ffffff'};
  border: 2px solid ${props => props.theme?.inputBorder || '#e1e5e9'};
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
`;

const SearchTypeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme?.borderColor || '#e1e5e9'};
  background: ${props => props.theme?.backgroundSecondary || '#f8f9fa'};
`;

const TypeButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${props => props.active ? props.theme?.primaryColor || '#007bff' : props.theme?.borderColor || '#e1e5e9'};
  background: ${props => props.active ? props.theme?.primaryColor || '#007bff' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : props.theme?.textPrimary || '#212529'};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme?.primaryColor || '#007bff' : props.theme?.backgroundHover || '#f8f9fa'};
  }
`;

const SuggestionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${props => props.selected ? props.theme?.backgroundHover || '#f8f9fa' : 'transparent'};
  
  &:hover {
    background: ${props => props.theme?.backgroundHover || '#f8f9fa'};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme?.borderColor || '#e1e5e9'};
  }
`;

const SuggestionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  color: ${props => props.theme?.primaryColor || '#007bff'};
  font-size: 14px;
`;

const SuggestionContent = styled.div`
  flex: 1;
`;

const SuggestionName = styled.div`
  font-weight: 500;
  color: ${props => props.theme?.textPrimary || '#212529'};
  margin-bottom: 2px;
`;

const SuggestionDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.textSecondary || '#6c757d'};
`;

export default LocationAutocomplete; 