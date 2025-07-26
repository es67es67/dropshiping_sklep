const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do logowania użytkownika
const loginUser = async (email, password) => {
  try {
    log(`🔐 Logowanie użytkownika: ${email}`);
    
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrUsername: email, password })
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Logowanie udane dla: ${email}`);
      return data.token;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd logowania dla ${email}: ${errorText}`);
      return null;
    }
  } catch (error) {
    log(`❌ Błąd podczas logowania ${email}: ${error.message}`);
    return null;
  }
};

// Funkcja do wyszukiwania użytkowników
const searchUsers = async (query) => {
  try {
    log(`🔍 Wyszukiwanie użytkowników: ${query}`);
    
    const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ Znaleziono ${data.users.length} użytkowników`);
      return data.users;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd wyszukiwania: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas wyszukiwania: ${error.message}`);
    return [];
  }
};

// Funkcja do wysłania zaproszenia do znajomych
const sendFriendRequest = async (token, recipientId, message = '') => {
  try {
    log(`👥 Wysyłanie zaproszenia do znajomych: ${recipientId}`);
    
    const response = await fetch(`${API_URL}/friendships/send-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientId: recipientId,
        message: message
      })
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Zaproszenie wysłane pomyślnie`);
      return data;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd wysyłania zaproszenia: ${errorText}`);
      return null;
    }
  } catch (error) {
    log(`❌ Błąd podczas wysyłania zaproszenia: ${error.message}`);
    return null;
  }
};

// Funkcja do pobierania listy znajomych
const getFriends = async (token) => {
  try {
    log(`👥 Pobieranie listy znajomych`);
    
    const response = await fetch(`${API_URL}/friendships/friends`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Pobrano ${data.friends.length} znajomych`);
      return data.friends;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd pobierania znajomych: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas pobierania znajomych: ${error.message}`);
    return [];
  }
};

// Funkcja do pobierania oczekujących zaproszeń
const getPendingRequests = async (token) => {
  try {
    log(`📨 Pobieranie oczekujących zaproszeń`);
    
    const response = await fetch(`${API_URL}/friendships/pending-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Pobrano ${data.requests.length} oczekujących zaproszeń`);
      return data.requests;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd pobierania zaproszeń: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas pobierania zaproszeń: ${error.message}`);
    return [];
  }
};

// Funkcja do akceptowania zaproszenia
const acceptFriendRequest = async (token, friendshipId) => {
  try {
    log(`✅ Akceptowanie zaproszenia: ${friendshipId}`);
    
    const response = await fetch(`${API_URL}/friendships/accept/${friendshipId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Zaproszenie zaakceptowane pomyślnie`);
      return data;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd akceptowania zaproszenia: ${errorText}`);
      return null;
    }
  } catch (error) {
    log(`❌ Błąd podczas akceptowania zaproszenia: ${error.message}`);
    return null;
  }
};

// Funkcja do pobierania sugestii znajomych
const getFriendSuggestions = async (token) => {
  try {
    log(`💡 Pobieranie sugestii znajomych`);
    
    const response = await fetch(`${API_URL}/friendships/suggestions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Pobrano ${data.suggestions.length} sugestii znajomych`);
      return data.suggestions;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd pobierania sugestii: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas pobierania sugestii: ${error.message}`);
    return [];
  }
};

// Główna funkcja testowa
const runFriendshipTest = async () => {
  log('🚀 Rozpoczynam test systemu znajomych...');
  
  // 1. Wyszukaj użytkowników
  const users = await searchUsers('admin');
  if (users.length === 0) {
    log('❌ Nie znaleziono użytkowników do testowania');
    return;
  }
  
  const adminUser = users.find(u => u.email === 'admin@test.com');
  if (!adminUser) {
    log('❌ Nie znaleziono użytkownika admin@test.com');
    return;
  }
  
  // 2. Wyszukaj innych użytkowników
  const otherUsers = await searchUsers('jan');
  if (otherUsers.length === 0) {
    log('❌ Nie znaleziono innych użytkowników do testowania');
    return;
  }
  
  const recipientUser = otherUsers.find(u => u.email !== 'admin@test.com');
  if (!recipientUser) {
    log('❌ Nie znaleziono odbiorcy zaproszenia');
    return;
  }
  
  log(`👤 Nadawca: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);
  log(`👤 Odbiorca: ${recipientUser.firstName} ${recipientUser.lastName} (${recipientUser.email})`);
  
  // 3. Zaloguj się jako admin
  const adminToken = await loginUser('admin@test.com', 'admin123');
  if (!adminToken) {
    log('❌ Nie można zalogować się jako admin');
    return;
  }
  
  // 4. Sprawdź obecnych znajomych
  const currentFriends = await getFriends(adminToken);
  log(`👥 Obecni znajomi: ${currentFriends.length}`);
  
  // 5. Sprawdź sugestie znajomych
  const suggestions = await getFriendSuggestions(adminToken);
  log(`💡 Sugestie znajomych: ${suggestions.length}`);
  
  // 6. Wyślij zaproszenie do znajomych
  const friendRequestMessage = `Cześć ${recipientUser.firstName}! Chciałbym dodać Cię do znajomych.`;
  const sentRequest = await sendFriendRequest(adminToken, recipientUser._id, friendRequestMessage);
  
  if (!sentRequest) {
    log('❌ Nie udało się wysłać zaproszenia');
    return;
  }
  
  // 7. Zaloguj się jako odbiorca i sprawdź zaproszenia
  const recipientToken = await loginUser(recipientUser.email, 'admin123');
  if (recipientToken) {
    const pendingRequests = await getPendingRequests(recipientToken);
    log(`📨 Oczekujące zaproszenia dla ${recipientUser.firstName}: ${pendingRequests.length}`);
    
    // 8. Akceptuj zaproszenie
    if (pendingRequests.length > 0) {
      const requestToAccept = pendingRequests[0];
      const acceptedRequest = await acceptFriendRequest(recipientToken, requestToAccept._id);
      
      if (acceptedRequest) {
        log('✅ Zaproszenie zostało zaakceptowane');
        
        // 9. Sprawdź zaktualizowaną listę znajomych
        const updatedFriends = await getFriends(recipientToken);
        log(`👥 Zaktualizowana lista znajomych: ${updatedFriends.length}`);
        
        // 10. Sprawdź zaktualizowaną listę znajomych admina
        const updatedAdminFriends = await getFriends(adminToken);
        log(`👥 Zaktualizowana lista znajomych admina: ${updatedAdminFriends.length}`);
      }
    }
  } else {
    log('⚠️ Nie można zalogować się jako odbiorca - sprawdź hasło');
  }
  
  log('✅ Test systemu znajomych zakończony pomyślnie!');
};

// Uruchom test
runFriendshipTest().catch(console.error); 