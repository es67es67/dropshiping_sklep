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

const CountiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CountyCard = styled(Link)`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CountyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CountyIcon = styled.div`
  font-size: 2rem;
`;

const CountyInfo = styled.div`
  flex: 1;
`;

const CountyName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CountyCode = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const CountyType = styled.div`
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-top: 0.5rem;
`;

const CountyStats = styled.div`
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
 * Strona zarządzania powiatami dla wybranego województwa
 * Wyświetla listę powiatów z możliwością wyszukiwania i filtrowania
 * oraz nawigacji do szczegółów gmin
 */
export default function Counties() {
  const { voivodeshipCode } = useParams();
  const [counties, setCounties] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voivodeship, setVoivodeship] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    municipalities: 0
  });

  useEffect(() => {
    fetchCounties();
  }, [voivodeshipCode]);

  useEffect(() => {
    let filtered = counties.filter(county =>
      county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      county.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (typeFilter !== 'all') {
      filtered = filtered.filter(county => county.type === typeFilter);
    }

    setFilteredCounties(filtered);
  }, [searchTerm, typeFilter, counties]);

  /**
   * Pobiera listę powiatów dla wybranego województwa
   */
  const fetchCounties = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/voivodeships/${voivodeshipCode}/counties`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania powiatów');
      }
      const data = await response.json();
      setCounties(data.counties || []);
      setVoivodeship(data.voivodeship);
      
      // Oblicz statystyki
      setStats({
        total: data.counties?.length || 0,
        active: data.counties?.filter(c => c.active).length || 0,
        municipalities: data.counties?.reduce((sum, c) => sum + (c.municipalitiesCount || 0), 0) || 0
      });
    } catch (err) {
      setError(err.message);
      // Fallback do danych mockowych
      const mockCounties = [
        { id: 1, name: 'Wrocław', code: '0261', type: 'miasto na prawach powiatu', municipalitiesCount: 1, active: true },
        { id: 2, name: 'Wałbrzych', code: '0262', type: 'miasto na prawach powiatu', municipalitiesCount: 1, active: true },
        { id: 3, name: 'Legnica', code: '0263', type: 'miasto na prawach powiatu', municipalitiesCount: 1, active: true },
        { id: 4, name: 'Jelenia Góra', code: '0264', type: 'miasto na prawach powiatu', municipalitiesCount: 1, active: true },
        { id: 5, name: 'bolesławiecki', code: '0201', type: 'powiat', municipalitiesCount: 6, active: true },
        { id: 6, name: 'dzierżoniowski', code: '0202', type: 'powiat', municipalitiesCount: 7, active: true },
        { id: 7, name: 'głogowski', code: '0203', type: 'powiat', municipalitiesCount: 6, active: true },
        { id: 8, name: 'górowski', code: '0204', type: 'powiat', municipalitiesCount: 4, active: true },
        { id: 9, name: 'jaworski', code: '0205', type: 'powiat', municipalitiesCount: 6, active: true },
        { id: 10, name: 'jeleniogórski', code: '0206', type: 'powiat', municipalitiesCount: 9, active: true },
        { id: 11, name: 'kamiennogórski', code: '0207', type: 'powiat', municipalitiesCount: 4, active: true },
        { id: 12, name: 'kłodzki', code: '0208', type: 'powiat', municipalitiesCount: 14, active: true },
        { id: 13, name: 'legnicki', code: '0209', type: 'powiat', municipalitiesCount: 8, active: true },
        { id: 14, name: 'lubański', code: '0210', type: 'powiat', municipalitiesCount: 7, active: true },
        { id: 15, name: 'lubiński', code: '0211', type: 'powiat', municipalitiesCount: 4, active: true },
        { id: 16, name: 'lwówecki', code: '0212', type: 'powiat', municipalitiesCount: 5, active: true },
        { id: 17, name: 'milicki', code: '0213', type: 'powiat', municipalitiesCount: 3, active: true },
        { id: 18, name: 'oleśnicki', code: '0214', type: 'powiat', municipalitiesCount: 8, active: true },
        { id: 19, name: 'oławski', code: '0215', type: 'powiat', municipalitiesCount: 4, active: true },
        { id: 20, name: 'polkowicki', code: '0216', type: 'powiat', municipalitiesCount: 6, active: true },
        { id: 21, name: 'strzeliński', code: '0217', type: 'powiat', municipalitiesCount: 5, active: true },
        { id: 22, name: 'średzki', code: '0218', type: 'powiat', municipalitiesCount: 5, active: true },
        { id: 23, name: 'świdnicki', code: '0219', type: 'powiat', municipalitiesCount: 8, active: true },
        { id: 24, name: 'trzebnicki', code: '0220', type: 'powiat', municipalitiesCount: 6, active: true },
        { id: 25, name: 'wałbrzyski', code: '0221', type: 'powiat', municipalitiesCount: 9, active: true },
        { id: 26, name: 'wołowski', code: '0222', type: 'powiat', municipalitiesCount: 3, active: true },
        { id: 27, name: 'wrocławski', code: '0223', type: 'powiat', municipalitiesCount: 9, active: true },
        { id: 28, name: 'ząbkowicki', code: '0224', type: 'powiat', municipalitiesCount: 7, active: true },
        { id: 29, name: 'zgorzelecki', code: '0225', type: 'powiat', municipalitiesCount: 7, active: true },
        { id: 30, name: 'złotoryjski', code: '0226', type: 'powiat', municipalitiesCount: 6, active: true }
      ];
      setCounties(mockCounties);
      setVoivodeship({ name: 'Dolnośląskie', code: voivodeshipCode });
      setStats({
        total: mockCounties.length,
        active: mockCounties.filter(c => c.active).length,
        municipalities: mockCounties.reduce((sum, c) => sum + (c.municipalitiesCount || 0), 0)
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Ładowanie powiatów...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink to="/voivodeships">🏛️ Województwa</BreadcrumbLink>
        <span>→</span>
        <span>{voivodeship?.name || 'Województwo'}</span>
      </Breadcrumb>

      <Header>
        <Title>🏘️ Powiaty - {voivodeship?.name}</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Wszystkie powiaty</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.active}</StatNumber>
          <StatLabel>Aktywne powiaty</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.municipalities}</StatNumber>
          <StatLabel>Łącznie gmin</StatLabel>
        </StatCard>
      </StatsGrid>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Wyszukaj powiat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Wszystkie typy</option>
          <option value="powiat">Powiat</option>
          <option value="miasto na prawach powiatu">Miasto na prawach powiatu</option>
        </FilterSelect>
      </SearchContainer>

      <CountiesGrid>
        {filteredCounties.map(county => (
          <CountyCard key={county.id} to={`/municipalities/${county.code}`}>
            <CountyHeader>
              <CountyIcon>🏘️</CountyIcon>
              <CountyInfo>
                <CountyName>{county.name}</CountyName>
                <CountyCode>Kod: {county.code}</CountyCode>
                <CountyType>{county.type}</CountyType>
              </CountyInfo>
            </CountyHeader>
            
            <CountyStats>
              <Stat>
                <StatValue>{county.municipalitiesCount || 0}</StatValue>
                <StatText>Gmin</StatText>
              </Stat>
              <Stat>
                <StatValue>{county.active ? '✅' : '❌'}</StatValue>
                <StatText>Status</StatText>
              </Stat>
            </CountyStats>
          </CountyCard>
        ))}
      </CountiesGrid>
    </Container>
  );
} 