import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  height: fit-content;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin: 0 auto 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

const UserName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const UserEmail = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StatValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MainContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const OrderDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const OrderStatus = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #10B98120;
          color: #10B981;
        `;
      case 'processing':
        return `
          background: #F59E0B20;
          color: #F59E0B;
        `;
      case 'shipped':
        return `
          background: #3B82F620;
          color: #3B82F6;
        `;
      default:
        return `
          background: ${props.theme.border};
          color: ${props.theme.textSecondary};
        `;
    }
  }}
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-left: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const SecuritySection = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SecurityTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SecurityLabel = styled.div`
  color: ${props => props.theme.text};
`;

const SecurityValue = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 123 456 789',
    address: 'ul. Przykładowa 123',
    city: 'Warszawa',
    postalCode: '00-001',
    dateOfBirth: '1990-01-01'
  });
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Symulowane dane zamówień
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'completed',
      total: '299.99 zł',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: '149.50 zł',
      items: 1
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'processing',
      total: '599.99 zł',
      items: 2
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Dane zostały zaktualizowane!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setUserData({
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      phone: '+48 123 456 789',
      address: 'ul. Przykładowa 123',
      city: 'Warszawa',
      postalCode: '00-001',
      dateOfBirth: '1990-01-01'
    });
  };

  const renderPersonalInfo = () => (
    <Form>
      <FormGrid>
        <FormRow>
          <Label>Imię</Label>
          <Input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
        
        <FormRow>
          <Label>Nazwisko</Label>
          <Input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
        
        <FormRow>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
        
        <FormRow>
          <Label>Telefon</Label>
          <Input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
        
        <FormRow>
          <Label>Data urodzenia</Label>
          <Input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
      </FormGrid>
      
      <FormRow>
        <Label>Adres</Label>
        <Input
          type="text"
          name="address"
          value={userData.address}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </FormRow>
      
      <FormGrid>
        <FormRow>
          <Label>Miasto</Label>
          <Input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
        
        <FormRow>
          <Label>Kod pocztowy</Label>
          <Input
            type="text"
            name="postalCode"
            value={userData.postalCode}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormRow>
      </FormGrid>
      
      {isEditing ? (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={handleSave}>Zapisz zmiany</Button>
          <Button onClick={handleCancel} style={{ background: '#6B7280' }}>Anuluj</Button>
        </div>
      ) : (
        <Button onClick={() => setIsEditing(true)} style={{ marginTop: '1rem' }}>
          Edytuj dane
        </Button>
      )}
    </Form>
  );

  const renderOrders = () => (
    <OrdersList>
      {orders.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3>Brak zamówień</h3>
          <p>Nie masz jeszcze żadnych zamówień</p>
        </EmptyState>
      ) : (
        orders.map(order => (
          <OrderItem key={order.id}>
            <OrderInfo>
              <OrderNumber>{order.id}</OrderNumber>
              <OrderDate>{order.date}</OrderDate>
            </OrderInfo>
            <OrderStatus status={order.status}>
              {order.status === 'completed' && 'Zrealizowane'}
              {order.status === 'processing' && 'W trakcie'}
              {order.status === 'shipped' && 'Wysłane'}
            </OrderStatus>
            <OrderTotal>{order.total}</OrderTotal>
          </OrderItem>
        ))
      )}
    </OrdersList>
  );

  const renderSecurity = () => (
    <div>
      <SecuritySection>
        <SecurityTitle>🔐 Bezpieczeństwo konta</SecurityTitle>
        <SecurityItem>
          <SecurityLabel>Hasło</SecurityLabel>
          <SecurityValue>Ostatnia zmiana: 3 miesiące temu</SecurityValue>
        </SecurityItem>
        <SecurityItem>
          <SecurityLabel>Weryfikacja email</SecurityLabel>
          <SecurityValue>Zweryfikowany ✅</SecurityValue>
        </SecurityItem>
        <SecurityItem>
          <SecurityLabel>Weryfikacja telefonu</SecurityLabel>
          <SecurityValue>Zweryfikowany ✅</SecurityValue>
        </SecurityItem>
        <SecurityItem>
          <SecurityLabel>Uwierzytelnianie dwuskładnikowe</SecurityLabel>
          <SecurityValue>Nieaktywne</SecurityValue>
        </SecurityItem>
      </SecuritySection>
      
      <Button>Zmień hasło</Button>
    </div>
  );

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie profilu...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Profil użytkownika</Title>
      
      <ProfileGrid>
        <Sidebar>
          <AvatarSection>
            <Avatar>👤</Avatar>
            <UserName>{userData.firstName} {userData.lastName}</UserName>
            <UserEmail>{userData.email}</UserEmail>
          </AvatarSection>
          
          <StatsList>
            <StatItem>
              <StatLabel>Zamówienia</StatLabel>
              <StatValue>{orders.length}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Dni aktywności</StatLabel>
              <StatValue>89</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Poziom</StatLabel>
              <StatValue>15</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Osiągnięcia</StatLabel>
              <StatValue>8/20</StatValue>
            </StatItem>
          </StatsList>
        </Sidebar>
        
        <MainContent>
          <TabNavigation>
            <TabButton
              active={activeTab === 'personal'}
              onClick={() => setActiveTab('personal')}
            >
              Dane osobowe
            </TabButton>
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            >
              Zamówienia
            </TabButton>
            <TabButton
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            >
              Bezpieczeństwo
            </TabButton>
          </TabNavigation>
          
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'security' && renderSecurity()}
        </MainContent>
      </ProfileGrid>
    </Container>
  );
} 