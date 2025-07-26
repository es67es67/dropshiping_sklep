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

const CountySelector = styled.div`
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

const CountyDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const CountyButton = styled.button`
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

const CountyDropdownContent = styled.div.withConfig({
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

const CountyOption = styled.div.withConfig({
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

// Przykładowe dane powiatów według kodów GUS (dla województwa dolnośląskiego)
const countiesData = [
  { code: '0201', name: 'bolesławiecki', voivodeship: '02' },
  { code: '0202', name: 'dzierżoniowski', voivodeship: '02' },
  { code: '0203', name: 'głogowski', voivodeship: '02' },
  { code: '0204', name: 'górowski', voivodeship: '02' },
  { code: '0205', name: 'jaworski', voivodeship: '02' },
  { code: '0206', name: 'karkonoski', voivodeship: '02' },
  { code: '0207', name: 'kamiennogórski', voivodeship: '02' },
  { code: '0208', name: 'kłodzki', voivodeship: '02' },
  { code: '0209', name: 'legnicki', voivodeship: '02' },
  { code: '0210', name: 'lubański', voivodeship: '02' },
  { code: '0211', name: 'lubiński', voivodeship: '02' },
  { code: '0212', name: 'lwówecki', voivodeship: '02' },
  { code: '0213', name: 'milicki', voivodeship: '02' },
  { code: '0214', name: 'oleśnicki', voivodeship: '02' },
  { code: '0215', name: 'oławski', voivodeship: '02' },
  { code: '0216', name: 'polkowicki', voivodeship: '02' },
  { code: '0217', name: 'strzeliński', voivodeship: '02' },
  { code: '0218', name: 'średzki', voivodeship: '02' },
  { code: '0219', name: 'świdnicki', voivodeship: '02' },
  { code: '0220', name: 'trzebnicki', voivodeship: '02' },
  { code: '0221', name: 'wałbrzyski', voivodeship: '02' },
  { code: '0222', name: 'wołowski', voivodeship: '02' },
  { code: '0223', name: 'wrocławski', voivodeship: '02' },
  { code: '0224', name: 'ząbkowicki', voivodeship: '02' },
  { code: '0225', name: 'zgorzelecki', voivodeship: '02' },
  { code: '0226', name: 'złotoryjski', voivodeship: '02' },
  { code: '0261', name: 'Jelenia Góra', voivodeship: '02' },
  { code: '0262', name: 'Legnica', voivodeship: '02' },
  { code: '0263', name: 'Wałbrzych', voivodeship: '02' },
  { code: '0264', name: 'Wrocław', voivodeship: '02' }
];

export default function Counties({ theme }) {
  const { getUserTeryt, getUserLocation } = useAuth();
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz lokalizację użytkownika
  const userTeryt = getUserTeryt();
  const userLocation = getUserLocation();

  useEffect(() => {
    // Automatycznie ustaw powiat na podstawie lokalizacji użytkownika
    if (userTeryt?.countyCode) {
      const userCounty = countiesData.find(c => c.code === userTeryt.countyCode);
      if (userCounty) {
        setSelectedCounty(userCounty);
        return;
      }
    }

    // Fallback: ustaw domyślny powiat (wrocławski)
    if (!selectedCounty) {
      const defaultCounty = countiesData.find(c => c.code === '0223') || countiesData[0];
      setSelectedCounty(defaultCounty);
    }
  }, [userTeryt, selectedCounty]);

  const handleCountySelect = (county) => {
    setSelectedCounty(county);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationChange = async (locationData) => {
    try {
      // Aktualizuj wybrany powiat na podstawie nowych danych
      if (locationData.teryt?.countyCode) {
        const newCounty = countiesData.find(c => c.code === locationData.teryt.countyCode);
        if (newCounty) {
          setSelectedCounty(newCounty);
        }
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji lokalizacji:', error);
    }
  };

  // Jeśli nie wybrano powiatu, pokaż listę do wyboru
  if (!selectedCounty) {
    return (
      <Container>
              <PageTitle title="Powiaty" description="Przeglądaj powiaty i ich dane" />
        <Header>
          <Title>Powiaty</Title>
          <Subtitle>Wybierz powiat, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>

        <LocationSelector 
          theme={theme}
          onLocationChange={handleLocationChange}
        />

        <CountySelector>
          <SelectorLabel>Wybierz powiat:</SelectorLabel>
          <CountyDropdown>
            <CountyButton onClick={toggleDropdown}>
              <FaMapMarkerAlt />
              Wybierz powiat
              <FaChevronDown />
            </CountyButton>
            <CountyDropdownContent isOpen={isDropdownOpen} theme={theme}>
              {countiesData.map((county) => (
                <CountyOption
                  key={county.code}
                  onClick={() => handleCountySelect(county)}
                  theme={theme}
                >
                  {county.name} ({county.code})
                </CountyOption>
              ))}
            </CountyDropdownContent>
          </CountyDropdown>
        </CountySelector>

        {loading && <LoadingSpinner>Ładowanie...</LoadingSpinner>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  // Jeśli wybrano powiat, pokaż szablon z danymi
  return (
    <Container>
      <PageTitle title={`Powiat ${selectedCounty.name}`} description={`Dane dla powiatu ${selectedCounty.name}`} />
      <LocationSelector 
        theme={theme}
        currentLocation={selectedCounty}
        onLocationChange={handleLocationChange}
      />
      
      <LocationTemplate
        theme={theme}
        locationType="powiat"
        locationName={selectedCounty.name}
        locationCode={selectedCounty.code}
        locationId={selectedCounty.code}
        apiEndpoint={`/api/locations/counties/${selectedCounty.code}`}
        title={`Powiat ${selectedCounty.name}`}
        subtitle={`Dane dla powiatu ${selectedCounty.name} (kod GUS: ${selectedCounty.code})`}
      />
    </Container>
  );
} 