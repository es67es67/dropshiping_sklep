import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AssistantContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ChatWindow = styled.div`
  width: 350px;
  height: 500px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${props => props.isOpen ? 1 : 0};
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const ChatToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  ` : `
    background: ${props.theme.background};
    color: ${props.theme.text};
    border: 1px solid ${props.theme.border};
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  `}
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  font-size: 14px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FloatingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: ${props => props.isOpen ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const QuickActionButton = styled.button`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 15px;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.textSecondary};
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const ProductSuggestion = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.text};
`;

const ProductPrice = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const AIProductAssistant = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);

  const quickActions = [
    "Pomóż mi znaleźć laptop",
    "Najlepsze smartfony",
    "Promocje dzisiaj",
    "Porównaj produkty",
    "Rekomendacje"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Cześć! Jestem Twoim AI asystentem produktowym. Pomogę Ci znaleźć idealne produkty! 🛍️\n\nMożesz zapytać mnie o:\n• Rekomendacje produktów\n• Porównania cen\n• Najlepsze oferty\n• Specyfikacje techniczne\n• Opinie użytkowników");
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text, suggestions = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isUser: false,
      suggestions
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isUser: true
    }]);
  };

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Symulacja opóźnienia AI
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    setIsTyping(false);
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Proste reguły AI (w rzeczywistości byłoby to bardziej zaawansowane)
    if (lowerMessage.includes('laptop') || lowerMessage.includes('komputer')) {
      addBotMessage("Świetnie! Pomogę Ci znaleźć idealny laptop. 🖥️\n\nOto kilka pytań, które pomogą mi lepiej Ci doradzić:\n• Jaki jest Twój budżet?\n• Do czego głównie będziesz używać laptopa?\n• Preferujesz markę?\n• Ważny jest dla Ciebie czas pracy na baterii?", [
        { name: "Laptop gamingowy", price: "od 3000 zł" },
        { name: "Laptop biznesowy", price: "od 2500 zł" },
        { name: "Laptop studencki", price: "od 1500 zł" }
      ]);
    } else if (lowerMessage.includes('smartfon') || lowerMessage.includes('telefon')) {
      addBotMessage("Pomogę Ci wybrać idealny smartfon! 📱\n\nOto moje rekomendacje w różnych kategoriach:", [
        { name: "iPhone 15 Pro", price: "od 4999 zł" },
        { name: "Samsung Galaxy S24", price: "od 3999 zł" },
        { name: "Xiaomi Redmi Note 13", price: "od 999 zł" }
      ]);
    } else if (lowerMessage.includes('promocj') || lowerMessage.includes('oferta')) {
      addBotMessage("Sprawdzam najlepsze promocje! 🔥\n\nOto dzisiejsze hity:", [
        { name: "Słuchawki Sony WH-1000XM5", price: "1299 zł (-300 zł)" },
        { name: "Tablet iPad Air", price: "2499 zł (-500 zł)" },
        { name: "Kamera GoPro Hero 11", price: "1899 zł (-400 zł)" }
      ]);
    } else if (lowerMessage.includes('budżet') || lowerMessage.includes('tani')) {
      addBotMessage("Rozumiem, szukasz produktów w dobrej cenie! 💰\n\nOto moje rekomendacje budżetowe:", [
        { name: "Laptop Lenovo IdeaPad", price: "1499 zł" },
        { name: "Smartfon Samsung Galaxy A15", price: "699 zł" },
        { name: "Tablet Amazon Fire HD", price: "399 zł" }
      ]);
    } else {
      addBotMessage("Dziękuję za wiadomość! 🤖\n\nJestem tu, aby pomóc Ci znaleźć idealne produkty. Możesz zapytać mnie o konkretne kategorie, porównania cen lub rekomendacje na podstawie Twoich potrzeb.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    addUserMessage(message);
    setInputValue('');
    
    await simulateAIResponse(message);
  };

  const handleQuickAction = (action) => {
    addUserMessage(action);
    simulateAIResponse(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleProductClick = (product) => {
    addBotMessage(`Świetny wybór! ${product.name} to naprawdę dobry produkt w cenie ${product.price}. 🎉\n\nChcesz, żebym pokazał Ci więcej szczegółów lub podobne produkty?`);
  };

  return (
    <AssistantContainer>
      <ChatWindow isOpen={isOpen} theme={theme}>
        <ChatHeader onClick={() => setIsOpen(false)}>
          <ChatTitle>🤖 AI Asystent Produktowy</ChatTitle>
          <ChatToggle>×</ChatToggle>
        </ChatHeader>
        
        <MessagesContainer>
          {messages.map((message) => (
            <div key={message.id}>
              <Message isUser={message.isUser} theme={theme}>
                {message.text}
              </Message>
              
              {message.suggestions && (
                <div>
                  {message.suggestions.map((product, index) => (
                    <ProductSuggestion 
                      key={index} 
                      theme={theme}
                      onClick={() => handleProductClick(product)}
                    >
                      <ProductInfo>
                        <ProductImage 
                          src={`https://picsum.photos/50/50?random=${index}`} 
                          alt={product.name}
                        />
                        <ProductDetails>
                          <ProductName theme={theme}>{product.name}</ProductName>
                          <ProductPrice theme={theme}>{product.price}</ProductPrice>
                        </ProductDetails>
                      </ProductInfo>
                    </ProductSuggestion>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <TypingIndicator theme={theme}>
              <span>AI pisze</span>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer theme={theme}>
          <MessageInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            theme={theme}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            ➤
          </SendButton>
        </InputContainer>
        
        {messages.length === 1 && (
          <div style={{ padding: '0 15px 15px' }}>
            <QuickActions>
              {quickActions.map((action, index) => (
                <QuickActionButton 
                  key={index} 
                  theme={theme}
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </QuickActionButton>
              ))}
            </QuickActions>
          </div>
        )}
      </ChatWindow>
      
      <FloatingButton 
        isOpen={isOpen}
        onClick={() => setIsOpen(true)}
      >
        🤖
      </FloatingButton>
    </AssistantContainer>
  );
};

export default AIProductAssistant; 