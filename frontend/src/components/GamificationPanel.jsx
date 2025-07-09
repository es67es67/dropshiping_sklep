import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
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
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled.div`
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
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
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
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%)'};
`;

const AchievementName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const AchievementDesc = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
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
`;

const BadgeIcon = styled.div`
  font-size: 2rem;
  filter: ${props => props.earned ? 'none' : 'grayscale(100%)'};
`;

const BadgeInfo = styled.div`
  flex: 1;
`;

const BadgeName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const BadgeDesc = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const BadgeDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const LevelCard = styled.div`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
`;

const LevelNumber = styled.div`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const LevelTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LevelProgress = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

export default function GamificationPanel() {
  const [userStats, setUserStats] = useState({
    level: 15,
    experience: 1250,
    nextLevelExp: 2000,
    achievements: 8,
    totalAchievements: 20,
    badges: 12,
    totalBadges: 25,
    orders: 47,
    reviews: 23,
    daysActive: 89
  });

  const achievements = [
    { id: 1, name: 'Pierwszy zakup', desc: 'Złóż pierwsze zamówienie', icon: '🛒', unlocked: true },
    { id: 2, name: 'Recenzent', desc: 'Napisz 10 recenzji', icon: '⭐', unlocked: true },
    { id: 3, name: 'Wierny klient', desc: 'Złóż 50 zamówień', icon: '👑', unlocked: false },
    { id: 4, name: 'Eksplorator', desc: 'Odwiedź 10 różnych sklepów', icon: '🗺️', unlocked: true },
    { id: 5, name: 'Szybki', desc: 'Złóż zamówienie w ciągu 1 minuty', icon: '⚡', unlocked: true },
    { id: 6, name: 'Kolekcjoner', desc: 'Kup produkty z 5 kategorii', icon: '📦', unlocked: false },
    { id: 7, name: 'Społeczny', desc: 'Poleć portal 5 znajomym', icon: '🤝', unlocked: true },
    { id: 8, name: 'Mistrz', desc: 'Osiągnij poziom 20', icon: '🏆', unlocked: false }
  ];

  const badges = [
    { id: 1, name: 'Nowicjusz', desc: 'Dołącz do portalu', icon: '🌱', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Kupujący', desc: 'Złóż pierwsze zamówienie', icon: '🛍️', earned: true, date: '2024-01-20' },
    { id: 3, name: 'Recenzent', desc: 'Napisz pierwszą recenzję', icon: '✍️', earned: true, date: '2024-02-01' },
    { id: 4, name: 'Wierny', desc: '30 dni aktywności', icon: '📅', earned: true, date: '2024-02-15' },
    { id: 5, name: 'Ekspert', desc: 'Osiągnij poziom 10', icon: '🎯', earned: true, date: '2024-03-01' },
    { id: 6, name: 'Mistrz', desc: 'Osiągnij poziom 20', icon: '👑', earned: false },
    { id: 7, name: 'Legenda', desc: 'Osiągnij poziom 50', icon: '🌟', earned: false },
    { id: 8, name: 'Filantrop', desc: 'Pomóż 100 użytkownikom', icon: '💝', earned: false }
  ];

  const progress = (userStats.experience / userStats.nextLevelExp) * 100;

  return (
    <Container>
      <Title>Panel Gamifikacji</Title>
      
      <LevelCard>
        <LevelNumber>{userStats.level}</LevelNumber>
        <LevelTitle>Poziom {userStats.level}</LevelTitle>
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
          <StatValue>{userStats.achievements}/{userStats.totalAchievements}</StatValue>
          <StatLabel>Osiągnięcia</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionsGrid>
        <Section>
          <SectionTitle>🏆 Osiągnięcia</SectionTitle>
          <AchievementsGrid>
            {achievements.map(achievement => (
              <Achievement
                key={achievement.id}
                unlocked={achievement.unlocked}
                title={achievement.unlocked ? 'Osiągnięcie odblokowane!' : 'Osiągnięcie zablokowane'}
              >
                <AchievementIcon unlocked={achievement.unlocked}>
                  {achievement.icon}
                </AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
                <AchievementDesc>{achievement.desc}</AchievementDesc>
              </Achievement>
            ))}
          </AchievementsGrid>
        </Section>

        <Section>
          <SectionTitle>🎖️ Odznaki</SectionTitle>
          <BadgesList>
            {badges.map(badge => (
              <Badge
                key={badge.id}
                earned={badge.earned}
                title={badge.earned ? 'Odznaka zdobyta!' : 'Odznaka do zdobycia'}
              >
                <BadgeIcon earned={badge.earned}>
                  {badge.icon}
                </BadgeIcon>
                <BadgeInfo>
                  <BadgeName>{badge.name}</BadgeName>
                  <BadgeDesc>{badge.desc}</BadgeDesc>
                  {badge.earned && <BadgeDate>Zdobyta: {badge.date}</BadgeDate>}
                </BadgeInfo>
              </Badge>
            ))}
          </BadgesList>
        </Section>
      </SectionsGrid>
    </Container>
  );
} 