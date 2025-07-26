// Kompleksowy skrypt testowania Chrome z Puppeteer - BEZPIECZEŃSTWO + WSZYSTKIE PODSTRONY
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';
const backendUrl = 'https://portal-backend-igf9.onrender.com';

// Upewnij się, że katalog screenshots istnieje
const screenshotsDir = 'D:/portal/puppeteer-comprehensive-test';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Lista wszystkich podstron do przetestowania
const pagesToTest = [
    { path: '/', name: 'Strona główna' },
    { path: '/login', name: 'Logowanie' },
    { path: '/register', name: 'Rejestracja' },
    { path: '/products', name: 'Lista produktów' },
    { path: '/shops', name: 'Lista sklepów' },
    { path: '/messages', name: 'Wiadomości' },
    { path: '/gamification', name: 'Gamifikacja' },
    { path: '/notifications', name: 'Powiadomienia' },
    { path: '/shop-create', name: 'Tworzenie sklepu' },
    { path: '/product-create', name: 'Tworzenie produktu' },
    { path: '/shop-management', name: 'Zarządzanie sklepami' },
    { path: '/product-management', name: 'Zarządzanie produktami' },
    { path: '/layout-customization', name: 'Dostosowanie wyglądu' },
    { path: '/profile', name: 'Profil użytkownika' },
    { path: '/search', name: 'Wyszukiwanie' },
    { path: '/settings', name: 'Ustawienia' },
    { path: '/voivodeships', name: 'Województwa' },
    { path: '/counties', name: 'Powiaty' },
    { path: '/municipalities', name: 'Gminy' },
    { path: '/admin-panel', name: 'Panel admina' },
    { path: '/payment', name: 'Płatności' },
    { path: '/location', name: 'Wybór lokalizacji' }
];

// Testy bezpieczeństwa
const securityTests = [
    { name: 'SQL Injection', payloads: ["' OR '1'='1", "'; DROP TABLE users; --", "1' UNION SELECT * FROM users --"] },
    { name: 'XSS', payloads: ["<script>alert('XSS')</script>", "<img src=x onerror=alert('XSS')>", "javascript:alert('XSS')"] },
    { name: 'NoSQL Injection', payloads: ["{\"$gt\":\"\"}", "{\"$ne\":null}", "{\"$where\":\"1==1\"}"] },
    { name: 'Path Traversal', payloads: ["../../../etc/passwd", "..\\..\\..\\windows\\system32\\config\\sam", "....//....//....//etc/passwd"] },
    { name: 'Command Injection', payloads: ["; ls -la", "| cat /etc/passwd", "&& rm -rf /"] }
];

async function testPortalComprehensive() {
    console.log('🚀 Kompleksowe testowanie portalu - BEZPIECZEŃSTWO + WSZYSTKIE PODSTRONY...');
    
    let browser;
    let page;
    let testResults = {
        pages: [],
        security: [],
        forms: [],
        errors: []
    };
    
    try {
        // Uruchom Chrome
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 500
        });
        
        page = await browser.newPage();
        
        // Przechwytuj logi konsoli
        page.on('console', msg => {
            const level = msg.type();
            const text = msg.text();
            const timestamp = new Date().toISOString();
            
            console.log(`[${timestamp}] [${level.toUpperCase()}] ${text}`);
            
            const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${text}\n`;
            fs.appendFileSync('D:/portal/puppeteer-comprehensive-logs.txt', logEntry);
        });
        
        // Przechwytuj błędy
        page.on('pageerror', error => {
            console.log(`❌ Błąd strony: ${error.message}`);
            testResults.errors.push({
                type: 'page_error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            fs.appendFileSync('D:/portal/puppeteer-comprehensive-errors.txt', `${new Date().toISOString()}: ${error.message}\n`);
        });
        
        // Przechwytuj błędy sieciowe
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`⚠️ Błąd HTTP ${response.status()}: ${response.url()}`);
                testResults.errors.push({
                    type: 'http_error',
                    status: response.status(),
                    url: response.url(),
                    timestamp: new Date().toISOString()
                });
            }
        });

        // ===== TEST 0: PODGLĄD STRONY SKLEPU NA LOKALNYM FRONTENDZIE =====
        console.log('\n🛒 TEST 0: Podgląd sklepu na localhost:3000');
        try {
            await page.goto('http://localhost:3000/shop/6875d1867f40145e58a47086', { waitUntil: 'networkidle2' });
            await page.waitForTimeout(3000);
            const shopScreenshotPath = `${screenshotsDir}/shop_6875d1867f40145e58a47086_${Date.now()}.png`;
            await page.screenshot({ path: shopScreenshotPath });
            console.log(`Zapisano screenshot: ${shopScreenshotPath}`);
            testResults.pages.push({
                name: 'Shop 6875d1867f40145e58a47086',
                url: 'http://localhost:3000/shop/6875d1867f40145e58a47086',
                screenshot: shopScreenshotPath,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('❌ Błąd podczas testu sklepu:', err);
            testResults.errors.push({
                type: 'shop_page_error',
                message: err.message,
                timestamp: new Date().toISOString()
            });
        }

        // ===== TEST 1: REJESTRACJA UŻYTKOWNIKA =====
        console.log('\n📝 TEST 1: Rejestracja nowego użytkownika');
        const timestamp = Date.now();
        const testUser = {
            firstName: `TestUser${timestamp}`,
            lastName: `TestLastName${timestamp}`,
            email: `test${timestamp}@example.com`,
            password: 'Test123!',
            phone: '+48 123 456 789',
            city: 'Warszawa',
            dateOfBirth: '1990-01-01', // Dodaję datę urodzenia
            username: `testuser${timestamp}` // Dodaję username
        };
        
        await page.goto(`${frontendUrl}/register`);
        await page.waitForTimeout(2000);
        
        // Wypełnij formularz rejestracji
        await page.type('input[name="firstName"]', testUser.firstName);
        await page.type('input[name="lastName"]', testUser.lastName);
        await page.type('input[name="email"]', testUser.email);
        await page.type('input[name="password"]', testUser.password);
        await page.type('input[name="confirmPassword"]', testUser.password);
        await page.type('input[name="phone"]', testUser.phone);
        await page.type('input[name="city"]', testUser.city);
        await page.type('input[name="username"]', testUser.username);
        await page.type('input[name="dateOfBirth"]', testUser.dateOfBirth);
        await page.click('input[name="acceptTerms"]');
        await page.click('input[name="acceptNewsletter"]');
        
        const registerScreenshotPath = `${screenshotsDir}/01_register_form_${timestamp}.png`;
        await page.screenshot({ path: registerScreenshotPath });
        
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        testResults.forms.push({
            name: 'Rejestracja',
            success: true,
            screenshot: registerScreenshotPath,
            timestamp: new Date().toISOString()
        });

        // ===== TEST 2: LOGOWANIE =====
        console.log('\n🔐 TEST 2: Logowanie');
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(2000);
        
        await page.type('input[name="emailOrUsername"]', testUser.email);
        await page.type('input[name="password"]', testUser.password);
        
        const loginScreenshotPath = `${screenshotsDir}/02_login_form_${timestamp}.png`;
        await page.screenshot({ path: loginScreenshotPath });
        
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        testResults.forms.push({
            name: 'Logowanie',
            success: true,
            screenshot: loginScreenshotPath,
            timestamp: new Date().toISOString()
        });

        // ===== TEST 3: TESTY BEZPIECZEŃSTWA NA FORMULARZACH =====
        console.log('\n🛡️ TEST 3: Testy bezpieczeństwa na formularzach');
        
        for (const securityTest of securityTests) {
            console.log(`\n🔒 Test: ${securityTest.name}`);
            
            for (const payload of securityTest.payloads) {
                console.log(`  🎯 Payload: ${payload.substring(0, 50)}...`);
                
                try {
                    // Test na formularzu logowania
                    await page.goto(`${frontendUrl}/login`);
                    await page.waitForTimeout(1000);
                    
                    // Wyczyść pola
                    await page.evaluate(() => {
                        document.querySelectorAll('input').forEach(input => input.value = '');
                    });
                    
                    // Wstaw payload
                    await page.type('input[name="emailOrUsername"]', payload);
                    await page.type('input[name="password"]', payload);
                    
                    const securityScreenshotPath = `${screenshotsDir}/security_${securityTest.name}_${Date.now()}.png`;
                    await page.screenshot({ path: securityScreenshotPath });
                    
                    // Sprawdź czy strona się nie zawiesiła
                    const pageContent = await page.content();
                    const hasError = pageContent.includes('error') || pageContent.includes('exception');
                    
                    testResults.security.push({
                        test: securityTest.name,
                        payload: payload,
                        success: !hasError,
                        screenshot: securityScreenshotPath,
                        timestamp: new Date().toISOString()
                    });
                    
                    await page.waitForTimeout(1000);
                    
                } catch (error) {
                    testResults.security.push({
                        test: securityTest.name,
                        payload: payload,
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }

        // ===== TEST 4: TESTY WSZYSTKICH PODSTRON =====
        console.log('\n🌐 TEST 4: Testy wszystkich podstron');
        
        for (const pageInfo of pagesToTest) {
            console.log(`\n📄 Test: ${pageInfo.name} (${pageInfo.path})`);
            
            try {
                await page.goto(`${frontendUrl}${pageInfo.path}`);
                await page.waitForTimeout(3000);
                
                // Sprawdź czy strona się załadowała
                const pageTitle = await page.title();
                const pageContent = await page.content();
                
                // Sprawdź czy nie ma błędów 404/500
                const hasError = pageContent.includes('404') || 
                               pageContent.includes('500') || 
                               pageContent.includes('Error') ||
                               pageContent.includes('Not Found');
                
                const screenshotPath = `${screenshotsDir}/page_${pageInfo.name.replace(/\s+/g, '_')}_${timestamp}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
                
                // Sprawdź czy są formularze na stronie
                const forms = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('form')).map(form => ({
                        action: form.action,
                        method: form.method,
                        inputs: Array.from(form.querySelectorAll('input, textarea, select')).map(input => ({
                            name: input.name,
                            type: input.type,
                            required: input.required
                        }))
                    }));
                });
                
                testResults.pages.push({
                    name: pageInfo.name,
                    path: pageInfo.path,
                    success: !hasError,
                    title: pageTitle,
                    forms: forms,
                    screenshot: screenshotPath,
                    timestamp: new Date().toISOString()
                });
                
                // Test formularzy na tej stronie
                for (const form of forms) {
                    console.log(`  📝 Formularz: ${form.action || 'brak action'} (${form.inputs.length} pól)`);
                    
                    // Test wypełnienia formularza (jeśli to nie jest formularz logowania/wylogowania)
                    if (!form.action.includes('login') && !form.action.includes('logout')) {
                        try {
                            // Wypełnij pola formularza
                            for (const input of form.inputs) {
                                if (input.name && input.type !== 'submit' && input.type !== 'button') {
                                    const testValue = `test_${input.name}_${Date.now()}`;
                                    await page.type(`input[name="${input.name}"]`, testValue);
                                }
                            }
                            
                            const formScreenshotPath = `${screenshotsDir}/form_${pageInfo.name}_${Date.now()}.png`;
                            await page.screenshot({ path: formScreenshotPath });
                            
                            testResults.forms.push({
                                name: `Formularz na ${pageInfo.name}`,
                                success: true,
                                screenshot: formScreenshotPath,
                                timestamp: new Date().toISOString()
                            });
                            
                        } catch (error) {
                            testResults.forms.push({
                                name: `Formularz na ${pageInfo.name}`,
                                success: false,
                                error: error.message,
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                }
                
            } catch (error) {
                testResults.pages.push({
                    name: pageInfo.name,
                    path: pageInfo.path,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // ===== TEST 5: TESTY DOSTĘPU BEZ AUTORYZACJI =====
        console.log('\n🚫 TEST 5: Testy dostępu bez autoryzacji');
        
        // Wyloguj użytkownika
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(2000);
        
        const protectedPages = [
            '/profile',
            '/shop-management',
            '/product-management',
            '/admin-panel',
            '/settings'
        ];
        
        for (const protectedPage of protectedPages) {
            console.log(`\n🔒 Test dostępu do: ${protectedPage}`);
            
            try {
                await page.goto(`${frontendUrl}${protectedPage}`);
                await page.waitForTimeout(3000);
                
                const currentUrl = page.url();
                const isRedirected = currentUrl.includes('/login') || currentUrl.includes('/register');
                
                const unauthorizedScreenshotPath = `${screenshotsDir}/unauthorized_${protectedPage.replace(/\//g, '_')}_${timestamp}.png`;
                await page.screenshot({ path: unauthorizedScreenshotPath });
                
                testResults.security.push({
                    test: 'Unauthorized Access',
                    page: protectedPage,
                    success: isRedirected, // Sukces jeśli zostało przekierowane
                    screenshot: unauthorizedScreenshotPath,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                testResults.security.push({
                    test: 'Unauthorized Access',
                    page: protectedPage,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // ===== TEST 6: TESTY XSS W POLACH WYSZUKIWANIA =====
        console.log('\n🔍 TEST 6: Testy XSS w polach wyszukiwania');
        
        const searchPages = ['/search', '/products', '/shops'];
        const xssPayloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            'javascript:alert("XSS")',
            '"><script>alert("XSS")</script>',
            '"><img src=x onerror=alert("XSS")>'
        ];
        
        for (const searchPage of searchPages) {
            console.log(`\n🔍 Test XSS na: ${searchPage}`);
            
            try {
                await page.goto(`${frontendUrl}${searchPage}`);
                await page.waitForTimeout(2000);
                
                // Znajdź pole wyszukiwania
                const searchInput = await page.$('input[type="text"], input[placeholder*="szukaj"], input[name*="search"]');
                
                if (searchInput) {
                    for (const payload of xssPayloads) {
                        await page.type('input[type="text"], input[placeholder*="szukaj"], input[name*="search"]', payload);
                        await page.waitForTimeout(1000);
                        
                        const xssScreenshotPath = `${screenshotsDir}/xss_${searchPage.replace(/\//g, '_')}_${Date.now()}.png`;
                        await page.screenshot({ path: xssScreenshotPath });
                        
                        // Sprawdź czy nie ma alertów
                        const hasAlert = await page.evaluate(() => {
                            return window.alert !== undefined;
                        });
                        
                        testResults.security.push({
                            test: 'XSS in Search',
                            page: searchPage,
                            payload: payload,
                            success: !hasAlert,
                            screenshot: xssScreenshotPath,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
                
            } catch (error) {
                testResults.security.push({
                    test: 'XSS in Search',
                    page: searchPage,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // ===== TEST 7: TESTY CSRF =====
        console.log('\n🛡️ TEST 7: Testy CSRF');
        
        try {
            // Sprawdź czy formularze mają tokeny CSRF
            await page.goto(`${frontendUrl}/login`);
            await page.waitForTimeout(2000);
            
            const csrfTokens = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('input[name*="csrf"], input[name*="token"], input[type="hidden"]'))
                    .map(input => ({ name: input.name, value: input.value }));
            });
            
            testResults.security.push({
                test: 'CSRF Protection',
                success: csrfTokens.length > 0,
                tokens: csrfTokens,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            testResults.security.push({
                test: 'CSRF Protection',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // ===== TEST 8: TESTY WYLOGOWANIA =====
        console.log('\n🚪 TEST 8: Wylogowanie');
        
        try {
            // Przejdź do strony głównej
            await page.goto(frontendUrl);
            await page.waitForTimeout(3000);
            
            // Spróbuj znaleźć i kliknąć przycisk wylogowania
            const logoutButton = await page.$('[style*="cursor: pointer"]');
            if (logoutButton) {
                await logoutButton.click();
                await page.waitForTimeout(1000);
                
                // Kliknij w "Wyloguj"
                await page.click('div:contains("🚪 Wyloguj"), div:contains("Wyloguj")');
                await page.waitForTimeout(3000);
            }
            
            const logoutScreenshotPath = `${screenshotsDir}/logout_${timestamp}.png`;
            await page.screenshot({ path: logoutScreenshotPath });
            
            testResults.forms.push({
                name: 'Wylogowanie',
                success: true,
                screenshot: logoutScreenshotPath,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            testResults.forms.push({
                name: 'Wylogowanie',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // ===== ZAPISZ WYNIKI =====
        console.log('\n💾 Zapisuję wyniki testów...');
        
        const resultsPath = `${screenshotsDir}/test_results_${timestamp}.json`;
        fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
        
        // Podsumowanie
        const pagesSuccess = testResults.pages.filter(p => p.success).length;
        const securitySuccess = testResults.security.filter(s => s.success).length;
        const formsSuccess = testResults.forms.filter(f => f.success).length;
        
        console.log('\n📊 PODSUMOWANIE TESTÓW:');
        console.log(`📄 Podstrony: ${pagesSuccess}/${testResults.pages.length} pomyślnie`);
        console.log(`🛡️ Bezpieczeństwo: ${securitySuccess}/${testResults.security.length} pomyślnie`);
        console.log(`📝 Formularze: ${formsSuccess}/${testResults.forms.length} pomyślnie`);
        console.log(`❌ Błędy: ${testResults.errors.length}`);
        
        console.log(`\n✅ Wszystkie testy zakończone!`);
        console.log(`📁 Screenshoty: ${screenshotsDir}`);
        console.log(`📄 Logi: D:/portal/puppeteer-comprehensive-logs.txt`);
        console.log(`❌ Błędy: D:/portal/puppeteer-comprehensive-errors.txt`);
        console.log(`📊 Wyniki: ${resultsPath}`);
        
    } catch (error) {
        console.error('❌ Błąd podczas testowania:', error);
        
        if (page) {
            const errorScreenshotPath = `${screenshotsDir}/ERROR_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: errorScreenshotPath });
            console.log(`📸 Screenshot błędu: ${errorScreenshotPath}`);
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔌 Przeglądarka zamknięta');
        }
    }
}

// Uruchom kompleksowe testowanie
testPortalComprehensive(); 