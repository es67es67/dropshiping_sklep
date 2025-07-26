const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importuj modele
const Ulica = require('./models/ulicaModel');

// Ścieżka do pliku
const ULIC_FILE = path.join(__dirname, '../inne/dane adresowe gus/ULIC_Adresowy_2025-07-07.csv');

async function importUlice() {
    try {
        console.log('🚀 ROZPOCZYNAM IMPORT ULIC...');
        
        // Sprawdź czy plik istnieje
        if (!fs.existsSync(ULIC_FILE)) {
            console.error('❌ Plik ULIC nie istnieje:', ULIC_FILE);
            return;
        }
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        // Przygotuj plik JSON dla importu
        const jsonFile = path.join(__dirname, 'ulice.json');
        console.log('📝 Przygotowuję plik JSON...');
        
        // Przetwórz CSV na JSON
        const jsonData = [];
        const processedRecords = new Set();
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(ULIC_FILE)
                .pipe(csv({ 
                    separator: ';',
                    strict: false,
                    skipEmptyLines: true
                }))
                .on('data', (row) => {
                    try {
                        // Przetwórz wiersz - zastąp puste pola wartością "brak"
                        const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
                        const pow = row['POW'] || 'brak';
                        const gmi = row['GMI'] || 'brak';
                        const rodGmi = row['RODZ_GMI'] || 'brak';
                        const sym = row['SYM'] || 'brak';
                        const symUl = row['SYM_UL'] || 'brak';
                        const nazwa = row['NAZWA_1'] || row['NAZWA'] || 'brak';
                        const cecha = row['CECHA'] || 'brak';
                        const nazwa2 = row['NAZWA_2'] || 'brak';
                        const stanNa = row['STAN_NA'] || 'brak';
                        
                        // Utwórz klucz unikalny z wszystkich pól
                        const recordKey = `${woj}|${pow}|${gmi}|${rodGmi}|${sym}|${symUl}|${cecha}|${nazwa}|${nazwa2}|${stanNa}`;
                        
                        // Sprawdź czy rekord już został przetworzony
                        if (processedRecords.has(recordKey)) {
                            return; // Pomiń duplikat
                        }
                        
                        // Dodaj rekord do zbioru przetworzonych
                        processedRecords.add(recordKey);
                            
                        const gminaCode = woj + pow + gmi;
                        const powiatCode = woj + pow;
                        
                        // Zbuduj pełną nazwę ulicy
                        let fullName = nazwa;
                        if (cecha && cecha.trim() !== '') {
                            fullName = `${cecha} ${nazwa}`;
                        }
                        if (nazwa2 && nazwa2.trim() !== '') {
                            fullName += ` ${nazwa2}`;
                        }
                        
                        const ulicaData = {
                            name: fullName,
                            code: sym,
                            symUl: symUl,
                            cecha: cecha,
                            nazwa1: nazwa,
                            nazwa2: nazwa2,
                            stanNa: stanNa,
                            wojewodztwoCode: woj,
                            powiatCode: powiatCode,
                            gminaCode: gminaCode,
                            rodzGmi: rodGmi,
                            isActive: true,
                            isVerified: true
                        };
                        
                        jsonData.push(ulicaData);
                        
                    } catch (error) {
                        console.error('❌ Błąd w wierszu:', error.message);
                    }
                })
                .on('end', async () => {
                    try {
                        // Zapisz JSON
                        fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
                        console.log(`✅ Przygotowano ${jsonData.length} ulic do importu`);
                        
                        // Wczytaj JSON
                        console.log('📖 Wczytuję plik JSON...');
                        const uliceData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
                        console.log(`📊 Wczytano ${uliceData.length} ulic`);
                        
                        // Wyczyść kolekcję
                        console.log('🗑️ Czyszczę kolekcję ulic...');
                        await Ulica.deleteMany({});
                        console.log('✅ Kolekcja wyczyszczona');
                        
                        // Importuj wszystkie ulice
                        console.log('🚀 Importuję ulice...');
                        console.log('⏳ To może potrwać kilka minut...');
                        
                        const result = await Ulica.insertMany(uliceData);
                        console.log(`✅ Zaimportowano ${result.length} ulic!`);
                        
                        // Usuń plik JSON
                        fs.unlinkSync(jsonFile);
                        console.log('🗑️ Usunięto plik tymczasowy');
                        
                        console.log('\n🎉 IMPORT ULIC ZAKOŃCZONY!');
                        
                        // Rozłącz z MongoDB
                        await mongoose.disconnect();
                        console.log('🔌 Rozłączono z MongoDB');
                        
                        resolve();
                        
                    } catch (error) {
                        console.error('❌ Błąd:', error.message);
                        
                        // Rozłącz z MongoDB w przypadku błędu
                        if (mongoose.connection.readyState === 1) {
                            await mongoose.disconnect();
                            console.log('🔌 Rozłączono z MongoDB');
                        }
                        
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    console.error('❌ Błąd podczas przetwarzania CSV:', error);
                    
                    // Rozłącz z MongoDB w przypadku błędu
                    if (mongoose.connection.readyState === 1) {
                        mongoose.disconnect();
                        console.log('🔌 Rozłączono z MongoDB');
                    }
                    
                    reject(error);
                });
        });
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
        
        // Rozłącz z MongoDB w przypadku błędu
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('🔌 Rozłączono z MongoDB');
        }
    }
}

// Uruchom import
importUlice(); 