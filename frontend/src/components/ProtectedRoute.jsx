import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Pokaż loading podczas sprawdzania statusu autoryzacji
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        ⏳ Sprawdzanie autoryzacji...
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
  if (!isAuthenticated) {
    console.log('🔒 Użytkownik nie jest zalogowany - przekierowanie do /login');
    return <Navigate to="/login" replace />;
  }

  // Jeśli użytkownik jest zalogowany, wyświetl chronioną zawartość
  return children;
};

export default ProtectedRoute; 