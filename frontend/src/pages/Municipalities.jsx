import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStore, FaComments, FaBuilding, FaBox, FaUsers, FaMapMarkedAlt, FaChevronDown, FaStar, FaCalendar, FaMapMarkerAlt, FaExternalLinkAlt, FaIndustry, FaShoppingCart } from 'react-icons/fa';
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary};
  }
`;

const StatNumber = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
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
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  background: #e74c3c10;
  border-radius: 8px;
  margin: 1rem 0;
`;

const DataTable = styled.div`
  margin-top: 2rem;
`;

const TableHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
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

const TableRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !['theme'].includes(prop)
})`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export default function Municipalities({ theme }) {
  const { countyCode } = useParams();
  const location = useLocation();
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState({});
  
  // Nowe zmienne stanu dla sklepów i firm
  const [shops, setShops] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locationStats, setLocationStats] = useState({});
  const [shopSearch, setShopSearch] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [shopSort, setShopSort] = useState('name');
  const [companySearch, setCompanySearch] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companySort, setCompanySort] = useState('name');

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: <FaMapMarkedAlt /> },
    { id: 'shops', label: 'Sklepy', icon: <FaStore /> },
    { id: 'companies', label: 'Firmy', icon: <FaBuilding /> },
    { id: 'posts', label: 'Posty', icon: <FaComments /> },
    { id: 'users', label: 'Użytkownicy', icon: <FaUsers /> }
  ];

  // Lista gmin (przykładowe dla Warszawy)
  const municipalities = [
    { id: '020101', name: 'Warszawa', type: 'gmina miejska', county: 'Warszawa', population: 1783321 },
    { id: '020201', name: 'Grodzisk Mazowiecki', type: 'gmina miejsko-wiejska', county: 'powiat grodziski', population: 45000 },
    { id: '020202', name: 'Milanówek', type: 'gmina miejska', county: 'powiat grodziski', population: 16000 },
    { id: '020203', name: 'Podkowa Leśna', type: 'gmina miejska', county: 'powiat grodziski', population: 4000 },
    { id: '020204', name: 'Baranów', type: 'gmina wiejska', county: 'powiat grodziski', population: 12000 },
    { id: '020205', name: 'Jaktorów', type: 'gmina wiejska', county: 'powiat grodziski', population: 11000 },
    { id: '020206', name: 'Żabia Wola', type: 'gmina wiejska', county: 'powiat grodziski', population: 6500 },
    { id: '020301', name: 'Legionowo', type: 'gmina miejska', county: 'powiat legionowski', population: 54000 },
    { id: '020302', name: 'Serock', type: 'gmina miejsko-wiejska', county: 'powiat legionowski', population: 15000 },
    { id: '020303', name: 'Wieliszew', type: 'gmina wiejska', county: 'powiat legionowski', population: 12000 }
  ];

  // Przykładowe dane dla różnych zakładek
  const sampleData = {
    shops: [
      { id: 1, name: 'TechStore Warszawa', category: 'Elektronika', location: 'Warszawa, Mazowieckie', rating: 4.5, products: 150, created: '2024-01-15' },
      { id: 2, name: 'FashionHub Grodzisk', category: 'Odzież', location: 'Grodzisk Mazowiecki, Mazowieckie', rating: 4.2, products: 89, created: '2024-01-10' },
      { id: 3, name: 'BookWorld Legionowo', category: 'Książki', location: 'Legionowo, Mazowieckie', rating: 4.7, products: 234, created: '2024-01-08' }
    ],
    companies: [
      { id: 1, name: 'TechCorp Sp. z o.o.', industry: 'Technologia', location: 'Warszawa, Mazowieckie', employees: 45, rating: 4.8 },
      { id: 2, name: 'EcoSolutions', industry: 'Ekologia', location: 'Grodzisk Mazowiecki, Mazowieckie', employees: 23, rating: 4.5 },
      { id: 3, name: 'MarketingPro', industry: 'Marketing', location: 'Legionowo, Mazowieckie', employees: 12, rating: 4.3 }
    ],
    posts: [
      { id: 1, title: 'Nowe produkty w TechStore', author: 'Jan Kowalski', location: 'Warszawa', likes: 45, created: '2024-01-20' },
      { id: 2, title: 'Promocja w FashionHub', author: 'Anna Nowak', location: 'Grodzisk Mazowiecki', likes: 32, created: '2024-01-19' },
      { id: 3, title: 'Recenzja książki', author: 'Piotr Wiśniewski', location: 'Legionowo', likes: 28, created: '2024-01-18' }
    ],
    users: [
      { id: 1, name: 'Jan Kowalski', location: 'Warszawa', posts: 15, followers: 234, joined: '2023-06-15' },
      { id: 2, name: 'Anna Nowak', location: 'Grodzisk Mazowiecki', posts: 8, followers: 156, joined: '2023-08-22' },
      { id: 3, name: 'Piotr Wiśniewski', location: 'Legionowo', posts: 23, followers: 445, joined: '2023-05-10' }
    ]
  };

  useEffect(() => {
    // Sprawdź czy jest parametr URL lub state z nawigacji
    if (countyCode) {
      const municipalityFromUrl = municipalities.find(m => m.id === countyCode);
      if (municipalityFromUrl) {
        setSelectedMunicipality(municipalityFromUrl);
        fetchMunicipalityData(municipalityFromUrl.id);
        return;
      }
    }

    if (location.state?.selectedMunicipality) {
      const municipalityFromState = municipalities.find(m => m.id === location.state.selectedMunicipality.code);
      if (municipalityFromState) {
        setSelectedMunicipality(municipalityFromState);
        fetchMunicipalityData(municipalityFromState.id);
        return;
      }
    }

    // Pobierz lokalizację użytkownika i ustaw jako domyślną
    fetchUserLocation();
  }, [countyCode, location.state]);

  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Jeśli użytkownik nie jest zalogowany, ustaw domyślną gminę
        const defaultMunicipality = municipalities.find(m => m.id === '020101') || municipalities[0];
        setSelectedMunicipality(defaultMunicipality);
        fetchMunicipalityData(defaultMunicipality.id);
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
            // Znajdź gminę na podstawie lokalizacji użytkownika
            const userMunicipality = municipalities.find(m => 
              locationData.name?.includes(m.name) || locationData.hierarchy?.gmina?.name?.includes(m.name)
            );
            
            if (userMunicipality) {
              setSelectedMunicipality(userMunicipality);
              fetchMunicipalityData(userMunicipality.id);
              return;
            }
          }
        }
      }

      // Fallback do domyślnej gminy
      const defaultMunicipality = municipalities.find(m => m.id === '020101') || municipalities[0];
      setSelectedMunicipality(defaultMunicipality);
      fetchMunicipalityData(defaultMunicipality.id);
    } catch (error) {
      console.error('Błąd pobierania lokalizacji użytkownika:', error);
      // Fallback do domyślnej gminy
      const defaultMunicipality = municipalities.find(m => m.id === '020101') || municipalities[0];
      setSelectedMunicipality(defaultMunicipality);
      fetchMunicipalityData(defaultMunicipality.id);
    }
  };

  const fetchMunicipalityData = async (municipalityId) => {
    try {
      setLoading(true);
      setError(null);

      // Symulacja pobierania danych z API
      const mockData = {
        overview: { count: 0, items: [] },
        shops: { count: Math.floor(Math.random() * 50) + 10, items: sampleData.shops },
        posts: { count: Math.floor(Math.random() * 150) + 30, items: sampleData.posts },
        companies: { count: Math.floor(Math.random() * 40) + 8, items: sampleData.companies },
        users: { count: Math.floor(Math.random() * 250) + 50, items: sampleData.users }
      };

      setData(mockData);
      setLoading(false);
    } catch (err) {
      setError('Błąd podczas pobierania danych gminy');
      console.error('Błąd pobierania danych gminy:', err);
      setLoading(false);
    }
  };

  const handleMunicipalitySelect = (municipality) => {
    setSelectedMunicipality(municipality);
    setActiveTab('overview');
    setLoading(true);
    
    // Symulacja ładowania danych
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredMunicipalities(municipalities);
    } else {
      const filtered = municipalities.filter(municipality =>
        municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipality.county.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMunicipalities(filtered);
    }
  };

  // Nowe funkcje do pobierania danych
  const fetchLocationData = async (locationId) => {
    if (!locationId) return;
    
    try {
      setLoading(true);
      
      // Pobierz statystyki lokalizacji
      const statsResponse = await fetch(`/api/locations/${locationId}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setLocationStats(statsData.stats);
      }
      
      // Pobierz sklepy
      const shopsResponse = await fetch(`/api/locations/${locationId}/shops?limit=20`);
      if (shopsResponse.ok) {
        const shopsData = await shopsResponse.json();
        setShops(shopsData.shops);
      }
      
      // Pobierz firmy
      const companiesResponse = await fetch(`/api/locations/${locationId}/companies?limit=20`);
      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData.companies);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Błąd podczas pobierania danych lokalizacji:', error);
      setLoading(false);
    }
  };

  // Aktualizuj useEffect aby pobierał dane lokalizacji
  useEffect(() => {
    if (selectedMunicipality) {
      fetchLocationData(selectedMunicipality.id);
    }
  }, [selectedMunicipality]);

  // Inicjalizacja filteredMunicipalities
  useEffect(() => {
    setFilteredMunicipalities(municipalities);
  }, [municipalities]);

  const handleMunicipalitySearchSelect = (municipality) => {
    handleMunicipalitySelect(municipality);
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'shops':
        return ['Nazwa sklepu', 'Kategoria', 'Lokalizacja', 'Ocena', 'Status'];
      case 'companies':
        return ['Nazwa firmy', 'Branża', 'Lokalizacja', 'Ocena', 'Status'];
      case 'posts':
        return ['Tytuł', 'Autor', 'Data', 'Likes', 'Komentarze'];
      case 'users':
        return ['Nazwa użytkownika', 'Email', 'Rola', 'Status', 'Data rejestracji'];
      default:
        return [];
    }
  };

  const renderTableRow = (item) => {
    switch (activeTab) {
      case 'shops':
        return [
          item.name,
          item.category,
          `${item.address?.city}, ${item.address?.voivodeship}`,
          item.ratings?.average?.toFixed(1) || 'Brak',
          item.isActive ? 'Aktywny' : 'Nieaktywny'
        ];
      case 'companies':
        return [
          item.name,
          item.industry,
          `${item.address?.city}, ${item.address?.voivodeship}`,
          item.stats?.averageRating?.toFixed(1) || 'Brak',
          item.isActive ? 'Aktywna' : 'Nieaktywna'
        ];
      case 'posts':
        return [
          item.title,
          item.author,
          new Date(item.createdAt).toLocaleDateString('pl-PL'),
          item.likes || 0,
          item.comments?.length || 0
        ];
      case 'users':
        return [
          item.username,
          item.email,
          item.role,
          item.isActive ? 'Aktywny' : 'Nieaktywny',
          new Date(item.createdAt).toLocaleDateString('pl-PL')
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

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <StatsGrid>
              <StatCard theme={theme}>
                <StatNumber theme={theme}>{data.shops?.count || 0}</StatNumber>
                <StatLabel theme={theme}>Sklepy</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatNumber theme={theme}>{data.companies?.count || 0}</StatNumber>
                <StatLabel theme={theme}>Firmy</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatNumber theme={theme}>{data.posts?.count || 0}</StatNumber>
                <StatLabel theme={theme}>Posty</StatLabel>
              </StatCard>
              <StatCard theme={theme}>
                <StatNumber theme={theme}>{data.users?.count || 0}</StatNumber>
                <StatLabel theme={theme}>Użytkownicy</StatLabel>
              </StatCard>
            </StatsGrid>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: theme.primary, marginBottom: '1rem' }}>Ostatnia aktywność</h3>
              <DataTable>
                <TableHeader theme={theme}>
                  <div>Typ</div>
                  <div>Nazwa</div>
                  <div>Lokalizacja</div>
                  <div>Data</div>
                  <div>Status</div>
                </TableHeader>
                {[
                  { type: 'Sklep', name: 'TechStore Warszawa', location: 'Warszawa', date: '2024-01-20', status: 'Aktywny' },
                  { type: 'Firma', name: 'TechCorp Sp. z o.o.', location: 'Warszawa', date: '2024-01-19', status: 'Aktywna' },
                  { type: 'Post', name: 'Nowe produkty w TechStore', location: 'Warszawa', date: '2024-01-18', status: 'Opublikowany' }
                ].map((item, index) => (
                  <TableRow key={index} theme={theme}>
                    <TableCell theme={theme}>{item.type}</TableCell>
                    <TableCell theme={theme}>{item.name}</TableCell>
                    <TableCell theme={theme}>{item.location}</TableCell>
                    <TableCell theme={theme}>{item.date}</TableCell>
                    <TableCell theme={theme}>{item.status}</TableCell>
                  </TableRow>
                ))}
              </DataTable>
            </div>
          </div>
        );

      case 'shops':
        return (
          <div>
            <FilterBar>
              <SearchInput 
                placeholder="Wyszukaj sklepy..." 
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
              />
              <FilterSelect 
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                <option value="elektronika">Elektronika</option>
                <option value="odzież">Odzież</option>
                <option value="książki">Książki</option>
                <option value="sport">Sport</option>
              </FilterSelect>
              <FilterSelect 
                value={shopSort}
                onChange={(e) => setShopSort(e.target.value)}
              >
                <option value="name">Sortuj po nazwie</option>
                <option value="rating">Sortuj po ocenie</option>
                <option value="date">Sortuj po dacie</option>
              </FilterSelect>
            </FilterBar>
            
            {loading ? (
              <LoadingSpinner>Ładowanie sklepów...</LoadingSpinner>
            ) : (
              <DataTable>
                <TableHeader theme={theme}>
                  {renderTableHeaders().map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </TableHeader>
                {sampleData.shops.map((shop) => (
                  <TableRow key={shop.id} theme={theme}>
                    {renderTableRow(shop).map((cell, index) => (
                      <TableCell key={index} theme={theme}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </DataTable>
            )}
          </div>
        );

      case 'companies':
        return (
          <div>
            <FilterBar>
              <SearchInput 
                placeholder="Wyszukaj firmy..." 
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
              />
              <FilterSelect 
                value={companyIndustry}
                onChange={(e) => setCompanyIndustry(e.target.value)}
              >
                <option value="">Wszystkie branże</option>
                <option value="technologia">Technologia</option>
                <option value="ekologia">Ekologia</option>
                <option value="marketing">Marketing</option>
                <option value="gastronomia">Gastronomia</option>
              </FilterSelect>
              <FilterSelect 
                value={companySort}
                onChange={(e) => setCompanySort(e.target.value)}
              >
                <option value="name">Sortuj po nazwie</option>
                <option value="rating">Sortuj po ocenie</option>
                <option value="employees">Sortuj po liczbie pracowników</option>
              </FilterSelect>
            </FilterBar>
            
            {loading ? (
              <LoadingSpinner>Ładowanie firm...</LoadingSpinner>
            ) : (
              <DataTable>
                <TableHeader theme={theme}>
                  {renderTableHeaders().map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </TableHeader>
                {sampleData.companies.map((company) => (
                  <TableRow key={company.id} theme={theme}>
                    {renderTableRow(company).map((cell, index) => (
                      <TableCell key={index} theme={theme}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </DataTable>
            )}
          </div>
        );

      case 'posts':
        return (
          <div>
            <FilterBar>
              <SearchInput 
                placeholder="Wyszukaj posty..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterBar>
            
            {loading ? (
              <LoadingSpinner>Ładowanie postów...</LoadingSpinner>
            ) : (
              <DataTable>
                <TableHeader theme={theme}>
                  {renderTableHeaders().map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </TableHeader>
                {sampleData.posts.map((post) => (
                  <TableRow key={post.id} theme={theme}>
                    {renderTableRow(post).map((cell, index) => (
                      <TableCell key={index} theme={theme}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </DataTable>
            )}
          </div>
        );
        
      case 'users':
        return (
          <div>
            <FilterBar>
              <SearchInput 
                placeholder="Wyszukaj użytkowników..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterBar>
            
            {loading ? (
              <LoadingSpinner>Ładowanie użytkowników...</LoadingSpinner>
            ) : (
              <DataTable>
                <TableHeader theme={theme}>
                  {renderTableHeaders().map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </TableHeader>
                {sampleData.users.map((user) => (
                  <TableRow key={user.id} theme={theme}>
                    {renderTableRow(user).map((cell, index) => (
                      <TableCell key={index} theme={theme}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </DataTable>
            )}
          </div>
        );

      default:
        return <div>Wybierz zakładkę</div>;
    }
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <Title theme={theme}>Gminy - Mazowieckie</Title>
        <Subtitle theme={theme}>
          Przeglądaj sklepy, firmy i aktywność w gminach województwa mazowieckiego
        </Subtitle>
      </Header>

      <LocationSelector theme={theme}>
        <LocationLabel theme={theme}>Wybierz gminę:</LocationLabel>
        <LocationDropdown>
          <LocationButton
            theme={theme}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedMunicipality ? selectedMunicipality.name : 'Wybierz gminę'}
            <FaChevronDown />
          </LocationButton>
          <LocationDropdownContent 
            theme={theme} 
            isOpen={isDropdownOpen}
          >
            {filteredMunicipalities.map((municipality) => (
              <LocationOption
                key={municipality.id}
                theme={theme}
                isSelected={selectedMunicipality?.id === municipality.id}
                onClick={() => handleMunicipalitySelect(municipality)}
              >
                {municipality.name} ({municipality.type}) - {municipality.population.toLocaleString()} mieszkańców
              </LocationOption>
            ))}
          </LocationDropdownContent>
        </LocationDropdown>
        
        <SearchInput 
          placeholder="Wyszukaj gminę..." 
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </LocationSelector>

      {selectedMunicipality && (
        <>
          <TabContainer theme={theme}>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                theme={theme}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Tab>
            ))}
          </TabContainer>

          <TabContent theme={theme}>
            {renderTabContent()}
          </TabContent>
        </>
      )}
    </Container>
  );
} 