const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importuj modele
const Miejscowosc = require('./models/miejscowoscModel');

// Ścieżka do pliku
const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');

async function simpleImportMiejscowosciFixed() {
    let connection = null;
    
    try {
        console.log('🚀 ROZPOCZYNAM NAPRAWIONY IMPORT MIEJSCOWOŚCI...');
        
        // Połącz z MongoDB - JEDNO POŁĄCZENIE
        connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        let rowCount = 0;
        let importedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        // Set do śledzenia przetworzonych kodów
        const processedCodes = new Set();
        
        // Funkcja do przetwarzania pojedynczego wiersza
        const processRow = async (row) => {
            try {
                // Przetwórz wiersz
                const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
                const pow = row['POW'] || 'brak';
                const gmi = row['GMI'] || 'brak';
                const rm = row['RM'] || 'brak';
                const nazwa = row['NAZWA'] || 'brak';
                const sym = row['SYM'] || 'brak';
                const stanNa = row['STAN_NA'] || 'brak';
                
                // Sprawdź czy to miejscowość (nie puste pola)
                if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak' && sym !== 'brak') {
                    
                    // Sprawdź czy kod już został przetworzony
                    const uniqueKey = `${sym}-${rm}`; // Kod + rodzaj
                    if (processedCodes.has(uniqueKey)) {
                        skippedCount++;
                        return false; // Pomiń duplikat
                    }
                    
                    processedCodes.add(uniqueKey);
                    
                    const gminaCode = woj + pow + gmi;
                    const powiatCode = woj + pow;
                    
                    const miejscowoscData = {
                        name: nazwa,
                        code: sym,
                        rodzaj: rm, // Rodzaj miejscowości
                        stanNa: stanNa,
                        wojewodztwoCode: woj,
                        powiatCode: powiatCode,
                        gminaCode: gminaCode,
                        isActive: true,
                        isVerified: true
                    };
                    
                    // Zapisz pojedynczy dokument
                    await Miejscowosc.create(miejscowoscData);
                    importedCount++;
                    return true;
                }
                return false;
                
            } catch (error) {
                errorCount++;
                console.error(`❌ Błąd w wierszu ${rowCount}:`, error.message);
                return false;
            }
        };
        
        // Przetwarzaj plik CSV
        return new Promise((resolve, reject) => {
            fs.createReadStream(SIMC_FILE)
                .pipe(csv({ 
                    separator: ';',
                    strict: false,
                    skipEmptyLines: true
                }))
                .on('data', async (row) => {
                    rowCount++;
                    
                    // Pomiń nagłówek
                    if (rowCount === 1) return;
                    
                    // Przetwórz wiersz
                    await processRow(row);
                    
                    // Pokaż postęp co 1000 wierszy
                    if (rowCount % 1000 === 0) {
                        console.log(`⏳ Postęp: ${importedCount} zaimportowanych / ${rowCount-1} przetworzonych wierszy`);
                    }
                })
                .on('end', async () => {
                    console.log('\n📊 PODSUMOWANIE IMPORTU:');
                    console.log(`✅ Zaimportowane: ${importedCount} miejscowości`);
                    console.log(`⚠️  Pominięte duplikaty: ${skippedCount}`);
                    console.log(`❌ Błędy: ${errorCount}`);
                    console.log(`📋 Przetworzone wiersze: ${rowCount-1}`);
                    
                    console.log('\n🎉 IMPORT ZAKOŃCZONY!');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ Błąd podczas importowania:', error);
                    reject(error);
                });
        });
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        if (connection) {
            await mongoose.disconnect();
            console.log('🔌 Rozłączono z MongoDB');
        }
    }
}

// Uruchom import
simpleImportMiejscowosciFixed(); 