# DOKUMENTACJA TESTÓW PUPPETEER - PORTAL SPOŁECZNOŚCIOWO-HANDLOWY

## 🎯 CEL I ZAKRES

Dokumentacja opisuje automatyczne testy Puppeteer dla portalu społecznościowo-handlowego, zgodnie z regułami Cursor AI.

## 📋 STRUKTURA TESTÓW

### Dostępne testy:
```bash
npm run test:puppeteer:smoke        # Podstawowe testy funkcjonalności
npm run test:puppeteer:friendship   # Testy systemu znajomości
npm run test:puppeteer:notifications # Testy powiadomień
npm run test:puppeteer:ecommerce    # Testy e-commerce
npm run test:puppeteer:responsive   # Testy responsywności
npm run test:puppeteer:performance  # Testy wydajności
npm run test:puppeteer:accessibility # Testy dostępności
npm run test:puppeteer:all          # Wszystkie testy Puppeteer
```

## 🔧 KONFIGURACJA

### Wymagania:
- Node.js v18+
- Puppeteer v21+
- Działający serwer frontend (localhost:3000)
- Działający serwer backend (localhost:5000)

### Instalacja:
```bash
npm install puppeteer
```

## 📁 STRUKTURA PLIKÓW

```
portal/
├── test-portal-simple.js           # Podstawowe testy funkcjonalności
├── test-friendship-puppeteer.js    # Testy systemu znajomości
├── test-notifications-puppeteer.js # Testy powiadomień
├── test-portal.js                  # Kompleksowe testy e-commerce
├── test-browser.js                 # Testy responsywności
├── test-screenshots/               # Katalog ze screenshotami
│   ├── 01_main_page_*.png
│   ├── 02_login_form_*.png
│   ├── 03_after_login_*.png
│   └── ERROR_*.png
└── package.json                    # Skrypty npm
```

## 🧪 SZCZEGÓŁY TESTÓW

### 1. Testy Smoke (test-portal-simple.js)
**Cel**: Podstawowa weryfikacja funkcjonalności portalu

**Testowane funkcje**:
- Ładowanie strony głównej
- Formularz logowania
- Przekierowanie po logowaniu
- Wyświetlanie sklepów
- Wyświetlanie produktów
- Koszyk zakupów

**Screenshoty**:
- `01_main_page_*.png` - Strona główna
- `02_login_form_*.png` - Formularz logowania
- `03_after_login_*.png` - Po zalogowaniu
- `04_shops_logged_in_*.png` - Sklepy po zalogowaniu
- `05_products_logged_in_*.png` - Produkty po zalogowaniu
- `06_cart_logged_in_*.png` - Koszyk po zalogowaniu

### 2. Testy Systemu Znajomości (test-friendship-puppeteer.js)
**Cel**: Weryfikacja funkcji społecznościowych

**Testowane funkcje**:
- Wyszukiwanie użytkowników
- Wysyłanie zaproszeń do znajomych
- Akceptowanie zaproszeń
- Sprawdzanie statusu znajomości
- Lista znajomych

**Screenshoty**:
- `01_login_page_*.png` - Strona logowania
- `02_after_login_*.png` - Po zalogowaniu
- `03_search_users_*.png` - Wyszukiwanie użytkowników
- `04_user_profile_*.png` - Profil użytkownika
- `05_friend_request_*.png` - Wysyłanie zaproszenia
- `06_friends_list_*.png` - Lista znajomych

### 3. Testy Powiadomień (test-notifications-puppeteer.js)
**Cel**: Weryfikacja systemu powiadomień

**Testowane funkcje**:
- Sprawdzanie powiadomień w navbar
- Otwieranie dropdown powiadomień
- Strona powiadomień
- Akceptowanie zaproszeń z listy
- Oznaczanie jako przeczytane

**Screenshoty**:
- `01_login_page_*.png` - Strona logowania
- `02_after_login_*.png` - Po zalogowaniu
- `03_navbar_notifications_*.png` - Powiadomienia w navbar
- `04_notifications_dropdown_*.png` - Dropdown powiadomień
- `05_notifications_page_*.png` - Strona powiadomień

### 4. Testy E-commerce (test-portal.js)
**Cel**: Kompleksowa weryfikacja funkcji handlowych

**Testowane funkcje**:
- Przeglądanie sklepów
- Przeglądanie produktów
- Dodawanie do koszyka
- Proces zakupowy
- System ocen i recenzji

### 5. Testy Responsywności (test-browser.js)
**Cel**: Weryfikacja responsywności na różnych urządzeniach

**Testowane urządzenia**:
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1920x1080)

## 📊 STANDARDY RAPORTOWANIA

### Format raportu:
```json
{
  "timestamp": "2025-07-24T08:16:23.112Z",
  "testName": "friendship-system",
  "status": "passed",
  "duration": 45000,
  "screenshots": [
    "01_login_page_2025-07-24T08-16-23-112Z.png",
    "02_after_login_2025-07-24T08-16-25-234Z.png"
  ],
  "performance": {
    "averageLoadTime": 1200,
    "slowestPage": "/shops",
    "fastestPage": "/"
  },
  "errors": [],
  "warnings": []
}
```

### Automatyczne raporty:
- Codzienne raporty w `test-screenshots/daily-report-YYYY-MM-DD.json`
- Raporty po każdej zmianie kodu
- Alerty o błędach krytycznych

## 🎨 STANDARDY SCREENSHOTÓW

### Konwencja nazewnictwa:
```
Format: [numer]_[nazwa]_[timestamp].png

Przykłady:
01_main_page_2025-07-24T08-16-23-112Z.png
02_login_form_2025-07-24T08-16-25-234Z.png
03_after_login_2025-07-24T08-16-27-456Z.png
ERROR_login_2025-07-24T08-16-29-789Z.png
```

### Konfiguracja screenshotów:
```javascript
await page.screenshot({ 
  path: filepath, 
  fullPage: true,
  quality: 90,
  type: 'png'
});
```

## 🚀 STANDARDY WYDAJNOŚCI

### Metryki wydajności:
- **Page Load Time**: < 2 sekundy
- **First Contentful Paint**: < 1.5 sekundy
- **Largest Contentful Paint**: < 2.5 sekundy
- **Time to Interactive**: < 3 sekundy

### Monitoring wydajności:
```javascript
const performanceMetrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
  };
});
```

## ♿ STANDARDY DOSTĘPNOŚCI

### Testowane aspekty dostępności:
- Kontrast kolorów
- Alt teksty dla obrazów
- Struktura nagłówków
- Nawigacja klawiaturą
- Czytniki ekranu

### Automatyczne sprawdzanie:
```javascript
const accessibilityViolations = await page.evaluate(() => {
  const violations = [];
  
  // Sprawdź alt teksty
  const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.alt);
  
  // Sprawdź nagłówki
  const headingStructure = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(h => ({ level: parseInt(h.tagName[1]), text: h.textContent }));
  
  return {
    imagesWithoutAlt,
    headingStructure
  };
});
```

## 🔧 AUTOMATYCZNE NAPRAWY

### Obsługiwane problemy:
1. **Problemy z logowaniem** - sprawdzenie statusu serwera
2. **Brakujące elementy** - alternatywne selektory
3. **Timeout** - zwiększenie timeout'ów
4. **Błędy JavaScript** - analiza logów konsoli

### Proces naprawy:
```javascript
const autoFixTestIssues = async (error, page) => {
  log(`🔧 Próbuję automatyczną naprawę: ${error.message}`);
  
  if (error.message.includes('login')) {
    const serverStatus = await checkServerStatus();
    if (!serverStatus) {
      log(`🚀 Uruchamiam serwer...`);
      await startServer();
    }
  }
  
  if (error.message.includes('selector')) {
    const alternativeSelectors = generateAlternativeSelectors(error.selector);
    for (const selector of alternativeSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        log(`✅ Znaleziono alternatywny selector: ${selector}`);
        break;
      } catch (e) {
        continue;
      }
    }
  }
};
```

## 📈 MONITORING I ALERTY

### Automatyczne alerty:
- Testy nie przechodzą
- Wydajność poniżej standardów
- Błędy dostępności
- Problemy z responsywnością

### Codzienne raporty:
```javascript
const generateDailyReport = async () => {
  const today = new Date().toISOString().split('T')[0];
  const testFiles = fs.readdirSync(SCREENSHOT_DIR)
    .filter(file => file.includes(today))
    .filter(file => file.endsWith('.json'));
  
  const summary = {
    date: today,
    totalTests: reports.reduce((sum, r) => sum + r.totalTests, 0),
    passed: reports.reduce((sum, r) => sum + r.passed, 0),
    failed: reports.reduce((sum, r) => sum + r.failed, 0),
    successRate: 0,
    averageLoadTime: 0,
    criticalIssues: []
  };
  
  return summary;
};
```

## 🎯 INTEGRACJA Z CURSOR AI

### Automatyczne uruchamianie:
- Po każdej zmianie kodu
- Przed każdym commit'em
- Codziennie o 6:00 UTC

### Analiza wyników:
- Automatyczna analiza screenshotów
- Porównanie z baseline'ami
- Generowanie raportów
- Alerty o problemach

### Dokumentacja zmian:
```markdown
# Changelog - [Data]
## Testy Puppeteer
- ✅ Testy smoke: Przeszły
- ✅ Testy friendship: Przeszły
- ✅ Testy notifications: Przeszły
- ⚠️ Testy e-commerce: 1 błąd (naprawiony automatycznie)
- ✅ Performance: <2s load time
- ✅ Accessibility: Brak naruszeń
```

## 🔄 WORKFLOW

### Standardowy workflow:
1. **Zmiana kodu** - wprowadzenie modyfikacji
2. **Automatyczne testy** - uruchomienie wszystkich testów Puppeteer
3. **Analiza wyników** - sprawdzenie screenshotów i metryk
4. **Automatyczne naprawy** - jeśli to możliwe
5. **Ponowne testy** - weryfikacja napraw
6. **Raportowanie** - generowanie raportu
7. **Dokumentacja** - aktualizacja changelogu

### W przypadku błędów:
1. **Analiza błędu** - szczegółowa analiza problemu
2. **Propozycja naprawy** - automatyczna lub manualna
3. **Implementacja naprawy** - wprowadzenie poprawki
4. **Weryfikacja** - ponowne uruchomienie testów
5. **Dokumentacja** - opis problemu i rozwiązania

## 📚 ZASOBY

### Dokumentacja:
- [Puppeteer API](https://pptr.dev/api/)
- [Best Practices](https://pptr.dev/best-practices/)
- [Debugging](https://pptr.dev/debugging/)

### Narzędzia:
- Chrome DevTools Protocol
- Lighthouse CI
- axe-core (dostępność)

### Inspiracje:
- Facebook/Instagram - social features
- Amazon - e-commerce
- Netflix - recommendations
- Airbnb - user experience

---

**Ostatnia aktualizacja**: 2025-07-24
**Wersja**: 1.0.0
**Autor**: Cursor AI 