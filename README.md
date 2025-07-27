# Portal E-commerce z Monitoringiem

## 🚀 Szybkie uruchomienie

### Opcje uruchamiania:

#### 1. Uruchomienie całego projektu (zalecane)
```bash
# Z głównego katalogu projektu
npm start          # Uruchamia backend i frontend w trybie produkcyjnym
npm run dev        # Uruchamia backend i frontend w trybie deweloperskim
```

#### 2. Uruchomienie pojedynczych serwisów
```bash
# Backend (API)
cd backend
npm start          # Tryb produkcyjny
npm run dev        # Tryb deweloperski (z nodemon)

# Frontend (React)
cd frontend
npm start          # Tryb deweloperski (Vite)
npm run build      # Build produkcyjny
```

#### 3. Instalacja wszystkich zależności
```bash
npm run install:all
```

## 📋 Naprawione błędy

### ✅ Błędy składni JSX
- **Voivodeships.jsx** - usunięto konflikty merge
- **Notifications.jsx** - naprawiono składnię JSX
- **Login.jsx** - dodano brakujące importy useState i useEffect

### ✅ Błędy bezpieczeństwa
- Zaktualizowano Puppeteer do najnowszej wersji (24.15.0)
- Naprawiono wszystkie luki bezpieczeństwa w zależnościach
- Dodano ochronę przed XSS/NoSQL injection

### ✅ Błędy uruchamiania
- Dodano skrypty `start` i `dev` w głównym package.json
- Dodano `concurrently` do równoczesnego uruchamiania serwerów
- Naprawiono brakujące skrypty npm

## 🔧 Struktura projektu

```
portal/
├── backend/          # API Node.js + Express
├── frontend/         # React + Vite
├── monitoring/       # Skrypty monitoringu
├── inne/            # Pliki pomocnicze
└── package.json     # Główne skrypty
```

## 🌐 Porty

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000 (lub 3001, 3002 jeśli zajęte)

## 📊 Monitoring

```bash
npm run monitor          # Monitoring lokalny
npm run monitor-render   # Monitoring Render
npm run monitor-portal   # Testy portalu
```

## 🧪 Testy

```bash
npm run test:puppeteer:smoke        # Testy podstawowe
npm run test:puppeteer:friendship   # Testy systemu przyjaźni
npm run test:puppeteer:notifications # Testy powiadomień
npm run test:puppeteer:ecommerce    # Testy e-commerce
npm run test:puppeteer:all          # Wszystkie testy
```

## 🔒 Bezpieczeństwo

- ✅ CORS skonfigurowany
- ✅ Ochrona przed XSS/NoSQL injection
- ✅ Walidacja danych wejściowych
- ✅ Bezpieczne zależności (0 luk)

## 📝 Zasady Cursor

Projekt jest zgodny z zasadami Cursor:
- ✅ Analiza wpływu zmian na kod
- ✅ Dokumentacja w komentarzach
- ✅ Testowanie po każdej zmianie
- ✅ Synchronizacja z GitHub
- ✅ Brak operatora '&&' w terminalu
- ✅ Sekwencyjne wykonywanie zadań

## 🐛 Rozwiązywanie problemów

### Port już zajęty
```bash
# Sprawdź procesy na porcie
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Zatrzymaj proces
taskkill /PID <PID> /F
```

### Błędy zależności
```bash
npm audit fix
npm install
```

### Błędy build
```bash
cd frontend
npm run build
```

## 📞 Wsparcie

W przypadku problemów sprawdź:
1. Logi w konsoli przeglądarki
2. Logi serwera backend
3. Status procesów Node.js
4. Zależności npm 