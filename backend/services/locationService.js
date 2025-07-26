const mongoose = require('mongoose');

/**
 * Serwis do obsługi danych lokalizacyjnych
 * Zapewnia kaskadowe pobieranie danych i autouzupełnianie
 */
class LocationService {
  constructor() {
    this.db = mongoose.connection;
  }

  /**
   * Pobiera powiaty dla danego województwa
   * @param {string} voivodeshipCode - Kod województwa (np. '16' dla Opolskiego)
   * @returns {Promise<Array>} Lista powiatów
   */
  async getCountiesByVoivodeship(voivodeshipCode) {
    try {
      const collection = this.db.collection('locations');
      
      const counties = await collection.aggregate([
        {
          $match: {
            'teryt.voivodeshipCode': voivodeshipCode,
            'teryt.countyCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.countyCode',
            name: { $first: '$teryt.countyName' },
            code: { $first: '$teryt.countyCode' }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]).toArray();

      return counties.map(county => ({
        code: county.code,
        name: county.name
      }));
    } catch (error) {
      console.error('Błąd pobierania powiatów:', error);
      throw new Error('Nie udało się pobrać powiatów');
    }
  }

  /**
   * Pobiera gminy dla danego powiatu
   * @param {string} countyCode - Kod powiatu (np. '1609' dla opolskiego)
   * @returns {Promise<Array>} Lista gmin
   */
  async getMunicipalitiesByCounty(countyCode) {
    try {
      const collection = this.db.collection('locations');
      
      const municipalities = await collection.aggregate([
        {
          $match: {
            'teryt.countyCode': countyCode,
            'teryt.municipalityCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.municipalityCode',
            name: { $first: '$teryt.municipalityName' },
            code: { $first: '$teryt.municipalityCode' }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]).toArray();

      return municipalities.map(municipality => ({
        code: municipality.code,
        name: municipality.name
      }));
    } catch (error) {
      console.error('Błąd pobierania gmin:', error);
      throw new Error('Nie udało się pobrać gmin');
    }
  }

  /**
   * Pobiera miejscowości dla danej gminy
   * @param {string} municipalityCode - Kod gminy (np. '1609011')
   * @returns {Promise<Array>} Lista miejscowości
   */
  async getCitiesByMunicipality(municipalityCode) {
    try {
      const collection = this.db.collection('locations');
      
      const cities = await collection.aggregate([
        {
          $match: {
            'teryt.municipalityCode': municipalityCode,
            'teryt.cityCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.cityCode',
            name: { $first: '$teryt.cityName' },
            code: { $first: '$teryt.cityCode' },
            population: { $first: '$population' }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]).toArray();

      return cities.map(city => ({
        code: city.code,
        name: city.name,
        population: city.population || 0
      }));
    } catch (error) {
      console.error('Błąd pobierania miejscowości:', error);
      throw new Error('Nie udało się pobrać miejscowości');
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
      const collection = this.db.collection('locations');
      
      const cities = await collection.aggregate([
        {
          $match: {
            'teryt.cityName': { 
              $regex: new RegExp(query, 'i') 
            },
            'teryt.cityCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.cityCode',
            name: { $first: '$teryt.cityName' },
            code: { $first: '$teryt.cityCode' },
            voivodeshipCode: { $first: '$teryt.voivodeshipCode' },
            voivodeshipName: { $first: '$teryt.voivodeshipName' },
            countyCode: { $first: '$teryt.countyCode' },
            countyName: { $first: '$teryt.countyName' },
            municipalityCode: { $first: '$teryt.municipalityCode' },
            municipalityName: { $first: '$teryt.municipalityName' },
            population: { $first: '$population' }
          }
        },
        {
          $sort: { name: 1 }
        },
        {
          $limit: limit
        }
      ]).toArray();

      return cities.map(city => ({
        code: city.code,
        name: city.name,
        voivodeshipCode: city.voivodeshipCode,
        voivodeshipName: city.voivodeshipName,
        countyCode: city.countyCode,
        countyName: city.countyName,
        municipalityCode: city.municipalityCode,
        municipalityName: city.municipalityName,
        population: city.population || 0
      }));
    } catch (error) {
      console.error('Błąd wyszukiwania miejscowości:', error);
      throw new Error('Nie udało się wyszukać miejscowości');
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
      const collection = this.db.collection('locations');
      
      const municipalities = await collection.aggregate([
        {
          $match: {
            'teryt.municipalityName': { 
              $regex: new RegExp(query, 'i') 
            },
            'teryt.municipalityCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.municipalityCode',
            name: { $first: '$teryt.municipalityName' },
            code: { $first: '$teryt.municipalityCode' },
            voivodeshipCode: { $first: '$teryt.voivodeshipCode' },
            voivodeshipName: { $first: '$teryt.voivodeshipName' },
            countyCode: { $first: '$teryt.countyCode' },
            countyName: { $first: '$teryt.countyName' }
          }
        },
        {
          $sort: { name: 1 }
        },
        {
          $limit: limit
        }
      ]).toArray();

      return municipalities.map(municipality => ({
        code: municipality.code,
        name: municipality.name,
        voivodeshipCode: municipality.voivodeshipCode,
        voivodeshipName: municipality.voivodeshipName,
        countyCode: municipality.countyCode,
        countyName: municipality.countyName
      }));
    } catch (error) {
      console.error('Błąd wyszukiwania gmin:', error);
      throw new Error('Nie udało się wyszukać gmin');
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
      const collection = this.db.collection('locations');
      
      const counties = await collection.aggregate([
        {
          $match: {
            'teryt.countyName': { 
              $regex: new RegExp(query, 'i') 
            },
            'teryt.countyCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.countyCode',
            name: { $first: '$teryt.countyName' },
            code: { $first: '$teryt.countyCode' },
            voivodeshipCode: { $first: '$teryt.voivodeshipCode' },
            voivodeshipName: { $first: '$teryt.voivodeshipName' }
          }
        },
        {
          $sort: { name: 1 }
        },
        {
          $limit: limit
        }
      ]).toArray();

      return counties.map(county => ({
        code: county.code,
        name: county.name,
        voivodeshipCode: county.voivodeshipCode,
        voivodeshipName: county.voivodeshipName
      }));
    } catch (error) {
      console.error('Błąd wyszukiwania powiatów:', error);
      throw new Error('Nie udało się wyszukać powiatów');
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
      const collection = this.db.collection('locations');
      
      const voivodeships = await collection.aggregate([
        {
          $match: {
            'teryt.voivodeshipName': { 
              $regex: new RegExp(query, 'i') 
            },
            'teryt.voivodeshipCode': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$teryt.voivodeshipCode',
            name: { $first: '$teryt.voivodeshipName' },
            code: { $first: '$teryt.voivodeshipCode' }
          }
        },
        {
          $sort: { name: 1 }
        },
        {
          $limit: limit
        }
      ]).toArray();

      return voivodeships.map(voivodeship => ({
        code: voivodeship.code,
        name: voivodeship.name
      }));
    } catch (error) {
      console.error('Błąd wyszukiwania województw:', error);
      throw new Error('Nie udało się wyszukać województw');
    }
  }

  /**
   * Pobiera pełne dane lokalizacyjne dla miejscowości
   * @param {string} cityCode - Kod miejscowości
   * @returns {Promise<Object>} Pełne dane lokalizacyjne
   */
  async getLocationDataByCity(cityCode) {
    try {
      const collection = this.db.collection('locations');
      
      const location = await collection.findOne({
        'teryt.cityCode': cityCode
      });

      if (!location) {
        throw new Error('Nie znaleziono miejscowości');
      }

      return {
        city: {
          code: location.teryt.cityCode,
          name: location.teryt.cityName
        },
        municipality: {
          code: location.teryt.municipalityCode,
          name: location.teryt.municipalityName
        },
        county: {
          code: location.teryt.countyCode,
          name: location.teryt.countyName
        },
        voivodeship: {
          code: location.teryt.voivodeshipCode,
          name: location.teryt.voivodeshipName
        },
        population: location.population || 0
      };
    } catch (error) {
      console.error('Błąd pobierania danych lokalizacyjnych:', error);
      throw new Error('Nie udało się pobrać danych lokalizacyjnych');
    }
  }
}

module.exports = new LocationService(); 