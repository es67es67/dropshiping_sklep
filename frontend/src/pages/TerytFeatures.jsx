import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiMapPin, FiGlobe, FiSettings, FiInfo } from 'react-icons/fi';
import TerytSearch from '../components/TerytSearch';
import TerytAutocomplete from '../components/TerytAutocomplete';
import TerytMap from '../components/TerytMap';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: ${props => props.theme.primary};
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FeatureTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? props.theme.primary : props.theme.textSecondary};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? props.theme.primary : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const InfoSection = styled.div`
  background: ${props => props.theme.primary}10;
  border: 1px solid ${props => props.theme.primary}30;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${props => props.theme.primary};
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${props => props.theme.text};
      line-height: 1.5;
    }
  }
`;

const DemoSection = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${props => props.theme.text};
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }
`;

const TerytFeatures = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedAddress, setSelectedAddress] = useState(null);

  const tabs = [
    {
      id: 'search',
      label: 'Wyszukiwanie TERYT',
      icon: <FiSearch />,
      description: 'Zaawansowane wyszukiwanie sklepów, firm i użytkowników po kodach TERYT'
    },
    {
      id: 'autocomplete',
      label: 'Autouzupełnianie',
      icon: <FiGlobe />,
      description: 'Inteligentne autouzupełnianie adresów z kodami TERYT'
    },
    {
      id: 'map',
      label: 'Mapa TERYT',
      icon: <FiMapPin />,
      description: 'Wizualizacja obiektów na mapie z filtrowaniem po kodach administracyjnych'
    }
  ];

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    console.log('Wybrany adres:', address);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <TerytSearch />;
      case 'autocomplete':
        return (
          <div>
            <DemoSection>
              <h3>Autouzupełnianie adresów z kodami TERYT</h3>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Wpisz adres, aby zobaczyć sugestie z kodami TERYT/SIMC/ULIC:
              </p>
              <TerytAutocomplete 
                onAddressSelect={handleAddressSelect}
                placeholder="Wpisz adres, np. 'Warszawa, Marszałkowska'"
                showSelected={true}
              />
            </DemoSection>
            
            {selectedAddress && (
              <DemoSection>
                <h3>Wybrany adres</h3>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p><strong>Adres:</strong> {selectedAddress.description}</p>
                  {selectedAddress.teryt && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p><strong>Kody TERYT:</strong></p>
                      <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                        {selectedAddress.teryt.tercCode && (
                          <li>TERC: {selectedAddress.teryt.tercCode}</li>
                        )}
                        {selectedAddress.teryt.simcCode && (
                          <li>SIMC: {selectedAddress.teryt.simcCode}</li>
                        )}
                        {selectedAddress.teryt.ulicCode && (
                          <li>ULIC: {selectedAddress.teryt.ulicCode}</li>
                        )}
                        {selectedAddress.teryt.fullCode && (
                          <li>Pełny kod: {selectedAddress.teryt.fullCode}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </DemoSection>
            )}
          </div>
        );
      case 'map':
        return <TerytMap />;
      default:
        return <TerytSearch />;
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <h1>🗺️ Funkcjonalności TERYT</h1>
        <p>
          Zaawansowane narzędzia do wyszukiwania i analizy danych geograficznych 
          z wykorzystaniem polskich kodów administracyjnych TERYT/SIMC/ULIC
        </p>
      </PageHeader>

      <InfoSection>
        <h3>
          <FiInfo />
          Informacje o kodach TERYT
        </h3>
        <ul>
          <li><strong>TERC</strong> - kod jednostki administracyjnej (województwo + powiat + gmina)</li>
          <li><strong>SIMC</strong> - kod identyfikacyjny miejscowości</li>
          <li><strong>ULIC</strong> - kod identyfikacyjny ulicy</li>
          <li><strong>Pełny kod TERYT</strong> - kombinacja wszystkich kodów dla dokładnej lokalizacji</li>
        </ul>
      </InfoSection>

      <FeatureTabs>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </TabButton>
        ))}
      </FeatureTabs>

      <TabContent>
        {renderTabContent()}
      </TabContent>

      <InfoSection>
        <h3>
          <FiSettings />
          Jak korzystać z funkcjonalności TERYT
        </h3>
        <ul>
          <li><strong>Wyszukiwanie:</strong> Użyj kodów TERYT do precyzyjnego wyszukiwania obiektów w określonej lokalizacji</li>
          <li><strong>Autouzupełnianie:</strong> Wpisz adres, aby otrzymać sugestie z kodami administracyjnymi</li>
          <li><strong>Mapa:</strong> Wizualizuj obiekty na mapie z filtrowaniem po kodach TERYT</li>
          <li><strong>Integracja:</strong> Wszystkie funkcjonalności są zintegrowane z systemem sklepów, firm i użytkowników</li>
        </ul>
      </InfoSection>
    </PageContainer>
  );
};

export default TerytFeatures; 