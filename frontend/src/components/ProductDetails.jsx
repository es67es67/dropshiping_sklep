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

// Galeria zdjęć
const ImageGallery = styled.div`
  width: 400px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Thumbnail = styled.img`
    width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? props.theme.primary : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.primary};
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

const OriginalPrice = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: line-through;
  margin-left: 0.5rem;
`;

const Discount = styled.span`
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const SellerInfo = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const SellerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const SellerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Stars = styled.div`
  color: #ffd700;
  font-size: 1.1rem;
`;

const ContactButton = styled.button`
  background: ${props => props.theme.secondary || props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.theme.secondary || props.theme.primary}cc;
  }
`;

// Sekcja zakupu
const PurchaseSection = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const QuantityButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
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
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  
  &:hover {
    background: ${props => props.theme.primary}cc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BuyNowButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WishlistButton = styled.button`
  width: 100%;
  padding: 0.75rem 2rem;
  background: transparent;
  color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
  
  &.active {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

// Sekcja szczegółów
const DetailsSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.primary : props.theme.textSecondary};
  border-bottom: 2px solid ${props => props.$active ? props.theme.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

// Recenzje
const ReviewsSection = styled.div`
  margin-top: 2rem;
`;

const ReviewItem = styled.div`
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ReviewAuthor = styled.div`
    font-weight: 600;
    color: ${props => props.theme.text};
`;
  
const ReviewDate = styled.div`
    color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  color: #ffd700;
  font-size: 1rem;
`;

const ReviewText = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
`;

// Powiązane produkty
const RelatedProducts = styled.div`
  margin-top: 3rem;
`;

const RelatedTitle = styled.h2`
  font-size: 1.5rem;
    font-weight: 700;
  margin-bottom: 1rem;
    color: ${props => props.theme.text};
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const RelatedProductCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RelatedProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RelatedProductInfo = styled.div`
  padding: 1rem;
`;

const RelatedProductName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const RelatedProductPrice = styled.div`
  color: ${props => props.theme.primary};
  font-weight: 700;
`;

// Modal dla galerii
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
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
  
  // Nowe stany dla zakupu
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Stany dla galerii
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  // Stany dla powiązanych produktów
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchRelatedProducts();
    checkWishlistStatus();
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
      setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}`);
      if (response.ok) {
      const data = await response.json();
      setProduct(data);
      } else {
        setError('Nie znaleziono produktu');
      }
    } catch (error) {
      setError('Błąd podczas ładowania produktu');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
      setReviewsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania recenzji:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania powiązanych produktów:', error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.isInWishlist);
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania statusu wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Zaloguj się, aby dodać do koszyka' });
      return;
    }

    setAddingToCart(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      });

      if (response.ok) {
        setNotification({ type: 'success', message: 'Dodano do koszyka!' });
      } else {
        setNotification({ type: 'error', message: 'Błąd podczas dodawania do koszyka' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd podczas dodawania do koszyka' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Zaloguj się, aby kupić produkt' });
      return;
    }

    setBuyingNow(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [{
            productId: productId,
          quantity: quantity
          }]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotification({ type: 'success', message: 'Zamówienie utworzone! Przekierowywanie do płatności...' });
        // Przekierowanie do strony płatności
        window.location.href = `/payment/${data.orderId}`;
      } else {
        setNotification({ type: 'error', message: 'Błąd podczas tworzenia zamówienia' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd podczas tworzenia zamówienia' });
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Zaloguj się, aby dodać do ulubionych' });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const method = isInWishlist ? 'DELETE' : 'POST';
      const response = await fetch(`${apiUrl}/api/marketplace/${productId}/wishlist`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        setNotification({ 
          type: 'success', 
          message: isInWishlist ? 'Usunięto z ulubionych' : 'Dodano do ulubionych' 
        });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd podczas aktualizacji ulubionych' });
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!product) return <Container>Nie znaleziono produktu.</Container>;

  const images = product.images || [product.mainImage].filter(Boolean);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Container theme={theme}>
      {notification && (
        <Notification className={notification.type}>
          {notification.message}
        </Notification>
      )}
      
      <BackButton theme={theme} to="/market">← Wróć do giełdy</BackButton>
      
      <ProductBox theme={theme}>
        <ImageGallery>
          <MainImage 
            src={images[selectedImage] || 'https://via.placeholder.com/400x300'} 
            alt={product.name}
            onClick={() => setShowModal(true)}
          />
          {images.length > 1 && (
            <ThumbnailGrid>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${product.name} - zdjęcie ${index + 1}`}
                  $active={index === selectedImage}
                  onClick={() => setSelectedImage(index)}
                  theme={theme}
                />
              ))}
            </ThumbnailGrid>
          )}
        </ImageGallery>
        
        <Info>
          <Name>{product.name}</Name>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Price theme={theme}>{product.price} zł</Price>
            {hasDiscount && (
              <>
                <OriginalPrice theme={theme}>{product.originalPrice} zł</OriginalPrice>
                <Discount>-{discountPercentage}%</Discount>
              </>
            )}
          </div>
          
          <Description theme={theme}>{product.description}</Description>
          
          <div><Label theme={theme}>Kategoria:</Label> {product.category}</div>
          {product.brand && <div><Label theme={theme}>Marka:</Label> {product.brand}</div>}
          <div><Label theme={theme}>Stan:</Label> {product.condition}</div>
          <div><Label theme={theme}>Dostępność:</Label> {product.isActive ? 'Dostępny' : 'Niedostępny'} ({product.stock} szt.)</div>
          {product.tags && product.tags.length > 0 && (
            <div><Label theme={theme}>Tagi:</Label> {product.tags.join(', ')}</div>
          )}
          
          <SellerInfo theme={theme}>
            <SellerName theme={theme}>Sprzedawca: {product.seller?.username || 'Nieznany'}</SellerName>
            <SellerRating>
              <Stars>★★★★☆</Stars>
              <span>4.2 (156 opinii)</span>
            </SellerRating>
            <ContactButton theme={theme}>💬 Skontaktuj się</ContactButton>
          </SellerInfo>
          
          {product.isActive && (product.stock > 0 || product.stock === undefined) && (
            <PurchaseSection theme={theme}>
              <Label theme={theme}>Ilość:</Label>
              <QuantitySelector>
                <QuantityButton 
                  theme={theme}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput
                  theme={theme}
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                />
                <QuantityButton 
                  theme={theme}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </QuantityButton>
              </QuantitySelector>
              
              <AddToCartButton 
                theme={theme}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Dodawanie...' : '🛒 Dodaj do koszyka'}
              </AddToCartButton>
              
              <BuyNowButton 
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                {buyingNow ? 'Przetwarzanie...' : '💳 Kup teraz'}
              </BuyNowButton>
              
              <WishlistButton 
                theme={theme}
                onClick={handleWishlistToggle}
                className={isInWishlist ? 'active' : ''}
              >
                {isInWishlist ? '❤️ W ulubionych' : '🤍 Dodaj do ulubionych'}
              </WishlistButton>
            </PurchaseSection>
          )}
        </Info>
      </ProductBox>

      {/* Szczegóły produktu */}
      <DetailsSection theme={theme}>
        <TabsContainer theme={theme}>
          <TabButton 
            theme={theme}
            $active={activeTab === 'description'}
            onClick={() => handleTabChange('description')}
          >
            Opis
          </TabButton>
          <TabButton 
            theme={theme}
            $active={activeTab === 'specifications'}
            onClick={() => handleTabChange('specifications')}
          >
            Specyfikacja
          </TabButton>
          <TabButton 
            theme={theme}
            $active={activeTab === 'reviews'}
            onClick={() => handleTabChange('reviews')}
          >
            Recenzje ({reviews.length})
          </TabButton>
          <TabButton 
            theme={theme}
            $active={activeTab === 'shipping'}
            onClick={() => handleTabChange('shipping')}
          >
            Dostawa
          </TabButton>
        </TabsContainer>
        
        <TabContent>
          {activeTab === 'description' && (
            <div>
              <h3>Opis produktu</h3>
              <p>{product.description}</p>
              {product.features && (
                <div>
                  <h4>Główne cechy:</h4>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <h3>Specyfikacja techniczna</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Kategoria</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{product.category}</td>
                  </tr>
                  {product.brand && (
                    <tr>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Marka</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{product.brand}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Stan</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{product.condition}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: '600' }}>Dostępność</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{product.stock} sztuk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <ReviewsSection>
              <h3>Recenzje klientów</h3>
              {reviewsLoading ? (
                <p>Ładowanie recenzji...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewItem key={index} theme={theme}>
                    <ReviewHeader theme={theme}>
                      <ReviewAuthor theme={theme}>{review.user?.username || 'Anonim'}</ReviewAuthor>
                      <ReviewDate theme={theme}>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                    </ReviewHeader>
                    <ReviewRating>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </ReviewRating>
                    <ReviewText theme={theme}>{review.comment}</ReviewText>
                  </ReviewItem>
                ))
              ) : (
                <p>Brak recenzji dla tego produktu.</p>
              )}
            </ReviewsSection>
          )}
          
          {activeTab === 'shipping' && (
            <div>
              <h3>Informacje o dostawie</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <h4>🚚 Dostawa standardowa</h4>
                  <p>3-5 dni roboczych</p>
                  <p>Cena: 15 zł</p>
                </div>
                <div>
                  <h4>⚡ Dostawa ekspresowa</h4>
                  <p>1-2 dni robocze</p>
                  <p>Cena: 25 zł</p>
                </div>
                <div>
                  <h4>🏪 Odbiór osobisty</h4>
                  <p>W punkcie sprzedawcy</p>
                  <p>Cena: Darmowa</p>
                </div>
              </div>
            </div>
          )}
        </TabContent>
      </DetailsSection>

      {/* Powiązane produkty */}
      {relatedProducts.length > 0 && (
        <RelatedProducts>
          <RelatedTitle theme={theme}>Podobne produkty</RelatedTitle>
          <RelatedGrid>
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <RelatedProductCard 
                key={relatedProduct._id} 
                theme={theme}
                onClick={() => window.location.href = `/product/${relatedProduct._id}`}
              >
                <RelatedProductImage 
                  src={relatedProduct.mainImage || relatedProduct.images?.[0] || 'https://via.placeholder.com/200x150'} 
                  alt={relatedProduct.name} 
                />
                <RelatedProductInfo theme={theme}>
                  <RelatedProductName theme={theme}>{relatedProduct.name}</RelatedProductName>
                  <RelatedProductPrice theme={theme}>{relatedProduct.price} zł</RelatedProductPrice>
                </RelatedProductInfo>
              </RelatedProductCard>
            ))}
          </RelatedGrid>
        </RelatedProducts>
      )}

      {/* Modal dla galerii */}
      {showModal && (
        <Modal onClick={handleModalClose}>
          <ModalImage 
            src={images[selectedImage] || 'https://via.placeholder.com/400x300'} 
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
          <ModalClose onClick={handleModalClose}>×</ModalClose>
        </Modal>
      )}
    </Container>
  );
} 