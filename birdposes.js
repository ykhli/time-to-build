const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  await p.evaluate(() => { window.requestAnimationFrame = () => {}; });
  await p.waitForTimeout(120);
  await p.evaluate(() => {
    const s = 92;
    const k = s / BIRD_PX, px = WING_PIVOT[0] / BIRD_VB * BIRD_PX, py = WING_PIVOT[1] / BIRD_VB * BIRD_PX;
    for (let i = 0; i < 6; i++) {
      const flap = Math.sin((i / 6) * Math.PI * 2);
      const wingAng = 0.16 + (flap > 0 ? flap * 0.48 : flap * 0.22);
      const x = 200 + i * 230, y = 130;
      ctx.save();
      ctx.translate(x, y);
      ctx.save();
      ctx.translate((px - BIRD_PX / 2) * k, (py - BIRD_PX / 2) * k);
      ctx.rotate(wingAng);
      ctx.drawImage(birdLayers.wing, -px * k, -py * k, s, s);
      ctx.restore();
      ctx.drawImage(birdLayers.body, -s / 2, -s / 2, s, s);
      ctx.restore();
    }
  });
  await p.waitForTimeout(150);
  await p.screenshot({ path: '/tmp/birdposes.png', clip: { x: 60, y: 40, width: 1500, height: 200 } });
  await b.close();
})();
