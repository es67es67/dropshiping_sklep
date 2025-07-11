import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 100px);
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}20;
  }
`;

const ContactList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  position: relative;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
  
  &.active {
    background: ${props => props.theme.primary}20;
    border-left: 4px solid ${props => props.theme.primary};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ContactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10B981;
  border: 2px solid ${props => props.theme.surface};
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContactType = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
`;

const ContactLastMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContactTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
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
`;

const ChatArea = styled.div`
  flex: 1;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ChatAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  position: relative;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ChatStatus = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ChatActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    color: ${props => props.theme.primary};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  
  &.own {
    flex-direction: row-reverse;
    
    .message-bubble {
      background: ${props => props.theme.primary};
      color: white;
      border-radius: 18px 18px 4px 18px;
    }
  }
  
  &.other .message-bubble {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border-radius: 18px 18px 18px 4px;
  }
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  box-shadow: ${props => props.theme.shadow};
`;

const MessageText = styled.div`
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
`;

const MessageInput = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.disabled ? props.theme.border : props.theme.primary};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary}dd;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  text-align: center;
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
  margin: 1rem;
`;

export default function MessagingSystem() {
  const { user, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact._id || selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      let url = `${apiUrl}/api/messages/contacts`;
      if (activeTab === 'groups') {
        url = `${apiUrl}/api/groups`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać kontaktów');
      }

      const data = await response.json();
      setContacts(data.contacts || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania kontaktów:', err);
      setError(err.message);
      // Fallback do mock danych
      setContacts([
        {
          _id: '1',
          name: 'Jan Kowalski',
          lastMessage: 'Dziękuję za szybką dostawę!',
          time: '14:30',
          avatar: 'JK',
          online: true,
          type: 'user',
          unreadCount: 2
        },
        {
          _id: '2',
          name: 'Anna Nowak',
          lastMessage: 'Czy produkt jest dostępny?',
          time: '12:15',
          avatar: 'AN',
          online: false,
          type: 'user',
          unreadCount: 0
        },
        {
          _id: '3',
          name: 'Piotr Wiśniewski',
          lastMessage: 'Zamówienie zostało złożone',
          time: '10:45',
          avatar: 'PW',
          online: true,
          type: 'user',
          unreadCount: 1
        },
        {
          _id: '4',
          name: 'Grupa - Sklep TechStore',
          lastMessage: 'Nowy produkt dostępny!',
          time: '09:20',
          avatar: '👥',
          online: true,
          type: 'group',
          unreadCount: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/messages/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać wiadomości');
      }

      const data = await response.json();
      setMessages(data.messages || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania wiadomości:', err);
      // Fallback do mock danych
      const mockMessages = {
        '1': [
          { _id: '1', text: 'Witam! Czy mogę pomóc?', time: '14:25', sender: '1', own: false },
          { _id: '2', text: 'Tak, chciałbym złożyć zamówienie', time: '14:26', sender: user?._id, own: true },
          { _id: '3', text: 'Dziękuję za szybką dostawę!', time: '14:30', sender: '1', own: false }
        ],
        '2': [
          { _id: '1', text: 'Dzień dobry!', time: '12:10', sender: '2', own: false },
          { _id: '2', text: 'Czy produkt jest dostępny?', time: '12:15', sender: user?._id, own: true }
        ],
        '3': [
          { _id: '1', text: 'Zamówienie zostało złożone', time: '10:45', sender: user?._id, own: true }
        ],
        '4': [
          { _id: '1', text: 'Nowy produkt dostępny!', time: '09:20', sender: '4', own: false },
          { _id: '2', text: 'Świetnie!', time: '09:25', sender: user?._id, own: true }
        ]
      };
      setMessages(mockMessages[contactId] || []);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      _id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      sender: user?._id,
      own: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Wysyłanie do API
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedContact._id || selectedContact.id,
          text: newMessage,
          type: selectedContact.type || 'user'
        })
      });
    } catch (err) {
      console.error('Błąd wysyłania wiadomości:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContactInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <EmptyState>
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
            <h3>Zaloguj się</h3>
            <p>Musisz być zalogowany, aby korzystać z systemu wiadomości</p>
          </div>
        </EmptyState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie wiadomości...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Wiadomości</SidebarTitle>
          <SearchInput 
            placeholder="Szukaj kontaktów..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SidebarHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'chats'} 
            onClick={() => setActiveTab('chats')}
          >
            💬 Czaty
          </Tab>
          <Tab 
            active={activeTab === 'groups'} 
            onClick={() => setActiveTab('groups')}
          >
            👥 Grupy
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ContactList>
          {filteredContacts.map(contact => (
            <ContactItem
              key={contact._id || contact.id}
              className={selectedContact?._id === contact._id ? 'active' : ''}
              onClick={() => setSelectedContact(contact)}
            >
              <ContactInfo>
                <ContactAvatar>
                  {contact.type === 'group' ? contact.avatar : getContactInitials(contact.name)}
                  {contact.online && <OnlineIndicator />}
                </ContactAvatar>
                <ContactDetails>
                  <ContactName>
                    {contact.name}
                    <ContactType>
                      {contact.type === 'group' ? 'Grupa' : 'Użytkownik'}
                    </ContactType>
                  </ContactName>
                  <ContactLastMessage>{contact.lastMessage}</ContactLastMessage>
                </ContactDetails>
                <ContactTime>{contact.time}</ContactTime>
              </ContactInfo>
              {contact.unreadCount > 0 && (
                <UnreadBadge>{contact.unreadCount}</UnreadBadge>
              )}
            </ContactItem>
          ))}
        </ContactList>
      </Sidebar>

      <ChatArea>
        {selectedContact ? (
          <>
            <ChatHeader>
              <ChatAvatar>
                {selectedContact.type === 'group' ? selectedContact.avatar : getContactInitials(selectedContact.name)}
                {selectedContact.online && <OnlineIndicator />}
              </ChatAvatar>
              <ChatInfo>
                <ChatName>{selectedContact.name}</ChatName>
                <ChatStatus>
                  {selectedContact.online ? '🟢 Online' : '⚪ Offline'}
                  {selectedContact.type === 'group' && ' • Grupa'}
                </ChatStatus>
              </ChatInfo>
              <ChatActions>
                <ActionButton title="Zadzwoń">📞</ActionButton>
                <ActionButton title="Wideo">📹</ActionButton>
                <ActionButton title="Więcej">⚙️</ActionButton>
              </ChatActions>
            </ChatHeader>

            <MessagesContainer>
              {messages.map(message => (
                <Message key={message._id || message.id} className={message.own ? 'own' : 'other'}>
                  <MessageAvatar>
                    {message.own ? getContactInitials(user?.username || 'TY') : 
                     selectedContact.type === 'group' ? selectedContact.avatar : 
                     getContactInitials(selectedContact.name)}
                  </MessageAvatar>
                  <MessageBubble className="message-bubble">
                    <MessageText>{message.text}</MessageText>
                    <MessageTime>{message.time}</MessageTime>
                  </MessageBubble>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <MessageInput>
              <Input
                type="text"
                placeholder="Napisz wiadomość..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                ➤
              </SendButton>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <div>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
              <h3>Wybierz kontakt</h3>
              <p>Wybierz kontakt z listy, aby rozpocząć rozmowę</p>
            </div>
          </EmptyState>
        )}
      </ChatArea>
    </Container>
  );
} 