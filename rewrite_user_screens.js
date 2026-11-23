const fs = require('fs');

const screens = [
    "Landing Page (Index)",
    "User Login",
    "User Register",
    "Dashboard (Home)",
    "User Cashbooks",
    "Transactions Page",
    "Add Transaction Popup",
    "Party Ledger",
    "EMI & Subs",
    "Receipts Vault",
    "Reminders",
    "Payment Mode",
    "Invitations",
    "Reports",
    "History",
    "Profile",
    "Active Sessions",
    "Preferences"
];

let html = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');

const uiClientSideRegex = /<div class="sub-title text-red"[^>]*>.*- User side:<\/div>[\s\S]*/;

if (!uiClientSideRegex.test(html)) {
    console.error("Could not find User side section");
    process.exit(1);
}

let newHtml = '<div class="sub-title text-red" style="font-size: 22px; color: red;">▪- User side:</div>\n\n';

for (let i = 0; i < screens.length; i += 2) {
    if (i !== 0) {
        newHtml += '</div>\n<div class="page">\n';
    }
    
    newHtml += '    <h3 style="margin-top: 30px;">' + screens[i] + '</h3>\n';
    newHtml += '    <div class="diagram-placeholder" style="height: 350px;"></div>\n\n';
    
    if (i + 1 < screens.length) {
        newHtml += '    <h3 style="margin-top: 30px;">' + screens[i + 1] + '</h3>\n';
        newHtml += '    <div class="diagram-placeholder" style="height: 350px;"></div>\n\n';
    }
}

newHtml += '</div>\n</body>\n</html>';

html = html.replace(uiClientSideRegex, newHtml);
fs.writeFileSync('Cash_Book_Project_Report.html', html);
console.log('Replaced User Interface section successfully.');
