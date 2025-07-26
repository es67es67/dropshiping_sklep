const puppeteer = require('puppeteer');

const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

const takeScreenshot = async (page, filename) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filepath = `test-screenshots/${filename}_${timestamp}.png`;
  
  try {
    await page.screenshot({
      path: filepath,
      fullPage: true
    });
    log(`📸 Screenshot zapisany: ${filepath}`);
  } catch (error) {
    log(`❌ Błąd screenshot: ${error.message}`);
  }
};

const testUserProfile = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam test profilu użytkownika...');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. Przejdź do strony głównej
    log('🏠 Przechodzę do strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01_home_page');
    
    // 2. Znajdź pole wyszukiwania
    log('🔍 Znajduję pole wyszukiwania...');
    const searchInput = await page.$('input[placeholder*="Szukaj"]');
    if (!searchInput) {
      log('❌ Pole wyszukiwania nie znalezione');
      return;
    }
    
    // 3. Wyszukaj użytkownika
    log('👥 Wyszukuję użytkownika "Jan"...');
    await searchInput.type('Jan');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '02_search_results');
    
    // 4. Sprawdź czy są wyniki - szukaj po różnych selektorach
    const searchResults = await page.$$('.SearchResultItem, [data-testid="search-result"], div[class*="SearchResultItem"], div[class*="sc-"]');
    log(`🔍 Znaleziono ${searchResults.length} wyników wyszukiwania (styled-components)`);
    
    // Sprawdź wszystkie divy z tekstem "Jan"
    const allDivs = await page.$$('div');
    const divsWithJan = [];
    for (const div of allDivs) {
      const text = await div.evaluate(el => el.textContent);
      if (text && text.includes('Jan') && text.length < 100) {
        divsWithJan.push(text.trim());
      }
    }
    log(`🔍 Divy z tekstem "Jan": ${divsWithJan.length}`);
    if (divsWithJan.length > 0) {
      log(`📝 Przykładowe divy: ${divsWithJan.slice(0, 3).join(', ')}`);
    }
    
    // Sprawdź wszystkie elementy w wynikach wyszukiwania
    const allResultsElements = await page.$$('div');
    log(`🔍 Wszystkich divów na stronie: ${allResultsElements.length}`);
    
    // Sprawdź czy są jakieś elementy z tekstem "Jan" (bez :has-text)
    const pageContent = await page.content();
    const janCount = (pageContent.match(/Jan/g) || []).length;
    log(`🔍 Wystąpień tekstu "Jan" na stronie: ${janCount}`);
    
    if (searchResults.length === 0) {
      log('⚠️ Brak wyników wyszukiwania - sprawdzam czy API działa');
      
      // Sprawdź bezpośrednio API
      const response = await page.evaluate(async () => {
        try {
          const res = await fetch('/api/users/search?q=Jan&limit=5');
          const data = await res.json();
          return { status: res.status, data };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      log(`📡 API Response: ${JSON.stringify(response, null, 2)}`);
      return;
    }
    
    // 5. Kliknij w pierwszy wynik użytkownika
    log('🖱️ Klikam w pierwszy wynik użytkownika...');
    if (divsWithJan.length > 0) {
      // Znajdź pierwszy div z imieniem użytkownika
      const userDivs = await page.$$('div');
      for (const div of userDivs) {
        const text = await div.evaluate(el => el.textContent);
        if (text && text.includes('Jan') && text.includes('@') && text.length < 100) {
          log(`🖱️ Klikam w div: "${text.trim()}"`);
          await div.click();
          break;
        }
      }
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '03_user_profile');
    } else {
      log('❌ Nie znaleziono wyników do kliknięcia');
    }
    
    // 6. Sprawdź czy strona profilu się załadowała
    const currentUrl = page.url();
    log(`📍 Aktualny URL: ${currentUrl}`);
    
    if (currentUrl.includes('/users/')) {
      log('✅ Przekierowanie do profilu użytkownika udane');
      
      // Sprawdź czy profil się załadował
      const profileContent = await page.$('h1, h2, h3');
      if (profileContent) {
        const title = await profileContent.evaluate(el => el.textContent);
        log(`📄 Tytuł profilu: ${title}`);
      }
      
      // Sprawdź czy nie ma błędu
      const errorElement = await page.$('div:contains("Błąd"), div:contains("Nie znaleziono")');
      if (errorElement) {
        const errorText = await errorElement.evaluate(el => el.textContent);
        log(`❌ Błąd na stronie: ${errorText}`);
      } else {
        log('✅ Profil użytkownika załadował się poprawnie');
      }
    } else {
      log('❌ Nie przekierowano do profilu użytkownika');
    }
    
    log('✅ Test profilu użytkownika zakończony!');
    
  } catch (error) {
    log(`❌ Błąd podczas testowania: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
};

// Uruchom test
testUserProfile(); 