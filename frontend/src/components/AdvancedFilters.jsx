import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PriceRangeContainer = styled.div`
  margin-bottom: 16px;
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const PriceSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.border};
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    border: none;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.primary};
`;

const RatingFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RatingOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#F59E0B' : '#E5E7EB'};
  font-size: 0.875rem;
`;

const AvailabilityFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AvailabilityOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const DeliveryFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const LocationFilter = styled.div`
  margin-bottom: 16px;
`;

const LocationInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const DistanceSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.border};
  outline: none;
  -webkit-appearance: none;
  margin-top: 8px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    border: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ApplyButton = styled(Button)`
  background: ${props => props.theme.primary};
  color: white;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const ClearButton = styled(Button)`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  
  &:hover {
    background: ${props => props.theme.primary}10;
    border-color: ${props => props.theme.primary};
  }
`;

const FilterCount = styled.span`
  background: ${props => props.theme.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

export default function AdvancedFilters({ theme, onFiltersChange }) {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    categories: [],
    rating: 0,
    availability: 'all',
    delivery: 'all',
    location: '',
    distance: 50,
    inStock: false,
    freeShipping: false,
    newProducts: false,
    onSale: false
  });

  const categories = [
    { id: 'electronics', name: 'Elektronika', icon: '📱' },
    { id: 'fashion', name: 'Moda', icon: '👕' },
    { id: 'home', name: 'Dom i Ogród', icon: '🏠' },
    { id: 'sports', name: 'Sport', icon: '⚽' },
    { id: 'books', name: 'Książki', icon: '📚' },
    { id: 'toys', name: 'Zabawki', icon: '🧸' },
    { id: 'automotive', name: 'Motoryzacja', icon: '🚗' },
    { id: 'health', name: 'Zdrowie', icon: '💊' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    handleFilterChange('categories', newCategories);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 1000 },
      categories: [],
      rating: 0,
      availability: 'all',
      delivery: 'all',
      location: '',
      distance: 50,
      inStock: false,
      freeShipping: false,
      newProducts: false,
      onSale: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.delivery !== 'all') count++;
    if (filters.location) count++;
    if (filters.inStock) count++;
    if (filters.freeShipping) count++;
    if (filters.newProducts) count++;
    if (filters.onSale) count++;
    return count;
  };

  return (
    <FilterContainer theme={theme}>
      <FilterTitle theme={theme}>
        🔍 Filtry zaawansowane
        {getActiveFiltersCount() > 0 && (
          <FilterCount theme={theme}>{getActiveFiltersCount()}</FilterCount>
        )}
      </FilterTitle>

      {/* Cena */}
      <FilterSection>
        <SectionTitle theme={theme}>💰 Cena</SectionTitle>
        <PriceRangeContainer>
          <PriceInputs>
            <PriceInput
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { 
                ...filters.priceRange, 
                min: parseInt(e.target.value) || 0 
              })}
              theme={theme}
            />
            <PriceInput
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { 
                ...filters.priceRange, 
                max: parseInt(e.target.value) || 1000 
              })}
              theme={theme}
            />
          </PriceInputs>
          <PriceSlider
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange.max}
            onChange={(e) => handleFilterChange('priceRange', { 
              ...filters.priceRange, 
              max: parseInt(e.target.value) 
            })}
            theme={theme}
          />
        </PriceRangeContainer>
      </FilterSection>

      {/* Kategorie */}
      <FilterSection>
        <SectionTitle theme={theme}>📂 Kategorie</SectionTitle>
        <CategoryList>
          {categories.map(category => (
            <CategoryItem key={category.id} theme={theme}>
              <Checkbox
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                theme={theme}
              />
              {category.icon} {category.name}
            </CategoryItem>
          ))}
        </CategoryList>
      </FilterSection>

      {/* Oceny */}
      <FilterSection>
        <SectionTitle theme={theme}>⭐ Oceny</SectionTitle>
        <RatingFilter>
          {[4, 3, 2, 1].map(rating => (
            <RatingOption key={rating} theme={theme}>
              <Checkbox
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
                theme={theme}
              />
              <Stars>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} filled={star <= rating}>★</Star>
                ))}
              </Stars>
              i więcej
            </RatingOption>
          ))}
        </RatingFilter>
      </FilterSection>

      {/* Dostępność */}
      <FilterSection>
        <SectionTitle theme={theme}>📦 Dostępność</SectionTitle>
        <AvailabilityFilter>
          <AvailabilityOption theme={theme}>
            <Checkbox
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              theme={theme}
            />
            🟢 Dostępne
          </AvailabilityOption>
          <AvailabilityOption theme={theme}>
            <Checkbox
              type="checkbox"
              checked={filters.newProducts}
              onChange={(e) => handleFilterChange('newProducts', e.target.checked)}
              theme={theme}
            />
            🆕 Nowe produkty
          </AvailabilityOption>
          <AvailabilityOption theme={theme}>
            <Checkbox
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              theme={theme}
            />
            🏷️ Promocje
          </AvailabilityOption>
        </AvailabilityFilter>
      </FilterSection>

      {/* Dostawa */}
      <FilterSection>
        <SectionTitle theme={theme}>🚚 Dostawa</SectionTitle>
        <DeliveryFilter>
          <DeliveryOption theme={theme}>
            <Checkbox
              type="checkbox"
              checked={filters.freeShipping}
              onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
              theme={theme}
            />
            🆓 Darmowa dostawa
          </DeliveryOption>
          <DeliveryOption theme={theme}>
            <Checkbox
              type="radio"
              name="delivery"
              checked={filters.delivery === 'same-day'}
              onChange={() => handleFilterChange('delivery', 'same-day')}
              theme={theme}
            />
            ⚡ Dostawa tego samego dnia
          </DeliveryOption>
          <DeliveryOption theme={theme}>
            <Checkbox
              type="radio"
              name="delivery"
              checked={filters.delivery === 'next-day'}
              onChange={() => handleFilterChange('delivery', 'next-day')}
              theme={theme}
            />
            📅 Dostawa następnego dnia
          </DeliveryOption>
        </DeliveryFilter>
      </FilterSection>

      {/* Lokalizacja */}
      <FilterSection>
        <SectionTitle theme={theme}>📍 Lokalizacja</SectionTitle>
        <LocationFilter>
          <LocationInput
            type="text"
            placeholder="Wprowadź miasto lub kod pocztowy"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            theme={theme}
          />
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: theme.textSecondary }}>
            Promień: {filters.distance} km
          </div>
          <DistanceSlider
            type="range"
            min="1"
            max="100"
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
            theme={theme}
          />
        </LocationFilter>
      </FilterSection>

      {/* Przyciski akcji */}
      <ActionButtons theme={theme}>
        <ApplyButton theme={theme}>
          ✅ Zastosuj filtry
        </ApplyButton>
        <ClearButton theme={theme} onClick={handleClearFilters}>
          🗑️ Wyczyść
        </ClearButton>
      </ActionButtons>
    </FilterContainer>
  );
} 