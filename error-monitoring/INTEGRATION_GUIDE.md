# 🔗 Przewodnik Integracji - Error Monitoring System

## 📋 Przegląd

Ten przewodnik opisuje jak zintegrować system monitorowania błędów z Twoim portalem społecznościowo-handlowym.

## 🚀 Szybka Integracja

### 1. Dodaj Error Boundary do React App

```jsx
// src/components/ErrorBoundary.jsx
import React from 'react';
import { errorApi } from './services/errorApi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Wyślij błąd do systemu monitorowania
    errorApi.reportError({
      message: error.message,
      stack: error.stack,
      errorType: 'react',
      severity: 'high',
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Wystąpił błąd</h2>
          <p>Przepraszamy za niedogodności. Błąd został zgłoszony.</p>
          <button onClick={() => window.location.reload()}>
            Odśwież stronę
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. Dodaj Error Reporter do głównego App

```jsx
// src/App.jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Twoja aplikacja */}
    </ErrorBoundary>
  );
}
```

### 3. Dodaj Global Error Handler

```jsx
// src/utils/errorReporter.js
import { errorApi } from '../services/errorApi';

class ErrorReporter {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  reportError(errorData) {
    // Dodaj kontekst
    const enrichedError = {
      ...errorData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: localStorage.getItem('userId'),
      sessionId: localStorage.getItem('sessionId')
    };

    // Dodaj do kolejki
    this.queue.push(enrichedError);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      while (this.queue.length > 0) {
        const error = this.queue.shift();
        await errorApi.reportError(error);
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      }
    } catch (error) {
      console.error('Failed to send error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

export const errorReporter = new ErrorReporter();

// Global error handlers
window.addEventListener('error', (event) => {
  errorReporter.reportError({
    message: event.error?.message || 'Unknown error',
    stack: event.error?.stack || '',
    errorType: 'javascript',
    severity: 'high'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorReporter.reportError({
    message: event.reason?.message || 'Unhandled promise rejection',
    stack: event.reason?.stack || '',
    errorType: 'javascript',
    severity: 'high'
  });
});
```

### 4. Dodaj API Service

```jsx
// src/services/errorApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_ERROR_MONITORING_API || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
});

export const errorApi = {
  reportError: async (errorData) => {
    try {
      const response = await api.post('/errors/report', errorData);
      return response.data;
    } catch (error) {
      console.error('Failed to report error:', error);
      // Możesz dodać fallback (np. localStorage)
    }
  }
};
```

## 🔧 Konfiguracja Środowiska

### Zmienne środowiskowe

```bash
# .env
REACT_APP_ERROR_MONITORING_API=http://localhost:5001/api
REACT_APP_ERROR_MONITORING_ENABLED=true
REACT_APP_ERROR_MONITORING_SAMPLE_RATE=1.0
```

### Konfiguracja w package.json

```json
{
  "dependencies": {
    "axios": "^1.5.0"
  }
}
```

## 📊 Monitorowanie API Calls

```jsx
// src/utils/apiMonitor.js
import axios from 'axios';
import { errorReporter } from './errorReporter';

// Interceptor dla axios
axios.interceptors.response.use(
  response => response,
  error => {
    // Wyślij błędy API do systemu monitorowania
    errorReporter.reportError({
      message: `API Error: ${error.response?.status} ${error.response?.statusText}`,
      stack: error.stack,
      errorType: 'api',
      severity: error.response?.status >= 500 ? 'critical' : 'medium',
      metadata: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        responseData: error.response?.data
      }
    });
    
    return Promise.reject(error);
  }
);
```

## 🔍 Monitorowanie Performance

```jsx
// src/utils/performanceMonitor.js
import { errorReporter } from './errorReporter';

class PerformanceMonitor {
  constructor() {
    this.observers = [];
  }

  startMonitoring() {
    // Monitoruj Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry.value > 2500) { // LCP > 2.5s
          errorReporter.reportError({
            message: 'Poor LCP performance',
            errorType: 'performance',
            severity: 'medium',
            metadata: {
              lcp: lastEntry.value,
              url: window.location.href
            }
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart - entry.startTime > 100) { // FID > 100ms
            errorReporter.reportError({
              message: 'Poor FID performance',
              errorType: 'performance',
              severity: 'low',
              metadata: {
                fid: entry.processingStart - entry.startTime,
                url: window.location.href
              }
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

## 🎯 Monitorowanie Użytkowników

```jsx
// src/utils/userMonitor.js
import { errorReporter } from './errorReporter';

class UserMonitor {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = localStorage.getItem('userId');
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  trackUserAction(action, data = {}) {
    // Możesz wysłać dane o akcjach użytkownika
    errorReporter.reportError({
      message: `User Action: ${action}`,
      errorType: 'user_action',
      severity: 'low',
      metadata: {
        action,
        data,
        sessionId: this.sessionId,
        userId: this.userId
      }
    });
  }

  trackError(error, context = {}) {
    errorReporter.reportError({
      message: error.message,
      stack: error.stack,
      errorType: 'user_error',
      severity: 'medium',
      metadata: {
        ...context,
        sessionId: this.sessionId,
        userId: this.userId
      }
    });
  }
}

export const userMonitor = new UserMonitor();
```

## 🔐 Autoryzacja

```jsx
// src/services/errorApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_ERROR_MONITORING_API,
  timeout: 5000
});

// Dodaj token autoryzacji
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const errorApi = {
  reportError: async (errorData) => {
    const response = await api.post('/errors/report', errorData);
    return response.data;
  }
};
```

## 📈 Dashboard Integration

### Dodaj link do dashboardu w menu admina

```jsx
// src/components/AdminMenu.jsx
const AdminMenu = () => {
  return (
    <nav>
      {/* Istniejące menu */}
      <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">
        🔍 Error Monitoring
      </a>
    </nav>
  );
};
```

### Dodaj widget z statystykami błędów

```jsx
// src/components/ErrorStatsWidget.jsx
import React, { useState, useEffect } from 'react';
import { errorApi } from '../services/errorApi';

const ErrorStatsWidget = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await errorApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch error stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Odśwież co minutę

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Ładowanie statystyk błędów...</div>;

  return (
    <div className="error-stats-widget">
      <h3>Statystyki Błędów</h3>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-value">{stats?.totalErrors || 0}</span>
          <span className="stat-label">Wszystkie błędy</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats?.criticalErrors || 0}</span>
          <span className="stat-label">Błędy krytyczne</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats?.resolvedErrors || 0}</span>
          <span className="stat-label">Rozwiązane</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorStatsWidget;
```

## 🚀 Deployment

### 1. Uruchom Error Monitoring System

```bash
cd error-monitoring
chmod +x start.sh
./start.sh
```

### 2. Skonfiguruj zmienne środowiskowe

```bash
# W Twoim porcie
REACT_APP_ERROR_MONITORING_API=http://your-domain.com/api
REACT_APP_ERROR_MONITORING_ENABLED=true
```

### 3. Dodaj do CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Deploy Error Monitoring
  run: |
    cd error-monitoring
    docker-compose up -d
```

## 🔧 Troubleshooting

### Problem: Błędy nie są wysyłane

1. Sprawdź czy API jest dostępne:
```bash
curl http://localhost:5001/health
```

2. Sprawdź logi:
```bash
docker-compose logs backend
```

3. Sprawdź CORS:
```javascript
// W backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com']
}));
```

### Problem: Dashboard nie ładuje się

1. Sprawdź czy frontend działa:
```bash
curl http://localhost:3001
```

2. Sprawdź logi:
```bash
docker-compose logs frontend
```

### Problem: Alerty nie działają

1. Sprawdź konfigurację SMTP/Slack/Discord
2. Sprawdź logi:
```bash
docker-compose logs backend | grep alert
```

## 📚 Dodatkowe Zasoby

- [Dokumentacja API](./API_DOCUMENTATION.md)
- [Konfiguracja Alertów](./ALERTS_CONFIGURATION.md)
- [Monitoring Dashboard](./DASHBOARD_GUIDE.md)
- [Troubleshooting](./TROUBLESHOOTING.md) 