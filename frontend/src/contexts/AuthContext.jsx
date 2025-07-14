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
          console.log('Restored user from localStorage:', parsedUser);
          console.log('User ID from localStorage:', parsedUser._id);
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

      const data = await response.json();
      
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