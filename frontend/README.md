# Portal Frontend - Dokumentacja

## 🏗️ Architektura

Frontend aplikacji Portal jest zbudowany w React z wykorzystaniem:
- **React Router** - nawigacja między stronami
- **Styled Components** - stylowanie komponentów
- **Context API** - zarządzanie stanem globalnym
- **Modułowa architektura** - podział na komponenty i strony

## 📁 Struktura katalogów

```
frontend/src/
├── components/          # Komponenty wielokrotnego użytku
├── pages/              # Strony aplikacji
├── contexts/           # Konteksty React (stan globalny)
├── styles/             # Style globalne i motywy
└── App.js              # Główny komponent aplikacji
```

## 🗺️ System Lokalizacji

### Przegląd funkcji

System lokalizacji zapewnia pełną hierarchię administracyjną Polski:
- **Województwa** (16 jednostek)
- **Powiaty** (380+ jednostek)
- **Gminy** (2477+ jednostek)

### Strony lokalizacyjne

#### 1. Województwa (`/voivodeships`)
- **Plik**: `pages/Voivodeships.jsx`
- **Funkcje**:
  - Lista wszystkich województw z kodami TERYT
  - Wyszukiwanie i filtrowanie
  - Statystyki (liczba powiatów, status aktywności)
  - Nawigacja do powiatów
- **API**: `/api/locations/voivodeships`

#### 2. Powiaty (`/counties/:voivodeshipCode`)
- **Plik**: `pages/Counties.jsx`
- **Funkcje**:
  - Lista powiatów dla wybranego województwa
  - Filtrowanie według typu (powiat/miasto na prawach powiatu)
  - Breadcrumb nawigacja
  - Statystyki gmin
- **API**: `/api/locations/voivodeships/:voivodeshipCode/counties`

#### 3. Gminy (`/municipalities/:countyCode`)
- **Plik**: `pages/Municipalities.jsx`
- **Funkcje**:
  - Lista gmin dla wybranego powiatu
  - Szczegółowe informacje (populacja, powierzchnia)
  - Filtrowanie według typu gminy
  - Hierarchiczna nawigacja
- **API**: `/api/locations/counties/:countyCode/municipalities`

#### 4. Analityka (`/location-analytics`)
- **Plik**: `pages/LocationAnalytics.jsx`
- **Funkcje**:
  - Statystyki ogólne systemu lokalizacji
  - Top 5 największych miast
  - Historia aktywności
  - Przygotowane miejsca na wykresy
- **API**: `/api/locations/analytics`

#### 5. Import (`/location-import`)
- **Plik**: `pages/LocationImport.jsx`
- **Funkcje**:
  - Drag & drop upload plików CSV/XML
  - Opcje konfiguracji importu
  - Pasek postępu
  - Walidacja danych
- **API**: `/api/locations/import`

#### 6. Eksport (`/location-export`)
- **Plik**: `pages/LocationExport.jsx`
- **Funkcje**:
  - Eksport w formatach CSV, JSON, XML, Excel
  - Filtrowanie danych
  - Opcje kodowania i kompresji
  - Automatyczne pobieranie plików
- **API**: `/api/locations/export`

## 🎨 System motywów

### Motywy dostępne
- **Jasny** (`lightTheme`) - domyślny
- **Ciemny** (`darkTheme`) - alternatywny

### Przełączanie motywów
```javascript
// W komponencie Navbar
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};
```

## 🔧 Komponenty wielokrotnego użytku

### LocationSelector
- **Plik**: `components/LocationSelector.jsx`
- **Funkcje**:
  - Autouzupełnianie lokalizacji
  - Integracja z Google Maps API
  - Zapisywanie wybranej lokalizacji w kontekście

### Navbar
- **Plik**: `components/Navbar.jsx`
- **Funkcje**:
  - Nawigacja główna
  - Przełączanie motywów
  - Informacje o użytkowniku
  - Linki do funkcji lokalizacyjnych

## 📊 Konteksty (Contexts)

### AuthContext
- **Plik**: `contexts/AuthContext.jsx`
- **Funkcje**:
  - Zarządzanie stanem autoryzacji
  - Logowanie/wylogowanie
  - Informacje o użytkowniku

### LocationContext (planowany)
- **Funkcje**:
  - Przechowywanie wybranej lokalizacji
  - Synchronizacja między komponentami
  - Cache lokalizacji

## 🚀 Uruchamianie

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm start

# Budowanie produkcyjne
npm run build
```

## 🔌 Integracja z API

### Endpointy lokalizacji
```javascript
// Pobieranie województw
GET /api/locations/voivodeships

// Pobieranie powiatów
GET /api/locations/voivodeships/:voivodeshipCode/counties

// Pobieranie gmin
GET /api/locations/counties/:countyCode/municipalities

// Analityka
GET /api/locations/analytics

// Import
POST /api/locations/import

// Eksport
POST /api/locations/export
```

### Obsługa błędów
Wszystkie komponenty lokalizacyjne zawierają:
- Fallback do danych mockowych
- Komunikaty błędów
- Spinnery ładowania
- Graceful degradation

## 📝 Dokumentacja JSDoc

Wszystkie komponenty zawierają dokumentację JSDoc:
```javascript
/**
 * Strona zarządzania województwami
 * Wyświetla listę wszystkich województw z możliwością wyszukiwania
 * i nawigacji do szczegółów powiatów
 */
export default function Voivodeships() {
  // ...
}
```

## 🎯 Funkcje do implementacji

### Krótkoterminowe
- [ ] Integracja z biblioteką wykresów (Chart.js/Recharts)
- [ ] LocationContext dla globalnego stanu lokalizacji
- [ ] Cache lokalizacji w localStorage
- [ ] Testy jednostkowe

### Długoterminowe
- [ ] Mapy interaktywne (Leaflet/Mapbox)
- [ ] Zaawansowane filtry i wyszukiwanie
- [ ] Eksport do PDF
- [ ] Synchronizacja w czasie rzeczywistym

## 🔒 Bezpieczeństwo

- Walidacja danych wejściowych
- Sanityzacja plików upload
- CORS konfiguracja
- Rate limiting (backend)

## 📱 Responsywność

Wszystkie komponenty są w pełni responsywne:
- Mobile-first design
- Grid system CSS
- Breakpointy: 768px, 1024px, 1200px
- Touch-friendly interfejs

## 🎨 Style i motywy

### Zmienne CSS
```javascript
const lightTheme = {
  primary: '#3b82f6',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  surface: '#ffffff',
  background: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  error: '#ef4444'
};
```

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź konsolę przeglądarki
2. Zweryfikuj połączenie z backendem
3. Sprawdź logi serwera
4. Skontaktuj się z zespołem deweloperskim
