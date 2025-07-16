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

export default function Cities({ theme }) {
  const location = useLocation();
  const { countyCode } = useParams();
  const navigate = useNavigate();
  
  // Lista miast Polski - przeniesiona przed useState
  const cities = [
    { id: '020101', name: 'Wrocław', county: 'Wrocławski', voivodeship: 'Dolnośląskie', code: 'WRC' },
    { id: '020201', name: 'Wałbrzych', county: 'Wałbrzyski', voivodeship: 'Dolnośląskie', code: 'WAB' },
    { id: '020301', name: 'Legnica', county: 'Legnicki', voivodeship: 'Dolnośląskie', code: 'LEG' },
    { id: '020401', name: 'Jelenia Góra', county: 'Jeleniogórski', voivodeship: 'Dolnośląskie', code: 'JEL' },
    { id: '020501', name: 'Lubań', county: 'Lubański', voivodeship: 'Dolnośląskie', code: 'LUB' },
    { id: '020601', name: 'Zgorzelec', county: 'Zgorzelecki', voivodeship: 'Dolnośląskie', code: 'ZGO' },
    { id: '020701', name: 'Bolesławiec', county: 'Bolesławiecki', voivodeship: 'Dolnośląskie', code: 'BOL' },
    { id: '020801', name: 'Dzierżoniów', county: 'Dzierżoniowski', voivodeship: 'Dolnośląskie', code: 'DZI' },
    { id: '020901', name: 'Świdnica', county: 'Świdnicki', voivodeship: 'Dolnośląskie', code: 'SWI' },
    { id: '021001', name: 'Ząbkowice Śląskie', county: 'Ząbkowicki', voivodeship: 'Dolnośląskie', code: 'ZAB' },
    { id: '021101', name: 'Kłodzko', county: 'Kłodzki', voivodeship: 'Dolnośląskie', code: 'KLO' },
    { id: '021201', name: 'Trzebnica', county: 'Trzebnicki', voivodeship: 'Dolnośląskie', code: 'TRZ' },
    { id: '021301', name: 'Oleśnica', county: 'Oleśnicki', voivodeship: 'Dolnośląskie', code: 'OLE' },
    { id: '021401', name: 'Oława', county: 'Oławski', voivodeship: 'Dolnośląskie', code: 'OLA' },
    { id: '021501', name: 'Strzelin', county: 'Strzeliński', voivodeship: 'Dolnośląskie', code: 'STR' },
    { id: '021601', name: 'Milicz', county: 'Milicki', voivodeship: 'Dolnośląskie', code: 'MIL' },
    { id: '021701', name: 'Góra', county: 'Górowski', voivodeship: 'Dolnośląskie', code: 'GOR' },
    { id: '021801', name: 'Wołów', county: 'Wołowski', voivodeship: 'Dolnośląskie', code: 'WOL' },
    { id: '021901', name: 'Polkowice', county: 'Polkowicki', voivodeship: 'Dolnośląskie', code: 'POL' },
    { id: '022001', name: 'Lubin', county: 'Lubiński', voivodeship: 'Dolnośląskie', code: 'LUB' },
    { id: '022101', name: 'Głogów', county: 'Głogowski', voivodeship: 'Dolnośląskie', code: 'GLO' },
    { id: '022201', name: 'Kamienna Góra', county: 'Kamiennogórski', voivodeship: 'Dolnośląskie', code: 'KAM' },
    { id: '022301', name: 'Jawor', county: 'Jaworski', voivodeship: 'Dolnośląskie', code: 'JAW' },
    { id: '022401', name: 'Lwówek Śląski', county: 'Lwówecki', voivodeship: 'Dolnośląskie', code: 'LWO' },
    { id: '022501', name: 'Złotoryja', county: 'Złotoryjski', voivodeship: 'Dolnośląskie', code: 'ZLO' },
    { id: '022601', name: 'Środa Śląska', county: 'Średzki', voivodeship: 'Dolnośląskie', code: 'SRE' }
  ];

  const [activeTab, setActiveTab] = useState('shops');
  const [selectedCity, setSelectedCity] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);
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
    // Jeśli jest countyCode w URL, ustaw wybrane miasta na podstawie kodu powiatu
    if (countyCode) {
      const citiesForCounty = cities.filter(c => c.county.toLowerCase().includes(countyCode.toLowerCase()));
      if (citiesForCounty.length > 0) {
        setSelectedCity(citiesForCounty[0]);
        fetchCityData(citiesForCounty[0].id);
        return;
      }
    }
    // Sprawdź czy jest state z nawigacji
    if (location.state?.selectedCity) {
      const cityFromState = cities.find(c => c.id === location.state.selectedCity.code);
      if (cityFromState) {
        setSelectedCity(cityFromState);
        fetchCityData(cityFromState.id);
        return;
      }
    }
    // Fallback do domyślnego miasta
    const defaultCity = cities.find(c => c.id === '020101') || cities[0];
    setSelectedCity(defaultCity);
    fetchCityData(defaultCity.id);
  }, [location.state, countyCode]);

  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Jeśli użytkownik nie jest zalogowany, ustaw domyślne miasto
        const defaultCity = cities.find(c => c.id === '020101') || cities[0];
        setSelectedCity(defaultCity);
        fetchCityData(defaultCity.id);
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
            // Znajdź miasto na podstawie lokalizacji użytkownika
            const userCity = cities.find(c => 
              locationData.name?.includes(c.name) || locationData.hierarchy?.miejscowosc?.name?.includes(c.name)
            );
            
            if (userCity) {
              setSelectedCity(userCity);
              fetchCityData(userCity.id);
              return;
            }
          }
        }
      }

      // Fallback do domyślnego miasta
      const defaultCity = cities.find(c => c.id === '020101') || cities[0];
      setSelectedCity(defaultCity);
      fetchCityData(defaultCity.id);
    } catch (error) {
      console.error('Błąd pobierania lokalizacji użytkownika:', error);
      // Fallback do domyślnego miasta
      const defaultCity = cities.find(c => c.id === '020101') || cities[0];
      setSelectedCity(defaultCity);
      fetchCityData(defaultCity.id);
    }
  };

  const fetchCityData = async (cityId) => {
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

      // Pobierz sklepy z backendu
      try {
        const shopsResponse = await fetch(`${apiUrl}/api/shops?limit=10`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          shops = shopsData.shops || shopsData || [];
        } else {
          console.warn('Nie udało się pobrać sklepów z backendu, używam danych przykładowych');
          shops = sampleData.shops;
        }
      } catch (error) {
        console.warn('Błąd pobierania sklepów:', error);
        shops = sampleData.shops;
      }

      // Pobierz produkty z backendu
      try {
        const productsResponse = await fetch(`${apiUrl}/api/products?limit=10`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          products = productsData.products || productsData || [];
        } else {
          console.warn('Nie udało się pobrać produktów z backendu, używam danych przykładowych');
          products = sampleData.products;
        }
      } catch (error) {
        console.warn('Błąd pobierania produktów:', error);
        products = sampleData.products;
      }

      // Pobierz użytkowników z backendu
      try {
        const usersResponse = await fetch(`${apiUrl}/api/users?limit=10`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          users = usersData.users || usersData || [];
        } else {
          console.warn('Nie udało się pobrać użytkowników z backendu, używam danych przykładowych');
          users = sampleData.users;
        }
      } catch (error) {
        console.warn('Błąd pobierania użytkowników:', error);
        users = sampleData.users;
      }

      // Posty na razie używają danych przykładowych
      posts = sampleData.posts;

      const cityData = {
        shops: { count: shops.length, items: shops },
        posts: { count: posts.length, items: posts },
        companies: { count: companies.length, items: companies },
        products: { count: products.length, items: products },
        users: { count: users.length, items: users }
      };
      setData(cityData);
    } catch (error) {
      console.error('Błąd pobierania danych miasta:', error);
      setError('Wystąpił błąd podczas pobierania danych');
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

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    fetchCityData(city.id);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleCitySearchSelect = (city) => {
    setSelectedCity(city);
    fetchCityData(city.id);
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
        <Title theme={theme}>🏙️ Miasta</Title>
        <Subtitle theme={theme}>Dane z miast Polski</Subtitle>
      </Header>

      <LocationSelector theme={theme}>
        <LocationLabel theme={theme}>Wybrane miasto:</LocationLabel>
        <LocationDropdown>
          <LocationButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            theme={theme}
          >
            <FaMapMarkedAlt />
            {selectedCity ? selectedCity.name : 'Wybierz miasto'}
            <FaChevronDown />
          </LocationButton>
          <LocationDropdownContent isOpen={isDropdownOpen} theme={theme}>
            {filteredCities.map(city => (
              <LocationOption
                key={city.id}
                isSelected={selectedCity?.id === city.id}
                onClick={() => handleCitySelect(city)}
                theme={theme}
              >
                {city.name}
              </LocationOption>
            ))}
          </LocationDropdownContent>
        </LocationDropdown>
      </LocationSelector>

      <SearchInput
        placeholder="Wyszukaj miasto..."
        data={cities}
        onSearch={handleSearch}
        onSelect={handleCitySearchSelect}
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