const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2000);
  await page.mouse.click(800, 950); // user gesture -> ensureAudio
  await page.waitForTimeout(300);
  // brush across the strand row (sign is at ~0.715 of the 840px-tall box starting y=80)
  for (let i = 0; i <= 40; i++) {
    await page.mouse.move(560 + i * 12, 500 + Math.sin(i / 4) * 50);
    await page.waitForTimeout(16);
  }
  const state = await page.evaluate(() => ({
    ctx: audioCtx ? audioCtx.state : 'none',
    lastNoteAt: Math.round(lastNoteAt),
    strandCount: strands.length, scored: score.notes.length,
  }));
  console.log(JSON.stringify(state));
  await browser.close();
})();
