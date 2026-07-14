const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  // play a while
  for (let pass = 0; pass < 3; pass++)
    for (let i = 0; i <= 50; i++) { await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(18); }
  const during = await p.evaluate(() => ({ energy: +energy.toFixed(2), o: plants.map(x => +x.o.toFixed(2)) }));
  // stop music, park mouse, wait for energy to drain
  await p.mouse.move(100, 100);
  await p.waitForTimeout(6000);
  const s1 = await p.evaluate(() => ({ energy: +energy.toFixed(3), o: plants.map(x => +x.o.toFixed(3)), tf: plants.map(x => x.el.style.transform), hd: plants.map(x => x.head.style.transform) }));
  await p.waitForTimeout(2500);
  const s2 = await p.evaluate(() => ({ energy: +energy.toFixed(3), o: plants.map(x => +x.o.toFixed(3)), tf: plants.map(x => x.el.style.transform), hd: plants.map(x => x.head.style.transform) }));
  let frozen = true; for (let i = 0; i < 10; i++) { if (s1.tf[i] !== s2.tf[i]) { frozen = false; console.log('tf'+i, s1.tf[i], '->', s2.tf[i]); } if (s1.hd[i] !== s2.hd[i]) { frozen = false; console.log('hd'+i, s1.hd[i], '->', s2.hd[i]); } }
  const kept = s1.o.every(v => v >= 0.9);
  console.log('during:', JSON.stringify(during));
  console.log('after stop: energy', s2.energy, '| o', JSON.stringify(s2.o));
  console.log('transforms frozen:', frozen, '| bloom kept:', kept);
  await b.close();
})();
