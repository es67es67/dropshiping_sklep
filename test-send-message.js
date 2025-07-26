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

// Funkcja do wysłania wiadomości
const sendMessage = async (token, recipientId, content) => {
  try {
    log(`💬 Wysyłanie wiadomości do: ${recipientId}`);
    
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        recipient: recipientId,
        content: content
      })
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Wiadomość wysłana pomyślnie`);
      return data;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd wysyłania wiadomości: ${errorText}`);
      return null;
    }
  } catch (error) {
    log(`❌ Błąd podczas wysyłania wiadomości: ${error.message}`);
    return null;
  }
};

// Funkcja do pobierania konwersacji
const getConversations = async (token) => {
  try {
    log(`📋 Pobieranie konwersacji`);
    
    const response = await fetch(`${API_URL}/messages/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Pobrano ${data.conversations.length} konwersacji`);
      return data.conversations;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd pobierania konwersacji: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas pobierania konwersacji: ${error.message}`);
    return [];
  }
};

// Funkcja do pobierania wiadomości z konwersacji
const getMessages = async (token, conversationId) => {
  try {
    log(`📨 Pobieranie wiadomości z konwersacji: ${conversationId}`);
    
    const response = await fetch(`${API_URL}/messages?conversationId=${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      log(`✅ Pobrano ${data.messages.length} wiadomości`);
      return data.messages;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd pobierania wiadomości: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas pobierania wiadomości: ${error.message}`);
    return [];
  }
};

// Główna funkcja testowa
const runMessageTest = async () => {
  log('🚀 Rozpoczynam test wysyłania wiadomości...');
  
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
    log('❌ Nie znaleziono odbiorcy wiadomości');
    return;
  }
  
  log(`📧 Nadawca: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);
  log(`📧 Odbiorca: ${recipientUser.firstName} ${recipientUser.lastName} (${recipientUser.email})`);
  
  // 3. Zaloguj się jako admin
  const adminToken = await loginUser('admin@test.com', 'admin123');
  if (!adminToken) {
    log('❌ Nie można zalogować się jako admin');
    return;
  }
  
  // 4. Wyślij wiadomość
  const messageContent = `Cześć ${recipientUser.firstName}! To jest testowa wiadomość z automatyzacji.`;
  const sentMessage = await sendMessage(adminToken, recipientUser._id, messageContent);
  
  if (!sentMessage) {
    log('❌ Nie udało się wysłać wiadomości');
    return;
  }
  
  // 5. Pobierz konwersacje
  const conversations = await getConversations(adminToken);
  
  // 6. Znajdź konwersację z odbiorcą
  const conversation = conversations.find(conv => 
    conv.otherParticipant && conv.otherParticipant._id === recipientUser._id
  );
  
  if (conversation) {
    log(`✅ Znaleziono konwersację: ${conversation._id}`);
    
    // 7. Pobierz wiadomości z konwersacji
    const messages = await getMessages(adminToken, conversation._id);
    
    if (messages.length > 0) {
      log(`📨 Ostatnia wiadomość: "${messages[messages.length - 1].content}"`);
    }
  } else {
    log('⚠️ Nie znaleziono konwersacji z odbiorcą');
  }
  
  log('✅ Test wysyłania wiadomości zakończony pomyślnie!');
};

// Uruchom test
runMessageTest().catch(console.error); 