import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';
import PageTitle from '../components/PageTitle';
import { FaSearch, FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';

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
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Symulowane dane produktów
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Najnowszy iPhone z zaawansowaną kamerą i procesorem A17 Pro',
      price: 4999.99,
      originalPrice: 5499.99,
      images: [
        'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max',
        'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max',
      ratings: { average: 4.8, count: 127 },
      shop: {
        name: 'Apple Store',
        logo: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=A',
        address: { city: 'Warszawa' }
      },
      isOnSale: true,
      isFeatured: true,
      stock: 15,
      shipping: { freeShipping: true },
      tags: ['smartphone', 'apple', 'premium'],
      category: 'electronics'
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Flaga Samsung z S Pen i zaawansowaną kamerą',
      price: 4499.99,
      originalPrice: 4999.99,
      images: [
        'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra',
        'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra',
      ratings: { average: 4.6, count: 89 },
      shop: {
        name: 'Samsung Store',
        logo: 'https://via.placeholder.com/50x50/1428A0/FFFFFF?text=S',
        address: { city: 'Kraków' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 8,
      shipping: { freeShipping: true },
      tags: ['smartphone', 'samsung', 'android'],
      category: 'electronics'
    },
    {
      _id: '3',
      name: 'MacBook Pro 16" M3 Max',
      description: 'Profesjonalny laptop z najnowszym procesorem Apple M3 Max',
      price: 12999.99,
      originalPrice: 13999.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16',
      ratings: { average: 4.9, count: 45 },
      shop: {
        name: 'Apple Store',
        logo: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=A',
        address: { city: 'Warszawa' }
      },
      isOnSale: false,
      isFeatured: true,
      stock: 3,
      shipping: { freeShipping: true },
      tags: ['laptop', 'apple', 'professional'],
      category: 'electronics'
    },
    {
      _id: '4',
      name: 'Nike Air Max 270',
      description: 'Wygodne buty sportowe z amortyzacją Air Max',
      price: 599.99,
      originalPrice: 699.99,
      images: [
        'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270',
        'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270',
      ratings: { average: 4.4, count: 234 },
      shop: {
        name: 'Nike Store',
        logo: 'https://via.placeholder.com/50x50/FF6B35/FFFFFF?text=N',
        address: { city: 'Gdańsk' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 25,
      shipping: { freeShipping: false },
      tags: ['sport', 'nike', 'shoes'],
      category: 'sports'
    },
    {
      _id: '5',
      name: 'Sony WH-1000XM5',
      description: 'Słuchawki z aktywną redukcją szumów',
      price: 1299.99,
      originalPrice: 1499.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5',
      ratings: { average: 4.7, count: 156 },
      shop: {
        name: 'Sony Store',
        logo: 'https://via.placeholder.com/50x50/000000/FFFFFF?text=S',
        address: { city: 'Poznań' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 12,
      shipping: { freeShipping: true },
      tags: ['headphones', 'sony', 'wireless'],
      category: 'electronics'
    },
    {
      _id: '6',
      name: 'Adidas Ultraboost 22',
      description: 'Buty do biegania z technologią Boost',
      price: 799.99,
      originalPrice: 899.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22',
      ratings: { average: 4.5, count: 189 },
      shop: {
        name: 'Adidas Store',
        logo: 'https://via.placeholder.com/50x50/000000/FFFFFF?text=A',
        address: { city: 'Wrocław' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 18,
      shipping: { freeShipping: false },
      tags: ['running', 'adidas', 'shoes'],
      category: 'sports'
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

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

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    if (filters.rating && product.ratings.average < parseFloat(filters.rating)) {
      return false;
    }
    return true;
  });

  return (
    <Container>
      <PageTitle title="Produkty" description="Odkryj najlepsze produkty w najlepszych cenach" />
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderFlex>
            <HeaderInfo>
              <Title>Produkty</Title>
              <Subtitle>
                Odkryj najlepsze produkty w najlepszych cenach
              </Subtitle>
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
        </HeaderContent>
      </Header>

      {/* Main Content */}
      <MainContent>
        <ProductList
          products={filteredProducts}
          loading={loading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
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
    </Container>
  );
};

export default Products; 