const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2000);
  // slow full-width sweep to hit lowest through highest strands
  for (let i = 0; i <= 80; i++) {
    await page.mouse.move(430 + i * 12.5, 470 + Math.sin(i / 5) * 60);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(300);
  const clip = { x: 250, y: 770, width: 1100, height: 230 };
  await page.screenshot({ path: 'sheet_zoom.png', clip });
  console.log(await page.evaluate(() => score.notes.length), 'notes');
  await browser.close();
})();
