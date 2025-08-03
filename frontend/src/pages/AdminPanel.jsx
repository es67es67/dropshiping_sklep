import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';
import DataManager from '../components/DataManager';
import DataExport from '../components/DataExport';
import AdvertisementAnalytics from '../components/AdvertisementAnalytics';
import { api } from '../utils/api';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 24px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const UserInfo = styled.div`
  text-align: right;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  padding-bottom: 0;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.$active ? props.theme.primary : 'transparent'};
  color: ${props => props.$active ? '#fff' : props.theme.text};
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border-bottom: 3px solid ${props => props.$active ? props.theme.primary : 'transparent'};
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.primary}20;
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const AccessDeniedIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const DashboardCard = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.theme.background};
  
  &:hover {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 0.75rem;
  margin-top: 8px;
  color: ${props => props.change >= 0 ? props.theme.success : props.theme.error};
`;

const UsersTable = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadow};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.primary}10;
  font-weight: 600;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}05;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
  }
`;

const TableCell = styled.div`
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Badge = styled.span`
  background: ${props => props.variant === 'admin' ? props.theme.primary : 
                props.variant === 'moderator' ? props.theme.warning : 
                props.variant === 'user' ? props.theme.success : props.theme.error};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;
  
  &.edit {
    background: ${props => props.theme.warning};
    color: white;
    
    &:hover {
      background: ${props => props.theme.warning}dd;
    }
  }
  
  &.delete {
    background: ${props => props.theme.error};
    color: white;
    
    &:hover {
      background: ${props => props.theme.error}dd;
    }
  }
`;

const SystemSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const SettingCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
`;

const SettingTitle = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 16px;
  font-size: 1.25rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const SettingValue = styled.div`
  color: ${props => props.theme.textSecondary};
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.border};
    transition: .4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${props => props.theme.primary};
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
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
    key: 'advertising', 
    label: '📢 Reklamy', 
    icon: '📢',
    description: 'Analityka reklam i zarządzanie kampaniami'
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
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalProducts: 0,
    totalOrders: 0,
    activeUsers: 0,
    revenue: 0
  });
  const [users, setUsers] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoBackup: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sprawdź uprawnienia admina
  if (!isAdmin()) {
    return (
      <Container>
        <PageTitle title="Brak uprawnień" description="Dostęp zabroniony" />
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '12px',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#c33', marginBottom: '1rem' }}>🚫 Brak uprawnień</h2>
          <p style={{ marginBottom: '2rem', color: '#666', fontSize: '1.1rem' }}>
            Nie masz uprawnień administratora, aby uzyskać dostęp do tego panelu.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            🏠 Wróć do strony głównej
          </button>
        </div>
      </Container>
    );
  }

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'system') {
      fetchSystemSettings();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get('/admin/dashboard');
      setStats(data);
      
    } catch (err) {
      console.error('Błąd pobierania statystyk:', err);
      setError(err.message);
      // Fallback do mock danych
      setStats({
        totalUsers: 1247,
        totalShops: 89,
        totalProducts: 3456,
        totalOrders: 1234,
        activeUsers: 456,
        revenue: 45678.90
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get('/admin/users');
      setUsers(data.data || data.users || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania użytkowników:', err);
      setError(err.message);
      // Fallback do mock danych
      setUsers([
        {
          _id: '1',
          username: 'admin',
          email: 'admin@portal.com',
          role: 'admin',
          createdAt: '2024-01-01',
          lastLogin: '2024-01-11T10:30:00Z',
          status: 'active'
        },
        {
          _id: '2',
          username: 'moderator1',
          email: 'mod@portal.com',
          role: 'moderator',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-11T09:15:00Z',
          status: 'active'
        },
        {
          _id: '3',
          username: 'user123',
          email: 'user@example.com',
          role: 'user',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-11T08:45:00Z',
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get('/admin/settings');
      setSystemSettings(data);
      
    } catch (err) {
      console.error('Błąd pobierania ustawień:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSetting = async (key, value) => {
    try {
      await api.put('/admin/settings', { [key]: value });
      setSystemSettings(prev => ({ ...prev, [key]: value }));
      
    } catch (err) {
      console.error('Błąd aktualizacji ustawienia:', err);
      setError(err.message);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'admin',
      moderator: 'moderator',
      user: 'user'
    };
    return <Badge variant={variants[role] || 'user'}>{role}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin()) {
    return (
      <AccessDenied>
      <PageTitle title="Panel Admina" description="Zarządzanie systemem i danymi" />
        <AccessDeniedIcon>🚫</AccessDeniedIcon>
        <h2>Brak dostępu</h2>
        <p>Panel administracyjny jest dostępny tylko dla administratorów.</p>
        <p>Zaloguj się jako administrator, aby uzyskać dostęp.</p>
      </AccessDenied>
    );
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie...</p>
        </LoadingSpinner>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard administracyjny</h2>
            <p>Przegląd systemu i kluczowe statystyki</p>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <StatsGrid>
              <StatCard>
                <StatIcon>👥</StatIcon>
                <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
                <StatLabel>Użytkownicy</StatLabel>
                <StatChange change={12}>+12% z ostatniego miesiąca</StatChange>
              </StatCard>
              <StatCard>
                <StatIcon>🏪</StatIcon>
                <StatNumber>{stats.totalShops.toLocaleString()}</StatNumber>
                <StatLabel>Sklepy</StatLabel>
                <StatChange change={8}>+8% z ostatniego miesiąca</StatChange>
              </StatCard>
              <StatCard>
                <StatIcon>📦</StatIcon>
                <StatNumber>{stats.totalProducts.toLocaleString()}</StatNumber>
                <StatLabel>Produkty</StatLabel>
                <StatChange change={15}>+15% z ostatniego miesiąca</StatChange>
              </StatCard>
              <StatCard>
                <StatIcon>🛒</StatIcon>
                <StatNumber>{stats.totalOrders.toLocaleString()}</StatNumber>
                <StatLabel>Zamówienia</StatLabel>
                <StatChange change={23}>+23% z ostatniego miesiąca</StatChange>
              </StatCard>
              <StatCard>
                <StatIcon>💰</StatIcon>
                <StatNumber>{stats.revenue.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</StatNumber>
                <StatLabel>Przychody</StatLabel>
                <StatChange change={18}>+18% z ostatniego miesiąca</StatChange>
              </StatCard>
              <StatCard>
                <StatIcon>🟢</StatIcon>
                <StatNumber>{stats.activeUsers.toLocaleString()}</StatNumber>
                <StatLabel>Aktywni użytkownicy</StatLabel>
                <StatChange change={5}>+5% z ostatniego miesiąca</StatChange>
              </StatCard>
            </StatsGrid>
            
            <DashboardGrid>
              {tabs.slice(1).map(tab => (
                <DashboardCard
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tab.icon}</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1E293B' }}>{tab.label}</h3>
                  <p style={{ margin: 0, color: '#64748B' }}>{tab.description}</p>
                </DashboardCard>
              ))}
            </DashboardGrid>
          </div>
        );
      
      case 'data':
        return <DataManager />;
      
      case 'export':
        return <DataExport />;
      
      case 'advertising':
        return (
          <div>
            <h2>📢 Zarządzanie Reklamami</h2>
            <p>Analityka reklam i zarządzanie kampaniami marketingowymi</p>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <AdvertisementAnalytics 
              timeRange="7d" 
              showCharts={true} 
            />
            
            <div style={{ marginTop: '2rem' }}>
              <h3>🎯 Kampanie Marketingowe</h3>
              <p>Zgodnie z planem marketingowym z pliku REKLAMA_MARKETPLACE.md:</p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4>🏪 Dla Sprzedawców</h4>
                  <p>"Wystaw swoje rzeczy w 2 minuty!"</p>
                  <p>AI pomoże opisać produkt i wybrać kategorię</p>
                </div>
                
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4>💰 Dla Kupujących</h4>
                  <p>"Znajdź to, czego szukasz w swojej okolicy!"</p>
                  <p>Lokalne oferty, szybka dostawa, zaufani sprzedawcy</p>
                </div>
                
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4>🎯 Aukcje</h4>
                  <p>"Licytuj okazje w swojej gminie!"</p>
                  <p>Unikalne przedmioty, konkurencyjne ceny</p>
                </div>
                
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4>🏪 Sklepy</h4>
                  <p>"Sklepy stacjonarne i online w jednym miejscu!"</p>
                  <p>Połącz siły - sprzedawaj lokalnie i globalnie</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div>
            <h2>Zarządzanie użytkownikami</h2>
            <p>Przegląd i zarządzanie użytkownikami systemu</p>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <UsersTable>
              <TableHeader>
                <div>Użytkownik</div>
                <div>Email</div>
                <div>Rola</div>
                <div>Ostatnie logowanie</div>
                <div>Akcje</div>
              </TableHeader>
              {users.map(user => (
                <TableRow key={user._id || user.id}>
                  <TableCell>
                    <strong>{user.username}</strong>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.roles && user.roles.length > 0 ? user.roles[0] : 'user')}</TableCell>
                  <TableCell>{formatDate(user.lastSeen || user.lastLogin)}</TableCell>
                  <TableCell>
                    <ActionButton className="edit">Edytuj</ActionButton>
                    <ActionButton className="delete">Usuń</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </UsersTable>
          </div>
        );
      
      case 'system':
        return (
          <div>
            <h2>Ustawienia systemu</h2>
            <p>Konfiguracja systemu i funkcjonalności</p>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <SystemSettings>
              <SettingCard>
                <SettingTitle>🔧 Ogólne</SettingTitle>
                <SettingItem>
                  <SettingLabel>Tryb konserwacji</SettingLabel>
                  <Toggle>
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => updateSystemSetting('maintenanceMode', e.target.checked)}
                    />
                    <span></span>
                  </Toggle>
                </SettingItem>
                <SettingItem>
                  <SettingLabel>Rejestracja użytkowników</SettingLabel>
                  <Toggle>
                    <input
                      type="checkbox"
                      checked={systemSettings.registrationEnabled}
                      onChange={(e) => updateSystemSetting('registrationEnabled', e.target.checked)}
                    />
                    <span></span>
                  </Toggle>
                </SettingItem>
              </SettingCard>
              
              <SettingCard>
                <SettingTitle>📧 Powiadomienia</SettingTitle>
                <SettingItem>
                  <SettingLabel>Powiadomienia email</SettingLabel>
                  <Toggle>
                    <input
                      type="checkbox"
                      checked={systemSettings.emailNotifications}
                      onChange={(e) => updateSystemSetting('emailNotifications', e.target.checked)}
                    />
                    <span></span>
                  </Toggle>
                </SettingItem>
                <SettingItem>
                  <SettingLabel>Automatyczne kopie zapasowe</SettingLabel>
                  <Toggle>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => updateSystemSetting('autoBackup', e.target.checked)}
                    />
                    <span></span>
                  </Toggle>
                </SettingItem>
              </SettingCard>
            </SystemSettings>
          </div>
        );
      
      default:
        return <div>Nieznana zakładka</div>;
    }
  };

  return (
    <Container>
      <PageTitle title="Panel Admina" description="Zarządzanie systemem i danymi" />
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
            $active={activeTab === tab.key}
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