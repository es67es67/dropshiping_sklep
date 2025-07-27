import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';
import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  height: 80vh;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const MessagesSidebar = styled.div`
  width: 300px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
  }
`;

const SearchSection = styled.div`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const SearchResults = styled.div`
  margin-top: 10px;
`;

const SearchResult = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 4px;
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover,
  &.active {
    background-color: #f8f9fa;
  }
`;

const Avatar = styled.div`
  margin-right: 10px;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const MessagesMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  
  h3 {
    margin: 0;
  }
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  &.sent {
    justify-content: flex-end;
  }
  
  &.received {
    justify-content: flex-start;
  }
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
  
  ${props => props.sent ? `
    background: #007bff;
    color: white;
  ` : `
    background: #e9ecef;
    color: #333;
  `}
  
  p {
    margin: 0 0 5px 0;
  }
  
  small {
    font-size: 11px;
    opacity: 0.7;
  }
`;

const MessageForm = styled.form`
  padding: 20px;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 10px;
  
  input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
  }
  
  button {
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

const NoConversation = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
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
  
  &.btn-sm {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

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
      const response = await fetch(`${API_URL}/messaging/conversations/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data || []);
      }
    } catch (error) {
      console.error('Błąd ładowania konwersacji:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/messaging/messages/${user._id}/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data || []);
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
      const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filtruj użytkowników, którzy nie są już w konwersacjach
        const existingUserIds = conversations.map(conv => conv._id);
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
      // W modułu messaging konwersacje są tworzone automatycznie przy pierwszej wiadomości
      // Więc po prostu ustawiamy wybraną konwersację
      const newConversation = {
        _id: userId,
        user: searchResults.find(u => u._id === userId)
      };
      setSelectedConversation(newConversation);
      setSearchResults([]);
      setSearchQuery('');
      
      // Dodaj do listy konwersacji jeśli nie istnieje
      const exists = conversations.find(conv => conv._id === userId);
      if (!exists) {
        setConversations([newConversation, ...conversations]);
      }
    } catch (error) {
      console.error('Błąd tworzenia konwersacji:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${API_URL}/messaging/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          senderId: user._id,
          receiverId: selectedConversation._id,
          content: newMessage 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data]);
        setNewMessage('');
        
        // Aktualizuj ostatnią wiadomość w konwersacji
        const updatedConversations = conversations.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: data }
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
    return conversation.user || conversation.participants?.find(p => p._id !== user._id);
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

  // Sprawdź czy użytkownik jest zalogowany
  if (!user || !token) {
    return (
      <div className="messages-container">
        <div className="messages-login-required">
          <h2>Wiadomości</h2>
          <p>Aby korzystać z wiadomości, musisz się zalogować.</p>
          <div className="login-actions">
            <a href="/login" className="btn btn-primary">Zaloguj się</a>
            <a href="/register" className="btn btn-secondary">Zarejestruj się</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MessagesContainer>
      <MessagesSidebar>
        <SidebarHeader>
          <h3>Wiadomości</h3>
          <Button 
            className="btn-primary"
            onClick={() => document.getElementById('search-users').focus()}
          >
            Nowa wiadomość
          </Button>
        </SidebarHeader>

        <SearchSection>
          <input
            id="search-users"
            type="text"
            placeholder="Wyszukaj użytkowników..."
            value={searchQuery}
            onChange={handleSearch}
          />
          
          {searchResults.length > 0 && (
            <SearchResults>
              {searchResults.map(user => (
                <SearchResult key={user._id}>
                  <Avatar>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} />
                    ) : (
                      <AvatarPlaceholder>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarPlaceholder>
                    )}
                  </Avatar>
                  <div className="user-info">
                    <h4>{user.firstName} {user.lastName}</h4>
                    <p>@{user.username}</p>
                  </div>
                  <Button 
                    className="btn-sm btn-primary"
                    onClick={() => startConversation(user._id)}
                  >
                    Napisz
                  </Button>
                </SearchResult>
              ))}
            </SearchResults>
          )}
        </SearchSection>

        <ConversationsList>
          {loading ? (
            <p>Ładowanie konwersacji...</p>
          ) : conversations.length === 0 ? (
            <p>Brak konwersacji. Rozpocznij nową wiadomość!</p>
          ) : (
            conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              return (
                <ConversationItem 
                  key={conversation._id} 
                  className={selectedConversation?._id === conversation._id ? 'active' : ''}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <Avatar>
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      <AvatarPlaceholder>
                        {otherUser.firstName.charAt(0)}{otherUser.lastName.charAt(0)}
                      </AvatarPlaceholder>
                    )}
                  </Avatar>
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
                </ConversationItem>
              );
            })
          )}
        </ConversationsList>
      </MessagesSidebar>

      <MessagesMain>
        {selectedConversation ? (
          <>
            <MessagesHeader>
              {(() => {
                const otherUser = getOtherParticipant(selectedConversation);
                return (
                  <>
                    <div className="chat-user-info">
                      <Avatar>
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.firstName} />
                        ) : (
                          <AvatarPlaceholder>
                            {otherUser.firstName.charAt(0)}{otherUser.lastName.charAt(0)}
                          </AvatarPlaceholder>
                        )}
                      </Avatar>
                      <div>
                        <h3>{otherUser.firstName} {otherUser.lastName}</h3>
                        <small>@{otherUser.username}</small>
                      </div>
                    </div>
                  </>
                );
              })()}
            </MessagesHeader>

            <MessagesList>
              {messages.map(message => (
                <Message 
                  key={message._id} 
                  className={message.sender._id === user._id ? 'sent' : 'received'}
                >
                  <MessageContent sent={message.sender._id === user._id}>
                    <p>{message.content}</p>
                    <small>{formatDate(message.createdAt)}</small>
                  </MessageContent>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessagesList>

            <MessageForm onSubmit={sendMessage}>
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
            </MessageForm>
          </>
        ) : (
          <NoConversation>
            <h3>Wybierz konwersację</h3>
            <p>Wybierz konwersację z listy po lewej stronie, aby rozpocząć czat.</p>
          </NoConversation>
        )}
      </MessagesMain>
    </MessagesContainer>
  );
};

export default Messages; 