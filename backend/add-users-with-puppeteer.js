const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
require('dotenv').config();

// Dane użytkowników do utworzenia
const usersData = [
  {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    username: 'jan_kowalski_warszawa',
    phone: '123456789',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    city: 'Warszawa',
    locationData: {
      voivodeshipCode: '14',
      voivodeshipName: 'Mazowieckie',
      countyCode: '1465',
      countyName: 'Warszawa',
      municipalityCode: '146501',
      municipalityName: 'Warszawa',
      simcCode: '0918123',
      tercCode: '1465011',
      address: {
        city: 'Warszawa',
        street: 'Marszałkowska',
        houseNumber: '1',
        postalCode: '00-001'
      }
    }
  },
  {
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@example.com',
    username: 'anna_nowak_krakow',
    phone: '234567890',
    dateOfBirth: '1985-03-20',
    gender: 'female',
    city: 'Kraków',
    locationData: {
      voivodeshipCode: '12',
      voivodeshipName: 'Małopolskie',
      countyCode: '1261',
      countyName: 'Kraków',
      municipalityCode: '126101',
      municipalityName: 'Kraków',
      simcCode: '0950623',
      tercCode: '1261011',
      address: {
        city: 'Kraków',
        street: 'Floriańska',
        houseNumber: '5',
        postalCode: '31-019'
      }
    }
  },
  {
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    username: 'piotr_wisniewski_gdansk',
    phone: '345678901',
    dateOfBirth: '1992-07-10',
    gender: 'male',
    city: 'Gdańsk',
    locationData: {
      voivodeshipCode: '22',
      voivodeshipName: 'Pomorskie',
      countyCode: '2261',
      countyName: 'Gdańsk',
      municipalityCode: '226101',
      municipalityName: 'Gdańsk',
      simcCode: '0930860',
      tercCode: '2261011',
      address: {
        city: 'Gdańsk',
        street: 'Długa',
        houseNumber: '10',
        postalCode: '80-827'
      }
    }
  },
  {
    firstName: 'Maria',
    lastName: 'Wójcik',
    email: 'maria.wojcik@example.com',
    username: 'maria_wojcik_poznan',
    phone: '456789012',
    dateOfBirth: '1988-11-05',
    gender: 'female',
    city: 'Poznań',
    locationData: {
      voivodeshipCode: '30',
      voivodeshipName: 'Wielkopolskie',
      countyCode: '3064',
      countyName: 'Poznań',
      municipalityCode: '306401',
      municipalityName: 'Poznań',
      simcCode: '0969591',
      tercCode: '3064011',
      address: {
        city: 'Poznań',
        street: 'Św. Marcin',
        houseNumber: '15',
        postalCode: '61-806'
      }
    }
  },
  {
    firstName: 'Tomasz',
    lastName: 'Lewandowski',
    email: 'tomasz.lewandowski@example.com',
    username: 'tomasz_lewandowski_wroclaw',
    phone: '567890123',
    dateOfBirth: '1995-04-12',
    gender: 'male',
    city: 'Wrocław',
    locationData: {
      voivodeshipCode: '02',
      voivodeshipName: 'Dolnośląskie',
      countyCode: '0264',
      countyName: 'Wrocław',
      municipalityCode: '026401',
      municipalityName: 'Wrocław',
      simcCode: '0986283',
      tercCode: '0264011',
      address: {
        city: 'Wrocław',
        street: 'Rynek',
        houseNumber: '20',
        postalCode: '50-101'
      }
    }
  },
  {
    firstName: 'Katarzyna',
    lastName: 'Dąbrowska',
    email: 'katarzyna.dabrowska@example.com',
    username: 'katarzyna_dabrowska_lodz',
    phone: '678901234',
    dateOfBirth: '1991-09-25',
    gender: 'female',
    city: 'Łódź',
    locationData: {
      voivodeshipCode: '10',
      voivodeshipName: 'Łódzkie',
      countyCode: '1061',
      countyName: 'Łódź',
      municipalityCode: '106101',
      municipalityName: 'Łódź',
      simcCode: '0957976',
      tercCode: '1061011',
      address: {
        city: 'Łódź',
        street: 'Piotrkowska',
        houseNumber: '25',
        postalCode: '90-926'
      }
    }
  },
  {
    firstName: 'Michał',
    lastName: 'Zieliński',
    email: 'michal.zielinski@example.com',
    username: 'michal_zielinski_szczecin',
    phone: '789012345',
    dateOfBirth: '1987-12-03',
    gender: 'male',
    city: 'Szczecin',
    locationData: {
      voivodeshipCode: '32',
      voivodeshipName: 'Zachodniopomorskie',
      countyCode: '3262',
      countyName: 'Szczecin',
      municipalityCode: '326201',
      municipalityName: 'Szczecin',
      simcCode: '0979774',
      tercCode: '3262011',
      address: {
        city: 'Szczecin',
        street: 'Wały Chrobrego',
        houseNumber: '3',
        postalCode: '70-502'
      }
    }
  },
  {
    firstName: 'Agnieszka',
    lastName: 'Kaczmarek',
    email: 'agnieszka.kaczmarek@example.com',
    username: 'agnieszka_kaczmarek_lublin',
    phone: '890123456',
    dateOfBirth: '1993-06-18',
    gender: 'female',
    city: 'Lublin',
    locationData: {
      voivodeshipCode: '06',
      voivodeshipName: 'Lubelskie',
      countyCode: '0663',
      countyName: 'Lublin',
      municipalityCode: '066301',
      municipalityName: 'Lublin',
      simcCode: '0955310',
      tercCode: '0663011',
      address: {
        city: 'Lublin',
        street: 'Krakowskie Przedmieście',
        houseNumber: '8',
        postalCode: '20-002'
      }
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Pawlak',
    email: 'robert.pawlak@example.com',
    username: 'robert_pawlak_bialystok',
    phone: '901234567',
    dateOfBirth: '1989-02-28',
    gender: 'male',
    city: 'Białystok',
    locationData: {
      voivodeshipCode: '20',
      voivodeshipName: 'Podlaskie',
      countyCode: '2061',
      countyName: 'Białystok',
      municipalityCode: '206101',
      municipalityName: 'Białystok',
      simcCode: '0920314',
      tercCode: '2061011',
      address: {
        city: 'Białystok',
        street: 'Lipowa',
        houseNumber: '12',
        postalCode: '15-427'
      }
    }
  },
  {
    firstName: 'Ewa',
    lastName: 'Michalska',
    email: 'ewa.michalska@example.com',
    username: 'ewa_michalska_katowice',
    phone: '012345678',
    dateOfBirth: '1994-08-14',
    gender: 'female',
    city: 'Katowice',
    locationData: {
      voivodeshipCode: '24',
      voivodeshipName: 'Śląskie',
      countyCode: '2469',
      countyName: 'Katowice',
      municipalityCode: '246901',
      municipalityName: 'Katowice',
      simcCode: '0937470',
      tercCode: '2469011',
      address: {
        city: 'Katowice',
        street: 'Mariacka',
        houseNumber: '7',
        postalCode: '40-001'
      }
    }
  }
];

async function addUsersWithPuppeteer() {
  let browser;
  
  try {
    console.log('🚀 Uruchamiam Puppeteer...');
    browser = await puppeteer.launch({
      headless: false, // Widoczne okno dla debugowania
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const page = await browser.newPage();
    
    // Przejdź do strony rejestracji
    console.log('📱 Przechodzę do strony rejestracji...');
    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
    
    console.log('✅ Strona rejestracji załadowana');
    
    // Dodaj każdego użytkownika
    for (let i = 0; i < usersData.length; i++) {
      const userData = usersData[i];
      console.log(`\n👤 Dodaję użytkownika ${i + 1}/10: ${userData.firstName} ${userData.lastName} (${userData.city})`);
      
      try {
        // Wypełnij formularz
        await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });
        
        // Podstawowe dane
        await page.type('input[name="firstName"]', userData.firstName);
        await page.type('input[name="lastName"]', userData.lastName);
        await page.type('input[name="email"]', userData.email);
        await page.type('input[name="password"]', 'password123');
        await page.type('input[name="confirmPassword"]', 'password123');
        await page.type('input[name="phone"]', userData.phone);
        await page.type('input[name="dateOfBirth"]', userData.dateOfBirth);
        await page.type('input[name="username"]', userData.username);
        
        // Wybierz płeć
        await page.select('select[name="gender"]', userData.gender);
        
        // Zaznacz checkboxy
        await page.click('input[name="acceptTerms"]');
        await page.click('input[name="acceptNewsletter"]');
        
        console.log('📝 Formularz wypełniony, czekam na LocationSelector...');
        
        // Poczekaj na załadowanie LocationSelector
        await page.waitForTimeout(2000);
        
        // Wybierz województwo
        console.log('🗺️  Wybieram województwo...');
        try {
          // Spróbuj znaleźć input dla województwa
          const voivodeshipInput = await page.$('input[placeholder*="województwa"], input[placeholder*="Wpisz nazwę województwa"]');
          if (voivodeshipInput) {
            await voivodeshipInput.click();
            await voivodeshipInput.type(userData.locationData.voivodeshipName || 'Mazowieckie');
            await page.waitForTimeout(2000);
            
            // Poczekaj na dropdown i wybierz pierwszy wynik
            const dropdownItem = await page.$('.dropdown-item, .location-option, [role="option"]');
            if (dropdownItem) {
              await dropdownItem.click();
            } else {
              await page.keyboard.press('Enter');
            }
          } else {
            console.log('⚠️  Nie znaleziono pola województwa');
          }
        } catch (error) {
          console.log('❌ Błąd podczas wyboru województwa:', error.message);
        }
        
        // Wybierz powiat
        console.log('🏛️  Wybieram powiat...');
        await page.waitForTimeout(2000);
        try {
          const countyInput = await page.$('input[placeholder*="powiatu"], input[placeholder*="Wpisz nazwę powiatu"]');
          if (countyInput) {
            await countyInput.click();
            await countyInput.type(userData.locationData.countyName || 'Warszawa');
            await page.waitForTimeout(2000);
            
            const dropdownItem = await page.$('.dropdown-item, .location-option, [role="option"]');
            if (dropdownItem) {
              await dropdownItem.click();
            } else {
              await page.keyboard.press('Enter');
            }
          } else {
            console.log('⚠️  Nie znaleziono pola powiatu');
          }
        } catch (error) {
          console.log('❌ Błąd podczas wyboru powiatu:', error.message);
        }
        
        // Wybierz gminę
        console.log('🏘️  Wybieram gminę...');
        await page.waitForTimeout(2000);
        try {
          const municipalityInput = await page.$('input[placeholder*="gminy"], input[placeholder*="Wpisz nazwę gminy"]');
          if (municipalityInput) {
            await municipalityInput.click();
            await municipalityInput.type(userData.locationData.municipalityName || 'Warszawa');
            await page.waitForTimeout(2000);
            
            const dropdownItem = await page.$('.dropdown-item, .location-option, [role="option"]');
            if (dropdownItem) {
              await dropdownItem.click();
            } else {
              await page.keyboard.press('Enter');
            }
          } else {
            console.log('⚠️  Nie znaleziono pola gminy');
          }
        } catch (error) {
          console.log('❌ Błąd podczas wyboru gminy:', error.message);
        }
        
        // Wybierz miejscowość
        console.log('🏠 Wybieram miejscowość...');
        await page.waitForTimeout(2000);
        try {
          const cityInput = await page.$('input[placeholder*="miejscowości"], input[placeholder*="Wpisz nazwę miejscowości"]');
          if (cityInput) {
            await cityInput.click();
            await cityInput.type(userData.locationData.address.city);
            await page.waitForTimeout(2000);
            
            const dropdownItem = await page.$('.dropdown-item, .location-option, [role="option"]');
            if (dropdownItem) {
              await dropdownItem.click();
            } else {
              await page.keyboard.press('Enter');
            }
          } else {
            console.log('⚠️  Nie znaleziono pola miejscowości');
          }
        } catch (error) {
          console.log('❌ Błąd podczas wyboru miejscowości:', error.message);
        }
        
        console.log('📤 Wysyłam formularz...');
        
        // Kliknij przycisk rejestracji
        await page.click('button[type="submit"]');
        
        // Poczekaj na odpowiedź
        await page.waitForTimeout(3000);
        
        // Sprawdź czy rejestracja się udała
        const currentUrl = page.url();
        if (currentUrl.includes('/login') || currentUrl.includes('/dashboard')) {
          console.log('✅ Użytkownik został pomyślnie zarejestrowany!');
        } else {
          console.log('⚠️  Sprawdzam czy są błędy...');
          
          // Sprawdź różne typy błędów
          const errorSelectors = [
            '.error-message', 
            '.alert-error', 
            '.error', 
            '[data-testid="error"]',
            '.text-red-500',
            '.text-error'
          ];
          
          let foundErrors = [];
          for (const selector of errorSelectors) {
            const errorElements = await page.$$(selector);
            for (const errorEl of errorElements) {
              const errorText = await errorEl.evaluate(el => el.textContent);
              if (errorText && errorText.trim()) {
                foundErrors.push(errorText.trim());
              }
            }
          }
          
          if (foundErrors.length > 0) {
            console.log('❌ Znalezione błędy:');
            foundErrors.forEach((error, index) => {
              console.log(`   ${index + 1}. ${error}`);
            });
          } else {
            console.log('⚠️  Nie znaleziono błędów, ale rejestracja nie powiodła się');
          }
          
          // Sprawdź czy są błędy walidacji
          const validationErrors = await page.$$eval('.error-message, .validation-error', elements => 
            elements.map(el => el.textContent).filter(text => text && text.includes('wymagane'))
          );
          
          if (validationErrors.length > 0) {
            console.log('❌ Błędy walidacji:');
            validationErrors.forEach((error, index) => {
              console.log(`   ${index + 1}. ${error}`);
            });
          }
        }
        
        // Wróć do strony rejestracji dla następnego użytkownika
        if (i < usersData.length - 1) {
          await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
          await page.waitForTimeout(2000);
        }
        
      } catch (error) {
        console.error(`❌ Błąd podczas dodawania użytkownika ${userData.username}:`, error.message);
        
        // Spróbuj wrócić do strony rejestracji
        try {
          await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
          await page.waitForTimeout(2000);
        } catch (navError) {
          console.error('❌ Nie udało się wrócić do strony rejestracji:', navError.message);
        }
      }
    }
    
    console.log('\n🎉 Zakończono dodawanie użytkowników!');
    
  } catch (error) {
    console.error('❌ Błąd główny:', error);
  } finally {
    if (browser) {
      console.log('🔒 Zamykam przeglądarkę...');
      await browser.close();
    }
  }
}

// Uruchom skrypt
addUsersWithPuppeteer(); 