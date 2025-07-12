import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ReviewContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const ReviewDate = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#F59E0B' : '#E5E7EB'};
  font-size: 1rem;
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  
  &:hover {
    color: ${props => props.interactive ? '#F59E0B' : props.filled ? '#F59E0B' : '#E5E7EB'};
  }
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ReviewTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
`;

const ReviewContent = styled.p`
  color: ${props => props.theme.text};
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: scale(1.05);
  }
`;

const ReviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
  }
  
  &.active {
    color: ${props => props.theme.primary};
    font-weight: 600;
  }
`;

const HelpfulCount = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const SellerResponse = styled.div`
  background: ${props => props.theme.background};
  border-left: 3px solid ${props => props.theme.primary};
  padding: 12px;
  margin-top: 12px;
  border-radius: 0 6px 6px 0;
`;

const SellerResponseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const SellerBadge = styled.span`
  background: ${props => props.theme.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SellerResponseContent = styled.p`
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

const ReviewForm = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const RatingSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const RatingLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  min-width: 60px;
`;

const SubmitButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VerificationBadge = styled.span`
  background: #10B981;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

export default function ReviewSystem({ product, theme }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: {
        name: 'Jan Kowalski',
        avatar: 'JK',
        verified: true
      },
      rating: 5,
      title: 'Świetny produkt!',
      content: 'Bardzo zadowolony z zakupu. Produkt spełnia wszystkie oczekiwania, dostawa była szybka i bezpieczna. Polecam!',
      date: '2024-01-15',
      helpful: 12,
      isHelpful: false,
      images: ['/review1.jpg', '/review2.jpg'],
      sellerResponse: {
        content: 'Dziękujemy za pozytywną opinię! Cieszymy się, że produkt spełnił Państwa oczekiwania.',
        date: '2024-01-16'
      }
    },
    {
      id: 2,
      user: {
        name: 'Anna Nowak',
        avatar: 'AN',
        verified: true
      },
      rating: 4,
      title: 'Dobry produkt, ale...',
      content: 'Produkt jest dobry, ale dostawa trwała dłużej niż oczekiwano. Ogólnie polecam.',
      date: '2024-01-10',
      helpful: 5,
      isHelpful: false,
      images: []
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: ''
  });

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleReviewSubmit = () => {
    if (!newReview.rating || !newReview.title || !newReview.content) {
      alert('Proszę wypełnić wszystkie pola');
      return;
    }

    const review = {
      id: Date.now(),
      user: {
        name: user?.username || 'Anonimowy',
        avatar: user?.username?.charAt(0) || 'A',
        verified: true
      },
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      isHelpful: false,
      images: []
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, title: '', content: '' });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1,
          isHelpful: !review.isHelpful
        };
      }
      return review;
    }));
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          filled={i <= rating}
          interactive={interactive}
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
        >
          ★
        </Star>
      );
    }
    return stars;
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div>
      {/* Podsumowanie ocen */}
      <ReviewContainer theme={theme}>
        <ReviewHeader theme={theme}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: theme.text }}>
              Oceny i recenzje
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RatingSection theme={theme}>
                <Stars>
                  {renderStars(Math.round(averageRating))}
                </Stars>
                <RatingText theme={theme}>
                  {averageRating.toFixed(1)} z 5
                </RatingText>
              </RatingSection>
              <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                ({reviews.length} opinii)
              </span>
            </div>
          </div>
          {isAuthenticated && (
            <SubmitButton 
              theme={theme} 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? '❌ Anuluj' : '✍️ Napisz opinię'}
            </SubmitButton>
          )}
        </ReviewHeader>
      </ReviewContainer>

      {/* Formularz recenzji */}
      {showReviewForm && (
        <ReviewForm theme={theme}>
          <FormTitle theme={theme}>✍️ Twoja opinia</FormTitle>
          
          <FormGroup>
            <Label theme={theme}>Ocena</Label>
            <RatingSelector theme={theme}>
              <RatingLabel theme={theme}>Ocena:</RatingLabel>
              <Stars>
                {renderStars(newReview.rating, true, handleRatingChange)}
              </Stars>
              <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                {newReview.rating > 0 ? `${newReview.rating}/5` : 'Wybierz ocenę'}
              </span>
            </RatingSelector>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Tytuł opinii</Label>
            <Input
              type="text"
              placeholder="Krótki tytuł Twojej opinii"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Opinia</Label>
            <Textarea
              placeholder="Opisz swoje doświadczenia z produktem..."
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              theme={theme}
            />
          </FormGroup>

          <SubmitButton 
            theme={theme} 
            onClick={handleReviewSubmit}
            disabled={!newReview.rating || !newReview.title || !newReview.content}
          >
            📤 Opublikuj opinię
          </SubmitButton>
        </ReviewForm>
      )}

      {/* Lista recenzji */}
      {reviews.map(review => (
        <ReviewContainer key={review.id} theme={theme}>
          <ReviewHeader theme={theme}>
            <UserInfo theme={theme}>
              <UserAvatar theme={theme}>
                {review.user.avatar}
              </UserAvatar>
              <UserDetails theme={theme}>
                <UserName theme={theme}>
                  {review.user.name}
                  {review.user.verified && (
                    <VerificationBadge>✓ Zweryfikowany zakup</VerificationBadge>
                  )}
                </UserName>
                <ReviewDate theme={theme}>
                  {new Date(review.date).toLocaleDateString('pl-PL')}
                </ReviewDate>
              </UserDetails>
            </UserInfo>
            
            <RatingSection theme={theme}>
              <Stars>
                {renderStars(review.rating)}
              </Stars>
              <RatingText theme={theme}>
                {review.rating}/5
              </RatingText>
            </RatingSection>
          </ReviewHeader>

          <ReviewTitle theme={theme}>{review.title}</ReviewTitle>
          <ReviewContent theme={theme}>{review.content}</ReviewContent>

          {review.images.length > 0 && (
            <ReviewImages>
              {review.images.map((image, index) => (
                <ReviewImage 
                  key={index} 
                  src={image} 
                  alt={`Zdjęcie ${index + 1}`}
                  theme={theme}
                />
              ))}
            </ReviewImages>
          )}

          <ReviewActions theme={theme}>
            <ActionButton 
              theme={theme}
              className={review.isHelpful ? 'active' : ''}
              onClick={() => handleHelpful(review.id)}
            >
              👍 Pomocne
              <HelpfulCount theme={theme}>({review.helpful})</HelpfulCount>
            </ActionButton>
            
            <ActionButton theme={theme}>
              💬 Odpowiedz
            </ActionButton>
            
            <ActionButton theme={theme}>
              ⚠️ Zgłoś
            </ActionButton>
          </ReviewActions>

          {review.sellerResponse && (
            <SellerResponse theme={theme}>
              <SellerResponseHeader theme={theme}>
                <SellerBadge theme={theme}>Odpowiedź sprzedawcy</SellerBadge>
                <span style={{ color: theme.textSecondary, fontSize: '0.8rem' }}>
                  {new Date(review.sellerResponse.date).toLocaleDateString('pl-PL')}
                </span>
              </SellerResponseHeader>
              <SellerResponseContent theme={theme}>
                {review.sellerResponse.content}
              </SellerResponseContent>
            </SellerResponse>
          )}
        </ReviewContainer>
      ))}
    </div>
  );
} 