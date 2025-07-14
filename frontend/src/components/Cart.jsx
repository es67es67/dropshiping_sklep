import React, { useState, useEffect } from 'react';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaCreditCard, FaTruck, FaTag } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, shipping, payment, review

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Błąd pobierania koszyka:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemId, quantity })
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Błąd aktualizacji ilości:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Błąd usuwania produktu:', error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ couponCode })
      });

      if (response.ok) {
        await fetchCart();
        setCouponCode('');
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd aplikowania kuponu');
      }
    } catch (error) {
      console.error('Błąd aplikowania kuponu:', error);
    }
  };

  const updateShipping = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ method: shippingMethod })
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Błąd aktualizacji dostawy:', error);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Czy na pewno chcesz wyczyścić koszyk?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Błąd czyszczenia koszyka:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Zaloguj się</h2>
          <p className="text-gray-600 mb-4">Aby zobaczyć swój koszyk, musisz się zalogować.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Zaloguj się
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Twój koszyk jest pusty</h2>
          <p className="text-gray-600 mb-4">Dodaj produkty do koszyka, aby rozpocząć zakupy.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Kontynuuj zakupy
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = cart.coupon ? (subtotal * cart.coupon.discount) / 100 : 0;
  const shipping = shippingMethod === 'free' ? 0 : shippingMethod === 'express' ? 29.99 : 15.99;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista produktów */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Koszyk</h1>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Wyczyść koszyk
                </button>
              </div>

              {/* Produkty */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.mainImage || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.shop?.name}</p>
                      <p className="text-lg font-bold text-gray-900">{item.price.toFixed(2)} zł</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} zł</p>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kupon */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTag />
                Kupon rabatowy
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Wprowadź kod kuponu"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Zastosuj
                </button>
              </div>
              {cart.coupon && (
                <div className="mt-2 text-sm text-green-600">
                  Kupon "{cart.coupon.code}" zastosowany! Zniżka: {cart.coupon.discount}%
                </div>
              )}
            </div>

            {/* Dostawa */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTruck />
                Metoda dostawy
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'free', name: 'Darmowa dostawa', cost: 0, time: '3-5 dni' },
                  { id: 'standard', name: 'Dostawa standardowa', cost: 15.99, time: '2-3 dni' },
                  { id: 'express', name: 'Dostawa ekspresowa', cost: 29.99, time: '1 dzień' }
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.time}</div>
                    </div>
                    <div className="font-bold">
                      {method.cost === 0 ? 'Darmo' : `${method.cost.toFixed(2)} zł`}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Podsumowanie */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Podsumowanie zamówienia</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Wartość produktów:</span>
                  <span>{subtotal.toFixed(2)} zł</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Zniżka:</span>
                    <span>-{discount.toFixed(2)} zł</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Dostawa:</span>
                  <span>{shipping === 0 ? 'Darmo' : `${shipping.toFixed(2)} zł`}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Razem:</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('shipping')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                Przejdź do kasy
              </button>

              <div className="mt-4 text-sm text-gray-600">
                <p>• Bezpieczne płatności</p>
                <p>• Darmowe zwroty w ciągu 14 dni</p>
                <p>• Gwarancja jakości</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 