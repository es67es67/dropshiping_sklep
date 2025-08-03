import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: ${props => props.theme.primary};
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const SearchSection = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 20px;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterChip = styled.div`
  background: ${props => props.$active ? props.theme.primary : props.theme.background};
  color: ${props => props.$active ? 'white' : props.theme.text};
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.primary}20;
  }
`;

const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompanyCard = styled(Link)`
  background: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image})` : '#e0e0e0'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: ${props => props.theme.primary};
`;

const CompanyLocation = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 5px;
`;

const CompanyType = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CompanyDescription = styled.p`
  line-height: 1.5;
  margin: 0 0 15px 0;
  color: ${props => props.theme.textSecondary};
`;

const CompanyStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.border};
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Star = styled.span`
  color: #ffd700;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const PageButton = styled.button`
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.$active ? props.theme.primary : props.theme.background};
  color: ${props => props.$active ? 'white' : props.theme.text};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.primary}20;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreateButton = styled(Link)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0,0,0,0.3);
  }
`;

export default function CompanyProfiles({ theme }) {
  const { user, isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    q: '',
    industry: '',
    location: '',
    companyType: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const industries = [
    'Technologia', 'Finanse', 'Zdrowie', 'Edukacja', 'Handel', 
    'Produkcja', 'Usługi', 'Media', 'Transport', 'Nieruchomości'
  ];

  const companyTypes = [
    'startup', 'sme', 'corporation', 'nonprofit', 'government', 'freelance'
  ];

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchParams]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...searchParams
      });

      const response = await fetch(`/api/company-profiles/list?${params}`);

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companyProfiles);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Błąd pobierania firm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  const handleFilterChange = (filter, value) => {
    setSearchParams(prev => ({
      ...prev,
      [filter]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchParams({
      q: '',
      industry: '',
      location: '',
      companyType: ''
    });
    setActiveFilters([]);
    setCurrentPage(1);
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      <Star key={star}>{star <= rating ? '★' : '☆'}</Star>
    ));
  };

  if (loading) {
    return (
      <Container theme={theme}>
        <div>Ładowanie firm...</div>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <Header>
        <Title theme={theme}>🏢 Profile Firmowe</Title>
        <Subtitle theme={theme}>
          Odkryj firmy w Twojej okolicy i nawiąż wartościowe kontakty biznesowe
        </Subtitle>
      </Header>

      <SearchSection theme={theme}>
        <SearchForm onSubmit={handleSearch}>
          <FormGroup>
            <Label theme={theme}>Wyszukaj</Label>
            <Input
              type="text"
              placeholder="Nazwa firmy, branża..."
              value={searchParams.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Branża</Label>
            <Select
              value={searchParams.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              theme={theme}
            >
              <option value="">Wszystkie branże</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Lokalizacja</Label>
            <Input
              type="text"
              placeholder="Miasto, województwo..."
              value={searchParams.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              theme={theme}
            />
          </FormGroup>
          
          <SearchButton type="submit" theme={theme}>
            🔍 Szukaj
          </SearchButton>
        </SearchForm>
      </SearchSection>

      <FiltersSection>
        <FilterChip
          $active={searchParams.industry === 'Technologia'}
          onClick={() => handleFilterChange('industry', 'Technologia')}
          theme={theme}
        >
          💻 Technologia
        </FilterChip>
        <FilterChip
          $active={searchParams.industry === 'Finanse'}
          onClick={() => handleFilterChange('industry', 'Finanse')}
          theme={theme}
        >
          💰 Finanse
        </FilterChip>
        <FilterChip
          $active={searchParams.industry === 'Zdrowie'}
          onClick={() => handleFilterChange('industry', 'Zdrowie')}
          theme={theme}
        >
          🏥 Zdrowie
        </FilterChip>
        <FilterChip
          $active={searchParams.companyType === 'startup'}
          onClick={() => handleFilterChange('companyType', 'startup')}
          theme={theme}
        >
          🚀 Startupy
        </FilterChip>
        <FilterChip
          $active={searchParams.companyType === 'sme'}
          onClick={() => handleFilterChange('companyType', 'sme')}
          theme={theme}
        >
          🏢 MŚP
        </FilterChip>
        <FilterChip
          $active={false}
          onClick={clearFilters}
          theme={theme}
        >
          🗑️ Wyczyść filtry
        </FilterChip>
      </FiltersSection>

      {companies.length > 0 ? (
        <>
          <CompaniesGrid>
            {companies.map(company => (
              <CompanyCard key={company._id} to={`/company-profiles/${company._id}`} theme={theme}>
                <CompanyHeader>
                  <CompanyLogo image={company.logo} />
                  <CompanyInfo>
                    <CompanyName theme={theme}>{company.name}</CompanyName>
                    <CompanyLocation theme={theme}>
                      📍 {company.address?.city}, {company.address?.voivodeship}
                    </CompanyLocation>
                    <CompanyType theme={theme}>
                      🏢 {company.companyType}
                    </CompanyType>
                  </CompanyInfo>
                </CompanyHeader>
                
                <CompanyDescription theme={theme}>
                  {company.shortDescription || company.description?.substring(0, 120) + '...'}
                </CompanyDescription>
                
                <CompanyStats theme={theme}>
                  <Stat>
                    <StatValue theme={theme}>{company.stats?.followers || 0}</StatValue>
                    <StatLabel theme={theme}>Obserwujących</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue theme={theme}>{company.stats?.averageRating?.toFixed(1) || '0.0'}</StatValue>
                    <StatLabel theme={theme}>
                      <Rating>
                        {renderStars(company.stats?.averageRating || 0)}
                      </Rating>
                    </StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue theme={theme}>{company.stats?.totalReviews || 0}</StatValue>
                    <StatLabel theme={theme}>Recenzji</StatLabel>
                  </Stat>
                </CompanyStats>
              </CompanyCard>
            ))}
          </CompaniesGrid>

          <Pagination>
            <PageButton
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              theme={theme}
            >
              ← Poprzednia
            </PageButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PageButton
                  key={page}
                  $active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                  theme={theme}
                >
                  {page}
                </PageButton>
              );
            })}
            
            <PageButton
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              theme={theme}
            >
              Następna →
            </PageButton>
          </Pagination>
        </>
      ) : (
        <EmptyState theme={theme}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
          <h3>Nie znaleziono firm</h3>
          <p>Spróbuj zmienić kryteria wyszukiwania lub dodaj pierwszą firmę!</p>
        </EmptyState>
      )}

      {isAuthenticated && (
        <CreateButton to="/company-profiles/create" theme={theme}>
          +
        </CreateButton>
      )}
    </Container>
  );
} 