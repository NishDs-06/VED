const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('Page Error:', error.message);
  });

  await page.goto('http://localhost:5174/team');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
