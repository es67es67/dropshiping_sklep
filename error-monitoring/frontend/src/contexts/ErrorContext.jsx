import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { errorApi } from '../services/api';

// 🔴 CRITICAL CONTEXT: Error Context
// Zależności: React Query, errorApi
// Wpływ: Wszystkie komponenty używające błędów
// Jeśli się zepsuje: brak danych o błędach
// Używane w: Dashboard, ErrorList, ErrorDetails, etc.

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    errorType: '',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedErrors, setSelectedErrors] = useState([]);
  const queryClient = useQueryClient();

  // Pobieranie statystyk błędów
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery(['error-stats'], () => errorApi.getStats(), {
    refetchInterval: 30000, // Odświeżaj co 30 sekund
    staleTime: 10000
  });

  // Pobieranie listy błędów
  const {
    data: errorsData,
    isLoading: errorsLoading,
    error: errorsError,
    refetch: refetchErrors
  } = useQuery(
    ['errors', filters],
    () => errorApi.getErrors(filters),
    {
      refetchInterval: 60000, // Odświeżaj co minutę
      staleTime: 30000
    }
  );

  // Pobieranie grup błędów
  const {
    data: groupsData,
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups
  } = useQuery(
    ['error-groups', filters],
    () => errorApi.getErrorGroups(filters),
    {
      refetchInterval: 60000,
      staleTime: 30000
    }
  );

  // Mutacja aktualizacji statusu błędu
  const updateErrorStatusMutation = useMutation(
    ({ errorId, status }) => errorApi.updateErrorStatus(errorId, status),
    {
      onSuccess: (data, variables) => {
        toast.success(`Status błędu zaktualizowany na: ${variables.status}`);
        queryClient.invalidateQueries(['errors']);
        queryClient.invalidateQueries(['error-stats']);
      },
      onError: (error) => {
        toast.error('Błąd podczas aktualizacji statusu błędu');
        console.error('Error updating error status:', error);
      }
    }
  );

  // Mutacja aktualizacji statusu grupy
  const updateGroupStatusMutation = useMutation(
    ({ groupId, status }) => errorApi.updateGroupStatus(groupId, status),
    {
      onSuccess: (data, variables) => {
        toast.success(`Status grupy zaktualizowany na: ${variables.status}`);
        queryClient.invalidateQueries(['error-groups']);
        queryClient.invalidateQueries(['error-stats']);
      },
      onError: (error) => {
        toast.error('Błąd podczas aktualizacji statusu grupy');
        console.error('Error updating group status:', error);
      }
    }
  );

  // Mutacja masowej aktualizacji błędów
  const bulkUpdateErrorsMutation = useMutation(
    ({ errorIds, action, status }) => errorApi.bulkUpdateErrors(errorIds, action, status),
    {
      onSuccess: (data) => {
        toast.success(`Zaktualizowano ${data.updatedCount} błędów`);
        setSelectedErrors([]);
        queryClient.invalidateQueries(['errors']);
        queryClient.invalidateQueries(['error-stats']);
      },
      onError: (error) => {
        toast.error('Błąd podczas masowej aktualizacji błędów');
        console.error('Error bulk updating errors:', error);
      }
    }
  );

  // Mutacja usuwania błędu
  const deleteErrorMutation = useMutation(
    (errorId) => errorApi.deleteError(errorId),
    {
      onSuccess: () => {
        toast.success('Błąd został usunięty');
        queryClient.invalidateQueries(['errors']);
        queryClient.invalidateQueries(['error-stats']);
      },
      onError: (error) => {
        toast.error('Błąd podczas usuwania błędu');
        console.error('Error deleting error:', error);
      }
    }
  );

  // Mutacja wysyłania test alertu
  const sendTestAlertMutation = useMutation(
    (type) => errorApi.sendTestAlert(type),
    {
      onSuccess: (data) => {
        toast.success(`Test alert (${data.type}) wysłany`);
      },
      onError: (error) => {
        toast.error('Błąd podczas wysyłania test alertu');
        console.error('Error sending test alert:', error);
      }
    }
  );

  // Funkcje pomocnicze
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      severity: '',
      errorType: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const selectError = (errorId) => {
    setSelectedErrors(prev => 
      prev.includes(errorId) 
        ? prev.filter(id => id !== errorId)
        : [...prev, errorId]
    );
  };

  const selectAllErrors = () => {
    if (errorsData?.data) {
      setSelectedErrors(errorsData.data.map(error => error._id));
    }
  };

  const clearSelection = () => {
    setSelectedErrors([]);
  };

  const updateErrorStatus = (errorId, status) => {
    updateErrorStatusMutation.mutate({ errorId, status });
  };

  const updateGroupStatus = (groupId, status) => {
    updateGroupStatusMutation.mutate({ groupId, status });
  };

  const bulkUpdateErrors = (action, status = null) => {
    if (selectedErrors.length === 0) {
      toast.error('Wybierz błędy do aktualizacji');
      return;
    }
    bulkUpdateErrorsMutation.mutate({ errorIds: selectedErrors, action, status });
  };

  const deleteError = (errorId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten błąd?')) {
      deleteErrorMutation.mutate(errorId);
    }
  };

  const sendTestAlert = (type = 'email') => {
    sendTestAlertMutation.mutate(type);
  };

  const refreshData = () => {
    refetchStats();
    refetchErrors();
    refetchGroups();
    toast.success('Dane odświeżone');
  };

  // Kontekst wartości
  const value = {
    // Dane
    stats,
    errors: errorsData?.data || [],
    groups: groupsData?.data || [],
    pagination: errorsData?.pagination,
    groupsPagination: groupsData?.pagination,
    
    // Stan ładowania
    statsLoading,
    errorsLoading,
    groupsLoading,
    
    // Błędy
    statsError,
    errorsError,
    groupsError,
    
    // Filtry i selekcja
    filters,
    selectedErrors,
    
    // Funkcje
    updateFilters,
    clearFilters,
    selectError,
    selectAllErrors,
    clearSelection,
    updateErrorStatus,
    updateGroupStatus,
    bulkUpdateErrors,
    deleteError,
    sendTestAlert,
    refreshData,
    
    // Mutacje
    updateErrorStatusMutation,
    updateGroupStatusMutation,
    bulkUpdateErrorsMutation,
    deleteErrorMutation,
    sendTestAlertMutation
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}; 