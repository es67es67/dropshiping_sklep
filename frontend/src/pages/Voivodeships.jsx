import React from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import LocationTemplate from '../components/LocationTemplate';
import LocationSelector from '../components/LocationSelector';
import AlphabeticalCitySelector from '../components/AlphabeticalCitySelector';
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

const VoivodeshipSelector = styled.div`
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

const VoivodeshipDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const VoivodeshipButton = styled.button`
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

const VoivodeshipDropdownContent = styled.div.withConfig({
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

const VoivodeshipOption = styled.div.withConfig({
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

// Dane województw według kodów GUS
const voivodeshipsData = [
  { code: '02', name: 'DOLNOŚLĄSKIE' },
  { code: '04', name: 'KUJAWSKO-POMORSKIE' },
  { code: '06', name: 'LUBELSKIE' },
  { code: '08', name: 'LUBUSKIE' },
  { code: '10', name: 'ŁÓDZKIE' },
  { code: '12', name: 'MAŁOPOLSKIE' },
  { code: '14', name: 'MAZOWIECKIE' },
  { code: '16', name: 'OPOLSKIE' },
  { code: '18', name: 'PODKARPACKIE' },
  { code: '20', name: 'PODLASKIE' },
  { code: '22', name: 'POMORSKIE' },
  { code: '24', name: 'ŚLĄSKIE' },
  { code: '26', name: 'ŚWIĘTOKRZYSKIE' },
  { code: '28', name: 'WARMIŃSKO-MAZURSKIE' },
  { code: '30', name: 'WIELKOPOLSKIE' },
  { code: '32', name: 'ZACHODNIOPOMORSKIE' }
];

export default function Voivodeships({ theme }) {
  const { getUserTeryt, getUserLocation } = useAuth();
  const [selectedVoivodeship, setSelectedVoivodeship] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz lokalizację użytkownika
  const userTeryt = getUserTeryt();
  const userLocation = getUserLocation();

  useEffect(() => {
    // Automatycznie ustaw województwo na podstawie lokalizacji użytkownika
    if (userTeryt?.voivodeshipCode) {
      const userVoivodeship = voivodeshipsData.find(v => v.code === userTeryt.voivodeshipCode);
      if (userVoivodeship) {
        setSelectedVoivodeship(userVoivodeship);
        return;
      }
    }

    // Fallback: ustaw domyślne województwo (Mazowieckie)
    if (!selectedVoivodeship) {
      const defaultVoivodeship = voivodeshipsData.find(v => v.code === '14') || voivodeshipsData[0];
      setSelectedVoivodeship(defaultVoivodeship);
    }
  }, [userTeryt, selectedVoivodeship]);

  const handleVoivodeshipSelect = (voivodeship) => {
    setSelectedVoivodeship(voivodeship);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationChange = async (locationData) => {
    try {
      // Aktualizuj wybrane województwo na podstawie nowych danych
      if (locationData.teryt?.voivodeshipCode) {
        const newVoivodeship = voivodeshipsData.find(v => v.code === locationData.teryt.voivodeshipCode);
        if (newVoivodeship) {
          setSelectedVoivodeship(newVoivodeship);
        }
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji lokalizacji:', error);
    }
  };

  // Jeśli nie wybrano województwa, pokaż listę do wyboru
  if (!selectedVoivodeship) {
    return (
      <Container>
              <PageTitle title="Województwa" description="Przeglądaj województwa i ich dane" />
        <Header>
          <Title>Województwa</Title>
          <Subtitle>Wybierz województwo, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>

        <LocationSelector 
          theme={theme}
          onLocationChange={handleLocationChange}
        />

        <VoivodeshipSelector>
          <SelectorLabel>Wybierz województwo:</SelectorLabel>
          <VoivodeshipDropdown>
            <VoivodeshipButton onClick={toggleDropdown}>
              <FaMapMarkerAlt />
              Wybierz województwo
              <FaChevronDown />
            </VoivodeshipButton>
            <VoivodeshipDropdownContent isOpen={isDropdownOpen} theme={theme}>
              {voivodeshipsData.map((voivodeship) => (
                <VoivodeshipOption
                  key={voivodeship.code}
                  onClick={() => handleVoivodeshipSelect(voivodeship)}
                  theme={theme}
                >
                  {voivodeship.name} ({voivodeship.code})
                </VoivodeshipOption>
              ))}
            </VoivodeshipDropdownContent>
          </VoivodeshipDropdown>
        </VoivodeshipSelector>

        {/* Nowy komponent wyszukiwania alfabetycznego */}
        <AlphabeticalCitySelector theme={theme} />

        {loading && <LoadingSpinner>Ładowanie...</LoadingSpinner>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  // Jeśli wybrano województwo, pokaż szablon z danymi
  return (
    <Container>
      <PageTitle title={`Województwo ${selectedVoivodeship.name}`} description={`Dane dla województwa ${selectedVoivodeship.name}`} />
      <LocationSelector 
        theme={theme}
        currentLocation={selectedVoivodeship}
        onLocationChange={handleLocationChange}
      />
      
      <LocationTemplate
        theme={theme}
        locationType="województwo"
        locationName={selectedVoivodeship.name}
        locationCode={selectedVoivodeship.code}
        locationId={selectedVoivodeship.code}
        apiEndpoint={`/api/locations/voivodeships/${selectedVoivodeship.code}`}
        title={`Województwo ${selectedVoivodeship.name}`}
        subtitle={`Dane dla województwa ${selectedVoivodeship.name} (kod GUS: ${selectedVoivodeship.code})`}
      />
    </Container>
  );
} 