import React from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatValue = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled.div.withConfig({
  shouldForwardProp: (prop) => !['progress', 'theme'].includes(prop)
})`
  height: 100%;
  background: ${props => props.theme.gradient};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }
`;

const Achievement = styled.div`
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${props => props.unlocked ? `
    background: ${props.theme.primary}20;
    border: 2px solid ${props.theme.primary};
  ` : `
    background: ${props.theme.background};
    border: 2px solid ${props.theme.border};
    opacity: 0.6;
  `}
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%)'};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AchievementName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const AchievementDesc = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const BadgesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  ${props => props.earned ? `
    background: ${props.theme.primary}20;
    border: 2px solid ${props.theme.primary};
  ` : `
    background: ${props.theme.background};
    border: 2px solid ${props.theme.border};
    opacity: 0.6;
  `}
  
  &:hover {
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const BadgeIcon = styled.div`
  font-size: 2rem;
  filter: ${props => props.earned ? 'none' : 'grayscale(100%)'};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BadgeInfo = styled.div`
  flex: 1;
`;

const BadgeName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const BadgeDesc = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const BadgeDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const LevelCard = styled.div`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LevelNumber = styled.div`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const LevelTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LevelProgress = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
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
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL');
};

const getLevelTitle = (level) => {
  if (level < 5) return 'Nowicjusz';
  if (level < 10) return 'Początkujący';
  if (level < 20) return 'Doświadczony';
  if (level < 30) return 'Ekspert';
  if (level < 50) return 'Mistrz';
  return 'Legenda';
};

const getNextLevelExp = (currentLevel) => {
  return Math.floor(currentLevel * 100 * 1.5);
};

export default function GamificationPanel() {
  const { user, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    nextLevelExp: 150,
    achievements: 0,
    totalAchievements: 0,
    badges: 0,
    totalBadges: 0,
    orders: 0,
    reviews: 0,
    daysActive: 0,
    shops: 0,
    products: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGamificationData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const [statsRes, achievementsRes, badgesRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/gamification/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/gamification/achievements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/gamification/badges`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Pobieranie statystyk
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsData = await statsRes.value.json();
        setUserStats({
          ...statsData,
          nextLevelExp: getNextLevelExp(statsData.level || 1)
        });
      } else {
        // Fallback statystyki
        setUserStats({
          level: user?.level || 1,
          experience: user?.experience || 0,
          nextLevelExp: getNextLevelExp(user?.level || 1),
          achievements: 0,
          totalAchievements: 20,
          badges: 0,
          totalBadges: 25,
          orders: user?.orders?.length || 0,
          reviews: user?.reviews?.length || 0,
          daysActive: Math.floor((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
          shops: user?.shops?.length || 0,
          products: 0
        });
      }

      // Pobieranie osiągnięć
      if (achievementsRes.status === 'fulfilled' && achievementsRes.value.ok) {
        const achievementsData = await achievementsRes.value.json();
        setAchievements(achievementsData.achievements || achievementsData || []);
      } else {
        // Fallback osiągnięcia
        setAchievements([
          { _id: '1', name: 'Pierwszy zakup', desc: 'Złóż pierwsze zamówienie', icon: '🛒', unlocked: true, progress: 100 },
          { _id: '2', name: 'Recenzent', desc: 'Napisz 10 recenzji', icon: '⭐', unlocked: false, progress: 30 },
          { _id: '3', name: 'Wierny klient', desc: 'Złóż 50 zamówień', icon: '👑', unlocked: false, progress: 20 },
          { _id: '4', name: 'Eksplorator', desc: 'Odwiedź 10 różnych sklepów', icon: '🗺️', unlocked: true, progress: 100 },
          { _id: '5', name: 'Szybki', desc: 'Złóż zamówienie w ciągu 1 minuty', icon: '⚡', unlocked: true, progress: 100 },
          { _id: '6', name: 'Kolekcjoner', desc: 'Kup produkty z 5 kategorii', icon: '📦', unlocked: false, progress: 60 },
          { _id: '7', name: 'Społeczny', desc: 'Poleć portal 5 znajomym', icon: '🤝', unlocked: false, progress: 0 },
          { _id: '8', name: 'Mistrz', desc: 'Osiągnij poziom 20', icon: '🏆', unlocked: false, progress: 75 }
        ]);
      }

      // Pobieranie odznak
      if (badgesRes.status === 'fulfilled' && badgesRes.value.ok) {
        const badgesData = await badgesRes.value.json();
        setBadges(badgesData.badges || badgesData || []);
      } else {
        // Fallback odznaki
        setBadges([
          { _id: '1', name: 'Nowicjusz', desc: 'Dołącz do portalu', icon: '🌱', earned: true, earnedAt: user?.createdAt || '2024-01-15' },
          { _id: '2', name: 'Kupujący', desc: 'Złóż pierwsze zamówienie', icon: '🛍️', earned: true, earnedAt: '2024-01-20' },
          { _id: '3', name: 'Recenzent', desc: 'Napisz pierwszą recenzję', icon: '✍️', earned: false },
          { _id: '4', name: 'Wierny', desc: '30 dni aktywności', icon: '📅', earned: false },
          { _id: '5', name: 'Ekspert', desc: 'Osiągnij poziom 10', icon: '🎯', earned: false },
          { _id: '6', name: 'Mistrz', desc: 'Osiągnij poziom 20', icon: '👑', earned: false },
          { _id: '7', name: 'Legenda', desc: 'Osiągnij poziom 50', icon: '🌟', earned: false },
          { _id: '8', name: 'Filantrop', desc: 'Pomóż 100 użytkownikom', icon: '💝', earned: false }
        ]);
      }
      
    } catch (err) {
      console.error('Błąd pobierania danych gamifikacji:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>        <PageTitle title="Gamifikacja" description="System gamifikacji" />
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h3>Zaloguj się</h3>
          <p>Musisz być zalogowany, aby zobaczyć swój postęp w gamifikacji</p>
        </EmptyState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Ładowanie danych gamifikacji...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  const progress = (userStats.experience / userStats.nextLevelExp) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <Container>
      <PageTitle title="Gamifikacja" description="Panel gamifikacji i osiągnięć" />
      <Title>Panel Gamifikacji</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <LevelCard>
        <LevelNumber>{userStats.level}</LevelNumber>
        <LevelTitle>{getLevelTitle(userStats.level)}</LevelTitle>
        <LevelProgress>
          {userStats.experience} / {userStats.nextLevelExp} XP
        </LevelProgress>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </LevelCard>

      <StatsGrid>
        <StatCard>
          <StatIcon>📊</StatIcon>
          <StatValue>{userStats.orders}</StatValue>
          <StatLabel>Zamówienia</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>⭐</StatIcon>
          <StatValue>{userStats.reviews}</StatValue>
          <StatLabel>Recenzje</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>📅</StatIcon>
          <StatValue>{userStats.daysActive}</StatValue>
          <StatLabel>Dni aktywności</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>🏆</StatIcon>
          <StatValue>{unlockedAchievements}/{userStats.totalAchievements}</StatValue>
          <StatLabel>Osiągnięcia</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>🎖️</StatIcon>
          <StatValue>{earnedBadges}/{userStats.totalBadges}</StatValue>
          <StatLabel>Odznaki</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>🏪</StatIcon>
          <StatValue>{userStats.shops}</StatValue>
          <StatLabel>Sklepy</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionsGrid>
        <Section>
          <SectionTitle>🏆 Osiągnięcia</SectionTitle>
          <AchievementsGrid>
            {achievements.map(achievement => (
              <Achievement
                key={achievement._id || achievement.id}
                unlocked={achievement.unlocked}
                title={achievement.unlocked ? 'Osiągnięcie odblokowane!' : `Postęp: ${achievement.progress || 0}%`}
              >
                <AchievementIcon unlocked={achievement.unlocked}>
                  {achievement.icon}
                </AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
                <AchievementDesc>{achievement.desc}</AchievementDesc>
                {!achievement.unlocked && achievement.progress > 0 && (
                  <ProgressBar style={{ marginTop: '0.5rem' }}>
                    <ProgressFill progress={achievement.progress} />
                  </ProgressBar>
                )}
              </Achievement>
            ))}
          </AchievementsGrid>
        </Section>

        <Section>
          <SectionTitle>🎖️ Odznaki</SectionTitle>
          <BadgesList>
            {badges.map(badge => (
              <Badge
                key={badge._id || badge.id}
                earned={badge.earned}
                title={badge.earned ? 'Odznaka zdobyta!' : 'Odznaka do zdobycia'}
              >
                <BadgeIcon earned={badge.earned}>
                  {badge.icon}
                </BadgeIcon>
                <BadgeInfo>
                  <BadgeName>{badge.name}</BadgeName>
                  <BadgeDesc>{badge.desc}</BadgeDesc>
                  {badge.earned && badge.earnedAt && (
                    <BadgeDate>Zdobyta: {formatDate(badge.earnedAt)}</BadgeDate>
                  )}
                </BadgeInfo>
              </Badge>
            ))}
          </BadgesList>
        </Section>
      </SectionsGrid>
    </Container>
  );
} 