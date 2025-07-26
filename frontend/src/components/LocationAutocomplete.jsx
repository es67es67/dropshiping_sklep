import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import locationService from '../services/locationService';

// Styled components - prosty styl
const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;

  &:focus-within {
    border-color: ${props => props.theme === 'dark' ? '#007bff' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.theme === 'dark' ? 'rgba(0, 123, 255, 0.25)' : 'rgba(0, 123, 255, 0.25)'};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  z-index: 2;
  font-size: 14px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background: ${props => props.theme === 'dark' ? '#444' : '#f0f0f0'};
    color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  }
`;

const AutocompleteInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 36px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};

  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#888' : '#999'};
  }

  &:focus {
    outline: none;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#f0f0f0'};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme === 'dark' ? '#3a3a3a' : '#f8f9fa'};
  }

  &:last-child {
    border-bottom: none;
  }

  &.selected {
    background: ${props => props.theme === 'dark' ? '#007bff20' : '#e3f2fd'};
    border-left: 3px solid #007bff;
  }
`;

const ItemIcon = styled.div`
  color: ${props => props.theme === 'dark' ? '#007bff' : '#007bff'};
  font-size: 16px;
  width: 20px;
  text-align: center;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  margin-bottom: 2px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  line-height: 1.3;
`;

const LoadingSpinner = styled.div`
  padding: 16px;
  text-align: center;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  font-size: 13px;
`;

const ErrorMessage = styled.div`
  padding: 8px 12px;
  margin-top: 4px;
  background: ${props => props.theme === 'dark' ? '#dc354520' : '#f8d7da'};
  color: ${props => props.theme === 'dark' ? '#ff6b6b' : '#721c24'};
  border-radius: 4px;
  font-size: 12px;
  border-left: 3px solid #dc3545;
`;

/**
 * Prosty komponent autouzupełniania dla danych TERYT z bazy MongoDB
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.type - Typ danych ('cities', 'municipalities', 'counties', 'voivodeships', 'streets')
 * @param {string} props.value - Wartość pola
 * @param {Function} props.onChange - Funkcja wywoływana przy zmianie wartości
 * @param {Function} props.onSelect - Funkcja wywoływana przy wyborze elementu
 * @param {string} props.placeholder - Placeholder dla pola
 * @param {string} props.theme - Motyw ('light' lub 'dark')
 * @param {boolean} props.disabled - Czy pole jest wyłączone
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {boolean} props.enableNavigation - Czy włączyć nawigację po wyborze
 * @param {boolean} props.showClearButton - Czy pokazać przycisk czyszczenia
 */
const LocationAutocomplete = ({
  type = 'cities',
  value = '',
  onChange,
  onSelect,
  placeholder = 'Wpisz nazwę...',
  theme = 'light',
  disabled = false,
  className = '',
  enableNavigation = true,
  showClearButton = true
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Wyszukiwanie w bazie MongoDB
  const debouncedSearch = useCallback(
    locationService.createDebouncedSearch(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let searchResults = [];
        switch (type) {
          case 'cities':
            searchResults = await locationService.searchCities(searchQuery, 10);
            break;
          case 'municipalities':
            searchResults = await locationService.searchMunicipalities(searchQuery, 10);
            break;
          case 'counties':
            searchResults = await locationService.searchCounties(searchQuery, 10);
            break;
          case 'voivodeships':
            searchResults = await locationService.searchVoivodeships(searchQuery, 10);
            break;
          case 'streets':
            // Wyszukiwanie ulic w bazie
            searchResults = await locationService.searchStreets(searchQuery, 10);
            break;
          default:
            searchResults = await locationService.searchCities(searchQuery, 10);
        }

        console.log(`🔍 Wyszukiwanie ${type}:`, searchQuery, 'Wyniki:', searchResults);

        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Błąd wyszukiwania:', err);
        setError(err.message);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 200), // Opóźnienie 200ms
    [type]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log(`📝 Input change [${type}]:`, newValue);
    setQuery(newValue);
    onChange?.(newValue);
    
    // Wyszukiwanie po wpisaniu minimum 2 znaków
    if (newValue.length >= 2) {
      console.log(`🚀 Rozpoczynam wyszukiwanie [${type}]:`, newValue);
      debouncedSearch(newValue);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    onChange?.('');
    inputRef.current?.focus();
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    console.log(`✅ Wybrano element [${type}]:`, item);
    setQuery(item.name);
    onChange?.(item.name);
    onSelect?.(item);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Nawigacja między stronami po wyborze
    if (enableNavigation && item.code) {
      setTimeout(() => {
        switch (type) {
          case 'cities':
            navigate(`/cities/${item.code}`, { 
              state: { selectedCity: item } 
            });
            break;
          case 'municipalities':
            navigate(`/municipalities/${item.code}`, { 
              state: { selectedMunicipality: item } 
            });
            break;
          case 'counties':
            navigate(`/counties/${item.code}`, { 
              state: { selectedCounty: item } 
            });
            break;
          case 'voivodeships':
            navigate(`/voivodeships/${item.code}`, { 
              state: { selectedVoivodeship: item } 
            });
            break;
        }
      }, 100);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleItemSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Render item details based on type
  const renderItemDetails = (item) => {
    switch (type) {
      case 'cities':
        return (
          <>
            <ItemName>{item.name}</ItemName>
            <ItemDetails>
              {item.municipalityName}, {item.countyName}, {item.voivodeshipName}
              {item.population && ` • ${item.population.toLocaleString()} mieszkańców`}
            </ItemDetails>
          </>
        );
      case 'municipalities':
        return (
          <>
            <ItemName>{item.name}</ItemName>
            <ItemDetails>
              {item.countyName}, {item.voivodeshipName}
            </ItemDetails>
          </>
        );
      case 'counties':
        return (
          <>
            <ItemName>{item.name}</ItemName>
            <ItemDetails>
              {item.voivodeshipName}
            </ItemDetails>
          </>
        );
      case 'voivodeships':
        return (
          <>
            <ItemName>{item.name}</ItemName>
          </>
        );
      case 'streets':
        return (
          <>
            <ItemName>{item.name}</ItemName>
            <ItemDetails>
              {item.municipalityName}, {item.countyName}, {item.voivodeshipName}
            </ItemDetails>
          </>
        );
      default:
        return <ItemName>{item.name}</ItemName>;
    }
  };

  // Get placeholder based on type
  const getPlaceholder = () => {
    switch (type) {
      case 'cities':
        return 'Wpisz nazwę miasta...';
      case 'municipalities':
        return 'Wpisz nazwę gminy...';
      case 'counties':
        return 'Wpisz nazwę powiatu...';
      case 'voivodeships':
        return 'Wpisz nazwę województwa...';
      case 'streets':
        return 'Wpisz nazwę ulicy...';
      default:
        return placeholder;
    }
  };

  return (
    <AutocompleteContainer className={className}>
      <InputContainer theme={theme}>
        <SearchIcon theme={theme}>
          <FaSearch />
        </SearchIcon>
        <AutocompleteInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={getPlaceholder()}
          theme={theme}
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
        />
        {showClearButton && query && (
          <ClearButton theme={theme} onClick={handleClear}>
            <FaTimes />
          </ClearButton>
        )}
      </InputContainer>

      {isOpen && (
        <Dropdown ref={dropdownRef} theme={theme}>
          {isLoading ? (
            <LoadingSpinner theme={theme}>
              <FaSpinner className="fa-spin" />
              Wyszukiwanie...
            </LoadingSpinner>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <DropdownItem
                key={item.code || index}
                theme={theme}
                onClick={() => handleItemSelect(item)}
                className={index === selectedIndex ? 'selected' : ''}
              >
                <ItemIcon theme={theme}>
                  <FaMapMarkerAlt />
                </ItemIcon>
                <ItemContent>
                  {renderItemDetails(item)}
                </ItemContent>
              </DropdownItem>
            ))
          ) : (
            <NoResults theme={theme}>
              Brak wyników dla "{query}"
            </NoResults>
          )}
        </Dropdown>
      )}

      {error && (
        <ErrorMessage theme={theme}>
          {error}
        </ErrorMessage>
      )}
    </AutocompleteContainer>
  );
};

export default LocationAutocomplete; 