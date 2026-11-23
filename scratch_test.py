import subprocess
import os

test_html = os.path.abspath('test_render.html')
test_png = os.path.abspath('test_render.png')

html_content = """<!DOCTYPE html>
<html>
<head>
<style>
body { background: white; margin: 0; padding: 40px; font-family: Arial, sans-serif; }
.box { width: 200px; height: 100px; border: 2px solid black; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; }
</style>
</head>
<body>
<div class="box">Test Box</div>
</body>
</html>"""

with open(test_html, 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
file_url = 'file:///' + test_html.replace('\\', '/')
cmd = [
    edge_path,
    '--headless',
    '--disable-gpu',
    f'--screenshot={test_png}',
    '--window-size=1200,800',
    '--hide-scrollbars',
    file_url
]
subprocess.run(cmd, capture_output=True, timeout=10)
print('PNG exists:', os.path.exists(test_png))
if os.path.exists(test_png):
    print('Size:', os.path.getsize(test_png))
    os.remove(test_png)
if os.path.exists(test_html):
    os.remove(test_html)
