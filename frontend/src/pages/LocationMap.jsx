import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MapPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 2rem;
`;

const MapHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MapTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const MapSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid ${props => props.theme.border};
  position: relative;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${props => props.theme.surface} 0%, ${props => props.theme.background} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
`;

const LocationControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const LocationSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const LocationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LocationInfo = styled.div`
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const LocationTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
`;

const LocationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.text};
`;

const LocationActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
    
    &:hover {
      background: ${props => props.theme.primary}dd;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.border};
  border-radius: 50%;
  border-top-color: ${props => props.theme.primary};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  background: ${props => props.theme.error}10;
  border: 1px solid ${props => props.theme.error};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export default function LocationMap({ theme }) {
  const navigate = useNavigate();
  const [selectedVoivodeship, setSelectedVoivodeship] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  
  const [voivodeships, setVoivodeships] = useState([]);
  const [counties, setCounties] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [towns, setTowns] = useState([]);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // Pobierz województwa przy pierwszym renderowaniu
  useEffect(() => {
    fetchVoivodeships();
  }, []);

  // Pobierz powiaty gdy wybrano województwo
  useEffect(() => {
    if (selectedVoivodeship) {
      fetchCounties(selectedVoivodeship);
      setSelectedCounty('');
      setSelectedMunicipality('');
      setSelectedTown('');
    }
  }, [selectedVoivodeship]);

  // Pobierz gminy gdy wybrano powiat
  useEffect(() => {
    if (selectedCounty) {
      fetchMunicipalities(selectedCounty);
      setSelectedMunicipality('');
      setSelectedTown('');
    }
  }, [selectedCounty]);

  // Pobierz miejscowości gdy wybrano gminę
  useEffect(() => {
    if (selectedMunicipality) {
      fetchTowns(selectedMunicipality);
      setSelectedTown('');
    }
  }, [selectedMunicipality]);

  // Inicjalizacja mapy
  useEffect(() => {
    if (window.google && window.google.maps && !mapInstance.current) {
      initMap();
    } else if (!window.google) {
      loadGoogleMapsAPI();
    }
  }, []);

  const loadGoogleMapsAPI = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCwtl6-7ZwOqKa2rd967GHyp4JyCMgX2MI'}&libraries=places&async=true&defer=true`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps && !mapInstance.current) {
        initMap();
      }
    };
    script.onerror = () => {
      setError('Nie udało się załadować Google Maps. Sprawdź połączenie z internetem.');
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      const mapOptions = {
        center: { lat: 52.2297, lng: 21.0122 }, // Warszawa
        zoom: 6,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };

      mapInstance.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Dodaj marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat: 52.2297, lng: 21.0122 },
        map: mapInstance.current,
        draggable: false,
        title: 'Wybrana lokalizacja'
      });

    } catch (error) {
      console.error('Błąd inicjalizacji mapy:', error);
      setError('Błąd inicjalizacji mapy Google Maps');
    }
  };

  const fetchVoivodeships = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/locations/voivodeships`);
      const data = await response.json();
      setVoivodeships(data);
    } catch (error) {
      console.error('Błąd pobierania województw:', error);
      setError('Nie udało się pobrać listy województw');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCounties = async (voivodeshipCode) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/locations/voivodeships/${voivodeshipCode}/counties`);
      const data = await response.json();
      setCounties(data.counties || []);
    } catch (error) {
      console.error('Błąd pobierania powiatów:', error);
      setError('Nie udało się pobrać listy powiatów');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMunicipalities = async (countyCode) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/locations/counties/${countyCode}/municipalities`);
      const data = await response.json();
      setMunicipalities(data.municipalities || []);
    } catch (error) {
      console.error('Błąd pobierania gmin:', error);
      setError('Nie udało się pobrać listy gmin');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTowns = async (municipalityCode) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/locations/municipalities/${municipalityCode}/towns`);
      const data = await response.json();
      setTowns(data.towns || []);
    } catch (error) {
      console.error('Błąd pobierania miejscowości:', error);
      setError('Nie udało się pobrać listy miejscowości');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = async (type, code, name) => {
    try {
      setIsLoading(true);
      setError('');

      // Pobierz szczegóły lokalizacji
      const response = await fetch(`/api/locations/${code}`);
      const locationData = await response.json();

      setSelectedLocation(locationData);

      // Zaktualizuj mapę
      if (mapInstance.current && locationData.coordinates) {
        const position = {
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng
        };

        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(type === 'miejscowość' ? 12 : type === 'gmina' ? 10 : type === 'powiat' ? 8 : 6);
        
        if (markerRef.current) {
          markerRef.current.setPosition(position);
        }
      }

    } catch (error) {
      console.error('Błąd pobierania szczegółów lokalizacji:', error);
      setError('Nie udało się pobrać szczegółów lokalizacji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoivodeshipChange = (e) => {
    const value = e.target.value;
    setSelectedVoivodeship(value);
    if (value) {
      const voivodeship = voivodeships.find(v => v.code === value);
      if (voivodeship) {
        handleLocationSelect('województwo', value, voivodeship.name);
      }
    }
  };

  const handleCountyChange = (e) => {
    const value = e.target.value;
    setSelectedCounty(value);
    if (value) {
      const county = counties.find(c => c.code === value);
      if (county) {
        handleLocationSelect('powiat', value, county.name);
      }
    }
  };

  const handleMunicipalityChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipality(value);
    if (value) {
      const municipality = municipalities.find(m => m.code === value);
      if (municipality) {
        handleLocationSelect('gmina', value, municipality.name);
      }
    }
  };

  const handleTownChange = (e) => {
    const value = e.target.value;
    setSelectedTown(value);
    if (value) {
      const town = towns.find(t => t.code === value);
      if (town) {
        handleLocationSelect('miejscowość', value, town.name);
      }
    }
  };

  const handleSetAsLocation = () => {
    if (selectedLocation) {
      // Zapisz wybraną lokalizację w localStorage lub kontekście
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
      
      // Przekieruj do strony głównej lub innej strony
      navigate('/');
    }
  };

  const handleViewLocationData = () => {
    if (selectedLocation) {
      navigate(`/locations/${selectedLocation._id}`);
    }
  };

  return (
    <MapPageContainer theme={theme}>
      <MapHeader>
        <MapTitle>Mapa Lokalizacji</MapTitle>
        <MapSubtitle>
          Wybierz lokalizację z hierarchii administracyjnej Polski
        </MapSubtitle>
      </MapHeader>

      {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}

      <LocationControls>
        <LocationSelect 
          value={selectedVoivodeship} 
          onChange={handleVoivodeshipChange}
          theme={theme}
        >
          <option value="">Wybierz województwo</option>
          {voivodeships.map((voivodeship, index) => (
            <option key={`voivodeship-${voivodeship.code}-${index}`} value={voivodeship.code}>
              {voivodeship.name}
            </option>
          ))}
        </LocationSelect>

        <LocationSelect 
          value={selectedCounty} 
          onChange={handleCountyChange}
          disabled={!selectedVoivodeship}
          theme={theme}
        >
          <option value="">Wybierz powiat</option>
          {counties.map((county, index) => (
            <option key={`county-${county.code}-${index}`} value={county.code}>
              {county.name}
            </option>
          ))}
        </LocationSelect>

        <LocationSelect 
          value={selectedMunicipality} 
          onChange={handleMunicipalityChange}
          disabled={!selectedCounty}
          theme={theme}
        >
          <option value="">Wybierz gminę</option>
          {municipalities.map((municipality, index) => (
            <option key={`municipality-${municipality.code}-${index}`} value={municipality.code}>
              {municipality.name}
            </option>
          ))}
        </LocationSelect>

        <LocationSelect 
          value={selectedTown} 
          onChange={handleTownChange}
          disabled={!selectedMunicipality}
          theme={theme}
        >
          <option value="">Wybierz miejscowość</option>
          {towns.map((town, index) => (
            <option key={`town-${town.code}-${index}`} value={town.code}>
              {town.name}
            </option>
          ))}
        </LocationSelect>
      </LocationControls>

      <MapContainer theme={theme}>
        {window.google && window.google.maps ? (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <MapPlaceholder theme={theme}>
            {isLoading ? (
              <>
                <LoadingSpinner theme={theme} />
                <p>Ładowanie mapy...</p>
              </>
            ) : (
              <>
                <p>🗺️ Mapa Google Maps</p>
                <p>Wybierz lokalizację z listy powyżej</p>
              </>
            )}
          </MapPlaceholder>
        )}
      </MapContainer>

      {selectedLocation && (
        <LocationInfo theme={theme}>
          <LocationTitle>
            {selectedLocation.name} ({selectedLocation.type})
          </LocationTitle>
          
          <LocationDetails>
            <DetailItem>
              <DetailLabel>Typ:</DetailLabel>
              <DetailValue>{selectedLocation.type}</DetailValue>
            </DetailItem>
            
            {selectedLocation.code && (
              <DetailItem>
                <DetailLabel>Kod TERYT:</DetailLabel>
                <DetailValue>{selectedLocation.code}</DetailValue>
              </DetailItem>
            )}
            
            {selectedLocation.population && (
              <DetailItem>
                <DetailLabel>Liczba mieszkańców:</DetailLabel>
                <DetailValue>{selectedLocation.population.toLocaleString()}</DetailValue>
              </DetailItem>
            )}
            
            {selectedLocation.area && (
              <DetailItem>
                <DetailLabel>Powierzchnia:</DetailLabel>
                <DetailValue>{selectedLocation.area} km²</DetailValue>
              </DetailItem>
            )}
            
            {selectedLocation.coordinates && (
              <DetailItem>
                <DetailLabel>Współrzędne:</DetailLabel>
                <DetailValue>
                  {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </DetailValue>
              </DetailItem>
            )}
          </LocationDetails>

          <LocationActions>
            <ActionButton 
              className="primary" 
              onClick={handleSetAsLocation}
              theme={theme}
            >
              Ustaw jako moją lokalizację
            </ActionButton>
            
            <ActionButton 
              onClick={handleViewLocationData}
              theme={theme}
            >
              Zobacz dane lokalizacji
            </ActionButton>
          </LocationActions>
        </LocationInfo>
      )}
    </MapPageContainer>
  );
} 