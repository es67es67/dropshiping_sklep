import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaGavel, FaClock, FaUsers, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Card = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
    border-color: ${props => props.theme.primary};
  }
`;

const AuctionBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #FF6B35, #FF8E53);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AuctionInfo = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.border};
`;

const CurrentPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PriceLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const PriceValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
`;

const TimeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const BidsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const BidButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #FF6B35, #FF8E53);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
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



const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.75rem;
`;

const AuctionCard = ({ product, onBid, onAddToWishlist, onQuickView }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  // Obliczanie czasu do końca aukcji
  useEffect(() => {
    if (!product.auction?.endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.auction.endTime).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setIsAuctionEnded(true);
        setTimeLeft('Aukcja zakończona');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Aktualizuj co minutę

    return () => clearInterval(timer);
  }, [product.auction?.endTime]);

  const handleBid = () => {
    if (!user) {
      alert('Musisz być zalogowany, aby licytować');
      return;
    }
    // Przekieruj do strony aukcji
    navigate(`/auction/${product._id}`);
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

  const getCurrentPrice = () => {
    if (product.auction?.currentPrice) {
      return product.auction.currentPrice;
    }
    return product.auction?.startPrice || product.price;
  };

  const getMinBid = () => {
    const currentPrice = getCurrentPrice();
    const minIncrement = product.auction?.minIncrement || 1;
    return currentPrice + minIncrement;
  };

  return (
    <Card onClick={() => navigate(`/auction/${product._id}`)} style={{ cursor: 'pointer' }}>
      <AuctionBadge>
        <FaGavel />
        Aukcja
      </AuctionBadge>

      <ImageContainer>
        <ProductImage
          src={product.mainImage || 'https://via.placeholder.com/300x200?text=Brak+zdjęcia'}
          alt={product.name}
        />
      </ImageContainer>

      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
      </ProductInfo>

      <AuctionInfo>
        <CurrentPrice>
          <PriceLabel>Aktualna cena:</PriceLabel>
          <PriceValue>{formatPrice(getCurrentPrice())}</PriceValue>
        </CurrentPrice>

        <TimeLeft>
          <FaClock />
          {timeLeft}
        </TimeLeft>

        <BidsInfo>
          <FaUsers />
          {product.auction?.bids?.length || 0} ofert
          {product.auction?.bids?.some(bid => bid.amount === 0) && (
            <span style={{ color: '#10B981', marginLeft: '0.5rem' }}>
              🎁 {product.auction.bids.filter(bid => bid.amount === 0).length} za darmo
            </span>
          )}
        </BidsInfo>
      </AuctionInfo>

      <BidButton
        onClick={handleBid}
        disabled={isAuctionEnded}
      >
        <FaGavel />
        {isAuctionEnded ? 'Aukcja zakończona' : `Licytuj od ${formatPrice(getMinBid())}`}
      </BidButton>

      <ActionButtons>
        <ActionButton onClick={() => onAddToWishlist(product)}>
          <FaHeart />
        </ActionButton>
        <ActionButton onClick={() => onQuickView(product)}>
          <FaShoppingCart />
        </ActionButton>
      </ActionButtons>

      {product.location?.city && (
        <LocationInfo>
          📍 {product.location.city}
          {product.location.voivodeship && `, ${product.location.voivodeship}`}
        </LocationInfo>
      )}
    </Card>
  );
};

export default AuctionCard; 