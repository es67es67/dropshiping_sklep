# Changelog

Wszystkie istotne zmiany w projekcie będą dokumentowane w tym pliku.

Format jest oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/lang/pl/).

## [1.2.0] - 2025-01-11

### ✅ Naprawione
- **Przycisk "Dodaj sklep"** na liście sklepów - teraz poprawnie przekierowuje do `/shop-create`
- **Przycisk "Dodaj produkt"** na liście produktów - poprawnie przekierowuje do `/product-create`
- **Przekazywanie motywu** do komponentów `ShopDetails` i `ShopProducts`
- **Routing** w `App.js` - dodane przekazywanie `theme` prop do `ShopDetails`

### 🆕 Dodane
- **Zakładka "Produkty"** w szczegółach sklepu (`/shop/:shopId`)
- **Modal dodawania/edycji produktów** z pełnym formularzem
- **Zarządzanie produktami w sklepach** - możliwość dodawania, edycji i usuwania produktów
- **Styled components** dla zakładek w `ShopDetails`

### 🔧 Zmienione
- Komponent `ShopList` - `AddButton` zmieniony z `button` na `styled(Link)`
- Komponent `ProductList` - `AddButton` zmieniony z `button` na `styled(Link)`
- Komponent `ShopDetails` - dodane zakładki i integracja z `ShopProducts`
- Routing w `App.js` - wszystkie trzy layouty zaktualizowane

### 📁 Pliki zmienione
- `frontend/src/components/ShopList.jsx`
- `frontend/src/components/ProductList.jsx`
- `frontend/src/components/ShopDetails.jsx`
- `frontend/src/App.js`
- `README.md` (dodana dokumentacja zmian)

## [1.1.0] - 2025-01-10

### 🆕 Dodane
- Podstawowa funkcjonalność sklepów
- Panel zarządzania produktami
- System autoryzacji użytkowników

### 🔧 Zmienione
- Struktura projektu
- Routing aplikacji

## [1.0.0] - 2025-01-09

### 🆕 Dodane
- Inicjalna wersja aplikacji
- Podstawowe komponenty React
- Backend API
- Integracja z MongoDB 