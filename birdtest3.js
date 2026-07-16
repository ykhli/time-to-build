const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2200);
  console.log('rest:', await p.evaluate(() => ({ active: bird.active })));
  // fill just the ring (122 spots), then brush so maybeLaunchBird runs with music on
  await p.evaluate(() => { for (let i = 0; i < 90; i++) { energy = 1.2; lastNoteAt = performance.now(); spawnFlowers(); } });
  for (let i = 0; i <= 20; i++) { await p.mouse.move(500 + i * 30, 470 + Math.sin(i / 4) * 55); await p.waitForTimeout(16); }
  await p.waitForTimeout(300);
  const st = await p.evaluate(() => ({ n: flowers.length, ring: flowerSpots.length, active: bird.active }));
  console.log('ring full:', JSON.stringify(st));
  // let it fly a bit while "playing" (keep energy alive), then stop and check pause
  for (let i = 0; i <= 40; i++) { await p.mouse.move(500 + i * 20, 470 + Math.sin(i / 3) * 55); await p.waitForTimeout(16); }
  await p.mouse.move(80, 80);
  await p.waitForTimeout(6000);                       // decay tail passes
  const p1 = await p.evaluate(() => ({ p: bird.p, env: motionEnv, active: bird.active }));
  await p.waitForTimeout(2000);
  const p2 = await p.evaluate(() => ({ p: bird.p, env: motionEnv }));
  console.log('paused:', JSON.stringify(p1), '->', JSON.stringify(p2), 'frozen:', p1.p === p2.p);
  // resume playing → bird resumes
  for (let i = 0; i <= 40; i++) { await p.mouse.move(400 + i * 24, 480 + Math.sin(i / 3) * 60); await p.waitForTimeout(16); }
  await p.waitForTimeout(500);
  const p3 = await p.evaluate(() => ({ p: bird.p, active: bird.active }));
  console.log('resumed:', JSON.stringify(p3), 'moved:', p3.p > p2.p);
  await b.close();
})();
