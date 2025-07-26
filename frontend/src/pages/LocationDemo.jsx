import React, { useState } from 'react';
import styled from 'styled-components';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { FaMapMarkerAlt, FaSearch, FaDatabase } from 'react-icons/fa';

// Styled components
const DemoContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const DemoContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const DemoTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DemoSubtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 20px;
`;

const DemoDescription = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 4px solid #667eea;
`;

const DemoDescriptionTitle = styled.h3`
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DemoDescriptionText = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 0;
`;

const SearchSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ResultsSection = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const ResultsTitle = styled.h3`
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResultItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultName = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 5px;
`;

const ResultDetails = styled.div`
  font-size: 0.9rem;
  color: #718096;
`;

const ResultType = styled.span`
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 8px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const LocationDemo = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedVoivodeship, setSelectedVoivodeship] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);

  const handleCitySelect = (item) => {
    setSelectedCity(item);
    console.log('Wybrano miasto:', item);
  };

  const handleMunicipalitySelect = (item) => {
    setSelectedMunicipality(item);
    console.log('Wybrano gminę:', item);
  };

  const handleCountySelect = (item) => {
    setSelectedCounty(item);
    console.log('Wybrano powiat:', item);
  };

  const handleVoivodeshipSelect = (item) => {
    setSelectedVoivodeship(item);
    console.log('Wybrano województwo:', item);
  };

  const handleStreetSelect = (item) => {
    setSelectedStreet(item);
    console.log('Wybrano ulicę:', item);
  };

  return (
    <DemoContainer>
      <DemoContent>
        <DemoHeader>
          <DemoTitle>🔍 Location Autocomplete Demo</DemoTitle>
          <DemoSubtitle>
            Prosty komponent wyszukiwania lokalizacji z bazy MongoDB (TERC, SIMC, ULIC)
          </DemoSubtitle>
        </DemoHeader>

        <DemoDescription>
          <DemoDescriptionTitle>
            <FaDatabase />
            O komponencie
          </DemoDescriptionTitle>
          <DemoDescriptionText>
            Ten komponent oferuje wyszukiwanie lokalizacji z autouzupełnianiem w Twojej bazie MongoDB. 
            Wykorzystuje dane TERYT (województwa, powiaty, gminy), SIMC (miejscowości) i ULIC (ulice). 
            Wyszukiwanie rozpoczyna się po wpisaniu minimum 2 znaków, a wyniki są pobierane z Twojej bazy danych.
          </DemoDescriptionText>
        </DemoDescription>

        <SearchSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie miejscowości (SIMC)
          </SectionTitle>
          <SearchContainer>
            <SearchLabel>Miejscowość</SearchLabel>
            <LocationAutocomplete
              type="cities"
              placeholder="Wpisz nazwę miasta..."
              onSelect={handleCitySelect}
              theme="light"
              showClearButton={true}
            />
          </SearchContainer>
          {selectedCity && (
            <ResultsSection>
              <ResultsTitle>
                <FaMapMarkerAlt />
                Wybrana miejscowość
              </ResultsTitle>
              <ResultItem>
                <ResultName>
                  {selectedCity.name}
                  <ResultType>Miejscowość</ResultType>
                </ResultName>
                <ResultDetails>
                  {selectedCity.municipalityName}, {selectedCity.countyName}, {selectedCity.voivodeshipName}
                  {selectedCity.population && ` • ${selectedCity.population.toLocaleString()} mieszkańców`}
                </ResultDetails>
              </ResultItem>
            </ResultsSection>
          )}
        </SearchSection>

        <SearchSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie gmin (TERC)
          </SectionTitle>
          <SearchContainer>
            <SearchLabel>Gmina</SearchLabel>
            <LocationAutocomplete
              type="municipalities"
              placeholder="Wpisz nazwę gminy..."
              onSelect={handleMunicipalitySelect}
              theme="light"
              showClearButton={true}
            />
          </SearchContainer>
          {selectedMunicipality && (
            <ResultsSection>
              <ResultsTitle>
                <FaMapMarkerAlt />
                Wybrana gmina
              </ResultsTitle>
              <ResultItem>
                <ResultName>
                  {selectedMunicipality.name}
                  <ResultType>Gmina</ResultType>
                </ResultName>
                <ResultDetails>
                  {selectedMunicipality.countyName}, {selectedMunicipality.voivodeshipName}
                </ResultDetails>
              </ResultItem>
            </ResultsSection>
          )}
        </SearchSection>

        <SearchSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie powiatów (TERC)
          </SectionTitle>
          <SearchContainer>
            <SearchLabel>Powiat</SearchLabel>
            <LocationAutocomplete
              type="counties"
              placeholder="Wpisz nazwę powiatu..."
              onSelect={handleCountySelect}
              theme="light"
              showClearButton={true}
            />
          </SearchContainer>
          {selectedCounty && (
            <ResultsSection>
              <ResultsTitle>
                <FaMapMarkerAlt />
                Wybrany powiat
              </ResultsTitle>
              <ResultItem>
                <ResultName>
                  {selectedCounty.name}
                  <ResultType>Powiat</ResultType>
                </ResultName>
                <ResultDetails>
                  {selectedCounty.voivodeshipName}
                </ResultDetails>
              </ResultItem>
            </ResultsSection>
          )}
        </SearchSection>

        <SearchSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie województw (TERC)
          </SectionTitle>
          <SearchContainer>
            <SearchLabel>Województwo</SearchLabel>
            <LocationAutocomplete
              type="voivodeships"
              placeholder="Wpisz nazwę województwa..."
              onSelect={handleVoivodeshipSelect}
              theme="light"
              showClearButton={true}
            />
          </SearchContainer>
          {selectedVoivodeship && (
            <ResultsSection>
              <ResultsTitle>
                <FaMapMarkerAlt />
                Wybrane województwo
              </ResultsTitle>
              <ResultItem>
                <ResultName>
                  {selectedVoivodeship.name}
                  <ResultType>Województwo</ResultType>
                </ResultName>
              </ResultItem>
            </ResultsSection>
          )}
        </SearchSection>

        <SearchSection>
          <SectionTitle>
            <FaSearch />
            Wyszukiwanie ulic (ULIC)
          </SectionTitle>
          <SearchContainer>
            <SearchLabel>Ulica</SearchLabel>
            <LocationAutocomplete
              type="streets"
              placeholder="Wpisz nazwę ulicy..."
              onSelect={handleStreetSelect}
              theme="light"
              showClearButton={true}
            />
          </SearchContainer>
          {selectedStreet && (
            <ResultsSection>
              <ResultsTitle>
                <FaMapMarkerAlt />
                Wybrana ulica
              </ResultsTitle>
              <ResultItem>
                <ResultName>
                  {selectedStreet.name}
                  <ResultType>Ulica</ResultType>
                </ResultName>
                <ResultDetails>
                  {selectedStreet.municipalityName}, {selectedStreet.countyName}, {selectedStreet.voivodeshipName}
                </ResultDetails>
              </ResultItem>
            </ResultsSection>
          )}
        </SearchSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaDatabase />
            </FeatureIcon>
            <FeatureTitle>Baza MongoDB</FeatureTitle>
            <FeatureDescription>
              Wyszukiwanie w Twojej bazie danych TERYT, SIMC i ULIC bez zewnętrznych API
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaSearch />
            </FeatureIcon>
            <FeatureTitle>Szybkie wyszukiwanie</FeatureTitle>
            <FeatureDescription>
              Wyszukiwanie rozpoczyna się po wpisaniu 2 znaków z opóźnieniem 200ms
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaMapMarkerAlt />
            </FeatureIcon>
            <FeatureTitle>Dane TERYT</FeatureTitle>
            <FeatureDescription>
              Pełne dane administracyjne: województwo, powiat, gmina, miejscowość, ulica
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaSearch />
            </FeatureIcon>
            <FeatureTitle>Nawigacja klawiaturą</FeatureTitle>
            <FeatureDescription>
              Pełna obsługa klawiszy strzałek, Enter, Escape dla wygodnego użytkowania
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </DemoContent>
    </DemoContainer>
  );
};

export default LocationDemo; 