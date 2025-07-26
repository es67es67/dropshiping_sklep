# System Lokalizacyjny z Autouzupełnianiem

## Przegląd

System lokalizacyjny zapewnia inteligentne wyszukiwanie i autouzupełnianie danych lokalizacyjnych (województwa, powiaty, gminy, miejscowości) z możliwością kaskadowego aktualizowania pól. System składa się z modułowych komponentów, które można łatwo integrować w różnych częściach aplikacji.

## Architektura

### Backend

#### 1. Serwis Lokalizacyjny (`backend/services/locationService.js`)
- **Cel**: Centralny serwis do obsługi danych lokalizacyjnych
- **Funkcje**:
  - Kaskadowe pobieranie danych (powiaty → gminy → miejscowości)
  - Wyszukiwanie z autouzupełnianiem
  - Pobieranie pełnych danych lokalizacyjnych
- **Zalety**:
  - Możliwość ponownego użycia w różnych kontrolerach
  - Łatwe testowanie i utrzymanie
  - Centralizacja logiki biznesowej

#### 2. Kontroler Użytkownika (`backend/controllers/userController.js`)
- **Nowe metody**:
  - `getCountiesByVoivodeship()` - pobiera powiaty dla województwa
  - `getMunicipalitiesByCounty()` - pobiera gminy dla powiatu
  - `getCitiesByMunicipality()` - pobiera miejscowości dla gminy
  - `searchCities()` - wyszukuje miejscowości
  - `searchMunicipalities()` - wyszukuje gminy
  - `searchCounties()` - wyszukuje powiaty
  - `searchVoivodeships()` - wyszukuje województwa
  - `getLocationDataByCity()` - pobiera pełne dane dla miejscowości

#### 3. Routing (`backend/routes/userRoutes.js`)
- **Nowe endpointy**:
  - `GET /api/users/locations/counties?voivodeship={code}` - powiaty
  - `GET /api/users/locations/municipalities?county={code}` - gminy
  - `GET /api/users/locations/cities?municipality={code}` - miejscowości
  - `GET /api/users/locations/search/cities?query={text}&limit={number}` - wyszukiwanie miejscowości
  - `GET /api/users/locations/search/municipalities?query={text}&limit={number}` - wyszukiwanie gmin
  - `GET /api/users/locations/search/counties?query={text}&limit={number}` - wyszukiwanie powiatów
  - `GET /api/users/locations/search/voivodeships?query={text}&limit={number}` - wyszukiwanie województw
  - `GET /api/users/locations/city/{cityCode}` - pełne dane miejscowości

### Frontend

#### 1. Serwis Lokalizacyjny (`frontend/src/services/locationService.js`)
- **Cel**: Komunikacja z API lokalizacyjnym
- **Funkcje**:
  - Wszystkie metody backendowe dostępne jako async/await
  - Automatyczne zarządzanie tokenami autoryzacji
  - Debounced search dla optymalizacji wydajności
- **Zalety**:
  - Możliwość ponownego użycia w różnych komponentach
  - Centralizacja konfiguracji API
  - Łatwe testowanie

#### 2. Komponent Autouzupełniania (`frontend/src/components/LocationAutocomplete.jsx`)
- **Cel**: Uniwersalny komponent autouzupełniania
- **Funkcje**:
  - Wyszukiwanie w czasie rzeczywistym
  - Nawigacja klawiaturą (strzałki, Enter, Escape)
  - Debounced search (300ms)
  - Obsługa błędów i stanów ładowania
  - Responsywny design z obsługą motywów
- **Props**:
  - `type` - typ danych ('cities', 'municipalities', 'counties', 'voivodeships')
  - `value` - wartość pola
  - `onChange` - callback przy zmianie
  - `onSelect` - callback przy wyborze
  - `placeholder` - placeholder
  - `theme` - motyw ('light'/'dark')
  - `disabled` - czy wyłączone
  - `className` - dodatkowe klasy CSS

#### 3. Komponent Selektor Lokalizacji (`frontend/src/components/LocationSelector.jsx`)
- **Cel**: Kompletny formularz wyboru lokalizacji
- **Funkcje**:
  - Autouzupełnianie dla wszystkich pól
  - Kaskadowe aktualizowanie danych
  - Automatyczne ustawianie powiązanych pól
  - Integracja z AuthContext
- **Zalety**:
  - Możliwość użycia w różnych miejscach aplikacji
  - Automatyczna synchronizacja z localStorage
  - Obsługa błędów i walidacji

## Funkcjonalności

### 1. Autouzupełnianie
- **Wyszukiwanie miejscowości**: Wpisz "br" → pokazuje "Brzeg", "Brodnica", "Brzozów"
- **Wyszukiwanie gmin**: Wpisz "czern" → pokazuje "Czernica", "Czernichów"
- **Wyszukiwanie powiatów**: Wpisz "opol" → pokazuje "opolski", "opolski grodzki"
- **Wyszukiwanie województw**: Wpisz "opol" → pokazuje "OPOLSKIE"

### 2. Kaskadowe Aktualizowanie
- **Wybór miejscowości**: Automatycznie ustawia województwo, powiat, gminę
- **Wybór gminy**: Automatycznie ustawia województwo, powiat
- **Wybór powiatu**: Automatycznie ustawia województwo
- **Wybór województwa**: Pobiera listę powiatów

### 3. Inteligentne Wyszukiwanie
- **Debounced search**: Opóźnienie 300ms między wpisywaniem
- **Minimum 2 znaki**: Wyszukiwanie rozpoczyna się po wpisaniu 2 znaków
- **Case-insensitive**: Niezależne od wielkości liter
- **Limit wyników**: Maksymalnie 10 wyników na raz

## Przykłady Użycia

### 1. Podstawowe Autouzupełnianie
```jsx
import LocationAutocomplete from '../components/LocationAutocomplete';

<LocationAutocomplete
  type="cities"
  value={city}
  onChange={setCity}
  onSelect={(item) => {
    console.log('Wybrano:', item.name);
    console.log('Województwo:', item.voivodeshipName);
  }}
  placeholder="Wpisz nazwę miasta..."
  theme="light"
/>
```

### 2. Kompletny Selektor Lokalizacji
```jsx
import LocationSelector from '../components/LocationSelector';

<LocationSelector
  theme={theme}
  currentLocation={userLocation}
  onLocationChange={(newLocation) => {
    console.log('Nowa lokalizacja:', newLocation);
  }}
  showEditButton={true}
/>
```

### 3. Integracja z Serwisem
```jsx
import locationService from '../services/locationService';

// Wyszukiwanie miejscowości
const cities = await locationService.searchCities('Warszawa', 5);

// Pobieranie powiatów
const counties = await locationService.getCountiesByVoivodeship('14');

// Pobieranie pełnych danych
const locationData = await locationService.getLocationDataByCity('1465011');
```

## Korzyści

### 1. Modułowość
- Każdy komponent można używać niezależnie
- Łatwe testowanie poszczególnych części
- Możliwość ponownego użycia w różnych miejscach

### 2. Wydajność
- Debounced search zmniejsza liczbę zapytań
- Kaskadowe pobieranie tylko potrzebnych danych
- Cachowanie wyników w komponencie

### 3. UX
- Intuicyjne wyszukiwanie z autouzupełnianiem
- Automatyczne ustawianie powiązanych pól
- Responsywny design z obsługą klawiatury

### 4. Utrzymywalność
- Centralizacja logiki w serwisach
- Jasna separacja odpowiedzialności
- Łatwe dodawanie nowych funkcjonalności

## Rozszerzenia

### 1. Dodanie Nowych Typów Danych
1. Dodaj metodę w `locationService.js` (backend)
2. Dodaj endpoint w `userRoutes.js`
3. Dodaj metodę w `userController.js`
4. Dodaj obsługę w `locationService.js` (frontend)
5. Dodaj case w `LocationAutocomplete.jsx`

### 2. Dodanie Nowych Funkcjonalności
- Filtrowanie po populacji
- Sortowanie wyników
- Historia wyszukiwań
- Ulubione lokalizacje
- Geolokalizacja

### 3. Optymalizacje
- Cachowanie w localStorage
- Lazy loading wyników
- Virtual scrolling dla dużych list
- Offline support

## Bezpieczeństwo

- Wszystkie endpointy wymagają autoryzacji
- Walidacja danych wejściowych
- Sanityzacja zapytań SQL
- Rate limiting dla wyszukiwań
- Logowanie błędów i prób dostępu 