const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Zmieniam na false, żeby widzieć co się dzieje
  const page = await browser.newPage();
  try {
    console.log('🌐 Otwieram stronę...');
    await page.goto('http://localhost:3000/voivodeships', { waitUntil: 'networkidle2' });
    console.log('✅ Strona załadowana');

    // Czekam na załadowanie strony i szukam przycisku "Edytuj"
    await page.waitForTimeout(2000);
    console.log('🔍 Szukam przycisku "Edytuj"...');
    
    // Szukam przycisku po tekście "Edytuj" - używam standardowego selektora
    const buttons = await page.$$('button');
    console.log(`Znaleziono ${buttons.length} przycisków`);
    
    let editButton = null;
    for (let i = 0; i < buttons.length; i++) {
      const text = await page.evaluate(el => el.textContent, buttons[i]);
      console.log(`Przycisk ${i}: "${text}"`);
      if (text.includes('Edytuj')) {
        editButton = buttons[i];
        break;
      }
    }
    
    if (!editButton) {
      throw new Error('Nie znaleziono przycisku "Edytuj"');
    }

    console.log('✅ Znaleziono przycisk "Edytuj"');
    await editButton.click();
    console.log('✅ Kliknięto przycisk "Edytuj"');

    // Czekam na załadowanie formularza
    await page.waitForTimeout(2000);
    console.log('🔍 Sprawdzam co się pojawiło po kliknięciu...');
    
    // Sprawdzam wszystkie inputy na stronie
    const inputs = await page.$$('input');
    console.log(`Znaleziono ${inputs.length} pól input`);
    
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await page.evaluate(el => el.placeholder, inputs[i]);
      const type = await page.evaluate(el => el.type, inputs[i]);
      const disabled = await page.evaluate(el => el.disabled, inputs[i]);
      console.log(`Input ${i}: type="${type}", placeholder="${placeholder}", disabled=${disabled}`);
    }

    // Szukam pola miejscowość z różnymi wariantami placeholdera
    console.log('🔍 Szukam pola miejscowość...');
    const cityInput = await page.$('input[placeholder="Wpisz nazwę miejscowości..."]');
    
    if (!cityInput) {
      console.log('❌ Nie znaleziono pola miejscowość');
      // Sprawdzam wszystkie divy i inne elementy
      const allElements = await page.$$('*');
      console.log(`Znaleziono ${allElements.length} elementów na stronie`);
      throw new Error('Pole miejscowość nie zostało znalezione');
    }
    
    const isDisabled = await page.evaluate(el => el.disabled, cityInput);
    console.log(`Pole miejscowość disabled: ${isDisabled}`);
    if (isDisabled) throw new Error('Pole miejscowość jest zablokowane!');

    console.log('✅ Pole miejscowość jest aktywne');
    console.log('📝 Wpisuję "Warszawa"...');
    
    // Wpisz "Warszawa" (zamiast "namysłów", bo Warszawa istnieje w bazie)
    await cityInput.type('Warszawa', { delay: 100 });
    await page.waitForTimeout(2000); // poczekaj na wyniki

    console.log('🔍 Sprawdzam wyniki...');
    // Sprawdź, czy pojawiły się wyniki
    const results = await page.$$('.dropdown-item, [role="option"], .DropdownItem');
    console.log(`Znaleziono ${results.length} wyników`);
    if (!results.length) throw new Error('Brak wyników dla "Warszawa"!');

    console.log('✅ Znaleziono wyniki');
    console.log('🖱️ Klikam pierwszy wynik...');
    
    // Kliknij pierwszy wynik
    await results[0].click();
    await page.waitForTimeout(2000);

    console.log('🔍 Sprawdzam nawigację...');
    // Sprawdź, czy nastąpiła nawigacja do strony miasta
    const url = page.url();
    console.log(`Aktualny URL: ${url}`);
    if (!url.includes('/cities/')) throw new Error('Brak nawigacji do strony miasta!');

    console.log('✅ Test przeszedł pomyślnie!');
    console.log('🎉 Wszystko działa - pole miejscowość jest aktywne, wyszukiwanie działa i nawigacja działa!');
  } catch (err) {
    console.error('❌ Błąd testu:', err.message);
    // Zrób zrzut ekranu dla debugowania
    await page.screenshot({ path: 'inne/puppeteer-comprehensive-test/test-error.png' });
    console.log('📸 Zrzut ekranu zapisany jako test-error.png');
    process.exit(1);
  } finally {
    await page.waitForTimeout(3000); // Czekam 3 sekundy, żeby zobaczyć wynik
    await browser.close();
  }
})(); 