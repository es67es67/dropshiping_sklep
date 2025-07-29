import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import LocationTemplate from '../components/LocationTemplate';
import LocationSelector from '../components/LocationSelector';
import AlphabeticalCitySelector from '../components/AlphabeticalCitySelector';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
`;

const VoivodeshipSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SelectorLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const VoivodeshipDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const VoivodeshipButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}dd;
  }
`;

const VoivodeshipDropdownContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'theme'].includes(prop)
})`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const VoivodeshipOption = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'theme'].includes(prop)
})`
  padding: 0.75rem 1rem;
  cursor: pointer;
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

  ${props => props.isSelected && `
    background: ${props.theme.primary}20;
    color: ${props.theme.primary};
    font-weight: 500;
  `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

// Dane województw według kodów GUS
const voivodeshipsData = [
  { code: '02', name: 'DOLNOŚLĄSKIE' },
  { code: '04', name: 'KUJAWSKO-POMORSKIE' },
  { code: '06', name: 'LUBELSKIE' },
  { code: '08', name: 'LUBUSKIE' },
  { code: '10', name: 'ŁÓDZKIE' },
  { code: '12', name: 'MAŁOPOLSKIE' },
  { code: '14', name: 'MAZOWIECKIE' },
  { code: '16', name: 'OPOLSKIE' },
  { code: '18', name: 'PODKARPACKIE' },
  { code: '20', name: 'PODLASKIE' },
  { code: '22', name: 'POMORSKIE' },
  { code: '24', name: 'ŚLĄSKIE' },
  { code: '26', name: 'ŚWIĘTOKRZYSKIE' },
  { code: '28', name: 'WARMIŃSKO-MAZURSKIE' },
  { code: '30', name: 'WIELKOPOLSKIE' },
  { code: '32', name: 'ZACHODNIOPOMORSKIE' }
];

export default function Voivodeships({ theme }) {
  const { getUserTeryt, getUserLocation } = useAuth();
  const [selectedVoivodeship, setSelectedVoivodeship] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobierz lokalizację użytkownika
  const userTeryt = getUserTeryt();
  const userLocation = getUserLocation();

  useEffect(() => {
    // Automatycznie ustaw województwo na podstawie lokalizacji użytkownika
    if (userTeryt?.voivodeshipCode) {
      const userVoivodeship = voivodeshipsData.find(v => v.code === userTeryt.voivodeshipCode);
      if (userVoivodeship) {
        setSelectedVoivodeship(userVoivodeship);
        return;
      }
    }
    // Sprawdź czy jest state z nawigacji
    if (location.state?.selectedVoivodeship) {
      const voivodeshipFromState = voivodeshipsData.find(v => v.code === location.state.selectedVoivodeship.code);
      if (voivodeshipFromState) {
        setSelectedVoivodeship(voivodeshipFromState);
        fetchVoivodeshipData(voivodeshipFromState.code);
        return;
      }
    }
    // Fallback do domyślnego województwa
    const defaultVoivodeship = voivodeshipsData.find(v => v.code === '14') || voivodeshipsData[0];
    setSelectedVoivodeship(defaultVoivodeship);
    fetchVoivodeshipData(defaultVoivodeship.code);
  }, [location.state, userTeryt?.voivodeshipCode, voivodeshipsData]);

  const fetchVoivodeshipData = async (voivodeshipId) => {
    try {
      setLoading(true);
      setError(null);

      // Ustaw dane przykładowe na początku, aby uniknąć migania
      const fallbackData = {
        shops: { count: sampleData.shops.length, items: sampleData.shops },
        posts: { count: sampleData.posts.length, items: sampleData.posts },
        companies: { count: sampleData.companies.length, items: sampleData.companies },
        products: { count: sampleData.products.length, items: sampleData.products },
        users: { count: sampleData.users.length, items: sampleData.users }
      };
      setData(fallbackData);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // Pobierz prawdziwe dane z backendu
      let companies = [];
      let shops = [];
      let posts = [];
      let products = [];
      let users = [];

      // Pobierz firmy z backendu
      try {
        const companiesResponse = await fetch(`${apiUrl}/api/company-profiles/list?limit=10`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          companies = companiesData.companyProfiles || companiesData.companies || [];
        } else {
          console.warn('Nie udało się pobrać firm z backendu, używam danych przykładowych');
          companies = sampleData.companies;
        }
      } catch (error) {
        console.warn('Błąd pobierania firm:', error);
        companies = sampleData.companies;
      }

      // Pobierz sklepy z backendu (jeśli endpoint istnieje)
      try {
        const shopsResponse = await fetch(`${apiUrl}/api/shops?limit=10`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          shops = shopsData.shops || shopsData.data || [];
        } else {
          console.warn('Nie udało się pobrać sklepów z backendu, używam danych przykładowych');
          shops = sampleData.shops;
        }
      } catch (error) {
        console.warn('Błąd pobierania sklepów:', error);
        shops = sampleData.shops;
      }

      // Użyj danych przykładowych dla pozostałych kategorii
      posts = sampleData.posts;
      products = sampleData.products;
      users = sampleData.users;

      const mockData = {
        shops: { count: shops.length, items: shops },
        posts: { count: posts.length, items: posts },
        companies: { count: companies.length, items: companies },
        products: { count: products.length, items: products },
        users: { count: users.length, items: users }
      };

      setData(mockData);
    } catch (err) {
      setError('Błąd podczas pobierania danych województwa');
      console.error('Błąd pobierania danych województwa:', err);
      
      // Fallback do danych przykładowych
      const fallbackData = {
        shops: { count: sampleData.shops.length, items: sampleData.shops },
        posts: { count: sampleData.posts.length, items: sampleData.posts },
        companies: { count: sampleData.companies.length, items: sampleData.companies },
        products: { count: sampleData.products.length, items: sampleData.products },
        users: { count: sampleData.users.length, items: sampleData.users }
      };
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleVoivodeshipSelect = (voivodeship) => {
    setSelectedVoivodeship(voivodeship);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationChange = async (locationData) => {
    try {
      // Aktualizuj wybrane województwo na podstawie nowych danych
      if (locationData.teryt?.voivodeshipCode) {
        const newVoivodeship = voivodeshipsData.find(v => v.code === locationData.teryt.voivodeshipCode);
        if (newVoivodeship) {
          setSelectedVoivodeship(newVoivodeship);
        }
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji lokalizacji:', error);
    }
  };

  const handleVoivodeshipSearchSelect = (voivodeship) => {
    setSelectedVoivodeship(voivodeship);
    fetchVoivodeshipData(voivodeship.id);
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'shops':
        return ['Nazwa sklepu', 'Lokalizacja', 'Ocena', 'Produkty', 'Utworzono'];
      case 'posts':
        return ['Tytuł postu', 'Autor', 'Lokalizacja', 'Polubienia', 'Data'];
      case 'companies':
        return ['Nazwa firmy', 'Branża', 'Lokalizacja', 'Pracownicy', 'Ocena'];
      case 'products':
        return ['Nazwa produktu', 'Kategoria', 'Cena', 'Ocena', 'Lokalizacja'];
      case 'users':
        return ['Nazwa użytkownika', 'Lokalizacja', 'Posty', 'Obserwujący', 'Dołączył'];
      default:
        return [];
    }
  };

  const renderTableRow = (item) => {
    switch (activeTab) {
      case 'shops':
        return [
          item.name,
          item.location,
          `${item.rating} ⭐`,
          item.products,
          item.created
        ];
      case 'posts':
        return [
          item.title,
          item.author,
          item.location,
          item.likes,
          item.created
        ];
      case 'companies':
        return [
          item.name,
          item.industry,
          item.location,
          item.employees,
          `${item.rating} ⭐`
        ];
      case 'products':
        return [
          item.name,
          item.category,
          item.price,
          `${item.rating} ⭐`,
          item.location
        ];
      case 'users':
        return [
          item.name,
          item.location,
          item.posts,
          item.followers,
          item.joined
        ];
      default:
        return [];
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner theme={theme}>Ładowanie danych...</LoadingSpinner>;
    }

    if (error) {
      return <ErrorMessage theme={theme}>{error}</ErrorMessage>;
    }

    const currentData = data[activeTab];

    // Sprawdź czy currentData istnieje
    if (!currentData || !currentData.items) {
      return <LoadingSpinner theme={theme}>Ładowanie danych...</LoadingSpinner>;
    }
    return (
      <Container>
              <PageTitle title="Województwa" description="Przeglądaj województwa i ich dane" />
        <Header>
          <Title>Województwa</Title>
          <Subtitle>Wybierz województwo, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>

        <DataTable>
          <TableHeader theme={theme}>
            {renderTableHeaders().map((header, index) => (
              <div key={index}>{header}</div>
            ))}
          </TableHeader>
          
          {currentData.items.map((item, index) => (
            <TableRow key={item._id || index} theme={theme}>
              {renderTableRow(item).map((cell, cellIndex) => (
                <TableCell key={cellIndex} theme={theme}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </DataTable>
      </Container>
    );
  }

  // Jeśli nie wybrano województwa, pokaż selektor
  if (!selectedVoivodeship) {
    return (
      <Container>
        <PageTitle title="Województwa" description="Wybierz województwo" />
        <Header>
          <Title>Województwa</Title>
          <Subtitle>Wybierz województwo, aby zobaczyć szczegółowe dane</Subtitle>
        </Header>
        <LoadingSpinner theme={theme}>Ładowanie...</LoadingSpinner>
      </Container>
    );
  }

  // Jeśli wybrano województwo, pokaż szablon z danymi
  return (
    <Container>
      <PageTitle title={`Województwo ${selectedVoivodeship.name}`} description={`Dane dla województwa ${selectedVoivodeship.name}`} />
      <LocationSelector 
        theme={theme}
        currentLocation={selectedVoivodeship}
        onLocationChange={handleLocationChange}
      />
      
      <LocationTemplate
        theme={theme}
        locationType="województwo"
        locationName={selectedVoivodeship.name}
        locationCode={selectedVoivodeship.code}
        locationId={selectedVoivodeship.code}
        apiEndpoint={`/api/locations/voivodeships/${selectedVoivodeship.code}`}
        title={`Województwo ${selectedVoivodeship.name}`}
        subtitle={`Dane dla województwa ${selectedVoivodeship.name} (kod GUS: ${selectedVoivodeship.code})`}
      />
    </Container>
  );
} 