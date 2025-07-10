const mongoose = require('mongoose');
const Location = require('../models/locationModel');
require('dotenv').config();

async function fixLocationHierarchy() {
  try {
    console.log('🔧 Rozpoczynam naprawę hierarchii lokalizacji...');
    
    // Połącz z bazą danych
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Połączono z MongoDB');
    
    // 1. Usuń duplikaty województw
    console.log('🗑️ Usuwanie duplikatów województw...');
    const voivodeships = await Location.find({ type: 'województwo' });
    const uniqueVoivodeships = [];
    const seenNames = new Set();
    
    for (const voivodeship of voivodeships) {
      if (!seenNames.has(voivodeship.name)) {
        seenNames.add(voivodeship.name);
        uniqueVoivodeships.push(voivodeship);
      } else {
        console.log(`❌ Usuwam duplikat: ${voivodeship.name}`);
        await Location.findByIdAndDelete(voivodeship._id);
      }
    }
    
    console.log(`✅ Zachowano ${uniqueVoivodeships.length} unikalnych województw`);
    
    // 2. Utwórz prawidłową hierarchię województw
    const voivodeshipData = [
      { name: 'Dolnośląskie', code: '02', uniqueId: '02_woj' },
      { name: 'Kujawsko-pomorskie', code: '04', uniqueId: '04_woj' },
      { name: 'Lubelskie', code: '06', uniqueId: '06_woj' },
      { name: 'Lubuskie', code: '08', uniqueId: '08_woj' },
      { name: 'Łódzkie', code: '10', uniqueId: '10_woj' },
      { name: 'Małopolskie', code: '12', uniqueId: '12_woj' },
      { name: 'Mazowieckie', code: '14', uniqueId: '14_woj' },
      { name: 'Opolskie', code: '16', uniqueId: '16_woj' },
      { name: 'Podkarpackie', code: '18', uniqueId: '18_woj' },
      { name: 'Podlaskie', code: '20', uniqueId: '20_woj' },
      { name: 'Pomorskie', code: '22', uniqueId: '22_woj' },
      { name: 'Śląskie', code: '24', uniqueId: '24_woj' },
      { name: 'Świętokrzyskie', code: '26', uniqueId: '26_woj' },
      { name: 'Warmińsko-mazurskie', code: '28', uniqueId: '28_woj' },
      { name: 'Wielkopolskie', code: '30', uniqueId: '30_woj' },
      { name: 'Zachodniopomorskie', code: '32', uniqueId: '32_woj' }
    ];
    
    console.log('🏛️ Aktualizuję województwa...');
    for (const voivodeshipInfo of voivodeshipData) {
      let voivodeship = await Location.findOne({ 
        name: voivodeshipInfo.name, 
        type: 'województwo' 
      });
      
      if (!voivodeship) {
        voivodeship = new Location({
          ...voivodeshipInfo,
          type: 'województwo',
          isActive: true,
          isVerified: true,
          tags: ['administracja', 'województwo'],
          description: `Województwo ${voivodeshipInfo.name}`
        });
        await voivodeship.save();
        console.log(`✅ Utworzono: ${voivodeshipInfo.name}`);
      } else {
        // Aktualizuj istniejące
        voivodeship.uniqueId = voivodeshipInfo.uniqueId;
        voivodeship.code = voivodeshipInfo.code;
        voivodeship.isActive = true;
        voivodeship.isVerified = true;
        await voivodeship.save();
        console.log(`🔄 Zaktualizowano: ${voivodeshipInfo.name}`);
      }
    }
    
    // 3. Utwórz powiaty dla Dolnośląskiego (przykład)
    console.log('🏘️ Tworzę powiaty dla Dolnośląskiego...');
    const dolnoSlaskie = await Location.findOne({ name: 'Dolnośląskie', type: 'województwo' });
    
    const countiesData = [
      { name: 'bolesławiecki', code: '0201', uniqueId: '0201_pow' },
      { name: 'dzierżoniowski', code: '0202', uniqueId: '0202_pow' },
      { name: 'głogowski', code: '0203', uniqueId: '0203_pow' },
      { name: 'górowski', code: '0204', uniqueId: '0204_pow' },
      { name: 'jaworski', code: '0205', uniqueId: '0205_pow' },
      { name: 'jeleniogórski', code: '0206', uniqueId: '0206_pow' },
      { name: 'kamiennogórski', code: '0207', uniqueId: '0207_pow' },
      { name: 'kłodzki', code: '0208', uniqueId: '0208_pow' },
      { name: 'legnicki', code: '0209', uniqueId: '0209_pow' },
      { name: 'lubański', code: '0210', uniqueId: '0210_pow' },
      { name: 'lubiński', code: '0211', uniqueId: '0211_pow' },
      { name: 'lwówecki', code: '0212', uniqueId: '0212_pow' },
      { name: 'milicki', code: '0213', uniqueId: '0213_pow' },
      { name: 'oleśnicki', code: '0214', uniqueId: '0214_pow' },
      { name: 'oławski', code: '0215', uniqueId: '0215_pow' },
      { name: 'polkowicki', code: '0216', uniqueId: '0216_pow' },
      { name: 'strzeliński', code: '0217', uniqueId: '0217_pow' },
      { name: 'średzki', code: '0218', uniqueId: '0218_pow' },
      { name: 'świdnicki', code: '0219', uniqueId: '0219_pow' },
      { name: 'trzebnicki', code: '0220', uniqueId: '0220_pow' },
      { name: 'wałbrzyski', code: '0221', uniqueId: '0221_pow' },
      { name: 'wołowski', code: '0222', uniqueId: '0222_pow' },
      { name: 'wrocławski', code: '0223', uniqueId: '0223_pow' },
      { name: 'ząbkowicki', code: '0224', uniqueId: '0224_pow' },
      { name: 'zgorzelecki', code: '0225', uniqueId: '0225_pow' },
      { name: 'złotoryjski', code: '0226', uniqueId: '0226_pow' }
    ];
    
    for (const countyInfo of countiesData) {
      let county = await Location.findOne({ 
        name: countyInfo.name, 
        type: 'powiat',
        parentLocation: dolnoSlaskie._id
      });
      
      if (!county) {
        county = new Location({
          ...countyInfo,
          type: 'powiat',
          parentLocation: dolnoSlaskie._id,
          wojewodztwo: dolnoSlaskie._id,
          isActive: true,
          isVerified: true,
          tags: ['administracja', 'powiat'],
          description: `Powiat ${countyInfo.name} w województwie dolnośląskim`
        });
        await county.save();
        console.log(`✅ Utworzono powiat: ${countyInfo.name}`);
      }
    }
    
    // 4. Utwórz miasta na prawach powiatu
    const citiesData = [
      { name: 'Wrocław', code: '0261', uniqueId: '0261_miasto' },
      { name: 'Wałbrzych', code: '0262', uniqueId: '0262_miasto' },
      { name: 'Legnica', code: '0263', uniqueId: '0263_miasto' },
      { name: 'Jelenia Góra', code: '0264', uniqueId: '0264_miasto' }
    ];
    
    for (const cityInfo of citiesData) {
      let city = await Location.findOne({ 
        name: cityInfo.name, 
        type: 'miasto na prawach powiatu',
        parentLocation: dolnoSlaskie._id
      });
      
      if (!city) {
        city = new Location({
          ...cityInfo,
          type: 'miasto na prawach powiatu',
          parentLocation: dolnoSlaskie._id,
          wojewodztwo: dolnoSlaskie._id,
          isActive: true,
          isVerified: true,
          tags: ['administracja', 'miasto', 'powiat'],
          description: `Miasto ${cityInfo.name} na prawach powiatu`
        });
        await city.save();
        console.log(`✅ Utworzono miasto: ${cityInfo.name}`);
      }
    }
    
    // 5. Aktualizuj referencje w województwie
    const counties = await Location.find({ 
      type: 'powiat', 
      wojewodztwo: dolnoSlaskie._id 
    });
    const cities = await Location.find({ 
      type: 'miasto na prawach powiatu', 
      wojewodztwo: dolnoSlaskie._id 
    });
    
    dolnoSlaskie.children = [...counties.map(c => c._id), ...cities.map(c => c._id)];
    await dolnoSlaskie.save();
    
    console.log('✅ Hierarchia lokalizacji została naprawiona!');
    console.log(`📊 Statystyki:`);
    console.log(`   - Województwa: ${await Location.countDocuments({ type: 'województwo' })}`);
    console.log(`   - Powiaty: ${await Location.countDocuments({ type: 'powiat' })}`);
    console.log(`   - Miasta na prawach powiatu: ${await Location.countDocuments({ type: 'miasto na prawach powiatu' })}`);
    
  } catch (error) {
    console.error('❌ Błąd podczas naprawy hierarchii:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

// Uruchom skrypt
fixLocationHierarchy(); 