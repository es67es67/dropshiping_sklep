const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Konfiguracja
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');

// Upewnij się, że katalog istnieje
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Funkcja do robienia screenshotów
const takeScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ 
    path: filepath, 
    fullPage: true
  });
  console.log(`📸 Screenshot: ${filename}`);
  return filepath;
};

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do czekania na element
const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.log(`❌ Element nie znaleziony: ${selector}`);
    return false;
  }
};

// Funkcja do logowania użytkownika
const loginUser = async (page, email, password) => {
  try {
    log(`🔐 Logowanie użytkownika: ${email}`);
    
    // Przejdź do strony logowania
    await page.goto(`${BASE_URL}/login`);
    await takeScreenshot(page, '01_login_page');
    
    // Wypełnij formularz
    await waitForElement(page, 'input[name="emailOrUsername"], input[name="email"], input[type="email"]');
    await page.type('input[name="emailOrUsername"], input[name="email"], input[type="email"]', email);
    await page.type('input[name="password"], input[type="password"]', password);
    
    // Kliknij przycisk logowania
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Czekaj na przekierowanie
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    // Sprawdź czy logowanie się udało
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      log(`❌ Logowanie nieudane - nadal na stronie logowania`);
      await takeScreenshot(page, '02_login_failed');
      return false;
    }
    
    log(`✅ Logowanie udane - przekierowano do: ${currentUrl}`);
    await takeScreenshot(page, '03_after_login');
    return true;
    
  } catch (error) {
    log(`❌ Błąd podczas logowania: ${error.message}`);
    await takeScreenshot(page, 'ERROR_login');
    return false;
  }
};

// Funkcja do wyszukiwania użytkowników
const searchUsers = async (page, query) => {
  try {
    log(`🔍 Wyszukiwanie użytkowników: ${query}`);
    
    // Przejdź do strony wyszukiwania lub użyj wyszukiwarki globalnej
    await page.goto(`${BASE_URL}`);
    await takeScreenshot(page, '04_home_page');
    
    // Znajdź pole wyszukiwania
    const searchInput = await page.$('input[placeholder*="szukaj"], input[placeholder*="search"], input[type="search"]');
    if (searchInput) {
      await searchInput.type(query);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '05_search_results');
    } else {
      log(`⚠️ Nie znaleziono pola wyszukiwania`);
    }
    
    // Sprawdź czy są wyniki wyszukiwania
    const searchResults = await page.$$('[data-testid="user-card"], .user-card, .search-result');
    log(`📊 Znaleziono ${searchResults.length} wyników wyszukiwania`);
    
    return searchResults.length > 0;
    
  } catch (error) {
    log(`❌ Błąd podczas wyszukiwania: ${error.message}`);
    await takeScreenshot(page, 'ERROR_search');
    return false;
  }
};

// Funkcja do przejścia do profilu użytkownika
const goToUserProfile = async (page, userId) => {
  try {
    log(`👤 Przechodzę do profilu użytkownika: ${userId}`);
    
    await page.goto(`${BASE_URL}/users/${userId}`);
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '06_user_profile');
    
    // Sprawdź czy strona się załadowała
    const profileContent = await page.$('.profile-header, .user-profile, [data-testid="profile"], [class*="ProfileHeader"]');
    if (profileContent) {
      log(`✅ Profil użytkownika załadowany`);
      return true;
    } else {
      // Sprawdź czy jest błąd ładowania
      const loadingText = await page.$('text="Ładowanie profilu..."');
      if (loadingText) {
        log(`⏳ Profil użytkownika nadal się ładuje...`);
        await page.waitForTimeout(5000); // Czekaj dłużej
        const profileContentAfterWait = await page.$('.profile-header, .user-profile, [data-testid="profile"], [class*="ProfileHeader"]');
        if (profileContentAfterWait) {
          log(`✅ Profil użytkownika załadowany po dłuższym oczekiwaniu`);
          return true;
        }
      }
      
      log(`❌ Nie udało się załadować profilu użytkownika`);
      await takeScreenshot(page, 'ERROR_profile_load');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas ładowania profilu: ${error.message}`);
    await takeScreenshot(page, 'ERROR_profile');
    return false;
  }
};

// Funkcja do wysłania zaproszenia do znajomych
const sendFriendRequest = async (page, userId) => {
  try {
    log(`👥 Wysyłam zaproszenie do znajomych dla użytkownika: ${userId}`);
    
    // Przejdź do profilu użytkownika
    await goToUserProfile(page, userId);
    
    // Znajdź przycisk "Dodaj do znajomych" lub "Wyślij zaproszenie"
    const addFriendButton = await page.$('button:contains("Dodaj do znajomych"), button:contains("Wyślij zaproszenie"), button:contains("Add Friend"), [data-testid="add-friend"]');
    
    if (addFriendButton) {
      // Sprawdź czy przycisk nie jest wyłączony
      const isDisabled = await addFriendButton.evaluate(btn => btn.disabled || btn.classList.contains('disabled'));
      
      if (!isDisabled) {
        await addFriendButton.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '07_friend_request_sent');
        
        // Sprawdź czy pojawiło się potwierdzenie
        const confirmation = await page.$('.success-message, .toast-success, [data-testid="success"]');
        if (confirmation) {
          log(`✅ Zaproszenie wysłane pomyślnie`);
          return true;
        } else {
          log(`⚠️ Zaproszenie wysłane, ale brak potwierdzenia`);
          return true;
        }
      } else {
        log(`⚠️ Przycisk "Dodaj do znajomych" jest wyłączony`);
        await takeScreenshot(page, '08_button_disabled');
        return false;
      }
    } else {
      log(`❌ Nie znaleziono przycisku "Dodaj do znajomych"`);
      await takeScreenshot(page, 'ERROR_no_add_button');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas wysyłania zaproszenia: ${error.message}`);
    await takeScreenshot(page, 'ERROR_friend_request');
    return false;
  }
};

// Funkcja do sprawdzenia powiadomień
const checkNotifications = async (page) => {
  try {
    log(`🔔 Sprawdzam powiadomienia`);
    
    // Przejdź do strony powiadomień
    await page.goto(`${BASE_URL}/notifications`);
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '09_notifications_page');
    
    // Sprawdź czy są powiadomienia
    const notifications = await page.$$('.notification-item, .notification, [data-testid="notification"]');
    log(`📊 Znaleziono ${notifications.length} powiadomień`);
    
    // Sprawdź czy są powiadomienia o zaproszeniach
    const friendRequestNotifications = await page.$$('text="zaproszenie do znajomych", text="friend request"');
    log(`👥 Znaleziono ${friendRequestNotifications.length} powiadomień o zaproszeniach`);
    
    return {
      total: notifications.length,
      friendRequests: friendRequestNotifications.length
    };
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania powiadomień: ${error.message}`);
    await takeScreenshot(page, 'ERROR_notifications');
    return { total: 0, friendRequests: 0 };
  }
};

// Funkcja do akceptacji zaproszenia
const acceptFriendRequest = async (page) => {
  try {
    log(`✅ Akceptuję zaproszenie do znajomych`);
    
    // Znajdź przycisk "Akceptuj" w powiadomieniach
    const acceptButton = await page.$('button:contains("Akceptuj"), button:contains("Accept"), [data-testid="accept-friend"]');
    
    if (acceptButton) {
      await acceptButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '10_friend_request_accepted');
      
      log(`✅ Zaproszenie zaakceptowane`);
      return true;
    } else {
      log(`❌ Nie znaleziono przycisku "Akceptuj"`);
      await takeScreenshot(page, 'ERROR_no_accept_button');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas akceptacji zaproszenia: ${error.message}`);
    await takeScreenshot(page, 'ERROR_accept_friend');
    return false;
  }
};

// Funkcja do sprawdzenia listy znajomych
const checkFriendsList = async (page, userId) => {
  try {
    log(`👥 Sprawdzam listę znajomych użytkownika: ${userId}`);
    
    // Przejdź do profilu użytkownika
    await goToUserProfile(page, userId);
    
    // Znajdź sekcję znajomych
    const friendsSection = await page.$('.friends-section, .friends-list, [data-testid="friends"]');
    
    if (friendsSection) {
      // Sprawdź liczbę znajomych
      const friendsCount = await page.$$eval('.friend-item, .friend-card, [data-testid="friend-item"]', elements => elements.length);
      log(`📊 Użytkownik ma ${friendsCount} znajomych`);
      
      await takeScreenshot(page, '11_friends_list');
      return friendsCount;
    } else {
      log(`⚠️ Nie znaleziono sekcji znajomych`);
      await takeScreenshot(page, '12_no_friends_section');
      return 0;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania listy znajomych: ${error.message}`);
    await takeScreenshot(page, 'ERROR_friends_list');
    return 0;
  }
};

// Funkcja do sprawdzenia statusu przyjaźni
const checkFriendshipStatus = async (page, userId) => {
  try {
    log(`🔍 Sprawdzam status przyjaźni z użytkownikiem: ${userId}`);
    
    // Przejdź do profilu użytkownika
    await goToUserProfile(page, userId);
    
    // Sprawdź różne możliwe statusy
    const statuses = [
      'button:contains("Dodaj do znajomych")',
      'button:contains("Wyślij zaproszenie")',
      'button:contains("Zaproszenie wysłane")',
      'button:contains("Akceptuj zaproszenie")',
      'button:contains("Znajomy")',
      'button:contains("Usuń ze znajomych")'
    ];
    
    for (const status of statuses) {
      const element = await page.$(status);
      if (element) {
        const text = await element.evaluate(el => el.textContent);
        log(`✅ Status przyjaźni: ${text}`);
        await takeScreenshot(page, '13_friendship_status');
        return text;
      }
    }
    
    log(`⚠️ Nie udało się określić statusu przyjaźni`);
    await takeScreenshot(page, '14_unknown_status');
    return 'unknown';
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania statusu przyjaźni: ${error.message}`);
    await takeScreenshot(page, 'ERROR_friendship_status');
    return 'error';
  }
};

// Główna funkcja testowa
const runFriendshipTest = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam test systemu przyjaźni z Puppeteer');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Ustaw timeout
    page.setDefaultTimeout(30000);
    
    // Test 1: Logowanie
    const loginSuccess = await loginUser(page, 'admin@test.com', 'admin123');
    if (!loginSuccess) {
      throw new Error('Logowanie nieudane');
    }
    
    // Test 2: Wyszukiwanie użytkowników
    const searchSuccess = await searchUsers(page, 'test');
    if (!searchSuccess) {
      log('⚠️ Wyszukiwanie nie działa poprawnie');
    }
    
    // Test 3: Przejście do profilu użytkownika
    const targetUserId = '6881e79eca3621fc31f3d076'; // ID użytkownika do testowania
    const profileSuccess = await goToUserProfile(page, targetUserId);
    if (!profileSuccess) {
      throw new Error('Nie udało się załadować profilu użytkownika');
    }
    
    // Test 4: Sprawdzenie statusu przyjaźni
    const friendshipStatus = await checkFriendshipStatus(page, targetUserId);
    log(`📊 Status przyjaźni: ${friendshipStatus}`);
    
    // Test 5: Wysłanie zaproszenia (jeśli nie są jeszcze znajomymi)
    if (friendshipStatus.includes('Dodaj do znajomych') || friendshipStatus.includes('Wyślij zaproszenie')) {
      const requestSuccess = await sendFriendRequest(page, targetUserId);
      if (requestSuccess) {
        log('✅ Zaproszenie wysłane pomyślnie');
      } else {
        log('⚠️ Nie udało się wysłać zaproszenia');
      }
    } else {
      log('ℹ️ Użytkownicy są już znajomymi lub zaproszenie zostało wysłane');
    }
    
    // Test 6: Sprawdzenie powiadomień
    const notifications = await checkNotifications(page);
    log(`📊 Powiadomienia: ${notifications.total} total, ${notifications.friendRequests} o zaproszeniach`);
    
    // Test 7: Sprawdzenie listy znajomych
    const friendsCount = await checkFriendsList(page, targetUserId);
    log(`👥 Liczba znajomych: ${friendsCount}`);
    
    // Test 8: Akceptacja zaproszenia (jeśli są powiadomienia)
    if (notifications.friendRequests > 0) {
      const acceptSuccess = await acceptFriendRequest(page);
      if (acceptSuccess) {
        log('✅ Zaproszenie zaakceptowane');
        
        // Sprawdź ponownie status
        await page.waitForTimeout(2000);
        const newStatus = await checkFriendshipStatus(page, targetUserId);
        log(`📊 Nowy status przyjaźni: ${newStatus}`);
      }
    }
    
    log('🎉 Test systemu przyjaźni zakończony pomyślnie!');
    
  } catch (error) {
    log(`❌ Błąd podczas testu: ${error.message}`);
    if (typeof page !== 'undefined' && page) {
      await takeScreenshot(page, 'ERROR_test_failed');
    }
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
};

// Uruchom test
runFriendshipTest().catch(console.error); 