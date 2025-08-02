import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaGavel, FaClock, FaUsers, FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const AuctionInfo = styled.div`
  background: linear-gradient(135deg, #FF6B35, #FF8E53);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const InfoValue = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const BidForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const BidAmountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrencySymbol = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const BidButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #FF6B35, #FF8E53);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
  
  &:disabled {
    background: ${props => props.theme.border};
    color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const FreeButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #10B981, #34D399);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    background: ${props => props.theme.border};
    color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const BidsHistory = styled.div`
  margin-top: 1.5rem;
`;

const BidsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
`;

const BidItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.border};
`;

const BidInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BidAmount = styled.span`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const BidTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const BidUser = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.text};
`;

const BidModal = ({ product, isOpen, onClose, onBidSubmit }) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product?.auction) {
      const currentPrice = product.auction.currentPrice || product.auction.startPrice;
      const minBid = currentPrice + (product.auction.minIncrement || 1);
      setBidAmount(minBid.toString());
    }
  }, [isOpen, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Musisz być zalogowany, aby licytować');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Podaj prawidłową kwotę');
      return;
    }

    const currentPrice = product.auction.currentPrice || product.auction.startPrice;
    const minBid = currentPrice + (product.auction.minIncrement || 1);

    if (amount < minBid) {
      setError(`Minimalna oferta to ${minBid.toFixed(2)} zł`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await onBidSubmit(product._id, amount);
      setSuccess('Oferta została złożona pomyślnie!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas składania oferty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreeBid = async () => {
    if (!user) {
      setError('Musisz być zalogowany, aby licytować');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await onBidSubmit(product._id, 0);
      setSuccess('Oferta za darmo została złożona pomyślnie!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas składania oferty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) {
      return '🎁 Za darmo';
    }
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !product) return null;

  const currentPrice = product.auction?.currentPrice || product.auction?.startPrice || 0;
  const minBid = currentPrice + (product.auction?.minIncrement || 1);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaGavel />
            Złóż ofertę
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ProductInfo>
            <ProductImage
              src={product.mainImage || 'https://via.placeholder.com/80x80?text=Brak+zdjęcia'}
              alt={product.name}
            />
            <ProductDetails>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductDetails>
          </ProductInfo>

          <AuctionInfo>
            <InfoRow>
              <InfoLabel>Aktualna cena:</InfoLabel>
              <InfoValue>{formatPrice(currentPrice)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Minimalna oferta:</InfoLabel>
              <InfoValue>{formatPrice(minBid)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Liczba ofert:</InfoLabel>
              <InfoValue>{product.auction?.bids?.length || 0}</InfoValue>
            </InfoRow>
          </AuctionInfo>

          <BidForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Twoja oferta (zł)</Label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Podaj kwotę"
                step="0.01"
                min={minBid}
                required
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <FreeButton 
              type="button" 
              onClick={handleFreeBid} 
              disabled={isSubmitting}
            >
              🎁 Za darmo
            </FreeButton>

            <BidButton type="submit" disabled={isSubmitting}>
              <FaGavel />
              {isSubmitting ? 'Składanie oferty...' : 'Złóż ofertę'}
            </BidButton>
          </BidForm>

          {product.auction?.bids && product.auction.bids.length > 0 && (
            <BidsHistory>
              <BidsTitle>Historia ofert</BidsTitle>
              {product.auction.bids.slice(-5).reverse().map((bid, index) => (
                <BidItem key={index}>
                  <BidInfo>
                    <BidAmount>{formatPrice(bid.amount)}</BidAmount>
                    <BidTime>{formatDate(bid.timestamp)}</BidTime>
                  </BidInfo>
                  <BidUser>
                    {bid.bidder?.username || 'Anonim'}
                  </BidUser>
                </BidItem>
              ))}
            </BidsHistory>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BidModal; 