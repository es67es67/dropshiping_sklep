# 🏢 Portal - Modular Community Platform

Nowoczesna platforma społecznościowa z modułową architekturą, panelami administracyjnymi i zaawansowanymi funkcjonalnościami.

## 🚀 Funkcjonalności

### 👥 **Społeczność**
- Rejestracja i logowanie użytkowników
- Profile użytkowników z awatarami
- System znajomych i obserwowania
- Wiadomości prywatne i grupowe
- Posty i komentarze

### 🏪 **E-commerce**
- Sklepy lokalne i online
- Katalog produktów
- System zamówień i płatności
- Recenzje i oceny
- System powiadomień
- **Zarządzanie sklepami** - Dodawanie, edycja, usuwanie sklepów
- **Zarządzanie produktami** - Dodawanie produktów do sklepów, edycja, usuwanie
- **Panel zarządzania** - Dedykowany panel dla właścicieli sklepów

### 📍 **Lokalizacje**
- Baza danych lokalizacji (województwa, powiaty, gminy)
- Integracja z Google Maps
- Wyszukiwanie geograficzne
- Eksport danych GUS

### 🎮 **Gamifikacja**
- System punktów i poziomów
- Osiągnięcia i odznaki
- Rankingi użytkowników
- Wyzwania i misje

### ⚙️ **Panel Administracyjny**
- Zarządzanie użytkownikami
- Edycja danych w czasie rzeczywistym
- Eksport danych (JSON, CSV, XML, Excel)
- Statystyki systemu
- Zarządzanie duplikatami

## 📝 Najnowsze zmiany (v1.2.0)

### ✅ Naprawione problemy
- **Przycisk "Dodaj sklep"** - Teraz poprawnie przekierowuje do formularza dodawania sklepu
- **Przycisk "Dodaj produkt"** - Poprawne przekierowanie do formularza dodawania produktu
- **Zarządzanie produktami w sklepach** - Dodana zakładka "Produkty" w szczegółach sklepu
- **Przekazywanie motywu** - Poprawione przekazywanie motywu do komponentów

### 🆕 Nowe funkcjonalności
- **Zakładka "Produkty"** w szczegółach sklepu z możliwością:
  - Przeglądania produktów sklepu
  - Dodawania nowych produktów
  - Edycji istniejących produktów
  - Usuwania produktów
- **Modal dodawania/edycji produktów** z formularzem zawierającym:
  - Nazwę produktu
  - Opis
  - Cenę
  - Kategorię
  - Markę
  - Stan magazynowy

### 🔧 Zmiany techniczne
- Zaktualizowane komponenty: `ShopList`, `ProductList`, `ShopDetails`, `ShopProducts`
- Poprawione routing w `App.js` z przekazywaniem motywu
- Dodane styled components dla zakładek w `ShopDetails`

## 🛠️ Technologie

### Frontend
- **React 18** - Biblioteka UI
- **Styled Components** - Stylowanie
- **React Router** - Routing
- **Context API** - Zarządzanie stanem
- **Axios** - Komunikacja z API

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MongoDB** - Baza danych
- **Mongoose** - ODM
- **Socket.IO** - Komunikacja real-time
- **JWT** - Autoryzacja

### Baza danych
- **MongoDB Atlas** - Cloud database
- **Mongoose** - Modelowanie danych
- **Indexy** - Optymalizacja zapytań

## 📦 Instalacja

### Wymagania
- Node.js 18+ 
- npm lub yarn
- MongoDB Atlas (darmowe konto)

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/your-username/portal.git
cd portal
```

### 2. Instalacja zależności
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Konfiguracja środowiska
```bash
# Backend
cd backend
cp .env.example .env
# Edytuj .env z danymi MongoDB Atlas
```

### 4. Uruchomienie
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔧 Konfiguracja

### Zmienne środowiskowe (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portal

# JWT
JWT_SECRET=your-secret-key

# Port
PORT=5000

# Environment
NODE_ENV=development

# Google Maps API (opcjonalne)
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Google Maps API (Opcjonalne)
Aplikacja używa Google Maps API do wyboru lokalizacji sklepów. Jeśli API nie jest skonfigurowane:

1. **Funkcjonalność nadal działa** - użytkownicy mogą ręcznie wprowadzać adresy
2. **Brak mapy** - wyświetli się komunikat o niedostępności Google Maps
3. **Nie wpływa na dodawanie sklepów** - wszystkie inne funkcje działają normalnie

#### Aby włączyć Google Maps:
1. Utwórz projekt w [Google Cloud Console](https://console.cloud.google.com/)
2. Włącz Maps JavaScript API i Geocoding API
3. Utwórz klucz API
4. Dodaj domeny do autoryzacji:
   - `localhost` (dla rozwoju)
   - `https://portal-frontend-ysqz.onrender.com` (dla produkcji)
5. Dodaj klucz do zmiennej `REACT_APP_GOOGLE_MAPS_API_KEY`

### MongoDB Atlas
1. Utwórz darmowe konto na [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Stwórz nowy cluster
3. Dodaj użytkownika z hasłem
4. Skonfiguruj Network Access (0.0.0.0/0 dla rozwoju)
5. Skopiuj connection string do .env

## 👨‍💼 Panel Administracyjny

### Dostęp
- URL: `http://localhost:3000/admin-panel`
- Email: `FF@RRF.PL`
- Hasło: `Admin123!`

### Funkcjonalności
- **Dashboard** - Przegląd systemu
- **Zarządzanie danymi** - CRUD dla wszystkich kolekcji
- **Eksport danych** - JSON, CSV, XML, Excel
- **Statystyki** - Liczby w czasie rzeczywistym

## 📊 Struktura projektu

```
portal/
├── frontend/                 # React aplikacja
│   ├── src/
│   │   ├── components/      # Komponenty React
│   │   ├── pages/          # Strony aplikacji
│   │   ├── contexts/       # Context API
│   │   └── styles/         # Style globalne
│   └── public/             # Pliki statyczne
├── backend/                 # Node.js API
│   ├── controllers/        # Kontrolery
│   ├── models/            # Modele Mongoose
│   ├── routes/            # Endpointy API
│   ├── middleware/        # Middleware
│   ├── modules/           # Moduły systemu
│   └── services/          # Serwisy zewnętrzne
├── scripts/               # Skrypty pomocnicze
└── docs/                  # Dokumentacja
```

## 🔌 API Endpoints

### Autoryzacja
- `POST /api/users/register` - Rejestracja
- `POST /api/users/login` - Logowanie

### Panel Admina
- `GET /api/admin/stats` - Statystyki
- `GET /api/admin/:collection` - Pobieranie danych
- `PUT /api/admin/:collection/:id` - Aktualizacja
- `DELETE /api/admin/:collection/:id` - Usuwanie
- `POST /api/admin/:collection` - Dodawanie
- `POST /api/admin/export` - Eksport

### Lokalizacje
- `GET /api/locations` - Lista lokalizacji
- `POST /api/locations` - Dodaj lokalizację
- `GET /api/locations/search` - Wyszukiwanie

## 🧪 Testy

### Uruchomienie testów
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### GitHub Actions
Projekt używa GitHub Actions do automatycznych testów:
- Testy jednostkowe
- Sprawdzanie jakości kodu
- Budowanie aplikacji

## 🚀 Deployment

### Lokalny development
```bash
npm run dev
```

### Produkcja
```bash
npm run build
npm start
```

### Docker (opcjonalnie)
```bash
docker-compose up -d
```

## 📈 Statystyki

Aktualne statystyki systemu:
- **Użytkownicy:** 6
- **Lokalizacje:** 368,846
- **Sklepy:** 6
- **Produkty:** 8
- **Osiągnięcia:** 5
- **Odznaki:** 6

## 🤝 Współpraca

### Zgłaszanie błędów
Użyj [GitHub Issues](https://github.com/your-username/portal/issues) do zgłaszania błędów.

### Pull Requests
1. Fork repozytorium
2. Stwórz branch dla funkcji
3. Commit zmiany
4. Push do branch
5. Otwórz Pull Request

## 📝 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👨‍💻 Autor

**Twój Nazwisko** - [GitHub](https://github.com/your-username)

## 🙏 Podziękowania

- MongoDB Atlas za darmową bazę danych
- React i Node.js community
- Wszystkim kontrybutorom

---

⭐ **Jeśli projekt Ci się podoba, daj gwiazdkę na GitHub!**

---

## 📝 O projekcie

Ten projekt został przeniesiony z lokalnego repozytorium do GitHub jako **Portal - Modular Community Platform**. Oryginalna nazwa repozytorium "dropshiping_sklep" została zachowana dla kompatybilności.
