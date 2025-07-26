import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { FaFilter, FaSort, FaTh, FaList, FaSearch } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${props => props.theme.surface};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ResultsInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ViewModeToggle = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.25rem;
`;

const ViewButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 0.75rem;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 2px solid ${props => props.theme.border};
  border-top: 2px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const ClearFiltersButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const ProductList = ({ 
  products = [], 
  loading = false, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView,
  onFiltersChange,
  onSortChange,
  onPageChange 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    availability: '',
    delivery: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: '',
      delivery: ''
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>🔍</EmptyIcon>
        <EmptyTitle>
          Nie znaleziono produktów
        </EmptyTitle>
        <EmptyDescription>
          Spróbuj zmienić filtry lub wyszukiwanie
        </EmptyDescription>
        <ClearFiltersButton onClick={clearFilters}>
          Wyczyść filtry
        </ClearFiltersButton>
      </EmptyState>
    );
  }

  return (
    <Container>
      {/* Toolbar */}
      <Toolbar>
        {/* Results Info */}
        <ResultsInfo>
          Znaleziono {products.length} produktów
        </ResultsInfo>

        {/* Controls */}
        <Controls>
          {/* View Mode Toggle */}
          <ViewModeToggle>
            <ViewButton
              onClick={() => setViewMode('grid')}
              active={viewMode === 'grid'}
              title="Widok siatki"
            >
              <FaTh />
            </ViewButton>
            <ViewButton
              onClick={() => setViewMode('list')}
              active={viewMode === 'list'}
              title="Widok listy"
            >
              <FaList />
            </ViewButton>
          </ViewModeToggle>

          {/* Sort */}
          <SortSelect
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
            <option value="price-low">Cena: od najniższej</option>
            <option value="price-high">Cena: od najwyższej</option>
            <option value="rating">Najwyżej oceniane</option>
            <option value="name">Nazwa: A-Z</option>
          </SortSelect>
        </Controls>
      </Toolbar>

      {/* Products Grid */}
      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onQuickView={onQuickView}
          />
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductList; 