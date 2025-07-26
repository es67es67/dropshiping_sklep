import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
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
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#00D4AA'};
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const ImageItem = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f8f9fa;
    color: ${({ theme }) => theme.primary || '#00D4AA'};
  }
  
  input[type="file"] {
    display: none;
  }
`;

const PostButton = styled.button`
  background: ${({ theme, disabled }) => disabled ? '#ccc' : theme.primary || '#00D4AA'};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.primary || '#00D4AA'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .remove {
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const TagInput = styled.input`
  border: 1px solid #e1e5e9;
  border-radius: 15px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary || '#00D4AA'};
  }
`;

const PrivacyToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  
  label {
    font-size: 0.9rem;
    color: #666;
  }
  
  select {
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    outline: none;
    
    &:focus {
      border-color: ${({ theme }) => theme.primary || '#00D4AA'};
    }
  }
`;

const CreatePost = ({ theme, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: content.trim(),
          images: images, // W rzeczywistej aplikacji trzeba by przesłać pliki
          tags,
          isPublic
        })
      });

      if (response.ok) {
        setContent('');
        setImages([]);
        setTags([]);
        setTagInput('');
        setIsPublic(true);
        
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        console.error('Błąd podczas tworzenia posta');
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia posta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = content.trim().length > 0 || images.length > 0;

  return (
    <Container>
      <Header>
        <Avatar src={user?.avatar}>
          {!user?.avatar && getInitials(user?.firstName, user?.lastName)}
        </Avatar>
        <div>
          <div style={{ fontWeight: '600' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Co słychać?
          </div>
        </div>
      </Header>

      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder="Napisz coś ciekawego..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          theme={theme}
        />

        {images.length > 0 && (
          <ImagePreview>
            {images.map((image, index) => (
              <ImageItem key={index}>
                <img src={image} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </ImageItem>
            ))}
          </ImagePreview>
        )}

        {tags.length > 0 && (
          <TagsContainer>
            {tags.map(tag => (
              <Tag key={tag} theme={theme}>
                #{tag}
                <span className="remove" onClick={() => removeTag(tag)}>×</span>
              </Tag>
            ))}
          </TagsContainer>
        )}

        <PrivacyToggle theme={theme}>
          <label>Widoczność:</label>
          <select
            value={isPublic ? 'public' : 'private'}
            onChange={(e) => setIsPublic(e.target.value === 'public')}
          >
            <option value="public">🌍 Publiczny</option>
            <option value="private">🔒 Prywatny</option>
          </select>
        </PrivacyToggle>

        <Actions>
          <ActionButtons>
            <ActionButton as="label" theme={theme}>
              📷 Zdjęcie
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </ActionButton>
            <ActionButton
              type="button"
              onClick={() => document.getElementById('tag-input').focus()}
              theme={theme}
            >
              🏷️ Tagi
            </ActionButton>
          </ActionButtons>

          <PostButton
            type="submit"
            disabled={!isFormValid || isSubmitting}
            theme={theme}
          >
            {isSubmitting ? 'Publikowanie...' : 'Opublikuj'}
          </PostButton>
        </Actions>
      </form>

      <TagInput
        id="tag-input"
        placeholder="Dodaj tagi (Enter)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyPress={addTag}
        theme={theme}
      />
    </Container>
  );
};

export default CreatePost; 