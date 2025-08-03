# 📍 LocationAutocomplete - Struktura odpowiedzi

## 🎯 Co zwraca po wyborze lokalizacji?

### **Struktura obiektu `location` zwracanego przez `onLocationSelect`:**

```javascript
{
  _id: "507f1f77bcf86cd799439011",
  code: "1465011",           // Kod TERYT/SIMC
  name: "Warszawa",          // Nazwa lokalizacji
  type: "miejscowość",       // Typ: miejscowość, gmina, powiat, województwo, ulica
  tercCode: "1465011",       // Pełny kod TERC (dla miejscowości)
  
  // Dane hierarchiczne (mogą być puste)
  wojewodztwo: { 
    code: "14"               // Kod województwa
  },
  powiat: { 
    code: "1465"             // Kod powiatu
  },
  gmina: { 
    code: "1465"             // Kod gminy
  },
  
  // Dodatkowe dane dla ulic
  miejscowosc: { 
    code: "1465011"          // Kod miejscowości (dla ulic)
  }
}
```

## 🔍 Przykłady odpowiedzi dla różnych typów:

### **1. Miejscowość (SIMC)**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  code: "1465011",
  name: "Warszawa",
  type: "miejscowość",
  tercCode: "1465011",
  wojewodztwo: { code: "14" },
  powiat: { code: "1465" },
  gmina: { code: "1465" }
}
```

### **2. Gmina (TERC)**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  code: "1465",
  name: "Warszawa",
  type: "gmina miejska",
  wojewodztwo: { code: "14" },
  powiat: { code: "1465" },
  gmina: { code: "1465" }
}
```

### **3. Powiat (TERC)**
```javascript
{
  _id: "507f1f77bcf86cd799439013",
  code: "1465",
  name: "Warszawa",
  type: "powiat",
  wojewodztwo: { code: "14" },
  powiat: { code: "1465" }
}
```

### **4. Województwo (TERC)**
```javascript
{
  _id: "507f1f77bcf86cd799439014",
  code: "14",
  name: "mazowieckie",
  type: "województwo",
  wojewodztwo: { code: "14" }
}
```

### **5. Ulica (ULIC)**
```javascript
{
  _id: "507f1f77bcf86cd799439015",
  code: "12345",
  name: "Marszałkowska",
  type: "ulica",
  wojewodztwo: { code: "14" },
  powiat: { code: "1465" },
  gmina: { code: "1465" },
  miejscowosc: { code: "1465011" }
}
```

## 📊 Kody TERYT w odpowiedzi:

### **Struktura kodów:**
- **Województwo:** 2 cyfry (np. "14" = mazowieckie)
- **Powiat:** 4 cyfry (np. "1465" = Warszawa)
- **Gmina:** 6 cyfr (np. "146501" = Warszawa)
- **Miejscowość:** 7 cyfr (np. "1465011" = Warszawa)
- **Ulica:** 5 cyfr (np. "12345" = Marszałkowska)

### **Przykład pełnego kodu:**
```
14 65 01 1 2345
│  │  │  │ │
│  │  │  │ └── Ulica
│  │  │  └──── Miejscowość
│  │  └─────── Gmina
│  └────────── Powiat
└───────────── Województwo
```

## 🎯 Jak używać w komponencie:

### **1. Podstawowe użycie:**
```javascript
const handleLocationSelect = (location) => {
  console.log('Wybrana lokalizacja:', location);
  
  // Dostęp do danych
  console.log('Nazwa:', location.name);
  console.log('Kod TERYT:', location.code);
  console.log('Typ:', location.type);
  
  // Formatowanie wyświetlania
  let displayValue = location.name;
  if (location.gmina?.code) {
    displayValue += `, gmina ${location.gmina.code}`;
  }
  if (location.powiat?.code) {
    displayValue += `, powiat ${location.powiat.code}`;
  }
};
```

### **2. Zapis do bazy danych:**
```javascript
const locationData = {
  name: location.name,
  code: location.code,
  type: location.type,
  terytCode: location.tercCode || location.code,
  wojewodztwoCode: location.wojewodztwo?.code,
  powiatCode: location.powiat?.code,
  gminaCode: location.gmina?.code,
  simcCode: location.type === 'miejscowość' ? location.code : null
};
```

### **3. Walidacja danych:**
```javascript
const validateLocation = (location) => {
  if (!location.name || !location.code) {
    return false;
  }
  
  // Sprawdź czy ma wymagane dane dla typu
  switch (location.type) {
    case 'miejscowość':
      return !!(location.wojewodztwo?.code && location.powiat?.code);
    case 'gmina':
      return !!(location.wojewodztwo?.code && location.powiat?.code);
    case 'powiat':
      return !!(location.wojewodztwo?.code);
    case 'województwo':
      return !!(location.wojewodztwo?.code);
    case 'ulica':
      return !!(location.miejscowosc?.code);
    default:
      return false;
  }
};
```

## 🔧 Integracja z Profile.jsx:

### **Aktualna implementacja:**
```javascript
const handleLocationSelect = (location) => {
  console.log('Wybrana lokalizacja w profilu:', location);
  
  // Formatuj wyświetlaną wartość
  let displayValue = location.name;
  if (location.gmina?.name) {
    displayValue += `, ${location.gmina.name}`;
  }
  if (location.powiat?.name) {
    displayValue += `, ${location.powiat.name}`;
  }
  if (location.wojewodztwo?.name) {
    displayValue += `, ${location.wojewodztwo.name}`;
  }
  
  // Zaktualizuj dane użytkownika
  setUserData(prev => ({
    ...prev,
    location: displayValue,
    terytData: {
      code: location.code,
      type: location.type,
      gmina: location.gmina,
      powiat: location.powiat,
      wojewodztwo: location.wojewodztwo
    }
  }));
};
```

## 📈 Podsumowanie:

**LocationAutocomplete zwraca:**
- ✅ **Kod TERYT/SIMC** w polu `code`
- ✅ **Nazwę lokalizacji** w polu `name`
- ✅ **Typ lokalizacji** w polu `type`
- ✅ **Dane hierarchiczne** (województwo, powiat, gmina)
- ✅ **Pełny kod TERC** w polu `tercCode` (dla miejscowości)

**Dane są gotowe do zapisu w bazie danych i użycia w całym systemie!** 🎯 