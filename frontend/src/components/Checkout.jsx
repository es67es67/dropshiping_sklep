import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaTruck, FaCheck, FaArrowLeft, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // Dane formularza
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    houseNumber: '',
    apartment: '',
    postalCode: '',
    city: '',
    country: 'Polska'
  });

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    company: '',
    nip: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Polska'
  });

  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart`, {
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

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: shippingData,
        billingAddress: billingData.sameAsShipping ? shippingData : billingData,
        paymentMethod: paymentData.method,
        notes: ''
      };

      const response = await fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const orderResult = await response.json();
        setOrder(orderResult.order);
        setStep(4);
      } else {
        const error = await response.json();
        alert(error.error || 'Błąd tworzenia zamówienia');
      }
    } catch (error) {
      console.error('Błąd tworzenia zamówienia:', error);
      alert('Wystąpił błąd podczas tworzenia zamówienia');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaLock className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Zaloguj się</h2>
          <p className="text-gray-600">Aby przejść do kasy, musisz się zalogować.</p>
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
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Koszyk jest pusty</h2>
          <p className="text-gray-600">Dodaj produkty do koszyka, aby przejść do kasy.</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = cart.coupon ? (subtotal * cart.coupon.discount) / 100 : 0;
  const shipping = 15.99; // Standardowa dostawa
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > stepNumber ? <FaCheck /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600' : ''}>Dostawa</span>
            <span className="mx-4">•</span>
            <span className={step >= 2 ? 'text-blue-600' : ''}>Płatność</span>
            <span className="mx-4">•</span>
            <span className={step >= 3 ? 'text-blue-600' : ''}>Podsumowanie</span>
            <span className="mx-4">•</span>
            <span className={step >= 4 ? 'text-blue-600' : ''}>Potwierdzenie</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formularz */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {step === 1 && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaTruck />
                    Adres dostawy
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Imię *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                      <input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ulica *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.street}
                        onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numer domu *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.houseNumber}
                        onChange={(e) => setShippingData({...shippingData, houseNumber: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numer lokalu</label>
                      <input
                        type="text"
                        value={shippingData.apartment}
                        onChange={(e) => setShippingData({...shippingData, apartment: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miasto *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaArrowLeft />
                      Wróć do koszyka
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Kontynuuj do płatności
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaCreditCard />
                    Metoda płatności
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'card', name: 'Karta kredytowa/debetowa', icon: '💳' },
                      { id: 'transfer', name: 'Przelew bankowy', icon: '🏦' },
                      { id: 'blik', name: 'BLIK', icon: '📱' },
                      { id: 'cash_on_delivery', name: 'Płatność przy odbiorze', icon: '💰' }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentData.method === method.id}
                          onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                          className="text-blue-600"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </label>
                    ))}
                  </div>

                  {paymentData.method === 'card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numer karty *</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data ważności *</label>
                          <input
                            type="text"
                            placeholder="MM/RR"
                            value={paymentData.cardExpiry}
                            onChange={(e) => setPaymentData({...paymentData, cardExpiry: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={paymentData.cardCvv}
                            onChange={(e) => setPaymentData({...paymentData, cardCvv: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaArrowLeft />
                      Wróć do dostawy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Przejdź do podsumowania
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleOrderSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Podsumowanie zamówienia</h2>
                  
                  <div className="space-y-6">
                    {/* Adres dostawy */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Adres dostawy</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{shippingData.firstName} {shippingData.lastName}</p>
                        <p>{shippingData.street} {shippingData.houseNumber}</p>
                        {shippingData.apartment && <p>Lokal: {shippingData.apartment}</p>}
                        <p>{shippingData.postalCode} {shippingData.city}</p>
                        <p>{shippingData.phone}</p>
                        <p>{shippingData.email}</p>
                      </div>
                    </div>

                    {/* Metoda płatności */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Metoda płatności</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{paymentData.method === 'card' ? 'Karta kredytowa/debetowa' : 
                            paymentData.method === 'transfer' ? 'Przelew bankowy' :
                            paymentData.method === 'blik' ? 'BLIK' : 'Płatność przy odbiorze'}</p>
                      </div>
                    </div>

                    {/* Produkty */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Produkty</h3>
                      <div className="space-y-2">
                        {cart.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-center">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaArrowLeft />
                      Wróć do płatności
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && order && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-2xl text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Zamówienie złożone!</h2>
                  <p className="text-gray-600 mb-4">
                    Dziękujemy za zakupy. Numer zamówienia: <strong>{order.orderNumber}</strong>
                  </p>
                  <p className="text-gray-600 mb-6">
                    Potwierdzenie zostało wysłane na adres email: {shippingData.email}
                  </p>
                  <button
                    onClick={() => window.location.href = '/orders'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Zobacz moje zamówienia
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Podsumowanie */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Podsumowanie</h3>
              
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
                  <span>{shipping.toFixed(2)} zł</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Razem:</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
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

export default Checkout; 