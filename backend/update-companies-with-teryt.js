const mongoose = require('mongoose');
const CompanyProfile = require('./models/companyProfileModel');
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

// Przykładowe kody SIMC dla głównych miast
const citySimcCodes = {
  'Warszawa': '0918123',
  'Kraków': '0950463',
  'Wrocław': '0986283',
  'Poznań': '0964611',
  'Gdańsk': '2209434',
  'Szczecin': '3212011',
  'Bydgoszcz': '0402011',
  'Lublin': '0662011',
  'Katowice': '2469011',
  'Białystok': '2061011',
  'Gdynia': '2206021',
  'Częstochowa': '2464011',
  'Radom': '1463011',
  'Sosnowiec': '2472011',
  'Toruń': '0463011',
  'Kielce': '2661011',
  'Gliwice': '2466011',
  'Zabrze': '2475011',
  'Bytom': '2462011',
  'Bielsko-Biała': '2461011',
  'Olsztyn': '2862011',
  'Rzeszów': '1863011',
  'Ruda Śląska': '2471011',
  'Rybnik': '2474011',
  'Tychy': '2476011',
  'Dąbrowa Górnicza': '2463011',
  'Płock': '1462011',
  'Elbląg': '2861011',
  'Opole': '1661011',
  'Gorzów Wielkopolski': '0861011',
  'Wałbrzych': '0262011',
  'Włocławek': '0464011',
  'Tarnów': '1263011',
  'Chorzów': '2463011',
  'Kalisz': '3061011',
  'Koszalin': '3261011',
  'Legnica': '0261011',
  'Grudziądz': '0462011',
  'Słupsk': '2262011',
  'Jaworzno': '2464011',
  'Jastrzębie-Zdrój': '2473011',
  'Nowy Sącz': '1262011',
  'Jelenia Góra': '0263011',
  'Siedlce': '1464011',
  'Mysłowice': '2470011',
  'Konin': '3062011',
  'Piotrków Trybunalski': '1062011',
  'Lubin': '0264011',
  'Inowrocław': '0465011',
  'Ostrowiec Świętokrzyski': '2662011',
  'Suwałki': '2062011',
  'Stargard': '3213011',
  'Gniezno': '3063011',
  'Zamość': '0664011',
  'Leszno': '3064011',
  'Zielona Góra': '0862011',
  'Przemyśl': '1862011',
  'Tarnobrzeg': '1864011',
  'Chełm': '0665011',
  'Ełk': '2863011',
  'Pruszków': '1465011',
  'Legionowo': '1466011',
  'Ostrołęka': '1467011',
  'Starachowice': '2671011',
  'Zawiercie': '2467011',
  'Mielec': '1811011',
  'Krosno': '1865011',
  'Dębica': '1803011',
  'Sanok': '1866011',
  'Jarosław': '1802011',
  'Łańcut': '1804011',
  'Przeworsk': '1814011',
  'Nisko': '1815011',
  'Kraśnik': '0666011',
  'Puławy': '0667011',
  'Świdnik': '0668011',
  'Biała Podlaska': '0669011',
  'Łuków': '0610011',
  'Radzyń Podlaski': '0611011',
  'Międzyrzec Podlaski': '0612011',
  'Parczew': '0613011',
  'Włodawa': '0614011',
  'Biłgoraj': '0602011',
  'Tomaszów Lubelski': '0618011',
  'Hrubieszów': '0604011',
  'Janów Lubelski': '0605011',
  'Krasnystaw': '0606011',
  'Lubartów': '0608011'
};

// Przykładowe kody ULIC dla ulic
const streetUlicCodes = {
  'Mickiewicza': '12345',
  'Słowackiego': '12346',
  'Kościuszki': '12347',
  'Piłsudskiego': '12348',
  'Dąbrowskiego': '12349',
  'Warszawska': '12350',
  'Krakowska': '12351',
  'Poznańska': '12352',
  'Gdańska': '12353',
  'Wrocławska': '12354',
  'Lubelska': '12355',
  'Katowicka': '12356',
  'Białostocka': '12357',
  'Szczecińska': '12358',
  'Bydgoska': '12359',
  'Toruńska': '12360',
  'Kielecka': '12361',
  'Rzeszowska': '12362',
  'Olsztyńska': '12363',
  'Zielonogórska': '12364',
  'Opolska': '12365',
  'Gorzowska': '12366',
  'Wałbrzyska': '12367',
  'Włocławska': '12368',
  'Tarnówska': '12369',
  'Kaliska': '12370',
  'Koszalińska': '12371',
  'Legnicka': '12372',
  'Grudziądzka': '12373',
  'Słupska': '12374',
  'Jaworznicka': '12375',
  'Jastrzębska': '12376',
  'Nowosądecka': '12377',
  'Jeleniogórska': '12378',
  'Siedlecka': '12379',
  'Mysłowicka': '12380',
  'Konińska': '12381',
  'Piotrkowska': '12382',
  'Lubińska': '12383',
  'Inowrocławska': '12384',
  'Ostrowiecka': '12385',
  'Suwalska': '12386',
  'Stargardzka': '12387',
  'Gnieźnieńska': '12388',
  'Zamojska': '12389',
  'Leszczyńska': '12390',
  'Przemyska': '12391',
  'Tarnobrzeska': '12392',
  'Chełmska': '12393',
  'Ełcka': '12394',
  'Pruszkowska': '12395',
  'Legionowska': '12396',
  'Ostrołęcka': '12397',
  'Starachowicka': '12398',
  'Zawierciańska': '12399',
  'Mielecka': '12400',
  'Krośnieńska': '12401',
  'Dębicka': '12402',
  'Sanocka': '12403',
  'Jarosławska': '12404',
  'Łańcucka': '12405',
  'Przeworska': '12406',
  'Niska': '12407',
  'Kraśnicka': '12408',
  'Puławska': '12409',
  'Świdnicka': '12410',
  'Bialskopodlaska': '12411',
  'Łukowska': '12412',
  'Radzyńska': '12413',
  'Międzyrzecka': '12414',
  'Parczewska': '12415',
  'Włodawska': '12416',
  'Biłgorajska': '12417',
  'Tomaszowska': '12418',
  'Hrubieszowska': '12419',
  'Janowska': '12420',
  'Krasnostawska': '12421',
  'Lubartowska': '12422'
};

async function updateCompaniesWithTeryt() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkie firmy z adresami
    const companies = await CompanyProfile.find({
      $or: [
        { 'address.city': { $exists: true, $ne: null, $ne: '' } },
        { location: { $exists: true, $ne: null } }
      ]
    });

    console.log(`📊 Znaleziono ${companies.length} firm do aktualizacji`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const company of companies) {
      let updated = false;

      // Sprawdź czy firma ma już kody TERYT
      if (company.teryt && company.teryt.fullCode) {
        console.log(`⚠️ Firma ${company.name} już ma kody TERYT: ${company.teryt.fullCode}`);
        skippedCount++;
        continue;
      }

      // Inicjalizuj obiekt TERYT jeśli nie istnieje
      if (!company.teryt) {
        company.teryt = {};
      }

      // Aktualizuj kod województwa
      if (company.address && company.address.city) {
        // Znajdź województwo na podstawie miasta
        const cityName = company.address.city;
        const cityInfo = Object.entries(citySimcCodes).find(([name]) => 
          name.toLowerCase() === cityName.toLowerCase()
        );

        if (cityInfo) {
          const [cityName, simcCode] = cityInfo;
          
          // Znajdź województwo dla tego miasta
          const voivodeshipEntry = Object.entries(voivodeshipCodes).find(([name, code]) => {
            // Mapowanie miast na województwa
            const cityVoivodeshipMap = {
              'Warszawa': 'Mazowieckie',
              'Kraków': 'Małopolskie',
              'Wrocław': 'Dolnośląskie',
              'Poznań': 'Wielkopolskie',
              'Gdańsk': 'Pomorskie',
              'Szczecin': 'Zachodniopomorskie',
              'Bydgoszcz': 'Kujawsko-Pomorskie',
              'Lublin': 'Lubelskie',
              'Katowice': 'Śląskie',
              'Białystok': 'Podlaskie',
              'Gdynia': 'Pomorskie',
              'Częstochowa': 'Śląskie',
              'Radom': 'Mazowieckie',
              'Sosnowiec': 'Śląskie',
              'Toruń': 'Kujawsko-Pomorskie',
              'Kielce': 'Świętokrzyskie',
              'Gliwice': 'Śląskie',
              'Zabrze': 'Śląskie',
              'Bytom': 'Śląskie',
              'Bielsko-Biała': 'Śląskie',
              'Olsztyn': 'Warmińsko-Mazurskie',
              'Rzeszów': 'Podkarpackie',
              'Ruda Śląska': 'Śląskie',
              'Rybnik': 'Śląskie',
              'Tychy': 'Śląskie',
              'Dąbrowa Górnicza': 'Śląskie',
              'Płock': 'Mazowieckie',
              'Elbląg': 'Warmińsko-Mazurskie',
              'Opole': 'Opolskie',
              'Gorzów Wielkopolski': 'Lubuskie',
              'Wałbrzych': 'Dolnośląskie',
              'Włocławek': 'Kujawsko-Pomorskie',
              'Tarnów': 'Małopolskie',
              'Chorzów': 'Śląskie',
              'Kalisz': 'Wielkopolskie',
              'Koszalin': 'Zachodniopomorskie',
              'Legnica': 'Dolnośląskie',
              'Grudziądz': 'Kujawsko-Pomorskie',
              'Słupsk': 'Pomorskie',
              'Jaworzno': 'Śląskie',
              'Jastrzębie-Zdrój': 'Śląskie',
              'Nowy Sącz': 'Małopolskie',
              'Jelenia Góra': 'Dolnośląskie',
              'Siedlce': 'Mazowieckie',
              'Mysłowice': 'Śląskie',
              'Konin': 'Wielkopolskie',
              'Piotrków Trybunalski': 'Łódzkie',
              'Lubin': 'Dolnośląskie',
              'Inowrocław': 'Kujawsko-Pomorskie',
              'Ostrowiec Świętokrzyski': 'Świętokrzyskie',
              'Suwałki': 'Podlaskie',
              'Stargard': 'Zachodniopomorskie',
              'Gniezno': 'Wielkopolskie',
              'Zamość': 'Lubelskie',
              'Leszno': 'Wielkopolskie',
              'Zielona Góra': 'Lubuskie',
              'Przemyśl': 'Podkarpackie',
              'Tarnobrzeg': 'Podkarpackie',
              'Chełm': 'Lubelskie',
              'Ełk': 'Warmińsko-Mazurskie',
              'Pruszków': 'Mazowieckie',
              'Legionowo': 'Mazowieckie',
              'Ostrołęka': 'Mazowieckie',
              'Starachowice': 'Świętokrzyskie',
              'Zawiercie': 'Śląskie',
              'Mielec': 'Podkarpackie',
              'Krosno': 'Podkarpackie',
              'Dębica': 'Podkarpackie',
              'Sanok': 'Podkarpackie',
              'Jarosław': 'Podkarpackie',
              'Łańcut': 'Podkarpackie',
              'Przeworsk': 'Podkarpackie',
              'Nisko': 'Podkarpackie',
              'Kraśnik': 'Lubelskie',
              'Puławy': 'Lubelskie',
              'Świdnik': 'Lubelskie',
              'Biała Podlaska': 'Lubelskie',
              'Łuków': 'Lubelskie',
              'Radzyń Podlaski': 'Lubelskie',
              'Międzyrzec Podlaski': 'Lubelskie',
              'Parczew': 'Lubelskie',
              'Włodawa': 'Lubelskie',
              'Biłgoraj': 'Lubelskie',
              'Tomaszów Lubelski': 'Lubelskie',
              'Hrubieszów': 'Lubelskie',
              'Janów Lubelski': 'Lubelskie',
              'Krasnystaw': 'Lubelskie',
              'Lubartów': 'Lubelskie'
            };
            return cityVoivodeshipMap[cityName] === name;
          });

          if (voivodeshipEntry) {
            const [voivodeshipName, voivodeshipCode] = voivodeshipEntry;
            
            company.teryt.voivodeshipCode = voivodeshipCode;
            company.teryt.simcCode = simcCode;
            
            // Generuj przykładowe kody powiatu i gminy (w rzeczywistości pobierałoby się z bazy GUS)
            company.teryt.countyCode = voivodeshipCode + '01'; // Przykładowy kod powiatu
            company.teryt.municipalityCode = voivodeshipCode + '0101'; // Przykładowy kod gminy
            company.teryt.tercCode = voivodeshipCode + '0101'; // Pełny kod TERC
            
            // Dodaj kod ulicy jeśli jest dostępny
            if (company.address.street) {
              const streetName = company.address.street.replace(/^ul\.\s*/i, '').trim();
              const streetCode = streetUlicCodes[streetName];
              if (streetCode) {
                company.teryt.ulicCode = streetCode;
              }
            }
            
            updated = true;
          }
        }
      }

      // Wygeneruj pełny kod TERYT
      if (updated) {
        // Wygeneruj pełny kod bez wywoływania save()
        if (company.teryt.tercCode && company.teryt.simcCode && company.teryt.ulicCode) {
          company.teryt.fullCode = `${company.teryt.tercCode}${company.teryt.simcCode}${company.teryt.ulicCode}`;
        } else if (company.teryt.tercCode && company.teryt.simcCode) {
          company.teryt.fullCode = `${company.teryt.tercCode}${company.teryt.simcCode}`;
        } else if (company.teryt.tercCode) {
          company.teryt.fullCode = company.teryt.tercCode;
        }
        
        await company.save();
        console.log(`✅ Zaktualizowano firmę: ${company.name} - ${company.teryt.fullCode}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Nie udało się znaleźć kodów TERYT dla firmy: ${company.name}`);
        skippedCount++;
      }
    }

    console.log(`\n📊 Podsumowanie aktualizacji firm:`);
    console.log(`   ✅ Zaktualizowano: ${updatedCount} firm`);
    console.log(`   ⚠️ Pominięto: ${skippedCount} firm`);
    console.log(`   📊 Łącznie: ${companies.length} firm`);

  } catch (error) {
    console.error('❌ Błąd podczas aktualizacji firm:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

updateCompaniesWithTeryt(); 