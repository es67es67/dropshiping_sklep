# API Documentation - System Lokalizacji

## 📋 Przegląd

API systemu lokalizacji zapewnia dostęp do hierarchii administracyjnej Polski opartej na danych TERYT (Krajowy Rejestr Urzędowy Podziału Terytorialnego Kraju).

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