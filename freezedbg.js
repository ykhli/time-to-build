const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(18); }
  await p.mouse.move(100, 100);
  await p.waitForTimeout(7000);
  const s1 = await p.evaluate(() => ({ tf: plants.map(x => x.el.style.transform), hd: plants.map(x => x.head.style.transform), o: plants.map(x => x.o), ov: plants.map(x => x.ov), since: performance.now() - lastNoteAt }));
  await p.waitForTimeout(2000);
  const s2 = await p.evaluate(() => ({ tf: plants.map(x => x.el.style.transform), hd: plants.map(x => x.head.style.transform) }));
  for (let i = 0; i < 10; i++) {
    if (s1.tf[i] !== s2.tf[i]) console.log('tf', i, '\n  ', s1.tf[i], '\n  ', s2.tf[i]);
    if (s1.hd[i] !== s2.hd[i]) console.log('hd', i, '\n  ', s1.hd[i], '\n  ', s2.hd[i]);
  }
  console.log('o:', s1.o.map(v=>v.toFixed(4)).join(','), 'ov max:', Math.max(...s1.ov.map(Math.abs)), 'since:', Math.round(s1.since));
  await b.close();
})();
