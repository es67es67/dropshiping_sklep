import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import AdvancedFilters from '../components/AdvancedFilters';
import ReviewSystem from '../components/ReviewSystem';
import LiveChat from '../components/LiveChat';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.text};
  margin: 0;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FiltersSidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductsGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: ${props => props.theme.text};
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

const PageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function ProductsEnhanced({ theme }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Symulowane dane produktów
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      price: 4999.99,
      oldPrice: 5499.99,
      rating: 4.8,
      reviewsCount: 156,
      inStock: true,
      isNew: true,
      isPremium: true,
      images: ['/iphone1.jpg', '/iphone2.jpg', '/iphone3.jpg'],
      category: 'electronics',
      location: 'Warszawa',
      deliveryType: 'Kurier',
      deliveryTime: '1-2 dni',
      freeShipping: true,
      shop: {
        name: 'TechStore',
        rating: 4.9,
        reviewsCount: 1247
      }
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      price: 3999.99,
      rating: 4.6,
      reviewsCount: 89,
      inStock: true,
      isNew: true,
      images: ['/samsung1.jpg', '/samsung2.jpg'],
      category: 'electronics',
      location: 'Kraków',
      deliveryType: 'Poczta',
      deliveryTime: '2-3 dni',
      freeShipping: false,
      shop: {
        name: 'MobileWorld',
        rating: 4.7,
        reviewsCount: 892
      }
    },
    {
      _id: '3',
      name: 'Nike Air Max 270',
      price: 599.99,
      oldPrice: 799.99,
      rating: 4.5,
      reviewsCount: 234,
      inStock: true,
      onSale: true,
      images: ['/nike1.jpg', '/nike2.jpg', '/nike3.jpg'],
      category: 'fashion',
      location: 'Poznań',
      deliveryType: 'Kurier',
      deliveryTime: '1-3 dni',
      freeShipping: true,
      shop: {
        name: 'SportShop',
        rating: 4.8,
        reviewsCount: 567
      }
    },
    {
      _id: '4',
      name: 'MacBook Pro 16" M3',
      price: 12999.99,
      rating: 4.9,
      reviewsCount: 67,
      inStock: false,
      isPremium: true,
      images: ['/macbook1.jpg', '/macbook2.jpg'],
      category: 'electronics',
      location: 'Wrocław',
      deliveryType: 'Kurier',
      deliveryTime: '1-2 dni',
      freeShipping: true,
      shop: {
        name: 'AppleStore',
        rating: 4.9,
        reviewsCount: 2341
      }
    },
    {
      _id: '5',
      name: 'Sony WH-1000XM5',
      price: 1299.99,
      oldPrice: 1499.99,
      rating: 4.7,
      reviewsCount: 189,
      inStock: true,
      onSale: true,
      images: ['/sony1.jpg', '/sony2.jpg'],
      category: 'electronics',
      location: 'Gdańsk',
      deliveryType: 'Poczta',
      deliveryTime: '2-4 dni',
      freeShipping: false,
      shop: {
        name: 'AudioPro',
        rating: 4.6,
        reviewsCount: 445
      }
    },
    {
      _id: '6',
      name: 'Adidas Ultraboost 22',
      price: 799.99,
      rating: 4.4,
      reviewsCount: 123,
      inStock: true,
      images: ['/adidas1.jpg', '/adidas2.jpg'],
      category: 'fashion',
      location: 'Łódź',
      deliveryType: 'Kurier',
      deliveryTime: '1-3 dni',
      freeShipping: true,
      shop: {
        name: 'RunStore',
        rating: 4.5,
        reviewsCount: 234
      }
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrowanie produktów
    let filtered = [...products];

    // Filtry cenowe
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && 
        product.price <= filters.priceRange.max
      );
    }

    // Filtry kategorii
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filtry ocen
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Filtry dostępności
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters.newProducts) {
      filtered = filtered.filter(product => product.isNew);
    }

    if (filters.onSale) {
      filtered = filtered.filter(product => product.onSale);
    }

    // Filtry dostawy
    if (filters.freeShipping) {
      filtered = filtered.filter(product => product.freeShipping);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, products]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    let sorted = [...filteredProducts];

    switch (sortType) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popularity':
      default:
        sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleQuickFilter = (filterType) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'new':
        newFilters.newProducts = !newFilters.newProducts;
        break;
      case 'sale':
        newFilters.onSale = !newFilters.onSale;
        break;
      case 'free-shipping':
        newFilters.freeShipping = !newFilters.freeShipping;
        break;
      case 'in-stock':
        newFilters.inStock = !newFilters.inStock;
        break;
    }
    
    setFilters(newFilters);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowChat(true);
  };

  // Paginacja
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner theme={theme}>
          🔄 Ładowanie produktów...
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title theme={theme}>📦 Produkty</Title>
        <ResultsInfo theme={theme}>
          <span>Znaleziono {filteredProducts.length} produktów</span>
          <SortContainer>
            <span>Sortuj:</span>
            <SortSelect 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              theme={theme}
            >
              <option value="popularity">Popularność</option>
              <option value="price-low">Cena: od najniższej</option>
              <option value="price-high">Cena: od najwyższej</option>
              <option value="rating">Oceny</option>
              <option value="newest">Najnowsze</option>
            </SortSelect>
          </SortContainer>
        </ResultsInfo>
      </Header>

      <QuickActions>
        <QuickActionButton 
          active={filters.newProducts}
          onClick={() => handleQuickFilter('new')}
          theme={theme}
        >
          🆕 Nowe
        </QuickActionButton>
        <QuickActionButton 
          active={filters.onSale}
          onClick={() => handleQuickFilter('sale')}
          theme={theme}
        >
          🏷️ Promocje
        </QuickActionButton>
        <QuickActionButton 
          active={filters.freeShipping}
          onClick={() => handleQuickFilter('free-shipping')}
          theme={theme}
        >
          🆓 Darmowa dostawa
        </QuickActionButton>
        <QuickActionButton 
          active={filters.inStock}
          onClick={() => handleQuickFilter('in-stock')}
          theme={theme}
        >
          🟢 Dostępne
        </QuickActionButton>
      </QuickActions>

      <LayoutContainer>
        <FiltersSidebar>
          <AdvancedFilters 
            theme={theme} 
            onFiltersChange={handleFiltersChange}
          />
        </FiltersSidebar>

        <div style={{ flex: 1 }}>
          {currentProducts.length > 0 ? (
            <>
              <ProductsGrid>
                {currentProducts.map(product => (
                  <ProductCard 
                    key={product._id}
                    product={product}
                    theme={theme}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </ProductsGrid>

              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    theme={theme}
                  >
                    ← Poprzednia
                  </PageButton>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      theme={theme}
                    >
                      {page}
                    </PageButton>
                  ))}
                  
                  <PageButton 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    theme={theme}
                  >
                    Następna →
                  </PageButton>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyState theme={theme}>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle theme={theme}>Nie znaleziono produktów</EmptyTitle>
              <EmptyText theme={theme}>
                Spróbuj zmienić filtry lub wyszukiwanie
              </EmptyText>
            </EmptyState>
          )}
        </div>
      </LayoutContainer>

      {/* Chat z sprzedawcą */}
      {showChat && selectedProduct && (
        <LiveChat 
          seller={selectedProduct.shop}
          theme={theme}
        />
      )}

      {/* System recenzji dla wybranego produktu */}
      {selectedProduct && (
        <div style={{ marginTop: '40px' }}>
          <ReviewSystem 
            product={selectedProduct}
            theme={theme}
          />
        </div>
      )}
    </Container>
  );
} 