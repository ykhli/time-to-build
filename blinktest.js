const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  // instrument: record each flower's size every frame, flag any shrink
  await p.evaluate(() => {
    window._shrinks = 0;
    window._sizes = new Map();
    const orig = drawFlowerSea;
    window.drawFlowerSea = function(a, b2) {
      orig(a, b2);
      for (const f of flowers) {
        const size = f.s * Math.max(0, f.o) * f.boost;
        const prev = _sizes.get(f);
        if (prev !== undefined && size < prev - 0.01) _shrinks++;
        _sizes.set(f, size);
      }
    };
  });
  for (let pass = 0; pass < 10; pass++)
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 440 + Math.sin(i / 3.5) * 80); await p.waitForTimeout(14); }
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({ n: flowers.length, shrinks: _shrinks, maxBoost: Math.max(...flowers.map(f => f.boost)) }));
  console.log(JSON.stringify(r));
  // freeze check
  await p.waitForTimeout(7000);
  const s1 = await p.evaluate(() => flowers.map(f => [f.o, f.boost, f.spin]).flat().join());
  await p.waitForTimeout(2000);
  const s2 = await p.evaluate(() => flowers.map(f => [f.o, f.boost, f.spin]).flat().join());
  console.log('frozen:', s1 === s2);
  await b.close();
})();
