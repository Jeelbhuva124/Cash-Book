import os
import subprocess
from PIL import Image

DIAGRAMS_DIR = os.path.abspath(r'd:\Cash-Book\diagrams')
DOCS_DIAGRAMS_DIR = os.path.abspath(r'd:\Cash-Book\docs\diagrams')
os.makedirs(DIAGRAMS_DIR, exist_ok=True)
os.makedirs(DOCS_DIAGRAMS_DIR, exist_ok=True)

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Common SVG styles and defs
SVG_HEADER = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{width}" height="{height}">
<style>
  text {{
    font-family: Arial, Helvetica, sans-serif;
    fill: #000000;
  }}
  .box {{
    fill: #ffffff;
    stroke: #000000;
    stroke-width: 1.8;
  }}
  .line {{
    stroke: #000000;
    stroke-width: 1.8;
    fill: none;
  }}
  .label {{
    font-size: 13px;
    font-weight: normal;
  }}
  .title-text {{
    font-size: 14px;
    font-weight: 500;
  }}
  .node-text {{
    font-size: 13.5px;
    font-weight: 500;
    text-anchor: middle;
    dominant-baseline: central;
  }}
  .underline {{
    text-decoration: underline;
  }}
</style>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
  </marker>
  <marker id="arrow-open" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <polyline points="1,1 8,5 1,9" stroke="#000000" stroke-width="1.8" fill="none" />
  </marker>
</defs>
<rect width="100%" height="100%" fill="#ffffff" />
'''

print("Diagram builder initialized.")
