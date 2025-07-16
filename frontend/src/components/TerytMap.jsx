import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiMapPin, FiFilter, FiSearch, FiGlobe, FiBriefcase, FiHome, FiX } from 'react-icons/fi';

const MapContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${props => props.theme.primary};
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const MapContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  min-height: 500px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersPanel = styled.div`
  background: ${props => props.theme.inputBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 0.75rem 0;
    color: ${props => props.theme.text};
    font-size: 1rem;
    font-weight: 600;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.text};
    font-size: 0.9rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    font-size: 0.9rem;
    background: ${props => props.theme.cardBackground};
    color: ${props => props.theme.text};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
    }
  }
`;

const FilterButton = styled.button`
  width: 100%;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  width: 100%;
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: #5a6268;
  }
`;

const MapArea = styled.div`
  background: #f8f9fa;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.primary};
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.text};
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const ResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-top: 1rem;
`;

const ResultItem = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
  }
  
  &.selected {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  .icon {
    margin-right: 0.5rem;
    color: ${props => props.theme.primary};
  }
  
  h4 {
    margin: 0;
    color: ${props => props.theme.text};
    font-size: 0.9rem;
  }
`;

const ResultDetails = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const TerytTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const TerytTag = styled.span`
  background: ${props => props.theme.secondary}20;
  color: ${props => props.theme.secondary};
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .spinner {
    border: 3px solid ${props => props.theme.border};
    border-top: 3px solid ${props => props.theme.primary};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin-top: 1rem;
`;

const TerytMap = () => {
  const [filters, setFilters] = useState({
    tercCode: '',
    simcCode: '',
    ulicCode: '',
    fullCode: '',
    voivodeshipCode: '',
    countyCode: '',
    municipalityCode: '',
    radius: 10,
    objectType: 'all' // all, shops, companies, users
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 52.2297, lng: 21.0122 }); // Warszawa

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchNearbyObjects = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Sprawdź czy przynajmniej jeden kod TERYT jest podany
      const hasTerytCode = filters.tercCode || filters.simcCode || 
                          filters.ulicCode || filters.fullCode ||
                          filters.voivodeshipCode || filters.countyCode || 
                          filters.municipalityCode;
      
      if (!hasTerytCode) {
        setError('Podaj przynajmniej jeden kod TERYT do wyszukiwania');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const searchParams = new URLSearchParams({
        ...filters,
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: filters.radius,
        types: filters.objectType
      });

      const response = await fetch(`/api/geocoding/search-nearby?${searchParams}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.data?.results || []);
        
        // Aktualizuj centrum mapy na podstawie pierwszego wyniku
        if (data.data?.results?.length > 0) {
          const firstResult = data.data.results[0];
          if (firstResult.location?.coordinates) {
            setMapCenter({
              lat: firstResult.location.coordinates.lat,
              lng: firstResult.location.coordinates.lng
            });
          }
        }
      } else {
        setError('Błąd podczas wyszukiwania obiektów w pobliżu');
      }
    } catch (err) {
      console.error('Błąd wyszukiwania:', err);
      setError('Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      tercCode: '',
      simcCode: '',
      ulicCode: '',
      fullCode: '',
      voivodeshipCode: '',
      countyCode: '',
      municipalityCode: '',
      radius: 10,
      objectType: 'all'
    });
    setResults([]);
    setSelectedItem(null);
    setError('');
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    
    // Aktualizuj centrum mapy na wybrany obiekt
    if (item.location?.coordinates) {
      setMapCenter({
        lat: item.location.coordinates.lat,
        lng: item.location.coordinates.lng
      });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'shop': return <FiBriefcase />;
      case 'company': return <FiGlobe />;
      case 'user': return <FiHome />;
      default: return <FiMapPin />;
    }
  };

  const renderResultItem = (item, index) => {
    const isSelected = selectedItem?._id === item._id;
    
    return (
      <ResultItem
        key={item._id || index}
        className={isSelected ? 'selected' : ''}
        onClick={() => selectItem(item)}
      >
        <ResultHeader>
          <span className="icon">{getIcon(item.type)}</span>
          <h4>
            {item.type === 'shop' && item.name}
            {item.type === 'company' && item.name}
            {item.type === 'user' && `${item.firstName} ${item.lastName}`}
          </h4>
        </ResultHeader>
        
        <ResultDetails>
          {item.type === 'shop' && item.description}
          {item.type === 'company' && item.shortDescription}
          {item.type === 'user' && item.email}
        </ResultDetails>
        
        {item.address && (
          <ResultDetails>
            📍 {item.address.city}, {item.address.street}
          </ResultDetails>
        )}
        
        {item.distance && (
          <ResultDetails>
            📏 Odległość: {item.distance.toFixed(2)} km
          </ResultDetails>
        )}
        
        {item.teryt && (
          <TerytTags>
            {item.teryt.tercCode && <TerytTag>TERC: {item.teryt.tercCode}</TerytTag>}
            {item.teryt.simcCode && <TerytTag>SIMC: {item.teryt.simcCode}</TerytTag>}
            {item.teryt.ulicCode && <TerytTag>ULIC: {item.teryt.ulicCode}</TerytTag>}
          </TerytTags>
        )}
      </ResultItem>
    );
  };

  return (
    <MapContainer>
      <MapHeader>
        <h2>🗺️ Mapa z filtrowaniem TERYT</h2>
      </MapHeader>

      <MapContent>
        <FiltersPanel>
          <FilterSection>
            <h3>Filtry TERYT</h3>
            
            <FilterGroup>
              <label>Kod TERC</label>
              <input
                type="text"
                name="tercCode"
                value={filters.tercCode}
                onChange={handleFilterChange}
                placeholder="np. 140101"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Kod SIMC</label>
              <input
                type="text"
                name="simcCode"
                value={filters.simcCode}
                onChange={handleFilterChange}
                placeholder="np. 0918123"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Kod ULIC</label>
              <input
                type="text"
                name="ulicCode"
                value={filters.ulicCode}
                onChange={handleFilterChange}
                placeholder="np. 12345"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Pełny kod TERYT</label>
              <input
                type="text"
                name="fullCode"
                value={filters.fullCode}
                onChange={handleFilterChange}
                placeholder="np. 140101091812312345"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Kod województwa</label>
              <input
                type="text"
                name="voivodeshipCode"
                value={filters.voivodeshipCode}
                onChange={handleFilterChange}
                placeholder="np. 14"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Kod powiatu</label>
              <input
                type="text"
                name="countyCode"
                value={filters.countyCode}
                onChange={handleFilterChange}
                placeholder="np. 1401"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Kod gminy</label>
              <input
                type="text"
                name="municipalityCode"
                value={filters.municipalityCode}
                onChange={handleFilterChange}
                placeholder="np. 140101"
              />
            </FilterGroup>
          </FilterSection>

          <FilterSection>
            <h3>Ustawienia wyszukiwania</h3>
            
            <FilterGroup>
              <label>Promień wyszukiwania (km)</label>
              <input
                type="number"
                name="radius"
                value={filters.radius}
                onChange={handleFilterChange}
                min="1"
                max="100"
              />
            </FilterGroup>

            <FilterGroup>
              <label>Typ obiektów</label>
              <select
                name="objectType"
                value={filters.objectType}
                onChange={handleFilterChange}
              >
                <option value="all">Wszystkie</option>
                <option value="shops">Sklepy</option>
                <option value="companies">Firmy</option>
                <option value="users">Użytkownicy</option>
              </select>
            </FilterGroup>
          </FilterSection>

          <FilterButton onClick={searchNearbyObjects} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                Wyszukiwanie...
              </>
            ) : (
              <>
                <FiSearch />
                Wyszukaj w pobliżu
              </>
            )}
          </FilterButton>

          <ClearButton onClick={clearFilters}>
            <FiX />
            Wyczyść filtry
          </ClearButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FiltersPanel>

        <div>
          <MapArea>
            {loading ? (
              <LoadingSpinner>
                <div className="spinner"></div>
              </LoadingSpinner>
            ) : results.length > 0 ? (
              <MapPlaceholder>
                <div className="icon">🗺️</div>
                <h3>Mapa z wynikami</h3>
                <p>Znaleziono {results.length} obiektów w promieniu {filters.radius}km</p>
                <p>Centrum: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
              </MapPlaceholder>
            ) : (
              <MapPlaceholder>
                <div className="icon">🗺️</div>
                <h3>Mapa TERYT</h3>
                <p>Użyj filtrów po lewej stronie, aby wyszukać obiekty</p>
                <p>Centrum: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
              </MapPlaceholder>
            )}
          </MapArea>

          {results.length > 0 && (
            <ResultsList>
              <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#333' }}>
                Wyniki ({results.length})
              </h3>
              {results.map((item, index) => renderResultItem(item, index))}
            </ResultsList>
          )}
        </div>
      </MapContent>
    </MapContainer>
  );
};

export default TerytMap; 