import React, { useState } from 'react';
import styled from 'styled-components';
import LocationAutocomplete from './LocationAutocomplete';

const LocationAutocompleteExample = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationData, setLocationData] = useState(null);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleLocationSelect = (location) => {
    console.log('Wybrana lokalizacja:', location);
    setLocationData(location);
  };

  return (
    <Container>
      <Title>📍 Przykład użycia LocationAutocomplete</Title>
      
      <Section>
        <SectionTitle>Podstawowe użycie:</SectionTitle>
        <LocationAutocomplete
          value={selectedLocation}
          onChange={handleLocationChange}
          onLocationSelect={handleLocationSelect}
          placeholder="Wprowadź lokalizację..."
        />
      </Section>

      <Section>
        <SectionTitle>Wybrana lokalizacja:</SectionTitle>
        {locationData ? (
          <LocationInfo>
            <InfoItem>
              <Label>Nazwa:</Label>
              <Value>{locationData.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Typ:</Label>
              <Value>{locationData.type}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Kod:</Label>
              <Value>{locationData.code}</Value>
            </InfoItem>
            {locationData.gmina && (
              <InfoItem>
                <Label>Gmina:</Label>
                <Value>{locationData.gmina.name}</Value>
              </InfoItem>
            )}
            {locationData.powiat && (
              <InfoItem>
                <Label>Powiat:</Label>
                <Value>{locationData.powiat.name}</Value>
              </InfoItem>
            )}
            {locationData.wojewodztwo && (
              <InfoItem>
                <Label>Województwo:</Label>
                <Value>{locationData.wojewodztwo.name}</Value>
              </InfoItem>
            )}
          </LocationInfo>
        ) : (
          <NoLocation>Nie wybrano lokalizacji</NoLocation>
        )}
      </Section>

      <Section>
        <SectionTitle>Funkcje komponentu:</SectionTitle>
        <FeatureList>
          <FeatureItem>✅ Autouzupełnianie po 2 znakach</FeatureItem>
          <FeatureItem>✅ Debounce 300ms (nie obciąża serwera)</FeatureItem>
          <FeatureItem>✅ Wyszukiwanie w różnych typach (miejscowość, gmina, powiat, województwo, ulica)</FeatureItem>
          <FeatureItem>✅ Nawigacja klawiaturą (strzałki, Enter, Escape)</FeatureItem>
          <FeatureItem>✅ Click outside do zamknięcia</FeatureItem>
          <FeatureItem>✅ Loading spinner podczas wyszukiwania</FeatureItem>
          <FeatureItem>✅ Przycisk czyszczenia</FeatureItem>
          <FeatureItem>✅ Responsywny design</FeatureItem>
        </FeatureList>
      </Section>

      <Section>
        <SectionTitle>Optymalizacja serwera:</SectionTitle>
        <OptimizationInfo>
          <OptimizationItem>
            <OptimizationTitle>🎯 Debounce 300ms</OptimizationTitle>
            <OptimizationDescription>
              Zapytania są wysyłane dopiero po 300ms od ostatniego wpisania znaku
            </OptimizationDescription>
          </OptimizationItem>
          <OptimizationItem>
            <OptimizationTitle>📊 Minimum 2 znaki</OptimizationTitle>
            <OptimizationDescription>
              Wyszukiwanie rozpoczyna się dopiero po wpisaniu minimum 2 znaków
            </OptimizationDescription>
          </OptimizationItem>
          <OptimizationItem>
            <OptimizationTitle>🔍 Limit 10 wyników</OptimizationTitle>
            <OptimizationDescription>
              Każde zapytanie zwraca maksymalnie 10 wyników
            </OptimizationDescription>
          </OptimizationItem>
          <OptimizationItem>
            <OptimizationTitle>⚡ Indeksy MongoDB</OptimizationTitle>
            <OptimizationDescription>
              Wyszukiwanie wykorzystuje indeksy na polu 'name' w bazie danych
            </OptimizationDescription>
          </OptimizationItem>
        </OptimizationInfo>
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const SectionTitle = styled.h3`
  color: #495057;
  margin-bottom: 15px;
  font-size: 18px;
`;

const LocationInfo = styled.div`
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #495057;
  width: 100px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #212529;
`;

const NoLocation = styled.div`
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OptimizationInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
`;

const OptimizationItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;

const OptimizationTitle = styled.h4`
  color: #495057;
  margin-bottom: 8px;
  font-size: 16px;
`;

const OptimizationDescription = styled.p`
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
`;

export default LocationAutocompleteExample; 