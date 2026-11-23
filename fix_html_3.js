const fs = require('fs');
let html = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');

// Remove fixed height from diagram placeholders to prevent flex overflow from bleeding upwards!
html = html.replace(/<div class="diagram-placeholder" style="height: \d+px;">/g, '<div class="diagram-placeholder" style="height: auto;">');

fs.writeFileSync('Cash_Book_Project_Report.html', html, 'utf8');
console.log('Fixed placeholder heights!');
