const mongoose = require('mongoose');
const Location = require('../models/locationModel');
require('dotenv').config();

// Dane gmin dla Dolnośląskiego (przykład)
const gminyData = {
  '0201': [ // bolesławiecki
    { name: 'Bolesławiec', type: 'gmina miejska', code: '020101' },
    { name: 'Bolesławiec', type: 'gmina wiejska', code: '020102' },
    { name: 'Gromadka', type: 'gmina wiejska', code: '020103' },
    { name: 'Nowogrodziec', type: 'gmina miejsko-wiejska', code: '020104' },
    { name: 'Osiecznica', type: 'gmina wiejska', code: '020105' },
    { name: 'Warta Bolesławiecka', type: 'gmina wiejska', code: '020106' }
  ],
  '0202': [ // dzierżoniowski
    { name: 'Dzierżoniów', type: 'gmina miejska', code: '020201' },
    { name: 'Dzierżoniów', type: 'gmina wiejska', code: '020202' },
    { name: 'Łagiewniki', type: 'gmina wiejska', code: '020203' },
    { name: 'Niemcza', type: 'gmina miejsko-wiejska', code: '020204' },
    { name: 'Pieszyce', type: 'gmina miejsko-wiejska', code: '020205' },
    { name: 'Piława Górna', type: 'gmina miejsko-wiejska', code: '020206' },
    { name: 'Ząbkowice Śląskie', type: 'gmina miejska', code: '020207' }
  ]
};

async function createFullHierarchy() {
  try {
    console.log('🏗️ Rozpoczynam tworzenie pełnej hierarchii lokalizacji...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Połączono z MongoDB');
    
    // Pobierz wszystkie powiaty
    const counties = await Location.find({ type: 'powiat' });
    console.log(`📊 Znaleziono ${counties.length} powiatów`);
    
    // Pobierz województwa
    const voivodeships = await Location.find({ type: 'województwo' });
    const voivodeshipMap = {};
    voivodeships.forEach(v => {
      voivodeshipMap[v.code] = v._id;
    });
    
    let totalGminy = 0;
    let totalMiejscowosci = 0;
    
    for (const county of counties) {
      console.log(`🏘️ Przetwarzam powiat: ${county.name}`);
      
      // Sprawdź czy powiat ma gminy
      const existingGminy = await Location.find({ 
        type: 'gmina', 
        parentLocation: county._id 
      });
      
      if (existingGminy.length === 0) {
        // Utwórz przykładowe gminy dla tego powiatu
        const gminyForCounty = gminyData[county.code] || createDefaultGminy(county);
        
        for (const gminaInfo of gminyForCounty) {
          // Sprawdź czy gmina już istnieje
          const existingGmina = await Location.findOne({ 
            uniqueId: `${gminaInfo.code}_gmina` 
          });
          
          let gmina = null;
          if (!existingGmina) {
            gmina = new Location({
              name: gminaInfo.name,
              type: 'gmina',
              code: gminaInfo.code,
              uniqueId: `${gminaInfo.code}_gmina`,
              parentLocation: county._id,
              wojewodztwo: voivodeshipMap[county.code.substring(0, 2)],
              powiat: county._id,
              isActive: true,
              isVerified: true,
              tags: ['administracja', 'gmina', gminaInfo.type],
              description: `Gmina ${gminaInfo.name} w powiecie ${county.name}`
            });
            
            await gmina.save();
            totalGminy++;
            console.log(`✅ Utworzono gminę: ${gminaInfo.name}`);
          } else {
            console.log(`⏭️ Gmina już istnieje: ${gminaInfo.name}`);
          }
          
          // Utwórz przykładowe miejscowości dla gminy
          const gminaToUse = gmina || existingGmina;
          const miejscowosci = createDefaultMiejscowosci(gminaToUse, gminaInfo);
          for (const miejscowoscInfo of miejscowosci) {
            // Sprawdź czy miejscowość już istnieje
            const existingMiejscowosc = await Location.findOne({ 
              uniqueId: `${miejscowoscInfo.code}_miejsc` 
            });
            
            if (!existingMiejscowosc) {
              const miejscowosc = new Location({
                name: miejscowoscInfo.name,
                type: 'miejscowość',
                code: miejscowoscInfo.code,
                uniqueId: `${miejscowoscInfo.code}_miejsc`,
                parentLocation: gminaToUse._id,
                wojewodztwo: voivodeshipMap[county.code.substring(0, 2)],
                powiat: county._id,
                gmina: gminaToUse._id,
                isActive: true,
                isVerified: true,
                tags: ['miejscowość', miejscowoscInfo.type],
                description: `Miejscowość ${miejscowoscInfo.name} w gminie ${gminaInfo.name}`
              });
              
              await miejscowosc.save();
              totalMiejscowosci++;
              console.log(`✅ Utworzono miejscowość: ${miejscowoscInfo.name}`);
            } else {
              console.log(`⏭️ Miejscowość już istnieje: ${miejscowoscInfo.name}`);
            }
          }
        }
      }
    }
    
    console.log('✅ Pełna hierarchia została utworzona!');
    console.log(`📊 Statystyki:`);
    console.log(`   - Województwa: ${await Location.countDocuments({ type: 'województwo' })}`);
    console.log(`   - Powiaty: ${await Location.countDocuments({ type: 'powiat' })}`);
    console.log(`   - Miasta na prawach powiatu: ${await Location.countDocuments({ type: 'miasto na prawach powiatu' })}`);
    console.log(`   - Gminy: ${await Location.countDocuments({ type: 'gmina' })}`);
    console.log(`   - Miejscowości: ${await Location.countDocuments({ type: 'miejscowość' })}`);
    console.log(`   - Nowe gminy: ${totalGminy}`);
    console.log(`   - Nowe miejscowości: ${totalMiejscowosci}`);
    
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia hierarchii:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

function createDefaultGminy(county) {
  // Tworzy domyślne gminy dla powiatu
  return [
    { name: `${county.name} (gmina miejska)`, type: 'gmina miejska', code: `${county.code}01` },
    { name: `${county.name} (gmina wiejska)`, type: 'gmina wiejska', code: `${county.code}02` },
    { name: `${county.name} (gmina miejsko-wiejska)`, type: 'gmina miejsko-wiejska', code: `${county.code}03` }
  ];
}

function createDefaultMiejscowosci(gmina, gminaInfo) {
  // Tworzy domyślne miejscowości dla gminy
  return [
    { name: `${gminaInfo.name} (główna)`, type: 'miejscowość główna', code: `${gminaInfo.code}01` },
    { name: `${gminaInfo.name} (osada)`, type: 'osada', code: `${gminaInfo.code}02` },
    { name: `${gminaInfo.name} (kolonia)`, type: 'kolonia', code: `${gminaInfo.code}03` }
  ];
}

createFullHierarchy(); 