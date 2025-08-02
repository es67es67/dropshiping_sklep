# 🛡️ System Monitorowania Błędów - Portal

## 📋 Przegląd

Stworzyłem kompleksowy system monitorowania błędów dla portalu społecznościowo-handlowego, który obejmuje:

### 🎯 Główne Funkcje
- **Uniwersalne monitorowanie błędów** - wszystkie błędy są logowane w bazie danych
- **Sprawdzanie statusu procesów** - automatyczne monitorowanie backend/frontend/database
- **Automatyczne dodawanie monitorowania** - skrypt do dodawania monitorowania do wszystkich plików
- **Dashboard błędów** - interfejs do przeglądania i zarządzania błędami
- **Alerty i powiadomienia** - system powiadomień o krytycznych błędach

## 🏗️ Architektura

### 1. **UniversalErrorService** (`backend/services/universalErrorService.js`)
Główny serwis do monitorowania błędów w całym portalu.

**Funkcje:**
- Logowanie błędów z kontekstem
- Kategoryzacja i określanie ważności błędów
- Grupowanie podobnych błędów
- Kolejka offline dla błędów
- Statystyki i raporty

**Użycie:**
```javascript
const UniversalErrorService = require('../services/universalErrorService');

// Logowanie błędu
await UniversalErrorService.logError(error, {
  componentName: 'UserController',
  filename: 'userController.js',
  type: 'api_error',
  additionalData: { action: 'register' }
});

// Logowanie błędu walidacji
await UniversalErrorService.logValidationError(validationErrors, context);

// Logowanie błędu autoryzacji
await UniversalErrorService.logAuthError(error, context);
```

### 2. **ProcessMonitorService** (`backend/services/processMonitorService.js`)
Serwis do monitorowania statusu procesów.

**Funkcje:**
- Sprawdzanie statusu backend/frontend/database
- Monitorowanie w czasie rzeczywistym
- Sprawdzanie portów przez netstat
- Sprawdzanie procesów Node.js
- Informacje o systemie

**Użycie:**
```javascript
const ProcessMonitorService = require('../services/processMonitorService');

// Sprawdź wszystkie procesy
const results = await ProcessMonitorService.checkAllProcesses();

// Uruchom monitorowanie w tle
ProcessMonitorService.startMonitoring();

// Sprawdź porty
const netstatResults = await ProcessMonitorService.checkProcessesWithNetstat();
```

### 3. **Skrypty Monitorowania**

#### `check-process-status.js`
Skrypt do sprawdzania statusu procesów z terminala.

**Użycie:**
```bash
# Sprawdź wszystkie procesy
node check-process-status.js

# Uruchom monitorowanie w tle
node check-process-status.js --monitor

# Sprawdź błędy w bazie
node check-process-status.js --errors

# Informacje o systemie
node check-process-status.js --system

# Sprawdź porty przez netstat
node check-process-status.js --netstat

# Sprawdź procesy Node.js
node check-process-status.js --tasklist

# Kompleksowe sprawdzenie
node check-process-status.js --all
```

#### `add-error-monitoring.js`
Skrypt do automatycznego dodawania monitorowania błędów do wszystkich plików.

**Użycie:**
```bash
# Dodaj monitorowanie błędów do wszystkich plików
node add-error-monitoring.js
```

## 📊 Typy Błędów

### Kategoryzacja
- **`api_error`** - błędy API/Express
- **`validation_error`** - błędy walidacji
- **`authentication_error`** - błędy autoryzacji
- **`database_error`** - błędy bazy danych
- **`react_error`** - błędy React/frontend
- **`network_error`** - błędy sieciowe
- **`system_error`** - błędy systemowe
- **`unknown`** - nieznane błędy

### Ważność
- **`critical`** - błędy krytyczne (system nie działa)
- **`high`** - błędy wysokiej ważności (funkcje nie działają)
- **`medium`** - błędy średniej ważności (częściowe problemy)
- **`low`** - błędy niskiej ważności (kosmetyczne)

## 🔧 Integracja z Istniejącym Kodem

### 1. **Middleware** (`backend/middleware/errorHandler.js`)
Zaktualizowany do używania UniversalErrorService:

```javascript
const UniversalErrorService = require('../services/universalErrorService');

// Przechwytywanie błędów Express
const expressErrorHandler = (err, req, res, next) => {
  UniversalErrorService.logExpressError(err, req, res, {
    type: 'api_error',
    componentName: 'ExpressErrorHandler',
    filename: 'errorHandler.js'
  }).catch(console.error);
  
  // ... reszta logiki
};
```

### 2. **Kontrolery** (`backend/controllers/userController.js`)
Przykład integracji w kontrolerze:

```javascript
const UniversalErrorService = require('../services/universalErrorService');

exports.register = async (req, res) => {
  try {
    // ... logika rejestracji
  } catch (error) {
    await UniversalErrorService.logError(error, {
      componentName: 'UserController',
      filename: 'userController.js',
      type: 'api_error',
      additionalData: { action: 'register' }
    });
    
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
```

## 📈 Dashboard i Raporty

### Statystyki Błędów
```javascript
// Pobierz statystyki
const stats = await UniversalErrorService.getErrorStats();
console.log(`Łącznie błędów: ${stats.totalErrors}`);
console.log(`Krytyczne: ${stats.criticalErrors}`);
console.log(`Wysokie: ${stats.highErrors}`);

// Błędy według typu
const errorsByType = await UniversalErrorService.getErrorsByType();

// Ostatnie błędy
const recentErrors = await UniversalErrorService.getRecentErrors(20);
```

### Zarządzanie Błędami
```javascript
// Oznacz błąd jako rozwiązany
await UniversalErrorService.markErrorAsResolved(errorId);

// Dodaj notatkę do błędu
await UniversalErrorService.addNoteToError(errorId, 'Naprawiono w wersji 1.2.3');

// Wyczyść stare błędy
await UniversalErrorService.cleanupOldErrors(30); // starsze niż 30 dni
```

## 🚀 Uruchomienie Systemu

### 1. **Inicjalizacja**
```bash
# Sprawdź czy wszystko działa
node check-process-status.js --all

# Uruchom monitorowanie w tle
node check-process-status.js --monitor
```

### 2. **Dodanie Monitorowania do Plików**
```bash
# Dodaj monitorowanie błędów do wszystkich plików
node add-error-monitoring.js
```

### 3. **Sprawdzenie Błędów**
```bash
# Sprawdź błędy w bazie danych
node check-process-status.js --errors

# Sprawdź status procesów
node check-process-status.js
```

## 📋 Zasady Monitorowania

### 1. **Automatyczne Dodawanie Monitorowania**
- Każdy nowy plik powinien mieć monitorowanie błędów
- Użyj skryptu `add-error-monitoring.js` do automatycznego dodawania
- Sprawdź czy monitorowanie zostało poprawnie dodane

### 2. **Sprawdzanie Statusu Procesów**
- Zawsze sprawdzaj status przed wprowadzaniem zmian
- Używaj `check-process-status.js` do monitorowania
- Uruchamiaj monitorowanie w tle podczas pracy

### 3. **Logowanie Błędów**
- Każdy błąd powinien być zalogowany z kontekstem
- Używaj odpowiednich typów błędów
- Dodawaj dodatkowe dane w `additionalData`

### 4. **Zarządzanie Błędami**
- Regularnie sprawdzaj dashboard błędów
- Oznaczaj rozwiązane błędy
- Czyść stare błędy
- Dodawaj notatki do błędów

## 🔍 Troubleshooting

### Problem: Błędy nie są logowane
```bash
# Sprawdź połączenie z bazą danych
node check-process-status.js --system

# Sprawdź czy UniversalErrorService jest zainicjalizowany
node check-process-status.js --errors
```

### Problem: Procesy nie działają
```bash
# Sprawdź status wszystkich procesów
node check-process-status.js

# Sprawdź porty
node check-process-status.js --netstat

# Sprawdź procesy Node.js
node check-process-status.js --tasklist
```

### Problem: Brak monitorowania w plikach
```bash
# Dodaj monitorowanie do wszystkich plików
node add-error-monitoring.js

# Sprawdź konkretny plik
grep -r "UniversalErrorService" backend/controllers/
```

## 📝 Przykłady Użycia

### 1. **Dodanie Monitorowania do Nowego Kontrolera**
```javascript
const UniversalErrorService = require('../services/universalErrorService');

exports.createProduct = async (req, res) => {
  try {
    // ... logika tworzenia produktu
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    await UniversalErrorService.logError(error, {
      componentName: 'ProductController',
      filename: 'productController.js',
      type: 'api_error',
      additionalData: { action: 'createProduct' }
    });
    
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
```

### 2. **Monitorowanie w Serwisie**
```javascript
const UniversalErrorService = require('./universalErrorService');

class ProductService {
  static async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      await UniversalErrorService.logError(error, {
        componentName: 'ProductService',
        filename: 'productService.js',
        type: 'database_error',
        additionalData: { action: 'findById', productId: id }
      });
      
      throw error;
    }
  }
}
```

### 3. **Monitorowanie w Komponencie React**
```javascript
import { useEffect } from 'react';

const ProductList = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error('❌ Błąd w komponencie React:', error);
        
        // Wyślij błąd do backendu
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            type: 'react_error',
            url: window.location.href,
            userAgent: navigator.userAgent,
            componentName: 'ProductList',
            filename: 'ProductList.jsx'
          })
        }).catch(console.error);
      }
    };
    
    fetchProducts();
  }, []);
  
  return <div>...</div>;
};
```

## 🎯 Podsumowanie

System monitorowania błędów zapewnia:

1. **Kompleksowe monitorowanie** - wszystkie błędy są logowane
2. **Automatyczne sprawdzanie** - status procesów jest monitorowany
3. **Łatwe zarządzanie** - dashboard i skrypty do zarządzania
4. **Automatyzacja** - skrypty do dodawania monitorowania
5. **Dokumentacja** - szczegółowa dokumentacja i przykłady

Używaj tego systemu do:
- Monitorowania zdrowia aplikacji
- Szybkiego wykrywania problemów
- Automatycznego dodawania monitorowania
- Zarządzania błędami w czasie rzeczywistym 