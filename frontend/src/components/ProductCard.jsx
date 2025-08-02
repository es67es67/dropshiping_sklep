import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHeart, FaEye, FaShoppingCart, FaStar, FaMapMarkerAlt, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// 🟡 SHARED COMPONENT: ProductCard
// Zależności: product data, React Router Link
// Wpływ: WSZYSTKIE LISTY PRODUKTÓW
// Jeśli się zepsuje: wszystkie listy produktów nie działają
// Używane w: Products.jsx, ProductsEnhanced.jsx, ProductList.jsx, ProductRecommendations.jsx, ShopProducts.jsx
// Zawiera: Link do /product/${_id}

const Card = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const BadgesContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Badge = styled.span`
  background: ${props => {
    if (props.type === 'sale') return '#ef4444';
    if (props.type === 'featured') return '#f59e0b';
    if (props.type === 'out-of-stock') return '#6b7280';
    return '#3b82f6';
  }};
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
`;

const QuickActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['hoverColor', 'hoverTextColor'].includes(prop)
})`
  width: 2rem;
  height: 2rem;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.hoverColor || '#f3f4f6'};
    color: ${props => props.hoverTextColor || '#374151'};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
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

const ImageNavigation = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.25rem;
`;

const ImageDot = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 600;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const Star = styled(FaStar).withConfig({
  shouldForwardProp: (prop) => prop !== 'filled'
})`
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  width: 0.875rem;
  height: 0.875rem;
`;

const RatingText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ShopLogo = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

const ShopName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    background: ${props => props.theme.border};
    color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
  }
`;

const WishlistButton = styled.button`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onQuickView, isMarketplace = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    _id,
    name,
    description,
    price,
    originalPrice,
    images = [],
    mainImage,
    ratings = { average: 0, count: 0 },
    shop = {},
    isOnSale = false,
    isFeatured = false,
    stock = 0,
    shipping = {},
    tags = []
  } = product;

  const displayImage = images[currentImageIndex] || mainImage || images[0] || '/placeholder-product.jpg';
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isInStock = stock > 0;

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Określ ścieżkę na podstawie typu sprzedaży
  const getProductPath = () => {
    if (!isMarketplace) return `/product/${_id}`;
    
    switch (product.saleType) {
      case 'auction':
        return `/auction/${_id}`;
      case 'negotiation':
        return `/negotiation/${_id}`;
      case 'free':
        return `/free/${_id}`;
      case 'fixed_price':
      default:
        return `/marketproduct/${_id}`;
    }
  };

  return (
    <Link to={getProductPath()} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Badges */}
      <BadgesContainer>
        {isOnSale && (
          <Badge type="sale">
            -{discount}%
          </Badge>
        )}
        {isFeatured && (
          <Badge type="featured">
            Polecany
          </Badge>
        )}
        {!isInStock && (
          <Badge type="out-of-stock">
            Niedostępny
          </Badge>
        )}
      </BadgesContainer>

      {/* Quick Actions */}
      <QuickActions>
        <ActionButton
          onClick={handleAddToWishlist}
          hoverColor="#fef2f2"
          hoverTextColor="#ef4444"
          title="Dodaj do ulubionych"
        >
          <FaHeart className="text-sm" />
        </ActionButton>
        <ActionButton
          onClick={handleQuickView}
          hoverColor="#eff6ff"
          hoverTextColor="#3b82f6"
          title="Szybki podgląd"
        >
          <FaEye className="text-sm" />
        </ActionButton>
      </QuickActions>

      {/* Product Image */}
      <ImageContainer>
        <ProductImage
          src={displayImage}
          alt={name}
        />
        
        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <ImageNavigation>
            {images.map((_, index) => (
              <ImageDot
                key={index}
                active={index === currentImageIndex}
                onClick={() => handleImageChange(index)}
              />
            ))}
          </ImageNavigation>
        )}
      </ImageContainer>

      {/* Product Content */}
      <Content>
        <ProductName>{name}</ProductName>
        
        <PriceContainer>
          <CurrentPrice>
            {price.toFixed(2)} zł
          </CurrentPrice>
          {originalPrice && (
            <OriginalPrice>
              {originalPrice.toFixed(2)} zł
            </OriginalPrice>
          )}
          {isOnSale && (
            <Discount>
              -{discount}%
            </Discount>
          )}
        </PriceContainer>

        <RatingContainer>
          <Stars>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                filled={i < Math.floor(ratings.average)}
              />
            ))}
          </Stars>
          <RatingText>
            ({ratings.count})
          </RatingText>
        </RatingContainer>

        <ShopInfo>
          {shop.logo && (
            <ShopLogo
              src={shop.logo}
              alt={shop.name}
            />
          )}
          <ShopName>{shop.name}</ShopName>
          {shop.address?.city && (
            <LocationInfo>
              <FaMapMarkerAlt />
              {shop.address.city}
            </LocationInfo>
          )}
        </ShopInfo>

        <Features>
          {shipping.freeShipping && (
            <Feature>
              <FaTruck />
              Darmowa dostawa
            </Feature>
          )}
          {isFeatured && (
            <Feature>
              <FaShieldAlt />
              Gwarancja
            </Feature>
          )}
        </Features>

        <ActionButtons>
          <AddToCartButton
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <FaShoppingCart />
            {isInStock ? 'Dodaj do koszyka' : 'Niedostępny'}
          </AddToCartButton>
          <WishlistButton
            onClick={handleAddToWishlist}
            title="Dodaj do ulubionych"
          >
            <FaHeart style={{ color: '#ef4444' }} />
          </WishlistButton>
        </ActionButtons>
      </Content>
    </Card>
    </Link>
  );
};

export default ProductCard; 