const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  // long sustained playing
  for (let pass = 0; pass < 12; pass++) {
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 440 + Math.sin(i / 3.5) * 80); await p.waitForTimeout(14); }
    if (pass === 3) console.log('p4:', await p.evaluate(() => flowers.length));
    if (pass === 7) { console.log('p8:', await p.evaluate(() => flowers.length)); await p.screenshot({ path: 'shot_field_mid.png' }); }
  }
  const end = await p.evaluate(() => ({ n: flowers.length, ring: flowerSpots.length, fieldUsed: fieldCursor, fps: true }));
  console.log('end:', JSON.stringify(end));
  await p.screenshot({ path: 'shot_field_full.png' });
  // perf: measure frame rate over 2s while still animating
  const fps = await p.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now();
    const tick = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(Math.round(n / 2)); };
    requestAnimationFrame(tick);
  }));
  console.log('fps:', fps);
  await b.close();
})();
