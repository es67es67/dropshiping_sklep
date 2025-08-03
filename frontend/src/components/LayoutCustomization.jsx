import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.$active ? props.theme.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.border};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 2rem;
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

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LayoutCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['selected', 'theme'].includes(prop)
})`
  border: 3px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? props.theme.primary + '10' : props.theme.background};
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const LayoutPreview = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  border: 2px solid ${props => props.theme.border};
`;

const LayoutHeader = styled.div`
  height: 40px;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const LayoutSidebar = styled.div`
  position: absolute;
  left: 0;
  top: 40px;
  width: 60px;
  height: calc(100% - 40px);
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
`;

const LayoutContent = styled.div`
  position: absolute;
  left: 60px;
  top: 40px;
  right: 0;
  height: calc(100% - 40px);
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const LayoutName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const LayoutDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const LayoutFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeatureTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ThemeCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['selected', 'theme'].includes(prop)
})`
  border: 3px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? props.theme.primary + '10' : props.theme.background};
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const ThemePreview = styled.div.withConfig({
  shouldForwardProp: (prop) => !['gradient', 'color'].includes(prop)
})`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${props => props.gradient || props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const ThemeName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const ThemeDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ColorOption = styled.div.withConfig({
  shouldForwardProp: (prop) => !['selected', 'theme'].includes(prop)
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
  }
`;

const ColorPreview = styled.div.withConfig({
  shouldForwardProp: (prop) => !['color', 'theme'].includes(prop)
})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.border};
`;

const ColorName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  text-align: center;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.success}20;
  color: ${props => props.theme.success};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.success}40;
`;

export default function LayoutCustomization({ theme, onSettingsSaved }) {
  console.log('LayoutCustomization component rendered'); // Dodaj log renderowania
  console.log('Theme prop:', theme); // Dodaj log theme
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portal');
  
    // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('Current user from context:', user);
    console.log('User from localStorage:', userData ? JSON.parse(userData) : null);
    console.log('Token available:', !!token);
    console.log('Theme prop:', theme);
    
    if (!user || !token) {
      setMessage('Błąd: Nie jesteś zalogowany. Zaloguj się ponownie.');
    } else if (!user._id) {
      setMessage('Błąd: Brak ID użytkownika. Zaloguj się ponownie.');
    }
    
    if (!theme) {
      console.error('Theme prop is missing!');
    }
  }, [user, theme]);
  const [selectedLayout, setSelectedLayout] = useState('modern');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedColors, setSelectedColors] = useState({
    primary: '#00D4AA',
    secondary: '#8B5CF6',
    accent: '#F59E0B'
  });
  const [message, setMessage] = useState('');

  const layouts = [
    {
      id: 'modern',
      name: 'Nowoczesny',
      description: 'Czysty i minimalistyczny design z dużą ilością białej przestrzeni',
      features: ['Responsywny', 'Minimalistyczny', 'Szybki'],
      preview: 'modern'
    },
    {
      id: 'classic',
      name: 'Klasyczny',
      description: 'Tradycyjny layout z bocznym menu i dużą nawigacją',
      features: ['Boczne menu', 'Tradycyjny', 'Przejrzysty'],
      preview: 'classic'
    },
    {
      id: 'compact',
      name: 'Kompaktowy',
      description: 'Optymalizowany dla maksymalnej wydajności i szybkiego dostępu',
      features: ['Kompaktowy', 'Szybki', 'Wydajny'],
      preview: 'compact'
    },
    {
      id: 'elegant',
      name: 'Elegancki',
      description: 'Luksusowy design z zaawansowanymi animacjami i efektami',
      features: ['Animacje', 'Luksusowy', 'Zaawansowany'],
      preview: 'elegant'
    }
  ];

  const themes = [
    {
      id: 'default',
      name: 'Domyślny',
      description: 'Standardowy motyw z zielono-fioletowym gradientem',
      gradient: 'linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)',
      color: '#00D4AA'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Spokojne odcienie niebieskiego i turkusu',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      color: '#0EA5E9'
    },
    {
      id: 'sunset',
      name: 'Zachód słońca',
      description: 'Ciepłe kolory pomarańczowego i różu',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
      color: '#F59E0B'
    },
    {
      id: 'forest',
      name: 'Las',
      description: 'Naturalne zielenie i brązy',
      gradient: 'linear-gradient(135deg, #10B981 0%, #8B5A2B 100%)',
      color: '#10B981'
    },
    {
      id: 'midnight',
      name: 'Północ',
      description: 'Ciemne odcienie granatu i fioletu',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
      color: '#1E40AF'
    },
    {
      id: 'coral',
      name: 'Koral',
      description: 'Żywe kolory koralowe i różowe',
      gradient: 'linear-gradient(135deg, #F97316 0%, #E11D48 100%)',
      color: '#F97316'
    }
  ];

  const colorOptions = [
    { name: 'Zielony', color: '#10B981' },
    { name: 'Niebieski', color: '#3B82F6' },
    { name: 'Fioletowy', color: '#8B5CF6' },
    { name: 'Pomarańczowy', color: '#F59E0B' },
    { name: 'Różowy', color: '#EC4899' },
    { name: 'Czerwony', color: '#EF4444' },
    { name: 'Turkusowy', color: '#06B6D4' },
    { name: 'Żółty', color: '#EAB308' }
  ];

  const handleSaveSettings = async () => {
    console.log('=== handleSaveSettings START ===');
    console.log('handleSaveSettings called!');
    console.log('Current state:', { selectedLayout, selectedTheme, selectedColors, activeTab });
    console.log('User from context:', user);
    console.log('User ID:', user?._id);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      console.log('API URL:', apiUrl);
      console.log('Token available:', !!token);
      
      if (!token) {
        console.error('Brak tokenu!');
        setMessage('Błąd: Nie jesteś zalogowany. Zaloguj się ponownie.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }
      
      if (!user || !user._id) {
        console.error('Brak użytkownika lub ID!');
        setMessage('Błąd: Brak ID użytkownika. Zaloguj się ponownie.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }
      
      const settings = {
        layout: selectedLayout,
        theme: selectedTheme,
        colors: selectedColors,
        type: activeTab // 'portal' lub 'shop'
      };

      console.log('Wysyłanie ustawień:', settings);

      const response = await fetch(`${apiUrl}/api/users/layout-settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Response data:', result);
        setMessage('✅ Ustawienia zostały zapisane pomyślnie!');
        setTimeout(() => setMessage(''), 3000);
        
        console.log('Wywołuję onSettingsSaved callback...');
        if (onSettingsSaved) {
          onSettingsSaved();
          console.log('onSettingsSaved callback wywołany');
        } else {
          console.warn('onSettingsSaved callback nie jest dostępny!');
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Nie udało się zapisać ustawień');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      setMessage('❌ Błąd podczas zapisywania ustawień: ' + err.message);
      setTimeout(() => setMessage(''), 5000);
    }
    
    console.log('=== handleSaveSettings END ===');
  };

  const handleResetSettings = () => {
    setSelectedLayout('modern');
    setSelectedTheme('default');
    setSelectedColors({
      primary: '#00D4AA',
      secondary: '#8B5CF6',
      accent: '#F59E0B'
    });
  };

  const renderLayoutPreview = (layoutType) => {
    switch (layoutType) {
      case 'modern':
        return (
          <LayoutPreview>
            <LayoutHeader />
            <LayoutContent>Nowoczesny layout</LayoutContent>
          </LayoutPreview>
        );
      case 'classic':
        return (
          <LayoutPreview>
            <LayoutHeader />
            <LayoutSidebar />
            <LayoutContent>Klasyczny layout</LayoutContent>
          </LayoutPreview>
        );
      case 'compact':
        return (
          <LayoutPreview>
            <LayoutHeader style={{ height: '30px' }} />
            <LayoutContent style={{ top: '30px', height: 'calc(100% - 30px)' }}>
              Kompaktowy layout
            </LayoutContent>
          </LayoutPreview>
        );
      case 'elegant':
        return (
          <LayoutPreview>
            <LayoutHeader style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
            <LayoutContent style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              Elegancki layout
            </LayoutContent>
          </LayoutPreview>
        );
      default:
        return <LayoutPreview>Podgląd</LayoutPreview>;
    }
  };

  return (
    <Container>
      <Title>Dostosowywanie wyglądu</Title>

      {message && <SuccessMessage>{message}</SuccessMessage>}

      <TabsContainer>
        <Tab 
                      $active={activeTab === 'portal'} 
          onClick={() => setActiveTab('portal')}
        >
          🌐 Portal
        </Tab>
        <Tab 
                      $active={activeTab === 'shop'} 
          onClick={() => setActiveTab('shop')}
        >
          🏪 Sklep
        </Tab>
      </TabsContainer>

      <Section>
        <SectionTitle>📐 Layout</SectionTitle>
        <LayoutGrid>
          {layouts.map(layout => (
            <LayoutCard
              key={layout.id}
              selected={selectedLayout === layout.id}
              onClick={() => setSelectedLayout(layout.id)}
            >
              {renderLayoutPreview(layout.preview)}
              <LayoutName>{layout.name}</LayoutName>
              <LayoutDescription>{layout.description}</LayoutDescription>
              <LayoutFeatures>
                {layout.features.map(feature => (
                  <FeatureTag key={feature}>{feature}</FeatureTag>
                ))}
              </LayoutFeatures>
            </LayoutCard>
          ))}
        </LayoutGrid>
      </Section>

      <Section>
        <SectionTitle>🎨 Motyw kolorystyczny</SectionTitle>
        <ThemeGrid>
          {themes.map(theme => (
            <ThemeCard
              key={theme.id}
              selected={selectedTheme === theme.id}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <ThemePreview gradient={theme.gradient} color={theme.color}>
                {theme.name}
              </ThemePreview>
              <ThemeName>{theme.name}</ThemeName>
              <ThemeDescription>{theme.description}</ThemeDescription>
            </ThemeCard>
          ))}
        </ThemeGrid>
      </Section>

      <Section>
        <SectionTitle>🎨 Kolory niestandardowe</SectionTitle>
        <ColorPalette>
          {colorOptions.map(color => (
            <ColorOption
              key={color.name}
              selected={selectedColors.primary === color.color}
              onClick={() => setSelectedColors(prev => ({ ...prev, primary: color.color }))}
            >
              <ColorPreview color={color.color} />
              <ColorName>{color.name}</ColorName>
            </ColorOption>
          ))}
        </ColorPalette>
      </Section>

      <ButtonGroup>
        <Button onClick={handleSaveSettings}>
          💾 Zapisz ustawienia
        </Button>
        <Button onClick={handleResetSettings} style={{ background: '#6B7280' }}>
          🔄 Resetuj
        </Button>
        
        {/* Przyciski testowe */}
        <Button 
          onClick={() => {
            console.log('Test button clicked!');
            alert('Test button działa!');
            setMessage('Test: Przycisk działa poprawnie!');
          }}
          style={{ background: '#F59E0B' }}
        >
          🧪 Test przycisku
        </Button>
        
        <Button 
          onClick={() => {
            console.log('Current state:', {
              selectedLayout,
              selectedTheme,
              selectedColors,
              activeTab,
              user: user?._id
            });
            alert(`Layout: ${selectedLayout}\nTheme: ${selectedTheme}\nUser: ${user?._id}`);
          }}
          style={{ background: '#8B5CF6' }}
        >
          🔍 Debug state
        </Button>
      </ButtonGroup>
      
    </Container>
  );
} 