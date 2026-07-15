const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(18); }
  await p.mouse.move(100, 100);
  await p.waitForTimeout(7000);
  const s1 = await p.evaluate(() => ({ ff: flowers.map(f => [f.o, f.ov, f.spin]), e: energy, since: performance.now() - lastNoteAt }));
  await p.waitForTimeout(2000);
  const s2 = await p.evaluate(() => ({ ff: flowers.map(f => [f.o, f.ov, f.spin]) }));
  let diffs = 0;
  for (let i = 0; i < s1.ff.length; i++)
    if (JSON.stringify(s1.ff[i]) !== JSON.stringify(s2.ff[i])) { if (diffs < 3) console.log(i, s1.ff[i], '->', s2.ff[i]); diffs++; }
  console.log('diffs:', diffs, 'of', s1.ff.length, '| energy', s1.e.toFixed(3), 'since', Math.round(s1.since));
  await b.close();
})();
