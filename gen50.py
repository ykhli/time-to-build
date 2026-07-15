#!/usr/bin/env python3
"""Generate 36 more flower-head species via QuiverAI (arrow-1.1), 6 at a time."""
import json, os, pathlib, urllib.request, concurrent.futures

KEY = pathlib.Path.home().joinpath('.quiverai').read_text().strip().split('=')[-1]
INSTR = ("Top-down front-facing flower head ONLY - no stem, no leaves, no background "
         "rectangle. Radially symmetric petals around a round center, centered and "
         "roughly filling a square viewBox. Transparent background, flat solid fills, "
         "no gradients, clean geometry, few paths.")

# palette: oranges #e8420a #ff4d00 · golds #eab308 #d99e06 #a16207 ·
# ivories #f4ead2 #fdf8ef #e9dcbd · burnt reds #9a3412 #7c2d12 · ink #332e25 #2b271c
SPECIES = [
    ("rose", "many concentric spiral petals in deep burnt red (#9a3412, #7c2d12), tiny dark center (#2b271c)", "#9a3412, #7c2d12, #2b271c"),
    ("peony", "dense ruffled rounded petals in warm ivory (#f4ead2, #e9dcbd), gold center tuft (#eab308)", "#f4ead2, #e9dcbd, #eab308"),
    ("carnation", "many frilled jagged-edged petals in warm orange (#e8420a, #ff4d00), no visible center", "#e8420a, #ff4d00"),
    ("lotus", "pointed oval petals in two rings, warm white (#fdf8ef) with a gold seed-pod center (#eab308, #d99e06)", "#fdf8ef, #eab308, #d99e06"),
    ("camellia", "overlapping rounded petals in bright orange (#ff4d00, #e8420a), small gold stamen center (#eab308)", "#ff4d00, #e8420a, #eab308"),
    ("ranunculus", "many tight concentric paper-thin petals in gold (#eab308, #d99e06), dark ink center dot (#332e25)", "#eab308, #d99e06, #332e25"),
    ("chrysanthemum", "very many thin curved petals radiating out, deep amber (#a16207, #d99e06), no center", "#a16207, #d99e06"),
    ("gerbera", "one ring of long slender petals in vivid orange (#ff4d00), large dark ink center (#2b271c) ringed with gold dots (#eab308)", "#ff4d00, #2b271c, #eab308"),
    ("coneflower", "drooping slender petals in burnt red (#9a3412), large domed dark center (#332e25) with gold speckles (#d99e06)", "#9a3412, #332e25, #d99e06"),
    ("susan", "single ring of pointed gold petals (#eab308), big dark ink dome center (#2b271c)", "#eab308, #2b271c"),
    ("calendula", "two rings of narrow rounded petals in deep gold (#d99e06, #a16207), small amber center", "#d99e06, #a16207"),
    ("nasturtium", "5 broad overlapping rounded petals in bright orange (#ff4d00), tiny gold center (#eab308)", "#ff4d00, #eab308"),
    ("primrose", "5 heart-shaped ivory petals (#f4ead2) with a gold ring center (#eab308)", "#f4ead2, #eab308"),
    ("hibiscus", "5 wide ruffled petals in warm orange (#e8420a), dark ink center (#2b271c)", "#e8420a, #2b271c"),
    ("plumeria", "5 pinwheel oval petals, warm white (#fdf8ef) blending to gold center (#eab308)", "#fdf8ef, #eab308"),
    ("magnolia", "6 broad oval petals in warm ivory (#e9dcbd), amber center (#a16207)", "#e9dcbd, #a16207"),
    ("waterlily", "three rings of pointed petals, outer burnt red (#9a3412), inner ivory (#f4ead2), gold center (#eab308)", "#9a3412, #f4ead2, #eab308"),
    ("cornflower", "ring of jagged trumpet petals in deep burnt red (#7c2d12), dark spiky center (#332e25)", "#7c2d12, #332e25"),
    ("scabiosa", "frilly outer petals in warm ivory (#f4ead2), dense pincushion center of gold dots (#eab308, #d99e06)", "#f4ead2, #eab308, #d99e06"),
    ("yarrow", "cluster of many tiny 5-petal florets in gold (#eab308), tight and round", "#eab308, #d99e06"),
    ("phlox", "5 rounded notched petals in warm orange (#e8420a), small white center ring (#fdf8ef)", "#e8420a, #fdf8ef"),
    ("geranium", "5 rounded petals in burnt red (#9a3412) with thin ivory streaks (#f4ead2), small dark center", "#9a3412, #f4ead2, #2b271c"),
    ("petunia", "5 fused wide trumpet petals in deep burnt red (#7c2d12), dark throat center (#2b271c)", "#7c2d12, #2b271c"),
    ("pansy", "5 overlapping rounded petals in gold (#eab308) with a dark ink blotch center (#332e25)", "#eab308, #332e25"),
    ("strawflower", "many stiff pointed papery petals in amber (#d99e06, #a16207), small gold center", "#d99e06, #a16207, #eab308"),
    ("dandelion", "very many fine thin petals radiating densely, bright gold (#eab308)", "#eab308, #d99e06"),
    ("clover", "round pom-pom bloom of many tiny slender petals in warm ivory (#f4ead2, #e9dcbd)", "#f4ead2, #e9dcbd"),
    ("edelweiss", "star of thick woolly ivory petals (#fdf8ef), cluster of gold dot florets center (#eab308)", "#fdf8ef, #eab308"),
    ("verbena", "cluster of small 5-petal florets in warm orange (#e8420a) with white eyes (#fdf8ef)", "#e8420a, #fdf8ef"),
    ("portulaca", "5 ruffled translucent-looking petals in bright orange (#ff4d00), gold stamen center (#eab308)", "#ff4d00, #eab308"),
    ("hollyhock", "wide ruffled fused petals in warm ivory (#e9dcbd), deep amber throat (#a16207)", "#e9dcbd, #a16207"),
    ("freesia", "6 cupped oval petals in gold (#eab308), amber center (#a16207)", "#eab308, #a16207"),
    ("marguerite", "single ring of slim white petals (#fdf8ef), flat gold center disc (#d99e06)", "#fdf8ef, #d99e06"),
    ("gaillardia", "ring of fringed petals, burnt red base (#9a3412) with gold tips (#eab308), dark red dome center (#7c2d12)", "#9a3412, #eab308, #7c2d12"),
    ("tansy", "simple round button bloom of tightly packed gold florets (#eab308, #d99e06), no ray petals", "#eab308, #d99e06"),
    ("bellis", "two rings of short rounded petals in ivory (#f4ead2) with burnt red tips (#9a3412), gold center (#eab308)", "#f4ead2, #9a3412, #eab308"),
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
        with urllib.request.urlopen(req, timeout=300) as r:
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
