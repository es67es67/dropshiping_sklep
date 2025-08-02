const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const UniversalErrorService = require('./universalErrorService');

/**
 * 🔴 PROCESS MONITOR SERVICE
 * Zależności: UniversalErrorService
 * Wpływ: Monitorowanie statusu procesów
 * Jeśli się zepsuje: brak informacji o statusie procesów
 * Używane w: Skrypty monitorowania, dashboard
 */
class ProcessMonitorService {
  static checkInterval = 30000; // 30 sekund
  static timeout = 10000; // 10 sekund
  static monitoring = false;
  static processes = {
    frontend: {
      name: 'Frontend (Vite)',
      url: 'http://localhost:3000',
      port: 3000,
      command: 'npm run dev',
      directory: '../frontend',
      status: 'unknown',
      lastCheck: null,
      uptime: null,
      memoryUsage: null,
      errorCount: 0
    },
    backend: {
      name: 'Backend (Express)',
      url: 'http://localhost:5000/api/health',
      port: 5000,
      command: 'npm start',
      directory: './',
      status: 'unknown',
      lastCheck: null,
      uptime: null,
      memoryUsage: null,
      errorCount: 0
    },
    database: {
      name: 'MongoDB',
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      port: 27017,
      status: 'unknown',
      lastCheck: null,
      uptime: null,
      errorCount: 0
    }
  };

  // Inicjalizacja serwisu
  static async initialize() {
    try {
      console.log('🔧 Inicjalizacja ProcessMonitorService...');
      
      // Sprawdź połączenie z bazą danych
      const mongoose = require('mongoose');
      await mongoose.connection.db.admin().ping();
      
      console.log('✅ ProcessMonitorService zainicjalizowany');
      return true;
    } catch (error) {
      console.error('❌ Błąd inicjalizacji ProcessMonitorService:', error);
      return false;
    }
  }

  // Sprawdzenie statusu pojedynczego procesu
  static async checkProcessStatus(processName) {
    const process = this.processes[processName];
    if (!process) {
      throw new Error(`Nieznany proces: ${processName}`);
    }

    try {
      console.log(`🔍 Sprawdzanie statusu ${process.name}...`);
      
      const startTime = Date.now();
      const status = await this.makeRequest(process.url);
      const responseTime = Date.now() - startTime;

      process.status = status.status;
      process.lastCheck = new Date();
      process.responseTime = responseTime;
      process.errorCount = 0;

      if (status.status === 'ok') {
        console.log(`✅ ${process.name}: OK (${responseTime}ms)`);
      } else {
        console.log(`❌ ${process.name}: ${status.error || 'Błąd'}`);
        process.errorCount++;
      }

      return process;
    } catch (error) {
      console.error(`❌ Błąd podczas sprawdzania ${process.name}:`, error.message);
      
      process.status = 'error';
      process.lastCheck = new Date();
      process.errorCount++;

      // Loguj błąd
      await UniversalErrorService.logError(error, {
        componentName: 'ProcessMonitorService',
        filename: 'processMonitorService.js',
        additionalData: {
          processName: processName,
          processUrl: process.url,
          errorCount: process.errorCount
        }
      });

      return process;
    }
  }

  // Wykonanie żądania HTTP/HTTPS
  static async makeRequest(url, timeout = this.timeout) {
    return new Promise((resolve, reject) => {
      const isHttps = url.startsWith('https://');
      const client = isHttps ? https : http;
      
      const req = client.get(url, { timeout }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ status: 'ok', code: res.statusCode, data: data });
          } else {
            resolve({ status: 'error', code: res.statusCode, error: `HTTP ${res.statusCode}` });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ status: 'error', error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 'timeout', error: 'Timeout' });
      });

      req.setTimeout(timeout);
    });
  }

  // Sprawdzenie wszystkich procesów
  static async checkAllProcesses() {
    console.log('🔍 Sprawdzanie statusu wszystkich procesów...\n');
    
    const results = {};
    const promises = [];

    for (const [processName, process] of Object.entries(this.processes)) {
      promises.push(
        this.checkProcessStatus(processName)
          .then(result => {
            results[processName] = result;
          })
          .catch(error => {
            console.error(`❌ Błąd podczas sprawdzania ${processName}:`, error);
            results[processName] = {
              ...process,
              status: 'error',
              lastCheck: new Date(),
              error: error.message
            };
          })
      );
    }

    await Promise.all(promises);
    
    console.log('\n📊 Podsumowanie statusu procesów:');
    for (const [processName, result] of Object.entries(results)) {
      const statusIcon = result.status === 'ok' ? '✅' : '❌';
      const errorInfo = result.errorCount > 0 ? ` (${result.errorCount} błędów)` : '';
      console.log(`${statusIcon} ${result.name}: ${result.status}${errorInfo}`);
    }

    return results;
  }

  // Sprawdzenie procesów przez netstat
  static async checkProcessesWithNetstat() {
    return new Promise((resolve, reject) => {
      exec('netstat -an | findstr ":3000 :5000 :27017"', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Błąd podczas wykonywania netstat:', error);
          reject(error);
          return;
        }

        const lines = stdout.split('\n').filter(line => line.trim());
        const results = {
          frontend: { port: 3000, listening: false },
          backend: { port: 5000, listening: false },
          database: { port: 27017, listening: false }
        };

        for (const line of lines) {
          if (line.includes(':3000')) {
            results.frontend.listening = true;
          }
          if (line.includes(':5000')) {
            results.backend.listening = true;
          }
          if (line.includes(':27017')) {
            results.database.listening = true;
          }
        }

        console.log('🔍 Status portów (netstat):');
        console.log(`Frontend (3000): ${results.frontend.listening ? '✅' : '❌'}`);
        console.log(`Backend (5000): ${results.backend.listening ? '✅' : '❌'}`);
        console.log(`Database (27017): ${results.database.listening ? '✅' : '❌'}`);

        resolve(results);
      });
    });
  }

  // Sprawdzenie procesów przez tasklist
  static async checkProcessesWithTasklist() {
    return new Promise((resolve, reject) => {
      exec('tasklist /FI "IMAGENAME eq node.exe"', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Błąd podczas wykonywania tasklist:', error);
          reject(error);
          return;
        }

        const lines = stdout.split('\n').filter(line => line.trim());
        const nodeProcesses = lines.length - 1; // -1 bo pierwsza linia to nagłówek

        console.log(`🔍 Znaleziono ${nodeProcesses} procesów Node.js`);

        resolve({
          nodeProcesses: nodeProcesses,
          processes: lines.slice(1) // Bez nagłówka
        });
      });
    });
  }

  // Uruchomienie monitorowania w tle
  static startMonitoring() {
    if (this.monitoring) {
      console.log('⚠️ Monitorowanie już uruchomione');
      return;
    }

    this.monitoring = true;
    console.log('🚀 Uruchamianie monitorowania procesów...');

    const monitor = async () => {
      if (!this.monitoring) return;

      try {
        await this.checkAllProcesses();
        
        // Sprawdź czy są krytyczne błędy
        const criticalErrors = Object.values(this.processes).filter(p => p.errorCount > 5);
        if (criticalErrors.length > 0) {
          console.log('🚨 Wykryto krytyczne błędy procesów!');
          
          // Loguj krytyczny błąd
          await UniversalErrorService.logError(
            new Error(`Krytyczne błędy procesów: ${criticalErrors.map(p => p.name).join(', ')}`),
            {
              componentName: 'ProcessMonitorService',
              filename: 'processMonitorService.js',
              type: 'system_error',
              additionalData: {
                criticalErrors: criticalErrors.map(p => ({
                  name: p.name,
                  errorCount: p.errorCount,
                  lastCheck: p.lastCheck
                }))
              }
            }
          );
        }
      } catch (error) {
        console.error('❌ Błąd podczas monitorowania:', error);
        
        await UniversalErrorService.logError(error, {
          componentName: 'ProcessMonitorService',
          filename: 'processMonitorService.js',
          type: 'system_error'
        });
      }

      // Następne sprawdzenie
      setTimeout(monitor, this.checkInterval);
    };

    // Rozpocznij monitorowanie
    monitor();
  }

  // Zatrzymanie monitorowania
  static stopMonitoring() {
    this.monitoring = false;
    console.log('⏹️ Zatrzymano monitorowanie procesów');
  }

  // Pobranie statusu wszystkich procesów
  static getProcessStatus() {
    return {
      monitoring: this.monitoring,
      processes: this.processes,
      lastUpdate: new Date()
    };
  }

  // Pobranie statystyk błędów procesów
  static getProcessErrorStats() {
    const stats = {
      totalErrors: 0,
      criticalErrors: 0,
      processesWithErrors: 0
    };

    for (const process of Object.values(this.processes)) {
      if (process.errorCount > 0) {
        stats.totalErrors += process.errorCount;
        stats.processesWithErrors++;
        
        if (process.errorCount > 5) {
          stats.criticalErrors++;
        }
      }
    }

    return stats;
  }

  // Uruchomienie procesu
  static async startProcess(processName) {
    const process = this.processes[processName];
    if (!process) {
      throw new Error(`Nieznany proces: ${processName}`);
    }

    console.log(`🚀 Uruchamianie ${process.name}...`);

    return new Promise((resolve, reject) => {
      const child = exec(process.command, {
        cwd: process.directory,
        windowsHide: true
      }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Błąd podczas uruchamiania ${process.name}:`, error);
          reject(error);
        } else {
          console.log(`✅ ${process.name} uruchomiony`);
          resolve({ success: true, stdout, stderr });
        }
      });

      // Loguj output
      child.stdout?.on('data', (data) => {
        console.log(`[${process.name}] ${data}`);
      });

      child.stderr?.on('data', (data) => {
        console.error(`[${process.name}] ERROR: ${data}`);
      });
    });
  }

  // Sprawdzenie czy proces jest uruchomiony
  static async isProcessRunning(processName) {
    const process = this.processes[processName];
    if (!process) {
      return false;
    }

    try {
      const status = await this.makeRequest(process.url, 5000);
      return status.status === 'ok';
    } catch (error) {
      return false;
    }
  }

  // Pobranie informacji o systemie
  static getSystemInfo() {
    const os = require('os');
    
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces()
    };
  }

  // Sprawdzenie użycia pamięci przez procesy
  static async getMemoryUsage() {
    return new Promise((resolve, reject) => {
      exec('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const lines = stdout.split('\n').filter(line => line.trim());
        const processes = lines.slice(1).map(line => {
          const parts = line.split(',');
          return {
            name: parts[0].replace(/"/g, ''),
            pid: parts[1].replace(/"/g, ''),
            memory: parts[4].replace(/"/g, '')
          };
        });

        resolve(processes);
      });
    });
  }
}

module.exports = ProcessMonitorService; 