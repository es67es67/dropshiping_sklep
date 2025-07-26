const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Konfiguracja
const BACKEND_URL = 'http://localhost:5000';
const REQUESTS_PER_SECOND = 10; // Limit zapytań na sekundę
const BATCH_SIZE = 50; // Rozmiar batcha
const MAX_RETRIES = 3; // Maksymalna liczba prób

// Statystyki
let stats = {
  TERC: { processed: 0, imported: 0, updated: 0, errors: 0 },
  SIMC: { processed: 0, imported: 0, updated: 0, errors: 0 },
  ULIC: { processed: 0, imported: 0, updated: 0, errors: 0 }
};

// Funkcja do logowania
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Funkcja do opóźnienia
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Funkcja do sprawdzania czy rekord istnieje
async function checkRecordExists(record, type) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/export/check-record`, {
      record: record,
      type: type
    });
    return response.data;
  } catch (error) {
    log(`Błąd sprawdzania rekordu ${type}: ${error.message}`, 'error');
    return { exists: false, isComplete: false };
  }
}

// Funkcja do wysyłania batcha danych
async function sendBatch(data, type) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/export/gus-data-separate`, {
      data: data,
      type: type
    });
    return response.data;
  } catch (error) {
    log(`Błąd wysyłania batcha ${type}: ${error.message}`, 'error');
    throw error;
  }
}

// Funkcja do przetwarzania pliku CSV
async function processCsvFile(filePath, type) {
  log(`Rozpoczynam przetwarzanie pliku: ${path.basename(filePath)}`);
  
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(';');
  
  log(`Znaleziono ${lines.length - 1} rekordów w pliku ${type}`);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(';');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }
  }
  
  log(`Przetworzono ${data.length} rekordów ${type}`);
  return data;
}

// Funkcja do importu danych z limitami
async function importData(data, type) {
  log(`Rozpoczynam import ${data.length} rekordów typu ${type}`);
  
  const delayBetweenRequests = 1000 / REQUESTS_PER_SECOND;
  
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    let retryCount = 0;
    let success = false;
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        // Sprawdź każdy rekord w batchu
        const processedBatch = [];
        for (const record of batch) {
          const checkResult = await checkRecordExists(record, type);
          
          if (checkResult.exists && checkResult.isComplete) {
            log(`⏭️ Pomijam istniejący rekord: ${record.NAZWA || record.NAZWA_1}`, 'info');
            stats[type].processed++;
          } else if (checkResult.exists && !checkResult.isComplete) {
            processedBatch.push({
              ...record,
              action: 'update',
              existingId: checkResult.recordId
            });
            log(`🔄 Aktualizuję niekompletny rekord: ${record.NAZWA || record.NAZWA_1}`, 'warning');
          } else {
            processedBatch.push({
              ...record,
              action: 'insert'
            });
            log(`➕ Dodaję nowy rekord: ${record.NAZWA || record.NAZWA_1}`, 'info');
          }
        }

        if (processedBatch.length === 0) {
          success = true;
          continue;
        }

        const result = await sendBatch(processedBatch, type);
        
        if (result.success) {
          stats[type].processed += batch.length;
          stats[type].imported += result.inserted || 0;
          stats[type].updated += result.updated || 0;
          stats[type].errors += result.errors || 0;
          success = true;

          if (result.inserted > 0) {
            log(`✅ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.inserted} nowych rekordów`, 'success');
          }
          if (result.updated > 0) {
            log(`🔄 Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.updated} zaktualizowanych rekordów`, 'warning');
          }
          if (result.errors > 0) {
            log(`⚠️ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.errors} błędów`, 'error');
          }
        } else {
          throw new Error(result.error || 'Nieznany błąd serwera');
        }

      } catch (error) {
        retryCount++;
        
        if (retryCount < MAX_RETRIES) {
          log(`❌ Błąd batch ${Math.floor(i/BATCH_SIZE) + 1} (próba ${retryCount}/${MAX_RETRIES}): ${error.message}`, 'error');
          log(`⏳ Wstrzymanie na ${retryCount * 2} sekund przed ponowną próbą...`, 'info');
          await delay(retryCount * 2000);
        } else {
          stats[type].errors += batch.length;
          log(`❌ Ostateczny błąd batch ${Math.floor(i/BATCH_SIZE) + 1} po ${MAX_RETRIES} próbach: ${error.message}`, 'error');
        }
      }
    }

    // Opóźnienie między batchami
    await delay(delayBetweenRequests * BATCH_SIZE);
    
    // Log postępu co 1000 rekordów
    if (i % 1000 === 0) {
      log(`Przetworzono ${i}/${data.length} rekordów ${type} (${Math.round((i/data.length)*100)}%)`);
    }
  }
}

// Funkcja główna
async function main() {
  try {
    log('🚀 Rozpoczynam import danych GUS do bazy danych');
    
    // Sprawdź status bazy
    const statusResponse = await axios.get(`${BACKEND_URL}/api/export/status-separate`);
    log(`Status bazy: TERC=${statusResponse.data.terc}, SIMC=${statusResponse.data.simc}, ULIC=${statusResponse.data.ulic}`);
    
    // Ścieżki do plików CSV
    const tercFile = path.join(__dirname, 'dane adresowe gus', 'TERC_Adresowy_2025-07-07.csv');
    const simcFile = path.join(__dirname, 'dane adresowe gus', 'SIMC_Adresowy_2025-07-07.csv');
    const ulicFile = path.join(__dirname, 'dane adresowe gus', 'ULIC_Adresowy_2025-07-07.csv');
    
    // Import TERC (województwa, powiaty, gminy)
    if (fs.existsSync(tercFile)) {
      const tercData = await processCsvFile(tercFile, 'TERC');
      await importData(tercData, 'TERC');
    } else {
      log(`Plik TERC nie istnieje: ${tercFile}`, 'error');
    }
    
    // Import SIMC (miejscowości)
    if (fs.existsSync(simcFile)) {
      const simcData = await processCsvFile(simcFile, 'SIMC');
      await importData(simcData, 'SIMC');
    } else {
      log(`Plik SIMC nie istnieje: ${simcFile}`, 'error');
    }
    
    // Import ULIC (ulice)
    if (fs.existsSync(ulicFile)) {
      const ulicData = await processCsvFile(ulicFile, 'ULIC');
      await importData(ulicData, 'ULIC');
    } else {
      log(`Plik ULIC nie istnieje: ${ulicFile}`, 'error');
    }
    
    // Sprawdź duplikaty
    const duplicatesResponse = await axios.get(`${BACKEND_URL}/api/export/duplicates-separate`);
    if (duplicatesResponse.data.totalDuplicates > 0) {
      log(`⚠️ Znaleziono ${duplicatesResponse.data.totalDuplicates} duplikatów!`, 'warning');
    } else {
      log('✅ Brak duplikatów w bazie', 'success');
    }
    
    // Finalny status
    const finalStatus = await axios.get(`${BACKEND_URL}/api/export/status-separate`);
    log('📊 PODSUMOWANIE IMPORTU:', 'info');
    log(`TERC: ${finalStatus.data.terc} rekordów`, 'info');
    log(`SIMC: ${finalStatus.data.simc} rekordów`, 'info');
    log(`ULIC: ${finalStatus.data.ulic} rekordów`, 'info');
    
    log('✅ Import danych GUS zakończony pomyślnie!', 'success');
    
  } catch (error) {
    log(`❌ Błąd podczas importu: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Uruchom import
main(); 