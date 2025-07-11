# 🗺️ Mapa Serwisu - Portal

Dokumentacja struktury plików i katalogów projektu. Pozwala szybko zorientować się, za co odpowiadają poszczególne pliki i foldery.

---

## 📁 Struktura katalogów

```
portal/
├── frontend/                 # React aplikacja (UI)
│   ├── src/
│   │   ├── components/      # Komponenty UI (np. Navbar, LayoutCustomization)
│   │   ├── pages/           # Strony (np. Home, Login, Register)
│   │   ├── contexts/        # Context API (np. AuthContext)
│   │   └── styles/          # Style globalne (styled-components)
│   └── public/              # Pliki statyczne (favicon, index.html)
├── backend/                 # Node.js API (Express)
│   ├── controllers/         # Logika endpointów (np. userController.js)
│   ├── models/              # Modele Mongoose (np. User.js)
│   ├── routes/              # Definicje endpointów (np. userRoutes.js)
│   ├── middleware/          # Middleware (np. authMiddleware.js)
│   ├── modules/             # Moduły systemu (np. gamification)
│   └── services/            # Integracje zewnętrzne
├── scripts/                 # Skrypty pomocnicze (np. migracje)
├── docs/                    # Dokumentacja
├── MAPA_SERWISU.md          # Ten plik - mapa serwisu
└── ...
```

---

## 📦 Najważniejsze pliki i foldery

### FRONTEND (`frontend/`)
- **src/App.js** – Główny plik aplikacji React, routing, ThemeProvider, wybór layoutu i motywu
- **src/components/** – Komponenty UI:
  - **Navbar.jsx** – Pasek nawigacji, menu profilu
  - **LayoutCustomization.jsx** – Panel zmiany wyglądu (layout, motyw, kolory)
  - **Profile.jsx** – Profil użytkownika
  - **ShopCreate.jsx, ShopManagement.jsx** – Tworzenie i zarządzanie sklepami
  - **ProductList.jsx, ProductCreate.jsx, ProductManagement.jsx** – Produkty
- **src/pages/** – Strony aplikacji:
  - **Home.jsx** – Strona główna
  - **Login.jsx, Register.jsx** – Logowanie i rejestracja
  - **AdminPanel.jsx** – Panel administracyjny
- **src/contexts/AuthContext.jsx** – Zarządzanie autoryzacją, logowaniem, tokenem
- **src/styles/GlobalStyles.js** – Style globalne, definicje motywów (light/dark)
- **src/setupProxy.js** – Proxy do backendu podczas developmentu

### BACKEND (`backend/`)
- **server.js** – Główny plik serwera Express, konfiguracja CORS, socket.io, rejestracja tras
- **controllers/** – Logika endpointów:
  - **userController.js** – Rejestracja, logowanie, ustawienia użytkownika, layout, motyw
  - **shopController.js, productController.js** – Sklepy, produkty
- **routes/** – Definicje endpointów:
  - **userRoutes.js** – `/api/users` (logowanie, rejestracja, ustawienia)
  - **shopRoutes.js, productRoutes.js** – `/api/shops`, `/api/products`
- **models/** – Modele bazy danych (User.js, Shop.js, Product.js)
- **middleware/authMiddleware.js** – Middleware autoryzacji JWT
- **modules/** – Moduły dodatkowe (np. gamification, messaging)

### INNE
- **render.yaml** – Konfiguracja deployu na Render (zmienne środowiskowe, build)
- **DEPLOY.md** – Instrukcje deployu, debugowania, uruchamiania
- **README.md** – Główna dokumentacja projektu

---

## 🔎 Szybka nawigacja po funkcjach

- **Zmiana wyglądu:**
  - Frontend: `src/components/LayoutCustomization.jsx`, `src/App.js`
  - Backend: `controllers/userController.js` (saveLayoutSettings, getLayoutSettings)
- **Logowanie:**
  - Frontend: `src/pages/Login.jsx`, `src/contexts/AuthContext.jsx`
  - Backend: `controllers/userController.js` (login), `routes/userRoutes.js`
- **Panel admina:**
  - Frontend: `src/pages/AdminPanel.jsx`, `src/components/Navbar.jsx`
- **Google Maps:**
  - Frontend: `src/components/MapSelector.jsx`

---

## 📝 Jak korzystać?
- Szukasz funkcji? Sprawdź sekcję „Szybka nawigacja po funkcjach”
- Chcesz zmienić wygląd? Edytuj `LayoutCustomization.jsx` i motywy w `App.js`/`GlobalStyles.js`
- Chcesz dodać endpoint? Dodaj trasę w `routes/`, logikę w `controllers/`, model w `models/`

---

**Aktualizuj ten plik po każdej większej zmianie w strukturze!** 

---

## 🗂️ Schemat blokowy serwisu (Mermaid) - ROZBUDOWANY

```mermaid
graph TD
  Frontend["Frontend (React)"]
  Backend["Backend (Express)"]
  DB["MongoDB"]
  External["Integracje zewnętrzne"]

  Frontend -->|API| Backend
  Backend -->|Mongoose| DB
  Backend -->|HTTP/API| External

  subgraph Frontend
    App[App.js]
    Auth[AuthContext.jsx]
    Login[Login.jsx]
    Register[Register.jsx]
    Layout[LayoutCustomization.jsx]
    Navbar[Navbar.jsx]
    Profile[Profile.jsx]
    AdminPanel[AdminPanel.jsx]
    ShopCreate[ShopCreate.jsx]
    ShopManagement[ShopManagement.jsx]
    ProductList[ProductList.jsx]
    ProductCreate[ProductCreate.jsx]
    ProductManagement[ProductManagement.jsx]
    MapSelector[MapSelector.jsx]
    LocationSearch[LocationSearch.jsx]
    LocationDetails[LocationDetails.jsx]
    LocationAnalytics[LocationAnalytics.jsx]
    LocationImport[LocationImport.jsx]
    LocationExport[LocationExport.jsx]
    Voivodeships[Voivodeships.jsx]
    Counties[Counties.jsx]
    Municipalities[Municipalities.jsx]
    MessagingSystem[MessagingSystem.jsx]
    PaymentSystem[PaymentSystem.jsx]
    GamificationPanel[GamificationPanel.jsx]
    Notifications[Notifications.jsx]
    Settings[Settings.jsx]
    Search[Search.jsx]
    DataManager[DataManager.jsx]
    DataExport[DataExport.jsx]
  end

  subgraph Backend
    Server[server.js]
    
    %% Kontrolery
    UserCtrl[userController.js]
    ShopCtrl[shopController.js]
    ProductCtrl[productController.js]
    MessageCtrl[messageController.js]
    ReviewCtrl[reviewController.js]
    NotificationCtrl[notificationController.js]
    PostCtrl[postController.js]
    LocationCtrl[locationController.js]
    ExportCtrl[exportController.js]
    AdminCtrl[adminController.js]
    GroupCtrl[groupController.js]
    
    %% Trasy
    UserRoutes[userRoutes.js]
    ShopRoutes[shopRoutes.js]
    ProductRoutes[productRoutes.js]
    MessageRoutes[messageRoutes.js]
    ReviewRoutes[reviewRoutes.js]
    NotificationRoutes[notificationRoutes.js]
    PostRoutes[postRoutes.js]
    LocationRoutes[locationRoutes.js]
    ExportRoutes[exportRoutes.js]
    AdminRoutes[adminRoutes.js]
    GroupRoutes[groupRoutes.js]
    
    %% Modele
    UserModel[User.js]
    ShopModel[Shop.js]
    ProductModel[Product.js]
    MessageModel[Message.js]
    ReviewModel[Review.js]
    NotificationModel[Notification.js]
    PostModel[Post.js]
    LocationModel[Location.js]
    GroupModel[Group.js]
    
    %% Middleware
    AuthMW[authMiddleware.js]
    
    %% Moduły
    subgraph Modules
      Gamification[gamification/]
      Messaging[messaging/]
      Payments[payments/]
      LocationModule[location/]
    end
  end

  subgraph External
    GoogleMaps[Google Maps API]
    GUS[GUS API]
    Email[SMTP]
    PaymentGateway[Payment Gateway]
  end

  %% PRZEPŁYW LOGOWANIA I AUTORYZACJI
  Login --> Auth
  Register --> Auth
  Auth -->|/api/users/login, /api/users/register| UserRoutes
  UserRoutes --> UserCtrl
  UserCtrl --> UserModel
  UserCtrl --> AuthMW

  %% PRZEPŁYW ZMIANY WYGLĄDU
  Layout -->|/api/users/layout-settings| UserRoutes
  UserRoutes --> UserCtrl
  UserCtrl --> UserModel

  %% PANEL ADMINA
  AdminPanel --> Auth
  AdminPanel -->|/api/admin/*| AdminRoutes
  AdminRoutes --> AdminCtrl
  AdminCtrl --> UserModel
  AdminCtrl --> ShopModel
  AdminCtrl --> ProductModel
  AdminCtrl --> LocationModel

  %% SKLEPY
  ShopCreate -->|/api/shops| ShopRoutes
  ShopManagement -->|/api/shops| ShopRoutes
  ShopRoutes --> ShopCtrl
  ShopCtrl --> ShopModel
  ShopCtrl --> AuthMW

  %% PRODUKTY
  ProductList -->|/api/products| ProductRoutes
  ProductCreate -->|/api/products| ProductRoutes
  ProductManagement -->|/api/products| ProductRoutes
  ProductRoutes --> ProductCtrl
  ProductCtrl --> ProductModel
  ProductCtrl --> AuthMW

  %% LOKALIZACJE
  LocationSearch -->|/api/locations/search| LocationRoutes
  LocationDetails -->|/api/locations/*| LocationRoutes
  LocationAnalytics -->|/api/locations/analytics| LocationRoutes
  LocationImport -->|/api/locations/import| LocationRoutes
  LocationExport -->|/api/locations/export| LocationRoutes
  Voivodeships -->|/api/locations/voivodeships| LocationRoutes
  Counties -->|/api/locations/counties| LocationRoutes
  Municipalities -->|/api/locations/municipalities| LocationRoutes
  LocationRoutes --> LocationCtrl
  LocationCtrl --> LocationModel
  LocationCtrl --> GUS

  %% GOOGLE MAPS
  MapSelector --> App
  LocationCtrl --> GoogleMaps

  %% WIADOMOŚCI
  MessagingSystem -->|/api/messages/*| MessageRoutes
  MessageRoutes --> MessageCtrl
  MessageCtrl --> MessageModel
  MessageCtrl --> AuthMW

  %% PŁATNOŚCI
  PaymentSystem -->|/api/payments/*| Payments
  Payments --> PaymentGateway

  %% GAMIFIKACJA
  GamificationPanel -->|/api/gamification/*| Gamification
  Gamification --> UserModel

  %% POWIADOMIENIA
  Notifications -->|/api/notifications/*| NotificationRoutes
  NotificationRoutes --> NotificationCtrl
  NotificationCtrl --> NotificationModel
  NotificationCtrl --> Email

  %% POSTY I GRUPY
  PostCtrl --> PostModel
  GroupCtrl --> GroupModel
  PostCtrl --> AuthMW
  GroupCtrl --> AuthMW

  %% RECENZJE
  ReviewCtrl --> ReviewModel
  ReviewCtrl --> AuthMW

  %% EKSPORT DANYCH
  DataExport -->|/api/export/*| ExportRoutes
  ExportRoutes --> ExportCtrl
  ExportCtrl --> UserModel
  ExportCtrl --> ShopModel
  ExportCtrl --> ProductModel

  %% ZARZĄDZANIE DANYMI
  DataManager -->|/api/admin/data/*| AdminRoutes

  %% PROFIL I USTAWIENIA
  Profile --> Auth
  Profile -->|/api/users/profile| UserRoutes
  Settings -->|/api/users/settings| UserRoutes

  %% WYSZUKIWANIE
  Search -->|/api/search| UserRoutes

  %% POŁĄCZENIE Z SERWEREM
  Server --> UserRoutes
  Server --> ShopRoutes
  Server --> ProductRoutes
  Server --> MessageRoutes
  Server --> LocationRoutes
  Server --> NotificationRoutes
  Server --> PostRoutes
  Server --> GroupRoutes
  Server --> ReviewRoutes
  Server --> ExportRoutes
  Server --> AdminRoutes
  Server --> Gamification
  Server --> Messaging
  Server --> Payments
  Server --> LocationModule

  %% SOCKET.IO
  Server -->|WebSocket| MessagingSystem
  Server -->|WebSocket| Notifications
  Server -->|WebSocket| GamificationPanel
```

---

## 🔄 Szczegółowe przepływy funkcji

### 1. **Logowanie i rejestracja**
```
Login.jsx → AuthContext.jsx → /api/users/login → userController.js → User.js (MongoDB)
Register.jsx → AuthContext.jsx → /api/users/register → userController.js → User.js (MongoDB)
```

### 2. **Zmiana wyglądu**
```
LayoutCustomization.jsx → /api/users/layout-settings → userController.js → User.js → App.js (re-render)
```

### 3. **Panel administracyjny**
```
AdminPanel.jsx → /api/admin/* → adminController.js → wszystkie modele → DataManager.jsx
```

### 4. **Lokalizacje i mapy**
```
LocationSearch.jsx → /api/locations/search → locationController.js → Location.js + GUS API
MapSelector.jsx → Google Maps API → locationController.js
```

### 5. **Komunikacja**
```
MessagingSystem.jsx → /api/messages/* → messageController.js → Message.js + Socket.IO
```

### 6. **Gamifikacja**
```
GamificationPanel.jsx → /api/gamification/* → gamification module → User.js (punkty, odznaki)
```

### 7. **Płatności**
```
PaymentSystem.jsx → payments module → Payment Gateway → Order.js
```

### 8. **Powiadomienia**
```
Notifications.jsx → /api/notifications/* → notificationController.js → Notification.js + SMTP
```

---

**Jak czytać diagram?**
- **Strzałki** = przepływ danych i zależności
- **Bloki** = pliki i komponenty
- **API** = komunikacja HTTP
- **WebSocket** = komunikacja real-time
- **External** = integracje zewnętrzne (Google Maps, GUS, SMTP, płatności)

---

**Możesz ten diagram wkleić do edytora obsługującego Mermaid i zobaczyć pełną architekturę serwisu!** 

---

## 🔄 **Aktualizacje na bieżąco**

### **Automatyczne aktualizacje dokumentacji:**
- **MAPA_SERWISU.md** - Aktualizowany po każdej zmianie struktury plików
- **SCHEMAT_PRACY.md** - Aktualizowany po zmianach w procesach zespołu
- **README.md** - Aktualizowany po dodaniu nowych funkcjonalności

### **Workflow aktualizacji:**
```
Zmiana kodu → Testy → Code Review → Merge → Aktualizacja dokumentacji → Deploy
```

### **Monitoring zmian:**
- **Git hooks** - Automatyczne sprawdzanie dokumentacji
- **CI/CD** - Weryfikacja aktualności dokumentacji
- **Regularne audyty** - Miesięczne sprawdzanie aktualności

---

## 📋 **Status aktualizacji**

### **Ostatnie aktualizacje:**
- ✅ **MAPA_SERWISU.md** - Rozbudowany schemat blokowy (2024-07-11)
- ✅ **SCHEMAT_PRACY.md** - Utworzony schemat pracy zespołu (2024-07-11)
- ✅ **Backend CORS** - Naprawiona konfiguracja CORS (2024-07-11)
- ✅ **Layout Customization** - Naprawiona zmiana wyglądu (2024-07-11)
- ✅ **Testy e2e** - Implementacja Cypress + GitHub Actions (2024-07-11)

### **Planowane aktualizacje:**
- [ ] **Monitoring** - System metryk i alertów
- [ ] **Security audit** - Regularne audyty bezpieczeństwa
- [ ] **Performance optimization** - Optymalizacja wydajności
- [ ] **Mobile testing** - Testy na urządzeniach mobilnych

---

## 🎯 **Symulacja zespołu AI - Status**

### **Aktywne role:**
- **🧑‍💻 Programiści** - Rozwój funkcjonalności, bugfixy
- **🧪 QA/Testerzy** - Przygotowanie testów e2e
- **🔒 Security** - Audyt CORS, autoryzacji
- **🎨 UX/UI** - Analiza zmiany wyglądu
- **📈 Marketing** - Monitoring metryk
- **🧠 Psycholog** - Analiza UX flow

### **Codzienne działania:**
- Uruchamianie testów automatycznych
- Code review i analiza bezpieczeństwa
- Monitoring performance i błędów
- Aktualizacja dokumentacji

---

**Aktualizuj ten plik po każdej większej zmianie w strukturze!** 