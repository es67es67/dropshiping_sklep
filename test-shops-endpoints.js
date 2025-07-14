const puppeteer = require('puppeteer');

(async () => {
  const apiUrl = process.env.API_URL || 'http://localhost:5000';
  const endpoints = ['/api/shops', '/api/shops/user'];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const endpoint of endpoints) {
    try {
      const url = apiUrl + endpoint;
      console.log(`\nTestuję: ${url}`);
      const response = await page.goto(url, { waitUntil: 'networkidle2' });
      const status = response.status();
      const body = await page.evaluate(() => document.body.innerText);
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        json = null;
      }
      if (status === 200 && json) {
        if (Array.isArray(json) || Array.isArray(json.shops)) {
          console.log(`✅ ${endpoint} OK, liczba sklepów:`, Array.isArray(json) ? json.length : json.shops.length);
        } else {
          console.log(`⚠️  ${endpoint} - odpowiedź nie jest tablicą sklepów!`);
          console.log(json);
        }
      } else {
        console.log(`❌ ${endpoint} - status: ${status}, odpowiedź:`, body);
      }
    } catch (err) {
      console.error(`❌ Błąd podczas testowania ${endpoint}:`, err);
    }
  }

  await browser.close();
})(); 