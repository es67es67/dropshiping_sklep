const mongoose = require('mongoose');

// Modele
const Wojewodztwo = require('./models/wojewodztwoModel');
const Powiat = require('./models/powiatModel');
const Gmina = require('./models/gminaModel');

// Konfiguracja
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkHierarchy() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        console.log('\n📊 SPRAWDZAM HIERARCHIĘ:');
        console.log('========================');
        
        // Sprawdź województwa
        const wojewodztwa = await Wojewodztwo.find({}, 'name code');
        console.log(`🏛️  Województwa (${wojewodztwa.length}):`);
        wojewodztwa.forEach(woj => {
            console.log(`   ${woj.code} - ${woj.name}`);
        });
        
        // Sprawdź powiaty
        const powiaty = await Powiat.find({}, 'name code wojewodztwo').populate('wojewodztwo', 'name code');
        console.log(`\n🏘️  Powiaty (${powiaty.length}):`);
        powiaty.slice(0, 10).forEach(pow => {
            console.log(`   ${pow.code} - ${pow.name} (woj: ${pow.wojewodztwo?.name || 'BRAK'})`);
        });
        if (powiaty.length > 10) {
            console.log(`   ... i ${powiaty.length - 10} więcej`);
        }
        
        // Sprawdź gminy
        const gminy = await Gmina.find({}, 'name code wojewodztwo powiat').populate('wojewodztwo', 'name code').populate('powiat', 'name code');
        console.log(`\n🏘️  Gminy (${gminy.length}):`);
        if (gminy.length > 0) {
            gminy.slice(0, 5).forEach(gmi => {
                console.log(`   ${gmi.code} - ${gmi.name} (woj: ${gmi.wojewodztwo?.name || 'BRAK'}, pow: ${gmi.powiat?.name || 'BRAK'})`);
            });
        } else {
            console.log('   ❌ Brak gmin w bazie!');
        }
        
        // Sprawdź problemy z referencjami
        console.log('\n🔍 SPRAWDZAM PROBLEMY Z REFERENCJAMI:');
        
        const powiatyBezWojewodztwa = await Powiat.find({ wojewodztwo: { $exists: false } });
        console.log(`⚠️  Powiaty bez województwa: ${powiatyBezWojewodztwa.length}`);
        
        const gminyBezPowiatu = await Gmina.find({ powiat: { $exists: false } });
        console.log(`⚠️  Gminy bez powiatu: ${gminyBezPowiatu.length}`);
        
        // Sprawdź przykładowe kody powiatów
        console.log('\n🔍 PRZYKŁADOWE KODY POWIATÓW:');
        const samplePowiaty = await Powiat.find({}, 'code').limit(10);
        samplePowiaty.forEach(pow => {
            console.log(`   ${pow.code}`);
        });
        
        console.log('\n========================');
        
    } catch (error) {
        console.error('❌ Błąd podczas sprawdzania hierarchii:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkHierarchy(); 