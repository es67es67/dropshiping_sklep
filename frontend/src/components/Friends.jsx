import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

// Styled components
const FriendsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FriendsTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  
  &.active {
    border-bottom-color: #007bff;
    color: #007bff;
  }
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const Avatar = styled.div`
  margin-right: 15px;
  
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const Info = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 5px 0;
  }
  
  p {
    margin: 0 0 5px 0;
    color: #666;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &.btn-primary {
    background: #007bff;
    color: white;
  }
  
  &.btn-success {
    background: #28a745;
    color: white;
  }
  
  &.btn-danger {
    background: #dc3545;
    color: white;
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 20px;
`;

const RequestMessage = styled.p`
  font-style: italic;
  color: #666;
  margin: 5px 0;
`;

const UserBio = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const Friends = () => {
  const { user, token } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    if (token) {
      loadFriends();
      loadPendingRequests();
    }
  }, [token]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/friendships/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Błąd ładowania znajomych:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friendships/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Błąd ładowania zaproszeń:', error);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Błąd wyszukiwania użytkowników:', error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/friendships/send-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId: userId })
      });
      
      if (response.ok) {
        alert('Zaproszenie zostało wysłane!');
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Błąd wysyłania zaproszenia:', error);
    }
  };

  const acceptFriendRequest = async (friendshipId) => {
    try {
      const response = await fetch(`${API_URL}/api/friendships/${friendshipId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Zaproszenie zostało zaakceptowane!');
        loadFriends();
        loadPendingRequests();
      }
    } catch (error) {
      console.error('Błąd akceptowania zaproszenia:', error);
    }
  };

  const rejectFriendRequest = async (friendshipId) => {
    try {
      const response = await fetch(`${API_URL}/api/friendships/${friendshipId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Zaproszenie zostało odrzucone!');
        loadPendingRequests();
      }
    } catch (error) {
      console.error('Błąd odrzucania zaproszenia:', error);
    }
  };

  const removeFriend = async (friendshipId) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego znajomego?')) {
      try {
        const response = await fetch(`${API_URL}/api/friendships/${friendshipId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          alert('Znajomy został usunięty!');
          loadFriends();
        }
      } catch (error) {
        console.error('Błąd usuwania znajomego:', error);
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <FriendsContainer>
      <h2>Znajomi</h2>
      
      <FriendsTabs>
        <TabButton 
          className={activeTab === 'friends' ? 'active' : ''} 
          onClick={() => setActiveTab('friends')}
        >
          Znajomi ({friends.length})
        </TabButton>
        <TabButton 
          className={activeTab === 'requests' ? 'active' : ''} 
          onClick={() => setActiveTab('requests')}
        >
          Zaproszenia ({pendingRequests.length})
        </TabButton>
        <TabButton 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Znajdź znajomych
        </TabButton>
      </FriendsTabs>

      {activeTab === 'friends' && (
        <div>
          {loading ? (
            <p>Ładowanie znajomych...</p>
          ) : friends.length === 0 ? (
            <p>Nie masz jeszcze znajomych. Dodaj ich w zakładce "Znajdź znajomych"!</p>
          ) : (
            friends.map(friend => (
              <FriendItem key={friend._id}>
                <Avatar>
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.firstName} />
                  ) : (
                    <AvatarPlaceholder>
                      {friend.firstName.charAt(0)}{friend.lastName.charAt(0)}
                    </AvatarPlaceholder>
                  )}
                </Avatar>
                <Info>
                  <h4>{friend.firstName} {friend.lastName}</h4>
                  <p>@{friend.username}</p>
                  <small>Znajomi od: {new Date(friend.friendsSince).toLocaleDateString()}</small>
                </Info>
                <Actions>
                  <Button 
                    className="btn-primary"
                    onClick={() => window.location.href = `/profile/${friend._id}`}
                  >
                    Profil
                  </Button>
                  <Button 
                    className="btn-danger"
                    onClick={() => removeFriend(friend.friendshipId)}
                  >
                    Usuń
                  </Button>
                </Actions>
              </FriendItem>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
          {pendingRequests.length === 0 ? (
            <p>Brak oczekujących zaproszeń.</p>
          ) : (
            pendingRequests.map(request => (
              <FriendItem key={request._id}>
                <Avatar>
                  {request.requester.avatar ? (
                    <img src={request.requester.avatar} alt={request.requester.firstName} />
                  ) : (
                    <AvatarPlaceholder>
                      {request.requester.firstName.charAt(0)}{request.requester.lastName.charAt(0)}
                    </AvatarPlaceholder>
                  )}
                </Avatar>
                <Info>
                  <h4>{request.requester.firstName} {request.requester.lastName}</h4>
                  <p>@{request.requester.username}</p>
                  {request.message && <RequestMessage>"{request.message}"</RequestMessage>}
                  <small>{new Date(request.requestedAt).toLocaleDateString()}</small>
                </Info>
                <Actions>
                  <Button 
                    className="btn-success"
                    onClick={() => acceptFriendRequest(request._id)}
                  >
                    Akceptuj
                  </Button>
                  <Button 
                    className="btn-danger"
                    onClick={() => rejectFriendRequest(request._id)}
                  >
                    Odrzuć
                  </Button>
                </Actions>
              </FriendItem>
            ))
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <SearchInput
            type="text"
            placeholder="Wyszukaj użytkowników..."
            value={searchQuery}
            onChange={handleSearch}
          />
          
          <div>
            {searchResults.map(user => (
              <FriendItem key={user._id}>
                <Avatar>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} />
                  ) : (
                    <AvatarPlaceholder>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarPlaceholder>
                  )}
                </Avatar>
                <Info>
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p>@{user.username}</p>
                  {user.bio && <UserBio>{user.bio}</UserBio>}
                </Info>
                <Actions>
                  <Button 
                    className="btn-primary"
                    onClick={() => sendFriendRequest(user._id)}
                  >
                    Dodaj znajomego
                  </Button>
                  <Button 
                    className="btn-secondary"
                    onClick={() => window.location.href = `/profile/${user._id}`}
                  >
                    Zobacz profil
                  </Button>
                </Actions>
              </FriendItem>
            ))}
          </div>
        </div>
      )}
    </FriendsContainer>
  );
};

export default Friends; 