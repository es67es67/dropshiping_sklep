import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MapPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
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

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const infowindowRef = useRef(null);

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

  // Inicjalizacja mapy Google Maps
  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        // Czekaj na załadowanie Google Maps API
        await new Promise((resolve) => {
          if (window.google && window.google.maps) {
            resolve();
          } else {
            const checkGoogleMaps = () => {
              if (window.google && window.google.maps) {
                resolve();
              } else {
                setTimeout(checkGoogleMaps, 100);
              }
            };
            checkGoogleMaps();
          }
        });

        initMap();
      } catch (error) {
        console.error('Błąd inicjalizacji Google Maps:', error);
        setError('Nie udało się załadować Google Maps');
      }
    };

    initGoogleMaps();
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.log('Google Maps API nie jest jeszcze załadowane');
      return;
    }

    try {
      // Wyczyść kontener mapy
      mapRef.current.innerHTML = '';

      // Inicjalizuj klasyczną mapę Google Maps
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 52.2297, lng: 21.0122 }, // Centrum Polski
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Zapisz referencje
      mapInstance.current = map;

      // Dodaj marker
      const marker = new window.google.maps.Marker({
        position: { lat: 52.2297, lng: 21.0122 },
        map: map,
        title: 'Centrum Polski',
        draggable: false
      });

      markerRef.current = marker;

      // Inicjalizuj InfoWindow
      infowindowRef.current = new window.google.maps.InfoWindow();

      // Dodaj kontrolkę wyszukiwania
      const searchBox = document.createElement('div');
      searchBox.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 10px;
        min-width: 300px;
      `;
      
      searchBox.innerHTML = `
        <input 
          type="text" 
          placeholder="Wyszukaj miejsce w Polsce..." 
          style="
            width: 100%;
            height: 40px;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 0 10px;
            font-size: 14px;
            outline: none;
          "
          id="search-input"
        />
      `;
      
      mapRef.current.appendChild(searchBox);

      // Inicjalizuj Places Autocomplete
      const input = document.getElementById('search-input');
      if (input && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'pl' },
          types: ['geocode', 'establishment']
        });

        // Obsługa wyboru miejsca
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry) {
            console.log("Brak szczegółów dla: '" + place.name + "'");
            if (infowindowRef.current) {
              infowindowRef.current.close();
            }
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            return;
          }

          // Przesuń mapę do wybranego miejsca
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
          }

          // Ustaw marker
          if (markerRef.current) {
            markerRef.current.setPosition(place.geometry.location);
            markerRef.current.setMap(map);
          }

          // Pokaż InfoWindow
          if (infowindowRef.current) {
            infowindowRef.current.setContent(`
              <div style="padding: 10px; max-width: 200px;">
                <strong>${place.name}</strong><br>
                <span style="color: #666; font-size: 0.9em;">${place.formatted_address}</span>
              </div>
            `);
            infowindowRef.current.open(map, markerRef.current);
          }

          // Zaktualizuj wybraną lokalizację
          setSelectedLocation({
            name: place.name,
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            type: 'wyszukane miejsce'
          });
        });
      }

      setMapLoaded(true);
      console.log('Mapa Google Maps została zainicjalizowana');
    } catch (error) {
      console.error('Błąd inicjalizacji mapy:', error);
      setError('Nie udało się załadować mapy');
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

      // Jeśli mapa jest załadowana, przesuń do lokalizacji
      if (mapLoaded && mapInstance.current && markerRef.current && locationData.coordinates) {
        const map = mapInstance.current;
        const marker = markerRef.current;
        
        const position = {
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng
        };

        map.setCenter(position);
        map.setZoom(12);
        marker.setPosition(position);
        marker.setMap(map);

        // Pokaż InfoWindow
        if (infowindowRef.current) {
          infowindowRef.current.setContent(`
            <div style="padding: 10px; max-width: 200px;">
              <strong>${locationData.name}</strong><br>
              <span style="color: #666; font-size: 0.9em;">${locationData.type}</span><br>
              <span style="color: #666; font-size: 0.9em;">Kod: ${locationData.code}</span>
            </div>
          `);
          infowindowRef.current.open(map, marker);
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
          Wybierz lokalizację z hierarchii administracyjnej Polski lub wyszukaj miejsce
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
        <MapWrapper ref={mapRef}>
          {!mapLoaded && (
            <MapPlaceholder theme={theme}>
              {isLoading ? (
                <>
                  <LoadingSpinner theme={theme} />
                  <p>Ładowanie Google Maps...</p>
                </>
              ) : (
                <>
                  <p>🗺️ Google Maps</p>
                  <p>Inicjalizacja mapy...</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                    Google Maps API: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Skonfigurowane' : '❌ Brak klucza'}
                  </div>
                </>
              )}
            </MapPlaceholder>
          )}
        </MapWrapper>
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
            
            {selectedLocation.address && (
              <DetailItem>
                <DetailLabel>Adres:</DetailLabel>
                <DetailValue>{selectedLocation.address}</DetailValue>
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