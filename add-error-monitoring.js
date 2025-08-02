const fs = require('fs');
const path = require('path');
const UniversalErrorService = require('./backend/services/universalErrorService');

/**
 * 🔧 SKRYPT DODAWANIA MONITOROWANIA BŁĘDÓW
 * 
 * Ten skrypt automatycznie dodaje monitorowanie błędów do wszystkich plików w projekcie
 */

// Lista plików do pominięcia
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'uploads',
  'logs',
  'error-monitoring',
  'add-error-monitoring.js',
  'check-process-status.js',
  'check-servers.js',
  'package-lock.json',
  'yarn.lock'
];

// Lista rozszerzeń plików do przetwarzania
const INCLUDE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Szablony monitorowania błędów
const ERROR_MONITORING_TEMPLATES = {
  // Dla kontrolerów Express
  controller: `
// Dodaj na początku pliku po importach
const UniversalErrorService = require('../services/universalErrorService');

// Dodaj w każdej funkcji kontrolera
try {
  // ... kod funkcji ...
} catch (error) {
  console.error('❌ Błąd w kontrolerze:', error);
  
  await UniversalErrorService.logError(error, {
    componentName: '{{COMPONENT_NAME}}',
    filename: '{{FILENAME}}',
    type: 'api_error',
    additionalData: {
      action: '{{ACTION_NAME}}',
      requestData: req.body
    }
  });
  
  res.status(500).json({ 
    error: 'Błąd serwera',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Wystąpił błąd'
  });
}`,

  // Dla serwisów
  service: `
// Dodaj na początku pliku po importach
const UniversalErrorService = require('./universalErrorService');

// Dodaj w każdej funkcji serwisu
try {
  // ... kod funkcji ...
} catch (error) {
  console.error('❌ Błąd w serwisie:', error);
  
  await UniversalErrorService.logError(error, {
    componentName: '{{COMPONENT_NAME}}',
    filename: '{{FILENAME}}',
    type: 'service_error',
    additionalData: {
      action: '{{ACTION_NAME}}'
    }
  });
  
  throw error;
}`,

  // Dla middleware
  middleware: `
// Dodaj na początku pliku po importach
const UniversalErrorService = require('../services/universalErrorService');

// Dodaj w każdej funkcji middleware
try {
  // ... kod funkcji ...
} catch (error) {
  console.error('❌ Błąd w middleware:', error);
  
  await UniversalErrorService.logError(error, {
    componentName: '{{COMPONENT_NAME}}',
    filename: '{{FILENAME}}',
    type: 'middleware_error',
    additionalData: {
      action: '{{ACTION_NAME}}'
    }
  });
  
  next(error);
}`,

  // Dla modeli
  model: `
// Dodaj w metodach modelu
try {
  // ... kod metody ...
} catch (error) {
  console.error('❌ Błąd w modelu:', error);
  
  await UniversalErrorService.logError(error, {
    componentName: '{{COMPONENT_NAME}}',
    filename: '{{FILENAME}}',
    type: 'database_error',
    additionalData: {
      action: '{{ACTION_NAME}}'
    }
  });
  
  throw error;
}`,

  // Dla komponentów React
  react: `
// Dodaj w komponencie React
import { useEffect } from 'react';

// Dodaj w useEffect lub event handler
try {
  // ... kod komponentu ...
} catch (error) {
  console.error('❌ Błąd w komponencie React:', error);
  
  // Wyślij błąd do backendu
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      type: 'react_error',
      url: window.location.href,
      userAgent: navigator.userAgent,
      componentName: '{{COMPONENT_NAME}}',
      filename: '{{FILENAME}}'
    })
  }).catch(console.error);
}`
};

// Funkcja do sprawdzenia czy plik powinien być przetwarzany
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);
  
  // Sprawdź rozszerzenie
  if (!INCLUDE_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Sprawdź czy plik jest w wykluczonych katalogach
  for (const exclude of EXCLUDE_FILES) {
    if (filePath.includes(exclude)) {
      return false;
    }
  }
  
  return true;
}

// Funkcja do określenia typu pliku
function getFileType(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  if (fileName.includes('Controller') || fileName.includes('controller')) {
    return 'controller';
  }
  
  if (fileName.includes('Service') || fileName.includes('service')) {
    return 'service';
  }
  
  if (fileName.includes('Middleware') || fileName.includes('middleware')) {
    return 'middleware';
  }
  
  if (fileName.includes('Model') || fileName.includes('model')) {
    return 'model';
  }
  
  if (filePath.includes('frontend') || filePath.includes('src/components') || filePath.includes('src/pages')) {
    return 'react';
  }
  
  // Domyślnie traktuj jako kontroler
  return 'controller';
}

// Funkcja do dodawania monitorowania błędów do pliku
async function addErrorMonitoringToFile(filePath) {
  try {
    console.log(`🔧 Przetwarzanie: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const fileType = getFileType(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    // Sprawdź czy plik już ma monitorowanie błędów
    if (content.includes('UniversalErrorService') || content.includes('error monitoring')) {
      console.log(`   ⏭️  Plik już ma monitorowanie błędów`);
      return;
    }
    
    let newContent = content;
    let hasChanges = false;
    
    // Dodaj import UniversalErrorService
    if (fileType === 'controller' || fileType === 'service' || fileType === 'middleware') {
      const importPattern = /(const|let|var)\s+\w+\s*=\s*require\(['"][^'"]+['"]\)/g;
      const imports = content.match(importPattern) || [];
      
      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const importIndex = content.lastIndexOf(lastImport) + lastImport.length;
        
        newContent = content.slice(0, importIndex) + 
                    `\nconst UniversalErrorService = require('${fileType === 'service' ? './universalErrorService' : '../services/universalErrorService'}');` +
                    content.slice(importIndex);
        hasChanges = true;
      }
    }
    
    // Znajdź funkcje do dodania monitorowania błędów
    const functionPattern = /(exports\.|module\.exports\.|async\s+)?(\w+)\s*=\s*(async\s+)?\([^)]*\)\s*=>\s*{/g;
    const functions = [...newContent.matchAll(functionPattern)];
    
    for (let i = functions.length - 1; i >= 0; i--) {
      const match = functions[i];
      const functionName = match[2];
      const functionStart = match.index + match[0].length;
      
      // Znajdź koniec funkcji
      let braceCount = 1;
      let functionEnd = functionStart;
      
      for (let j = functionStart; j < newContent.length; j++) {
        if (newContent[j] === '{') braceCount++;
        if (newContent[j] === '}') braceCount--;
        if (braceCount === 0) {
          functionEnd = j;
          break;
        }
      }
      
      if (functionEnd > functionStart) {
        const functionBody = newContent.slice(functionStart, functionEnd);
        
        // Sprawdź czy funkcja już ma try-catch
        if (!functionBody.includes('try {') && !functionBody.includes('catch')) {
          // Dodaj try-catch
          const tryCatchTemplate = ERROR_MONITORING_TEMPLATES[fileType]
            .replace(/{{COMPONENT_NAME}}/g, componentName)
            .replace(/{{FILENAME}}/g, fileName)
            .replace(/{{ACTION_NAME}}/g, functionName);
          
          const wrappedBody = `\n  try {\n    ${functionBody.trim()}\n  } catch (error) {
    console.error('❌ Błąd w ${componentName}:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: '${componentName}',
      filename: '${fileName}',
      type: '${fileType}_error',
      additionalData: {
        action: '${functionName}'
      }
    });
    
    ${fileType === 'controller' ? 'res.status(500).json({ error: "Błąd serwera" });' : 'throw error;'}
  }`;
          
          newContent = newContent.slice(0, functionStart) + wrappedBody + newContent.slice(functionEnd);
          hasChanges = true;
        }
      }
    }
    
    // Zapisz zmiany
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`   ✅ Dodano monitorowanie błędów`);
      
      // Loguj zmianę
      await UniversalErrorService.logError(
        new Error(`Dodano monitorowanie błędów do pliku: ${filePath}`),
        {
          componentName: 'add-error-monitoring.js',
          filename: 'add-error-monitoring.js',
          type: 'system_info',
          additionalData: {
            action: 'add_error_monitoring',
            filePath: filePath,
            fileType: fileType
          }
        }
      );
    } else {
      console.log(`   ⏭️  Brak zmian`);
    }
    
  } catch (error) {
    console.error(`❌ Błąd podczas przetwarzania ${filePath}:`, error);
    
    // Loguj błąd
    await UniversalErrorService.logError(error, {
      componentName: 'add-error-monitoring.js',
      filename: 'add-error-monitoring.js',
      type: 'system_error',
      additionalData: {
        action: 'add_error_monitoring',
        filePath: filePath
      }
    });
  }
}

// Funkcja do rekurencyjnego przeszukiwania katalogów
async function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (stat.isFile() && shouldProcessFile(fullPath)) {
        await addErrorMonitoringToFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Błąd podczas przetwarzania katalogu ${dirPath}:`, error);
  }
}

// Główna funkcja
async function main() {
  try {
    console.log('🔧 Rozpoczynam dodawanie monitorowania błędów...\n');
    
    // Inicjalizuj UniversalErrorService
    await UniversalErrorService.initialize();
    
    // Przetwórz katalogi
    const directories = [
      './backend/controllers',
      './backend/services', 
      './backend/middleware',
      './backend/models',
      './frontend/src/components',
      './frontend/src/pages',
      './frontend/src/contexts'
    ];
    
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        console.log(`📁 Przetwarzanie katalogu: ${dir}`);
        await processDirectory(dir);
      }
    }
    
    console.log('\n✅ Zakończono dodawanie monitorowania błędów');
    console.log('📝 Sprawdź pliki, aby upewnić się, że zmiany zostały poprawnie zastosowane');
    
  } catch (error) {
    console.error('❌ Błąd główny:', error);
  }
}

// Uruchom skrypt
main(); 