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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany przy starcie aplikacji
    const checkAuthStatus = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');
        
        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
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

  const login = async (loginData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const userData = {
        ...data.user,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Błąd logowania:', error);
      return { success: false, error: 'Wystąpił błąd podczas logowania' };
    }
  };

  const register = async (userData) => {
    try {
      // Symulacja rejestracji
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sprawdź czy email już istnieje
      if (userData.email === 'test@example.com') {
        return { success: false, error: 'Użytkownik z tym adresem email już istnieje' };
      }
      
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user',
        isLoggedIn: true,
        registrationTime: new Date().toISOString(),
        avatar: '👤',
        level: 1,
        experience: 0
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Wystąpił błąd podczas rejestracji' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
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
    return user.role === requiredRole || user.role === 'admin';
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isModerator = () => {
    return hasRole('moderator') || isAdmin();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updateUserLevel,
    addExperience,
    getUserStats,
    hasRole,
    isAdmin,
    isModerator
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 