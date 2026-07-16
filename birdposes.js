const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  // draw the bird at 6 fixed flap phases across the sky for a pose sheet
  await p.evaluate(() => { window.requestAnimationFrame = () => {}; });
  await p.waitForTimeout(120);
  await p.evaluate(() => {
    const body = birdImgs.body, wing = birdImgs.wing;
    const s = 84; // 2x for inspection
    for (let i = 0; i < 6; i++) {
      const flap = Math.sin((i / 6) * Math.PI * 2);
      const wingAng = -0.35 - (flap > 0 ? flap * 0.85 : flap * 0.40);
      const x = 200 + i * 230, y = 130;
      ctx.save();
      ctx.translate(x, y);
      ctx.save();
      ctx.translate(-s * 0.10, -s * 0.13);
      ctx.rotate(wingAng * 0.85 - 0.22);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(wing, -s * 0.12, -s * 0.60, s * 0.68, s * 0.63);
      ctx.restore();
      ctx.drawImage(body, -s / 2, -s / 2, s, s);
      ctx.save();
      ctx.translate(-s * 0.02, -s * 0.10);
      ctx.rotate(wingAng);
      ctx.drawImage(wing, -s * 0.14, -s * 0.68, s * 0.78, s * 0.72);
      ctx.restore();
      ctx.restore();
    }
  });
  await p.waitForTimeout(150);
  await p.screenshot({ path: '/tmp/birdposes.png', clip: { x: 60, y: 20, width: 1500, height: 230 } });
  await b.close();
})();
