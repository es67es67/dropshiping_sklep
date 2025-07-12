# 🚀 Konfiguracja MCP Servers dla Portalu E-commerce

## 📋 Przegląd

Ten zestaw plików konfiguracyjnych umożliwia monitorowanie portalu e-commerce w czasie rzeczywistym poprzez MCP (Model Context Protocol) servers w Cursor.

## 🎯 Funkcjonalności

### Monitorowanie w czasie rzeczywistym:
- ✅ **Screenshots automatyczne** - przy błędach i na żądanie
- ✅ **Monitoring wydajności** - sprawdzanie szybkości ładowania
- ✅ **Health checks** - sprawdzanie statusu endpointów
- ✅ **Logi błędów** - automatyczne zbieranie i analiza
- ✅ **Powiadomienia** - Discord, email przy problemach

### Integracje:
- 🔗 **GitHub** - dostęp do repozytoriów i issues
- 🔗 **MongoDB** - bezpośredni dostęp do bazy danych
- 🔗 **Render** - monitoring deploymentów
- 🔗 **Sentry** - śledzenie błędów i performance
- 🔗 **Cypress** - automatyczne testy

## 🛠️ Instalacja

### Krok 1: Uruchom skrypt konfiguracyjny
```powershell
cd D:\portal
.\setup-mcp.ps1
```

### Krok 2: Skonfiguruj klucze API
Edytuj plik `.env.mcp` i zastąp wartości swoimi kluczami:

```env
# GitHub
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_REPO=your_username/portal

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portal

# Render
RENDER_API_KEY=your_render_api_key_here

# Sentry
SENTRY_DSN=https://your_sentry_dsn_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=portal-ecommerce

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url

# Portal URLs
FRONTEND_URL=https://your-portal.onrender.com
BACKEND_URL=https://your-portal-backend.onrender.com
```

### Krok 3: Konfiguracja w Cursor
1. Otwórz Cursor
2. Przejdź do **Settings** → **Extensions** → **MCP**
3. Kliknij **Add Server**
4. Wybierz plik `mcp-config.json`
5. Zatwierdź konfigurację

## 📊 Użycie

### Monitorowanie statusu
```powershell
.\monitor-portal.ps1
```

### Robienie screenshotu
```powershell
# Screenshot głównej strony
.\take-screenshot.ps1

# Screenshot konkretnej strony
.\take-screenshot.ps1 -Url "https://your-portal.onrender.com/shops"
```

### Automatyczne monitorowanie
Skrypt `monitor-portal.ps1` sprawdza:
- Status frontendu (kod 200)
- Status backendu (/api/health)
- Połączenie z bazą danych (/api/shops)
- Czas odpowiedzi

## 🔧 Konfiguracja zaawansowana

### Dodanie nowych endpointów do monitorowania
Edytuj sekcję `health_check.endpoints` w `mcp-config.json`:

```json
"health_check": {
  "enabled": true,
  "check_interval": 60,
  "endpoints": [
    "/api/health",
    "/api/shops",
    "/api/products",
    "/api/users",
    "/api/locations"
  ]
}
```

### Konfiguracja powiadomień Discord
1. Utwórz kanał w Discord
2. Dodaj webhook: **Channel Settings** → **Integrations** → **Webhooks**
3. Skopiuj URL webhooka do `.env.mcp`

### Konfiguracja Sentry
1. Zarejestruj się na [sentry.io](https://sentry.io)
2. Utwórz nowy projekt
3. Skopiuj DSN do `.env.mcp`

## 📁 Struktura plików

```
D:\portal\
├── mcp-config.json          # Główna konfiguracja MCP
├── setup-mcp.ps1           # Skrypt instalacyjny
├── monitor-portal.ps1      # Monitoring statusu
├── take-screenshot.ps1     # Robienie screenshots
├── .env.mcp               # Klucze API
├── screenshots/           # Zapisane screenshots
├── performance-reports/   # Raporty wydajności
├── error-screenshots/     # Screenshots błędów
├── backups/              # Kopie zapasowe
└── logs/                 # Logi aplikacji
```

## 🚨 Rozwiązywanie problemów

### Problem: "Node.js nie jest zainstalowany"
```powershell
# Pobierz i zainstaluj Node.js ze strony:
# https://nodejs.org/
```

### Problem: "Chrome nie jest w PATH"
```powershell
# Dodaj Chrome do PATH lub użyj pełnej ścieżki:
# C:\Program Files\Google\Chrome\Application\chrome.exe
```

### Problem: "Błąd połączenia z API"
1. Sprawdź czy klucze API są poprawne
2. Sprawdź czy serwisy są dostępne
3. Sprawdź firewall/antywirus

### Problem: "MCP server nie odpowiada"
1. Sprawdź czy pakiet jest zainstalowany: `npx @modelcontextprotocol/server-github --version`
2. Sprawdź logi w Cursor
3. Restart Cursor

## 📈 Metryki i raporty

### Automatyczne raporty
- **Codzienne** - status wszystkich komponentów
- **Tygodniowe** - analiza wydajności
- **Miesięczne** - podsumowanie błędów

### Dostępne metryki
- Czas odpowiedzi API
- Dostępność serwisów
- Liczba błędów
- Wydajność frontendu
- Status bazy danych

## 🔒 Bezpieczeństwo

### Klucze API
- ✅ Przechowuj w `.env.mcp` (nie w git)
- ✅ Używaj ograniczonych uprawnień
- ✅ Regularnie rotuj klucze
- ✅ Monitoruj użycie

### Dostęp do danych
- ✅ Tylko uprawnione osoby
- ✅ Logowanie dostępu
- ✅ Szyfrowanie wrażliwych danych

## 📞 Wsparcie

### Logi błędów
Sprawdź pliki w katalogu `logs/`:
- `error.log` - błędy aplikacji
- `access.log` - żądania HTTP
- `performance.log` - metryki wydajności

### Debugowanie
```powershell
# Włącz tryb debug
$env:DEBUG = "mcp:*"
.\monitor-portal.ps1
```

## 🎉 Gotowe!

Po konfiguracji będziesz mieć:
- ✅ Automatyczne monitorowanie portalu
- ✅ Screenshots przy błędach
- ✅ Powiadomienia o problemach
- ✅ Raporty wydajności
- ✅ Integrację z narzędziami deweloperskimi

**Twój portal jest teraz pod pełnym nadzorem! 🚀** 