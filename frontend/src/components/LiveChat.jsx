import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    bottom: 20px;
    right: 20px;
  }
`;

const ChatHeader = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SellerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SellerName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const OnlineStatus = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 80%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.isOwn ? 'row-reverse' : 'row'};
`;

const MessageAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.isOwn ? props.theme.primary : props.theme.background};
  color: ${props => props.isOwn ? 'white' : props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  background: ${props => props.isOwn ? props.theme.primary : props.theme.background};
  color: ${props => props.isOwn ? 'white' : props.theme.text};
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  align-self: flex-start;
  max-width: 80%;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 2px;
`;

const TypingDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${props => props.theme.textSecondary};
  animation: typing 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-6px);
      opacity: 1;
    }
  }
`;

const ChatInput = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  resize: none;
  min-height: 36px;
  max-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AttachmentButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.textSecondary};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }
`;

const MinimizedChat = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #EF4444;
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

const FileAttachment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-top: 4px;
`;

const FileIcon = styled.span`
  font-size: 1.2rem;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
`;

const FileSize = styled.span`
  font-size: 0.7rem;
  opacity: 0.8;
`;

export default function LiveChat({ seller, theme }) {
  const { user, isAuthenticated } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      content: 'Witaj! Jak mogę Ci pomóc?',
      timestamp: new Date(Date.now() - 60000),
      attachments: []
    },
    {
      id: 2,
      sender: 'user',
      content: 'Cześć! Interesuje mnie ten produkt. Czy jest dostępny w kolorze niebieskim?',
      timestamp: new Date(Date.now() - 30000),
      attachments: []
    },
    {
      id: 3,
      sender: 'seller',
      content: 'Tak, mamy w kolorze niebieskim! Oto zdjęcie:',
      timestamp: new Date(Date.now() - 15000),
      attachments: [
        { name: 'niebieski_produkt.jpg', size: '245 KB', type: 'image' }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Symulacja pisania przez sprzedawcę
    const typingTimeout = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Dodaj automatyczną odpowiedź
        const autoReply = {
          id: Date.now(),
          sender: 'seller',
          content: 'Dziękuję za pytanie! Czy mogę pomóc w czymś jeszcze?',
          timestamp: new Date(),
          attachments: []
        };
        setMessages(prev => [...prev, autoReply]);
        setUnreadCount(prev => prev + 1);
      }, 2000);
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      attachments: []
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setUnreadCount(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        sender: 'user',
        content: `Załącznik: ${file.name}`,
        timestamp: new Date(),
        attachments: [
          { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, type: 'file' }
        ]
      };
      setMessages(prev => [...prev, message]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'file': return '📎';
      default: return '📄';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isMinimized) {
    return (
      <MinimizedChat 
        theme={theme} 
        onClick={() => setIsMinimized(false)}
      >
        💬
        {unreadCount > 0 && (
          <NotificationBadge>{unreadCount}</NotificationBadge>
        )}
      </MinimizedChat>
    );
  }

  return (
    <ChatContainer theme={theme}>
      <ChatHeader theme={theme} onClick={() => setIsMinimized(true)}>
        <HeaderInfo>
          <SellerAvatar theme={theme}>
            {seller?.name?.charAt(0) || 'S'}
          </SellerAvatar>
          <SellerInfo>
            <SellerName>{seller?.name || 'Sprzedawca'}</SellerName>
            <OnlineStatus>🟢 Online</OnlineStatus>
          </SellerInfo>
        </HeaderInfo>
        <HeaderActions>
          <HeaderButton>📞</HeaderButton>
          <HeaderButton>📹</HeaderButton>
          <HeaderButton>−</HeaderButton>
        </HeaderActions>
      </ChatHeader>

      <ChatBody>
        <MessagesContainer>
          {messages.map(message => (
            <div key={message.id}>
              <Message isOwn={message.sender === 'user'} theme={theme}>
                <MessageAvatar 
                  isOwn={message.sender === 'user'} 
                  theme={theme}
                >
                  {message.sender === 'user' 
                    ? user?.username?.charAt(0) || 'U'
                    : seller?.name?.charAt(0) || 'S'
                  }
                </MessageAvatar>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
                  <MessageContent isOwn={message.sender === 'user'} theme={theme}>
                    {message.content}
                  </MessageContent>
                  {message.attachments.map((attachment, index) => (
                    <FileAttachment key={index} theme={theme}>
                      <FileIcon>{getFileIcon(attachment.type)}</FileIcon>
                      <FileInfo>
                        <FileName>{attachment.name}</FileName>
                        <FileSize>{attachment.size}</FileSize>
                      </FileInfo>
                    </FileAttachment>
                  ))}
                  <MessageTime isOwn={message.sender === 'user'} theme={theme}>
                    {formatTime(message.timestamp)}
                  </MessageTime>
                </div>
              </Message>
            </div>
          ))}
          
          {isTyping && (
            <TypingIndicator theme={theme}>
              <span>Pisze...</span>
              <TypingDots>
                <TypingDot delay={0} theme={theme} />
                <TypingDot delay={0.2} theme={theme} />
                <TypingDot delay={0.4} theme={theme} />
              </TypingDots>
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <ChatInput theme={theme}>
          <InputContainer>
            <MessageInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz wiadomość..."
              theme={theme}
            />
            <AttachmentButton theme={theme}>
              <label style={{ cursor: 'pointer', margin: 0 }}>
                📎
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
            </AttachmentButton>
            <SendButton 
              theme={theme} 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              📤
            </SendButton>
          </InputContainer>
        </ChatInput>
      </ChatBody>
    </ChatContainer>
  );
} 