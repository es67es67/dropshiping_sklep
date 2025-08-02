import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdvertisementBanner from './AdvertisementBanner';
import styled from 'styled-components';

const AdContainer = styled.div`
  margin: 1rem 0;
`;

const AdvertisementManager = ({ 
  location = 'home',
  userType = 'all',
  showAds = true 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentAd, setCurrentAd] = useState(null);
  const [adRotation, setAdRotation] = useState([]);
  const [adIndex, setAdIndex] = useState(0);

  // Konfiguracja reklam dla różnych lokalizacji
  const adConfigs = {
    home: {
      seller: { variant: 'seller', priority: 1 },
      buyer: { variant: 'buyer', priority: 2 },
      shop: { variant: 'shop', priority: 3 },
      auction: { variant: 'auction', priority: 4 }
    },
    products: {
      buyer: { variant: 'buyer', priority: 1 },
      seller: { variant: 'seller', priority: 2 }
    },
    shops: {
      shop: { variant: 'shop', priority: 1 },
      seller: { variant: 'seller', priority: 2 }
    },
    cart: {
      buyer: { variant: 'buyer', priority: 1 },
      auction: { variant: 'auction', priority: 2 }
    }
  };

  // Określ typ użytkownika na podstawie jego aktywności
  const determineUserType = () => {
    if (!isAuthenticated || !user) return 'guest';
    
    const hasProducts = user.products && user.products.length > 0;
    const hasShops = user.shops && user.shops.length > 0;
    const hasPurchases = user.purchases && user.purchases.length > 0;
    
    if (hasShops || hasProducts) return 'seller';
    if (hasPurchases) return 'buyer';
    return 'new';
  };

  // Wybierz odpowiednie reklamy na podstawie lokalizacji i typu użytkownika
  const selectAds = () => {
    const config = adConfigs[location] || adConfigs.home;
    const userType = determineUserType();
    
    let selectedAds = [];
    
    // Dla sprzedawców - pokaż reklamy sprzedaży
    if (userType === 'seller') {
      selectedAds.push(config.seller);
      if (config.shop) selectedAds.push(config.shop);
    }
    // Dla kupujących - pokaż reklamy zakupów
    else if (userType === 'buyer') {
      selectedAds.push(config.buyer);
      if (config.auction) selectedAds.push(config.auction);
    }
    // Dla nowych użytkowników - pokaż mix
    else {
      selectedAds = Object.values(config).sort((a, b) => a.priority - b.priority);
    }
    
    return selectedAds;
  };

  // Rotacja reklam
  useEffect(() => {
    if (!showAds) return;
    
    const ads = selectAds();
    setAdRotation(ads);
    setAdIndex(0);
    
    if (ads.length > 0) {
      setCurrentAd(ads[0]);
    }
  }, [location, user, isAuthenticated, showAds]);

  // Automatyczna rotacja reklam
  useEffect(() => {
    if (adRotation.length <= 1) return;
    
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % adRotation.length);
    }, 30000); // Zmień reklamę co 30 sekund
    
    return () => clearInterval(interval);
  }, [adRotation]);

  useEffect(() => {
    if (adRotation.length > 0 && adIndex < adRotation.length) {
      setCurrentAd(adRotation[adIndex]);
    }
  }, [adIndex, adRotation]);

  // Sprawdź czy użytkownik nie wyłączył reklam
  const isAdsDisabled = () => {
    if (!isAuthenticated) return false;
    return localStorage.getItem('ads_disabled') === 'true';
  };

  // Sprawdź czy to odpowiedni czas na pokazanie reklamy
  const shouldShowAd = () => {
    if (!showAds || isAdsDisabled()) return false;
    
    // Nie pokazuj reklam w godzinach nocnych (22:00 - 6:00)
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return false;
    
    // Sprawdź czy użytkownik nie widział tej reklamy w ostatnich 24h
    const lastSeen = localStorage.getItem(`ad_${currentAd?.variant}_last_seen`);
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const hoursDiff = (now - lastSeenDate) / (1000 * 60 * 60);
      if (hoursDiff < 24) return false;
    }
    
    return true;
  };

  const handleAdInteraction = () => {
    // Zapisz interakcję z reklamą
    if (currentAd) {
      localStorage.setItem(`ad_${currentAd.variant}_last_seen`, new Date().toISOString());
      
      // Analityka - można dodać tracking
      console.log(`Ad interaction: ${currentAd.variant} at ${location}`);
    }
  };

  if (!shouldShowAd() || !currentAd) return null;

  return (
    <AdContainer>
      <AdvertisementBanner
        variant={currentAd.variant}
        showClose={true}
        autoHide={false}
        onInteraction={handleAdInteraction}
      />
    </AdContainer>
  );
};

export default AdvertisementManager; 