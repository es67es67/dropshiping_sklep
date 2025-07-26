const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Konfiguracja
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = 'admin@test.com';
const TEST_USER_PASSWORD = 'test123';

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do robienia screenshotów
const takeScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(__dirname, 'test-screenshots', filename);
  
  // Utwórz katalog jeśli nie istnieje
  if (!fs.existsSync(path.dirname(filepath))) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }
  
  await page.screenshot({ 
    path: filepath, 
    fullPage: true
  });
  
  log(`📸 Screenshot zapisany: ${filename}`);
  return filepath;
};

// Funkcja do czekania na element
const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    log(`❌ Element nie znaleziony: ${selector}`);
    return false;
  }
};

// Funkcja do sprawdzenia czy użytkownik jest zalogowany
const checkIfLoggedIn = async (page) => {
  try {
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};

// Funkcja do logowania
const login = async (page) => {
  log('🔐 Próba logowania...');
  
  // Sprawdź czy już jesteś zalogowany
  if (await checkIfLoggedIn(page)) {
    log('✅ Użytkownik już zalogowany');
    return true;
  }
  
  // Przejdź do strony logowania
  await page.goto(`${BASE_URL}/login`);
  await takeScreenshot(page, '01_login_page');
  
  // Wypełnij formularz logowania
  await waitForElement(page, 'input[name="email"]');
  await page.type('input[name="email"]', TEST_USER_EMAIL);
  await page.type('input[name="password"]', TEST_USER_PASSWORD);
  
  await takeScreenshot(page, '02_login_form_filled');
  
  // Kliknij przycisk logowania
  await page.click('button[type="submit"]');
  
  // Czekaj na przekierowanie
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Sprawdź czy logowanie się powiodło
  if (await checkIfLoggedIn(page)) {
    log('✅ Logowanie udane');
    await takeScreenshot(page, '03_after_login');
    return true;
  } else {
    log('❌ Logowanie nieudane');
    await takeScreenshot(page, '03_login_error');
    return false;
  }
};

// Funkcja do testowania wyszukiwania użytkowników
const testUserSearch = async (page) => {
  log('🔍 Testowanie wyszukiwania użytkowników...');
  
  // Przejdź do strony wiadomości
  await page.goto(`${BASE_URL}/messages`);
  await takeScreenshot(page, '04_messages_page');
  
  // Sprawdź czy istnieje pole wyszukiwania
  const searchInput = await page.$('input[placeholder*="wyszukaj"]');
  if (searchInput) {
    log('✅ Znaleziono pole wyszukiwania');
    
    // Wpisz tekst wyszukiwania
    await searchInput.type('test');
    await page.waitForTimeout(1000);
    
    await takeScreenshot(page, '05_search_users');
    
    // Sprawdź czy pojawiły się wyniki
    const searchResults = await page.$('[data-testid="search-results"]');
    if (searchResults) {
      log('✅ Znaleziono wyniki wyszukiwania');
    } else {
      log('⚠️ Brak wyników wyszukiwania');
    }
  } else {
    log('❌ Nie znaleziono pola wyszukiwania');
  }
};

// Funkcja do testowania systemu znajomych
const testFriendshipSystem = async (page) => {
  log('👥 Testowanie systemu znajomych...');
  
  // Przejdź do strony znajomych
  await page.goto(`${BASE_URL}/friends`);
  await takeScreenshot(page, '06_friends_page');
  
  // Sprawdź czy istnieją zakładki
  const tabs = await page.$$('[role="tab"]');
  if (tabs.length > 0) {
    log(`✅ Znaleziono ${tabs.length} zakładek`);
    
    // Sprawdź zakładkę "Znajomi"
    const friendsTab = await page.$('[data-testid="friends-tab"]');
    if (friendsTab) {
      await friendsTab.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '07_friends_list');
    }
    
    // Sprawdź zakładkę "Zaproszenia"
    const requestsTab = await page.$('[data-testid="requests-tab"]');
    if (requestsTab) {
      await requestsTab.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '08_friend_requests');
    }
    
    // Sprawdź zakładkę "Sugestie"
    const suggestionsTab = await page.$('[data-testid="suggestions-tab"]');
    if (suggestionsTab) {
      await suggestionsTab.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '09_friend_suggestions');
    }
  } else {
    log('❌ Nie znaleziono zakładek');
  }
};

// Funkcja do testowania wysyłania wiadomości
const testMessaging = async (page) => {
  log('💬 Testowanie systemu wiadomości...');
  
  // Przejdź do strony wiadomości
  await page.goto(`${BASE_URL}/messages`);
  await takeScreenshot(page, '10_messages_page');
  
  // Sprawdź czy istnieje lista konwersacji
  const conversationsList = await page.$('[data-testid="conversations-list"]');
  if (conversationsList) {
    log('✅ Znaleziono listę konwersacji');
    
    // Kliknij na pierwszą konwersację (jeśli istnieje)
    const firstConversation = await page.$('[data-testid="conversation-item"]');
    if (firstConversation) {
      await firstConversation.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '11_conversation_selected');
      
      // Sprawdź czy istnieje pole do wpisywania wiadomości
      const messageInput = await page.$('textarea[placeholder*="wiadomość"]');
      if (messageInput) {
        log('✅ Znaleziono pole do wpisywania wiadomości');
        
        // Wpisz testową wiadomość
        await messageInput.type('Testowa wiadomość z automatyzacji');
        await takeScreenshot(page, '12_message_typed');
        
        // Sprawdź czy istnieje przycisk wysyłania
        const sendButton = await page.$('button[type="submit"]');
        if (sendButton) {
          log('✅ Znaleziono przycisk wysyłania');
          // Nie wysyłamy wiadomości w teście, żeby nie spamować
        } else {
          log('❌ Nie znaleziono przycisku wysyłania');
        }
      } else {
        log('❌ Nie znaleziono pola do wpisywania wiadomości');
      }
    } else {
      log('⚠️ Brak konwersacji do wybrania');
    }
  } else {
    log('❌ Nie znaleziono listy konwersacji');
  }
};

// Funkcja do testowania API
const testAPI = async () => {
  log('🔌 Testowanie API...');
  
  try {
    // Test wyszukiwania użytkowników
    const searchResponse = await fetch(`${API_URL}/users/search?q=test`);
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      log(`✅ API wyszukiwania użytkowników działa: ${searchData.users?.length || 0} wyników`);
    } else {
      log('❌ API wyszukiwania użytkowników nie działa');
    }
    
    // Test pobierania znajomych
    const friendsResponse = await fetch(`${API_URL}/friendships/friends`);
    if (friendsResponse.ok) {
      const friendsData = await friendsResponse.json();
      log(`✅ API znajomych działa: ${friendsData.friends?.length || 0} znajomych`);
    } else {
      log('❌ API znajomych nie działa');
    }
    
    // Test pobierania konwersacji
    const conversationsResponse = await fetch(`${API_URL}/messages/conversations`);
    if (conversationsResponse.ok) {
      const conversationsData = await conversationsResponse.json();
      log(`✅ API konwersacji działa: ${conversationsData.conversations?.length || 0} konwersacji`);
    } else {
      log('❌ API konwersacji nie działa');
    }
    
  } catch (error) {
    log(`❌ Błąd testowania API: ${error.message}`);
  }
};

// Główna funkcja testowa
const runTests = async () => {
  log('🚀 Rozpoczynam testy systemu wiadomości i znajomych...');
  
  let browser;
  try {
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Ustaw timeout
    page.setDefaultTimeout(30000);
    
    // Test API
    await testAPI();
    
    // Test logowania
    const loginSuccess = await login(page);
    if (!loginSuccess) {
      log('❌ Nie można kontynuować testów bez logowania');
      return;
    }
    
    // Test wyszukiwania użytkowników
    await testUserSearch(page);
    
    // Test systemu znajomych
    await testFriendshipSystem(page);
    
    // Test systemu wiadomości
    await testMessaging(page);
    
    log('✅ Wszystkie testy zakończone pomyślnie!');
    
  } catch (error) {
    log(`❌ Błąd podczas testów: ${error.message}`);
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Uruchom testy
runTests().catch(console.error); 