const axios = require('axios');

class OpenStreetMapService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
    this.userAgent = 'Portal/1.0'; // Wymagane przez Nominatim
  }

  // Pobieranie województw z OpenStreetMap
  async getVoivodeships() {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          country: 'Poland',
          state: 'administrative',
          format: 'json',
          limit: 50,
          addressdetails: 1
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return this.parseVoivodeships(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania województw z OSM:', error);
      throw error;
    }
  }

  // Pobieranie powiatów dla danego województwa
  async getCounties(voivodeshipName) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          country: 'Poland',
          state: voivodeshipName,
          county: 'administrative',
          format: 'json',
          limit: 100,
          addressdetails: 1
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return this.parseCounties(response.data, voivodeshipName);
    } catch (error) {
      console.error('Błąd podczas pobierania powiatów:', error);
      throw error;
    }
  }

  // Pobieranie gmin dla danego powiatu
  async getMunicipalities(countyName, voivodeshipName) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          country: 'Poland',
          state: voivodeshipName,
          county: countyName,
          city: 'administrative',
          format: 'json',
          limit: 200,
          addressdetails: 1
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return this.parseMunicipalities(response.data, countyName);
    } catch (error) {
      console.error('Błąd podczas pobierania gmin:', error);
      throw error;
    }
  }

  // Pobieranie miejscowości dla danej gminy
  async getTowns(municipalityName, countyName) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          country: 'Poland',
          county: countyName,
          city: municipalityName,
          village: 'residential',
          format: 'json',
          limit: 500,
          addressdetails: 1
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return this.parseTowns(response.data, municipalityName);
    } catch (error) {
      console.error('Błąd podczas pobierania miejscowości:', error);
      throw error;
    }
  }

  // Parsowanie województw
  parseVoivodeships(data) {
    const voivodeships = [];
    const seen = new Set();

    data.forEach(item => {
      if (item.address && item.address.state && !seen.has(item.address.state)) {
        seen.add(item.address.state);
        voivodeships.push({
          name: item.address.state,
          code: this.generateCode(item.address.state),
          type: 'województwo',
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        });
      }
    });

    return voivodeships;
  }

  // Parsowanie powiatów
  parseCounties(data, voivodeshipName) {
    const counties = [];
    const seen = new Set();

    data.forEach(item => {
      if (item.address && item.address.county && !seen.has(item.address.county)) {
        seen.add(item.address.county);
        counties.push({
          name: item.address.county,
          code: this.generateCode(item.address.county),
          type: 'powiat',
          parentName: voivodeshipName,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        });
      }
    });

    return counties;
  }

  // Parsowanie gmin
  parseMunicipalities(data, countyName) {
    const municipalities = [];
    const seen = new Set();

    data.forEach(item => {
      if (item.address && item.address.city && !seen.has(item.address.city)) {
        seen.add(item.address.city);
        municipalities.push({
          name: item.address.city,
          code: this.generateCode(item.address.city),
          type: 'gmina',
          parentName: countyName,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        });
      }
    });

    return municipalities;
  }

  // Parsowanie miejscowości
  parseTowns(data, municipalityName) {
    const towns = [];
    const seen = new Set();

    data.forEach(item => {
      const townName = item.address.village || item.address.town || item.address.city;
      if (townName && !seen.has(townName)) {
        seen.add(townName);
        towns.push({
          name: townName,
          code: this.generateCode(townName),
          type: 'miejscowość',
          parentName: municipalityName,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        });
      }
    });

    return towns;
  }

  // Generowanie kodu dla lokalizacji
  generateCode(name) {
    return name
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (match) => {
        const map = {
          'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l',
          'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
        };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
  }
}

module.exports = OpenStreetMapService; 