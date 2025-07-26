import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany przy starcie aplikacji
    const checkAuthStatus = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (isLoggedIn === 'true' && userData && storedToken) {
          const parsedUser = JSON.parse(userData);
          console.log('Restored user from localStorage:', parsedUser);
          console.log('User ID from localStorage:', parsedUser._id);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania statusu autoryzacji:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Logowanie użytkownika:', credentials);
      
      // Wyślij dane do backendu
      const response = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      let data = null;
      let text = '';
      const contentType = response.headers.get('content-type');
      try {
        text = await response.text();
        if (contentType && contentType.includes('application/json') && text) {
          data = JSON.parse(text);
        } else {
          data = { error: text || 'Brak odpowiedzi z serwera' };
        }
      } catch (parseError) {
        data = { error: 'Nieprawidłowa odpowiedź z serwera' };
      }

      if (!response.ok) {
        return { success: false, error: data.error || 'Wystąpił błąd podczas logowania' };
      }

      const userData = {
        ...data.user,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };
      
      console.log('Login successful, user data:', userData);
      console.log('User ID:', userData._id);
      console.log('User roles:', userData.roles);
      console.log('Raw backend response:', data);
      console.log('Backend user object:', data.user);
      console.log('Backend response JSON:', JSON.stringify(data));
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      
      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Błąd logowania:', error);
      return { success: false, error: 'Wystąpił błąd podczas logowania (brak połączenia z serwerem)' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Rejestracja użytkownika:', userData);
      
      // Wyślij dane do backendu
      const response = await fetch(`/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: userData.dateOfBirth,
          phone: userData.phone,
          city: userData.city,
          gender: userData.gender
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Wystąpił błąd podczas rejestracji' };
      }
      
      const newUser = {
        ...data.user,
        isLoggedIn: true,
        registrationTime: new Date().toISOString(),
      };
      
      console.log('Rejestracja udana:', newUser);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      return { success: false, error: 'Wystąpił błąd podczas rejestracji' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Nowa funkcja do aktualizacji danych lokalizacyjnych
  const updateUserLocation = (locationData) => {
    const updatedUser = { 
      ...user, 
      location: locationData.location,
      teryt: locationData.teryt,
      address: locationData.address
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateUserLevel = (newLevel, newExperience) => {
    const updatedUser = { 
      ...user, 
      level: newLevel, 
      experience: newExperience,
      lastLevelUpdate: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addExperience = (amount) => {
    const newExperience = user.experience + amount;
    const experienceForNextLevel = user.level * 100; // Prosty system poziomów
    
    if (newExperience >= experienceForNextLevel) {
      const newLevel = user.level + 1;
      updateUserLevel(newLevel, newExperience - experienceForNextLevel);
      return { leveledUp: true, newLevel, remainingExp: newExperience - experienceForNextLevel };
    } else {
      updateUserLevel(user.level, newExperience);
      return { leveledUp: false, currentExp: newExperience };
    }
  };

  const getUserStats = () => {
    if (!user) return null;
    
    return {
      level: user.level,
      experience: user.experience,
      experienceForNextLevel: user.level * 100,
      progress: (user.experience / (user.level * 100)) * 100
    };
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    // Sprawdź czy użytkownik ma role jako tablicę
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes(requiredRole) || user.roles.includes('admin');
    }
    // Fallback dla starego formatu (pole role jako string)
    return user.role === requiredRole || user.role === 'admin';
  };

  const isAdmin = () => {
    if (!user) return false;
    // Sprawdź czy użytkownik ma role jako tablicę
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes('admin');
    }
    // Fallback dla starego formatu
    return user.role === 'admin';
  };

  const isModerator = () => {
    if (!user) return false;
    // Sprawdź czy użytkownik ma role jako tablicę
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes('moderator') || user.roles.includes('admin');
    }
    // Fallback dla starego formatu
    return user.role === 'moderator' || user.role === 'admin';
  };

  // Funkcje pomocnicze do danych lokalizacyjnych
  const getUserLocation = () => {
    return user?.location || null;
  };

  const getUserTeryt = () => {
    return user?.teryt || null;
  };

  const getUserAddress = () => {
    return user?.address || null;
  };

  const hasLocationData = () => {
    return !!(user?.location || user?.teryt || user?.address);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updateUserLocation,
    updateUserLevel,
    addExperience,
    getUserStats,
    hasRole,
    isAdmin,
    isModerator,
    getUserLocation,
    getUserTeryt,
    getUserAddress,
    hasLocationData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 