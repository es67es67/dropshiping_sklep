const axios = require('axios');
const OpenStreetMapService = require('./openStreetMapService');
const GUSApiService = require('./gusApiService');
const Location = require('../models/locationModel');

class HybridLocationService {
  constructor() {
    this.osmService = new OpenStreetMapService();
    this.gusService = new GUSApiService();
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 godziny
  }

  // 🗺️ GŁÓWNA FUNKCJA - Pobieranie wszystkich województw
  async getAllVoivodeships() {
    try {
      console.log('🔄 Pobieranie województw z hybrydowego źródła...');
      
      // Próba z GUS API (oficjalne dane)
      let voivodeships = await this.gusService.getVoivodeships();
      
      // Jeśli GUS nie działa, użyj OpenStreetMap
      if (!voivodeships || voivodeships.length === 0) {
        console.log('⚠️ GUS API niedostępne, używam OpenStreetMap...');
        voivodeships = await this.osmService.getVoivodeships();
      }

      // Dodaj dane z różnych źródeł dla kompletności
      const enhancedVoivodeships = await this.enhanceWithAdditionalData(voivodeships, 'województwo');
      
      console.log(`✅ Pobrano ${enhancedVoivodeships.length} województw`);
      return enhancedVoivodeships;
    } catch (error) {
      console.error('❌ Błąd podczas pobierania województw:', error);
      throw error;
    }
  }

  // 🗺️ Pobieranie powiatów dla województwa
  async getCountiesForVoivodeship(voivodeshipCode) {
    try {
      console.log(`🔄 Pobieranie powiatów dla województwa ${voivodeshipCode}...`);
      
      let counties = await this.gusService.getCounties(voivodeshipCode);
      
      if (!counties || counties.length === 0) {
        counties = await this.osmService.getCounties(voivodeshipCode);
      }

      const enhancedCounties = await this.enhanceWithAdditionalData(counties, 'powiat');
      
      console.log(`✅ Pobrano ${enhancedCounties.length} powiatów`);
      return enhancedCounties;
    } catch (error) {
      console.error('❌ Błąd podczas pobierania powiatów:', error);
      throw error;
    }
  }

  // 🗺️ Pobieranie gmin dla powiatu
  async getMunicipalitiesForCounty(countyCode) {
    try {
      console.log(`🔄 Pobieranie gmin dla powiatu ${countyCode}...`);
      
      let municipalities = await this.gusService.getMunicipalities(countyCode);
      
      if (!municipalities || municipalities.length === 0) {
        municipalities = await this.osmService.getMunicipalities(countyCode);
      }

      const enhancedMunicipalities = await this.enhanceWithAdditionalData(municipalities, 'gmina');
      
      console.log(`✅ Pobrano ${enhancedMunicipalities.length} gmin`);
      return enhancedMunicipalities;
    } catch (error) {
      console.error('❌ Błąd podczas pobierania gmin:', error);
      throw error;
    }
  }

  // 🗺️ Pobieranie miejscowości dla gminy
  async getTownsForMunicipality(municipalityCode) {
    try {
      console.log(`🔄 Pobieranie miejscowości dla gminy ${municipalityCode}...`);
      
      let towns = await this.gusService.getTowns(municipalityCode);
      
      if (!towns || towns.length === 0) {
        towns = await this.osmService.getTowns(municipalityCode);
      }

      const enhancedTowns = await this.enhanceWithAdditionalData(towns, 'miejscowość');
      
      console.log(`✅ Pobrano ${enhancedTowns.length} miejscowości`);
      return enhancedTowns;
    } catch (error) {
      console.error('❌ Błąd podczas pobierania miejscowości:', error);
      throw error;
    }
  }

  // 🌍 GEOCODING - Konwersja adresu na współrzędne
  async geocodeAddress(address) {
    const cacheKey = `geocode:${address}`;
    
    // Sprawdź cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      console.log(`🌍 Geocoding adresu: ${address}`);
      
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          addressdetails: 1,
          countrycodes: 'pl'
        },
        headers: {
          'User-Agent': 'Portal/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const geocodedData = {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          display_name: result.display_name,
          address: result.address,
          type: result.type,
          importance: result.importance
        };

        // Zapisz w cache
        this.cache.set(cacheKey, {
          data: geocodedData,
          timestamp: Date.now()
        });

        console.log(`✅ Geocoding udany: ${geocodedData.lat}, ${geocodedData.lon}`);
        return geocodedData;
      }

      throw new Error('Nie znaleziono współrzędnych dla podanego adresu');
    } catch (error) {
      console.error('❌ Błąd podczas geocoding:', error);
      throw error;
    }
  }

  // 🌍 REVERSE GEOCODING - Konwersja współrzędnych na adres
  async reverseGeocode(lat, lon) {
    const cacheKey = `reverse:${lat}:${lon}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      console.log(`🌍 Reverse geocoding: ${lat}, ${lon}`);
      
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: lat,
          lon: lon,
          format: 'json',
          addressdetails: 1,
          zoom: 10
        },
        headers: {
          'User-Agent': 'Portal/1.0'
        }
      });

      if (response.data) {
        const result = response.data;
        const addressData = {
          display_name: result.display_name,
          address: result.address,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon)
        };

        this.cache.set(cacheKey, {
          data: addressData,
          timestamp: Date.now()
        });

        console.log(`✅ Reverse geocoding udany: ${addressData.display_name}`);
        return addressData;
      }

      throw new Error('Nie udało się pobrać adresu dla podanych współrzędnych');
    } catch (error) {
      console.error('❌ Błąd podczas reverse geocoding:', error);
      throw error;
    }
  }

  // 📏 OBLICZANIE ODLEGŁOŚCI między dwoma punktami (wzór Haversine)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // 🔍 WYSZUKIWANIE PRZEDMIOTÓW W OKREŚLONEJ ODLEGŁOŚCI
  async findItemsNearLocation(userLocation, items, maxDistance = 50) {
    try {
      console.log(`🔍 Wyszukiwanie przedmiotów w promieniu ${maxDistance}km od ${userLocation}`);
      
      const nearbyItems = [];
      
      for (const item of items) {
        if (item.location && item.location.coordinates) {
          const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lon,
            item.location.coordinates.lat,
            item.location.coordinates.lon
          );
          
          if (distance <= maxDistance) {
            nearbyItems.push({
              ...item,
              distance: Math.round(distance * 100) / 100, // Zaokrąglenie do 2 miejsc po przecinku
              distanceText: this.formatDistance(distance)
            });
          }
        }
      }
      
      // Sortuj według odległości
      nearbyItems.sort((a, b) => a.distance - b.distance);
      
      console.log(`✅ Znaleziono ${nearbyItems.length} przedmiotów w promieniu ${maxDistance}km`);
      return nearbyItems;
    } catch (error) {
      console.error('❌ Błąd podczas wyszukiwania przedmiotów:', error);
      throw error;
    }
  }

  // 📍 WYSZUKIWANIE MIEJSC W OKREŚLONEJ ODLEGŁOŚCI
  async findPlacesNearLocation(userLocation, places, maxDistance = 10) {
    try {
      console.log(`📍 Wyszukiwanie miejsc w promieniu ${maxDistance}km od ${userLocation}`);
      
      const nearbyPlaces = [];
      
      for (const place of places) {
        if (place.coordinates) {
          const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lon,
            place.coordinates.lat,
            place.coordinates.lon
          );
          
          if (distance <= maxDistance) {
            nearbyPlaces.push({
              ...place,
              distance: Math.round(distance * 100) / 100,
              distanceText: this.formatDistance(distance)
            });
          }
        }
      }
      
      nearbyPlaces.sort((a, b) => a.distance - b.distance);
      
      console.log(`✅ Znaleziono ${nearbyPlaces.length} miejsc w promieniu ${maxDistance}km`);
      return nearbyPlaces;
    } catch (error) {
      console.error('❌ Błąd podczas wyszukiwania miejsc:', error);
      throw error;
    }
  }

  // 🎯 AUTOUZUPEŁNIANIE ADRESÓW
  async autocompleteAddress(query, limit = 5) {
    try {
      console.log(`🎯 Autouzupełnianie dla: ${query}`);
      // Najpierw szukaj w bazie MongoDB
      const dbResults = await Location.find({
        type: 'miejscowość',
        name: { $regex: `^${query}`, $options: 'i' },
        isActive: true
      })
      .limit(limit)
      .lean();

      if (dbResults && dbResults.length > 0) {
        const suggestions = dbResults.map(item => ({
          display_name: item.name,
          lat: item.coordinates?.lat,
          lon: item.coordinates?.lng,
          type: item.type,
          importance: 1,
          address: { name: item.name }
        }));
        console.log(`✅ Znaleziono ${suggestions.length} sugestii w bazie`);
        return suggestions;
      }

      // Jeśli nie ma wyników w bazie, użyj OSM
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: limit,
          addressdetails: 1,
          countrycodes: 'pl',
          dedupe: 1
        },
        headers: {
          'User-Agent': 'Portal/1.0'
        }
      });

      const suggestions = response.data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        importance: item.importance,
        address: item.address
      }));

      console.log(`✅ Znaleziono ${suggestions.length} sugestii w OSM`);
      return suggestions;
    } catch (error) {
      console.error('❌ Błąd podczas autouzupełniania:', error);
      throw error;
    }
  }

  // 🔧 Wzbogacanie danych o dodatkowe informacje
  async enhanceWithAdditionalData(locations, type) {
    const enhanced = [];
    
    for (const location of locations) {
      try {
        // Dodaj współrzędne jeśli ich nie ma
        if (!location.coordinates && location.name) {
          const geocoded = await this.geocodeAddress(`${location.name}, Polska`);
          location.coordinates = {
            lat: geocoded.lat,
            lon: geocoded.lon
          };
        }
        
        // Dodaj dodatkowe informacje
        location.enhanced = true;
        location.lastUpdated = new Date().toISOString();
        
        enhanced.push(location);
      } catch (error) {
        console.warn(`⚠️ Nie udało się wzbogacić danych dla ${location.name}:`, error.message);
        enhanced.push(location);
      }
    }
    
    return enhanced;
  }

  // 📏 Formatowanie odległości
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
      return `${Math.round(distance * 10) / 10}km`;
    } else {
      return `${Math.round(distance)}km`;
    }
  }

  // 🧹 Czyszczenie cache
  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache wyczyszczony');
  }

  // 📊 Statystyki cache
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = HybridLocationService; 