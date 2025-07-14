# Implementacja Google Maps API w Portalu

## Przegląd

Zaimplementowano Google Maps API w komponencie `LocationMap.jsx` z następującymi funkcjonalnościami:

### 🗺️ Funkcje mapy
- **Klasyczna mapa Google Maps** - zamiast Web Components dla lepszej kompatybilności
- **Autouzupełnianie miejsc** - wyszukiwanie miejsc w Polsce z Places API
- **Markery i InfoWindow** - wyświetlanie informacji o lokalizacjach
- **Integracja z hierarchią administracyjną** - połączenie z backendem lokalizacji

### 🔧 Konfiguracja

#### 1. Klucz API
```html
<!-- frontend/index.html -->
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCwtl6-7ZwOqKa2rd967GHyp4JyCMgX2MI&libraries=places">
</script>
```

#### 2. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com;
" />
```

### 🎯 Funkcjonalności

#### Wyszukiwanie miejsc
- Pole wyszukiwania z autouzupełnianiem
- Ograniczenie do Polski (`componentRestrictions: { country: 'pl' }`)
- Obsługa typów: `geocode` i `establishment`

#### Hierarchia administracyjna
- Dropdowny dla województw, powiatów, gmin, miejscowości
- Pobieranie danych z backendu (`/api/locations/...`)
- Automatyczne przesuwanie mapy do wybranej lokalizacji

#### Interaktywna mapa
- Marker z InfoWindow
- Przesuwanie i przybliżanie mapy
- Stylizacja mapy (ukrycie POI)

### 📁 Struktura plików

```
frontend/
├── index.html                    # Konfiguracja Google Maps API
├── src/pages/LocationMap.jsx     # Główny komponent mapy
└── test-google-maps.html         # Test Google Maps API
```

### 🚀 Uruchomienie

1. **Backend** (port 5000):
```bash
cd backend && npm start
```

2. **Frontend** (port 3000):
```bash
cd frontend && npm run dev
```

3. **Otwórz aplikację**:
```
http://localhost:3000
```

### 🔍 Testowanie

#### Test Google Maps API
```bash
start frontend/test-google-maps.html
```

#### Test API lokalizacji
```bash
curl http://localhost:5000/api/locations/voivodeships
```

### 🛠️ Rozwiązywanie problemów

#### Błędy ładowania mapy
1. Sprawdź klucz API w `index.html`
2. Sprawdź CSP (Content Security Policy)
3. Sprawdź konsolę przeglądarki pod kątem błędów

#### Błędy API lokalizacji
1. Sprawdź czy backend działa na porcie 5000
2. Sprawdź proxy w `vite.config.js`
3. Sprawdź logi backendu

### 📊 Status implementacji

- ✅ Google Maps API - **DZIAŁA**
- ✅ Places Autocomplete - **DZIAŁA**
- ✅ Integracja z backendem - **DZIAŁA**
- ✅ Dropdowny lokalizacji - **DZIAŁA**
- ✅ Markery i InfoWindow - **DZIAŁA**
- ✅ Responsywność - **DZIAŁA**

### 🔮 Możliwe rozszerzenia

1. **Geolokalizacja** - automatyczne wykrywanie lokalizacji użytkownika
2. **Rysowanie obszarów** - granice województw/powiatów
3. **Klastrowanie markerów** - dla dużej liczby lokalizacji
4. **Street View** - widok ulicy
5. **Routing** - wyznaczanie tras

### 💡 Uwagi techniczne

- Używa klasycznej wersji Google Maps API (nie Web Components)
- Places API ograniczone do Polski
- Stylizacja mapy ukrywa POI dla lepszej czytelności
- InfoWindow z responsywnym designem
- Integracja z systemem motywów (styled-components)

### 🔐 Bezpieczeństwo

- Klucz API ograniczony do domeny
- CSP blokuje nieautoryzowane skrypty
- Walidacja danych z backendu
- Sanityzacja danych wejściowych

---

**Autor**: Asystent AI  
**Data**: 2025-01-14  
**Wersja**: 1.0 