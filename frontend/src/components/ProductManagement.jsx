import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
`;

const AddButton = styled(Link)`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  border: 2px solid ${props => props.theme.border};
`;

const ProductInfo = styled.div`
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
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
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
  
  &.danger {
    background: ${props => props.theme.error};
    color: white;
    
    &:hover {
      background: ${props => props.theme.error}dd;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingState = styled.div`
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
  border: 1px solid ${props => props.theme.error}40;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
`;

export default function ProductManagement() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalValue: 0,
    averagePrice: 0
  });

  useEffect(() => {
    fetchUserShops();
    fetchUserProducts();
  }, []);

  const fetchUserShops = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShops(data);
      }
    } catch (err) {
      console.error('Błąd podczas pobierania sklepów:', err);
    }
  };

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/products/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać produktów');
      }

      const data = await response.json();
      setProducts(data);
      
      // Oblicz statystyki
      const totalValue = data.reduce((sum, product) => sum + (product.price || 0), 0);
      const averagePrice = data.length > 0 ? totalValue / data.length : 0;
      
      setStats({
        totalProducts: data.length,
        activeProducts: data.filter(p => p.isActive !== false).length,
        totalValue,
        averagePrice
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten produkt? Ta operacja jest nieodwracalna.')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć produktu');
      }

      // Odśwież listę produktów
      fetchUserProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesShop = shopFilter === 'all' || product.shop === shopFilter;
    return matchesSearch && matchesCategory && matchesShop;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie produktów...</p>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Zarządzanie produktami</Title>
        <AddButton to="/product-create">📦 Dodaj nowy produkt</AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalProducts}</StatValue>
          <StatLabel>Wszystkie produkty</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activeProducts}</StatValue>
          <StatLabel>Aktywne produkty</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalValue.toLocaleString()} zł</StatValue>
          <StatLabel>Wartość produktów</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.averagePrice.toFixed(2)} zł</StatValue>
          <StatLabel>Średnia cena</StatLabel>
        </StatCard>
      </StatsGrid>

      <Filters>
        <FilterInput
          type="text"
          placeholder="Szukaj produktów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Wszystkie kategorie</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)}>
          <option value="all">Wszystkie sklepy</option>
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>{shop.name}</option>
          ))}
        </Select>
      </Filters>

      {filteredProducts.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3>Nie znaleziono produktów</h3>
          <p>Spróbuj zmienić kryteria wyszukiwania lub dodaj nowy produkt</p>
          <AddButton to="/product-create" style={{ display: 'inline-block', marginTop: '1rem' }}>
            📦 Dodaj pierwszy produkt
          </AddButton>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product._id}>
              <ProductImage>
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : (
                  '📦'
                )}
              </ProductImage>
              
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>{product.price?.toFixed(2)} zł</ProductPrice>
                <ProductCategory>Kategoria: {product.category}</ProductCategory>
              </ProductInfo>
              
              <ProductActions>
                <ActionButton 
                  className="primary" 
                  as={Link} 
                  to={`/product/${product._id}`}
                >
                  👁️ Podgląd
                </ActionButton>
                <ActionButton 
                  className="secondary" 
                  as={Link} 
                  to={`/product/${product._id}/edit`}
                >
                  ✏️ Edytuj
                </ActionButton>
                <ActionButton 
                  className="danger"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  🗑️ Usuń
                </ActionButton>
              </ProductActions>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </Container>
  );
} 