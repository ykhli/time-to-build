const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on('pageerror', e => console.log('PAGE ERR:', String(e)));
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2000);
  await page.click('#soundBtn');
  await page.waitForTimeout(200);
  for (let i = 0; i <= 40; i++) {
    await page.mouse.move(560 + i * 12, 500 + Math.sin(i / 4) * 50);
    await page.waitForTimeout(16);
  }
  const state = await page.evaluate(async () => {
    const wav = await renderSong();
    return {
      soundOn, ctx: audioCtx ? audioCtx.state : 'none',
      scored: score.notes.length,
      dlEnabled: !document.getElementById('dlBtn').disabled,
      wavBytes: wav ? wav.byteLength : 0,
    };
  });
  // toggle off works
  await page.click('#soundBtn');
  state.soundOffAfterToggle = await page.evaluate(() => !soundOn);
  console.log(JSON.stringify(state));
  await browser.close();
})();
