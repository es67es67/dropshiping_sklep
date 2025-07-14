import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStore, FaComments, FaBuilding, FaBox, FaUsers, FaMapMarkedAlt, FaChevronDown, FaStar, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import SearchInput from '../components/SearchInput';

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

const LocationSelector = styled.div`
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

const LocationLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const LocationDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const LocationButton = styled.button`
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

const LocationDropdownContent = styled.div.withConfig({
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

const LocationOption = styled.div.withConfig({
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active', 'theme'].includes(prop)
})`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary}20;
  }
`;

const TabContent = styled.div`
  min-height: 400px;
  padding: 2rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid ${props => props.theme.border};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
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

const DataTable = styled.div`
  margin-top: 2rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.primary}10;
  border-radius: 8px;
  font-weight: 600;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.text};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

export default function Counties({ theme }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCounties, setFilteredCounties] = useState(counties);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista powiatów (przykładowe dla Mazowieckiego)
  const counties = [
    { id: '0201', name: 'Warszawa', type: 'miasto na prawach powiatu', voivodeship: 'Mazowieckie' },
    { id: '0202', name: 'powiat grodziski', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0203', name: 'powiat legionowski', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0204', name: 'powiat nowodworski', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0205', name: 'powiat otwocki', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0206', name: 'powiat piaseczyński', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0207', name: 'powiat pruszkowski', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0208', name: 'powiat warszawski zachodni', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0209', name: 'powiat wołomiński', type: 'powiat', voivodeship: 'Mazowieckie' },
    { id: '0210', name: 'powiat żyrardowski', type: 'powiat', voivodeship: 'Mazowieckie' }
  ];

  // Przykładowe dane dla każdej kategorii
  const sampleData = {
    shops: [
      { id: 1, name: 'Sklep Elektroniczny TechMax', location: 'Warszawa', rating: 4.8, products: 156, created: '2024-01-15' },
      { id: 2, name: 'Butik Mody Elegance', location: 'Warszawa', rating: 4.6, products: 89, created: '2024-01-10' },
      { id: 3, name: 'Sklep Sportowy ActiveLife', location: 'Warszawa', rating: 4.9, products: 234, created: '2024-01-08' },
      { id: 4, name: 'Księgarnia Literacka', location: 'Warszawa', rating: 4.7, products: 567, created: '2024-01-12' },
      { id: 5, name: 'Sklep Ogrodniczy Zielony', location: 'Warszawa', rating: 4.5, products: 123, created: '2024-01-05' }
    ],
    posts: [
      { id: 1, title: 'Nowe trendy w modzie 2024', author: 'Anna Kowalska', location: 'Warszawa', likes: 156, created: '2024-01-15' },
      { id: 2, title: 'Recenzja nowego smartfona', author: 'Piotr Nowak', location: 'Warszawa', likes: 89, created: '2024-01-14' },
      { id: 3, title: 'Przepis na domowe ciasto', author: 'Maria Wiśniewska', location: 'Warszawa', likes: 234, created: '2024-01-13' },
      { id: 4, title: 'Porady ogrodnicze', author: 'Jan Kowalczyk', location: 'Warszawa', likes: 67, created: '2024-01-12' },
      { id: 5, title: 'Recenzja restauracji', author: 'Katarzyna Zielińska', location: 'Warszawa', likes: 123, created: '2024-01-11' }
    ],
    companies: [
      { id: 1, name: 'TechCorp Sp. z o.o.', industry: 'Technologia', location: 'Warszawa', employees: 150, rating: 4.8 },
      { id: 2, name: 'Fashion House', industry: 'Moda', location: 'Warszawa', employees: 45, rating: 4.6 },
      { id: 3, name: 'Green Solutions', industry: 'Ekologia', location: 'Warszawa', employees: 78, rating: 4.9 },
      { id: 4, name: 'Digital Agency', industry: 'Marketing', location: 'Warszawa', employees: 32, rating: 4.7 },
      { id: 5, name: 'Food & Beverage Co.', industry: 'Gastronomia', location: 'Warszawa', employees: 120, rating: 4.5 }
    ],
    products: [
      { id: 1, name: 'iPhone 15 Pro', category: 'Elektronika', price: '4999 zł', rating: 4.9, location: 'Warszawa' },
      { id: 2, name: 'Sukienka wieczorowa', category: 'Moda', price: '299 zł', rating: 4.7, location: 'Warszawa' },
      { id: 3, name: 'Nike Air Max', category: 'Sport', price: '599 zł', rating: 4.8, location: 'Warszawa' },
      { id: 4, name: 'Książka "Władca Pierścieni"', category: 'Książki', price: '89 zł', rating: 4.9, location: 'Warszawa' },
      { id: 5, name: 'Roślina doniczkowa', category: 'Ogród', price: '45 zł', rating: 4.6, location: 'Warszawa' }
    ],
    users: [
      { id: 1, name: 'Anna Kowalska', location: 'Warszawa', posts: 23, followers: 156, joined: '2023-03-15' },
      { id: 2, name: 'Piotr Nowak', location: 'Warszawa', posts: 15, followers: 89, joined: '2023-05-20' },
      { id: 3, name: 'Maria Wiśniewska', location: 'Warszawa', posts: 34, followers: 234, joined: '2023-02-10' },
      { id: 4, name: 'Jan Kowalczyk', location: 'Warszawa', posts: 8, followers: 67, joined: '2023-07-05' },
      { id: 5, name: 'Katarzyna Zielińska', location: 'Warszawa', posts: 19, followers: 123, joined: '2023-04-12' }
    ]
  };

  const tabs = [
    { id: 'shops', label: 'Sklepy', icon: <FaStore /> },
    { id: 'posts', label: 'Posty', icon: <FaComments /> },
    { id: 'companies', label: 'Firmy', icon: <FaBuilding /> },
    { id: 'products', label: 'Produkty', icon: <FaBox /> },
    { id: 'users', label: 'Użytkownicy', icon: <FaUsers /> }
  ];

  useEffect(() => {
    // Pobierz lokalizację użytkownika i ustaw jako domyślną
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Jeśli użytkownik nie jest zalogowany, ustaw domyślny powiat
        const defaultCounty = counties.find(c => c.id === '0201') || counties[0];
        setSelectedCounty(defaultCounty);
        fetchCountyData(defaultCounty.id);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.location) {
          // Pobierz szczegóły lokalizacji użytkownika
          const locationResponse = await fetch(`${apiUrl}/api/locations/${userData.location}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            // Znajdź powiat na podstawie lokalizacji użytkownika
            const userCounty = counties.find(c => 
              locationData.name?.includes(c.name) || locationData.hierarchy?.powiat?.name?.includes(c.name)
            );
            
            if (userCounty) {
              setSelectedCounty(userCounty);
              fetchCountyData(userCounty.id);
              return;
            }
          }
        }
      }

      // Fallback do domyślnego powiatu
      const defaultCounty = counties.find(c => c.id === '0201') || counties[0];
      setSelectedCounty(defaultCounty);
      fetchCountyData(defaultCounty.id);
    } catch (error) {
      console.error('Błąd pobierania lokalizacji użytkownika:', error);
      // Fallback do domyślnego powiatu
      const defaultCounty = counties.find(c => c.id === '0201') || counties[0];
      setSelectedCounty(defaultCounty);
      fetchCountyData(defaultCounty.id);
    }
  };

  const fetchCountyData = async (countyId) => {
    try {
      setLoading(true);
      setError(null);

      // Symulacja pobierania danych z API
      const mockData = {
        shops: { count: Math.floor(Math.random() * 100) + 20, items: sampleData.shops },
        posts: { count: Math.floor(Math.random() * 300) + 50, items: sampleData.posts },
        companies: { count: Math.floor(Math.random() * 80) + 15, items: sampleData.companies },
        products: { count: Math.floor(Math.random() * 1000) + 200, items: sampleData.products },
        users: { count: Math.floor(Math.random() * 500) + 100, items: sampleData.users }
      };

      setData(mockData);
    } catch (err) {
      setError('Błąd podczas pobierania danych powiatu');
      console.error('Błąd pobierania danych powiatu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountySelect = (county) => {
    setSelectedCounty(county);
    setIsDropdownOpen(false);
    fetchCountyData(county.id);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredCounties(counties);
    } else {
      const filtered = counties.filter(county =>
        county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county.voivodeship.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCounties(filtered);
    }
  };

  const handleCountySearchSelect = (county) => {
    setSelectedCounty(county);
    fetchCountyData(county.id);
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
        return (
          <>
            <TableCell theme={theme}>{item.name}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaMapMarkerAlt /> {item.location}
              </Location>
            </TableCell>
            <TableCell theme={theme}>
              <Rating>
                <FaStar /> {item.rating}
              </Rating>
            </TableCell>
            <TableCell theme={theme}>{item.products}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaCalendar /> {item.created}
              </Location>
            </TableCell>
          </>
        );
      case 'posts':
        return (
          <>
            <TableCell theme={theme}>{item.title}</TableCell>
            <TableCell theme={theme}>{item.author}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaMapMarkerAlt /> {item.location}
              </Location>
            </TableCell>
            <TableCell theme={theme}>{item.likes}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaCalendar /> {item.created}
              </Location>
            </TableCell>
          </>
        );
      case 'companies':
        return (
          <>
            <TableCell theme={theme}>{item.name}</TableCell>
            <TableCell theme={theme}>{item.industry}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaMapMarkerAlt /> {item.location}
              </Location>
            </TableCell>
            <TableCell theme={theme}>{item.employees}</TableCell>
            <TableCell theme={theme}>
              <Rating>
                <FaStar /> {item.rating}
              </Rating>
            </TableCell>
          </>
        );
      case 'products':
        return (
          <>
            <TableCell theme={theme}>{item.name}</TableCell>
            <TableCell theme={theme}>{item.category}</TableCell>
            <TableCell theme={theme}>{item.price}</TableCell>
            <TableCell theme={theme}>
              <Rating>
                <FaStar /> {item.rating}
              </Rating>
            </TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaMapMarkerAlt /> {item.location}
              </Location>
            </TableCell>
          </>
        );
      case 'users':
        return (
          <>
            <TableCell theme={theme}>{item.name}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaMapMarkerAlt /> {item.location}
              </Location>
            </TableCell>
            <TableCell theme={theme}>{item.posts}</TableCell>
            <TableCell theme={theme}>{item.followers}</TableCell>
            <TableCell theme={theme}>
              <Location theme={theme}>
                <FaCalendar /> {item.joined}
              </Location>
            </TableCell>
          </>
        );
      default:
        return null;
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

    return (
      <div>
        <StatsGrid>
          <StatCard theme={theme}>
            <StatNumber theme={theme}>{currentData?.count || 0}</StatNumber>
            <StatLabel theme={theme}>Łącznie {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}</StatLabel>
          </StatCard>
          <StatCard theme={theme}>
            <StatNumber theme={theme}>{(currentData?.count * 0.15).toFixed(0)}</StatNumber>
            <StatLabel theme={theme}>Aktywne dzisiaj</StatLabel>
          </StatCard>
          <StatCard theme={theme}>
            <StatNumber theme={theme}>{(currentData?.count * 0.08).toFixed(0)}</StatNumber>
            <StatLabel theme={theme}>Nowe w tym tygodniu</StatLabel>
          </StatCard>
        </StatsGrid>

        <DataTable>
          <TableHeader theme={theme}>
            {renderTableHeaders().map((header, index) => (
              <div key={index}>{header}</div>
            ))}
          </TableHeader>
          
          {currentData?.items?.map((item, index) => (
            <TableRow key={item.id || index} theme={theme}>
              {renderTableRow(item)}
            </TableRow>
          ))}
        </DataTable>
      </div>
    );
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>🏛️ Powiaty</Title>
        <Subtitle theme={theme}>Dane z powiatów Polski</Subtitle>
      </Header>

      <LocationSelector theme={theme}>
        <LocationLabel theme={theme}>Wybrany powiat:</LocationLabel>
        <LocationDropdown>
          <LocationButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            theme={theme}
          >
            <FaMapMarkedAlt />
            {selectedCounty ? selectedCounty.name : 'Wybierz powiat'}
            <FaChevronDown />
          </LocationButton>
          <LocationDropdownContent isOpen={isDropdownOpen} theme={theme}>
            {filteredCounties.map(county => (
              <LocationOption
                key={county.id}
                isSelected={selectedCounty?.id === county.id}
                onClick={() => handleCountySelect(county)}
                theme={theme}
              >
                {county.name} ({county.type})
              </LocationOption>
            ))}
          </LocationDropdownContent>
        </LocationDropdown>
      </LocationSelector>

      <SearchInput
        placeholder="Wyszukaj powiat..."
        data={counties}
        onSearch={handleSearch}
        onSelect={handleCountySearchSelect}
        searchKey="name"
        theme={theme}
        minChars={2}
        maxSuggestions={20}
      />

      <TabContainer theme={theme}>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            theme={theme}
          >
            {tab.icon} {tab.label}
          </Tab>
        ))}
      </TabContainer>

      <TabContent theme={theme}>
        {renderTabContent()}
      </TabContent>
    </Container>
  );
} 