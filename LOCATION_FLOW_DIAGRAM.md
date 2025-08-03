# 🔄 SCHEMAT BLOKOWY - PRZEPŁYW DANYCH LOKALIZACJI

## 📍 **JAK LOKALIZACJA UŻYTKOWNIKA JEST POBIERANA I JAK PRODUKTY SĄ SORTOWANE**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🏠 STRONA MARKETPLACE                              │
│                    http://localhost:3000/market                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔐 UŻYTKOWNIK ZALOGOWANY                               │
│              Token JWT w localStorage / AuthContext                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📊 POBRANIE PROFILU UŻYTKOWNIKA                       │
│                    GET /api/users/profile                                 │
│                    Headers: Authorization: Bearer {token}                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🗄️ KOLEKCJA: users                                    │
│                    MongoDB Atlas                                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    📋 STRUKTURA UŻYTKOWNIKA                      │   │
│  │                                                                   │   │
│  │  {                                                               │   │
│  │    _id: ObjectId,                                                │   │
│  │    username: "aaaaaaaaaaaaa",                                    │   │
│  │    email: "aaaaaaaaaaaaa@example.com",                          │   │
│  │    teryt: {                                                      │   │
│  │      voivodeshipCode: "16",        ← Województwo (Opolskie)     │   │
│  │      countyCode: "2401",           ← Powiat (namysłówski)       │   │
│  │      municipalityCode: "240104",   ← Gmina (Namysłów)           │   │
│  │      tercCode: "240104",           ← Kod TERC                   │   │
│  │      simcCode: "0212506",          ← Kod SIMC (Namysłów)        │   │
│  │      ulicCode: "",                 ← Kod ulicy (puste)          │   │
│  │      fullCode: "162401240104"      ← Pełny kod TERYT            │   │
│  │    },                                                             │   │
│  │    address: {                                                     │   │
│  │      street: "ul. Rynek",         ← Ulica                       │   │
│  │      houseNumber: "1",             ← Numer domu                  │   │
│  │      postalCode: "46-100",         ← Kod pocztowy               │   │
│  │      city: "Namysłów"              ← Miasto                     │   │
│  │    }                                                              │   │
│  │  }                                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🎯 LOKALIZACJA UŻYTKOWNIKA ZIDENTYFIKOWANA            │
│                    Namysłów, Opolskie (kod: 162401240104)                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🛍️ POBRANIE PRODUKTÓW Z GIEŁDY                      │
│                    GET /api/marketplace                                  │
│                    Headers: Authorization: Bearer {token}                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🗄️ KOLEKCJA: marketplaceproducts                     │
│                    MongoDB Atlas                                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    📋 STRUKTURA PRODUKTU                          │   │
│  │                                                                   │   │
│  │  {                                                               │   │
│  │    _id: ObjectId,                                                │   │
│  │    name: "Rower górski Trek Marlin 5",                          │   │
│  │    price: 800,                                                   │   │
│  │    category: "Sport",                                            │   │
│  │    saleType: "auction",                                          │   │
│  │    seller: ObjectId,                                             │   │
│  │    location: {                                                   │   │
│  │      voivodeship: "Opolskie",    ← Województwo                   │   │
│  │      county: "namysłówski",      ← Powiat                        │   │
│  │      municipality: "Namysłów",   ← Gmina                         │   │
│  │      city: "Namysłów",           ← Miasto                        │   │
│  │      terytCode: "162401240104"   ← Kod TERYT                    │   │
│  │    },                                                            │   │
│  │    auction: {                                                    │   │
│  │      startPrice: 600,                                            │   │
│  │      currentPrice: 600,                                          │   │
│  │      endDate: Date,                                              │   │
│  │      bids: []                                                    │   │
│  │    }                                                             │   │
│  │  }                                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔍 FILTROWANIE I SORTOWANIE PRODUKTÓW                │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    📊 ALGORYTM SORTOWANIA                         │   │
│  │                                                                   │   │
│  │  1. 🎯 PRODUKTY Z TEJ SAMEJ LOKALIZACJI                          │   │
│  │     - city === "Namysłów"                                        │   │
│  │     - terytCode === "162401240104"                               │   │
│  │     - Priorytet: NAJWYŻSZY                                       │   │
│  │                                                                   │   │
│  │  2. 🏘️ PRODUKTY Z TEJ SAMEJ GMINY                               │   │
│  │     - municipality === "Namysłów"                                │   │
│  │     - Priorytet: WYSOKI                                          │   │
│  │                                                                   │   │
│  │  3. 🗺️ PRODUKTY Z TEJ SAMEJ POWIATU                             │   │
│  │     - county === "namysłówski"                                   │   │
│  │     - Priorytet: ŚREDNI                                          │   │
│  │                                                                   │   │
│  │  4. 🌍 PRODUKTY Z TEJ SAMEJ WOJEWÓDZTWA                         │   │
│  │     - voivodeship === "Opolskie"                                 │   │
│  │     - Priorytet: NISKI                                           │   │
│  │                                                                   │   │
│  │  5. 🌐 WSZYSTKIE INNE PRODUKTY                                   │   │
│  │     - Brak dopasowania lokalizacji                               │   │
│  │     - Priorytet: NAJNIŻSZY                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📱 WYŚWIETLENIE NA FRONTEND                          │
│                    React Components                                      │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    🎨 KOMPONENTY REACT                             │   │
│  │                                                                   │   │
│  │  • MarketplaceProducts.jsx                                        │   │
│  │  • ProductCard.jsx                                                │   │
│  │  • LocationFilter.jsx                                             │   │
│  │  • AuctionBadge.jsx                                               │   │
│  │  • PriceDisplay.jsx                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🎯 REZULTAT: PRODUKTY POSORTOWANE PO LOKALIZACJI     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    📊 PRZYKŁAD WYŚWIETLENIA                       │   │
│  │                                                                   │   │
│  │  🏆 NAJWYŻSZY PRIORYTET (Namysłów):                              │   │
│  │  • Rower górski Trek Marlin 5 - 800 zł                           │   │
│  │  • Komputer stacjonarny Dell OptiPlex - 1200 zł                  │   │
│  │  • Książki historyczne o Namysłowie - 150 zł                     │   │
│  │  • Mebelki dla dzieci - komplet - 400 zł                         │   │
│  │  • Narzędzia ogrodowe - 200 zł                                   │   │
│  │                                                                   │   │
│  │  🏘️ WYSOKI PRIORYTET (Gmina Namysłów):                          │   │
│  │  • [Produkty z okolicznych miejscowości]                         │   │
│  │                                                                   │   │
│  │  🗺️ ŚREDNI PRIORYTET (Powiat namysłówski):                      │   │
│  │  • [Produkty z całego powiatu]                                   │   │
│  │                                                                   │   │
│  │  🌍 NISKI PRIORYTET (Województwo Opolskie):                      │   │
│  │  • [Produkty z całego województwa]                               │   │
│  │                                                                   │   │
│  │  🌐 POZOSTAŁE PRODUKTY:                                          │   │
│  │  • [Produkty z innych województw]                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **TECHNICZNE SZCZEGÓŁY**

### 📊 **KOLEKCJE BAZY DANYCH:**
1. **`users`** - dane użytkowników z lokalizacją TERYT
2. **`marketplaceproducts`** - produkty z lokalizacją
3. **`miejscowosci`** - dane miejscowości (dla autocomplete)
4. **`gminy`** - dane gmin (dla autocomplete)
5. **`powiaty`** - dane powiatów (dla autocomplete)
6. **`wojewodztwa`** - dane województw (dla autocomplete)
7. **`ulice`** - dane ulic (dla autocomplete)

### 🔄 **PRZEPŁYW DANYCH:**
1. **Frontend** → **Backend API** → **MongoDB Atlas**
2. **Autoryzacja** → **Pobranie profilu** → **Filtrowanie produktów**
3. **Kody TERYT** → **Mapowanie lokalizacji** → **Sortowanie**

### 🎯 **ALGORYTM SORTOWANIA:**
```javascript
// Przykład algorytmu sortowania w backend
const sortByLocation = (products, userLocation) => {
  return products.sort((a, b) => {
    const aScore = calculateLocationScore(a.location, userLocation);
    const bScore = calculateLocationScore(b.location, userLocation);
    return bScore - aScore; // Najwyższy priorytet pierwszy
  });
};

const calculateLocationScore = (productLocation, userLocation) => {
  if (!productLocation || !userLocation) return 0;
  
  // Najwyższy priorytet: dokładnie ta sama lokalizacja
  if (productLocation.city === userLocation.city) return 100;
  
  // Wysoki priorytet: ta sama gmina
  if (productLocation.municipality === userLocation.municipality) return 80;
  
  // Średni priorytet: ten sam powiat
  if (productLocation.county === userLocation.county) return 60;
  
  // Niski priorytet: to samo województwo
  if (productLocation.voivodeship === userLocation.voivodeship) return 40;
  
  return 0; // Brak dopasowania
};
```

### 📱 **KOMPONENTY FRONTEND:**
- **`MarketplaceProducts.jsx`** - główny komponent giełdy
- **`LocationFilter.jsx`** - filtr lokalizacji
- **`ProductCard.jsx`** - karta produktu
- **`AuthContext.jsx`** - kontekst autoryzacji z lokalizacją

### 🔐 **ENDPOINTY API:**
- `GET /api/users/profile` - pobranie profilu użytkownika
- `GET /api/marketplace` - pobranie produktów z filtrowaniem
- `GET /api/locations/search` - wyszukiwanie lokalizacji (autocomplete)

---

**🎯 REZULTAT:** Użytkownik widzi produkty posortowane według bliskości lokalizacji, z najwyższym priorytetem dla produktów z Namysłowa! 🚀 