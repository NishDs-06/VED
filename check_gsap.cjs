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

  await page.goto('http://localhost:5174/team');
  await page.waitForTimeout(2000);
  
  const tlVars = await page.evaluate(() => {
     return window.GSAP_VARS || 'Not found';
  });
  console.log('GSAP Vars:', tlVars);
  
  await browser.close();
})();
