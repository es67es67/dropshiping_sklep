const axios = require('axios');

class GUSApiService {
  constructor() {
    this.baseUrl = 'https://api.stat.gov.pl/Home/TerytApi';
    this.userAgent = 'Portal/1.0';
  }

  // Pobieranie województw z GUS API
  async getVoivodeships() {
    try {
      const response = await axios.get(`${this.baseUrl}/teryt/terc/wojewodztwa`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      return this.parseVoivodeships(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania województw z GUS:', error);
      throw error;
    }
  }

  // Pobieranie powiatów dla danego województwa
  async getCounties(voivodeshipCode) {
    try {
      const response = await axios.get(`${this.baseUrl}/teryt/terc/powiaty`, {
        params: {
          woj: voivodeshipCode
        },
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      return this.parseCounties(response.data, voivodeshipCode);
    } catch (error) {
      console.error('Błąd podczas pobierania powiatów:', error);
      throw error;
    }
  }

  // Pobieranie gmin dla danego powiatu
  async getMunicipalities(countyCode) {
    try {
      const response = await axios.get(`${this.baseUrl}/teryt/terc/gminy`, {
        params: {
          pow: countyCode
        },
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      return this.parseMunicipalities(response.data, countyCode);
    } catch (error) {
      console.error('Błąd podczas pobierania gmin:', error);
      throw error;
    }
  }

  // Pobieranie miejscowości dla danej gminy
  async getTowns(municipalityCode) {
    try {
      const response = await axios.get(`${this.baseUrl}/teryt/simc/miejscowosci`, {
        params: {
          gmina: municipalityCode
        },
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      return this.parseTowns(response.data, municipalityCode);
    } catch (error) {
      console.error('Błąd podczas pobierania miejscowości:', error);
      throw error;
    }
  }

  // Parsowanie województw
  parseVoivodeships(data) {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.nazwa,
      code: item.woj,
      type: 'województwo',
      coordinates: null // GUS API nie zawiera współrzędnych
    }));
  }

  // Parsowanie powiatów
  parseCounties(data, voivodeshipCode) {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.nazwa,
      code: item.pow,
      type: 'powiat',
      parentCode: voivodeshipCode,
      coordinates: null
    }));
  }

  // Parsowanie gmin
  parseMunicipalities(data, countyCode) {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.nazwa,
      code: item.gmi,
      type: 'gmina',
      parentCode: countyCode,
      coordinates: null
    }));
  }

  // Parsowanie miejscowości
  parseTowns(data, municipalityCode) {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.nazwa,
      code: item.sym,
      type: 'miejscowość',
      parentCode: municipalityCode,
      coordinates: null
    }));
  }
}

module.exports = GUSApiService; 