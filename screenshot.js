import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/team'); // <--- Updated URL
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/tmp/screenshot_team_1.png' });

  // Now scroll down by 1000px to see the animation starting
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/screenshot_team_2.png' });

  // Scroll more to see the next card
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/screenshot_team_3.png' });

  await browser.close();
})();
