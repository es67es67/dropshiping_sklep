import axios from 'axios';

// 🔴 CRITICAL SERVICE: API Service
// Zależności: axios
// Wpływ: Wszystkie komunikacje z backendem
// Jeśli się zepsuje: brak danych z API
// Używane w: ErrorContext, wszystkich komponentach

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Konfiguracja axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dla requestów
api.interceptors.request.use(
  (config) => {
    // Dodaj token autoryzacji jeśli istnieje
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('💥 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor dla odpowiedzi
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('💥 API Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url
    });
    
    // Obsługa błędów autoryzacji
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API dla błędów
export const errorApi = {
  // Rejestracja błędu
  reportError: async (errorData) => {
    const response = await api.post('/errors/report', errorData);
    return response.data;
  },

  // Pobieranie listy błędów
  getErrors: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/errors?${params.toString()}`);
    return response.data;
  },

  // Pobieranie szczegółów błędu
  getError: async (errorId) => {
    const response = await api.get(`/errors/${errorId}`);
    return response.data;
  },

  // Aktualizacja statusu błędu
  updateErrorStatus: async (errorId, status) => {
    const response = await api.put(`/errors/${errorId}/status`, { status });
    return response.data;
  },

  // Usuwanie błędu
  deleteError: async (errorId) => {
    const response = await api.delete(`/errors/${errorId}`);
    return response.data;
  },

  // Pobieranie statystyk błędów
  getStats: async (timeRange = '24h') => {
    const response = await api.get(`/errors/stats?timeRange=${timeRange}`);
    return response.data;
  },

  // Pobieranie listy grup błędów
  getErrorGroups: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/errors/groups?${params.toString()}`);
    return response.data;
  },

  // Pobieranie szczegółów grupy błędów
  getErrorGroup: async (groupId) => {
    const response = await api.get(`/errors/groups/${groupId}`);
    return response.data;
  },

  // Aktualizacja statusu grupy błędów
  updateGroupStatus: async (groupId, status) => {
    const response = await api.put(`/errors/groups/${groupId}/status`, { status });
    return response.data;
  },

  // Masowa aktualizacja błędów
  bulkUpdateErrors: async (errorIds, action, status = null) => {
    const response = await api.post('/errors/bulk', {
      errorIds,
      action,
      status
    });
    return response.data;
  },

  // Wysyłanie test alertu
  sendTestAlert: async (type = 'email') => {
    const response = await api.post('/errors/alerts/test', { type });
    return response.data;
  },

  // Pobieranie konfiguracji alertów
  getAlertConfig: async () => {
    const response = await api.get('/errors/alerts/config');
    return response.data;
  }
};

// API dla dashboardu
export const dashboardApi = {
  // Pobieranie danych dashboardu
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Pobieranie wykresów
  getCharts: async (timeRange = '24h') => {
    const response = await api.get(`/dashboard/charts?timeRange=${timeRange}`);
    return response.data;
  },

  // Pobieranie aktywnych błędów
  getActiveErrors: async () => {
    const response = await api.get('/dashboard/active-errors');
    return response.data;
  },

  // Pobieranie trendów
  getTrends: async () => {
    const response = await api.get('/dashboard/trends');
    return response.data;
  }
};

// API dla alertów
export const alertApi = {
  // Pobieranie listy alertów
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },

  // Tworzenie alertu
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  // Aktualizacja alertu
  updateAlert: async (alertId, alertData) => {
    const response = await api.put(`/alerts/${alertId}`, alertData);
    return response.data;
  },

  // Usuwanie alertu
  deleteAlert: async (alertId) => {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  },

  // Test alertu
  testAlert: async (alertId) => {
    const response = await api.post(`/alerts/${alertId}/test`);
    return response.data;
  }
};

// API dla ustawień
export const settingsApi = {
  // Pobieranie ustawień
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Aktualizacja ustawień
  updateSettings: async (settings) => {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  // Test konfiguracji email
  testEmailConfig: async (config) => {
    const response = await api.post('/settings/test-email', config);
    return response.data;
  },

  // Test konfiguracji Slack
  testSlackConfig: async (config) => {
    const response = await api.post('/settings/test-slack', config);
    return response.data;
  },

  // Test konfiguracji Discord
  testDiscordConfig: async (config) => {
    const response = await api.post('/settings/test-discord', config);
    return response.data;
  }
};

// API dla użytkowników
export const userApi = {
  // Logowanie
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Rejestracja
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Pobieranie profilu użytkownika
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Aktualizacja profilu
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Zmiana hasła
  changePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  }
};

// Funkcje pomocnicze
export const apiUtils = {
  // Sprawdzanie połączenia z API
  checkConnection: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Brak połączenia z API');
    }
  },

  // Pobieranie wersji API
  getApiVersion: async () => {
    try {
      const response = await api.get('/version');
      return response.data;
    } catch (error) {
      return { version: 'unknown' };
    }
  },

  // Obsługa błędów API
  handleApiError: (error) => {
    if (error.response) {
      // Błąd z odpowiedzią serwera
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return `Błąd walidacji: ${data.error || 'Nieprawidłowe dane'}`;
        case 401:
          return 'Brak autoryzacji. Zaloguj się ponownie.';
        case 403:
          return 'Brak uprawnień do tej operacji.';
        case 404:
          return 'Zasób nie został znaleziony.';
        case 429:
          return 'Zbyt wiele żądań. Spróbuj ponownie później.';
        case 500:
          return 'Błąd serwera. Spróbuj ponownie później.';
        default:
          return data.error || 'Wystąpił nieoczekiwany błąd.';
      }
    } else if (error.request) {
      // Błąd połączenia
      return 'Brak połączenia z serwerem. Sprawdź połączenie internetowe.';
    } else {
      // Inny błąd
      return error.message || 'Wystąpił nieoczekiwany błąd.';
    }
  }
};

export default api; 