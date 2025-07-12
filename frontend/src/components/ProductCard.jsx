import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Card = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background: ${props => props.theme.background};
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

const ImageGallery = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
`;

const GalleryDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.primary : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Badge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${props => {
    switch (props.type) {
      case 'new': return '#10B981';
      case 'sale': return '#EF4444';
      case 'premium': return '#F59E0B';
      default: return props.theme.primary;
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const OldPrice = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: #EF4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#F59E0B' : '#E5E7EB'};
  font-size: 0.875rem;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.primary};
  color: white;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary}dd;
  }
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const QuickViewButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: ${props => props.theme.background};
  border-radius: 6px;
`;

const ShopAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
`;

const ShopName = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const ShopRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

export default function ProductCard({ product, theme }) {
  const { user, isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      // Przekieruj do logowania
      return;
    }
    setIsInWishlist(!isInWishlist);
    // TODO: Dodaj do API
  };

  const handleQuickView = () => {
    // TODO: Otwórz modal z szybkim podglądem
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Przekieruj do logowania
      return;
    }
    // TODO: Dodaj do koszyka
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          ★
        </Star>
      );
    }
    return stars;
  };

  const calculateDiscount = () => {
    if (product.oldPrice && product.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <Card theme={theme}>
      <ImageContainer>
        <ProductImage 
          src={product.images?.[currentImageIndex] || product.image || '/placeholder-product.jpg'} 
          alt={product.name}
        />
        
        {/* Badges */}
        {product.isNew && <Badge type="new">NOWY</Badge>}
        {discount > 0 && <Badge type="sale">-{discount}%</Badge>}
        {product.isPremium && <Badge type="premium">PREMIUM</Badge>}
        
        {/* Wishlist Button */}
        <WishlistButton onClick={handleWishlistToggle}>
          {isInWishlist ? '❤️' : '🤍'}
        </WishlistButton>
        
        {/* Quick View Button */}
        <QuickViewButton onClick={handleQuickView}>
          Szybki podgląd
        </QuickViewButton>
        
        {/* Image Gallery Dots */}
        {product.images && product.images.length > 1 && (
          <ImageGallery>
            {product.images.map((_, index) => (
              <GalleryDot
                key={index}
                active={index === currentImageIndex}
                onClick={() => setCurrentImageIndex(index)}
                theme={theme}
              />
            ))}
          </ImageGallery>
        )}
      </ImageContainer>

      <Content>
        {/* Shop Info */}
        {product.shop && (
          <ShopInfo theme={theme}>
            <ShopAvatar theme={theme}>
              {product.shop.name?.charAt(0) || '🏪'}
            </ShopAvatar>
            <div>
              <ShopName theme={theme}>{product.shop.name}</ShopName>
              <ShopRating theme={theme}>
                ⭐ {product.shop.rating || 0} ({product.shop.reviewsCount || 0})
              </ShopRating>
            </div>
          </ShopInfo>
        )}

        {/* Product Title */}
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Title theme={theme}>{product.name}</Title>
        </Link>

        {/* Price */}
        <PriceContainer>
          <CurrentPrice theme={theme}>
            {product.price?.toFixed(2)} zł
          </CurrentPrice>
          {product.oldPrice && (
            <OldPrice theme={theme}>
              {product.oldPrice.toFixed(2)} zł
            </OldPrice>
          )}
          {discount > 0 && <Discount>-{discount}%</Discount>}
        </PriceContainer>

        {/* Rating */}
        <RatingContainer>
          <Stars>
            {renderStars(product.rating || 0)}
          </Stars>
          <RatingText theme={theme}>
            ({product.reviewsCount || 0} opinii)
          </RatingText>
        </RatingContainer>

        {/* Location */}
        {product.location && (
          <LocationContainer theme={theme}>
            📍 {product.location}
          </LocationContainer>
        )}

        {/* Delivery Info */}
        <DeliveryInfo theme={theme}>
          🚚 {product.deliveryType || 'Dostawa'} • {product.deliveryTime || '1-3 dni'}
          {product.freeShipping && ' • Darmowa dostawa'}
        </DeliveryInfo>

        {/* Action Buttons */}
        <ActionButtons>
          <PrimaryButton 
            theme={theme} 
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? '🛒 Dodaj do koszyka' : '❌ Niedostępny'}
          </PrimaryButton>
          <SecondaryButton theme={theme} onClick={handleQuickView}>
            👁️ Podgląd
          </SecondaryButton>
        </ActionButtons>
      </Content>
    </Card>
  );
} 