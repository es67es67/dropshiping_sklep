import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
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
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-around;
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
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
                props.type === 'info' ? '#3B82F6' : 
                props.type === 'order' ? '#8B5CF6' :
                props.type === 'payment' ? '#06B6D4' :
                props.type === 'achievement' ? '#F59E0B' :
                props.theme.primary};
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
  flex-wrap: wrap;
`;

const NotificationButton = styled.button`
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
  
  &.danger {
    background: #EF4444;
    color: white;
    
    &:hover {
      background: #DC2626;
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

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Przed chwilą';
  if (minutes < 60) return `${minutes} min temu`;
  if (hours < 24) return `${hours} godz. temu`;
  if (days < 7) return `${days} dni temu`;
  return new Date(date).toLocaleDateString('pl-PL');
};

const getNotificationIcon = (type) => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    order: '📦',
    payment: '💳',
    achievement: '🏆',
    message: '💬',
    system: '⚙️'
  };
  return icons[type] || '📢';
};

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać powiadomień');
      }

      const data = await response.json();
      setNotifications(data.notifications || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania powiadomień:', err);
      setError(err.message);
      // Fallback do mock danych
      setNotifications([
        {
          _id: '1',
          title: 'Zamówienie potwierdzone',
          content: 'Twoje zamówienie #12345 zostało potwierdzone i jest w trakcie realizacji.',
          type: 'order',
          createdAt: new Date(Date.now() - 120000).toISOString(),
          read: false,
          actionUrl: '/orders/12345'
        },
        {
          _id: '2',
          title: 'Nowa promocja',
          content: 'Sprawdź nasze nowe promocje! Rabat 20% na wszystkie produkty elektroniczne.',
          type: 'info',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          actionUrl: '/promotions'
        },
        {
          _id: '3',
          title: 'Dostawa opóźniona',
          content: 'Przepraszamy, dostawa zamówienia #12340 może być opóźniona o 1-2 dni.',
          type: 'warning',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          read: true,
          actionUrl: '/orders/12340'
        },
        {
          _id: '4',
          title: 'Płatność nieudana',
          content: 'Płatność za zamówienie #12338 nie została przetworzona. Sprawdź dane karty.',
          type: 'payment',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          actionUrl: '/payments'
        },
        {
          _id: '5',
          title: 'Nowe osiągnięcie',
          content: 'Gratulacje! Otrzymałeś odznakę "Wierny klient" za 50 zamówień.',
          type: 'achievement',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          actionUrl: '/achievements'
        },
        {
          _id: '6',
          title: 'Aktualizacja systemu',
          content: 'Portal został zaktualizowany. Sprawdź nowe funkcje!',
          type: 'system',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          read: true,
          actionUrl: '/changelog'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Symulacja statystyk
        setStats({
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length,
          today: notifications.filter(n => {
            const today = new Date();
            const notificationDate = new Date(n.createdAt);
            return today.toDateString() === notificationDate.toDateString();
          }).length
        });
      }
    } catch (err) {
      console.error('Błąd pobierania statystyk:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Błąd oznaczania jako przeczytane:', err);
      // Fallback
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      await fetch(`${apiUrl}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Błąd oznaczania wszystkich jako przeczytane:', err);
      // Fallback
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      await fetch(`${apiUrl}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Błąd usuwania powiadomienia:', err);
      // Fallback
      setNotifications(notifications.filter(n => n._id !== id));
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id || notification.id);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Zaloguj się</h3>
          <p>Musisz być zalogowany, aby zobaczyć powiadomienia</p>
        </EmptyState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie powiadomień...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Powiadomienia</Title>
      
      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Wszystkie</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.unread}</StatValue>
          <StatLabel>Nieprzeczytane</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.today}</StatValue>
          <StatLabel>Dzisiaj</StatLabel>
        </StatItem>
      </StatsBar>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
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
            active={filter === 'order'}
            onClick={() => setFilter('order')}
          >
            Zamówienia
          </FilterButton>
          <FilterButton
            active={filter === 'payment'}
            onClick={() => setFilter('payment')}
          >
            Płatności
          </FilterButton>
          <FilterButton
            active={filter === 'achievement'}
            onClick={() => setFilter('achievement')}
          >
            Osiągnięcia
          </FilterButton>
          <FilterButton
            active={filter === 'system'}
            onClick={() => setFilter('system')}
          >
            System
          </FilterButton>
        </FilterButtons>
        
        <ActionButtons>
          <ActionButton onClick={markAllAsRead}>
            Oznacz wszystkie jako przeczytane
          </ActionButton>
          <ActionButton onClick={fetchNotifications}>
            Odśwież
          </ActionButton>
        </ActionButtons>
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
              key={notification._id || notification.id}
              read={notification.read}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationHeader>
                <NotificationIcon type={notification.type}>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationInfo>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationTime>
                    {formatTimeAgo(notification.createdAt || notification.time)}
                  </NotificationTime>
                </NotificationInfo>
              </NotificationHeader>
              
              <NotificationContent>
                {notification.content}
              </NotificationContent>
              
              <NotificationActions>
                {!notification.read && (
                  <NotificationButton
                    className="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification._id || notification.id);
                    }}
                  >
                    Oznacz jako przeczytane
                  </NotificationButton>
                )}
                {notification.actionUrl && (
                  <NotificationButton
                    className="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(notification.actionUrl, '_blank');
                    }}
                  >
                    Zobacz szczegóły
                  </NotificationButton>
                )}
                <NotificationButton
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id || notification.id);
                  }}
                >
                  Usuń
                </NotificationButton>
              </NotificationActions>
            </NotificationItem>
          ))}
        </NotificationsList>
      )}
    </Container>
  );
} 