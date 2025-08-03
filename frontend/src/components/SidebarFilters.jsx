import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilter, FaTimes, FaMapMarkerAlt, FaSearch, FaTags, FaGavel, FaGift, FaMoneyBillWave, FaHandshake } from 'react-icons/fa';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-350px'};
  width: 350px;
  height: 100vh;
  background: ${props => props.theme.surface};
  border-right: 2px solid ${props => props.theme.border};
  box-shadow: ${props => props.isOpen ? '4px 0 20px rgba(0,0,0,0.2)' : 'none'};
  transition: left 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  padding: 1rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
  margin-bottom: 1rem;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.text};
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ClearButton = styled.button`
  background: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: ${props => props.theme.error}dd;
  }
`;

const LocationButton = styled.button`
  background: ${props => props.selected ? props.theme.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : props.theme.text};
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.selected ? props.theme.primary : props.theme.border};
  }
`;

const SidebarFilters = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  saleTypeFilter,
  onSaleTypeFilter,
  categoryFilter,
  onCategoryFilter,
  selectedLocation,
  onLocationSelect,
  onClearLocation,
  onClearAllFilters,
  uniqueCategories,
  hasActiveFilters
}) => {
  const saleTypeOptions = [
    { value: 'all', label: 'Wszystkie', icon: <FaSearch /> },
    { value: 'fixed_price', label: 'Cena stała', icon: <FaMoneyBillWave /> },
    { value: 'auction', label: 'Aukcje', icon: <FaGavel /> },
    { value: 'negotiation', label: 'Propozycje', icon: <FaHandshake /> },
    { value: 'free', label: 'Za darmo', icon: <FaGift /> }
  ];

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>
            <FaFilter />
            Filtry produktów
          </SidebarTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </SidebarHeader>

        {/* Wyszukiwanie */}
        <FilterSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie
          </SectionTitle>
          <SearchInput
            type="text"
            placeholder="Szukaj produktów..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </FilterSection>

        {/* Typ sprzedaży */}
        <FilterSection>
          <SectionTitle>
            <FaTags />
            Typ sprzedaży
          </SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {saleTypeOptions.map(option => (
              <FilterButton
                key={option.value}
                active={saleTypeFilter === option.value}
                onClick={() => onSaleTypeFilter(option.value)}
              >
                {option.icon}
                {option.label}
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Kategorie */}
        <FilterSection>
          <SectionTitle>
            <FaTags />
            Kategorie
          </SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <FilterButton
              active={categoryFilter === 'all'}
              onClick={() => onCategoryFilter('all')}
            >
              Wszystkie kategorie
            </FilterButton>
            {uniqueCategories.map(category => (
              <FilterButton
                key={category}
                active={categoryFilter === category}
                onClick={() => onCategoryFilter(category)}
              >
                {category}
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Lokalizacja */}
        <FilterSection>
          <SectionTitle>
            <FaMapMarkerAlt />
            Lokalizacja
          </SectionTitle>
          <LocationButton
            selected={!selectedLocation}
            onClick={onLocationSelect}
          >
            <FaMapMarkerAlt />
            {selectedLocation ? selectedLocation.city : 'Wybierz lokalizację'}
          </LocationButton>
          {selectedLocation && (
            <FilterButton
              onClick={onClearLocation}
              style={{ marginTop: '0.5rem' }}
            >
              <FaTimes />
              Wyczyść lokalizację
            </FilterButton>
          )}
        </FilterSection>

        {/* Wyczyść wszystkie filtry */}
        {hasActiveFilters && (
          <FilterSection>
            <ClearButton onClick={onClearAllFilters}>
              🗑️ Wyczyść wszystkie filtry
            </ClearButton>
          </FilterSection>
        )}
      </SidebarContainer>
    </>
  );
};

export default SidebarFilters; 