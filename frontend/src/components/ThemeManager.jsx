import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';
import TerminalTheme from '../themes/TerminalTheme';

// Kontekst motywu
const ThemeContext = createContext();

// Dostępne motywy
const themes = {
  default: {
    name: 'Domyślny',
    description: 'Standardowy motyw portalu',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b'
    }
  },
  dark: {
    name: 'Ciemny',
    description: 'Ciemny motyw dla nocnego przeglądania',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8'
    }
  },
  terminal: TerminalTheme
};

// Styled components
const ThemeContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border || props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  font-family: ${props => props.theme.fonts?.primary || 'inherit'};
`;

const ThemeTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const ThemeCard = styled.div`
  padding: 12px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.surface};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ThemeName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ThemeDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const ThemePreview = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ColorSwatch = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  font-size: 20px;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

// Provider motywu
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeManager, setShowThemeManager] = useState(false);

  useEffect(() => {
    // Wczytaj zapisany motyw z localStorage
    const savedTheme = localStorage.getItem('portal-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('portal-theme', themeName);
      
      // Zastosuj motyw do całej aplikacji
      applyThemeToDocument(themes[themeName]);
    }
  };

  const applyThemeToDocument = (theme) => {
    const root = document.documentElement;
    
    // Zastosuj kolory CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Zastosuj fonty
    if (theme.fonts) {
      Object.entries(theme.fonts).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value);
      });
    }
    
    // Zastosuj spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }
    
    // Zastosuj border radius
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
    }
    
    // Zastosuj shadows
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }
    
    // Dodaj klasy CSS dla motywu terminala
    if (theme.name === 'Terminal') {
      document.body.classList.add('terminal-theme');
      document.body.classList.add('terminal-bg');
    } else {
      document.body.classList.remove('terminal-theme');
      document.body.classList.remove('terminal-bg');
    }
  };

  const value = {
    currentTheme: themes[currentTheme],
    changeTheme,
    showThemeManager,
    setShowThemeManager
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <ThemeManager />
    </ThemeContext.Provider>
  );
};

// Hook do używania motywu
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Główny komponent zarządzania motywami
const ThemeManager = () => {
  const { currentTheme, changeTheme, showThemeManager, setShowThemeManager } = useTheme();

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setShowThemeManager(false);
  };

  if (!showThemeManager) {
    return (
      <ToggleButton
        onClick={() => setShowThemeManager(true)}
        title="Zmień motyw"
      >
        🎨
      </ToggleButton>
    );
  }

  return (
    <ThemeContainer theme={currentTheme}>
      <CloseButton
        onClick={() => setShowThemeManager(false)}
        theme={currentTheme}
      >
        ×
      </CloseButton>
      
      <ThemeTitle theme={currentTheme}>
        Wybierz Motyw
      </ThemeTitle>
      
      <ThemeGrid>
        {Object.entries(themes).map(([key, theme]) => (
          <ThemeCard
            key={key}
            theme={currentTheme}
            $active={key === Object.keys(themes).find(k => themes[k] === currentTheme)}
            onClick={() => handleThemeChange(key)}
          >
            <ThemeName theme={currentTheme}>
              {theme.name}
            </ThemeName>
            <ThemeDescription theme={currentTheme}>
              {theme.description}
            </ThemeDescription>
            <ThemePreview>
              {Object.values(theme.colors).slice(0, 5).map((color, index) => (
                <ColorSwatch key={index} color={color} />
              ))}
            </ThemePreview>
          </ThemeCard>
        ))}
      </ThemeGrid>
    </ThemeContainer>
  );
};

// Komponent do wyświetlania informacji o motywie
export const ThemeInfo = () => {
  const { currentTheme } = useTheme();

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: currentTheme.colors.surface,
      border: `1px solid ${currentTheme.colors.border || currentTheme.colors.primary}`,
      borderRadius: '8px',
      margin: '16px 0'
    }}>
      <h4 style={{ color: currentTheme.colors.text, margin: '0 0 8px 0' }}>
        Aktualny Motyw: {currentTheme.name}
      </h4>
      <p style={{ color: currentTheme.colors.textSecondary, margin: 0, fontSize: '14px' }}>
        {currentTheme.description}
      </p>
    </div>
  );
};

// Komponent do szybkiego przełączania motywów
export const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();

  const nextTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.findIndex(key => themes[key] === currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    changeTheme(themeKeys[nextIndex]);
  };

  return (
    <button
      onClick={nextTheme}
      style={{
        padding: '8px 16px',
        backgroundColor: currentTheme.colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Następny motyw
    </button>
  );
};

export default ThemeManager; 