# 🧪 Testy Systemu Monitorowania Błędów

## 📋 Przegląd

System monitorowania błędów zawiera kompleksowe testy, które sprawdzają wszystkie aspekty funkcjonalności:

- **Testy Cypress** - dla testów end-to-end
- **Testy Puppeteer** - dla testów automatyzacji przeglądarki
- **Testy jednostkowe** - dla poszczególnych komponentów

## 🚀 Uruchamianie Testów

### 1. Instalacja zależności

```bash
cd frontend
npm install
```

### 2. Uruchomienie serwerów

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 3. Uruchomienie testów

#### Testy Puppeteer (zalecane)
```bash
cd frontend
npm run test:error-monitoring
```

#### Testy Cypress
```bash
cd frontend
npm run test:cypress
```

#### Testy Cypress z interfejsem graficznym
```bash
cd frontend
npm run test:cypress:open
```

## 🧪 Rodzaje Testów

### 1. Testy JavaScript Errors
- **Cel**: Sprawdzenie przechwytywania błędów JavaScript
- **Metoda**: Wykonanie `throw new Error()` w przeglądarce
- **Oczekiwany rezultat**: Błąd zostaje dodany do `localStorage` i wysłany do backendu

### 2. Testy Promise Rejections
- **Cel**: Sprawdzenie przechwytywania Promise rejections
- **Metoda**: Wykonanie `Promise.reject(new Error())`
- **Oczekiwany rezultat**: Błąd zostaje przechwycony przez `unhandledrejection`

### 3. Testy React Errors
- **Cel**: Sprawdzenie Error Boundary
- **Metoda**: Symulacja błędów React komponentów
- **Oczekiwany rezultat**: Error Boundary wyświetla fallback UI

### 4. Testy API Errors
- **Cel**: Sprawdzenie przechwytywania błędów API
- **Metoda**: Żądania do nieistniejących endpointów
- **Oczekiwany rezultat**: Błędy sieciowe są przechwytywane

### 5. Testy Dashboard Display
- **Cel**: Sprawdzenie wyświetlania błędów w dashboard
- **Metoda**: Generowanie błędów i sprawdzenie UI
- **Oczekiwany rezultat**: Dashboard wyświetla błędy i statystyki

### 6. Testy Offline Queueing
- **Cel**: Sprawdzenie kolejkowania błędów offline
- **Metoda**: Symulacja offline i generowanie błędów
- **Oczekiwany rezultat**: Błędy są zapisywane w localStorage

### 7. Testy Network Errors
- **Cel**: Sprawdzenie przechwytywania błędów sieciowych
- **Metoda**: Żądania do nieistniejących serwerów
- **Oczekiwany rezultat**: Błędy sieciowe są przechwytywane

## 📊 Konfiguracja Testów

### Puppeteer Configuration
```javascript
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:5000',
  headless: false, // Pokaż przeglądarkę
  slowMo: 100, // Zwolnij akcje
  timeout: 10000
};
```

### Cypress Configuration
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
```

## 🔍 Monitorowanie Błędów w Testach

### 1. Console Errors
```javascript
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log('🐛 Console Error:', msg.text());
  }
});
```

### 2. JavaScript Errors
```javascript
page.on('pageerror', error => {
  console.log('🚨 JavaScript Error:', error.message);
});
```

### 3. Network Errors
```javascript
page.on('response', response => {
  if (!response.ok()) {
    console.log('🌐 Network Error:', response.status(), response.url());
  }
});
```

## 📈 Wyniki Testów

### Format Wyników
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "results": {
    "passed": 7,
    "failed": 0,
    "total": 7
  },
  "config": {
    "baseUrl": "http://localhost:3000",
    "backendUrl": "http://localhost:5000",
    "headless": false,
    "slowMo": 100
  }
}
```

### Interpretacja Wyników
- **✅ 100%** - Wszystkie testy przeszły
- **⚠️ 80-99%** - Niektóre testy nie przeszły
- **❌ <80%** - Wiele testów nie przeszło

## 🛠️ Debugowanie Testów

### 1. Włączanie Debug Mode
```javascript
// W run-error-tests.js
const TEST_CONFIG = {
  headless: false, // Pokaż przeglądarkę
  slowMo: 500, // Zwolnij akcje
  devtools: true // Otwórz DevTools
};
```

### 2. Sprawdzanie localStorage
```javascript
const errorQueue = await page.evaluate(() => {
  return JSON.parse(localStorage.getItem('errorQueue') || '[]');
});
console.log('Error Queue:', errorQueue);
```

### 3. Sprawdzanie Network Requests
```javascript
page.on('request', request => {
  if (request.url().includes('/api/errors')) {
    console.log('API Request:', request.url());
  }
});
```

## 🚨 Rozwiązywanie Problemów

### Problem: Testy nie przechwytują błędów
**Rozwiązanie:**
1. Sprawdź czy `window.errorReporter` jest zainicjalizowany
2. Sprawdź czy `localStorage` jest dostępny
3. Sprawdź czy backend odpowiada na `/api/errors`

### Problem: Dashboard nie wyświetla błędów
**Rozwiązanie:**
1. Sprawdź czy błędy są w `localStorage`
2. Sprawdź czy komponent `ErrorDashboard` się renderuje
3. Sprawdź czy nie ma błędów w konsoli

### Problem: Error Boundary nie działa
**Rozwiązanie:**
1. Sprawdź czy `ErrorBoundary` otacza komponenty
2. Sprawdź czy `componentDidCatch` jest wywoływane
3. Sprawdź czy fallback UI się renderuje

## 📝 Dodawanie Nowych Testów

### 1. Test Puppeteer
```javascript
'New Test Name': async (page) => {
  await page.goto(TEST_CONFIG.baseUrl);
  
  // Wykonaj test
  await page.evaluate(() => {
    // Kod testu
  });
  
  // Sprawdź wyniki
  const result = await page.evaluate(() => {
    // Sprawdzenie wyniku
  });
  
  if (!result) {
    throw new Error('Test failed');
  }
}
```

### 2. Test Cypress
```javascript
it('should test new functionality', () => {
  cy.visit('http://localhost:3000');
  
  // Wykonaj test
  cy.window().then((win) => {
    win.eval(`
      // Kod testu
    `);
  });
  
  // Sprawdź wyniki
  cy.window().then((win) => {
    const result = win.eval(`
      // Sprawdzenie wyniku
    `);
    expect(result).to.be.true;
  });
});
```

## 🎯 Najlepsze Praktyki

### 1. Izolacja Testów
- Wyczyść `localStorage` przed każdym testem
- Używaj unikalnych nazw błędów
- Nie polegaj na stanie z poprzednich testów

### 2. Asynchroniczność
- Używaj `waitForTimeout` dla operacji asynchronicznych
- Sprawdzaj wyniki po zakończeniu operacji
- Obsługuj Promise rejections

### 3. Debugowanie
- Włącz `headless: false` dla debugowania
- Używaj `slowMo` dla lepszej obserwacji
- Loguj błędy z konsoli przeglądarki

### 4. Stabilność
- Dodaj retry logic dla niestabilnych testów
- Sprawdź czy serwery działają przed testami
- Używaj timeoutów dla długich operacji

## 📚 Przydatne Komendy

```bash
# Uruchom wszystkie testy
npm run test:error-monitoring

# Uruchom tylko testy Cypress
npm run test:cypress

# Otwórz Cypress UI
npm run test:cypress:open

# Sprawdź czy serwery działają
curl http://localhost:3000
curl http://localhost:5000/api/health

# Wyczyść cache
npm run build
```

## 🔗 Powiązane Pliki

- `run-error-tests.js` - Główny skrypt testów Puppeteer
- `cypress/e2e/error-monitoring.cy.js` - Testy Cypress
- `tests/puppeteer-error-monitoring.test.js` - Szczegółowe testy Puppeteer
- `src/components/ErrorBoundary.jsx` - Komponent Error Boundary
- `src/components/ErrorDashboard.jsx` - Dashboard błędów
- `index.html` - Globalny error reporter 