# 🛡️ Przewodnik Integracji Systemu Monitorowania Błędów

## 📋 Przegląd

System monitorowania błędów został zintegrowany z Twoim portalem. Obejmuje on:

- **Error Boundary** - przechwytuje błędy React
- **Global Error Reporter** - przechwytuje błędy JavaScript
- **Backend API** - obsługuje zgłaszanie i zarządzanie błędami
- **Dashboard** - wizualizacja błędów w czasie rzeczywistym

## 🚀 Jak Uruchomić

### 1. Backend (Port 5000)
```bash
cd backend
npm start
```

### 2. Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

### 3. Dostęp do Dashboard
Otwórz: `http://localhost:3000/error-dashboard`

## 🔧 Zintegrowane Komponenty

### 1. Error Boundary (`frontend/src/components/ErrorBoundary.jsx`)
- Przechwytuje błędy React
- Wyświetla przyjazny interfejs błędu
- Automatycznie raportuje błędy do systemu
- Zapewnia opcje odświeżenia i powrotu do strony głównej

### 2. Global Error Reporter (`frontend/index.html`)
- Przechwytuje błędy JavaScript (`window.onerror`)
- Przechwytuje nieobsłużone promise rejections (`unhandledrejection`)
- Kolejkuje błędy offline
- Automatycznie wysyła błędy gdy połączenie jest dostępne

### 3. Backend API (`backend/routes/errorRoutes.js`)
- `POST /api/errors` - zgłaszanie nowych błędów
- `GET /api/errors` - pobieranie listy błędów
- `GET /api/errors/stats` - statystyki błędów
- `PUT /api/errors/:id/status` - aktualizacja statusu błędu

### 4. Dashboard (`frontend/src/components/ErrorDashboard.jsx`)
- Wyświetla statystyki błędów
- Lista ostatnich błędów
- Automatyczne odświeżanie co 30 sekund
- Dostęp: `http://localhost:3000/error-dashboard`

## 📊 Typy Wykrywanych Błędów

### Frontend Błędy
- **React Errors** - błędy w komponentach React
- **JavaScript Errors** - błędy runtime JavaScript
- **Promise Rejections** - nieobsłużone promesy
- **Network Errors** - błędy połączeń HTTP/API

### Backend Błędy
- **API Errors** - błędy endpointów REST
- **Database Errors** - błędy połączeń MongoDB
- **Validation Errors** - błędy walidacji danych
- **Authentication Errors** - błędy autoryzacji
- **404 Errors** - nieznalezione endpointy

## 🎯 Jak Testować

### 1. Test Error Boundary
```javascript
// W dowolnym komponencie React
throw new Error('Test błędu React');
```

### 2. Test JavaScript Errors
```javascript
// W konsoli przeglądarki
throw new Error('Test błędu JavaScript');
```

### 3. Test Promise Rejections
```javascript
// W konsoli przeglądarki
Promise.reject(new Error('Test promise rejection'));
```

### 4. Test API Errors
```bash
# Wywołaj nieistniejący endpoint
curl http://localhost:5000/api/nonexistent
```

## 🔍 Monitorowanie w Czasie Rzeczywistym

### 1. Sprawdź localStorage
```javascript
// W konsoli przeglądarki
console.log(JSON.parse(localStorage.getItem('errorQueue') || '[]'));
```

### 2. Sprawdź Network Tab
- Otwórz DevTools → Network
- Filtruj po `/api/errors`
- Sprawdź żądania POST z błędami

### 3. Sprawdź Console
- Błędy są logowane w konsoli
- Sprawdź czy `window.errorReporter` jest dostępny

## 🛠️ Konfiguracja

### 1. Zmiana Częstotliwości Odświeżania
W `ErrorDashboard.jsx`:
```javascript
// Zmień z 30000 na inną wartość (w milisekundach)
const interval = setInterval(fetchErrors, 30000);
```

### 2. Zmiana Maksymalnej Wielkości Kolejki
W `frontend/index.html`:
```javascript
// Zmień MAX_QUEUE_SIZE w window.errorReporter
```

### 3. Dodanie Własnych Typów Błędów
W `backend/models/errorModel.js`:
```javascript
enum: ['javascript_error', 'react_error', 'promise_rejection', 'api_error', 'network_error', 'validation_error', 'authentication_error', 'database_error', 'unknown', 'custom_error'],
```

## 📈 Rozszerzenia

### 1. Dodanie Alertów Email
```javascript
// W backend/services/alertService.js
const sendEmailAlert = async (errorData) => {
  // Implementacja wysyłania email
};
```

### 2. Dodanie Slack/Discord Webhooks
```javascript
// W backend/services/alertService.js
const sendSlackAlert = async (errorData) => {
  // Implementacja webhook Slack
};
```

### 3. Dodanie Metryk Wydajności
```javascript
// W frontend/index.html
const performanceData = {
  loadTime: performance.now(),
  memoryUsage: performance.memory?.usedJSHeapSize,
  // inne metryki
};
```

## 🔒 Bezpieczeństwo

### 1. Autoryzacja
- System sprawdza token w headerze `Authorization`
- Można dodać weryfikację JWT w `requireAuth` middleware

### 2. Rate Limiting
- Dodaj rate limiting dla endpointów błędów
- Ogranicz liczbę błędów na użytkownika

### 3. Sanityzacja Danych
- Wszystkie dane są sanityzowane przed zapisem
- Maksymalne długości pól są ograniczone

## 🐛 Rozwiązywanie Problemów

### 1. Błędy nie są wysyłane
- Sprawdź czy backend działa na porcie 5000
- Sprawdź CORS w `backend/server.js`
- Sprawdź localStorage w przeglądarce

### 2. Dashboard nie wyświetla błędów
- Sprawdź czy route `/error-dashboard` jest dostępny
- Sprawdź console w przeglądarce
- Sprawdź czy `ErrorDashboard` komponent się renderuje

### 3. Backend nie zapisuje błędów
- Sprawdź połączenie z MongoDB
- Sprawdź logi serwera
- Sprawdź czy modele są poprawnie zaimportowane

## 📝 Następne Kroki

1. **Dodaj Alerty** - skonfiguruj powiadomienia email/Slack
2. **Dodaj Metryki** - zintegruj z systemem monitorowania wydajności
3. **Dodaj Filtry** - rozszerz dashboard o zaawansowane filtry
4. **Dodaj Eksport** - możliwość eksportu błędów do CSV/JSON
5. **Dodaj Automatyzację** - automatyczne rozwiązywanie znanych błędów

## 🎉 Podsumowanie

System monitorowania błędów jest teraz w pełni zintegrowany z Twoim portalem. Będzie automatycznie:

- Przechwytywać wszystkie błędy JavaScript i React
- Zapisywać je w bazie danych
- Wyświetlać w dashboard w czasie rzeczywistym
- Grupować podobne błędy
- Zapewniać historię i analizy

Dostęp do dashboard: `http://localhost:3000/error-dashboard`

System jest gotowy do użycia w produkcji! 🚀 