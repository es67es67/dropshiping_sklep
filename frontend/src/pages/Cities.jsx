import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import LocationTemplate from '../components/LocationTemplate';
import LocationSelector from '../components/LocationSelector';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
`;

const CitySelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SelectorLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const CityDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const CityButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const CityDropdownContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'theme'].includes(prop)
})`
  display: ${props => props.isOpen ? 'block' : 'none'};
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
`;

const CityOption = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'theme'].includes(prop)
})`
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

  ${props => props.isSelected && `
    background: ${props.theme.primary}20;
    color: ${props.theme.primary};
    font-weight: 500;
  `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

// Rzeczywiste dane miast według kodów GUS (SIMC) - powiat wrocławski
const citiesData = [
  { code: '0884766', name: 'Suchy Dwór', municipality: '022301', population: 1200 },
  { code: '0884795', name: 'Węgry', municipality: '022301', population: 800 },
  { code: '0880082', name: 'Kunów', municipality: '022302', population: 1500 },
  { code: '0880136', name: 'Okulice', municipality: '022302', population: 900 },
  { code: '0880142', name: 'Olbrachtowice', municipality: '022302', population: 1100 },
  { code: '0873685', name: 'Brzezia Łąka', municipality: '022303', population: 2000 },
  { code: '0873691', name: 'Budziwojowice', municipality: '022303', population: 1600 },
  { code: '0875260', name: 'Wszemiłowice', municipality: '022304', population: 1800 },
  { code: '0875282', name: 'Zabrodzie', municipality: '022304', population: 1200 },
  { code: '0875342', name: 'Budziszów', municipality: '022305', population: 1400 },
  { code: '0875359', name: 'Chrzanów', municipality: '022305', population: 2200 },
  { code: '0877105', name: 'Piława', municipality: '022306', population: 3000 },
  { code: '0875394', name: 'Dobkowice', municipality: '022307', population: 1100 },
  { code: '0880188', name: 'Siedlakowice', municipality: '022307', population: 800 },
  { code: '0880248', name: 'Sulistrowiczki', municipality: '022307', population: 600 },
  { code: '0873780', name: 'Godzieszowa', municipality: '022308', population: 1300 },
  { code: '0884588', name: 'Jaksonów', municipality: '022308', population: 1700 },
  { code: '0875023', name: 'Krobielowice', municipality: '022309', population: 1900 },
  { code: '0875129', name: 'Rybnica', municipality: '022309', population: 1500 },
  { code: '0875187', name: 'Smolec', municipality: '022309', population: 2500 }
];

export default function Cities({ theme }) {
  const { getUserTeryt, getUserLocation, getUserAddress } = useAuth();
  const [selectedCity, setSelectedCity] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz lokalizację użytkownika
  const userTeryt = getUserTeryt();
  const userLocation = getUserLocation();
  const userAddress = getUserAddress();

  useEffect(() => {
    // Automatycznie ustaw miasto na podstawie lokalizacji użytkownika
    if (userTeryt?.simcCode) {
      const userCity = citiesData.find(c => c.code === userTeryt.simcCode);
      if (userCity) {
        setSelectedCity(userCity);
        return;
      }
    }

    // Fallback: sprawdź miasto z adresu
    if (userAddress?.city) {
      const userCity = citiesData.find(c => 
        c.name.toLowerCase() === userAddress.city.toLowerCase()
      );
      if (userCity) {
        setSelectedCity(userCity);
        return;
      }
    }

    // Fallback: ustaw domyślne miasto (Suchy Dwór)
    if (!selectedCity) {
      const defaultCity = citiesData.find(c => c.code === '0884766') || citiesData[0];
      setSelectedCity(defaultCity);
    }
  }, [userTeryt, userAddress, selectedCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationChange = async (locationData) => {
    try {
      // Aktualizuj wybrane miasto na podstawie nowych danych
      if (locationData.teryt?.simcCode) {
        const newCity = citiesData.find(c => c.code === locationData.teryt.simcCode);
        if (newCity) {
          setSelectedCity(newCity);
        }
      } else if (locationData.address?.city) {
        const newCity = citiesData.find(c => 
          c.name.toLowerCase() === locationData.address.city.toLowerCase()
        );
        if (newCity) {
          setSelectedCity(newCity);
        }
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji lokalizacji:', error);
    }
  };

  // Jeśli nie wybrano miasta, pokaż listę do wyboru
  if (!selectedCity) {
    return (
      <Container>
              <PageTitle title="Miasta" description="Przeglądaj miasta i ich dane" />
        <Header>
          <Title>Miasta</Title>
          <Subtitle>Wybierz miasto, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>

        <LocationSelector 
          theme={theme}
          onLocationChange={handleLocationChange}
        />

        <CitySelector>
          <SelectorLabel>Wybierz miasto:</SelectorLabel>
          <CityDropdown>
            <CityButton onClick={toggleDropdown}>
              <FaMapMarkerAlt />
              Wybierz miasto
              <FaChevronDown />
            </CityButton>
            <CityDropdownContent isOpen={isDropdownOpen} theme={theme}>
              {citiesData.map((city) => (
                <CityOption
                  key={city.code}
                  onClick={() => handleCitySelect(city)}
                  theme={theme}
                >
                  {city.name} ({city.code}) - {city.population.toLocaleString()} mieszkańców
                </CityOption>
              ))}
            </CityDropdownContent>
          </CityDropdown>
        </CitySelector>

        {loading && <LoadingSpinner>Ładowanie...</LoadingSpinner>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  // Jeśli wybrano miasto, pokaż szablon z danymi
  return (
    <Container>
      <PageTitle title={`Miasto ${selectedCity.name}`} description={`Dane dla miasta ${selectedCity.name}`} />
      <LocationSelector 
        theme={theme}
        currentLocation={selectedCity}
        onLocationChange={handleLocationChange}
      />
      
      <LocationTemplate
        theme={theme}
        locationType="miasto"
        locationName={selectedCity.name}
        locationCode={selectedCity.code}
        locationId={selectedCity.code}
        apiEndpoint={`/api/locations/cities/${selectedCity.code}`}
        title={`Miasto ${selectedCity.name}`}
        subtitle={`Dane dla miasta ${selectedCity.name} (kod SIMC: ${selectedCity.code}, ${selectedCity.population.toLocaleString()} mieszkańców)`}
      />
    </Container>
  );
}