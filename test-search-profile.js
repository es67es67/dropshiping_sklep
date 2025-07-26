const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Konfiguracja
const BASE_URL = 'https://portal-frontend-igf9.onrender.com';
const API_URL = 'https://portal-backend-igf9.onrender.com';
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123'
};

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do zapisywania screenshotów
const saveScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(__dirname, 'test-screenshots', filename);
  
  // Utwórz katalog jeśli nie istnieje
  if (!fs.existsSync(path.dirname(filepath))) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }
  
  await page.screenshot({ 
    path: filepath, 
    fullPage: true,
    timeout: 10000
  });
  
  log(`📸 Screenshot zapisany: ${filename}`);
  return filepath;
};

// Test wyszukiwania i profilu użytkownika
async function testSearchAndProfile() {
  let browser;
  let page;
  
  try {
    log('🚀 Rozpoczynam test wyszukiwania i profilu użytkownika...');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Ustaw timeout
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    
    // Interceptuj żądania API do debugowania
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        log(`🌐 API Request: ${request.method()} ${request.url()}`);
      }
      request.continue();
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        log(`📡 API Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Przejdź do strony głównej
    log('📱 Przechodzę do strony głównej...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await saveScreenshot(page, '01_main_page');
    
    // Sprawdź czy jesteśmy na stronie głównej
    const pageTitle = await page.title();
    log(`📄 Tytuł strony: ${pageTitle}`);
    
    // Sprawdź czy istnieje wyszukiwarka
    const searchInput = await page.$('input[placeholder*="wyszukaj"], input[placeholder*="search"], .search-input input');
    if (!searchInput) {
      log('❌ Nie znaleziono pola wyszukiwania na stronie głównej');
      await saveScreenshot(page, 'ERROR_no_search_input');
      return;
    }
    
    log('✅ Znaleziono pole wyszukiwania');
    
    // Wpisz tekst w wyszukiwarce
    const searchQuery = 'test';
    log(`🔍 Wpisuję w wyszukiwarce: "${searchQuery}"`);
    await searchInput.click();
    await searchInput.type(searchQuery, { delay: 100 });
    
    // Poczekaj na wyniki wyszukiwania
    log('⏳ Czekam na wyniki wyszukiwania...');
    await page.waitForTimeout(2000);
    
    // Sprawdź czy pojawiły się wyniki
    const searchResults = await page.$$('.search-result, .result-item, [data-testid="search-result"]');
    log(`📋 Znaleziono ${searchResults.length} wyników wyszukiwania`);
    
    if (searchResults.length === 0) {
      log('❌ Brak wyników wyszukiwania');
      await saveScreenshot(page, 'ERROR_no_search_results');
      
      // Sprawdź czy są jakieś błędy w konsoli
      const consoleLogs = await page.evaluate(() => {
        return window.consoleLogs || [];
      });
      
      if (consoleLogs.length > 0) {
        log('🔍 Logi konsoli:');
        consoleLogs.forEach(log => console.log(`   ${log}`));
      }
      
      return;
    }
    
    // Sprawdź pierwszy wynik (użytkownik)
    const firstResult = searchResults[0];
    const resultText = await firstResult.evaluate(el => el.textContent);
    log(`👤 Pierwszy wynik: ${resultText}`);
    
    // Sprawdź czy to użytkownik
    const isUserResult = await firstResult.evaluate(el => {
      return el.textContent.toLowerCase().includes('test') || 
             el.querySelector('[data-type="user"]') ||
             el.className.includes('user');
    });
    
    if (!isUserResult) {
      log('❌ Pierwszy wynik nie jest użytkownikiem');
      await saveScreenshot(page, 'ERROR_not_user_result');
      return;
    }
    
    log('✅ Znaleziono użytkownika w wynikach');
    
    // Kliknij w wynik użytkownika
    log('🖱️ Klikam w profil użytkownika...');
    await firstResult.click();
    
    // Poczekaj na przejście do profilu
    await page.waitForTimeout(3000);
    
    // Sprawdź czy przejście się udało
    const currentUrl = page.url();
    log(`🔗 Aktualny URL: ${currentUrl}`);
    
    if (currentUrl.includes('/users/')) {
      log('✅ Przejście do profilu użytkownika udane');
      await saveScreenshot(page, '02_user_profile');
      
      // Sprawdź czy profil się załadował
      const profileContent = await page.$('.user-profile, .profile-content, h1, h2');
      if (profileContent) {
        const profileText = await profileContent.evaluate(el => el.textContent);
        log(`📄 Zawartość profilu: ${profileText}`);
      }
      
      // Sprawdź czy nie ma błędów
      const errorElement = await page.$('.error, [data-testid="error"], .alert-error');
      if (errorElement) {
        const errorText = await errorElement.evaluate(el => el.textContent);
        log(`❌ Błąd na stronie profilu: ${errorText}`);
        await saveScreenshot(page, 'ERROR_profile_error');
      } else {
        log('✅ Profil użytkownika załadowany pomyślnie');
      }
      
    } else {
      log('❌ Nie udało się przejść do profilu użytkownika');
      await saveScreenshot(page, 'ERROR_profile_navigation');
    }
    
    // Test bezpośredniego API
    log('🔧 Testuję bezpośrednie wywołanie API...');
    
    // Sprawdź endpoint wyszukiwania
    const searchResponse = await page.evaluate(async (apiUrl, query) => {
      try {
        const response = await fetch(`${apiUrl}/api/users/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        return { status: 'error', error: error.message };
      }
    }, API_URL, searchQuery);
    
    log(`🔍 API Search Response: ${searchResponse.status}`);
    if (searchResponse.data) {
      log(`📋 Znaleziono ${searchResponse.data.users?.length || 0} użytkowników przez API`);
      
      if (searchResponse.data.users && searchResponse.data.users.length > 0) {
        const firstUser = searchResponse.data.users[0];
        log(`👤 Pierwszy użytkownik z API: ${firstUser.firstName} ${firstUser.lastName} (ID: ${firstUser._id})`);
        
        // Test pobierania profilu przez API
        const profileResponse = await page.evaluate(async (apiUrl, userId) => {
          try {
            const response = await fetch(`${apiUrl}/api/users/${userId}`);
            const data = await response.json();
            return { status: response.status, data };
          } catch (error) {
            return { status: 'error', error: error.message };
          }
        }, API_URL, firstUser._id);
        
        log(`👤 API Profile Response: ${profileResponse.status}`);
        if (profileResponse.status === 200) {
          log(`✅ Profil użytkownika pobrany przez API: ${profileResponse.data.firstName} ${profileResponse.data.lastName}`);
        } else {
          log(`❌ Błąd pobierania profilu przez API: ${profileResponse.error || profileResponse.data?.error}`);
        }
      }
    }
    
    log('✅ Test zakończony pomyślnie');
    
  } catch (error) {
    log(`❌ Błąd podczas testu: ${error.message}`);
    if (page) {
      await saveScreenshot(page, 'ERROR_test_failed');
    }
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
}

// Uruchom test
testSearchAndProfile().catch(console.error); 