import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 100px);
  display: flex;
  gap: 2rem;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
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

const ContactList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  
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
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
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

const ChatArea = styled.div`
  flex: 1;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
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
  font-size: 0.875rem;
  font-weight: 600;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  box-shadow: ${props => props.theme.shadow};
`;

const MessageText = styled.div`
  margin-bottom: 0.25rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const MessageInput = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 25px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

export default function MessagingSystem() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Symulowane dane kontaktów
  const mockContacts = [
    {
      id: 1,
      name: 'Jan Kowalski',
      lastMessage: 'Dziękuję za szybką dostawę!',
      time: '14:30',
      avatar: 'JK',
      online: true
    },
    {
      id: 2,
      name: 'Anna Nowak',
      lastMessage: 'Czy produkt jest dostępny?',
      time: '12:15',
      avatar: 'AN',
      online: false
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      lastMessage: 'Zamówienie zostało złożone',
      time: '10:45',
      avatar: 'PW',
      online: true
    }
  ];

  // Symulowane wiadomości
  const mockMessages = {
    1: [
      { id: 1, text: 'Witam! Czy mogę pomóc?', time: '14:25', own: false },
      { id: 2, text: 'Tak, chciałbym złożyć zamówienie', time: '14:26', own: true },
      { id: 3, text: 'Dziękuję za szybką dostawę!', time: '14:30', own: false }
    ],
    2: [
      { id: 1, text: 'Dzień dobry!', time: '12:10', own: false },
      { id: 2, text: 'Czy produkt jest dostępny?', time: '12:15', own: true }
    ],
    3: [
      { id: 1, text: 'Zamówienie zostało złożone', time: '10:45', own: true }
    ]
  };

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages[selectedContact.id] || []);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      own: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie wiadomości...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Wiadomości</SidebarTitle>
          <SearchInput placeholder="Szukaj kontaktów..." />
        </SidebarHeader>
        <ContactList>
          {contacts.map(contact => (
            <ContactItem
              key={contact.id}
              className={selectedContact?.id === contact.id ? 'active' : ''}
              onClick={() => setSelectedContact(contact)}
            >
              <ContactInfo>
                <ContactAvatar>{contact.avatar}</ContactAvatar>
                <ContactDetails>
                  <ContactName>{contact.name}</ContactName>
                  <ContactLastMessage>{contact.lastMessage}</ContactLastMessage>
                </ContactDetails>
                <ContactTime>{contact.time}</ContactTime>
              </ContactInfo>
            </ContactItem>
          ))}
        </ContactList>
      </Sidebar>

      <ChatArea>
        {selectedContact ? (
          <>
            <ChatHeader>
              <ChatAvatar>{selectedContact.avatar}</ChatAvatar>
              <ChatInfo>
                <ChatName>{selectedContact.name}</ChatName>
                <ChatStatus>
                  {selectedContact.online ? '🟢 Online' : '⚪ Offline'}
                </ChatStatus>
              </ChatInfo>
              <ChatActions>
                <ActionButton>📞</ActionButton>
                <ActionButton>📹</ActionButton>
                <ActionButton>⚙️</ActionButton>
              </ChatActions>
            </ChatHeader>

            <MessagesContainer>
              {messages.map(message => (
                <Message key={message.id} className={message.own ? 'own' : 'other'}>
                  <MessageAvatar>
                    {message.own ? 'TY' : selectedContact.avatar}
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