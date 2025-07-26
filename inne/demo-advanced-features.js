#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

console.log('🎯 DEMONSTRACJA ZAWAANSOWANYCH FUNKCJI:');
console.log('✅ System rekomendacji produktów (AI)');
console.log('✅ A/B Testing dla optymalizacji konwersji');
console.log('✅ System lojalnościowy z punktami i nagrodami');
console.log('✅ System znajomych z pełną funkcjonalnością');
console.log('✅ Motywy: Domyślny, Ciemny, Terminal');
console.log('✅ Responsywny design dla wszystkich urządzeń');

class AdvancedFeaturesDemo {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshots = [];
    this.baseUrl = 'https://portal-frontend-ysqz.onrender.com';
  }

  async init() {
    console.log('🚀 Inicjalizacja demonstracji...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Ustaw user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('✅ Browser zainicjalizowany');
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join('demo-advanced-screenshots', filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true 
    });
    
    this.screenshots.push({ name, filepath });
    console.log(`📸 Screenshot: ${filename}`);
  }

  async demoRecommendationSystem() {
    console.log('🧠 Demonstracja systemu rekomendacji...');
    
    try {
      await this.page.goto(`${this.baseUrl}/products`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy komponent rekomendacji jest widoczny
      const recommendationsVisible = await this.page.evaluate(() => {
        const recommendations = document.querySelector('[data-testid="product-recommendations"]');
        return !!recommendations;
      });
      
      if (recommendationsVisible) {
        console.log('✅ System rekomendacji aktywny');
        
        // Przełącz między algorytmami
        const algorithms = ['personalized', 'collaborative', 'content_based', 'popular', 'trending'];
        
        for (const algorithm of algorithms) {
          try {
            await this.page.click(`[data-algorithm="${algorithm}"]`);
            await this.page.waitForTimeout(1000);
            console.log(`✅ Algorytm ${algorithm} przełączony`);
          } catch (error) {
            console.log(`⚠️ Algorytm ${algorithm} niedostępny`);
          }
        }
        
        await this.takeScreenshot('01-recommendation-system');
      } else {
        console.log('⚠️ System rekomendacji niedostępny');
      }
      
    } catch (error) {
      console.error('❌ Błąd demonstracji rekomendacji:', error.message);
    }
  }

  async demoLoyaltySystem() {
    console.log('🎁 Demonstracja systemu lojalnościowego...');
    
    try {
      // Przejdź do profilu użytkownika
      await this.page.goto(`${this.baseUrl}/profile`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy system lojalnościowy jest widoczny
      const loyaltyVisible = await this.page.evaluate(() => {
        const loyalty = document.querySelector('[data-testid="loyalty-system"]');
        return !!loyalty;
      });
      
      if (loyaltyVisible) {
        console.log('✅ System lojalnościowy aktywny');
        
        // Sprawdź różne zakładki
        const tabs = ['overview', 'badges', 'rewards', 'history'];
        
        for (const tab of tabs) {
          try {
            await this.page.click(`[data-tab="${tab}"]`);
            await this.page.waitForTimeout(1000);
            console.log(`✅ Zakładka ${tab} otwarta`);
          } catch (error) {
            console.log(`⚠️ Zakładka ${tab} niedostępna`);
          }
        }
        
        await this.takeScreenshot('02-loyalty-system');
      } else {
        console.log('⚠️ System lojalnościowy niedostępny');
      }
      
    } catch (error) {
      console.error('❌ Błąd demonstracji lojalności:', error.message);
    }
  }

  async demoABTesting() {
    console.log('🧪 Demonstracja A/B testing...');
    
    try {
      await this.page.goto(`${this.baseUrl}/products`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy testy A/B są aktywne
      const abTestInfo = await this.page.evaluate(() => {
        const abTestElement = document.querySelector('[data-testid="ab-test-info"]');
        return abTestElement ? abTestElement.textContent : null;
      });
      
      if (abTestInfo) {
        console.log('✅ A/B testing aktywny:', abTestInfo);
        await this.takeScreenshot('03-ab-testing');
      } else {
        console.log('⚠️ A/B testing niedostępny');
      }
      
    } catch (error) {
      console.error('❌ Błąd demonstracji A/B testing:', error.message);
    }
  }

  async demoThemeSystem() {
    console.log('🎨 Demonstracja systemu motywów...');
    
    try {
      await this.page.goto(`${this.baseUrl}`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      // Sprawdź czy przycisk zmiany motywu jest widoczny
      const themeButton = await this.page.$('[data-testid="theme-toggle"]');
      
      if (themeButton) {
        console.log('✅ System motywów aktywny');
        
        // Kliknij przycisk motywu
        await themeButton.click();
        await this.page.waitForTimeout(1000);
        
        // Sprawdź dostępne motywy
        const themes = ['default', 'dark', 'terminal'];
        
        for (const theme of themes) {
          try {
            await this.page.click(`[data-theme="${theme}"]`);
            await this.page.waitForTimeout(2000);
            console.log(`✅ Motyw ${theme} zastosowany`);
            await this.takeScreenshot(`04-theme-${theme}`);
          } catch (error) {
            console.log(`⚠️ Motyw ${theme} niedostępny`);
          }
        }
        
      } else {
        console.log('⚠️ System motywów niedostępny');
      }
      
    } catch (error) {
      console.error('❌ Błąd demonstracji motywów:', error.message);
    }
  }

  async demoAdvancedUI() {
    console.log('✨ Demonstracja zaawansowanego UI...');
    
    try {
      await this.page.goto(`${this.baseUrl}/products`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);
      
      // Sprawdź zaawansowane filtry
      const advancedFilters = await this.page.$('[data-testid="advanced-filters"]');
      if (advancedFilters) {
        console.log('✅ Zaawansowane filtry dostępne');
        await this.takeScreenshot('05-advanced-filters');
      }
      
      // Sprawdź system ocen
      const ratingSystem = await this.page.$('[data-testid="rating-system"]');
      if (ratingSystem) {
        console.log('✅ System ocen dostępny');
        await this.takeScreenshot('06-rating-system');
      }
      
      // Sprawdź chat
      const chatSystem = await this.page.$('[data-testid="live-chat"]');
      if (chatSystem) {
        console.log('✅ System czatu dostępny');
        await this.takeScreenshot('07-live-chat');
      }
      
    } catch (error) {
      console.error('❌ Błąd demonstracji UI:', error.message);
    }
  }

  async demoResponsiveDesign() {
    console.log('📱 Demonstracja responsywnego designu...');
    
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 1024, height: 768 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      try {
        await this.page.setViewport(viewport);
        await this.page.waitForTimeout(1000);
        
        console.log(`✅ Viewport ${viewport.name} (${viewport.width}x${viewport.height})`);
        await this.takeScreenshot(`08-responsive-${viewport.name}`);
        
      } catch (error) {
        console.error(`❌ Błąd viewport ${viewport.name}:`, error.message);
      }
    }
  }

  async generateReport() {
    console.log('📋 Generowanie raportu demonstracji...');
    
    const report = {
      timestamp: new Date().toISOString(),
      features: {
        recommendationSystem: this.screenshots.some(s => s.name.includes('recommendation')),
        loyaltySystem: this.screenshots.some(s => s.name.includes('loyalty')),
        abTesting: this.screenshots.some(s => s.name.includes('ab-testing')),
        themeSystem: this.screenshots.some(s => s.name.includes('theme')),
        advancedUI: this.screenshots.some(s => s.name.includes('advanced')),
        responsiveDesign: this.screenshots.some(s => s.name.includes('responsive'))
      },
      screenshots: this.screenshots,
      summary: {
        totalScreenshots: this.screenshots.length,
        successRate: Math.round((this.screenshots.length / 10) * 100)
      }
    };
    
    // Zapisz raport JSON
    const reportPath = path.join('demo-advanced-screenshots', 'advanced-demo-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Zapisz raport HTML
    const htmlReport = this.generateHTMLReport(report);
    const htmlPath = path.join('demo-advanced-screenshots', 'advanced-demo-report.html');
    fs.writeFileSync(htmlPath, htmlReport);
    
    console.log('📊 Raport zapisany:', reportPath);
    console.log('🌐 Raport HTML:', htmlPath);
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raport Demonstracji Zaawansowanych Funkcji</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .feature { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .feature.success { border-color: #4caf50; background: #f1f8e9; }
        .feature.warning { border-color: #ff9800; background: #fff3e0; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .screenshot { text-align: center; }
        .screenshot img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; }
        .summary { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .timestamp { color: #666; font-size: 14px; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Raport Demonstracji Zaawansowanych Funkcji</h1>
        
        <div class="summary">
            <h2>📊 Podsumowanie</h2>
            <p><strong>Zrzuty ekranu:</strong> ${report.summary.totalScreenshots}</p>
            <p><strong>Wskaźnik sukcesu:</strong> ${report.summary.successRate}%</p>
            <p><strong>Data:</strong> ${new Date(report.timestamp).toLocaleString('pl-PL')}</p>
        </div>
        
        <div class="feature ${report.features.recommendationSystem ? 'success' : 'warning'}">
            <h3>🧠 System Rekomendacji</h3>
            <p>${report.features.recommendationSystem ? '✅ Aktywny' : '⚠️ Niedostępny'}</p>
        </div>
        
        <div class="feature ${report.features.loyaltySystem ? 'success' : 'warning'}">
            <h3>🎁 System Lojalnościowy</h3>
            <p>${report.features.loyaltySystem ? '✅ Aktywny' : '⚠️ Niedostępny'}</p>
        </div>
        
        <div class="feature ${report.features.abTesting ? 'success' : 'warning'}">
            <h3>🧪 A/B Testing</h3>
            <p>${report.features.abTesting ? '✅ Aktywny' : '⚠️ Niedostępny'}</p>
        </div>
        
        <div class="feature ${report.features.themeSystem ? 'success' : 'warning'}">
            <h3>🎨 System Motywów</h3>
            <p>${report.features.themeSystem ? '✅ Aktywny' : '⚠️ Niedostępny'}</p>
        </div>
        
        <div class="feature ${report.features.advancedUI ? 'success' : 'warning'}">
            <h3>✨ Zaawansowane UI</h3>
            <p>${report.features.advancedUI ? '✅ Aktywne' : '⚠️ Niedostępne'}</p>
        </div>
        
        <div class="feature ${report.features.responsiveDesign ? 'success' : 'warning'}">
            <h3>📱 Responsywny Design</h3>
            <p>${report.features.responsiveDesign ? '✅ Aktywny' : '⚠️ Niedostępny'}</p>
        </div>
        
        <h2>📸 Zrzuty Ekranu</h2>
        <div class="screenshots">
            ${report.screenshots.map(screenshot => `
                <div class="screenshot">
                    <h4>${screenshot.name}</h4>
                    <img src="${path.basename(screenshot.filepath)}" alt="${screenshot.name}">
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            Wygenerowano: ${new Date(report.timestamp).toLocaleString('pl-PL')}
        </div>
    </div>
</body>
</html>
    `;
  }

  async run() {
    try {
      await this.init();
      
      // Utwórz katalog na zrzuty ekranu
      const screenshotsDir = 'demo-advanced-screenshots';
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
      }
      
      // Uruchom demonstracje
      await this.demoRecommendationSystem();
      await this.demoLoyaltySystem();
      await this.demoABTesting();
      await this.demoThemeSystem();
      await this.demoAdvancedUI();
      await this.demoResponsiveDesign();
      
      // Wygeneruj raport
      await this.generateReport();
      
      console.log('🎉 Demonstracja zakończona pomyślnie!');
      console.log(`📸 Wygenerowano ${this.screenshots.length} zrzutów ekranu`);
      
    } catch (error) {
      console.error('❌ Błąd demonstracji:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Uruchom demonstrację
const demo = new AdvancedFeaturesDemo();
demo.run(); 