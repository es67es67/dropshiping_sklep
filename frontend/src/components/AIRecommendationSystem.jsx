import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const RecommendationContainer = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 800px;
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

const AIStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const RecommendationSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 15px 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const ProductCard = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 5px;
  font-size: 14px;
`;

const ProductPrice = styled.div`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 8px;
`;

const ConfidenceScore = styled.div`
  background: ${props => {
    const score = props.score;
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
`;

const AIInsights = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const InsightTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.5;
`;

const InsightItem = styled.li`
  margin-bottom: 5px;
`;

const PreferenceSlider = styled.div`
  margin-bottom: 15px;
`;

const SliderLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 500;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const SliderValue = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-right: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

const LearningProgress = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 5px;
`;

const AIRecommendationSystem = ({ theme }) => {
  const [preferences, setPreferences] = useState({
    price: 50,
    quality: 70,
    brand: 60,
    category: 40
  });
  const [learningProgress, setLearningProgress] = useState(75);
  const [recommendations, setRecommendations] = useState([]);
  const [isLearning, setIsLearning] = useState(false);

  const mockRecommendations = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: '4999 zł',
      rating: 4.8,
      confidence: 95,
      image: 'https://picsum.photos/200/120?random=1',
      reason: 'Podobne do produktów, które Ci się podobały'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      price: '3999 zł',
      rating: 4.6,
      confidence: 87,
      image: 'https://picsum.photos/200/120?random=2',
      reason: 'Dopasowane do Twoich preferencji cenowych'
    },
    {
      id: 3,
      name: 'MacBook Air M2',
      price: '5999 zł',
      rating: 4.9,
      confidence: 92,
      image: 'https://picsum.photos/200/120?random=3',
      reason: 'Wysoka ocena w kategorii, którą przeglądasz'
    },
    {
      id: 4,
      name: 'AirPods Pro',
      price: '999 zł',
      rating: 4.7,
      confidence: 78,
      image: 'https://picsum.photos/200/120?random=4',
      reason: 'Często kupowane z produktami w Twoim koszyku'
    }
  ];

  const mockStats = [
    { label: 'Dokładność AI', value: '94.2%' },
    { label: 'Produkty przeanalizowane', value: '2.3M' },
    { label: 'Użytkowników', value: '45.2K' },
    { label: 'Rekomendacji dziennie', value: '12.8K' }
  ];

  useEffect(() => {
    setRecommendations(mockRecommendations);
  }, []);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  const startLearning = async () => {
    setIsLearning(true);
    
    // Symulacja procesu uczenia AI
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setLearningProgress(i);
    }
    
    setIsLearning(false);
    
    // Symulacja nowych rekomendacji po uczeniu
    setTimeout(() => {
      const newRecommendations = mockRecommendations.map(rec => ({
        ...rec,
        confidence: Math.min(100, rec.confidence + Math.floor(Math.random() * 10))
      }));
      setRecommendations(newRecommendations);
    }, 1000);
  };

  const refreshRecommendations = () => {
    // Symulacja odświeżenia rekomendacji
    const shuffled = [...mockRecommendations].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 4));
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceText = (score) => {
    if (score >= 80) return 'Wysokie';
    if (score >= 60) return 'Średnie';
    return 'Niskie';
  };

  return (
    <RecommendationContainer theme={theme}>
      <Header>
        <Title theme={theme}>🧠 AI System Rekomendacji</Title>
        <Subtitle theme={theme}>
          Inteligentne rekomendacje produktów oparte na uczeniu maszynowym i Twoich preferencjach
        </Subtitle>
      </Header>

      <AIStats>
        {mockStats.map((stat, index) => (
          <StatCard key={index} theme={theme}>
            <StatNumber>{stat.value}</StatNumber>
            <StatLabel theme={theme}>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </AIStats>

      <AIInsights>
        <InsightTitle>
          🔍 AI Analiza Twoich Preferencji
        </InsightTitle>
        <InsightList>
          <InsightItem>Preferujesz produkty premium (ocena jakości: {preferences.quality}%)</InsightItem>
          <InsightItem>Jesteś wrażliwy na cenę (priorytet: {preferences.price}%)</InsightItem>
          <InsightItem>Lubisz sprawdzone marki (ważność: {preferences.brand}%)</InsightItem>
          <InsightItem>Eksplorujesz różne kategorie (otwartość: {preferences.category}%)</InsightItem>
        </InsightList>
      </AIInsights>

      <LearningProgress theme={theme}>
        <SectionTitle theme={theme}>📈 Progres Uczenia AI</SectionTitle>
        <ProgressBar>
          <ProgressFill progress={learningProgress} />
        </ProgressBar>
        <ProgressText theme={theme}>
          Model AI uczy się na podstawie Twoich interakcji: {learningProgress}% kompletne
        </ProgressText>
      </LearningProgress>

      <RecommendationSection>
        <SectionTitle theme={theme}>
          🎯 Spersonalizowane Rekomendacje
        </SectionTitle>
        <ProductGrid>
          {recommendations.map(product => (
            <ProductCard key={product.id} theme={theme}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductName theme={theme}>{product.name}</ProductName>
              <ProductPrice theme={theme}>{product.price}</ProductPrice>
              <ProductRating theme={theme}>
                ⭐ {product.rating} ({product.confidence}% pewności)
              </ProductRating>
              <ConfidenceScore score={product.confidence}>
                {getConfidenceText(product.confidence)} dopasowanie
              </ConfidenceScore>
              <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '8px' }}>
                {product.reason}
              </div>
            </ProductCard>
          ))}
        </ProductGrid>
      </RecommendationSection>

      <RecommendationSection>
        <SectionTitle theme={theme}>⚙️ Dostosuj Preferencje</SectionTitle>
        
        <PreferenceSlider>
          <SliderLabel theme={theme}>Wrażliwość na cenę</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={preferences.price}
            onChange={(e) => handlePreferenceChange('price', e.target.value)}
          />
          <SliderValue theme={theme}>{preferences.price}%</SliderValue>
        </PreferenceSlider>

        <PreferenceSlider>
          <SliderLabel theme={theme}>Priorytet jakości</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={preferences.quality}
            onChange={(e) => handlePreferenceChange('quality', e.target.value)}
          />
          <SliderValue theme={theme}>{preferences.quality}%</SliderValue>
        </PreferenceSlider>

        <PreferenceSlider>
          <SliderLabel theme={theme}>Ważność marki</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={preferences.brand}
            onChange={(e) => handlePreferenceChange('brand', e.target.value)}
          />
          <SliderValue theme={theme}>{preferences.brand}%</SliderValue>
        </PreferenceSlider>

        <PreferenceSlider>
          <SliderLabel theme={theme}>Otwartość na nowe kategorie</SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={preferences.category}
            onChange={(e) => handlePreferenceChange('category', e.target.value)}
          />
          <SliderValue theme={theme}>{preferences.category}%</SliderValue>
        </PreferenceSlider>
      </RecommendationSection>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <ActionButton 
          onClick={startLearning}
          disabled={isLearning}
        >
          {isLearning ? '🧠 Uczenie w toku...' : '🧠 Trenuj AI'}
        </ActionButton>
        
        <ActionButton 
          onClick={refreshRecommendations}
        >
          🔄 Odśwież rekomendacje
        </ActionButton>
      </div>
    </RecommendationContainer>
  );
};

export default AIRecommendationSystem; 