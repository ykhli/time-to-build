const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); // no --autoplay-policy flag: real-world default
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  p.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(2000);
  const s0 = await p.evaluate(() => ({ soundOn, ctx: audioCtx ? audioCtx.state : 'none' }));
  // brush without any click — notes should score even if ctx is suspended
  for (let i = 0; i <= 30; i++) { await p.mouse.move(400 + i * 30, 470 + Math.sin(i / 4) * 60); await p.waitForTimeout(14); }
  const s1 = await p.evaluate(() => ({ ctx: audioCtx ? audioCtx.state : 'none', scored: score.notes.length }));
  // first click anywhere unlocks audio
  await p.mouse.click(800, 900);
  await p.waitForTimeout(300);
  const s2 = await p.evaluate(() => ({ ctx: audioCtx ? audioCtx.state : 'none', soundOn }));
  // toggle off then on still works
  await p.click('#soundBtn');
  const s3 = await p.evaluate(() => soundOn);
  await p.click('#soundBtn');
  const s4 = await p.evaluate(() => ({ soundOn, ctx: audioCtx.state }));
  console.log(JSON.stringify({ load: s0, afterBrush: s1, afterClick: s2, toggledOff: s3, toggledOn: s4 }));
  await b.close();
})();
