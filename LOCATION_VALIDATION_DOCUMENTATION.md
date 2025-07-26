# Dokumentacja Walidacji Lokalizacji

## Przegląd

System lokalizacji implementuje **kompleksową walidację wszystkich pól** z plików CSV GUS (TERC, SIMC, ULIC). Wszystkie pola są sprawdzane i zapisywane do bazy danych, nawet jeśli są puste.

## Pola CSV ULIC

### Struktura pliku CSV
```
WOJ;POW;GMI;RODZ_GMI;SYM;SYM_UL;CECHA;NAZWA_1;NAZWA_2;STAN_NA
```

### Wszystkie pola są zapisywane do bazy:

| Pole CSV | Pole w bazie | Typ | Wymagane | Opis |
|----------|--------------|-----|----------|------|
| `WOJ` | `woj` | String(2) | ✅ | Kod województwa |
| `POW` | `pow` | String(4) | ✅ | Kod powiatu |
| `GMI` | `gmi` | String(6) | ✅ | Kod gminy |
| `RODZ_GMI` | `rodzGmi` | String | ❌ | Rodzaj gminy |
| `SYM` | `sym` | String(7) | ✅ | Kod SIMC miejscowości |
| `SYM_UL` | `symUlic` | String(7) | ✅ | Kod ULIC |
| `CECHA` | `cecha` | String | ❌ | Cecha (ul., pl., al., itp.) |
| `NAZWA_1` | `nazwa1` | String | ✅ | Pierwsza część nazwy |
| `NAZWA_2` | `nazwa2` | String | ❌ | Druga część nazwy |
| `STAN_NA` | `stanNa` | String | ❌ | Data stanu na |

## Walidacja

### 1. Pola Wymagane
- **NAZWA_1** - nie może być puste
- **WOJ** - kod województwa (2 cyfry)
- **POW** - kod powiatu (2 cyfry)
- **GMI** - kod gminy (2 cyfry)
- **SYM** - kod SIMC (7 cyfr)
- **SYM_UL** - kod ULIC (7 cyfr)

### 2. Pola Opcjonalne (ale sprawdzane)
- **NAZWA_2** - może być puste, ale jeśli istnieje to musi być string
- **CECHA** - może być puste, ale jeśli istnieje to musi być string
- **RODZ_GMI** - może być puste, ale jeśli istnieje to musi być string
- **STAN_NA** - może być puste, ale jeśli istnieje to musi być string

### 3. Format Kodów
- **WOJ**: `^\d{2}$` (dokładnie 2 cyfry)
- **POW**: `^\d{2}$` (dokładnie 2 cyfry)
- **GMI**: `^\d{2}$` (dokładnie 2 cyfry)
- **SYM**: `^\d{7}$` (dokładnie 7 cyfr)
- **SYM_UL**: `^\d{7}$` (dokładnie 7 cyfr)

## Obsługa Duplikatów

### Indeksy w bazie danych:
1. **Unikalny kod ULIC**: `{ symUlic: 1 }`
2. **Unikalna kombinacja nazwy i miejscowości**: `{ name: 1, simcCode: 1 }`
3. **Unikalna kombinacja wszystkich pól nazwy**: `{ symUlic: 1, nazwa1: 1, nazwa2: 1, cecha: 1 }`

### Metody sprawdzania duplikatów:
```javascript
// Sprawdź duplikat na podstawie nazwy i miejscowości
Ulic.findDuplicate(name, simcCode)

// Sprawdź duplikat na podstawie wszystkich pól nazwy
Ulic.findDuplicateByNameFields(nazwa1, nazwa2, cecha, symUlic)

// Sprawdź duplikat na podstawie kodu ULIC
Ulic.findDuplicateByCode(symUlic)
```

## Przykłady

### Przykład 1: Ulica z pełną nazwą
```csv
02;01;01;gmina miejska;0934084;0934085;pl.;Rynek;Główny;2023-01-01
```
**W bazie:**
- `nazwa1`: "Rynek"
- `nazwa2`: "Główny"
- `cecha`: "pl."
- `name`: "pl. Rynek Główny"
- `type`: "plac"

### Przykład 2: Ulica z pustą NAZWA_2
```csv
02;01;01;gmina miejska;0934084;0934084;ul.;Mickiewicza;;2023-01-01
```
**W bazie:**
- `nazwa1`: "Mickiewicza"
- `nazwa2`: "" (puste pole)
- `cecha`: "ul."
- `name`: "ul. Mickiewicza"
- `type`: "ulica"

### Przykład 3: Ulica bez cechy
```csv
02;01;01;gmina miejska;0934084;0934086;;Dworcowa;Zachodnia;2023-01-01
```
**W bazie:**
- `nazwa1`: "Dworcowa"
- `nazwa2`: "Zachodnia"
- `cecha`: "" (puste pole)
- `name`: "Dworcowa Zachodnia"
- `type`: "ulica"

## Błędy Walidacji

System loguje wszystkie błędy walidacji:
```
⚠️  Pominięto rekord ULIC - błędy walidacji: Brak nazwy głównej (NAZWA_1), Nieprawidłowy kod województwa (WOJ)
```

## Funkcje Walidacji

### W `importGusData.js`:
- `processTercRow()` - walidacja TERC
- `processSimcRow()` - walidacja SIMC
- `processUlicRow()` - walidacja ULIC

### W `exportRoutes.js`:
- `mapTercDataToSeparate()` - mapowanie i walidacja TERC
- `mapSimcDataToSeparate()` - mapowanie i walidacja SIMC
- `mapUlicDataToSeparate()` - mapowanie i walidacja ULIC
- `isTercComplete()` - sprawdzenie kompletności TERC
- `isSimcComplete()` - sprawdzenie kompletności SIMC
- `isUlicComplete()` - sprawdzenie kompletności ULIC

## Testowanie

Uruchom skrypt testowy:
```bash
node backend/scripts/testLocationValidation.js
```

## Podsumowanie

✅ **Wszystkie pola z CSV są zapisywane do bazy**  
✅ **Puste pola (NAZWA_2, CECHA) są obsługiwane**  
✅ **Kompleksowa walidacja formatu kodów**  
✅ **Sprawdzanie duplikatów na wielu poziomach**  
✅ **Szczegółowe logowanie błędów walidacji** 