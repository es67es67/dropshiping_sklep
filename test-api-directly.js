const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Test wyszukiwania użytkowników
const testUserSearch = async () => {
  try {
    log('🔍 Testowanie wyszukiwania użytkowników...');
    const response = await fetch(`${API_URL}/users/search?q=admin`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ API wyszukiwania użytkowników działa: ${data.users?.length || 0} wyników`);
      if (data.users && data.users.length > 0) {
        log(`📋 Znalezieni użytkownicy:`);
        data.users.forEach(user => {
          log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
        });
      }
    } else {
      const errorText = await response.text();
      log(`❌ API wyszukiwania użytkowników nie działa: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    log(`❌ Błąd testowania wyszukiwania użytkowników: ${error.message}`);
  }
};

// Test pobierania znajomych (bez autoryzacji)
const testFriendships = async () => {
  try {
    log('👥 Testowanie API znajomych...');
    const response = await fetch(`${API_URL}/friendships/friends`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ API znajomych działa: ${data.friends?.length || 0} znajomych`);
    } else {
      const errorText = await response.text();
      log(`❌ API znajomych nie działa: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    log(`❌ Błąd testowania API znajomych: ${error.message}`);
  }
};

// Test pobierania konwersacji (bez autoryzacji)
const testConversations = async () => {
  try {
    log('💬 Testowanie API konwersacji...');
    const response = await fetch(`${API_URL}/messages/conversations`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ API konwersacji działa: ${data.conversations?.length || 0} konwersacji`);
    } else {
      const errorText = await response.text();
      log(`❌ API konwersacji nie działa: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    log(`❌ Błąd testowania API konwersacji: ${error.message}`);
  }
};

// Test pobierania wszystkich użytkowników
const testGetUsers = async () => {
  try {
    log('👤 Testowanie pobierania użytkowników...');
    const response = await fetch(`${API_URL}/users`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ API użytkowników działa: ${data.users?.length || 0} użytkowników`);
      if (data.users && data.users.length > 0) {
        log(`📋 Użytkownicy w systemie:`);
        data.users.slice(0, 5).forEach(user => {
          log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
        });
        if (data.users.length > 5) {
          log(`   ... i ${data.users.length - 5} więcej`);
        }
      }
    } else {
      const errorText = await response.text();
      log(`❌ API użytkowników nie działa: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    log(`❌ Błąd testowania API użytkowników: ${error.message}`);
  }
};

// Test sprawdzenia statusu serwera
const testServerStatus = async () => {
  try {
    log('🔌 Testowanie statusu serwera...');
    const response = await fetch(`${API_URL}/users`);
    
    if (response.ok) {
      log('✅ Serwer backend działa poprawnie');
    } else {
      log(`⚠️ Serwer odpowiada, ale z błędem: ${response.status}`);
    }
  } catch (error) {
    log(`❌ Serwer backend nie odpowiada: ${error.message}`);
  }
};

// Główna funkcja testowa
const runAPITests = async () => {
  log('🚀 Rozpoczynam testy API...');
  
  await testServerStatus();
  await testGetUsers();
  await testUserSearch();
  await testFriendships();
  await testConversations();
  
  log('✅ Testy API zakończone');
};

// Uruchom testy
runAPITests().catch(console.error); 