const fs = require('fs');
const path = require('path');

async function countCSVRows() {
    try {
        console.log('📊 LICZĘ WIERSZE W PLIKACH CSV...');
        
        const TERC_FILE = path.join(__dirname, '../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');
        const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');
        const ULIC_FILE = path.join(__dirname, '../inne/dane adresowe gus/ULIC_Adresowy_2025-07-07.csv');
        
        // Sprawdź czy pliki istnieją
        if (!fs.existsSync(TERC_FILE)) {
            console.log('❌ Plik TERC nie istnieje:', TERC_FILE);
            return;
        }
        
        if (!fs.existsSync(SIMC_FILE)) {
            console.log('❌ Plik SIMC nie istnieje:', SIMC_FILE);
            return;
        }
        
        if (!fs.existsSync(ULIC_FILE)) {
            console.log('❌ Plik ULIC nie istnieje:', ULIC_FILE);
            return;
        }
        
        // Policz wiersze w TERC (województwa, powiaty, gminy)
        console.log('\n📋 PLIK TERC (województwa, powiaty, gminy):');
        const tercContent = fs.readFileSync(TERC_FILE, 'utf8');
        const tercLines = tercContent.split('\n').filter(line => line.trim() !== '');
        console.log(`   Wszystkich wierszy: ${tercLines.length}`);
        
        // Policz wiersze w SIMC (miejscowości)
        console.log('\n📋 PLIK SIMC (miejscowości):');
        const simcContent = fs.readFileSync(SIMC_FILE, 'utf8');
        const simcLines = simcContent.split('\n').filter(line => line.trim() !== '');
        console.log(`   Wszystkich wierszy: ${simcLines.length}`);
        
        // Policz wiersze w ULIC (ulice)
        console.log('\n📋 PLIK ULIC (ulice):');
        const ulicContent = fs.readFileSync(ULIC_FILE, 'utf8');
        const ulicLines = ulicContent.split('\n').filter(line => line.trim() !== '');
        console.log(`   Wszystkich wierszy: ${ulicLines.length}`);
        
        // Analiza TERC - sprawdź ile jest województw, powiatów, gmin
        console.log('\n🔍 ANALIZA TERC:');
        let wojCount = 0;
        let powCount = 0;
        let gmiCount = 0;
        
        tercLines.forEach((line, index) => {
            if (index === 0) return; // Pomiń nagłówek
            
            const parts = line.split(';');
            if (parts.length >= 4) {
                const woj = parts[0]?.trim();
                const pow = parts[1]?.trim();
                const gmi = parts[2]?.trim();
                
                if (woj && woj !== '' && (!pow || pow === '') && (!gmi || gmi === '')) {
                    wojCount++;
                } else if (woj && woj !== '' && pow && pow !== '' && (!gmi || gmi === '')) {
                    powCount++;
                } else if (woj && woj !== '' && pow && pow !== '' && gmi && gmi !== '') {
                    gmiCount++;
                }
            }
        });
        
        console.log(`   Województwa: ${wojCount}`);
        console.log(`   Powiaty: ${powCount}`);
        console.log(`   Gminy: ${gmiCount}`);
        
        console.log('\n========================');
        console.log('✅ Liczenie zakończone');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

countCSVRows(); 