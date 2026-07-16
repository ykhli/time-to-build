// Dissect a whole-bird SVG: report per-shape bbox + fill, and render each
// shape highlighted in red over the dimmed bird for classification.
// Usage: node dissect.js heads/wholebird0.svg /tmp/dissect0.png
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [svgPath, outPng] = process.argv.slice(2);
  const raw = fs.readFileSync(svgPath, 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.setContent(`<body style="background:#f0ebe1;margin:0">
    <div id="host" style="width:300px;height:300px">${raw}</div></body>`);
  const info = await p.evaluate(() => {
    const svg = document.querySelector('#host svg');
    const shapes = [...svg.querySelectorAll('path,polygon,circle,ellipse,rect')];
    return shapes.map((el, i) => {
      const bb = el.getBBox();
      const cs = getComputedStyle(el);
      return { i, tag: el.tagName, cls: el.getAttribute('class') || '',
               fill: cs.fill, x: +bb.x.toFixed(1), y: +bb.y.toFixed(1),
               w: +bb.width.toFixed(1), h: +bb.height.toFixed(1) };
    });
  });
  console.log(JSON.stringify(info, null, 0));
  // contact sheet: each shape highlighted
  const n = info.length, cols = Math.min(6, n);
  await p.setContent(`<body style="background:#f0ebe1;margin:0;display:flex;flex-wrap:wrap;gap:8px;padding:10px">
    ${info.map((s, i) => `<div style="width:200px;text-align:center">
      <div style="width:200px;height:200px" class="cell" data-i="${i}">${raw}</div>
      <div style="font:10px monospace">#${i} ${s.tag} ${s.w}x${s.h}</div></div>`).join('')}</body>`);
  await p.evaluate(() => {
    document.querySelectorAll('.cell').forEach(cell => {
      const i = +cell.dataset.i;
      const shapes = [...cell.querySelectorAll('path,polygon,circle,ellipse,rect')];
      shapes.forEach((el, j) => {
        if (j === i) { el.style.fill = '#ff0000'; el.style.opacity = '1'; }
        else el.style.opacity = '0.25';
      });
    });
  });
  await p.waitForTimeout(200);
  await p.screenshot({ path: outPng, fullPage: true });
  await b.close();
})();
