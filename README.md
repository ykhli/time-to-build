# a16z code curtain

An interactive homage to [Marina Budarina's hanging-glyph concept](https://x.com/marina_uiux/status/2076410277109645741)
(via [Amir Mushich's remix](https://x.com/AmirMushich/status/2076711309991710728)) — for the a16z office at
180 Townsend St, San Francisco.

Strands of Marc Andreessen's essay ["It's Time to Build"](https://a16z.com/its-time-to-build/) (April 2020)
hang from just below the andreessen.horowitz sign. Brush across them and they scatter like a beaded
curtain — each strand is also a piano string tuned to a C-major pentatonic scale (left = low, right = high),
synthesized with the Web Audio API. Move the cursor around for a three-layer parallax; the photo has
torn, painterly edges rendered with a canvas dab mask.

## Files

- `index.html` — the page (loads `clip_ext.jpg` as the background)
- `clip_ext.jpg` — photo of 180 Townsend with a smeared 106px border so the torn-edge
  overhangs reveal paint-stroke continuations (`clip.png` is the original)
- `build.py` — inlines the image as base64 into a self-contained `a16z-code-curtain.html`
- `shoot.js` / `audiotest.js` — Playwright smoke tests (screenshots + audio trigger check)

## Run

Open `index.html` in a browser (or run `python3 build.py` and share the single-file build).
Click once anywhere to enable sound, then brush the hanging words.
