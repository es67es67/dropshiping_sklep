const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ścieżka do pliku
const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');

async function mongoimportMiejscowosci() {
    try {
        console.log('🚀 ROZPOCZYNAM MONGOIMPORT MIEJSCOWOŚCI...');
        
        // Sprawdź czy plik istnieje
        if (!fs.existsSync(SIMC_FILE)) {
            console.error('❌ Plik SIMC nie istnieje:', SIMC_FILE);
            return;
        }
        
        // Przygotuj plik JSON dla mongoimport
        const jsonFile = path.join(__dirname, 'miejscowosci.json');
        console.log('📝 Przygotowuję plik JSON...');
        
        // Przetwórz CSV na JSON
        const csv = require('csv-parser');
        const jsonData = [];
        const processedCodes = new Set();
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(SIMC_FILE)
                .pipe(csv({ 
                    separator: ';',
                    strict: false,
                    skipEmptyLines: true
                }))
                .on('data', (row) => {
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
                                return; // Pomiń duplikat
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
                            
                            jsonData.push(miejscowoscData);
                        }
                        
                    } catch (error) {
                        console.error('❌ Błąd w wierszu:', error.message);
                    }
                })
                .on('end', async () => {
                    try {
                        // Zapisz JSON
                        fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
                        console.log(`✅ Przygotowano ${jsonData.length} miejscowości do importu`);
                        
                        // Uruchom mongoimport
                        const mongoUri = process.env.MONGODB_URI;
                        const dbName = mongoUri.split('/').pop().split('?')[0];
                        
                        const command = `mongoimport --uri="${mongoUri}" --collection=miejscowosci --file="${jsonFile}" --jsonArray --drop`;
                        
                        console.log('🚀 Uruchamiam mongoimport...');
                        console.log('⏳ To może potrwać kilka minut...');
                        
                        exec(command, (error, stdout, stderr) => {
                            if (error) {
                                console.error('❌ Błąd mongoimport:', error.message);
                                reject(error);
                                return;
                            }
                            
                            console.log('✅ mongoimport zakończony!');
                            console.log('📊 Wynik:', stdout);
                            
                            // Usuń plik JSON
                            fs.unlinkSync(jsonFile);
                            console.log('🗑️ Usunięto plik tymczasowy');
                            
                            resolve();
                        });
                        
                    } catch (error) {
                        console.error('❌ Błąd:', error.message);
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    console.error('❌ Błąd podczas przetwarzania CSV:', error);
                    reject(error);
                });
        });
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

// Uruchom import
mongoimportMiejscowosci(); 