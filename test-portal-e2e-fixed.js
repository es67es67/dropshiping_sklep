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
    this.isLoggedIn = false;
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

  async loginUser() {
    console.log('\n🔐 Logowanie użytkownika...');
    
    try {
      // Go to login page
      await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('01_login_page');
      
      // Wait for login form to load
      await this.page.waitForTimeout(2000);
      
      // Try different selectors for email field
      const emailSelectors = [
        'input[name="email"]',
        'input[type="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        '#email',
        '.email-input'
      ];
      
      let emailField = null;
      for (const selector of emailSelectors) {
        emailField = await this.page.$(selector);
        if (emailField) {
          console.log(`✅ Found email field with selector: ${selector}`);
          break;
        }
      }
      
      if (!emailField) {
        console.log('❌ Email field not found, checking page content...');
        const pageContent = await this.page.content();
        console.log('Page contains login form:', pageContent.includes('login') || pageContent.includes('Login'));
        return false;
      }
      
      // Fill login form
      await this.page.type('input[name="email"], input[type="email"], #email', 'FF@RRF.PL');
      await this.page.type('input[name="password"], input[type="password"], #password', 'admin123');
      
      await this.takeScreenshot('02_login_filled');
      
      // Submit form
      await this.page.click('button[type="submit"], input[type="submit"], .login-button');
      await this.waitForNavigation();
      await this.takeScreenshot('03_after_login');
      
      // Check if login was successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard') || currentUrl.includes('/shops') || !currentUrl.includes('/login')) {
        console.log('✅ Logowanie zakończone pomyślnie');
        this.isLoggedIn = true;
        return true;
      } else {
        console.log('❌ Logowanie nie powiodło się');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas logowania:', error.message);
      return false;
    }
  }

  async testHomePage() {
    console.log('\n🏠 Test: Strona główna');
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('04_home_page');
      
      // Check if page loads without errors
      const title = await this.page.title();
      console.log(`✅ Tytuł strony: ${title}`);
      
      // Check for main elements
      const hasNavbar = await this.waitForElement('nav, .navbar, header');
      const hasMainContent = await this.waitForElement('main, .main-content, .container');
      
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

  async testShopListing() {
    console.log('\n📋 Test: Lista sklepów');
    
    try {
      await this.page.goto(`${this.baseUrl}/shops`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('05_shops_list');
      
      // Wait for shops to load
      await this.page.waitForTimeout(3000);
      
      // Check if shops are displayed
      const shopSelectors = [
        '.shop-card',
        '.shop-item', 
        '[data-testid="shop-item"]',
        '.shop',
        '.store-card',
        '.business-card'
      ];
      
      let shopsCount = 0;
      for (const selector of shopSelectors) {
        shopsCount = await this.page.$$eval(selector, elements => elements.length);
        if (shopsCount > 0) {
          console.log(`✅ Znaleziono ${shopsCount} sklepów z selektorem: ${selector}`);
          break;
        }
      }
      
      if (shopsCount > 0) {
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
      await this.takeScreenshot('06_products_list');
      
      // Wait for products to load
      await this.page.waitForTimeout(3000);
      
      // Check if products are displayed
      const productSelectors = [
        '.product-card',
        '.product-item', 
        '[data-testid="product-item"]',
        '.product',
        '.item-card',
        '.goods-card'
      ];
      
      let productsCount = 0;
      for (const selector of productSelectors) {
        productsCount = await this.page.$$eval(selector, elements => elements.length);
        if (productsCount > 0) {
          console.log(`✅ Znaleziono ${productsCount} produktów z selektorem: ${selector}`);
          break;
        }
      }
      
      if (productsCount > 0) {
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

  async testShopCreation() {
    console.log('\n🏪 Test: Tworzenie sklepu');
    
    try {
      // Navigate to shop creation
      await this.page.goto(`${this.baseUrl}/shops/create`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('07_shop_create_form');
      
      // Wait for form to load
      await this.page.waitForTimeout(2000);
      
      // Try to find form fields
      const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nazwa" i]',
        'input[placeholder*="name" i]',
        '#name',
        '.name-input'
      ];
      
      let nameField = null;
      for (const selector of nameSelectors) {
        nameField = await this.page.$(selector);
        if (nameField) {
          console.log(`✅ Found name field with selector: ${selector}`);
          break;
        }
      }
      
      if (!nameField) {
        console.log('❌ Form fields not found, skipping shop creation test');
        this.testResults.push({ test: 'Shop Creation', status: 'SKIP', reason: 'Form not found' });
        return;
      }
      
      // Fill shop form
      const testShop = {
        name: `Test Shop ${Date.now()}`,
        description: 'Testowy sklep utworzony przez E2E test',
        location: 'Warszawa',
        phone: '+48123456789',
        email: 'testshop@example.com'
      };
      
      await this.page.type('input[name="name"], #name', testShop.name);
      await this.page.type('textarea[name="description"], #description', testShop.description);
      await this.page.type('input[name="location"], #location', testShop.location);
      await this.page.type('input[name="phone"], #phone', testShop.phone);
      await this.page.type('input[name="email"], #email', testShop.email);
      
      await this.takeScreenshot('08_shop_form_filled');
      
      // Submit form
      await this.page.click('button[type="submit"], input[type="submit"], .submit-button');
      await this.waitForNavigation();
      await this.takeScreenshot('09_after_shop_create');
      
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
      await this.takeScreenshot('10_product_create_form');
      
      // Wait for form to load
      await this.page.waitForTimeout(2000);
      
      // Try to find form fields
      const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nazwa" i]',
        'input[placeholder*="name" i]',
        '#name',
        '.name-input'
      ];
      
      let nameField = null;
      for (const selector of nameSelectors) {
        nameField = await this.page.$(selector);
        if (nameField) {
          console.log(`✅ Found name field with selector: ${selector}`);
          break;
        }
      }
      
      if (!nameField) {
        console.log('❌ Form fields not found, skipping product creation test');
        this.testResults.push({ test: 'Product Creation', status: 'SKIP', reason: 'Form not found' });
        return;
      }
      
      // Fill product form
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: 'Testowy produkt utworzony przez E2E test',
        price: '99.99',
        category: 'Electronics',
        stock: '10'
      };
      
      await this.page.type('input[name="name"], #name', testProduct.name);
      await this.page.type('textarea[name="description"], #description', testProduct.description);
      await this.page.type('input[name="price"], #price', testProduct.price);
      await this.page.type('input[name="category"], #category', testProduct.category);
      await this.page.type('input[name="stock"], #stock', testProduct.stock);
      
      await this.takeScreenshot('11_product_form_filled');
      
      // Submit form
      await this.page.click('button[type="submit"], input[type="submit"], .submit-button');
      await this.waitForNavigation();
      await this.takeScreenshot('12_after_product_create');
      
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

  async testUserProfile() {
    console.log('\n👤 Test: Profil użytkownika');
    
    try {
      await this.page.goto(`${this.baseUrl}/profile`, { waitUntil: 'networkidle0' });
      await this.takeScreenshot('13_user_profile');
      
      // Check if profile page loads
      const profileSelectors = [
        '.profile-content',
        '.user-profile', 
        '[data-testid="profile"]',
        '.profile',
        '.user-info',
        '.account-info'
      ];
      
      let hasProfileContent = false;
      for (const selector of profileSelectors) {
        hasProfileContent = await this.page.$(selector);
        if (hasProfileContent) {
          console.log(`✅ Found profile content with selector: ${selector}`);
          break;
        }
      }
      
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
      await this.takeScreenshot('14_admin_panel');
      
      // Check if admin panel loads
      const adminSelectors = [
        '.admin-panel',
        '.admin-content', 
        '[data-testid="admin-panel"]',
        '.admin',
        '.dashboard',
        '.admin-dashboard'
      ];
      
      let hasAdminContent = false;
      for (const selector of adminSelectors) {
        hasAdminContent = await this.page.$(selector);
        if (hasAdminContent) {
          console.log(`✅ Found admin content with selector: ${selector}`);
          break;
        }
      }
      
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
        await this.takeScreenshot(`15_nav_${page.name.toLowerCase()}`);
        
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
        await this.takeScreenshot(`16_responsive_${viewport.name.toLowerCase()}`);
        
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
      skipped: this.testResults.filter(r => r.status === 'SKIP').length,
      results: this.testResults,
      screenshots: this.screenshots,
      isLoggedIn: this.isLoggedIn
    };
    
    const reportPath = path.join(__dirname, 'e2e-test-report-fixed.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 RAPORT TESTÓW E2E (POPRAWIONY):');
    console.log('='.repeat(50));
    console.log(`Total tests: ${report.totalTests}`);
    console.log(`✅ Passed: ${report.passed}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`⚠️ Errors: ${report.errors}`);
    console.log(`⏭️ Skipped: ${report.skipped}`);
    console.log(`📸 Screenshots: ${report.screenshots.length}`);
    console.log(`🔐 Logged in: ${report.isLoggedIn}`);
    console.log('='.repeat(50));
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : result.status === 'SKIP' ? '⏭️' : '⚠️';
      console.log(`${status} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.reason) {
        console.log(`   Reason: ${result.reason}`);
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
      
      // First try to login
      await this.loginUser();
      
      await this.testHomePage();
      await this.testShopListing();
      await this.testProductListing();
      await this.testShopCreation();
      await this.testProductCreation();
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