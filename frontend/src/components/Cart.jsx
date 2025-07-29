import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaStore, FaTruck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// 🟡 SHARED COMPONENT: Cart
// Zależności: AuthContext, /api/cart endpoints
// Wpływ: koszyk zakupów użytkownika
// Jeśli się zepsuje: koszyk nie działa
// Używane w: App.jsx (route /cart), Navbar (CartLink)
// API: /api/cart, /api/cart/summary, /api/cart/update-quantity, /api/cart/remove

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const CartHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 15px;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .cart-icon {
    font-size: 2.5rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const SellerCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const SellerHeader = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  .seller-info {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
  }

  .seller-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .seller-details {
    flex: 1;
  }

  .seller-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 5px 0;
  }

  .seller-location {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }

  .seller-summary {
    text-align: right;
    min-width: 150px;
  }

  .item-count {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 0 5px 0;
  }

  .subtotal {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
`;

const SellerContent = styled.div`
  padding: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
`;

const ProductCard = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .product-info {
    flex: 1;
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
  }

  .product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #667eea;
    margin: 0 0 8px 0;
  }

  .product-original-price {
    font-size: 0.9rem;
    color: #999;
    text-decoration: line-through;
    margin: 0 0 8px 0;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quantity-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }

  .quantity-display {
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 40px;
    text-align: center;
    color: #333;
  }

  .remove-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }
  }
`;

const SellerFooter = styled.div`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;

  .shipping-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;
    font-size: 0.9rem;
  }

  .seller-total {
    text-align: right;
  }

  .total-label {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 5px 0;
  }

  .total-amount {
    font-size: 1.4rem;
    font-weight: 700;
    color: #667eea;
    margin: 0;
  }
`;

const CartSummary = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-top: 30px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  h2 {
    margin: 0 0 20px 0;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 25px;
  }

  .summary-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }

  .summary-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 0 5px 0;
  }

  .summary-value {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .checkout-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 auto;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

  .empty-icon {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 20px;
  }

  h2 {
    color: #666;
    margin: 0 0 15px 0;
  }

  p {
    color: #999;
    margin: 0 0 30px 0;
  }

  .continue-shopping {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log('🔍 Cart component - stan autoryzacji:', {
      isAuthenticated,
      user: user?._id,
      hasToken: !!localStorage.getItem('token'),
      token: localStorage.getItem('token')?.substring(0, 20) + '...'
    });
    
    // Test logowania
    if (!isAuthenticated) {
      console.log('⚠️ Użytkownik nie jest zalogowany');
      console.log('🔍 Sprawdzam localStorage:', {
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')
      });
    } else {
      console.log('✅ Użytkownik jest zalogowany:', user);
    }
    
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sprawdź czy użytkownik jest zalogowany
      if (!isAuthenticated) {
        setError('Musisz się zalogować, aby zobaczyć koszyk');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji');
        setLoading(false);
        return;
      }

      console.log('🔍 Pobieranie koszyka dla użytkownika:', user?._id);
      console.log('🔑 Token:', token ? 'Dostępny' : 'Brak');

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Status odpowiedzi:', response.status);
      console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Błąd odpowiedzi:', errorText);
        throw new Error(`Nie udało się pobrać koszyka (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Pobrano koszyk:', data);
      setCart(data);
    } catch (err) {
      console.error('💥 Błąd podczas pobierania koszyka:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch('/api/cart/update-quantity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować ilości');
      }

      await fetchCart();
    } catch (err) {
      console.error('Błąd aktualizacji ilości:', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć produktu');
      }

      await fetchCart();
    } catch (err) {
      console.error('Błąd usuwania produktu:', err);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się wyczyścić koszyka');
      }

      await fetchCart();
    } catch (err) {
      console.error('Błąd czyszczenia koszyka:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <CartContainer>
        <PageTitle title="Koszyk" description="Twój koszyk zakupów" />
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '12px',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#1976d2', marginBottom: '1rem' }}>🔐 Wymagane logowanie</h2>
          <p style={{ marginBottom: '2rem', color: '#424242', fontSize: '1.1rem' }}>
            Aby zobaczyć swój koszyk zakupów, musisz się zalogować.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              textDecoration: 'none',
              marginRight: '1rem'
            }}
          >
            🔐 Zaloguj się
          </button>
          <button 
            onClick={() => window.location.href = '/register'}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            📝 Zarejestruj się
          </button>
        </div>
      </CartContainer>
    );
  }

  if (loading) {
    return (
      <CartContainer>
        <PageTitle title="Koszyk" description="Twój koszyk zakupów" />
        <LoadingSpinner>
          {isAuthenticated ? 'Ładowanie koszyka...' : 'Sprawdzanie autoryzacji...'}
        </LoadingSpinner>
      </CartContainer>
    );
  }

  if (error) {
    return (
      <CartContainer>
        <PageTitle title="Koszyk" description="Twój koszyk zakupów" />
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '1rem' }}>⚠️ Błąd: {error}</h3>
          {!isAuthenticated && (
            <div>
              <p style={{ marginBottom: '1rem', color: '#856404' }}>
                Musisz się zalogować, aby zobaczyć swój koszyk
              </p>
              <button 
                onClick={() => window.location.href = '/login'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                🔐 Zaloguj się
              </button>
            </div>
          )}
        </div>
      </CartContainer>
    );
  }

  if (!cart || !cart.sellerGroups || cart.sellerGroups.length === 0) {
    return (
      <CartContainer>
        <EmptyCart>
          <div className="empty-icon">🛒</div>
          <h2>Twój koszyk jest pusty</h2>
          <p>Dodaj produkty, aby rozpocząć zakupy</p>
          <button className="continue-shopping" onClick={() => window.history.back()}>
            Kontynuuj zakupy
          </button>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <PageTitle title="Koszyk" description="Twój koszyk zakupów" />
      <CartHeader>
        <FaShoppingCart className="cart-icon" />
        <h1>Koszyk zakupów</h1>
      </CartHeader>

      {cart.sellerGroups.map((sellerGroup, index) => (
        <SellerCard key={sellerGroup.shopId}>
          <SellerHeader>
            <div className="seller-info">
              <div className="seller-logo">
                {sellerGroup.shopLogo ? (
                  <img src={sellerGroup.shopLogo} alt={sellerGroup.shopName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <FaStore />
                )}
              </div>
              <div className="seller-details">
                <h3 className="seller-name">{sellerGroup.shopName}</h3>
                <p className="seller-location">📍 Lokalizacja sprzedawcy</p>
              </div>
            </div>
            <div className="seller-summary">
              <p className="item-count">{sellerGroup.itemCount} produktów</p>
              <p className="subtotal">{sellerGroup.subtotal.toFixed(2)} zł</p>
            </div>
          </SellerHeader>

          <SellerContent>
            <ProductGrid>
              {sellerGroup.items.map((item) => (
                <ProductCard key={item._id}>
                  <img
                    src={item.product.mainImage || item.product.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="product-info">
                    <h4 className="product-name">{item.product.name}</h4>
                    <p className="product-price">{item.price.toFixed(2)} zł</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="product-original-price">{item.originalPrice.toFixed(2)} zł</p>
                    )}
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    <FaTrash />
                    Usuń
                  </button>
                </ProductCard>
              ))}
            </ProductGrid>
          </SellerContent>

          <SellerFooter>
            <div className="shipping-info">
              <FaTruck />
              <span>
                {sellerGroup.shippingCost === 0 
                  ? 'Darmowa dostawa' 
                  : `Dostawa: ${sellerGroup.shippingCost.toFixed(2)} zł`
                }
              </span>
            </div>
            <div className="seller-total">
              <p className="total-label">Suma częściowa:</p>
              <p className="total-amount">{(sellerGroup.subtotal + sellerGroup.shippingCost).toFixed(2)} zł</p>
            </div>
          </SellerFooter>
        </SellerCard>
      ))}

      <CartSummary>
        <h2>
          <FaCreditCard />
          Podsumowanie zamówienia
        </h2>
        
        <div className="summary-grid">
          <div className="summary-item">
            <p className="summary-label">Liczba sprzedawców</p>
            <p className="summary-value">{cart.summary.sellerCount}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Łączna ilość produktów</p>
            <p className="summary-value">{cart.summary.itemCount}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Suma częściowa</p>
            <p className="summary-value">{cart.summary.subtotal.toFixed(2)} zł</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Dostawa</p>
            <p className="summary-value">{cart.summary.shipping.toFixed(2)} zł</p>
          </div>
          {cart.summary.discount > 0 && (
            <div className="summary-item">
              <p className="summary-label">Rabat</p>
              <p className="summary-value">-{cart.summary.discount.toFixed(2)} zł</p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>
            Razem: {cart.summary.total.toFixed(2)} zł
          </h3>
        </div>

        <button className="checkout-btn">
          <FaCreditCard />
          Przejdź do kasy
        </button>
      </CartSummary>
    </CartContainer>
  );
};

export default Cart; 