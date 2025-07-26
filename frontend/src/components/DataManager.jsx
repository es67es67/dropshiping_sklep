import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { api } from '../utils/api';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const CollectionSelector = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CollectionButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: ${props => props.$active ? '#1976d2' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.$active ? '#1565c0' : '#f5f5f5'};
  }
`;

const RecordCount = styled.span`
  background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#666'};
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-bottom-color: #333;
  }
`;

const CollectionButtonWithTooltip = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;



const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #ffcdd2;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #c8e6c9;
`;

const DataManager = () => {
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({});
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // Funkcja do formatowania liczb
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Pobierz dostępne kolekcje z bazy danych
  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      const result = await api.get('/admin/collections');
      setCollections(result.collections || []);
      
      // Jeśli nie ma wybranej kolekcji lub nie istnieje, wybierz pierwszą dostępną
      if (!selectedCollection || !result.collections.find(c => c.key === selectedCollection)) {
        if (result.collections.length > 0) {
          setSelectedCollection(result.collections[0].key);
        }
      }
    } catch (err) {
      console.error('Błąd podczas ładowania kolekcji:', err);
      // Fallback do statycznych kolekcji
      setCollections([
        { key: 'users', label: 'Użytkownicy', icon: '👥' },
        { key: 'locations', label: 'Lokalizacje', icon: '📍' },
        { key: 'shops', label: 'Sklepy', icon: '🏪' },
        { key: 'products', label: 'Produkty', icon: '📦' },
        { key: 'posts', label: 'Posty', icon: '📝' },
        { key: 'messages', label: 'Wiadomości', icon: '💬' },
        { key: 'groups', label: 'Grupy', icon: '👥' },
        { key: 'reviews', label: 'Recenzje', icon: '⭐' },
        { key: 'notifications', label: 'Powiadomienia', icon: '🔔' },
        { key: 'achievements', label: 'Osiągnięcia', icon: '🏆' },
        { key: 'badges', label: 'Odznaki', icon: '🎖️' },
        { key: 'payments', label: 'Płatności', icon: '💳' },
        { key: 'orders', label: 'Zamówienia', icon: '📋' }
      ]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const fetchData = async (collection) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(`/admin/${collection}`);
      setData(result.data || result || []);
    } catch (err) {
      setError(`Błąd podczas ładowania danych: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await api.get('/admin/stats');
      setStats(result);
    } catch (err) {
      console.error('Błąd podczas ładowania statystyk:', err);
    }
  };

  const handleEdit = async (item) => {
    try {
      await api.put(`/admin/${selectedCollection}/${item._id}`, item);
      setMessage('Element został zaktualizowany pomyślnie!');
      fetchData(selectedCollection);
    } catch (err) {
      setError(`Błąd podczas edycji: ${err.message}`);
    }
  };

  const handleDelete = async (item) => {
    try {
      await api.delete(`/admin/${selectedCollection}/${item._id}`);
      setMessage('Element został usunięty pomyślnie!');
      fetchData(selectedCollection);
    } catch (err) {
      setError(`Błąd podczas usuwania: ${err.message}`);
    }
  };

  const handleAdd = async (item) => {
    try {
      await api.post(`/admin/${selectedCollection}`, item);
      setMessage('Element został dodany pomyślnie!');
      fetchData(selectedCollection);
    } catch (err) {
      setError(`Błąd podczas dodawania: ${err.message}`);
    }
  };



  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection && collections.length > 0) {
      fetchData(selectedCollection);
      fetchStats();
    }
  }, [selectedCollection, collections]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container>
      <h2>Zarządzanie danymi</h2>
      
      {message && <SuccessMessage>{message}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {collections.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
          <strong>Dostępne kolekcje:</strong> {collections.length}
        </div>
      )}



      <CollectionSelector>
        {collectionsLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Ładowanie kolekcji...
          </div>
        ) : (
          collections.map(collection => {
            const recordCount = stats[collection.key] || 0;
            return (
              <CollectionButtonWithTooltip key={collection.key}>
                <CollectionButton
                  $active={selectedCollection === collection.key}
                  onClick={() => setSelectedCollection(collection.key)}
                >
                  {collection.icon} {collection.label}
                  <RecordCount $active={selectedCollection === collection.key}>
                    {formatNumber(recordCount)}
                  </RecordCount>
                </CollectionButton>
                <Tooltip>
                  {recordCount.toLocaleString()} rekordów w kolekcji {collection.label}
                </Tooltip>
              </CollectionButtonWithTooltip>
            );
          })
        )}
      </CollectionSelector>

      <DataTable
        collection={selectedCollection}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(item) => console.log('View item:', item)}
        onAdd={handleAdd}
        loading={loading}
        error={error}
      />


    </Container>
  );
};

export default DataManager; 