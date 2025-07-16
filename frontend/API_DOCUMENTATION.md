# API Documentation - System Lokalizacji i TERYT

## 📋 Przegląd

API systemu lokalizacji zapewnia dostęp do hierarchii administracyjnej Polski opartej na danych TERYT (Krajowy Rejestr Urzędowy Podziału Terytorialnego Kraju) oraz zaawansowane funkcjonalności wyszukiwania i geocoding z wykorzystaniem kodów TERYT/SIMC/ULIC.

## 🔗 Base URL

```
http://localhost:5000/api
```

## 🗺️ Endpointy Lokalizacji

### 1. Województwa

#### GET `/locations/voivodeships`
Pobiera listę wszystkich województw.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Dolnośląskie",
    "code": "02",
    "countiesCount": 26,
    "active": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

**Parametry query:**
- `search` (string) - wyszukiwanie po nazwie
- `active` (boolean) - filtrowanie według statusu
- `limit` (number) - limit wyników (domyślnie: 50)
- `offset` (number) - offset dla paginacji

### 2. Powiaty

#### GET `/locations/voivodeships/:voivodeshipCode/counties`
Pobiera listę powiatów dla wybranego województwa.

**Parametry URL:**
- `voivodeshipCode` (string) - kod województwa (np. "02")

**Response:**
```json
{
  "voivodeship": {
    "id": 1,
    "name": "Dolnośląskie",
    "code": "02"
  },
  "counties": [
    {
      "id": 1,
      "name": "Wrocław",
      "code": "0261",
      "type": "miasto na prawach powiatu",
      "municipalitiesCount": 1,
      "active": true,
      "coordinates": {
        "lat": 51.1079,
        "lng": 17.0385
      }
    }
  ]
}
```

**Parametry query:**
- `type` (string) - filtrowanie według typu ("powiat", "miasto na prawach powiatu")
- `search` (string) - wyszukiwanie po nazwie
- `active` (boolean) - filtrowanie według statusu

### 3. Gminy

#### GET `/locations/counties/:countyCode/municipalities`
Pobiera listę gmin dla wybranego powiatu.

**Parametry URL:**
- `countyCode` (string) - kod powiatu (np. "0261")

**Response:**
```json
{
  "county": {
    "id": 1,
    "name": "Wrocław",
    "code": "0261",
    "type": "miasto na prawach powiatu"
  },
  "municipalities": [
    {
      "id": 1,
      "name": "Wrocław",
      "code": "0261011",
      "type": "gmina miejska",
      "active": true,
      "population": 674079,
      "area": 292.82,
      "coordinates": {
        "lat": 51.1079,
        "lng": 17.0385
      }
    }
  ]
}
```

**Parametry query:**
- `type` (string) - filtrowanie według typu gminy
- `search` (string) - wyszukiwanie po nazwie
- `active` (boolean) - filtrowanie według statusu

### 4. Analityka

#### GET `/locations/analytics`
Pobiera dane analityczne systemu lokalizacji.

**Response:**
```json
{
  "stats": {
    "totalLocations": 2477,
    "activeLocations": 2477,
    "totalPopulation": 38168000,
    "averagePopulation": 15400,
    "topVoivodeship": "Mazowieckie",
    "recentActivity": 156
  },
  "topLocations": [
    {
      "name": "Warszawa",
      "population": 1783321,
      "type": "miasto",
      "voivodeship": "Mazowieckie"
    }
  ],
  "activityData": [
    {
      "date": "2024-01-15",
      "count": 12,
      "type": "Dodano"
    }
  ]
}
```

### 5. Import

#### POST `/locations/import`
Importuje dane lokalizacji z pliku.

**Content-Type:** `multipart/form-data`

**Body:**
- `file` (File) - plik CSV/XML do importu
- `options` (string) - JSON z opcjami importu

**Opcje importu:**
```json
{
  "updateExisting": true,
  "validateData": true,
  "createBackup": true,
  "skipDuplicates": false,
  "batchSize": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Import zakończony pomyślnie",
  "imported": 1500,
  "updated": 200,
  "errors": 5,
  "duration": "2m 30s"
}
```

### 6. Eksport

#### POST `/locations/export`
Eksportuje dane lokalizacji w wybranym formacie.

**Content-Type:** `application/json`

**Body:**
```json
{
  "options": {
    "format": "csv",
    "includeHeaders": true,
    "encoding": "utf8",
    "compression": false
  },
  "filters": {
    "voivodeship": "all",
    "county": "all",
    "type": "all",
    "active": "all",
    "dateFrom": "",
    "dateTo": ""
  }
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "/api/locations/export/download/abc123",
  "filename": "lokalizacje_2024-01-15.csv",
  "size": "2.5MB",
  "recordCount": 1500
}
```

#### GET `/locations/export/download/:token`
Pobiera wygenerowany plik eksportu.

**Parametry URL:**
- `token` (string) - token pobrany z endpointu eksportu

## 🔍 Wyszukiwanie i Filtrowanie

### Parametry wyszukiwania

Wszystkie endpointy listujące obsługują:

```javascript
// Wyszukiwanie tekstowe
?search=warszawa

// Filtrowanie według statusu
?active=true

// Paginacja
?limit=20&offset=40

// Sortowanie
?sort=name&order=asc
```

### Operatory wyszukiwania

```javascript
// Dokładne dopasowanie
?search="Warszawa"

// Częściowe dopasowanie
?search=warsz

// Wyszukiwanie w wielu polach
?search=name:warszawa OR code:1465
```

## 📊 Formatowanie odpowiedzi

### Standardowa odpowiedź

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "pages": 75
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### Odpowiedź z błędem

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nieprawidłowy kod województwa",
    "details": {
      "field": "voivodeshipCode",
      "value": "99",
      "constraint": "must be valid TERYT code"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "req_abc123"
  }
}
```

## 🔐 Autoryzacja

### Endpointy publiczne
- `GET /locations/voivodeships`
- `GET /locations/voivodeships/:voivodeshipCode/counties`
- `GET /locations/counties/:countyCode/municipalities`
- `GET /locations/analytics`

### Endpointy wymagające autoryzacji
- `POST /locations/import`
- `POST /locations/export`
- `GET /locations/export/download/:token`

### Nagłówki autoryzacji
```javascript
Authorization: Bearer <token>
```

## ⚡ Rate Limiting

- **Publiczne endpointy**: 1000 requestów/godzinę
- **Import/Export**: 10 requestów/godzinę
- **Analityka**: 100 requestów/godzinę

## 🚨 Kody błędów

| Kod | Opis |
|-----|------|
| 400 | Bad Request - nieprawidłowe parametry |
| 401 | Unauthorized - brak autoryzacji |
| 403 | Forbidden - brak uprawnień |
| 404 | Not Found - zasób nie istnieje |
| 422 | Validation Error - błąd walidacji |
| 429 | Too Many Requests - przekroczony limit |
| 500 | Internal Server Error - błąd serwera |

## 📝 Przykłady użycia

### JavaScript (Fetch)

```javascript
// Pobieranie województw
const response = await fetch('/api/locations/voivodeships');
const voivodeships = await response.json();

// Pobieranie powiatów z filtrowaniem
const response = await fetch('/api/locations/voivodeships/02/counties?type=powiat');
const data = await response.json();

// Import danych
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('options', JSON.stringify({
  updateExisting: true,
  validateData: true
}));

const response = await fetch('/api/locations/import', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### cURL

```bash
# Pobieranie województw
curl -X GET "http://localhost:5000/api/locations/voivodeships"

# Pobieranie powiatów
curl -X GET "http://localhost:5000/api/locations/voivodeships/02/counties"

# Eksport danych
curl -X POST "http://localhost:5000/api/locations/export" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "options": {
      "format": "csv",
      "includeHeaders": true
    },
    "filters": {
      "voivodeship": "02"
    }
  }'
```

## 🔄 Webhooks (planowane)

```javascript
// Konfiguracja webhooka
POST /api/locations/webhooks
{
  "url": "https://example.com/webhook",
  "events": ["location.created", "location.updated"],
  "secret": "webhook_secret"
}
```

## 📈 Monitoring

### Metryki dostępne
- Liczba requestów na endpoint
- Czas odpowiedzi
- Błędy i ich typy
- Użycie pamięci
- Liczba aktywnych połączeń

### Logi
Wszystkie requesty są logowane z:
- Timestamp
- IP adres
- User agent
- Request ID
- Czas odpowiedzi
- Status code

## 🗺️ Endpointy TERYT i Geocoding

### 1. Wyszukiwanie sklepów po TERYT

#### GET `/shops/search-by-teryt`
Wyszukuje sklepy na podstawie kodów TERYT.

**Parametry query:**
- `tercCode` (string) - kod TERC (województwo + powiat + gmina)
- `simcCode` (string) - kod SIMC (miejscowość)
- `ulicCode` (string) - kod ULIC (ulica)
- `fullCode` (string) - pełny kod TERYT
- `voivodeshipCode` (string) - kod województwa
- `countyCode` (string) - kod powiatu
- `municipalityCode` (string) - kod gminy
- `page` (number) - numer strony (domyślnie: 1)
- `limit` (number) - limit wyników (domyślnie: 10)

**Response:**
```json
{
  "shops": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Sklep Przykładowy",
      "description": "Opis sklepu",
      "address": {
        "street": "ul. Marszałkowska 1",
        "city": "Warszawa",
        "postalCode": "00-001"
      },
      "teryt": {
        "tercCode": "140101",
        "simcCode": "0918123",
        "ulicCode": "12345",
        "fullCode": "140101091812312345"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. Wyszukiwanie firm po TERYT

#### GET `/company-profiles/search-by-teryt`
Wyszukuje firmy na podstawie kodów TERYT.

**Parametry query:** (identyczne jak dla sklepów)

**Response:**
```json
{
  "companies": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Firma Przykładowa",
      "shortDescription": "Opis firmy",
      "address": {
        "street": "ul. Krakowska 10",
        "city": "Kraków",
        "postalCode": "31-001"
      },
      "teryt": {
        "tercCode": "126101",
        "simcCode": "0950463",
        "ulicCode": "54321",
        "fullCode": "126101095046354321"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### 3. Wyszukiwanie użytkowników po TERYT

#### GET `/users/search-by-teryt`
Wyszukuje użytkowników na podstawie kodów TERYT.

**Parametry query:** (identyczne jak dla sklepów)

**Response:**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jan",
      "lastName": "Kowalski",
      "email": "jan.kowalski@example.com",
      "address": {
        "street": "ul. Długa 5",
        "city": "Gdańsk",
        "postalCode": "80-001"
      },
      "teryt": {
        "tercCode": "226101",
        "simcCode": "0930864",
        "ulicCode": "67890",
        "fullCode": "226101093086467890"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

### 4. Autouzupełnianie adresów

#### GET `/geocoding/autocomplete`
Autouzupełnianie adresów z kodami TERYT.

**Parametry query:**
- `query` (string) - tekst do wyszukiwania
- `limit` (number) - limit sugestii (domyślnie: 5)

**Response:**
```json
{
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

### 5. Wyszukiwanie obiektów w promieniu

#### GET `/geocoding/search-nearby`
Wyszukuje obiekty w określonym promieniu od punktu.

**Parametry query:**
- `lat` (number) - szerokość geograficzna
- `lng` (number) - długość geograficzna
- `radius` (number) - promień w km (domyślnie: 10)
- `types` (string) - typy obiektów (all, shops, companies, users)
- `tercCode` (string) - kod TERC do filtrowania
- `page` (number) - numer strony
- `limit` (number) - limit wyników

**Response:**
```json
{
  "data": {
    "coordinates": { "lat": 52.2297, "lng": 21.0122 },
    "radius": 10,
    "types": "all",
    "results": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Sklep Przykładowy",
        "type": "shop",
        "distance": 2.5,
        "address": {
          "street": "ul. Marszałkowska 1",
          "city": "Warszawa"
        },
        "teryt": {
          "tercCode": "140101",
          "simcCode": "0918123"
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### 6. Geocoding - konwersja adresu na współrzędne

#### POST `/geocoding/geocode`
Konwertuje adres na współrzędne geograficzne.

**Body:**
```json
{
  "address": "ul. Marszałkowska 1, Warszawa"
}
```

**Response:**
```json
{
  "data": {
    "address": "ul. Marszałkowska 1, Warszawa",
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "formattedAddress": "Marszałkowska 1, 00-001 Warszawa, Mazowieckie",
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

### 7. Reverse geocoding - konwersja współrzędnych na adres

#### POST `/geocoding/reverse-geocode`
Konwertuje współrzędne geograficzne na adres.

**Body:**
```json
{
  "lat": 52.2297,
  "lng": 21.0122
}
```

**Response:**
```json
{
  "data": {
    "coordinates": { "lat": 52.2297, "lng": 21.0122 },
    "address": "ul. Marszałkowska 1, 00-001 Warszawa, Mazowieckie",
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

### 8. Mapowanie współrzędnych na kody TERYT

#### GET `/geocoding/coordinates-to-teryt`
Mapuje współrzędne na kody TERYT.

**Parametry query:**
- `lat` (number) - szerokość geograficzna
- `lng` (number) - długość geograficzna

**Response:**
```json
{
  "data": {
    "coordinates": { "lat": 52.2297, "lng": 21.0122 },
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

### 9. Mapowanie kodów TERYT na współrzędne

#### GET `/geocoding/teryt-to-coordinates`
Mapuje kody TERYT na współrzędne geograficzne.

**Parametry query:**
- `tercCode` (string) - kod TERC
- `simcCode` (string) - kod SIMC
- `ulicCode` (string) - kod ULIC
- `fullCode` (string) - pełny kod TERYT

**Response:**
```json
{
  "data": {
    "teryt": {
      "tercCode": "140101",
      "simcCode": "0918123",
      "ulicCode": "12345",
      "fullCode": "140101091812312345"
    },
    "coordinates": {
      "lat": 52.2297,
      "lng": 21.0122
    },
    "location": {
      "name": "Warszawa",
      "type": "miejscowość",
      "address": "ul. Marszałkowska 1, 00-001 Warszawa"
    }
  }
}
```

### 10. Obliczanie odległości

#### POST `/geocoding/calculate-distance`
Oblicza odległość między dwoma punktami.

**Body:**
```json
{
  "lat1": 52.2297,
  "lng1": 21.0122,
  "lat2": 50.0647,
  "lng2": 19.9450
}
```

**Response:**
```json
{
  "data": {
    "distance": 295.67,
    "distanceText": "295.67 km",
    "coordinates": {
      "from": { "lat": 52.2297, "lng": 21.0122 },
      "to": { "lat": 50.0647, "lng": 19.9450 }
    }
  }
}
```

## 🔐 Autoryzacja dla endpointów TERYT

### Endpointy publiczne
- `GET /geocoding/autocomplete`
- `POST /geocoding/geocode`
- `POST /geocoding/reverse-geocode`
- `GET /geocoding/coordinates-to-teryt`
- `GET /geocoding/teryt-to-coordinates`
- `POST /geocoding/calculate-distance`

### Endpointy wymagające autoryzacji
- `GET /shops/search-by-teryt`
- `GET /company-profiles/search-by-teryt`
- `GET /users/search-by-teryt`
- `GET /geocoding/search-nearby`

## 📊 Przykłady użycia endpointów TERYT

### JavaScript (Fetch)

```javascript
// Wyszukiwanie sklepów po kodzie TERC
const response = await fetch('/api/shops/search-by-teryt?tercCode=140101');
const data = await response.json();

// Autouzupełnianie adresów
const response = await fetch('/api/geocoding/autocomplete?query=Warszawa&limit=5');
const suggestions = await response.json();

// Wyszukiwanie w promieniu
const response = await fetch('/api/geocoding/search-nearby?lat=52.2297&lng=21.0122&radius=10&types=shops');
const nearbyData = await response.json();
```

### cURL

```bash
# Wyszukiwanie sklepów po TERYT
curl -X GET "http://localhost:5000/api/shops/search-by-teryt?tercCode=140101"

# Autouzupełnianie adresów
curl -X GET "http://localhost:5000/api/geocoding/autocomplete?query=Warszawa&limit=5"

# Geocoding adresu
curl -X POST "http://localhost:5000/api/geocoding/geocode" \
  -H "Content-Type: application/json" \
  -d '{"address": "ul. Marszałkowska 1, Warszawa"}'
``` 