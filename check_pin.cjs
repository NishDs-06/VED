const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/team');
  await page.waitForTimeout(2000);
  
  const hasPinSpacer = await page.evaluate(() => {
     return !!document.querySelector('.pin-spacer');
  });
  console.log('Has pin spacer:', hasPinSpacer);
  
  await browser.close();
})();
