import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${props => props.theme.border};
  position: relative;
  margin-bottom: 1rem;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
`;

const MapButton = styled.button`
  background: white;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    border-color: ${props => props.theme.primary};
  }
`;

const AddressInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const CoordinatesDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const CoordinateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CoordinateLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CoordinateValue = styled.span`
  font-family: monospace;
  background: ${props => props.theme.surface};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`;

const SearchButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export default function MapSelector({ 
  onLocationSelect, 
  initialAddress = '', 
  initialCoordinates = null,
  theme 
}) {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: 52.2297, lng: 21.0122 }); // Warszawa
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Inicjalizacja mapy przy pierwszym renderowaniu
    if (window.google && window.google.maps && !mapInstance.current) {
      initMap();
    } else if (!window.google) {
      // Fallback - załaduj Google Maps API dynamicznie
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
        console.warn('Google Maps API nie jest dostępne. Używam trybu fallback.');
        setError('Google Maps nie jest dostępne. Możesz ręcznie wprowadzić adres.');
      };
      document.head.appendChild(script);
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      const mapOptions = {
        center: coordinates,
        zoom: 13,
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
        position: coordinates,
        map: mapInstance.current,
        draggable: true,
        title: 'Lokalizacja sklepu'
      });

      // Obsługa kliknięcia na mapę
      mapInstance.current.addListener('click', (event) => {
        const newPosition = event.latLng;
        setCoordinates({
          lat: newPosition.lat(),
          lng: newPosition.lng()
        });
        markerRef.current.setPosition(newPosition);
        reverseGeocode(newPosition.lat(), newPosition.lng());
      });

      // Obsługa przeciągania markera
      markerRef.current.addListener('dragend', (event) => {
        const newPosition = event.latLng;
        setCoordinates({
          lat: newPosition.lat(),
          lng: newPosition.lng()
        });
        reverseGeocode(newPosition.lat(), newPosition.lng());
      });
    } catch (error) {
      console.error('Błąd podczas inicjalizacji mapy:', error);
      setError('Nie udało się załadować mapy. Możesz ręcznie wprowadzić adres.');
    }
  };

  const geocodeAddress = async () => {
    if (!address.trim()) {
      setError('Wprowadź adres do wyszukania');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API nie jest dostępne');
      }

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: address }, (results, status) => {
        setIsLoading(false);
        
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const newCoordinates = {
            lat: location.lat(),
            lng: location.lng()
          };
          
          setCoordinates(newCoordinates);
          
          if (mapInstance.current) {
            mapInstance.current.setCenter(location);
            mapInstance.current.setZoom(15);
            markerRef.current.setPosition(location);
          }
          
          setSuccess('Lokalizacja została znaleziona!');
          onLocationSelect(newCoordinates, results[0].formatted_address);
        } else {
          setError('Nie udało się znaleźć podanego adresu. Możesz ręcznie wprowadzić koordynaty.');
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError('Google Maps nie jest dostępne. Możesz ręcznie wprowadzić adres i koordynaty.');
      console.warn('Błąd geokodowania:', err);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      if (!window.google || !window.google.maps) {
        return; // Cichy fallback
      }

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          onLocationSelect({ lat, lng }, formattedAddress);
        }
      });
    } catch (err) {
      console.warn('Błąd podczas reverse geokodowania:', err);
      // Cichy fallback - nie pokazujemy błędu użytkownikowi
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    geocodeAddress();
  };

  const centerOnCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCoordinates(newCoordinates);
          
          if (mapInstance.current) {
            mapInstance.current.setCenter(newCoordinates);
            mapInstance.current.setZoom(15);
            markerRef.current.setPosition(newCoordinates);
          }
          
          reverseGeocode(newCoordinates.lat, newCoordinates.lng);
          setIsLoading(false);
          setSuccess('Lokalizacja została ustawiona na Twoją pozycję!');
        },
        (error) => {
          setIsLoading(false);
          setError('Nie udało się pobrać Twojej lokalizacji');
        }
      );
    } else {
      setError('Twoja przeglądarka nie obsługuje geolokalizacji');
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>⚠️ Uwaga:</strong> {error}
          <br />
          <small>
            Jeśli Google Maps nie działa, możesz ręcznie wprowadzić adres w polach poniżej.
            To nie wpłynie na funkcjonalność dodawania sklepu.
          </small>
        </div>
      )}

      <div>
        <AddressInput
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Wprowadź adres sklepu..."
          theme={theme}
        />
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <SearchButton 
            type="button" 
            onClick={geocodeAddress}
            disabled={isLoading}
            theme={theme}
          >
            {isLoading ? '🔍 Wyszukiwanie...' : '🔍 Wyszukaj'}
          </SearchButton>
          <SearchButton 
            type="button" 
            onClick={centerOnCurrentLocation}
            disabled={isLoading}
            style={{ background: '#10B981' }}
          >
            📍 Moja lokalizacja
          </SearchButton>
        </div>
      </div>

      <MapContainer theme={theme}>
        {window.google && window.google.maps ? (
          <>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            <MapControls>
              <MapButton 
                onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() + 1)}
                theme={theme}
              >
                ➕
              </MapButton>
              <MapButton 
                onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() - 1)}
                theme={theme}
              >
                ➖
              </MapButton>
            </MapControls>
          </>
        ) : (
          <MapPlaceholder theme={theme}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <div>Mapa Google Maps</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Kliknij na mapę, aby wybrać lokalizację sklepu
            </div>
          </MapPlaceholder>
        )}
      </MapContainer>

      <CoordinatesDisplay theme={theme}>
        <CoordinateItem>
          <CoordinateLabel>Szerokość geograficzna:</CoordinateLabel>
          <CoordinateValue>{coordinates.lat.toFixed(6)}</CoordinateValue>
        </CoordinateItem>
        <CoordinateItem>
          <CoordinateLabel>Długość geograficzna:</CoordinateLabel>
          <CoordinateValue>{coordinates.lng.toFixed(6)}</CoordinateValue>
        </CoordinateItem>
      </CoordinatesDisplay>

      {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
      {success && <SuccessMessage theme={theme}>{success}</SuccessMessage>}
    </div>
  );
} 