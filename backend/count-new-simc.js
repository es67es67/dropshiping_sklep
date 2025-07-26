const fs = require('fs');
const path = require('path');

async function countNewSIMC() {
    try {
        console.log('📊 LICZĘ WIERSZE W NOWYM PLIKU SIMC...');
        
        const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');
        
        if (!fs.existsSync(SIMC_FILE)) {
            console.log('❌ Plik SIMC nie istnieje:', SIMC_FILE);
            return;
        }
        
        console.log('📁 Plik SIMC:', SIMC_FILE);
        
        // Wczytaj plik
        const fileContent = fs.readFileSync(SIMC_FILE, 'utf8');
        const lines = fileContent.split('\n');
        
        // Usuń puste linie
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        
        // Pierwsza linia to nagłówek
        const headerLine = nonEmptyLines[0];
        const dataLines = nonEmptyLines.slice(1);
        
        console.log('\n📊 WYNIKI:');
        console.log('📋 Wszystkie linie:', lines.length);
        console.log('📋 Niepuste linie:', nonEmptyLines.length);
        console.log('📋 Linia nagłówka:', headerLine ? 'TAK' : 'NIE');
        console.log('📋 Linie z danymi:', dataLines.length);
        
        // Sprawdź nagłówek
        console.log('\n📋 NAGŁÓWEK:');
        console.log(headerLine);
        
        // Sprawdź pierwsze kilka wierszy
        console.log('\n🔍 PIERWSZE 5 WIERSZY:');
        dataLines.slice(0, 5).forEach((line, index) => {
            const columns = line.split(';');
            console.log(`${index + 1}. ${columns.join(' | ')}`);
        });
        
        // Sprawdź ostatnie kilka wierszy
        console.log('\n🔍 OSTATNIE 5 WIERSZY:');
        dataLines.slice(-5).forEach((line, index) => {
            const columns = line.split(';');
            console.log(`${dataLines.length - 4 + index}. ${columns.join(' | ')}`);
        });
        
        // Sprawdź rozkład RM (rodzaj miejscowości)
        console.log('\n📊 ROZKŁAD RODZAJÓW MIEJSCOWOŚCI (RM):');
        const rmCounts = {};
        dataLines.forEach(line => {
            const columns = line.split(';');
            if (columns.length > 4) {
                const rm = columns[4]; // RM to 5-ta kolumna (indeks 4)
                rmCounts[rm] = (rmCounts[rm] || 0) + 1;
            }
        });
        
        Object.entries(rmCounts).sort((a, b) => b[1] - a[1]).forEach(([rm, count]) => {
            let description = '';
            switch(rm) {
                case '01': description = ' (wieś)'; break;
                case '96': description = ' (miasto)'; break;
                case '00': description = ' (część miejscowości)'; break;
                case '02': description = ' (kolonia)'; break;
                case '03': description = ' (przysiółek)'; break;
                case '04': description = ' (osada)'; break;
                case '05': description = ' (osada leśna)'; break;
                case '06': description = ' (osiedle)'; break;
                case '07': description = ' (schronisko turystyczne)'; break;
                case '95': description = ' (dzielnica)'; break;
                case '98': description = ' (delegatura)'; break;
                case '99': description = ' (część miasta)'; break;
            }
            console.log(`RM ${rm}${description}: ${count} wierszy`);
        });
        
        // Policz główne miejscowości (RM = 01, 96)
        const mainPlaces = (rmCounts['01'] || 0) + (rmCounts['96'] || 0);
        console.log(`\n✅ GŁÓWNE MIEJSCOWOŚCI (RM 01 + 96): ${mainPlaces}`);
        
        console.log('\n✅ LICZBA WSZYSTKICH WPISÓW W CSV:', dataLines.length);
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

countNewSIMC(); 