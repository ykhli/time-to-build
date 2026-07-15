const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  console.log('rest flowers:', await p.evaluate(() => flowers.length));
  await p.screenshot({ path: 'shot_sea_rest.png' });
  // play: several sweeps
  for (let pass = 0; pass < 3; pass++)
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(18); }
  const mid = await p.evaluate(() => ({ n: flowers.length, energy: +energy.toFixed(2) }));
  console.log('mid:', JSON.stringify(mid));
  await p.screenshot({ path: 'shot_sea_mid.png' });
  // keep playing to fill the sea
  for (let pass = 0; pass < 5; pass++)
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 430 + Math.sin(i / 3) * 90); await p.waitForTimeout(16); }
  const full = await p.evaluate(() => ({ n: flowers.length, spots: flowerSpots.length, boost: Math.max(...flowers.map(f => f.boost)) }));
  console.log('full:', JSON.stringify(full));
  await p.screenshot({ path: 'shot_sea_full.png' });
  // freeze check
  await p.mouse.move(100, 100);
  await p.waitForTimeout(9000);
  const s1 = await p.evaluate(() => flowers.map(f => [f.o, f.spin, f.ov]).flat());
  await p.waitForTimeout(2000);
  const s2 = await p.evaluate(() => flowers.map(f => [f.o, f.spin, f.ov]).flat());
  console.log('frozen:', JSON.stringify(s1) === JSON.stringify(s2), '| all open:', await p.evaluate(() => flowers.every(f => f.o === 1)));
  await b.close();
})();
