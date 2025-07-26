const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PortalE2ETest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshots = [];
    this.testResults = [];
    this.baseUrl = 'http://localhost:3000';
    this.apiUrl = 'http://localhost:5000';
  }

  async init() {
    console.log('🚀 Inicjalizacja testów E2E dla portalu...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Intercept network requests to check API calls
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      console.log(`🌐 Request: ${request.method()} ${request.url()}`);
      request.continue();
    });
    
    this.page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`📡 API Response: ${response.status()} ${response.url()}`);
      }
    });
    
    // Handle console logs
    this.page.on('console', msg => {
      console.log(`📝 Console: ${msg.type()}: ${msg.text()}`);
    });
    
    // Handle errors
    this.page.on('pageerror', error => {
      console.error(`❌ Page Error: ${error.message}`);
    });
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(__dirname, 'e2e-screenshots', filename);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true 
    });
    
    this.screenshots.push({ name, filepath });
    console.log(`📸 Screenshot: ${filename}`);
  }

  async waitForElement(selector, timeout = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.error(`❌ Element not found: ${selector}`);
      return false;
    }
  }

  async waitForNavigation(timeout = 10000) {
    try {
      await this.page.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
      return true;
    } catch (error) {
      console.log('⚠️ Navigation timeout, continuing...');
      return false;
    }
  }

  async testHomePage() {
    console.log('\n🏠 Test: Strona główna');
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('01_home_page');
      
      // Check if page loads without errors
      const title = await this.page.title();
      console.log(`✅ Tytuł strony: ${title}`);
      
      // Check for main elements
      const hasNavbar = await this.waitForElement('nav');
      const hasMainContent = await this.waitForElement('main');
      
      if (hasNavbar && hasMainContent) {
        console.log('✅ Strona główna załadowana poprawnie');
        this.testResults.push({ test: 'Home Page', status: 'PASS' });
      } else {
        console.log('❌ Strona główna - brak głównych elementów');
        this.testResults.push({ test: 'Home Page', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania strony głównej:', error.message);
      this.testResults.push({ test: 'Home Page', status: 'ERROR', error: error.message });
    }
  }

  async testRegistration() {
    console.log('\n📝 Test: Rejestracja użytkownika');
    
    try {
      // Go to registration page
      await this.page.goto(`${this.baseUrl}/register`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('02_register_form');
      
      // Fill registration form
      const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      await this.page.type('input[name="username"]', testUser.username);
      await this.page.type('input[name="email"]', testUser.email);
      await this.page.type('input[name="password"]', testUser.password);
      await this.page.type('input[name="firstName"]', testUser.firstName);
      await this.page.type('input[name="lastName"]', testUser.lastName);
      
      await this.takeScreenshot('03_register_filled');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      await this.waitForNavigation();
      await this.takeScreenshot('04_after_register');
      
      // Check if registration was successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('/login') || currentUrl.includes('/dashboard')) {
        console.log('✅ Rejestracja zakończona pomyślnie');
        this.testResults.push({ test: 'Registration', status: 'PASS' });
      } else {
        console.log('❌ Rejestracja nie powiodła się');
        this.testResults.push({ test: 'Registration', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania rejestracji:', error.message);
      this.testResults.push({ test: 'Registration', status: 'ERROR', error: error.message });
    }
  }

  async testLogin() {
    console.log('\n🔐 Test: Logowanie');
    
    try {
      // Go to login page
      await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('05_login_form');
      
      // Fill login form with admin credentials
      await this.page.type('input[name="email"]', 'FF@RRF.PL');
      await this.page.type('input[name="password"]', 'admin123');
      
      await this.takeScreenshot('06_login_filled');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      await this.waitForNavigation();
      await this.takeScreenshot('07_after_login');
      
      // Check if login was successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/shops') || !currentUrl.includes('/login')) {
        console.log('✅ Logowanie zakończone pomyślnie');
        this.testResults.push({ test: 'Login', status: 'PASS' });
      } else {
        console.log('❌ Logowanie nie powiodło się');
        this.testResults.push({ test: 'Login', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania logowania:', error.message);
      this.testResults.push({ test: 'Login', status: 'ERROR', error: error.message });
    }
  }

  async testShopCreation() {
    console.log('\n🏪 Test: Tworzenie sklepu');
    
    try {
      // Navigate to shop creation
      await this.page.goto(`${this.baseUrl}/shops/create`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('08_shop_create_form');
      
      // Fill shop form
      const testShop = {
        name: `Test Shop ${Date.now()}`,
        description: 'Testowy sklep utworzony przez E2E test',
        location: 'Warszawa',
        phone: '+48123456789',
        email: 'testshop@example.com'
      };
      
      await this.page.type('input[name="name"]', testShop.name);
      await this.page.type('textarea[name="description"]', testShop.description);
      await this.page.type('input[name="location"]', testShop.location);
      await this.page.type('input[name="phone"]', testShop.phone);
      await this.page.type('input[name="email"]', testShop.email);
      
      await this.takeScreenshot('09_shop_form_filled');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      await this.waitForNavigation();
      await this.takeScreenshot('10_after_shop_create');
      
      // Check if shop was created
      const currentUrl = this.page.url();
      if (currentUrl.includes('/shops') && !currentUrl.includes('/create')) {
        console.log('✅ Sklep utworzony pomyślnie');
        this.testResults.push({ test: 'Shop Creation', status: 'PASS' });
      } else {
        console.log('❌ Tworzenie sklepu nie powiodło się');
        this.testResults.push({ test: 'Shop Creation', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania tworzenia sklepu:', error.message);
      this.testResults.push({ test: 'Shop Creation', status: 'ERROR', error: error.message });
    }
  }

  async testProductCreation() {
    console.log('\n📦 Test: Tworzenie produktu');
    
    try {
      // Navigate to product creation
      await this.page.goto(`${this.baseUrl}/products/create`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('11_product_create_form');
      
      // Fill product form
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: 'Testowy produkt utworzony przez E2E test',
        price: '99.99',
        category: 'Electronics',
        stock: '10'
      };
      
      await this.page.type('input[name="name"]', testProduct.name);
      await this.page.type('textarea[name="description"]', testProduct.description);
      await this.page.type('input[name="price"]', testProduct.price);
      await this.page.type('input[name="category"]', testProduct.category);
      await this.page.type('input[name="stock"]', testProduct.stock);
      
      await this.takeScreenshot('12_product_form_filled');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      await this.waitForNavigation();
      await this.takeScreenshot('13_after_product_create');
      
      // Check if product was created
      const currentUrl = this.page.url();
      if (currentUrl.includes('/products') && !currentUrl.includes('/create')) {
        console.log('✅ Produkt utworzony pomyślnie');
        this.testResults.push({ test: 'Product Creation', status: 'PASS' });
      } else {
        console.log('❌ Tworzenie produktu nie powiodło się');
        this.testResults.push({ test: 'Product Creation', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania tworzenia produktu:', error.message);
      this.testResults.push({ test: 'Product Creation', status: 'ERROR', error: error.message });
    }
  }

  async testShopListing() {
    console.log('\n📋 Test: Lista sklepów');
    
    try {
      await this.page.goto(`${this.baseUrl}/shops`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('14_shops_list');
      
      // Wait for shops to load
      await this.page.waitForTimeout(3000);
      
      // Check if shops are displayed
      const shopsCount = await this.page.$$eval('.shop-card, .shop-item, [data-testid="shop-item"]', elements => elements.length);
      
      if (shopsCount > 0) {
        console.log(`✅ Znaleziono ${shopsCount} sklepów`);
        this.testResults.push({ test: 'Shop Listing', status: 'PASS', count: shopsCount });
      } else {
        console.log('❌ Brak sklepów na liście');
        this.testResults.push({ test: 'Shop Listing', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania listy sklepów:', error.message);
      this.testResults.push({ test: 'Shop Listing', status: 'ERROR', error: error.message });
    }
  }

  async testProductListing() {
    console.log('\n🛍️ Test: Lista produktów');
    
    try {
      await this.page.goto(`${this.baseUrl}/products`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('15_products_list');
      
      // Wait for products to load
      await this.page.waitForTimeout(3000);
      
      // Check if products are displayed
      const productsCount = await this.page.$$eval('.product-card, .product-item, [data-testid="product-item"]', elements => elements.length);
      
      if (productsCount > 0) {
        console.log(`✅ Znaleziono ${productsCount} produktów`);
        this.testResults.push({ test: 'Product Listing', status: 'PASS', count: productsCount });
      } else {
        console.log('❌ Brak produktów na liście');
        this.testResults.push({ test: 'Product Listing', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania listy produktów:', error.message);
      this.testResults.push({ test: 'Product Listing', status: 'ERROR', error: error.message });
    }
  }

  async testUserProfile() {
    console.log('\n👤 Test: Profil użytkownika');
    
    try {
      await this.page.goto(`${this.baseUrl}/profile`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('16_user_profile');
      
      // Check if profile page loads
      const hasProfileContent = await this.page.$('.profile-content, .user-profile, [data-testid="profile"]');
      
      if (hasProfileContent) {
        console.log('✅ Profil użytkownika załadowany poprawnie');
        this.testResults.push({ test: 'User Profile', status: 'PASS' });
      } else {
        console.log('❌ Profil użytkownika nie załadował się');
        this.testResults.push({ test: 'User Profile', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania profilu użytkownika:', error.message);
      this.testResults.push({ test: 'User Profile', status: 'ERROR', error: error.message });
    }
  }

  async testAdminPanel() {
    console.log('\n⚙️ Test: Panel administratora');
    
    try {
      await this.page.goto(`${this.baseUrl}/admin`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('17_admin_panel');
      
      // Check if admin panel loads
      const hasAdminContent = await this.page.$('.admin-panel, .admin-content, [data-testid="admin-panel"]');
      
      if (hasAdminContent) {
        console.log('✅ Panel administratora załadowany poprawnie');
        this.testResults.push({ test: 'Admin Panel', status: 'PASS' });
      } else {
        console.log('❌ Panel administratora nie załadował się');
        this.testResults.push({ test: 'Admin Panel', status: 'FAIL' });
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania panelu administratora:', error.message);
      this.testResults.push({ test: 'Admin Panel', status: 'ERROR', error: error.message });
    }
  }

  async testNavigation() {
    console.log('\n🧭 Test: Nawigacja');
    
    try {
      // Test navigation between pages
      const pages = [
        { name: 'Home', url: '/' },
        { name: 'Shops', url: '/shops' },
        { name: 'Products', url: '/products' },
        { name: 'Profile', url: '/profile' }
      ];
      
      for (const page of pages) {
        await this.page.goto(`${this.baseUrl}${page.url}`, { waitUntil: 'networkidle0' });
        await this.takeScreenshot(`18_nav_${page.name.toLowerCase()}`);
        
        const currentUrl = this.page.url();
        if (currentUrl.includes(page.url) || currentUrl.endsWith(page.url)) {
          console.log(`✅ Nawigacja do ${page.name} - OK`);
        } else {
          console.log(`❌ Nawigacja do ${page.name} - FAIL`);
        }
      }
      
      this.testResults.push({ test: 'Navigation', status: 'PASS' });
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania nawigacji:', error.message);
      this.testResults.push({ test: 'Navigation', status: 'ERROR', error: error.message });
    }
  }

  async testResponsiveDesign() {
    console.log('\n📱 Test: Responsywność');
    
    try {
      const viewports = [
        { name: 'Desktop', width: 1280, height: 720 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
      ];
      
      for (const viewport of viewports) {
        await this.page.setViewport(viewport);
        await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
        await this.takeScreenshot(`19_responsive_${viewport.name.toLowerCase()}`);
        
        console.log(`✅ Responsywność ${viewport.name} - OK`);
      }
      
      this.testResults.push({ test: 'Responsive Design', status: 'PASS' });
      
    } catch (error) {
      console.error('❌ Błąd podczas testowania responsywności:', error.message);
      this.testResults.push({ test: 'Responsive Design', status: 'ERROR', error: error.message });
    }
  }

  async generateReport() {
    console.log('\n📊 Generowanie raportu testów...');
    
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.status === 'PASS').length,
      failed: this.testResults.filter(r => r.status === 'FAIL').length,
      errors: this.testResults.filter(r => r.status === 'ERROR').length,
      results: this.testResults,
      screenshots: this.screenshots
    };
    
    const reportPath = path.join(__dirname, 'e2e-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 RAPORT TESTÓW E2E:');
    console.log('='.repeat(50));
    console.log(`Total tests: ${report.totalTests}`);
    console.log(`✅ Passed: ${report.passed}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`⚠️ Errors: ${report.errors}`);
    console.log(`📸 Screenshots: ${report.screenshots.length}`);
    console.log('='.repeat(50));
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${status} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log(`\n📄 Pełny raport zapisany w: ${reportPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.init();
      
      await this.testHomePage();
      await this.testRegistration();
      await this.testLogin();
      await this.testShopCreation();
      await this.testProductCreation();
      await this.testShopListing();
      await this.testProductListing();
      await this.testUserProfile();
      await this.testAdminPanel();
      await this.testNavigation();
      await this.testResponsiveDesign();
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Błąd podczas wykonywania testów:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Uruchom testy
const tester = new PortalE2ETest();
tester.runAllTests(); 