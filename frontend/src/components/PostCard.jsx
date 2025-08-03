import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
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
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  flex: 1;
  cursor: pointer;
  
  .name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.2rem;
  }
  
  .time {
    font-size: 0.9rem;
    color: #666;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ count }) => {
    if (count === 1) return '1fr';
    if (count === 2) return '1fr 1fr';
    if (count === 3) return '1fr 1fr 1fr';
    return '1fr 1fr';
  }};
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: ${({ count, index }) => {
    if (count === 1) return '300px';
    if (count === 2) return '200px';
    if (count === 3 && index === 0) return '200px';
    return '150px';
  }};
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.primary || '#00D4AA'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Actions = styled.div`
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
  font-size: 0.9rem;
  
  &:hover {
    background: #f8f9fa;
    color: ${({ theme, active }) => active ? '#ff4757' : theme.primary || '#00D4AA'};
  }
  
  &.liked {
    color: #ff4757;
  }
`;

const CommentsSection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const CommentInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CommentField = styled.input`
  flex: 1;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary || '#00D4AA'};
  }
`;

const CommentButton = styled.button`
  background: ${({ theme }) => theme.primary || '#00D4AA'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const Comment = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 10px;
  background: #f8f9fa;
`;

const CommentAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ src }) => src ? `url(${src}) center/cover` : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.7rem;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
  
  .author {
    font-weight: 600;
    font-size: 0.8rem;
    color: #333;
    margin-bottom: 0.2rem;
  }
  
  .text {
    font-size: 0.9rem;
    color: #666;
  }
`;

const PostCard = ({ post, theme, onLike, onComment, onUserClick }) => {
  const { user: currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Przed chwilą';
    if (diffInHours < 24) return `${diffInHours}h temu`;
    if (diffInHours < 48) return 'Wczoraj';
    return date.toLocaleDateString('pl-PL');
  };

  const handleLike = async () => {
    if (!currentUser) return;
    if (onLike) {
      onLike(post._id);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      if (onComment) {
        await onComment(post._id, commentText);
        setCommentText('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserClick = () => {
    if (onUserClick && post.author._id) {
      onUserClick(post.author._id);
    }
  };

  const isLiked = post.likes?.some(like => like._id === currentUser?._id);

  return (
    <Container>
      <Header>
        <Avatar 
          src={post.author?.avatar}
          onClick={handleUserClick}
        >
          {!post.author?.avatar && getInitials(post.author?.firstName, post.author?.lastName)}
        </Avatar>
        <UserInfo onClick={handleUserClick}>
          <div className="name">
            {post.author?.firstName} {post.author?.lastName}
          </div>
          <div className="time">
            {formatDate(post.createdAt)}
          </div>
        </UserInfo>
      </Header>

      <Content>{post.content}</Content>

      {post.images && post.images.length > 0 && (
        <ImageGrid count={post.images.length}>
          {post.images.map((image, index) => (
            <Image 
              key={index} 
              src={image} 
              alt={`Post image ${index + 1}`}
              count={post.images.length}
              index={index}
            />
          ))}
        </ImageGrid>
      )}

      {post.tags && post.tags.length > 0 && (
        <Tags>
          {post.tags.map(tag => (
            <Tag key={tag} theme={theme}>#{tag}</Tag>
          ))}
        </Tags>
      )}

      <Actions>
        <ActionButton 
          onClick={handleLike}
          className={isLiked ? 'liked' : ''}
          theme={theme}
                        $active={isLiked}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0} Polubień
        </ActionButton>
        <ActionButton theme={theme}>
          💬 {post.comments?.length || 0} Komentarzy
        </ActionButton>
        <ActionButton theme={theme}>
          🔗 Udostępnij
        </ActionButton>
      </Actions>

      <CommentsSection>
        {currentUser && (
          <CommentInput>
            <CommentAvatar src={currentUser.avatar}>
              {!currentUser.avatar && getInitials(currentUser.firstName, currentUser.lastName)}
            </CommentAvatar>
            <CommentField
              placeholder="Napisz komentarz..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              theme={theme}
            />
            <CommentButton
              onClick={handleComment}
              disabled={!commentText.trim() || isSubmitting}
              theme={theme}
            >
              {isSubmitting ? '...' : 'Wyślij'}
            </CommentButton>
          </CommentInput>
        )}

        {post.comments && post.comments.length > 0 && (
          <CommentsList>
            {post.comments.map(comment => (
              <Comment key={comment._id}>
                <CommentAvatar src={comment.author?.avatar}>
                  {!comment.author?.avatar && getInitials(comment.author?.firstName, comment.author?.lastName)}
                </CommentAvatar>
                <CommentContent>
                  <div className="author">
                    {comment.author?.firstName} {comment.author?.lastName}
                  </div>
                  <div className="text">{comment.content}</div>
                </CommentContent>
              </Comment>
            ))}
          </CommentsList>
        )}
      </CommentsSection>
    </Container>
  );
};

export default PostCard; 