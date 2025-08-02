import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BannerContainer = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #00D4AA 0%, #007AFF 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    margin: 0.5rem 0;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BannerText = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BannerActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const BannerButton = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    text-decoration: none;
    color: white;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const BannerIcon = styled.span`
  font-size: 2rem;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }
`;

const BannerVariants = {
  seller: {
    title: "Wystaw swoje rzeczy w 2 minuty!",
    subtitle: "AI pomoże Ci opisać produkt i wybrać kategorię. Lokalni kupujący czekają!",
    icon: "🏪",
    primaryAction: "/add-product",
    primaryText: "WYSTAW TERAZ",
    secondaryAction: "/shops",
    secondaryText: "KUPUJ LOKALNIE"
  },
  buyer: {
    title: "Znajdź to, czego szukasz w swojej okolicy!",
    subtitle: "Lokalne oferty, szybka dostawa, zaufani sprzedawcy. Kupuj mądrze!",
    icon: "💰",
                    primaryAction: "/market",
    primaryText: "KUPUJ LOKALNIE",
    secondaryAction: "/shops",
    secondaryText: "SPRAWDŹ OFERTY"
  },
  auction: {
    title: "Licytuj okazje w swojej gminie!",
    subtitle: "Unikalne przedmioty, konkurencyjne ceny, lokalne aukcje online.",
    icon: "🎯",
    primaryAction: "/auctions",
    primaryText: "LICYTUJ TERAZ",
                    secondaryAction: "/market",
    secondaryText: "BROWSE OFERTY"
  },
  shop: {
    title: "Sklepy stacjonarne i online w jednym miejscu!",
    subtitle: "Połącz siły - sprzedawaj lokalnie i globalnie z jednej platformy.",
    icon: "🏪",
    primaryAction: "/shop-create",
    primaryText: "DOŁĄCZ DO GIEŁDY",
    secondaryAction: "/shops",
    secondaryText: "SPRAWDŹ SKLEPY"
  }
};

const AdvertisementBanner = ({ 
  variant = 'seller', 
  showClose = true, 
  autoHide = false,
  autoHideDelay = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const bannerConfig = BannerVariants[variant] || BannerVariants.seller;

  useEffect(() => {
    if (autoHide && autoHideDelay) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay]);

  const handleClose = () => {
    setIsVisible(false);
    // Zapisz w localStorage, żeby nie pokazywać ponownie
    localStorage.setItem(`banner_${variant}_closed`, 'true');
  };

  // Sprawdź czy banner był już zamknięty
  useEffect(() => {
    const wasClosed = localStorage.getItem(`banner_${variant}_closed`);
    if (wasClosed === 'true') {
      setIsVisible(false);
    }
  }, [variant]);

  if (!isVisible) return null;

  return (
    <BannerContainer>
      <BannerContent>
        <BannerText>
          <BannerIcon>{bannerConfig.icon}</BannerIcon>
          <BannerTitle>{bannerConfig.title}</BannerTitle>
          <BannerSubtitle>{bannerConfig.subtitle}</BannerSubtitle>
        </BannerText>
        
        <BannerActions>
          <BannerButton to={bannerConfig.primaryAction}>
            {bannerConfig.primaryText}
          </BannerButton>
          <BannerButton to={bannerConfig.secondaryAction}>
            {bannerConfig.secondaryText}
          </BannerButton>
          {showClose && (
            <CloseButton onClick={handleClose}>
              ×
            </CloseButton>
          )}
        </BannerActions>
      </BannerContent>
    </BannerContainer>
  );
};

export default AdvertisementBanner; 