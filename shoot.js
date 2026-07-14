const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  let errs=[];
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on('pageerror', e=>errs.push(String(e)));
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2500); // fonts + image + settle

  // resting state
  await page.screenshot({ path: 'shot_rest.png' });

  // brush across the curtain: sweep the mouse through the image area
  const box = await page.evaluate(() => {
    return { x: innerWidth * 0.56, y: innerHeight * 0.5, w: innerWidth * 0.4 };
  });
  await page.mouse.move(box.x - box.w / 2, box.y - 60);
  for (let i = 0; i <= 30; i++) {
    await page.mouse.move(box.x - box.w / 2 + (box.w * i) / 30, box.y - 60 + Math.sin(i / 5) * 90);
    await page.waitForTimeout(16);
  }
  await page.screenshot({ path: 'shot_brush.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shot_sway.png' });

  await browser.close();
  console.log('errors:', errs); console.log('done');
})();
