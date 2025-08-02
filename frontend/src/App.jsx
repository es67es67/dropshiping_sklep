import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalStyles, lightTheme, darkTheme } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Products from './pages/Products';
import ShopList from './components/ShopList';
import ShopDetails from './components/ShopDetails';
import Cart from './components/Cart';
import MessagingSystem from './components/MessagingSystem';
import PaymentSystem from './components/PaymentSystem';
import LocationSelector from './components/LocationSelector';
import GamificationPanel from './components/GamificationPanel';
import Notifications from './components/Notifications';
import ProductCreate from './components/ProductCreate';
import AddProductPage from './pages/AddProductPage';
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
import Cities from './pages/Cities';
import Country from './pages/Country';
import LocationAnalytics from './pages/LocationAnalytics';
import LocationImport from './pages/LocationImport';
import LocationExport from './pages/LocationExport';
import AdminPanel from './pages/AdminPanel';
import LocalProducts from './pages/LocalProducts';
import MyProducts from './pages/MyProducts';
import MyShops from './pages/MyShops';
import LiveShopping from './components/LiveShopping';
import LoyaltySystem from './components/LoyaltySystem';
import FriendshipSystem from './components/FriendshipSystem';
import Friends from './components/Friends';
import PostCreate from './components/PostCreate';
import Messages from './components/Messages';
import TestShopsPage from './components/TestShopsPage';
import TestComponent from './components/TestComponent';
import LocationMap from './pages/LocationMap';
import CompanyProfile from './pages/CompanyProfile';
import CompanyProfiles from './pages/CompanyProfiles';
import Product from './pages/Product';
import User from './pages/User';
import Post from './pages/Post';
import AdvancedFeatures from './pages/AdvancedFeatures';
import TerytFeatures from './pages/TerytFeatures';
import ProductDetails from './components/ProductDetails';
import ShopProductDetails from './components/ShopProductDetails';
import CategoryManagement from './components/CategoryManagement';
import LocationDemo from './pages/LocationDemo';
import Feed from './pages/Feed';
import ErrorDashboard from './components/ErrorDashboard';
import AuctionDetails from './pages/AuctionDetails';
import NegotiationDetails from './pages/NegotiationDetails';
import FreeItemDetails from './pages/FreeItemDetails';


function App() {
  const [theme, setTheme] = useState('light');
  const [userLayout, setUserLayout] = useState('modern');
  const [userTheme, setUserTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    fetchUserLayoutSettings();
  }, []);

  const fetchUserLayoutSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      // Sprawdź czy użytkownik jest zalogowany
      if (!token || isLoggedIn !== 'true') {
        console.log('Użytkownik nie jest zalogowany, pomijam pobieranie ustawień layoutu');
        return;
      }
      
      const response = await fetch(`/api/users/layout-settings/portal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const settings = await response.json();
        console.log('Pobrane ustawienia:', settings);
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

  const createCustomTheme = (baseTheme, userThemeName) => {
    const themeVariants = {
      default: {
        primary: '#00D4AA',
        secondary: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)',
        gradientHover: 'linear-gradient(135deg, #00B894 0%, #7C3AED 100%)'
      },
      ocean: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        gradientHover: 'linear-gradient(135deg, #0284C7 0%, #0891B2 100%)'
      },
      sunset: {
        primary: '#F59E0B',
        secondary: '#EC4899',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
        gradientHover: 'linear-gradient(135deg, #D97706 0%, #DB2777 100%)'
      },
      forest: {
        primary: '#10B981',
        secondary: '#8B5A2B',
        gradient: 'linear-gradient(135deg, #10B981 0%, #8B5A2B 100%)',
        gradientHover: 'linear-gradient(135deg, #059669 0%, #A16207 100%)'
      },
      midnight: {
        primary: '#1E40AF',
        secondary: '#7C3AED',
        gradient: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
        gradientHover: 'linear-gradient(135deg, #1D4ED8 0%, #6D28D9 100%)'
      },
      coral: {
        primary: '#F97316',
        secondary: '#E11D48',
        gradient: 'linear-gradient(135deg, #F97316 0%, #E11D48 100%)',
        gradientHover: 'linear-gradient(135deg, #EA580C 0%, #BE185D 100%)'
      }
    };
    const variant = themeVariants[userThemeName] || themeVariants.default;
    return {
      ...baseTheme,
      ...variant
    };
  };

  const baseTheme = theme === 'light' ? lightTheme : darkTheme;
  const currentTheme = createCustomTheme(baseTheme, userTheme);

  const handleSettingsSaved = () => {
    console.log('handleSettingsSaved called - odświeżam ustawienia');
    fetchUserLayoutSettings();
  };

  const renderLayout = () => {
    const routes = (
      <Routes>
        <Route path="/test-route" element={<div>TEST ROUTE DZIAŁA</div>} />
        <Route path="/test-shop-page" element={
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
          }}>
            <h1 style={{ color: '#2196F3', fontSize: '2.5rem', marginBottom: '1rem' }}>
              🧪 Testowa Strona Sklepu
            </h1>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>
                ✅ Jeśli widzisz tę stronę, routing działa poprawnie!
              </h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                To jest testowa strona, która potwierdza, że:
              </p>
              <ul style={{ textAlign: 'left', fontSize: '1rem', lineHeight: '1.6' }}>
                <li>✅ React Router działa poprawnie</li>
                <li>✅ Komponenty się renderują</li>
                <li>✅ Stylowanie działa</li>
                <li>✅ Routing dynamiczny powinien działać</li>
              </ul>
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>🔗 Testuj te linki:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="/shop/6875773831cf77c7af5e07b4" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    🏪 /shop/6875773831cf77c7af5e07b4 - Szczegóły sklepu (prawdziwy ID)
                  </a>
                  <a href="/company-profiles/6875773831cf77c7af5e07b4" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    🏢 /company-profiles/6875773831cf77c7af5e07b4 - Szczegóły firmy (prawdziwy ID)
                  </a>
                  <a href="/shop/1" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    🏪 /shop/1 - Szczegóły sklepu ID 1
                  </a>
                  <a href="/shops/1" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    🏪 /shops/1 - Przekierowanie do /shop/1
                  </a>
                  <a href="/test-route" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    🧪 /test-route - Prosty test
                  </a>
                </div>
              </div>
              <button 
                onClick={() => alert('Testowy przycisk działa!')}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🎯 Testowy Przycisk
              </button>
            </div>
          </div>
        } />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Navigate to="/market" replace />} />
        <Route path="/market" element={<Products />} />
        <Route path="/shops" element={
          <ProtectedRoute>
            <ShopList />
          </ProtectedRoute>
        } />
        <Route path="/shop/:shopId" element={<ShopDetails theme={currentTheme} />} />
        <Route path="/shops/:id" element={<Navigate to={(location) => `/shop/${location.pathname.split('/').pop()}`} replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/payment" element={<PaymentSystem />} />
        <Route path="/location" element={<LocationSelector />} />
        <Route path="/gamification" element={
          <ProtectedRoute>
            <GamificationPanel />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/product-create" element={<ProductCreate />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/shop-create" element={<ShopCreate theme={currentTheme} />} />
        <Route path="/shops/create" element={<ShopCreate theme={currentTheme} />} />
        <Route path="/shop-management" element={<ShopManagement />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/category-management" element={<CategoryManagement theme={currentTheme} />} />
        <Route path="/layout-customization" element={<LayoutCustomization theme={currentTheme} onSettingsSaved={handleSettingsSaved} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        {/* Lokalizacje */}
        <Route path="/country" element={<Country theme={currentTheme} />} />
        <Route path="/voivodeships" element={<Voivodeships theme={currentTheme} />} />
        <Route path="/voivodeships/:voivodeshipCode" element={<Voivodeships theme={currentTheme} />} />
        <Route path="/counties" element={<Counties theme={currentTheme} />} />
        <Route path="/counties/:countyCode" element={<Counties theme={currentTheme} />} />
        <Route path="/municipalities" element={<Municipalities theme={currentTheme} />} />
        <Route path="/municipalities/:municipalityCode" element={<Municipalities theme={currentTheme} />} />
        <Route path="/cities" element={<Cities theme={currentTheme} />} />
        <Route path="/cities/:cityCode" element={<Cities theme={currentTheme} />} />
        <Route path="/location-analytics" element={<LocationAnalytics />} />
        <Route path="/location-import" element={<LocationImport />} />
        <Route path="/location-export" element={<LocationExport />} />
        <Route path="/admin-panel" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/local-products" element={<LocalProducts />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/my-shops" element={<MyShops />} />
        <Route path="/shop/:shopId/live" element={<LiveShopping />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friendship" element={<FriendshipSystem userId={localStorage.getItem('userId')} />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/location-map" element={<LocationMap theme={currentTheme} />} />
        <Route path="/company-profiles" element={<CompanyProfiles theme={currentTheme} />} />
        <Route path="/company-profiles/:id" element={<CompanyProfile theme={currentTheme} />} />
        <Route path="/products/:id" element={<ShopProductDetails theme={currentTheme} />} />
        <Route path="/users/:id" element={<User theme={currentTheme} />} />
        <Route path="/posts/:id" element={<Post theme={currentTheme} />} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed theme={currentTheme} />
          </ProtectedRoute>
        } />
        <Route path="/error-dashboard" element={<ErrorDashboard />} />
        <Route path="/advanced-features" element={<AdvancedFeatures theme={currentTheme} />} />
        <Route path="/teryt-features" element={<TerytFeatures theme={currentTheme} />} />
        <Route path="/product/:productId" element={<ProductDetails theme={currentTheme} />} />
        <Route path="/marketproduct/:productId" element={<ProductDetails theme={currentTheme} />} />
        <Route path="/auction/:id" element={<AuctionDetails theme={currentTheme} />} />
        <Route path="/negotiation/:id" element={<NegotiationDetails theme={currentTheme} />} />
        <Route path="/free/:id" element={<FreeItemDetails theme={currentTheme} />} />
        <Route path="/location-demo" element={<LocationDemo />} />
      </Routes>
    );
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
              {routes}
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
              {routes}
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
              {routes}
            </div>
          </div>
        );
    }
  };
  return (
    <HelmetProvider>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyles />
        <ErrorBoundary>
          <AuthProvider>
            <Router>
              {renderLayout()}
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
