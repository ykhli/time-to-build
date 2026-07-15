const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  for (let pass = 0; pass < 4; pass++)
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 440 + Math.sin(i / 3.5) * 80); await p.waitForTimeout(14); }
  await p.mouse.move(100, 100);
  await p.waitForTimeout(8000);
  const s1 = await p.evaluate(() => flowers.map(f => ({ o: f.o, b: f.boost, bt: f.boostT || 1, sp: f.spin })));
  await p.waitForTimeout(2500);
  const s2 = await p.evaluate(() => flowers.map(f => ({ o: f.o, b: f.boost, bt: f.boostT || 1, sp: f.spin })));
  let d = 0;
  for (let i = 0; i < s1.length; i++) {
    const a = s1[i], c = s2[i];
    if (a.o !== c.o || a.b !== c.b || a.sp !== c.sp) { if (d < 4) console.log(i, JSON.stringify(a), '->', JSON.stringify(c)); d++; }
  }
  console.log('diffs:', d, 'of', s1.length);
  await b.close();
})();
