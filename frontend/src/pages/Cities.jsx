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

// Przykładowe dane miast według kodów GUS (SIMC)
const citiesData = [
  { code: '0986283', name: 'Wrocław', municipality: '0223011', population: 674079 },
  { code: '0986284', name: 'Warszawa', municipality: '0223012', population: 1783321 },
  { code: '0986285', name: 'Kraków', municipality: '0223013', population: 779966 },
  { code: '0986286', name: 'Łódź', municipality: '0223014', population: 677286 },
  { code: '0986287', name: 'Poznań', municipality: '0223015', population: 534813 },
  { code: '0986288', name: 'Gdańsk', municipality: '0223016', population: 470907 },
  { code: '0986289', name: 'Szczecin', municipality: '0223017', population: 400990 },
  { code: '0986290', name: 'Bydgoszcz', municipality: '0223018', population: 346739 },
  { code: '0986291', name: 'Lublin', municipality: '0223019', population: 339850 },
  { code: '0986292', name: 'Katowice', municipality: '0223020', population: 294510 },
  { code: '0986293', name: 'Białystok', municipality: '0223021', population: 297554 },
  { code: '0986294', name: 'Gdynia', municipality: '0223022', population: 245867 },
  { code: '0986295', name: 'Częstochowa', municipality: '0223023', population: 220433 },
  { code: '0986296', name: 'Radom', municipality: '0223024', population: 210532 },
  { code: '0986297', name: 'Sosnowiec', municipality: '0223025', population: 198996 }
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

    // Fallback: ustaw domyślne miasto (Wrocław)
    if (!selectedCity) {
      const defaultCity = citiesData.find(c => c.code === '0986283') || citiesData[0];
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