import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStore, FaComments, FaBuilding, FaBox, FaUsers, FaStar, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

const LocationInfo = styled.div`
  background: ${props => props.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
`;

const LocationCode = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const LocationType = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${props => props.$active ? props.theme.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.primary}20;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const LocationTemplate = ({ 
  theme, 
  locationType, 
  locationName, 
  locationCode, 
  locationId,
  apiEndpoint,
  title,
  subtitle 
}) => {
  const [activeTab, setActiveTab] = useState('shops');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'shops', label: 'Sklepy', icon: <FaStore /> },
    { id: 'posts', label: 'Posty', icon: <FaComments /> },
    { id: 'companies', label: 'Firmy', icon: <FaBuilding /> },
    { id: 'products', label: 'Produkty', icon: <FaBox /> },
    { id: 'users', label: 'Użytkownicy', icon: <FaUsers /> }
  ];

  // Przykładowe dane dla każdej kategorii
  const sampleData = {
    shops: [
      { id: 1, name: 'Sklep Elektroniczny TechMax', location: 'Warszawa', rating: 4.8, products: 156, created: '2024-01-15' },
      { id: 2, name: 'Butik Mody Elegance', location: 'Kraków', rating: 4.6, products: 89, created: '2024-01-10' },
      { id: 3, name: 'Sklep Sportowy ActiveLife', location: 'Wrocław', rating: 4.9, products: 234, created: '2024-01-08' },
      { id: 4, name: 'Księgarnia Literacka', location: 'Poznań', rating: 4.7, products: 567, created: '2024-01-12' },
      { id: 5, name: 'Sklep Ogrodniczy Zielony', location: 'Gdańsk', rating: 4.5, products: 123, created: '2024-01-05' }
    ],
    posts: [
      { id: 1, title: 'Nowe trendy w modzie 2024', author: 'Anna Kowalska', location: 'Warszawa', likes: 156, created: '2024-01-15' },
      { id: 2, title: 'Recenzja nowego smartfona', author: 'Piotr Nowak', location: 'Kraków', likes: 89, created: '2024-01-14' },
      { id: 3, title: 'Przepis na domowe ciasto', author: 'Maria Wiśniewska', location: 'Wrocław', likes: 234, created: '2024-01-13' },
      { id: 4, title: 'Porady ogrodnicze', author: 'Jan Kowalczyk', location: 'Poznań', likes: 67, created: '2024-01-12' },
      { id: 5, title: 'Recenzja restauracji', author: 'Katarzyna Zielińska', location: 'Gdańsk', likes: 123, created: '2024-01-11' }
    ],
    companies: [
      { id: 1, name: 'TechCorp Sp. z o.o.', industry: 'Technologia', location: 'Warszawa', employees: 150, rating: 4.8 },
      { id: 2, name: 'Fashion House', industry: 'Moda', location: 'Kraków', employees: 45, rating: 4.6 },
      { id: 3, name: 'Green Solutions', industry: 'Ekologia', location: 'Wrocław', employees: 78, rating: 4.9 },
      { id: 4, name: 'Digital Agency', industry: 'Marketing', location: 'Poznań', employees: 32, rating: 4.7 },
      { id: 5, name: 'Food & Beverage Co.', industry: 'Gastronomia', location: 'Gdańsk', employees: 120, rating: 4.5 }
    ],
    products: [
      { id: 1, name: 'iPhone 15 Pro', category: 'Elektronika', price: '4999 zł', rating: 4.9, location: 'Warszawa' },
      { id: 2, name: 'Sukienka wieczorowa', category: 'Moda', price: '299 zł', rating: 4.7, location: 'Kraków' },
      { id: 3, name: 'Nike Air Max', category: 'Sport', price: '599 zł', rating: 4.8, location: 'Wrocław' },
      { id: 4, name: 'Książka "Władca Pierścieni"', category: 'Książki', price: '89 zł', rating: 4.9, location: 'Poznań' },
      { id: 5, name: 'Roślina doniczkowa', category: 'Ogród', price: '45 zł', rating: 4.6, location: 'Gdańsk' }
    ],
    users: [
      { id: 1, name: 'Anna Kowalska', location: 'Warszawa', posts: 23, followers: 156, joined: '2023-03-15' },
      { id: 2, name: 'Piotr Nowak', location: 'Kraków', posts: 15, followers: 89, joined: '2023-05-20' },
      { id: 3, name: 'Maria Wiśniewska', location: 'Wrocław', posts: 34, followers: 234, joined: '2023-02-10' },
      { id: 4, name: 'Jan Kowalczyk', location: 'Poznań', posts: 8, followers: 67, joined: '2023-07-05' },
      { id: 5, name: 'Katarzyna Zielińska', location: 'Gdańsk', posts: 19, followers: 123, joined: '2023-04-12' }
    ]
  };

  useEffect(() => {
    fetchLocationData();
  }, [locationId, apiEndpoint]);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Pobierz dane z API
      const response = await fetch(`${apiUrl}${apiEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych z bazy danych');
      }

      const responseData = await response.json();
      
      // Pobierz sklepy dla tej lokalizacji
      let shops = [];
      try {
        let shopsEndpoint = `${apiUrl}/api/shops?limit=100`;
        
        // Dodaj odpowiedni filtr według typu lokalizacji
        if (locationType === 'województwo') {
          shopsEndpoint += `&voivodeshipCode=${locationCode}`;
        } else if (locationType === 'powiat') {
          shopsEndpoint += `&countyCode=${locationCode}`;
        } else if (locationType === 'gmina') {
          shopsEndpoint += `&municipalityCode=${locationCode}`;
        } else if (locationType === 'miasto' || locationType === 'miejscowość') {
          shopsEndpoint += `&simcCode=${locationCode}`;
        }
        
        console.log('Pobieram sklepy z:', shopsEndpoint);
        
        const shopsResponse = await fetch(shopsEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          shops = shopsData.shops || shopsData.data || [];
          console.log('Pobrano sklepów:', shops.length);
        } else {
          console.warn('Nie udało się pobrać sklepów:', shopsResponse.status);
        }
      } catch (shopsError) {
        console.error('Błąd pobierania sklepów:', shopsError);
      }
      
      // Przekształć dane sklepów do formatu używanego w tabeli
      const transformedShops = shops.map((shop, index) => ({
        id: shop._id || shop.id || index + 1,
        name: shop.name || 'Brak nazwy',
        location: shop.address?.city || shop.location?.name || 'Brak lokalizacji',
        rating: shop.ratings?.average || shop.rating || 0,
        products: shop.stats?.totalProducts || 0,
        created: shop.createdAt ? new Date(shop.createdAt).toISOString().split('T')[0] : 'Brak daty'
      }));

      // Użyj przykładowych danych dla pozostałych kategorii
      const mockData = {
        shops: { count: transformedShops.length, items: transformedShops },
        posts: { count: 3400, items: sampleData.posts },
        companies: { count: 890, items: sampleData.companies },
        products: { count: 15600, items: sampleData.products },
        users: { count: 8900, items: sampleData.users }
      };

      setData(mockData);
    } catch (err) {
      setError('Błąd podczas pobierania danych z bazy');
      console.error('Błąd pobierania danych lokalizacji:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTableHeaders = () => {
    const headers = {
      shops: ['Nazwa sklepu', 'Lokalizacja', 'Ocena', 'Produkty', 'Data utworzenia'],
      posts: ['Tytuł postu', 'Autor', 'Lokalizacja', 'Polubienia', 'Data utworzenia'],
      companies: ['Nazwa firmy', 'Branża', 'Lokalizacja', 'Pracownicy', 'Ocena'],
      products: ['Nazwa produktu', 'Kategoria', 'Cena', 'Ocena', 'Lokalizacja'],
      users: ['Nazwa użytkownika', 'Lokalizacja', 'Posty', 'Obserwujący', 'Data dołączenia']
    };

    return (
      <TableHeader>
        {headers[activeTab].map((header, index) => (
          <div key={index}>{header}</div>
        ))}
      </TableHeader>
    );
  };

  const renderTableRow = (item) => {
    const cells = {
      shops: [
        <TableCell key="name">
          <FaStore />
          {item.name}
        </TableCell>,
        <TableCell key="location">
          <FaMapMarkerAlt />
          {item.location}
        </TableCell>,
        <TableCell key="rating">
          <FaStar />
          {item.rating.toFixed(1)}
        </TableCell>,
        <TableCell key="products">
          <FaBox />
          {item.products}
        </TableCell>,
        <TableCell key="created">
          <FaCalendar />
          {item.created}
        </TableCell>
      ],
      posts: [
        <TableCell key="title">{item.title}</TableCell>,
        <TableCell key="author">{item.author}</TableCell>,
        <TableCell key="location">
          <FaMapMarkerAlt />
          {item.location}
        </TableCell>,
        <TableCell key="likes">{item.likes}</TableCell>,
        <TableCell key="created">
          <FaCalendar />
          {item.created}
        </TableCell>
      ],
      companies: [
        <TableCell key="name">{item.name}</TableCell>,
        <TableCell key="industry">{item.industry}</TableCell>,
        <TableCell key="location">
          <FaMapMarkerAlt />
          {item.location}
        </TableCell>,
        <TableCell key="employees">{item.employees}</TableCell>,
        <TableCell key="rating">
          <FaStar />
          {item.rating.toFixed(1)}
        </TableCell>
      ],
      products: [
        <TableCell key="name">{item.name}</TableCell>,
        <TableCell key="category">{item.category}</TableCell>,
        <TableCell key="price">{item.price}</TableCell>,
        <TableCell key="rating">
          <FaStar />
          {item.rating.toFixed(1)}
        </TableCell>,
        <TableCell key="location">
          <FaMapMarkerAlt />
          {item.location}
        </TableCell>
      ],
      users: [
        <TableCell key="name">{item.name}</TableCell>,
        <TableCell key="location">
          <FaMapMarkerAlt />
          {item.location}
        </TableCell>,
        <TableCell key="posts">{item.posts}</TableCell>,
        <TableCell key="followers">{item.followers}</TableCell>,
        <TableCell key="joined">
          <FaCalendar />
          {item.joined}
        </TableCell>
      ]
    };

    return (
      <TableRow key={item.id}>
        {cells[activeTab]}
      </TableRow>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner>Ładowanie danych...</LoadingSpinner>;
    }

    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    const currentData = data[activeTab];
    
    if (!currentData || !currentData.items || currentData.items.length === 0) {
      return <EmptyMessage>Brak danych do wyświetlenia</EmptyMessage>;
    }

    return (
      <>
        <StatsGrid>
          <StatCard>
            <StatNumber>{currentData.count}</StatNumber>
            <StatLabel>Łączna liczba</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{currentData.items.length}</StatNumber>
            <StatLabel>Wyświetlane</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {activeTab === 'shops' && currentData.items.length > 0
                ? (currentData.items.reduce((sum, item) => sum + (item.rating || 0), 0) / currentData.items.length).toFixed(1)
                : '0.0'}
            </StatNumber>
            <StatLabel>Średnia ocena</StatLabel>
          </StatCard>
        </StatsGrid>

        <DataTable>
          {renderTableHeaders()}
          {currentData.items.map(renderTableRow)}
        </DataTable>
      </>
    );
  };

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      {locationCode && (
        <LocationInfo>
          <LocationCode>Kod GUS: {locationCode}</LocationCode>
          <LocationType>{locationType}</LocationType>
        </LocationInfo>
      )}

      <TabContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </Tab>
        ))}
      </TabContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>
    </Container>
  );
};

export default LocationTemplate; 