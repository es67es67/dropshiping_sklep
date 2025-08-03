import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';

const RecommendationsContainer = styled.div`
  margin: 32px 0;
  padding: 24px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RecommendationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
`;

const RecommendationsTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`;

const AlgorithmSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const AlgorithmButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border-radius: 20px;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? props.theme.colors.primary : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const RecommendationBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
`;

const RecommendationScore = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  z-index: 10;
`;

const ABTestInfo = styled.div`
  background: ${props => props.theme.colors.info || '#e0f2fe'};
  border: 1px solid ${props => props.theme.colors.info || '#0288d1'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const ProductRecommendations = ({ userId, productId = null, limit = 8 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('personalized');
  const [abTestVariant, setAbTestVariant] = useState(null);
  const [showABTest, setShowABTest] = useState(false);

  const algorithms = [
    { key: 'personalized', name: 'Spersonalizowane', icon: '🎯' },
    { key: 'collaborative', name: 'Współpraca', icon: '👥' },
    { key: 'content_based', name: 'Treść', icon: '📝' },
    { key: 'popular', name: 'Popularne', icon: '🔥' },
    { key: 'trending', name: 'Trendujące', icon: '📈' },
    { key: 'similar', name: 'Podobne', icon: '🔍' }
  ];

  useEffect(() => {
    loadRecommendations();
  }, [algorithm, abTestVariant]);

  const loadRecommendations = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      let endpoint = `/api/recommendations?type=${algorithm}&limit=${limit}`;
      
      if (abTestVariant) {
        endpoint += `&variant=${abTestVariant}`;
      }

      if (productId) {
        endpoint = `/api/recommendations/product/${productId}?limit=${limit}`;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        
        // Sprawdź czy to test A/B
        if (data.variant && data.variant !== 'standard') {
          setAbTestVariant(data.variant);
          setShowABTest(true);
        }
      } else {
        console.error('Błąd pobierania rekomendacji');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Błąd:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setAbTestVariant(null);
    setShowABTest(false);
  };

  const handleRecommendationClick = async (productId, recommendationType) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      await fetch(`${apiUrl}/api/recommendations/track-click`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          recommendationType: recommendationType || algorithm
        })
      });
    } catch (error) {
      console.error('Błąd śledzenia kliknięcia:', error);
    }
  };

  const getAlgorithmIcon = (type) => {
    const algo = algorithms.find(a => a.key === type);
    return algo ? algo.icon : '📦';
  };

  const getAlgorithmName = (type) => {
    const algo = algorithms.find(a => a.key === type);
    return algo ? algo.name : 'Nieznany';
  };

  const formatRecommendationScore = (score) => {
    if (!score) return null;
    return `${Math.round(score * 100)}%`;
  };

  if (!userId) {
    return null;
  }

  return (
    <RecommendationsContainer>
      <RecommendationsHeader>
        <RecommendationsTitle>
          {productId ? 'Podobne Produkty' : 'Rekomendacje dla Ciebie'}
        </RecommendationsTitle>
        
        {!productId && (
          <AlgorithmSelector>
            {algorithms.map((algo) => (
              <AlgorithmButton
                key={algo.key}
                $active={algorithm === algo.key}
                onClick={() => handleAlgorithmChange(algo.key)}
              >
                {algo.icon} {algo.name}
              </AlgorithmButton>
            ))}
          </AlgorithmSelector>
        )}
      </RecommendationsHeader>

      {showABTest && (
        <ABTestInfo>
          🧪 <strong>Test A/B Aktywny</strong> - Oglądasz wariant {abTestVariant} 
          algorytmu rekomendacji. Pomóż nam ulepszyć system!
        </ABTestInfo>
      )}

      {loading ? (
        <LoadingSpinner>
          🔍 Ładowanie rekomendacji...
        </LoadingSpinner>
      ) : recommendations.length > 0 ? (
        <ProductsGrid>
          {recommendations.map((product, index) => (
            <div key={product._id} style={{ position: 'relative' }}>
              <RecommendationBadge>
                {getAlgorithmIcon(product.recommendationType || algorithm)}
              </RecommendationBadge>
              
              {product.recommendationScore && (
                <RecommendationScore>
                  {formatRecommendationScore(product.recommendationScore)}
                </RecommendationScore>
              )}
              
              <ProductCard
                product={product}
                onClick={() => handleRecommendationClick(
                  product._id, 
                  product.recommendationType || algorithm
                )}
              />
            </div>
          ))}
        </ProductsGrid>
      ) : (
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {getAlgorithmIcon(algorithm)}
          </div>
          <h3>Brak rekomendacji</h3>
          <p>
            Nie znaleziono rekomendacji dla algorytmu "{getAlgorithmName(algorithm)}". 
            Spróbuj inny algorytm lub dokonaj pierwszego zakupu.
          </p>
        </EmptyState>
      )}
    </RecommendationsContainer>
  );
};

export default ProductRecommendations; 