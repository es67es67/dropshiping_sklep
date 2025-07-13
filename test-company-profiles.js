const puppeteer = require('puppeteer');
const path = require('path');

async function testCompanyProfiles() {
  console.log('🏢 Testowanie systemu profili firmowych...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    
    // 1. Test rejestracji i logowania
    console.log('📝 Test 1: Rejestracja użytkownika...');
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('input[name="username"]');
    
    const testUser = `testuser_${Date.now()}`;
    await page.type('input[name="username"]', testUser);
    await page.type('input[name="email"]', `${testUser}@test.com`);
    await page.type('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation();
    console.log('✅ Rejestracja zakończona');

    // 2. Test tworzenia profilu firmy
    console.log('🏢 Test 2: Tworzenie profilu firmy...');
    await page.goto('http://localhost:3000/company-profiles');
    await page.waitForSelector('a[href="/company/create"]');
    await page.click('a[href="/company/create"]');
    
    // Wypełnienie formularza profilu firmy
    await page.waitForSelector('input[name="name"]');
    await page.type('input[name="name"]', 'TechCorp Solutions');
    await page.type('input[name="description"]', 'Innowacyjne rozwiązania technologiczne dla biznesu');
    await page.type('input[name="shortDescription"]', 'Specjaliści od digitalizacji przedsiębiorstw');
    await page.select('select[name="companyType"]', 'sme');
    await page.select('select[name="industry"]', 'Technologia');
    await page.type('input[name="contact.email"]', 'kontakt@techcorp.pl');
    await page.type('input[name="contact.phone"]', '+48 123 456 789');
    await page.type('input[name="contact.website"]', 'https://techcorp.pl');
    await page.type('input[name="address.city"]', 'Warszawa');
    await page.type('input[name="address.voivodeship"]', 'Mazowieckie');
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    console.log('✅ Profil firmy utworzony');

    // 3. Test dodawania postu firmowego
    console.log('📝 Test 3: Dodawanie postu firmowego...');
    await page.waitForSelector('button[data-testid="add-post"]');
    await page.click('button[data-testid="add-post"]');
    
    await page.waitForSelector('input[name="title"]');
    await page.type('input[name="title"]', 'Nowe rozwiązanie dla e-commerce');
    await page.type('textarea[name="content"]', 'Pracujemy nad rewolucyjnym systemem zarządzania sklepami online. Już wkrótce więcej informacji!');
    await page.type('input[name="tags"]', 'e-commerce, technologia, innowacje');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Post firmowy dodany');

    // 4. Test dodawania oferty pracy
    console.log('💼 Test 4: Dodawanie oferty pracy...');
    await page.waitForSelector('button[data-testid="add-job"]');
    await page.click('button[data-testid="add-job"]');
    
    await page.waitForSelector('input[name="jobTitle"]');
    await page.type('input[name="jobTitle"]', 'Senior Frontend Developer');
    await page.type('textarea[name="jobDescription"]', 'Poszukujemy doświadczonego developera React do naszego zespołu.');
    await page.type('input[name="jobLocation"]', 'Warszawa');
    await page.type('input[name="salaryMin"]', '8000');
    await page.type('input[name="salaryMax"]', '15000');
    await page.select('select[name="jobType"]', 'full-time');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Oferta pracy dodana');

    // 5. Test dodawania członka zespołu
    console.log('👥 Test 5: Dodawanie członka zespołu...');
    await page.waitForSelector('button[data-testid="add-team-member"]');
    await page.click('button[data-testid="add-team-member"]');
    
    await page.waitForSelector('input[name="memberName"]');
    await page.type('input[name="memberName"]', 'Jan Kowalski');
    await page.type('input[name="memberPosition"]', 'CTO');
    await page.type('textarea[name="memberBio"]', 'Doświadczony technolog z 10-letnim stażem w branży IT.');
    await page.type('input[name="memberLinkedin"]', 'https://linkedin.com/in/jankowalski');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Członek zespołu dodany');

    // 6. Test wyszukiwania firm
    console.log('🔍 Test 6: Wyszukiwanie firm...');
    await page.goto('http://localhost:3000/company-profiles');
    await page.waitForSelector('input[placeholder*="Wyszukaj"]');
    
    await page.type('input[placeholder*="Wyszukaj"]', 'TechCorp');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    const companyCards = await page.$$('[data-testid="company-card"]');
    console.log(`✅ Znaleziono ${companyCards.length} firm`);

    // 7. Test obserwowania firmy
    console.log('👁️ Test 7: Obserwowanie firmy...');
    if (companyCards.length > 0) {
      await companyCards[0].click();
      await page.waitForSelector('button[data-testid="follow-company"]');
      await page.click('button[data-testid="follow-company"]');
      await page.waitForTimeout(2000);
      console.log('✅ Firma obserwowana');
    }

    // 8. Test aplikowania na ofertę pracy
    console.log('📄 Test 8: Aplikowanie na ofertę pracy...');
    await page.waitForSelector('button[data-testid="apply-job"]');
    await page.click('button[data-testid="apply-job"]');
    
    await page.waitForSelector('textarea[name="coverLetter"]');
    await page.type('textarea[name="coverLetter"]', 'Jestem zainteresowany ofertą pracy w Państwa firmie.');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Aplikacja wysłana');

    // 9. Test dodawania recenzji
    console.log('⭐ Test 9: Dodawanie recenzji firmy...');
    await page.waitForSelector('button[data-testid="add-review"]');
    await page.click('button[data-testid="add-review"]');
    
    await page.waitForSelector('input[name="clientName"]');
    await page.type('input[name="clientName"]', 'Anna Nowak');
    await page.type('input[name="clientPosition"]', 'Dyrektor IT');
    await page.type('input[name="clientCompany"]', 'ABC Corp');
    await page.click('input[name="rating"][value="5"]');
    await page.type('textarea[name="reviewContent"]', 'Świetna współpraca, profesjonalne podejście i wysokiej jakości rozwiązania.');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Recenzja dodana');

    // 10. Screenshoty
    console.log('📸 Test 10: Robienie screenshotów...');
    await page.screenshot({ path: 'company-profiles-main.png', fullPage: true });
    console.log('✅ Screenshot głównej strony profili firmowych');

    await page.goto('http://localhost:3000/company-profiles');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'company-profiles-list.png', fullPage: true });
    console.log('✅ Screenshot listy firm');

    console.log('🎉 Wszystkie testy profili firmowych zakończone pomyślnie!');

  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error);
    await page.screenshot({ path: 'company-profiles-error.png' });
  } finally {
    await browser.close();
  }
}

// Uruchom testy
testCompanyProfiles().catch(console.error); 