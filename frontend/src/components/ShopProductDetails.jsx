import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 600;
`;

const ProductBox = styled.div`
  display: flex;
  gap: 2rem;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const Image = styled.img`
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
  @media (max-width: 480px) {
    width: 100%;
    height: 200px;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Name = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const AddToCartButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}cc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.theme.primary};
  background: white;
  color: ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  text-align: center;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
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

export default function ShopProductDetails({ theme }) {
  const { productId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać produktu ze sklepu');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
      
      // Wysyłanie błędu do systemu monitorowania
      try {
        const errorData = {
          message: err.message,
          type: 'shop_product_fetch_error',
          severity: 'medium',
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          context: {
            productId: productId,
            route: '/products/' + productId,
            userId: localStorage.getItem('userId') || 'anonymous'
          }
        };

        fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(errorData)
        }).catch(reportError => {
          console.error('Nie udało się wysłać błędu do systemu monitorowania:', reportError);
        });
      } catch (reportError) {
        console.error('Błąd podczas raportowania błędu:', reportError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, product?.stock || 1));
    setQuantity(validQuantity);
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      setNotification({ type: 'error', message: 'Musisz się zalogować, aby dodać produkt do koszyka' });
      return;
    }

    if (!product || !product.isActive) {
      setNotification({ type: 'error', message: 'Produkt jest niedostępny' });
      return;
    }

    if (quantity > product.stock) {
      setNotification({ type: 'error', message: 'Niewystarczający stan magazynowy' });
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch(`/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: `Dodano ${quantity} szt. do koszyka!` });
        setQuantity(1); // Reset quantity
      } else {
        setNotification({ type: 'error', message: data.error || 'Błąd dodawania do koszyka' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Błąd sieci' });
    } finally {
      setAddingToCart(false);
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) return <Container>Ładowanie produktu ze sklepu...</Container>;
  if (error) return <Container>Błąd: {error}</Container>;
  if (!product) return <Container>Nie znaleziono produktu w sklepie.</Container>;

  return (
    <Container theme={theme}>
      {notification && (
        <Notification className={notification.type}>
          {notification.message}
        </Notification>
      )}
      
      <BackButton theme={theme} to={product.shop ? `/shop/${product.shop._id || product.shop}` : '/shops'}>
        ← Wróć do sklepu
      </BackButton>
      
      <ProductBox theme={theme}>
        <Image 
          src={product.mainImage || (product.images && product.images[0]) || 'https://via.placeholder.com/400x300'} 
          alt={product.name} 
        />
        <Info>
          <Name>{product.name}</Name>
          <Price theme={theme}>{product.price} zł</Price>
          <Description theme={theme}>{product.description}</Description>
          <div><Label theme={theme}>Kategoria:</Label> {product.category}</div>
          <div><Label theme={theme}>Sklep:</Label> {product.shop?.name || 'Nieznany sklep'}</div>
          <div><Label theme={theme}>Dostępność:</Label> {product.isActive ? 'Dostępny' : 'Niedostępny'} ({product.stock || 0} szt.)</div>
          
          {product.isActive && (product.stock || 0) > 0 && (
            <>
              <QuantitySelector>
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput
                  type="number"
                  min="1"
                  max={product.stock || 1}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                />
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 1)}
                >
                  +
                </QuantityButton>
              </QuantitySelector>
              
              <AddToCartButton 
                theme={theme}
                onClick={addToCart}
                disabled={addingToCart || !isAuthenticated}
              >
                {addingToCart ? 'Dodawanie...' : '🛒 Dodaj do koszyka'}
              </AddToCartButton>
            </>
          )}
          
          {!product.isActive && (
            <div style={{ color: '#f44336', fontWeight: 600, marginTop: '1rem' }}>
              Produkt niedostępny
            </div>
          )}
          
          {product.isActive && (product.stock || 0) === 0 && (
            <div style={{ color: '#f44336', fontWeight: 600, marginTop: '1rem' }}>
              Brak w magazynie
            </div>
          )}
        </Info>
      </ProductBox>
    </Container>
  );
} 