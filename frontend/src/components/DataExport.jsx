import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const ExportCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &.primary {
    background: #1976d2;
    color: white;
    
    &:hover {
      background: #1565c0;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #1565c0);
  width: ${props => props.progress}%;
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const LogContainer = styled.div`
  background: #1e1e1e;
  color: #00ff00;
  padding: 16px;
  border-radius: 6px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-top: 16px;
`;

const LogEntry = styled.div`
  margin-bottom: 4px;
  
  &.error {
    color: #ff6b6b;
  }
  
  &.success {
    color: #51cf66;
  }
  
  &.warning {
    color: #ffd43b;
  }
`;

const DataExport = () => {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [exportResult, setExportResult] = useState(null);

  const collections = [
    { key: 'users', label: 'Użytkownicy', count: 0 },
    { key: 'locations', label: 'Lokalizacje', count: 0 },
    { key: 'shops', label: 'Sklepy', count: 0 },
    { key: 'products', label: 'Produkty', count: 0 },
    { key: 'posts', label: 'Posty', count: 0 },
    { key: 'messages', label: 'Wiadomości', count: 0 },
    { key: 'groups', label: 'Grupy', count: 0 },
    { key: 'reviews', label: 'Recenzje', count: 0 },
    { key: 'notifications', label: 'Powiadomienia', count: 0 },
    { key: 'achievements', label: 'Osiągnięcia', count: 0 },
    { key: 'badges', label: 'Odznaki', count: 0 },
    { key: 'payments', label: 'Płatności', count: 0 },
    { key: 'orders', label: 'Zamówienia', count: 0 }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message: `[${timestamp}] ${message}`, type }]);
  };

  const handleCollectionToggle = (collectionKey) => {
    setSelectedCollections(prev => 
      prev.includes(collectionKey)
        ? prev.filter(c => c !== collectionKey)
        : [...prev, collectionKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedCollections(collections.map(c => c.key));
  };

  const handleSelectNone = () => {
    setSelectedCollections([]);
  };

  const handleExport = async () => {
    if (selectedCollections.length === 0) {
      addLog('Wybierz przynajmniej jedną kolekcję do eksportu', 'error');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setLogs([]);
    setExportResult(null);

    addLog('Rozpoczęcie eksportu danych...', 'info');

    try {
      const exportData = {
        collections: selectedCollections,
        format: exportFormat,
        includeMetadata,
        dateRange: dateRange.start && dateRange.end ? dateRange : null,
        filters
      };

      addLog(`Eksportowanie kolekcji: ${selectedCollections.join(', ')}`, 'info');

      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setProgress(100);
      setExportResult(result);
      
      addLog('Eksport zakończony pomyślnie!', 'success');
      addLog(`Wyeksportowano ${result.totalRecords} rekordów`, 'success');
      
      if (result.downloadUrl) {
        addLog(`Plik dostępny do pobrania: ${result.downloadUrl}`, 'success');
      }

    } catch (error) {
      addLog(`Błąd podczas eksportu: ${error.message}`, 'error');
      setProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (exportResult && exportResult.downloadUrl) {
      window.open(exportResult.downloadUrl, '_blank');
    }
  };

  return (
    <Container>
      <h2>Eksport danych</h2>

      <ExportCard>
        <h3>1. Wybierz kolekcje do eksportu</h3>
        <div style={{ marginBottom: '16px' }}>
          <Button className="secondary" onClick={handleSelectAll} style={{ marginRight: '8px' }}>
            Wybierz wszystkie
          </Button>
          <Button className="secondary" onClick={handleSelectNone}>
            Wyczyść wybór
          </Button>
        </div>
        <CheckboxGroup>
          {collections.map(collection => (
            <CheckboxLabel key={collection.key}>
              <Checkbox
                type="checkbox"
                checked={selectedCollections.includes(collection.key)}
                onChange={() => handleCollectionToggle(collection.key)}
              />
              {collection.label} ({collection.count})
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </ExportCard>

      <ExportCard>
        <h3>2. Ustawienia eksportu</h3>
        <FormGroup>
          <Label>Format eksportu</Label>
          <Select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="excel">Excel (XLSX)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Zakres dat (opcjonalnie)</Label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              placeholder="Data od"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              placeholder="Data do"
            />
          </div>
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
            />
            Dołącz metadane (timestamp, wersja, itp.)
          </CheckboxLabel>
        </FormGroup>
      </ExportCard>

      <ExportCard>
        <h3>3. Eksportuj dane</h3>
        <Button
          className="primary"
          onClick={handleExport}
          disabled={isExporting || selectedCollections.length === 0}
        >
          {isExporting ? 'Eksportowanie...' : 'Rozpocznij eksport'}
        </Button>

        {isExporting && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
            <ProgressText>{progress}% ukończono</ProgressText>
          </ProgressContainer>
        )}

        {exportResult && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#e8f5e8', borderRadius: '6px' }}>
            <h4>Eksport zakończony!</h4>
            <p>Wyeksportowano {exportResult.totalRecords} rekordów z {exportResult.collections.length} kolekcji.</p>
            {exportResult.downloadUrl && (
              <Button className="primary" onClick={handleDownload}>
                Pobierz plik
              </Button>
            )}
          </div>
        )}

        {logs.length > 0 && (
          <LogContainer>
            {logs.map((log, index) => (
              <LogEntry key={index} className={log.type}>
                {log.message}
              </LogEntry>
            ))}
          </LogContainer>
        )}
      </ExportCard>
    </Container>
  );
};

export default DataExport; 