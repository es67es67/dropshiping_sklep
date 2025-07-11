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
- **Google Maps API** - dodana obsługa błędów i fallback gdy API nie jest dostępne
- **Wyświetlanie sklepów** - ShopList teraz pobiera rzeczywiste dane z API zamiast symulowanych
- **Menu użytkownika** - zakładka "Moje sklepy" pojawia się po dodaniu pierwszego sklepu
- **Aktualizacja danych użytkownika** - po dodaniu sklepu dane użytkownika są automatycznie aktualizowane
- **Odświeżanie listy sklepów** - lista automatycznie się odświeża po powrocie na stronę

### 🆕 Dodane
- **Zakładka "Produkty"** w szczegółach sklepu (`/shop/:shopId`)
- **Modal dodawania/edycji produktów** z pełnym formularzem
- **Zarządzanie produktami w sklepach** - możliwość dodawania, edycji i usuwania produktów
- **Styled components** dla zakładek w `ShopDetails`
- **Obsługa błędów Google Maps** - aplikacja działa nawet gdy Google Maps API nie jest dostępne
- **Fallback dla map** - użytkownicy mogą ręcznie wprowadzać adresy
- **Integracja z rzeczywistym API** - wszystkie komponenty używają danych z backendu
- **Automatyczna aktualizacja menu** - menu użytkownika aktualizuje się po dodaniu sklepu
- **Backend aktualizacja** - po dodaniu sklepu backend automatycznie aktualizuje dane użytkownika

### 🔧 Techniczne zmiany
- **ShopList.jsx** - usunięto symulowane dane, dodano pobieranie z API
- **ShopCreate.jsx** - dodano aktualizację danych użytkownika po dodaniu sklepu
- **MapSelector.jsx** - dodano obsługę błędów Google Maps API
- **shopController.js** - dodano aktualizację danych użytkownika po utworzeniu sklepu
- **Navbar.jsx** - poprawiono logikę wyświetlania zakładki "Moje sklepy"