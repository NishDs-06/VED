const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log('Page Error:', error.message);
  });

  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(1000);
  
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log('Page Scroll Height:', height);
  
  await browser.close();
})();
