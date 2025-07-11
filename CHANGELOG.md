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

### 🆕 Dodane
- **Zakładka "Produkty"** w szczegółach sklepu (`/shop/:shopId`)
- **Modal dodawania/edycji produktów** z pełnym formularzem
- **Zarządzanie produktami w sklepach** - możliwość dodawania, edycji i usuwania produktów
- **Styled components** dla zakładek w `ShopDetails`
- **Obsługa błędów Google Maps** - aplikacja działa nawet gdy Google Maps API nie jest dostępne
- **Fallback dla mapy** - użytkownicy mogą ręcznie wprowadzać adresy gdy mapa nie działa

### 🔧 Zmienione
- Komponent `