#!/usr/bin/env node

/**
 * 🚀 SKRYPT URUCHAMIAJĄCY ULEPSZONY PORTAL E-COMMERCE
 * 
 * Ten skrypt uruchamia backend i frontend z wszystkimi nowymi funkcjami
 * zainspirowanymi największymi platformami e-commerce.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class EnhancedPortalLauncher {
  constructor() {
    this.backendProcess = null;
    this.frontendProcess = null;
    this.isRunning = false;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async checkDependencies() {
    this.log('🔍 Sprawdzanie zależności...');
    
    const requiredFiles = [
      'backend/package.json',
      'frontend/package.json',
      'backend/server.js',
      'frontend/src/App.jsx'
    ];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        this.log(`❌ Brakuje pliku: ${file}`, 'error');
        return false;
      }
    }
    
    this.log('✅ Wszystkie wymagane pliki znalezione');
    return true;
  }

  async installDependencies() {
    this.log('📦 Instalowanie zależności...');
    
    try {
      // Backend dependencies
      if (!fs.existsSync('backend/node_modules')) {
        this.log('📦 Instalowanie zależności backend...');
        await this.runCommand('npm install', 'backend');
      }
      
      // Frontend dependencies
      if (!fs.existsSync('frontend/node_modules')) {
        this.log('📦 Instalowanie zależności frontend...');
        await this.runCommand('npm install', 'frontend');
      }
      
      this.log('✅ Wszystkie zależności zainstalowane');
      return true;
    } catch (error) {
      this.log(`❌ Błąd podczas instalacji: ${error.message}`, 'error');
      return false;
    }
  }

  runCommand(command, cwd = '.') {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: true
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });
      
      process.on('error', reject);
    });
  }

  async startBackend() {
    this.log('🚀 Uruchamianie backend...');
    
    return new Promise((resolve, reject) => {
      this.backendProcess = spawn('npm', ['start'], {
        cwd: 'backend',
        stdio: 'pipe',
        shell: true
      });
      
      this.backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('🚀 Serwer działa na porcie 5000') || output.includes('Server running on port 5000')) {
          this.log('✅ Backend uruchomiony na porcie 5000', 'success');
          resolve();
        }
        process.stdout.write(`[BACKEND] ${output}`);
      });
      
      this.backendProcess.stderr.on('data', (data) => {
        process.stderr.write(`[BACKEND ERROR] ${data}`);
      });
      
      this.backendProcess.on('error', (error) => {
        this.log(`❌ Błąd uruchamiania backend: ${error.message}`, 'error');
        reject(error);
      });
      
      this.backendProcess.on('close', (code) => {
        if (code !== 0) {
          this.log(`❌ Backend zakończony z kodem: ${code}`, 'error');
        }
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          this.log('⏰ Timeout uruchamiania backend', 'warning');
          reject(new Error('Backend startup timeout'));
        }
      }, 30000);
    });
  }

  async startFrontend() {
    this.log('🚀 Uruchamianie frontend...');
    
    return new Promise((resolve, reject) => {
      this.frontendProcess = spawn('npm', ['start'], {
        cwd: 'frontend',
        stdio: 'pipe',
        shell: true
      });
      
      this.frontendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') && output.includes('http://localhost:3000')) {
          this.log('✅ Frontend uruchomiony na porcie 3000', 'success');
          resolve();
        }
        process.stdout.write(`[FRONTEND] ${output}`);
      });
      
      this.frontendProcess.stderr.on('data', (data) => {
        process.stderr.write(`[FRONTEND ERROR] ${data}`);
      });
      
      this.frontendProcess.on('error', (error) => {
        this.log(`❌ Błąd uruchamiania frontend: ${error.message}`, 'error');
        reject(error);
      });
      
      this.frontendProcess.on('close', (code) => {
        if (code !== 0) {
          this.log(`❌ Frontend zakończony z kodem: ${code}`, 'error');
        }
      });
      
      // Timeout after 60 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          this.log('⏰ Timeout uruchamiania frontend', 'warning');
          reject(new Error('Frontend startup timeout'));
        }
      }, 60000);
    });
  }

  async activateTestUsers() {
    this.log('👥 Aktywowanie użytkowników testowych...');
    
    try {
      const activationScript = `
        const mongoose = require('mongoose');
        const User = require('./models/userModel');
        
        mongoose.connect('mongodb://localhost:27017/portal', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        
        async function activateUsers() {
          try {
            const result = await User.updateMany(
              { isActive: { $exists: false } },
              { $set: { isActive: true } }
            );
            console.log('✅ Aktywowano użytkowników:', result.modifiedCount);
            process.exit(0);
          } catch (error) {
            console.error('❌ Błąd aktywacji:', error);
            process.exit(1);
          }
        }
        
        activateUsers();
      `;
      
      fs.writeFileSync('backend/activate-users.js', activationScript);
      await this.runCommand('node activate-users.js', 'backend');
      fs.unlinkSync('backend/activate-users.js');
      
      this.log('✅ Użytkownicy testowi aktywowani', 'success');
    } catch (error) {
      this.log(`⚠️ Błąd aktywacji użytkowników: ${error.message}`, 'warning');
    }
  }

  showWelcomeMessage() {
    console.log('\n');
    console.log('🎉'.repeat(50));
    console.log('🚀 ULEPSZONY PORTAL E-COMMERCE URUCHOMIONY! 🚀');
    console.log('🎉'.repeat(50));
    console.log('\n');
    
    console.log('📱 Dostępne adresy:');
    console.log('   🌐 Frontend: http://localhost:3000');
    console.log('   🔧 Backend API: http://localhost:5000');
    console.log('\n');
    
    console.log('🎯 Nowe funkcje do przetestowania:');
    console.log('   📦 /products - Ulepszone karty produktów');
    console.log('   🔍 /demo/filters - Zaawansowane filtry');
    console.log('   ⭐ /demo/reviews - System ocen i recenzji');
    console.log('   💬 /demo/chat - Chat w czasie rzeczywistym');
    console.log('   🏷️ /demo/product-card - Demo karty produktu');
    console.log('\n');
    
    console.log('🔧 Funkcje techniczne:');
    console.log('   👤 Rejestracja i logowanie');
    console.log('   🏪 Dodawanie sklepów i produktów');
    console.log('   ⚙️ Ustawienia i motywy');
    console.log('   📱 Responsive design');
    console.log('\n');
    
    console.log('🎨 Motywy:');
    console.log('   ☀️ Jasny motyw (domyślny)');
    console.log('   🌙 Ciemny motyw (w ustawieniach)');
    console.log('\n');
    
    console.log('🛡️ Testy bezpieczeństwa:');
    console.log('   node test-puppeteer-comprehensive.js');
    console.log('\n');
    
    console.log('📊 Raporty:');
    console.log('   📄 PORTAL_UPGRADES_SUMMARY.md');
    console.log('   📸 demo-screenshots/');
    console.log('   📋 demo-report.json');
    console.log('   🌐 demo-report.html');
    console.log('\n');
    
    console.log('🎯 Inspiracje z platform:');
    console.log('   🇵🇱 Allegro - Filtry, chat, oceny');
    console.log('   🌍 Amazon - Karty produktów, recenzje');
    console.log('   🌍 eBay - System aukcji, gwarancje');
    console.log('\n');
    
    console.log('💡 Porady:');
    console.log('   • Użyj Ctrl+C aby zatrzymać serwery');
    console.log('   • Sprawdź konsolę przeglądarki (F12)');
    console.log('   • Testuj na różnych urządzeniach');
    console.log('   • Sprawdź responsywność (F12 -> Toggle device toolbar)');
    console.log('\n');
    
    console.log('🚀 Portal gotowy do konkurowania z największymi platformami!');
    console.log('🎉'.repeat(50));
    console.log('\n');
  }

  async start() {
    try {
      this.log('🚀 Uruchamianie ulepszonego portalu e-commerce...');
      
      // Sprawdź zależności
      if (!(await this.checkDependencies())) {
        this.log('❌ Nie można uruchomić - brakuje wymaganych plików', 'error');
        process.exit(1);
      }
      
      // Zainstaluj zależności
      if (!(await this.installDependencies())) {
        this.log('❌ Nie można uruchomić - błąd instalacji zależności', 'error');
        process.exit(1);
      }
      
      // Aktywuj użytkowników testowych
      await this.activateTestUsers();
      
      // Uruchom backend
      await this.startBackend();
      
      // Poczekaj chwilę na backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Uruchom frontend
      await this.startFrontend();
      
      this.isRunning = true;
      
      // Pokaż wiadomość powitalną
      this.showWelcomeMessage();
      
      // Obsługa zatrzymania
      process.on('SIGINT', () => {
        this.log('🛑 Zatrzymywanie serwerów...', 'warning');
        this.stop();
      });
      
      process.on('SIGTERM', () => {
        this.log('🛑 Zatrzymywanie serwerów...', 'warning');
        this.stop();
      });
      
    } catch (error) {
      this.log(`❌ Błąd uruchamiania: ${error.message}`, 'error');
      this.stop();
      process.exit(1);
    }
  }

  stop() {
    this.isRunning = false;
    
    if (this.backendProcess) {
      this.backendProcess.kill('SIGTERM');
      this.log('🛑 Backend zatrzymany');
    }
    
    if (this.frontendProcess) {
      this.frontendProcess.kill('SIGTERM');
      this.log('🛑 Frontend zatrzymany');
    }
    
    this.log('👋 Do widzenia!', 'success');
    process.exit(0);
  }
}

// Uruchom launcher
if (require.main === module) {
  const launcher = new EnhancedPortalLauncher();
  launcher.start().catch(console.error);
}

module.exports = EnhancedPortalLauncher; 