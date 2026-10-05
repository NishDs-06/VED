const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto('http://localhost:5174/team');
  await page.waitForTimeout(2000);
  
  const html = await page.evaluate(() => {
     return document.body.innerHTML;
  });
  console.log('Body HTML length:', html.length);
  
  await browser.close();
})();
