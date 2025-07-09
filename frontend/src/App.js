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
import MessagingSystem from './components/MessagingSystem';
import PaymentSystem from './components/PaymentSystem';
import LocationSelector from './components/LocationSelector';
import GamificationPanel from './components/GamificationPanel';
import Notifications from './components/Notifications';
import ProductCreate from './components/ProductCreate';
import ShopCreate from './components/ShopCreate';
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <div style={{ 
            minHeight: '100vh',
            background: currentTheme.background,
            color: currentTheme.text
          }}>
            <Navbar theme={currentTheme} toggleTheme={toggleTheme} />
            
            <div style={{ padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/shops" element={<ShopList />} />
                <Route path="/messages" element={<MessagingSystem />} />
                <Route path="/payment" element={<PaymentSystem />} />
                <Route path="/location" element={<LocationSelector />} />
                <Route path="/gamification" element={<GamificationPanel />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/product-create" element={<ProductCreate />} />
                <Route path="/shop-create" element={<ShopCreate />} />
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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
