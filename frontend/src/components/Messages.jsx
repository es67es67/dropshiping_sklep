import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

const Messages = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Błąd ładowania konwersacji:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Błąd ładowania wiadomości:', error);
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
        // Filtruj użytkowników, którzy nie są już w konwersacjach
        const existingUserIds = conversations.map(conv => 
          conv.participants.find(p => p._id !== user._id)?._id
        );
        const filteredUsers = data.users.filter(u => 
          u._id !== user._id && !existingUserIds.includes(u._id)
        );
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error('Błąd wyszukiwania użytkowników:', error);
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participantId: userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations([data.conversation, ...conversations]);
        setSelectedConversation(data.conversation);
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Błąd tworzenia konwersacji:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${API_URL}/api/messages/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
        
        // Aktualizuj ostatnią wiadomość w konwersacji
        const updatedConversations = conversations.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: data.message }
            : conv
        );
        setConversations(updatedConversations);
      }
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
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

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Wczoraj';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="sidebar-header">
          <h3>Wiadomości</h3>
          <button 
            className="btn btn-primary"
            onClick={() => document.getElementById('search-users').focus()}
          >
            Nowa wiadomość
          </button>
        </div>

        <div className="search-section">
          <input
            id="search-users"
            type="text"
            placeholder="Wyszukaj użytkowników..."
            value={searchQuery}
            onChange={handleSearch}
          />
          
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div key={user._id} className="search-result">
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h4>{user.firstName} {user.lastName}</h4>
                    <p>@{user.username}</p>
                  </div>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => startConversation(user._id)}
                  >
                    Napisz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="conversations-list">
          {loading ? (
            <p>Ładowanie konwersacji...</p>
          ) : conversations.length === 0 ? (
            <p>Brak konwersacji. Rozpocznij nową wiadomość!</p>
          ) : (
            conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              return (
                <div 
                  key={conversation._id} 
                  className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {otherUser.firstName.charAt(0)}{otherUser.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="conversation-info">
                    <h4>{otherUser.firstName} {otherUser.lastName}</h4>
                    {conversation.lastMessage && (
                      <p className="last-message">
                        {conversation.lastMessage.content.length > 30 
                          ? conversation.lastMessage.content.substring(0, 30) + '...'
                          : conversation.lastMessage.content
                        }
                      </p>
                    )}
                    <small>{conversation.lastMessage ? formatDate(conversation.lastMessage.createdAt) : ''}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="messages-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              {(() => {
                const otherUser = getOtherParticipant(selectedConversation);
                return (
                  <>
                    <div className="chat-user-info">
                      <div className="user-avatar">
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {otherUser.firstName.charAt(0)}{otherUser.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3>{otherUser.firstName} {otherUser.lastName}</h3>
                        <small>@{otherUser.username}</small>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="messages-list">
              {messages.map(message => (
                <div 
                  key={message._id} 
                  className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.content}</p>
                    <small>{formatDate(message.createdAt)}</small>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Napisz wiadomość..."
                maxLength={500}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                Wyślij
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <h3>Wybierz konwersację</h3>
            <p>Wybierz konwersację z listy po lewej stronie, aby rozpocząć czat.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .messages-container {
          display: flex;
          height: 80vh;
          max-width: 1200px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .messages-sidebar {
          width: 300px;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h3 {
          margin: 0;
        }

        .search-section {
          padding: 15px;
          border-bottom: 1px solid #ddd;
        }

        .search-section input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .search-results {
          margin-top: 10px;
        }

        .search-result {
          display: flex;
          align-items: center;
          padding: 10px;
          border: 1px solid #ddd;
          margin-bottom: 5px;
          border-radius: 4px;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .conversation-item:hover,
        .conversation-item.active {
          background-color: #f8f9fa;
        }

        .conversation-avatar,
        .user-avatar {
          margin-right: 10px;
        }

        .conversation-avatar img,
        .user-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .conversation-info {
          flex: 1;
        }

        .conversation-info h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }

        .last-message {
          margin: 0 0 5px 0;
          color: #666;
          font-size: 12px;
        }

        .conversation-info small {
          color: #999;
          font-size: 11px;
        }

        .messages-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 20px;
          border-bottom: 1px solid #ddd;
          background: #f8f9fa;
        }

        .chat-user-info {
          display: flex;
          align-items: center;
        }

        .chat-user-info h3 {
          margin: 0 0 5px 0;
        }

        .chat-user-info small {
          color: #666;
        }

        .messages-list {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message {
          display: flex;
          margin-bottom: 10px;
        }

        .message.sent {
          justify-content: flex-end;
        }

        .message.received {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }

        .message.sent .message-content {
          background: #007bff;
          color: white;
        }

        .message.received .message-content {
          background: #e9ecef;
          color: #333;
        }

        .message-content p {
          margin: 0 0 5px 0;
        }

        .message-content small {
          font-size: 11px;
          opacity: 0.7;
        }

        .message-form {
          padding: 20px;
          border-top: 1px solid #ddd;
          display: flex;
          gap: 10px;
        }

        .message-form input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
        }

        .message-form button {
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .message-form button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #666;
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

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default Messages; 