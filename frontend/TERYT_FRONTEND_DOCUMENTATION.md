# 🗺️ Dokumentacja funkcjonalności TERYT - Frontend

## 📋 Przegląd

Dokumentacja opisuje implementację funkcjonalności TERYT/SIMC/ULIC w interfejsie użytkownika portalu. Nowe komponenty umożliwiają zaawansowane wyszukiwanie i analizę danych geograficznych z wykorzystaniem polskich kodów administracyjnych.

## 🎯 Główne funkcjonalności

### 1. **Wyszukiwanie zaawansowane TERYT** (`TerytSearch.jsx`)
- Wyszukiwanie sklepów, firm i użytkowników po kodach TERYT
- Filtrowanie po różnych typach kodów (TERC, SIMC, ULIC, pełny kod)
- Wyświetlanie wyników z informacjami o kodach administracyjnych

### 2. **Autouzupełnianie adresów** (`TerytAutocomplete.jsx`)
- Inteligentne autouzupełnianie adresów z kodami TERYT
- Debounced search z opóźnieniem 300ms
- Wyświetlanie sugestii z kodami administracyjnymi
- Obsługa klawiatury (strzałki, Enter, Escape)

### 3. **Mapa z filtrowaniem TERYT** (`TerytMap.jsx`)
- Wizualizacja obiektów na mapie
- Filtrowanie po kodach TERYT w określonym promieniu
- Interaktywna lista wyników
- Aktualizacja centrum mapy na podstawie wybranych obiektów

### 4. **Strona główna funkcjonalności** (`TerytFeatures.jsx`)
- Integracja wszystkich komponentów TERYT
- System zakładek dla łatwej nawigacji
- Informacje edukacyjne o kodach TERYT
- Demo funkcjonalności

## 🏗️ Struktura komponentów

```
frontend/src/
├── components/
│   ├── TerytSearch.jsx          # Wyszukiwanie zaawansowane
│   ├── TerytAutocomplete.jsx    # Autouzupełnianie adresów
│   └── TerytMap.jsx             # Mapa z filtrowaniem
└── pages/
    └── TerytFeatures.jsx        # Strona główna funkcjonalności
```

## 🔧 Komponenty szczegółowo

### TerytSearch.jsx

**Funkcjonalności:**
- Formularz wyszukiwania z polami dla różnych kodów TERYT
- Wyszukiwanie w sklepach, firmach i użytkownikach
- Wyświetlanie wyników w kartach z informacjami TERYT
- Obsługa błędów i stanu ładowania

**Props:**
- Brak (komponent samodzielny)

**API Endpoints:**
- `GET /api/shops/search-by-teryt` - wyszukiwanie sklepów
- `GET /api/company-profiles/search-by-teryt` - wyszukiwanie firm
- `GET /api/users/search-by-teryt` - wyszukiwanie użytkowników

### TerytAutocomplete.jsx

**Funkcjonalności:**
- Autouzupełnianie adresów z debouncing
- Wyświetlanie sugestii z kodami TERYT
- Obsługa klawiatury (nawigacja, wybór, anulowanie)
- Wyświetlanie wybranego adresu z kodami

**Props:**
- `onAddressSelect` (function) - callback po wyborze adresu
- `placeholder` (string) - placeholder dla inputa
- `showSelected` (boolean) - czy pokazywać wybrany adres
- `initialValue` (string) - początkowa wartość

**API Endpoints:**
- `GET /api/geocoding/autocomplete` - autouzupełnianie adresów

### TerytMap.jsx

**Funkcjonalności:**
- Panel filtrów TERYT
- Wyszukiwanie obiektów w promieniu
- Interaktywna lista wyników
- Aktualizacja centrum mapy

**Props:**
- Brak (komponent samodzielny)

**API Endpoints:**
- `GET /api/geocoding/search-nearby` - wyszukiwanie w promieniu

### TerytFeatures.jsx

**Funkcjonalności:**
- Integracja wszystkich komponentów TERYT
- System zakładek
- Informacje edukacyjne
- Demo funkcjonalności

**Props:**
- `theme` (object) - motyw aplikacji

## 🎨 Stylowanie

Wszystkie komponenty używają `styled-components` z motywem aplikacji:

```javascript
const StyledComponent = styled.div`
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
`;
```

**Główne kolory motywu:**
- `primary` - główny kolor aplikacji
- `secondary` - kolor pomocniczy
- `text` - kolor tekstu
- `textSecondary` - kolor tekstu pomocniczego
- `cardBackground` - tło kart
- `inputBackground` - tło inputów
- `border` - kolor ramek

## 🔌 Integracja z backendem

### Autoryzacja
Komponenty automatycznie dodają token JWT do nagłówków jeśli użytkownik jest zalogowany:

```javascript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json'
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

### Obsługa błędów
Wszystkie komponenty obsługują błędy API i wyświetlają odpowiednie komunikaty:

```javascript
try {
  const response = await fetch(url, { headers });
  if (response.ok) {
    const data = await response.json();
    // Obsługa sukcesu
  } else {
    setError('Błąd podczas wyszukiwania');
  }
} catch (err) {
  console.error('Błąd:', err);
  setError('Wystąpił błąd podczas wyszukiwania');
}
```

## 🚀 Routing

Nowa strona została dodana do routingu w `App.jsx`:

```javascript
<Route path="/teryt-features" element={<TerytFeatures theme={currentTheme} />} />
```

Link w nawigacji:
```javascript
<NavLink to="/teryt-features" theme={theme} layout={layout}>
  🗺️ TERYT
</NavLink>
```

## 📱 Responsywność

Wszystkie komponenty są w pełni responsywne:

- **Desktop**: Pełne funkcjonalności z rozbudowanymi panelami
- **Tablet**: Dostosowane layouty z zachowaniem funkcjonalności
- **Mobile**: Uproszczone interfejsy z optymalizacją dla dotyku

### Przykład responsywności:

```javascript
const MapContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
```

## 🧪 Testowanie

### Testowanie komponentów

1. **TerytSearch:**
   - Wprowadź różne kody TERYT
   - Sprawdź wyszukiwanie w różnych typach obiektów
   - Zweryfikuj wyświetlanie wyników

2. **TerytAutocomplete:**
   - Wpisz adres i sprawdź sugestie
   - Użyj klawiatury do nawigacji
   - Sprawdź wybór adresu

3. **TerytMap:**
   - Ustaw filtry TERYT
   - Sprawdź wyszukiwanie w promieniu
   - Zweryfikuj interakcję z wynikami

### Testowanie API

Wszystkie endpointy można testować bezpośrednio:

```bash
# Wyszukiwanie sklepów po TERYT
curl "http://localhost:5000/api/shops/search-by-teryt?tercCode=140101"

# Autouzupełnianie adresów
curl "http://localhost:5000/api/geocoding/autocomplete?query=Warszawa"

# Wyszukiwanie w promieniu
curl "http://localhost:5000/api/geocoding/search-nearby?tercCode=140101&radius=10"
```

## 🔄 Stan aplikacji

Komponenty używają lokalnego stanu React z `useState`:

```javascript
const [searchParams, setSearchParams] = useState({
  tercCode: '',
  simcCode: '',
  ulicCode: '',
  // ...
});

const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

## 🎯 Następne kroki

### Planowane ulepszenia:

1. **Integracja z Google Maps API**
   - Rzeczywista mapa z markerami
   - Interaktywne wybieranie lokalizacji

2. **Zaawansowane filtry**
   - Filtrowanie po kategoriach
   - Sortowanie wyników
   - Eksport danych

3. **Analytics**
   - Statystyki wyszukiwań
   - Popularne lokalizacje
   - Raporty geograficzne

4. **Optymalizacja wydajności**
   - Cachowanie wyników
   - Lazy loading komponentów
   - Virtual scrolling dla dużych list

## 📚 Przydatne linki

- [Dokumentacja backend TERYT](../backend/TERYT_SEARCH_API.md)
- [API Documentation](../frontend/API_DOCUMENTATION.md)
- [Backend Routes](../backend/routes/)
- [Frontend Components](../frontend/src/components/)

## 🤝 Wsparcie

W przypadku problemów z funkcjonalnościami TERYT:

1. Sprawdź logi konsoli przeglądarki
2. Zweryfikuj połączenie z backendem
3. Sprawdź czy wszystkie endpointy działają
4. Upewnij się, że dane TERYT są dostępne w bazie

---

**Autor:** AI Assistant  
**Data utworzenia:** 2025-01-15  
**Wersja:** 1.0.0 