const fs = require('fs');
const path = require('path');

async function checkSIMCStructure() {
    try {
        console.log('🔍 SPRAWDZAM STRUKTURĘ PLIKU SIMC...');
        
        const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');
        
        if (!fs.existsSync(SIMC_FILE)) {
            console.log('❌ Plik SIMC nie istnieje');
            return;
        }
        
        // Wczytaj pierwsze 10 linii
        const fileContent = fs.readFileSync(SIMC_FILE, 'utf8');
        const lines = fileContent.split('\n');
        
        console.log('\n📋 NAGŁÓWEK:');
        console.log(lines[0]);
        
        console.log('\n📋 PIERWSZE 5 WIERSZY:');
        for (let i = 1; i <= 5; i++) {
            if (lines[i]) {
                console.log(`Wiersz ${i}: ${lines[i]}`);
            }
        }
        
        console.log('\n📋 OSTATNIE 5 WIERSZY:');
        for (let i = lines.length - 5; i < lines.length; i++) {
            if (lines[i]) {
                console.log(`Wiersz ${i}: ${lines[i]}`);
            }
        }
        
        // Sprawdź różne typy wierszy
        console.log('\n🔍 ANALIZA RÓŻNYCH TYPÓW WIERSZY:');
        const sampleLines = lines.slice(1, 100); // Pierwsze 100 wierszy danych
        
        const types = {};
        sampleLines.forEach((line, index) => {
            if (line.trim()) {
                const columns = line.split(';'); // Używam ; jako separator
                if (columns.length > 0) {
                    const firstCol = columns[0];
                    const type = firstCol.substring(0, 3); // Pierwsze 3 znaki
                    types[type] = (types[type] || 0) + 1;
                }
            }
        });
        
        console.log('📊 TYPY WIERSZY (pierwsze 3 znaki):');
        Object.entries(types).forEach(([type, count]) => {
            console.log(`${type}: ${count} wierszy`);
        });
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

checkSIMCStructure(); 