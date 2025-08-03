import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import locationService from '../services/locationService';

// Styled components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const KeyboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const LetterButton = styled.button`
  padding: 1rem 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid ${props => props.theme.primary};
  background: ${props => props.$active ? props.theme.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ResultsTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.2rem;
`;

const ResultsCount = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const ClearButton = styled.button`
  background: ${props => props.theme.error};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.error}dd;
  }
`;

const CitiesList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.primary}10;
  }
`;

const CityIcon = styled.div`
  color: ${props => props.theme.primary};
  margin-right: 0.75rem;
  font-size: 1.1rem;
`;

const CityInfo = styled.div`
  flex: 1;
`;

const CityName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const CityDetails = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
`;

const AlphabeticalCitySelector = ({ theme }) => {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Polskie litery alfabetu
  const alphabet = [
    'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł',
    'M', 'N', 'Ń', 'O', 'Ó', 'P', 'R', 'S', 'Ś', 'T', 'U', 'W', 'Y', 'Z', 'Ź', 'Ż'
  ];

  // Wyszukiwanie miejscowości zaczynających się na daną literę
  const searchCitiesByLetter = async (letter) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedLetter(letter);

      console.log(`🔍 Wyszukiwanie miejscowości zaczynających się na literę: ${letter}`);

      // Użyj endpointu wyszukiwania z prefiksem litery
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/search?q=${letter}&type=miejscowość&limit=100`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych');
      }

      const data = await response.json();
      
      // Filtruj tylko miejscowości zaczynające się na wybraną literę
      const filteredCities = data.locations?.filter(city => 
        city.name && city.name.toUpperCase().startsWith(letter.toUpperCase())
      ) || [];

      // Sortuj alfabetycznie
      const sortedCities = filteredCities.sort((a, b) => 
        a.name.localeCompare(b.name, 'pl')
      );

      console.log(`✅ Znaleziono ${sortedCities.length} miejscowości na literę ${letter}`);
      setCities(sortedCities);

    } catch (err) {
      console.error('Błąd wyszukiwania miejscowości:', err);
      setError('Nie udało się wyszukać miejscowości. Spróbuj ponownie.');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Obsługa kliknięcia przycisku z literą
  const handleLetterClick = (letter) => {
    searchCitiesByLetter(letter);
  };

  // Obsługa wyboru miejscowości
  const handleCitySelect = (city) => {
    console.log('🎯 Wybrano miejscowość:', city);
    
    // Nawiguj do strony miasta
    navigate(`/cities/${city.code || city._id}`, {
      state: { selectedCity: city }
    });
  };

  // Czyszczenie wyników
  const handleClear = () => {
    setSelectedLetter(null);
    setCities([]);
    setError(null);
  };

  return (
    <Container>
      <Title theme={theme}>Wyszukiwanie miejscowości alfabetycznie</Title>
      <Subtitle theme={theme}>
        Kliknij literę, aby zobaczyć wszystkie miejscowości zaczynające się na tę literę
      </Subtitle>

      {/* Klawiatura alfabetyczna */}
      <KeyboardContainer>
        {alphabet.map((letter) => (
          <LetterButton
            key={letter}
            theme={theme}
                            $active={selectedLetter === letter}
            onClick={() => handleLetterClick(letter)}
            disabled={loading}
          >
            {letter}
          </LetterButton>
        ))}
      </KeyboardContainer>

      {/* Wyniki wyszukiwania */}
      {selectedLetter && (
        <ResultsContainer theme={theme}>
          <ResultsHeader theme={theme}>
            <div>
              <ResultsTitle theme={theme}>
                Miejscowości na literę "{selectedLetter}"
              </ResultsTitle>
              <ResultsCount theme={theme}>
                {loading ? 'Wyszukiwanie...' : `${cities.length} wyników`}
              </ResultsCount>
            </div>
            <ClearButton theme={theme} onClick={handleClear}>
              <FaTimes /> Wyczyść
            </ClearButton>
          </ResultsHeader>

          {loading ? (
            <LoadingSpinner theme={theme}>
              🔍 Wyszukiwanie miejscowości...
            </LoadingSpinner>
          ) : error ? (
            <ErrorMessage theme={theme}>
              {error}
            </ErrorMessage>
          ) : cities.length > 0 ? (
            <CitiesList>
              {cities.map((city, index) => (
                <CityItem
                  key={city.code || city._id || index}
                  theme={theme}
                  onClick={() => handleCitySelect(city)}
                >
                  <CityIcon theme={theme}>
                    <FaMapMarkerAlt />
                  </CityIcon>
                  <CityInfo>
                    <CityName theme={theme}>
                      {city.name}
                    </CityName>
                    <CityDetails theme={theme}>
                      {city.wojewodztwo?.name && `${city.wojewodztwo.name}`}
                      {city.powiat?.name && `, ${city.powiat.name}`}
                      {city.gmina?.name && `, ${city.gmina.name}`}
                      {city.population && ` • ${city.population.toLocaleString()} mieszkańców`}
                    </CityDetails>
                  </CityInfo>
                </CityItem>
              ))}
            </CitiesList>
          ) : (
            <NoResults theme={theme}>
              Nie znaleziono miejscowości zaczynających się na literę "{selectedLetter}"
            </NoResults>
          )}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default AlphabeticalCitySelector; 