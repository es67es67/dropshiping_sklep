import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaChevronDown, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import locationService from '../services/locationService';
import LocationAutocomplete from './LocationAutocomplete';

const SelectorContainer = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SelectorTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.2rem;
`;

const EditButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const CurrentLocation = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.primary}10;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.primary}30;
`;

const LocationIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.primary};
  font-size: 1.2rem;
`;

const LocationInfo = styled.div`
  flex: 1;
`;

const LocationName = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const LocationDetails = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const SelectorForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-weight: 500;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const FormSelect = styled.select.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  ${props => props.variant === 'save' && `
    background: ${props.theme.success};
    color: white;
    
    &:hover {
      background: ${props.theme.success}dd;
    }
  `}

  ${props => props.variant === 'cancel' && `
    background: ${props.theme.error};
    color: white;
    
    &:hover {
      background: ${props.theme.error}dd;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
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

export default function LocationSelector({ 
  theme, 
  currentLocation, 
  onLocationChange,
  showEditButton = true 
}) {
  const { user, getUserLocation, getUserTeryt, getUserAddress, updateUserLocation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Stan formularza - rozdzielamy kod i nazwę
  const [formData, setFormData] = useState({
    voivodeship: '', // kod województwa
    voivodeshipName: '', // nazwa województwa
    county: '', // kod powiatu
    countyName: '', // nazwa powiatu
    municipality: '', // kod gminy
    municipalityName: '', // nazwa gminy
    city: '', // kod miejscowości
    cityName: '' // nazwa miejscowości
  });

  // Stan dla dynamicznych danych
  const [countiesData, setCountiesData] = useState([]);
  const [municipalitiesData, setMunicipalitiesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Pobierz aktualną lokalizację użytkownika
  const userLocation = getUserLocation();
  const userTeryt = getUserTeryt();
  const userAddress = getUserAddress();

  // Funkcja do pobierania powiatów dla wybranego województwa
  const fetchCounties = async (voivodeshipCode) => {
    if (!voivodeshipCode) {
      setCountiesData([]);
      return;
    }

    try {
      setLoadingCounties(true);
      const counties = await locationService.getCountiesByVoivodeship(voivodeshipCode);
      setCountiesData(counties);
    } catch (error) {
      console.error('Błąd pobierania powiatów:', error);
      // Fallback: użyj statycznych danych
      const fallbackCounties = getFallbackCounties(voivodeshipCode);
      setCountiesData(fallbackCounties);
    } finally {
      setLoadingCounties(false);
    }
  };

  // Funkcja do pobierania gmin dla wybranego powiatu
  const fetchMunicipalities = async (countyCode) => {
    if (!countyCode) {
      setMunicipalitiesData([]);
      return;
    }

    try {
      setLoadingMunicipalities(true);
      const municipalities = await locationService.getMunicipalitiesByCounty(countyCode);
      setMunicipalitiesData(municipalities);
    } catch (error) {
      console.error('Błąd pobierania gmin:', error);
      // Fallback: użyj statycznych danych
      const fallbackMunicipalities = getFallbackMunicipalities(countyCode);
      setMunicipalitiesData(fallbackMunicipalities);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  // Funkcja do pobierania miejscowości dla wybranej gminy
  const fetchCities = async (municipalityCode) => {
    if (!municipalityCode) {
      setCitiesData([]);
      return;
    }

    try {
      setLoadingCities(true);
      const cities = await locationService.getCitiesByMunicipality(municipalityCode);
      setCitiesData(cities);
    } catch (error) {
      console.error('Błąd pobierania miejscowości:', error);
      // Fallback: użyj statycznych danych
      const fallbackCities = getFallbackCities(municipalityCode);
      setCitiesData(fallbackCities);
    } finally {
      setLoadingCities(false);
    }
  };

  // Funkcje fallback z statycznymi danymi
  const getFallbackCounties = (voivodeshipCode) => {
    const allCounties = {
      '02': [ // Dolnośląskie
        { code: '0201', name: 'bolesławiecki' },
        { code: '0202', name: 'dzierżoniowski' },
        { code: '0203', name: 'głogowski' },
        { code: '0204', name: 'górowski' },
        { code: '0205', name: 'jaworski' },
        { code: '0206', name: 'karkonoski' },
        { code: '0207', name: 'kamiennogórski' },
        { code: '0208', name: 'kłodzki' },
        { code: '0209', name: 'legnicki' },
        { code: '0210', name: 'lubański' },
        { code: '0211', name: 'lubiński' },
        { code: '0212', name: 'lwówecki' },
        { code: '0213', name: 'milicki' },
        { code: '0214', name: 'oleśnicki' },
        { code: '0215', name: 'oławski' },
        { code: '0216', name: 'polkowicki' },
        { code: '0217', name: 'strzeliński' },
        { code: '0218', name: 'średzki' },
        { code: '0219', name: 'świdnicki' },
        { code: '0220', name: 'trzebnicki' },
        { code: '0221', name: 'wałbrzyski' },
        { code: '0222', name: 'wołowski' },
        { code: '0223', name: 'wrocławski' },
        { code: '0224', name: 'ząbkowicki' },
        { code: '0225', name: 'zgorzelecki' },
        { code: '0226', name: 'złotoryjski' },
        { code: '0261', name: 'Jelenia Góra' },
        { code: '0262', name: 'Legnica' },
        { code: '0263', name: 'Wałbrzych' },
        { code: '0264', name: 'Wrocław' }
      ],
      '16': [ // Opolskie
        { code: '1601', name: 'brzeski' },
        { code: '1602', name: 'głubczycki' },
        { code: '1603', name: 'kędzierzyńsko-kozielski' },
        { code: '1604', name: 'kluczborski' },
        { code: '1605', name: 'krapkowicki' },
        { code: '1606', name: 'namysłowski' },
        { code: '1607', name: 'nyski' },
        { code: '1608', name: 'oleski' },
        { code: '1609', name: 'opolski' },
        { code: '1610', name: 'prudnicki' },
        { code: '1611', name: 'strzelecki' },
        { code: '1661', name: 'Opole' }
      ],
      '14': [ // Mazowieckie
        { code: '1401', name: 'białobrzeski' },
        { code: '1402', name: 'ciechanowski' },
        { code: '1403', name: 'garwoliński' },
        { code: '1404', name: 'gostyniński' },
        { code: '1405', name: 'grodziski' },
        { code: '1406', name: 'grójecki' },
        { code: '1407', name: 'kozienicki' },
        { code: '1408', name: 'legionowski' },
        { code: '1409', name: 'lipski' },
        { code: '1410', name: 'łosicki' },
        { code: '1411', name: 'makowski' },
        { code: '1412', name: 'miński' },
        { code: '1413', name: 'mławski' },
        { code: '1414', name: 'nowodworski' },
        { code: '1415', name: 'ostrołęcki' },
        { code: '1416', name: 'ostrowski' },
        { code: '1417', name: 'otwocki' },
        { code: '1418', name: 'piaseczyński' },
        { code: '1419', name: 'płocki' },
        { code: '1420', name: 'płoński' },
        { code: '1421', name: 'pruszkowski' },
        { code: '1422', name: 'przasnyski' },
        { code: '1423', name: 'przysuski' },
        { code: '1424', name: 'pułtuski' },
        { code: '1425', name: 'radomski' },
        { code: '1426', name: 'siedlecki' },
        { code: '1427', name: 'sierpecki' },
        { code: '1428', name: 'sochaczewski' },
        { code: '1429', name: 'sokołowski' },
        { code: '1430', name: 'szydłowiecki' },
        { code: '1431', name: 'warszawski zachodni' },
        { code: '1432', name: 'węgrowski' },
        { code: '1433', name: 'wołomiński' },
        { code: '1434', name: 'wyszkowski' },
        { code: '1435', name: 'zwoleński' },
        { code: '1436', name: 'żuromiński' },
        { code: '1437', name: 'żyrardowski' },
        { code: '1461', name: 'Ostrołęka' },
        { code: '1462', name: 'Płock' },
        { code: '1463', name: 'Radom' },
        { code: '1464', name: 'Siedlce' },
        { code: '1465', name: 'Warszawa' }
      ]
    };
    
    return allCounties[voivodeshipCode] || [];
  };

  const getFallbackMunicipalities = (countyCode) => {
    const allMunicipalities = {
      '0223': [ // Powiat wrocławski
        { code: '0223011', name: 'Czernica' },
        { code: '0223012', name: 'Długołęka' },
        { code: '0223013', name: 'Jordanów Śląski' },
        { code: '0223014', name: 'Kąty Wrocławskie' },
        { code: '0223015', name: 'Kobierzyce' },
        { code: '0223016', name: 'Mietków' },
        { code: '0223017', name: 'Sobótka' },
        { code: '0223018', name: 'Siechnice' },
        { code: '0223019', name: 'Żórawina' }
      ],
      '1609': [ // Powiat opolski
        { code: '1609011', name: 'Chrząstowice' },
        { code: '1609012', name: 'Dąbrowa' },
        { code: '1609013', name: 'Dobrzeń Wielki' },
        { code: '1609014', name: 'Komprachcice' },
        { code: '1609015', name: 'Łubniany' },
        { code: '1609016', name: 'Murów' },
        { code: '1609017', name: 'Niemodlin' },
        { code: '1609018', name: 'Ozimek' },
        { code: '1609019', name: 'Popielów' },
        { code: '1609020', name: 'Prószków' },
        { code: '1609021', name: 'Tarnów Opolski' },
        { code: '1609022', name: 'Tułowice' },
        { code: '1609023', name: 'Turawa' }
      ],
      '1431': [ // Powiat warszawski zachodni
        { code: '1431011', name: 'Błonie' },
        { code: '1431012', name: 'Izabelin' },
        { code: '1431013', name: 'Kampinos' },
        { code: '1431014', name: 'Leszno' },
        { code: '1431015', name: 'Łomianki' },
        { code: '1431016', name: 'Ożarów Mazowiecki' },
        { code: '1431017', name: 'Stare Babice' }
      ]
    };
    
    return allMunicipalities[countyCode] || [];
  };

  const getFallbackCities = (municipalityCode) => {
    const allCities = {
      '0223011': [ // Gmina Czernica
        { code: '0986283', name: 'Wrocław', population: 674079 },
        { code: '0986284', name: 'Czernica', population: 2500 },
        { code: '0986285', name: 'Kamieniec Wrocławski', population: 1800 }
      ],
      '1609011': [ // Gmina Chrząstowice
        { code: '0986286', name: 'Opole', population: 120000 },
        { code: '0986287', name: 'Chrząstowice', population: 3200 },
        { code: '0986288', name: 'Dębska Kuźnia', population: 1500 }
      ],
      '1431011': [ // Gmina Błonie
        { code: '0986289', name: 'Warszawa', population: 1783321 },
        { code: '0986290', name: 'Błonie', population: 12500 },
        { code: '0986291', name: 'Radzików', population: 800 }
      ]
    };
    
    return allCities[municipalityCode] || [];
  };

  useEffect(() => {
    // Inicjalizuj formularz danymi użytkownika
    if (userTeryt) {
      setFormData({
        voivodeship: userTeryt.voivodeshipCode || '',
        county: userTeryt.countyCode || '',
        municipality: userTeryt.municipalityCode || '',
        city: userAddress?.city || ''
      });
    }
  }, [userTeryt, userAddress]);

  // Pobierz dane kaskadowo po inicjalizacji
  useEffect(() => {
    if (formData.voivodeship) {
      fetchCounties(formData.voivodeship);
    }
  }, [formData.voivodeship]);

  useEffect(() => {
    if (formData.county) {
      fetchMunicipalities(formData.county);
    }
  }, [formData.county]);

  useEffect(() => {
    if (formData.municipality) {
      fetchCities(formData.municipality);
    }
  }, [formData.municipality]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Przywróć oryginalne dane
    if (userTeryt) {
      setFormData({
        voivodeship: userTeryt.voivodeshipCode || '',
        voivodeshipName: '', // będzie ustawione na podstawie kodu
        county: userTeryt.countyCode || '',
        countyName: '',
        municipality: userTeryt.municipalityCode || '',
        municipalityName: '',
        city: userAddress?.city || '',
        cityName: userAddress?.city || ''
      });
    } else {
      // Resetuj wszystkie pola
      setFormData({
        voivodeship: '',
        voivodeshipName: '',
        county: '',
        countyName: '',
        municipality: '',
        municipalityName: '',
        city: '',
        cityName: ''
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sprawdź czy wybrano województwo
      if (!formData.voivodeship) {
        setError('Proszę wybrać województwo');
        return;
      }

      // Przygotuj dane do aktualizacji
      const locationData = {
        location: {
          id: null, // Będzie ustawione przez backend
          name: formData.voivodeshipName || 'Wybrana lokalizacja',
          type: 'województwo',
          code: formData.voivodeship
        },
        teryt: {
          voivodeshipCode: formData.voivodeship,
          countyCode: formData.county,
          municipalityCode: formData.municipality,
          tercCode: formData.voivodeship + formData.county + formData.municipality,
          simcCode: formData.city || '' // kod miejscowości
        },
        address: {
          city: formData.cityName || formData.voivodeshipName,
          postalCode: userAddress?.postalCode || ''
        }
      };

      // Wyślij aktualizację do backendu
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/users/location`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas aktualizacji lokalizacji');
      }

      const result = await response.json();
      
      // Wywołaj callback jeśli podano
      if (onLocationChange) {
        await onLocationChange(result.user);
      }

      // Zaktualizuj localStorage
      updateUserLocation(result.user);

      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas aktualizacji lokalizacji');
      console.error('Błąd aktualizacji lokalizacji:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Kaskadowe pobieranie danych - tylko dla pól nazw (nie kodów)
    if (field === 'voivodeshipName' && value.length >= 2) {
      // Resetuj pozostałe pola przy zmianie województwa
      setFormData(prev => ({
        ...prev,
        county: '',
        countyName: '',
        municipality: '',
        municipalityName: '',
        city: '',
        cityName: ''
      }));
      setCountiesData([]);
      setMunicipalitiesData([]);
      setCitiesData([]);
    } else if (field === 'countyName' && value.length >= 2) {
      // Resetuj pozostałe pola przy zmianie powiatu
      setFormData(prev => ({
        ...prev,
        municipality: '',
        municipalityName: '',
        city: '',
        cityName: ''
      }));
      setMunicipalitiesData([]);
      setCitiesData([]);
    } else if (field === 'municipalityName' && value.length >= 2) {
      // Resetuj pozostałe pola przy zmianie gminy
      setFormData(prev => ({
        ...prev,
        city: '',
        cityName: ''
      }));
      setCitiesData([]);
    }
  };

  // Wyświetl aktualną lokalizację
  const renderCurrentLocation = () => {
    const location = currentLocation || userLocation;
    const teryt = userTeryt;
    const address = userAddress;

    if (!location && !teryt && !address?.city) {
      return (
        <CurrentLocation theme={theme}>
          <LocationIcon theme={theme}>
            <FaMapMarkerAlt />
          </LocationIcon>
          <LocationInfo>
            <LocationName theme={theme}>Nie ustawiono lokalizacji</LocationName>
            <LocationDetails theme={theme}>
              Kliknij "Edytuj" aby ustawić swoją lokalizację
            </LocationDetails>
          </LocationInfo>
        </CurrentLocation>
      );
    }

    return (
      <CurrentLocation theme={theme}>
        <LocationIcon theme={theme}>
          <FaMapMarkerAlt />
        </LocationIcon>
        <LocationInfo>
          <LocationName theme={theme}>
            {location?.name || address?.city || 'Lokalizacja użytkownika'}
          </LocationName>
          <LocationDetails theme={theme}>
            {teryt?.voivodeshipCode && `Województwo: ${teryt.voivodeshipCode}`}
            {teryt?.countyCode && ` | Powiat: ${teryt.countyCode}`}
            {teryt?.municipalityCode && ` | Gmina: ${teryt.municipalityCode}`}
            {address?.postalCode && ` | ${address.postalCode}`}
          </LocationDetails>
        </LocationInfo>
      </CurrentLocation>
    );
  };

  // Wyświetl formularz edycji
  const renderEditForm = () => {
    if (!isEditing) return null;

    return (
      <>
        <SelectorForm>
          <FormGroup>
            <FormLabel theme={theme}>Województwo *</FormLabel>
            <LocationAutocomplete
              type="voivodeships"
              value={formData.voivodeshipName}
              onChange={(value) => handleFormChange('voivodeshipName', value)}
              onSelect={(item) => {
                console.log('🎯 Wybrano województwo:', item);
                // Automatycznie ustaw powiązane dane
                setFormData(prev => ({
                  ...prev,
                  voivodeship: item.code, // kod do API
                  voivodeshipName: item.name, // nazwa do wyświetlania
                  county: '',
                  countyName: '',
                  municipality: '',
                  municipalityName: '',
                  city: '',
                  cityName: ''
                }));
                // Pobierz powiązane dane
                if (item.code) fetchCounties(item.code);
                setMunicipalitiesData([]);
                setCitiesData([]);
              }}
              placeholder="Wpisz nazwę województwa..."
              theme={theme.theme}
              disabled={false}
              enableNavigation={true}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Powiat</FormLabel>
            <LocationAutocomplete
              type="counties"
              value={formData.countyName}
              onChange={(value) => handleFormChange('countyName', value)}
              onSelect={(item) => {
                console.log('🎯 Wybrano powiat:', item);
                // Automatycznie ustaw powiązane dane
                setFormData(prev => ({
                  ...prev,
                  voivodeship: item.voivodeshipCode,
                  voivodeshipName: item.voivodeshipName || prev.voivodeshipName,
                  county: item.code, // kod powiatu
                  countyName: item.name, // nazwa powiatu
                  municipality: '',
                  municipalityName: '',
                  city: '',
                  cityName: ''
                }));
                // Pobierz powiązane dane
                if (item.code) fetchMunicipalities(item.code);
                setCitiesData([]);
              }}
              placeholder="Wpisz nazwę powiatu..."
              theme={theme.theme}
              disabled={!formData.voivodeship}
              enableNavigation={true}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Gmina</FormLabel>
            <LocationAutocomplete
              type="municipalities"
              value={formData.municipalityName}
              onChange={(value) => handleFormChange('municipalityName', value)}
              onSelect={(item) => {
                console.log('🎯 Wybrano gminę:', item);
                // Automatycznie ustaw powiązane dane
                setFormData(prev => ({
                  ...prev,
                  voivodeship: item.voivodeshipCode,
                  voivodeshipName: item.voivodeshipName || prev.voivodeshipName,
                  county: item.countyCode,
                  countyName: item.countyName || prev.countyName,
                  municipality: item.code, // kod gminy
                  municipalityName: item.name, // nazwa gminy
                  city: '',
                  cityName: ''
                }));
                // Pobierz powiązane dane
                if (item.code) fetchCities(item.code);
              }}
              placeholder="Wpisz nazwę gminy..."
              theme={theme.theme}
              disabled={false}
              enableNavigation={true}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Miejscowość</FormLabel>
            <LocationAutocomplete
              type="cities"
              value={formData.cityName}
              onChange={(value) => handleFormChange('cityName', value)}
              onSelect={(item) => {
                console.log('🎯 Wybrano miejscowość:', item);
                // Automatycznie ustaw powiązane dane
                setFormData(prev => ({
                  ...prev,
                  voivodeship: item.voivodeshipCode,
                  voivodeshipName: item.voivodeshipName || prev.voivodeshipName,
                  county: item.countyCode,
                  countyName: item.countyName || prev.countyName,
                  municipality: item.municipalityCode,
                  municipalityName: item.municipalityName || prev.municipalityName,
                  city: item.code, // kod miejscowości
                  cityName: item.name // nazwa miejscowości
                }));
              }}
              placeholder="Wpisz nazwę miejscowości..."
              theme={theme.theme}
              disabled={false}
              enableNavigation={true}
            />
          </FormGroup>
        </SelectorForm>

        <FormActions>
          <ActionButton
            theme={theme}
            variant="save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Zapisywanie...' : (
              <>
                <FaCheck />
                Zapisz
              </>
            )}
          </ActionButton>
          <ActionButton
            theme={theme}
            variant="cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            <FaTimes />
            Anuluj
          </ActionButton>
        </FormActions>

        {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
      </>
    );
  };

  return (
    <SelectorContainer theme={theme}>
      <SelectorHeader>
        <SelectorTitle theme={theme}>Twoja lokalizacja</SelectorTitle>
        {showEditButton && !isEditing && (
          <EditButton theme={theme} onClick={handleEdit}>
            <FaEdit />
            Edytuj
          </EditButton>
        )}
      </SelectorHeader>

      {renderCurrentLocation()}
      {renderEditForm()}
    </SelectorContainer>
  );
} 