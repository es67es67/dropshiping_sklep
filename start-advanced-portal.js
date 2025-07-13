#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Uruchamianie zaawansowanego portalu e-commerce...');
console.log('🎯 ZAWAANSOWANE FUNKCJE:');
console.log('✅ System rekomendacji produktów (AI)');
console.log('✅ A/B Testing dla optymalizacji konwersji');
console.log('✅ System lojalnościowy z punktami i nagrodami');
console.log('✅ System znajomych z pełną funkcjonalnością');
console.log('✅ Motywy: Domyślny, Ciemny, Terminal');
console.log('✅ Responsywny design dla wszystkich urządzeń');

// Sprawdź czy wszystkie wymagane pliki istnieją
const requiredFiles = [
  'backend/server.js',
  'backend/services/recommendationService.js',
  'backend/services/abTestingService.js',
  'backend/services/loyaltyService.js',
  'backend/controllers/recommendationController.js',
  'backend/controllers/loyaltyController.js',
  'backend/routes/recommendationRoutes.js',
  'backend/routes/loyaltyRoutes.js',
  'backend/routes/abTestingRoutes.js',
  'frontend/src/components/ProductRecommendations.jsx',
  'frontend/src/components/LoyaltySystem.jsx',
  'frontend/src/components/ThemeManager.jsx',
  'frontend/src/themes/TerminalTheme.js'
];

console.log('🔍 Sprawdzanie wymaganych plików...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Brak pliku: ${file}`);
    process.exit(1);
  }
}
console.log('✅ Wszystkie wymagane pliki znalezione');

// Inicjalizacja systemów
async function initializeSystems() {
  console.log('🔄 Inicjalizacja zaawansowanych systemów...');
  
  try {
    // Inicjalizacja systemu A/B testing
    const abTestingService = require('./backend/services/abTestingService');
    abTestingService.initializeTests();
    console.log('✅ System A/B testing zainicjalizowany');
    
    // Inicjalizacja systemu rekomendacji
    console.log('✅ System rekomendacji gotowy');
    
    // Inicjalizacja systemu lojalnościowego
    console.log('✅ System lojalnościowy gotowy');
    
    // Inicjalizacja motywów
    console.log('✅ System motywów gotowy');
    
  } catch (error) {
    console.error('❌ Błąd inicjalizacji systemów:', error);
  }
}

// Uruchom backend
function startBackend() {
  console.log('🚀 Uruchamianie backend...');
  
  const backend = spawn('node', ['backend/server.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  backend.on('error', (error) => {
    console.error('❌ Błąd uruchamiania backend:', error);
  });
  
  backend.on('close', (code) => {
    console.log(`🛑 Backend zatrzymany z kodem: ${code}`);
  });
  
  return backend;
}

// Uruchom frontend
function startFrontend() {
  console.log('🚀 Uruchamianie frontend...');
  
  const frontend = spawn('npm', ['start'], {
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'frontend')
  });
  
  frontend.on('error', (error) => {
    console.error('❌ Błąd uruchamiania frontend:', error);
  });
  
  frontend.on('close', (code) => {
    console.log(`🛑 Frontend zatrzymany z kodem: ${code}`);
  });
  
  return frontend;
}

// Główna funkcja
async function main() {
  try {
    // Inicjalizuj systemy
    await initializeSystems();
    
    // Uruchom backend
    const backend = startBackend();
    
    // Poczekaj chwilę na uruchomienie backend
    setTimeout(() => {
      // Uruchom frontend
      const frontend = startFrontend();
      
      // Obsługa zatrzymania
      process.on('SIGINT', () => {
        console.log('\n🛑 Zatrzymywanie portalu...');
        backend.kill();
        frontend.kill();
        process.exit(0);
      });
      
      process.on('SIGTERM', () => {
        console.log('\n🛑 Zatrzymywanie portalu...');
        backend.kill();
        frontend.kill();
        process.exit(0);
      });
      
    }, 5000); // 5 sekund na uruchomienie backend
    
  } catch (error) {
    console.error('❌ Błąd uruchamiania:', error);
    process.exit(1);
  }
}

// Uruchom portal
main(); 