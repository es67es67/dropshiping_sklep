import React from 'react';
import PageTitle from '../components/PageTitle';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MapPageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  padding: 2rem;
`;

const MapHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MapTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00D4AA;
  margin-bottom: 0.5rem;
`;

const MapSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #ddd;
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
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #666;
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
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #00D4AA;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.2);
  }
  
  &:hover {
    border-color: #00D4AA;
  }
`;

const LocationInfo = styled.div`
  background: white;
  border: 2px solid #ddd;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const LocationTitle = styled.h2`
  font-size: 1.5rem;
  color: #00D4AA;
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
  color: #666;
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #333;
`;

const LocationActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #00D4AA;
    background: rgba(0, 212, 170, 0.1);
  }
  
  &.primary {
    background: #00D4AA;
    color: white;
    border-color: #00D4AA;
    
    &:hover {
      background: #00B894;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ddd;
  border-radius: 50%;
  border-top-color: #00D4AA;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ZoomControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ZoomButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const LayerControl = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LayerButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin: 2px 0;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#00D4AA' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${props => props.active ? '#00B894' : '#f5f5f5'};
  }
`;

const NavigationInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 300px;
`;

export default function LocationMap() {
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
  
  // Nowe stany dla interaktywnej mapy
  const [currentLayer, setCurrentLayer] = useState('województwo');
  const [boundaries, setBoundaries] = useState([]);
  const [mapZoom, setMapZoom] = useState(6);
  const [navigationInfo, setNavigationInfo] = useState('');

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const infowindowRef = useRef(null);
  const polygonsRef = useRef([]);

  useEffect(() => {
    fetchVoivodeships();
    initGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      loadBoundaries();
    }
  }, [mapLoaded, currentLayer]);

  const loadBoundaries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/locations/boundaries?type=${currentLayer}`);
      const data = await response.json();
      
      if (data.success) {
        setBoundaries(data.boundaries);
        drawBoundaries(data.boundaries);
      }
    } catch (error) {
      console.error('Błąd ładowania granic:', error);
      setError('Nie udało się załadować granic administracyjnych');
    } finally {
      setIsLoading(false);
    }
  };

  const drawBoundaries = (boundariesData) => {
    if (!mapInstance.current || !window.google) return;

    // Usuń poprzednie polygon
    polygonsRef.current.forEach(polygon => {
      polygon.setMap(null);
    });
    polygonsRef.current = [];

    boundariesData.forEach(boundary => {
      // Utwórz prostokątny polygon dla każdej jednostki administracyjnej
      const bounds = boundary.bounds;
      const polygon = new window.google.maps.Polygon({
        paths: [
          { lat: bounds.north, lng: bounds.west },
          { lat: bounds.north, lng: bounds.east },
          { lat: bounds.south, lng: bounds.east },
          { lat: bounds.south, lng: bounds.west }
        ],
        strokeColor: '#00D4AA',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00D4AA',
        fillOpacity: 0.1,
        map: mapInstance.current,
        title: boundary.name
      });

      // Dodaj event listener do kliknięcia - wyświetl InfoWindow z menu
      polygon.addListener('click', (event) => {
        // Przesuń mapę do klikniętego obszaru
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: boundary.bounds.north, lng: boundary.bounds.west });
        bounds.extend({ lat: boundary.bounds.south, lng: boundary.bounds.east });
        
        mapInstance.current.fitBounds(bounds);
        
        // Wyświetl InfoWindow z menu wyboru poziomu administracyjnego
        if (infowindowRef.current) {
          infowindowRef.current.setContent(`
            <div style=\"padding: 15px; max-width: 250px; font-family: Arial, sans-serif;\">
              <div style=\"margin-bottom: 10px;\">
                <strong style=\"font-size: 16px; color: #333;\">${boundary.name}</strong>
              </div>
              <div style=\"margin-bottom: 8px;\">
                <span style=\"color: #666; font-size: 0.9em;\">Typ: ${boundary.type}</span>
              </div>
              <div style=\"margin-bottom: 8px;\">
                <span style=\"color: #666; font-size: 0.9em;\">Kod: ${boundary.code}</span>
              </div>
              <div style=\"margin-top: 12px;\">
                <label style=\"display: block; margin-bottom: 5px; font-weight: 600; color: #333; font-size: 14px;\">
                  Przejdź do poziomu:
                </label>
                <select id=\"levelSelect\" onchange=\"window.navigateToSelectedLevel()\" style=\"width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; background: white; cursor: pointer;\">
                  <option value=\"\">Wybierz poziom administracyjny...</option>
                  <option value=\"wojewodztwo\">Województwo</option>
                  <option value=\"powiat\">Powiat</option>
                  <option value=\"gmina\">Gmina</option>
                  <option value=\"miejscowosc\">Miejscowość</option>
                </select>
              </div>
            </div>
          `);
          infowindowRef.current.setPosition(event.latLng);
          infowindowRef.current.open(mapInstance.current);
        }

        // Dodaj funkcję do window dla automatycznej nawigacji
        window.navigateToSelectedLevel = () => {
          const select = document.getElementById('levelSelect');
          const selectedLevel = select.value;
          
          if (!selectedLevel) {
            return; // Nie rób nic jeśli nic nie wybrano
          }
          
          // Automatycznie przekieruj na odpowiednią stronę na podstawie wybranego poziomu
          const hierarchy = boundary.hierarchy || {};
          
          switch (selectedLevel) {
            case 'wojewodztwo':
              if (hierarchy.wojewodztwo) {
                window.location.href = `/voivodeships/${hierarchy.wojewodztwo.code}`;
              } else {
                window.location.href = `/voivodeships/${boundary.code.substring(0, 2)}`;
              }
              break;
            case 'powiat':
              if (hierarchy.powiat) {
                window.location.href = `/counties/${hierarchy.powiat.code}`;
              } else {
                window.location.href = `/counties/${boundary.code.substring(0, 4)}`;
              }
              break;
            case 'gmina':
              if (hierarchy.gmina) {
                window.location.href = `/municipalities/${hierarchy.gmina.code}`;
              } else {
                window.location.href = `/municipalities/${boundary.code.substring(0, 6)}`;
              }
              break;
            case 'miejscowosc':
              window.location.href = `/cities/${boundary.code}`;
              break;
            default:
              console.log('Nieprawidłowy poziom administracyjny');
          }
        };
      });

      // Dodaj event listener do najechania - tylko podświetlenie
      polygon.addListener('mouseover', () => {
        polygon.setOptions({
          fillOpacity: 0.3,
          strokeWeight: 3
        });
        setNavigationInfo(`Kliknij aby przejść do: ${boundary.name}`);
      });

      polygon.addListener('mouseout', () => {
        polygon.setOptions({
          fillOpacity: 0.1,
          strokeWeight: 2
        });
        setNavigationInfo('');
        // NIE zamykaj InfoWindow na mouseout - zostaw otwarte po kliknięciu
      });

      polygonsRef.current.push(polygon);
    });
  };

  const navigateToLocationPage = (type, code, name) => {
    switch (type) {
      case 'województwo':
        navigate('/voivodeships', { state: { selectedVoivodeship: { code, name } } });
        break;
      case 'powiat':
      case 'miasto na prawach powiatu':
        navigate(`/counties/${code}`, { state: { selectedCounty: { code, name } } });
        break;
      case 'gmina':
        navigate(`/municipalities/${code}`, { state: { selectedMunicipality: { code, name } } });
        break;
      case 'miejscowość':
        // Można dodać stronę dla miejscowości
        alert(`Przejście do miejscowości: ${name}`);
        break;
      default:
        alert(`Przejście do: ${name} (${type})`);
    }
  };

  const handleLayerChange = (layer) => {
    setCurrentLayer(layer);
    setMapZoom(layer === 'województwo' ? 6 : layer === 'powiat' ? 8 : layer === 'gmina' ? 10 : 12);
    
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapZoom);
    }
  };

  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapInstance.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapInstance.current.getZoom() - 1);
    }
  };

  const initGoogleMaps = async () => {
    try {
      // Sprawdź czy Google Maps API jest dostępne
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // Jeśli nie, załaduj Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API załadowane');
        initMap();
      };
      
      script.onerror = () => {
        console.error('Błąd ładowania Google Maps API');
        setError('Nie udało się załadować Google Maps API');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Błąd inicjalizacji Google Maps:', error);
      setError('Błąd inicjalizacji Google Maps');
    }
  };

  const initMap = () => {
    try {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API nie jest dostępne');
        setError('Google Maps API nie jest dostępne');
        return;
      }

      // Utwórz mapę
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 52.2297, lng: 21.0122 }, // Warszawa
        zoom: mapZoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstance.current = map;

      // Utwórz marker
      const marker = new window.google.maps.Marker({
        position: { lat: 52.2297, lng: 21.0122 },
        map: map,
        title: 'Warszawa'
      });

      markerRef.current = marker;

      // Utwórz InfoWindow
      const infowindow = new window.google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><strong>Warszawa</strong><br>Stolica Polski</div>'
      });

      infowindowRef.current = infowindow;

      // Dodaj event listener do markera
      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });

      // Dodaj event listener do kliknięcia na mapę
      map.addListener('click', (event) => {
        handleMapClick(event);
      });

      setMapLoaded(true);
      console.log('Google Maps zainicjalizowane pomyślnie');
    } catch (error) {
      console.error('Błąd inicjalizacji mapy:', error);
      setError('Błąd inicjalizacji mapy Google Maps');
    }
  };

  const handleMapClick = async (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      const response = await fetch(`/api/locations/by-coordinates?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedLocation(data.location);
        
        // Pokaż InfoWindow z informacją o lokalizacji
        if (infowindowRef.current) {
          infowindowRef.current.setContent(`
            <div style="padding: 10px; max-width: 200px;">
              <strong>${data.location.name}</strong><br>
              <span style="color: #666; font-size: 0.9em;">${data.location.type}</span><br>
              <span style="color: #666; font-size: 0.9em;">Współrzędne: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
            </div>
          `);
          infowindowRef.current.setPosition(event.latLng);
          infowindowRef.current.open(mapInstance.current);
        }
      }
    } catch (error) {
      console.error('Błąd pobierania lokalizacji po współrzędnych:', error);
    }
  };

  const fetchVoivodeships = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/locations/voivodeships');
      const data = await response.json();
      setVoivodeships(data || []);
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

      // Symulacja pobierania szczegółów lokalizacji
      const mockLocationData = {
        id: code,
        name: name,
        type: type,
        code: code,
        coordinates: {
          lat: 52.2297 + Math.random() * 0.1,
          lng: 21.0122 + Math.random() * 0.1
        }
      };

      setSelectedLocation(mockLocationData);

      // Jeśli mapa jest załadowana, przesuń do lokalizacji
      if (mapLoaded && mapInstance.current && markerRef.current && mockLocationData.coordinates) {
        const map = mapInstance.current;
        const marker = markerRef.current;
        
        const position = {
          lat: mockLocationData.coordinates.lat,
          lng: mockLocationData.coordinates.lng
        };

        map.setCenter(position);
        map.setZoom(12);
        marker.setPosition(position);
        marker.setMap(map);

        // Pokaż InfoWindow
        if (infowindowRef.current) {
          infowindowRef.current.setContent(`
            <div style="padding: 10px; max-width: 200px;">
              <strong>${mockLocationData.name}</strong><br>
              <span style="color: #666; font-size: 0.9em;">${mockLocationData.type}</span><br>
              <span style="color: #666; font-size: 0.9em;">Kod: ${mockLocationData.code}</span>
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
    setSelectedCounty('');
    setSelectedMunicipality('');
    setSelectedTown('');
    setCounties([]);
    setMunicipalities([]);
    setTowns([]);
    
    if (value) {
      const voivodeship = voivodeships.find(v => v.code === value);
      if (voivodeship) {
        handleLocationSelect('województwo', value, voivodeship.name);
        fetchCounties(value);
      }
    }
  };

  const handleCountyChange = (e) => {
    const value = e.target.value;
    setSelectedCounty(value);
    setSelectedMunicipality('');
    setSelectedTown('');
    setMunicipalities([]);
    setTowns([]);
    
    if (value) {
      const county = counties.find(c => c.code === value);
      if (county) {
        handleLocationSelect('powiat', value, county.name);
        fetchMunicipalities(value);
      }
    }
  };

  const handleMunicipalityChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipality(value);
    setSelectedTown('');
    setTowns([]);
    
    if (value) {
      const municipality = municipalities.find(m => m.code === value);
      if (municipality) {
        handleLocationSelect('gmina', value, municipality.name);
        fetchTowns(value);
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
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
      alert(`Ustawiono lokalizację: ${selectedLocation.name}`);
    }
  };

  const handleViewLocationData = () => {
    if (selectedLocation) {
      alert(`Szczegóły lokalizacji: ${selectedLocation.name} (${selectedLocation.type})`);
    }
  };

  return (
    <MapPageContainer>
      <PageTitle title="Mapa lokalizacji" description="Interaktywna mapa lokalizacji" />
      <MapHeader>
        <MapTitle>Interaktywna Mapa Lokalizacji</MapTitle>
        <MapSubtitle>
          Kliknij na obszar administracyjny aby przejść do odpowiedniej strony
        </MapSubtitle>
      </MapHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <LocationControls>
        <LocationSelect 
          value={selectedVoivodeship} 
          onChange={handleVoivodeshipChange}
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
        >
          <option value="">Wybierz miejscowość</option>
          {towns.map((town, index) => (
            <option key={`town-${town.code}-${index}`} value={town.code}>
              {town.name}
            </option>
          ))}
        </LocationSelect>
      </LocationControls>

      <MapContainer>
        <MapWrapper>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          
          <MapControls>
            <ZoomControl>
              <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
              <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
            </ZoomControl>
          </MapControls>

          <LayerControl>
            <LayerButton 
              active={currentLayer === 'województwo'} 
              onClick={() => handleLayerChange('województwo')}
            >
              Województwa
            </LayerButton>
            <LayerButton 
              active={currentLayer === 'powiat'} 
              onClick={() => handleLayerChange('powiat')}
            >
              Powiaty
            </LayerButton>
            <LayerButton 
              active={currentLayer === 'gmina'} 
              onClick={() => handleLayerChange('gmina')}
            >
              Gminy
            </LayerButton>
            <LayerButton 
              active={currentLayer === 'miejscowość'} 
              onClick={() => handleLayerChange('miejscowość')}
            >
              Miejscowości
            </LayerButton>
          </LayerControl>

          {navigationInfo && (
            <NavigationInfo>
              {navigationInfo}
            </NavigationInfo>
          )}
          
          {!mapLoaded && (
            <MapPlaceholder>
              <div>Ładowanie mapy...</div>
              {isLoading && <LoadingSpinner />}
            </MapPlaceholder>
          )}
        </MapWrapper>
      </MapContainer>

      {selectedLocation && (
        <LocationInfo>
          <LocationTitle>{selectedLocation.name}</LocationTitle>
          <LocationDetails>
            <DetailItem>
              <DetailLabel>Typ</DetailLabel>
              <DetailValue>{selectedLocation.type}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Kod</DetailLabel>
              <DetailValue>{selectedLocation.code}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Współrzędne</DetailLabel>
              <DetailValue>{selectedLocation.lat}, {selectedLocation.lng}</DetailValue>
            </DetailItem>
          </LocationDetails>
          <LocationActions>
            <ActionButton onClick={handleSetAsLocation}>
              Ustaw jako lokalizację
            </ActionButton>
            <ActionButton onClick={handleViewLocationData}>
              Zobacz szczegóły
            </ActionButton>
          </LocationActions>
        </LocationInfo>
      )}
    </MapPageContainer>
  );
} 