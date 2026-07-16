const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  await p.evaluate(() => { playTotal = 24.9; });
  for (let i = 0; i <= 60; i++) { await p.mouse.move(400 + i * 14, 460 + Math.sin(i / 4) * 60); await p.waitForTimeout(16); }
  // wait until bird is around mid-screen then crop-shoot it
  await p.waitForFunction(() => bird.active && (performance.now() - bird.t0) / bird.dur > 0.45);
  const info = await p.evaluate(() => ({ x: -60 + ((performance.now() - bird.t0) / bird.dur) * (innerWidth + 120), y: bird.y }));
  await p.screenshot({ path: '/tmp/bird_inpage.png', clip: { x: info.x - 120, y: info.y - 90, width: 300, height: 180 } });
  await p.screenshot({ path: 'shot_bird_full.png' });
  await b.close();
})();
