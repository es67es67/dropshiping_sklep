import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHandshake, FaClock, FaUsers, FaHeart, FaShoppingCart, FaArrowLeft, FaCheck, FaTimes, FaUser, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.background};
  min-height: 100vh;
`;

const BackButton = styled.button`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1rem;
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
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
  
  &.active {
    border-color: ${props => props.theme.primary};
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NegotiationBadge = styled.div`
  background: linear-gradient(135deg, #10B981, #34D399);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const PriceSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
`;

const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
`;

const SellerInfo = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
`;

const SellerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const ContactButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const NegotiationSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OfferForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OfferInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10B981, #34D399);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    background: ${props => props.theme.border};
    cursor: not-allowed;
    transform: none;
  }
`;

const OffersHistory = styled.div`
  margin-top: 2rem;
`;

const OfferItem = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OfferInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OfferAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const OfferUser = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const OfferDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const OfferStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  
  &.pending {
    color: #F59E0B;
  }
  
  &.accepted {
    color: #10B981;
  }
  
  &.rejected {
    color: #EF4444;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &.accept {
    background: #10B981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.reject {
    background: #EF4444;
    color: white;
    
    &:hover {
      background: #DC2626;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: #FEE2E2;
  color: #DC2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const NegotiationDetails = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchOffers();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace/${id}`);
      if (!response.ok) throw new Error('Nie udało się pobrać produktu');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`/api/marketplace/${id}/offers`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania ofert:', error);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Musisz być zalogowany, aby składać oferty');
      return;
    }

    const amount = parseFloat(newOffer);
    if (isNaN(amount) || amount <= 0) {
      alert('Podaj prawidłową kwotę');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/marketplace/${id}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error('Nie udało się złożyć oferty');
      
      setNewOffer('');
      fetchOffers();
      alert('Oferta została złożona!');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      const response = await fetch(`/api/marketplace/${id}/offer/${offerId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error(`Nie udało się ${action === 'accept' ? 'zaakceptować' : 'odrzucić'} oferty`);
      
      fetchOffers();
      alert(`Oferta została ${action === 'accept' ? 'zaakceptowana' : 'odrzucona'}!`);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container theme={theme}>
        <LoadingSpinner theme={theme}>Ładowanie...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container theme={theme}>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/market')} theme={theme}>
          <FaArrowLeft /> Wróć do giełdy
        </BackButton>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container theme={theme}>
        <ErrorMessage>Produkt nie został znaleziony</ErrorMessage>
        <BackButton onClick={() => navigate('/market')} theme={theme}>
          <FaArrowLeft /> Wróć do giełdy
        </BackButton>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <BackButton onClick={() => navigate('/market')} theme={theme}>
        <FaArrowLeft /> Wróć do giełdy
      </BackButton>

      <ProductGrid>
        <ImageSection>
          <MainImage
            src={product.mainImage || 'https://via.placeholder.com/600x400?text=Brak+zdjęcia'}
            alt={product.name}
          />
          <ThumbnailGrid>
            {product.images?.slice(0, 4).map((image, index) => (
              <Thumbnail
                key={index}
                src={image || 'https://via.placeholder.com/150x100?text=Zdjęcie'}
                alt={`${product.name} - zdjęcie ${index + 1}`}
              />
            ))}
          </ThumbnailGrid>
        </ImageSection>

        <InfoSection>
          <NegotiationBadge>
            <FaHandshake />
            Propozycja
          </NegotiationBadge>

          <ProductTitle>{product.name}</ProductTitle>
          <ProductDescription>{product.description}</ProductDescription>

          <PriceSection>
            <PriceLabel>Cena wywoławcza:</PriceLabel>
            <PriceValue>{formatPrice(product.price)}</PriceValue>
          </PriceSection>

          <SellerInfo>
            <SellerName>📞 Kontakt do sprzedawcy</SellerName>
            <ContactButton>
              Skontaktuj się
            </ContactButton>
          </SellerInfo>
        </InfoSection>
      </ProductGrid>

      <NegotiationSection>
        <SectionTitle>
          <FaHandshake />
          Składanie ofert
        </SectionTitle>

        {user ? (
          <OfferForm onSubmit={handleSubmitOffer}>
            <OfferInput
              type="number"
              placeholder="Podaj swoją ofertę (zł)"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Wysyłanie...' : 'Złóż ofertę'}
            </SubmitButton>
          </OfferForm>
        ) : (
          <p style={{ color: theme.textSecondary }}>
            Zaloguj się, aby składać oferty
          </p>
        )}

        <OffersHistory>
          <h3 style={{ marginBottom: '1rem', color: theme.text }}>
            Historia ofert ({offers.length})
          </h3>
          
          {offers.length === 0 ? (
            <p style={{ color: theme.textSecondary }}>
              Brak ofert. Bądź pierwszy!
            </p>
          ) : (
            offers.map((offer) => (
              <OfferItem key={offer._id} theme={theme}>
                <OfferInfo>
                  <OfferAmount>{formatPrice(offer.amount)}</OfferAmount>
                  <div>
                    <OfferUser>
                      <FaUser /> {offer.buyerName || 'Anonim'}
                    </OfferUser>
                    <OfferDate>
                      <FaCalendar /> {formatDate(offer.timestamp)}
                    </OfferDate>
                  </div>
                </OfferInfo>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <OfferStatus className={offer.status}>
                    {offer.status === 'pending' && <FaClock />}
                    {offer.status === 'accepted' && <FaCheck />}
                    {offer.status === 'rejected' && <FaTimes />}
                    {offer.status === 'pending' && 'Oczekuje'}
                    {offer.status === 'accepted' && 'Zaakceptowana'}
                    {offer.status === 'rejected' && 'Odrzucona'}
                  </OfferStatus>
                  
                  {user && user._id === product.seller && offer.status === 'pending' && (
                    <ActionButtons>
                      <ActionButton
                        className="accept"
                        onClick={() => handleOfferAction(offer._id, 'accept')}
                      >
                        <FaCheck /> Akceptuj
                      </ActionButton>
                      <ActionButton
                        className="reject"
                        onClick={() => handleOfferAction(offer._id, 'reject')}
                      >
                        <FaTimes /> Odrzuć
                      </ActionButton>
                    </ActionButtons>
                  )}
                </div>
              </OfferItem>
            ))
          )}
        </OffersHistory>
      </NegotiationSection>
    </Container>
  );
};

export default NegotiationDetails; 