import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const VoivodeshipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const VoivodeshipCard = styled(Link)`
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

const VoivodeshipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const VoivodeshipIcon = styled.div`
  font-size: 2rem;
`;

const VoivodeshipInfo = styled.div`
  flex: 1;
`;

const VoivodeshipName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const VoivodeshipCode = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const VoivodeshipStats = styled.div`
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
 * Strona zarządzania województwami
 * Wyświetla listę wszystkich województw z możliwością wyszukiwania
 * i nawigacji do szczegółów powiatów
 */
export default function Voivodeships() {
  const [voivodeships, setVoivodeships] = useState([]);
  const [filteredVoivodeships, setFilteredVoivodeships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    counties: 0
  });

  useEffect(() => {
    fetchVoivodeships();
  }, []);

  useEffect(() => {
    const filtered = voivodeships.filter(voivodeship =>
      voivodeship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voivodeship.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVoivodeships(filtered);
  }, [searchTerm, voivodeships]);

  /**
   * Pobiera listę województw z API
   */
  const fetchVoivodeships = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/voivodeships`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania województw');
      }
      const data = await response.json();
      setVoivodeships(data);
      
      // Oblicz statystyki
      setStats({
        total: data.length,
        active: data.filter(v => v.active).length,
        counties: data.reduce((sum, v) => sum + (v.countiesCount || 0), 0)
      });
    } catch (err) {
      setError(err.message);
      // Fallback do danych mockowych
      const mockData = [
        { id: 1, name: 'Dolnośląskie', code: '02', countiesCount: 26, active: true },
        { id: 2, name: 'Kujawsko-pomorskie', code: '04', countiesCount: 23, active: true },
        { id: 3, name: 'Lubelskie', code: '06', countiesCount: 24, active: true },
        { id: 4, name: 'Lubuskie', code: '08', countiesCount: 14, active: true },
        { id: 5, name: 'Łódzkie', code: '10', countiesCount: 24, active: true },
        { id: 6, name: 'Małopolskie', code: '12', countiesCount: 22, active: true },
        { id: 7, name: 'Mazowieckie', code: '14', countiesCount: 42, active: true },
        { id: 8, name: 'Opolskie', code: '16', countiesCount: 12, active: true },
        { id: 9, name: 'Podkarpackie', code: '18', countiesCount: 25, active: true },
        { id: 10, name: 'Podlaskie', code: '20', countiesCount: 17, active: true },
        { id: 11, name: 'Pomorskie', code: '22', countiesCount: 20, active: true },
        { id: 12, name: 'Śląskie', code: '24', countiesCount: 36, active: true },
        { id: 13, name: 'Świętokrzyskie', code: '26', countiesCount: 14, active: true },
        { id: 14, name: 'Warmińsko-mazurskie', code: '28', countiesCount: 21, active: true },
        { id: 15, name: 'Wielkopolskie', code: '30', countiesCount: 35, active: true },
        { id: 16, name: 'Zachodniopomorskie', code: '32', countiesCount: 21, active: true }
      ];
      setVoivodeships(mockData);
      setStats({
        total: mockData.length,
        active: mockData.filter(v => v.active).length,
        counties: mockData.reduce((sum, v) => sum + (v.countiesCount || 0), 0)
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Ładowanie województw...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🏛️ Województwa</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Wszystkie województwa</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.active}</StatNumber>
          <StatLabel>Aktywne województwa</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.counties}</StatNumber>
          <StatLabel>Łącznie powiatów</StatLabel>
        </StatCard>
      </StatsGrid>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Wyszukaj województwo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <VoivodeshipsGrid>
        {filteredVoivodeships.map(voivodeship => (
          <VoivodeshipCard key={voivodeship.id} to={`/counties/${voivodeship.code}`}>
            <VoivodeshipHeader>
              <VoivodeshipIcon>🏛️</VoivodeshipIcon>
              <VoivodeshipInfo>
                <VoivodeshipName>{voivodeship.name}</VoivodeshipName>
                <VoivodeshipCode>Kod: {voivodeship.code}</VoivodeshipCode>
              </VoivodeshipInfo>
            </VoivodeshipHeader>
            
            <VoivodeshipStats>
              <Stat>
                <StatValue>{voivodeship.countiesCount || 0}</StatValue>
                <StatText>Powiatów</StatText>
              </Stat>
              <Stat>
                <StatValue>{voivodeship.active ? '✅' : '❌'}</StatValue>
                <StatText>Status</StatText>
              </Stat>
            </VoivodeshipStats>
          </VoivodeshipCard>
        ))}
      </VoivodeshipsGrid>
    </Container>
  );
} 