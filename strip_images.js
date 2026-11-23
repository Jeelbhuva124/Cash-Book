const fs = require('fs');
let c = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');
c = c.replace(/<img src="data:image\/png;base64,[^"]+"[^>]*>/g, '');
fs.writeFileSync('Cash_Book_Project_Report.html', c);
console.log('Stripped images from HTML');
