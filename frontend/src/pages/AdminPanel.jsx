import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DataManager from '../components/DataManager';
import DataExport from '../components/DataExport';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 28px;
`;

const UserInfo = styled.div`
  text-align: right;
  color: #666;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#1976d2' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#666'};
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border-bottom: 3px solid ${props => props.active ? '#1976d2' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const AccessDeniedIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const tabs = [
  { 
    key: 'dashboard', 
    label: '📊 Dashboard', 
    icon: '📊',
    description: 'Przegląd systemu i statystyki'
  },
  { 
    key: 'data', 
    label: '🗄️ Zarządzanie danymi', 
    icon: '🗄️',
    description: 'Przeglądanie, edycja i zarządzanie danymi'
  },
  { 
    key: 'export', 
    label: '📤 Eksport danych', 
    icon: '📤',
    description: 'Eksport danych do różnych formatów'
  },
  { 
    key: 'users', 
    label: '👥 Użytkownicy', 
    icon: '👥',
    description: 'Zarządzanie użytkownikami i uprawnieniami'
  },
  { 
    key: 'system', 
    label: '⚙️ System', 
    icon: '⚙️',
    description: 'Ustawienia systemu i konfiguracja'
  }
];

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || !user.roles || !user.roles.includes('admin')) {
    return (
      <AccessDenied>
        <AccessDeniedIcon>🚫</AccessDeniedIcon>
        <h2>Brak dostępu</h2>
        <p>Panel administracyjny jest dostępny tylko dla administratorów.</p>
        <p>Zaloguj się jako administrator, aby uzyskać dostęp.</p>
      </AccessDenied>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard administracyjny</h2>
            <p>Witaj w panelu administracyjnym! Wybierz zakładkę, aby zarządzać systemem.</p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px', 
              marginTop: '24px' 
            }}>
              {tabs.slice(1).map(tab => (
                <div 
                  key={tab.key}
                  style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setActiveTab(tab.key)}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tab.icon}</div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{tab.label}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{tab.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'data':
        return <DataManager />;
      
      case 'export':
        return <DataExport />;
      
      case 'users':
        return (
          <div>
            <h2>Zarządzanie użytkownikami</h2>
            <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
          </div>
        );
      
      case 'system':
        return (
          <div>
            <h2>Ustawienia systemu</h2>
            <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
          </div>
        );
      
      default:
        return <div>Nieznana zakładka</div>;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Panel administracyjny</Title>
        <UserInfo>
          <div>Zalogowany jako: <strong>{user.username || user.email}</strong></div>
          <div style={{ fontSize: '14px' }}>Rola: Administrator</div>
        </UserInfo>
      </Header>

      <TabContainer>
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>
    </Container>
  );
};

export default AdminPanel; 