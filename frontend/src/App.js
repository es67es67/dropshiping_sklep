import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, lightTheme, darkTheme } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ShopList from './components/ShopList';
import ShopDetails from './components/ShopDetails';
import MessagingSystem from './components/MessagingSystem';
import PaymentSystem from './components/PaymentSystem';
import LocationSelector from './components/LocationSelector';
import GamificationPanel from './components/GamificationPanel';
import Notifications from './components/Notifications';
import ProductCreate from './components/ProductCreate';
import ShopCreate from './components/ShopCreate';
import ShopManagement from './components/ShopManagement';
import ProductManagement from './components/ProductManagement';
import LayoutCustomization from './components/LayoutCustomization';
import Profile from './components/Profile';
import Search from './components/Search';
import Settings from './components/Settings';
import Voivodeships from './pages/Voivodeships';
import Counties from './pages/Counties';
import Municipalities from './pages/Municipalities';
import LocationAnalytics from './pages/LocationAnalytics';
import LocationImport from './pages/LocationImport';
import LocationExport from './pages/LocationExport';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [theme, setTheme] = useState('light');
  const [userLayout, setUserLayout] = useState('modern');
  const [userTheme, setUserTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Pobierz ustawienia layoutu użytkownika
    fetchUserLayoutSettings();
  }, []);

  const fetchUserLayoutSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.REACT_APP_API_URL || 'https://portal-backend-igf9.onrender.com';
      const response = await fetch(`${apiUrl}/api/users/layout-settings/portal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const settings = await response.json();
        setUserLayout(settings.layout || 'modern');
        setUserTheme(settings.theme || 'default');
      }
    } catch (err) {
      console.error('Błąd podczas pobierania ustawień layoutu:', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Funkcja do renderowania layoutu
  const renderLayout = () => {
    switch (userLayout) {
      case 'classic':
        return (
          <div style={{ 
            minHeight: '100vh',
            background: currentTheme.background,
            color: currentTheme.text,
            display: 'flex'
          }}>
            <div style={{ 
              width: '250px', 
              background: currentTheme.surface,
              borderRight: `1px solid ${currentTheme.border}`,
              padding: '1rem'
            }}>
              <Navbar theme={currentTheme} toggleTheme={toggleTheme} layout={userLayout} />
            </div>
            <div style={{ flex: 1, padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/shops" element={<ShopList />} />
                <Route path="/shop/:shopId" element={<ShopDetails />} />
                <Route path="/messages" element={<MessagingSystem />} />
                <Route path="/payment" element={<PaymentSystem />} />
                <Route path="/location" element={<LocationSelector />} />
                <Route path="/gamification" element={<GamificationPanel />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/product-create" element={<ProductCreate />} />
                <Route path="/shop-create" element={<ShopCreate theme={currentTheme} />} />
                <Route path="/shop-management" element={<ShopManagement />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/layout-customization" element={<LayoutCustomization theme={currentTheme} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Lokalizacje */}
                <Route path="/voivodeships" element={<Voivodeships />} />
                <Route path="/counties/:voivodeshipCode" element={<Counties />} />
                <Route path="/municipalities/:countyCode" element={<Municipalities />} />
                <Route path="/location-analytics" element={<LocationAnalytics />} />
                <Route path="/location-import" element={<LocationImport />} />
                <Route path="/location-export" element={<LocationExport />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
              </Routes>
            </div>
          </div>
        );
      
      case 'compact':
        return (
          <div style={{ 
            minHeight: '100vh',
            background: currentTheme.background,
            color: currentTheme.text
          }}>
            <Navbar theme={currentTheme} toggleTheme={toggleTheme} layout={userLayout} />
            <div style={{ padding: '10px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/shops" element={<ShopList />} />
                <Route path="/shop/:shopId" element={<ShopDetails />} />
                <Route path="/messages" element={<MessagingSystem />} />
                <Route path="/payment" element={<PaymentSystem />} />
                <Route path="/location" element={<LocationSelector />} />
                <Route path="/gamification" element={<GamificationPanel />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/product-create" element={<ProductCreate />} />
                <Route path="/shop-create" element={<ShopCreate theme={currentTheme} />} />
                <Route path="/shop-management" element={<ShopManagement />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/layout-customization" element={<LayoutCustomization theme={currentTheme} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Lokalizacje */}
                <Route path="/voivodeships" element={<Voivodeships />} />
                <Route path="/counties/:voivodeshipCode" element={<Counties />} />
                <Route path="/municipalities/:countyCode" element={<Municipalities />} />
                <Route path="/location-analytics" element={<LocationAnalytics />} />
                <Route path="/location-import" element={<LocationImport />} />
                <Route path="/location-export" element={<LocationExport />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
              </Routes>
            </div>
          </div>
        );
      
      default: // modern
        return (
          <div style={{ 
            minHeight: '100vh',
            background: currentTheme.background,
            color: currentTheme.text
          }}>
            <Navbar theme={currentTheme} toggleTheme={toggleTheme} layout={userLayout} />
            <div style={{ padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/shops" element={<ShopList />} />
                <Route path="/shop/:shopId" element={<ShopDetails />} />
                <Route path="/messages" element={<MessagingSystem />} />
                <Route path="/payment" element={<PaymentSystem />} />
                <Route path="/location" element={<LocationSelector />} />
                <Route path="/gamification" element={<GamificationPanel />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/product-create" element={<ProductCreate />} />
                <Route path="/shop-create" element={<ShopCreate theme={currentTheme} />} />
                <Route path="/shop-management" element={<ShopManagement />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/layout-customization" element={<LayoutCustomization theme={currentTheme} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Lokalizacje */}
                <Route path="/voivodeships" element={<Voivodeships />} />
                <Route path="/counties/:voivodeshipCode" element={<Counties />} />
                <Route path="/municipalities/:countyCode" element={<Municipalities />} />
                <Route path="/location-analytics" element={<LocationAnalytics />} />
                <Route path="/location-import" element={<LocationImport />} />
                <Route path="/location-export" element={<LocationExport />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
              </Routes>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          {renderLayout()}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
