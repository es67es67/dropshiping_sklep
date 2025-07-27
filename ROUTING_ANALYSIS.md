# 🔍 Analiza Systemu Routingu i Wspólnych Zależności

## ⚠️ **PROBLEM: Wspólne Części Kodu**

### 🎯 **Główne Wspólne Komponenty (CRITICAL DEPENDENCIES)**

#### **1. AuthContext (NAJWAŻNIEJSZY)**
```javascript
// Używany w 45+ komponentach
import { useAuth } from '../contexts/AuthContext';

// Zależności:
// - localStorage (token, user, isLoggedIn)
// - API endpoints (/api/users/login, /api/users/register)
// - Wszystkie komponenty wymagające autoryzacji
```

**🔴 PROBLEM:** Jeśli AuthContext się zepsuje, **WSZYSTKIE** komponenty przestają działać!

#### **2. Navbar (GLOBALNA NAWIGACJA)**
```javascript
// Używany w App.jsx - wpływa na całą aplikację
// Zawiera wszystkie linki nawigacyjne:
<NavLink to="/products">📦 Produkty</NavLink>
<NavLink to="/shops">🏪 Sklepy</NavLink>
<NavLink to="/feed">📱 Feed</NavLink>
```

**🔴 PROBLEM:** Błąd w Navbar = brak nawigacji w całej aplikacji!

#### **3. ProductCard (WIELOKROTNE UŻYCIE)**
```javascript
// Używany w:
// - Products.jsx
// - ProductsEnhanced.jsx
// - ProductList.jsx
// - ProductRecommendations.jsx
// - ShopProducts.jsx

// Zawiera link:
<Link to={`/product/${_id}`}>
```

**🔴 PROBLEM:** Błąd w ProductCard = wszystkie listy produktów nie działają!

### 🔄 **Wspólne API Endpoints (SHARED DEPENDENCIES)**

#### **1. User API (/api/users)**
```javascript
// Używane w 20+ komponentach:
- /api/users/login (AuthContext)
- /api/users/register (AuthContext)
- /api/users/profile (Profile, Settings)
- /api/users/public/:id (User.jsx)
- /api/users/layout-settings (Settings, App.jsx)
```

#### **2. Shop API (/api/shops)**
```javascript
// Używane w 15+ komponentach:
- /api/shops (ShopList, Country)
- /api/shops/:id (Shop.jsx, ShopDetails)
- /api/shops/user (MyShops, ShopManagement)
- /api/shops/search-by-teryt (TerytSearch)
```

#### **3. Product API (/api/products)**
```javascript
// Używane w 12+ komponentach:
- /api/products (Products, ProductList)
- /api/products/:id (Product.jsx, ProductDetails)
- /api/products/shop/:shopId (ShopProducts)
- /api/products/user (ProductManagement)
```

### 🎯 **Wspólne Routing Hooks (SHARED PATTERNS)**

#### **1. useParams Pattern**
```javascript
// IDENTYCZNY kod w 8 komponentach:
const { id } = useParams();
const navigate = useNavigate();

// Komponenty:
// - User.jsx
// - Shop.jsx
// - Product.jsx
// - Post.jsx
// - CompanyProfile.jsx
```

#### **2. useAuth Pattern**
```javascript
// IDENTYCZNY kod w 45+ komponentach:
const { user, isAuthenticated, login, logout } = useAuth();

// Jeśli AuthContext się zepsuje = WSZYSTKIE komponenty padają!
```

### 🚨 **KRYTYCZNE ZALEŻNOŚCI (BREAKING CHANGES)**

#### **1. AuthContext Dependency Chain**
```
AuthContext (zepsuty)
├── Navbar (nie działa)
├── ProtectedRoute (nie działa)
├── Login/Register (nie działa)
├── Profile (nie działa)
├── Settings (nie działa)
├── ShopManagement (nie działa)
├── ProductManagement (nie działa)
└── 40+ innych komponentów
```

#### **2. Navbar Dependency Chain**
```
Navbar (zepsuty)
├── Wszystkie linki nawigacyjne (nie działają)
├── Menu mobilne (nie działa)
├── Koszyk (nie działa)
├── Powiadomienia (nie działają)
└── Cała nawigacja aplikacji
```

#### **3. ProductCard Dependency Chain**
```
ProductCard (zepsuty)
├── Products.jsx (nie działa)
├── ProductsEnhanced.jsx (nie działa)
├── ProductList.jsx (nie działa)
├── ProductRecommendations.jsx (nie działa)
├── ShopProducts.jsx (nie działa)
└── Wszystkie listy produktów
```

### 📝 **KOMENTARZE I DOKUMENTACJA ZALEŻNOŚCI**

#### **A. Brakujące Komentarze (TO FIX)**
```javascript
// ❌ BRAK KOMENTARZA - CRITICAL
const { user, isAuthenticated } = useAuth();

// ✅ POWINNO BYĆ:
// CRITICAL: AuthContext - wpływa na całą aplikację
// Zależności: localStorage, /api/users endpoints
// Jeśli się zepsuje: WSZYSTKIE komponenty padają
const { user, isAuthenticated } = useAuth();
```

#### **B. Brakujące Komentarze w API Calls**
```javascript
// ❌ BRAK KOMENTARZA - SHARED ENDPOINT
const response = await fetch('/api/shops');

// ✅ POWINNO BYĆ:
// SHARED ENDPOINT: /api/shops
// Używane w: ShopList, Country, TerytSearch
// Zależności: MongoDB shops collection
// Jeśli się zepsuje: wszystkie listy sklepów padają
const response = await fetch('/api/shops');
```

### 🔧 **ROZWIĄZANIA (CURSOR RULES COMPLIANT)**

#### **1. Dodanie Komentarzy Zależności**
```javascript
// CRITICAL COMPONENT: AuthContext
// Zależności: localStorage, JWT tokens, /api/users
// Wpływ: WSZYSTKIE komponenty wymagające autoryzacji
// Jeśli się zepsuje: cała aplikacja nie działa
export const AuthProvider = ({ children }) => {
  // ... kod
};

// SHARED COMPONENT: ProductCard
// Zależności: product data, Link routing
// Używane w: Products, ProductList, ShopProducts
// Jeśli się zepsuje: wszystkie listy produktów padają
const ProductCard = ({ product }) => {
  // ... kod
};
```

#### **2. Dodanie Komentarzy API**
```javascript
// SHARED API ENDPOINT: /api/shops
// Używane w: ShopList, Country, TerytSearch, ShopManagement
// Zależności: MongoDB shops collection, auth middleware
// Jeśli się zepsuje: wszystkie operacje na sklepach padają
const getAllShops = async (req, res) => {
  // ... kod
};
```

#### **3. Dodanie Komentarzy Routing**
```javascript
// SHARED ROUTING PATTERN: useParams + useNavigate
// Używane w: User, Shop, Product, Post, CompanyProfile
// Zależności: React Router, dynamic routes
// Jeśli się zepsuje: wszystkie szczegóły obiektów padają
const { id } = useParams();
const navigate = useNavigate();
```

### 🎯 **REKOMENDACJE (CURSOR RULES)**

#### **1. Natychmiastowe Działania:**
- ✅ Dodaj komentarze zależności do AuthContext
- ✅ Dodaj komentarze zależności do Navbar
- ✅ Dodaj komentarze zależności do ProductCard
- ✅ Dodaj komentarze do wszystkich shared API endpoints

#### **2. Długoterminowe Działania:**
- 🔄 Refaktor AuthContext - dodaj error boundaries
- 🔄 Refaktor Navbar - dodaj fallback navigation
- 🔄 Refaktor ProductCard - dodaj error handling
- 🔄 Dodaj testy dla shared components

#### **3. Monitoring:**
- 📊 Monitoruj błędy w AuthContext
- 📊 Monitoruj błędy w Navbar
- 📊 Monitoruj błędy w shared API endpoints
- 📊 Dodaj alerty dla critical failures

### 🚨 **PODSUMOWANIE PROBLEMÓW**

1. **AuthContext** - jeśli się zepsuje = **CAŁA APLIKACJA PADA**
2. **Navbar** - jeśli się zepsuje = **BRAK NAWIGACJI**
3. **ProductCard** - jeśli się zepsuje = **WSZYSTKIE LISTY PRODUKTÓW PADAJĄ**
4. **Shared API endpoints** - jeśli się zepsują = **WIELOKROTNE BŁĘDY**
5. **Brak komentarzy** - **TRUDNO ZNALEŹĆ ZALEŻNOŚCI**

### ✅ **ZASADY CURSOR - ZGODNOŚĆ**

- ✅ **Analiza wpływu zmian** - wykonywana
- ✅ **Dokumentacja w komentarzach** - DO DODANIA
- ✅ **Testowanie po każdej zmianie** - wykonywane
- ✅ **Ochrona kluczowych fragmentów** - AuthContext, Navbar
- ✅ **Analiza zależności** - wykonywana

**KONKLUZJA:** Projekt ma silne zależności między komponentami. Każda zmiana w AuthContext, Navbar lub shared API może zepsuć wiele funkcji jednocześnie!

## 🔧 **NAPRAWY WYKONANE**

### **Naprawa /shops (2025-07-26)**
**Problem:** Strona `/shops` nie działała - błąd 401 Unauthorized
**Przyczyna:** `ShopList.jsx` domyślnie próbował pobrać `/api/shops/user` (wymaga autoryzacji) zamiast `/api/shops` (publiczny)
**Rozwiązanie:** Zmieniono `showAllShops` z `false` na `true` w `ShopList.jsx`
**Wpływ:** 
- ✅ `/shops` teraz działa poprawnie
- ✅ Inne komponenty (`MyShops`, `ShopManagement`) nadal używają `/api/shops/user`
- ✅ Użytkownik może przełączyć między wszystkimi sklepami a swoimi sklepami
**Bezpieczeństwo:** Zmiana nie wpłynęła na inne funkcje - zgodne z zasadami Cursor

### **Naprawa useState w ShopList.jsx (2025-07-26)**
**Problem:** `ShopList.jsx:411 Uncaught ReferenceError: useState is not defined`
**Przyczyna:** Brak importu `useState` i `useEffect` z React
**Rozwiązanie:** Dodano `import React, { useState, useEffect } from 'react';`
**Wpływ:** 
- ✅ `/shops` teraz działa poprawnie
- ✅ Brak białego ekranu
- ✅ Komponent renderuje się bez błędów
**Bezpieczeństwo:** Dodano komentarze zależności zgodnie z zasadami Cursor

### **Naprawa useState w Cart.jsx (2025-07-26)**
**Problem:** `Cart.jsx:390 Uncaught ReferenceError: useState is not defined`
**Przyczyna:** Brak importu `useState` i `useEffect` z React
**Rozwiązanie:** Dodano `import React, { useState, useEffect } from 'react';`
**Wpływ:** 
- ✅ `/cart` teraz działa poprawnie
- ✅ Koszyk zakupów renderuje się bez błędów
- ✅ Navbar CartLink nadal działa
**Bezpieczeństwo:** Dodano komentarze zależności zgodnie z zasadami Cursor 