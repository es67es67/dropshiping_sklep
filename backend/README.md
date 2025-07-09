# Portal Backend - Modułowa Architektura

## 🚀 Przegląd

Backend portalu został przeprojektowany w modułową architekturę, która umożliwia łatwe dodawanie nowych funkcji bez przepisywania głównego kodu.

## 📁 Struktura Projektu

```
backend/
├── core/                    # System rdzeniowy
│   ├── moduleLoader.js     # Ładowanie modułów
│   └── eventSystem.js      # System eventów
├── modules/                # Moduły funkcjonalne
│   ├── location/           # Moduł lokalizacji
│   ├── messaging/          # Moduł komunikacji
│   ├── gamification/       # Moduł statusów/odznak
│   └── payments/           # Moduł płatności
├── models/                 # Modele danych
├── routes/                 # Legacy routes (do migracji)
├── scripts/                # Skrypty pomocnicze
│   └── terytSync.js        # Synchronizacja z TERYT
└── server.js               # Główny serwer
```

## 🔧 Moduły

### 1. Moduł Lokalizacji (`/modules/location/`)
- **Funkcje:** Hierarchiczne lokalizacje, sąsiednie lokalizacje, wyszukiwanie w promieniu
- **API:** `/api/location/*`
- **Modele:** Location (zaktualizowany)

### 2. Moduł Komunikacji (`/modules/messaging/`)
- **Funkcje:** Wiadomości, czat, wysyłanie plików
- **API:** `/api/messaging/*`
- **Modele:** Message (nowy)

### 3. Moduł Gamification (`/modules/gamification/`)
- **Funkcje:** Statusy, odznaki, poziomy, rankingi
- **API:** `/api/gamification/*`
- **Modele:** Badge, Achievement (nowe)

### 4. Moduł Płatności (`/modules/payments/`)
- **Funkcje:** Zamówienia, płatności, integracja z bramkami
- **API:** `/api/payments/*`
- **Modele:** Order, Payment (nowe)

## 🏗️ Core System

### Module Loader
- Automatyczne ładowanie modułów z katalogu `/modules/`
- Inicjalizacja modułów
- Zarządzanie cyklem życia modułów

### Event System
- Komunikacja między modułami
- Eventy dla lokalizacji, wiadomości, płatności, gamification
- Rozszerzalny system eventów

## 📊 Migracja Danych

### Lokalizacje (String → ObjectId)
```bash
# Uruchom migrację
curl -X POST http://localhost:5000/api/location/migrate-locations
```

### Inicjalizacja Gamification
```bash
# Inicjalizuj system odznak i osiągnięć
curl -X POST http://localhost:5000/api/gamification/initialize
```

## 🔄 Synchronizacja TERYT

### Automatyczna synchronizacja
```bash
# Uruchom synchronizację
node scripts/terytSync.js
```

### Harmonogram (Windows Task Scheduler)
1. Otwórz "Harmonogram zadań"
2. Utwórz nowe zadanie
3. Ustaw akcję: `node D:\portal\backend\scripts\terytSync.js`
4. Ustaw harmonogram (np. codziennie o 2:00)

### Harmonogram (Linux Cron)
```bash
# Dodaj do crontab
0 2 * * * cd /path/to/portal/backend && node scripts/terytSync.js
```

## 🚀 Uruchomienie

### Development
```bash
cd backend
npm install
npm run dev
```

### Production
```bash
cd backend
npm install
npm start
```

## 📡 API Endpoints

### Lokalizacje
- `GET /api/location/locations` - Lista lokalizacji
- `GET /api/location/locations/:id` - Szczegóły lokalizacji
- `GET /api/location/locations/:id/nearby` - Sąsiednie lokalizacje
- `GET /api/location/locations/:id/radius/:km` - Wyszukiwanie w promieniu
- `PUT /api/location/users/location` - Aktualizacja lokalizacji użytkownika

### Komunikacja
- `GET /api/messaging/conversations/:userId` - Konwersacje użytkownika
- `GET /api/messaging/messages/:userId/:otherUserId` - Wiadomości
- `POST /api/messaging/messages` - Wysłanie wiadomości
- `POST /api/messaging/messages/with-file` - Wiadomość z plikiem

### Gamification
- `GET /api/gamification/profile/:userId` - Profil z statusami
- `GET /api/gamification/badges` - Lista odznak
- `GET /api/gamification/achievements` - Lista osiągnięć
- `GET /api/gamification/leaderboard` - Ranking użytkowników
- `POST /api/gamification/points/add` - Dodanie punktów

### Płatności
- `POST /api/payments/orders` - Tworzenie zamówienia
- `GET /api/payments/orders/user/:userId` - Zamówienia użytkownika
- `POST /api/payments/payments` - Tworzenie płatności
- `GET /api/payments/stats` - Statystyki płatności

## 🔧 Konfiguracja

### Zmienne środowiskowe
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
```

### Konfiguracja modułów
Każdy moduł może mieć własną konfigurację w pliku `config.js` w katalogu modułu.

## 📈 Rozszerzanie

### Dodanie nowego modułu
1. Utwórz katalog w `/modules/`
2. Stwórz `index.js` z klasą modułu
3. Zaimplementuj metody `initialize()` i `getRoutes()`
4. Dodaj routing w `server.js`

### Przykład nowego modułu
```javascript
// modules/example/index.js
const express = require('express');
const router = express.Router();

class ExampleModule {
  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    router.get('/test', (req, res) => {
      res.json({ message: 'Moduł działa!' });
    });
  }

  async initialize() {
    console.log('🔧 Inicjalizacja modułu example...');
    return true;
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = new ExampleModule();
```

## 🐛 Debugowanie

### Logi modułów
Każdy moduł loguje swoje działania z prefiksem emoji:
- 📍 Lokalizacje
- 💬 Komunikacja
- 🎮 Gamification
- 💰 Płatności

### Eventy
Wszystkie eventy są logowane w konsoli z prefiksem `📡`.

## 🔮 Przyszłe Moduły

### Planowane moduły:
- **Dropshipping** - Integracja z hurtowniami
- **Shipping** - Integracja z kurierami
- **AI** - Funkcje AI (rekomendacje, chatbot)
- **Analytics** - Analityka i raporty
- **Notifications** - System powiadomień
- **Social** - Funkcje społecznościowe

### Integracje zewnętrzne:
- **Stripe** - Płatności online
- **PayPal** - Płatności PayPal
- **TERYT** - Oficjalne API GUS
- **Google Maps** - Geolokalizacja
- **SendGrid** - Email marketing

## 📝 Notatki

- Wszystkie moduły są ładowane automatycznie przy starcie serwera
- Event system umożliwia komunikację między modułami
- Moduły mogą być włączane/wyłączane bez restartu serwera
- Każdy moduł ma własne modele, API i logikę biznesową
- Architektura jest przygotowana na skalowanie i dodawanie nowych funkcji 