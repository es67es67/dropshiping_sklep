import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
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

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.edit {
    background: ${props => props.theme.info};
    color: white;
    
    &:hover {
      background: ${props => props.theme.info}dd;
    }
  }
  
  &.delete {
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

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Modal = styled.div`
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

const ModalContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background: #4caf50;
  }
  
  &.error {
    background: #f44336;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default function ShopProducts({ shopId, theme, isOwner: propIsOwner }) {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [shopOwner, setShopOwner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '0',
    images: []
  });

  const categories = [
    'Elektronika',
    'Odzież i moda',
    'Książki i multimedia',
    'Sport i rekreacja',
    'Dom i ogród',
    'Motoryzacja',
    'Zdrowie i uroda',
    'Zabawki i gry',
    'Spożywcze',
    'Inne'
  ];

  // Sprawdź czy użytkownik jest właścicielem sklepu
  const isOwner = propIsOwner !== undefined ? propIsOwner : (shopOwner && user && shopOwner._id === user._id);

  useEffect(() => {
    fetchShopDetails();
    fetchProducts();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const shopData = await response.json();
        setShopOwner(shopData.owner);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów sklepu:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/products/shop/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data); // Obsługuje zarówno nową jak i starą strukturę
      }
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const productData = {
        ...formData,
        shopId: shopId, // Backend oczekuje shopId
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      };

      const url = editingProduct 
        ? `${apiUrl}/api/products/${editingProduct._id}`
        : `${apiUrl}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert(editingProduct ? '✅ Produkt zaktualizowany!' : '✅ Produkt dodany!');
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Błąd podczas zapisywania produktu');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('❌ ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand || '',
      stock: (product.stock || 0).toString(),
      images: product.images || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten produkt?')) return;
    
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

      if (response.ok) {
        alert('✅ Produkt usunięty!');
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Błąd podczas usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('❌ ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '0',
      images: []
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const addToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Musisz się zalogować, aby dodać produkt do koszyka' });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: 'Dodano do koszyka!' });
      } else {
        setNotification({ type: 'error', message: data.error || 'Błąd dodawania do koszyka' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd sieci' });
    }
  };

  // Auto-hide notification after 3 seconds
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return <div>Ładowanie produktów...</div>;
  }

  return (
    <Container>
      {notification && (
        <Notification className={notification.type}>
          {notification.message}
        </Notification>
      )}
      
      <Title>Produkty sklepu</Title>
      
      <Header>
        <h2>Lista produktów ({products.length})</h2>
        {isOwner && (
          <Button onClick={() => setShowAddModal(true)}>
            ➕ Dodaj produkt
          </Button>
        )}
      </Header>

      {products.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <h3>Brak produktów</h3>
          <p>Dodaj swój pierwszy produkt, aby rozpocząć sprzedaż!</p>
        </EmptyState>
      ) : (
        <ProductGrid>
          {products.map(product => (
            <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
              <ProductCard>
                {product.images && product.images[0] && (
                  <ProductImage src={product.images[0]} alt={product.name} />
                )}
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price} zł</ProductPrice>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductActions>
                  {isAuthenticated && product.isActive && product.stock > 0 && (
                    <AddToCartButton 
                      theme={theme}
                      onClick={(e) => addToCart(product._id, e)}
                    >
                      🛒 Dodaj do koszyka
                    </AddToCartButton>
                  )}
                  {isOwner && (
                    <>
                      <ActionButton 
                        className="edit" 
                        onClick={e => { e.preventDefault(); handleEdit(product); }}
                      >
                        ✏️ Edytuj
                      </ActionButton>
                      <ActionButton 
                        className="delete" 
                        onClick={e => { e.preventDefault(); handleDelete(product._id); }}
                      >
                        🗑️ Usuń
                      </ActionButton>
                    </>
                  )}
                </ProductActions>
              </ProductCard>
            </Link>
          ))}
        </ProductGrid>
      )}

      {showAddModal && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edytuj produkt' : 'Dodaj nowy produkt'}</h2>
            
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <Label>Nazwa produktu *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormRow>
              
              <FormRow>
                <Label>Opis</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormRow>
              
              <FormRow>
                <Label>Cena (zł) *</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </FormRow>
              
              <FormRow>
                <Label>Kategoria</Label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Wybierz kategorię</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormRow>
              
              <FormRow>
                <Label>Marka</Label>
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </FormRow>
              
              <FormRow>
                <Label>Stan magazynowy</Label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormRow>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">
                  {editingProduct ? 'Zapisz zmiany' : 'Dodaj produkt'}
                </Button>
                <Button type="button" onClick={closeModal} style={{ background: '#6B7280' }}>
                  Anuluj
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
} 