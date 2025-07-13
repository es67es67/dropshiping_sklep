import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoyaltyContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoyaltyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
`;

const LoyaltyTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`;

const PointsDisplay = styled.div`
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const PointsNumber = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PointsLabel = styled.div`
  font-size: 16px;
  opacity: 0.9;
`;

const LevelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const LevelBadge = styled.div`
  background: ${props => {
    switch (props.level) {
      case 'diamond': return 'linear-gradient(135deg, #b8e6b8 0%, #7dd3fc 100%)';
      case 'platinum': return 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
      case 'gold': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      case 'silver': return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
      default: return 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)';
    }
  }};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin: 20px 0;
`;

const BadgeCard = styled.div`
  text-align: center;
  padding: 16px;
  border: 2px solid ${props => props.earned ? props.theme.colors.success : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.earned ? 'rgba(34, 197, 94, 0.1)' : props.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const BadgeIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const BadgeName = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const BadgeDescription = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.textSecondary};
`;

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
`;

const RewardCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RewardName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const RewardDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 12px;
`;

const RewardButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: ${props => props.available ? props.theme.colors.primary : '#e5e7eb'};
  color: ${props => props.available ? 'white' : '#9ca3af'};
  border: none;
  border-radius: 6px;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.available ? props.theme.colors.secondary : '#e5e7eb'};
  }
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryInfo = styled.div`
  flex: 1;
`;

const HistoryReason = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const HistoryDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const HistoryPoints = styled.div`
  font-weight: 600;
  color: ${props => props.points > 0 ? props.theme.colors.success : props.theme.colors.error};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const LoyaltySystem = ({ userId }) => {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      loadLoyaltyData();
    }
  }, [userId]);

  const loadLoyaltyData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const [loyaltyRes, rewardsRes, historyRes] = await Promise.all([
        fetch(`${apiUrl}/api/loyalty`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/loyalty/rewards`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/loyalty/history?limit=20`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (loyaltyRes.ok) {
        const loyaltyData = await loyaltyRes.json();
        setLoyalty(loyaltyData.loyalty);
      }

      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData.rewards);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData.history);
      }
    } catch (error) {
      console.error('Błąd ładowania danych lojalności:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/loyalty/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rewardId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Nagroda została wykupiona: ${data.reward.type}`);
        loadLoyaltyData(); // Odśwież dane
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error}`);
      }
    } catch (error) {
      console.error('Błąd wykupywania nagrody:', error);
      alert('Błąd wykupywania nagrody');
    }
  };

  const checkBadges = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/loyalty/check-badges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.newBadges.length > 0) {
          alert(`Otrzymano ${data.newBadges.length} nową odznakę!`);
          loadLoyaltyData();
        }
      }
    } catch (error) {
      console.error('Błąd sprawdzania odznak:', error);
    }
  };

  if (loading) {
    return (
      <LoyaltyContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Ładowanie systemu lojalnościowego...
        </div>
      </LoyaltyContainer>
    );
  }

  if (!loyalty) {
    return (
      <LoyaltyContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>System Lojalnościowy</h3>
          <p>Zaloguj się, aby zobaczyć swoje punkty i odznaki.</p>
        </div>
      </LoyaltyContainer>
    );
  }

  const progress = loyalty.nextLevel ? 
    ((loyalty.points - loyalty.levelInfo.minPoints) / (loyalty.nextLevel.pointsNeeded + loyalty.points - loyalty.levelInfo.minPoints)) * 100 : 100;

  return (
    <LoyaltyContainer>
      <LoyaltyHeader>
        <LoyaltyTitle>System Lojalnościowy</LoyaltyTitle>
        <button onClick={checkBadges} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Sprawdź Odznaki
        </button>
      </LoyaltyHeader>

      <PointsDisplay>
        <PointsNumber>{loyalty.points.toLocaleString()}</PointsNumber>
        <PointsLabel>Punkty Lojalnościowe</PointsLabel>
      </PointsDisplay>

      <LevelInfo>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            Poziom: {loyalty.levelInfo.name}
          </div>
          {loyalty.nextLevel && (
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Następny poziom: {loyalty.nextLevel.name} ({loyalty.nextLevel.pointsNeeded} punktów)
            </div>
          )}
        </div>
        <LevelBadge level={loyalty.level}>
          {loyalty.levelInfo.name}
        </LevelBadge>
      </LevelInfo>

      {loyalty.nextLevel && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}

      <TabContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Przegląd
        </Tab>
        <Tab 
          active={activeTab === 'badges'} 
          onClick={() => setActiveTab('badges')}
        >
          Odznaki ({loyalty.badges.length})
        </Tab>
        <Tab 
          active={activeTab === 'rewards'} 
          onClick={() => setActiveTab('rewards')}
        >
          Nagrody
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Historia
        </Tab>
      </TabContainer>

      {activeTab === 'overview' && (
        <div>
          <h3>Korzyści poziomu {loyalty.levelInfo.name}</h3>
          <ul>
            {loyalty.levelInfo.benefits.map((benefit, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>✓ {benefit}</li>
            ))}
          </ul>
          
          {loyalty.nextLevel && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
              <h4>Następny poziom: {loyalty.nextLevel.name}</h4>
              <p>Potrzebujesz jeszcze {loyalty.nextLevel.pointsNeeded} punktów</p>
              <ul>
                {loyalty.nextLevel.benefits.map((benefit, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>🎁 {benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <BadgesGrid>
          {loyalty.badges.map((badge) => (
            <BadgeCard key={badge.id} earned={true}>
              <BadgeIcon>{badge.icon}</BadgeIcon>
              <BadgeName>{badge.name}</BadgeName>
              <BadgeDescription>{badge.description}</BadgeDescription>
            </BadgeCard>
          ))}
        </BadgesGrid>
      )}

      {activeTab === 'rewards' && (
        <RewardsGrid>
          {rewards.map((reward) => (
            <RewardCard key={reward.id}>
              <RewardName>{reward.name}</RewardName>
              <RewardDescription>{reward.description}</RewardDescription>
              <RewardButton
                available={reward.available}
                onClick={() => reward.available && redeemReward(reward.id)}
              >
                {reward.pointsCost > 0 ? `Wykup za ${reward.pointsCost} pkt` : 'Wykup'}
              </RewardButton>
            </RewardCard>
          ))}
        </RewardsGrid>
      )}

      {activeTab === 'history' && (
        <HistoryList>
          {history.map((item, index) => (
            <HistoryItem key={index}>
              <HistoryInfo>
                <HistoryReason>{item.reason}</HistoryReason>
                <HistoryDate>
                  {new Date(item.date).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </HistoryDate>
              </HistoryInfo>
              <HistoryPoints points={item.points}>
                {item.points > 0 ? `+${item.points}` : item.points}
              </HistoryPoints>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </LoyaltyContainer>
  );
};

export default LoyaltySystem; 