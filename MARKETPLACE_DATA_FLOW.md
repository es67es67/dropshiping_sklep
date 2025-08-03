# 🏪 Schemat Przepływu Danych - Marketplace

## 📊 Kolekcje MongoDB

### 1. **users** - Użytkownicy
```javascript
{
  _id: ObjectId,
  email: String,
  address: {
    city: String,        // np. "Namysłów"
    municipality: String, // np. "Namysłów"
    county: String,      // np. "Namysłów"
    voivodeship: String, // np. "Opolskie"
    terytCode: String    // np. "1608011"
  },
  teryt: {
    city: String,
    municipality: String,
    county: String,
    voivodeship: String,
    terytCode: String,
    fullCode: String     // np. "1608011"
  }
}
```

### 2. **marketplaceProducts** - Produkty Giełdy
```javascript
{
  _id: ObjectId,
  title: String,
  price: Number,
  saleType: String,      // "fixed", "auction", "negotiation", "free"
  location: {
    voivodeship: String, // np. "Zachodniopomorskie"
    county: String,      // np. "Szczecin"
    municipality: String, // np. "Szczecin"
    city: String,        // np. "Szczecin"
    terytCode: String    // np. "3262011"
  },
  seller: ObjectId,      // ID użytkownika sprzedawcy
  isActive: Boolean
}
```

### 3. **shops** - Sklepy
```javascript
{
  _id: ObjectId,
  name: String,
  address: {
    city: String,        // np. "Toruń"
    municipality: String,
    county: String,
    voivodeship: String, // np. "Kujawsko-Pomorskie"
    terytCode: String
  },
  owner: ObjectId        // ID użytkownika właściciela
}
```

### 4. **products** - Produkty Sklepów
```javascript
{
  _id: ObjectId,
  title: String,
  price: Number,
  shop: ObjectId,        // ID sklepu
  isActive: Boolean
}
```

## 🔄 Przepływ Danych

### **Endpoint: `/api/marketplace/local`**
1. **Autoryzacja**: Sprawdza token JWT
2. **Pobiera użytkownika**: `users.findOne({ _id: userId })`
3. **Sprawdza lokalizację użytkownika**:
   - `user.address.city` lub `user.teryt.city`
   - `user.teryt.fullCode` (kod TERYT)
4. **Filtruje produkty giełdy**:
   ```javascript
   // Dokładne dopasowanie miasta + TERYT
   {
     'location.city': user.address?.city,
     'location.terytCode': userTeryt.fullCode
   }
   // LUB dopasowanie gminy
   {
     'location.municipality': userTeryt.municipalityCode,
     'location.county': userTeryt.countyCode
   }
   ```

### **Endpoint: `/api/marketplace` (wszystkie produkty)**
1. **Pobiera produkty giełdy**: `marketplaceProducts.find({ isActive: true })`
2. **Pobiera produkty sklepów**: `products.find({ isActive: true })`
3. **Łączy z danymi sklepów**: `shops.findById(shopId)`
4. **Zwraca połączone dane**

## 🎯 Problem z Filtrowaniem

### **Dlaczego pokazuje produkty z innych miast?**

1. **Użytkownik nie ma lokalizacji**:
   - `user.address.city` = `null` lub `undefined`
   - `user.teryt.city` = `null` lub `undefined`

2. **Produkty nie mają lokalizacji**:
   - `product.location.city` = `null` lub `undefined`
   - `product.location.terytCode` = `null` lub `undefined`

3. **Nieprawidłowe kody TERYT**:
   - Produkty mają błędne kody TERYT
   - Użytkownik ma błędny kod TERYT

### **Rozwiązanie**

1. **Sprawdź lokalizację użytkownika**:
   ```javascript
   // W MongoDB Compass lub shell
   db.users.findOne({ _id: ObjectId("6889a3f6e1ac1a771c78b9a7") })
   ```

2. **Sprawdź produkty z lokalizacją**:
   ```javascript
   // Produkty z lokalizacją
   db.marketplaceProducts.find({ "location.city": { $exists: true } })
   
   // Produkty z konkretnego miasta
   db.marketplaceProducts.find({ "location.city": "Namysłów" })
   ```

3. **Sprawdź produkty bez lokalizacji**:
   ```javascript
   // Produkty bez lokalizacji
   db.marketplaceProducts.find({ 
     $or: [
       { "location.city": { $exists: false } },
       { "location.city": null }
     ]
   })
   ```

## 🔧 Naprawa

### **Krok 1: Sprawdź dane użytkownika**
```javascript
// W konsoli przeglądarki
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### **Krok 2: Sprawdź produkty w bazie**
```javascript
// W MongoDB shell
use portal
db.marketplaceProducts.find({}, {title: 1, "location.city": 1, "location.terytCode": 1})
```

### **Krok 3: Dodaj lokalizację do produktów**
```javascript
// Aktualizuj produkty bez lokalizacji
db.marketplaceProducts.updateMany(
  { "location.city": { $exists: false } },
  { $set: { "location.city": "Namysłów", "location.terytCode": "1608011" } }
)
```

### **Krok 4: Sprawdź użytkownika**
```javascript
// Aktualizuj lokalizację użytkownika
db.users.updateOne(
  { _id: ObjectId("6889a3f6e1ac1a771c78b9a7") },
  { 
    $set: { 
      "address.city": "Namysłów",
      "teryt.city": "Namysłów",
      "teryt.fullCode": "1608011"
    }
  }
)
```

## 📍 Debugowanie

### **Sprawdź logi backendu**:
```
🎯 Znaleziono 0 lokalnych produktów dla użytkownika 6889a3f6e1ac1a771c78b9a7
```

To oznacza, że:
1. Użytkownik jest zalogowany (ID: 6889a3f6e1ac1a771c78b9a7)
2. Endpoint `/local` działa poprawnie
3. Ale nie ma produktów pasujących do lokalizacji użytkownika

### **Następne kroki**:
1. Sprawdź czy użytkownik ma ustawioną lokalizację
2. Sprawdź czy produkty mają poprawną lokalizację
3. Sprawdź czy kody TERYT są zgodne 