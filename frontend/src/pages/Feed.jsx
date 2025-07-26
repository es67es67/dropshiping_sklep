import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import PageTitle from '../components/PageTitle';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: ${({ theme }) => theme.background || '#f8f9fa'};
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text || '#333'};
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 1.1rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .description {
    font-size: 1rem;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 15px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const FilterTab = styled.button`
  flex: 1;
  background: ${({ active, theme }) => active ? theme.primary || '#00D4AA' : 'transparent'};
  color: ${({ active }) => active ? 'white' : '#666'};
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.primary || '#00D4AA' : '#f8f9fa'};
  }
`;

const LoadMoreButton = styled.button`
  background: ${({ theme }) => theme.primary || '#00D4AA'};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const Feed = ({ theme }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, friends, trending
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);
      
      const params = new URLSearchParams({
        page: pageNum,
        limit: 10
      });

      if (filter === 'friends') {
        params.append('friends', 'true');
      }

      const response = await fetch(`${apiUrl}/api/posts?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać postów');
      }

      const data = await response.json();
      
      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      
      setHasMore(data.currentPage < data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Odśwież posty
        fetchPosts();
      }
    } catch (err) {
      console.error('Błąd podczas polubienia posta:', err);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (response.ok) {
        // Odśwież posty
        fetchPosts();
      }
    } catch (err) {
      console.error('Błąd podczas dodawania komentarza:', err);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handlePostCreated = () => {
    // Odśwież posty po utworzeniu nowego
    fetchPosts();
  };

  if (!isAuthenticated) {
    return (
      <Container theme={theme}>
        <Header>
          <Title>Witaj w społeczności!</Title>
          <Subtitle>Zaloguj się, aby zobaczyć posty znajomych</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <PageTitle title="Feed społecznościowy" description="Zobacz co słychać u Twoich znajomych" />
      <Header>
        <Title>📱 Feed społecznościowy</Title>
        <Subtitle>Zobacz co słychać u Twoich znajomych</Subtitle>
      </Header>

      <CreatePost theme={theme} onPostCreated={handlePostCreated} />

      <FilterTabs>
        <FilterTab 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
          theme={theme}
        >
          🌍 Wszystkie
        </FilterTab>
        <FilterTab 
          active={filter === 'friends'} 
          onClick={() => setFilter('friends')}
          theme={theme}
        >
          👥 Znajomi
        </FilterTab>
        <FilterTab 
          active={filter === 'trending'} 
          onClick={() => setFilter('trending')}
          theme={theme}
        >
          🔥 Popularne
        </FilterTab>
      </FilterTabs>

      {loading ? (
        <LoadingSpinner theme={theme}>Ładowanie postów...</LoadingSpinner>
      ) : error ? (
        <ErrorMessage>Błąd: {error}</ErrorMessage>
      ) : posts.length === 0 ? (
        <EmptyState>
          <div className="icon">📝</div>
          <div className="title">Brak postów</div>
          <div className="description">
            {filter === 'friends' 
              ? 'Twoi znajomi jeszcze nic nie opublikowali'
              : 'Bądź pierwszy i opublikuj coś ciekawego!'
            }
          </div>
        </EmptyState>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              theme={theme}
              onLike={handleLike}
              onComment={handleComment}
              onUserClick={handleUserClick}
            />
          ))}
          
          {hasMore && (
            <LoadMoreButton
              onClick={handleLoadMore}
              disabled={loadingMore}
              theme={theme}
            >
              {loadingMore ? 'Ładowanie...' : 'Załaduj więcej'}
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default Feed; 