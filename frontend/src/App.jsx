import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Import existing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddShop from './pages/AddShop';
import AddProduct from './pages/AddProduct';
import MyShops from './pages/MyShops';
import Settings from './pages/Settings';

// Import new enhanced components
import ProductsEnhanced from './pages/ProductsEnhanced';
import ProductCard from './components/ProductCard';
import AdvancedFilters from './components/AdvancedFilters';
import ReviewSystem from './components/ReviewSystem';
import LiveChat from './components/LiveChat';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    line-height: 1.6;
    transition: all 0.3s ease;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.primaryDark};
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Space for fixed navbar */
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-size: 1.2rem;
  color: ${props => props.theme.text};
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.border};
  border-top: 3px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Theme definitions
const lightTheme = {
  primary: '#667eea',
  primaryDark: '#5a6fd8',
  secondary: '#764ba2',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e1e5e9',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  shadow: '0 2px 10px rgba(0,0,0,0.1)',
  shadowHover: '0 5px 20px rgba(0,0,0,0.15)',
  borderRadius: '8px',
  transition: 'all 0.3s ease'
};

const darkTheme = {
  primary: '#667eea',
  primaryDark: '#5a6fd8',
  secondary: '#764ba2',
  background: '#1a1a1a',
  surface: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#cccccc',
  border: '#404040',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  shadow: '0 2px 10px rgba(0,0,0,0.3)',
  shadowHover: '0 5px 20px rgba(0,0,0,0.4)',
  borderRadius: '8px',
  transition: 'all 0.3s ease'
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowChat(true);
  };

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  if (loading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <GlobalStyle theme={currentTheme} />
        <LoadingOverlay theme={currentTheme}>
          <LoadingSpinner>
            <Spinner theme={currentTheme} />
            <div>🚀 Ładowanie ulepszonego portalu...</div>
          </LoadingSpinner>
        </LoadingOverlay>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle theme={currentTheme} />
      <Router>
        <AppContainer theme={currentTheme}>
          <Navbar 
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            theme={currentTheme}
            onThemeChange={handleThemeChange}
          />
          
          <MainContent>
            <Routes>
              <Route path="/" element={<Home theme={currentTheme} />} />
              <Route path="/login" element={
                !isAuthenticated ? 
                <Login onLogin={handleLogin} theme={currentTheme} /> : 
                <Navigate to="/" replace />
              } />
              <Route path="/register" element={
                !isAuthenticated ? 
                <Register theme={currentTheme} /> : 
                <Navigate to="/" replace />
              } />
              <Route path="/profile" element={
                isAuthenticated ? 
                <Profile user={user} theme={currentTheme} /> : 
                <Navigate to="/login" replace />
              } />
              <Route path="/add-shop" element={
                isAuthenticated ? 
                <AddShop theme={currentTheme} /> : 
                <Navigate to="/login" replace />
              } />
              <Route path="/add-product" element={
                isAuthenticated ? 
                <AddProduct theme={currentTheme} /> : 
                <Navigate to="/login" replace />
              } />
              <Route path="/my-shops" element={
                isAuthenticated ? 
                <MyShops theme={currentTheme} /> : 
                <Navigate to="/login" replace />
              } />
              <Route path="/settings" element={
                isAuthenticated ? 
                <Settings 
                  theme={currentTheme} 
                  onThemeChange={handleThemeChange}
                /> : 
                <Navigate to="/login" replace />
              } />
              
              {/* Enhanced Products Page */}
              <Route path="/products" element={
                <ProductsEnhanced 
                  theme={currentTheme}
                  onProductSelect={handleProductSelect}
                />
              } />
              
              {/* Product Details Page with Reviews */}
              <Route path="/product/:id" element={
                <div style={{ padding: '20px' }}>
                  <ProductCard 
                    product={selectedProduct}
                    theme={currentTheme}
                    expanded={true}
                  />
                  {selectedProduct && (
                    <ReviewSystem 
                      product={selectedProduct}
                      theme={currentTheme}
                    />
                  )}
                </div>
              } />
              
              {/* Standalone Components for Testing */}
              <Route path="/demo/product-card" element={
                <div style={{ padding: '20px' }}>
                  <h1>Demo: Product Card</h1>
                  <ProductCard 
                    product={{
                      _id: 'demo',
                      name: 'iPhone 15 Pro Max',
                      price: 4999.99,
                      oldPrice: 5499.99,
                      rating: 4.8,
                      reviewsCount: 156,
                      inStock: true,
                      isNew: true,
                      isPremium: true,
                      images: ['/iphone1.jpg', '/iphone2.jpg', '/iphone3.jpg'],
                      category: 'electronics',
                      location: 'Warszawa',
                      deliveryType: 'Kurier',
                      deliveryTime: '1-2 dni',
                      freeShipping: true,
                      shop: {
                        name: 'TechStore',
                        rating: 4.9,
                        reviewsCount: 1247
                      }
                    }}
                    theme={currentTheme}
                  />
                </div>
              } />
              
              <Route path="/demo/filters" element={
                <div style={{ padding: '20px' }}>
                  <h1>Demo: Advanced Filters</h1>
                  <AdvancedFilters 
                    theme={currentTheme}
                    onFiltersChange={(filters) => console.log('Filters:', filters)}
                  />
                </div>
              } />
              
              <Route path="/demo/reviews" element={
                <div style={{ padding: '20px' }}>
                  <h1>Demo: Review System</h1>
                  <ReviewSystem 
                    product={{
                      _id: 'demo',
                      name: 'iPhone 15 Pro Max',
                      rating: 4.8,
                      reviewsCount: 156
                    }}
                    theme={currentTheme}
                  />
                </div>
              } />
              
              <Route path="/demo/chat" element={
                <div style={{ padding: '20px' }}>
                  <h1>Demo: Live Chat</h1>
                  <LiveChat 
                    seller={{
                      name: 'TechStore',
                      rating: 4.9,
                      reviewsCount: 1247
                    }}
                    theme={currentTheme}
                  />
                </div>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div style={{ 
                  padding: '100px 20px', 
                  textAlign: 'center',
                  color: currentTheme.textSecondary 
                }}>
                  <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404</h1>
                  <p style={{ fontSize: '1.2rem' }}>Strona nie została znaleziona</p>
                </div>
              } />
            </Routes>
          </MainContent>
          
          {/* Global Chat Component */}
          {showChat && selectedProduct && (
            <LiveChat 
              seller={selectedProduct.shop}
              theme={currentTheme}
              onClose={() => setShowChat(false)}
            />
          )}
          
          <Footer theme={currentTheme} />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App; 