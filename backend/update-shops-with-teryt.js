const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const Location = require('./models/locationModel');
require('dotenv').config();

// Mapowanie nazw województw na kody TERC
const voivodeshipCodes = {
  'Dolnośląskie': '02',
  'Kujawsko-Pomorskie': '04',
  'Lubelskie': '06',
  'Lubuskie': '08',
  'Łódzkie': '10',
  'Małopolskie': '12',
  'Mazowieckie': '14',
  'Opolskie': '16',
  'Podkarpackie': '18',
  'Podlaskie': '20',
  'Pomorskie': '22',
  'Śląskie': '24',
  'Świętokrzyskie': '26',
  'Warmińsko-Mazurskie': '28',
  'Wielkopolskie': '30',
  'Zachodniopomorskie': '32'
};

// Przykładowe kody SIMC dla głównych miast (w rzeczywistości pobierałoby się z bazy GUS)
const citySimcCodes = {
  'Warszawa': '0918123',
  'Kraków': '0950463',
  'Wrocław': '0986283',
  'Poznań': '0969663',
  'Gdańsk': '2269433',
  'Szczecin': '3211633',
  'Bydgoszcz': '0401011',
  'Lublin': '0954700',
  'Katowice': '2469011',
  'Białystok': '2001011',
  'Gdynia': '2268623',
  'Częstochowa': '2462011',
  'Radom': '1463011',
  'Sosnowiec': '2472011',
  'Toruń': '0463011',
  'Kielce': '2661011',
  'Gliwice': '2466011',
  'Zabrze': '2475011',
  'Bytom': '2469011',
  'Bielsko-Biała': '2461011',
  'Olsztyn': '2862011',
  'Rzeszów': '1863011',
  'Ruda Śląska': '2474011',
  'Rybnik': '2476011',
  'Tychy': '2477011',
  'Dąbrowa Górnicza': '2463011',
  'Płock': '1462011',
  'Elbląg': '2863011',
  'Opole': '1662011',
  'Gorzów Wielkopolski': '0861011',
  'Wałbrzych': '0262011',
  'Włocławek': '0464011',
  'Tarnów': '1263011',
  'Chorzów': '2463011',
  'Kalisz': '3061011',
  'Koszalin': '3269011',
  'Legnica': '0261011',
  'Grudziądz': '0462011',
  'Słupsk': '2269011',
  'Jaworzno': '2464011',
  'Jastrzębie-Zdrój': '2465011',
  'Nowy Sącz': '1262011',
  'Jelenia Góra': '0263011',
  'Siedlce': '1464011',
  'Mysłowice': '2467011',
  'Konin': '3062011',
  'Piotrków Trybunalski': '1062011',
  'Lubin': '0264011',
  'Inowrocław': '0465011',
  'Ostrowiec Świętokrzyski': '2662011',
  'Suwałki': '2062011',
  'Stargard': '3214011',
  'Gniezno': '3063011',
  'Zamość': '0664011',
  'Leszno': '3064011',
  'Zielona Góra': '0862011',
  'Przemyśl': '1862011',
  'Tarnobrzeg': '1864011',
  'Chełm': '0662011',
  'Ełk': '2864011',
  'Pruszków': '1462011',
  'Legionowo': '1462021',
  'Ostrołęka': '1465011',
  'Starachowice': '2663011',
  'Zawiercie': '2468011',
  'Mielec': '1811011',
  'Krosno': '1865011',
  'Dębica': '1803011',
  'Sanok': '1866011',
  'Jarosław': '1867011',
  'Łańcut': '1868011',
  'Przeworsk': '1869011',
  'Nisko': '1870011',
  'Kraśnik': '0663011',
  'Puławy': '0664011',
  'Świdnik': '0665011',
  'Biała Podlaska': '0666011',
  'Łuków': '0667011',
  'Radzyń Podlaski': '0668011',
  'Międzyrzec Podlaski': '0669011',
  'Parczew': '0670011',
  'Włodawa': '0671011',
  'Biłgoraj': '0672011',
  'Tomaszów Lubelski': '0673011',
  'Hrubieszów': '0674011',
  'Janów Lubelski': '0675011',
  'Krasnystaw': '0676011',
  'Lubartów': '0677011'
};

// Przykładowe kody ULIC dla głównych ulic (w rzeczywistości pobierałoby się z bazy GUS)
const streetUlicCodes = {
  'ul. Przykładowa': '00001',
  'ul. Główna': '00002',
  'ul. Długa': '00003',
  'ul. Krótka': '00004',
  'ul. Szeroka': '00005',
  'ul. Wąska': '00006',
  'ul. Nowa': '00007',
  'ul. Stara': '00008',
  'ul. Centralna': '00009',
  'ul. Północna': '00010',
  'ul. Południowa': '00011',
  'ul. Wschodnia': '00012',
  'ul. Zachodnia': '00013',
  'ul. Kwiatowa': '00014',
  'ul. Słoneczna': '00015',
  'ul. Deszczowa': '00016',
  'ul. Spokojna': '00017',
  'ul. Wesoła': '00018',
  'ul. Smutna': '00019',
  'ul. Cicha': '00020'
};

async function updateShopsWithTeryt() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkie sklepy
    const shops = await Shop.find({});
    console.log(`📊 Znaleziono ${shops.length} sklepów do aktualizacji`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const shop of shops) {
      try {
        let updated = false;
        
        // Sprawdź czy sklep ma już kody TERYT
        if (shop.teryt && shop.teryt.fullCode) {
          console.log(`⏭️ Sklep ${shop.name} już ma kody TERYT, pomijam`);
          skippedCount++;
          continue;
        }

        // Inicjalizuj obiekt teryt jeśli nie istnieje
        if (!shop.teryt) {
          shop.teryt = {};
        }

        // Znajdź kod województwa
        if (shop.address.voivodeship && voivodeshipCodes[shop.address.voivodeship]) {
          shop.teryt.voivodeshipCode = voivodeshipCodes[shop.address.voivodeship];
          updated = true;
        }

        // Znajdź kod SIMC dla miasta
        if (shop.address.city && citySimcCodes[shop.address.city]) {
          shop.teryt.simcCode = citySimcCodes[shop.address.city];
          updated = true;
        }

        // Znajdź kod ULIC dla ulicy
        if (shop.address.street && streetUlicCodes[shop.address.street]) {
          shop.teryt.ulicCode = streetUlicCodes[shop.address.street];
          updated = true;
        }

        // Wygeneruj kod TERC (województwo + powiat + gmina)
        // Na razie używamy domyślnych kodów powiatu i gminy
        if (shop.teryt.voivodeshipCode) {
          shop.teryt.countyCode = '01'; // Domyślny kod powiatu
          shop.teryt.municipalityCode = '01'; // Domyślny kod gminy
          shop.teryt.tercCode = `${shop.teryt.voivodeshipCode}${shop.teryt.countyCode}${shop.teryt.municipalityCode}`;
          updated = true;
        }

        // Wygeneruj pełny kod TERYT
        if (updated) {
          // Wygeneruj pełny kod bez wywoływania save()
          if (shop.teryt.tercCode && shop.teryt.simcCode && shop.teryt.ulicCode) {
            shop.teryt.fullCode = `${shop.teryt.tercCode}${shop.teryt.simcCode}${shop.teryt.ulicCode}`;
          } else if (shop.teryt.tercCode && shop.teryt.simcCode) {
            shop.teryt.fullCode = `${shop.teryt.tercCode}${shop.teryt.simcCode}`;
          } else if (shop.teryt.tercCode) {
            shop.teryt.fullCode = shop.teryt.tercCode;
          }
          
          await shop.save();
          console.log(`✅ Zaktualizowano sklep: ${shop.name} - ${shop.teryt.fullCode}`);
          updatedCount++;
        } else {
          console.log(`⚠️ Nie udało się znaleźć kodów TERYT dla: ${shop.name}`);
          skippedCount++;
        }

      } catch (error) {
        console.error(`❌ Błąd podczas aktualizacji sklepu ${shop.name}:`, error.message);
        skippedCount++;
      }
    }

    console.log(`\n📊 Podsumowanie aktualizacji:`);
    console.log(`   Zaktualizowanych sklepów: ${updatedCount}`);
    console.log(`   Pominiętych sklepów: ${skippedCount}`);
    console.log(`   Łącznie sklepów: ${shops.length}`);

    // Pokaż przykłady zaktualizowanych sklepów
    console.log(`\n🏪 Przykłady zaktualizowanych sklepów:`);
    const sampleShops = await Shop.find({ 'teryt.fullCode': { $exists: true } }).limit(5);
    sampleShops.forEach((shop, index) => {
      console.log(`   ${index + 1}. ${shop.name} - ${shop.address.city}`);
      console.log(`      TERC: ${shop.teryt.tercCode || 'brak'}`);
      console.log(`      SIMC: ${shop.teryt.simcCode || 'brak'}`);
      console.log(`      ULIC: ${shop.teryt.ulicCode || 'brak'}`);
      console.log(`      Pełny kod: ${shop.teryt.fullCode || 'brak'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Błąd podczas aktualizacji sklepów:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

updateShopsWithTeryt(); 