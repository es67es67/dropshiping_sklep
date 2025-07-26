import React from 'react';
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

const MunicipalitySelector = styled.div`
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

const MunicipalityDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const MunicipalityButton = styled.button`
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

const MunicipalityDropdownContent = styled.div.withConfig({
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

const MunicipalityOption = styled.div.withConfig({
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

// Przykładowe dane gmin według kodów GUS (dla powiatu wrocławskiego)
const municipalitiesData = [
  { code: '0223011', name: 'Czernica', county: '0223' },
  { code: '0223012', name: 'Długołęka', county: '0223' },
  { code: '0223013', name: 'Jordanów Śląski', county: '0223' },
  { code: '0223014', name: 'Kąty Wrocławskie', county: '0223' },
  { code: '0223015', name: 'Kobierzyce', county: '0223' },
  { code: '0223016', name: 'Mietków', county: '0223' },
  { code: '0223017', name: 'Sobótka', county: '0223' },
  { code: '0223018', name: 'Siechnice', county: '0223' },
  { code: '0223019', name: 'Żórawina', county: '0223' },
  { code: '0223020', name: 'Oława', county: '0223' },
  { code: '0223021', name: 'Prusice', county: '0223' },
  { code: '0223022', name: 'Trzebnica', county: '0223' },
  { code: '0223023', name: 'Wisząca', county: '0223' },
  { code: '0223024', name: 'Zawonia', county: '0223' },
  { code: '0223025', name: 'Żmigród', county: '0223' }
];

export default function Municipalities({ theme }) {
  const { getUserTeryt, getUserLocation } = useAuth();
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz lokalizację użytkownika
  const userTeryt = getUserTeryt();
  const userLocation = getUserLocation();

  useEffect(() => {
    // Automatycznie ustaw gminę na podstawie lokalizacji użytkownika
    if (userTeryt?.municipalityCode) {
      const userMunicipality = municipalitiesData.find(m => m.code === userTeryt.municipalityCode);
      if (userMunicipality) {
        setSelectedMunicipality(userMunicipality);
        return;
      }
    }

    // Fallback: ustaw domyślną gminę (Czernica)
    if (!selectedMunicipality) {
      const defaultMunicipality = municipalitiesData.find(m => m.code === '0223011') || municipalitiesData[0];
      setSelectedMunicipality(defaultMunicipality);
    }
  }, [userTeryt, selectedMunicipality]);

  const handleMunicipalitySelect = (municipality) => {
    setSelectedMunicipality(municipality);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationChange = async (locationData) => {
    try {
      // Aktualizuj wybraną gminę na podstawie nowych danych
      if (locationData.teryt?.municipalityCode) {
        const newMunicipality = municipalitiesData.find(m => m.code === locationData.teryt.municipalityCode);
        if (newMunicipality) {
          setSelectedMunicipality(newMunicipality);
        }
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji lokalizacji:', error);
    }
  };

  // Jeśli nie wybrano gminy, pokaż listę do wyboru
  if (!selectedMunicipality) {
    return (
      <Container>
              <PageTitle title="Gminy" description="Przeglądaj gminy i ich dane" />
        <Header>
          <Title>Gminy</Title>
          <Subtitle>Wybierz gminę, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>

        <LocationSelector 
          theme={theme}
          onLocationChange={handleLocationChange}
        />

        <MunicipalitySelector>
          <SelectorLabel>Wybierz gminę:</SelectorLabel>
          <MunicipalityDropdown>
            <MunicipalityButton onClick={toggleDropdown}>
              <FaMapMarkerAlt />
              Wybierz gminę
              <FaChevronDown />
            </MunicipalityButton>
            <MunicipalityDropdownContent isOpen={isDropdownOpen} theme={theme}>
              {municipalitiesData.map((municipality) => (
                <MunicipalityOption
                  key={municipality.code}
                  onClick={() => handleMunicipalitySelect(municipality)}
                  theme={theme}
                >
                  {municipality.name} ({municipality.code})
                </MunicipalityOption>
              ))}
            </MunicipalityDropdownContent>
          </MunicipalityDropdown>
        </MunicipalitySelector>

        {loading && <LoadingSpinner>Ładowanie...</LoadingSpinner>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  // Jeśli wybrano gminę, pokaż szablon z danymi
  return (
    <Container>
      <PageTitle title={`Gmina ${selectedMunicipality.name}`} description={`Dane dla gminy ${selectedMunicipality.name}`} />
      <LocationSelector 
        theme={theme}
        currentLocation={selectedMunicipality}
        onLocationChange={handleLocationChange}
      />
      
      <LocationTemplate
        theme={theme}
        locationType="gmina"
        locationName={selectedMunicipality.name}
        locationCode={selectedMunicipality.code}
        locationId={selectedMunicipality.code}
        apiEndpoint={`/api/locations/municipalities/${selectedMunicipality.code}`}
        title={`Gmina ${selectedMunicipality.name}`}
        subtitle={`Dane dla gminy ${selectedMunicipality.name} (kod GUS: ${selectedMunicipality.code})`}
      />
    </Container>
  );
} 