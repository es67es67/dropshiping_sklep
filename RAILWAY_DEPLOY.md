# 🚀 Deploy na Railway - Instrukcja krok po kroku

## 📋 Wymagania
- Konto na [Railway.app](https://railway.app)
- Konto na [MongoDB Atlas](https://mongodb.com/atlas) (jeśli nie masz)
- GitHub z Twoim projektem

## 🔧 Krok 1: Przygotowanie MongoDB Atlas

### Jeśli masz już MongoDB Atlas:
1. Przejdź do [MongoDB Atlas](https://cloud.mongodb.com)
2. Skopiuj connection string z Twojej bazy danych
3. Przejdź do kroku 2

### Jeśli nie masz MongoDB Atlas:
1. Przejdź do [MongoDB Atlas](https://cloud.mongodb.com)
2. Utwórz darmowe konto
3. Utwórz nowy cluster (darmowy plan)
4. Utwórz użytkownika bazy danych
5. Dodaj swój IP do whitelist (lub 0.0.0.0/0 dla wszystkich)
6. Skopiuj connection string

## 🚂 Krok 2: Deploy Backend na Railway

### 2.1 Utwórz projekt na Railway
1. Przejdź do [Railway.app](https://railway.app)
2. Kliknij "Start a New Project"
3. Wybierz "Deploy from GitHub repo"
4. Wybierz swój repo: `es67es67/dropshiping_sklep`

### 2.2 Skonfiguruj Backend
1. Railway automatycznie wykryje backend (folder `backend`)
2. Kliknij "Deploy Now"
3. Poczekaj na zakończenie builda

### 2.3 Dodaj zmienne środowiskowe
1. W projekcie Railway, przejdź do zakładki "Variables"
2. Dodaj następujące zmienne:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=twój_connection_string_z_mongodb_atlas
JWT_SECRET=twój_tajny_klucz_jwt
CORS_ORIGIN=https://twoja-domena-frontend.railway.app
```

### 2.4 Sprawdź URL backendu
1. W zakładce "Settings" znajdź URL Twojego backendu
2. Zapisz go - będzie potrzebny dla frontendu
3. Przetestuj: `https://twoja-domena-backend.railway.app/api/health`

## 🌐 Krok 3: Deploy Frontend na Railway

### 3.1 Utwórz nowy serwis dla frontendu
1. W tym samym projekcie Railway kliknij "New Service"
2. Wybierz "GitHub Repo"
3. Wybierz ten sam repo: `es67es67/dropshiping_sklep`
4. W ustawieniach:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npx serve -s build -l 3000`

### 3.2 Dodaj zmienne środowiskowe dla frontendu
1. W serwisie frontendu, przejdź do "Variables"
2. Dodaj:

```
REACT_APP_API_URL=https://twoja-domena-backend.railway.app
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
```

### 3.3 Deploy frontendu
1. Kliknij "Deploy Now"
2. Poczekaj na zakończenie builda

## 🔗 Krok 4: Połączenie serwisów

### 4.1 Zaktualizuj CORS w backendzie
1. W backendzie, zaktualizuj zmienną `CORS_ORIGIN`:
```
CORS_ORIGIN=https://twoja-domena-frontend.railway.app
```

### 4.2 Sprawdź połączenie
1. Otwórz frontend w przeglądarce
2. Sprawdź czy API działa (np. rejestracja, logowanie)
3. Sprawdź logi w Railway jeśli są błędy

## 🎯 Krok 5: Custom domeny (opcjonalnie)

### 5.1 Dodaj custom domenę
1. W Railway, przejdź do "Settings"
2. Kliknij "Custom Domains"
3. Dodaj swoją domenę
4. Skonfiguruj DNS zgodnie z instrukcjami Railway

## 🔍 Krok 6: Monitoring i logi

### 6.1 Sprawdź logi
1. W Railway, przejdź do zakładki "Deployments"
2. Kliknij na deployment aby zobaczyć logi
3. Sprawdź czy nie ma błędów

### 6.2 Monitoring
1. Railway automatycznie monitoruje zdrowie aplikacji
2. Sprawdź zakładkę "Metrics" aby zobaczyć użycie zasobów

## 🚨 Rozwiązywanie problemów

### Problem: Backend nie startuje
- Sprawdź logi w Railway
- Upewnij się, że `MONGODB_URI` jest poprawny
- Sprawdź czy `JWT_SECRET` jest ustawiony

### Problem: Frontend nie łączy się z backendem
- Sprawdź czy `REACT_APP_API_URL` wskazuje na poprawny URL backendu
- Sprawdź czy CORS jest skonfigurowany poprawnie
- Sprawdź logi backendu

### Problem: Błędy builda
- Sprawdź czy wszystkie zależności są w `package.json`
- Sprawdź logi builda w Railway
- Upewnij się, że Node.js version jest kompatybilny

## ✅ Gotowe!

Twoja aplikacja powinna być teraz dostępna na:
- **Frontend:** `https://twoja-domena-frontend.railway.app`
- **Backend:** `https://twoja-domena-backend.railway.app`

## 📞 Wsparcie

Jeśli masz problemy:
1. Sprawdź logi w Railway
2. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
3. Upewnij się, że MongoDB Atlas jest dostępny
4. Sprawdź czy CORS jest skonfigurowany poprawnie 