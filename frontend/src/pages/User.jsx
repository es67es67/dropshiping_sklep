import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: ${({ theme }) => theme.background || '#f8f9fa'};
  min-height: 100vh;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.primary || '#00D4AA'} 0%, ${({ theme }) => theme.secondary || '#8B5CF6'} 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const ProfileInfo = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ src }) => src ? `url(${src}) center/cover` : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
  border: 4px solid white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  font-weight: bold;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const UserTitle = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const UserStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Stat = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: bold;
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &.primary {
    background: white;
    color: ${({ theme }) => theme.primary || '#00D4AA'};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  }
  
  &.secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    
    &:hover {
      background: rgba(255,255,255,0.3);
    }
  }
  
  &.danger {
    background: #ff4757;
    color: white;
    
    &:hover {
      background: #ff3742;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.text || '#333'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PostAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ src }) => src ? `url(${src}) center/cover` : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
`;

const PostContent = styled.div`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f8f9fa;
    color: ${({ theme }) => theme.primary || '#00D4AA'};
  }
  
  &.liked {
    color: #ff4757;
  }
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  transition: background 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const Badge = styled.span`
  background: ${({ color }) => color || '#00D4AA'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text || '#666'};
`;

const ErrorMessage = styled.div`
  background: #ff4757;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  margin: 2rem 0;
`;

export default function User({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pobierz dane użytkownika
        const userRes = await fetch(`${apiUrl}/api/users/public/${id}`);
        if (!userRes.ok) throw new Error('Nie znaleziono użytkownika');
        const userData = await userRes.json();
        setUser(userData);

        // Pobierz status przyjaźni (jeśli zalogowany)
        if (isAuthenticated && currentUser?._id !== id) {
          try {
            const friendshipRes = await fetch(`${apiUrl}/api/friendships/status/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (friendshipRes.ok) {
              const friendshipData = await friendshipRes.json();
              setFriendshipStatus(friendshipData.status);
            }
          } catch (err) {
            console.log('Nie można pobrać statusu przyjaźni:', err);
          }
        }

        // Pobierz posty użytkownika
        try {
          const postsRes = await fetch(`${apiUrl}/api/posts/user/${id}`);
          if (postsRes.ok) {
            const postsData = await postsRes.json();
            setPosts(postsData);
          }
        } catch (err) {
          console.log('Nie można pobrać postów:', err);
        }

        // Pobierz znajomych użytkownika
        try {
          const friendsRes = await fetch(`${apiUrl}/api/friendships/friends/${id}`);
          if (friendsRes.ok) {
            const friendsData = await friendsRes.json();
            setFriends(friendsData);
          }
        } catch (err) {
          console.log('Nie można pobrać znajomych:', err);
        }

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, isAuthenticated, currentUser, apiUrl]);

  const handleFriendshipAction = async (action) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/friendships/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ recipientId: id })
      });

      if (res.ok) {
        const data = await res.json();
        setFriendshipStatus(data.status);
        // Odśwież dane użytkownika
        window.location.reload();
      }
    } catch (err) {
      console.error('Błąd podczas akcji przyjaźni:', err);
    }
  };

  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        // Odśwież posty
        const postsRes = await fetch(`${apiUrl}/api/posts/user/${id}`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      }
    } catch (err) {
      console.error('Błąd podczas polubienia posta:', err);
    }
  };

  const getFriendshipButton = () => {
    if (!isAuthenticated) {
      return <Button className="primary" onClick={() => navigate('/login')}>Zaloguj się</Button>;
    }

    if (currentUser?._id === id) {
      return <Button className="secondary" onClick={() => navigate('/profile')}>Edytuj profil</Button>;
    }

    switch (friendshipStatus) {
      case 'accepted':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button className="primary">✓ Znajomi</Button>
            <Button className="secondary" onClick={() => handleFriendshipAction('unfriend')}>Usuń</Button>
          </div>
        );
      case 'pending':
        return <Button className="secondary">Zaproszenie wysłane</Button>;
      case 'received':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button className="primary" onClick={() => handleFriendshipAction('accept')}>Akceptuj</Button>
            <Button className="danger" onClick={() => handleFriendshipAction('reject')}>Odrzuć</Button>
          </div>
        );
      default:
        return <Button className="primary" onClick={() => handleFriendshipAction('send')}>Dodaj do znajomych</Button>;
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) return <LoadingSpinner theme={theme}>Ładowanie profilu...</LoadingSpinner>;
  if (error) return <ErrorMessage>Błąd: {error}</ErrorMessage>;
  if (!user) return <ErrorMessage>Brak danych użytkownika.</ErrorMessage>;

  return (
    <Container theme={theme}>
      <ProfileHeader theme={theme}>
        <ProfileInfo>
          <Avatar src={user.avatar}>
            {!user.avatar && getInitials(user.firstName, user.lastName)}
          </Avatar>
          <UserDetails>
            <UserName>{user.username || `${user.firstName} ${user.lastName}`}</UserName>
            <UserTitle>
              {user.bio || 'Użytkownik portalu społecznościowego'}
              {user.roles?.length > 0 && (
                <span style={{ marginLeft: '1rem' }}>
                  {user.roles.map(role => (
                    <Badge key={role} color="#8B5CF6">{role}</Badge>
                  ))}
                </span>
              )}
            </UserTitle>
            <UserStats>
              <Stat>
                <span className="number">{friends.length}</span>
                <span className="label">Znajomi</span>
              </Stat>
              <Stat>
                <span className="number">{posts.length}</span>
                <span className="label">Posty</span>
              </Stat>
              <Stat>
                <span className="number">{user.shops?.length || 0}</span>
                <span className="label">Sklepy</span>
              </Stat>
              <Stat>
                <span className="number">{user.level || 1}</span>
                <span className="label">Poziom</span>
              </Stat>
            </UserStats>
          </UserDetails>
        </ProfileInfo>
        <ActionButtons>
          {getFriendshipButton()}
          <Button className="secondary" onClick={() => navigate(-1)}>← Powrót</Button>
        </ActionButtons>
      </ProfileHeader>

      <ContentGrid>
        <Sidebar>
          <Card>
            <CardTitle>📧 Kontakt</CardTitle>
            <p><strong>Email:</strong> {user.email || 'Brak'}</p>
            {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
            {user.location && <p><strong>Lokalizacja:</strong> {user.location.name}</p>}
          </Card>

          <Card>
            <CardTitle>👥 Znajomi ({friends.length})</CardTitle>
            {friends.slice(0, 5).map(friend => (
              <FriendItem key={friend._id} onClick={() => navigate(`/users/${friend._id}`)}>
                <PostAvatar src={friend.avatar}>
                  {!friend.avatar && getInitials(friend.firstName, friend.lastName)}
                </PostAvatar>
                <div>
                  <div style={{ fontWeight: '600' }}>
                    {friend.firstName} {friend.lastName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {friend.username}
                  </div>
                </div>
              </FriendItem>
            ))}
            {friends.length > 5 && (
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
                +{friends.length - 5} więcej znajomych
              </p>
            )}
          </Card>

          <Card>
            <CardTitle>🏆 Osiągnięcia</CardTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Badge color="#FFD700">Poziom {user.level || 1}</Badge>
              <Badge color="#00D4AA">{user.points || 0} pkt</Badge>
              {user.badges?.map(badge => (
                <Badge key={badge._id} color="#8B5CF6">{badge.name}</Badge>
              ))}
            </div>
          </Card>
        </Sidebar>

        <MainContent>
          <Card>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Button 
                className={activeTab === 'posts' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('posts')}
              >
                📝 Posty ({posts.length})
              </Button>
              <Button 
                className={activeTab === 'shops' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('shops')}
              >
                🏪 Sklepy ({user.shops?.length || 0})
              </Button>
            </div>

            {activeTab === 'posts' && (
              <div>
                {posts.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    Brak postów do wyświetlenia
                  </p>
                ) : (
                  posts.map(post => (
                    <PostCard key={post._id}>
                      <PostHeader>
                        <PostAvatar src={user.avatar}>
                          {!user.avatar && getInitials(user.firstName, user.lastName)}
                        </PostAvatar>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                          </div>
                        </div>
                      </PostHeader>
                      <PostContent>{post.content}</PostContent>
                      {post.images?.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <img 
                            src={post.images[0]} 
                            alt="Post" 
                            style={{ maxWidth: '100%', borderRadius: '10px' }}
                          />
                        </div>
                      )}
                      <PostActions>
                        <ActionButton 
                          className={post.likes?.includes(currentUser?._id) ? 'liked' : ''}
                          onClick={() => handleLikePost(post._id)}
                        >
                          ❤️ {post.likes?.length || 0} Polubień
                        </ActionButton>
                        <ActionButton>
                          💬 {post.comments?.length || 0} Komentarzy
                        </ActionButton>
                        <ActionButton>
                          🔗 Udostępnij
                        </ActionButton>
                      </PostActions>
                    </PostCard>
                  ))
                )}
              </div>
            )}

            {activeTab === 'shops' && (
              <div>
                {user.shops?.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    Brak sklepów do wyświetlenia
                  </p>
                ) : (
                  user.shops.map(shop => (
                    <PostCard key={shop._id}>
                      <PostHeader>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                            {shop.name}
                          </div>
                          <div style={{ color: '#666', marginTop: '0.5rem' }}>
                            {shop.description}
                          </div>
                        </div>
                        <Button className="primary" onClick={() => navigate(`/shops/${shop._id}`)}>
                          Zobacz sklep
                        </Button>
                      </PostHeader>
                    </PostCard>
                  ))
                )}
              </div>
            )}
          </Card>
        </MainContent>
      </ContentGrid>
    </Container>
  );
} 