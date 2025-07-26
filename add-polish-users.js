const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./backend/models/userModel');

// Lista polskich imion męskich i żeńskich
const polishNames = {
  male: [
    'Jan', 'Piotr', 'Andrzej', 'Krzysztof', 'Stanisław', 'Tomasz', 'Paweł', 'Józef', 'Marcin', 'Marek',
    'Michał', 'Grzegorz', 'Jerzy', 'Tadeusz', 'Adam', 'Łukasz', 'Zbigniew', 'Ryszard', 'Dariusz', 'Henryk',
    'Mariusz', 'Kazimierz', 'Wojciech', 'Robert', 'Mirosław', 'Grzegorz', 'Czesław', 'Dariusz', 'Eugeniusz', 'Tomasz',
    'Stefan', 'Zdzisław', 'Zenon', 'Bogusław', 'Witold', 'Aleksander', 'Mieczysław', 'Kazimierz', 'Eugeniusz', 'Tadeusz',
    'Władysław', 'Edward', 'Franciszek', 'Leonard', 'Alfred', 'Alojzy', 'Antoni', 'Benedykt', 'Bernard', 'Bolesław'
  ],
  female: [
    'Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Barbara', 'Krystyna', 'Ewa', 'Elżbieta', 'Zofia',
    'Teresa', 'Jadwiga', 'Danuta', 'Halina', 'Irena', 'Janina', 'Joanna', 'Wanda', 'Grażyna', 'Jolanta',
    'Stanisława', 'Iwona', 'Dorota', 'Alicja', 'Krystyna', 'Magdalena', 'Beata', 'Aleksandra', 'Monika', 'Jadwiga',
    'Helena', 'Marta', 'Dominika', 'Sylwia', 'Aneta', 'Renata', 'Bożena', 'Urszula', 'Kinga', 'Karolina',
    'Justyna', 'Weronika', 'Natalia', 'Paulina', 'Patrycja', 'Marlena', 'Angelika', 'Edyta', 'Agnieszka', 'Izabela'
  ]
};

// Lista polskich nazwisk
const polishSurnames = [
  'Kowalski', 'Wiśniewski', 'Dąbrowski', 'Lewandowski', 'Wójcik', 'Kamiński', 'Kowalczyk', 'Zieliński', 'Szymański', 'Woźniak',
  'Kozłowski', 'Jankowski', 'Wojciechowski', 'Kwiatkowski', 'Kaczmarek', 'Mazur', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Nowakowski',
  'Pawłowski', 'Michalski', 'Nowicki', 'Adamczyk', 'Dudek', 'Zając', 'Wieczorek', 'Jabłoński', 'Król', 'Majewski',
  'Olszewski', 'Jaworski', 'Wróbel', 'Malinowski', 'Pawlak', 'Witkowski', 'Walczak', 'Stępień', 'Górski', 'Rutkowski',
  'Michalak', 'Sikora', 'Ostrowski', 'Baran', 'Duda', 'Szewczyk', 'Tomaszewski', 'Pietrzak', 'Marciniak', 'Wróblewski',
  'Zalewski', 'Jakubowski', 'Jasiński', 'Zawadzki', 'Sadowski', 'Bąk', 'Dudek', 'Pawlak', 'Kalinowski', 'Sawicki'
];

// Lista popularnych polskich miast
const polishCities = [
  'Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice',
  'Białystok', 'Gdynia', 'Częstochowa', 'Radom', 'Sosnowiec', 'Toruń', 'Kielce', 'Gliwice', 'Zabrze', 'Bytom',
  'Olsztyn', 'Rzeszów', 'Bielsko-Biała', 'Ruda Śląska', 'Rybnik', 'Tychy', 'Dąbrowa Górnicza', 'Opole', 'Elbląg', 'Płock',
  'Wałbrzych', 'Gorzów Wielkopolski', 'Włocławek', 'Zielona Góra', 'Tarnów', 'Chorzów', 'Kalisz', 'Koszalin', 'Legnica', 'Grudziądz'
];

// Generowanie losowego emaila
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'wp.pl', 'onet.pl', 'interia.pl', 'o2.pl', 'tlen.pl', 'poczta.onet.pl'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber}@${domain}`;
};

// Generowanie losowej nazwy użytkownika
const generateUsername = (firstName, lastName) => {
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}`;
};

// Generowanie losowego hasła
const generatePassword = () => {
  const passwords = ['test123', 'password123', 'user123', 'demo123', 'polska123', 'test2024', 'user2024'];
  return passwords[Math.floor(Math.random() * passwords.length)];
};

// Tworzenie użytkownika
const createUser = async (firstName, lastName, email, username, password) => {
  try {
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      console.log(`⚠️ Użytkownik ${email} już istnieje`);
      return null;
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 12);

    // Wybierz losowe miasto
    const city = polishCities[Math.floor(Math.random() * polishCities.length)];

    // Utwórz nowego użytkownika
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: true,
      isVerified: true,
      profile: {
        bio: `Cześć! Jestem ${firstName} i pochodzę z ${city}.`,
        interests: ['technologia', 'sport', 'muzyka', 'podróże', 'kuchnia'].slice(0, Math.floor(Math.random() * 3) + 2),
        location: city
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false
        }
      }
    });

    await user.save();
    console.log(`✅ Utworzono użytkownika: ${firstName} ${lastName} (${email}) - hasło: ${password}`);
    return user;
  } catch (error) {
    console.error(`❌ Błąd tworzenia użytkownika ${email}:`, error.message);
    return null;
  }
};

// Główna funkcja
const addPolishUsers = async () => {
  try {
    console.log('🔗 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');

    const createdUsers = [];
    const totalUsers = 50; // Liczba użytkowników do utworzenia

    console.log(`🚀 Rozpoczynam tworzenie ${totalUsers} użytkowników z polskimi imionami...`);

    for (let i = 0; i < totalUsers; i++) {
      // Losowo wybierz płeć
      const isMale = Math.random() > 0.5;
      const nameList = isMale ? polishNames.male : polishNames.female;
      
      // Wybierz losowe imię i nazwisko
      const firstName = nameList[Math.floor(Math.random() * nameList.length)];
      const lastName = polishSurnames[Math.floor(Math.random() * polishSurnames.length)];
      
      // Generuj unikalne dane
      const email = generateEmail(firstName, lastName);
      const username = generateUsername(firstName, lastName);
      const password = generatePassword();

      // Utwórz użytkownika
      const user = await createUser(firstName, lastName, email, username, password);
      
      if (user) {
        createdUsers.push({
          firstName,
          lastName,
          email,
          username,
          password
        });
      }

      // Krótkie opóźnienie między tworzeniem użytkowników
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 PODSUMOWANIE:');
    console.log(`✅ Utworzono ${createdUsers.length} użytkowników`);
    console.log(`❌ Pominięto ${totalUsers - createdUsers.length} (już istnieją)`);

    console.log('\n👥 LISTA UTWORZONYCH UŻYTKOWNIKÓW:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   🔑 Hasło: ${user.password}`);
      console.log('');
    });

    console.log('🎉 Tworzenie użytkowników zakończone pomyślnie!');

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkowników:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazy danych');
  }
};

// Uruchom skrypt
addPolishUsers(); 