import React, { useState } from 'react';
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
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
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
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
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
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    justify-content: flex-start;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
    margin-left: auto;
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
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
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
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary}20;
  border-radius: 8px;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  font-size: 1.2rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    align-items: center;
  }
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default function Navbar({ theme, toggleTheme }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Nav theme={theme}>
      <Logo to="/" theme={theme}>
        🏪 Portal
      </Logo>
      
      <HamburgerButton onClick={toggleMenu} theme={theme}>
        {isMenuOpen ? '✕' : '☰'}
      </HamburgerButton>
      
      <NavLinks isOpen={isMenuOpen} theme={theme}>
        <NavLink to="/" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏠 Strona główna
        </NavLink>
        <NavLink to="/products" theme={theme} onClick={() => setIsMenuOpen(false)}>
          📦 Produkty
        </NavLink>
        <NavLink to="/shops" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏪 Sklepy
        </NavLink>
        <NavLink to="/messages" theme={theme} onClick={() => setIsMenuOpen(false)}>
          💬 Wiadomości
        </NavLink>
        <NavLink to="/gamification" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏆 Gamifikacja
        </NavLink>
        <NavLink to="/notifications" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🔔 Powiadomienia
        </NavLink>
        
        {/* Lokalizacje */}
        <NavLink to="/voivodeships" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏛️ Województwa
        </NavLink>
        <NavLink to="/counties" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏘️ Powiaty
        </NavLink>
        <NavLink to="/municipalities" theme={theme} onClick={() => setIsMenuOpen(false)}>
          🏙️ Gminy
        </NavLink>
        
        {/* Admin Panel */}
        {user?.role === 'admin' && (
          <NavLink to="/admin" theme={theme} onClick={() => setIsMenuOpen(false)}>
            ⚙️ Panel Admina
          </NavLink>
        )}
      </NavLinks>
      
      <ThemeToggle onClick={toggleTheme} theme={theme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </ThemeToggle>
      
      {!isAuthenticated ? (
        <AuthSection>
          <AuthButton to="/login" theme={theme} onClick={() => setIsMenuOpen(false)}>
            🔑 Zaloguj
          </AuthButton>
          <RegisterButton to="/register" theme={theme} onClick={() => setIsMenuOpen(false)}>
            📝 Zarejestruj
          </RegisterButton>
        </AuthSection>
      ) : (
        <UserMenu>
          <UserInfo theme={theme}>
            <UserAvatar>👤</UserAvatar>
            <UserDetails>
              <UserName>{user?.username}</UserName>
              <UserLevel theme={theme}>Poziom {user?.level || 1}</UserLevel>
            </UserDetails>
          </UserInfo>
          <LogoutButton onClick={logout} theme={theme}>
            🚪 Wyloguj
          </LogoutButton>
        </UserMenu>
      )}
    </Nav>
  );
} 