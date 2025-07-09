import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
  }
`;

const MarkAllButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationItem = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 4px solid ${props => props.read ? 'transparent' : props.theme.primary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  ${props => !props.read && `
    background: ${props.theme.primary}05;
  `}
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.type === 'success' ? '#10B981' : 
                props.type === 'warning' ? '#F59E0B' : 
                props.type === 'error' ? '#EF4444' : 
                props.type === 'info' ? '#3B82F6' : props.theme.primary};
  color: white;
`;

const NotificationInfo = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const NotificationContent = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const UnreadBadge = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Symulowane dane powiadomień
  const mockNotifications = [
    {
      id: 1,
      title: 'Zamówienie potwierdzone',
      content: 'Twoje zamówienie #12345 zostało potwierdzone i jest w trakcie realizacji.',
      type: 'success',
      time: '2 minuty temu',
      read: false,
      icon: '✅'
    },
    {
      id: 2,
      title: 'Nowa promocja',
      content: 'Sprawdź nasze nowe promocje! Rabat 20% na wszystkie produkty elektroniczne.',
      type: 'info',
      time: '1 godzinę temu',
      read: false,
      icon: '🎉'
    },
    {
      id: 3,
      title: 'Dostawa opóźniona',
      content: 'Przepraszamy, dostawa zamówienia #12340 może być opóźniona o 1-2 dni.',
      type: 'warning',
      time: '3 godziny temu',
      read: true,
      icon: '⚠️'
    },
    {
      id: 4,
      title: 'Płatność nieudana',
      content: 'Płatność za zamówienie #12338 nie została przetworzona. Sprawdź dane karty.',
      type: 'error',
      time: '1 dzień temu',
      read: true,
      icon: '❌'
    },
    {
      id: 5,
      title: 'Nowe osiągnięcie',
      content: 'Gratulacje! Otrzymałeś odznakę "Wierny klient" za 50 zamówień.',
      type: 'success',
      time: '2 dni temu',
      read: true,
      icon: '🏆'
    },
    {
      id: 6,
      title: 'Aktualizacja systemu',
      content: 'Portal został zaktualizowany. Sprawdź nowe funkcje!',
      type: 'info',
      time: '3 dni temu',
      read: true,
      icon: '🔄'
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie powiadomień...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Powiadomienia</Title>
      
      <Header>
        <FilterButtons>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            Wszystkie
            {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
          </FilterButton>
          <FilterButton
            active={filter === 'unread'}
            onClick={() => setFilter('unread')}
          >
            Nieprzeczytane
          </FilterButton>
          <FilterButton
            active={filter === 'success'}
            onClick={() => setFilter('success')}
          >
            Sukces
          </FilterButton>
          <FilterButton
            active={filter === 'warning'}
            onClick={() => setFilter('warning')}
          >
            Ostrzeżenia
          </FilterButton>
          <FilterButton
            active={filter === 'error'}
            onClick={() => setFilter('error')}
          >
            Błędy
          </FilterButton>
        </FilterButtons>
        
        <MarkAllButton onClick={markAllAsRead}>
          Oznacz wszystkie jako przeczytane
        </MarkAllButton>
      </Header>

      {filteredNotifications.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <h3>Brak powiadomień</h3>
          <p>Nie masz żadnych powiadomień w tej kategorii</p>
        </EmptyState>
      ) : (
        <NotificationsList>
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              read={notification.read}
              onClick={() => markAsRead(notification.id)}
            >
              <NotificationHeader>
                <NotificationIcon type={notification.type}>
                  {notification.icon}
                </NotificationIcon>
                <NotificationInfo>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationInfo>
              </NotificationHeader>
              
              <NotificationContent>
                {notification.content}
              </NotificationContent>
              
              <NotificationActions>
                {!notification.read && (
                  <ActionButton
                    className="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    Oznacz jako przeczytane
                  </ActionButton>
                )}
                <ActionButton
                  className="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  Usuń
                </ActionButton>
              </NotificationActions>
            </NotificationItem>
          ))}
        </NotificationsList>
      )}
    </Container>
  );
} 