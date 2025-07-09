import React, { useState } from 'react';
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

const ExportSection = styled.div`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
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
    background: #10b98120;
    color: #10b981;
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

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

/**
 * Strona eksportu danych lokalizacji
 * Umożliwia eksport danych w różnych formatach z opcjami filtrowania
 */
export default function LocationExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    includeHeaders: true,
    encoding: 'utf8',
    compression: false
  });
  
  const [filters, setFilters] = useState({
    voivodeship: 'all',
    county: 'all',
    type: 'all',
    active: 'all',
    dateFrom: '',
    dateTo: ''
  });

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

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/export`, {
        method: 'POST',
        headers: {
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

      // Symulacja postępu
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setExporting(false);
            setStatus({ type: 'success', message: 'Eksport zakończony pomyślnie!' });
            
            // Symulacja linku do pobrania
            const mockUrl = `data:text/csv;charset=utf-8,${encodeURIComponent('Nazwa,Kod,Typ,Województwo\nWarszawa,1465011,miasto,Mazowieckie\nKraków,1261011,miasto,Małopolskie')}`;
            setDownloadUrl(mockUrl);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      setExporting(false);
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

  return (
    <Container>
      <Header>
        <Title>📤 Eksport Lokalizacji</Title>
      </Header>

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
                <option value="02">Dolnośląskie</option>
                <option value="04">Kujawsko-pomorskie</option>
                <option value="06">Lubelskie</option>
                <option value="08">Lubuskie</option>
                <option value="10">Łódzkie</option>
                <option value="12">Małopolskie</option>
                <option value="14">Mazowieckie</option>
                <option value="16">Opolskie</option>
                <option value="18">Podkarpackie</option>
                <option value="20">Podlaskie</option>
                <option value="22">Pomorskie</option>
                <option value="24">Śląskie</option>
                <option value="26">Świętokrzyskie</option>
                <option value="28">Warmińsko-mazurskie</option>
                <option value="30">Wielkopolskie</option>
                <option value="32">Zachodniopomorskie</option>
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
    </Container>
  );
} 