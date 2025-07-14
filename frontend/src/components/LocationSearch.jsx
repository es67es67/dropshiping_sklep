import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LocationSearch.css';

const LocationSearch = ({ onLocationSelect, onClose }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [minPopulation, setMinPopulation] = useState('');
  const [maxPopulation, setMaxPopulation] = useState('');
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const locationTypes = [
    { value: 'województwo', label: 'Województwo' },
    { value: 'powiat', label: 'Powiat' },
    { value: 'gmina', label: 'Gmina' },
    { value: 'miejscowość', label: 'Miejscowość' },
    { value: 'ulica', label: 'Ulica' }
  ];

  const availableTags = [
    'turystyka', 'handel', 'kultura', 'przemysł', 'edukacja', 'sport',
    'zdrowie', 'transport', 'gastronomia', 'rozrywka', 'natura', 'historia'
  ];

  const availableFeatures = [
    'lotnisko', 'port', 'centrum handlowe', 'muzeum', 'teatr', 'kino',
    'park', 'szpital', 'szkoła', 'uniwersytet', 'stacja kolejowa', 'autostrada'
  ];

  const searchLocations = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        order: sortOrder
      });

      if (searchQuery) params.append('query', searchQuery);
      if (selectedTypes.length > 0) params.append('types', selectedTypes.join(','));
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      if (selectedFeatures.length > 0) params.append('features', selectedFeatures.join(','));
      if (minPopulation) params.append('minPopulation', minPopulation);
      if (maxPopulation) params.append('maxPopulation', maxPopulation);
      if (hasCoordinates) params.append('hasCoordinates', 'true');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/locations/search/advanced?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLocations(data.locations);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        console.error('Błąd wyszukiwania:', data.error);
      }
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchLocations();
  }, [searchQuery, selectedTypes, selectedTags, selectedFeatures, minPopulation, maxPopulation, hasCoordinates, sortBy, sortOrder]);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleLocationSelect = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    if (onClose) {
      onClose();
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedTags([]);
    setSelectedFeatures([]);
    setMinPopulation('');
    setMaxPopulation('');
    setHasCoordinates(false);
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="location-search">
      <div className="search-header">
        <h3>Zaawansowane wyszukiwanie lokalizacji</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="search-filters">
        {/* Wyszukiwanie tekstowe */}
        <div className="filter-group">
          <label>Wyszukiwanie:</label>
          <input
            type="text"
            placeholder="Nazwa lokalizacji, opis, tagi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Typy lokalizacji */}
        <div className="filter-group">
          <label>Typy lokalizacji:</label>
          <div className="checkbox-group">
            {locationTypes.map(type => (
              <label key={type.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => handleTypeToggle(type.value)}
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Tagi */}
        <div className="filter-group">
          <label>Tagi:</label>
          <div className="checkbox-group">
            {availableTags.map(tag => (
              <label key={tag} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Funkcje */}
        <div className="filter-group">
          <label>Funkcje:</label>
          <div className="checkbox-group">
            {availableFeatures.map(feature => (
              <label key={feature} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        {/* Populacja */}
        <div className="filter-group">
          <label>Populacja:</label>
          <div className="population-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPopulation}
              onChange={(e) => setMinPopulation(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPopulation}
              onChange={(e) => setMaxPopulation(e.target.value)}
            />
          </div>
        </div>

        {/* Koordynaty */}
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hasCoordinates}
              onChange={(e) => setHasCoordinates(e.target.checked)}
            />
            Tylko z koordynatami
          </label>
        </div>

        {/* Sortowanie */}
        <div className="filter-group">
          <label>Sortowanie:</label>
          <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Nazwa</option>
              <option value="population">Populacja</option>
              <option value="createdAt">Data utworzenia</option>
              <option value="stats.totalUsers">Liczba użytkowników</option>
              <option value="stats.totalShops">Liczba sklepów</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Rosnąco</option>
              <option value="desc">Malejąco</option>
            </select>
          </div>
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Wyczyść filtry
        </button>
      </div>

      {/* Wyniki */}
      <div className="search-results">
        {loading ? (
          <div className="loading">Ładowanie...</div>
        ) : (
          <>
            <div className="results-header">
              <span>Znaleziono: {pagination.total || 0} lokalizacji</span>
            </div>
            
            <div className="locations-list">
              {locations.map(location => (
                <div key={location._id} className="location-item" onClick={() => handleLocationSelect(location)}>
                  <div className="location-info">
                    <h4>{location.name}</h4>
                    <p className="location-type">{location.type}</p>
                    {location.description && (
                      <p className="location-description">{location.description}</p>
                    )}
                    {location.population && (
                      <p className="location-population">Populacja: {location.population.toLocaleString()}</p>
                    )}
                    {location.tags && location.tags.length > 0 && (
                      <div className="location-tags">
                        {location.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="location-stats">
                    <div className="stat">
                      <span className="stat-label">Użytkownicy:</span>
                      <span className="stat-value">{location.stats?.totalUsers || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Sklepy:</span>
                      <span className="stat-value">{location.stats?.totalShops || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Produkty:</span>
                      <span className="stat-value">{location.stats?.totalProducts || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginacja */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => searchLocations(currentPage - 1)}
                >
                  Poprzednia
                </button>
                <span>Strona {currentPage} z {pagination.pages}</span>
                <button 
                  disabled={currentPage === pagination.pages}
                  onClick={() => searchLocations(currentPage + 1)}
                >
                  Następna
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationSearch; 