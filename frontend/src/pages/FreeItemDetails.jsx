import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaGift, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaHeart, FaShare } from 'react-icons/fa';
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

const FreeBadge = styled.div`
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
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
  text-align: center;
`;

const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #8B5CF6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ContactSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
`;

const ContactTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const ContactIcon = styled.div`
  color: ${props => props.theme.primary};
  font-size: 1.125rem;
`;

const ContactText = styled.div`
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: linear-gradient(135deg, #8B5CF6, #A78BFA);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
  }
  
  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
`;

const DetailsSection = styled.div`
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

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
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

const FreeItemDetails = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
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

  const handleContact = () => {
    // Tutaj można dodać logikę kontaktu
    alert('Funkcja kontaktu będzie dostępna wkrótce!');
  };

  const handleAddToWishlist = () => {
    if (!user) {
      alert('Zaloguj się, aby dodać do ulubionych');
      return;
    }
    alert('Dodano do ulubionych!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Sprawdź ten darmowy produkt: ${product?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link skopiowany do schowka!');
    }
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
          <FreeBadge>
            <FaGift />
            Oddam za darmo
          </FreeBadge>

          <ProductTitle>{product.name}</ProductTitle>
          <ProductDescription>{product.description}</ProductDescription>

          <PriceSection>
            <PriceLabel>Cena:</PriceLabel>
            <PriceValue>
              <FaGift />
              Za darmo
            </PriceValue>
          </PriceSection>

          <ContactSection>
            <ContactTitle>
              <FaUser />
              Kontakt do oddającego
            </ContactTitle>
            
            <ContactInfo>
              <ContactItem>
                <ContactIcon>
                  <FaUser />
                </ContactIcon>
                <ContactText>Jan Kowalski</ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>
                  <FaPhone />
                </ContactIcon>
                <ContactText>+48 123 456 789</ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>
                  <FaEnvelope />
                </ContactIcon>
                <ContactText>jan.kowalski@example.com</ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>
                  <FaMapMarkerAlt />
                </ContactIcon>
                <ContactText>Warszawa, Mazowieckie</ContactText>
              </ContactItem>
            </ContactInfo>

            <ActionButtons>
              <ActionButton className="primary" onClick={handleContact}>
                <FaPhone />
                Skontaktuj się
              </ActionButton>
              
              <ActionButton className="secondary" onClick={handleAddToWishlist}>
                <FaHeart />
                Ulubione
              </ActionButton>
              
              <ActionButton className="secondary" onClick={handleShare}>
                <FaShare />
                Udostępnij
              </ActionButton>
            </ActionButtons>
          </ContactSection>
        </InfoSection>
      </ProductGrid>

      <DetailsSection>
        <SectionTitle>
          <FaGift />
          Szczegóły produktu
        </SectionTitle>
        
        <DetailsGrid>
          <DetailItem>
            <DetailLabel>Kategoria</DetailLabel>
            <DetailValue>{product.category}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Stan</DetailLabel>
            <DetailValue>Używany</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Lokalizacja</DetailLabel>
            <DetailValue>
              {product.location?.city}, {product.location?.voivodeship}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Data dodania</DetailLabel>
            <DetailValue>
              {new Date(product.createdAt).toLocaleDateString('pl-PL')}
            </DetailValue>
          </DetailItem>
        </DetailsGrid>
      </DetailsSection>
    </Container>
  );
};

export default FreeItemDetails; 