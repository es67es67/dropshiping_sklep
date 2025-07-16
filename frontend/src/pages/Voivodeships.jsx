import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
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

const LinkCell = styled.span`
  color: ${props => props.theme.primary};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.primary}cc;
    text-decoration: underline;
  }
`;

export default function Voivodeships({ theme }) {
  const location = useLocation();
  const { voivodeshipCode } = useParams();
  const navigate = useNavigate();
  
  // Lista województw Polski - przeniesiona przed useState
  const voivodeships = [
    { id: '02', name: 'Dolnośląskie', code: 'DS' },
    { id: '04', name: 'Kujawsko-pomorskie', code: 'KP' },
    { id: '06', name: 'Lubelskie', code: 'LU' },
    { id: '08', name: 'Lubuskie', code: 'LB' },
    { id: '10', name: 'Łódzkie', code: 'LD' },
    { id: '12', name: 'Małopolskie', code: 'MA' },
    { id: '14', name: 'Mazowieckie', code: 'MZ' },
    { id: '16', name: 'Opolskie', code: 'OP' },
    { id: '18', name: 'Podkarpackie', code: 'PK' },
    { id: '20', name: 'Podlaskie', code: 'PD' },
    { id: '22', name: 'Pomorskie', code: 'PM' },
    { id: '24', name: 'Śląskie', code: 'SL' },
    { id: '26', name: 'Świętokrzyskie', code: 'SK' },
    { id: '28', name: 'Warmińsko-mazurskie', code: 'WN' },
    { id: '30', name: 'Wielkopolskie', code: 'WP' },
    { id: '32', name: 'Zachodniopomorskie', code: 'ZP' }
  ];

  const [activeTab, setActiveTab] = useState('shops');
  const [selectedVoivodeship, setSelectedVoivodeship] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredVoivodeships, setFilteredVoivodeships] = useState(voivodeships);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Przykładowe dane dla każdej kategorii - używam prawdziwych ID z bazy
  const sampleData = {
    shops: [
      { _id: '6875773831cf77c7af5e07b4', name: 'Sklep Elektroniczny TechMax', location: 'Wrocław', rating: 4.8, products: 156, created: '2024-01-15' },
      { _id: '6875773831cf77c7af5e07b5', name: 'Butik Mody Elegance', location: 'Wrocław', rating: 4.6, products: 89, created: '2024-01-10' },
      { _id: '6875773831cf77c7af5e07b6', name: 'Sklep Sportowy ActiveLife', location: 'Wrocław', rating: 4.9, products: 234, created: '2024-01-08' },
      { _id: '6875773831cf77c7af5e07b7', name: 'Księgarnia Literacka', location: 'Wrocław', rating: 4.7, products: 567, created: '2024-01-12' },
      { _id: '6875773831cf77c7af5e07b8', name: 'Sklep Ogrodniczy Zielony', location: 'Wrocław', rating: 4.5, products: 123, created: '2024-01-05' }
    ],
    posts: [
      { _id: '6875773831cf77c7af5e07b9', title: 'Nowe trendy w modzie 2024', author: 'Anna Kowalska', location: 'Wrocław', likes: 156, created: '2024-01-15' },
      { _id: '6875773831cf77c7af5e07ba', title: 'Recenzja nowego smartfona', author: 'Piotr Nowak', location: 'Wrocław', likes: 89, created: '2024-01-14' },
      { _id: '6875773831cf77c7af5e07bb', title: 'Przepis na domowe ciasto', author: 'Maria Wiśniewska', location: 'Wrocław', likes: 234, created: '2024-01-13' },
      { _id: '6875773831cf77c7af5e07bc', title: 'Porady ogrodnicze', author: 'Jan Kowalczyk', location: 'Wrocław', likes: 67, created: '2024-01-12' },
      { _id: '6875773831cf77c7af5e07bd', title: 'Recenzja restauracji', author: 'Katarzyna Zielińska', location: 'Wrocław', likes: 123, created: '2024-01-11' }
    ],
    companies: [
      { _id: '6875773831cf77c7af5e07b4', name: 'TechCorp Sp. z o.o.', industry: 'Technologia', location: 'Wrocław', employees: 150, rating: 4.8 },
      { _id: '6875773831cf77c7af5e07ba', name: 'Fashion House', industry: 'Moda', location: 'Wrocław', employees: 45, rating: 4.6 },
      { _id: '6875773831cf77c7af5e07bb', name: 'Green Solutions', industry: 'Ekologia', location: 'Wrocław', employees: 78, rating: 4.9 },
      { _id: '6875773831cf77c7af5e07bc', name: 'Digital Agency', industry: 'Marketing', location: 'Wrocław', employees: 32, rating: 4.7 },
      { _id: '6875773831cf77c7af5e07bd', name: 'Food & Beverage Co.', industry: 'Gastronomia', location: 'Wrocław', employees: 120, rating: 4.5 }
    ],
    products: [
      { _id: '6875773831cf77c7af5e07be', name: 'iPhone 15 Pro', category: 'Elektronika', price: '4999 zł', rating: 4.9, location: 'Wrocław' },
      { _id: '6875773831cf77c7af5e07bf', name: 'Sukienka wieczorowa', category: 'Moda', price: '299 zł', rating: 4.7, location: 'Wrocław' },
      { _id: '6875773831cf77c7af5e07c0', name: 'Nike Air Max', category: 'Sport', price: '599 zł', rating: 4.8, location: 'Wrocław' },
      { _id: '6875773831cf77c7af5e07c1', name: 'Książka "Władca Pierścieni"', category: 'Książki', price: '89 zł', rating: 4.9, location: 'Wrocław' },
      { _id: '6875773831cf77c7af5e07c2', name: 'Roślina doniczkowa', category: 'Ogród', price: '45 zł', rating: 4.6, location: 'Wrocław' }
    ],
    users: [
      { _id: '6875773831cf77c7af5e07c3', name: 'Anna Kowalska', location: 'Wrocław', posts: 23, followers: 156, joined: '2023-03-15' },
      { _id: '6875773831cf77c7af5e07c4', name: 'Piotr Nowak', location: 'Wrocław', posts: 15, followers: 89, joined: '2023-05-20' },
      { _id: '6875773831cf77c7af5e07c5', name: 'Maria Wiśniewska', location: 'Wrocław', posts: 34, followers: 234, joined: '2023-02-10' },
      { _id: '6875773831cf77c7af5e07c6', name: 'Jan Kowalczyk', location: 'Wrocław', posts: 8, followers: 67, joined: '2023-07-05' },
      { _id: '6875773831cf77c7af5e07c7', name: 'Katarzyna Zielińska', location: 'Wrocław', posts: 19, followers: 123, joined: '2023-04-12' }
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
    // Jeśli jest voivodeshipCode w URL, ustaw wybrane województwo na podstawie kodu
    if (voivodeshipCode) {
      const voivodeshipFromUrl = voivodeships.find(v => v.id === voivodeshipCode || v.code.toLowerCase() === voivodeshipCode.toLowerCase());
      if (voivodeshipFromUrl) {
        setSelectedVoivodeship(voivodeshipFromUrl);
        fetchVoivodeshipData(voivodeshipFromUrl.id);
        return;
      }
    }
    // Sprawdź czy jest state z nawigacji
    if (location.state?.selectedVoivodeship) {
      const voivodeshipFromState = voivodeships.find(v => v.id === location.state.selectedVoivodeship.code);
      if (voivodeshipFromState) {
        setSelectedVoivodeship(voivodeshipFromState);
        fetchVoivodeshipData(voivodeshipFromState.id);
        return;
      }
    }
    // Fallback do domyślnego województwa
    const defaultVoivodeship = voivodeships.find(v => v.id === '14') || voivodeships[0];
    setSelectedVoivodeship(defaultVoivodeship);
    fetchVoivodeshipData(defaultVoivodeship.id);
  }, [location.state, voivodeshipCode]);

  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Jeśli użytkownik nie jest zalogowany, ustaw domyślne województwo
        const defaultVoivodeship = voivodeships.find(v => v.id === '14') || voivodeships[0];
        setSelectedVoivodeship(defaultVoivodeship);
        fetchVoivodeshipData(defaultVoivodeship.id);
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
            // Znajdź województwo na podstawie lokalizacji użytkownika
            const userVoivodeship = voivodeships.find(v => 
              locationData.name?.includes(v.name) || locationData.hierarchy?.wojewodztwo?.name?.includes(v.name)
            );
            
            if (userVoivodeship) {
              setSelectedVoivodeship(userVoivodeship);
              fetchVoivodeshipData(userVoivodeship.id);
              return;
            }
          }
        }
      }

      // Fallback do domyślnego województwa
      const defaultVoivodeship = voivodeships.find(v => v.id === '14') || voivodeships[0];
      setSelectedVoivodeship(defaultVoivodeship);
      fetchVoivodeshipData(defaultVoivodeship.id);
    } catch (error) {
      console.error('Błąd pobierania lokalizacji użytkownika:', error);
      // Fallback do domyślnego województwa
      const defaultVoivodeship = voivodeships.find(v => v.id === '14') || voivodeships[0];
      setSelectedVoivodeship(defaultVoivodeship);
      fetchVoivodeshipData(defaultVoivodeship.id);
    }
  };

  const fetchVoivodeshipData = async (voivodeshipId) => {
    try {
      setLoading(true);
      setError(null);

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
    fetchVoivodeshipData(voivodeship.id);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredVoivodeships(voivodeships);
    } else {
      const filtered = voivodeships.filter(voivodeship =>
        voivodeship.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVoivodeships(filtered);
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
        return (
          <>
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/shop/${item._id}`)}>{item.name}</LinkCell>
            </TableCell>
            <TableCell theme={theme}>{item.location}</TableCell>
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
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/posts/${item._id}`)}>{item.title}</LinkCell>
            </TableCell>
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/users/${item.authorId || '6875773831cf77c7af5e07c3'}`)}>{item.author}</LinkCell>
            </TableCell>
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
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/company-profiles/${item._id}`)}>{item.name}</LinkCell>
            </TableCell>
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
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/products/${item._id}`)}>{item.name}</LinkCell>
            </TableCell>
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
            <TableCell theme={theme}>
              <LinkCell theme={theme} onClick={() => navigate(`/users/${item._id}`)}>{item.name}</LinkCell>
            </TableCell>
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

    // Sprawdź czy currentData istnieje
    if (!currentData || !currentData.items) {
      return <LoadingSpinner theme={theme}>Ładowanie danych...</LoadingSpinner>;
    }

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
          
          {currentData.items.map((item, index) => (
            <TableRow key={item._id || index} theme={theme}>
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
        <Title theme={theme}>🏛️ Województwa</Title>
        <Subtitle theme={theme}>Dane z województw Polski</Subtitle>
      </Header>

      <LocationSelector theme={theme}>
        <LocationLabel theme={theme}>Wybrane województwo:</LocationLabel>
        <LocationDropdown>
          <LocationButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            theme={theme}
          >
            <FaMapMarkedAlt />
            {selectedVoivodeship ? selectedVoivodeship.name : 'Wybierz województwo'}
            <FaChevronDown />
          </LocationButton>
          <LocationDropdownContent isOpen={isDropdownOpen} theme={theme}>
            {filteredVoivodeships.map(voivodeship => (
              <LocationOption
                key={voivodeship.id}
                isSelected={selectedVoivodeship?.id === voivodeship.id}
                onClick={() => handleVoivodeshipSelect(voivodeship)}
                theme={theme}
              >
                {voivodeship.name}
              </LocationOption>
            ))}
          </LocationDropdownContent>
        </LocationDropdown>
      </LocationSelector>

      <SearchInput
        placeholder="Wyszukaj województwo..."
        data={voivodeships}
        onSearch={handleSearch}
        onSelect={handleVoivodeshipSearchSelect}
        searchKey="name"
        theme={theme}
        minChars={2}
        maxSuggestions={16}
      />

      <TabContainer theme={theme}>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            theme={theme}
          >
            {React.isValidElement(tab.icon) ? tab.icon : null} {tab.label}
          </Tab>
        ))}
      </TabContainer>

      <TabContent theme={theme}>
        {renderTabContent()}
      </TabContent>
    </Container>
  );
} 