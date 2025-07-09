import React, { useState, useRef } from 'react';
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

const ImportSection = styled.div`
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

/**
 * Strona importu danych lokalizacji
 * Umożliwia import danych z plików CSV/XML z opcjami konfiguracji
 */
export default function LocationImport() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);
  
  const [options, setOptions] = useState({
    updateExisting: true,
    validateData: true,
    createBackup: true,
    skipDuplicates: false,
    batchSize: 100
  });

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
    if (file && (file.type === 'text/csv' || file.name.endsWith('.xml'))) {
      setSelectedFile(file);
      setStatus({ type: 'info', message: `Wybrano plik: ${file.name}` });
    } else {
      setStatus({ type: 'error', message: 'Proszę wybrać plik CSV lub XML' });
    }
  };

  /**
   * Usuwa wybrany plik
   */
  const removeFile = () => {
    setSelectedFile(null);
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

    setImporting(true);
    setProgress(0);
    setStatus({ type: 'info', message: 'Rozpoczynanie importu...' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('options', JSON.stringify(options));

      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations/import`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Błąd podczas importu');
      }

      // Symulacja postępu
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setImporting(false);
            setStatus({ type: 'success', message: 'Import zakończony pomyślnie!' });
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      setImporting(false);
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

  return (
    <Container>
      <Header>
        <Title>📥 Import Lokalizacji</Title>
      </Header>

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
          <UploadSubtext>Obsługiwane formaty: CSV, XML</UploadSubtext>
        </FileUploadArea>

        {selectedFile && (
          <FileInfo>
            <FileIcon>📄</FileIcon>
            <FileDetails>
              <FileName>{selectedFile.name}</FileName>
              <FileSize>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</FileSize>
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
              <select
                value={options.batchSize}
                onChange={(e) => updateOption('batchSize', parseInt(e.target.value))}
                style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </Label>
          </OptionCard>
        </OptionsGrid>

        <ButtonGroup>
          <Button
            variant="primary"
            onClick={startImport}
            disabled={!selectedFile || importing}
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
    </Container>
  );
} 