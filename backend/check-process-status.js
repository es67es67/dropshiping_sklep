const ProcessMonitorService = require('./services/processMonitorService');
const UniversalErrorService = require('./services/universalErrorService');
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    console.log('🔧 Inicjalizacja systemu monitorowania...');
    
    // Połącz z MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');
    
    // Inicjalizuj serwisy
    await UniversalErrorService.initialize();
    await ProcessMonitorService.initialize();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'check';
    
    switch (command) {
      case '--monitor':
        await startMonitoring();
        break;
      case '--errors':
        await checkErrors();
        break;
      case '--system':
        await showSystemInfo();
        break;
      case '--netstat':
        await checkNetstat();
        break;
      case '--tasklist':
        await checkTasklist();
        break;
      case '--memory':
        await checkMemoryUsage();
        break;
      case '--all':
        await checkAll();
        break;
      default:
        await checkProcesses();
        break;
    }
  } catch (error) {
    console.error('❌ Błąd główny:', error);
    
    // Loguj błąd
    await UniversalErrorService.logError(error, {
      componentName: 'check-process-status',
      filename: 'check-process-status.js',
      type: 'system_error'
    });
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

async function checkProcesses() {
  console.log('🔍 Sprawdzanie statusu procesów...\n');
  
  try {
    const results = await ProcessMonitorService.checkAllProcesses();
    console.log('\n✅ Sprawdzanie zakończone');
    return results;
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania procesów:', error);
    throw error;
  }
}

async function startMonitoring() {
  console.log('🚀 Uruchamianie monitorowania w tle...');
  
  try {
    ProcessMonitorService.startMonitoring();
    console.log('✅ Monitorowanie uruchomione');
    console.log('💡 Użyj Ctrl+C aby zatrzymać');
    
    // Czekaj na przerwanie
    process.on('SIGINT', () => {
      console.log('\n⏹️ Zatrzymywanie monitorowania...');
      ProcessMonitorService.stopMonitoring();
      process.exit(0);
    });
    
    // Czekaj w nieskończoność
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Błąd podczas uruchamiania monitorowania:', error);
    throw error;
  }
}

async function checkErrors() {
  console.log('🔍 Sprawdzanie błędów w bazie danych...\n');
  
  try {
    const stats = await UniversalErrorService.getErrorStats();
    const recentErrors = await UniversalErrorService.getRecentErrors(10);
    
    console.log('📊 Statystyki błędów:');
    console.log(`- Łącznie błędów: ${stats.totalErrors}`);
    console.log(`- Krytycznych: ${stats.criticalErrors}`);
    console.log(`- Ostrzeżeń: ${stats.warnings}`);
    console.log(`- Informacji: ${stats.info}`);
    
    if (recentErrors.length > 0) {
      console.log('\n🚨 Ostatnie błędy:');
      recentErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message} (${error.type})`);
      });
    } else {
      console.log('\n✅ Brak błędów w bazie danych');
    }
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania błędów:', error);
    throw error;
  }
}

async function showSystemInfo() {
  console.log('💻 Informacje o systemie...\n');
  
  try {
    const systemInfo = ProcessMonitorService.getSystemInfo();
    
    console.log('📋 Informacje o systemie:');
    console.log(`- Platforma: ${systemInfo.platform}`);
    console.log(`- Architektura: ${systemInfo.arch}`);
    console.log(`- Procesory: ${systemInfo.cpus}`);
    console.log(`- Pamięć całkowita: ${Math.round(systemInfo.totalMemory / 1024 / 1024 / 1024)} GB`);
    console.log(`- Pamięć wolna: ${Math.round(systemInfo.freeMemory / 1024 / 1024 / 1024)} GB`);
    console.log(`- Uptime: ${Math.round(systemInfo.uptime / 3600)} godzin`);
    console.log(`- Hostname: ${systemInfo.hostname}`);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania informacji o systemie:', error);
    throw error;
  }
}

async function checkNetstat() {
  console.log('🔍 Sprawdzanie portów przez netstat...\n');
  
  try {
    const results = await ProcessMonitorService.checkProcessesWithNetstat();
    console.log('✅ Sprawdzanie netstat zakończone');
    return results;
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania netstat:', error);
    throw error;
  }
}

async function checkTasklist() {
  console.log('🔍 Sprawdzanie procesów przez tasklist...\n');
  
  try {
    const results = await ProcessMonitorService.checkProcessesWithTasklist();
    console.log('✅ Sprawdzanie tasklist zakończone');
    return results;
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania tasklist:', error);
    throw error;
  }
}

async function checkMemoryUsage() {
  console.log('🔍 Sprawdzanie użycia pamięci...\n');
  
  try {
    const processes = await ProcessMonitorService.getMemoryUsage();
    
    console.log('📊 Użycie pamięci przez procesy Node.js:');
    processes.forEach(process => {
      console.log(`- ${process.name} (PID: ${process.pid}): ${process.memory}`);
    });
    
    console.log('✅ Sprawdzanie pamięci zakończone');
    return processes;
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania pamięci:', error);
    throw error;
  }
}

async function checkAll() {
  console.log('🔍 Wykonywanie wszystkich sprawdzeń...\n');
  
  try {
    console.log('1️⃣ Sprawdzanie procesów...');
    await checkProcesses();
    
    console.log('\n2️⃣ Sprawdzanie błędów...');
    await checkErrors();
    
    console.log('\n3️⃣ Informacje o systemie...');
    await showSystemInfo();
    
    console.log('\n4️⃣ Sprawdzanie portów...');
    await checkNetstat();
    
    console.log('\n5️⃣ Sprawdzanie procesów...');
    await checkTasklist();
    
    console.log('\n6️⃣ Sprawdzanie pamięci...');
    await checkMemoryUsage();
    
    console.log('\n✅ Wszystkie sprawdzenia zakończone');
  } catch (error) {
    console.error('❌ Błąd podczas wykonywania wszystkich sprawdzeń:', error);
    throw error;
  }
}

main(); 