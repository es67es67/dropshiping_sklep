const puppeteer = require('puppeteer');

async function testSimpleSearch() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Rozpoczynam prosty test wyszukiwania...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 }
    });
    
    page = await browser.newPage();
    
    // Przejdź do strony głównej
    console.log('📱 Przechodzę do strony głównej...');
    await page.goto('https://portal-frontend-igf9.onrender.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Sprawdź tytuł strony
    const title = await page.title();
    console.log(`📄 Tytuł strony: "${title}"`);
    
    // Sprawdź czy strona się załadowała
    const bodyText = await page.evaluate(() => document.body.textContent);
    console.log(`📝 Długość tekstu na stronie: ${bodyText.length} znaków`);
    
    // Sprawdź czy istnieje navbar
    const navbar = await page.$('nav, .navbar, header');
    if (navbar) {
      console.log('✅ Znaleziono navbar');
    } else {
      console.log('❌ Nie znaleziono navbar');
    }
    
    // Sprawdź wszystkie inputy na stronie
    const inputs = await page.$$('input');
    console.log(`🔍 Znaleziono ${inputs.length} pól input na stronie`);
    
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await inputs[i].evaluate(el => el.placeholder);
      const type = await inputs[i].evaluate(el => el.type);
      const className = await inputs[i].evaluate(el => el.className);
      console.log(`   Input ${i + 1}: type="${type}", placeholder="${placeholder}", class="${className}"`);
    }
    
    // Sprawdź czy istnieje wyszukiwarka w navbar
    const searchInNavbar = await page.$('nav input, .navbar input, header input');
    if (searchInNavbar) {
      console.log('✅ Znaleziono pole wyszukiwania w navbar');
      
      // Kliknij w pole wyszukiwania
      await searchInNavbar.click();
      await searchInNavbar.type('test', { delay: 100 });
      
      console.log('🔍 Wpisano "test" w wyszukiwarce');
      
      // Poczekaj na wyniki
      await page.waitForTimeout(2000);
      
      // Sprawdź czy pojawiły się wyniki
      const results = await page.$$('.search-result, .result-item, [data-testid="search-result"]');
      console.log(`📋 Znaleziono ${results.length} wyników wyszukiwania`);
      
      if (results.length > 0) {
        const firstResult = results[0];
        const resultText = await firstResult.evaluate(el => el.textContent);
        console.log(`👤 Pierwszy wynik: ${resultText}`);
        
        // Kliknij w pierwszy wynik
        await firstResult.click();
        console.log('🖱️ Kliknięto w pierwszy wynik');
        
        // Poczekaj na przejście
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        console.log(`🔗 Aktualny URL: ${currentUrl}`);
        
        if (currentUrl.includes('/users/')) {
          console.log('✅ Przejście do profilu użytkownika udane');
        } else {
          console.log('❌ Nie udało się przejść do profilu użytkownika');
        }
      }
    } else {
      console.log('❌ Nie znaleziono pola wyszukiwania w navbar');
    }
    
  } catch (error) {
    console.error(`❌ Błąd: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔌 Przeglądarka zamknięta');
    }
  }
}

testSimpleSearch().catch(console.error); 