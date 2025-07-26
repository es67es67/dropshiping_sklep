/**
 * Serwis lokalizacyjny dla frontendu
 * Zapewnia komunikację z API do obsługi danych lokalizacyjnych
 */
class LocationService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'https://portal-backend-igf9.onrender.com';
  }

  /**
   * Pobiera token z localStorage
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Pobiera powiaty dla danego województwa
   * @param {string} voivodeshipCode - Kod województwa
   * @returns {Promise<Array>} Lista powiatów
   */
  async getCountiesByVoivodeship(voivodeshipCode) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/users/locations/counties?voivodeship=${voivodeshipCode}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać powiatów');
      }

      const data = await response.json();
      return data.counties || [];
    } catch (error) {
      console.error('Błąd pobierania powiatów:', error);
      throw error;
    }
  }

  /**
   * Pobiera gminy dla danego powiatu
   * @param {string} countyCode - Kod powiatu
   * @returns {Promise<Array>} Lista gmin
   */
  async getMunicipalitiesByCounty(countyCode) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/users/locations/municipalities?county=${countyCode}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać gmin');
      }

      const data = await response.json();
      return data.municipalities || [];
    } catch (error) {
      console.error('Błąd pobierania gmin:', error);
      throw error;
    }
  }

  /**
   * Pobiera miejscowości dla danej gminy
   * @param {string} municipalityCode - Kod gminy
   * @returns {Promise<Array>} Lista miejscowości
   */
  async getCitiesByMunicipality(municipalityCode) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/users/locations/cities?municipality=${municipalityCode}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać miejscowości');
      }

      const data = await response.json();
      return data.cities || [];
    } catch (error) {
      console.error('Błąd pobierania miejscowości:', error);
      throw error;
    }
  }

  /**
   * Wyszukuje miejscowości na podstawie części nazwy
   * @param {string} query - Część nazwy miejscowości
   * @param {number} limit - Maksymalna liczba wyników
   * @returns {Promise<Array>} Lista pasujących miejscowości
   */
  async searchCities(query, limit = 10) {
    try {
      // Użyj działającego endpointu /search zamiast /search/cities
      const response = await fetch(
        `${this.apiUrl}/api/locations/search?q=${encodeURIComponent(query)}&type=miejscowość&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się wyszukać miejscowości');
      }

      const data = await response.json();
      console.log('🔍 Wyniki wyszukiwania miejscowości:', data);
      
      // Konwertuj format z locations na cities
      const cities = data.locations?.map(location => ({
        code: location.code || location._id,
        name: location.name,
        voivodeshipCode: location.wojewodztwo?.code,
        voivodeshipName: location.wojewodztwo?.name,
        countyCode: location.powiat?.code,
        countyName: location.powiat?.name,
        municipalityCode: location.gmina?.code,
        municipalityName: location.gmina?.name,
        population: location.population,
        coordinates: location.coordinates
      })) || [];
      
      return cities;
    } catch (error) {
      console.error('Błąd wyszukiwania miejscowości:', error);
      throw error;
    }
  }

  /**
   * Wyszukuje gminy na podstawie części nazwy
   * @param {string} query - Część nazwy gminy
   * @param {number} limit - Maksymalna liczba wyników
   * @returns {Promise<Array>} Lista pasujących gmin
   */
  async searchMunicipalities(query, limit = 10) {
    try {
      // Użyj działającego endpointu /search zamiast /search/municipalities
      const response = await fetch(
        `${this.apiUrl}/api/locations/search?q=${encodeURIComponent(query)}&type=gmina&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się wyszukać gmin');
      }

      const data = await response.json();
      console.log('🔍 Wyniki wyszukiwania gmin:', data);
      
      // Konwertuj format z locations na municipalities
      const municipalities = data.locations?.map(location => ({
        code: location.code || location._id,
        name: location.name,
        voivodeshipCode: location.wojewodztwo?.code,
        voivodeshipName: location.wojewodztwo?.name,
        countyCode: location.powiat?.code,
        countyName: location.powiat?.name,
        type: location.type,
        coordinates: location.coordinates
      })) || [];
      
      return municipalities;
    } catch (error) {
      console.error('Błąd wyszukiwania gmin:', error);
      throw error;
    }
  }

  /**
   * Wyszukuje powiaty na podstawie części nazwy
   * @param {string} query - Część nazwy powiatu
   * @param {number} limit - Maksymalna liczba wyników
   * @returns {Promise<Array>} Lista pasujących powiatów
   */
  async searchCounties(query, limit = 10) {
    try {
      // Użyj publicznego endpointu dla powiatów
      const response = await fetch(
        `${this.apiUrl}/api/locations/voivodeships/02/counties?search=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się wyszukać powiatów');
      }

      const data = await response.json();
      // Konwertuj format odpowiedzi
      return Array.isArray(data.counties) ? data.counties : [];
    } catch (error) {
      console.error('Błąd wyszukiwania powiatów:', error);
      // Fallback do statycznych danych
      return this.getFallbackCounties(query);
    }
  }

  /**
   * Wyszukuje województwa na podstawie części nazwy
   * @param {string} query - Część nazwy województwa
   * @param {number} limit - Maksymalna liczba wyników
   * @returns {Promise<Array>} Lista pasujących województw
   */
  async searchVoivodeships(query, limit = 10) {
    try {
      // Użyj publicznego endpointu dla województw
      const response = await fetch(
        `${this.apiUrl}/api/locations/voivodeships?search=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się wyszukać województw');
      }

      const data = await response.json();
      // Konwertuj format odpowiedzi
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Błąd wyszukiwania województw:', error);
      // Fallback do statycznych danych
      return this.getFallbackVoivodeships(query);
    }
  }

  /**
   * Fallback - statyczne dane województw
   */
  getFallbackVoivodeships(query = '') {
    const voivodeships = [
      { id: '02', code: '02', name: 'DOLNOŚLĄSKIE' },
      { id: '04', code: '04', name: 'KUJAWSKO-POMORSKIE' },
      { id: '06', code: '06', name: 'LUBELSKIE' },
      { id: '08', code: '08', name: 'LUBUSKIE' },
      { id: '10', code: '10', name: 'ŁÓDZKIE' },
      { id: '12', code: '12', name: 'MAŁOPOLSKIE' },
      { id: '14', code: '14', name: 'MAZOWIECKIE' },
      { id: '16', code: '16', name: 'OPOLSKIE' },
      { id: '18', code: '18', name: 'PODKARPACKIE' },
      { id: '20', code: '20', name: 'PODLASKIE' },
      { id: '22', code: '22', name: 'POMORSKIE' },
      { id: '24', code: '24', name: 'ŚLĄSKIE' },
      { id: '26', code: '26', name: 'ŚWIĘTOKRZYSKIE' },
      { id: '28', code: '28', name: 'WARMIŃSKO-MAZURSKIE' },
      { id: '30', code: '30', name: 'WIELKOPOLSKIE' },
      { id: '32', code: '32', name: 'ZACHODNIOPOMORSKIE' }
    ];

    if (!query) return voivodeships;
    
    return voivodeships.filter(v => 
      v.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Pobiera pełne dane lokalizacyjne dla miejscowości
   * @param {string} cityCode - Kod miejscowości
   * @returns {Promise<Object>} Pełne dane lokalizacyjne
   */
  async getLocationDataByCity(cityCode) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/users/locations/city/${cityCode}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych lokalizacyjnych');
      }

      const data = await response.json();
      return data.locationData;
    } catch (error) {
      console.error('Błąd pobierania danych lokalizacyjnych:', error);
      throw error;
    }
  }

  /**
   * Debounce function dla wyszukiwania
   * @param {Function} func - Funkcja do wywołania
   * @param {number} wait - Czas oczekiwania w ms
   * @returns {Function} Zdebounced funkcja
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Wyszukuje ulice w bazie lokalnej
   * @param {string} query - Zapytanie wyszukiwania
   * @param {number} limit - Maksymalna liczba wyników
   * @returns {Promise<Array>} Lista pasujących ulic
   */
  async searchStreets(query, limit = 10) {
    try {
      // Wyszukiwanie ulic w bazie lokalnej
      const response = await fetch(
        `${this.apiUrl}/api/locations/search?q=${encodeURIComponent(query)}&type=ulica&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się wyszukać ulic');
      }

      const data = await response.json();
      console.log('🔍 Wyniki wyszukiwania ulic:', data);
      
      // Konwertuj format z locations na streets
      const streets = data.locations?.map(location => ({
        code: location.code || location._id,
        name: location.name,
        voivodeshipCode: location.wojewodztwo?.code,
        voivodeshipName: location.wojewodztwo?.name,
        countyCode: location.powiat?.code,
        countyName: location.powiat?.name,
        municipalityCode: location.gmina?.code,
        municipalityName: location.gmina?.name,
        type: location.type,
        coordinates: location.coordinates
      })) || [];
      
      return streets;
    } catch (error) {
      console.error('Błąd wyszukiwania ulic:', error);
      throw error;
    }
  }

  /**
   * Tworzy debounced funkcję wyszukiwania
   * @param {Function} searchFunction - Funkcja wyszukiwania
   * @param {number} delay - Opóźnienie w ms
   * @returns {Function} Zdebounced funkcja wyszukiwania
   */
  createDebouncedSearch(searchFunction, delay = 300) {
    return this.debounce(searchFunction, delay);
  }
}

// Eksportuj instancję serwisu
export default new LocationService(); 