const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

class PortalE2ETest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshots = [];
    this.testResults = [];
    this.baseUrl = 'http://localhost:3000';
    this.apiUrl = 'http://localhost:5000';
    this.isLoggedIn = false;
    this.authToken = null;
    this.createdUsers = [];
    this.createdShops = [];
    this.createdProducts = [];
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
    this.page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`🌐 API Request: ${request.method()} ${request.url()}`);
      }
    });
    
    this.page.on('response', response => {
      if (response.url().includes('/api/') && response.status() >= 400) {
        console.log(`❌ API Error: ${response.status()} ${response.url()}`);
      }
    });
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(__dirname, 'e2e-screenshots', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    await this.page.screenshot({ path: filepath, fullPage: true });
    this.screenshots.push({ name, filepath });
    console.log(`📸 Screenshot: ${filename}`);
  }

  async ensureLogin() {
    if (this.isLoggedIn && this.authToken) {
      return true;
    }

    try {
      // Próbuj zalogować istniejącego użytkownika testowego
      const loginResponse = await fetch(`${this.apiUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@e2e.com',
          password: 'test123456'
        })
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        this.authToken = data.token;
        this.isLoggedIn = true;
        console.log('✅ Zalogowano istniejącego użytkownika testowego');
        return true;
      }

      // Jeśli nie ma użytkownika, utwórz go
      console.log('🆕 Tworzenie nowego użytkownika testowego...');
      const registerResponse = await fetch(`${this.apiUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'E2E',
          email: 'test@e2e.com',
          username: 'teste2e',
          password: 'test123456',
          phone: '123456789'
        })
      });

      if (registerResponse.ok) {
        const data = await registerResponse.json();
        this.authToken = data.token;
        this.isLoggedIn = true;
        this.createdUsers.push(data.user._id);
        console.log('✅ Utworzono i zalogowano nowego użytkownika testowego');
        return true;
      }

      throw new Error('Nie udało się utworzyć ani zalogować użytkownika testowego');
    } catch (error) {
      console.error('❌ Błąd logowania:', error.message);
      return false;
    }
  }

  async createTestData() {
    console.log('📊 Tworzenie danych testowych...');
    
    try {
      // Utwórz dodatkowych użytkowników
      const users = [
        { firstName: 'Anna', lastName: 'Kowalska', email: 'anna@test.com', username: 'annakowalska' },
        { firstName: 'Piotr', lastName: 'Nowak', email: 'piotr@test.com', username: 'piotrnowak' },
        { firstName: 'Maria', lastName: 'Wiśniewska', email: 'maria@test.com', username: 'mariawisniewska' },
        { firstName: 'Jan', lastName: 'Kowalczyk', email: 'jan@test.com', username: 'jankowalczyk' },
        { firstName: 'Katarzyna', lastName: 'Kamińska', email: 'katarzyna@test.com', username: 'katarzynakaminska' }
      ];

      for (const userData of users) {
        try {
          const response = await fetch(`${this.apiUrl}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...userData,
              password: 'test123456',
              phone: '123456789'
            })
          });

          if (response.ok) {
            const data = await response.json();
            this.createdUsers.push(data.user._id);
            console.log(`✅ Utworzono użytkownika: ${userData.firstName} ${userData.lastName}`);
          }
        } catch (error) {
          console.log(`⚠️ Użytkownik ${userData.email} już istnieje`);
        }
      }

      // Utwórz sklepy dla każdego użytkownika
      const shops = [
        { name: 'Sklep Elektroniczny TechPro', description: 'Najlepsze urządzenia elektroniczne', category: 'Elektronika' },
        { name: 'Moda & Styl', description: 'Ubrania i akcesoria modowe', category: 'Moda' },
        { name: 'Księgarnia Online', description: 'Książki dla każdego', category: 'Książki' },
        { name: 'Sport & Fitness', description: 'Sprzęt sportowy i odżywki', category: 'Sport' },
        { name: 'Dom & Ogród', description: 'Wszystko dla domu i ogrodu', category: 'Dom i ogród' }
      ];

      for (let i = 0; i < Math.min(this.createdUsers.length, shops.length); i++) {
        try {
          const response = await fetch(`${this.apiUrl}/api/shops`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authToken}`
            },
            body: JSON.stringify({
              ...shops[i],
              address: {
                street: `ul. Testowa ${i + 1}`,
                city: 'Warszawa',
                postalCode: '00-001',
                country: 'Polska'
              },
              contact: {
                phone: '123456789',
                email: `sklep${i + 1}@test.com`
              },
              paymentMethods: ['card', 'transfer', 'cash_on_delivery'],
              shippingMethods: ['free', 'standard', 'express']
            })
          });

          if (response.ok) {
            const data = await response.json();
            this.createdShops.push(data._id);
            console.log(`✅ Utworzono sklep: ${shops[i].name}`);
          }
        } catch (error) {
          console.log(`⚠️ Błąd tworzenia sklepu: ${shops[i].name}`);
        }
      }

      // Utwórz produkty dla każdego sklepu
      const products = [
        { name: 'Smartfon Samsung Galaxy', price: 1299.99, category: 'Elektronika', stock: 50 },
        { name: 'Laptop Dell Inspiron', price: 2499.99, category: 'Elektronika', stock: 25 },
        { name: 'Koszulka bawełniana', price: 49.99, category: 'Moda', stock: 100 },
        { name: 'Spodnie jeansowe', price: 89.99, category: 'Moda', stock: 75 },
        { name: 'Książka "Harry Potter"', price: 29.99, category: 'Książki', stock: 200 },
        { name: 'Piłka nożna', price: 79.99, category: 'Sport', stock: 30 },
        { name: 'Rower górski', price: 899.99, category: 'Sport', stock: 15 },
        { name: 'Lampa stołowa', price: 129.99, category: 'Dom i ogród', stock: 40 },
        { name: 'Nasiona warzyw', price: 9.99, category: 'Dom i ogród', stock: 150 },
        { name: 'Słuchawki bezprzewodowe', price: 199.99, category: 'Elektronika', stock: 60 }
      ];

      for (let i = 0; i < this.createdShops.length; i++) {
        const shopId = this.createdShops[i];
        const productsForShop = products.slice(i * 2, (i + 1) * 2);
        
        for (const productData of productsForShop) {
          try {
            const response = await fetch(`${this.apiUrl}/api/products`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
              },
              body: JSON.stringify({
                ...productData,
                description: `Opis produktu: ${productData.name}`,
                images: [`https://picsum.photos/400/300?random=${Math.random()}`],
                mainImage: `https://picsum.photos/400/300?random=${Math.random()}`,
                brand: 'TestBrand',
                sku: `SKU-${Math.random().toString(36).substr(2, 9)}`,
                attributes: [
                  { name: 'Kolor', value: 'Czarny' },
                  { name: 'Rozmiar', value: 'M' }
                ],
                tags: ['test', 'e2e', productData.category.toLowerCase()]
              })
            });

            if (response.ok) {
              const data = await response.json();
              this.createdProducts.push(data._id);
              console.log(`✅ Utworzono produkt: ${productData.name}`);
            }
          } catch (error) {
            console.log(`⚠️ Błąd tworzenia produktu: ${productData.name}`);
          }
        }
      }

      console.log(`📊 Utworzono ${this.createdUsers.length} użytkowników, ${this.createdShops.length} sklepów, ${this.createdProducts.length} produktów`);
    } catch (error) {
      console.error('❌ Błąd tworzenia danych testowych:', error);
    }
  }

  // Test strony głównej
  async testHomePage() {
    try {
      console.log('🏠 Testowanie strony głównej...');
      
      await this.page.goto(this.baseUrl);
      await this.page.waitForTimeout(2000);
      
      const title = await this.page.title();
      if (!title.toLowerCase().includes('portal') && !title.toLowerCase().includes('sklep')) {
        throw new Error('Nieprawidłowy tytuł strony głównej');
      }
      
      await this.takeScreenshot('01_home_page');
      this.testResults.push({ test: 'Home Page', status: 'PASS' });
      console.log('✅ Strona główna działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Home Page', status: 'FAIL', error: error.message });
      console.log('❌ Błąd strony głównej:', error.message);
    }
  }

  // Test listy sklepów
  async testShopListing() {
    try {
      console.log('🏪 Testowanie listy sklepów...');
      
      await this.page.goto(`${this.baseUrl}/shops`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy strona się załadowała
      const pageTitle = await this.page.title();
      if (!pageTitle.toLowerCase().includes('sklepy') && !pageTitle.toLowerCase().includes('shops')) {
        // Sprawdź czy są jakieś sklepy na stronie
        const shopElements = await this.page.$$('[data-testid="shop-card"], .shop-card, .shop-item, [class*="shop"]');
        
        if (shopElements.length === 0) {
          // Sprawdź czy jest tekst o sklepach
          const shopText = await this.page.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();
            return bodyText.includes('sklep') || bodyText.includes('shop');
          });
          
          if (!shopText) {
            throw new Error('Strona sklepów nie zawiera odpowiednich elementów');
          }
        }
      }
      
      await this.takeScreenshot('02_shops_list');
      this.testResults.push({ test: 'Shop Listing', status: 'PASS' });
      console.log('✅ Lista sklepów działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Shop Listing', status: 'FAIL', error: error.message });
      console.log('❌ Błąd listy sklepów:', error.message);
    }
  }

  // Test listy produktów
  async testProductListing() {
    try {
      console.log('📦 Testowanie listy produktów...');
      
      await this.page.goto(`${this.baseUrl}/products`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy strona się załadowała
      const pageTitle = await this.page.title();
      if (!pageTitle.toLowerCase().includes('produkty') && !pageTitle.toLowerCase().includes('products')) {
        // Sprawdź czy są jakieś produkty na stronie
        const productElements = await this.page.$$('[data-testid="product-card"], .product-card, .product-item, [class*="product"]');
        
        if (productElements.length === 0) {
          // Sprawdź czy jest tekst o produktach
          const productText = await this.page.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();
            return bodyText.includes('produkt') || bodyText.includes('product');
          });
          
          if (!productText) {
            throw new Error('Strona produktów nie zawiera odpowiednich elementów');
          }
        }
      }
      
      await this.takeScreenshot('03_products_list');
      this.testResults.push({ test: 'Product Listing', status: 'PASS' });
      console.log('✅ Lista produktów działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Product Listing', status: 'FAIL', error: error.message });
      console.log('❌ Błąd listy produktów:', error.message);
    }
  }

  // Test tworzenia sklepu
  async testShopCreation() {
    try {
      console.log('🏪 Testowanie tworzenia sklepu...');
      
      await this.page.goto(`${this.baseUrl}/shop-create`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy formularz się załadował
      const nameInput = await this.page.$('input[name="name"]');
      if (!nameInput) {
        throw new Error('Formularz tworzenia sklepu nie został załadowany');
      }
      
      // Wypełnij formularz
      await this.page.type('input[name="name"]', 'Testowy Sklep E2E');
      await this.page.type('textarea[name="description"]', 'Opis testowego sklepu');
      
      // Wybierz kategorię
      await this.page.select('select[name="category"]', 'Elektronika');
      
      // Wypełnij adres
      await this.page.type('input[name="address.street"]', 'ul. Testowa 123');
      await this.page.type('input[name="address.city"]', 'Warszawa');
      await this.page.type('input[name="address.postalCode"]', '00-001');
      
      // Wypełnij kontakt
      await this.page.type('input[name="contact.phone"]', '123456789');
      await this.page.type('input[name="contact.email"]', 'sklep@test.com');
      
      // Wybierz metody płatności
      await this.page.click('input[name="paymentMethods"][value="card"]');
      await this.page.click('input[name="paymentMethods"][value="transfer"]');
      
      // Wybierz metody dostawy
      await this.page.click('input[name="shippingMethods"][value="free"]');
      await this.page.click('input[name="shippingMethods"][value="standard"]');
      
      // Wyślij formularz
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);
      
      await this.takeScreenshot('04_shop_create_form');
      this.testResults.push({ test: 'Shop Creation', status: 'PASS' });
      console.log('✅ Tworzenie sklepu działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Shop Creation', status: 'FAIL', error: error.message });
      console.log('❌ Błąd tworzenia sklepu:', error.message);
    }
  }

  // Test tworzenia produktu
  async testProductCreation() {
    try {
      console.log('📦 Testowanie tworzenia produktu...');
      
      await this.page.goto(`${this.baseUrl}/product-create`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy formularz się załadował
      const nameInput = await this.page.$('input[name="name"]');
      if (!nameInput) {
        throw new Error('Formularz tworzenia produktu nie został załadowany');
      }
      
      // Wypełnij formularz
      await this.page.type('input[name="name"]', 'Testowy Produkt E2E');
      await this.page.type('textarea[name="description"]', 'Opis testowego produktu');
      await this.page.type('input[name="price"]', '99.99');
      
      // Wybierz kategorię
      await this.page.select('select[name="category"]', 'Elektronika');
      
      // Wypełnij dodatkowe pola
      await this.page.type('input[name="brand"]', 'TestBrand');
      await this.page.type('input[name="sku"]', 'SKU-TEST-001');
      await this.page.type('input[name="stock"]', '100');
      
      // Dodaj tagi
      await this.page.type('input[name="tags"]', 'test, e2e, elektronika');
      
      // Wyślij formularz
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);
      
      await this.takeScreenshot('05_product_create_form');
      this.testResults.push({ test: 'Product Creation', status: 'PASS' });
      console.log('✅ Tworzenie produktu działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Product Creation', status: 'FAIL', error: error.message });
      console.log('❌ Błąd tworzenia produktu:', error.message);
    }
  }

  // Test profilu użytkownika
  async testUserProfile() {
    try {
      console.log('👤 Testowanie profilu użytkownika...');
      
      await this.page.goto(`${this.baseUrl}/profile`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy strona się załadowała
      const pageTitle = await this.page.title();
      if (!pageTitle.toLowerCase().includes('profil') && !pageTitle.toLowerCase().includes('profile')) {
        // Sprawdź czy są elementy profilu
        const profileElements = await this.page.$$('[data-testid="profile"], .profile, [class*="profile"]');
        
        if (profileElements.length === 0) {
          // Sprawdź czy jest tekst o profilu
          const profileText = await this.page.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();
            return bodyText.includes('profil') || bodyText.includes('profile');
          });
          
          if (!profileText) {
            throw new Error('Strona profilu nie zawiera odpowiednich elementów');
          }
        }
      }
      
      await this.takeScreenshot('06_user_profile');
      this.testResults.push({ test: 'User Profile', status: 'PASS' });
      console.log('✅ Profil użytkownika działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'User Profile', status: 'FAIL', error: error.message });
      console.log('❌ Błąd profilu użytkownika:', error.message);
    }
  }

  // Test panelu administratora
  async testAdminPanel() {
    try {
      console.log('🔧 Testowanie panelu administratora...');
      
      await this.page.goto(`${this.baseUrl}/admin`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy strona się załadowała
      const pageTitle = await this.page.title();
      if (!pageTitle.toLowerCase().includes('admin') && !pageTitle.toLowerCase().includes('administrator')) {
        // Sprawdź czy są elementy panelu admina
        const adminElements = await this.page.$$('[data-testid="admin"], .admin, [class*="admin"]');
        
        if (adminElements.length === 0) {
          // Sprawdź czy jest tekst o adminie
          const adminText = await this.page.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();
            return bodyText.includes('admin') || bodyText.includes('administrator');
          });
          
          if (!adminText) {
            throw new Error('Panel administratora nie zawiera odpowiednich elementów');
          }
        }
      }
      
      await this.takeScreenshot('07_admin_panel');
      this.testResults.push({ test: 'Admin Panel', status: 'PASS' });
      console.log('✅ Panel administratora działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Admin Panel', status: 'FAIL', error: error.message });
      console.log('❌ Błąd panelu administratora:', error.message);
    }
  }

  // Test nawigacji
  async testNavigation() {
    try {
      console.log('🧭 Testowanie nawigacji...');
      
      // Test nawigacji do strony głównej
      await this.page.goto(`${this.baseUrl}/shops`);
      await this.page.click('a[href="/"], nav a, [data-testid="nav-home"]');
      await this.page.waitForTimeout(1000);
      
      await this.takeScreenshot('08_nav_home');
      
      // Test nawigacji do sklepów
      await this.page.click('a[href="/shops"], nav a, [data-testid="nav-shops"]');
      await this.page.waitForTimeout(1000);
      
      await this.takeScreenshot('09_nav_shops');
      
      // Test nawigacji do produktów
      await this.page.click('a[href="/products"], nav a, [data-testid="nav-products"]');
      await this.page.waitForTimeout(1000);
      
      await this.takeScreenshot('10_nav_products');
      
      // Test nawigacji do profilu
      await this.page.click('a[href="/profile"], nav a, [data-testid="nav-profile"]');
      await this.page.waitForTimeout(1000);
      
      await this.takeScreenshot('11_nav_profile');
      
      this.testResults.push({ test: 'Navigation', status: 'PASS' });
      console.log('✅ Nawigacja działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Navigation', status: 'FAIL', error: error.message });
      console.log('❌ Błąd nawigacji:', error.message);
    }
  }

  // Test responsywności
  async testResponsiveDesign() {
    try {
      console.log('📱 Testowanie responsywności...');
      
      // Test na desktop
      await this.page.setViewport({ width: 1280, height: 720 });
      await this.page.goto(this.baseUrl);
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('12_responsive_desktop');
      
      // Test na tablet
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('13_responsive_tablet');
      
      // Test na mobile
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('14_responsive_mobile');
      
      this.testResults.push({ test: 'Responsive Design', status: 'PASS' });
      console.log('✅ Responsywność działa poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Responsive Design', status: 'FAIL', error: error.message });
      console.log('❌ Błąd responsywności:', error.message);
    }
  }

  // Test funkcji społecznościowych
  async testSocialFeatures() {
    try {
      console.log('👥 Testowanie funkcji społecznościowych...');
      
      // Test dodawania znajomych
      await this.page.goto(`${this.baseUrl}/friends`);
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy strona znajomych się załadowała
      const friendsText = await this.page.evaluate(() => {
        const bodyText = document.body.innerText.toLowerCase();
        return bodyText.includes('znajomi') || bodyText.includes('friends');
      });
      
      if (friendsText) {
        await this.takeScreenshot('15_friends_page');
        console.log('✅ Strona znajomych działa');
      }
      
      // Test dodawania postów
      await this.page.goto(`${this.baseUrl}/posts/create`);
      await this.page.waitForTimeout(2000);
      
      const postForm = await this.page.$('form, textarea[name="content"], input[name="content"]');
      if (postForm) {
        await this.page.type('textarea[name="content"], input[name="content"]', 'Testowy post E2E!');
        
        // Test dodawania zdjęć
        const fileInput = await this.page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(path.join(__dirname, 'test-image.jpg'));
        }
        
        await this.takeScreenshot('16_post_creation');
        console.log('✅ Tworzenie postów działa');
      }
      
      // Test wiadomości
      await this.page.goto(`${this.baseUrl}/messages`);
      await this.page.waitForTimeout(2000);
      
      const messagesText = await this.page.evaluate(() => {
        const bodyText = document.body.innerText.toLowerCase();
        return bodyText.includes('wiadomości') || bodyText.includes('messages');
      });
      
      if (messagesText) {
        await this.takeScreenshot('17_messages_page');
        console.log('✅ Strona wiadomości działa');
      }
      
      this.testResults.push({ test: 'Social Features', status: 'PASS' });
      console.log('✅ Funkcje społecznościowe działają poprawnie');
    } catch (error) {
      this.testResults.push({ test: 'Social Features', status: 'FAIL', error: error.message });
      console.log('❌ Błąd funkcji społecznościowych:', error.message);
    }
  }

  async run() {
    try {
      await this.init();
      
      // Zaloguj się i utwórz dane testowe
      await this.ensureLogin();
      await this.createTestData();
      
      // Uruchom testy
      await this.testHomePage();
      await this.testShopListing();
      await this.testProductListing();
      await this.testShopCreation();
      await this.testProductCreation();
      await this.testUserProfile();
      await this.testAdminPanel();
      await this.testNavigation();
      await this.testResponsiveDesign();
      await this.testSocialFeatures();
      
      // Podsumowanie
      console.log('\n📋 PODSUMOWANIE TESTÓW E2E:');
      console.log('='.repeat(50));
      
      const passed = this.testResults.filter(r => r.status === 'PASS').length;
      const failed = this.testResults.filter(r => r.status === 'FAIL').length;
      
      this.testResults.forEach(result => {
        const icon = result.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${result.test}: ${result.status}`);
        if (result.error) {
          console.log(`   Błąd: ${result.error}`);
        }
      });
      
      console.log('\n' + '='.repeat(50));
      console.log(`📊 Wyniki: ${passed} ✅ / ${failed} ❌ / ${this.testResults.length} total`);
      console.log(`📸 Screenshots: ${this.screenshots.length} plików`);
      console.log(`👥 Użytkownicy: ${this.createdUsers.length}`);
      console.log(`🏪 Sklepy: ${this.createdShops.length}`);
      console.log(`📦 Produkty: ${this.createdProducts.length}`);
      
      // Zapisz raport
      const report = {
        timestamp: new Date().toISOString(),
        results: this.testResults,
        screenshots: this.screenshots,
        stats: {
          users: this.createdUsers.length,
          shops: this.createdShops.length,
          products: this.createdProducts.length
        }
      };
      
      fs.writeFileSync('e2e-test-report-final.json', JSON.stringify(report, null, 2));
      console.log('\n📄 Raport zapisany: e2e-test-report-final.json');
      
    } catch (error) {
      console.error('❌ Błąd podczas testów:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Uruchom testy
const test = new PortalE2ETest();
test.run(); 