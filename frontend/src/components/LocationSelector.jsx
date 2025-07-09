import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LocationCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const CurrentLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.primary}10;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const LocationIcon = styled.div`
  font-size: 1.5rem;
`;

const LocationInfo = styled.div`
  flex: 1;
`;

const LocationName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const LocationDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
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

const LocationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const LocationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
  
  &.selected {
    background: ${props => props.theme.primary}20;
  }
`;

const ItemIcon = styled.div`
  font-size: 1.25rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ItemType = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PopularLocations = styled.div`
  margin-top: 2rem;
`;

const PopularTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const PopularGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PopularItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    transform: translateY(-2px);
  }
`;

const PopularIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PopularName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

export default function LocationSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Symulowane dane lokalizacji
  const mockLocations = [
    {
      id: 1,
      name: 'Warszawa',
      type: 'Miasto',
      region: 'Mazowieckie',
      icon: '🏙️'
    },
    {
      id: 2,
      name: 'Kraków',
      type: 'Miasto',
      region: 'Małopolskie',
      icon: '🏰'
    },
    {
      id: 3,
      name: 'Wrocław',
      type: 'Miasto',
      region: 'Dolnośląskie',
      icon: '🌉'
    },
    {
      id: 4,
      name: 'Poznań',
      type: 'Miasto',
      region: 'Wielkopolskie',
      icon: '🐐'
    },
    {
      id: 5,
      name: 'Gdańsk',
      type: 'Miasto',
      region: 'Pomorskie',
      icon: '⚓'
    },
    {
      id: 6,
      name: 'Łódź',
      type: 'Miasto',
      region: 'Łódzkie',
      icon: '🏭'
    }
  ];

  const popularLocations = [
    { name: 'Warszawa', icon: '🏙️' },
    { name: 'Kraków', icon: '🏰' },
    { name: 'Wrocław', icon: '🌉' },
    { name: 'Poznań', icon: '🐐' }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setLocations(mockLocations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      alert(`Wybrano lokalizację: ${selectedLocation.name}, ${selectedLocation.region}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie lokalizacji...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Wybierz lokalizację</Title>
      
      <LocationCard>
        <CurrentLocation>
          <LocationIcon>📍</LocationIcon>
          <LocationInfo>
            <LocationName>Twoja lokalizacja</LocationName>
            <LocationDetails>Warszawa, Mazowieckie (automatycznie wykryte)</LocationDetails>
          </LocationInfo>
        </CurrentLocation>

        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Szukaj miasta lub województwa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <LocationList>
            {filteredLocations.map(location => (
              <LocationItem
                key={location.id}
                selected={selectedLocation?.id === location.id}
                onClick={() => handleLocationSelect(location)}
              >
                <ItemIcon>{location.icon}</ItemIcon>
                <ItemInfo>
                  <ItemName>{location.name}</ItemName>
                  <ItemType>{location.type}, {location.region}</ItemType>
                </ItemInfo>
              </LocationItem>
            ))}
          </LocationList>
        </SearchSection>

        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation}
        >
          {selectedLocation 
            ? `Potwierdź: ${selectedLocation.name}` 
            : 'Wybierz lokalizację'
          }
        </Button>

        <PopularLocations>
          <PopularTitle>Popularne lokalizacje</PopularTitle>
          <PopularGrid>
            {popularLocations.map((location, index) => (
              <PopularItem
                key={index}
                onClick={() => {
                  const found = locations.find(l => l.name === location.name);
                  if (found) handleLocationSelect(found);
                }}
              >
                <PopularIcon>{location.icon}</PopularIcon>
                <PopularName>{location.name}</PopularName>
              </PopularItem>
            ))}
          </PopularGrid>
        </PopularLocations>
      </LocationCard>
    </Container>
  );
} 