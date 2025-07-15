const mongoose = require('mongoose');
require('dotenv').config();

async function seedCompanies() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const CompanyProfile = require('./models/companyProfileModel');
    const User = require('./models/userModel');

    // Usuń wszystkich użytkowników z e-mailem admin@test.com
    console.log('🗑️ Usuwanie starych użytkowników admin@test.com...');
    await User.deleteMany({ email: 'admin@test.com' });
    console.log('✅ Usunięto stare konta admin');

    // Usuń również użytkowników z nazwą admin
    console.log('🗑️ Usuwanie użytkowników z nazwą admin...');
    await User.deleteMany({ username: 'admin' });
    console.log('✅ Usunięto użytkowników z nazwą admin');

    // Utwórz nowego użytkownika admin
    console.log('👤 Tworzenie nowego użytkownika admin...');
    const owner = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Test',
      role: 'admin',
      isActive: true
    });
    console.log(`✅ Utworzono użytkownika: ${owner.username} (${owner._id})`);

    // Usuń istniejące firmy (opcjonalnie)
    console.log('🗑️ Usuwanie istniejących firm...');
    await CompanyProfile.deleteMany({});
    console.log('✅ Usunięto istniejące firmy');

    const industries = [
      'Technologia', 'Moda', 'Ekologia', 'Marketing', 'Gastronomia',
      'Budownictwo', 'Transport', 'Edukacja', 'Zdrowie', 'Finanse',
      'Turystyka', 'Sport', 'Motoryzacja', 'Nieruchomości', 'Media',
      'Sztuka', 'Rozrywka', 'Rolnictwo', 'Energetyka', 'IT',
      'Logistyka', 'Handel', 'Usługi', 'Produkcja', 'Konsulting',
      'Bezpieczeństwo', 'Komunikacja', 'Badania', 'Design', 'Innowacje'
    ];

    const cities = [
      'Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk',
      'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok',
      'Gdynia', 'Częstochowa', 'Radom', 'Sosnowiec', 'Toruń',
      'Kielce', 'Rzeszów', 'Gliwice', 'Zabrze', 'Bytom',
      'Olsztyn', 'Bielsko-Biała', 'Ruda Śląska', 'Rybnik', 'Tychy',
      'Dąbrowa Górnicza', 'Płock', 'Elbląg', 'Opole', 'Gorzów Wielkopolski'
    ];

    const companies = [];
    const revenueEnums = ['<1M', '1M-10M', '10M-50M', '50M-100M', '100M+'];

    for (let i = 1; i <= 30; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      const company = {
        owner: owner._id,
        name: `Firma ${i} - ${industry}`,
        legalName: `Firma ${i} Sp. z o.o.`,
        description: `Profesjonalna firma z branży ${industry.toLowerCase()}, działająca na rynku od wielu lat. Oferujemy najwyższej jakości usługi i produkty.`,
        shortDescription: `Lider w branży ${industry.toLowerCase()}`,
        companyType: 'sme',
        industry: industry,
        subIndustry: `${industry} - Specjalizacja`,
        categories: [industry, 'Usługi', 'Profesjonalne'],
        tags: [industry.toLowerCase(), 'profesjonalne', 'jakość'],
        contact: {
          email: `kontakt@firma${i}.pl`,
          phone: `+48 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
          website: `https://firma${i}.pl`
        },
        address: {
          street: `ul. Przykładowa ${Math.floor(Math.random() * 100) + 1}`,
          city: city,
          postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`,
          country: 'Polska'
        },
        location: {
          type: 'Point',
          coordinates: [
            14 + Math.random() * 10, // Długość geograficzna (Polska)
            49 + Math.random() * 5   // Szerokość geograficzna (Polska)
          ]
        },
        logo: `https://via.placeholder.com/150x150/2196F3/FFFFFF?text=F${i}`,
        coverImage: `https://via.placeholder.com/800x400/1976D2/FFFFFF?text=${encodeURIComponent(industry)}`,
        images: [
          `https://via.placeholder.com/400x300/42A5F5/FFFFFF?text=Zdjęcie+1`,
          `https://via.placeholder.com/400x300/64B5F6/FFFFFF?text=Zdjęcie+2`
        ],
        companyInfo: {
          founded: 2010 + Math.floor(Math.random() * 14),
          employees: Math.floor(Math.random() * 100) + 5,
          revenue: revenueEnums[Math.floor(Math.random() * revenueEnums.length)],
          certifications: ['ISO 9001', 'ISO 14001'],
          awards: ['Nagroda Jakości 2023', 'Lider Branży 2022']
        },
        services: [
          {
            name: `Usługa ${industry}`,
            description: `Profesjonalna usługa w dziedzinie ${industry.toLowerCase()}`,
            price: `${Math.floor(Math.random() * 1000) + 100} PLN`
          },
          {
            name: `Konsulting ${industry}`,
            description: `Doradztwo specjalistyczne`,
            price: `${Math.floor(Math.random() * 500) + 200} PLN/h`
          }
        ],
        products: [
          {
            name: `Produkt ${industry}`,
            description: `Innowacyjny produkt z branży ${industry.toLowerCase()}`,
            price: `${Math.floor(Math.random() * 500) + 50} PLN`
          }
        ],
        team: [
          {
            name: 'Jan Kowalski',
            position: 'Dyrektor Generalny',
            email: 'jan.kowalski@firma.pl',
            phone: '+48 123 456 789'
          },
          {
            name: 'Anna Nowak',
            position: 'Kierownik Projektów',
            email: 'anna.nowak@firma.pl',
            phone: '+48 987 654 321'
          }
        ],
        seo: {
          title: `Firma ${i} - ${industry} | Profesjonalne usługi`,
          description: `Firma ${i} oferuje profesjonalne usługi w branży ${industry.toLowerCase()}. Sprawdź naszą ofertę!`,
          keywords: [industry.toLowerCase(), 'usługi', 'profesjonalne', city.toLowerCase()],
          slug: `firma-${i}-${industry.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        },
        settings: {
          isPublic: true,
          allowReviews: true,
          allowContact: true,
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        stats: {
          profileViews: Math.floor(Math.random() * 1000),
          followers: Math.floor(Math.random() * 500),
          averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          totalReviews: Math.floor(Math.random() * 100),
          applications: Math.floor(Math.random() * 50)
        },
        isActive: true,
        status: 'active'
      };

      companies.push(company);
    }

    console.log('🏢 Dodawanie firm do bazy danych...');
    const createdCompanies = await CompanyProfile.insertMany(companies);
    console.log(`✅ Dodano ${createdCompanies.length} firm do bazy danych`);

    // Pokaż kilka przykładowych firm
    console.log('\n📋 Przykładowe firmy:');
    createdCompanies.slice(0, 5).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (ID: ${company._id})`);
      console.log(`   Branża: ${company.industry}`);
      console.log(`   Miasto: ${company.address.city}`);
      console.log(`   Email: ${company.contact.email}`);
      console.log('');
    });

    console.log('🎉 Seedowanie firm zakończone pomyślnie!');

  } catch (error) {
    console.error('❌ Błąd podczas seedowania firm:', error);
    console.error('Szczegóły błędu:', error.message);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

seedCompanies(); 