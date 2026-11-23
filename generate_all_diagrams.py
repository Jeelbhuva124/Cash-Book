import os
import shutil
import subprocess
from PIL import Image, ImageChops

DIAGRAMS_DIR = os.path.abspath(r'd:\Cash-Book\diagrams')
DOCS_DIAGRAMS_DIR = os.path.abspath(r'd:\Cash-Book\docs\diagrams')
os.makedirs(DIAGRAMS_DIR, exist_ok=True)
os.makedirs(DOCS_DIAGRAMS_DIR, exist_ok=True)

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

def get_svg_wrapper(width, height, content):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
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
  .node-text {{
    font-size: 13.5px;
    font-weight: 500;
    text-anchor: middle;
    dominant-baseline: central;
  }}
  .pk {{
    text-decoration: underline;
    font-weight: 600;
  }}
</style>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
  </marker>
</defs>
<rect width="100%" height="100%" fill="#ffffff" />
{content}
</svg>'''

# 1. Admin Process Flow Diagram
def build_admin_flowchart():
    w, h = 940, 980
    content = '''
  <!-- Start -->
  <rect class="box" x="420" y="30" width="120" height="42" rx="21" ry="21"/>
  <text class="node-text" x="480" y="51" font-size="14.5" font-weight="bold">Start</text>
  
  <!-- Line Start to Have an Account -->
  <line class="line" x1="480" y1="72" x2="480" y2="120" marker-end="url(#arrow)"/>
  
  <!-- Have an Account ? -->
  <rect class="box" x="380" y="120" width="200" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="143">Have an Account ?</text>
  
  <!-- Branch No (to Left) -->
  <path class="line" d="M 380,143 L 210,143 L 210,195" marker-end="url(#arrow)"/>
  <text class="label" x="285" y="133" text-anchor="middle">No</text>
  
  <!-- Signup -->
  <rect class="box" x="145" y="195" width="130" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="217">Signup</text>
  
  <line class="line" x1="210" y1="239" x2="210" y2="280" marker-end="url(#arrow)"/>
  
  <!-- Fill Information -->
  <rect class="box" x="125" y="280" width="170" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="302">Fill Information</text>
  
  <line class="line" x1="210" y1="324" x2="210" y2="365" marker-end="url(#arrow)"/>
  
  <!-- Submit -->
  <rect class="box" x="145" y="365" width="130" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="387">Submit</text>
  
  <!-- From Submit directly into Left side of Login ? -->
  <path class="line" d="M 210,409 L 210,503 L 405,503" marker-end="url(#arrow)"/>
  
  <!-- Branch Yes (Straight down) -->
  <line class="line" x1="480" y1="166" x2="480" y2="480" marker-end="url(#arrow)"/>
  <text class="label" x="498" y="240">Yes</text>
  
  <!-- Login ? -->
  <rect class="box" x="405" y="480" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="503">Login ?</text>
  
  <!-- Line Login to Authorized -->
  <line class="line" x1="480" y1="526" x2="480" y2="570" marker-end="url(#arrow)"/>
  
  <!-- Authorized ? Diamond -->
  <polygon class="box" points="480,570 570,615 480,660 390,615"/>
  <text class="node-text" x="480" y="615">Authorized ?</text>
  
  <!-- Authorized No loopback -->
  <path class="line" d="M 570,615 L 635,615 L 635,503 L 555,503" marker-end="url(#arrow)"/>
  <text class="label" x="600" y="605" text-anchor="middle">No</text>
  
  <!-- Authorized Yes down -->
  <line class="line" x1="480" y1="660" x2="480" y2="710" marker-end="url(#arrow)"/>
  <text class="label" x="498" y="685">Yes</text>
  
  <!-- Logged in into System -->
  <rect class="box" x="380" y="710" width="200" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="733">Logged in into System</text>
  
  <!-- Branch to 5 Modules -->
  <line class="line" x1="480" y1="756" x2="480" y2="785"/>
  <line class="line" x1="110" y1="785" x2="850" y2="785"/>
  
  <!-- Drop arrows -->
  <line class="line" x1="110" y1="785" x2="110" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="295" y1="785" x2="295" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="480" y1="785" x2="480" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="665" y1="785" x2="665" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="850" y1="785" x2="850" y2="815" marker-end="url(#arrow)"/>
  
  <!-- 5 Boxes -->
  <rect class="box" x="35" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="110" y="838">Manage Users</text>
  
  <rect class="box" x="220" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="295" y="838">Manage Cashbooks</text>
  
  <rect class="box" x="405" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="838">System Analytics</text>
  
  <rect class="box" x="590" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="665" y="838">Audit Logs</text>
  
  <rect class="box" x="775" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="850" y="838">Platform Settings</text>
  
  <!-- Bottom lines to bus -->
  <line class="line" x1="110" y1="861" x2="110" y2="890"/>
  <line class="line" x1="295" y1="861" x2="295" y2="890"/>
  <line class="line" x1="480" y1="861" x2="480" y2="890"/>
  <line class="line" x1="665" y1="861" x2="665" y2="890"/>
  <line class="line" x1="850" y1="861" x2="850" y2="890"/>
  <line class="line" x1="110" y1="890" x2="850" y2="890"/>
  
  <!-- Final End arrow -->
  <line class="line" x1="480" y1="890" x2="480" y2="920" marker-end="url(#arrow)"/>
  
  <!-- End -->
  <rect class="box" x="425" y="920" width="110" height="42" rx="21" ry="21"/>
  <text class="node-text" x="480" y="941" font-size="14.5" font-weight="bold">End</text>
'''
    return get_svg_wrapper(w, h, content)

# 2. User Process Flow Diagram
def build_user_flowchart():
    w, h = 940, 980
    content = '''
  <!-- Start -->
  <rect class="box" x="420" y="30" width="120" height="42" rx="21" ry="21"/>
  <text class="node-text" x="480" y="51" font-size="14.5" font-weight="bold">Start</text>
  
  <!-- Line Start to Have an Account -->
  <line class="line" x1="480" y1="72" x2="480" y2="120" marker-end="url(#arrow)"/>
  
  <!-- Have an Account ? -->
  <rect class="box" x="380" y="120" width="200" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="143">Have an Account ?</text>
  
  <!-- Branch No (to Left) -->
  <path class="line" d="M 380,143 L 210,143 L 210,195" marker-end="url(#arrow)"/>
  <text class="label" x="285" y="133" text-anchor="middle">No</text>
  
  <!-- Signup -->
  <rect class="box" x="145" y="195" width="130" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="217">Signup</text>
  
  <line class="line" x1="210" y1="239" x2="210" y2="280" marker-end="url(#arrow)"/>
  
  <!-- Fill Information -->
  <rect class="box" x="125" y="280" width="170" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="302">Fill Information</text>
  
  <line class="line" x1="210" y1="324" x2="210" y2="365" marker-end="url(#arrow)"/>
  
  <!-- Submit -->
  <rect class="box" x="145" y="365" width="130" height="44" rx="6" ry="6"/>
  <text class="node-text" x="210" y="387">Submit</text>
  
  <!-- From Submit directly into Left side of Login ? -->
  <path class="line" d="M 210,409 L 210,503 L 405,503" marker-end="url(#arrow)"/>
  
  <!-- Branch Yes (Straight down) -->
  <line class="line" x1="480" y1="166" x2="480" y2="480" marker-end="url(#arrow)"/>
  <text class="label" x="498" y="240">Yes</text>
  
  <!-- Login ? -->
  <rect class="box" x="405" y="480" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="503">Login ?</text>
  
  <!-- Line Login to Authorized -->
  <line class="line" x1="480" y1="526" x2="480" y2="570" marker-end="url(#arrow)"/>
  
  <!-- Authorized ? Diamond -->
  <polygon class="box" points="480,570 570,615 480,660 390,615"/>
  <text class="node-text" x="480" y="615">Authorized ?</text>
  
  <!-- Authorized No loopback -->
  <path class="line" d="M 570,615 L 635,615 L 635,503 L 555,503" marker-end="url(#arrow)"/>
  <text class="label" x="600" y="605" text-anchor="middle">No</text>
  
  <!-- Authorized Yes down -->
  <line class="line" x1="480" y1="660" x2="480" y2="710" marker-end="url(#arrow)"/>
  <text class="label" x="498" y="685">Yes</text>
  
  <!-- Logged in into System -->
  <rect class="box" x="380" y="710" width="200" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="733">Logged in into System</text>
  
  <!-- Branch to 5 Modules -->
  <line class="line" x1="480" y1="756" x2="480" y2="785"/>
  <line class="line" x1="110" y1="785" x2="850" y2="785"/>
  
  <!-- Drop arrows -->
  <line class="line" x1="110" y1="785" x2="110" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="295" y1="785" x2="295" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="480" y1="785" x2="480" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="665" y1="785" x2="665" y2="815" marker-end="url(#arrow)"/>
  <line class="line" x1="850" y1="785" x2="850" y2="815" marker-end="url(#arrow)"/>
  
  <!-- 5 Boxes -->
  <rect class="box" x="35" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="110" y="838">Manage Cashbooks</text>
  
  <rect class="box" x="215" y="815" width="160" height="46" rx="6" ry="6"/>
  <text class="node-text" x="295" y="838">Add / Edit Transaction</text>
  
  <rect class="box" x="405" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="480" y="838">Party Ledger (Khata)</text>
  
  <rect class="box" x="590" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="665" y="838">Receipts Vault</text>
  
  <rect class="box" x="775" y="815" width="150" height="46" rx="6" ry="6"/>
  <text class="node-text" x="850" y="838">Reports &amp; Analytics</text>
  
  <!-- Bottom lines to bus -->
  <line class="line" x1="110" y1="861" x2="110" y2="890"/>
  <line class="line" x1="295" y1="861" x2="295" y2="890"/>
  <line class="line" x1="480" y1="861" x2="480" y2="890"/>
  <line class="line" x1="665" y1="861" x2="665" y2="890"/>
  <line class="line" x1="850" y1="861" x2="850" y2="890"/>
  <line class="line" x1="110" y1="890" x2="850" y2="890"/>
  
  <!-- Final End arrow -->
  <line class="line" x1="480" y1="890" x2="480" y2="920" marker-end="url(#arrow)"/>
  
  <!-- End -->
  <rect class="box" x="425" y="920" width="110" height="42" rx="21" ry="21"/>
  <text class="node-text" x="480" y="941" font-size="14.5" font-weight="bold">End</text>
'''
    return get_svg_wrapper(w, h, content)

# 3. 0 Level DFD (Context Diagram)
def build_dfd_level_0():
    w, h = 980, 860
    content = '''
  <!-- Central System Circle -->
  <circle class="box" cx="490" cy="420" r="135"/>
  <text class="node-text" x="490" y="398" font-size="16" font-weight="bold">Cash-Book –</text>
  <text class="node-text" x="490" y="423" font-size="14.5" font-weight="600">Smart Finance &amp; Digital Ledger</text>
  <text class="node-text" x="490" y="446" font-size="14">(System)</text>
  
  <!-- Admin Entity -->
  <rect class="box" x="80" y="150" width="140" height="70"/>
  <text class="node-text" x="150" y="185" font-size="16" font-weight="bold">Admin</text>
  
  <!-- User Entity -->
  <rect class="box" x="760" y="600" width="140" height="70"/>
  <text class="node-text" x="830" y="635" font-size="16" font-weight="bold">User</text>
  
  <!-- Admin Flows -->
  <!-- 1. Admin to System top -->
  <path class="line" d="M 220,170 L 490,170 L 490,285" marker-end="url(#arrow)"/>
  <text class="label" x="355" y="160" text-anchor="middle">Manage Users &amp; Cashbooks</text>
  
  <!-- 2. System to Admin upper -->
  <path class="line" d="M 360,370 L 250,370 L 250,205 L 220,205" marker-end="url(#arrow)"/>
  <text class="label" x="250" y="360" text-anchor="middle">System Telemetry &amp; Stats</text>
  
  <!-- 3. Admin to System lower -->
  <path class="line" d="M 110,220 L 110,430 L 355,430" marker-end="url(#arrow)"/>
  <text class="label" x="230" y="420" text-anchor="middle">Platform Configurations</text>
  
  <!-- 4. System to Admin lower -->
  <path class="line" d="M 375,480 L 160,480 L 160,220" marker-end="url(#arrow)"/>
  <text class="label" x="255" y="470" text-anchor="middle">Audit Logs &amp; Activity Reports</text>
  
  <!-- User Flows -->
  <!-- 1. System to User top -->
  <path class="line" d="M 610,360 L 830,360 L 830,600" marker-end="url(#arrow)"/>
  <text class="label" x="725" y="350" text-anchor="middle">Financial Summary &amp; Analytics PDF</text>
  
  <!-- 2. User to System mid-high (Connected cleanly from User top edge) -->
  <path class="line" d="M 785,600 L 785,520 L 620,520 L 620,460" marker-end="url(#arrow)"/>
  <text class="label" x="705" y="510" text-anchor="middle">Record Cash-In / Cash-Out</text>
  
  <!-- 3. User to System mid -->
  <path class="line" d="M 760,615 L 575,615 L 575,525" marker-end="url(#arrow)"/>
  <text class="label" x="675" y="605" text-anchor="middle">Register / Login Details</text>
  
  <!-- 4. User to System mid-low -->
  <path class="line" d="M 760,650 L 535,650 L 535,550" marker-end="url(#arrow)"/>
  <text class="label" x="655" y="640" text-anchor="middle">Party Ledger (Khata) Entries</text>
  
  <!-- 5. User to System bottom -->
  <path class="line" d="M 830,670 L 830,750 L 490,750 L 490,555" marker-end="url(#arrow)"/>
  <text class="label" x="650" y="740" text-anchor="middle">Upload Receipts &amp; Bill Attachments</text>
'''
    return get_svg_wrapper(w, h, content)

# 4. DFD Level 1 Admin Diagram
def build_dfd_level_1_admin():
    w, h = 980, 960
    r = 52
    cx = 520
    x_in = cx - r
    x_out = cx + r
    content = f'''
  <!-- Admin Entity -->
  <rect class="box" x="60" y="100" width="130" height="70"/>
  <text class="node-text" x="125" y="135" font-size="16" font-weight="bold">Admin</text>
  
  <!-- Long trunk line down from Admin -->
  <line class="line" x1="125" y1="170" x2="125" y2="820"/>
  
  <!-- Process 1.0 Login -->
  <line class="line" x1="190" y1="135" x2="{x_in}" y2="135" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="125" text-anchor="middle">Pass Login Details</text>
  
  <circle class="box" cx="{cx}" cy="135" r="{r}"/>
  <text class="node-text" x="{cx}" y="124" font-size="14" font-weight="bold">1.0</text>
  <text class="node-text" x="{cx}" y="145" font-size="13">Login</text>
  
  <line class="line" x1="{x_out}" y1="135" x2="760" y2="135" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="125" text-anchor="middle">Verify Details</text>
  
  <rect class="box" x="760" y="113" width="150" height="44"/>
  <text class="node-text" x="835" y="135">admins</text>
  
  <!-- Process 2.0 New Register -->
  <path class="line" d="M 125,270 L {x_in},270" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="260" text-anchor="middle">Pass Admin Details</text>
  
  <circle class="box" cx="{cx}" cy="270" r="{r}"/>
  <text class="node-text" x="{cx}" y="258" font-size="13.5" font-weight="bold">2.0</text>
  <text class="node-text" x="{cx}" y="278" font-size="12">New Register</text>
  
  <line class="line" x1="{x_out}" y1="270" x2="760" y2="270" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="260" text-anchor="middle">Store Details</text>
  
  <rect class="box" x="760" y="248" width="150" height="44"/>
  <text class="node-text" x="835" y="270">admins</text>
  
  <!-- Process 3.0 Manage Users -->
  <path class="line" d="M 125,405 L {x_in},405" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="395" text-anchor="middle">Pass User Action Details</text>
  
  <circle class="box" cx="{cx}" cy="405" r="{r}"/>
  <text class="node-text" x="{cx}" y="393" font-size="13.5" font-weight="bold">3.0</text>
  <text class="node-text" x="{cx}" y="413" font-size="12">Manage Users</text>
  
  <line class="line" x1="{x_out}" y1="405" x2="760" y2="405" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="395" text-anchor="middle">Store / Update Details</text>
  
  <rect class="box" x="760" y="383" width="150" height="44"/>
  <text class="node-text" x="835" y="405">Users</text>
  
  <!-- Process 4.0 Manage Cashbooks -->
  <path class="line" d="M 125,540 L {x_in},540" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="530" text-anchor="middle">Pass Cashbook Controls</text>
  
  <circle class="box" cx="{cx}" cy="540" r="{r}"/>
  <text class="node-text" x="{cx}" y="528" font-size="13.5" font-weight="bold">4.0</text>
  <text class="node-text" x="{cx}" y="548" font-size="11.5">Manage Books</text>
  
  <line class="line" x1="{x_out}" y1="540" x2="760" y2="540" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="530" text-anchor="middle">Store Details</text>
  
  <rect class="box" x="760" y="518" width="150" height="44"/>
  <text class="node-text" x="835" y="540">Cashbooks</text>
  
  <!-- Process 5.0 Audit & Transactions -->
  <path class="line" d="M 125,680 L {x_in},680" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="670" text-anchor="middle">Audit Ledger Records</text>
  
  <circle class="box" cx="{cx}" cy="680" r="{r}"/>
  <text class="node-text" x="{cx}" y="668" font-size="13.5" font-weight="bold">5.0</text>
  <text class="node-text" x="{cx}" y="688" font-size="12">Audit Trans</text>
  
  <line class="line" x1="{x_out}" y1="680" x2="760" y2="680" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="670" text-anchor="middle">Audit &amp; Store</text>
  
  <rect class="box" x="760" y="658" width="150" height="44"/>
  <text class="node-text" x="835" y="680">Transactions</text>
  
  <!-- Process 6.0 Platform Settings -->
  <path class="line" d="M 125,820 L {x_in},820" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="810" text-anchor="middle">Update Platform Config</text>
  
  <circle class="box" cx="{cx}" cy="820" r="{r}"/>
  <text class="node-text" x="{cx}" y="808" font-size="13.5" font-weight="bold">6.0</text>
  <text class="node-text" x="{cx}" y="828" font-size="11.5">Settings Config</text>
  
  <line class="line" x1="{x_out}" y1="820" x2="760" y2="820" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="810" text-anchor="middle">Store Details</text>
  
  <rect class="box" x="760" y="798" width="150" height="44"/>
  <text class="node-text" x="835" y="820">ActivityLog</text>
'''
    return get_svg_wrapper(w, h, content)

# 5. DFD Level 1 User Diagram
def build_dfd_level_1_user():
    w, h = 980, 1020
    r = 52
    cx = 520
    x_in = cx - r
    x_out = cx + r
    content = f'''
  <!-- Users Entity -->
  <rect class="box" x="60" y="80" width="130" height="70"/>
  <text class="node-text" x="125" y="115" font-size="16" font-weight="bold">Users</text>
  
  <!-- Long trunk line down from Users -->
  <line class="line" x1="125" y1="150" x2="125" y2="920"/>
  
  <!-- 1.0 Login -->
  <line class="line" x1="190" y1="115" x2="{x_in}" y2="115" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="105" text-anchor="middle">Pass Login Details</text>
  
  <circle class="box" cx="{cx}" cy="115" r="{r}"/>
  <text class="node-text" x="{cx}" y="104" font-size="14" font-weight="bold">1.0</text>
  <text class="node-text" x="{cx}" y="125" font-size="13">Login</text>
  
  <line class="line" x1="{x_out}" y1="115" x2="760" y2="115" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="105" text-anchor="middle">Verify Details</text>
  
  <rect class="box" x="760" y="93" width="150" height="44"/>
  <text class="node-text" x="835" y="115">user</text>
  
  <!-- 2.0 New Register -->
  <path class="line" d="M 125,245 L {x_in},245" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="235" text-anchor="middle">Pass User Details</text>
  
  <circle class="box" cx="{cx}" cy="245" r="{r}"/>
  <text class="node-text" x="{cx}" y="234" font-size="13.5" font-weight="bold">2.0</text>
  <text class="node-text" x="{cx}" y="254" font-size="12">New Register</text>
  
  <line class="line" x1="{x_out}" y1="245" x2="760" y2="245" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="235" text-anchor="middle">Store Details</text>
  
  <rect class="box" x="760" y="223" width="150" height="44"/>
  <text class="node-text" x="835" y="245">user</text>
  
  <!-- 3.0 Manage Cashbooks -->
  <path class="line" d="M 125,375 L {x_in},375" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="365" text-anchor="middle">Create / Select Cashbook</text>
  
  <circle class="box" cx="{cx}" cy="375" r="{r}"/>
  <text class="node-text" x="{cx}" y="364" font-size="13.5" font-weight="bold">3.0</text>
  <text class="node-text" x="{cx}" y="384" font-size="11.5">Manage Books</text>
  
  <line class="line" x1="{x_out}" y1="375" x2="760" y2="375" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="365" text-anchor="middle">Store / Fetch Details</text>
  
  <rect class="box" x="760" y="353" width="150" height="44"/>
  <text class="node-text" x="835" y="375">Cashbooks</text>
  
  <!-- 4.0 Record Transactions -->
  <path class="line" d="M 125,510 L {x_in},510" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="500" text-anchor="middle">Add Cash-In / Cash-Out</text>
  
  <circle class="box" cx="{cx}" cy="510" r="{r}"/>
  <text class="node-text" x="{cx}" y="499" font-size="13.5" font-weight="bold">4.0</text>
  <text class="node-text" x="{cx}" y="519" font-size="12">Transactions</text>
  
  <line class="line" x1="{x_out}" y1="510" x2="760" y2="510" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="500" text-anchor="middle">Store Transaction</text>
  
  <rect class="box" x="760" y="488" width="150" height="44"/>
  <text class="node-text" x="835" y="510">Transactions</text>
  
  <!-- 5.0 Party Ledger -->
  <path class="line" d="M 125,650 L {x_in},650" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="640" text-anchor="middle">Add / Update Party Debt</text>
  
  <circle class="box" cx="{cx}" cy="650" r="{r}"/>
  <text class="node-text" x="{cx}" y="639" font-size="13.5" font-weight="bold">5.0</text>
  <text class="node-text" x="{cx}" y="659" font-size="12">Party Ledger</text>
  
  <line class="line" x1="{x_out}" y1="650" x2="760" y2="650" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="640" text-anchor="middle">Store Party Records</text>
  
  <rect class="box" x="760" y="628" width="150" height="44"/>
  <text class="node-text" x="835" y="650">PartyLedger</text>
  
  <!-- 6.0 Receipts Vault -->
  <path class="line" d="M 125,785 L {x_in},785" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="775" text-anchor="middle">Upload Bill / Receipt</text>
  
  <circle class="box" cx="{cx}" cy="785" r="{r}"/>
  <text class="node-text" x="{cx}" y="774" font-size="13.5" font-weight="bold">6.0</text>
  <text class="node-text" x="{cx}" y="794" font-size="11.5">Receipts Vault</text>
  
  <line class="line" x1="{x_out}" y1="785" x2="760" y2="785" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="775" text-anchor="middle">Store Attachment</text>
  
  <rect class="box" x="760" y="763" width="150" height="44"/>
  <text class="node-text" x="835" y="785">Receipts</text>
  
  <!-- 7.0 Financial Reports -->
  <path class="line" d="M 125,920 L {x_in},920" marker-end="url(#arrow)"/>
  <text class="label" x="325" y="910" text-anchor="middle">Request Summary / PDF</text>
  
  <circle class="box" cx="{cx}" cy="920" r="{r}"/>
  <text class="node-text" x="{cx}" y="909" font-size="13.5" font-weight="bold">7.0</text>
  <text class="node-text" x="{cx}" y="929" font-size="12">Reports</text>
  
  <line class="line" x1="{x_out}" y1="920" x2="760" y2="920" marker-end="url(#arrow)"/>
  <text class="label" x="665" y="910" text-anchor="middle">Generate Summary</text>
  
  <rect class="box" x="760" y="898" width="150" height="44"/>
  <text class="node-text" x="835" y="920">Reports</text>
'''
    return get_svg_wrapper(w, h, content)

# 6. ER Diagram
def build_er_diagram():
    w, h = 1000, 950
    content = '''
  <!-- RELATIONSHIPS (Diamonds) -->
  <!-- Admin to User: Manages -->
  <polygon class="box" points="330,165 375,195 330,225 285,195"/>
  <text class="node-text" x="330" y="195" font-size="12">Manages</text>
  
  <!-- Admin to Cashbook: Monitors -->
  <polygon class="box" points="670,165 715,195 670,225 625,195"/>
  <text class="node-text" x="670" y="195" font-size="12">Monitors</text>
  
  <!-- User to Cashbook: Creates -->
  <polygon class="box" points="500,285 545,315 500,345 455,315"/>
  <text class="node-text" x="500" y="315" font-size="12">Creates</text>
  
  <!-- User to PartyLedger: Maintains -->
  <polygon class="box" points="200,485 245,515 200,545 155,515"/>
  <text class="node-text" x="200" y="515" font-size="12">Maintains</text>
  
  <!-- Cashbook to Transaction: Contains -->
  <polygon class="box" points="670,410 715,440 670,470 625,440"/>
  <text class="node-text" x="670" y="440" font-size="12">Contains</text>
  
  <!-- Transaction to Receipt: Attaches -->
  <polygon class="box" points="500,635 545,665 500,695 455,665"/>
  <text class="node-text" x="500" y="665" font-size="12">Attaches</text>
  
  <!-- Transaction to Category: Classified Under -->
  <polygon class="box" points="670,600 725,630 670,660 615,630"/>
  <text class="node-text" x="670" y="630" font-size="11">Classified</text>
  
  <!-- CONNECTING LINES BETWEEN ENTITIES & RELATIONSHIPS -->
  <!-- Admin to Manages & Monitors -->
  <line class="line" x1="450" y1="120" x2="375" y2="195"/>
  <line class="line" x1="550" y1="120" x2="625" y2="195"/>
  
  <!-- Manages to User -->
  <line class="line" x1="330" y1="225" x2="230" y2="295"/>
  
  <!-- Monitors to Cashbook -->
  <line class="line" x1="670" y1="225" x2="770" y2="295"/>
  
  <!-- User to Creates to Cashbook -->
  <line class="line" x1="260" y1="315" x2="455" y2="315"/>
  <line class="line" x1="545" y1="315" x2="720" y2="315"/>
  
  <!-- User to Maintains to PartyLedger -->
  <line class="line" x1="200" y1="340" x2="200" y2="485"/>
  <line class="line" x1="200" y1="545" x2="200" y2="695"/>
  
  <!-- Cashbook to Contains to Transaction -->
  <line class="line" x1="750" y1="340" x2="705" y2="415"/>
  <line class="line" x1="635" y1="455" x2="560" y2="500"/>
  
  <!-- Transaction to Attaches to Receipt -->
  <line class="line" x1="500" y1="545" x2="500" y2="635"/>
  <line class="line" x1="500" y1="695" x2="500" y2="760"/>
  
  <!-- Transaction to Classified to Category -->
  <line class="line" x1="560" y1="540" x2="620" y2="615"/>
  <line class="line" x1="710" y1="645" x2="750" y2="695"/>
  
  <!-- ENTITIES (Rectangles) -->
  <!-- 1. Admin -->
  <rect class="box" x="435" y="95" width="130" height="48"/>
  <text class="node-text" x="500" y="119" font-size="15" font-weight="bold">Admin</text>
  
  <!-- 2. User -->
  <rect class="box" x="140" y="295" width="120" height="48"/>
  <text class="node-text" x="200" y="319" font-size="15" font-weight="bold">User</text>
  
  <!-- 3. Cashbook -->
  <rect class="box" x="720" y="295" width="140" height="48"/>
  <text class="node-text" x="790" y="319" font-size="15" font-weight="bold">Cashbook</text>
  
  <!-- 4. Transaction -->
  <rect class="box" x="430" y="495" width="140" height="48"/>
  <text class="node-text" x="500" y="519" font-size="15" font-weight="bold">Transaction</text>
  
  <!-- 5. PartyLedger -->
  <rect class="box" x="135" y="695" width="130" height="48"/>
  <text class="node-text" x="200" y="719" font-size="15" font-weight="bold">PartyLedger</text>
  
  <!-- 6. Receipt -->
  <rect class="box" x="440" y="760" width="120" height="48"/>
  <text class="node-text" x="500" y="784" font-size="15" font-weight="bold">Receipt</text>
  
  <!-- 7. Category -->
  <rect class="box" x="725" y="695" width="130" height="48"/>
  <text class="node-text" x="790" y="719" font-size="15" font-weight="bold">Category</text>
  
  <!-- ATTRIBUTES (Ovals / Ellipses) -->
  <!-- Admin Attributes -->
  <line class="line" x1="460" y1="95" x2="395" y2="60"/>
  <ellipse class="box" cx="380" cy="52" rx="35" ry="19"/>
  <text class="node-text pk" x="380" y="52" font-size="12">aid</text>
  
  <line class="line" x1="500" y1="95" x2="500" y2="52"/>
  <ellipse class="box" cx="500" cy="38" rx="40" ry="19"/>
  <text class="node-text" x="500" y="38" font-size="12">email</text>
  
  <line class="line" x1="540" y1="95" x2="605" y2="60"/>
  <ellipse class="box" cx="620" cy="52" rx="35" ry="19"/>
  <text class="node-text" x="620" y="52" font-size="12">role</text>
  
  <!-- User Attributes -->
  <line class="line" x1="140" y1="300" x2="75" y2="250"/>
  <ellipse class="box" cx="65" cy="240" rx="35" ry="19"/>
  <text class="node-text pk" x="65" y="240" font-size="12">uid</text>
  
  <line class="line" x1="160" y1="295" x2="135" y2="230"/>
  <ellipse class="box" cx="130" cy="215" rx="42" ry="19"/>
  <text class="node-text" x="130" y="215" font-size="12">username</text>
  
  <line class="line" x1="140" y1="320" x2="65" y2="320"/>
  <ellipse class="box" cx="60" cy="320" rx="38" ry="19"/>
  <text class="node-text" x="60" y="320" font-size="12">email</text>
  
  <line class="line" x1="140" y1="335" x2="75" y2="390"/>
  <ellipse class="box" cx="65" cy="400" rx="36" ry="19"/>
  <text class="node-text" x="65" y="400" font-size="12">phone</text>
  
  <!-- Cashbook Attributes -->
  <line class="line" x1="810" y1="295" x2="810" y2="235"/>
  <ellipse class="box" cx="810" cy="220" rx="35" ry="19"/>
  <text class="node-text pk" x="810" y="220" font-size="12">cid</text>
  
  <line class="line" x1="840" y1="295" x2="905" y2="240"/>
  <ellipse class="box" cx="920" cy="225" rx="55" ry="19"/>
  <text class="node-text" x="920" y="225" font-size="12">cashbook_name</text>
  
  <line class="line" x1="860" y1="310" x2="920" y2="290"/>
  <ellipse class="box" cx="940" cy="285" rx="40" ry="19"/>
  <text class="node-text" x="940" y="285" font-size="12">balance</text>
  
  <line class="line" x1="860" y1="330" x2="920" y2="350"/>
  <ellipse class="box" cx="940" cy="355" rx="42" ry="19"/>
  <text class="node-text" x="940" y="355" font-size="12">currency</text>
  
  <!-- Transaction Attributes -->
  <line class="line" x1="430" y1="505" x2="370" y2="465"/>
  <ellipse class="box" cx="355" cy="455" rx="35" ry="19"/>
  <text class="node-text pk" x="355" y="455" font-size="12">tid</text>
  
  <line class="line" x1="430" y1="520" x2="365" y2="520"/>
  <ellipse class="box" cx="345" cy="520" rx="38" ry="19"/>
  <text class="node-text" x="345" y="520" font-size="12">amount</text>
  
  <line class="line" x1="430" y1="535" x2="370" y2="575"/>
  <ellipse class="box" cx="355" cy="585" rx="35" ry="19"/>
  <text class="node-text" x="355" y="585" font-size="12">type</text>
  
  <line class="line" x1="465" y1="545" x2="435" y2="600"/>
  <ellipse class="box" cx="425" cy="615" rx="35" ry="19"/>
  <text class="node-text" x="425" y="615" font-size="12">date</text>
  
  <!-- PartyLedger Attributes -->
  <line class="line" x1="135" y1="705" x2="80" y2="675"/>
  <ellipse class="box" cx="65" cy="665" rx="35" ry="19"/>
  <text class="node-text pk" x="65" y="665" font-size="12">pid</text>
  
  <line class="line" x1="135" y1="730" x2="80" y2="745"/>
  <ellipse class="box" cx="65" cy="750" rx="46" ry="19"/>
  <text class="node-text" x="65" y="750" font-size="12">party_name</text>
  
  <line class="line" x1="180" y1="745" x2="165" y2="815"/>
  <ellipse class="box" cx="160" cy="830" rx="48" ry="19"/>
  <text class="node-text" x="160" y="830" font-size="12">net_balance</text>
  
  <!-- Receipt Attributes -->
  <line class="line" x1="445" y1="808" x2="385" y2="850"/>
  <ellipse class="box" cx="370" cy="860" rx="35" ry="19"/>
  <text class="node-text pk" x="370" y="860" font-size="12">rid</text>
  
  <line class="line" x1="500" y1="808" x2="500" y2="855"/>
  <ellipse class="box" cx="500" cy="870" rx="42" ry="19"/>
  <text class="node-text" x="500" y="870" font-size="12">file_url</text>
  
  <line class="line" x1="555" y1="808" x2="615" y2="850"/>
  <ellipse class="box" cx="630" cy="860" rx="48" ry="19"/>
  <text class="node-text" x="630" y="860" font-size="12">upload_date</text>
  
  <!-- Category Attributes -->
  <line class="line" x1="855" y1="705" x2="910" y2="670"/>
  <ellipse class="box" cx="925" cy="660" rx="38" ry="19"/>
  <text class="node-text pk" x="925" y="660" font-size="12">cat_id</text>
  
  <line class="line" x1="855" y1="725" x2="910" y2="735"/>
  <ellipse class="box" cx="930" cy="740" rx="44" ry="19"/>
  <text class="node-text" x="930" y="740" font-size="12">cat_name</text>
  
  <line class="line" x1="810" y1="745" x2="825" y2="815"/>
  <ellipse class="box" cx="830" cy="830" rx="35" ry="19"/>
  <text class="node-text" x="830" y="830" font-size="12">type</text>
'''
    return get_svg_wrapper(w, h, content)

diagrams = [
    ("1_admin_process_flow_diagram", build_admin_flowchart()),
    ("2_user_process_flow_diagram", build_user_flowchart()),
    ("3_dfd_level_0_context_diagram", build_dfd_level_0()),
    ("4_dfd_level_1_admin_diagram", build_dfd_level_1_admin()),
    ("5_dfd_level_1_user_diagram", build_dfd_level_1_user()),
    ("6_er_diagram", build_er_diagram())
]

for name, svg_code in diagrams:
    svg_path = os.path.join(DIAGRAMS_DIR, f"{name}.svg")
    raw_png = os.path.join(DIAGRAMS_DIR, f"{name}_raw.png")
    final_png = os.path.join(DIAGRAMS_DIR, f"{name}.png")
    
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_code)
        
    # Render with msedge
    file_url = "file:///" + svg_path.replace("\\", "/")
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--screenshot={raw_png}",
        "--window-size=1200,1100",
        "--hide-scrollbars",
        file_url
    ]
    subprocess.run(cmd, capture_output=True, timeout=15)
    
    # Auto-crop to content with 30px white padding
    if os.path.exists(raw_png):
        im = Image.open(raw_png).convert("RGB")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        diff = ImageChops.difference(im, bg)
        bbox = diff.getbbox()
        if bbox:
            pad = 30
            crop_box = (
                max(0, bbox[0] - pad),
                max(0, bbox[1] - pad),
                min(im.size[0], bbox[2] + pad),
                min(im.size[1], bbox[3] + pad)
            )
            cropped = im.crop(crop_box)
            cropped.save(final_png, "PNG", dpi=(300, 300))
        else:
            im.save(final_png, "PNG")
        os.remove(raw_png)
        
        # Copy to docs/diagrams
        shutil.copy2(svg_path, os.path.join(DOCS_DIAGRAMS_DIR, f"{name}.svg"))
        shutil.copy2(final_png, os.path.join(DOCS_DIAGRAMS_DIR, f"{name}.png"))
        print(f"Generated {name}.png - Cropped size: {cropped.size}")
    else:
        print(f"Failed to generate {name}.png")

# Generate an HTML preview gallery in d:\Cash-Book\diagrams\index.html
html_gallery = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cash-Book Project Diagrams</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    margin: 0;
    padding: 30px;
  }
  .header {
    text-align: center;
    margin-bottom: 40px;
  }
  .header h1 {
    font-size: 28px;
    margin-bottom: 8px;
    color: #0f172a;
  }
  .header p {
    font-size: 16px;
    color: #64748b;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .card-header {
    padding: 16px 20px;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-header h2 {
    font-size: 18px;
    margin: 0;
    color: #1e293b;
  }
  .badge {
    font-size: 12px;
    font-weight: 600;
    background: #2563eb;
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .card-body {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    min-height: 400px;
  }
  .card-body img {
    max-width: 100%;
    height: auto;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }
  .card-footer {
    padding: 12px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    font-size: 13px;
    color: #64748b;
    display: flex;
    justify-content: space-between;
  }
  .card-footer a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }
  .card-footer a:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
  <div class="header">
    <h1>Cash-Book: Smart Finance &amp; Digital Ledger</h1>
    <p>Academic Project Documentation Diagrams (Exact Style as Sample VNSGU Report)</p>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-header">
        <h2>1. Admin Process Flow Diagram</h2>
        <span class="badge">Section 5</span>
      </div>
      <div class="card-body">
        <img src="1_admin_process_flow_diagram.png" alt="Admin Process Flow Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="1_admin_process_flow_diagram.png" download>Download PNG</a>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>2. User Process Flow Diagram</h2>
        <span class="badge">Section 5</span>
      </div>
      <div class="card-body">
        <img src="2_user_process_flow_diagram.png" alt="User Process Flow Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="2_user_process_flow_diagram.png" download>Download PNG</a>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>3. 0 Level DFD (Context Diagram)</h2>
        <span class="badge">Section 6</span>
      </div>
      <div class="card-body">
        <img src="3_dfd_level_0_context_diagram.png" alt="DFD Level 0 Context Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="3_dfd_level_0_context_diagram.png" download>Download PNG</a>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>4. 1st Level Admin Diagram (DFD Level 1)</h2>
        <span class="badge">Section 6</span>
      </div>
      <div class="card-body">
        <img src="4_dfd_level_1_admin_diagram.png" alt="DFD Level 1 Admin Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="4_dfd_level_1_admin_diagram.png" download>Download PNG</a>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>5. 1st Level User Diagram (DFD Level 1)</h2>
        <span class="badge">Section 6</span>
      </div>
      <div class="card-body">
        <img src="5_dfd_level_1_user_diagram.png" alt="DFD Level 1 User Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="5_dfd_level_1_user_diagram.png" download>Download PNG</a>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>6. ER Diagram (Chen Notation)</h2>
        <span class="badge">Section 7</span>
      </div>
      <div class="card-body">
        <img src="6_er_diagram.png" alt="ER Diagram">
      </div>
      <div class="card-footer">
        <span>Format: PNG &amp; SVG</span>
        <a href="6_er_diagram.png" download>Download PNG</a>
      </div>
    </div>
  </div>
</body>
</html>
"""

with open(os.path.join(DIAGRAMS_DIR, "index.html"), "w", encoding="utf-8") as f:
    f.write(html_gallery)

with open(os.path.join(DOCS_DIAGRAMS_DIR, "index.html"), "w", encoding="utf-8") as f:
    f.write(html_gallery)

print("HTML gallery preview created!")
