const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class PortalMonitor {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = [];
        this.screenshotsDir = path.join(__dirname, 'screenshots');
        this.portalUrl = 'https://portal-frontend.onrender.com'; // Sprawdź czy to Twój URL
        this.renderUrl = 'https://dashboard.render.com';
    }

    async init() {
        console.log('🚀 Inicjalizacja monitoringu portalu...');
        
        // Utwórz katalog na screenshoty
        await fs.ensureDir(this.screenshotsDir);
        
        // Uruchom przeglądarkę
        this.browser = await puppeteer.launch({
            headless: false, // false = widoczna przeglądarka (łatwiejsze debugowanie)
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        
        // Ustaw timeout
        this.page.setDefaultTimeout(30000);
        
        console.log('✅ Monitoring zainicjalizowany');
    }

    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        const filepath = path.join(this.screenshotsDir, filename);
        
        await this.page.screenshot({ 
            path: filepath, 
            fullPage: true 
        });
        
        console.log(`📸 Screenshot: ${filename}`);
        return filepath;
    }

    async logResult(testName, success, message = '', screenshot = null) {
        const result = {
            test: testName,
            success,
            message,
            timestamp: new Date().toISOString(),
            screenshot
        };
        
        this.results.push(result);
        
        const status = success ? '✅' : '❌';
        console.log(`${status} ${testName}: ${message}`);
        
        if (!success && screenshot) {
            console.log(`   📸 Screenshot: ${screenshot}`);
        }
    }

    async testPortalHealth() {
        console.log('\n🔍 Test 1: Sprawdzanie dostępności portalu');
        
        try {
            await this.page.goto(this.portalUrl, { waitUntil: 'networkidle2' });
            
            // Sprawdź czy strona się załadowała
            const title = await this.page.title();
            
            if (title && title !== '') {
                await this.logResult('Portal Health', true, `Strona załadowana: ${title}`);
            } else {
                const screenshot = await this.takeScreenshot('portal-health-error');
                await this.logResult('Portal Health', false, 'Strona nie załadowała się poprawnie', screenshot);
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('portal-health-error');
            await this.logResult('Portal Health', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async testRegistration() {
        console.log('\n🔍 Test 2: Test rejestracji użytkownika');
        
        try {
            // Przejdź do strony rejestracji
            await this.page.goto(`${this.portalUrl}/register`, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie formularza
            await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
            
            // Wypełnij formularz
            const testEmail = `test${Date.now()}@example.com`;
            await this.page.type('input[type="email"]', testEmail);
            await this.page.type('input[type="password"]', 'test123456');
            await this.page.type('input[name="confirmPassword"]', 'test123456');
            
            // Kliknij przycisk rejestracji
            await this.page.click('button[type="submit"]');
            
            // Poczekaj na odpowiedź
            await this.page.waitForTimeout(3000);
            
            // Sprawdź czy rejestracja się powiodła
            const currentUrl = this.page.url();
            if (currentUrl.includes('/login') || currentUrl.includes('/dashboard')) {
                await this.logResult('Registration', true, 'Rejestracja zakończona pomyślnie');
            } else {
                // Sprawdź czy są błędy
                const errors = await this.page.$$('.error-message, .alert-danger');
                if (errors.length > 0) {
                    const errorText = await this.page.evaluate(() => {
                        const errorEl = document.querySelector('.error-message, .alert-danger');
                        return errorEl ? errorEl.textContent : 'Nieznany błąd';
                    });
                    
                    const screenshot = await this.takeScreenshot('registration-error');
                    await this.logResult('Registration', false, `Błąd rejestracji: ${errorText}`, screenshot);
                } else {
                    const screenshot = await this.takeScreenshot('registration-unknown');
                    await this.logResult('Registration', false, 'Nieznany status rejestracji', screenshot);
                }
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('registration-error');
            await this.logResult('Registration', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async testLogin() {
        console.log('\n🔍 Test 3: Test logowania');
        
        try {
            // Przejdź do strony logowania
            await this.page.goto(`${this.portalUrl}/login`, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie formularza
            await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
            
            // Wypełnij formularz (użyj istniejącego użytkownika)
            await this.page.type('input[type="email"]', 'admin@example.com');
            await this.page.type('input[type="password"]', 'admin123');
            
            // Kliknij przycisk logowania
            await this.page.click('button[type="submit"]');
            
            // Poczekaj na odpowiedź
            await this.page.waitForTimeout(3000);
            
            // Sprawdź czy logowanie się powiodło
            const currentUrl = this.page.url();
            if (currentUrl.includes('/dashboard') || currentUrl.includes('/profile')) {
                await this.logResult('Login', true, 'Logowanie zakończone pomyślnie');
            } else {
                // Sprawdź czy są błędy
                const errors = await this.page.$$('.error-message, .alert-danger');
                if (errors.length > 0) {
                    const errorText = await this.page.evaluate(() => {
                        const errorEl = document.querySelector('.error-message, .alert-danger');
                        return errorEl ? errorEl.textContent : 'Nieznany błąd';
                    });
                    
                    const screenshot = await this.takeScreenshot('login-error');
                    await this.logResult('Login', false, `Błąd logowania: ${errorText}`, screenshot);
                } else {
                    const screenshot = await this.takeScreenshot('login-unknown');
                    await this.logResult('Login', false, 'Nieznany status logowania', screenshot);
                }
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('login-error');
            await this.logResult('Login', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async testShopCreation() {
        console.log('\n🔍 Test 4: Test dodawania sklepu');
        
        try {
            // Przejdź do strony dodawania sklepu
            await this.page.goto(`${this.portalUrl}/shop/create`, { waitUntil: 'networkidle2' });
            
            // Sprawdź czy jesteśmy zalogowani
            const currentUrl = this.page.url();
            if (currentUrl.includes('/login')) {
                await this.logResult('Shop Creation', false, 'Wymagane logowanie');
                return;
            }
            
            // Poczekaj na załadowanie formularza
            await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
            
            // Wypełnij formularz
            const shopName = `Test Shop ${Date.now()}`;
            await this.page.type('input[name="name"]', shopName);
            await this.page.type('textarea[name="description"]', 'Testowy sklep do monitoringu');
            await this.page.type('input[name="address"]', 'Testowa ulica 123, Warszawa');
            
            // Kliknij przycisk dodawania
            await this.page.click('button[type="submit"]');
            
            // Poczekaj na odpowiedź
            await this.page.waitForTimeout(3000);
            
            // Sprawdź czy sklep został dodany
            const currentUrlAfter = this.page.url();
            if (currentUrlAfter.includes('/shop/') && !currentUrlAfter.includes('/create')) {
                await this.logResult('Shop Creation', true, 'Sklep został dodany pomyślnie');
            } else {
                const screenshot = await this.takeScreenshot('shop-creation-error');
                await this.logResult('Shop Creation', false, 'Błąd podczas dodawania sklepu', screenshot);
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('shop-creation-error');
            await this.logResult('Shop Creation', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async testProductCreation() {
        console.log('\n🔍 Test 5: Test dodawania produktu');
        
        try {
            // Przejdź do strony dodawania produktu
            await this.page.goto(`${this.portalUrl}/product/create`, { waitUntil: 'networkidle2' });
            
            // Sprawdź czy jesteśmy zalogowani
            const currentUrl = this.page.url();
            if (currentUrl.includes('/login')) {
                await this.logResult('Product Creation', false, 'Wymagane logowanie');
                return;
            }
            
            // Poczekaj na załadowanie formularza
            await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
            
            // Wypełnij formularz
            const productName = `Test Product ${Date.now()}`;
            await this.page.type('input[name="name"]', productName);
            await this.page.type('textarea[name="description"]', 'Testowy produkt do monitoringu');
            await this.page.type('input[name="price"]', '99.99');
            
            // Kliknij przycisk dodawania
            await this.page.click('button[type="submit"]');
            
            // Poczekaj na odpowiedź
            await this.page.waitForTimeout(3000);
            
            // Sprawdź czy produkt został dodany
            const currentUrlAfter = this.page.url();
            if (currentUrlAfter.includes('/product/') && !currentUrlAfter.includes('/create')) {
                await this.logResult('Product Creation', true, 'Produkt został dodany pomyślnie');
            } else {
                const screenshot = await this.takeScreenshot('product-creation-error');
                await this.logResult('Product Creation', false, 'Błąd podczas dodawania produktu', screenshot);
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('product-creation-error');
            await this.logResult('Product Creation', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async generateReport() {
        console.log('\n📊 Generowanie raportu...');
        
        const report = {
            timestamp: new Date().toISOString(),
            totalTests: this.results.length,
            passedTests: this.results.filter(r => r.success).length,
            failedTests: this.results.filter(r => !r.success).length,
            results: this.results
        };
        
        // Zapisz raport do pliku
        const reportPath = path.join(__dirname, `report_${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeJson(reportPath, report, { spaces: 2 });
        
        console.log(`📄 Raport zapisany: ${reportPath}`);
        
        // Wyświetl podsumowanie
        console.log('\n📈 PODSUMOWANIE:');
        console.log(`✅ Testy zakończone pomyślnie: ${report.passedTests}`);
        console.log(`❌ Testy zakończone niepowodzeniem: ${report.failedTests}`);
        console.log(`📊 Łącznie testów: ${report.totalTests}`);
        
        if (report.failedTests > 0) {
            console.log('\n❌ BŁĘDY:');
            this.results.filter(r => !r.success).forEach(result => {
                console.log(`   - ${result.test}: ${result.message}`);
            });
        }
        
        return report;
    }

    async run() {
        try {
            await this.init();
            
            // Uruchom wszystkie testy
            await this.testPortalHealth();
            await this.testRegistration();
            await this.testLogin();
            await this.testShopCreation();
            await this.testProductCreation();
            
            // Wygeneruj raport
            await this.generateReport();
            
        } catch (error) {
            console.error('❌ Błąd podczas monitoringu:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Uruchom monitoring
if (require.main === module) {
    const monitor = new PortalMonitor();
    monitor.run();
}

module.exports = PortalMonitor; 