const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importuj modele
const Miejscowosc = require('./models/miejscowoscModel');

// Ścieżka do pliku JSON
const JSON_FILE = path.join(__dirname, 'miejscowosci.json');

async function insertManyMiejscowosci() {
    try {
        console.log('🚀 ROZPOCZYNAM INSERT MANY MIEJSCOWOŚCI...');
        
        // Sprawdź czy plik JSON istnieje
        if (!fs.existsSync(JSON_FILE)) {
            console.error('❌ Plik JSON nie istnieje:', JSON_FILE);
            return;
        }
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        // Wczytaj JSON
        console.log('📖 Wczytuję plik JSON...');
        const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
        console.log(`📊 Wczytano ${jsonData.length} miejscowości`);
        
        // Wyczyść kolekcję
        console.log('🗑️ Czyszczę kolekcję miejscowości...');
        await Miejscowosc.deleteMany({});
        console.log('✅ Kolekcja wyczyszczona');
        
        // Importuj wszystkie miejscowości
        console.log('🚀 Importuję miejscowości...');
        console.log('⏳ To może potrwać kilka minut...');
        
        const result = await Miejscowosc.insertMany(jsonData);
        console.log(`✅ Zaimportowano ${result.length} miejscowości!`);
        
        // Usuń plik JSON
        fs.unlinkSync(JSON_FILE);
        console.log('🗑️ Usunięto plik tymczasowy');
        
        console.log('\n🎉 IMPORT ZAKOŃCZONY!');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

// Uruchom import
insertManyMiejscowosci(); 