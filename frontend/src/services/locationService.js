/**
 * Serwis lokalizacyjny dla frontendu
 * Zapewnia komunikację z API do obsługi danych lokalizacyjnych
 */
class LocationService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
        `${this.apiUrl}/api/locations/voivodeships/${voivodeshipCode}/counties`,
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
        `${this.apiUrl}/api/locations/counties/${countyCode}/municipalities`,
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
        `${this.apiUrl}/api/locations/municipalities/${municipalityCode}/towns`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać miejscowości');
      }

      const data = await response.json();
      return data.towns || [];
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
   * Fallback - statyczne dane powiatów
   */
  getFallbackCounties(query = '') {
    const counties = [
      { id: '0201', code: '0201', name: 'Bolesławiecki' },
      { id: '0202', code: '0202', name: 'Dzierżoniowski' },
      { id: '0203', code: '0203', name: 'Głogowski' },
      { id: '0204', code: '0204', name: 'Górowski' },
      { id: '0205', code: '0205', name: 'Jaworski' },
      { id: '0206', code: '0206', name: 'Jeleniogórski' },
      { id: '0207', code: '0207', name: 'Kamiennogórski' },
      { id: '0208', code: '0208', name: 'Legnicki' },
      { id: '0209', code: '0209', name: 'Lubański' },
      { id: '0210', code: '0210', name: 'Lubiński' },
      { id: '0211', code: '0211', name: 'Lwówecki' },
      { id: '0212', code: '0212', name: 'Milicki' },
      { id: '0213', code: '0213', name: 'Oleśnicki' },
      { id: '0214', code: '0214', name: 'Oławski' },
      { id: '0215', code: '0215', name: 'Polkowicki' },
      { id: '0216', code: '0216', name: 'Strzeliński' },
      { id: '0217', code: '0217', name: 'Średzki' },
      { id: '0218', code: '0218', name: 'Świdnicki' },
      { id: '0219', code: '0219', name: 'Trzebnicki' },
      { id: '0220', code: '0220', name: 'Wałbrzyski' },
      { id: '0221', code: '0221', name: 'Wołowski' },
      { id: '0222', code: '0222', name: 'Wrocławski' },
      { id: '0223', code: '0223', name: 'Ząbkowicki' },
      { id: '0224', code: '0224', name: 'Zgorzelecki' },
      { id: '0225', code: '0225', name: 'Złotoryjski' }
    ];

    if (!query) return counties;
    
    return counties.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
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
        `${this.apiUrl}/api/locations/cities/${cityCode}`,
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