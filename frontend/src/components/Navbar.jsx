import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaBell, FaComments, FaShoppingCart, FaChevronDown } from 'react-icons/fa';

const Nav = styled.nav`
  background: ${props => {
    if (props.layout === 'classic') {
      return props.theme.surface;
    }
    return props.theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  }};
  backdrop-filter: ${props => props.layout === 'classic' ? 'none' : 'blur(20px)'};
  padding: ${props => props.layout === 'compact' ? '0.5rem 1rem' : '1rem 2rem'};
  display: ${props => props.layout === 'classic' ? 'flex' : 'flex'};
  flex-direction: ${props => props.layout === 'classic' ? 'column' : 'row'};
  align-items: ${props => props.layout === 'classic' ? 'stretch' : 'center'};
  gap: ${props => props.layout === 'compact' ? '0.5rem' : '1.5rem'};
  box-shadow: ${props => props.layout === 'classic' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  position: ${props => props.layout === 'classic' ? 'static' : 'sticky'};
  top: 0;
  z-index: 1000;
  border-bottom: ${props => props.layout === 'classic' ? 'none' : `1px solid ${props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`};
  height: ${props => props.layout === 'classic' ? '100vh' : 'auto'};
  width: ${props => props.layout === 'classic' ? '250px' : 'auto'};
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    flex-direction: row;
    height: auto;
    width: auto;
    position: sticky;
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

const NavLinks = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'theme', 'layout'].includes(prop)
})`
  display: flex;
  align-items: ${props => props.layout === 'classic' ? 'stretch' : 'center'};
  flex-direction: ${props => props.layout === 'classic' ? 'column' : 'row'};
  gap: ${props => props.layout === 'compact' ? '0.5rem' : '1rem'};
  margin-left: ${props => props.layout === 'classic' ? '0' : '2rem'};
  flex: ${props => props.layout === 'classic' ? '1' : 'none'};
  
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
    margin-left: 0;
    flex: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: ${props => props.layout === 'compact' ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border-radius: ${props => props.layout === 'compact' ? '4px' : '8px'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: ${props => props.layout === 'classic' ? '100%' : 'auto'};
  justify-content: ${props => props.layout === 'classic' ? 'flex-start' : 'center'};
  
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
  position: relative;
  
  @media (max-width: 768px) {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const UserDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'theme'].includes(prop)
})`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    border-bottom: none;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.border};
  margin: 0.5rem 0;
  
  @media (max-width: 768px) {
    display: none;
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

const DropdownArrow = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'theme'].includes(prop)
})`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  @media (max-width: 768px) {
    display: none;
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

export default function Navbar({ theme, toggleTheme, layout = 'modern' }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com'}/api/notifications?limit=5`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => n.status === 'unread').length);
      }
    } catch (error) {
      console.error('Błąd pobierania powiadomień:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeUserDropdown();
  };

  // Zamykanie dropdown menu po kliknięciu poza nim i klawiszu Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isUserDropdownOpen]);

  return (
    <Nav theme={theme} layout={layout}>
      <Logo to="/" theme={theme}>
        🏪 Portal
      </Logo>
      
      <HamburgerButton onClick={toggleMenu} theme={theme}>
        {isMenuOpen ? '✕' : '☰'}
      </HamburgerButton>
      
              <NavLinks isOpen={isMenuOpen} theme={theme} layout={layout}>
        <NavLink to="/" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏠 Strona główna
        </NavLink>
        <NavLink to="/products" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          📦 Produkty
        </NavLink>
        <NavLink to="/shops" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏪 Sklepy
        </NavLink>
        <NavLink to="/messages" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          💬 Wiadomości
        </NavLink>
        <NavLink to="/gamification" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏆 Gamifikacja
        </NavLink>
        <NavLink to="/notifications" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🔔 Powiadomienia
        </NavLink>
        <NavLink to="/company-profiles" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏢 Firmy
        </NavLink>
        
        {/* Zarządzanie sklepami - tylko dla właścicieli */}
        {user?.shops && user.shops.length > 0 && (
          <>
            <NavLink to="/shop-management" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
              🏪 Zarządzaj sklepami
            </NavLink>
            <NavLink to="/product-management" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
              📦 Zarządzaj produktami
            </NavLink>
          </>
        )}
        
        {/* Lokalizacje */}
        <NavLink to="/voivodeships" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏛️ Województwa
        </NavLink>
        <NavLink to="/counties" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏘️ Powiaty
        </NavLink>
        <NavLink to="/municipalities" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
          🏙️ Gminy
        </NavLink>
        
        {/* Admin Panel */}
        {user?.roles && user.roles.includes('admin') && (
          <NavLink to="/admin-panel" theme={theme} layout={layout} onClick={() => setIsMenuOpen(false)}>
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
        <UserMenu ref={userMenuRef}>
          <UserInfo theme={theme} onClick={toggleUserDropdown} style={{ cursor: 'pointer' }}>
            <UserAvatar>👤</UserAvatar>
            <UserDetails>
              <UserName>{user?.username}</UserName>
              <UserLevel theme={theme}>Poziom {user?.level || 1}</UserLevel>
            </UserDetails>
            <DropdownArrow theme={theme} isOpen={isUserDropdownOpen}>▼</DropdownArrow>
          </UserInfo>
          
          <UserDropdown theme={theme} isOpen={isUserDropdownOpen}>
            <DropdownItem onClick={() => { 
              window.location.href = '/profile'; 
              closeUserDropdown(); 
              setIsMenuOpen(false);
            }}>
              👤 Mój profil
            </DropdownItem>
            
            {user?.shops && user.shops.length > 0 && (
              <>
                <DropdownItem onClick={() => { 
                  window.location.href = '/shop-management'; 
                  closeUserDropdown(); 
                  setIsMenuOpen(false);
                }}>
                  🏪 Moje sklepy ({user.shops.length})
                </DropdownItem>
                <DropdownItem onClick={() => { 
                  window.location.href = '/my-products'; 
                  closeUserDropdown(); 
                  setIsMenuOpen(false);
                }}>
                  📦 Moje produkty
                </DropdownItem>
              </>
            )}
            
            <DropdownItem onClick={() => { 
              window.location.href = '/local-products'; 
              closeUserDropdown(); 
              setIsMenuOpen(false);
            }}>
              🏘️ Produkty lokalne
            </DropdownItem>
            
            <DropdownItem onClick={() => { 
              window.location.href = '/friends'; 
              closeUserDropdown(); 
              setIsMenuOpen(false);
            }}>
              👥 Znajomi
            </DropdownItem>
            
            <DropdownItem onClick={() => { 
              window.location.href = '/settings'; 
              closeUserDropdown(); 
              setIsMenuOpen(false);
            }}>
              ⚙️ Ustawienia
            </DropdownItem>
            
            <DropdownItem onClick={() => { 
              window.location.href = '/layout-customization'; 
              closeUserDropdown(); 
              setIsMenuOpen(false);
            }}>
              🎨 Dostosuj wygląd
            </DropdownItem>
            
            {user?.roles && user.roles.includes('admin') && (
              <>
                <DropdownDivider theme={theme} />
                <DropdownItem onClick={() => { 
                  window.location.href = '/admin-panel'; 
                  closeUserDropdown(); 
                  setIsMenuOpen(false);
                }}>
                  🔧 Panel administracyjny
                </DropdownItem>
              </>
            )}
            
            <DropdownDivider theme={theme} />
            <DropdownItem onClick={() => { 
              handleLogout(); 
              setIsMenuOpen(false);
            }} style={{ color: '#ef4444' }}>
              🚪 Wyloguj
            </DropdownItem>
          </UserDropdown>
        </UserMenu>
      )}
    </Nav>
  );
} 