#!/usr/bin/env python3
"""Regenerate defective heads + the 6 species that failed last batch."""
import json, os, pathlib, urllib.request, concurrent.futures

KEY = pathlib.Path.home().joinpath('.quiverai').read_text().strip().split('=')[-1]
INSTR = ("Top-down front-facing flower head ONLY - no stem, no leaves, no background "
         "rectangle. Radially symmetric petals around a round center, centered and "
         "roughly filling a square viewBox. Every petal must be complete and whole - "
         "no sliced, broken, fragmented or half-drawn petals; the outline of the "
         "flower is smooth and closed. Transparent background, flat solid fills, "
         "no gradients, clean geometry, few paths.")

SPECIES = [
    # regenerations (defective in current set)
    ("cornflower", "a simple ring of 8 pointed oval petals in deep burnt red (#7c2d12, #9a3412), round dark ink center (#332e25)", "#7c2d12, #9a3412, #332e25"),
    ("cosmos", "8 broad rounded petals with gently notched tips in deep burnt red (#9a3412, #7c2d12), round gold center (#eab308)", "#9a3412, #7c2d12, #eab308"),
    ("portulaca", "5 broad overlapping rounded petals in bright orange (#ff4d00, #e8420a), small gold stamen center (#eab308)", "#ff4d00, #e8420a, #eab308"),
    ("verbena", "a neat round cluster of 7 small complete five-petal florets in warm orange (#e8420a) with tiny white centers (#fdf8ef)", "#e8420a, #fdf8ef"),
    ("petunia", "5 fused wide rounded petals forming one smooth round trumpet bloom in deep burnt red (#7c2d12), dark round throat center (#2b271c)", "#7c2d12, #2b271c"),
    ("edelweiss", "9 thick rounded woolly ivory petals (#fdf8ef, #f4ead2) in a bold star around a large cluster of gold dot florets (#eab308)", "#fdf8ef, #f4ead2, #eab308"),
    # species missing from last batch
    ("yarrow", "a round umbel cluster of many tiny complete 5-petal florets in gold (#eab308, #d99e06)", "#eab308, #d99e06"),
    ("dandelion", "a dense round burst of many fine thin petals radiating from the center, bright gold (#eab308, #d99e06)", "#eab308, #d99e06"),
    ("marguerite", "a single ring of slim complete white petals (#fdf8ef), flat round gold center disc (#d99e06)", "#fdf8ef, #d99e06"),
    ("gaillardia", "one ring of fringed petals with burnt red bases (#9a3412) and gold tips (#eab308), dark red dome center (#7c2d12)", "#9a3412, #eab308, #7c2d12"),
    ("tansy", "a simple round button bloom of tightly packed small gold florets (#eab308, #d99e06), no ray petals", "#eab308, #d99e06"),
    ("bellis", "two rings of short rounded petals in ivory (#f4ead2) with burnt red tips (#9a3412), round gold center (#eab308)", "#f4ead2, #9a3412, #eab308"),
]

def gen(item):
    name, desc, colors = item
    payload = {
        "model": "arrow-1.1",
        "prompt": f"Top-down view of a stylized {name} flower head: {desc}. Flat vector, minimal editorial style.",
        "instructions": f"{INSTR} Use ONLY {colors}.",
        "n": 1, "temperature": 0.4, "stream": False,
    }
    req = urllib.request.Request(
        "https://api.quiver.ai/v1/svgs/generations",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=420) as r:
            d = json.load(r)
        svg = d.get("data", [{}])[0].get("svg")
        if not svg:
            return f"{name}: FAIL {json.dumps(d)[:120]}"
        pathlib.Path(f"heads/{name}.svg").write_text(svg)
        return f"{name}: ok {len(svg)}b"
    except Exception as e:
        return f"{name}: ERR {e}"

os.chdir(pathlib.Path(__file__).parent)
with concurrent.futures.ThreadPoolExecutor(6) as ex:
    for res in ex.map(gen, SPECIES):
        print(res, flush=True)
