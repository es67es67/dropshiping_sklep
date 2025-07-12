# 🚀 System Monitoringu Portalu

Kompletny system monitoringu dla Twojego portalu e-commerce z Puppeteer.

## 📋 Funkcje

### 🔍 Monitoring Portalu
- **Test dostępności** - sprawdza czy portal się ładuje
- **Test rejestracji** - testuje formularz rejestracji użytkowników
- **Test logowania** - testuje logowanie z istniejącym kontem
- **Test dodawania sklepów** - testuje formularz dodawania sklepów
- **Test dodawania produktów** - testuje formularz dodawania produktów
- **Automatyczne screenshoty** - robi zdjęcia błędów

### 🔍 Monitoring Render
- **Status usług** - sprawdza czy backend/frontend działają
- **Logi błędów** - analizuje logi z Render
- **Status deployów** - sprawdza ostatnie deployy
- **Automatyczne logowanie** - loguje się do panelu Render

## 🛠️ Instalacja

### 1. Zainstaluj zależności
```bash
npm install
```

### 2. Skonfiguruj dane
Edytuj pliki konfiguracyjne:

**portal-monitor.js** (linia 12):
```javascript
this.portalUrl = 'https://twoj-portal.onrender.com'; // Zastąp swoim URL
```

**render-monitor.js** (linie 11-12):
```javascript
this.renderEmail = 'twoj@email.com'; // Email do Render
this.renderPassword = 'twoje-haslo'; // Hasło do Render
```

## 🚀 Uruchamianie

### Szybki start
```powershell
.\monitoring\run-monitoring.ps1
```

### Ręczne uruchamianie

**Test portalu:**
```bash
node monitoring/portal-monitor.js
```

**Monitoring Render:**
```bash
node monitoring/render-monitor.js
```

**Szybki test dostępności:**
```bash
node monitoring/quick-health.js
```

## 📊 Raporty

System generuje raporty w formacie JSON:
- `report_YYYY-MM-DD.json` - raport testów portalu
- `render_report_YYYY-MM-DD.json` - raport monitoringu Render

### Przykład raportu:
```json
{
  "timestamp": "2025-07-12T08:30:00.000Z",
  "totalTests": 5,
  "passedTests": 4,
  "failedTests": 1,
  "results": [
    {
      "test": "Portal Health",
      "success": true,
      "message": "Strona załadowana: Portal E-commerce",
      "timestamp": "2025-07-12T08:30:00.000Z"
    }
  ]
}
```

## 📸 Screenshoty

Screenshoty błędów są zapisywane w:
- `monitoring/screenshots/` - screenshoty z testów portalu
- `monitoring/render-screenshots/` - screenshoty z Render

## ⚙️ Konfiguracja

### Zmiana URL portalu
Edytuj `portal-monitor.js` linia 12:
```javascript
this.portalUrl = 'https://twoj-portal.onrender.com';
```

### Zmiana danych logowania Render
Edytuj `render-monitor.js` linie 11-12:
```javascript
this.renderEmail = 'twoj@email.com';
this.renderPassword = 'twoje-haslo';
```

### Zmiana Service ID Render
Edytuj `render-monitor.js` linie 13-14:
```javascript
this.frontendServiceId = 'srv-d1n82obe5dus73c95ilg';
this.backendServiceId = 'srv-d1n82oje5dus73c95in0';
```

## 🔧 Rozwiązywanie problemów

### Błąd: "Puppeteer not found"
```bash
npm install puppeteer
```

### Błąd: "Portal niedostępny"
1. Sprawdź czy URL jest poprawny
2. Sprawdź czy portal jest uruchomiony na Render
3. Sprawdź logi backendu

### Błąd: "Nie można zalogować do Render"
1. Sprawdź dane logowania w `render-monitor.js`
2. Sprawdź czy konto Render ma dostęp do usług
3. Sprawdź czy nie ma 2FA

### Błąd: "Timeout"
Zwiększ timeout w kodzie:
```javascript
this.page.setDefaultTimeout(60000); // 60 sekund
```

## 📁 Struktura plików

```
monitoring/
├── portal-monitor.js      # Główny skrypt testów portalu
├── render-monitor.js      # Skrypt monitoringu Render
├── quick-health.js        # Szybki test dostępności
├── run-monitoring.ps1     # Skrypt PowerShell do uruchamiania
├── README.md              # Ta dokumentacja
├── screenshots/           # Screenshoty z testów portalu
├── render-screenshots/    # Screenshoty z Render
└── reports/               # Raporty JSON
```

## 🎯 Przykłady użycia

### Codzienny monitoring
```powershell
# Dodaj do Task Scheduler Windows
.\monitoring\run-monitoring.ps1
```

### Monitoring w CI/CD
```bash
# Dodaj do GitHub Actions lub innego CI
node monitoring/portal-monitor.js
node monitoring/render-monitor.js
```

### Alerty o błędach
Skrypt zwraca kod wyjścia:
- `0` - wszystkie testy przeszły
- `1` - przynajmniej jeden test nie przeszedł

## 🔄 Automatyzacja

### Windows Task Scheduler
1. Otwórz Task Scheduler
2. Utwórz nowe zadanie
3. Ustaw trigger (np. codziennie o 9:00)
4. Akcja: `powershell.exe -File "D:\portal\monitoring\run-monitoring.ps1"`

### Cron (Linux/Mac)
```bash
# Dodaj do crontab
0 9 * * * cd /path/to/portal && node monitoring/portal-monitor.js
```

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli
2. Sprawdź screenshoty błędów
3. Sprawdź raporty JSON
4. Sprawdź czy wszystkie zależności są zainstalowane

## 🔒 Bezpieczeństwo

⚠️ **UWAGA:** Nie commituj danych logowania do Git!
- Użyj zmiennych środowiskowych
- Dodaj pliki z hasłami do .gitignore
- Używaj osobnych kont testowych

## 📈 Rozszerzenia

Możliwe rozszerzenia systemu:
- Wysyłanie alertów email/Slack
- Integracja z Sentry/LogRocket
- Monitoring wydajności (Lighthouse)
- Testy API (Postman/Newman)
- Monitoring bazy danych MongoDB 