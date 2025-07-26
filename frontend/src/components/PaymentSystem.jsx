import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active', 'theme'].includes(prop)
})`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}20;
  }
`;

const PaymentCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const PaymentMethod = styled.div.withConfig({
  shouldForwardProp: (prop) => !['selected', 'theme'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
`;

const PaymentIcon = styled.div`
  font-size: 2rem;
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PaymentName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const PaymentDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrderSummary = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textSecondary};
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.125rem;
  color: ${props => props.theme.text};
  border-top: 2px solid ${props => props.theme.border};
  padding-top: 1rem;
  margin-top: 1rem;
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.success};
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const HistoryCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const HistoryAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const HistoryStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'completed' && `
    background: ${props.theme.success}20;
    color: ${props.theme.success};
  `}
  
  ${props => props.status === 'pending' && `
    background: ${props.theme.warning}20;
    color: ${props.theme.warning};
  `}
  
  ${props => props.status === 'failed' && `
    background: ${props.theme.error}20;
    color: ${props.theme.error};
  `}
`;

const HistoryDetails = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const HistoryDate = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.5rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount);
};

export default function PaymentSystem() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: user?.email || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz dane zamówienia z URL params lub localStorage
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('currentOrder')) || {
    items: [
      { name: 'Laptop Gaming Pro', price: 4999, quantity: 1 },
      { name: 'Dostawa', price: 29.99, quantity: 1 },
      { name: 'Ubezpieczenie', price: 99.99, quantity: 1 }
    ],
    orderId: 'ORD-' + Date.now()
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'history') {
      fetchPaymentHistory();
    }
  }, [isAuthenticated, activeTab]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/payments/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać historii płatności');
      }

      const data = await response.json();
      setPaymentHistory(data.payments || data || []);
      
    } catch (err) {
      console.error('Błąd pobierania historii płatności:', err);
      setError(err.message);
      // Fallback do mock danych
      setPaymentHistory([
        {
          _id: '1',
          amount: 5128.98,
          currency: 'PLN',
          status: 'completed',
          method: 'card',
          orderId: 'ORD-12345',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          description: 'Zamówienie #12345'
        },
        {
          _id: '2',
          amount: 299.99,
          currency: 'PLN',
          status: 'pending',
          method: 'paypal',
          orderId: 'ORD-12346',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          description: 'Zamówienie #12346'
        },
        {
          _id: '3',
          amount: 1499.99,
          currency: 'PLN',
          status: 'failed',
          method: 'blik',
          orderId: 'ORD-12347',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          description: 'Zamówienie #12347'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Karta kredytowa/debetowa',
      description: 'Visa, Mastercard, American Express',
      icon: '💳'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Szybka i bezpieczna płatność',
      icon: '🔵'
    },
    {
      id: 'blik',
      name: 'BLIK',
      description: 'Płatność przez aplikację bankową',
      icon: '📱'
    },
    {
      id: 'transfer',
      name: 'Przelew bankowy',
      description: 'Tradycyjny przelew online',
      icon: '🏦'
    }
  ];

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.23;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const paymentData = {
        amount: total,
        currency: 'PLN',
        method: selectedMethod,
        orderId: orderData.orderId,
        paymentDetails: formData,
        items: orderData.items
      };

      const response = await fetch(`${apiUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Błąd przetwarzania płatności');
      }

      const result = await response.json();
      
      // Symulacja sukcesu
      setTimeout(() => {
        setIsProcessing(false);
        alert(`Płatność została przetworzona pomyślnie! ID: ${result.paymentId || 'PAY-' + Date.now()}`);
        // Przekieruj do potwierdzenia zamówienia
        window.location.href = '/order-confirmation';
      }, 2000);
      
    } catch (err) {
      console.error('Błąd płatności:', err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Zakończona';
      case 'pending': return 'W trakcie';
      case 'failed': return 'Nieudana';
      default: return status;
    }
  };

  const getMethodIcon = (method) => {
    const icons = {
      card: '💳',
      paypal: '🔵',
      blik: '📱',
      transfer: '🏦'
    };
    return icons[method] || '💰';
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Zaloguj się</h3>
          <p>Musisz być zalogowany, aby korzystać z systemu płatności</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>System Płatności</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'payment'} 
          onClick={() => setActiveTab('payment')}
        >
          💳 Nowa płatność
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          📋 Historia płatności
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {activeTab === 'payment' && (
        <PaymentCard>
          <OrderSummary>
            <SummaryTitle>Podsumowanie zamówienia #{orderData.orderId}</SummaryTitle>
            {orderData.items.map((item, index) => (
              <SummaryItem key={index}>
                <span>{item.name} {item.quantity > 1 && `(x${item.quantity})`}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </SummaryItem>
            ))}
            <SummaryItem>
              <span>Podatek VAT (23%)</span>
              <span>{formatCurrency(tax)}</span>
            </SummaryItem>
            <SummaryTotal>
              <span>Razem</span>
              <span>{formatCurrency(total)}</span>
            </SummaryTotal>
          </OrderSummary>

          <div>
            <h3 style={{ marginBottom: '1rem', color: '#1E293B' }}>Wybierz metodę płatności</h3>
            {paymentMethods.map(method => (
              <PaymentMethod
                key={method.id}
                selected={selectedMethod === method.id}
                onClick={() => setSelectedMethod(method.id)}
              >
                <PaymentIcon>{method.icon}</PaymentIcon>
                <PaymentInfo>
                  <PaymentName>{method.name}</PaymentName>
                  <PaymentDescription>{method.description}</PaymentDescription>
                </PaymentInfo>
              </PaymentMethod>
            ))}
          </div>

          {selectedMethod === 'card' && (
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <Input
                  type="text"
                  name="cardNumber"
                  placeholder="Numer karty"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="cardholderName"
                  placeholder="Imię i nazwisko"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  required
                />
              </FormRow>
              <FormRow>
                <Input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/RR"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                />
              </FormRow>
              <Input
                type="email"
                name="email"
                placeholder="Email do potwierdzenia"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Przetwarzanie...' : `Zapłać ${formatCurrency(total)}`}
              </Button>
              <SecurityInfo>
                🔒 Płatność jest szyfrowana i bezpieczna
              </SecurityInfo>
            </Form>
          )}

          {selectedMethod === 'paypal' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔵</div>
              <h3>Przekierowanie do PayPal</h3>
              <p>Zostaniesz przekierowany do bezpiecznej strony PayPal</p>
              <Button style={{ marginTop: '1rem' }}>
                Kontynuuj z PayPal
              </Button>
            </div>
          )}

          {selectedMethod === 'blik' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3>Płatność BLIK</h3>
              <p>Otwórz aplikację bankową i wprowadź kod BLIK</p>
              <Input
                type="text"
                placeholder="Kod BLIK (6 cyfr)"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
              />
              <Button style={{ marginTop: '1rem' }}>
                Potwierdź płatność
              </Button>
            </div>
          )}

          {selectedMethod === 'transfer' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
              <h3>Przelew bankowy</h3>
              <p>Dane do przelewu:</p>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                <p><strong>Nr konta:</strong> 12 1234 5678 9012 3456 7890 1234</p>
                <p><strong>Odbiorca:</strong> Portal E-commerce Sp. z o.o.</p>
                <p><strong>Tytuł:</strong> {orderData.orderId}</p>
                <p><strong>Kwota:</strong> {formatCurrency(total)}</p>
              </div>
              <Button style={{ marginTop: '1rem' }}>
                Potwierdź przelew
              </Button>
            </div>
          )}
        </PaymentCard>
      )}

      {activeTab === 'history' && (
        <>
          {loading ? (
            <LoadingSpinner>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Ładowanie historii płatności...</p>
            </LoadingSpinner>
          ) : paymentHistory.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h3>Brak historii płatności</h3>
              <p>Nie masz jeszcze żadnych płatności</p>
            </EmptyState>
          ) : (
            <HistoryGrid>
              {paymentHistory.map(payment => (
                <HistoryCard key={payment._id || payment.id}>
                  <HistoryHeader>
                    <HistoryAmount>{formatCurrency(payment.amount)}</HistoryAmount>
                    <HistoryStatus status={payment.status}>
                      {getStatusText(payment.status)}
                    </HistoryStatus>
                  </HistoryHeader>
                  <HistoryDetails>
                    <div>Metoda: {getMethodIcon(payment.method)} {payment.method}</div>
                    <div>Zamówienie: {payment.orderId}</div>
                    <div>{payment.description}</div>
                  </HistoryDetails>
                  <HistoryDate>
                    {formatDate(payment.createdAt)}
                  </HistoryDate>
                </HistoryCard>
              ))}
            </HistoryGrid>
          )}
        </>
      )}
    </Container>
  );
} 