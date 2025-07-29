import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
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

const SettingsCard = styled.div`
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

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background: ${props => props.theme.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.border};
  transition: 0.3s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.gradientHover};
    transform: translateY(-1px);
  }
  
  &.danger {
    background: #EF4444;
    
    &:hover {
      background: #DC2626;
    }
  }
  
  &.secondary {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.border};
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ColorThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ColorOption = styled.div`
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

const ColorPreview = styled.div`
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

const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationInfo = styled.div`
  flex: 1;
`;

const NotificationLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const NotificationDesc = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const SaveButton = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
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

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
  
  &.success {
    background: ${props => props.theme.success}20;
    color: ${props => props.theme.success};
    border: 1px solid ${props => props.theme.success};
  }
  
  &.error {
    background: ${props => props.theme.error}20;
    color: ${props => props.theme.error};
    border: 1px solid ${props => props.theme.error};
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const DangerZone = styled.div`
  border: 2px solid ${props => props.theme.error};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const DangerTitle = styled.h3`
  color: ${props => props.theme.error};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default function Settings() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'pl',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      orderUpdates: true,
      promotions: true,
      security: true,
      messages: true,
      reviews: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      showLocation: true,
      showStats: true
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: '24h',
      passwordChangeRequired: false
    },
    preferences: {
      autoSave: true,
      darkMode: false,
      compactView: false,
      showTutorials: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const themes = [
    { id: 'light', name: 'Jasny', color: '#F3F4F6' },
    { id: 'dark', name: 'Ciemny', color: '#1F2937' },
    { id: 'blue', name: 'Niebieski', color: '#3B82F6' },
    { id: 'green', name: 'Zielony', color: '#10B981' },
    { id: 'purple', name: 'Fioletowy', color: '#8B5CF6' },
    { id: 'orange', name: 'Pomarańczowy', color: '#F59E0B' }
  ];

  const languages = [
    { code: 'pl', name: 'Polski' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${apiUrl}/api/users/layout-settings/portal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pobrane ustawienia layoutu:', data);
        
        // Zaktualizuj ustawienia na podstawie pobranych danych
        setSettings(prev => ({
          ...prev,
          theme: data.theme || 'light',
          language: data.language || 'pl',
          preferences: {
            ...prev.preferences,
            compactView: data.layout === 'compact'
          }
        }));
      } else {
        console.error('Błąd podczas ładowania ustawień layoutu');
        // Użyj domyślnych ustawień
      }
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      // Zapisz ustawienia layoutu
      const layoutSettings = {
        theme: settings.theme,
        layout: settings.preferences.compactView ? 'compact' : 'modern',
        language: settings.language
      };
      
      const response = await fetch(`${apiUrl}/api/users/layout-settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(layoutSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ustawienia zostały zapisane' });
        setHasChanges(false);
        
        // Zastosuj zmiany motywu
        if (settings.theme) {
          document.documentElement.setAttribute('data-theme', settings.theme);
          localStorage.setItem('theme', settings.theme);
        }
        
        // Odśwież stronę aby zastosować zmiany
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Błąd podczas zapisywania ustawień' });
      }
    } catch (error) {
      console.error('Błąd:', error);
      setMessage({ type: 'error', text: 'Błąd połączenia z serwerem' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    setHasChanges(true);
  };

  const handleSelect = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  const handleThemeChange = (themeId) => {
    setSettings(prev => ({
      ...prev,
      theme: themeId
    }));
    setHasChanges(true);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna i usunie wszystkie Twoje dane.')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/users/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Konto zostało usunięte');
        logout();
      } else {
        const error = await response.json();
        alert(error.message || 'Błąd podczas usuwania konta');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd połączenia z serwerem');
    }
  };

  const handleExportData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/users/export-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_data_${user?.username || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage({ type: 'success', text: 'Dane zostały wyeksportowane' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Błąd podczas eksportu danych' });
      }
    } catch (error) {
      console.error('Błąd:', error);
      setMessage({ type: 'error', text: 'Błąd połączenia z serwerem' });
    }
  };

  const handleChangePassword = () => {
    // Przekieruj do strony zmiany hasła
    window.location.href = '/change-password';
  };

  if (loading) {
    return (
      <Container>        <PageTitle title="Ustawienia" description="Ustawienia konta" />
        <Title>Ustawienia</Title>
        <LoadingSpinner>Ładowanie ustawień...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>⚙️ Ustawienia</Title>
      
      {message && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}
      
      <SettingsCard>
        <SectionTitle>🎨 Wygląd</SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Motyw kolorystyczny</SettingLabel>
            <SettingDescription>Wybierz preferowany motyw interfejsu</SettingDescription>
          </SettingInfo>
        </SettingItem>
        <ColorThemeGrid>
          {themes.map(theme => (
            <ColorOption
              key={theme.id}
              selected={settings.theme === theme.id}
              onClick={() => handleThemeChange(theme.id)}
            >
              <ColorPreview color={theme.color} />
              <ColorName>{theme.name}</ColorName>
            </ColorOption>
          ))}
        </ColorThemeGrid>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Język</SettingLabel>
            <SettingDescription>Wybierz język interfejsu</SettingDescription>
          </SettingInfo>
          <Select
            value={settings.language}
            onChange={(e) => handleSelect('', 'language', e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </Select>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Tryb ciemny</SettingLabel>
            <SettingDescription>Automatyczne przełączanie na ciemny motyw</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.preferences.darkMode}
              onChange={() => handleToggle('preferences', 'darkMode')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Kompaktowy widok</SettingLabel>
            <SettingDescription>Zmniejsz odstępy w interfejsie</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.preferences.compactView}
              onChange={() => handleToggle('preferences', 'compactView')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <SectionTitle>🔔 Powiadomienia</SectionTitle>
        <NotificationSettings>
          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Powiadomienia email</NotificationLabel>
              <NotificationDesc>Otrzymuj powiadomienia na email</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>
          
          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Powiadomienia push</NotificationLabel>
              <NotificationDesc>Powiadomienia w przeglądarce</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>
          
          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>SMS</NotificationLabel>
              <NotificationDesc>Powiadomienia SMS</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={() => handleToggle('notifications', 'sms')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>
          
          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Marketing</NotificationLabel>
              <NotificationDesc>Oferty i promocje</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.marketing}
                onChange={() => handleToggle('notifications', 'marketing')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>
          
          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Aktualizacje zamówień</NotificationLabel>
              <NotificationDesc>Status i śledzenie zamówień</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.orderUpdates}
                onChange={() => handleToggle('notifications', 'orderUpdates')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Wiadomości</NotificationLabel>
              <NotificationDesc>Powiadomienia o nowych wiadomościach</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.messages}
                onChange={() => handleToggle('notifications', 'messages')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationLabel>Recenzje</NotificationLabel>
              <NotificationDesc>Powiadomienia o nowych recenzjach</NotificationDesc>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications.reviews}
                onChange={() => handleToggle('notifications', 'reviews')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>
        </NotificationSettings>
      </SettingsCard>

      <SettingsCard>
        <SectionTitle>🔒 Prywatność</SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Widoczność profilu</SettingLabel>
            <SettingDescription>Kto może zobaczyć Twój profil</SettingDescription>
          </SettingInfo>
          <Select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
          >
            <option value="public">Publiczny</option>
            <option value="friends">Tylko znajomi</option>
            <option value="private">Prywatny</option>
          </Select>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Pokaż email</SettingLabel>
            <SettingDescription>Pozwól innym zobaczyć Twój email</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={() => handleToggle('privacy', 'showEmail')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Pokaż telefon</SettingLabel>
            <SettingDescription>Pozwól innym zobaczyć Twój telefon</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.privacy.showPhone}
              onChange={() => handleToggle('privacy', 'showPhone')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Pozwól na wiadomości</SettingLabel>
            <SettingDescription>Pozwól innym wysyłać Ci wiadomości</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.privacy.allowMessages}
              onChange={() => handleToggle('privacy', 'allowMessages')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Pokaż lokalizację</SettingLabel>
            <SettingDescription>Pokaż swoją lokalizację w profilu</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.privacy.showLocation}
              onChange={() => handleToggle('privacy', 'showLocation')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Pokaż statystyki</SettingLabel>
            <SettingDescription>Pokaż swoje statystyki publicznie</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.privacy.showStats}
              onChange={() => handleToggle('privacy', 'showStats')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <SectionTitle>🛡️ Bezpieczeństwo</SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Uwierzytelnianie dwuskładnikowe</SettingLabel>
            <SettingDescription>Dodatkowa warstwa bezpieczeństwa</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={() => handleToggle('security', 'twoFactorAuth')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Powiadomienia o logowaniu</SettingLabel>
            <SettingDescription>Otrzymuj powiadomienia o nowych logowaniach</SettingDescription>
          </SettingInfo>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.security.loginNotifications}
              onChange={() => handleToggle('security', 'loginNotifications')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Czas sesji</SettingLabel>
            <SettingDescription>Jak długo sesja pozostaje aktywna</SettingDescription>
          </SettingInfo>
          <Select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSelect('security', 'sessionTimeout', e.target.value)}
          >
            <option value="1h">1 godzina</option>
            <option value="6h">6 godzin</option>
            <option value="24h">24 godziny</option>
            <option value="7d">7 dni</option>
          </Select>
        </SettingItem>

        <ButtonGroup>
          <Button onClick={handleChangePassword}>
            🔑 Zmień hasło
          </Button>
          <Button className="secondary" onClick={handleExportData}>
            📥 Eksportuj dane
          </Button>
        </ButtonGroup>
      </SettingsCard>

      <DangerZone>
        <DangerTitle>⚠️ Strefa niebezpieczna</DangerTitle>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Te operacje są nieodwracalne. Użyj ich ostrożnie.
        </p>
        <ButtonGroup>
          <Button className="danger" onClick={handleDeleteAccount}>
            🗑️ Usuń konto
          </Button>
        </ButtonGroup>
      </DangerZone>

      {hasChanges && (
        <SaveButton 
          onClick={saveSettings} 
          disabled={saving}
        >
          {saving ? 'Zapisywanie...' : '💾 Zapisz ustawienia'}
        </SaveButton>
      )}
    </Container>
  );
} 