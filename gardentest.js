const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  const rest = await p.evaluate(() => ({ plants: plants.length, energy: +energy.toFixed(3), o: plants.map(x => +x.o.toFixed(2)) }));
  console.log('rest:', JSON.stringify(rest));
  await p.screenshot({ path: 'shot_garden_rest.png' });
  // sustained brushing ~12s to build energy and trigger re-blooms
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i <= 50; i++) {
      await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55);
      await p.waitForTimeout(18);
    }
    for (let i = 50; i >= 0; i--) {
      await p.mouse.move(500 + i * 16, 470 + Math.sin(i / 4) * 55);
      await p.waitForTimeout(18);
    }
  }
  const peak = await p.evaluate(() => ({ energy: +energy.toFixed(3), o: plants.map(x => +x.o.toFixed(2)), boost: plants.map(x => +x.boost.toFixed(2)) }));
  console.log('peak:', JSON.stringify(peak));
  await p.screenshot({ path: 'shot_garden_bloom.png' });
  await b.close();
})();
