# 🗺️ API Wyszukiwania po kodach TERYT i Google Maps

## 📋 Przegląd

Ten dokument opisuje nowe endpointy API do wyszukiwania obiektów (sklepów, firm, użytkowników) po kodach TERYT/SIMC/ULIC oraz integracji z Google Maps.

## 🔍 Wyszukiwanie po kodach TERYT

### Sklepy

#### GET `/api/shops/search/teryt`
Wyszukiwanie sklepów po kodach TERYT.

**Parametry query:**
- `tercCode` (string) - Kod TERC (województwo + powiat + gmina)
- `simcCode` (string) - Kod SIMC (miejscowość)
- `ulicCode` (string) - Kod ULIC (ulica)
- `fullCode` (string) - Pełny kod TERYT (TERC + SIMC + ULIC)
- `voivodeshipCode` (string) - Kod województwa
- `countyCode` (string) - Kod powiatu
- `municipalityCode` (string) - Kod gminy
- `page` (number) - Numer strony (domyślnie: 1)
- `limit` (number) - Liczba wyników na stronę (domyślnie: 12)

**Przykład:**
```bash
GET /api/shops/search/teryt?tercCode=140101&page=1&limit=10
```

**Odpowiedź:**
```json
{
  "shops": [...],
  "searchCriteria": {
    "tercCode": "140101",
    "simcCode": null,
    "ulicCode": null,
    "fullCode": null,
    "voivodeshipCode": null,
    "countyCode": null,
    "municipalityCode": null
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### GET `/api/shops/radius`
Wyszukiwanie sklepów w promieniu na podstawie kodu TERC.

**Parametry query:**
- `tercCode` (string, wymagane) - Kod TERC
- `radius` (number) - Promień w km (domyślnie: 10)
- `page` (number) - Numer strony (domyślnie: 1)
- `limit` (number) - Liczba wyników na stronę (domyślnie: 12)

**Przykład:**
```bash
GET /api/shops/radius?tercCode=140101&radius=20&page=1&limit=10
```

### Firmy

#### GET `/api/company-profiles/search/teryt`
Wyszukiwanie firm po kodach TERYT.

**Parametry query:** (identyczne jak dla sklepów)

#### GET `/api/company-profiles/radius`
Wyszukiwanie firm w promieniu na podstawie kodu TERC.

**Parametry query:** (identyczne jak dla sklepów)

### Użytkownicy

#### GET `/api/users/search/teryt`
Wyszukiwanie użytkowników po kodach TERYT.

**Parametry query:** (identyczne jak dla sklepów)

#### GET `/api/users/radius`
Wyszukiwanie użytkowników w promieniu na podstawie kodu TERC.

**Parametry query:** (identyczne jak dla sklepów)

## 🌍 Integracja z Google Maps

### Geocoding

#### POST `/api/geocoding/geocode`
Konwersja adresu na współrzędne geograficzne.

**Body:**
```json
{
  "address": "ul. Marszałkowska 1, Warszawa"
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "address": "ul. Marszałkowska 1, Warszawa",
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "formattedAddress": "ul. Marszałkowska 1, 00-001 Warszawa, Mazowieckie",
    "components": {
      "street": "Marszałkowska",
      "houseNumber": "1",
      "postalCode": "00-001",
      "city": "Warszawa",
      "voivodeship": "Mazowieckie"
    }
  }
}
```

### Reverse Geocoding

#### POST `/api/geocoding/reverse-geocode`
Konwersja współrzędnych geograficznych na adres.

**Body:**
```json
{
  "lat": 52.2297,
  "lng": 21.0122
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "address": "ul. Przykładowa 1, 00-001 Warszawa, Mazowieckie",
    "components": {
      "street": "Przykładowa",
      "houseNumber": "1",
      "postalCode": "00-001",
      "city": "Warszawa",
      "voivodeship": "Mazowieckie"
    }
  }
}
```

### Mapowanie współrzędnych ↔ kody TERYT

#### GET `/api/geocoding/coordinates-to-teryt`
Mapowanie współrzędnych na kody TERYT.

**Parametry query:**
- `lat` (number, wymagane) - Szerokość geograficzna
- `lng` (number, wymagane) - Długość geograficzna

**Przykład:**
```bash
GET /api/geocoding/coordinates-to-teryt?lat=52.2297&lng=21.0122
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "teryt": {
      "voivodeshipCode": "14",
      "countyCode": "1401",
      "municipalityCode": "140101",
      "tercCode": "140101",
      "simcCode": "0918123",
      "ulicCode": "12345",
      "fullCode": "140101091812312345"
    },
    "location": {
      "name": "Warszawa",
      "type": "miejscowość",
      "hierarchy": {
        "wojewodztwo": { "name": "Mazowieckie", "code": "14" },
        "powiat": { "name": "Warszawa", "code": "1401" },
        "gmina": { "name": "Warszawa", "code": "140101" }
      }
    }
  }
}
```

#### GET `/api/geocoding/teryt-to-coordinates`
Mapowanie kodów TERYT na współrzędne.

**Parametry query:**
- `tercCode` (string) - Kod TERC
- `simcCode` (string) - Kod SIMC
- `ulicCode` (string) - Kod ULIC
- `fullCode` (string) - Pełny kod TERYT

**Przykład:**
```bash
GET /api/geocoding/teryt-to-coordinates?fullCode=140101091812312345
```

### Wyszukiwanie w promieniu

#### GET `/api/geocoding/nearby`
Wyszukiwanie obiektów w promieniu od podanych współrzędnych.

**Parametry query:**
- `lat` (number, wymagane) - Szerokość geograficzna
- `lng` (number, wymagane) - Długość geograficzna
- `radius` (number) - Promień w km (domyślnie: 10)
- `types` (string) - Typy obiektów: `sklepy`, `firmy`, `użytkownicy`, `all` (domyślnie: `all`)
- `page` (number) - Numer strony (domyślnie: 1)
- `limit` (number) - Liczba wyników na stronę (domyślnie: 20)

**Przykład:**
```bash
GET /api/geocoding/nearby?lat=52.2297&lng=21.0122&radius=5&types=sklepy&page=1&limit=10
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "radius": 5,
    "types": "sklepy",
    "results": [
      {
        "_id": "...",
        "name": "TechStore Warszawa",
        "type": "shop",
        "distance": 2.3,
        "coordinates": {
          "lat": 52.2300,
          "lng": 21.0125
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### Autouzupełnianie adresów

#### GET `/api/geocoding/autocomplete`
Autouzupełnianie adresów z kodami TERYT.

**Parametry query:**
- `query` (string, wymagane) - Część adresu do uzupełnienia
- `limit` (number) - Maksymalna liczba sugestii (domyślnie: 5)

**Przykład:**
```bash
GET /api/geocoding/autocomplete?query=Marszałkowska&limit=3
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": [
    {
      "description": "Marszałkowska 1, Warszawa, Mazowieckie",
      "placeId": "place_1",
      "types": ["street_address"],
      "teryt": {
        "tercCode": "140101",
        "simcCode": "0918123",
        "ulicCode": "12345"
      }
    }
  ],
  "count": 1
}
```

### Obliczanie odległości

#### POST `/api/geocoding/distance`
Obliczanie odległości między dwoma punktami.

**Body:**
```json
{
  "lat1": 52.2297,
  "lng1": 21.0122,
  "lat2": 52.2300,
  "lng2": 21.0125
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "distance": 0.25,
    "distanceText": "0.25 km",
    "coordinates": {
      "from": { "lat": 52.2297, "lng": 21.0122 },
      "to": { "lat": 52.2300, "lng": 21.0125 }
    }
  }
}
```

## 📊 Standardowe endpointy z obsługą TERYT

Wszystkie standardowe endpointy wyszukiwania obsługują teraz parametry TERYT:

### GET `/api/shops`
- Dodano parametry: `tercCode`, `simcCode`, `ulicCode`, `fullCode`, `voivodeshipCode`, `countyCode`, `municipalityCode`

### GET `/api/company-profiles/list`
- Dodano parametry: `tercCode`, `simcCode`, `ulicCode`, `fullCode`, `voivodeshipCode`, `countyCode`, `municipalityCode`

### GET `/api/users`
- Dodano parametry: `tercCode`, `simcCode`, `ulicCode`, `fullCode`, `voivodeshipCode`, `countyCode`, `municipalityCode`

## 🔧 Konfiguracja

### Indeksy MongoDB
Dodano indeksy dla wydajnego wyszukiwania:
```javascript
// Dla każdego modelu (Shop, CompanyProfile, User)
shopSchema.index({ 'teryt.tercCode': 1 });
shopSchema.index({ 'teryt.simcCode': 1 });
shopSchema.index({ 'teryt.ulicCode': 1 });
shopSchema.index({ 'teryt.fullCode': 1 });
shopSchema.index({ 'teryt.voivodeshipCode': 1 });
shopSchema.index({ 'teryt.countyCode': 1 });
shopSchema.index({ 'teryt.municipalityCode': 1 });
```

### Google Maps API (przyszłość)
Aby włączyć prawdziwą integrację z Google Maps, dodaj klucz API do zmiennych środowiskowych:
```env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 📝 Przykłady użycia

### 1. Znajdź wszystkie sklepy w Warszawie
```bash
GET /api/shops/search/teryt?tercCode=140101
```

### 2. Znajdź firmy w promieniu 20km od Warszawy
```bash
GET /api/company-profiles/radius?tercCode=140101&radius=20
```

### 3. Konwertuj adres na współrzędne
```bash
POST /api/geocoding/geocode
{
  "address": "ul. Marszałkowska 1, Warszawa"
}
```

### 4. Znajdź sklepy w promieniu 5km od współrzędnych
```bash
GET /api/geocoding/nearby?lat=52.2297&lng=21.0122&radius=5&types=sklepy
```

### 5. Autouzupełnianie adresu
```bash
GET /api/geocoding/autocomplete?query=Marszałkowska
```

## 🚀 Następne kroki

1. **Integracja z prawdziwym Google Maps API**
2. **Dodanie geospatial queries MongoDB**
3. **Implementacja cache'owania wyników**
4. **Dodanie frontend UI dla wyszukiwania**
5. **Optymalizacja wydajności dla dużych zbiorów danych** 