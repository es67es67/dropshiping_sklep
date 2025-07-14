import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

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
    <div className="friends-container">
      <h2>Znajomi</h2>
      
      <div className="friends-tabs">
        <button 
          className={activeTab === 'friends' ? 'active' : ''} 
          onClick={() => setActiveTab('friends')}
        >
          Znajomi ({friends.length})
        </button>
        <button 
          className={activeTab === 'requests' ? 'active' : ''} 
          onClick={() => setActiveTab('requests')}
        >
          Zaproszenia ({pendingRequests.length})
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Znajdź znajomych
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="friends-list">
          {loading ? (
            <p>Ładowanie znajomych...</p>
          ) : friends.length === 0 ? (
            <p>Nie masz jeszcze znajomych. Dodaj ich w zakładce "Znajdź znajomych"!</p>
          ) : (
            friends.map(friend => (
              <div key={friend._id} className="friend-item">
                <div className="friend-avatar">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.firstName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {friend.firstName.charAt(0)}{friend.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="friend-info">
                  <h4>{friend.firstName} {friend.lastName}</h4>
                  <p>@{friend.username}</p>
                  <small>Znajomi od: {new Date(friend.friendsSince).toLocaleDateString()}</small>
                </div>
                <div className="friend-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = `/profile/${friend._id}`}
                  >
                    Profil
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => removeFriend(friend.friendshipId)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-list">
          {pendingRequests.length === 0 ? (
            <p>Brak oczekujących zaproszeń.</p>
          ) : (
            pendingRequests.map(request => (
              <div key={request._id} className="request-item">
                <div className="request-avatar">
                  {request.requester.avatar ? (
                    <img src={request.requester.avatar} alt={request.requester.firstName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {request.requester.firstName.charAt(0)}{request.requester.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="request-info">
                  <h4>{request.requester.firstName} {request.requester.lastName}</h4>
                  <p>@{request.requester.username}</p>
                  {request.message && <p className="request-message">"{request.message}"</p>}
                  <small>{new Date(request.requestedAt).toLocaleDateString()}</small>
                </div>
                <div className="request-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => acceptFriendRequest(request._id)}
                  >
                    Akceptuj
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => rejectFriendRequest(request._id)}
                  >
                    Odrzuć
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="search-section">
          <div className="search-input">
            <input
              type="text"
              placeholder="Wyszukaj użytkowników..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="search-results">
            {searchResults.map(user => (
              <div key={user._id} className="search-result-item">
                <div className="result-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="result-info">
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p>@{user.username}</p>
                  {user.bio && <p className="user-bio">{user.bio}</p>}
                </div>
                <div className="result-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => sendFriendRequest(user._id)}
                  >
                    Dodaj znajomego
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.href = `/profile/${user._id}`}
                  >
                    Zobacz profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .friends-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .friends-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }

        .friends-tabs button {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .friends-tabs button.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .friend-item, .request-item, .search-result-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          margin-bottom: 10px;
          border-radius: 8px;
        }

        .friend-avatar, .request-avatar, .result-avatar {
          margin-right: 15px;
        }

        .friend-avatar img, .request-avatar img, .result-avatar img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .friend-info, .request-info, .result-info {
          flex: 1;
        }

        .friend-info h4, .request-info h4, .result-info h4 {
          margin: 0 0 5px 0;
        }

        .friend-info p, .request-info p, .result-info p {
          margin: 0 0 5px 0;
          color: #666;
        }

        .friend-actions, .request-actions, .result-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .search-input input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .request-message {
          font-style: italic;
          color: #666;
          margin: 5px 0;
        }

        .user-bio {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default Friends; 