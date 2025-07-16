import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiMapPin, FiFilter, FiGlobe, FiHome, FiBriefcase } from 'react-icons/fi';

const TerytSearchContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${props => props.theme.primary};
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .icon {
    margin-right: 0.75rem;
    font-size: 1.5rem;
    color: ${props => props.theme.primary};
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.text};
    font-size: 0.9rem;
  }
  
  input, select {
    padding: 0.75rem;
    border: 2px solid ${props => props.theme.border};
    border-radius: 8px;
    font-size: 1rem;
    background: ${props => props.theme.inputBackground};
    color: ${props => props.theme.text};
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
    }
    
    &::placeholder {
      color: ${props => props.theme.textSecondary};
    }
  }
`;

const SearchButton = styled.button`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: ${props => props.theme.text};
  }
  
  .count {
    background: ${props => props.theme.primary};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const ResultCard = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TerytInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  .teryt-tag {
    background: ${props => props.theme.secondary}20;
    color: ${props => props.theme.secondary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
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

const TerytSearch = () => {
  const [searchParams, setSearchParams] = useState({
    tercCode: '',
    simcCode: '',
    ulicCode: '',
    fullCode: '',
    voivodeshipCode: '',
    countyCode: '',
    municipalityCode: '',
    searchType: 'all' // all, shops, companies, users
  });
  
  const [results, setResults] = useState({
    shops: [],
    companies: [],
    users: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Sprawdź czy przynajmniej jeden kod TERYT jest podany
      const hasTerytCode = searchParams.tercCode || searchParams.simcCode || 
                          searchParams.ulicCode || searchParams.fullCode ||
                          searchParams.voivodeshipCode || searchParams.countyCode || 
                          searchParams.municipalityCode;
      
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

      // Wyszukiwanie sklepów
      if (searchParams.searchType === 'all' || searchParams.searchType === 'shops') {
        const shopsResponse = await fetch(`/api/shops/search-by-teryt?${new URLSearchParams(searchParams)}`, {
          headers
        });
        
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          setResults(prev => ({ ...prev, shops: shopsData.shops || [] }));
        }
      }

      // Wyszukiwanie firm
      if (searchParams.searchType === 'all' || searchParams.searchType === 'companies') {
        const companiesResponse = await fetch(`/api/company-profiles/search-by-teryt?${new URLSearchParams(searchParams)}`, {
          headers
        });
        
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setResults(prev => ({ ...prev, companies: companiesData.companies || [] }));
        }
      }

      // Wyszukiwanie użytkowników
      if (searchParams.searchType === 'all' || searchParams.searchType === 'users') {
        const usersResponse = await fetch(`/api/users/search-by-teryt?${new URLSearchParams(searchParams)}`, {
          headers
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setResults(prev => ({ ...prev, users: usersData.users || [] }));
        }
      }

      // Oblicz całkowitą liczbę wyników
      const total = results.shops.length + results.companies.length + results.users.length;
      setTotalResults(total);

    } catch (err) {
      console.error('Błąd podczas wyszukiwania:', err);
      setError('Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      tercCode: '',
      simcCode: '',
      ulicCode: '',
      fullCode: '',
      voivodeshipCode: '',
      countyCode: '',
      municipalityCode: '',
      searchType: 'all'
    });
    setResults({ shops: [], companies: [], users: [] });
    setTotalResults(0);
    setError('');
  };

  const renderResultCard = (item, type) => {
    const getIcon = () => {
      switch (type) {
        case 'shop': return <FiBriefcase />;
        case 'company': return <FiGlobe />;
        case 'user': return <FiHome />;
        default: return <FiMapPin />;
      }
    };

    const getTerytInfo = () => {
      if (item.teryt) {
        return (
          <TerytInfo>
            {item.teryt.tercCode && <span className="teryt-tag">TERC: {item.teryt.tercCode}</span>}
            {item.teryt.simcCode && <span className="teryt-tag">SIMC: {item.teryt.simcCode}</span>}
            {item.teryt.ulicCode && <span className="teryt-tag">ULIC: {item.teryt.ulicCode}</span>}
            {item.teryt.fullCode && <span className="teryt-tag">Pełny: {item.teryt.fullCode}</span>}
          </TerytInfo>
        );
      }
      return null;
    };

    return (
      <ResultCard key={item._id}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ marginRight: '0.5rem', color: '#666' }}>{getIcon()}</span>
          <h4 style={{ margin: 0, color: '#333' }}>
            {type === 'shop' && item.name}
            {type === 'company' && item.name}
            {type === 'user' && `${item.firstName} ${item.lastName}`}
          </h4>
        </div>
        
        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
          {type === 'shop' && item.description}
          {type === 'company' && item.shortDescription}
          {type === 'user' && item.email}
        </p>
        
        {item.address && (
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            📍 {item.address.city}, {item.address.street}
          </p>
        )}
        
        {getTerytInfo()}
      </ResultCard>
    );
  };

  return (
    <TerytSearchContainer>
      <SearchHeader>
        <FiSearch className="icon" />
        <h2>Wyszukiwanie zaawansowane TERYT</h2>
      </SearchHeader>

      <SearchForm onSubmit={handleSearch}>
        <InputGroup>
          <label>Kod TERC (województwo + powiat + gmina)</label>
          <input
            type="text"
            name="tercCode"
            value={searchParams.tercCode}
            onChange={handleInputChange}
            placeholder="np. 140101"
          />
        </InputGroup>

        <InputGroup>
          <label>Kod SIMC (miejscowość)</label>
          <input
            type="text"
            name="simcCode"
            value={searchParams.simcCode}
            onChange={handleInputChange}
            placeholder="np. 0918123"
          />
        </InputGroup>

        <InputGroup>
          <label>Kod ULIC (ulica)</label>
          <input
            type="text"
            name="ulicCode"
            value={searchParams.ulicCode}
            onChange={handleInputChange}
            placeholder="np. 12345"
          />
        </InputGroup>

        <InputGroup>
          <label>Pełny kod TERYT</label>
          <input
            type="text"
            name="fullCode"
            value={searchParams.fullCode}
            onChange={handleInputChange}
            placeholder="np. 140101091812312345"
          />
        </InputGroup>

        <InputGroup>
          <label>Kod województwa</label>
          <input
            type="text"
            name="voivodeshipCode"
            value={searchParams.voivodeshipCode}
            onChange={handleInputChange}
            placeholder="np. 14"
          />
        </InputGroup>

        <InputGroup>
          <label>Kod powiatu</label>
          <input
            type="text"
            name="countyCode"
            value={searchParams.countyCode}
            onChange={handleInputChange}
            placeholder="np. 1401"
          />
        </InputGroup>

        <InputGroup>
          <label>Kod gminy</label>
          <input
            type="text"
            name="municipalityCode"
            value={searchParams.municipalityCode}
            onChange={handleInputChange}
            placeholder="np. 140101"
          />
        </InputGroup>

        <InputGroup>
          <label>Typ wyszukiwania</label>
          <select
            name="searchType"
            value={searchParams.searchType}
            onChange={handleInputChange}
          >
            <option value="all">Wszystko</option>
            <option value="shops">Sklepy</option>
            <option value="companies">Firmy</option>
            <option value="users">Użytkownicy</option>
          </select>
        </InputGroup>
      </SearchForm>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <SearchButton type="submit" onClick={handleSearch} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              Wyszukiwanie...
            </>
          ) : (
            <>
              <FiSearch />
              Wyszukaj
            </>
          )}
        </SearchButton>
        
        <SearchButton 
          type="button" 
          onClick={clearSearch}
          style={{ background: '#6c757d', color: 'white' }}
        >
          Wyczyść
        </SearchButton>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading && (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      )}

      {totalResults > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <h3>Wyniki wyszukiwania</h3>
            <span className="count">{totalResults} wyników</span>
          </ResultsHeader>

          {searchParams.searchType === 'all' || searchParams.searchType === 'shops' ? (
            results.shops.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>🏪 Sklepy ({results.shops.length})</h4>
                <ResultsGrid>
                  {results.shops.map(shop => renderResultCard(shop, 'shop'))}
                </ResultsGrid>
              </div>
            )
          ) : null}

          {searchParams.searchType === 'all' || searchParams.searchType === 'companies' ? (
            results.companies.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>🏢 Firmy ({results.companies.length})</h4>
                <ResultsGrid>
                  {results.companies.map(company => renderResultCard(company, 'company'))}
                </ResultsGrid>
              </div>
            )
          ) : null}

          {searchParams.searchType === 'all' || searchParams.searchType === 'users' ? (
            results.users.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>👤 Użytkownicy ({results.users.length})</h4>
                <ResultsGrid>
                  {results.users.map(user => renderResultCard(user, 'user'))}
                </ResultsGrid>
              </div>
            )
          ) : null}
        </ResultsSection>
      )}
    </TerytSearchContainer>
  );
};

export default TerytSearch; 