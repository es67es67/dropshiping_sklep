import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
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

const DangerZone = styled.div`
  background: #FEF2F2;
  border: 2px solid #FECACA;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const DangerTitle = styled.h3`
  color: #DC2626;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DangerText = styled.p`
  color: #7F1D1D;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export default function Settings() {
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
      security: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: '24h'
    }
  });

  const themes = [
    { id: 'light', name: 'Jasny', color: '#F3F4F6' },
    { id: 'dark', name: 'Ciemny', color: '#1F2937' },
    { id: 'blue', name: 'Niebieski', color: '#3B82F6' },
    { id: 'green', name: 'Zielony', color: '#10B981' }
  ];

  const languages = [
    { code: 'pl', name: 'Polski' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' }
  ];

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelect = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleThemeChange = (themeId) => {
    setSettings(prev => ({
      ...prev,
      theme: themeId
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna.')) {
      alert('Konto zostało usunięte (symulacja)');
    }
  };

  const handleExportData = () => {
    alert('Dane zostały wyeksportowane (symulacja)');
  };

  return (
    <Container>
      <Title>Ustawienia</Title>
      
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
            <SettingLabel>Timeout sesji</SettingLabel>
            <SettingDescription>Po jakim czasie sesja wygasa</SettingDescription>
          </SettingInfo>
          <Select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSelect('security', 'sessionTimeout', e.target.value)}
          >
            <option value="1h">1 godzina</option>
            <option value="8h">8 godzin</option>
            <option value="24h">24 godziny</option>
            <option value="7d">7 dni</option>
          </Select>
        </SettingItem>
      </SettingsCard>

      <SettingsCard>
        <SectionTitle>📊 Dane</SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Eksport danych</SettingLabel>
            <SettingDescription>Pobierz kopię swoich danych</SettingDescription>
          </SettingInfo>
          <Button onClick={handleExportData}>
            Eksportuj
          </Button>
        </SettingItem>
        
        <DangerZone>
          <DangerTitle>🗑️ Strefa niebezpieczna</DangerTitle>
          <DangerText>
            Usunięcie konta jest nieodwracalne. Wszystkie dane zostaną trwale usunięte.
          </DangerText>
          <ButtonGroup>
            <Button className="danger" onClick={handleDeleteAccount}>
              Usuń konto
            </Button>
            <Button className="secondary">
              Anuluj
            </Button>
          </ButtonGroup>
        </DangerZone>
      </SettingsCard>
    </Container>
  );
} 