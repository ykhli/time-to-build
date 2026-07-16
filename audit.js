const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const names = fs.readdirSync('heads').filter(f => f.endsWith('.svg')).map(f => f.replace('.svg',''));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 400, height: 400 } });
  const results = [];
  for (const n of names) {
    const raw = fs.readFileSync(`heads/${n}.svg`, 'utf8');
    const m = raw.match(/viewBox="([\d.\- ]+)"/);
    if (!m) { results.push({ n, err: 'no viewBox' }); continue; }
    const [vx, vy, vw, vh] = m[1].split(/\s+/).map(Number);
    // render with viewBox expanded 40% each side
    const ex = vx - vw * 0.4, ey = vy - vh * 0.4, ew = vw * 1.8, eh = vh * 1.8;
    const exp = raw.replace(/viewBox="[\d.\- ]+"/, `viewBox="${ex} ${ey} ${ew} ${eh}"`);
    const r = await p.evaluate(async ({ svg, vx, vy, vw, vh, ex, ey, ew, eh }) => {
      const S = 360;
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg width="${S}" height="${S}" `));
      await new Promise(res => { img.onload = res; img.onerror = res; });
      const c = document.createElement('canvas'); c.width = c.height = S;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0, S, S);
      const d = g.getImageData(0, 0, S, S).data;
      let x0 = S, y0 = S, x1 = -1, y1 = -1;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++)
        if (d[(y * S + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 < 0) return { empty: true };
      // ink bbox in viewBox units
      const u = v => ex + (v / S) * ew, uy = v => ey + (v / S) * eh;
      const ink = { x0: u(x0), y0: uy(y0), x1: u(x1 + 1), y1: uy(y1 + 1) };
      // overflow beyond declared viewBox, as fraction of vw/vh
      const over = {
        l: Math.max(0, (vx - ink.x0) / vw), r: Math.max(0, (ink.x1 - vx - vw) / vw),
        t: Math.max(0, (vy - ink.y0) / vh), b: Math.max(0, (ink.y1 - vy - vh) / vh),
      };
      // flat-cut detection: ink coverage along the 2px band just inside each viewBox edge
      const px = v => Math.round(((v - ex) / ew) * S), py = v => Math.round(((v - ey) / eh) * S);
      const L = px(vx), R = px(vx + vw), T = py(vy), B = py(vy + vh);
      const band = (fixed, lo, hi, vert) => {
        let hit = 0, len = hi - lo;
        for (let i = lo; i < hi; i++) {
          const [x, y] = vert ? [fixed, i] : [i, fixed];
          if (d[(y * S + x) * 4 + 3] > 12 || d[((vert ? y : y + (vert ? 0 : -1)) * S + (vert ? x - 1 : x)) * 4 + 3] > 12) hit++;
        }
        return hit / len;
      };
      const flat = {
        l: band(L + 1, T, B, true), r: band(R - 1, T, B, true),
        t: band(T + 1, L, R, false), b: band(B - 1, L, R, false),
      };
      return { over, flat, ink, vb: { vx, vy, vw, vh } };
    }, { svg: exp, vx, vy, vw, vh, ex, ey, ew, eh });
    results.push({ n, ...r });
  }
  for (const r of results) {
    if (r.err || r.empty) { console.log(r.n, 'ERR', r.err || 'empty'); continue; }
    const o = r.over, f = r.flat;
    const maxOver = Math.max(o.l, o.r, o.t, o.b);
    const maxFlat = Math.max(f.l, f.r, f.t, f.b);
    const tag = maxOver > 0.01 ? 'OVERFLOW' : maxFlat > 0.35 ? 'FLATCUT' : 'ok';
    console.log(`${r.n.padEnd(14)} ${tag.padEnd(9)} over l${(o.l*100).toFixed(1)} r${(o.r*100).toFixed(1)} t${(o.t*100).toFixed(1)} b${(o.b*100).toFixed(1)}  flat l${(f.l*100)|0} r${(f.r*100)|0} t${(f.t*100)|0} b${(f.b*100)|0}`);
  }
  await b.close();
})();
