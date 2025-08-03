import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const SocialContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  font-size: 24px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 14px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 12px 20px;
  color: ${props => props.$active ? '#667eea' : props.theme.textSecondary};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const LiveStreamContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
`;

const StreamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StreamTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LiveIndicator = styled.div`
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const StreamStats = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 300px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ChatContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const ChatMessage = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SocialFeedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const SocialPost = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const PostTime = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const PostContent = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const PostActions = styled.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const ProductShowcase = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ShowcaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ShowcaseTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const ProductCard = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductName = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const ProductPrice = styled.div`
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
`;

const ShareContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ShareButton = styled.button`
  background: ${props => props.color};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const SocialCommerce = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [isLive, setIsLive] = useState(true);
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(892);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const mockChatMessages = [
    { id: 1, user: 'Anna_K', message: 'Świetny produkt! 🎉', time: '2 min temu' },
    { id: 2, user: 'Marek_T', message: 'Jakie są kolory?', time: '1 min temu' },
    { id: 3, user: 'Kasia_L', message: 'Kupuję! 💳', time: '30 sek temu' },
    { id: 4, user: 'Piotr_W', message: 'Jaka jest dostawa?', time: '15 sek temu' }
  ];

  const mockSocialPosts = [
    {
      id: 1,
      user: 'TechStore',
      avatar: 'https://picsum.photos/40/40?random=1',
      content: 'Nowe smartfony już dostępne! 📱 Sprawdź naszą ofertę #tech #smartphone',
      image: 'https://picsum.photos/300/200?random=2',
      likes: 45,
      comments: 12,
      shares: 8,
      time: '2 godziny temu'
    },
    {
      id: 2,
      user: 'FashionHub',
      avatar: 'https://picsum.photos/40/40?random=3',
      content: 'Kolekcja wiosenna 2024! 🌸 #fashion #spring #style',
      image: 'https://picsum.photos/300/200?random=4',
      likes: 89,
      comments: 23,
      shares: 15,
      time: '4 godziny temu'
    }
  ];

  const mockProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: '4999 zł', image: 'https://picsum.photos/60/60?random=5' },
    { id: 2, name: 'Samsung Galaxy S24', price: '3999 zł', image: 'https://picsum.photos/60/60?random=6' },
    { id: 3, name: 'MacBook Air M2', price: '5999 zł', image: 'https://picsum.photos/60/60?random=7' },
    { id: 4, name: 'AirPods Pro', price: '999 zł', image: 'https://picsum.photos/60/60?random=8' }
  ];

  useEffect(() => {
    setChatMessages(mockChatMessages);
    
    // Symulacja nowych wiadomości na żywo
    const interval = setInterval(() => {
      const newMessage = {
        id: Date.now(),
        user: `User_${Math.floor(Math.random() * 1000)}`,
        message: ['Świetnie! 👍', 'Kupuję! 💳', 'Jakie kolory?', 'Dostawa? 🚚'][Math.floor(Math.random() * 4)],
        time: 'teraz'
      };
      setChatMessages(prev => [...prev, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Symulacja zmiany liczby widzów
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10) - 5);
      setLikes(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const newMessage = {
        id: Date.now(),
        user: 'Ty',
        message: chatInput,
        time: 'teraz'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = 'Sprawdź te niesamowite produkty! 🛍️';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        alert('Udostępnij na Instagram Stories! 📸');
        break;
      case 'tiktok':
        alert('Udostępnij na TikTok! 🎵');
        break;
    }
  };

  const renderLiveStream = () => (
    <LiveStreamContainer>
      <StreamHeader>
        <StreamTitle>
          🎥 Live Shopping: Nowe Smartfony
          {isLive && <LiveIndicator>LIVE</LiveIndicator>}
        </StreamTitle>
        <StreamStats>
          <StatItem>👥 {viewers.toLocaleString()} widzów</StatItem>
          <StatItem>❤️ {likes.toLocaleString()} polubień</StatItem>
        </StreamStats>
      </StreamHeader>
      
      <VideoContainer>
        {!isPlaying ? (
          <PlayButton onClick={() => setIsPlaying(true)}>
            ▶️
          </PlayButton>
        ) : (
          <div style={{ color: 'white', textAlign: 'center' }}>
            🎥 Transmisja na żywo
          </div>
        )}
      </VideoContainer>
      
      <ChatContainer>
        {chatMessages.map(msg => (
          <ChatMessage key={msg.id}>
            <strong>{msg.user}:</strong> {msg.message}
            <span style={{ opacity: 0.7, marginLeft: '10px' }}>{msg.time}</span>
          </ChatMessage>
        ))}
      </ChatContainer>
      
      <form onSubmit={handleChatSubmit}>
        <ChatInput
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Napisz wiadomość..."
        />
      </form>
    </LiveStreamContainer>
  );

  const renderSocialFeed = () => (
    <SocialFeedContainer>
      {mockSocialPosts.map(post => (
        <SocialPost key={post.id} theme={theme}>
          <PostHeader>
            <Avatar src={post.avatar} alt={post.user} />
            <UserInfo>
              <Username theme={theme}>{post.user}</Username>
              <PostTime theme={theme}>{post.time}</PostTime>
            </UserInfo>
          </PostHeader>
          
          <PostContent theme={theme}>{post.content}</PostContent>
          
          {post.image && <PostImage src={post.image} alt="Post" />}
          
          <PostActions>
            <ActionButton theme={theme}>
              ❤️ {post.likes}
            </ActionButton>
            <ActionButton theme={theme}>
              💬 {post.comments}
            </ActionButton>
            <ActionButton theme={theme}>
              📤 {post.shares}
            </ActionButton>
          </PostActions>
        </SocialPost>
      ))}
    </SocialFeedContainer>
  );

  const renderProductShowcase = () => (
    <ProductShowcase theme={theme}>
      <ShowcaseHeader>
        <ShowcaseTitle theme={theme}>🔥 Gorące produkty</ShowcaseTitle>
      </ShowcaseHeader>
      
      <ProductGrid>
        {mockProducts.map(product => (
          <ProductCard key={product.id} theme={theme}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName theme={theme}>{product.name}</ProductName>
            <ProductPrice theme={theme}>{product.price}</ProductPrice>
          </ProductCard>
        ))}
      </ProductGrid>
    </ProductShowcase>
  );

  return (
    <SocialContainer theme={theme}>
      <Header>
        <Title>📱 Social Commerce</Title>
        <Subtitle>Integracja z social media, live streaming i funkcje społecznościowe</Subtitle>
      </Header>

      <TabContainer theme={theme}>
        <Tab 
          $active={activeTab === 'live'} 
          onClick={() => setActiveTab('live')}
          theme={theme}
        >
          🎥 Live Shopping
        </Tab>
        <Tab 
          $active={activeTab === 'social'} 
          onClick={() => setActiveTab('social')}
          theme={theme}
        >
          📱 Social Feed
        </Tab>
        <Tab 
          $active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
          theme={theme}
        >
          🛍️ Produkty
        </Tab>
      </TabContainer>

      {activeTab === 'live' && renderLiveStream()}
      {activeTab === 'social' && renderSocialFeed()}
      {activeTab === 'products' && renderProductShowcase()}

      <ShareContainer>
        <ShareButton 
          color="#1877f2" 
          onClick={() => handleShare('facebook')}
        >
          📘 Facebook
        </ShareButton>
        <ShareButton 
          color="#1da1f2" 
          onClick={() => handleShare('twitter')}
        >
          🐦 Twitter
        </ShareButton>
        <ShareButton 
          color="#e4405f" 
          onClick={() => handleShare('instagram')}
        >
          📸 Instagram
        </ShareButton>
        <ShareButton 
          color="#000000" 
          onClick={() => handleShare('tiktok')}
        >
          🎵 TikTok
        </ShareButton>
      </ShareContainer>
    </SocialContainer>
  );
};

export default SocialCommerce; 