import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';
import AuctionCard from '../components/AuctionCard';
import BidModal from '../components/BidModal';
import PageTitle from '../components/PageTitle';
import AdvertisementManager from '../components/AdvertisementManager';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaTimes, FaShoppingCart, FaHeart, FaGavel, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  background: ${props => props.theme.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderInfo = styled.div``;

const Title = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  color: ${props => props.theme.textSecondary};
  margin: 0.25rem 0 0 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AddProductButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.primaryDark || '#0056b3'};
    transform: translateY(-1px);
    text-decoration: none;
    color: white;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
`;

const SearchInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
`;

const FilterContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const FilterButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop)
})`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.background};
    border-color: ${props => props.theme.primary};
  }
`;

const ClearButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div``;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const OriginalPrice = styled.span`
  font-size: 1.125rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: line-through;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarIcon = styled(FaHeart)`
  color: ${props => props.filled === 'true' ? '#fbbf24' : '#d1d5db'};
  width: 1rem;
  height: 1rem;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const DetailLabel = styled.span``;

const DetailValue = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const FreeShipping = styled.div`
  font-size: 0.875rem;
  color: #10b981;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
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
`;

const WishlistButton = styled.button`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const AuctionSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
`;

const AuctionSectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Nowe styled-components dla lokalizacji
const LocationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LocationModalContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const LocationSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const LocationItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.border};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const LocationName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const LocationDetails = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.25rem;
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  padding: 1rem;
`;

const LocationFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.selected ? props.theme.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.selected ? props.theme.primary : props.theme.background};
    border-color: ${props => props.theme.primary};
  }
`;

const ClearLocationButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: transparent;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const ClearAllFiltersButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
  }
`;

const LocationSettingsButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.secondary || props.theme.primary};
    color: white;
    border-color: ${props => props.theme.secondary || props.theme.primary};
  }
`;

const Products = () => {
  const { user, getUserLocation, getUserTeryt, getUserAddress } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [saleTypeFilter, setSaleTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Nowe stany dla filtrów lokalizacji
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pobieranie produktów z API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Użyj proxy w trybie development, VITE_API_URL w production
        const apiUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
        
        // Buduj parametry zapytania
        const params = new URLSearchParams();
        if (saleTypeFilter !== 'all') {
          params.append('saleType', saleTypeFilter);
        }
        if (categoryFilter !== 'all') {
          params.append('category', categoryFilter);
        }
        if (selectedLocation) {
          params.append('location', selectedLocation.city);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        const response = await fetch(`${apiUrl}/api/marketplace?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error('Błąd podczas pobierania produktów');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [saleTypeFilter, categoryFilter, selectedLocation, searchQuery]);

  // Ustaw domyślną lokalizację użytkownika przy pierwszym załadowaniu (opcjonalnie)
  useEffect(() => {
    if (user && !selectedLocation) {
      const userLocation = getUserLocation();
      const userTeryt = getUserTeryt();
      const userAddress = getUserAddress();
      
      // Sprawdź czy użytkownik chce automatyczną lokalizację
      const autoLocation = localStorage.getItem('autoLocation') !== 'false';
      
      if (autoLocation && (userLocation || userTeryt || userAddress)) {
        let defaultLocation = null;
        
        if (userLocation) {
          defaultLocation = {
            city: userLocation.city || '',
            municipality: userLocation.municipality || '',
            county: userLocation.county || '',
            voivodeship: userLocation.voivodeship || '',
            terytCode: userLocation.terytCode || ''
          };
        } else if (userTeryt) {
          defaultLocation = {
            city: userTeryt.city || '',
            municipality: userTeryt.municipality || '',
            county: userTeryt.county || '',
            voivodeship: userTeryt.voivodeship || '',
            terytCode: userTeryt.terytCode || ''
          };
        } else if (userAddress) {
          defaultLocation = {
            city: userAddress.city || '',
            municipality: userAddress.municipality || '',
            county: userAddress.county || '',
            voivodeship: userAddress.voivodeship || '',
            terytCode: userAddress.terytCode || ''
          };
        }
        
        if (defaultLocation && defaultLocation.city) {
          setSelectedLocation(defaultLocation);
        }
      }
    }
  }, [user, getUserLocation, getUserTeryt, getUserAddress, selectedLocation]);


  const handleSearch = (query) => {
    setSearchQuery(query);
    // Tutaj można dodać logikę wyszukiwania
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Tutaj można dodać logikę filtrowania
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    // Tutaj można dodać logikę sortowania
  };

  const handleSaleTypeFilter = (saleType) => {
    setSaleTypeFilter(saleType);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Funkcje do obsługi lokalizacji
  const searchLocations = async (query, type = 'miejscowość') => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/locations/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.locations || []);
      } else {
        console.error('Błąd podczas wyszukiwania lokalizacji');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Błąd podczas wyszukiwania lokalizacji:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      city: location.name,
      municipality: location.gmina?.name || '',
      county: location.powiat?.name || '',
      voivodeship: location.wojewodztwo?.name || '',
      terytCode: location.code || ''
    });
    setShowLocationModal(false);
    setLocationSearch('');
    setSearchResults([]);
  };

  const openLocationModal = () => {
    setShowLocationModal(true);
    setLocationSearch('');
    setSearchResults([]);
  };

  const clearLocationFilter = () => {
    setSelectedLocation(null);
  };

  const clearAllFilters = () => {
    setSelectedLocation(null);
    setSaleTypeFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    setFilters({});
  };

  // Filtrowanie produktów
  const filteredProducts = products.filter(product => {
    // Filtr typu sprzedaży
    if (saleTypeFilter === 'free') {
      // Produkty za darmo (cena 0 lub oferty za darmo w aukcjach)
      if (product.price !== 0 && (!product.auction || !product.auction.bids?.some(bid => bid.amount === 0))) {
        return false;
      }
    } else if (saleTypeFilter !== 'all' && product.saleType !== saleTypeFilter) {
      return false;
    }
    
    // Filtr kategorii
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });

  // Rozdzielenie produktów na zwykłe i aukcje
  const regularProducts = filteredProducts.filter(product => product.saleType !== 'auction');
  const auctionProducts = filteredProducts.filter(product => product.saleType === 'auction');

  // Pobierz unikalne kategorie
  const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Pokaż powiadomienie
    alert(`${product.name} został dodany do koszyka!`);
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
    
    // Pokaż powiadomienie
    const isInWishlist = wishlist.find(item => item._id === product._id);
    alert(isInWishlist 
      ? `${product.name} został usunięty z ulubionych!`
      : `${product.name} został dodany do ulubionych!`
    );
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleBid = (product) => {
    setSelectedAuction(product);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (productId, amount) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/auctions/${productId}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas składania oferty');
      }

      const data = await response.json();
      
      // Aktualizuj produkt w liście
      setProducts(prev => prev.map(p => 
        p._id === productId ? data.product : p
      ));
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <Container>
      <PageTitle title="Giełda" description="Odkryj najlepsze produkty w najlepszych cenach" />
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderFlex>
            <HeaderInfo>
              <Title>Giełda</Title>
              <Subtitle>
                Odkryj najlepsze produkty w najlepszych cenach
              </Subtitle>
              <AddProductButton to="/add-product">
                <FaPlus />
                Dodaj produkt
              </AddProductButton>
            </HeaderInfo>
            
            {/* Search Bar */}
            <SearchContainer>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Szukaj produktów..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <ClearButton
                  onClick={() => handleSearch('')}
                >
                  <FaTimes />
                </ClearButton>
              )}
            </SearchContainer>
          </HeaderFlex>
          
          {/* Filtry kategorii sprzedaży */}
          <FilterContainer>
            <FilterButton
              active={saleTypeFilter === 'all'}
              onClick={() => handleSaleTypeFilter('all')}
            >
              Wszystkie
            </FilterButton>
            <FilterButton
              active={saleTypeFilter === 'fixed_price'}
              onClick={() => handleSaleTypeFilter('fixed_price')}
            >
              💰 Cena stała
            </FilterButton>
            <FilterButton
              active={saleTypeFilter === 'auction'}
              onClick={() => handleSaleTypeFilter('auction')}
            >
              🔨 Aukcje
            </FilterButton>
            <FilterButton
              active={saleTypeFilter === 'negotiation'}
              onClick={() => handleSaleTypeFilter('negotiation')}
            >
              💬 Propozycje
            </FilterButton>
            <FilterButton
              active={saleTypeFilter === 'free'}
              onClick={() => handleSaleTypeFilter('free')}
            >
              🎁 Za darmo
            </FilterButton>
          </FilterContainer>
          
          {/* Filtry kategorii */}
          <FilterContainer>
            <FilterButton
              active={categoryFilter === 'all'}
              onClick={() => handleCategoryFilter('all')}
            >
              Wszystkie kategorie
            </FilterButton>
            {uniqueCategories.map(category => (
              <FilterButton
                key={category}
                active={categoryFilter === category}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterContainer>
          
          {/* Filtry lokalizacji */}
          <FilterContainer>
            <LocationFilterContainer>
              <LocationButton
                selected={!selectedLocation}
                onClick={openLocationModal}
              >
                <FaMapMarkerAlt />
                {selectedLocation ? selectedLocation.city : 'Wybierz lokalizację'}
              </LocationButton>
              {selectedLocation && (
                <ClearLocationButton onClick={clearLocationFilter}>
                  Wyczyść
                </ClearLocationButton>
              )}
            </LocationFilterContainer>
          </FilterContainer>
          
          {/* Przycisk wyczyszczenia wszystkich filtrów */}
          {(selectedLocation || saleTypeFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
            <FilterContainer>
              <ClearAllFiltersButton onClick={clearAllFilters}>
                🗑️ Wyczyść wszystkie filtry
              </ClearAllFiltersButton>
            </FilterContainer>
          )}
          
          {/* Opcja wyłączenia automatycznej lokalizacji */}
          <FilterContainer>
            <LocationSettingsButton 
              onClick={() => {
                const current = localStorage.getItem('autoLocation') !== 'false';
                localStorage.setItem('autoLocation', (!current).toString());
                window.location.reload();
              }}
            >
              {localStorage.getItem('autoLocation') !== 'false' ? '🔒' : '🔓'} 
              {localStorage.getItem('autoLocation') !== 'false' ? 'Wyłącz' : 'Włącz'} automatyczną lokalizację
            </LocationSettingsButton>
          </FilterContainer>
        </HeaderContent>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Komponent reklamowy dla strony produktów */}
        <AdvertisementManager location="products" showAds={true} />
        
        <ProductList
          products={filteredProducts.filter(p => p.saleType !== 'auction')}
          loading={loading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          isMarketplace={true}
        />
        
        {/* Sekcja aukcji */}
        {filteredProducts.filter(p => p.saleType === 'auction').length > 0 && (
          <AuctionSection>
            <AuctionSectionTitle>
              <FaGavel />
              Aktywne aukcje
            </AuctionSectionTitle>
            <AuctionGrid>
              {filteredProducts
                .filter(p => p.saleType === 'auction')
                .map(product => (
                  <AuctionCard
                    key={product._id}
                    product={product}
                    onBid={handleBid}
                    onAddToWishlist={handleAddToWishlist}
                    onQuickView={handleQuickView}
                  />
                ))}
            </AuctionGrid>
          </AuctionSection>
        )}
      </MainContent>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <ModalOverlay onClick={() => setShowQuickView(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {selectedProduct.name}
              </ModalTitle>
              <CloseButton
                onClick={() => setShowQuickView(false)}
              >
                <FaTimes size={24} />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ModalGrid>
                {/* Product Image */}
                <ProductImage
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                />
                
                {/* Product Info */}
                <ProductInfo>
                  <ProductDescription>
                    {selectedProduct.description}
                  </ProductDescription>
                  
                  <PriceContainer>
                    <CurrentPrice>
                      {selectedProduct.price.toFixed(2)} zł
                    </CurrentPrice>
                    {selectedProduct.originalPrice && (
                      <OriginalPrice>
                        {selectedProduct.originalPrice.toFixed(2)} zł
                      </OriginalPrice>
                    )}
                  </PriceContainer>
                  
                  <RatingContainer>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        filled={i < Math.floor(selectedProduct.ratings.average)}
                      />
                    ))}
                    <RatingText>
                      ({selectedProduct.ratings.count} opinii)
                    </RatingText>
                  </RatingContainer>
                  
                  <ProductDetails>
                    <DetailItem>
                      <DetailLabel>Sklep:</DetailLabel>
                      <DetailValue>{selectedProduct.shop.name}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Stan magazynowy:</DetailLabel>
                      <DetailValue>{selectedProduct.stock} sztuk</DetailValue>
                    </DetailItem>
                    {selectedProduct.shipping.freeShipping && (
                      <FreeShipping>
                        ✓ Darmowa dostawa
                      </FreeShipping>
                    )}
                  </ProductDetails>
                  
                  <ActionButtons>
                    <AddToCartButton
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setShowQuickView(false);
                      }}
                    >
                      <FaShoppingCart />
                      Dodaj do koszyka
                    </AddToCartButton>
                    <WishlistButton
                      onClick={() => handleAddToWishlist(selectedProduct)}
                    >
                      <FaHeart style={{ color: '#ef4444' }} />
                    </WishlistButton>
                  </ActionButtons>
                </ProductInfo>
              </ModalGrid>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Bid Modal */}
      {showBidModal && selectedAuction && (
        <BidModal
          product={selectedAuction}
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          onBidSubmit={handleBidSubmit}
        />
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal onClick={() => setShowLocationModal(false)}>
          <LocationModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Wybierz lokalizację</h3>
            <LocationSearchInput
              type="text"
              placeholder="Wyszukaj miejscowość, gminę, powiat lub województwo..."
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                searchLocations(e.target.value);
              }}
            />
            
            <SearchResults>
              {isSearching ? (
                <LoadingText>Wyszukiwanie...</LoadingText>
              ) : searchResults.length > 0 ? (
                searchResults.map((location) => (
                  <LocationItem
                    key={location._id}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <LocationName>{location.name}</LocationName>
                    <LocationDetails>
                      {location.type} • {location.code}
                    </LocationDetails>
                  </LocationItem>
                ))
              ) : locationSearch.length > 0 ? (
                <LoadingText>Brak wyników</LoadingText>
              ) : null}
            </SearchResults>
          </LocationModalContent>
        </LocationModal>
      )}
    </Container>
  );
};

export default Products; 