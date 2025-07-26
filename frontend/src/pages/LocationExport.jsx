import React from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}20;
  }
`;

const ExportSection = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const OptionCard = styled.div`
  background: ${props => props.theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OptionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.gradient};
    color: white;
    
    &:hover {
      background: ${props.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadowHover};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: ${props.theme.surface};
    color: ${props.theme.text};
    border: 2px solid ${props.theme.border};
    
    &:hover {
      background: ${props.theme.primary}20;
      border-color: ${props.theme.primary};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const DownloadLink = styled.a`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  background: ${props => props.theme.success};
  color: white;
  
  &:hover {
    background: ${props => props.theme.success}dd;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradient};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
  
  ${props => props.type === 'success' && `
    background: ${props.theme.success}20;
    color: ${props.theme.success};
  `}
  
  ${props => props.type === 'error' && `
    background: ${props.theme.error}20;
    color: ${props.theme.error};
  `}
  
  ${props => props.type === 'info' && `
    background: ${props.theme.primary}20;
    color: ${props.theme.primary};
  `}
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const HistoryCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const HistoryTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const HistoryDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const HistoryDetails = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const HistoryStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'completed' && `
    background: ${props.theme.success}20;
    color: ${props.theme.success};
  `}
  
  ${props => props.status === 'processing' && `
    background: ${props.theme.warning}20;
    color: ${props.theme.warning};
  `}
  
  ${props => props.status === 'failed' && `
    background: ${props.theme.error}20;
    color: ${props.theme.error};
  `}
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem 2rem;
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Strona eksportu danych lokalizacji
 * Umożliwia eksport danych w różnych formatach z opcjami filtrowania
 */
export default function LocationExport() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('export');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [voivodeships, setVoivodeships] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    includeHeaders: true,
    encoding: 'utf8',
    compression: false,
    includeStats: true,
    includeRelations: false
  });
  
  const [filters, setFilters] = useState({
    voivodeship: 'all',
    county: 'all',
    type: 'all',
    active: 'all',
    dateFrom: '',
    dateTo: '',
    populationMin: '',
    populationMax: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchVoivodeships();
      if (activeTab === 'history') {
        fetchExportHistory();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fetchVoivodeships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/locations/voivodeships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Błąd pobierania województw');
      }

      const data = await response.json();
      setVoivodeships(data.voivodeships || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania województw:', err);
      setError(err.message);
      // Fallback do mock danych
      setVoivodeships([
        { id: '02', name: 'Dolnośląskie' },
        { id: '04', name: 'Kujawsko-pomorskie' },
        { id: '06', name: 'Lubelskie' },
        { id: '08', name: 'Lubuskie' },
        { id: '10', name: 'Łódzkie' },
        { id: '12', name: 'Małopolskie' },
        { id: '14', name: 'Mazowieckie' },
        { id: '16', name: 'Opolskie' },
        { id: '18', name: 'Podkarpackie' },
        { id: '20', name: 'Podlaskie' },
        { id: '22', name: 'Pomorskie' },
        { id: '24', name: 'Śląskie' },
        { id: '26', name: 'Świętokrzyskie' },
        { id: '28', name: 'Warmińsko-mazurskie' },
        { id: '30', name: 'Wielkopolskie' },
        { id: '32', name: 'Zachodniopomorskie' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/locations/export/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Błąd pobierania historii eksportów');
      }

      const data = await response.json();
      setExportHistory(data.history || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania historii eksportów:', err);
      setError(err.message);
      // Fallback do mock danych
      setExportHistory([
        {
          _id: '1',
          format: 'csv',
          filters: { voivodeship: 'all', type: 'all' },
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          downloadUrl: '#',
          fileSize: '2.5 MB'
        },
        {
          _id: '2',
          format: 'json',
          filters: { voivodeship: '14', type: 'gmina' },
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          downloadUrl: '#',
          fileSize: '1.8 MB'
        },
        {
          _id: '3',
          format: 'excel',
          filters: { voivodeship: 'all', type: 'all' },
          status: 'failed',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          error: 'Błąd serwera'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aktualizuje opcje eksportu
   */
  const updateExportOption = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Aktualizuje filtry
   */
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Rozpoczyna eksport danych
   */
  const startExport = async () => {
    setExporting(true);
    setProgress(0);
    setStatus({ type: 'info', message: 'Przygotowywanie eksportu...' });
    setDownloadUrl(null);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/locations/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          options: exportOptions,
          filters: filters
        })
      });

      if (!response.ok) {
        throw new Error('Błąd podczas eksportu');
      }

      const data = await response.json();
      
      // Symulacja postępu
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setExporting(false);
            setStatus({ type: 'success', message: 'Eksport zakończony pomyślnie!' });
            
            // Ustaw link do pobrania
            setDownloadUrl(data.downloadUrl || `data:text/csv;charset=utf-8,${encodeURIComponent('Nazwa,Kod,Typ,Województwo\nWarszawa,1465011,miasto,Mazowieckie\nKraków,1261011,miasto,Małopolskie')}`);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      setExporting(false);
      setError(error.message);
      setStatus({ type: 'error', message: `Błąd eksportu: ${error.message}` });
    }
  };

  /**
   * Anuluje eksport
   */
  const cancelExport = () => {
    setExporting(false);
    setProgress(0);
    setStatus({ type: 'info', message: 'Eksport anulowany' });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Zakończony';
      case 'processing': return 'W trakcie';
      case 'failed': return 'Nieudany';
      default: return status;
    }
  };

  const getFormatIcon = (format) => {
    const icons = {
      csv: '📄',
      json: '🔧',
      xml: '📋',
      excel: '📊'
    };
    return icons[format] || '📁';
  };

  if (!isAuthenticated) {
    return (
      <Container>
      <PageTitle title="Eksport lokalizacji" description="Eksportuj dane lokalizacji" />
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Zaloguj się</h3>
          <p>Musisz być zalogowany, aby korzystać z eksportu danych</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Eksport lokalizacji" description="Eksportuj dane lokalizacji" />
      <Header>
        <Title>📤 Eksport Lokalizacji</Title>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'export'} 
          onClick={() => setActiveTab('export')}
        >
          📤 Nowy eksport
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          📋 Historia eksportów
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {activeTab === 'export' && (
        <ExportSection>
          <SectionTitle>Format eksportu</SectionTitle>
          
          <OptionsGrid>
            <OptionCard>
              <OptionTitle>📄 Format pliku</OptionTitle>
              <OptionDescription>
                Wybierz format w jakim chcesz wyeksportować dane
              </OptionDescription>
              
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="format"
                    value="csv"
                    checked={exportOptions.format === 'csv'}
                    onChange={(e) => updateExportOption('format', e.target.value)}
                  />
                  CSV (Comma Separated Values)
                </RadioLabel>
                
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportOptions.format === 'json'}
                    onChange={(e) => updateExportOption('format', e.target.value)}
                  />
                  JSON (JavaScript Object Notation)
                </RadioLabel>
                
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="format"
                    value="xml"
                    checked={exportOptions.format === 'xml'}
                    onChange={(e) => updateExportOption('format', e.target.value)}
                  />
                  XML (Extensible Markup Language)
                </RadioLabel>
                
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="format"
                    value="excel"
                    checked={exportOptions.format === 'excel'}
                    onChange={(e) => updateExportOption('format', e.target.value)}
                  />
                  Excel (XLSX)
                </RadioLabel>
              </RadioGroup>
            </OptionCard>

            <OptionCard>
              <OptionTitle>⚙️ Opcje eksportu</OptionTitle>
              <OptionDescription>
                Dodatkowe opcje konfiguracji eksportu
              </OptionDescription>
              
              <Label>
                <Checkbox
                  type="checkbox"
                  checked={exportOptions.includeHeaders}
                  onChange={(e) => updateExportOption('includeHeaders', e.target.checked)}
                />
                Dołącz nagłówki kolumn
              </Label>
              
              <Label>
                <Checkbox
                  type="checkbox"
                  checked={exportOptions.includeStats}
                  onChange={(e) => updateExportOption('includeStats', e.target.checked)}
                />
                Dołącz statystyki
              </Label>
              
              <Label>
                <Checkbox
                  type="checkbox"
                  checked={exportOptions.includeRelations}
                  onChange={(e) => updateExportOption('includeRelations', e.target.checked)}
                />
                Dołącz relacje między lokalizacjami
              </Label>
              
              <Label>
                <Checkbox
                  type="checkbox"
                  checked={exportOptions.compression}
                  onChange={(e) => updateExportOption('compression', e.target.checked)}
                />
                Kompresuj plik (ZIP)
              </Label>
              
              <FilterSection>
                <FilterTitle>Kodowanie:</FilterTitle>
                <Select
                  value={exportOptions.encoding}
                  onChange={(e) => updateExportOption('encoding', e.target.value)}
                >
                  <option value="utf8">UTF-8</option>
                  <option value="iso-8859-2">ISO-8859-2 (Latin-2)</option>
                  <option value="windows-1250">Windows-1250</option>
                </Select>
              </FilterSection>
            </OptionCard>

            <OptionCard>
              <OptionTitle>🔍 Filtry danych</OptionTitle>
              <OptionDescription>
                Wybierz jakie dane chcesz wyeksportować
              </OptionDescription>
              
              <FilterSection>
                <FilterTitle>Województwo:</FilterTitle>
                <Select
                  value={filters.voivodeship}
                  onChange={(e) => updateFilter('voivodeship', e.target.value)}
                >
                  <option value="all">Wszystkie</option>
                  {voivodeships.map(voivodeship => (
                    <option key={voivodeship.id} value={voivodeship.id}>
                      {voivodeship.name}
                    </option>
                  ))}
                </Select>
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>Typ lokalizacji:</FilterTitle>
                <Select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  <option value="all">Wszystkie</option>
                  <option value="województwo">Województwa</option>
                  <option value="powiat">Powiaty</option>
                  <option value="gmina">Gminy</option>
                  <option value="miasto">Miasta</option>
                </Select>
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>Status:</FilterTitle>
                <Select
                  value={filters.active}
                  onChange={(e) => updateFilter('active', e.target.value)}
                >
                  <option value="all">Wszystkie</option>
                  <option value="true">Aktywne</option>
                  <option value="false">Nieaktywne</option>
                </Select>
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>Liczba mieszkańców (min):</FilterTitle>
                <Input
                  type="number"
                  placeholder="np. 1000"
                  value={filters.populationMin}
                  onChange={(e) => updateFilter('populationMin', e.target.value)}
                />
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>Liczba mieszkańców (max):</FilterTitle>
                <Input
                  type="number"
                  placeholder="np. 100000"
                  value={filters.populationMax}
                  onChange={(e) => updateFilter('populationMax', e.target.value)}
                />
              </FilterSection>
            </OptionCard>
          </OptionsGrid>

          <ButtonGroup>
            <Button
              variant="primary"
              onClick={startExport}
              disabled={exporting}
            >
              {exporting ? '🔄 Eksportowanie...' : '📤 Rozpocznij eksport'}
            </Button>
            
            {exporting && (
              <Button variant="secondary" onClick={cancelExport}>
                ❌ Anuluj
              </Button>
            )}
            
            {downloadUrl && (
              <DownloadLink href={downloadUrl} download={`lokalizacje_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`}>
                💾 Pobierz plik
              </DownloadLink>
            )}
          </ButtonGroup>

          {exporting && (
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <ProgressText>{progress}% ukończono</ProgressText>
            </ProgressContainer>
          )}

          {status && (
            <StatusMessage type={status.type}>
              {status.message}
            </StatusMessage>
          )}
        </ExportSection>
      )}

      {activeTab === 'history' && (
        <>
          {loading ? (
            <LoadingSpinner>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Ładowanie historii eksportów...</p>
            </LoadingSpinner>
          ) : exportHistory.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h3>Brak historii eksportów</h3>
              <p>Nie masz jeszcze żadnych eksportów</p>
            </EmptyState>
          ) : (
            <HistoryGrid>
              {exportHistory.map(exportItem => (
                <HistoryCard key={exportItem._id || exportItem.id}>
                  <HistoryHeader>
                    <HistoryTitle>
                      {getFormatIcon(exportItem.format)} Eksport {exportItem.format.toUpperCase()}
                    </HistoryTitle>
                    <HistoryStatus status={exportItem.status}>
                      {getStatusText(exportItem.status)}
                    </HistoryStatus>
                  </HistoryHeader>
                  <HistoryDetails>
                    <div>Filtry: {exportItem.filters.voivodeship === 'all' ? 'Wszystkie województwa' : `Województwo ${exportItem.filters.voivodeship}`}</div>
                    <div>Typ: {exportItem.filters.type === 'all' ? 'Wszystkie' : exportItem.filters.type}</div>
                    {exportItem.fileSize && <div>Rozmiar: {exportItem.fileSize}</div>}
                    {exportItem.error && <div>Błąd: {exportItem.error}</div>}
                  </HistoryDetails>
                  <HistoryDate>
                    {formatDate(exportItem.createdAt)}
                  </HistoryDate>
                  {exportItem.downloadUrl && exportItem.status === 'completed' && (
                    <DownloadLink 
                      href={exportItem.downloadUrl} 
                      download={`lokalizacje_${new Date(exportItem.createdAt).toISOString().split('T')[0]}.${exportItem.format}`}
                      style={{ marginTop: '1rem', justifyContent: 'center' }}
                    >
                      💾 Pobierz ponownie
                    </DownloadLink>
                  )}
                </HistoryCard>
              ))}
            </HistoryGrid>
          )}
        </>
      )}
    </Container>
  );
} 