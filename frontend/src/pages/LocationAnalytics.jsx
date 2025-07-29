import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${props => props.change >= 0 ? '#10b981' : '#ef4444'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ChartCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
`;

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.background};
  border-radius: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const TableContainer = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
`;

const TableTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
`;

const Badge = styled.span`
  background: ${props => props.variant === 'success' ? '#10b981' : props.variant === 'warning' ? '#f59e0b' : '#ef4444'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
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
 * Strona analityki lokalizacji
 * Wyświetla statystyki, wykresy i tabele z danymi o lokalizacjach
 */
export default function LocationAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalLocations: 0,
    activeLocations: 0,
    totalPopulation: 0,
    averagePopulation: 0,
    topVoivodeship: null,
    recentActivity: 0
  });
  const [topLocations, setTopLocations] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  /**
   * Pobiera dane analityczne z API
   */
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/analytics`);
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych analitycznych');
      }
      const data = await response.json();
      setStats(data.stats);
      setTopLocations(data.topLocations || []);
      setActivityData(data.activityData || []);
    } catch (err) {
      setError(err.message);
      // Fallback do danych mockowych
      setStats({
        totalLocations: 2477,
        activeLocations: 2477,
        totalPopulation: 38168000,
        averagePopulation: 15400,
        topVoivodeship: 'Mazowieckie',
        recentActivity: 156
      });
      setTopLocations([
        { name: 'Warszawa', population: 1783321, type: 'miasto', voivodeship: 'Mazowieckie' },
        { name: 'Kraków', population: 779115, type: 'miasto', voivodeship: 'Małopolskie' },
        { name: 'Łódź', population: 677286, type: 'miasto', voivodeship: 'Łódzkie' },
        { name: 'Wrocław', population: 674079, type: 'miasto', voivodeship: 'Dolnośląskie' },
        { name: 'Poznań', population: 534813, type: 'miasto', voivodeship: 'Wielkopolskie' }
      ]);
      setActivityData([
        { date: '2024-01-15', count: 12, type: 'Dodano' },
        { date: '2024-01-14', count: 8, type: 'Zaktualizowano' },
        { date: '2024-01-13', count: 15, type: 'Dodano' },
        { date: '2024-01-12', count: 6, type: 'Zaktualizowano' },
        { date: '2024-01-11', count: 10, type: 'Dodano' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
      <PageTitle title="Analizy lokalizacji" description="Analizy i statystyki lokalizacji" />
        <LoadingSpinner>Ładowanie analityki...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Analizy lokalizacji" description="Analizy i statystyki lokalizacji" />
      <Header>
        <Title>📊 Analityka Lokalizacji</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        <StatCard>
          <StatIcon>📍</StatIcon>
          <StatNumber>{stats.totalLocations.toLocaleString()}</StatNumber>
          <StatLabel>Wszystkie lokalizacje</StatLabel>
          <StatChange change={5}>+5% w tym miesiącu</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon>✅</StatIcon>
          <StatNumber>{stats.activeLocations.toLocaleString()}</StatNumber>
          <StatLabel>Aktywne lokalizacje</StatLabel>
          <StatChange change={2}>+2% w tym miesiącu</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatNumber>{(stats.totalPopulation / 1000000).toFixed(1)}M</StatNumber>
          <StatLabel>Łączna populacja</StatLabel>
          <StatChange change={0.5}>+0.5% w tym roku</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon>📈</StatIcon>
          <StatNumber>{stats.averagePopulation.toLocaleString()}</StatNumber>
          <StatLabel>Średnia populacja</StatLabel>
          <StatChange change={-1}>-1% w tym roku</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon>🏆</StatIcon>
          <StatNumber>{stats.topVoivodeship}</StatNumber>
          <StatLabel>Największe województwo</StatLabel>
          <StatChange change={0}>Bez zmian</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon>🔄</StatIcon>
          <StatNumber>{stats.recentActivity}</StatNumber>
          <StatLabel>Ostatnia aktywność</StatLabel>
          <StatChange change={12}>+12 dzisiaj</StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Rozkład populacji według województw</ChartTitle>
          <ChartContainer>
            📊 Wykres będzie dostępny po integracji z biblioteką wykresów
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Aktywność w ostatnich dniach</ChartTitle>
          <ChartContainer>
            📈 Wykres będzie dostępny po integracji z biblioteką wykresów
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <TableContainer>
        <TableTitle>Top 5 największych miast</TableTitle>
        <Table>
          <thead>
            <tr>
              <TableHeader>Pozycja</TableHeader>
              <TableHeader>Nazwa</TableHeader>
              <TableHeader>Populacja</TableHeader>
              <TableHeader>Typ</TableHeader>
              <TableHeader>Województwo</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {topLocations.map((location, index) => (
              <TableRow key={index}>
                <TableCell>#{index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.population.toLocaleString()}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell>{location.voivodeship}</TableCell>
                <TableCell>
                  <Badge variant="success">Aktywna</Badge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <TableContainer style={{ marginTop: '2rem' }}>
        <TableTitle>Ostatnia aktywność</TableTitle>
        <Table>
          <thead>
            <tr>
              <TableHeader>Data</TableHeader>
              <TableHeader>Liczba operacji</TableHeader>
              <TableHeader>Typ</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {activityData.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.count}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>
                  <Badge variant={activity.type === 'Dodano' ? 'success' : 'warning'}>
                    {activity.type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
} 