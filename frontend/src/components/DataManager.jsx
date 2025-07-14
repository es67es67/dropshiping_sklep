import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
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
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
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

  const collections = [
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
  ];

  const fetchData = async (collection) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/${collection}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError(`Błąd podczas ładowania danych: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/stats`);
      if (response.ok) {
        const result = await response.json();
        setStats(result);
      }
    } catch (err) {
      console.error('Błąd podczas ładowania statystyk:', err);
    }
  };

  const handleEdit = async (item) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/${selectedCollection}/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        setMessage('Element został zaktualizowany pomyślnie!');
        fetchData(selectedCollection);
      } else {
        throw new Error('Błąd podczas aktualizacji');
      }
    } catch (err) {
      setError(`Błąd podczas edycji: ${err.message}`);
    }
  };

  const handleDelete = async (item) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/${selectedCollection}/${item._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Element został usunięty pomyślnie!');
        fetchData(selectedCollection);
      } else {
        throw new Error('Błąd podczas usuwania');
      }
    } catch (err) {
      setError(`Błąd podczas usuwania: ${err.message}`);
    }
  };

  const handleAdd = async (item) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/${selectedCollection}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        setMessage('Element został dodany pomyślnie!');
        fetchData(selectedCollection);
      } else {
        throw new Error('Błąd podczas dodawania');
      }
    } catch (err) {
      setError(`Błąd podczas dodawania: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData(selectedCollection);
    fetchStats();
  }, [selectedCollection]);

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

      <StatsContainer>
        {Object.entries(stats).map(([key, value]) => (
          <StatCard key={key}>
            <StatNumber>{value}</StatNumber>
            <StatLabel>{key}</StatLabel>
          </StatCard>
        ))}
      </StatsContainer>

      <CollectionSelector>
        {collections.map(collection => (
          <CollectionButton
            key={collection.key}
            active={selectedCollection === collection.key}
            onClick={() => setSelectedCollection(collection.key)}
          >
            {collection.icon} {collection.label}
          </CollectionButton>
        ))}
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