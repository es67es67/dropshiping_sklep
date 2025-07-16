import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ShopProducts from './ShopProducts';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ShopHero = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
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

const ShopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const ShopLogo = styled.div`
  width: 120px;
  height: 120px;
  background: ${props => props.theme.gradient};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  
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

const ShopInfo = styled.div`
  flex: 1;
`;

const ShopName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const ShopDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const ShopStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Stat = styled.div`
  background: ${props => props.theme.background};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ShopDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const DetailSection = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DetailValue = styled.span`
  color: ${props => props.theme.text};
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: ${props => props.theme.gradient};
    color: white;
    
    &:hover {
      background: ${props => props.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadowHover};
    }
  }
  
  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.status === 'open' ? '#10B981' : '#EF4444'};
  color: white;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.textSecondary};
  background: ${props => props.theme.surface};
  
  &:hover {
    color: ${props => props.theme.primary};
  }
  
  ${props => props.active && `
    border-bottom-color: ${props.theme.primary};
    color: ${props.theme.primary};
    background: ${props.theme.background};
  `}
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
`;

export default function ShopDetails({ theme }) {
  const { shopId } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  // Sprawdź czy użytkownik jest właścicielem sklepu
  const isOwner = shop && user && shop.owner && shop.owner._id === user._id;

  useEffect(() => {
    fetchShopDetails();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać szczegółów sklepu');
      }

      const shopData = await response.json();
      setShop(shopData);
    } catch (err) {
      console.error('Błąd podczas pobierania szczegółów sklepu:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie szczegółów sklepu...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h3>Błąd podczas ładowania sklepu</h3>
          <p>{error}</p>
          <button onClick={fetchShopDetails} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Spróbuj ponownie
          </button>
        </div>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h3>Sklep nie został znaleziony</h3>
          <p>Sprawdź czy adres URL jest poprawny</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton to="/shops">
          ← Wróć do listy sklepów
        </BackButton>
      </Header>

      <ShopHero>
        <ShopHeader>
          <ShopLogo>🏪</ShopLogo>
          <ShopInfo>
            <ShopName>{shop.name}</ShopName>
            <ShopDescription>{shop.description}</ShopDescription>
            <StatusBadge status={shop.isActive ? 'open' : 'closed'}>
              {shop.isActive ? '🟢 Aktywny' : '🔴 Nieaktywny'}
            </StatusBadge>
          </ShopInfo>
        </ShopHeader>

        <ShopStats>
          <Stat>
            <StatValue>{shop.rating || 'Brak'}</StatValue>
            <StatLabel>Ocena</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{shop.stats?.totalReviews || 0}</StatValue>
            <StatLabel>Recenzje</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{shop.stats?.totalProducts || 0}</StatValue>
            <StatLabel>Produktów</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{shop.stats?.totalOrders || 0}</StatValue>
            <StatLabel>Zamówień</StatLabel>
          </Stat>
        </ShopStats>

        <ActionButtons>
          {isOwner ? (
            <>
              <Link to={`/shop/${shopId}/edit`} style={{ textDecoration: 'none', flex: 1 }}>
                <ActionButton className="primary">
                  ✏️ Edytuj sklep
                </ActionButton>
              </Link>
              <Link to={`/shop/${shopId}/live`} style={{ textDecoration: 'none', flex: 1 }}>
                <ActionButton className="secondary">
                  🎥 Live Shopping
                </ActionButton>
              </Link>
              <ActionButton className="secondary">
                📊 Statystyki
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton className="primary">
                🛒 Przejdź do sklepu
              </ActionButton>
              <ActionButton className="secondary">
                💬 Skontaktuj się
              </ActionButton>
              <ActionButton className="secondary">
                👁️ Obserwuj
              </ActionButton>
            </>
          )}
        </ActionButtons>
      </ShopHero>

      <TabsContainer>
        <Tab 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          📦 Produkty
        </Tab>
        <Tab 
          active={activeTab === 'details'} 
          onClick={() => setActiveTab('details')}
        >
          📋 Szczegóły
        </Tab>
      </TabsContainer>

      {activeTab === 'details' && (
        <ShopDetailsContainer>
          <DetailSection>
            <SectionTitle>📞 Informacje kontaktowe</SectionTitle>
            {shop.address && (
              <DetailItem>
                <DetailLabel>Adres:</DetailLabel>
                <DetailValue>{shop.address.street} {shop.address.houseNumber}, {shop.address.postalCode} {shop.address.city}</DetailValue>
              </DetailItem>
            )}
            {shop.phone && (
              <DetailItem>
                <DetailLabel>Telefon:</DetailLabel>
                <DetailValue>{shop.phone}</DetailValue>
              </DetailItem>
            )}
            {shop.email && (
              <DetailItem>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{shop.email}</DetailValue>
              </DetailItem>
            )}
            {shop.website && (
              <DetailItem>
                <DetailLabel>Strona WWW:</DetailLabel>
                <DetailValue>{shop.website}</DetailValue>
              </DetailItem>
            )}
            {shop.location && (
              <DetailItem>
                <DetailLabel>Lokalizacja:</DetailLabel>
                <DetailValue>{shop.location.name}</DetailValue>
              </DetailItem>
            )}
          </DetailSection>

          <DetailSection>
            <SectionTitle>🏢 Informacje o firmie</SectionTitle>
            {shop.categories && shop.categories.length > 0 && (
              <DetailItem>
                <DetailLabel>Kategorie:</DetailLabel>
                <DetailValue>{shop.categories.join(', ')}</DetailValue>
              </DetailItem>
            )}
            <DetailItem>
              <DetailLabel>Właściciel:</DetailLabel>
              <DetailValue>{shop.owner?.firstName} {shop.owner?.lastName} ({shop.owner?.username})</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Utworzony:</DetailLabel>
              <DetailValue>{new Date(shop.createdAt).toLocaleDateString('pl-PL')}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status:</DetailLabel>
              <DetailValue>{shop.isActive ? 'Aktywny' : 'Nieaktywny'}</DetailValue>
            </DetailItem>
          </DetailSection>

          <DetailSection>
            <SectionTitle>🚚 Dostawa</SectionTitle>
            {(shop.delivery || []).map((method, index) => (
              <DetailItem key={index}>
                <DetailLabel>Metoda {index + 1}:</DetailLabel>
                <DetailValue>{method}</DetailValue>
              </DetailItem>
            ))}
          </DetailSection>

          <DetailSection>
            <SectionTitle>💳 Płatności</SectionTitle>
            {(shop.payment || []).map((method, index) => (
              <DetailItem key={index}>
                <DetailLabel>Metoda {index + 1}:</DetailLabel>
                <DetailValue>{method}</DetailValue>
              </DetailItem>
            ))}
          </DetailSection>

          <DetailSection>
            <SectionTitle>🕒 Godziny otwarcia</SectionTitle>
            {Object.entries(shop.hours || {}).map(([day, hours]) => (
              <DetailItem key={day}>
                <DetailLabel>{day.charAt(0).toUpperCase() + day.slice(1)}:</DetailLabel>
                <DetailValue>{hours}</DetailValue>
              </DetailItem>
            ))}
          </DetailSection>
        </ShopDetailsContainer>
      )}

      {activeTab === 'products' && (
        <ShopProducts shopId={shopId} theme={theme} isOwner={isOwner} />
      )}
    </Container>
  );
} 