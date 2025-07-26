# 🚀 Instrukcja Deployu Portalu

## 🌐 **Opcje deployu online:**

### **1. Render (ZALECANE - Darmowe)**

#### Krok 1: Utwórz konto
- Przejdź do https://render.com
- Zaloguj się przez GitHub

#### Krok 2: Połącz repozytorium
- Kliknij "New +"
- Wybierz "Blueprint"
- Połącz z: `https://github.com/es67es67/dropshiping_sklep`

#### Krok 3: Skonfiguruj zmienne środowiskowe
**Backend:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portal
JWT_SECRET=twoj-super-secret-key
NODE_ENV=production
PORT=10000
```

**Frontend:**
```
REACT_APP_API_URL=https://portal-backend.onrender.com
```

#### Krok 4: Deploy
- Render automatycznie zbuduje i uruchomi aplikację
- Backend: `https://portal-backend.onrender.com`
- Frontend: `https://portal-frontend.onrender.com`

### **2. Vercel (Frontend) + Railway (Backend)**

#### Vercel (Frontend):
1. https://vercel.com
2. Import z GitHub
3. Automatyczny deploy

#### Railway (Backend):
1. https://railway.app
2. Deploy z GitHub
3. Skonfiguruj zmienne środowiskowe

### **3. Heroku (Płatne)**

#### Backend:
```bash
heroku create portal-backend
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

#### Frontend:
```bash
heroku create portal-frontend
heroku buildpacks:set mars/create-react-app
git push heroku main
```

## 🧪 **Testowanie lokalne:**

### **Uruchomienie:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### **Dostęp:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Panel: http://localhost:3000/admin-panel

### **Dane logowania:**
- Email: `FF@RRF.PL`
- Hasło: `Admin123!`

## 🔧 **Konfiguracja MongoDB Atlas:**

1. Utwórz darmowe konto na https://www.mongodb.com/atlas
2. Stwórz nowy cluster
3. Dodaj użytkownika z hasłem
4. Skonfiguruj Network Access (0.0.0.0/0)
5. Skopiuj connection string

## 📱 **Testowanie na urządzeniach mobilnych:**

### **Lokalnie:**
```bash
# Znajdź swój IP
ipconfig

# Uruchom z IP
npm start -- --host 192.168.1.100
```

### **Online:**
- Użyj URL z Render/Vercel
- Dostęp z dowolnego urządzenia

## 🚨 **Rozwiązywanie problemów:**

### **Port zajęty:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### **Błąd CORS:**
- Sprawdź `CORS_ORIGIN` w backend
- Upewnij się, że frontend URL jest poprawny

### **Błąd MongoDB:**
- Sprawdź connection string
- Upewnij się, że IP jest na whitelist

## 🎯 **Najlepsze praktyki:**

1. **Zawsze używaj zmiennych środowiskowych** dla danych wrażliwych
2. **Testuj lokalnie** przed deployem
3. **Używaj HTTPS** w produkcji
4. **Regularnie backupuj** bazę danych
5. **Monitoruj logi** aplikacji

## 🔗 **Przydatne linki:**

- **Render:** https://render.com
- **Vercel:** https://vercel.com
- **Railway:** https://railway.app
- **MongoDB Atlas:** https://www.mongodb.com/atlas
- **GitHub:** https://github.com/es67es67/dropshiping_sklep 