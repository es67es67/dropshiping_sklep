# Implementacja LocationSelector - Automatyczne ustawianie lokalizacji

## 🎯 Cel
Zaimplementowanie systemu automatycznego ustawiania lokalizacji na podstawie miejsca zamieszkania użytkownika oraz możliwości zmiany lokalizacji na każdej podstronie.

## 🔧 Komponenty

### 1. LocationSelector Component
**Plik:** `frontend/src/components/LocationSelector.jsx`

**Funkcjonalności:**
- Wyświetlanie aktualnej lokalizacji użytkownika
- Formularz edycji lokalizacji (województwo, powiat, gmina, miejscowość)
- Integracja z AuthContext
- Automatyczna aktualizacja localStorage i bazy danych

**Props:**
```javascript
{
  theme,                    // Motyw aplikacji
  currentLocation,          // Aktualnie wybrana lokalizacja
  onLocationChange,         // Callback po zmianie lokalizacji
  showEditButton: true      // Czy pokazać przycisk edycji
}
```

### 2. Zaktualizowane strony lokalizacji

#### Voivodeships (`/voivodeships`)
- Automatycznie ustawia województwo na podstawie `userTeryt.voivodeshipCode`
- Fallback: Mazowieckie (kod '14')
- Komponent LocationSelector na górze strony

#### Counties (`/counties`)
- Automatycznie ustawia powiat na podstawie `userTeryt.countyCode`
- Fallback: Wrocławski (kod '0223')
- Komponent LocationSelector na górze strony

#### Municipalities (`/municipalities`)
- Automatycznie ustawia gminę na podstawie `userTeryt.municipalityCode`
- Fallback: Czernica (kod '0223011')
- Komponent LocationSelector na górze strony

#### Cities (`/cities`)
- Automatycznie ustawia miasto na podstawie `userTeryt.simcCode` lub `userAddress.city`
- Fallback: Wrocław (kod '0986283')
- Komponent LocationSelector na górze strony

## 🔄 Backend - Nowe endpointy

### PUT `/api/users/location`
**Kontroler:** `userController.updateLocation`

**Funkcjonalności:**
- Aktualizacja danych lokalizacyjnych użytkownika
- Zwraca zaktualizowane dane użytkownika w formacie identycznym jak login
- Populuje dane lokalizacji

**Request Body:**
```javascript
{
  location: {
    id: string,
    name: string,
    type: string,
    code: string
  },
  teryt: {
    voivodeshipCode: string,
    countyCode: string,
    municipalityCode: string,
    tercCode: string,
    simcCode: string
  },
  address: {
    city: string,
    postalCode: string
  }
}
```

**Response:**
```javascript
{
  message: "Lokalizacja została zaktualizowana",
  user: {
    id: string,
    username: string,
    email: string,
    // ... inne dane użytkownika
    location: { /* dane lokalizacji */ },
    teryt: { /* kody TERYT */ },
    address: { /* dane adresowe */ }
  }
}
```

## 🎨 UI/UX

### Wyświetlanie aktualnej lokalizacji
```javascript
// Przykład wyświetlania
<CurrentLocation>
  <LocationIcon>📍</LocationIcon>
  <LocationInfo>
    <LocationName>Wrocław</LocationName>
    <LocationDetails>
      Województwo: 02 | Powiat: 0223 | Gmina: 0223011 | 50-001
    </LocationDetails>
  </LocationInfo>
</CurrentLocation>
```

### Formularz edycji
```javascript
// Formularz z kaskadowymi selectami
<FormGroup>
  <FormLabel>Województwo *</FormLabel>
  <FormSelect value={formData.voivodeship}>
    <option value="">Wybierz województwo</option>
    {voivodeshipsData.map(v => (
      <option key={v.code} value={v.code}>{v.name}</option>
    ))}
  </FormSelect>
</FormGroup>
```

## 🔗 Integracja z AuthContext

### Nowe funkcje pomocnicze
```javascript
const { 
  getUserLocation,    // Pobierz dane lokalizacji
  getUserTeryt,       // Pobierz kody TERYT
  getUserAddress,     // Pobierz dane adresowe
  hasLocationData,    // Sprawdź czy ma dane lokalizacyjne
  updateUserLocation  // Zaktualizuj lokalizację w localStorage
} = useAuth();
```

### Automatyczne ustawianie lokalizacji
```javascript
useEffect(() => {
  // Automatycznie ustaw województwo na podstawie lokalizacji użytkownika
  if (userTeryt?.voivodeshipCode) {
    const userVoivodeship = voivodeshipsData.find(v => v.code === userTeryt.voivodeshipCode);
    if (userVoivodeship) {
      setSelectedVoivodeship(userVoivodeship);
      return;
    }
  }

  // Fallback: ustaw domyślne województwo
  if (!selectedVoivodeship) {
    const defaultVoivodeship = voivodeshipsData.find(v => v.code === '14') || voivodeshipsData[0];
    setSelectedVoivodeship(defaultVoivodeship);
  }
}, [userTeryt, selectedVoivodeship]);
```

## 📊 Dane lokalizacyjne

### Województwa (16)
```javascript
const voivodeshipsData = [
  { code: '02', name: 'DOLNOŚLĄSKIE' },
  { code: '04', name: 'KUJAWSKO-POMORSKIE' },
  // ... wszystkie 16 województw
];
```

### Powiaty (przykład dla Dolnośląskiego)
```javascript
const countiesData = [
  { code: '0201', name: 'bolesławiecki', voivodeship: '02' },
  { code: '0202', name: 'dzierżoniowski', voivodeship: '02' },
  // ... wszystkie powiaty
];
```

### Gminy (przykład dla powiatu wrocławskiego)
```javascript
const municipalitiesData = [
  { code: '0223011', name: 'Czernica', county: '0223' },
  { code: '0223012', name: 'Długołęka', county: '0223' },
  // ... wszystkie gminy
];
```

### Miasta (przykład)
```javascript
const citiesData = [
  { code: '0986283', name: 'Wrocław', municipality: '0223011', population: 674079 },
  { code: '0986284', name: 'Warszawa', municipality: '0223012', population: 1783321 },
  // ... wszystkie miasta
];
```

## 🚀 Użycie

### Na każdej stronie lokalizacji
```javascript
import LocationSelector from '../components/LocationSelector';

// W komponencie
<LocationSelector 
  theme={theme}
  currentLocation={selectedLocation}
  onLocationChange={handleLocationChange}
/>
```

### Obsługa zmiany lokalizacji
```javascript
const handleLocationChange = async (locationData) => {
  try {
    // Aktualizuj wybraną lokalizację na podstawie nowych danych
    if (locationData.teryt?.voivodeshipCode) {
      const newVoivodeship = voivodeshipsData.find(v => v.code === locationData.teryt.voivodeshipCode);
      if (newVoivodeship) {
        setSelectedVoivodeship(newVoivodeship);
      }
    }
  } catch (error) {
    console.error('Błąd podczas aktualizacji lokalizacji:', error);
  }
};
```

## 📈 Korzyści

### 1. UX
- **Automatyczne ustawianie** lokalizacji na podstawie danych użytkownika
- **Spójny interfejs** na wszystkich stronach lokalizacji
- **Natychmiastowa aktualizacja** po zmianie lokalizacji
- **Intuicyjny formularz** z kaskadowymi selectami

### 2. Wydajność
- **Lokalne dane** w localStorage
- **Minimalne zapytania** do bazy danych
- **Szybka aktualizacja** UI

### 3. Skalowalność
- **Modularny design** - łatwe dodawanie nowych poziomów lokalizacji
- **Reużywalny komponent** - LocationSelector na wszystkich stronach
- **Rozszerzalne dane** - łatwe dodawanie nowych województw/powiatów/gmin

## 🔮 Przyszłe rozszerzenia

### 1. Dynamiczne pobieranie danych
```javascript
// TODO: Pobierz powiaty z API na podstawie województwa
const fetchCounties = async (voivodeshipCode) => {
  const response = await fetch(`/api/locations/counties?voivodeship=${voivodeshipCode}`);
  return response.json();
};
```

### 2. Geolokalizacja
```javascript
// Automatyczne wykrywanie lokalizacji na podstawie IP/GPS
const detectUserLocation = async () => {
  // Implementacja geolokalizacji
};
```

### 3. Historia lokalizacji
```javascript
// Zapisywanie historii zmian lokalizacji
const locationHistory = [
  { date: '2024-01-01', location: 'Wrocław' },
  { date: '2024-02-01', location: 'Warszawa' }
];
```

## 🎯 Podsumowanie

System LocationSelector zapewnia:
- **Automatyczne ustawianie** lokalizacji na podstawie danych użytkownika
- **Spójny interfejs** na wszystkich stronach lokalizacji
- **Intuicyjną edycję** lokalizacji z kaskadowymi selectami
- **Wydajną synchronizację** z backendem i localStorage
- **Skalowalną architekturę** dla przyszłych rozszerzeń

Użytkownicy mogą teraz łatwo zmieniać swoją lokalizację na każdej stronie, a system automatycznie ustawia odpowiednie województwo, powiat, gminę i miasto na podstawie ich danych. 