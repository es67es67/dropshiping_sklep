// Konfiguracja API dla frontendu
// W trybie development używa proxy Vite, w produkcji pełnych URL-i

const getApiUrl = (endpoint) => {
  // W trybie development używamy względnych URL-i (proxy Vite)
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }
  
  // W produkcji używamy pełnych URL-i
  const baseUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
  return `${baseUrl}/api${endpoint}`;
};

// Funkcja pomocnicza do wykonywania żądań fetch
const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Dodaj token autoryzacji jeśli istnieje
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Funkcje pomocnicze dla różnych typów żądań
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  }),
  
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};

// Eksportuj funkcję getApiUrl dla kompatybilności wstecznej
export { getApiUrl };

export default api; 