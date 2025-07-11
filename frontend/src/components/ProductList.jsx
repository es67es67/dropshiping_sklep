import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.surface};
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProductCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  position: relative;
  
  @media (max-width: 768px) {
    height: 150px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    height: 120px;
    font-size: 2rem;
  }
`;

const ProductBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ProductShop = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.theme.border};
  background: ${props => props.active ? props.theme.primary : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export default function ProductList() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    averagePrice: 0
  });

  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [currentPage, searchTerm, category, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      let url = `${apiUrl}/api/products?page=${currentPage}&limit=${productsPerPage}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (category !== 'all') {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (sortBy) {
        url += `&sort=${encodeURIComponent(sortBy)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać produktów');
      }

      const data = await response.json();
      setProducts(data.products || data);
      setTotalPages(Math.ceil((data.total || data.length) / productsPerPage));
      
    } catch (err) {
      console.error('Błąd pobierania produktów:', err);
      setError(err.message);
      // Fallback do mock danych
      setProducts([
        {
          _id: '1',
          name: 'Laptop Gaming',
          description: 'Wydajny laptop do gier z najnowszymi komponentami',
          price: 4999,
          category: 'electronics',
          image: '💻',
          shop: { name: 'TechStore' }
        },
        {
          _id: '2',
          name: 'Smartphone Pro',
          description: 'Najnowszy smartfon z zaawansowanym aparatem',
          price: 2999,
          category: 'electronics',
          image: '📱',
          shop: { name: 'MobileShop' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const [productsRes, shopsRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/shops`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let totalProducts = 0, totalShops = 0;

      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const productsData = await productsRes.value.json();
        totalProducts = productsData.length || 0;
      }

      if (shopsRes.status === 'fulfilled' && shopsRes.value.ok) {
        const shopsData = await shopsRes.value.json();
        totalShops = shopsData.length || 0;
      }

      setStats({
        totalProducts,
        totalShops,
        averagePrice: 150.50 // Symulacja
      });
    } catch (err) {
      console.error('Błąd pobierania statystyk:', err);
    }
  };

  const handleAddToCart = (product) => {
    // TODO: Implementacja koszyka
    alert(`Dodano ${product.name} do koszyka!`);
  };

  const handleViewDetails = (product) => {
    // TODO: Implementacja szczegółów produktu
    alert(`Szczegóły produktu: ${product.name}`);
  };

  const getProductIcon = (category) => {
    const icons = {
      electronics: '💻',
      clothing: '👕',
      books: '📚',
      food: '🍎',
      home: '🏠',
      sports: '⚽',
      beauty: '💄',
      toys: '🧸'
    };
    return icons[category] || '📦';
  };

  if (loading && products.length === 0) {
    return (
      <Container>
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie produktów...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container>
      <Header>
        <Title>Produkty</Title>
        {isAuthenticated && (
          <AddButton to="/product-create">
            ➕ Dodaj produkt
          </AddButton>
        )}
      </Header>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.totalProducts}</StatValue>
          <StatLabel>Wszystkie produkty</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.totalShops}</StatValue>
          <StatLabel>Aktywne sklepy</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.averagePrice.toFixed(2)} zł</StatValue>
          <StatLabel>Średnia cena</StatLabel>
        </StatItem>
      </StatsBar>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Filters>
        <FilterInput
          type="text"
          placeholder="Szukaj produktów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Wszystkie kategorie</option>
          <option value="electronics">Elektronika</option>
          <option value="clothing">Ubrania</option>
          <option value="books">Książki</option>
          <option value="food">Żywność</option>
          <option value="home">Dom i ogród</option>
          <option value="sports">Sport</option>
          <option value="beauty">Kosmetyki</option>
          <option value="toys">Zabawki</option>
        </Select>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sortuj po nazwie</option>
          <option value="price">Sortuj po cenie</option>
          <option value="createdAt">Sortuj po dacie</option>
        </Select>
      </Filters>

      {filteredProducts.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Nie znaleziono produktów</h3>
          <p>Spróbuj zmienić kryteria wyszukiwania</p>
        </EmptyState>
      ) : (
        <>
          <Grid>
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.id}>
                <ProductImage>
                  {getProductIcon(product.category)}
                  {product.featured && <ProductBadge>Polecany</ProductBadge>}
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductMeta>
                    <ProductPrice>{product.price?.toFixed(2) || '0.00'} zł</ProductPrice>
                    {product.shop && (
                      <ProductShop>🏪 {product.shop.name}</ProductShop>
                    )}
                  </ProductMeta>
                  <ProductActions>
                    <ActionButton 
                      className="primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      🛒 Dodaj do koszyka
                    </ActionButton>
                    <ActionButton 
                      className="secondary"
                      onClick={() => handleViewDetails(product)}
                    >
                      👁️ Szczegóły
                    </ActionButton>
                  </ProductActions>
                </ProductInfo>
              </ProductCard>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Poprzednia
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  active={currentPage === page}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Następna →
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
} 