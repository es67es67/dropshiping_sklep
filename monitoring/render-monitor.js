const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class RenderMonitor {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = [];
        this.screenshotsDir = path.join(__dirname, 'render-screenshots');
        this.renderUrl = 'https://dashboard.render.com';
        
        // Konfiguracja - zastąp swoimi danymi
        this.renderEmail = 'es67jw@gmail.com';
        this.renderPassword = 'Supertajne';
        this.frontendServiceId = 'srv-d1n82obe5dus73c95ilg';
        this.backendServiceId = 'srv-d1n82oje5dus73c95in0';
    }

    async init() {
        console.log('🚀 Inicjalizacja monitoringu Render...');
        
        // Utwórz katalog na screenshoty
        await fs.ensureDir(this.screenshotsDir);
        
        // Uruchom przeglądarkę
        this.browser = await puppeteer.launch({
            headless: false, // false = widoczna przeglądarka
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        
        // Ustaw timeout
        this.page.setDefaultTimeout(30000);
        
        console.log('✅ Monitoring Render zainicjalizowany');
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

    async loginToRender() {
        console.log('\n🔍 Logowanie do Render...');
        
        try {
            // Przejdź do strony logowania
            await this.page.goto(this.renderUrl, { waitUntil: 'networkidle2' });
            
            // Sprawdź czy już jesteśmy zalogowani
            const isLoggedIn = await this.page.$('[data-testid="user-menu"]');
            if (isLoggedIn) {
                await this.logResult('Render Login', true, 'Już zalogowany');
                return true;
            }
            
            // Kliknij przycisk logowania
            await this.page.click('a[href="/login"]');
            await this.page.waitForTimeout(2000);
            
            // Wypełnij formularz logowania
            await this.page.type('input[type="email"]', this.renderEmail);
            await this.page.type('input[type="password"]', this.renderPassword);
            
            // Kliknij przycisk logowania
            await this.page.click('button[type="submit"]');
            
            // Poczekaj na przekierowanie
            await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
            
            // Sprawdź czy logowanie się powiodło
            const dashboardElement = await this.page.$('[data-testid="dashboard"]');
            if (dashboardElement) {
                await this.logResult('Render Login', true, 'Logowanie zakończone pomyślnie');
                return true;
            } else {
                const screenshot = await this.takeScreenshot('render-login-error');
                await this.logResult('Render Login', false, 'Błąd logowania do Render', screenshot);
                return false;
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('render-login-error');
            await this.logResult('Render Login', false, `Błąd: ${error.message}`, screenshot);
            return false;
        }
    }

    async checkBackendStatus() {
        console.log('\n🔍 Sprawdzanie statusu backendu...');
        
        try {
            // Przejdź do strony backendu
            const backendUrl = `${this.renderUrl}/web/${this.backendServiceId}`;
            await this.page.goto(backendUrl, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie
            await this.page.waitForTimeout(3000);
            
            // Sprawdź status usługi
            const statusElement = await this.page.$('[data-testid="service-status"]');
            if (statusElement) {
                const status = await this.page.evaluate(el => el.textContent, statusElement);
                
                if (status.toLowerCase().includes('live') || status.toLowerCase().includes('running')) {
                    await this.logResult('Backend Status', true, `Status: ${status}`);
                } else {
                    const screenshot = await this.takeScreenshot('backend-status-error');
                    await this.logResult('Backend Status', false, `Status: ${status}`, screenshot);
                }
            } else {
                const screenshot = await this.takeScreenshot('backend-status-unknown');
                await this.logResult('Backend Status', false, 'Nie można określić statusu', screenshot);
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('backend-status-error');
            await this.logResult('Backend Status', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async checkFrontendStatus() {
        console.log('\n🔍 Sprawdzanie statusu frontendu...');
        
        try {
            // Przejdź do strony frontendu
            const frontendUrl = `${this.renderUrl}/web/${this.frontendServiceId}`;
            await this.page.goto(frontendUrl, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie
            await this.page.waitForTimeout(3000);
            
            // Sprawdź status usługi
            const statusElement = await this.page.$('[data-testid="service-status"]');
            if (statusElement) {
                const status = await this.page.evaluate(el => el.textContent, statusElement);
                
                if (status.toLowerCase().includes('live') || status.toLowerCase().includes('running')) {
                    await this.logResult('Frontend Status', true, `Status: ${status}`);
                } else {
                    const screenshot = await this.takeScreenshot('frontend-status-error');
                    await this.logResult('Frontend Status', false, `Status: ${status}`, screenshot);
                }
            } else {
                const screenshot = await this.takeScreenshot('frontend-status-unknown');
                await this.logResult('Frontend Status', false, 'Nie można określić statusu', screenshot);
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('frontend-status-error');
            await this.logResult('Frontend Status', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async checkBackendLogs() {
        console.log('\n🔍 Sprawdzanie logów backendu...');
        
        try {
            // Przejdź do logów backendu
            const logsUrl = `${this.renderUrl}/web/${this.backendServiceId}/logs`;
            await this.page.goto(logsUrl, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie logów
            await this.page.waitForTimeout(5000);
            
            // Sprawdź czy są błędy w logach
            const errorLogs = await this.page.$$('.log-entry.error, .log-entry[data-level="error"]');
            
            if (errorLogs.length > 0) {
                // Pobierz tekst błędów
                const errorMessages = await this.page.evaluate(() => {
                    const errors = document.querySelectorAll('.log-entry.error, .log-entry[data-level="error"]');
                    return Array.from(errors).slice(0, 5).map(el => el.textContent.trim());
                });
                
                const screenshot = await this.takeScreenshot('backend-logs-errors');
                await this.logResult('Backend Logs', false, `Znaleziono ${errorLogs.length} błędów: ${errorMessages.join(', ')}`, screenshot);
            } else {
                await this.logResult('Backend Logs', true, 'Brak błędów w logach');
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('backend-logs-error');
            await this.logResult('Backend Logs', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async checkFrontendLogs() {
        console.log('\n🔍 Sprawdzanie logów frontendu...');
        
        try {
            // Przejdź do logów frontendu
            const logsUrl = `${this.renderUrl}/web/${this.frontendServiceId}/logs`;
            await this.page.goto(logsUrl, { waitUntil: 'networkidle2' });
            
            // Poczekaj na załadowanie logów
            await this.page.waitForTimeout(5000);
            
            // Sprawdź czy są błędy w logach
            const errorLogs = await this.page.$$('.log-entry.error, .log-entry[data-level="error"]');
            
            if (errorLogs.length > 0) {
                // Pobierz tekst błędów
                const errorMessages = await this.page.evaluate(() => {
                    const errors = document.querySelectorAll('.log-entry.error, .log-entry[data-level="error"]');
                    return Array.from(errors).slice(0, 5).map(el => el.textContent.trim());
                });
                
                const screenshot = await this.takeScreenshot('frontend-logs-errors');
                await this.logResult('Frontend Logs', false, `Znaleziono ${errorLogs.length} błędów: ${errorMessages.join(', ')}`, screenshot);
            } else {
                await this.logResult('Frontend Logs', true, 'Brak błędów w logach');
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('frontend-logs-error');
            await this.logResult('Frontend Logs', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async checkRecentDeploys() {
        console.log('\n🔍 Sprawdzanie ostatnich deployów...');
        
        try {
            // Sprawdź deployy backendu
            const backendDeployUrl = `${this.renderUrl}/web/${this.backendServiceId}/deploys`;
            await this.page.goto(backendDeployUrl, { waitUntil: 'networkidle2' });
            
            await this.page.waitForTimeout(3000);
            
            // Sprawdź status ostatniego deployu
            const deployStatus = await this.page.$('.deploy-status');
            if (deployStatus) {
                const status = await this.page.evaluate(el => el.textContent, deployStatus);
                
                if (status.toLowerCase().includes('success') || status.toLowerCase().includes('live')) {
                    await this.logResult('Backend Deploy', true, `Status: ${status}`);
                } else {
                    const screenshot = await this.takeScreenshot('backend-deploy-error');
                    await this.logResult('Backend Deploy', false, `Status: ${status}`, screenshot);
                }
            }
            
            // Sprawdź deployy frontendu
            const frontendDeployUrl = `${this.renderUrl}/web/${this.frontendServiceId}/deploys`;
            await this.page.goto(frontendDeployUrl, { waitUntil: 'networkidle2' });
            
            await this.page.waitForTimeout(3000);
            
            const frontendDeployStatus = await this.page.$('.deploy-status');
            if (frontendDeployStatus) {
                const status = await this.page.evaluate(el => el.textContent, frontendDeployStatus);
                
                if (status.toLowerCase().includes('success') || status.toLowerCase().includes('live')) {
                    await this.logResult('Frontend Deploy', true, `Status: ${status}`);
                } else {
                    const screenshot = await this.takeScreenshot('frontend-deploy-error');
                    await this.logResult('Frontend Deploy', false, `Status: ${status}`, screenshot);
                }
            }
            
        } catch (error) {
            const screenshot = await this.takeScreenshot('deploy-check-error');
            await this.logResult('Deploy Check', false, `Błąd: ${error.message}`, screenshot);
        }
    }

    async generateReport() {
        console.log('\n📊 Generowanie raportu Render...');
        
        const report = {
            timestamp: new Date().toISOString(),
            totalTests: this.results.length,
            passedTests: this.results.filter(r => r.success).length,
            failedTests: this.results.filter(r => !r.success).length,
            results: this.results
        };
        
        // Zapisz raport do pliku
        const reportPath = path.join(__dirname, `render_report_${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeJson(reportPath, report, { spaces: 2 });
        
        console.log(`📄 Raport Render zapisany: ${reportPath}`);
        
        // Wyświetl podsumowanie
        console.log('\n📈 PODSUMOWANIE RENDER:');
        console.log(`✅ Testy zakończone pomyślnie: ${report.passedTests}`);
        console.log(`❌ Testy zakończone niepowodzeniem: ${report.failedTests}`);
        console.log(`📊 Łącznie testów: ${report.totalTests}`);
        
        if (report.failedTests > 0) {
            console.log('\n❌ BŁĘDY RENDER:');
            this.results.filter(r => !r.success).forEach(result => {
                console.log(`   - ${result.test}: ${result.message}`);
            });
        }
        
        return report;
    }

    async run() {
        try {
            await this.init();
            
            // Zaloguj się do Render
            const loginSuccess = await this.loginToRender();
            
            if (loginSuccess) {
                // Sprawdź status usług
                await this.checkBackendStatus();
                await this.checkFrontendStatus();
                
                // Sprawdź logi
                await this.checkBackendLogs();
                await this.checkFrontendLogs();
                
                // Sprawdź deployy
                await this.checkRecentDeploys();
            }
            
            // Wygeneruj raport
            await this.generateReport();
            
        } catch (error) {
            console.error('❌ Błąd podczas monitoringu Render:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Uruchom monitoring
if (require.main === module) {
    const monitor = new RenderMonitor();
    monitor.run();
}

module.exports = RenderMonitor; 