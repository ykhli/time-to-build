const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  // check: no bird until garden full
  console.log('rest:', await p.evaluate(() => ({ full: gardenFull, active: bird.active })));
  // fast-forward: spawn all flowers
  await p.evaluate(() => { for (let i = 0; i < 600; i++) { energy = 1.2; lastNoteAt = performance.now(); spawnFlowers(); } });
  for (let i = 0; i <= 30; i++) { await p.mouse.move(500 + i * 30, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(16); }
  await p.waitForTimeout(400);
  const st = await p.evaluate(() => ({ full: gardenFull, active: bird.active, n: flowers.length }));
  console.log('garden full:', JSON.stringify(st));
  await p.waitForFunction(() => bird.active && (performance.now() - bird.t0) / bird.dur > 0.4);
  const info = await p.evaluate(() => ({ x: -70 + ((performance.now() - bird.t0) / bird.dur) * (innerWidth + 140), y: bird.y }));
  await p.screenshot({ path: '/tmp/bird2_crop.png', clip: { x: info.x - 130, y: Math.max(0, info.y - 110), width: 320, height: 220 } });
  await p.screenshot({ path: 'shot_bird2.png' });
  await b.close();
})();
