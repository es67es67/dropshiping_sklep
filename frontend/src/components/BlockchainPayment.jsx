import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const BlockchainContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  font-size: 24px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 14px;
`;

const CryptoSelector = styled.div`
  margin-bottom: 20px;
`;

const CryptoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CryptoOption = styled.div`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.theme.background};
  color: ${props => props.selected ? 'white' : props.theme.text};
  border: 2px solid ${props => props.selected ? '#667eea' : props.theme.border};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const CryptoIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const CryptoName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const CryptoPrice = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const PaymentForm = styled.div`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const AmountDisplay = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
`;

const AmountLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 5px;
`;

const AmountValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

const CryptoAmount = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-top: 5px;
`;

const SmartContractInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ContractTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContractDetails = styled.div`
  font-size: 12px;
  line-height: 1.4;
`;

const ContractAddress = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 11px;
  word-break: break-all;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 15px;
  background: ${props => props.disabled ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'confirmed': return '#d4edda';
      case 'failed': return '#f8d7da';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'confirmed': return '#155724';
      case 'failed': return '#721c24';
      default: return props.theme.text;
    }
  }};
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const TransactionHistory = styled.div`
  margin-top: 20px;
`;

const HistoryTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 10px 0;
  font-size: 16px;
`;

const TransactionItem = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionHash = styled.div`
  font-family: monospace;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const TransactionStatus = styled.div`
  font-size: 12px;
  color: ${props => props.status === 'confirmed' ? '#28a745' : props.status === 'pending' ? '#ffc107' : '#dc3545'};
`;

const BlockchainPayment = ({ theme, amount = 100, onPaymentComplete }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [walletAddress, setWalletAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const cryptocurrencies = [
    { symbol: 'ETH', name: 'Ethereum', price: 2500, icon: 'Ξ' },
    { symbol: 'BTC', name: 'Bitcoin', price: 45000, icon: '₿' },
    { symbol: 'USDT', name: 'Tether', price: 1, icon: '₮' },
    { symbol: 'USDC', name: 'USD Coin', price: 1, icon: '💲' },
    { symbol: 'BNB', name: 'Binance Coin', price: 300, icon: '🟡' },
    { symbol: 'ADA', name: 'Cardano', price: 0.5, icon: '₳' }
  ];

  const selectedCryptoData = cryptocurrencies.find(crypto => crypto.symbol === selectedCrypto);
  const cryptoAmount = amount / selectedCryptoData.price;

  const smartContractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  const handlePayment = async () => {
    if (!walletAddress.trim()) {
      alert('Proszę wprowadzić adres portfela');
      return;
    }

    setPaymentStatus('pending');
    setProgress(0);

    // Symulacja procesu płatności blockchain
    const steps = [
      { progress: 20, message: 'Inicjalizacja transakcji...' },
      { progress: 40, message: 'Podpisywanie smart kontraktu...' },
      { progress: 60, message: 'Wysyłanie do sieci blockchain...' },
      { progress: 80, message: 'Oczekiwanie na potwierdzenie...' },
      { progress: 100, message: 'Transakcja potwierdzona!' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(steps[i].progress);
    }

    // Symulacja potwierdzenia transakcji
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('confirmed');

    // Dodaj transakcję do historii
    const newTransaction = {
      id: Date.now(),
      hash: `0x${Math.random().toString(36).substr(2, 64)}`,
      amount: cryptoAmount.toFixed(6),
      crypto: selectedCrypto,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    if (onPaymentComplete) {
      onPaymentComplete(newTransaction);
    }
  };

  const connectWallet = () => {
    // Symulacja połączenia z portfelem
    const mockAddress = `0x${Math.random().toString(36).substr(2, 40)}`;
    setWalletAddress(mockAddress);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(smartContractAddress);
    alert('Adres smart kontraktu skopiowany!');
  };

  return (
    <BlockchainContainer theme={theme}>
      <Header>
        <Title>💎 Płatność Blockchain</Title>
        <Subtitle>Bezpieczne płatności kryptowalutami z smart kontraktami</Subtitle>
      </Header>

      <CryptoSelector>
        <Label theme={theme}>Wybierz kryptowalutę:</Label>
        <CryptoGrid>
          {cryptocurrencies.map(crypto => (
            <CryptoOption
              key={crypto.symbol}
              selected={selectedCrypto === crypto.symbol}
              theme={theme}
              onClick={() => setSelectedCrypto(crypto.symbol)}
            >
              <CryptoIcon>{crypto.icon}</CryptoIcon>
              <CryptoName>{crypto.name}</CryptoName>
              <CryptoPrice>${crypto.price.toLocaleString()}</CryptoPrice>
            </CryptoOption>
          ))}
        </CryptoGrid>
      </CryptoSelector>

      <AmountDisplay theme={theme}>
        <AmountLabel>Kwota do zapłaty:</AmountLabel>
        <AmountValue theme={theme}>{amount} PLN</AmountValue>
        <CryptoAmount theme={theme}>
          ≈ {cryptoAmount.toFixed(6)} {selectedCrypto}
        </CryptoAmount>
      </AmountDisplay>

      <SmartContractInfo>
        <ContractTitle>
          🔗 Smart Kontrakt
        </ContractTitle>
        <ContractDetails>
          Ten produkt jest zabezpieczony inteligentnym kontraktem Ethereum, który automatycznie:
          <br />• Weryfikuje płatność
          <br />• Zwalnia produkt po potwierdzeniu
          <br />• Zapewnia zwrot w przypadku problemów
        </ContractDetails>
        <ContractAddress>
          {smartContractAddress}
          <button 
            onClick={copyAddress}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            📋
          </button>
        </ContractAddress>
      </SmartContractInfo>

      <PaymentForm>
        <FormGroup>
          <Label theme={theme}>Adres portfela:</Label>
          <Input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            theme={theme}
          />
        </FormGroup>
        
        {!walletAddress && (
          <ActionButton onClick={connectWallet}>
            🔗 Połącz Portfel
          </ActionButton>
        )}
        
        {walletAddress && (
          <ActionButton 
            onClick={handlePayment}
            disabled={paymentStatus === 'pending'}
          >
            {paymentStatus === 'pending' ? '⏳ Przetwarzanie...' : '💳 Zapłać Kryptowalutą'}
          </ActionButton>
        )}
      </PaymentForm>

      {paymentStatus !== 'idle' && (
        <StatusIndicator status={paymentStatus} theme={theme}>
          {paymentStatus === 'pending' && '⏳ Przetwarzanie transakcji...'}
          {paymentStatus === 'confirmed' && '✅ Transakcja potwierdzona!'}
          {paymentStatus === 'failed' && '❌ Błąd transakcji'}
        </StatusIndicator>
      )}

      {paymentStatus === 'pending' && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}

      {transactions.length > 0 && (
        <TransactionHistory>
          <HistoryTitle theme={theme}>Historia transakcji:</HistoryTitle>
          {transactions.map(tx => (
            <TransactionItem key={tx.id} theme={theme}>
              <TransactionInfo>
                <TransactionHash theme={theme}>
                  {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                </TransactionHash>
                <TransactionAmount theme={theme}>
                  {tx.amount} {tx.crypto}
                </TransactionAmount>
              </TransactionInfo>
              <TransactionStatus status={tx.status}>
                {tx.status === 'confirmed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
              </TransactionStatus>
            </TransactionItem>
          ))}
        </TransactionHistory>
      )}
    </BlockchainContainer>
  );
};

export default BlockchainPayment; 