const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  const idle = await p.evaluate(() => ({ L: flowerL.style.transform, bloom }));
  for (let i = 0; i <= 50; i++) {
    await p.mouse.move(500 + i * 16, 480 + Math.sin(i / 4) * 50);
    await p.waitForTimeout(20);
  }
  const dancing = await p.evaluate(() => ({ L: flowerL.style.transform, R: flowerR.style.transform, bloom }));
  await p.screenshot({ path: 'shot_dance.png', clip: { x: 150, y: 720, width: 1300, height: 280 } });
  console.log('idle:', JSON.stringify(idle));
  console.log('dancing:', JSON.stringify(dancing));
  await b.close();
})();
