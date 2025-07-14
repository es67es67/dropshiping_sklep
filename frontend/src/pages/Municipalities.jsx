import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import LocationSearch from '../components/LocationSearch';
import LocationDetails from '../components/LocationDetails';
import LocationAnalytics from '../components/LocationAnalytics';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
  }
`;

const ActionButton = styled.button`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-1px);
  }
`;

const MunicipalitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MunicipalityCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const MunicipalityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MunicipalityIcon = styled.div`
  font-size: 2rem;
`;

const MunicipalityInfo = styled.div`
  flex: 1;
`;

const MunicipalityName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const MunicipalityCode = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const MunicipalityType = styled.div`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-top: 0.5rem;
`;

const MunicipalityStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const StatText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

export default function Municipalities() {
  const { countyCode } = useParams();
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [county, setCounty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    population: 0
  });
  
  // Modal states
  const [showSearch, setShowSearch] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    if (countyCode) {
      fetchMunicipalities();
    }
  }, [countyCode]);

  useEffect(() => {
    const filtered = municipalities.filter(municipality => {
      const matchesSearch = municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           municipality.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || municipality.type === typeFilter;
      return matchesSearch && matchesType;
    });
    setFilteredMunicipalities(filtered);
  }, [searchTerm, typeFilter, municipalities]);

  /**
   * Pobiera listę gmin dla wybranego powiatu
   */
  const fetchMunicipalities = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/counties/${countyCode}/municipalities`);
      
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania gmin');
      }
      
      const data = await response.json();
      setMunicipalities(data.municipalities || []);
      setCounty(data.county);
      
      // Oblicz statystyki
      setStats({
        total: data.municipalities?.length || 0,
        active: data.municipalities?.filter(m => m.active).length || 0,
        population: data.municipalities?.reduce((sum, m) => sum + (m.population || 0), 0) || 0
      });
    } catch (err) {
      console.error('Błąd pobierania gmin:', err);
      setError(err.message);
      
      // Fallback do danych mockowych tylko w przypadku błędu
      const mockMunicipalities = [
        { id: 1, name: 'Wrocław', code: '0261011', type: 'gmina miejska', population: 641607, active: true },
        { id: 2, name: 'Oława', code: '0215011', type: 'gmina miejsko-wiejska', population: 15400, active: true },
        { id: 3, name: 'Brzeg Dolny', code: '0216011', type: 'gmina miejsko-wiejska', population: 12300, active: true },
        { id: 4, name: 'Jelcz-Laskowice', code: '0216012', type: 'gmina miejsko-wiejska', population: 15800, active: true },
        { id: 5, name: 'Miękinia', code: '0216013', type: 'gmina wiejska', population: 8900, active: true },
        { id: 6, name: 'Oława', code: '0215012', type: 'gmina wiejska', population: 7600, active: true },
        { id: 7, name: 'Siechnice', code: '0216014', type: 'gmina miejsko-wiejska', population: 11200, active: true },
        { id: 8, name: 'Żórawina', code: '0216015', type: 'gmina wiejska', population: 6800, active: true },
        { id: 9, name: 'Domaniów', code: '0216016', type: 'gmina wiejska', population: 4200, active: true }
      ];
      setMunicipalities(mockMunicipalities);
      setCounty({ name: 'wrocławski', code: countyCode, type: 'powiat' });
      setStats({
        total: mockMunicipalities.length,
        active: mockMunicipalities.filter(m => m.active).length,
        population: mockMunicipalities.reduce((sum, m) => sum + (m.population || 0), 0)
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Ładowanie gmin...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink to="/voivodeships">🏛️ Województwa</BreadcrumbLink>
        <span>→</span>
        <BreadcrumbLink to={`/counties/${county?.code?.substring(0, 2)}`}>
          🏘️ Powiaty
        </BreadcrumbLink>
        <span>→</span>
        <span>{county?.name || 'Powiat'}</span>
      </Breadcrumb>

      <Header>
        <Title>🏙️ Gminy - {county?.name}</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ActionButton onClick={() => setShowSearch(true)}>
            🔍 Zaawansowane wyszukiwanie
          </ActionButton>
          <ActionButton onClick={() => setShowAnalytics(true)}>
            📊 Analityka
          </ActionButton>
        </div>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabContainer>
        <Tab 
          active={activeTab === 'list'} 
          onClick={() => setActiveTab('list')}
        >
          📋 Lista gmin
        </Tab>
        <Tab 
          active={activeTab === 'search'} 
          onClick={() => setActiveTab('search')}
        >
          🔍 Wyszukiwanie
        </Tab>
        <Tab 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analityka
        </Tab>
      </TabContainer>

      {activeTab === 'list' && (
        <>
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>Wszystkie gminy</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.active}</StatNumber>
              <StatLabel>Aktywne gminy</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.population.toLocaleString()}</StatNumber>
              <StatLabel>Łączna populacja</StatLabel>
            </StatCard>
          </StatsGrid>

          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Wyszukaj gminę..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Wszystkie typy</option>
              <option value="gmina miejska">Gmina miejska</option>
              <option value="gmina wiejska">Gmina wiejska</option>
              <option value="gmina miejsko-wiejska">Gmina miejsko-wiejska</option>
            </FilterSelect>
          </SearchContainer>

          {filteredMunicipalities.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏙️</div>
              <h3>Nie znaleziono gmin</h3>
              <p>Spróbuj zmienić kryteria wyszukiwania</p>
            </EmptyState>
          ) : (
            <MunicipalitiesGrid>
              {filteredMunicipalities.map(municipality => (
                <MunicipalityCard 
                  key={municipality.id}
                  onClick={() => {
                    setSelectedLocation(municipality);
                    setShowDetails(true);
                  }}
                >
                  <MunicipalityHeader>
                    <MunicipalityIcon>🏙️</MunicipalityIcon>
                    <MunicipalityInfo>
                      <MunicipalityName>{municipality.name}</MunicipalityName>
                      <MunicipalityCode>Kod: {municipality.code}</MunicipalityCode>
                      <MunicipalityType>{municipality.type}</MunicipalityType>
                    </MunicipalityInfo>
                  </MunicipalityHeader>
                  
                  <MunicipalityStats>
                    <Stat>
                      <StatValue>{municipality.population?.toLocaleString() || 'N/A'}</StatValue>
                      <StatText>Populacja</StatText>
                    </Stat>
                    <Stat>
                      <StatValue>{municipality.active ? '✅' : '❌'}</StatValue>
                      <StatText>Status</StatText>
                    </Stat>
                  </MunicipalityStats>
                </MunicipalityCard>
              ))}
            </MunicipalitiesGrid>
          )}
        </>
      )}

      {activeTab === 'search' && (
        <LocationSearch 
          onLocationSelect={(location) => {
            setSelectedLocation(location);
            setShowDetails(true);
            setActiveTab('list');
          }}
          onClose={() => setActiveTab('list')}
        />
      )}

      {activeTab === 'analytics' && (
        <LocationAnalytics 
          locationType="county"
          locationId={countyCode}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* Modals */}
      {showDetails && selectedLocation && (
        <LocationDetails 
          location={selectedLocation}
          onClose={() => {
            setShowDetails(false);
            setSelectedLocation(null);
          }}
          theme="light"
        />
      )}

      {showSearch && (
        <LocationSearch 
          onLocationSelect={(location) => {
            setSelectedLocation(location);
            setShowDetails(true);
            setShowSearch(false);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showAnalytics && (
        <LocationAnalytics 
          locationType="county"
          locationId={countyCode}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </Container>
  );
} 