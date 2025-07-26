import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 600;
`;

const ProductBox = styled.div`
  display: flex;
  gap: 2rem;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const Image = styled.img`
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
  @media (max-width: 480px) {
    width: 100%;
    height: 200px;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Name = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const AddToCartButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}cc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Nowe komponenty dla zakładek
const TabsContainer = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${props => props.active === 'true' ? props.theme.primary : 'transparent'};
  color: ${props => props.active === 'true' ? 'white' : props.theme.text};
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.active === 'true' ? props.theme.primary : props.theme.background};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }
  
  p {
    line-height: 1.6;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 1rem;
  }
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  
  .label {
    font-weight: 600;
    color: ${props => props.theme.text};
  }
  
  .value {
    color: ${props => props.theme.textSecondary};
  }
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
`;

const Star = styled.span`
  color: ${props => props.filled === 'true' ? '#FFD700' : '#ddd'};
  cursor: pointer;
`;

const RatingInfo = styled.div`
  .rating {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.text};
  }
  
  .count {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewItem = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  border-left: 4px solid ${props => props.theme.primary};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  .name {
    font-weight: 600;
    color: ${props => props.theme.text};
  }
  
  .date {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const ReviewContent = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.theme.primary};
  background: white;
  color: ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  text-align: center;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
`;



const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background: #4caf50;
  }
  
  &.error {
    background: #f44336;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default function ProductDetails({ theme }) {
  const { productId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [userReview, setUserReview] = useState(null);
  
  // Nowe stany dla koszyka
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  useEffect(() => {
    if (isAuthenticated && user && reviews.length > 0) {
      const found = reviews.find(r => r.user === user.id);
      setUserReview(found || null);
    } else {
      setUserReview(null);
    }
  }, [reviews, user, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${productId}`);
      if (!response.ok) throw new Error('Nie udało się pobrać produktu');
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Błąd pobierania recenzji:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} filled={(i < rating).toString()}>★</Star>
    ));
  };

  const handleReviewChange = e => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await response.json();
      if (!response.ok) {
        setReviewError(data.error || 'Błąd dodawania recenzji');
      } else {
        setReviewSuccess('Dziękujemy za recenzję!');
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      setReviewError('Błąd sieci');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, product?.stock || 1));
    setQuantity(validQuantity);
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Musisz się zalogować, aby dodać produkt do koszyka' });
      return;
    }

    if (!product || !product.isActive) {
      setNotification({ type: 'error', message: 'Produkt jest niedostępny' });
      return;
    }

    if (quantity > product.stock) {
      setNotification({ type: 'error', message: 'Niewystarczający stan magazynowy' });
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch(`/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: `Dodano ${quantity} szt. do koszyka!` });
        setQuantity(1); // Reset quantity
      } else {
        setNotification({ type: 'error', message: data.error || 'Błąd dodawania do koszyka' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd sieci' });
    } finally {
      setAddingToCart(false);
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <Section>
            <h3>Opis produktu</h3>
            <p>{product.description}</p>
            {product.longDescription && (
              <p>{product.longDescription}</p>
            )}
          </Section>
        );
      
      case 'specifications':
        return (
          <Section>
            <h3>Specyfikacje techniczne</h3>
            <Specifications>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <SpecItem key={key}>
                  <span className="label">{key}</span>
                  <span className="value">{value}</span>
                </SpecItem>
              ))}
              <SpecItem>
                <span className="label">Kategoria</span>
                <span className="value">{product.category}</span>
              </SpecItem>
              <SpecItem>
                <span className="label">Marka</span>
                <span className="value">{product.brand || 'Brak informacji'}</span>
              </SpecItem>
              <SpecItem>
                <span className="label">Stan magazynowy</span>
                <span className="value">{product.stock} szt.</span>
              </SpecItem>
              <SpecItem>
                <span className="label">Status</span>
                <span className="value">{product.isActive ? 'Dostępny' : 'Niedostępny'}</span>
              </SpecItem>
              {product.tags && product.tags.length > 0 && (
                <SpecItem>
                  <span className="label">Tagi</span>
                  <span className="value">{product.tags.join(', ')}</span>
                </SpecItem>
              )}
            </Specifications>
          </Section>
        );
      
      case 'reviews':
        return (
          <Section>
            <h3>Recenzje i oceny</h3>
            <RatingSection>
              <RatingStars>
                {renderStars(product.rating || 0)}
              </RatingStars>
              <RatingInfo>
                <div className="rating">{product.rating || 0}</div>
                <div className="count">{reviews.length} recenzji</div>
              </RatingInfo>
            </RatingSection>

            {isAuthenticated && !userReview && (
              <form onSubmit={handleReviewSubmit} style={{ marginBottom: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px' }}>
                <h4>Dodaj swoją recenzję</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Ocena: </label>
                  <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Komentarz:</label><br />
                  <textarea name="comment" value={reviewForm.comment} onChange={handleReviewChange} rows={4} style={{ width: '100%' }} required minLength={10} />
                </div>
                {reviewError && <div style={{ color: 'red', marginBottom: '1rem' }}>{reviewError}</div>}
                {reviewSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>{reviewSuccess}</div>}
                <button type="submit">Dodaj recenzję</button>
              </form>
            )}

            {isAuthenticated && userReview && (
              <div style={{ marginBottom: '2rem', color: '#4caf50', fontWeight: 600 }}>
                Dziękujemy za Twoją recenzję!
              </div>
            )}

            {reviewsLoading ? (
              <div>Ładowanie recenzji...</div>
            ) : reviews.length > 0 ? (
              <ReviewsList>
                {reviews.map((review) => (
                  <ReviewItem key={review._id}>
                    <ReviewHeader>
                      <ReviewerInfo>
                        <div className="name">{review.userName || 'Anonimowy użytkownik'}</div>
                        <div className="date">
                          {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                        </div>
                      </ReviewerInfo>
                      <RatingStars>
                        {renderStars(review.rating)}
                      </RatingStars>
                    </ReviewHeader>
                    <ReviewContent>
                      {review.comment}
                    </ReviewContent>
                  </ReviewItem>
                ))}
              </ReviewsList>
            ) : (
              <NoReviews>
                Brak recenzji dla tego produktu. Bądź pierwszym, który oceni ten produkt!
              </NoReviews>
            )}
          </Section>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <Container>Ładowanie produktu...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!product) return <Container>Nie znaleziono produktu.</Container>;

  return (
    <Container theme={theme}>
      {notification && (
        <Notification className={notification.type}>
          {notification.message}
        </Notification>
      )}
      
      <BackButton theme={theme} to={product.shop ? `/shop/${product.shop}` : '/shops'}>← Wróć do sklepu</BackButton>
      
      <ProductBox theme={theme}>
        <Image src={product.mainImage || (product.images && product.images[0]) || 'https://via.placeholder.com/400x300'} alt={product.name} />
        <Info>
          <Name>{product.name}</Name>
          <Price theme={theme}>{product.price} zł</Price>
          <Description theme={theme}>{product.description}</Description>
          <div><Label theme={theme}>Kategoria:</Label> {product.category}</div>
          <div><Label theme={theme}>Marka:</Label> {product.brand}</div>
          <div><Label theme={theme}>Dostępność:</Label> {product.isActive ? 'Dostępny' : 'Niedostępny'} ({product.stock} szt.)</div>
          <div><Label theme={theme}>Tagi:</Label> {product.tags && product.tags.join(', ')}</div>
          
          {product.isActive && product.stock > 0 && (
            <>
              <QuantitySelector>
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                />
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </QuantityButton>
              </QuantitySelector>
              
              <AddToCartButton 
                theme={theme}
                onClick={addToCart}
                disabled={addingToCart || !isAuthenticated}
              >
                {addingToCart ? 'Dodawanie...' : '🛒 Dodaj do koszyka'}
              </AddToCartButton>
            </>
          )}
          
          {!product.isActive && (
            <div style={{ color: '#f44336', fontWeight: 600, marginTop: '1rem' }}>
              Produkt niedostępny
            </div>
          )}
          
          {product.isActive && product.stock === 0 && (
            <div style={{ color: '#f44336', fontWeight: 600, marginTop: '1rem' }}>
              Brak w magazynie
            </div>
          )}
        </Info>
      </ProductBox>

      <TabsContainer>
        <TabsHeader>
          <TabButton 
            active={(activeTab === 'description').toString()} 
            onClick={() => setActiveTab('description')}
          >
            Opis
          </TabButton>
          <TabButton 
            active={(activeTab === 'specifications').toString()} 
            onClick={() => setActiveTab('specifications')}
          >
            Specyfikacje
          </TabButton>
          <TabButton 
            active={(activeTab === 'reviews').toString()} 
            onClick={() => setActiveTab('reviews')}
          >
            Recenzje ({reviews.length})
          </TabButton>
        </TabsHeader>
        <TabContent>
          {renderTabContent()}
        </TabContent>
      </TabsContainer>
    </Container>
  );
} 