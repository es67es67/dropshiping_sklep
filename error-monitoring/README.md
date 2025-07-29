# 🔍 System Monitorowania Błędów - Portal

## 📋 Opis
Kompletny system monitorowania błędów dla portalu społecznościowo-handlowego z funkcjami:
- Real-time error tracking
- Dashboard z analizą błędów
- Alerty email/Slack
- Automatyczne grupowanie błędów
- Performance monitoring

## 🏗️ Architektura

```
error-monitoring/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Logika biznesowa
│   ├── models/             # Schematy MongoDB
│   ├── middleware/          # Error handling middleware
│   ├── services/           # Alerting, email, Slack
│   └── routes/             # API endpoints
├── frontend/               # React/TypeScript dashboard
│   ├── components/         # UI komponenty
│   ├── pages/             # Strony dashboardu
│   ├── services/          # API calls
│   └── utils/             # Error reporting utils
└── shared/                 # Wspólne typy i konfiguracja
```

## 🚀 Funkcje

### 1. Client-Side Error Handler
- Global error boundary dla React
- Window.onerror i unhandledrejection handlers
- Automatyczne zbieranie context (user agent, URL, stack trace)
- Queue system dla offline scenarios

### 2. Backend Error Processing
- Middleware do przechwytywania błędów Express
- Endpoint `/api/errors` do przyjmowania błędów
- Automatyczna kategoryzacja i grupowanie
- Rate limiting przeciwko spam'owi

### 3. Dashboard Interface
- Lista błędów z filtrowaniem i sortowaniem
- Szczegóły błędu z context
- Wykresy częstotliwości występowania
- Real-time notifications

### 4. Alerting System
- Email notifications dla krytycznych błędów
- Slack/Discord webhooks
- Threshold-based alerting

## 🛠️ Technologie
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: Socket.IO
- **Styling**: Styled-components
- **Charts**: Chart.js
- **Testing**: Jest + React Testing Library

## 📦 Instalacja

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🔧 Konfiguracja
Skopiuj `.env.example` do `.env` i ustaw:
- `MONGODB_URI` - połączenie z bazą danych
- `JWT_SECRET` - klucz JWT
- `SMTP_*` - konfiguracja email
- `SLACK_WEBHOOK` - webhook Slack
- `DISCORD_WEBHOOK` - webhook Discord 