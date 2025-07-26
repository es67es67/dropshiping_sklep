const fs = require('fs');
const path = require('path');

async function countSIMCRows() {
    try {
        console.log('📊 LICZĘ WIERSZE W PLIKU SIMC...');
        
        const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');
        
        // Sprawdź czy plik istnieje
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
        
        // Sprawdź pierwsze kilka wierszy
        console.log('\n🔍 PIERWSZE 5 WIERSZY:');
        dataLines.slice(0, 5).forEach((line, index) => {
            const columns = line.split(',');
            console.log(`${index + 1}. ${columns[0]} - ${columns[1]} - ${columns[2]}`);
        });
        
        // Sprawdź ostatnie kilka wierszy
        console.log('\n🔍 OSTATNIE 5 WIERSZY:');
        dataLines.slice(-5).forEach((line, index) => {
            const columns = line.split(',');
            console.log(`${dataLines.length - 4 + index}. ${columns[0]} - ${columns[1]} - ${columns[2]}`);
        });
        
        console.log('\n✅ LICZBA MIEJSCOWOŚCI W CSV:', dataLines.length);
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

countSIMCRows(); 