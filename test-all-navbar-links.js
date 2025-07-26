const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class NavbarLinkTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      screenshots: []
    };
    this.baseUrl = 'http://localhost:3000';
    this.screenshotDir = path.join(__dirname, 'test-screenshots');
    
    // Utwórz katalog na screenshots jeśli nie istnieje
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async init() {
    console.log('🚀 Inicjalizacja testów navbar...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Ustaw timeout na 30 sekund
    this.page.setDefaultTimeout(30000);
    
    console.log('✅ Browser zainicjalizowany');
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true 
    });
    
    this.results.screenshots.push(filepath);
    console.log(`📸 Screenshot: ${filename}`);
    return filepath;
  }

  async testLink(linkName, url, expectedTitle = null) {
    try {
      console.log(`\n🔗 Testowanie: ${linkName} -> ${url}`);
      
      await this.page.goto(url, { waitUntil: 'networkidle2' });
      
      // Czekaj dodatkowo na załadowanie React
      await this.page.waitForTimeout(2000);
      
      await this.takeScreenshot(`01_${linkName.replace(/\s+/g, '_')}`);
      
      // Sprawdź czy strona się załadowała
      const pageTitle = await this.page.title();
      console.log(`📄 Tytuł strony: ${pageTitle}`);
      
      if (expectedTitle && !pageTitle.includes(expectedTitle)) {
        throw new Error(`Nieoczekiwany tytuł strony: ${pageTitle}`);
      }
      
      // Sprawdź czy nie ma błędów w konsoli
      const consoleErrors = await this.page.evaluate(() => {
        return window.consoleErrors || [];
      });
      
      if (consoleErrors.length > 0) {
        console.warn(`⚠️ Błędy w konsoli dla ${linkName}:`, consoleErrors);
      }
      
      // Sprawdź czy navbar jest widoczny
      const navbar = await this.page.$('nav');
      if (!navbar) {
        throw new Error('Navbar nie jest widoczny');
      }
      
      console.log(`✅ ${linkName} - OK`);
      this.results.passed++;
      
    } catch (error) {
      console.error(`❌ ${linkName} - BŁĄD:`, error.message);
      this.results.failed++;
      this.results.errors.push({
        link: linkName,
        url: url,
        error: error.message
      });
      
      await this.takeScreenshot(`ERROR_${linkName.replace(/\s+/g, '_')}`);
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testowanie autoryzacji...');
    
    try {
      // Przejdź do strony logowania
                    await this.page.goto(`${this.baseUrl}/login`);
              await this.takeScreenshot('02_login_page');

              // Czekaj na załadowanie formularza - dłuższy timeout
              await this.page.waitForSelector('input[name="emailOrUsername"]', { timeout: 10000 });
              // Dodatkowe opóźnienie na załadowanie React
              await this.page.waitForTimeout(3000);
      
                    // Wypełnij formularz logowania
              await this.page.type('input[name="emailOrUsername"]', 'test2@example.com');
              await this.page.type('input[name="password"]', 'password123');
      
      // Kliknij przycisk logowania
      await this.page.click('button[type="submit"]');
      
      // Czekaj na przekierowanie
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await this.takeScreenshot('03_after_login');
      
      // Sprawdź czy użytkownik jest zalogowany (sprawdź czy jesteśmy na stronie głównej)
      const currentUrl = this.page.url();
      if (currentUrl.includes('/login')) {
        throw new Error('Nie przekierowano po logowaniu');
      }
      
      console.log('✅ Logowanie - OK');
      this.results.passed++;
      
    } catch (error) {
      console.error('❌ Logowanie - BŁĄD:', error.message);
      this.results.failed++;
      this.results.errors.push({
        link: 'Logowanie',
        url: '/login',
        error: error.message
      });
    }
  }

  async testMainNavbarLinks() {
    console.log('\n🏠 Testowanie głównych linków navbar...');
    
    const mainLinks = [
      { name: 'Strona główna', url: '/', expectedTitle: 'Portal' },
      { name: 'Produkty', url: '/products', expectedTitle: 'Produkty' },
      { name: 'Sklepy', url: '/shops', expectedTitle: 'Sklepy' },
      { name: 'Koszyk', url: '/cart', expectedTitle: 'Koszyk' },
      { name: 'Feed', url: '/feed', expectedTitle: 'Feed' },
      { name: 'Wiadomości', url: '/messages', expectedTitle: 'Wiadomości' },
      { name: 'Gamifikacja', url: '/gamification', expectedTitle: 'Gamifikacja' },
      { name: 'Powiadomienia', url: '/notifications', expectedTitle: 'Powiadomienia' },
      { name: 'Firmy', url: '/company-profiles', expectedTitle: 'Firmy' },
      { name: 'Zaawansowane', url: '/advanced-features', expectedTitle: 'Zaawansowane' },
      { name: 'TERYT', url: '/teryt-features', expectedTitle: 'TERYT' }
    ];
    
    for (const link of mainLinks) {
      await this.testLink(link.name, `${this.baseUrl}${link.url}`, link.expectedTitle);
      await this.page.waitForTimeout(1000); // Krótka przerwa między testami
    }
  }

  async testLocationDropdownLinks() {
    console.log('\n🗺️ Testowanie linków lokalizacji...');
    
    const locationLinks = [
      { name: 'Mapa Lokalizacji', url: '/location-map', expectedTitle: 'Mapa' },
      { name: 'Kraj', url: '/country', expectedTitle: 'Kraj' },
      { name: 'Województwa', url: '/voivodeships', expectedTitle: 'Województwa' },
      { name: 'Powiaty', url: '/counties', expectedTitle: 'Powiaty' },
      { name: 'Gminy', url: '/municipalities', expectedTitle: 'Gminy' },
      { name: 'Miasta', url: '/cities', expectedTitle: 'Miasta' }
    ];
    
    for (const link of locationLinks) {
      await this.testLink(link.name, `${this.baseUrl}${link.url}`, link.expectedTitle);
      await this.page.waitForTimeout(1000);
    }
  }

  async testUserDropdownLinks() {
    console.log('\n👤 Testowanie linków menu użytkownika...');
    
    try {
      // Przejdź do strony głównej
      await this.page.goto(`${this.baseUrl}/`);
      await this.page.waitForTimeout(2000);
      
      // Kliknij menu użytkownika
      const userMenu = await this.page.$('[data-testid="user-menu"]');
      if (userMenu) {
        await userMenu.click();
        await this.page.waitForTimeout(1000);
        await this.takeScreenshot('04_user_menu_open');
        
        const userDropdownLinks = [
          { name: 'Mój profil', url: '/profile', expectedTitle: 'Profil' },
          { name: 'Mój koszyk', url: '/cart', expectedTitle: 'Koszyk' },
          { name: 'Moje sklepy', url: '/shop-management', expectedTitle: 'Zarządzanie' },
          { name: 'Moje produkty', url: '/my-products', expectedTitle: 'Produkty' },
          { name: 'Produkty lokalne', url: '/local-products', expectedTitle: 'Lokalne' },
          { name: 'Znajomi', url: '/friends', expectedTitle: 'Znajomi' },
          { name: 'Ustawienia', url: '/settings', expectedTitle: 'Ustawienia' },
          { name: 'Dostosuj wygląd', url: '/layout-customization', expectedTitle: 'Dostosuj' }
        ];
        
        for (const link of userDropdownLinks) {
          await this.testLink(link.name, `${this.baseUrl}${link.url}`, link.expectedTitle);
          await this.page.waitForTimeout(1000);
        }
      } else {
        console.log('⚠️ Menu użytkownika nie jest dostępne');
      }
      
    } catch (error) {
      console.error('❌ Testowanie menu użytkownika - BŁĄD:', error.message);
    }
  }

  async testAdminLinks() {
    console.log('\n⚙️ Testowanie linków admina...');
    
    try {
      const adminLinks = [
        { name: 'Panel Admina', url: '/admin-panel', expectedTitle: 'Admin' }
      ];
      
      for (const link of adminLinks) {
        await this.testLink(link.name, `${this.baseUrl}${link.url}`, link.expectedTitle);
        await this.page.waitForTimeout(1000);
      }
      
    } catch (error) {
      console.error('❌ Testowanie linków admina - BŁĄD:', error.message);
    }
  }

  async testShopManagementLinks() {
    console.log('\n🏪 Testowanie linków zarządzania sklepami...');
    
    try {
      const shopManagementLinks = [
        { name: 'Zarządzaj sklepami', url: '/shop-management', expectedTitle: 'Zarządzanie' },
        { name: 'Zarządzaj produktami', url: '/product-management', expectedTitle: 'Produkty' },
        { name: 'Utwórz sklep', url: '/shop-create', expectedTitle: 'Utwórz' },
        { name: 'Utwórz produkt', url: '/product-create', expectedTitle: 'Utwórz' }
      ];
      
      for (const link of shopManagementLinks) {
        await this.testLink(link.name, `${this.baseUrl}${link.url}`, link.expectedTitle);
        await this.page.waitForTimeout(1000);
      }
      
    } catch (error) {
      console.error('❌ Testowanie linków zarządzania sklepami - BŁĄD:', error.message);
    }
  }

  async testResponsiveDesign() {
    console.log('\n📱 Testowanie responsywności...');
    
    const viewports = [
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      try {
        console.log(`📱 Testowanie ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await this.page.setViewport(viewport);
        await this.page.goto(`${this.baseUrl}/`);
        await this.page.waitForTimeout(2000);
        
        await this.takeScreenshot(`responsive_${viewport.name.toLowerCase()}`);
        
        // Sprawdź czy navbar jest widoczny
        const navbar = await this.page.$('nav');
        if (!navbar) {
          throw new Error(`Navbar nie jest widoczny na ${viewport.name}`);
        }
        
        console.log(`✅ ${viewport.name} - OK`);
        this.results.passed++;
        
      } catch (error) {
        console.error(`❌ ${viewport.name} - BŁĄD:`, error.message);
        this.results.failed++;
      }
    }
  }

  async testInteractiveElements() {
    console.log('\n🎯 Testowanie elementów interaktywnych...');
    
    try {
      await this.page.goto(`${this.baseUrl}/`);
      await this.page.waitForTimeout(2000);
      
      // Test przełącznika motywu
      const themeToggle = await this.page.$('button[onclick*="toggleTheme"]');
      if (themeToggle) {
        await themeToggle.click();
        await this.page.waitForTimeout(1000);
        await this.takeScreenshot('05_theme_toggle');
        console.log('✅ Przełącznik motywu - OK');
        this.results.passed++;
      }
      
      // Test menu hamburger na mobile
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto(`${this.baseUrl}/`);
      await this.page.waitForTimeout(2000);
      
      const hamburgerButton = await this.page.$('button[onclick*="toggleMenu"]');
      if (hamburgerButton) {
        await hamburgerButton.click();
        await this.page.waitForTimeout(1000);
        await this.takeScreenshot('06_mobile_menu');
        console.log('✅ Menu hamburger - OK');
        this.results.passed++;
      }
      
      // Przywróć desktop viewport
      await this.page.setViewport({ width: 1280, height: 720 });
      
    } catch (error) {
      console.error('❌ Testowanie elementów interaktywnych - BŁĄD:', error.message);
      this.results.failed++;
    }
  }

  async generateReport() {
    console.log('\n📊 GENEROWANIE RAPORTU...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2) + '%'
      },
      errors: this.results.errors,
      screenshots: this.results.screenshots
    };
    
    const reportPath = path.join(__dirname, 'navbar-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 PODSUMOWANIE TESTÓW:');
    console.log(`✅ Przeszło: ${this.results.passed}`);
    console.log(`❌ Nie przeszło: ${this.results.failed}`);
    console.log(`📊 Wskaźnik sukcesu: ${report.summary.successRate}`);
    console.log(`📸 Screenshots: ${this.results.screenshots.length}`);
    console.log(`📄 Raport: ${reportPath}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ BŁĘDY:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.link} (${error.url}): ${error.error}`);
      });
    }
  }

  async run() {
    try {
      await this.init();
      
      // Test głównej strony
      await this.testLink('Strona główna', this.baseUrl, 'Portal');
      
      // Test autoryzacji
      await this.testAuthentication();
      
      // Test głównych linków navbar
      await this.testMainNavbarLinks();
      
      // Test linków lokalizacji
      await this.testLocationDropdownLinks();
      
      // Test linków menu użytkownika
      await this.testUserDropdownLinks();
      
      // Test linków admina
      await this.testAdminLinks();
      
      // Test linków zarządzania sklepami
      await this.testShopManagementLinks();
      
      // Test responsywności
      await this.testResponsiveDesign();
      
      // Test elementów interaktywnych
      await this.testInteractiveElements();
      
      // Generuj raport
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
        console.log('🔌 Browser zamknięty');
      }
    }
  }
}

// Uruchom testy
const tester = new NavbarLinkTester();
tester.run(); 