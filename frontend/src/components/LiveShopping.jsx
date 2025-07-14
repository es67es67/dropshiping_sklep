import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StreamContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const VideoSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: ${props => props.theme.background};
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const StreamInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const StreamTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const StreamDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const StreamStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.gradient};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.gradientHover};
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
    
    &:hover {
      background: ${props => props.theme.primary}20;
    }
  }
`;

const ChatSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  height: 500px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const LiveIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ChatTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 2px;
  }
`;

const Message = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.own ? props.theme.primary + '20' : props.theme.background};
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const Username = styled.span`
  font-weight: 600;
  color: ${props => props.theme.primary};
  font-size: 0.875rem;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const MessageText = styled.div`
  color: ${props => props.theme.text};
  font-size: 0.875rem;
`;

const ChatInput = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
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

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProductsSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  margin-top: 2rem;
`;

const ProductsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 120px;
  background: ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
`;

const ProductName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
`;

export default function LiveShopping() {
  const { user } = useAuth();
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (shopId) {
      fetchShopData();
      fetchProducts();
    }
  }, [shopId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const shopData = await response.json();
        setShop(shopData);
        
        // Sprawdź czy jest aktywny stream
        const activeStream = shopData.liveStreams?.find(stream => stream.isActive);
        if (activeStream) {
          setCurrentStream(activeStream);
          setIsStreaming(true);
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych sklepu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/products/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
    }
  };

  const startStream = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}/live/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Live Shopping - ' + shop?.name,
          description: 'Transmisja na żywo z produktami',
          products: products.map(p => p._id)
        })
      });

      if (response.ok) {
        const streamData = await response.json();
        setCurrentStream(streamData.liveStreams[streamData.liveStreams.length - 1]);
        setIsStreaming(true);
        alert('Transmisja rozpoczęta!');
      }
    } catch (error) {
      console.error('Błąd podczas rozpoczynania transmisji:', error);
      alert('Błąd podczas rozpoczynania transmisji');
    }
  };

  const endStream = async () => {
    if (!currentStream) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}/live/${currentStream._id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCurrentStream(null);
        setIsStreaming(false);
        alert('Transmisja zakończona!');
      }
    } catch (error) {
      console.error('Błąd podczas kończenia transmisji:', error);
      alert('Błąd podczas kończenia transmisji');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentStream) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      username: user?.username || 'Anonim',
      timestamp: new Date().toLocaleTimeString(),
      own: true
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // W przyszłości: wysłanie wiadomości przez Socket.IO
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Container>
        <EmptyState>Ładowanie...</EmptyState>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <EmptyState>Sklep nie został znaleziony</EmptyState>
      </Container>
    );
  }

  const isOwner = user?._id === shop.owner?._id;

  return (
    <Container>
      <Title>Live Shopping - {shop.name}</Title>
      
      <StreamContainer>
        <VideoSection>
          <StreamInfo>
            {currentStream ? (
              <>
                <StreamTitle>{currentStream.title}</StreamTitle>
                <StreamDescription>{currentStream.description}</StreamDescription>
                <StreamStats>
                  <Stat>
                    <StatValue>{currentStream.viewers?.length || 0}</StatValue>
                    <StatLabel>Oglądających</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{products.length}</StatValue>
                    <StatLabel>Produktów</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{messages.length}</StatValue>
                    <StatLabel>Wiadomości</StatLabel>
                  </Stat>
                </StreamStats>
              </>
            ) : (
              <StreamTitle>Brak aktywnej transmisji</StreamTitle>
            )}
          </StreamInfo>
          
          <VideoPlaceholder>
            {isStreaming ? '🎥 Transmisja na żywo' : '📹 Brak aktywnej transmisji'}
          </VideoPlaceholder>
          
          {isOwner && (
            <ControlButtons>
              {!isStreaming ? (
                <Button className="primary" onClick={startStream}>
                  🎥 Rozpocznij transmisję
                </Button>
              ) : (
                <Button className="danger" onClick={endStream}>
                  ⏹️ Zakończ transmisję
                </Button>
              )}
            </ControlButtons>
          )}
        </VideoSection>
        
        <ChatSection>
          <ChatHeader>
            <LiveIndicator />
            <ChatTitle>Chat na żywo</ChatTitle>
          </ChatHeader>
          
          <MessagesContainer>
            {messages.length === 0 ? (
              <EmptyState>Brak wiadomości</EmptyState>
            ) : (
              messages.map(message => (
                <Message key={message.id} own={message.own}>
                  <MessageHeader>
                    <Username>{message.username}</Username>
                    <Timestamp>{message.timestamp}</Timestamp>
                  </MessageHeader>
                  <MessageText>{message.text}</MessageText>
                </Message>
              ))
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          
          <ChatInput>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz wiadomość..."
              disabled={!isStreaming}
            />
            <SendButton onClick={sendMessage} disabled={!isStreaming || !newMessage.trim()}>
              Wyślij
            </SendButton>
          </ChatInput>
        </ChatSection>
      </StreamContainer>
      
      <ProductsSection>
        <ProductsTitle>Produkty w transmisji</ProductsTitle>
        {products.length === 0 ? (
          <EmptyState>Brak produktów w sklepie</EmptyState>
        ) : (
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product._id}>
                <ProductImage>
                  {product.images?.[0] ? '🖼️' : '📦'}
                </ProductImage>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price} zł</ProductPrice>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
      </ProductsSection>
    </Container>
  );
} 