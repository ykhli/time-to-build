const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  console.log('at rest:', await p.evaluate(() => ({ pt: +playTotal.toFixed(1), active: bird.active })));
  // fast-forward the play clock instead of 25 real seconds of mouse sweeps
  await p.evaluate(() => { playTotal = 24.9; });
  for (let i = 0; i <= 60; i++) { await p.mouse.move(400 + i * 14, 460 + Math.sin(i / 4) * 60); await p.waitForTimeout(16); }
  const launched = await p.evaluate(() => ({ pt: +playTotal.toFixed(1), active: bird.active, next: +birdNext.toFixed(1) }));
  console.log('after sweep:', JSON.stringify(launched));
  await p.waitForTimeout(3500);
  const mid = await p.evaluate(() => {
    const now = performance.now();
    const pr = (now - bird.t0) / bird.dur;
    return { active: bird.active, progress: +pr.toFixed(2), y: Math.round(bird.y) };
  });
  console.log('mid-flight:', JSON.stringify(mid));
  await p.screenshot({ path: 'shot_bird.png' });
  // let it finish
  await p.waitForTimeout(13000);
  console.log('after crossing:', JSON.stringify(await p.evaluate(() => ({ active: bird.active }))));
  await b.close();
})();
