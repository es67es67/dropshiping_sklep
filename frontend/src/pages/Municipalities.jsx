import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

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

const MunicipalityDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.textSecondary};
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
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

/**
 * Strona zarządzania gminami dla wybranego powiatu
 * Wyświetla listę gmin z możliwością wyszukiwania i filtrowania
 * oraz szczegółowe informacje o każdej gminie
 */
export default function Municipalities() {
  const { countyCode } = useParams();
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [county, setCounty] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cities: 0,
    villages: 0
  });

  useEffect(() => {
    fetchMunicipalities();
  }, [countyCode]);

  useEffect(() => {
    let filtered = municipalities.filter(municipality =>
      municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      municipality.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (typeFilter !== 'all') {
      filtered = filtered.filter(municipality => municipality.type === typeFilter);
    }

    setFilteredMunicipalities(filtered);
  }, [searchTerm, typeFilter, municipalities]);

  /**
   * Pobiera listę gmin dla wybranego powiatu
   */
  const fetchMunicipalities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/locations/counties/${countyCode}/municipalities`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania gmin');
      }
      const data = await response.json();
      setMunicipalities(data.municipalities || []);
      setCounty(data.county);
      
      // Oblicz statystyki
      const municipalitiesData = data.municipalities || [];
      setStats({
        total: municipalitiesData.length,
        active: municipalitiesData.filter(m => m.active).length,
        cities: municipalitiesData.filter(m => m.type === 'gmina miejska').length,
        villages: municipalitiesData.filter(m => m.type === 'gmina wiejska').length
      });
    } catch (err) {
      setError(err.message);
      // Fallback do danych mockowych dla Wrocławia
      const mockMunicipalities = [
        { 
          id: 1, 
          name: 'Wrocław', 
          code: '0261011', 
          type: 'gmina miejska', 
          active: true,
          population: 674079,
          area: 292.82,
          coordinates: { lat: 51.1079, lng: 17.0385 }
        }
      ];
      setMunicipalities(mockMunicipalities);
      setCounty({ name: 'Wrocław', code: countyCode, type: 'miasto na prawach powiatu' });
      setStats({
        total: mockMunicipalities.length,
        active: mockMunicipalities.filter(m => m.active).length,
        cities: mockMunicipalities.filter(m => m.type === 'gmina miejska').length,
        villages: mockMunicipalities.filter(m => m.type === 'gmina wiejska').length
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
          {county?.name || 'Powiat'}
        </BreadcrumbLink>
        <span>→</span>
        <span>{county?.name || 'Gmina'}</span>
      </Breadcrumb>

      <Header>
        <Title>🏘️ Gminy - {county?.name}</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

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
          <StatNumber>{stats.cities}</StatNumber>
          <StatLabel>Gminy miejskie</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.villages}</StatNumber>
          <StatLabel>Gminy wiejskie</StatLabel>
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

      <MunicipalitiesGrid>
        {filteredMunicipalities.map(municipality => (
          <MunicipalityCard key={municipality.id}>
            <MunicipalityHeader>
              <MunicipalityIcon>🏘️</MunicipalityIcon>
              <MunicipalityInfo>
                <MunicipalityName>{municipality.name}</MunicipalityName>
                <MunicipalityCode>Kod: {municipality.code}</MunicipalityCode>
                <MunicipalityType>{municipality.type}</MunicipalityType>
              </MunicipalityInfo>
            </MunicipalityHeader>
            
            <MunicipalityDetails>
              <DetailRow>
                <DetailLabel>Ludność:</DetailLabel>
                <DetailValue>{municipality.population?.toLocaleString() || 'Brak danych'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Powierzchnia:</DetailLabel>
                <DetailValue>{municipality.area ? `${municipality.area} km²` : 'Brak danych'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>{municipality.active ? '✅ Aktywna' : '❌ Nieaktywna'}</DetailValue>
              </DetailRow>
            </MunicipalityDetails>
            
            <MunicipalityStats>
              <Stat>
                <StatValue>{municipality.population || 0}</StatValue>
                <StatText>Mieszkańców</StatText>
              </Stat>
              <Stat>
                <StatValue>{municipality.area || 0}</StatValue>
                <StatText>km²</StatText>
              </Stat>
            </MunicipalityStats>
          </MunicipalityCard>
        ))}
      </MunicipalitiesGrid>
    </Container>
  );
} 