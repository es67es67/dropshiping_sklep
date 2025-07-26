const fetch = require('node-fetch');

// Konfiguracja
const API_URL = 'http://localhost:5000';

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Test API wyszukiwania użytkowników
async function testSearchAPI() {
  try {
    log('🔍 Testuję API wyszukiwania użytkowników...');
    
    const searchQuery = 'test';
    const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
    
    log(`📡 Status odpowiedzi: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      log(`❌ Błąd API: ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    log(`✅ API zwróciło dane: ${JSON.stringify(data, null, 2)}`);
    
    if (data.users && data.users.length > 0) {
      log(`👥 Znaleziono ${data.users.length} użytkowników`);
      
      data.users.forEach((user, index) => {
        log(`   ${index + 1}. ${user.firstName} ${user.lastName} (ID: ${user._id})`);
      });
      
      return data.users[0]; // Zwróć pierwszego użytkownika do dalszych testów
    } else {
      log('⚠️ Brak użytkowników w wynikach wyszukiwania');
      return null;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas testowania API wyszukiwania: ${error.message}`);
    return null;
  }
}

// Test API pobierania profilu użytkownika
async function testProfileAPI(userId) {
  try {
    log(`👤 Testuję API profilu użytkownika dla ID: ${userId}`);
    
    const response = await fetch(`${API_URL}/api/users/public/${userId}`);
    
    log(`📡 Status odpowiedzi: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      log(`❌ Błąd API profilu: ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    log(`✅ Profil użytkownika pobrany: ${JSON.stringify(data, null, 2)}`);
    
    // Sprawdź czy profil zawiera wymagane pola
    const requiredFields = ['_id', 'firstName', 'lastName', 'email'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      log(`⚠️ Brakujące pola w profilu: ${missingFields.join(', ')}`);
    } else {
      log('✅ Profil użytkownika zawiera wszystkie wymagane pola');
    }
    
    return true;
    
  } catch (error) {
    log(`❌ Błąd podczas testowania API profilu: ${error.message}`);
    return false;
  }
}

// Test routingu - sprawdź czy endpointy są dostępne
async function testRouting() {
  try {
    log('🛣️ Testuję routing API...');
    
    const endpoints = [
      '/api/users/search?q=test',
      '/api/users/profile',
      '/api/users/public/123456789012345678901234' // Przykładowe ID
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error) {
        log(`   ${endpoint}: Błąd - ${error.message}`);
      }
    }
    
  } catch (error) {
    log(`❌ Błąd podczas testowania routingu: ${error.message}`);
  }
}

// Główna funkcja testowa
async function runTests() {
  log('🚀 Rozpoczynam testy API...');
  
  // Test 1: Routing
  await testRouting();
  
  // Test 2: Wyszukiwanie
  const firstUser = await testSearchAPI();
  
  // Test 3: Profil (jeśli znaleziono użytkownika)
  if (firstUser && firstUser._id) {
    await testProfileAPI(firstUser._id);
  } else {
    log('⚠️ Pomijam test profilu - brak użytkownika do testowania');
  }
  
  log('✅ Testy zakończone');
}

// Uruchom testy
runTests().catch(error => {
  log(`❌ Błąd podczas uruchamiania testów: ${error.message}`);
}); 