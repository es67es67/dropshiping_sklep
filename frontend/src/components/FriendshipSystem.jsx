import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FriendshipContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FriendshipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
`;

const FriendshipTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const FriendCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FriendAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const FriendName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const FriendUsername = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const FriendActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 6px;
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.primary};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.secondary : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const RequestCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  margin-bottom: 12px;
`;

const RequestActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const AcceptButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.colors.success || '#10b981'};
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.success || '#059669'};
  }
`;

const RejectButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.error || '#ef4444'};
  border-radius: 6px;
  background: transparent;
  color: ${props => props.theme.colors.error || '#ef4444'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.error || '#ef4444'};
    color: white;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const FriendshipSystem = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userId) {
      loadFriendshipData();
    }
  }, [userId, activeTab]);

  const loadFriendshipData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const [friendsRes, pendingRes, sentRes, blockedRes, suggestionsRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/api/friendships/friends`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/friendships/pending-requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/friendships/sent-requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/friendships/blocked-users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/friendships/suggestions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/friendships/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        setFriends(friendsData.friends || []);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData.requests || []);
      }

      if (sentRes.ok) {
        const sentData = await sentRes.json();
        setSentRequests(sentData.requests || []);
      }

      if (blockedRes.ok) {
        const blockedData = await blockedRes.json();
        setBlockedUsers(blockedData.blockedUsers || []);
      }

      if (suggestionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData.suggestions || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || {});
      }

    } catch (error) {
      console.error('Błąd ładowania danych znajomych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (recipientId, message = '') => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/friendships/send-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipientId, message })
      });

      if (response.ok) {
        alert('Zaproszenie zostało wysłane!');
        loadFriendshipData();
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd wysyłania zaproszenia:', error);
      alert('Błąd wysyłania zaproszenia');
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/friendships/accept/${friendshipId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Zaproszenie zostało zaakceptowane!');
        loadFriendshipData();
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd akceptowania zaproszenia:', error);
      alert('Błąd akceptowania zaproszenia');
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/friendships/reject/${friendshipId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Odrzucone przez użytkownika' })
      });

      if (response.ok) {
        alert('Zaproszenie zostało odrzucone');
        loadFriendshipData();
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd odrzucania zaproszenia:', error);
      alert('Błąd odrzucania zaproszenia');
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!confirm('Czy na pewno chcesz usunąć tego znajomego?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/friendships/remove/${friendshipId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Znajomy został usunięty');
        loadFriendshipData();
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd usuwania znajomego:', error);
      alert('Błąd usuwania znajomego');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/friendships/block/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Użytkownik został zablokowany');
        loadFriendshipData();
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd blokowania użytkownika:', error);
      alert('Błąd blokowania użytkownika');
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredFriends = friends.filter(friend =>
    friend.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!userId) {
    return null;
  }

  return (
    <FriendshipContainer>
      <FriendshipHeader>
        <FriendshipTitle>System Znajomych</FriendshipTitle>
      </FriendshipHeader>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.totalFriends || 0}</StatNumber>
          <StatLabel>Znajomi</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pendingRequests || 0}</StatNumber>
          <StatLabel>Oczekujące</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.sentRequests || 0}</StatNumber>
          <StatLabel>Wysłane</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.blockedUsers || 0}</StatNumber>
          <StatLabel>Zablokowani</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab 
          active={activeTab === 'friends'} 
          onClick={() => setActiveTab('friends')}
        >
          Znajomi ({friends.length})
        </Tab>
        <Tab 
          active={activeTab === 'pending'} 
          onClick={() => setActiveTab('pending')}
        >
          Oczekujące ({pendingRequests.length})
        </Tab>
        <Tab 
          active={activeTab === 'sent'} 
          onClick={() => setActiveTab('sent')}
        >
          Wysłane ({sentRequests.length})
        </Tab>
        <Tab 
          active={activeTab === 'suggestions'} 
          onClick={() => setActiveTab('suggestions')}
        >
          Sugestie ({suggestions.length})
        </Tab>
        <Tab 
          active={activeTab === 'blocked'} 
          onClick={() => setActiveTab('blocked')}
        >
          Zablokowani ({blockedUsers.length})
        </Tab>
      </TabContainer>

      {activeTab === 'friends' && (
        <div>
          <SearchInput
            type="text"
            placeholder="Szukaj znajomych..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {loading ? (
            <EmptyState>Ładowanie znajomych...</EmptyState>
          ) : filteredFriends.length > 0 ? (
            <FriendsGrid>
              {filteredFriends.map((friend) => (
                <FriendCard key={friend._id}>
                  <FriendAvatar>
                    {friend.avatar ? (
                      <img src={friend.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      getInitials(friend.firstName, friend.lastName)
                    )}
                  </FriendAvatar>
                  <FriendName>{friend.firstName} {friend.lastName}</FriendName>
                  <FriendUsername>@{friend.username}</FriendUsername>
                  <FriendActions>
                    <ActionButton variant="primary">Wiadomość</ActionButton>
                    <ActionButton onClick={() => handleRemoveFriend(friend.friendshipId)}>
                      Usuń
                    </ActionButton>
                  </FriendActions>
                </FriendCard>
              ))}
            </FriendsGrid>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <h3>Brak znajomych</h3>
              <p>Dodaj znajomych, aby zobaczyć ich tutaj</p>
            </EmptyState>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div>
          {loading ? (
            <EmptyState>Ładowanie zaproszeń...</EmptyState>
          ) : pendingRequests.length > 0 ? (
            <div>
              {pendingRequests.map((request) => (
                <RequestCard key={request._id}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <FriendAvatar style={{ marginBottom: 0, marginRight: '12px' }}>
                      {request.requester.avatar ? (
                        <img src={request.requester.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      ) : (
                        getInitials(request.requester.firstName, request.requester.lastName)
                      )}
                    </FriendAvatar>
                    <div>
                      <FriendName>{request.requester.firstName} {request.requester.lastName}</FriendName>
                      <FriendUsername>@{request.requester.username}</FriendUsername>
                    </div>
                  </div>
                  {request.message && (
                    <div style={{ marginBottom: '12px', color: '#6b7280' }}>
                      "{request.message}"
                    </div>
                  )}
                  <RequestActions>
                    <AcceptButton onClick={() => handleAcceptRequest(request._id)}>
                      Akceptuj
                    </AcceptButton>
                    <RejectButton onClick={() => handleRejectRequest(request._id)}>
                      Odrzuć
                    </RejectButton>
                  </RequestActions>
                </RequestCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📨</div>
              <h3>Brak oczekujących zaproszeń</h3>
            </EmptyState>
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div>
          {loading ? (
            <EmptyState>Ładowanie wysłanych zaproszeń...</EmptyState>
          ) : sentRequests.length > 0 ? (
            <div>
              {sentRequests.map((request) => (
                <RequestCard key={request._id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FriendAvatar style={{ marginBottom: 0, marginRight: '12px' }}>
                      {request.recipient.avatar ? (
                        <img src={request.recipient.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      ) : (
                        getInitials(request.recipient.firstName, request.recipient.lastName)
                      )}
                    </FriendAvatar>
                    <div>
                      <FriendName>{request.recipient.firstName} {request.recipient.lastName}</FriendName>
                      <FriendUsername>@{request.recipient.username}</FriendUsername>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Wysłano: {new Date(request.requestedAt).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </div>
                </RequestCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
              <h3>Brak wysłanych zaproszeń</h3>
            </EmptyState>
          )}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div>
          {loading ? (
            <EmptyState>Ładowanie sugestii...</EmptyState>
          ) : suggestions.length > 0 ? (
            <FriendsGrid>
              {suggestions.map((suggestion) => (
                <FriendCard key={suggestion.user._id}>
                  <FriendAvatar>
                    {suggestion.user.avatar ? (
                      <img src={suggestion.user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      getInitials(suggestion.user.firstName, suggestion.user.lastName)
                    )}
                  </FriendAvatar>
                  <FriendName>{suggestion.user.firstName} {suggestion.user.lastName}</FriendName>
                  <FriendUsername>@{suggestion.user.username}</FriendUsername>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    {suggestion.mutualFriendsCount} wspólnych znajomych
                  </div>
                  <FriendActions>
                    <ActionButton 
                      variant="primary" 
                      onClick={() => handleSendRequest(suggestion.user._id)}
                    >
                      Dodaj
                    </ActionButton>
                  </FriendActions>
                </FriendCard>
              ))}
            </FriendsGrid>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
              <h3>Brak sugestii</h3>
              <p>Nie mamy jeszcze sugestii znajomych dla Ciebie</p>
            </EmptyState>
          )}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div>
          {loading ? (
            <EmptyState>Ładowanie zablokowanych użytkowników...</EmptyState>
          ) : blockedUsers.length > 0 ? (
            <FriendsGrid>
              {blockedUsers.map((user) => (
                <FriendCard key={user._id}>
                  <FriendAvatar>
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      getInitials(user.firstName, user.lastName)
                    )}
                  </FriendAvatar>
                  <FriendName>{user.firstName} {user.lastName}</FriendName>
                  <FriendUsername>@{user.username}</FriendUsername>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    Zablokowano: {new Date(user.blockedAt).toLocaleDateString('pl-PL')}
                  </div>
                  <FriendActions>
                    <ActionButton>Odblokuj</ActionButton>
                  </FriendActions>
                </FriendCard>
              ))}
            </FriendsGrid>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
              <h3>Brak zablokowanych użytkowników</h3>
            </EmptyState>
          )}
        </div>
      )}
    </FriendshipContainer>
  );
};

export default FriendshipSystem; 