import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 🔴 CRITICAL FILE: Main Entry Point
// Zależności: React, ReactDOM, App
// Wpływ: Uruchomienie całej aplikacji
// Jeśli się zepsuje: APLIKACJA NIE DZIAŁA
// Używane w: index.html

// Global error handler dla React
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
  
  // Wyślij błąd do API
  if (window.errorReporter) {
    window.errorReporter.reportError({
      message: event.error?.message || 'Unknown error',
      stack: event.error?.stack || '',
      errorType: 'javascript',
      severity: 'high',
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
});

// Global handler dla nieobsłużonych promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
  
  // Wyślij błąd do API
  if (window.errorReporter) {
    window.errorReporter.reportError({
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack || '',
      errorType: 'javascript',
      severity: 'high',
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
});

// Inicjalizacja aplikacji
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 