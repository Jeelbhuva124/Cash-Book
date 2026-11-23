const fs = require('fs');

let html = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');

const loginRegex = /<h3[^>]*>User Login<\/h3>\s*<div class="diagram-placeholder"[^>]*>[\s\S]*?<\/div>/i;
const registerRegex = /<h3[^>]*>User Register<\/h3>\s*<div class="diagram-placeholder"[^>]*>[\s\S]*?<\/div>/i;
const landingRegex = /<h3[^>]*>Landing Page \(Index\)<\/h3>\s*<div class="diagram-placeholder"[^>]*>[\s\S]*?<\/div>/i;

const loginMatch = html.match(loginRegex);
const registerMatch = html.match(registerRegex);
const landingMatch = html.match(landingRegex);

if (loginMatch && registerMatch && landingMatch) {
    // Remove them from current position
    html = html.replace(loginRegex, '');
    html = html.replace(registerRegex, '');
    html = html.replace(landingRegex, '<!-- INSERT_HERE -->');
    
    // Insert them in new order: Landing -> Login -> Register
    const newOrder = landingMatch[0] + '\n\n' + loginMatch[0] + '\n\n' + registerMatch[0];
    html = html.replace('<!-- INSERT_HERE -->', newOrder);
    
    fs.writeFileSync('Cash_Book_Project_Report.html', html);
    console.log('Reordered successfully');
} else {
    console.log('Could not find all blocks');
}
