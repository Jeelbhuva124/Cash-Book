import re
with open(r'C:\Users\Dell\.gemini\antigravity-ide\brain\ac06ee80-f24b-4b37-8990-bf978ed27ec7\.system_generated\steps\150\content.md', 'r', encoding='utf-8') as f:
    text = f.read()
m = re.search(r'<div class="relative inline-flex h-56 w-56.*?</div></div>', text, re.DOTALL)
if m:
    print(m.group(0))
else:
    print("Not found")
