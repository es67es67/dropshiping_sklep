import React, { useState, useEffect } from 'react';
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

const ImportSection = styled.div`
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

const FileUploadArea = styled.div`
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
  
  ${props => props.isDragOver && `
    border-color: ${props.theme.primary};
    background: ${props.theme.primary}20;
  `}
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const FileInfo = styled.div`
  background: ${props => props.theme.primary}20;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const FileSize = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const FileValidation = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  ${props => props.isValid && `
    color: ${props.theme.success};
  `}
  
  ${props => !props.isValid && `
    color: ${props.theme.error};
  `}
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: ${props => props.theme.error}dd;
  }
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
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const OptionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
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
  margin-left: 0.5rem;
  padding: 0.25rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Strona importu danych lokalizacji
 * Umożliwia import danych z plików CSV/XML z opcjami konfiguracji
 */
export default function LocationImport() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [fileValidation, setFileValidation] = useState({ isValid: false, errors: [] });
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [options, setOptions] = useState({
    updateExisting: true,
    validateData: true,
    createBackup: true,
    skipDuplicates: false,
    batchSize: 100,
    encoding: 'utf8',
    delimiter: ',',
    createMissingParents: true
  });

  useEffect(() => {
    if (isAuthenticated && activeTab === 'history') {
      fetchImportHistory();
    }
  }, [isAuthenticated, activeTab]);

  const fetchImportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/locations/import/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Błąd pobierania historii importów');
      }

      const data = await response.json();
      setImportHistory(data.history || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania historii importów:', err);
      setError(err.message);
      // Fallback do mock danych
      setImportHistory([
        {
          _id: '1',
          filename: 'lokalizacje.csv',
          format: 'csv',
          status: 'completed',
          recordsImported: 1250,
          recordsSkipped: 15,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          fileSize: '2.5 MB'
        },
        {
          _id: '2',
          filename: 'powiaty.xml',
          format: 'xml',
          status: 'completed',
          recordsImported: 380,
          recordsSkipped: 0,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          fileSize: '1.2 MB'
        },
        {
          _id: '3',
          filename: 'gminy.csv',
          format: 'csv',
          status: 'failed',
          error: 'Błąd walidacji danych',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          fileSize: '3.1 MB'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    const errors = [];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
      errors.push('Plik jest za duży. Maksymalny rozmiar to 50MB.');
    }
    
    const allowedTypes = ['text/csv', 'application/xml', 'text/xml'];
    const allowedExtensions = ['.csv', '.xml'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      errors.push('Nieobsługiwany format pliku. Dozwolone są tylko pliki CSV i XML.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  /**
   * Obsługuje przeciąganie plików
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Obsługuje wybór pliku
   */
  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    setFileValidation(validation);
    
    if (validation.isValid) {
      setSelectedFile(file);
      setStatus({ type: 'info', message: `Wybrano plik: ${file.name}` });
    } else {
      setSelectedFile(null);
      setStatus({ type: 'error', message: validation.errors.join(', ') });
    }
  };

  /**
   * Usuwa wybrany plik
   */
  const removeFile = () => {
    setSelectedFile(null);
    setFileValidation({ isValid: false, errors: [] });
    setStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Aktualizuje opcje importu
   */
  const updateOption = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Rozpoczyna import danych
   */
  const startImport = async () => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Proszę wybrać plik do importu' });
      return;
    }

    if (!fileValidation.isValid) {
      setStatus({ type: 'error', message: 'Plik nie przeszedł walidacji' });
      return;
    }

    setImporting(true);
    setProgress(0);
    setStatus({ type: 'info', message: 'Rozpoczynanie importu...' });
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('options', JSON.stringify(options));

      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/locations/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Błąd podczas importu');
      }

      const data = await response.json();
      
      // Symulacja postępu
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setImporting(false);
            setStatus({ type: 'success', message: `Import zakończony pomyślnie! Zaimportowano ${data.importedCount || 0} rekordów.` });
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      setImporting(false);
      setError(error.message);
      setStatus({ type: 'error', message: `Błąd importu: ${error.message}` });
    }
  };

  /**
   * Anuluje import
   */
  const cancelImport = () => {
    setImporting(false);
    setProgress(0);
    setStatus({ type: 'info', message: 'Import anulowany' });
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
      xml: '📋'
    };
    return icons[format] || '📁';
  };

  if (!isAuthenticated) {
    return (
      <Container>
      <PageTitle title="Import lokalizacji" description="Importuj dane lokalizacji" />
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Zaloguj się</h3>
          <p>Musisz być zalogowany, aby korzystać z importu danych</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle title="Import lokalizacji" description="Importuj dane lokalizacji" />
      <Header>
        <Title>📥 Import Lokalizacji</Title>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'import'} 
          onClick={() => setActiveTab('import')}
        >
          📥 Nowy import
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          📋 Historia importów
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {activeTab === 'import' && (
        <>
          <ImportSection>
            <SectionTitle>Wybierz plik do importu</SectionTitle>
            
            <FileUploadArea
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileInput
                ref={fileInputRef}
                type="file"
                accept=".csv,.xml"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />
              
              <UploadIcon>📁</UploadIcon>
              <UploadText>Przeciągnij plik tutaj lub kliknij aby wybrać</UploadText>
              <UploadSubtext>Obsługiwane formaty: CSV, XML (maks. 50MB)</UploadSubtext>
            </FileUploadArea>

            {selectedFile && (
              <FileInfo>
                <FileIcon>📄</FileIcon>
                <FileDetails>
                  <FileName>{selectedFile.name}</FileName>
                  <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                  <FileValidation isValid={fileValidation.isValid}>
                    {fileValidation.isValid ? '✅ Plik jest poprawny' : `❌ ${fileValidation.errors.join(', ')}`}
                  </FileValidation>
                </FileDetails>
                <RemoveButton onClick={removeFile}>🗑️</RemoveButton>
              </FileInfo>
            )}
          </ImportSection>

          <ImportSection>
            <SectionTitle>Opcje importu</SectionTitle>
            
            <OptionsGrid>
              <OptionCard>
                <OptionTitle>Zachowanie danych</OptionTitle>
                <OptionDescription>
                  Wybierz jak system ma obsługiwać istniejące dane podczas importu
                </OptionDescription>
                
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={options.updateExisting}
                    onChange={(e) => updateOption('updateExisting', e.target.checked)}
                  />
                  Aktualizuj istniejące rekordy
                </Label>
                
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={options.skipDuplicates}
                    onChange={(e) => updateOption('skipDuplicates', e.target.checked)}
                  />
                  Pomiń duplikaty
                </Label>
                
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={options.createMissingParents}
                    onChange={(e) => updateOption('createMissingParents', e.target.checked)}
                  />
                  Utwórz brakujące lokalizacje nadrzędne
                </Label>
              </OptionCard>

              <OptionCard>
                <OptionTitle>Walidacja i bezpieczeństwo</OptionTitle>
                <OptionDescription>
                  Opcje związane z weryfikacją danych i bezpieczeństwem
                </OptionDescription>
                
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={options.validateData}
                    onChange={(e) => updateOption('validateData', e.target.checked)}
                  />
                  Waliduj dane przed importem
                </Label>
                
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={options.createBackup}
                    onChange={(e) => updateOption('createBackup', e.target.checked)}
                  />
                  Utwórz kopię zapasową
                </Label>
              </OptionCard>

              <OptionCard>
                <OptionTitle>Wydajność</OptionTitle>
                <OptionDescription>
                  Ustawienia wpływające na szybkość i wydajność importu
                </OptionDescription>
                
                <Label>
                  Rozmiar partii:
                  <Select
                    value={options.batchSize}
                    onChange={(e) => updateOption('batchSize', parseInt(e.target.value))}
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                  </Select>
                </Label>
                
                <Label>
                  Kodowanie:
                  <Select
                    value={options.encoding}
                    onChange={(e) => updateOption('encoding', e.target.value)}
                  >
                    <option value="utf8">UTF-8</option>
                    <option value="iso-8859-2">ISO-8859-2</option>
                    <option value="windows-1250">Windows-1250</option>
                  </Select>
                </Label>
                
                <Label>
                  Separator (CSV):
                  <Select
                    value={options.delimiter}
                    onChange={(e) => updateOption('delimiter', e.target.value)}
                  >
                    <option value=",">Przecinek (,)</option>
                    <option value=";">Średnik (;)</option>
                    <option value="\t">Tabulator</option>
                  </Select>
                </Label>
              </OptionCard>
            </OptionsGrid>

            <ButtonGroup>
              <Button
                variant="primary"
                onClick={startImport}
                disabled={!selectedFile || !fileValidation.isValid || importing}
              >
                {importing ? '🔄 Importowanie...' : '🚀 Rozpocznij import'}
              </Button>
              
              {importing && (
                <Button variant="secondary" onClick={cancelImport}>
                  ❌ Anuluj
                </Button>
              )}
            </ButtonGroup>

            {importing && (
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
          </ImportSection>
        </>
      )}

      {activeTab === 'history' && (
        <>
          {loading ? (
            <LoadingSpinner>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Ładowanie historii importów...</p>
            </LoadingSpinner>
          ) : importHistory.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h3>Brak historii importów</h3>
              <p>Nie masz jeszcze żadnych importów</p>
            </EmptyState>
          ) : (
            <HistoryGrid>
              {importHistory.map(importItem => (
                <HistoryCard key={importItem._id || importItem.id}>
                  <HistoryHeader>
                    <HistoryTitle>
                      {getFormatIcon(importItem.format)} {importItem.filename}
                    </HistoryTitle>
                    <HistoryStatus status={importItem.status}>
                      {getStatusText(importItem.status)}
                    </HistoryStatus>
                  </HistoryHeader>
                  <HistoryDetails>
                    <div>Format: {importItem.format.toUpperCase()}</div>
                    <div>Rozmiar: {importItem.fileSize}</div>
                    {importItem.recordsImported && (
                      <div>Zaimportowano: {importItem.recordsImported} rekordów</div>
                    )}
                    {importItem.recordsSkipped && (
                      <div>Pominięto: {importItem.recordsSkipped} rekordów</div>
                    )}
                    {importItem.error && <div>Błąd: {importItem.error}</div>}
                  </HistoryDetails>
                  <HistoryDate>
                    {formatDate(importItem.createdAt)}
                  </HistoryDate>
                </HistoryCard>
              ))}
            </HistoryGrid>
          )}
        </>
      )}
    </Container>
  );
} 