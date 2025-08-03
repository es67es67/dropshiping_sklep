# 🚨 SYSTEM MONITOROWANIA BŁĘDÓW - REGUŁY PROJEKTU

## 📋 **REGUŁA KIEROWNIKA PROJEKTU**

### 🎯 **Zasady dla Zespołu:**
- **Kierownik projektu** - Ty jesteś kierownikiem
- **Zespół specjalistów** - My jesteśmy Twoim zespołem najlepszych specjalistów
- **Duży zespół** - Mamy wszystkich możliwych specjalistów do tworzenia portalu
- **Testy automatyczne** - Używamy testów do weryfikacji funkcjonalności
- **Obsługa błędów** - Każdy błąd musi być zapisany w bazie danych
- **Nie psujemy** - Naprawiając jedno, nie psujemy drugiego

## 🔧 **KOMPLEKSOWA OBSŁUGA BŁĘDÓW**

### 1. **Automatyczne Testy Przed Każdą Zmianą**

```javascript
// Przed każdą zmianą kodu:
// 1. Uruchom testy
// 2. Sprawdź wszystkie funkcjonalności
// 3. Zapisz wyniki do bazy danych
// 4. Tylko potem wprowadź zmiany
```

### 2. **System Zapisywania Błędów do Bazy**

```javascript
// Każdy błąd musi być zapisany:
const errorData = {
  timestamp: new Date(),
  error: error.message,
  stack: error.stack,
  component: 'Products.jsx',
  action: 'fetchProducts',
  userAgent: navigator.userAgent,
  url: window.location.href,
  userId: user?.id || 'anonymous'
};

// Zapisz do bazy danych
await fetch('/api/errors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(errorData)
});
```

### 3. **Reguły Naprawiania Błędów**

#### **Przed Naprawą:**
- [ ] Uruchom pełne testy
- [ ] Sprawdź wszystkie funkcjonalności
- [ ] Zapisz aktualny stan do bazy
- [ ] Zidentyfikuj dokładnie problem

#### **Podczas Naprawy:**
- [ ] Testuj każdą zmianę
- [ ] Sprawdź czy nie psujesz innych funkcji
- [ ] Zapisz każdy krok do bazy
- [ ] Dokumentuj zmiany

#### **Po Naprawie:**
- [ ] Uruchom wszystkie testy
- [ ] Sprawdź wszystkie funkcjonalności
- [ ] Zapisz wyniki do bazy
- [ ] Potwierdź że nic nie zostało zepsute

## 🧪 **SYSTEM TESTÓW**

### **Testy Automatyczne:**

```javascript
// Test 1: Sprawdź czy API działa
const testAPI = async () => {
  try {
    const response = await fetch('/api/marketplace');
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    console.log('✅ API działa, produkty:', data.products?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ API błąd:', error);
    await saveErrorToDatabase(error, 'testAPI');
    return false;
  }
};

// Test 2: Sprawdź czy produkty się wyświetlają
const testProductsDisplay = () => {
  const products = document.querySelectorAll('[data-testid="product-card"]');
  console.log('✅ Produkty wyświetlone:', products.length);
  return products.length > 0;
};

// Test 3: Sprawdź czy koszyk działa
const testCart = async () => {
  try {
    const response = await fetch('/api/cart/summary');
    if (!response.ok) throw new Error(`Cart API Error: ${response.status}`);
    const data = await response.json();
    console.log('✅ Koszyk działa, przedmioty:', data.items?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Koszyk błąd:', error);
    await saveErrorToDatabase(error, 'testCart');
    return false;
  }
};
```

### **Funkcja Zapisywania Błędów:**

```javascript
const saveErrorToDatabase = async (error, context) => {
  try {
    const errorData = {
      timestamp: new Date(),
      error: error.message,
      stack: error.stack,
      context: context,
      component: 'Products.jsx',
      action: 'errorHandling',
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous'
    };

    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    });

    console.log('✅ Błąd zapisany do bazy danych');
  } catch (saveError) {
    console.error('❌ Nie udało się zapisać błędu:', saveError);
  }
};
```

## 🔄 **PROCES NAPRAWIANIA BŁĘDÓW**

### **Krok 1: Diagnoza**
```javascript
// Sprawdź wszystkie funkcjonalności
const runFullDiagnostics = async () => {
  console.log('🔍 Rozpoczynam pełną diagnostykę...');
  
  const results = {
    api: await testAPI(),
    products: testProductsDisplay(),
    cart: await testCart(),
    auth: testAuth(),
    navigation: testNavigation()
  };
  
  console.log('📊 Wyniki diagnostyki:', results);
  await saveDiagnosticsToDatabase(results);
  
  return results;
};
```

### **Krok 2: Naprawa**
```javascript
// Napraw problem bez psucia innych funkcji
const fixIssue = async (issue) => {
  console.log('🔧 Naprawiam problem:', issue);
  
  // 1. Zapisz aktualny stan
  await saveCurrentState();
  
  // 2. Wprowadź zmiany
  const changes = await implementFix(issue);
  
  // 3. Przetestuj zmiany
  const testResults = await testAfterFix();
  
  // 4. Zapisz wyniki
  await saveFixResults(changes, testResults);
  
  return testResults;
};
```

### **Krok 3: Weryfikacja**
```javascript
// Sprawdź czy nic nie zostało zepsute
const verifyAllFunctions = async () => {
  const allTests = [
    testAPI(),
    testProductsDisplay(),
    testCart(),
    testAuth(),
    testNavigation(),
    testSearch(),
    testFilters(),
    testAddToCart(),
    testWishlist()
  ];
  
  const results = await Promise.all(allTests);
  const allWorking = results.every(result => result === true);
  
  console.log('✅ Wszystkie funkcje działają:', allWorking);
  await saveVerificationResults(results);
  
  return allWorking;
};
```

## 📊 **MONITORING W CZASIE RZECZYWISTYM**

### **Automatyczne Sprawdzanie:**

```javascript
// Sprawdzaj co 30 sekund
setInterval(async () => {
  const health = await checkSystemHealth();
  if (!health.ok) {
    console.error('🚨 Problem z systemem:', health.errors);
    await saveErrorToDatabase(health.errors, 'systemHealth');
  }
}, 30000);
```

### **Sprawdzanie Przy Każdym Żądaniu:**

```javascript
// Dodaj do każdego fetch
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      await saveErrorToDatabase(error, 'fetchError');
    }
    
    return response;
  } catch (error) {
    await saveErrorToDatabase(error, 'fetchError');
    throw error;
  }
};
```

## 🎯 **REGUŁY DLA ZESPOŁU**

### **Przed Każdą Zmianą:**
1. ✅ Uruchom pełne testy
2. ✅ Sprawdź wszystkie funkcjonalności  
3. ✅ Zapisz aktualny stan do bazy
4. ✅ Zidentyfikuj dokładnie problem

### **Podczas Zmiany:**
1. ✅ Testuj każdą zmianę
2. ✅ Sprawdź czy nie psujesz innych funkcji
3. ✅ Zapisz każdy krok do bazy
4. ✅ Dokumentuj zmiany

### **Po Zmianie:**
1. ✅ Uruchom wszystkie testy
2. ✅ Sprawdź wszystkie funkcjonalności
3. ✅ Zapisz wyniki do bazy
4. ✅ Potwierdź że nic nie zostało zepsute

## 📝 **DOKUMENTACJA BŁĘDÓW**

### **Format Zapisu Błędu:**
```javascript
{
  timestamp: Date,
  error: String,
  stack: String,
  context: String,
  component: String,
  action: String,
  userAgent: String,
  url: String,
  userId: String,
  severity: 'low' | 'medium' | 'high' | 'critical',
  status: 'open' | 'investigating' | 'fixed' | 'closed'
}
```

### **Kategorie Błędów:**
- **API Errors** - Błędy komunikacji z backendem
- **UI Errors** - Błędy interfejsu użytkownika
- **Navigation Errors** - Błędy nawigacji
- **Data Errors** - Błędy danych
- **Performance Errors** - Błędy wydajności

---

**🎯 CEL: Zero błędów, maksymalna stabilność, automatyczne testy, kompleksowa dokumentacja** 