#!/usr/bin/env python3
"""Inline the background image into index.html -> a16z-code-curtain.html (single file)."""
import base64, pathlib

IMAGE = 'clip_ext.jpg'
html = pathlib.Path('index.html').read_text()
b64 = base64.b64encode(pathlib.Path(IMAGE).read_bytes()).decode()
html = html.replace(f"img.src = '{IMAGE}';", f"img.src = 'data:image/jpeg;base64,{b64}';")
pathlib.Path('a16z-code-curtain.html').write_text(html)
print('built a16z-code-curtain.html:', len(html) // 1024, 'KB')
