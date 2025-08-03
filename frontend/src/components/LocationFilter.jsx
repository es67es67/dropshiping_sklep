import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LocationFilterContainer = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.surface};
  }
`;

const LocationInfo = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: ${props => props.theme.surface};
  border-radius: 6px;
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const LocationFilter = ({ onFilterChange, userLocation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortByLocation, setSortByLocation] = useState(false);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    onFilterChange({
      filter,
      sortByLocation: filter === 'local' ? true : sortByLocation
    });
  };

  const handleSortByLocation = () => {
    const newSortByLocation = !sortByLocation;
    setSortByLocation(newSortByLocation);
    onFilterChange({
      filter: activeFilter,
      sortByLocation: newSortByLocation
    });
  };

  return (
    <LocationFilterContainer>
      <FilterTitle>🎯 Filtry lokalizacji</FilterTitle>
      
      <FilterOptions>
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          🌐 Wszystkie produkty
        </FilterButton>
        
        <FilterButton
          active={activeFilter === 'local'}
          onClick={() => handleFilterChange('local')}
        >
          🏠 Produkty lokalne
        </FilterButton>
        
        <FilterButton
          active={sortByLocation}
          onClick={handleSortByLocation}
        >
          📍 Sortuj po lokalizacji
        </FilterButton>
      </FilterOptions>
      
      {userLocation && (
        <LocationInfo>
          <strong>📍 Twoja lokalizacja:</strong> {userLocation.city || 'Nie ustawiona'}
          {userLocation.teryt && (
            <div style={{ marginTop: '4px', fontSize: '12px' }}>
              Kod TERYT: {userLocation.teryt.fullCode}
            </div>
          )}
        </LocationInfo>
      )}
    </LocationFilterContainer>
  );
};

export default LocationFilter; 