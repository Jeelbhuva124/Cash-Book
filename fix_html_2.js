const fs = require('fs');
let html = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');

// Replace the div wrappers with p wrappers
html = html.replace(/<div style="text-align: center; margin-bottom: 20px; clear: both;"><img src="data:image([^>]+)style="([^"]*)" \/><\/div>/g, '<p style="text-align: center; margin-bottom: 20px; clear: both;"><img src="data:image$1style="$2" /></p>');

// Ensure h3 gets a clear: both just to be absolutely sure!
html = html.replace(/<h3 style="margin-top: 30px;">/g, '<h3 style="margin-top: 30px; clear: both; display: block; width: 100%;">');

fs.writeFileSync('Cash_Book_Project_Report.html', html, 'utf8');
console.log('Fixed div to p and added clear to h3');
