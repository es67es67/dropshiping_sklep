import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  background: ${props => props.theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    color: ${props => props.theme.primary};
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    border-color: ${props => props.theme.primary};
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const AuthButton = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    color: ${props => props.theme.primary};
  }
`;

const RegisterButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary}20;
  border-radius: 8px;
  color: ${props => props.theme.text};
`;

const UserAvatar = styled.div`
  font-size: 1.2rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const UserLevel = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
`;

const LogoutButton = styled.button`
  background: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.error}dd;
    transform: translateY(-1px);
  }
`;

export default function Navbar({ theme, toggleTheme }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Nav theme={theme}>
      <Logo to="/" theme={theme}>
        🏪 Portal
      </Logo>
      
      <NavLinks>
        <NavLink to="/" theme={theme}>
          🏠 Strona główna
        </NavLink>
        <NavLink to="/products" theme={theme}>
          📦 Produkty
        </NavLink>
        <NavLink to="/shops" theme={theme}>
          🏪 Sklepy
        </NavLink>
        <NavLink to="/messages" theme={theme}>
          💬 Wiadomości
        </NavLink>
        <NavLink to="/gamification" theme={theme}>
          🏆 Gamifikacja
        </NavLink>
        <NavLink to="/notifications" theme={theme}>
          🔔 Powiadomienia
        </NavLink>
        
        {/* Lokalizacje */}
        <NavLink to="/voivodeships" theme={theme}>
          🏛️ Województwa
        </NavLink>
        <NavLink to="/location-analytics" theme={theme}>
          📊 Analityka
        </NavLink>
        <NavLink to="/location-import" theme={theme}>
          📥 Import
        </NavLink>
        <NavLink to="/location-export" theme={theme}>
          📤 Eksport
        </NavLink>
        <NavLink to="/admin-panel" theme={theme}>
          🛠️ Admin
        </NavLink>
      </NavLinks>
      
      {isAuthenticated ? (
        <UserMenu>
          <UserInfo theme={theme}>
            <UserAvatar>{user?.avatar || '👤'}</UserAvatar>
            <UserDetails>
              <UserName>{user?.name || user?.firstName || 'Użytkownik'}</UserName>
              <UserLevel theme={theme}>Poziom {user?.level || 1}</UserLevel>
            </UserDetails>
          </UserInfo>
          <NavLink to="/profile" theme={theme}>
            👤 Profil
          </NavLink>
          <LogoutButton onClick={logout} theme={theme}>
            🚪 Wyloguj
          </LogoutButton>
          <ThemeToggle onClick={toggleTheme} theme={theme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </ThemeToggle>
        </UserMenu>
      ) : (
        <AuthSection>
          <AuthButton to="/login" theme={theme}>
            🔑 Zaloguj się
          </AuthButton>
          <RegisterButton to="/register" theme={theme}>
            ✨ Zarejestruj się
          </RegisterButton>
          <ThemeToggle onClick={toggleTheme} theme={theme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </ThemeToggle>
        </AuthSection>
      )}
    </Nav>
  );
} 