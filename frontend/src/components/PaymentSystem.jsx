import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
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

const PaymentCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
`;

const PaymentMethod = styled.div`
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

export default function PaymentSystem() {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

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
    }
  ];

  const orderItems = [
    { name: 'Laptop Gaming Pro', price: 4999 },
    { name: 'Dostawa', price: 29.99 },
    { name: 'Ubezpieczenie', price: 99.99 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
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
    
    // Symulacja procesowania płatności
    setTimeout(() => {
      setIsProcessing(false);
      alert('Płatność została przetworzona pomyślnie!');
    }, 2000);
  };

  return (
    <Container>
      <Title>Płatność</Title>
      
      <PaymentCard>
        <OrderSummary>
          <SummaryTitle>Podsumowanie zamówienia</SummaryTitle>
          {orderItems.map((item, index) => (
            <SummaryItem key={index}>
              <span>{item.name}</span>
              <span>{item.price.toFixed(2)} zł</span>
            </SummaryItem>
          ))}
          <SummaryItem>
            <span>Podatek VAT (23%)</span>
            <span>{tax.toFixed(2)} zł</span>
          </SummaryItem>
          <SummaryTotal>
            <span>Razem</span>
            <span>{total.toFixed(2)} zł</span>
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
              {isProcessing ? 'Przetwarzanie...' : `Zapłać ${total.toFixed(2)} zł`}
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
      </PaymentCard>
    </Container>
  );
} 